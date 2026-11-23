-- Step 2 schema foundation. Requires the wallet_kind labels from migration 202611230002.
-- Staging-targeted draft. No provider callback or reward posting is enabled by this migration.

alter table private.ledger_accounts
  drop constraint if exists ledger_account_currency;
alter table private.ledger_accounts
  add constraint ledger_account_currency check (
    (wallet_kind = 'cash_usd' and currency_code = 'USD')
    or (wallet_kind = 'game_credits' and currency_code in ('LLC','LC'))
    or (wallet_kind = 'earned_loot' and currency_code = 'EL')
    or (wallet_kind = 'loot_coins' and currency_code = 'LC')
  );

alter table private.ledger_accounts
  drop constraint if exists ledger_accounts_currency_scale_check;
alter table private.ledger_accounts
  add constraint ledger_accounts_currency_scale_check
  check (
    (wallet_kind = 'earned_loot' and currency_scale = 1000)
    or (wallet_kind = 'loot_coins' and currency_scale = 10000)
    or (wallet_kind in ('cash_usd','game_credits') and currency_scale in (1,10000))
  );

insert into private.ledger_accounts(
  owner_user_id,account_code,wallet_kind,currency_code,currency_scale,is_system
)
values
  (null,'platform_earned_loot_issuance','earned_loot','EL',1000,true),
  (null,'platform_loot_coin_issuance','loot_coins','LC',10000,true)
on conflict do nothing;

-- Extend the existing signup provisioning function without deleting or renaming legacy accounts.
create or replace function private.create_player_ledger_accounts(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  if p_user_id is null then
    raise exception 'User id is required';
  end if;

  insert into private.ledger_accounts(
    owner_user_id,account_code,wallet_kind,currency_code,is_system,currency_scale
  )
  values
    -- Preserve the existing legacy accounts exactly; do not reinterpret their balances.
    (p_user_id,'cash_pending','cash_usd','USD',false,1),
    (p_user_id,'cash_available','cash_usd','USD',false,1),
    (p_user_id,'cash_withdrawal_reserved','cash_usd','USD',false,1),
    (p_user_id,'cash_paid','cash_usd','USD',false,1),
    (p_user_id,'cash_held','cash_usd','USD',false,1),
    (p_user_id,'lootcoins_available','game_credits','LC',false,10000),
    -- New EL and LC accounts are separate wallet kinds and start at zero.
    (p_user_id,'earned_loot_pending','earned_loot','EL',false,1000),
    (p_user_id,'earned_loot_available','earned_loot','EL',false,1000),
    (p_user_id,'earned_loot_held','earned_loot','EL',false,1000),
    (p_user_id,'loot_coins_available','loot_coins','LC',false,10000)
  on conflict (owner_user_id,account_code,wallet_kind) do nothing;
end;
$fn$;
revoke all on function private.create_player_ledger_accounts(uuid) from public,anon,authenticated;
grant execute on function private.create_player_ledger_accounts(uuid) to service_role;

-- Provision empty EL/LC accounts for existing users; no balances are created.
select private.create_player_ledger_accounts(u.id) from auth.users u;

-- Config history is versioned. No active Moonetix configuration is inserted or assumed.
create table if not exists private.moonetix_reward_config_versions (
  id bigint generated always as identity primary key,
  currency_code text not null check (currency_code = 'EL'),
  conversion_rate numeric(12,2) not null check (conversion_rate > 0),
  split_percent smallint not null check (split_percent between 1 and 100),
  bonus_percent smallint not null default 0 check (bonus_percent between 0 and 500),
  rounding_mode text not null check (rounding_mode in ('whole','three_decimals')),
  effective_from timestamptz not null,
  effective_to timestamptz,
  dashboard_reference text,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  check (effective_to is null or effective_to > effective_from),
  check (
    not is_verified
    or (dashboard_reference is not null and verified_by is not null and verified_at is not null)
  )
);
create unique index if not exists moonetix_one_open_config_version
  on private.moonetix_reward_config_versions((true))
  where effective_to is null;


create or replace function private.prevent_moonetix_config_overlap()
returns trigger
language plpgsql
set search_path = ''
as $fn$
begin
  if exists (
    select 1 from private.moonetix_reward_config_versions c
    where c.id is distinct from new.id
      and tstzrange(c.effective_from,c.effective_to,'[)')
          && tstzrange(new.effective_from,new.effective_to,'[)')
  ) then
    raise exception 'Moonetix reward configuration effective periods cannot overlap';
  end if;
  return new;
end;
$fn$;
revoke all on function private.prevent_moonetix_config_overlap() from public,anon,authenticated;
drop trigger if exists moonetix_config_no_overlap on private.moonetix_reward_config_versions;
create trigger moonetix_config_no_overlap
before insert or update of effective_from,effective_to
on private.moonetix_reward_config_versions
for each row execute function private.prevent_moonetix_config_overlap();

-- Every provider event is stored with the exact raw decimal strings Moonetix sent.
-- The reward field already includes the provider's split, bonus, and rounding.
create table if not exists private.moonetix_reward_events (
  id uuid primary key default gen_random_uuid(),
  config_version_id bigint references private.moonetix_reward_config_versions(id),
  user_id uuid not null references auth.users(id) on delete restrict,
  provider_transaction_id text not null,
  provider_event_id text not null unique,
  provider_status smallint not null check (provider_status in (1,2)),
  currency_code text not null check (currency_code = 'EL'),
  reward_raw text not null check (reward_raw ~ '^(0|[1-9][0-9]*)(\.[0-9]{1,3})?$'),
  payout_usd_raw text not null check (payout_usd_raw ~ '^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$'),
  reward_atoms bigint,
  cash_equivalent_cents bigint,
  split_percent_snapshot smallint check (split_percent_snapshot between 1 and 100),
  conversion_rate_snapshot numeric(12,2) check (conversion_rate_snapshot > 0),
  bonus_percent_snapshot smallint check (bonus_percent_snapshot between 0 and 500),
  rounding_mode_snapshot text check (rounding_mode_snapshot in ('whole','three_decimals')),
  payload_digest text not null,
  signature_valid boolean not null default false,
  status text not null default 'pending_verification'
    check (status in ('pending_verification','pending_review','approved','rejected','reversal_pending','reversed','held')),
  provider_credited_at timestamptz,
  provider_reversed_at timestamptz,
  reconciled_at timestamptz,
  reconciliation_reference text,
  approval_actor uuid references auth.users(id),
  approval_at timestamptz,
  rejection_reason text,
  original_event_id uuid references private.moonetix_reward_events(id),
  journal_transaction_id uuid references private.journal_transactions(id),
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(provider_transaction_id,provider_status),
  check (
    status <> 'approved'
    or (
      provider_status = 1
      and signature_valid
      and reconciled_at is not null
      and reconciliation_reference is not null
      and approval_actor is not null
      and approval_at is not null
      and reward_atoms is not null
      and cash_equivalent_cents is not null
      and journal_transaction_id is not null
    )
  ),
  check (
    status <> 'reversed'
    or (provider_status = 2 and original_event_id is not null)
  )
);

create index if not exists moonetix_reward_events_user_status_idx
  on private.moonetix_reward_events(user_id,status,received_at desc);
create index if not exists moonetix_reward_events_transaction_idx
  on private.moonetix_reward_events(provider_transaction_id);

-- Track the remaining EL and cash-equivalent value by reward lot.
-- This preserves event-time conversion values when Moonetix settings change.
create table if not exists private.earned_loot_lots (
  id uuid primary key default gen_random_uuid(),
  reward_event_id uuid not null unique references private.moonetix_reward_events(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  original_atoms bigint not null check (original_atoms >= 0),
  remaining_atoms bigint not null check (remaining_atoms >= 0),
  original_value_cents bigint not null check (original_value_cents >= 0),
  remaining_value_cents bigint not null check (remaining_value_cents >= 0),
  created_at timestamptz not null default now(),
  check (remaining_atoms <= original_atoms),
  check (remaining_value_cents <= original_value_cents)
);
create index if not exists earned_loot_lots_user_fifo_idx
  on private.earned_loot_lots(user_id,created_at,id)
  where remaining_atoms > 0;

create table if not exists private.earned_loot_reward_audit (
  id bigint generated always as identity primary key,
  reward_event_id uuid not null references private.moonetix_reward_events(id) on delete restrict,
  actor_user_id uuid references auth.users(id),
  action text not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists private.earned_loot_reversal_cases (
  id uuid primary key default gen_random_uuid(),
  original_reward_event_id uuid not null references private.moonetix_reward_events(id) on delete restrict,
  reversal_event_id uuid not null unique references private.moonetix_reward_events(id) on delete restrict,
  requested_atoms bigint not null check (requested_atoms > 0),
  available_atoms_at_review bigint not null check (available_atoms_at_review >= 0),
  status text not null default 'held_for_review'
    check (status in ('held_for_review','compensated','disputed','closed_no_debt')),
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists private.lootcoin_packages (
  id uuid primary key default gen_random_uuid(),
  package_key text not null unique,
  display_name text not null,
  el_price_atoms bigint not null check (el_price_atoms > 0),
  lc_amount_atoms bigint not null check (lc_amount_atoms > 0),
  starts_at timestamptz not null,
  ends_at timestamptz,
  max_purchases_per_user integer,
  max_total_purchases integer,
  is_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at),
  check (max_purchases_per_user is null or max_purchases_per_user > 0),
  check (max_total_purchases is null or max_total_purchases > 0)
);

create table if not exists private.lootcoin_package_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  package_id uuid not null references private.lootcoin_packages(id) on delete restrict,
  idempotency_key text not null unique,
  el_debit_transaction_id uuid references private.journal_transactions(id),
  lc_credit_transaction_id uuid references private.journal_transactions(id),
  el_price_atoms bigint not null check (el_price_atoms > 0),
  lc_amount_atoms bigint not null check (lc_amount_atoms > 0),
  el_value_cents_consumed bigint not null check (el_value_cents_consumed >= 0),
  created_at timestamptz not null default now()
);

create table if not exists private.game_lootcoin_issuance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  source_type text not null check (source_type in ('game_milestone','achievement','challenge','seasonal_event','admin_grant')),
  source_event_id text not null,
  lc_amount_atoms bigint not null check (lc_amount_atoms > 0),
  journal_transaction_id uuid references private.journal_transactions(id),
  created_at timestamptz not null default now(),
  unique(source_type,source_event_id)
);

-- Private schema: no direct client reads or writes.
revoke all on all tables in schema private from public,anon,authenticated;
grant select,insert,update,delete on all tables in schema private to service_role;
grant usage,select on all sequences in schema private to service_role;

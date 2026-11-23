-- Draft only: isolated Earned Loot backend foundation.
-- Target: staging after review. DO NOT apply to production.
-- This migration deliberately fails closed for EL value conversion until provider precision is verified.
begin;

-- Keep legacy enum values and historical accounts intact.
alter type private.wallet_kind add value if not exists 'earned_loot';
alter type private.wallet_kind add value if not exists 'loot_coins';

alter table private.ledger_accounts drop constraint if exists ledger_account_currency;
alter table private.ledger_accounts add constraint ledger_account_currency check (
  (wallet_kind = 'cash_usd' and currency_code = 'USD')
  or (wallet_kind = 'game_credits' and currency_code in ('LLC','LC'))
  or (wallet_kind = 'earned_loot' and currency_code = 'EL')
  or (wallet_kind = 'loot_coins' and currency_code = 'LC')
);

-- EL uses an owner-configured smallest unit; do not assume cents.
-- LC uses the established 10,000 atoms per LC.
alter table private.ledger_accounts drop constraint if exists ledger_accounts_currency_scale_check;
alter table private.ledger_accounts add constraint ledger_accounts_currency_scale_check
  check (currency_scale > 0 and
    ((wallet_kind = 'loot_coins' and currency_scale = 10000)
     or wallet_kind <> 'loot_coins'));

alter table private.journal_transactions
  add column if not exists request_fingerprint text;

create table if not exists private.earned_loot_unit_config (
  config_id bigint generated always as identity primary key,
  provider_key text not null,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  provider_reward_currency text not null,
  el_units_per_usd_numerator bigint,
  el_units_per_usd_denominator bigint,
  rounding_mode text not null default 'HALF_UP'
    check (rounding_mode in ('DOWN','HALF_UP')),
  is_enabled boolean not null default false,
  verified_reference text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  check (effective_to is null or effective_to > effective_from),
  check (
    (is_enabled = false)
    or (
      el_units_per_usd_numerator > 0
      and el_units_per_usd_denominator > 0
      and verified_reference is not null
      and verified_at is not null
    )
  )
);
create unique index if not exists earned_loot_unit_config_one_active
  on private.earned_loot_unit_config(provider_key)
  where is_enabled and effective_to is null;

create table if not exists private.earned_loot_reward_events (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null,
  provider_event_id text not null,
  user_id uuid not null references auth.users(id) on delete restrict,
  provider_payout_usd_minor bigint not null check (provider_payout_usd_minor >= 0),
  player_reward_value numeric(30,12) not null check (player_reward_value >= 0),
  player_reward_currency text not null,
  player_reward_units bigint,
  split_percent numeric(5,2) not null check (split_percent > 0 and split_percent <= 100),
  provider_payload_digest text not null,
  status text not null default 'pending_verification'
    check (status in ('pending_verification','pending_review','approved','rejected','reversed','held')),
  signature_valid boolean not null default false,
  provider_verified_at timestamptz,
  settlement_reference text,
  settled_at timestamptz,
  unit_config_id bigint references private.earned_loot_unit_config(config_id),
  approval_actor uuid references auth.users(id),
  approval_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  unique(provider_key,provider_event_id),
  check (
    (status <> 'approved')
    or (
      signature_valid and provider_verified_at is not null
      and settled_at is not null and settlement_reference is not null
      and approval_actor is not null and approval_at is not null
      and player_reward_units is not null
    )
  )
);

create table if not exists private.earned_loot_reward_audit (
  id bigint generated always as identity primary key,
  reward_event_id uuid not null references private.earned_loot_reward_events(id) on delete restrict,
  actor_user_id uuid references auth.users(id),
  action text not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists private.earned_loot_reversal_cases (
  id uuid primary key default gen_random_uuid(),
  original_reward_event_id uuid not null references private.earned_loot_reward_events(id) on delete restrict,
  provider_reversal_id text not null,
  amount_units bigint not null check (amount_units > 0),
  status text not null default 'held_for_review'
    check (status in ('held_for_review','compensated','disputed','closed_no_debt')),
  reason text not null,
  created_at timestamptz not null default now(),
  unique(original_reward_event_id,provider_reversal_id)
);

create table if not exists private.lootcoin_packages (
  package_id uuid primary key default gen_random_uuid(),
  package_key text not null unique,
  display_name text not null,
  el_price_units bigint not null check (el_price_units > 0),
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
  purchase_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  package_id uuid not null references private.lootcoin_packages(package_id) on delete restrict,
  idempotency_key text not null unique,
  el_debit_transaction_id uuid references private.journal_transactions(id),
  lc_credit_transaction_id uuid references private.journal_transactions(id),
  el_price_units bigint not null check (el_price_units > 0),
  lc_amount_atoms bigint not null check (lc_amount_atoms > 0),
  created_at timestamptz not null default now(),
  unique(user_id,package_id,idempotency_key)
);

-- One player's empty EL/LC accounts are provisioned by trusted server code.
create or replace function private.create_player_ledger_accounts(p_user_id uuid)
returns void language plpgsql security definer set search_path=''
as $fn$
begin
  insert into private.ledger_accounts(owner_user_id,account_code,wallet_kind,currency_code,currency_scale,is_system)
  values
    (p_user_id,'earned_loot_pending','earned_loot','EL',1,false),
    (p_user_id,'earned_loot_available','earned_loot','EL',1,false),
    (p_user_id,'earned_loot_held','earned_loot','EL',1,false),
    (p_user_id,'loot_coins_available','loot_coins','LC',10000,false)
  on conflict(owner_user_id,account_code,wallet_kind) do nothing;
end;
$fn$;
revoke all on function private.create_player_ledger_accounts(uuid) from public,anon,authenticated;
grant execute on function private.create_player_ledger_accounts(uuid) to service_role;

-- Replace journal posting: same idempotency key + identical request is a safe retry;
-- any differing payload under that key is rejected. Available balances cannot go negative.
create or replace function private.post_journal_transaction(
  p_idempotency_key text,p_event_type text,p_source_system text,p_source_event_id text,
  p_description text,p_entries jsonb,p_metadata jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path=''
as $fn$
declare
  v_fingerprint text;
  v_existing private.journal_transactions%rowtype;
  v_tx uuid;
  v_entry jsonb;
  v_account private.ledger_accounts%rowtype;
  v_currency text;
  v_wallet private.wallet_kind;
  v_debits numeric;
  v_credits numeric;
  v_balance numeric;
  v_net numeric;
begin
  if p_idempotency_key is null or length(trim(p_idempotency_key)) < 8 then
    raise exception 'A valid idempotency key is required';
  end if;
  if jsonb_typeof(p_entries) <> 'array' or jsonb_array_length(p_entries) < 2 then
    raise exception 'At least two journal entries are required';
  end if;
  v_fingerprint := encode(digest(convert_to(jsonb_build_object(
    'event_type',p_event_type,'source_system',p_source_system,
    'source_event_id',p_source_event_id,'description',p_description,
    'entries',p_entries,'metadata',coalesce(p_metadata,'{}'::jsonb)
  )::text,'UTF8'),'sha256'),'hex');

  insert into private.journal_transactions(
    idempotency_key,event_type,source_system,source_event_id,description,metadata,request_fingerprint
  ) values (
    p_idempotency_key,p_event_type,p_source_system,p_source_event_id,p_description,
    coalesce(p_metadata,'{}'::jsonb),v_fingerprint
  ) on conflict(idempotency_key) do nothing returning id into v_tx;

  if v_tx is null then
    select * into v_existing from private.journal_transactions
    where idempotency_key=p_idempotency_key for update;
    if v_existing.request_fingerprint is distinct from v_fingerprint then
      raise exception 'Idempotency key reused with a different request';
    end if;
    return v_existing.id;
  end if;

  -- Lock every affected account in deterministic order before checking balances.
  for v_entry in
    select value from jsonb_array_elements(p_entries)
    order by value->>'account_id'
  loop
    select * into v_account from private.ledger_accounts
    where id=(v_entry->>'account_id')::uuid for update;
    if not found then raise exception 'Unknown ledger account'; end if;
    if (v_entry->>'wallet_kind')::private.wallet_kind <> v_account.wallet_kind
      or v_entry->>'currency_code' <> v_account.currency_code
      or (v_entry->>'direction') not in ('debit','credit')
      or (v_entry->>'amount')::bigint <= 0 then
      raise exception 'Invalid journal entry';
    end if;
    insert into private.journal_entries(transaction_id,account_id,wallet_kind,currency_code,direction,amount)
    values(v_tx,v_account.id,v_account.wallet_kind,v_account.currency_code,
      (v_entry->>'direction')::private.ledger_direction,(v_entry->>'amount')::bigint);
  end loop;

  if exists (
    select 1 from private.journal_entries
    where transaction_id=v_tx
    group by wallet_kind,currency_code
    having sum(amount) filter(where direction='debit')
      <> sum(amount) filter(where direction='credit')
  ) then raise exception 'Unbalanced journal transaction'; end if;

  -- Available player accounts are credit-normal: credits increase, debits decrease.
  for v_account in
    select distinct a.* from private.ledger_accounts a
    join private.journal_entries e on e.account_id=a.id
    where e.transaction_id=v_tx
      and a.account_code in ('earned_loot_available','loot_coins_available')
    order by a.id
  loop
    select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
      into v_net
    from private.journal_entries e where e.account_id=v_account.id;
    if v_net < 0 then raise exception 'Available wallet balance cannot be negative'; end if;
  end loop;
  return v_tx;
end;
$fn$;
revoke all on function private.post_journal_transaction(text,text,text,text,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function private.post_journal_transaction(text,text,text,text,text,jsonb,jsonb) to service_role;

-- Only owner/admin from the trusted admin table may approve. No callback can call this.
create or replace function private.approve_earned_loot_reward(p_reward_event_id uuid,p_reason text)
returns uuid language plpgsql security definer set search_path=''
as $fn$
declare
  v_actor uuid := auth.uid();
  v_reward private.earned_loot_reward_events%rowtype;
  v_config private.earned_loot_unit_config%rowtype;
  v_pending uuid;
  v_available uuid;
  v_system uuid;
  v_tx uuid;
begin
  if v_actor is null or not exists(
    select 1 from private.admin_users
    where user_id=v_actor and is_active=true and admin_role in ('owner','admin')
  ) then raise exception 'Owner or active admin authorization required'; end if;

  select * into v_reward from private.earned_loot_reward_events
  where id=p_reward_event_id for update;
  if not found then raise exception 'Reward event not found'; end if;
  if v_reward.status <> 'pending_review' or not v_reward.signature_valid
    or v_reward.provider_verified_at is null or v_reward.settled_at is null
    or v_reward.settlement_reference is null then
    raise exception 'Reward is not verified and reconciled for approval';
  end if;
  select * into v_config from private.earned_loot_unit_config
  where config_id=v_reward.unit_config_id and is_enabled=true;
  if not found then raise exception 'Verified Earned Loot unit configuration is unavailable'; end if;
  if v_reward.player_reward_units is null or v_reward.player_reward_units <= 0 then
    raise exception 'Player reward units have not been safely calculated';
  end if;

  select id into v_pending from private.ledger_accounts
   where owner_user_id=v_reward.user_id and account_code='earned_loot_pending' and wallet_kind='earned_loot';
  select id into v_available from private.ledger_accounts
   where owner_user_id=v_reward.user_id and account_code='earned_loot_available' and wallet_kind='earned_loot';
  select id into v_system from private.ledger_accounts
   where is_system=true and account_code='platform_earned_loot_issuance' and wallet_kind='earned_loot';
  if v_pending is null or v_available is null or v_system is null then
    raise exception 'Earned Loot ledger accounts are not provisioned';
  end if;

  v_tx := private.post_journal_transaction(
    'earned-loot-approval:'||v_reward.id::text,'earned_loot_approval','internal',
    v_reward.id::text,'Approved Earned Loot reward',
    jsonb_build_array(
      jsonb_build_object('account_id',v_pending,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',v_reward.player_reward_units),
      jsonb_build_object('account_id',v_available,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',v_reward.player_reward_units)
    ),
    jsonb_build_object('reward_event_id',v_reward.id,'provider_key',v_reward.provider_key,
      'provider_event_id',v_reward.provider_event_id,'split_percent_at_event',v_reward.split_percent,
      'provider_payout_usd_minor',v_reward.provider_payout_usd_minor,
      'player_reward_value',v_reward.player_reward_value,'unit_config_id',v_config.config_id)
  );
  update private.earned_loot_reward_events set status='approved',approval_actor=v_actor,approval_at=now()
    where id=v_reward.id;
  insert into private.earned_loot_reward_audit(reward_event_id,actor_user_id,action,reason,metadata)
  values(v_reward.id,v_actor,'approved',p_reason,jsonb_build_object('journal_transaction_id',v_tx));
  return v_tx;
end;
$fn$;
revoke all on function private.approve_earned_loot_reward(uuid,text) from public,anon,authenticated;
grant execute on function private.approve_earned_loot_reward(uuid,text) to authenticated;

-- Strict wallet contract. EL cash-equivalent is withheld until its unit scale is verified.
create or replace function public.get_player_wallet_summary()
returns jsonb language plpgsql stable security definer set search_path=''
as $fn$
declare
  v_user uuid := auth.uid();
  v_el_available numeric;
  v_el_pending numeric;
  v_lc numeric;
  v_scale private.earned_loot_unit_config%rowtype;
  v_value_cents numeric;
  v_pending_cents numeric;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
    into v_el_available
  from private.journal_entries e join private.journal_transactions t on t.id=e.transaction_id
  join private.ledger_accounts a on a.id=e.account_id
  where a.owner_user_id=v_user and a.account_code='earned_loot_available'
    and a.wallet_kind='earned_loot' and t.status='posted';
  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
    into v_el_pending
  from private.journal_entries e join private.journal_transactions t on t.id=e.transaction_id
  join private.ledger_accounts a on a.id=e.account_id
  where a.owner_user_id=v_user and a.account_code='earned_loot_pending'
    and a.wallet_kind='earned_loot' and t.status='posted';
  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
    into v_lc
  from private.journal_entries e join private.journal_transactions t on t.id=e.transaction_id
  join private.ledger_accounts a on a.id=e.account_id
  where a.owner_user_id=v_user and a.account_code='loot_coins_available'
    and a.wallet_kind='loot_coins' and t.status='posted';

  select * into v_scale from private.earned_loot_unit_config
    where provider_key='moon etix' and is_enabled=true and effective_to is null
    order by effective_from desc limit 1;
  if not found then
    raise exception 'Earned Loot unit conversion is not configured; wallet is safely unavailable';
  end if;
  v_value_cents := floor(v_el_available * v_scale.el_units_per_usd_denominator * 100
                         / v_scale.el_units_per_usd_numerator);
  v_pending_cents := floor(v_el_pending * v_scale.el_units_per_usd_denominator * 100
                           / v_scale.el_units_per_usd_numerator);
  return jsonb_build_object(
    'contractVersion',1,
    'earnedLoot',jsonb_build_object('code','EL','unitsLabel','EL',
      'availableUnits',v_el_available::bigint::text,'pendingUnits',v_el_pending::bigint::text,
      'availableValueCents',v_value_cents::bigint::text,'pendingValueCents',v_pending_cents::bigint::text),
    'lootCoins',jsonb_build_object('code','LC','availableAtoms',v_lc::bigint::text,
      'cashValue',null,'withdrawable',false,'transferable',false),
    'pendingAvailable',false,'pendingConvertible',false
  );
end;
$fn$;
revoke all on function public.get_player_wallet_summary() from public,anon;
grant execute on function public.get_player_wallet_summary() to authenticated;

-- Keep all new financial records private.
revoke all on all tables in schema private from public,anon,authenticated;
grant select,insert,update,delete on all tables in schema private to service_role;
grant usage,select on all sequences in schema private to service_role;
commit;

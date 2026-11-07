-- LegitLoot initial database foundation
-- Apply only to the dedicated LegitLoot Supabase project.
-- No client-side writes to financial records. Edge Functions/service_role only.
-- Currency values are integer minor units; game credits are separate integer units.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[A-Za-z0-9_]{3,24}$'
  )
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select on public.profiles to authenticated;
revoke update on public.profiles from authenticated;
grant update (username, display_name, avatar_path) on public.profiles to authenticated;
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $func$$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function private.create_profile_for_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row execute function private.create_profile_for_new_user();

create type private.wallet_kind as enum ('cash_usd', 'game_credits');
create type private.ledger_direction as enum ('debit', 'credit');
create type private.journal_status as enum ('posted', 'reversed');
create type private.provider_event_status as enum ('received', 'validated', 'rejected', 'posted', 'duplicate', 'reversed');
create type private.cash_reward_status as enum ('pending', 'available', 'withdrawal_reserved', 'paid', 'reversed', 'held');
create type private.payout_status as enum ('requested', 'under_review', 'approved', 'processing', 'paid', 'failed', 'cancelled');

create table private.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete restrict,
  account_code text not null,
  wallet_kind private.wallet_kind not null,
  currency_code text not null,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  unique (owner_user_id, account_code, wallet_kind),
  constraint ledger_account_currency check (
    (wallet_kind = 'cash_usd' and currency_code = 'USD')
    or (wallet_kind = 'game_credits' and currency_code = 'LLC')
  ),
  constraint ledger_account_owner_system check (
    (is_system and owner_user_id is null) or (not is_system and owner_user_id is not null)
  )
);

create unique index ledger_accounts_system_unique_idx
  on private.ledger_accounts(account_code, wallet_kind)
  where is_system;

insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system)
values
  (null, 'platform_cash_clearing', 'cash_usd', 'USD', true),
  (null, 'platform_game_credit_issuance', 'game_credits', 'LLC', true)
on conflict do nothing;

-- Every new player receives empty, separate ledger accounts; no balance is preloaded.
create or replace function private.create_player_ledger_accounts(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $func$
begin
  insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system)
  values
    (p_user_id, 'cash_pending', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_available', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_withdrawal_reserved', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_paid', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_held', 'cash_usd', 'USD', false),
    (p_user_id, 'game_credits_available', 'game_credits', 'LLC', false),
    (p_user_id, 'game_credits_provisional', 'game_credits', 'LLC', false),
    (p_user_id, 'game_credits_deferred', 'game_credits', 'LLC', false)
  on conflict (owner_user_id, account_code, wallet_kind) do nothing;
end;
$func$;
revoke all on function private.create_player_ledger_accounts(uuid) from public, anon, authenticated;
grant execute on function private.create_player_ledger_accounts(uuid) to service_role;

-- Replace signup trigger body to initialize both profile and empty wallet accounts.
create or replace function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $func$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  )
  on conflict (id) do nothing;
  perform private.create_player_ledger_accounts(new.id);
  return new;
end;
$func$;
revoke all on function private.create_profile_for_new_user() from public, anon, authenticated;

create table private.journal_transactions (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  event_type text not null,
  source_system text not null,
  source_event_id text,
  status private.journal_status not null default 'posted',
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  reversal_of uuid references private.journal_transactions(id),
  created_at timestamptz not null default now(),
  unique (source_system, source_event_id)
);

create table private.journal_entries (
  id bigint generated always as identity primary key,
  transaction_id uuid not null references private.journal_transactions(id) on delete restrict,
  account_id uuid not null references private.ledger_accounts(id) on delete restrict,
  wallet_kind private.wallet_kind not null,
  currency_code text not null,
  direction private.ledger_direction not null,
  amount bigint not null check (amount > 0),
  created_at timestamptz not null default now()
);
create index journal_entries_account_created_idx
  on private.journal_entries(account_id, created_at desc);
create index journal_entries_transaction_idx
  on private.journal_entries(transaction_id);

-- Posting is atomic, idempotent and balanced independently for each currency.
-- Only trusted server-side service_role may call this function.
create or replace function private.post_journal_transaction(
  p_idempotency_key text,
  p_event_type text,
  p_source_system text,
  p_source_event_id text,
  p_description text,
  p_entries jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $func$$
declare
  v_transaction_id uuid;
  v_entry jsonb;
  v_account private.ledger_accounts%rowtype;
  v_debits numeric;
  v_credits numeric;
  v_currency text;
  v_wallet private.wallet_kind;
  v_amount bigint;
  v_direction private.ledger_direction;
begin
  if p_idempotency_key is null or length(trim(p_idempotency_key)) < 8 then
    raise exception 'A valid idempotency key is required';
  end if;
  if jsonb_typeof(p_entries) <> 'array' or jsonb_array_length(p_entries) < 2 then
    raise exception 'At least two journal entries are required';
  end if;

  select id into v_transaction_id
  from private.journal_transactions
  where idempotency_key = p_idempotency_key;

  if v_transaction_id is not null then
    return v_transaction_id;
  end if;

  insert into private.journal_transactions (
    idempotency_key, event_type, source_system, source_event_id, description, metadata
  ) values (
    p_idempotency_key, p_event_type, p_source_system, p_source_event_id,
    p_description, coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_transaction_id;

  for v_entry in select value from jsonb_array_elements(p_entries)
  loop
    select * into v_account
    from private.ledger_accounts
    where id = (v_entry ->> 'account_id')::uuid
    for share;

    if not found then
      raise exception 'Unknown ledger account';
    end if;

    v_wallet := (v_entry ->> 'wallet_kind')::private.wallet_kind;
    v_direction := (v_entry ->> 'direction')::private.ledger_direction;
    v_amount := (v_entry ->> 'amount')::bigint;

    if v_amount is null or v_amount <= 0
      or v_wallet <> v_account.wallet_kind
      or v_account.currency_code <> (v_entry ->> 'currency_code') then
      raise exception 'Invalid journal entry currency, wallet or amount';
    end if;

    insert into private.journal_entries (
      transaction_id, account_id, wallet_kind, currency_code, direction, amount
    ) values (
      v_transaction_id, v_account.id, v_wallet, v_account.currency_code, v_direction, v_amount
    );
  end loop;

  for v_currency, v_wallet in
    select distinct currency_code, wallet_kind
    from private.journal_entries
    where transaction_id = v_transaction_id
  loop
    select
      coalesce(sum(amount) filter (where direction = 'debit'), 0),
      coalesce(sum(amount) filter (where direction = 'credit'), 0)
    into v_debits, v_credits
    from private.journal_entries
    where transaction_id = v_transaction_id
      and currency_code = v_currency
      and wallet_kind = v_wallet;

    if v_debits <> v_credits then
      raise exception 'Unbalanced journal transaction for currency %', v_currency;
    end if;
  end loop;

  return v_transaction_id;
exception
  when unique_violation then
    select id into v_transaction_id
    from private.journal_transactions
    where idempotency_key = p_idempotency_key;
    if v_transaction_id is not null then return v_transaction_id; end if;
    raise;
end;
$$;
revoke all on function private.post_journal_transaction(text,text,text,text,text,jsonb,jsonb) from public, anon, authenticated;
grant execute on function private.post_journal_transaction(text,text,text,text,text,jsonb,jsonb) to service_role;

-- Financial journal rows are append-only. Corrections are new compensating entries.
create or replace function private.reject_ledger_mutation()
returns trigger
language plpgsql
set search_path = ''
as $func$
begin
  raise exception 'Ledger records are immutable; post a compensating transaction';
end;
$func$;
revoke all on function private.reject_ledger_mutation() from public, anon, authenticated;

drop trigger if exists journal_transactions_immutable on private.journal_transactions;
create trigger journal_transactions_immutable
  before update or delete on private.journal_transactions
  for each row execute function private.reject_ledger_mutation();
drop trigger if exists journal_entries_immutable on private.journal_entries;
create trigger journal_entries_immutable
  before update or delete on private.journal_entries
  for each row execute function private.reject_ledger_mutation();

create table private.providers (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique,
  display_name text not null,
  provider_type text not null check (provider_type in ('offerwall','survey','affiliate','payout','payment')),
  status text not null default 'disabled' check (status in ('disabled','testing','approved','active','suspended','retired')),
  approval_reference text,
  terms_url text,
  terms_verified_at timestamptz,
  approved_reward_model jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table private.offers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references private.providers(id) on delete restrict,
  external_offer_id text,
  title text not null,
  description text,
  category text not null,
  reward_terms jsonb not null default '{}'::jsonb,
  eligibility jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','review','active','paused','expired')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider_id, external_offer_id)
);

create table private.provider_events (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references private.providers(id) on delete restrict,
  provider_event_id text not null,
  user_id uuid references auth.users(id) on delete restrict,
  event_type text not null,
  gross_amount_minor bigint,
  currency_code text,
  status private.provider_event_status not null default 'received',
  signature_valid boolean not null default false,
  payload_digest text not null,
  encrypted_payload_ref text,
  received_at timestamptz not null default now(),
  validated_at timestamptz,
  settled_at timestamptz,
  rejection_reason text,
  journal_transaction_id uuid references private.journal_transactions(id),
  unique (provider_id, provider_event_id)
);

create table private.reward_allocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  provider_event_id uuid not null references private.provider_events(id) on delete restrict,
  cash_amount_minor bigint not null default 0 check (cash_amount_minor >= 0),
  game_credit_units bigint not null default 0 check (game_credit_units >= 0),
  cash_status private.cash_reward_status not null default 'pending',
  game_credit_provisional_units bigint not null default 0 check (game_credit_provisional_units >= 0),
  game_credit_deferred_units bigint not null default 0 check (game_credit_deferred_units >= 0),
  settlement_reference text,
  created_at timestamptz not null default now(),
  settled_at timestamptz,
  unique (provider_event_id, user_id)
);

create table private.payout_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  amount_minor bigint not null check (amount_minor > 0),
  currency_code text not null default 'USD' check (currency_code = 'USD'),
  status private.payout_status not null default 'requested',
  payout_provider_id uuid references private.providers(id),
  idempotency_key text not null unique,
  reserved_journal_transaction_id uuid references private.journal_transactions(id),
  provider_payout_reference text,
  review_reason text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  paid_at timestamptz
);
create index payout_requests_user_created_idx on private.payout_requests(user_id, requested_at desc);

create table private.audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_type text not null check (actor_type in ('player','admin','system','provider')),
  action text not null,
  target_type text not null,
  target_id text,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table private.platform_settings (
  setting_key text primary key,
  setting_value jsonb not null,
  is_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Default reward split from the approved business model. Provider-level activation remains disabled.
insert into private.platform_settings(setting_key, setting_value, is_enabled)
values
  ('player_reward_pool_split', '{"cash_percent":50,"game_credit_percent":50}'::jsonb, false),
  ('game_credit_release_schedule', '{"provisional_percent":75,"deferred_percent":25}'::jsonb, false),
  ('cash_settlement_policy', '{"cash_available_only_after_provider_settlement":true}'::jsonb, false),
  ('minimum_withdrawal_usd_minor', '{"amount_minor":1000,"status":"proposed_not_active"}'::jsonb, false),
  ('reserve_policy', '{"required":true,"coverage_formula":"pending_finance_policy_review","reversal_buffer_percent":"not_set"}'::jsonb, false)
on conflict (setting_key) do nothing;

-- Private schema contains no client-readable or client-writable tables.
revoke all on all tables in schema private from public, anon, authenticated;
revoke all on all sequences in schema private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema private to service_role;
grant usage, select on all sequences in schema private to service_role;

-- Ensure future objects remain private by default.
alter default privileges in schema private revoke all on tables from public, anon, authenticated;
alter default privileges in schema private revoke all on sequences from public, anon, authenticated;

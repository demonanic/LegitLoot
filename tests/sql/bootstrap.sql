create extension if not exists pgcrypto;

do $roles$
begin
  create role anon nologin;
exception when duplicate_object then null;
end;
$roles$;
do $roles$
begin
  create role authenticated nologin;
exception when duplicate_object then null;
end;
$roles$;
do $roles$
begin
  create role service_role nologin bypassrls;
exception when duplicate_object then null;
end;
$roles$;

create schema if not exists auth;
create schema if not exists private;
create schema if not exists public;

create table auth.users (
  id uuid primary key,
  email text unique
);

create or replace function auth.uid()
returns uuid language sql stable
as $fn$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$fn$;

create type private.wallet_kind as enum ('cash_usd','game_credits');
create type private.ledger_direction as enum ('debit','credit');
create type private.journal_status as enum ('posted','reversed');

create table private.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete restrict,
  account_code text not null,
  wallet_kind private.wallet_kind not null,
  currency_code text not null,
  is_system boolean not null default false,
  currency_scale integer not null default 1,
  created_at timestamptz not null default now(),
  unique(owner_user_id,account_code,wallet_kind),
  constraint ledger_account_currency check (
    (wallet_kind='cash_usd' and currency_code='USD')
    or (wallet_kind='game_credits' and currency_code in ('LLC','LC'))
  ),
  constraint ledger_account_owner_system check (
    (is_system and owner_user_id is null) or (not is_system and owner_user_id is not null)
  ),
  constraint ledger_accounts_currency_scale_check check (currency_scale in (1,10000))
);
create unique index ledger_accounts_system_unique_idx
  on private.ledger_accounts(account_code,wallet_kind) where is_system;

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
  unique(source_system,source_event_id)
);

create table private.journal_entries (
  id bigint generated always as identity primary key,
  transaction_id uuid not null references private.journal_transactions(id) on delete restrict,
  account_id uuid not null references private.ledger_accounts(id) on delete restrict,
  wallet_kind private.wallet_kind not null,
  currency_code text not null,
  direction private.ledger_direction not null,
  amount bigint not null check (amount>0),
  created_at timestamptz not null default now()
);
create index journal_entries_account_created_idx on private.journal_entries(account_id,created_at desc);
create index journal_entries_transaction_idx on private.journal_entries(transaction_id);

create table private.admin_users (
  user_id uuid primary key references auth.users(id),
  admin_role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid,
  deactivated_at timestamptz,
  deactivated_by uuid
);

create or replace function private.create_player_ledger_accounts(p_user_id uuid)
returns void language plpgsql security definer set search_path=''
as $fn$
begin
  insert into private.ledger_accounts(owner_user_id,account_code,wallet_kind,currency_code,is_system,currency_scale)
  values (p_user_id,'cash_available','cash_usd','USD',false,1);
end;
$fn$;

grant usage on schema private to service_role;

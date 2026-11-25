-- Staging signup age and consent records. DOB and consent evidence stay server-only.
create schema if not exists private;

create table if not exists private.account_age_verifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  date_of_birth date not null,
  age_eligible boolean not null,
  age_policy_version text not null,
  verified_at timestamptz not null default now(),
  constraint account_age_dob_not_future check (date_of_birth <= current_date),
  constraint account_age_policy_version_nonempty check (length(trim(age_policy_version)) between 1 and 64)
);

create table if not exists private.account_policy_acceptances (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_type text not null check (policy_type in ('terms','privacy')),
  policy_version text not null check (length(trim(policy_version)) between 1 and 64),
  accepted_at timestamptz not null default now(),
  source text not null default 'signup' check (source = 'signup'),
  unique (user_id, policy_type, policy_version)
);

create index if not exists account_policy_acceptances_user_idx
  on private.account_policy_acceptances (user_id, accepted_at desc);

alter table private.account_age_verifications enable row level security;
alter table private.account_policy_acceptances enable row level security;
revoke all on private.account_age_verifications from public, anon, authenticated;
revoke all on private.account_policy_acceptances from public, anon, authenticated;
grant usage on schema private to service_role;
grant select, insert, update, delete on private.account_age_verifications to service_role;
grant select, insert on private.account_policy_acceptances to service_role;
grant usage, select on sequence private.account_policy_acceptances_id_seq to service_role;

create or replace function private.prevent_policy_acceptance_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'Policy acceptance records are append-only';
end;
$$;

drop trigger if exists account_policy_acceptances_no_update on private.account_policy_acceptances;
create trigger account_policy_acceptances_no_update
before update or delete on private.account_policy_acceptances
for each row execute function private.prevent_policy_acceptance_mutation();

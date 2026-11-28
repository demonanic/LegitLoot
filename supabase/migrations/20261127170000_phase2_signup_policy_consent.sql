-- Phase 2: record required signup acceptance from auth metadata, server-side only.
create schema if not exists private;
create table if not exists private.signup_policy_consent (
 user_id uuid primary key references auth.users(id) on delete cascade,
 terms_version text not null,
 privacy_version text not null,
 age_confirmed boolean not null check(age_confirmed),
 accepted_at timestamptz not null default now(),
 user_agent text
);
alter table private.signup_policy_consent enable row level security;
revoke all on private.signup_policy_consent from public,anon,authenticated;
grant usage on schema private to service_role;
grant select,insert,update,delete on private.signup_policy_consent to service_role;
create or replace function private.capture_signup_policy_consent()
returns trigger language plpgsql security definer set search_path='' as $$
declare m jsonb := coalesce(new.raw_user_meta_data,'{}'::jsonb);
begin
 if m->>'terms_version' is null or m->>'privacy_version' is null or coalesce((m->>'age_confirmed')::boolean,false) is not true then
   raise exception 'Required age and policy acceptance missing';
 end if;
 insert into private.signup_policy_consent(user_id,terms_version,privacy_version,age_confirmed,accepted_at,user_agent)
 values(new.id,m->>'terms_version',m->>'privacy_version',true,now(),m->>'consent_user_agent');
 return new;
end $$;
drop trigger if exists signup_policy_consent_capture on auth.users;
create trigger signup_policy_consent_capture after insert on auth.users
for each row execute function private.capture_signup_policy_consent();
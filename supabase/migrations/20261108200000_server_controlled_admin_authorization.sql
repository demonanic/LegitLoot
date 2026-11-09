-- LegitLoot server-controlled administrator authorization.
-- Staging/build branch only. No user is promoted by signup or user-editable metadata.

create table if not exists private.admin_users (
  user_id uuid primary key references auth.users(id) on delete restrict,
  admin_role text not null default 'owner'
    check (admin_role in ('owner', 'payout_reviewer', 'support_readonly')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete restrict,
  deactivated_at timestamptz,
  deactivated_by uuid references auth.users(id) on delete restrict,
  constraint admin_users_deactivation_consistency check (
    (is_active and deactivated_at is null and deactivated_by is null)
    or
    (not is_active and deactivated_at is not null and deactivated_by is not null)
  )
);

create index if not exists admin_users_active_role_idx
  on private.admin_users(admin_role)
  where is_active = true;

alter table private.admin_users enable row level security;
revoke all on private.admin_users from public, anon, authenticated;
grant select, insert, update on private.admin_users to service_role;

-- The service-role-only provisioning path is deliberately explicit. It is not
-- callable from a browser and does not consult user-editable auth metadata.
create or replace function private.provision_initial_owner_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  if current_setting('request.jwt.claim.role', true) is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;

  if p_user_id is null then
    raise exception 'A user ID is required';
  end if;

  if exists (select 1 from private.admin_users where admin_role = 'owner' and is_active) then
    raise exception 'An active owner administrator already exists';
  end if;

  insert into private.admin_users(user_id, admin_role, is_active, created_by)
  values (p_user_id, 'owner', true, null)
  on conflict (user_id) do update
    set admin_role = 'owner',
        is_active = true,
        deactivated_at = null,
        deactivated_by = null;
end;
$fn$;
revoke all on function private.provision_initial_owner_admin(uuid) from public, anon, authenticated;
grant execute on function private.provision_initial_owner_admin(uuid) to service_role;

-- Audit records are append-only. Corrections require a new audit event.
drop trigger if exists audit_log_immutable on private.audit_log;
create trigger audit_log_immutable
  before update or delete on private.audit_log
  for each row execute function private.reject_ledger_mutation();

comment on table private.admin_users is
  'Server-controlled admin authorization. Never derive admin rights from user-editable metadata.';
comment on function private.provision_initial_owner_admin(uuid) is
  'One-time owner bootstrap; service_role only. Requires an existing auth.users row.';

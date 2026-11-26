-- AUTH-03a: account deletion (close and pseudonymise; never hard-delete ledger data).
-- Design: docs/ACCOUNT_DELETION_DESIGN.md. Owner decisions (Complete Loop issues #3/#4, 2026-11-21):
--   D1 7-day cancellable wait · D2 pseudonymised records kept while LegitLoot runs
--   D3 email requests answered within 30 days · D4 a deleted email may sign up again, fresh
-- Routine choice D5: the delete request needs a sign-in within the last 10 minutes.
-- Staging lineage only. Production rollout needs the normal release approval.
--
-- Open owner question (dec-deletion-cash): what happens to an unpaid cash balance.
-- Until Sam decides, processing STOPS (status 'blocked') if the account holds any cash
-- or has an open payout request. Nothing is forfeited or moved without his decision.

alter table public.profiles add column if not exists deleted_at timestamptz;
alter table private.ledger_accounts add column if not exists closed_at timestamptz;

create table if not exists private.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending', 'cancelled', 'blocked', 'data_cleared', 'completed')),
  requested_at timestamptz not null default now(),
  scheduled_for timestamptz not null,
  cancelled_at timestamptz,
  blocked_reason text,
  data_cleared_at timestamptz,
  completed_at timestamptz,
  check (scheduled_for >= requested_at),
  check ((status = 'cancelled') = (cancelled_at is not null)),
  check ((status = 'blocked') = (blocked_reason is not null))
);

-- One open request per player.
create unique index if not exists account_deletion_one_open_idx
  on private.account_deletion_requests (user_id)
  where status in ('pending', 'blocked', 'data_cleared');

alter table private.account_deletion_requests enable row level security;
revoke all on private.account_deletion_requests from public, anon, authenticated;
grant select, insert, update on private.account_deletion_requests to service_role;

-- Deleted players are locked out of everything their session could still reach.
create or replace function private.is_account_deleted(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $fn$
  select exists (select 1 from public.profiles where id = p_user_id and deleted_at is not null);
$fn$;
revoke all on function private.is_account_deleted(uuid) from public, anon, authenticated;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id and deleted_at is null);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id and deleted_at is null)
  with check ((select auth.uid()) = id and deleted_at is null);

-- No new postings to a closed account (existing rows are immutable and untouched).
create or replace function private.reject_posting_to_closed_account()
returns trigger
language plpgsql
set search_path = ''
as $fn$
begin
  if exists (select 1 from private.ledger_accounts where id = new.account_id and closed_at is not null) then
    raise exception 'Ledger account % is closed', new.account_id using errcode = 'P0001';
  end if;
  return new;
end;
$fn$;
revoke all on function private.reject_posting_to_closed_account() from public, anon, authenticated;
drop trigger if exists journal_entries_closed_account on private.journal_entries;
create trigger journal_entries_closed_account
  before insert on private.journal_entries
  for each row execute function private.reject_posting_to_closed_account();

-- The wallet RPC refuses deleted players. Body is the canonical LC-only contract from
-- supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql (legitCoins key, LC accounts
-- and LC entries only, which wallet-summary.js parses first) plus the deleted-account guard.
-- Applying this migration therefore also applies that reviewed response contract; cash buckets are
-- no longer returned by this RPC. A future cash-balance view needs its own reviewed RPC.
create or replace function public.get_wallet_summary()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if private.is_account_deleted(v_user_id) then
    raise exception 'Account deleted' using errcode = '28000';
  end if;

  with user_accounts as (
    select id, account_code, wallet_kind, currency_code
    from private.ledger_accounts
    where owner_user_id = v_user_id and is_system = false
      and wallet_kind = 'game_credits' and currency_code = 'LC'
  ),
  balances as (
    select
      a.account_code,
      coalesce(sum(case
        when e.direction::text = 'credit' then e.amount
        when e.direction::text = 'debit' then -e.amount
        else 0
      end), 0)::numeric(30,0) as balance
    from user_accounts a
    left join private.journal_entries e on e.account_id = a.id
      and e.wallet_kind = a.wallet_kind and e.currency_code = a.currency_code
    left join private.journal_transactions t on t.id = e.transaction_id
      and t.status::text = 'posted'
    where e.id is null or t.id is not null
    group by a.account_code
  )
  select jsonb_build_object(
    'legitCoins', jsonb_build_object(
      'available', coalesce(sum(balance) filter (where account_code = 'lootcoins_available'),0)::text,
      'provisional', coalesce(sum(balance) filter (where account_code = 'lootcoins_provisional'),0)::text,
      'deferred', coalesce(sum(balance) filter (where account_code = 'lootcoins_deferred'),0)::text,
      'withdrawable', false
    )
  ) into v_result
  from balances;

  return v_result;
end;
$function$;
revoke all on function public.get_wallet_summary() from public, anon;
grant execute on function public.get_wallet_summary() to authenticated, service_role;

-- Player: request deletion. Needs a sign-in within the last 10 minutes (Supabase "amr" claim).
create or replace function public.request_account_deletion()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_last_auth bigint;
  v_req private.account_deletion_requests;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if private.is_account_deleted(v_user) then
    raise exception 'Account deleted' using errcode = '28000';
  end if;
  if exists (select 1 from private.admin_users where user_id = v_user and is_active) then
    raise exception 'Administrators must be deactivated before their account can be deleted' using errcode = 'P0001';
  end if;

  select max((m ->> 'timestamp')::bigint) into v_last_auth
  from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) m;
  if v_last_auth is null or v_last_auth < extract(epoch from now()) - 600 then
    raise exception 'reauth_required: sign in again to delete your account' using errcode = 'P0001';
  end if;

  select * into v_req from private.account_deletion_requests
  where user_id = v_user and status in ('pending', 'blocked', 'data_cleared');
  if not found then
    insert into private.account_deletion_requests (user_id, scheduled_for)
    values (v_user, now() + interval '7 days')
    returning * into v_req;
    insert into private.audit_log (actor_user_id, actor_type, action, target_type, target_id)
    values (v_user, 'player', 'account.deletion_requested', 'account_deletion_request', v_req.id::text);
  end if;

  return jsonb_build_object('status', v_req.status, 'requestedAt', v_req.requested_at, 'scheduledFor', v_req.scheduled_for);
end;
$fn$;
revoke all on function public.request_account_deletion() from public, anon;
grant execute on function public.request_account_deletion() to authenticated;

-- Player: cancel during the 7-day wait.
create or replace function public.cancel_account_deletion()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_id uuid;
begin
  if v_user is null or private.is_account_deleted(v_user) then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  update private.account_deletion_requests
     set status = 'cancelled', cancelled_at = now(), blocked_reason = null
   where user_id = v_user and status in ('pending', 'blocked')
  returning id into v_id;
  if v_id is not null then
    insert into private.audit_log (actor_user_id, actor_type, action, target_type, target_id)
    values (v_user, 'player', 'account.deletion_cancelled', 'account_deletion_request', v_id::text);
  end if;
  return jsonb_build_object('cancelled', v_id is not null);
end;
$fn$;
revoke all on function public.cancel_account_deletion() from public, anon;
grant execute on function public.cancel_account_deletion() to authenticated;

-- Player: see the current request, if any.
create or replace function public.account_deletion_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_req private.account_deletion_requests;
begin
  if v_user is null or private.is_account_deleted(v_user) then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  select * into v_req from private.account_deletion_requests
  where user_id = v_user and status in ('pending', 'blocked', 'data_cleared');
  if not found then
    return jsonb_build_object('status', 'none');
  end if;
  return jsonb_build_object('status', v_req.status, 'requestedAt', v_req.requested_at,
    'scheduledFor', v_req.scheduled_for, 'blockedReason', v_req.blocked_reason);
end;
$fn$;
revoke all on function public.account_deletion_status() from public, anon;
grant execute on function public.account_deletion_status() to authenticated;

-- Server job (service_role only): clear personal data once the wait is over.
-- Run after this: revoke sessions and soft-delete the Auth user through the Auth admin API,
-- then private.complete_account_deletion(request_id).
create or replace function private.process_account_deletion(p_request_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_req private.account_deletion_requests;
  v_cash numeric;
begin
  select * into v_req from private.account_deletion_requests where id = p_request_id for update;
  if not found then
    raise exception 'Unknown deletion request %', p_request_id using errcode = 'P0002';
  end if;
  if v_req.status = 'data_cleared' or v_req.status = 'completed' then
    return v_req.status; -- idempotent
  end if;
  if v_req.status not in ('pending', 'blocked') then
    raise exception 'Request % is %', p_request_id, v_req.status using errcode = 'P0001';
  end if;
  if v_req.scheduled_for > now() then
    raise exception 'Request % is still in its waiting period', p_request_id using errcode = 'P0001';
  end if;

  -- Money gates: stop and escalate to the owner; never forfeit or move money here.
  if exists (select 1 from private.payout_requests
             where user_id = v_req.user_id and status in ('requested', 'under_review', 'approved', 'processing')) then
    update private.account_deletion_requests set status = 'blocked', blocked_reason = 'open_payout_request' where id = v_req.id;
    insert into private.audit_log (actor_type, action, target_type, target_id, reason)
    values ('system', 'account.deletion_blocked', 'account_deletion_request', v_req.id::text, 'open_payout_request');
    return 'blocked';
  end if;
  -- Unpaid buckets only. cash_paid is a cumulative record of money already paid out and
  -- must not block deletion. Any non-zero unpaid bucket blocks.
  select count(*) into v_cash
  from (
    select a.id
    from private.ledger_accounts a
    join private.journal_entries e on e.account_id = a.id
      and e.wallet_kind = 'cash_usd' and e.currency_code = 'USD'
    join private.journal_transactions t on t.id = e.transaction_id and t.status::text = 'posted'
    where a.owner_user_id = v_req.user_id and a.wallet_kind = 'cash_usd' and a.currency_code = 'USD'
      and a.account_code in ('cash_available', 'cash_pending', 'cash_withdrawal_reserved', 'cash_held')
    group by a.id
    having sum(case when e.direction::text = 'credit' then e.amount else -e.amount end) <> 0
  ) unpaid;
  if v_cash <> 0 then
    update private.account_deletion_requests set status = 'blocked', blocked_reason = 'cash_balance_owner_decision' where id = v_req.id;
    insert into private.audit_log (actor_type, action, target_type, target_id, reason)
    values ('system', 'account.deletion_blocked', 'account_deletion_request', v_req.id::text, 'cash_balance_owner_decision');
    return 'blocked';
  end if;

  update public.profiles
     set username = null, display_name = null, avatar_path = null, deleted_at = coalesce(deleted_at, now())
   where id = v_req.user_id;
  update private.ledger_accounts set closed_at = now()
   where owner_user_id = v_req.user_id and closed_at is null;
  delete from private.game_saves where user_id = v_req.user_id;
  delete from private.game_handoff_tickets where user_id = v_req.user_id;
  delete from private.game_events where user_id = v_req.user_id;

  update private.account_deletion_requests
     set status = 'data_cleared', data_cleared_at = now(), blocked_reason = null
   where id = v_req.id;
  insert into private.audit_log (actor_type, action, target_type, target_id)
  values ('system', 'account.deletion_processed', 'account_deletion_request', v_req.id::text);
  return 'data_cleared';
end;
$fn$;
revoke all on function private.process_account_deletion(uuid) from public, anon, authenticated;
grant execute on function private.process_account_deletion(uuid) to service_role;

-- Server job: mark done after the Auth user has been soft-deleted.
create or replace function private.complete_account_deletion(p_request_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_status text;
begin
  update private.account_deletion_requests
     set status = 'completed', completed_at = now()
   where id = p_request_id and status = 'data_cleared'
  returning status into v_status;
  if v_status is null then
    select status into v_status from private.account_deletion_requests where id = p_request_id;
    if v_status = 'completed' then return 'completed'; end if;
    raise exception 'Request % is not ready to complete (%)', p_request_id, coalesce(v_status, 'unknown') using errcode = 'P0001';
  end if;
  insert into private.audit_log (actor_type, action, target_type, target_id)
  values ('system', 'account.deletion_completed', 'account_deletion_request', p_request_id::text);
  return 'completed';
end;
$fn$;
revoke all on function private.complete_account_deletion(uuid) from public, anon, authenticated;
grant execute on function private.complete_account_deletion(uuid) to service_role;


-- Public Data API facade for the scheduled job. The private schema stays unexposed;
-- only service_role can invoke these narrowly scoped RPCs. SECURITY INVOKER preserves
-- the service_role's underlying grants when accessing private tables/functions.
create or replace function public.claim_due_account_deletion_batch()
returns table (
  id uuid,
  user_id uuid,
  status text,
  scheduled_for timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $fn$
  select r.id, r.user_id, r.status, r.scheduled_for
  from private.account_deletion_requests r
  where r.status in ('pending', 'blocked', 'data_cleared')
    and r.scheduled_for <= now()
  order by r.scheduled_for, r.id
  limit 25;
$fn$;
revoke all on function public.claim_due_account_deletion_batch() from public, anon, authenticated;
grant execute on function public.claim_due_account_deletion_batch() to service_role;

create or replace function public.process_account_deletion_job(p_request_id uuid)
returns text
language sql
security invoker
set search_path = ''
as $fn$
  select private.process_account_deletion(p_request_id);
$fn$;
revoke all on function public.process_account_deletion_job(uuid) from public, anon, authenticated;
grant execute on function public.process_account_deletion_job(uuid) to service_role;

create or replace function public.complete_account_deletion_job(p_request_id uuid)
returns text
language sql
security invoker
set search_path = ''
as $fn$
  select private.complete_account_deletion(p_request_id);
$fn$;
revoke all on function public.complete_account_deletion_job(uuid) from public, anon, authenticated;
grant execute on function public.complete_account_deletion_job(uuid) to service_role;

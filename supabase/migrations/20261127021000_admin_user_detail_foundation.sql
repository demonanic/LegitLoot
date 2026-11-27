-- LegitLoot Admin Cockpit P1: secure owner-only user detail read.
-- Draft only: validate and test in isolated staging before applying.
create or replace function public.admin_user_detail(
  p_actor_user_id uuid,
  p_target_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_claim_role text;
  v_result jsonb;
begin
  v_claim_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif((nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'), '')
  );
  if v_claim_role is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  if p_actor_user_id is null or p_target_user_id is null then
    raise exception 'Actor and target IDs required' using errcode = '22023';
  end if;
  if not exists (
    select 1 from private.admin_users
    where user_id=p_actor_user_id and is_active=true and admin_role='owner'
  ) then
    raise exception 'Owner administrator required' using errcode = '42501';
  end if;

  with user_record as (
    select u.id,u.email,u.created_at as auth_created_at,u.last_sign_in_at,
      p.username,p.display_name,p.avatar_path,p.created_at as profile_created_at,
      p.updated_at,p.deleted_at
    from auth.users u left join public.profiles p on p.id=u.id
    where u.id=p_target_user_id
  ),
  accounts as (
    select la.id,la.owner_user_id,la.account_code,la.wallet_kind::text as wallet_kind,
      la.currency_code,la.currency_scale,la.created_at,la.closed_at,
      coalesce(sum(case when jt.id is null then 0 else case je.direction::text when 'credit' then je.amount else -je.amount end end),0)::bigint as balance
    from private.ledger_accounts la left join private.journal_entries je on je.account_id=la.id
    left join private.journal_transactions jt on jt.id=je.transaction_id and jt.status::text='posted'
    where la.owner_user_id=p_target_user_id
    group by la.id
  ),
  history as (
    select jt.id,jt.event_type,jt.source_system,jt.source_event_id,jt.status::text as status,
      jt.description,jt.created_at,jt.reversal_of,
      jsonb_agg(jsonb_build_object('accountCode',la.account_code,
        'walletKind',je.wallet_kind::text,'currency',je.currency_code,
        'direction',je.direction::text,'amountAtoms',je.amount) order by je.id) as entries
    from private.journal_transactions jt
    join private.journal_entries je on je.transaction_id=jt.id
    join private.ledger_accounts la on la.id=je.account_id
    where la.owner_user_id=p_target_user_id
    group by jt.id
    order by jt.created_at desc
    limit 30
  )
  select jsonb_build_object(
    'success',true,
    'user', (select to_jsonb(user_record) from user_record),
    'accounts',coalesce((select jsonb_agg(jsonb_build_object(
      'accountId',a.id,'accountCode',a.account_code,'walletKind',a.wallet_kind,
      'currency',a.currency_code,'scale',a.currency_scale,'balanceAtoms',a.balance,
      'createdAt',a.created_at,'closedAt',a.closed_at) order by a.wallet_kind,a.account_code)
      from accounts a),'[]'::jsonb),
    'recentLedgerActivity',coalesce((select jsonb_agg(to_jsonb(h) order by h.created_at desc)
      from history h),'[]'::jsonb)
  ) into v_result;

  if (v_result->'user') is null or v_result->'user'='null'::jsonb then
    raise exception 'User not found' using errcode = 'P0002';
  end if;
  return v_result;
end;
$fn$;

revoke all on function public.admin_user_detail(uuid,uuid) from public,anon,authenticated;
grant execute on function public.admin_user_detail(uuid,uuid) to service_role;

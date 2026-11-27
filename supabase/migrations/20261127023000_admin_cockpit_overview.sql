-- LegitLoot Admin Cockpit: owner-only aggregate overview.
-- Draft migration. Do not apply without the staging deployment approval gate.
create or replace function public.admin_cockpit_overview(p_actor_user_id uuid)
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
  if p_actor_user_id is null or not exists (
    select 1 from private.admin_users
    where user_id=p_actor_user_id and is_active=true and admin_role='owner'
  ) then
    raise exception 'Owner administrator required' using errcode = '42501';
  end if;

  with wallet_totals as (
    select la.wallet_kind::text wallet_kind,la.currency_code,la.currency_scale,la.account_code,
      sum(coalesce(e.net_atoms,0))::bigint user_net_atoms,
      count(*) account_count
    from private.ledger_accounts la
    left join (
      select account_id,
        sum(case direction::text when 'credit' then amount else -amount end)::bigint net_atoms
      from private.journal_entries group by account_id
    ) e on e.account_id=la.id
    where la.is_system=false and la.owner_user_id is not null and la.closed_at is null
    group by la.wallet_kind,la.currency_code,la.currency_scale,la.account_code
  ),
  payout_statuses as (
    select status::text status,count(*)::int count
    from private.payout_requests group by status
  ),
  provider_statuses as (
    select status::text status,count(*)::int count
    from private.provider_events group by status
  )
  select jsonb_build_object(
    'success',true,
    'overview',jsonb_build_object(
      'registeredProfiles',(select count(*)::int from public.profiles),
      'rewardAllocations',(select count(*)::int from private.reward_allocations),
      'providerEvents',(select count(*)::int from private.provider_events),
      'payoutRequests',(select count(*)::int from private.payout_requests),
      'auditCount',(select count(*)::int from private.audit_log),
      'gameEventCount',(select count(*)::int from private.game_events),
      'profilesCreated30d',(select count(*)::int from public.profiles where created_at >= now()-interval '30 days'),
      'payoutStatusCounts',coalesce((select jsonb_object_agg(status,count) from payout_statuses),'{}'::jsonb),
      'providerStatusCounts',coalesce((select jsonb_object_agg(status,count) from provider_statuses),'{}'::jsonb),
      'walletTotals',coalesce((select jsonb_agg(jsonb_build_object(
        'walletKind',wallet_kind,'currency',currency_code,'scale',currency_scale,'accountCode',account_code,
        'userNetAtoms',user_net_atoms,'accountCount',account_count
      ) order by wallet_kind,currency_code,currency_scale,account_code) from wallet_totals),'[]'::jsonb)
    )
  ) into v_result;

  insert into private.audit_log(actor_user_id,actor_type,action,target_type,metadata)
  values(p_actor_user_id,'admin','admin_cockpit_overview','platform_overview',
    jsonb_build_object('view','aggregate_read_only_overview'));

  return v_result;
end;
$fn$;
revoke all on function public.admin_cockpit_overview(uuid) from public,anon,authenticated;
grant execute on function public.admin_cockpit_overview(uuid) to service_role;

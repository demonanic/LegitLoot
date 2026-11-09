-- Service-role-only read model for the staging admin dashboard.
-- The private schema stays unexposed; Edge Functions call this public wrapper.
create or replace function public.admin_dashboard_payload(
  p_actor_user_id uuid,
  p_section text default 'overview'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_role text;
  v_section text := coalesce(nullif(p_section, ''), 'overview');
  v_result jsonb;
  v_user_count bigint;
begin
  v_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif((nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'), '')
  );
  if v_role is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  if p_actor_user_id is null then
    raise exception 'Actor user ID is required' using errcode = '22023';
  end if;

  select admin_role into v_role
  from private.admin_users
  where user_id = p_actor_user_id and is_active = true;
  if v_role is null then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  select count(*) into v_user_count from public.profiles;
  v_result := jsonb_build_object(
    'success', true,
    'role', v_role,
    'overview', jsonb_build_object('registeredProfiles', v_user_count),
    'capabilities', jsonb_build_object(
      'canReviewPayouts', v_role in ('owner','payout_reviewer'),
      'canViewAudit', v_role = 'owner',
      'canManageAdmins', v_role = 'owner'
    )
  );

  if v_section = 'payouts' then
    if v_role not in ('owner','payout_reviewer') then
      raise exception 'Payout review permission required' using errcode = '42501';
    end if;
    select v_result || jsonb_build_object(
      'payouts', coalesce(jsonb_agg(jsonb_build_object(
        'id', q.id,
        'userId', q.user_id,
        'email', u.email,
        'amountMinor', q.amount_minor,
        'currency', q.currency_code,
        'status', q.status::text,
        'destinationType', q.destination_type,
        'recipientHint', q.recipient_hint,
        'requestedAt', q.requested_at,
        'reviewReason', q.review_reason,
        'decisionReason', q.decision_reason
      ) order by q.requested_at desc), '[]'::jsonb),
      'payoutCount', count(q.id)
    ) into v_result
    from private.payout_requests q
    left join auth.users u on u.id = q.user_id;
  elsif v_section = 'audit' then
    if v_role <> 'owner' then
      raise exception 'Owner permission required' using errcode = '42501';
    end if;
    select v_result || jsonb_build_object(
      'audit', coalesce(jsonb_agg(jsonb_build_object(
        'id', a.id,
        'actor_user_id', a.actor_user_id,
        'actor_type', a.actor_type,
        'action', a.action,
        'target_type', a.target_type,
        'target_id', a.target_id,
        'reason', a.reason,
        'created_at', a.created_at
      ) order by a.created_at desc), '[]'::jsonb)
    ) into v_result
    from (
      select id,actor_user_id,actor_type,action,target_type,target_id,reason,created_at
      from private.audit_log order by created_at desc limit 50
    ) a;
  elsif v_section <> 'overview' then
    raise exception 'Unknown dashboard section' using errcode = '22023';
  end if;
  return v_result;
end;
$function$;

revoke all on function public.admin_dashboard_payload(uuid,text) from public, anon, authenticated;
grant execute on function public.admin_dashboard_payload(uuid,text) to service_role;

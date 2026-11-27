-- Read-only owner-gated Admin Cockpit operational sections.
-- Draft migration: do not apply until explicit staging deployment approval.
create or replace function public.admin_cockpit_section(p_actor_user_id uuid,p_section text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_claim_role text;
  v_result jsonb;
  v_section text := lower(trim(coalesce(p_section,'')));
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
  if v_section not in ('providers','redemptions','security','audit','lc_issuance') then
    raise exception 'Unsupported section' using errcode = '22023';
  end if;

  if v_section='providers' then
    select jsonb_build_object('success',true,'section',v_section,
      'providers',coalesce((select jsonb_agg(jsonb_build_object(
        'id',p.id,'key',p.provider_key,'name',p.display_name,'type',p.provider_type,
        'status',p.status,'updatedAt',p.updated_at,
        'offerCount',(select count(*) from private.offers o where o.provider_id=p.id),
        'eventCount',(select count(*) from private.provider_events e where e.provider_id=p.id)
      ) order by p.display_name) from private.providers p),'[]'::jsonb),
      'recentEvents',coalesce((select jsonb_agg(jsonb_build_object(
        'id',e.id,'provider',p.display_name,'eventType',e.event_type,'status',e.status::text,
        'signatureValid',e.signature_valid,'receivedAt',e.received_at,
        'validatedAt',e.validated_at,'settledAt',e.settled_at,
        'rejectionReason',e.rejection_reason
      ) order by e.received_at desc) from (
        select * from private.provider_events order by received_at desc limit 50
      ) e join private.providers p on p.id=e.provider_id),'[]'::jsonb)
    ) into v_result;
  elsif v_section='redemptions' then
    select jsonb_build_object('success',true,'section',v_section,
      'requests',coalesce((select jsonb_agg(jsonb_build_object(
        'id',r.id,'userId',r.user_id,'amountMinor',r.amount_minor,'currency',r.currency_code,
        'status',r.status::text,'destinationType',r.destination_type,'recipientHint',r.recipient_hint,
        'requestedAt',r.requested_at,'reviewedAt',r.reviewed_at,'processedAt',r.processed_at,
        'paidAt',r.paid_at,'reviewReason',r.review_reason,'decisionReason',r.decision_reason,
        'provider',p.display_name
      ) order by r.requested_at desc) from (
        select * from private.payout_requests order by requested_at desc limit 50
      ) r left join private.providers p on p.id=r.payout_provider_id),'[]'::jsonb)
    ) into v_result;
  elsif v_section='security' then
    select jsonb_build_object('success',true,'section',v_section,
      'providerStatusCounts',coalesce((select jsonb_object_agg(status,count) from (
        select status::text status,count(*)::int count from private.provider_events group by status
      ) x),'{}'::jsonb),
      'signatureInvalidCount',(select count(*)::int from private.provider_events where signature_valid=false),
      'deletionStatusCounts',coalesce((select jsonb_object_agg(status,count) from (
        select status,count(*)::int count from private.account_deletion_requests group by status
      ) x),'{}'::jsonb),
      'moonetixStatusCounts',coalesce((select jsonb_object_agg(status,count) from (
        select status,count(*)::int count from private.moonetix_reward_events group by status
      ) x),'{}'::jsonb),
      'flaggedEvents',coalesce((select jsonb_agg(jsonb_build_object(
        'id',e.id,'provider',p.display_name,'eventType',e.event_type,
        'status',e.status::text,'signatureValid',e.signature_valid,
        'receivedAt',e.received_at,'reason',e.rejection_reason
      ) order by e.received_at desc) from (
        select * from private.provider_events
        where signature_valid=false or status::text in ('rejected','duplicate')
        order by received_at desc limit 50
      ) e join private.providers p on p.id=e.provider_id),'[]'::jsonb),
      'pendingDeletionRequests',coalesce((select jsonb_agg(jsonb_build_object(
        'id',d.id,'userId',d.user_id,'status',d.status,'requestedAt',d.requested_at,
        'scheduledFor',d.scheduled_for,'blockedReason',d.blocked_reason
      ) order by d.requested_at desc) from (
        select * from private.account_deletion_requests
        where status='pending' order by requested_at desc limit 50
      ) d),'[]'::jsonb)
    ) into v_result;
  elsif v_section='audit' then
    select jsonb_build_object('success',true,'section',v_section,
      'events',coalesce((select jsonb_agg(jsonb_build_object(
        'id',a.id,'actorUserId',a.actor_user_id,'actorType',a.actor_type,
        'action',a.action,'targetType',a.target_type,'targetId',a.target_id,
        'reason',a.reason,'createdAt',a.created_at
      ) order by a.created_at desc) from (
        select * from private.audit_log order by created_at desc limit 100
      ) a),'[]'::jsonb)
    ) into v_result;
  elsif v_section='lc_issuance' then
    select jsonb_build_object('success',true,'section',v_section,
      'issuance',coalesce((select jsonb_agg(jsonb_build_object(
        'id',i.id,'userId',i.user_id,'sourceType',i.source_type,'sourceEventId',i.source_event_id,
        'amountAtoms',i.lc_amount_atoms,'transactionId',i.journal_transaction_id,'createdAt',i.created_at
      ) order by i.created_at desc) from (
        select * from private.game_lootcoin_issuance order by created_at desc limit 100
      ) i),'[]'::jsonb),
      'transactions',coalesce((select jsonb_agg(jsonb_build_object(
        'id',t.id,'userId',la.owner_user_id,'eventType',t.event_type,'source',t.source_system,
        'sourceEventId',t.source_event_id,'status',t.status::text,
        'reversalOf',t.reversal_of,'description',t.description,'createdAt',t.created_at,
        'entries',coalesce((select jsonb_agg(jsonb_build_object(
          'walletKind',je.wallet_kind::text,'currency',je.currency_code,
          'direction',je.direction::text,'amountAtoms',je.amount
        ) order by je.id) from private.journal_entries je where je.transaction_id=t.id),'[]'::jsonb)
      ) order by t.created_at desc) from (
        select distinct jt.* from private.journal_transactions jt
        join private.journal_entries je on je.transaction_id=jt.id
        join private.ledger_accounts la on la.id=je.account_id
        where (la.wallet_kind::text='loot_coins' and la.currency_code='LC')
          or (la.wallet_kind::text='game_credits' and la.currency_code='LC')
        order by jt.created_at desc limit 100
      ) t join private.journal_entries e on e.transaction_id=t.id
        join private.ledger_accounts la on la.id=e.account_id and la.owner_user_id is not null),'[]'::jsonb)
    ) into v_result;
  end if;

  insert into private.audit_log(actor_user_id,actor_type,action,target_type,metadata)
  values(p_actor_user_id,'admin','admin_cockpit_section_view',v_section,
    jsonb_build_object('section',v_section,'view','read_only'));
  return v_result;
end;
$fn$;
revoke all on function public.admin_cockpit_section(uuid,text) from public,anon,authenticated;
grant execute on function public.admin_cockpit_section(uuid,text) to service_role;

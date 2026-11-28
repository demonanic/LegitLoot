-- Phase 2 export extension. Preserve original export as v1 and extend it with
-- owner-linked records omitted from initial payload. Export age attestation DOB
-- as personal data so it can be included in an account portability request.
alter function public.export_account_data() rename to export_account_data_v1;
revoke all on function public.export_account_data_v1() from public, anon, authenticated;

create or replace function public.export_account_data()
returns jsonb
language plpgsql stable security definer set search_path=''
as $$
declare
  v_user uuid := auth.uid();
  v_base jsonb;
  v_extra jsonb;
begin
  if v_user is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if private.is_account_deleted(v_user) then raise exception 'Account deleted' using errcode = '28000'; end if;
  v_base := public.export_account_data_v1();

  select jsonb_build_object(
    'policyConsent', coalesce((select jsonb_agg(jsonb_build_object(
      'termsVersion',c.terms_version,'privacyVersion',c.privacy_version,
      'ageConfirmed',c.age_confirmed,'acceptedAt',c.accepted_at,'userAgent',c.user_agent
    ) order by c.accepted_at) from private.signup_policy_consent c where c.user_id=v_user),'[]'::jsonb),
    'policyAcceptanceHistory', coalesce((select jsonb_agg(jsonb_build_object(
      'policyType',a.policy_type,'policyVersion',a.policy_version,'acceptedAt',a.accepted_at,'source',a.source
    ) order by a.accepted_at) from private.account_policy_acceptances a where a.user_id=v_user),'[]'::jsonb),
    'ageVerification', coalesce((select jsonb_agg(jsonb_build_object(
      'dateOfBirth',a.date_of_birth,'ageEligible',a.age_eligible,
      'agePolicyVersion',a.age_policy_version,'verifiedAt',a.verified_at
    ) order by a.verified_at) from private.account_age_verifications a where a.user_id=v_user),'[]'::jsonb),
    'rewardDisputes', coalesce((select jsonb_agg(jsonb_build_object(
      'disputeId',d.id,'provider',d.provider,'offerReference',d.offer_reference,
      'description',d.description,'status',d.status,'resolution',d.resolution,
      'createdAt',d.created_at,'updatedAt',d.updated_at,'resolvedAt',d.resolved_at,
      'events',coalesce((select jsonb_agg(jsonb_build_object(
        'event',e.event,'actorType',e.actor_type,'note',e.note,'createdAt',e.created_at
      ) order by e.created_at) from private.reward_dispute_events e where e.dispute_id=d.id),'[]'::jsonb)
    ) order by d.created_at) from private.reward_disputes d where d.user_id=v_user),'[]'::jsonb),
    'accountDeletionRequests', coalesce((select jsonb_agg(jsonb_build_object(
      'status',r.status,'requestedAt',r.requested_at,'scheduledFor',r.scheduled_for,
      'cancelledAt',r.cancelled_at,'blockedReason',r.blocked_reason,
      'dataClearedAt',r.data_cleared_at,'completedAt',r.completed_at
    ) order by r.requested_at) from private.account_deletion_requests r where r.user_id=v_user),'[]'::jsonb),
    'gameEvents', coalesce((select jsonb_agg(jsonb_build_object(
      'gameId',e.game_id,'eventType',e.event_type,'payload',e.payload,'createdAt',e.created_at
    ) order by e.created_at) from private.game_events e where e.user_id=v_user),'[]'::jsonb),
    'rewardAllocations', coalesce((select jsonb_agg(jsonb_build_object(
      'cashAmountMinor',a.cash_amount_minor,'cashStatus',a.cash_status::text,
      'gameCreditUnits',a.game_credit_units,'provisionalUnits',a.game_credit_provisional_units,
      'deferredUnits',a.game_credit_deferred_units,'settlementReference',a.settlement_reference,
      'createdAt',a.created_at,'settledAt',a.settled_at
    ) order by a.created_at) from private.reward_allocations a where a.user_id=v_user),'[]'::jsonb),
    'tapResearchRewards', coalesce((select jsonb_agg(jsonb_build_object(
      'offerIdentifier',r.offer_identifier,'payoutAmount',r.payout_amount,
      'payoutCurrency',r.payout_currency,'payoutType',r.payout_type,
      'reviewStatus',r.review_status,'receivedAt',r.received_at
    ) order by r.received_at) from private.tapresearch_rewards r where r.user_id=v_user),'[]'::jsonb),
    'cpagripConversions', coalesce((select jsonb_agg(jsonb_build_object(
      'offerId',c.offer_id,'providerStatus',c.provider_status,
      'repeatableAtCompletion',c.repeatable_at_completion,'rewardState',c.reward_state,
      'receivedAt',c.received_at,'providerCompletedAt',c.provider_completed_at,
      'reversedAt',c.reversed_at,'metadata',c.metadata
    ) order by c.received_at) from private.cpagrip_conversions c where c.user_id=v_user),'[]'::jsonb),
    'providerEvents', coalesce((select jsonb_agg(jsonb_build_object(
      'eventType',e.event_type,'grossAmountMinor',e.gross_amount_minor,
      'currencyCode',e.currency_code,'status',e.status::text,
      'receivedAt',e.received_at,'validatedAt',e.validated_at,'settledAt',e.settled_at,
      'rejectionReason',e.rejection_reason
    ) order by e.received_at) from private.provider_events e where e.user_id=v_user),'[]'::jsonb)
  ) into v_extra;

  return v_base || v_extra;
end;
$$;
revoke all on function public.export_account_data() from public,anon;
grant execute on function public.export_account_data() to authenticated;

-- Require a substantive resolution for final outcomes and reject oversized input.
create or replace function public.admin_update_reward_dispute(p_id uuid,p_status text,p_resolution text,p_note text)
returns text language plpgsql security definer set search_path=''
as $$
begin
 if not exists(select 1 from private.admin_users a where a.user_id=auth.uid() and a.is_active) then raise exception 'Admin access required'; end if;
 if p_status not in ('under_review','resolved','rejected','closed') then raise exception 'Invalid status'; end if;
 if length(trim(coalesce(p_note,'')))<3 or length(trim(p_note))>2000 then raise exception 'Audit note required'; end if;
 if p_status in ('resolved','rejected') and length(trim(coalesce(p_resolution,'')))<3 then raise exception 'Resolution required'; end if;
 if p_resolution is not null and length(p_resolution)>4000 then raise exception 'Resolution too long'; end if;
 update private.reward_disputes set status=p_status,
   resolution=case when p_status in ('resolved','rejected') then trim(p_resolution) else null end,
   resolved_at=case when p_status in ('resolved','rejected') then now() else null end,
   updated_at=now()
 where id=p_id;
 if not found then raise exception 'Dispute not found'; end if;
 insert into private.reward_dispute_events(dispute_id,actor_user_id,actor_type,event,note)
 values(p_id,auth.uid(),'admin','status_changed:'||p_status,trim(p_note));
 insert into private.audit_log(actor_user_id,actor_type,action,target_type,target_id,reason)
 values(auth.uid(),'admin','reward.dispute_status_changed','reward_dispute',p_id::text,trim(p_note));
 return p_status;
end $$;
revoke all on function public.admin_update_reward_dispute(uuid,text,text,text) from public,anon;
grant execute on function public.admin_update_reward_dispute(uuid,text,text,text) to authenticated;

-- Enforce the agreed $10 minimum in the isolated staging payout simulator.
begin;
create or replace function public.payout_simulator_create_withdrawal(
  p_actor_user_id uuid,p_target_user_id uuid,p_amount_minor bigint,p_destination_type text,p_destination_label text,p_idempotency_key text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_wallet private.payout_simulator_wallets%rowtype; v_existing private.payout_simulator_withdrawals%rowtype; v_request_id uuid;
begin
  perform private.payout_simulator_assert_owner_target(p_actor_user_id,p_target_user_id);
  if p_amount_minor is null or p_amount_minor<1000 then raise exception 'Simulator minimum withdrawal is $10.00' using errcode='22023'; end if;
  if p_destination_type not in ('paypal','venmo') or p_destination_label is null or length(trim(p_destination_label)) not between 3 and 80 then raise exception 'Valid simulated destination required' using errcode='22023'; end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key)) not between 8 and 128 then raise exception 'Valid idempotency key required' using errcode='22023'; end if;
  insert into private.payout_simulator_wallets(user_id) values(p_target_user_id) on conflict do nothing;
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id for update;
  select * into v_existing from private.payout_simulator_withdrawals where user_id=p_target_user_id and idempotency_key=p_idempotency_key;
  if found then return jsonb_build_object('success',true,'duplicate',true,'withdrawalId',v_existing.id,'status',v_existing.status,'availableMinor',v_wallet.available_minor,'reservedMinor',v_wallet.reserved_minor); end if;
  if v_wallet.available_minor<p_amount_minor then raise exception 'Insufficient simulated funds' using errcode='22023'; end if;
  insert into private.payout_simulator_withdrawals(user_id,actor_user_id,amount_minor,destination_type,destination_label,idempotency_key)
    values(p_target_user_id,p_actor_user_id,p_amount_minor,p_destination_type,trim(p_destination_label),p_idempotency_key) returning id into v_request_id;
  update private.payout_simulator_wallets set available_minor=available_minor-p_amount_minor,reserved_minor=reserved_minor+p_amount_minor,updated_at=now()
    where user_id=p_target_user_id returning * into v_wallet;
  insert into private.payout_simulator_events(user_id,actor_user_id,event_type,entity_type,entity_id,amount_minor,details)
    values(p_target_user_id,p_actor_user_id,'test_withdrawal_requested','withdrawal',v_request_id::text,p_amount_minor,jsonb_build_object('destinationType',p_destination_type,'simulated',true));
  return jsonb_build_object('success',true,'duplicate',false,'withdrawalId',v_request_id,'status','pending_review','availableMinor',v_wallet.available_minor,'reservedMinor',v_wallet.reserved_minor);
end;
$$;
create or replace function public.payout_simulator_state(p_actor_user_id uuid,p_target_user_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_wallet private.payout_simulator_wallets%rowtype; v_withdrawals jsonb; v_events jsonb;
begin
  perform private.payout_simulator_assert_owner_target(p_actor_user_id,p_target_user_id);
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id;
  select coalesce(jsonb_agg(jsonb_build_object('id',w.id,'amountMinor',w.amount_minor,'destinationType',w.destination_type,
    'destinationLabel',w.destination_label,'status',w.status,'decisionReason',w.decision_reason,'providerOutcome',w.provider_outcome,'createdAt',w.created_at)
    order by w.created_at desc),'[]'::jsonb) into v_withdrawals
  from (select * from private.payout_simulator_withdrawals where user_id=p_target_user_id order by created_at desc limit 50) w;
  select coalesce(jsonb_agg(jsonb_build_object('id',e.id,'eventType',e.event_type,'entityType',e.entity_type,'entityId',e.entity_id,
    'amountMinor',e.amount_minor,'details',e.details,'createdAt',e.created_at,'actorUserId',e.actor_user_id)
    order by e.created_at desc),'[]'::jsonb) into v_events
  from (select * from private.payout_simulator_events where user_id=p_target_user_id order by created_at desc limit 100) e;
  return jsonb_build_object('success',true,'simulated',true,'targetUserId',p_target_user_id,
    'wallet',jsonb_build_object('availableMinor',coalesce(v_wallet.available_minor,0),'reservedMinor',coalesce(v_wallet.reserved_minor,0),
      'paidMinor',coalesce(v_wallet.paid_minor,0),'totalIssuedMinor',coalesce(v_wallet.total_issued_minor,0)),
    'withdrawals',v_withdrawals,'events',v_events,
    'rules',jsonb_build_object('minimumMinor',1000,'maxIssuePerCallMinor',25000,'maxLifetimeIssuedMinor',100000));
end;
$$;
commit;
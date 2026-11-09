-- Allow the staging owner to simulate activity for a selected registered player.
-- All balances and records remain in the isolated simulator tables.
alter table private.payout_simulator_fund_issues
  add column actor_user_id uuid references auth.users(id) on delete restrict;
alter table private.payout_simulator_withdrawals
  add column actor_user_id uuid references auth.users(id) on delete restrict;

-- Preserve attribution for any existing owner-only test records.
update private.payout_simulator_fund_issues set actor_user_id=user_id where actor_user_id is null;
update private.payout_simulator_withdrawals set actor_user_id=user_id where actor_user_id is null;
alter table private.payout_simulator_fund_issues alter column actor_user_id set not null;
alter table private.payout_simulator_withdrawals alter column actor_user_id set not null;

create or replace function private.payout_simulator_assert_owner_target(p_actor_user_id uuid,p_target_user_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if coalesce(nullif(current_setting('request.jwt.claim.role',true),''),
      nullif((nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'role'),'')) is distinct from 'service_role' then
    raise exception 'Service role required' using errcode='42501';
  end if;
  if not exists(select 1 from private.admin_users where user_id=p_actor_user_id and admin_role='owner' and is_active) then
    raise exception 'Active owner required' using errcode='42501';
  end if;
  if p_target_user_id is null or not exists(select 1 from public.profiles where id=p_target_user_id) then
    raise exception 'Target must be a registered player' using errcode='22023';
  end if;
end;
$$;

create or replace function public.payout_simulator_targets(p_actor_user_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_accounts jsonb;
begin
  if coalesce(nullif(current_setting('request.jwt.claim.role',true),''),
      nullif((nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'role'),'')) is distinct from 'service_role' then
    raise exception 'Service role required' using errcode='42501';
  end if;
  if not exists(select 1 from private.admin_users where user_id=p_actor_user_id and admin_role='owner' and is_active) then
    raise exception 'Active owner required' using errcode='42501';
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id',p.id,'username',p.username,'displayName',p.display_name,'createdAt',p.created_at
  ) order by p.created_at desc),'[]'::jsonb)
  into v_accounts from public.profiles p;
  return jsonb_build_object('success',true,'accounts',v_accounts);
end;
$$;

drop function public.payout_simulator_issue_funds(uuid,bigint,text,text);
create function public.payout_simulator_issue_funds(
  p_actor_user_id uuid,p_target_user_id uuid,p_amount_minor bigint,p_idempotency_key text,p_reason text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_wallet private.payout_simulator_wallets%rowtype; v_existing private.payout_simulator_fund_issues%rowtype; v_issue_id uuid;
begin
  perform private.payout_simulator_assert_owner_target(p_actor_user_id,p_target_user_id);
  if p_amount_minor is null or p_amount_minor<1 or p_amount_minor>25000 then raise exception 'Test-fund issuance must be between $0.01 and $250.00' using errcode='22023'; end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key)) not between 8 and 128 then raise exception 'Valid idempotency key required' using errcode='22023'; end if;
  if p_reason is null or length(trim(p_reason)) not between 5 and 300 then raise exception 'A reason between 5 and 300 characters is required' using errcode='22023'; end if;
  insert into private.payout_simulator_wallets(user_id) values(p_target_user_id) on conflict do nothing;
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id for update;
  select * into v_existing from private.payout_simulator_fund_issues where user_id=p_target_user_id and idempotency_key=p_idempotency_key;
  if found then return jsonb_build_object('success',true,'duplicate',true,'issueId',v_existing.id,'availableMinor',v_wallet.available_minor,'reservedMinor',v_wallet.reserved_minor,'paidMinor',v_wallet.paid_minor,'totalIssuedMinor',v_wallet.total_issued_minor); end if;
  if v_wallet.total_issued_minor+p_amount_minor>100000 then raise exception 'Staging simulator issuance cap of $1,000.00 reached' using errcode='22023'; end if;
  insert into private.payout_simulator_fund_issues(user_id,actor_user_id,amount_minor,idempotency_key,reason)
    values(p_target_user_id,p_actor_user_id,p_amount_minor,p_idempotency_key,trim(p_reason)) returning id into v_issue_id;
  update private.payout_simulator_wallets set available_minor=available_minor+p_amount_minor,total_issued_minor=total_issued_minor+p_amount_minor,updated_at=now()
    where user_id=p_target_user_id returning * into v_wallet;
  insert into private.payout_simulator_events(user_id,actor_user_id,event_type,entity_type,entity_id,amount_minor,details)
    values(p_target_user_id,p_actor_user_id,'test_funds_issued','fund_issue',v_issue_id::text,p_amount_minor,jsonb_build_object('reason',trim(p_reason),'simulated',true));
  return jsonb_build_object('success',true,'duplicate',false,'issueId',v_issue_id,'availableMinor',v_wallet.available_minor,'reservedMinor',v_wallet.reserved_minor,'paidMinor',v_wallet.paid_minor,'totalIssuedMinor',v_wallet.total_issued_minor);
end;
$$;

drop function public.payout_simulator_create_withdrawal(uuid,bigint,text,text,text);
create function public.payout_simulator_create_withdrawal(
  p_actor_user_id uuid,p_target_user_id uuid,p_amount_minor bigint,p_destination_type text,p_destination_label text,p_idempotency_key text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_wallet private.payout_simulator_wallets%rowtype; v_existing private.payout_simulator_withdrawals%rowtype; v_request_id uuid;
begin
  perform private.payout_simulator_assert_owner_target(p_actor_user_id,p_target_user_id);
  if p_amount_minor is null or p_amount_minor<50 then raise exception 'Simulator minimum is $0.50' using errcode='22023'; end if;
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

drop function public.payout_simulator_decide_withdrawal(uuid,uuid,text,text);
create function public.payout_simulator_decide_withdrawal(
  p_actor_user_id uuid,p_target_user_id uuid,p_withdrawal_id uuid,p_decision text,p_reason text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_request private.payout_simulator_withdrawals%rowtype; v_wallet private.payout_simulator_wallets%rowtype;
begin
  perform private.payout_simulator_assert_owner_target(p_actor_user_id,p_target_user_id);
  if p_decision not in ('approve','reject') or p_reason is null or length(trim(p_reason)) not between 5 and 300 then raise exception 'Decision and reason are required' using errcode='22023'; end if;
  select * into v_request from private.payout_simulator_withdrawals where id=p_withdrawal_id and user_id=p_target_user_id for update;
  if not found or v_request.status<>'pending_review' then raise exception 'Withdrawal is not awaiting review for this player' using errcode='22023'; end if;
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id for update;
  if p_decision='approve' then
    update private.payout_simulator_withdrawals set status='approved',actor_user_id=p_actor_user_id,decision_reason=trim(p_reason),decided_at=now() where id=p_withdrawal_id;
  else
    update private.payout_simulator_wallets set available_minor=available_minor+v_request.amount_minor,reserved_minor=reserved_minor-v_request.amount_minor,updated_at=now() where user_id=p_target_user_id;
    update private.payout_simulator_withdrawals set status='rejected',actor_user_id=p_actor_user_id,decision_reason=trim(p_reason),decided_at=now() where id=p_withdrawal_id;
  end if;
  insert into private.payout_simulator_events(user_id,actor_user_id,event_type,entity_type,entity_id,amount_minor,details)
    values(p_target_user_id,p_actor_user_id,'test_withdrawal_'||p_decision,'withdrawal',p_withdrawal_id::text,v_request.amount_minor,jsonb_build_object('reason',trim(p_reason),'simulated',true));
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id;
  return jsonb_build_object('success',true,'status',case when p_decision='approve' then 'approved' else 'rejected' end,'availableMinor',v_wallet.available_minor,'reservedMinor',v_wallet.reserved_minor,'paidMinor',v_wallet.paid_minor);
end;
$$;

drop function public.payout_simulator_provider_result(uuid,uuid,text);
create function public.payout_simulator_provider_result(
  p_actor_user_id uuid,p_target_user_id uuid,p_withdrawal_id uuid,p_outcome text
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_request private.payout_simulator_withdrawals%rowtype; v_wallet private.payout_simulator_wallets%rowtype; v_new_status text;
begin
  perform private.payout_simulator_assert_owner_target(p_actor_user_id,p_target_user_id);
  if p_outcome not in ('pending','success','failure') then raise exception 'Invalid simulated provider outcome' using errcode='22023'; end if;
  select * into v_request from private.payout_simulator_withdrawals where id=p_withdrawal_id and user_id=p_target_user_id for update;
  if not found or v_request.status not in ('approved','processing') then raise exception 'Withdrawal must be approved for this player before provider simulation' using errcode='22023'; end if;
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id for update;
  if p_outcome='pending' then
    v_new_status:='processing';
    update private.payout_simulator_withdrawals set status='processing',actor_user_id=p_actor_user_id,provider_outcome='pending' where id=p_withdrawal_id;
  elsif p_outcome='success' then
    v_new_status:='paid';
    update private.payout_simulator_wallets set reserved_minor=reserved_minor-v_request.amount_minor,paid_minor=paid_minor+v_request.amount_minor,updated_at=now() where user_id=p_target_user_id;
    update private.payout_simulator_withdrawals set status='paid',actor_user_id=p_actor_user_id,provider_outcome='success',completed_at=now() where id=p_withdrawal_id;
  else
    v_new_status:='failed';
    update private.payout_simulator_wallets set available_minor=available_minor+v_request.amount_minor,reserved_minor=reserved_minor-v_request.amount_minor,updated_at=now() where user_id=p_target_user_id;
    update private.payout_simulator_withdrawals set status='failed',actor_user_id=p_actor_user_id,provider_outcome='failure',completed_at=now() where id=p_withdrawal_id;
  end if;
  insert into private.payout_simulator_events(user_id,actor_user_id,event_type,entity_type,entity_id,amount_minor,details)
    values(p_target_user_id,p_actor_user_id,'test_provider_'||p_outcome,'withdrawal',p_withdrawal_id::text,v_request.amount_minor,jsonb_build_object('simulated',true,'outcome',p_outcome));
  select * into v_wallet from private.payout_simulator_wallets where user_id=p_target_user_id;
  return jsonb_build_object('success',true,'status',v_new_status,'availableMinor',v_wallet.available_minor,'reservedMinor',v_wallet.reserved_minor,'paidMinor',v_wallet.paid_minor);
end;
$$;

drop function public.payout_simulator_state(uuid);
create function public.payout_simulator_state(p_actor_user_id uuid,p_target_user_id uuid)
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
    'rules',jsonb_build_object('minimumMinor',50,'maxIssuePerCallMinor',25000,'maxLifetimeIssuedMinor',100000));
end;
$$;

revoke all on function private.payout_simulator_assert_owner_target(uuid,uuid) from public,anon,authenticated;
revoke all on function public.payout_simulator_targets(uuid) from public,anon,authenticated;
revoke all on function public.payout_simulator_issue_funds(uuid,uuid,bigint,text,text) from public,anon,authenticated;
revoke all on function public.payout_simulator_create_withdrawal(uuid,uuid,bigint,text,text,text) from public,anon,authenticated;
revoke all on function public.payout_simulator_decide_withdrawal(uuid,uuid,uuid,text,text) from public,anon,authenticated;
revoke all on function public.payout_simulator_provider_result(uuid,uuid,uuid,text) from public,anon,authenticated;
revoke all on function public.payout_simulator_state(uuid,uuid) from public,anon,authenticated;
grant execute on function public.payout_simulator_targets(uuid) to service_role;
grant execute on function public.payout_simulator_issue_funds(uuid,uuid,bigint,text,text) to service_role;
grant execute on function public.payout_simulator_create_withdrawal(uuid,uuid,bigint,text,text,text) to service_role;
grant execute on function public.payout_simulator_decide_withdrawal(uuid,uuid,uuid,text,text) to service_role;
grant execute on function public.payout_simulator_provider_result(uuid,uuid,uuid,text) to service_role;
grant execute on function public.payout_simulator_state(uuid,uuid) to service_role;

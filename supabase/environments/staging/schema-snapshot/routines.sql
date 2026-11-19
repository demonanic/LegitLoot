-- READ-ONLY SNAPSHOT of deployed staging routines
-- Captured: 2026-11-19
-- Project ref: scmnxcsggquwtuyyjnnj
-- Source: pg_get_functiondef() via Supabase read-only SQL inspection.
-- WARNING: This is NOT the original game_platform_foundation migration file.
-- It records current routine definitions only; it is not a migration and must
-- not be replayed without a separately reviewed schema/migration plan.

-- private.payout_simulator_assert_owner_target(p_actor_user_id uuid, p_target_user_id uuid)
CREATE OR REPLACE FUNCTION private.payout_simulator_assert_owner_target(p_actor_user_id uuid, p_target_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- private.process_offerwall_gg_postback(p_user_id uuid, p_transaction_id text, p_status text, p_amount_atoms bigint, p_offer_id text, p_offer_name text, p_goal_id text, p_payload_digest text)
CREATE OR REPLACE FUNCTION private.process_offerwall_gg_postback(p_user_id uuid, p_transaction_id text, p_status text, p_amount_atoms bigint, p_offer_id text, p_offer_name text, p_goal_id text, p_payload_digest text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_conversion private.offerwall_gg_conversions%rowtype;
  v_user_account uuid;
  v_platform_account uuid;
  v_event_id bigint;
  v_existing_event record;
  v_journal_id uuid;
  v_key text;
  v_entries jsonb;
begin
  if p_user_id is null or p_transaction_id is null or length(p_transaction_id) < 8
     or p_status not in ('credited','reversed')
     or p_amount_atoms = 0
     or p_payload_digest is null then
    raise exception 'Invalid Offerwall.GG callback data';
  end if;

  if (p_status = 'credited' and p_amount_atoms < 0)
     or (p_status = 'reversed' and p_amount_atoms > 0) then
    raise exception 'Callback amount sign does not match status';
  end if;

  insert into private.offerwall_gg_callback_events(
    transaction_id, callback_status, user_id, amount_atoms, payload_digest, result
  ) values (
    p_transaction_id, p_status, p_user_id, p_amount_atoms, p_payload_digest, 'received'
  )
  on conflict (transaction_id, callback_status) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    select user_id, amount_atoms, payload_digest
    into v_existing_event
    from private.offerwall_gg_callback_events
    where transaction_id = p_transaction_id and callback_status = p_status;

    if v_existing_event.user_id = p_user_id
       and v_existing_event.amount_atoms = p_amount_atoms
       and v_existing_event.payload_digest = p_payload_digest then
      return jsonb_build_object('result','duplicate');
    end if;

    raise exception 'Conflicting duplicate Offerwall.GG callback';
  end if;

  select id into v_user_account
  from private.ledger_accounts
  where owner_user_id = p_user_id
    and account_code = 'lootcoins_available'
    and wallet_kind = 'game_credits'
    and currency_code = 'LC'
  for update;

  select id into v_platform_account
  from private.ledger_accounts
  where is_system = true
    and account_code = 'platform_lootcoins_issuance'
    and wallet_kind = 'game_credits'
    and currency_code = 'LC'
  for update;

  if v_user_account is null or v_platform_account is null then
    raise exception 'LootCoins ledger accounts are not initialized';
  end if;

  if p_status = 'credited' then
    if exists (select 1 from private.offerwall_gg_conversions where transaction_id = p_transaction_id) then
      raise exception 'Conversion already exists with a different callback state';
    end if;

    insert into private.offerwall_gg_conversions(
      transaction_id,user_id,amount_atoms,status,offer_id,offer_name,goal_id
    ) values (
      p_transaction_id,p_user_id,p_amount_atoms,'credited',p_offer_id,p_offer_name,p_goal_id
    );

    v_key := 'offerwall-gg:credit:' || p_transaction_id;
    v_entries := jsonb_build_array(
      jsonb_build_object('account_id',v_platform_account,'wallet_kind','game_credits','currency_code','LC','direction','debit','amount',p_amount_atoms),
      jsonb_build_object('account_id',v_user_account,'wallet_kind','game_credits','currency_code','LC','direction','credit','amount',p_amount_atoms)
    );
  else
    select * into v_conversion
    from private.offerwall_gg_conversions
    where transaction_id = p_transaction_id
    for update;

    if not found then
      raise exception 'Reversal arrived before its original credit';
    end if;
    if v_conversion.user_id <> p_user_id or v_conversion.amount_atoms <> abs(p_amount_atoms) then
      raise exception 'Reversal does not match original conversion';
    end if;
    if v_conversion.status = 'reversed' then
      update private.offerwall_gg_callback_events set result='duplicate_reversal' where id=v_event_id;
      return jsonb_build_object('result','duplicate_reversal');
    end if;

    update private.offerwall_gg_conversions
    set status='reversed', reversed_at=now()
    where transaction_id=p_transaction_id;

    v_key := 'offerwall-gg:reversal:' || p_transaction_id;
    v_entries := jsonb_build_array(
      jsonb_build_object('account_id',v_user_account,'wallet_kind','game_credits','currency_code','LC','direction','debit','amount',abs(p_amount_atoms)),
      jsonb_build_object('account_id',v_platform_account,'wallet_kind','game_credits','currency_code','LC','direction','credit','amount',abs(p_amount_atoms))
    );
  end if;

  v_journal_id := private.post_journal_transaction(
    v_key,
    case when p_status='credited' then 'offerwall_gg_credit' else 'offerwall_gg_reversal' end,
    'offerwall_gg',
    p_transaction_id || ':' || p_status,
    case when p_status='credited' then 'Offerwall.GG LootCoins credit' else 'Offerwall.GG LootCoins reversal' end,
    v_entries,
    jsonb_build_object('transaction_id',p_transaction_id,'offer_id',p_offer_id,'goal_id',p_goal_id)
  );

  update private.offerwall_gg_callback_events
  set result='posted'
  where id=v_event_id;

  return jsonb_build_object('result','posted','journal_transaction_id',v_journal_id);
end;
$function$;

-- private.provision_initial_owner_admin(p_user_id uuid)
CREATE OR REPLACE FUNCTION private.provision_initial_owner_admin(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_role text;
begin
  v_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif((nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'), '')
  );

  if v_role is distinct from 'service_role' then
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
$function$;

-- private.record_offerwall_gg_metadata(p_user_id uuid, p_transaction_id text, p_currency_name text, p_payout_usd numeric, p_provider_timestamp timestamp with time zone)
CREATE OR REPLACE FUNCTION private.record_offerwall_gg_metadata(p_user_id uuid, p_transaction_id text, p_currency_name text, p_payout_usd numeric, p_provider_timestamp timestamp with time zone)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if p_user_id is null or p_transaction_id is null then
    raise exception 'Invalid Offerwall.GG metadata identity';
  end if;
  if p_payout_usd is not null and (p_payout_usd < 0 or p_payout_usd > 1000000000) then
    raise exception 'Invalid provider payout amount';
  end if;

  update private.offerwall_gg_conversions
  set currency_name = coalesce(p_currency_name, currency_name),
      payout_usd = coalesce(p_payout_usd, payout_usd),
      provider_timestamp = coalesce(p_provider_timestamp, provider_timestamp)
  where transaction_id = p_transaction_id
    and user_id = p_user_id;

  if not found then
    raise exception 'Offerwall.GG conversion not found for metadata update';
  end if;
end;
$function$;

-- private.reject_payout_simulator_event_mutation()
CREATE OR REPLACE FUNCTION private.reject_payout_simulator_event_mutation()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  raise exception 'Simulator event history is append-only';
end;
$function$;

-- public.admin_dashboard_payload(p_actor_user_id uuid, p_section text)
CREATE OR REPLACE FUNCTION public.admin_dashboard_payload(p_actor_user_id uuid, p_section text DEFAULT 'overview'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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

-- public.payout_simulator_create_withdrawal(p_actor_user_id uuid, p_target_user_id uuid, p_amount_minor bigint, p_destination_type text, p_destination_label text, p_idempotency_key text)
CREATE OR REPLACE FUNCTION public.payout_simulator_create_withdrawal(p_actor_user_id uuid, p_target_user_id uuid, p_amount_minor bigint, p_destination_type text, p_destination_label text, p_idempotency_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- public.payout_simulator_decide_withdrawal(p_actor_user_id uuid, p_target_user_id uuid, p_withdrawal_id uuid, p_decision text, p_reason text)
CREATE OR REPLACE FUNCTION public.payout_simulator_decide_withdrawal(p_actor_user_id uuid, p_target_user_id uuid, p_withdrawal_id uuid, p_decision text, p_reason text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- public.payout_simulator_issue_funds(p_actor_user_id uuid, p_target_user_id uuid, p_amount_minor bigint, p_idempotency_key text, p_reason text)
CREATE OR REPLACE FUNCTION public.payout_simulator_issue_funds(p_actor_user_id uuid, p_target_user_id uuid, p_amount_minor bigint, p_idempotency_key text, p_reason text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- public.payout_simulator_provider_result(p_actor_user_id uuid, p_target_user_id uuid, p_withdrawal_id uuid, p_outcome text)
CREATE OR REPLACE FUNCTION public.payout_simulator_provider_result(p_actor_user_id uuid, p_target_user_id uuid, p_withdrawal_id uuid, p_outcome text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- public.payout_simulator_state(p_actor_user_id uuid, p_target_user_id uuid)
CREATE OR REPLACE FUNCTION public.payout_simulator_state(p_actor_user_id uuid, p_target_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- public.payout_simulator_targets(p_actor_user_id uuid)
CREATE OR REPLACE FUNCTION public.payout_simulator_targets(p_actor_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- public.process_offerwall_gg_postback(p_user_id uuid, p_transaction_id text, p_status text, p_amount_atoms bigint, p_offer_id text, p_offer_name text, p_goal_id text, p_payload_digest text)
CREATE OR REPLACE FUNCTION public.process_offerwall_gg_postback(p_user_id uuid, p_transaction_id text, p_status text, p_amount_atoms bigint, p_offer_id text, p_offer_name text, p_goal_id text, p_payload_digest text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;

  return private.process_offerwall_gg_postback(
    p_user_id,p_transaction_id,p_status,p_amount_atoms,
    p_offer_id,p_offer_name,p_goal_id,p_payload_digest
  );
end;
$function$;

-- public.provision_initial_owner_admin(p_user_id uuid)
CREATE OR REPLACE FUNCTION public.provision_initial_owner_admin(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_role text;
begin
  v_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif((nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'), '')
  );

  if v_role is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;

  perform private.provision_initial_owner_admin(p_user_id);
end;
$function$;

-- public.record_offerwall_gg_metadata(p_user_id uuid, p_transaction_id text, p_currency_name text, p_payout_usd numeric, p_provider_timestamp timestamp with time zone)
CREATE OR REPLACE FUNCTION public.record_offerwall_gg_metadata(p_user_id uuid, p_transaction_id text, p_currency_name text, p_payout_usd numeric, p_provider_timestamp timestamp with time zone)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  perform private.record_offerwall_gg_metadata(
    p_user_id,p_transaction_id,p_currency_name,p_payout_usd,p_provider_timestamp
  );
end;
$function$;

-- public.store_cpagrip_attribution_token(p_token_hash text, p_user_id uuid, p_offer_id text, p_expires_at timestamp with time zone)
CREATE OR REPLACE FUNCTION public.store_cpagrip_attribution_token(p_token_hash text, p_user_id uuid, p_offer_id text DEFAULT NULL::text, p_expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval))
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_id uuid;
begin
  if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid token hash' using errcode = '22023';
  end if;
  insert into private.cpagrip_attribution_tokens (token_hash, user_id, offer_id, expires_at)
  values (p_token_hash, p_user_id, nullif(left(coalesce(p_offer_id, ''), 128), ''), p_expires_at)
  returning id into v_id;
  return v_id;
end;
$function$;

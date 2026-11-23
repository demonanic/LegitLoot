-- Step 3 and 5: Moonetix pending/reconciliation/approval lifecycle and player wallet RPC.
-- Staging-targeted: this migration requires private.admin_users. Production parity is a separate gate.
do $guard$
begin
  if to_regclass('private.admin_users') is null then
    raise exception 'This staging migration requires private.admin_users; do not apply to production';
  end if;
end;
$guard$;

alter table private.moonetix_reward_events
  add column if not exists pending_journal_transaction_id uuid
    references private.journal_transactions(id),
  add column if not exists approval_journal_transaction_id uuid
    references private.journal_transactions(id);

create or replace function private.record_moonetix_event(
  p_user_id uuid,
  p_transaction_id text,
  p_event_id text,
  p_status integer,
  p_currency_code text,
  p_reward_raw text,
  p_payout_usd_raw text,
  p_payload_digest text,
  p_signature_valid boolean,
  p_is_test boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_event_id uuid;
  v_existing private.moonetix_reward_events%rowtype;
  v_original private.moonetix_reward_events%rowtype;
  v_original_id uuid;
  v_status text;
  v_reward_atoms bigint;
begin
  if p_user_id is null or p_transaction_id is null or trim(p_transaction_id) = ''
    or p_event_id is null or trim(p_event_id) = ''
    or p_payload_digest is null or trim(p_payload_digest) = '' then
    raise exception 'Moonetix event identifiers and player are required';
  end if;
  if p_status not in (1,2) then raise exception 'Unsupported Moonetix status'; end if;
  if p_currency_code <> 'EL' then raise exception 'Moonetix reward currency must be EL'; end if;

  if p_status = 1 and coalesce(p_signature_valid,false) and not coalesce(p_is_test,false) then
    if p_reward_raw is null or trunc(p_reward_raw::numeric*1000) <> p_reward_raw::numeric*1000
      or p_reward_raw::numeric*1000 > 9223372036854775807 then
      raise exception 'Moonetix reward cannot be represented safely in EL atoms';
    end if;
    v_reward_atoms := (p_reward_raw::numeric*1000)::bigint;
  end if;

  if p_status = 2 then
    select * into v_original
    from private.moonetix_reward_events
    where provider_transaction_id = p_transaction_id and provider_status = 1
    for update;
    if v_original.id is null then
      raise exception 'Reversal arrived without a known original credit';
    end if;
    if v_original.user_id <> p_user_id or v_original.currency_code <> p_currency_code
      or v_original.reward_raw::numeric <> p_reward_raw::numeric then
      raise exception 'Moonetix reversal does not match the original player reward';
    end if;
    v_original_id := v_original.id;
    v_status := case when coalesce(p_signature_valid,false) then 'reversal_pending' else 'rejected' end;
  else
    v_status := case when coalesce(p_signature_valid,false) then 'pending_verification' else 'rejected' end;
  end if;
  if coalesce(p_is_test,false) then v_status := 'test'; end if;

  insert into private.moonetix_reward_events(
    user_id,provider_transaction_id,provider_event_id,provider_status,currency_code,
    reward_raw,payout_usd_raw,reward_atoms,payload_digest,signature_valid,status,original_event_id,is_test
  ) values (
    p_user_id,p_transaction_id,p_event_id,p_status::smallint,p_currency_code,
    p_reward_raw,p_payout_usd_raw,v_reward_atoms,p_payload_digest,coalesce(p_signature_valid,false),v_status,v_original_id,coalesce(p_is_test,false)
  )
  on conflict (provider_event_id) do nothing
  returning id into v_event_id;

  if v_event_id is not null then
    insert into private.earned_loot_reward_audit(reward_event_id,action,reason,metadata)
    values(v_event_id,'callback_received',case when p_signature_valid then null else 'Signature validation failed' end,
      jsonb_build_object('provider_status',p_status,'payload_digest',p_payload_digest));
    return v_event_id;
  end if;

  select * into v_existing
  from private.moonetix_reward_events
  where provider_event_id=p_event_id
  for update;

  if v_existing.payload_digest is distinct from p_payload_digest
    or v_existing.provider_transaction_id is distinct from p_transaction_id
    or v_existing.user_id is distinct from p_user_id
    or v_existing.provider_status is distinct from p_status
    or v_existing.signature_valid is distinct from coalesce(p_signature_valid,false)
    or v_existing.is_test is distinct from coalesce(p_is_test,false)
    or v_existing.currency_code is distinct from p_currency_code
    or v_existing.reward_raw is distinct from p_reward_raw
    or v_existing.payout_usd_raw is distinct from p_payout_usd_raw then
    raise exception 'Moonetix event ID reused with conflicting payload';
  end if;
  return v_existing.id;
end;
$fn$;
revoke all on function private.record_moonetix_event(uuid,text,text,integer,text,text,text,text,boolean,boolean)
  from public,anon,authenticated;
grant execute on function private.record_moonetix_event(uuid,text,text,integer,text,text,text,text,boolean,boolean)
  to service_role;

create or replace function public.record_moonetix_postback(
  p_user_id uuid,
  p_transaction_id text,
  p_event_id text,
  p_status integer,
  p_currency_code text,
  p_reward_raw text,
  p_payout_usd_raw text,
  p_payload_digest text,
  p_signature_valid boolean,
  p_is_test boolean default false
)
returns uuid
language sql
security definer
set search_path = ''
as $fn$
  select private.record_moonetix_event(
    p_user_id,p_transaction_id,p_event_id,p_status,p_currency_code,
    p_reward_raw,p_payout_usd_raw,p_payload_digest,p_signature_valid,p_is_test
  );
$fn$;
revoke all on function public.record_moonetix_postback(uuid,text,text,integer,text,text,text,text,boolean,boolean)
  from public,anon,authenticated;
grant execute on function public.record_moonetix_postback(uuid,text,text,integer,text,text,text,text,boolean,boolean)
  to service_role;

create or replace function private.reconcile_moonetix_credit(
  p_reward_event_id uuid,
  p_config_version_id bigint,
  p_report_transaction_id text,
  p_report_user_id uuid,
  p_report_reward_raw text,
  p_report_payout_usd_raw text,
  p_report_status text,
  p_provider_credited_at timestamptz,
  p_reconciliation_reference text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_event private.moonetix_reward_events%rowtype;
  v_config private.moonetix_reward_config_versions%rowtype;
  v_reward_atoms numeric;
  v_value_cents bigint;
  v_pending_account uuid;
  v_issuance_account uuid;
  v_tx uuid;
begin
  select * into v_event
  from private.moonetix_reward_events
  where id=p_reward_event_id
  for update;
  if not found then raise exception 'Moonetix reward event not found'; end if;
  if v_event.status in ('pending_review','approved') then
    if v_event.config_version_id is distinct from p_config_version_id
      or v_event.provider_credited_at is distinct from p_provider_credited_at
      or v_event.reconciliation_reference is distinct from p_reconciliation_reference
      or p_report_status is distinct from 'credited'
      or p_report_transaction_id is distinct from v_event.provider_transaction_id
      or p_report_user_id is distinct from v_event.user_id
      or p_report_reward_raw is null or p_report_reward_raw::numeric <> v_event.reward_raw::numeric
      or p_report_payout_usd_raw is null or p_report_payout_usd_raw::numeric <> v_event.payout_usd_raw::numeric then
      raise exception 'Reward was already reconciled against different provider/configuration facts';
    end if;
    return coalesce(v_event.pending_journal_transaction_id,v_event.approval_journal_transaction_id);
  end if;
  if v_event.is_test or v_event.provider_status <> 1 or v_event.status <> 'pending_verification'
    or not v_event.signature_valid then
    raise exception 'Event is not eligible for credit reconciliation';
  end if;
  if p_reconciliation_reference is null or trim(p_reconciliation_reference) = ''
    or p_provider_credited_at is null then
    raise exception 'Provider credited timestamp and reconciliation reference are required';
  end if;
  if p_report_status <> 'credited'
    or p_report_transaction_id is distinct from v_event.provider_transaction_id
    or p_report_user_id is distinct from v_event.user_id
    or p_report_reward_raw is null
    or p_report_reward_raw::numeric <> v_event.reward_raw::numeric
    or p_report_payout_usd_raw is null
    or p_report_payout_usd_raw::numeric <> v_event.payout_usd_raw::numeric then
    raise exception 'Moonetix Reporting API record does not match the signed postback';
  end if;

  select * into v_config
  from private.moonetix_reward_config_versions
  where id=p_config_version_id and is_verified=true;
  if not found then raise exception 'Verified Moonetix configuration snapshot required'; end if;
  if v_config.currency_code <> 'EL' then raise exception 'Provider currency mismatch'; end if;
  if p_provider_credited_at < v_config.effective_from
    or (v_config.effective_to is not null and p_provider_credited_at >= v_config.effective_to) then
    raise exception 'Configuration snapshot was not effective when Moonetix credited the event';
  end if;
  if v_config.rounding_mode='whole' and position('.' in v_event.reward_raw)>0 then
    raise exception 'Fractional reward conflicts with whole-number provider rounding snapshot';
  end if;

  v_reward_atoms := v_event.reward_raw::numeric * 1000;
  if v_reward_atoms <= 0 or trunc(v_reward_atoms) <> v_reward_atoms
    or v_reward_atoms > 9223372036854775807 then
    raise exception 'Moonetix reward cannot be represented safely in EL atoms';
  end if;
  v_value_cents := round((v_event.reward_raw::numeric / v_config.conversion_rate) * 100)::bigint;

  select id into v_pending_account
  from private.ledger_accounts
  where owner_user_id=v_event.user_id and account_code='earned_loot_pending'
    and wallet_kind='earned_loot' and currency_code='EL';
  select id into v_issuance_account
  from private.ledger_accounts
  where is_system=true and account_code='platform_earned_loot_issuance'
    and wallet_kind='earned_loot' and currency_code='EL';
  if v_pending_account is null or v_issuance_account is null then
    raise exception 'Earned Loot ledger accounts are not provisioned';
  end if;

  v_tx := private.post_journal_transaction(
    'moonetix-pending:'||v_event.id::text,
    'moonetix_reward_pending','moonetix',v_event.provider_transaction_id,
    'Moonetix reward pending verification',
    jsonb_build_array(
      jsonb_build_object('account_id',v_issuance_account,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',v_reward_atoms::bigint),
      jsonb_build_object('account_id',v_pending_account,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',v_reward_atoms::bigint)
    ),
    jsonb_build_object('reward_event_id',v_event.id,'reward_raw',v_event.reward_raw,
      'payout_usd_raw',v_event.payout_usd_raw,'split_percent',v_config.split_percent,
      'conversion_rate',v_config.conversion_rate,'bonus_percent',v_config.bonus_percent,
      'rounding_mode',v_config.rounding_mode,'config_version_id',v_config.id)
  );

  update private.moonetix_reward_events
  set config_version_id=v_config.id,
      reward_atoms=v_reward_atoms::bigint,
      cash_equivalent_cents=v_value_cents,
      split_percent_snapshot=v_config.split_percent,
      conversion_rate_snapshot=v_config.conversion_rate,
      bonus_percent_snapshot=v_config.bonus_percent,
      rounding_mode_snapshot=v_config.rounding_mode,
      provider_credited_at=p_provider_credited_at,
      reconciled_at=now(),
      reconciliation_reference=p_reconciliation_reference,
      pending_journal_transaction_id=v_tx,
      status='pending_review'
  where id=v_event.id;

  insert into private.earned_loot_reward_audit(reward_event_id,action,reason,metadata)
  values(v_event.id,'reconciled',p_reconciliation_reference,
    jsonb_build_object('pending_journal_transaction_id',v_tx,'reward_atoms',v_reward_atoms::bigint,
      'cash_equivalent_cents',v_value_cents,'config_version_id',v_config.id));
  return v_tx;
end;
$fn$;
revoke all on function private.reconcile_moonetix_credit(uuid,bigint,text,uuid,text,text,text,timestamptz,text) from public,anon,authenticated;
grant execute on function private.reconcile_moonetix_credit(uuid,bigint,text,uuid,text,text,text,timestamptz,text) to service_role;

create or replace function private.reconcile_moonetix_reversal(
  p_reversal_event_id uuid,
  p_report_transaction_id text,
  p_report_user_id uuid,
  p_report_reward_raw text,
  p_report_status text,
  p_provider_reversed_at timestamptz,
  p_reconciliation_reference text
)
returns void
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_event private.moonetix_reward_events%rowtype;
  v_original private.moonetix_reward_events%rowtype;
begin
  select * into v_event from private.moonetix_reward_events
  where id=p_reversal_event_id for update;
  if not found then raise exception 'Moonetix reversal event not found'; end if;
  if v_event.status in ('reversal_pending','reversed','held') and v_event.reconciled_at is not null then
    if v_event.provider_reversed_at is distinct from p_provider_reversed_at
      or v_event.reconciliation_reference is distinct from p_reconciliation_reference
      or p_report_status is distinct from 'reversed'
      or p_report_transaction_id is distinct from v_event.provider_transaction_id
      or p_report_user_id is distinct from v_event.user_id
      or p_report_reward_raw is null or p_report_reward_raw::numeric <> v_event.reward_raw::numeric then
      raise exception 'Reversal was already reconciled against different provider facts';
    end if;
    return;
  end if;
  if v_event.is_test or v_event.provider_status<>2 or v_event.status<>'reversal_pending'
    or not v_event.signature_valid or v_event.original_event_id is null then
    raise exception 'Event is not eligible for reversal reconciliation';
  end if;
  if p_report_status<>'reversed'
    or p_report_transaction_id is distinct from v_event.provider_transaction_id
    or p_report_user_id is distinct from v_event.user_id
    or p_report_reward_raw is null
    or p_report_reward_raw::numeric<>v_event.reward_raw::numeric
    or p_provider_reversed_at is null
    or p_reconciliation_reference is null or trim(p_reconciliation_reference)='' then
    raise exception 'Moonetix Reporting API reversal does not match the signed postback';
  end if;

  select * into v_original from private.moonetix_reward_events
  where id=v_event.original_event_id for update;
  if not found or v_original.provider_credited_at is null
    or p_provider_reversed_at<v_original.provider_credited_at then
    raise exception 'Original provider credit or reversal timestamp is invalid';
  end if;

  update private.moonetix_reward_events
  set provider_reversed_at=p_provider_reversed_at,
      reconciled_at=now(),
      reconciliation_reference=p_reconciliation_reference
  where id=v_event.id;
  insert into private.earned_loot_reward_audit(reward_event_id,action,reason,metadata)
  values(v_event.id,'reversal_reconciled',p_reconciliation_reference,
    jsonb_build_object('provider_reversed_at',p_provider_reversed_at,'original_event_id',v_original.id));
end;
$fn$;
revoke all on function private.reconcile_moonetix_reversal(uuid,text,uuid,text,text,timestamptz,text)
  from public,anon,authenticated;
grant execute on function private.reconcile_moonetix_reversal(uuid,text,uuid,text,text,timestamptz,text)
  to service_role;

create or replace function private.approve_moonetix_reward(p_reward_event_id uuid,p_reason text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_actor uuid := auth.uid();
  v_event private.moonetix_reward_events%rowtype;
  v_pending uuid;
  v_available uuid;
  v_tx uuid;
begin
  if v_actor is null or not exists(
    select 1 from private.admin_users
    where user_id=v_actor and is_active=true and admin_role in ('owner','admin')
  ) then raise exception 'Owner or active admin authorization required'; end if;

  select * into v_event from private.moonetix_reward_events
  where id=p_reward_event_id for update;
  if not found then raise exception 'Reward event not found'; end if;
  if v_event.status = 'approved' and v_event.approval_journal_transaction_id is not null then
    return v_event.approval_journal_transaction_id;
  end if;
  if exists (
    select 1 from private.moonetix_reward_events r
    where r.original_event_id=v_event.id and r.provider_status=2
      and r.status in ('reversal_pending','held','reversed')
  ) then
    raise exception 'Reward has a provider reversal and cannot be approved';
  end if;
  if v_event.status <> 'pending_review' or v_event.provider_status <> 1
    or not v_event.signature_valid or v_event.reconciled_at is null
    or v_event.reconciliation_reference is null or v_event.reward_atoms is null
    or v_event.cash_equivalent_cents is null or v_event.config_version_id is null
    or v_event.pending_journal_transaction_id is null then
    raise exception 'Reward is not verified and reconciled for approval';
  end if;

  select id into v_pending from private.ledger_accounts
  where owner_user_id=v_event.user_id and account_code='earned_loot_pending'
    and wallet_kind='earned_loot';
  select id into v_available from private.ledger_accounts
  where owner_user_id=v_event.user_id and account_code='earned_loot_available'
    and wallet_kind='earned_loot';
  if v_pending is null or v_available is null then
    raise exception 'Earned Loot accounts are not provisioned';
  end if;

  v_tx := private.post_journal_transaction(
    'moonetix-approval:'||v_event.id::text,
    'moonetix_reward_approval','internal',v_event.id::text,
    'Approved Earned Loot reward',
    jsonb_build_array(
      jsonb_build_object('account_id',v_pending,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',v_event.reward_atoms),
      jsonb_build_object('account_id',v_available,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',v_event.reward_atoms)
    ),
    jsonb_build_object('reward_event_id',v_event.id,'provider_transaction_id',v_event.provider_transaction_id,
      'provider_reward_raw',v_event.reward_raw,'provider_payout_usd_raw',v_event.payout_usd_raw,
      'split_percent_snapshot',v_event.split_percent_snapshot,'config_version_id',v_event.config_version_id)
  );

  insert into private.earned_loot_lots(
    reward_event_id,user_id,original_atoms,remaining_atoms,original_value_cents,remaining_value_cents
  ) values (
    v_event.id,v_event.user_id,v_event.reward_atoms,v_event.reward_atoms,
    v_event.cash_equivalent_cents,v_event.cash_equivalent_cents
  );

  update private.moonetix_reward_events
  set status='approved',approval_actor=v_actor,approval_at=now(),
      approval_journal_transaction_id=v_tx,journal_transaction_id=v_tx
  where id=v_event.id;

  insert into private.earned_loot_reward_audit(reward_event_id,actor_user_id,action,reason,metadata)
  values(v_event.id,v_actor,'approved',p_reason,jsonb_build_object('journal_transaction_id',v_tx));
  return v_tx;
end;
$fn$;
revoke all on function private.approve_moonetix_reward(uuid,text) from public,anon;
grant execute on function private.approve_moonetix_reward(uuid,text) to authenticated;

create or replace function private.reject_moonetix_reward(p_reward_event_id uuid,p_reason text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_actor uuid := auth.uid();
  v_event private.moonetix_reward_events%rowtype;
  v_pending uuid;
  v_issuance uuid;
  v_tx uuid;
begin
  if v_actor is null or not exists(
    select 1 from private.admin_users
    where user_id=v_actor and is_active=true and admin_role in ('owner','admin')
  ) then raise exception 'Owner or active admin authorization required'; end if;
  if p_reason is null or trim(p_reason)='' then raise exception 'Rejection reason is required'; end if;

  select * into v_event from private.moonetix_reward_events
  where id=p_reward_event_id for update;
  if not found then raise exception 'Reward event not found'; end if;
  if v_event.status='rejected' then return v_event.journal_transaction_id; end if;
  if v_event.status not in ('pending_verification','pending_review') then
    raise exception 'Reward is not eligible for rejection';
  end if;

  if v_event.pending_journal_transaction_id is not null then
    select id into v_pending from private.ledger_accounts
    where owner_user_id=v_event.user_id and account_code='earned_loot_pending' and wallet_kind='earned_loot';
    select id into v_issuance from private.ledger_accounts
    where is_system=true and account_code='platform_earned_loot_issuance' and wallet_kind='earned_loot';
    v_tx := private.post_journal_transaction(
      'moonetix-reject:'||v_event.id::text,'moonetix_reward_rejection','internal',v_event.id::text,
      'Rejected pending Earned Loot reward',
      jsonb_build_array(
        jsonb_build_object('account_id',v_pending,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',v_event.reward_atoms),
        jsonb_build_object('account_id',v_issuance,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',v_event.reward_atoms)
      ),jsonb_build_object('reward_event_id',v_event.id,'reason',p_reason)
    );
  end if;

  update private.moonetix_reward_events
  set status='rejected',rejection_reason=p_reason,approval_actor=v_actor,approval_at=now()
  where id=v_event.id;
  insert into private.earned_loot_reward_audit(reward_event_id,actor_user_id,action,reason,metadata)
  values(v_event.id,v_actor,'rejected',p_reason,jsonb_build_object('journal_transaction_id',v_tx));
  return v_tx;
end;
$fn$;
revoke all on function private.reject_moonetix_reward(uuid,text) from public,anon;
grant execute on function private.reject_moonetix_reward(uuid,text) to authenticated;

create or replace function public.reconcile_moonetix_credit_report(
  p_report_transaction_id text,
  p_report_user_id text,
  p_report_reward_raw text,
  p_report_payout_usd_raw text,
  p_provider_credited_at timestamptz,
  p_report_reference text
)
returns text
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_event private.moonetix_reward_events%rowtype;
  v_config_id bigint;
begin
  if p_report_transaction_id is null or p_report_user_id is null
    or p_report_reward_raw is null or p_report_payout_usd_raw is null
    or p_provider_credited_at is null or p_report_reference is null then
    raise exception 'Incomplete Moonetix Reporting API credit record';
  end if;

  select * into v_event from private.moonetix_reward_events
  where provider_transaction_id=p_report_transaction_id
    and provider_status=1
  for update;

  if not found then
    insert into private.moonetix_reconciliation_gaps(
      provider_transaction_id,provider_status,user_id,reward_raw,payout_usd_raw,
      provider_credited_at,report_reference,reason
    ) values (
      p_report_transaction_id,'credited',p_report_user_id,p_report_reward_raw,p_report_payout_usd_raw,
      p_provider_credited_at,p_report_reference,'missing_credit_postback'
    )
    on conflict(provider_transaction_id,provider_status) do update
      set user_id=excluded.user_id,reward_raw=excluded.reward_raw,payout_usd_raw=excluded.payout_usd_raw,
          provider_credited_at=excluded.provider_credited_at,report_reference=excluded.report_reference,
          reason=excluded.reason,last_seen_at=now(),resolved_at=null,resolution=null;
    return 'missing_credit_postback';
  end if;

  if v_event.user_id::text is distinct from p_report_user_id
    or v_event.reward_raw::numeric is distinct from p_report_reward_raw::numeric
    or v_event.payout_usd_raw::numeric is distinct from p_report_payout_usd_raw::numeric then
    raise exception 'Reporting API credit does not match the stored callback';
  end if;

  select id into v_config_id
  from private.moonetix_reward_config_versions
  where is_verified=true and currency_code='EL'
    and effective_from<=p_provider_credited_at
    and (effective_to is null or p_provider_credited_at<effective_to);
  if v_config_id is null then
    insert into private.moonetix_reconciliation_gaps(
      provider_transaction_id,provider_status,user_id,reward_raw,payout_usd_raw,
      provider_credited_at,report_reference,reason
    ) values (
      p_report_transaction_id,'credited',p_report_user_id,p_report_reward_raw,p_report_payout_usd_raw,
      p_provider_credited_at,p_report_reference,'verified_config_missing_for_credited_at'
    )
    on conflict(provider_transaction_id,provider_status) do update
      set report_reference=excluded.report_reference,reason=excluded.reason,last_seen_at=now(),
          resolved_at=null,resolution=null;
    return 'verified_config_missing';
  end if;

  perform private.reconcile_moonetix_credit(
    v_event.id,v_config_id,p_report_transaction_id,v_event.user_id,
    p_report_reward_raw,p_report_payout_usd_raw,'credited',p_provider_credited_at,p_report_reference
  );

  update private.moonetix_reconciliation_gaps
  set resolved_at=now(),resolution='matched_and_reconciled',last_seen_at=now()
  where provider_transaction_id=p_report_transaction_id and provider_status='credited';
  return 'reconciled';
end;
$fn$;
revoke all on function public.reconcile_moonetix_credit_report(text,text,text,text,timestamptz,text)
  from public,anon,authenticated;
grant execute on function public.reconcile_moonetix_credit_report(text,text,text,text,timestamptz,text)
  to service_role;

create or replace function public.reconcile_moonetix_reversal_report(
  p_report_transaction_id text,
  p_report_user_id text,
  p_report_reward_raw text,
  p_report_payout_usd_raw text,
  p_provider_reversed_at timestamptz,
  p_report_reference text
)
returns text
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_event private.moonetix_reward_events%rowtype;
begin
  if p_report_transaction_id is null or p_report_user_id is null
    or p_report_reward_raw is null or p_report_payout_usd_raw is null or p_provider_reversed_at is null
    or p_report_reference is null then
    raise exception 'Incomplete Moonetix Reporting API reversal record';
  end if;

  select * into v_event from private.moonetix_reward_events
  where provider_transaction_id=p_report_transaction_id
    and provider_status=2
  for update;

  if not found then
    insert into private.moonetix_reconciliation_gaps(
      provider_transaction_id,provider_status,user_id,reward_raw,payout_usd_raw,
      provider_reversed_at,report_reference,reason
    ) values (
      p_report_transaction_id,'reversed',p_report_user_id,p_report_reward_raw,p_report_payout_usd_raw,
      p_provider_reversed_at,p_report_reference,'missing_reversal_postback'
    )
    on conflict(provider_transaction_id,provider_status) do update
      set user_id=excluded.user_id,reward_raw=excluded.reward_raw,payout_usd_raw=excluded.payout_usd_raw,
          provider_reversed_at=excluded.provider_reversed_at,report_reference=excluded.report_reference,
          reason=excluded.reason,last_seen_at=now(),resolved_at=null,resolution=null;
    return 'missing_reversal_postback';
  end if;

  if v_event.user_id::text is distinct from p_report_user_id
    or v_event.reward_raw::numeric is distinct from p_report_reward_raw::numeric
    or v_event.payout_usd_raw::numeric is distinct from p_report_payout_usd_raw::numeric then
    raise exception 'Reporting API reversal does not match the stored callback';
  end if;

  perform private.reconcile_moonetix_reversal(
    v_event.id,p_report_transaction_id,v_event.user_id,p_report_reward_raw,
    'reversed',p_provider_reversed_at,p_report_reference
  );

  update private.moonetix_reconciliation_gaps
  set resolved_at=now(),resolution='matched_and_reconciled',last_seen_at=now()
  where provider_transaction_id=p_report_transaction_id and provider_status='reversed';
  return 'reconciled';
end;
$fn$;
revoke all on function public.reconcile_moonetix_reversal_report(text,text,text,text,timestamptz,text)
  from public,anon,authenticated;
grant execute on function public.reconcile_moonetix_reversal_report(text,text,text,text,timestamptz,text)
  to service_role;

create or replace function public.get_player_wallet_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_el_available bigint;
  v_el_pending bigint;
  v_lc_available bigint;
  v_el_value_cents bigint;
  v_pending_value_cents bigint;
  v_unverified_pending_atoms bigint;
  v_unpriced_pending_count bigint;
begin
  if v_user is null then raise exception 'Authentication required'; end if;

  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
  into v_el_available
  from private.journal_entries e
  join private.journal_transactions t on t.id=e.transaction_id
  join private.ledger_accounts a on a.id=e.account_id
  where a.owner_user_id=v_user and a.account_code='earned_loot_available'
    and a.wallet_kind='earned_loot' and e.currency_code='EL' and t.status='posted';

  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
  into v_el_pending
  from private.journal_entries e
  join private.journal_transactions t on t.id=e.transaction_id
  join private.ledger_accounts a on a.id=e.account_id
  where a.owner_user_id=v_user and a.account_code='earned_loot_pending'
    and a.wallet_kind='earned_loot' and e.currency_code='EL' and t.status='posted';

  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
  into v_lc_available
  from private.journal_entries e
  join private.journal_transactions t on t.id=e.transaction_id
  join private.ledger_accounts a on a.id=e.account_id
  where a.owner_user_id=v_user and a.account_code='loot_coins_available'
    and a.wallet_kind='loot_coins' and e.currency_code='LC' and t.status='posted';

  select coalesce(sum(remaining_value_cents),0)
  into v_el_value_cents
  from private.earned_loot_lots
  where user_id=v_user and remaining_atoms>0;

  select coalesce(sum(reward_atoms),0)
  into v_unverified_pending_atoms
  from private.moonetix_reward_events
  where user_id=v_user and status='pending_verification'
    and provider_status=1 and signature_valid=true;

  v_el_pending := v_el_pending + v_unverified_pending_atoms;

  select coalesce(sum(cash_equivalent_cents),0)
  into v_pending_value_cents
  from private.moonetix_reward_events
  where user_id=v_user and status='pending_review' and provider_status=1;

  select count(*) into v_unpriced_pending_count
  from private.moonetix_reward_events
  where user_id=v_user and status='pending_verification'
    and provider_status=1 and signature_valid=true and cash_equivalent_cents is null;

  if v_el_available < 0 or v_el_pending < 0 or v_lc_available < 0 then
    raise exception 'Wallet ledger invariant failed';
  end if;

  return jsonb_build_object(
    'contractVersion',1,
    'earnedLoot',jsonb_build_object(
      'code','EL','unitsLabel','EL',
      'availableUnits',trim_scale(v_el_available::numeric/1000)::text,
      'pendingUnits',trim_scale(v_el_pending::numeric/1000)::text,
      'availableValueCents',v_el_value_cents::text,
      'pendingValueCents',case when v_unpriced_pending_count>0 then null else v_pending_value_cents::text end
    ),
    'lootCoins',jsonb_build_object(
      'code','LC','availableAtoms',v_lc_available::text,
      'cashValue',null,'withdrawable',false,'transferable',false
    ),
    'pendingAvailable',false,'pendingConvertible',false
  );
end;
$fn$;
revoke all on function public.get_player_wallet_summary() from public,anon;
grant execute on function public.get_player_wallet_summary() to authenticated;

revoke all on all tables in schema private from public,anon,authenticated;
grant select,insert,update,delete on all tables in schema private to service_role;
grant usage,select on all sequences in schema private to service_role;

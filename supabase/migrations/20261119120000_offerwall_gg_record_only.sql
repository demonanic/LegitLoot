-- M2-T3 — Offerwall.GG callbacks become record-only (staging lineage).
--
-- Owner-locked policy 2026-11-19 (docs/PLATFORM_BUILD_SPEC.md §0.1): no offerwall,
-- survey, CPA or other provider callback may mint Legit Coins (LC). Audit PROV-07.
--
-- This replaces private.process_offerwall_gg_postback so that a verified callback is
-- still validated, de-duplicated and recorded (callback event + conversion record, for
-- provider reconciliation), but NO ledger account is read or locked and NO journal
-- transaction is posted. Existing journal history is untouched (append-only).
--
-- Result values returned to the Edge Function:
--   recorded            first credited callback stored
--   reversal_recorded   first reversed callback stored and matched to its conversion
--   duplicate           identical retry of any stored callback (credit or reversal)
-- (There is deliberately no separate "duplicate_reversal": events are unique per
-- (transaction_id, callback_status), so a repeated reversal is always an identical
-- retry and returns "duplicate"; a differing one raises.)
--
-- Apply to STAGING ONLY after review. Production has a different migration lineage
-- (supabase/environments/production/migrations-archive/, audit MIG-01) and a separate
-- owner containment decision; do not apply this file to production as-is.
-- Deploy order: apply this migration BEFORE deploying the matching Edge Function, so
-- the function never receives an unexpected result.

begin;

create or replace function private.process_offerwall_gg_postback(
  p_user_id uuid,
  p_transaction_id text,
  p_status text,
  p_amount_atoms bigint,
  p_offer_id text,
  p_offer_name text,
  p_goal_id text,
  p_payload_digest text
) returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_conversion private.offerwall_gg_conversions%rowtype;
  v_event_id bigint;
  v_existing_event record;
begin
  if p_user_id is null or p_transaction_id is null or length(p_transaction_id) < 8
     or p_status not in ('credited','reversed')
     or p_amount_atoms is null or p_amount_atoms = 0
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

  if p_status = 'credited' then
    if exists (select 1 from private.offerwall_gg_conversions where transaction_id = p_transaction_id) then
      raise exception 'Conversion already exists with a different callback state';
    end if;

    -- Provider-side record only. 'credited' is the provider's status; it does not
    -- mean LegitLoot credited any LC.
    insert into private.offerwall_gg_conversions(
      transaction_id, user_id, amount_atoms, status, offer_id, offer_name, goal_id
    ) values (
      p_transaction_id, p_user_id, p_amount_atoms, 'credited', p_offer_id, p_offer_name, p_goal_id
    );

    update private.offerwall_gg_callback_events set result = 'recorded' where id = v_event_id;
    return jsonb_build_object('result','recorded');
  end if;

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
    -- Unreachable while callback events are retained (see header); fail closed.
    raise exception 'Conversion already reversed';
  end if;

  update private.offerwall_gg_conversions
  set status = 'reversed', reversed_at = now()
  where transaction_id = p_transaction_id;

  update private.offerwall_gg_callback_events set result = 'reversal_recorded' where id = v_event_id;
  return jsonb_build_object('result','reversal_recorded');
end;
$function$;

comment on function private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) is
  'Record-only (2026-11-19): validates, de-duplicates and records Offerwall.GG callbacks. Never posts LC. Spec §0.1, audit PROV-07.';

revoke all on function private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) from public, anon, authenticated;

commit;

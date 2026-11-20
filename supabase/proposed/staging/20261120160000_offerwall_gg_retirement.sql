-- Offerwall.GG permanent retirement — STAGING-ONLY PROPOSAL. NOT APPLIED. DO NOT APPLY
-- until DaVinci has independently reviewed this exact file and the staging project ref
-- (scmnxcsggquwtuyyjnnj) is confirmed. See docs/security/OFFERWALL_GG_RETIREMENT.md.
--
-- Deliberately outside supabase/migrations/ so no `db push` can pick it up, and never
-- for production (production has a separate lineage and owner-gated cleanup).
--
-- What it does (reversible, no data deleted):
--   1. Replaces both callback routines (private + public wrappers) with bodies that
--      always raise, so no Offerwall.GG traffic can be processed or recorded.
--   2. Revokes EXECUTE on all four from every role, including service_role.
--   3. Marks the disabled provider row 'retired' and clears reward-model, approval and
--      terms metadata. The row is kept for audit.
-- It does NOT touch: private.offerwall_gg_callback_events, private.offerwall_gg_conversions,
-- journal/ledger tables, platform_settings, migrations history, or any other provider row.
--
-- Recovery plan (FORWARD-ONLY, FAIL-CLOSED — there is deliberately no rollback to the old path):
--   Offerwall.GG is permanently retired (docs/security/OFFERWALL_GG_RETIREMENT.md). If this
--   file or the tombstone deploy fails or partly applies, REPAIR AND RE-APPLY THE RETIREMENT
--   STATE; never restore the previous behavior. Specifically:
--     * keep the Edge Functions as inert HTTP 410 tombstones;
--     * keep EXECUTE revoked from public, anon, authenticated and service_role on all four routines;
--     * keep the provider row 'retired' with reward-model, approval and terms metadata cleared.
--   Do NOT re-apply the record-only callback migration, recreate the old wrappers, re-grant
--   EXECUTE, or restore provider metadata from any snapshot, even as a "rollback". Any such
--   change needs a new explicit owner decision. Every statement below is idempotent, so it is
--   safe to re-run after a partial failure; the transaction below makes it all-or-nothing.
--   Pre-apply, read-only: record the current provider row and routine grants as audit
--   evidence (not as a restore source) and confirm the project ref is scmnxcsggquwtuyyjnnj.

begin;

create or replace function private.process_offerwall_gg_postback(
  p_user_id uuid, p_transaction_id text, p_status text, p_amount_atoms bigint,
  p_offer_id text, p_offer_name text, p_goal_id text, p_payload_digest text
) returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
begin
  raise exception 'Offerwall.GG is permanently retired';
end;
$function$;

create or replace function private.record_offerwall_gg_metadata(
  p_user_id uuid, p_transaction_id text, p_currency_name text, p_payout_usd numeric,
  p_provider_timestamp timestamp with time zone
) returns void
language plpgsql
security definer
set search_path to ''
as $function$
begin
  raise exception 'Offerwall.GG is permanently retired';
end;
$function$;

create or replace function public.process_offerwall_gg_postback(
  p_user_id uuid, p_transaction_id text, p_status text, p_amount_atoms bigint,
  p_offer_id text, p_offer_name text, p_goal_id text, p_payload_digest text
) returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
begin
  raise exception 'Offerwall.GG is permanently retired';
end;
$function$;

create or replace function public.record_offerwall_gg_metadata(
  p_user_id uuid, p_transaction_id text, p_currency_name text, p_payout_usd numeric,
  p_provider_timestamp timestamp with time zone
) returns void
language plpgsql
security definer
set search_path to ''
as $function$
begin
  raise exception 'Offerwall.GG is permanently retired';
end;
$function$;

revoke all on function private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) from public, anon, authenticated, service_role;
revoke all on function private.record_offerwall_gg_metadata(uuid,text,text,numeric,timestamp with time zone) from public, anon, authenticated, service_role;
revoke all on function public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) from public, anon, authenticated, service_role;
revoke all on function public.record_offerwall_gg_metadata(uuid,text,text,numeric,timestamp with time zone) from public, anon, authenticated, service_role;

update private.providers
set status = 'retired',
    approved_reward_model = null,
    approval_reference = null,
    terms_url = null,
    terms_verified_at = null,
    updated_at = now()
where provider_key = 'offerwall_gg';

commit;

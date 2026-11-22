-- TapResearch Eligibility API — rewards postback, record-only (STAGING LINEAGE).
--
-- Source: https://supply-docs.tapresearch.com/llms-eligibility-api.txt (read 2026-11-22).
-- Policy: docs/PLATFORM_BUILD_SPEC.md §0.1 (no provider callback mints Legit Coins) and §0.5
-- (two balances: only verified AND approved Hustle completions may credit the separate USD
-- cash ledger; payouts stay off). This migration stores verified TapResearch rewards for
-- review and reconciliation. It reads and posts NO ledger account (LC or cash).
--
-- cpid is TapResearch's unique reward id ("use it to credit each reward once"); tid is the
-- click id and is NOT used for identity. A retry with the same cpid, uid and payout_amount is
-- a duplicate; a cpid that reappears with different core values is rejected (raise → the Edge
-- Function returns 500 and the conflict is visible in logs).
--
-- provider_uid is kept as text: the dashboard "Test rewards postback" and test-device runs may
-- send a uid that is not a LegitLoot account. user_id is filled only when uid is the id of an+-- existing auth user.
--
-- Apply to STAGING ONLY. Production application is owner-gated.

begin;

create table if not exists private.tapresearch_rewards (
  id bigint generated always as identity primary key,
  cpid text not null unique check (length(cpid) between 1 and 128),
  provider_uid text not null check (length(provider_uid) between 1 and 128),
  user_id uuid references auth.users(id) on delete set null,
  payout_amount bigint not null check (payout_amount >= 0),
  payout_currency text,
  payout_type integer,
  revenue_usd numeric(18,6) check (revenue_usd is null or revenue_usd >= 0),
  offer_identifier text,
  tid text,
  did text,
  review_status text not null default 'pending_review'
    check (review_status in ('pending_review','approved','rejected')),
  received_at timestamptz not null default now()
);

comment on table private.tapresearch_rewards is
  'Verified TapResearch reward postbacks (record-only). Never posts LC; cash posting requires separate owner-approved review. Spec §0.1/§0.5.';

alter table private.tapresearch_rewards enable row level security;
revoke all on table private.tapresearch_rewards from public, anon, authenticated;

create or replace function private.record_tapresearch_reward(
  p_cpid text,
  p_uid text,
  p_payout_amount bigint,
  p_payout_currency text,
  p_payout_type integer,
  p_revenue_usd numeric,
  p_offer_identifier text,
  p_tid text,
  p_did text
) returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_id bigint;
  v_user_id uuid;
  v_existing record;
begin
  if p_cpid is null or length(p_cpid) not between 1 and 128
     or p_uid is null or length(p_uid) not between 1 and 128
     or p_payout_amount is null or p_payout_amount < 0
     or p_revenue_usd < 0 then
    raise exception 'Invalid TapResearch reward data';
  end if;

  if p_uid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    select id into v_user_id from auth.users where id = p_uid::uuid;
  end if;

  insert into private.tapresearch_rewards(
    cpid, provider_uid, user_id, payout_amount, payout_currency, payout_type,
    revenue_usd, offer_identifier, tid, did
  ) values (
    p_cpid, p_uid, v_user_id, p_payout_amount, p_payout_currency, p_payout_type,
    p_revenue_usd, p_offer_identifier, p_tid, p_did
  )
  on conflict (cpid) do nothing
  returning id into v_id;

  if v_id is not null then
    return jsonb_build_object('result','recorded');
  end if;

  select * into v_existing
  from private.tapresearch_rewards where cpid = p_cpid;

  -- A retry is idempotent only when every provider-supplied event field we store
  -- matches the original. IS NOT DISTINCT FROM treats NULL/NULL as equal.
  if v_existing.provider_uid is not distinct from p_uid
     and v_existing.payout_amount is not distinct from p_payout_amount
     and v_existing.payout_currency is not distinct from p_payout_currency
     and v_existing.payout_type is not distinct from p_payout_type
     and v_existing.revenue_usd is not distinct from p_revenue_usd
     and v_existing.offer_identifier is not distinct from p_offer_identifier
     and v_existing.tid is not distinct from p_tid
     and v_existing.did is not distinct from p_did then
    return jsonb_build_object('result','duplicate');
  end if;

  raise exception 'Conflicting duplicate TapResearch reward (cpid reused with different values)';
end;
$function$;

revoke all on function private.record_tapresearch_reward(text,text,bigint,text,integer,numeric,text,text,text)
  from public, anon, authenticated;

-- Service-role-only wrapper so the Edge Function can call it through PostgREST.
create or replace function public.record_tapresearch_reward(
  p_cpid text,
  p_uid text,
  p_payout_amount bigint,
  p_payout_currency text,
  p_payout_type integer,
  p_revenue_usd numeric,
  p_offer_identifier text,
  p_tid text,
  p_did text
) returns jsonb
language sql
security definer
set search_path to ''
as $function$
  select private.record_tapresearch_reward(
    p_cpid, p_uid, p_payout_amount, p_payout_currency, p_payout_type,
    p_revenue_usd, p_offer_identifier, p_tid, p_did
  );
$function$;

revoke all on function public.record_tapresearch_reward(text,text,bigint,text,integer,numeric,text,text,text)
  from public, anon, authenticated;
grant execute on function public.record_tapresearch_reward(text,text,bigint,text,integer,numeric,text,text,text)
  to service_role;

commit;

-- CPAGrip attribution retirement — STAGING-ONLY PROPOSAL. NOT APPLIED. DO NOT APPLY until
-- DaVinci has independently reviewed this exact file, the staging project ref
-- (scmnxcsggquwtuyyjnnj) is confirmed, and the cpagrip-attribution tombstone is DEPLOYED
-- (see docs/security/CPAGRIP_STAGING_RETIREMENT.md for the order).
--
-- Deliberately outside supabase/migrations/ so no `db push` can pick it up, and never for
-- production (production has a separate lineage and owner-gated cleanup).
--
-- What it does (non-destructive, no data deleted; forward-only):
--   Revokes EXECUTE on public.store_cpagrip_attribution_token(text,uuid,text,timestamptz)
--   from PUBLIC, anon, authenticated and service_role. The postgres function owner retains
--   inherent owner execution.
-- It does NOT touch: the function body, private.cpagrip_attribution_tokens (table and any
-- rows), the provider row (stays disabled), journal/ledger tables, migrations history or
-- any other object.
--
-- Recovery plan (FORWARD-ONLY, FAIL-CLOSED): never re-grant EXECUTE as a "rollback". If this
-- partly applies or the tombstone deploy fails, repair and re-apply the retired state; the
-- statement is idempotent. Any re-enable needs a new explicit owner decision.
--
-- Pre-apply, read-only: confirm the project ref and record the current ACL as audit evidence
-- (not a restore source). Expected current ACL: {postgres=X/postgres,service_role=X/postgres}.

begin;

revoke all on function public.store_cpagrip_attribution_token(text, uuid, text, timestamptz)
  from public, anon, authenticated, service_role;

commit;

-- Post-apply verification (read-only; expect all false):
--   select r, has_function_privilege(r, 'public.store_cpagrip_attribution_token(text,uuid,text,timestamptz)', 'EXECUTE')
--   from unnest(array['anon','authenticated','service_role']) r;

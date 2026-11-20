# Offerwall.GG production containment — prepared, not deployed

Date: 2026-11-19
Status: PREPARED FOR REVIEW — NO PRODUCTION ACTION AUTHORIZED OR PERFORMED

## Scope

Owner authorized Option A: prepare and test production containment, preserve existing callback/conversion records and rollback capability, and require separate owner approval before any production deployment or database change.

This branch is based on production `main` commit `4e0f533`. It does not alter production, staging, publisher settings, secrets, schema, data, or callback configuration.

## Containment layers

1. **Edge Function:** the candidate `offerwall-gg-postback/index.ts` returns HTTP 410 for every method. It does not read request bodies, read secrets, create a Supabase client, or call RPCs.
2. **Database RPC privilege:** the prepared SQL below revokes the `service_role` EXECUTE grants on both the private posting routine and public wrapper. Existing conversion and callback event tables are untouched. This prevents the current Edge Function/service-role callback path from invoking the issuer even if an old handler remains deployed.
3. **Provider dashboard:** removing the postback URL is optional defense-in-depth, not the primary control. Do not change the dashboard as part of this PR. Confirm no other provider product depends on the configured callback before removing it.
4. **Frontend:** hide/remove Offerwall.GG as a user-facing earning provider in a separate website change. UI removal is not a security control.

## Prepared database change — review before execution

Use the existing exact function signatures from migration `20261108130000_offerwall_gg_callback_pipeline.sql`:

```sql
begin;

revoke execute on function private.process_offerwall_gg_postback(
  uuid, text, text, bigint, text, text, text, text
) from service_role;

revoke execute on function public.process_offerwall_gg_postback(
  uuid, text, text, bigint, text, text, text, text
) from service_role;

commit;
```

This is privilege containment, not deletion. It preserves the function definitions, conversion rows, callback-event rows, journal history and provider configuration. It also leaves existing service-role application code unable to call either wrapper until explicitly restored.

### Read-only verification query

Run after an approved production change:

```sql
select
  has_function_privilege(
    'service_role',
    'private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)',
    'EXECUTE'
  ) as service_role_can_call_private,
  has_function_privilege(
    'service_role',
    'public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)',
    'EXECUTE'
  ) as service_role_can_call_public,
  has_function_privilege(
    'anon',
    'public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)',
    'EXECUTE'
  ) as anon_can_call_public,
  has_function_privilege(
    'authenticated',
    'public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)',
    'EXECUTE'
  ) as authenticated_can_call_public;
```

Expected after containment: all four values false. Also inspect effective grants and function definitions; do not rely on this query alone.

## Rollback

If explicitly approved and a rollback is required, restore only the service-role grants:

```sql
grant execute on function private.process_offerwall_gg_postback(
  uuid, text, text, bigint, text, text, text, text
) to service_role;

grant execute on function public.process_offerwall_gg_postback(
  uuid, text, text, bigint, text, text, text, text
) to service_role;
```

Restoring grants does **not** re-enable the Edge Function candidate, which remains HTTP 410. Re-enabling callback processing requires a separate reviewed handler release and explicit owner authorization. Do not use rollback merely to restore provider rewards; this would reintroduce the prohibited provider-to-LC path.

## Test plan

- Deno unit tests assert GET, POST and OPTIONS all return 410.
- Assert response has `Cache-Control: no-store`.
- Inspect source to verify no Supabase client, environment secret access, request-body parsing, or RPC invocation remains.
- Run Deno tests in an isolated environment; no real provider callbacks.
- In a production-approved maintenance window only: apply privilege revocations, run read-only privilege checks, inspect Edge Function version, then separately deploy the inert handler. These are two separate production changes and require the owner's explicit final approval.
- Do not send Offerwall.GG dashboard test callbacks; do not remove dashboard URL until provider dependencies are checked.

## Current execution limitation

The connected Supabase account was not accepted by the current Supabase tool session during preparation, so no live project re-query or staging execution test could be completed in this run. The code and SQL were prepared from the production migration/source checked into GitHub; they are not represented as deployed or live-verified.

## Acceptance criteria

- No callback route can invoke the LC posting RPC.
- No provider callback can create or reverse LC journal entries.
- Existing historical conversion, callback-event and journal records remain unchanged.
- Anonymous/authenticated roles and service_role cannot execute the posting wrappers after approved containment.
- All test cases pass.
- Production remains unchanged until separate owner approval.

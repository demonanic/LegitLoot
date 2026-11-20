# Offerwall.GG containment — deployed

Date: 2026-11-20
Status: PRODUCTION CONTAINMENT APPLIED AND PRIVILEGES VERIFIED

## Outcome

Offerwall.GG has been disabled at the application, Edge Function, and database authorization layers. Historical records and provider configuration were preserved.

## Production actions completed

1. Revoked `service_role` EXECUTE on:
   - `private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)`
   - `public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)`
2. Re-queried effective privileges. All four checks returned false:
   - service_role can execute private posting routine
   - service_role can execute public wrapper
   - anon can execute public wrapper
   - authenticated can execute public wrapper
3. Deployed `offerwall-gg-postback` version 4. The handler returns HTTP 410 `OFFERWALL_GG_DISABLED`, sets `Cache-Control: no-store`, and does not read request bodies, secrets, or call Supabase.
4. Deployed `offerwall-gg-wall-url` version 2. The launcher now returns HTTP 410 `OFFERWALL_GG_DISABLED` and no longer creates signed provider URLs.
5. Removed Offerwall.GG from the player earning registry.
6. Updated the Rewards page to state that no offerwall provider, offerwall earnings, or cash payouts are currently active.
7. Updated registry regression coverage to assert Offerwall.GG is absent.

## Database change applied

The exact production SQL executed was:

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

This is privilege containment, not deletion. Function definitions, conversion rows, callback-event rows, journal history, and provider configuration were not intentionally modified.

## Verification

The post-change privilege query returned:

| Principal | Function | EXECUTE |
|---|---|---:|
| service_role | private posting routine | false |
| service_role | public wrapper | false |
| anon | public wrapper | false |
| authenticated | public wrapper | false |

The Supabase control plane reported:
- `offerwall-gg-postback`: ACTIVE, version 4, `verify_jwt=false`
- `offerwall-gg-wall-url`: ACTIVE, version 2, `verify_jwt=true`

The function source was re-read after deployment and matches the inert handlers in this repository branch.

## Remaining external cleanup

The Offerwall.GG publisher dashboard callback URL has not been removed. The endpoint it points to is inert and returns HTTP 410; the database posting functions are no longer executable by the service role. Removing the URL in the publisher dashboard is optional cleanup and requires access to that third-party account. No dashboard settings were changed.

## Limitations

- A live HTTP request against the public function URL could not be completed in this session because the available browser service had insufficient credits and the web retrieval service could not access the endpoint.
- Deno was not installed in the local execution environment. A GitHub Actions workflow is included to run the Deno handler tests and Node earning-registry tests on the main-branch push after merge.
- This containment blocks the Offerwall.GG callback/launcher paths; it does not claim to remove owner-level or database-superuser capabilities.

## Preservation and reactivation

No historical conversion, callback-event, or journal rows were deleted or rewritten as part of this work.

Do not restore the service-role EXECUTE grants or re-enable either provider Edge Function as a routine rollback. Any future reactivation is a new provider integration and must undergo fresh provider approval, security review, callback verification, reconciliation tests, and explicit release authorization.

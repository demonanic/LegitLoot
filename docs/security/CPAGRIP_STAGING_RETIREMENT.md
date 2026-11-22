# CPAGrip attribution — staging retirement proposal (source only, NOT executed)

Status: proposal for independent review. Nothing here has been deployed or applied. CPAGrip
stays disabled; no provider event may ever issue LC. Taplayad is the only initial Hustle
publisher. Staging project ref to confirm before any step: `scmnxcsggquwtuyyjnnj`.

## Why
Staging `cpagrip-attribution` v5 (ACTIVE, `verify_jwt=true`) lets an authenticated caller mint
attribution tokens through `public.store_cpagrip_attribution_token(text,uuid,text,timestamptz)`
(SECURITY DEFINER; EXECUTE currently postgres + service_role only). The token table has 0 rows;
the path never issues LC, but it is a provider path outside the selected publisher. The
canonical source is already an inert HTTP 410 tombstone; this plan retires the live endpoint.

## Order (each step separately authorized; staging only)
1. **Pre-checks (read-only):** confirm project ref; record function version, provider row
   (`disabled`), RPC ACL and the token-table row count as audit evidence. **ABORT and escalate
   to DaVinci if the live RPC ACL differs from the expected `{postgres=X/postgres,service_role=X/postgres}`,
   if the provider row is not `disabled`, or if the project ref is not `scmnxcsggquwtuyyjnnj`.**
2. **Deploy the tombstone first** (`supabase/functions/cpagrip-attribution/index.ts`) so no
   live caller still reaches the RPC.
3. **Apply** `supabase/proposed/staging/20261121120000_cpagrip_attribution_retirement.sql`
   (revokes service_role EXECUTE; owner execution retained).
4. **Verify:** the function is `verify_jwt=true`, so an unauthenticated POST would return a
   gateway 401 and prove nothing. Send an **authenticated staging request with a valid staging
   JWT** and confirm the tombstone handler returns 410 (with no token created); the SQL-footer
   checks return false for anon, authenticated, service_role and a PUBLIC grant (`aclexplode`
   grantee 0); token-table count unchanged.
5. **Manifest timing:** update `supabase/environments/staging/DEPLOYED_FUNCTIONS_MANIFEST.json`
   and the environment records only after steps 2–4 are verified; keep the old snapshot as
   historical evidence.

## Boundaries
No table or token deletion, no schema/data change, no provider-row change, no production
change, no callback. Failure handling is forward-only (repair and re-apply the retired state;
never re-grant EXECUTE or restore the v5 function as a rollback).

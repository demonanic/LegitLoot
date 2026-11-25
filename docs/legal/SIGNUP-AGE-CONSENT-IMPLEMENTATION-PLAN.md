# Signup, 18+ Gate, and Consent — Staging Implementation Plan

**Target:** LegitLoot staging only  
**Branch:** `staging/signup-age-consent`  
**Policy decisions:** 18+; individual operator for now; proposed North Carolina governing law; separate Terms acceptance and Privacy acknowledgement.

## Required behavior

1. Signup collects date of birth and requires the user to affirm they are at least 18.
2. Browser validation is usability only. A server-side trusted function must independently validate the date, reject future/invalid dates, calculate age using the current date, and reject under-18 users.
3. Terms acceptance and Privacy acknowledgement are separate checkboxes, both unchecked by default. Signup cannot proceed unless both are checked.
4. The server records the authenticated user ID, policy key, exact policy version, timestamp, and consent event. Client-submitted version strings must be compared to server-configured current versions; clients cannot select arbitrary versions.
5. Consent evidence is append-only to normal client roles. No client update/delete permissions.
6. DOB is not stored in `public.profiles`. Store it in a restricted private schema/table, inaccessible to anon/authenticated browser roles. Only server-side code may read it. Do not expose DOB in profile reads, RPC responses, analytics, or logs.
7. If DOB is only needed for age eligibility and legal retention rules allow it, evaluate minimizing retention to an eligibility result plus a restricted source record. Do not discard the DOB until counsel confirms the retention approach.
8. Preserve staging-only fail-closed Supabase config and the existing email confirmation redirect to `/account.html`.
9. Signup must fail closed if the age/consent server endpoint is unavailable. Do not create a partially eligible account.
10. Underage or incomplete registrations must not receive access to reward or account features.

## Data model design (proposal; do not apply until schema and RLS/grants are reviewed)

- `private.account_age_verifications`: one row per auth user; DOB, age-check result, policy flow version, created/verified timestamps. Restricted to service role. No public view.
- `private.account_policy_acceptances`: append-only records containing user ID, policy type (`terms` or `privacy`), policy version, accepted timestamp, source event, and minimal audit metadata. Unique constraint prevents accidental duplicate records for the same user/policy/version/event.
- A server-side Edge Function or trusted RPC handles the whole operation, validates age and current policy versions, writes the restricted DOB/eligibility record and both consent records, and returns only success/failure. It must not return DOB.

## Important Supabase design caution

The `private` schema's RLS status alone does not establish whether its tables are reachable through the public Supabase Data API. Exposure depends on exposed schemas, grants, functions, and roles. Inspect schema exposure and grants before making changes. Do not blindly enable RLS on every private table: that may break service-side workflows, and private-schema objects should instead have least-privilege grants and no browser-role access. Validate both direct REST access and all security-definer functions/RPCs.

## Test matrix

- Under 18: rejected server-side; no eligible account or consent record.
- Exactly 18 on the local date: accepted.
- Invalid/future DOB: rejected.
- Missing Terms checkbox: rejected.
- Missing Privacy checkbox: rejected.
- Tampered/obsolete policy version: rejected.
- Direct call bypassing browser form: same server-side validation.
- Endpoint unavailable: fail closed.
- Anon/authenticated direct SELECT/INSERT/UPDATE/DELETE against private age and consent tables: denied.
- DOB absent from public profile, API responses, browser storage, analytics, and logs.
- Email confirmation and redirect continue to work on staging.
- Existing users and password reset/sign-in paths remain unaffected.

## Release gates

No production changes. No merge or deployment without separate approval. Legal drafts remain unpublished until attorney review, operator identity/address are finalized, vendor/retention disclosures are verified, and implementation tests pass.

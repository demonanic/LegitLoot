# LegitLoot Platform Build — Status

**Updated:** 2026-11-07  
**Branch:** `build/legitloot-platform-foundation`  
**Production:** unchanged; no deployment or merge to `main`.

## Completed in this build branch

- Added full platform specification at `docs/PLATFORM_BUILD_SPEC.md`.
- Added dedicated Supabase database bootstrap schema at `supabase/bootstrap/initial_schema.sql`.
- Added separate public pages:
  - `games.html`
  - `earn.html`
  - `marketplace.html`
  - `account.html`
- Added shared page styling and category filters:
  - `portal.css`
  - `portal.js`
- Connected homepage navigation to the new pages.
- Reused the three supplied game artwork assets.
- Added profile ownership RLS and private financial tables.
- Added append-only double-entry journal tables and an idempotent balanced-posting function restricted to service_role.
- Added user wallet account creation for separate cash and game-credit ledgers.
- Provider records and reward policies default disabled.

## Not implemented or verified yet

- Dedicated Supabase project `gkbqderyjcuxnjbsiffb` created in `us-east-1` at the quoted $0/month project cost.
- Initial database migration applied successfully; profile `updated_at` trigger migration also applied.
- Security/performance/health advisors were checked. The table inventory flags RLS disabled on 10 private-schema tables; direct privilege checks confirm `anon` and `authenticated` have no grants on those tables and no USAGE on the private schema. Owner decision is still required on defense-in-depth RLS enablement.
- Supabase email/password signup, login, reset and sign-out UI is connected in the build branch using the project's publishable key. The full flow still needs allowed-redirect configuration and end-to-end testing.
- No Edge Functions, provider postback handlers, Stripe integration, payout rail or offerwall is live.
- No admin interface, provider reconciliation engine, reserve calculator or fraud review workflow is live.
- No automated browser, accessibility, signup, database integration or end-to-end tests have run.
- The badger mascot asset has not yet been integrated into the homepage; existing provisional woman illustration is still present and should be replaced by the approved badger artwork. The mysterious punk character should remain secondary promotional art.

## Business model guardrails

- 50% cash / 50% game-credit split of the player reward pool.
- 75% of game-credit allocation provisional after validated provider confirmation; 25% deferred to settlement/reconciliation.
- Cash rewards remain pending until provider settlement.
- No automatic player debt for ordinary reversals.
- Reserve requirements must be implemented, but exact coverage/buffer percentages must not be invented.
- $10 minimum withdrawal remains proposed, not active.
- Offerwall.GG is a candidate only; its current publisher terms and approval for the exact model must be verified.
- Stripe is not assumed to be an approved payout rail.

## Next required actions

1. Owner decides whether to enable RLS on all 10 private tables as defense-in-depth. No client policies are required; trusted server-side `service_role` access bypasses RLS. See the remediation SQL surfaced in the build handoff.
2. Configure allowed authentication redirect URLs in Supabase without changing the live production Site URL prematurely.
3. Test signup, confirmation, login, reset and sign-out on the branch preview.
4. Implement server-side wallet summary, ledger balance enforcement, provider callbacks, settlement and reconciliation tests.
5. Keep production deployment, domain cutover and merge to `main` blocked pending separate approval.

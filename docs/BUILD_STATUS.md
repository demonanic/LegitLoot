# LegitLoot Platform Build — Status

**Updated:** 2026-11-08  
**Branch:** `build/legitloot-v2` (new isolated V2 work branch; based on `build/legitloot-platform-foundation`)  
**Production:** Cloudflare currently points to `build/legitloot-platform-foundation`; V2 branch is not connected or deployed. No merge to `main`.

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


## V2 build progress — 2026-11-07

- Created isolated branch `build/legitloot-v2`; it is not connected to Cloudflare and has not been deployed.
- Replaced the homepage's provisional punk-woman hero image with the supplied official Demonanic and Gauntlet's Survival game artwork.
- Added a layered, responsive game-first hero visual system.
- Added `how-it-works.html` explaining the separate cash/game-credit model and current feature status.
- Added clearly marked draft `terms.html` and `privacy.html` placeholders. These are not launch-ready legal policies.
- Connected the V2 site navigation and footer to the new guide and legal placeholder pages.
- Added the password-reset completion step: reset links now switch to a new-password form and call Supabase `updateUser`.
- Offerwall.GG verification meta tag remains present in the homepage head.
- Supabase security hardening was applied in project `gkbqderyjcuxnjbsiffb`: RLS enabled on all 10 private-schema financial/provider tables, with no client policies. The matching migration is inherited in V2 from the foundation branch.
- No Offerwall.GG integration, reward issuance, cash payouts, withdrawal API, admin console, or production wallet summaries are active yet.

## V2 next implementation sequence

1. Complete visual pass and verify mobile navigation/layout on actual preview.
2. Inspect and test Supabase signup/login/reset/session handling; correct redirect configuration.
3. Add server-side wallet summary and account activity API without exposing private ledger tables.
4. Implement provider callback verification, idempotency, reversal handling and settlement reconciliation; keep provider disabled until written commercial approval for the exact model.
5. Implement payout eligibility, reserve checks, admin review and audit workflows; no live payouts until legal/provider gates pass.
6. Add integration, security and mobile regression tests.
7. Only after owner review, connect V2 branch to Cloudflare preview or production. No production deployment is authorized by this status update.


## Standard LootCoins / Offerwall.GG work — 2026-11-08

- Owner selected the standard Offerwall.GG virtual-currency model instead of the former 50/50 cash/game-credit allocation.
- Official player reward currency: **LootCoins**; currency code/ticker: **LC**.
- One LC balance is shown in the account wallet. Future cash rewards, if ever approved, remain a separate feature.
- Updated account UI and wallet client to read the `lootCoins.available` field from the authenticated wallet-summary RPC.
- Updated Earn and Rewards pages to explain standard LC rewards and clearly show that Offerwall.GG is not yet active.
- Added migration `20261108120000_standard_lootcoins_wallet.sql` to change the internal currency code to LC, consolidate legacy credit balances into one LootCoins account through balanced immutable journal entries, remove old split settings, seed Offerwall.GG as disabled, and update the secure wallet-summary RPC.
- The migration is committed to the isolated feature branch only. It has **not** been applied to Supabase.
- Offerwall.GG provider remains disabled. No production wall launch, callback endpoint, reward issuance, or payout has been enabled.
- Next: verify current Offerwall.GG publisher callback documentation; implement a server-side signed callback with event idempotency and reversal handling; add tests; apply the migration only after SQL review and a backup/rollback plan; then request publisher re-review.


## Offerwall.GG callback implementation — 2026-11-08

- Reviewed current official Offerwall.GG API and postback documentation.
- Implemented a Supabase Edge Function scaffold at `supabase/functions/offerwall-gg-postback/index.ts`.
- Callback verifies HMAC-SHA256 over the exact signed tuple `userId:transactionId:currencyAmount` and uses constant-time signature comparison.
- Callback handles GET and form-POST delivery, rejects malformed callbacks, never credits dashboard test callbacks, ignores unsigned `payoutUsd` for ledger purposes, and stores fractional LC using 10,000 atoms per LC.
- Added a database conversion lifecycle keyed by transaction ID and callback status, with distinct handling for `credited` and `reversed`; journal entries are balanced and immutable.
- Duplicate credits and duplicate reversals are idempotent. Reversals must match the original player and exact amount; reversal-before-credit is rejected for provider retry.
- Added `docs/OFFERWALL_GG_INTEGRATION.md` with the official callback contract, required secrets, hosted wall format and release checklist.
- No migrations have been applied and no Edge Function has been deployed. Required publisher secret and public placement key have not been provided/configured. Provider remains disabled.


## Signed Offerwall.GG wall entry — 2026-11-08

- Owner supplied public placement key `2d6851696ece3bf3852b5ec542854ed1` (validated as 32 lowercase hex characters).
- Implemented `supabase/functions/offerwall-gg-wall-url/index.ts`: requires an authenticated Supabase bearer token, validates it with Supabase Auth, derives the user ID server-side, and signs canonical sorted `appId` + `userId` parameters with HMAC-SHA256.
- Added an authenticated launcher to the Earn page. It requests the signed URL from the Edge Function and navigates only to an `https://offerwall.gg/wall/` URL.
- Official canonical signing rule verified against Offerwall.GG's current integration guide: sorted query parameters `appId` and `userId`; signature excluded from the signed string. Expiring-link timestamp is not added because expiry is not shown as enabled on the owner's placement.
- No secret key was provided or exposed. Neither Edge Function has been deployed; Supabase secrets are not configured. The migrations remain unapplied and provider remains disabled.
- Placement is still marked pending by Offerwall.GG; the hosted wall will not serve offers until approval.


## Supabase deployment — 2026-11-08

- Owner authorized applying the LootCoins and Offerwall.GG migrations to the production LegitLoot Supabase project.
- Applied `standard_lootcoins_wallet`, `offerwall_gg_callback_pipeline`, and `secure_offerwall_callback_tables` successfully.
- Deployed Edge Function `offerwall-gg-postback` as ACTIVE with JWT verification disabled; the function performs its own HMAC-SHA256 validation.
- Deployed Edge Function `offerwall-gg-wall-url` as ACTIVE with JWT verification enabled; it validates the Supabase user session before generating a signed wall URL.
- Owner confirmed adding `OFFERWALL_GG_PUBLIC_KEY` and `OFFERWALL_GG_SECRET` in Supabase Edge Function secrets. Secret values are not recorded in GitHub.
- Verified database state after migrations: 1 LootCoins account present; 0 journal transactions, 0 journal entries, 0 Offerwall.GG conversions and 0 callback events; provider status remains `disabled`.
- RLS is enabled on both Offerwall.GG callback tables. Security advisor now reports informational RLS-without-policy findings for private-schema tables; these tables have no client policies and remain intended for trusted service-role access only.
- Existing `get_wallet_summary()` SECURITY DEFINER warning remains; the function is intentionally callable by authenticated users and derives the account identity from `auth.uid()`, returning only the caller's aggregate summary.
- Offerwall.GG placement is still pending publisher approval. The callback URL has not yet been configured in the provider dashboard. The Earn-page launcher remains in the draft GitHub PR and has not been deployed to the public site.


## Offerwall.GG dashboard test — 2026-11-08

- Owner ran Offerwall.GG's built-in test postback using POST.
- Provider dashboard confirmed: "Your endpoint accepted the test postback (HTTP 200)" and response body `OK`.
- Postback Edge Function is ACTIVE at version 2; signed wall URL function is ACTIVE at version 1.
- Verified after the test: 0 conversion records, 0 callback event records, 0 journal transactions and 0 journal entries. The test issued no LootCoins.
- Callback transport and test acknowledgement are verified. A real signed conversion, reversal, and publisher approval remain unverified/pending.

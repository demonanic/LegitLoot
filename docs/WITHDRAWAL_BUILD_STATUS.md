# LegitLoot Platform Build — Status

**Updated:** 2026-11-09  
**Active development branch:** `build/legitloot-neon-synthwave`  
**Production:** `https://legitloot.site/` — no production deployment, merge, or live financial changes authorized.

## Environment separation

- Production Supabase project: `gkbqderyjcuxnjbsiffb`. Preserve it and its data; do not modify during staging work.
- Staging Supabase project: `legitloot-staging` (`scmnxcsggquwtuyyjnnj`, US East), linked through **Legitloot dev**.
- Staging frontend config points only to staging. Cloudflare Pages preview deployments are used for development.
- Staging account `manicdemand@gmail.com` has confirmed email and can sign in.
- Staging wallet summary now matches the frontend response contract. The game-credit wallet is non-cash/non-withdrawable; cash wallet is separate.
- No real financial transactions or payout requests have been created.

## Staging administrator authorization

- The staging account `manicdemand@gmail.com` is verified in `private.admin_users` as the **only active owner**.
- Server-controlled authorization is stored in the private admin table. User-editable metadata is not used for role checks.
- One-time bootstrap endpoint `provision-initial-owner` is closed (HTTP 410); its temporary setup page and source were removed from the development branch after successful provisioning.
- Service-role-only SQL wrapper for owner bootstrap remains restricted to `service_role`; it is not executable by anon or authenticated users.
- Future admin creation/deactivation must be owner-authorized, server-side, least-privilege, and audited.

## Admin dashboard — first read-only pass

- Added `admin.html` and `admin.js` to the development branch.
- Deployed staging Edge Function `admin-dashboard` version 2. It validates the bearer session with Supabase Auth, then calls the service-role-only `public.admin_dashboard_payload` RPC. The RPC reads private data without exposing the private schema through PostgREST.
- Migration source is tracked at `supabase/migrations/20261109054000_admin_dashboard_payload.sql`; it has been applied to staging.
- Role boundaries are enforced in SQL: owner can view overview, withdrawal queue, and audit history; payout reviewer can view overview and withdrawal queue; support-readonly is limited to overview.
- Queue output deliberately excludes recipient ciphertext and encryption key metadata; only the masked destination hint is returned.
- Verified staging RPC results for owner overview, empty payout queue, and empty audit history. Verified anon and authenticated roles cannot execute the dashboard RPC; service_role can.
- Dashboard has no approve/reject, payout, user-edit, or admin-management controls. It is read-only.
- Cloudflare Pages must successfully deploy the latest development branch commit before browser testing. No production deploy.

## Owner account directory — deployed to staging

- Added an owner-only `PLAYER ACCOUNTS` section to `admin.html` and `admin.js` on the development branch.
- Extended `admin-dashboard` Edge Function to return registered profile records joined to Auth user email/confirmation/registration metadata. It supports a selected-account read-only profile view.
- Account directory is available only to active owners, is fetched server-side with the service-role client, and does not expose passwords, tokens, or authentication secrets. Non-owner admin roles are denied.
- Verified staging currently contains both confirmed accounts: `manicdemand@gmail.com` (owner) and `buzzfuzzbee333@gmail.com` (test player). Both have profile rows and should appear in the directory.
- Newly registered accounts are listed once their normal signup flow creates the corresponding `public.profiles` row. The directory refreshes from live staging data; no manual account enrollment is required.
- Browser end-to-end testing of the new directory/profile viewer remains outstanding.

## Isolated payout simulator — deployed to staging

- Added migration `supabase/migrations/20261109070000_isolated_payout_simulator.sql` and applied it to the staging project only.
- Simulator uses separate private tables for artificial test wallets, test-fund issuance, simulated withdrawals, and append-only simulator events. It does not write to `private.ledger_accounts`, `private.journal_transactions`, `private.journal_entries`, or real `private.payout_requests`.
- Added staging Edge Function `payout-simulator` version 1. It verifies the signed-in user and invokes service-role-only database functions; each database function independently verifies the active owner role.
- Added `payout-simulator.html` and `payout-simulator.js`; linked the tool from `admin.html`.
- Simulator rules: $0.50 minimum simulated withdrawal; $0.01–$250 per test-fund issuance; $1,000 lifetime artificial-fund issuance cap per owner.
- Test destinations are fixed labels such as `TEST: simulated paypal destination`; the UI does not collect real PayPal/Venmo recipient details.
- Supported lifecycle: issue artificial funds, create a withdrawal and reserve test funds, approve/reject with reason, then simulate pending/success/failure provider outcomes. Rejections and failures return reserved artificial funds to the test available balance.
- Simulator event history is append-only. Anonymous and authenticated database roles cannot execute simulator RPCs; only service_role can. Owner authorization is checked inside each RPC.
- Initial state check passed: all simulator balances and histories are zero. No artificial funds have been issued yet. Browser end-to-end testing remains outstanding.
- The old `provision-initial-owner` Edge Function had still been deployed; replaced its handler with an unconditional HTTP 410 response (version 4). It cannot provision another administrator.
- Latest frontend commits must deploy on the stable Cloudflare branch alias before browser testing.

## Simulator player targeting — implemented in staging

- Preserved the deployed `payout-simulator` Edge Function source in `supabase/functions/payout-simulator/index.ts` before extending it.
- Added migration `20261109100000_simulator_player_targeting.sql` to staging. Existing simulator fund-issue and withdrawal rows retain their prior attribution through a backfill.
- Simulator operations now separate the verified owner actor from the selected registered-player target. Server-side SQL checks active owner status and confirms the target exists in `public.profiles` for every state/mutation request.
- Added an owner-only target-directory RPC returning profile ID, display name, username, and registration time. The simulator UI now has a player selector; balances, issue funds, withdrawal creation, queue decisions, provider simulations, and event history are scoped to that selected player.
- Fund issuance and withdrawal rows now persist `actor_user_id`; event history continues to record both actor and target. The owner identity is derived from the verified bearer token, never from browser input.
- Deployed staging `payout-simulator` Edge Function version 2 with JWT verification still enabled.
- Verified the new RPC signatures exist in staging and are SECURITY DEFINER; all RPCs remain revoked from public/anon/authenticated and granted only to service_role. No production project or real financial tables were changed.
- Cloudflare preview deployment and authenticated owner workflow testing of player switching and simulated actions are still pending. Do not create test funds or withdrawal records until that workflow is deliberately tested.

## Withdrawal foundation — prepared, not activated

- PayPal and Venmo are the only proposed payout rails. Manual review only. No payout provider is connected and no money can move.
- Destination storage fields support authenticated-encryption ciphertext, key-version metadata, and a masked hint. Plaintext recipient data and encryption keys must never enter the database, browser, logs, audit metadata, or Git.
- The $10 minimum remains proposed/disabled. LootCoins are a separate non-cash game currency and are never withdrawable.
- No withdrawal submission API or payout-review mutation API has been deployed.
- Withdrawal request and balance reservation must be one atomic database transaction: lock the player's available cash ledger account, check the balance and minimum, post a balanced journal reservation, and insert the request with idempotency protection.
- Reject/cancel must release the reservation using compensating journal entries. A payout may be marked paid only after trusted provider confirmation and reconciliation.

## Known staging review items

- Supabase security advisors flag private tables with RLS enabled and no direct policies. This matches the current unexposed private-schema/service-role access model, but verify grants and schema exposure after changes.
- The advisor flags `public.get_wallet_summary()` as SECURITY DEFINER and callable by authenticated users. This is intentional for the authenticated wallet summary only; retain the explicit `auth.uid()` check and verify it in security tests.
- Leaked-password protection is disabled; enable it before broader user testing.
- The admin dashboard Edge Function and frontend still need end-to-end browser testing with owner, non-admin, and least-privilege role sessions. In particular, verify unauthenticated and non-admin calls are rejected and support-readonly cannot fetch payout or audit data.
- Do not treat staging as production-equivalent. Reconcile remaining historical migrations before provider integrations.

## Remaining implementation gates

1. Wait for Cloudflare Pages to deploy the newest `build/legitloot-neon-synthwave` commit, then test the read-only admin dashboard on staging.
2. Test role denial for an ordinary authenticated user and support-readonly; test payout-reviewer scope without granting extra privileges.
3. Resolve security-advisor findings where appropriate; enable leaked-password protection before broader user testing.
4. Reconcile remaining migrations and existing function source into staging's documented build plan.
5. Complete browser tests of the isolated payout simulator, including issuance, idempotency, reservation, rejection, provider pending/success/failure, and balance reconciliation.\n6. Implement JWT-authenticated withdrawal submission: server-derived user ID, PayPal/Venmo validation, AES-GCM encryption, idempotency, integer-cent validation, minimum/available balance checks, and atomic reservation.
7. Implement admin queue/review mutations with server-side role checks, reviewer identity from verified auth, required reasons, audit events, and compensating journal entries for rejection/cancellation.
8. Add user-facing withdrawal UI only after the server API contract is implemented.
9. Test concurrency, insufficient balance, duplicate requests, malformed destinations, encryption failure, authorization bypass, rejection/cancellation, and payout reconciliation.
10. Keep live payouts, provider activation, production deployment, and merging into `main` disabled until required approvals and explicit owner authorization.

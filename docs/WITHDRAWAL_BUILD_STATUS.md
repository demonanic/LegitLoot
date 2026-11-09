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
- Deployed staging Edge Function `admin-dashboard` (version 1). It validates the bearer session with Supabase Auth, reads the role from `private.admin_users`, and uses a server-only service key for private data access.
- Role boundaries: owner can view overview, withdrawal queue, and audit history; payout reviewer can view overview and withdrawal queue; support-readonly is limited to overview.
- Queue output deliberately excludes recipient ciphertext and encryption key metadata; only the masked destination hint is returned.
- Dashboard has no approve/reject, payout, user-edit, or admin-management controls. It is read-only.
- Cloudflare Pages must successfully deploy the latest development branch commit before browser testing. No production deploy.

## Withdrawal foundation — prepared, not activated

- PayPal and Venmo are the only proposed payout rails. Manual review only. No payout provider is connected and no money can move.
- Destination storage fields support authenticated-encryption ciphertext, key-version metadata, and a masked hint. Plaintext recipient data and encryption keys must never enter the database, browser, logs, audit metadata, or Git.
- The $10 minimum remains proposed/disabled. LootCoins are a separate non-cash game currency and are never withdrawable.
- No withdrawal submission API or payout-review mutation API has been deployed.
- Withdrawal request and balance reservation must be one atomic database transaction: lock the player's available cash ledger account, check balance and minimum, post a balanced journal reservation, and insert the request with idempotency protection.
- Reject/cancel must release the reservation using compensating journal entries. A payout may be marked paid only after trusted provider confirmation and reconciliation.

## Known staging review items

- Run and review Supabase security/performance advisors. Current security advisor output flags private tables with RLS enabled and no direct policies (intentional private-schema/service-role access model; verify schema exposure and grants), a SECURITY DEFINER wallet-summary RPC (intentional authenticated summary; verify auth.uid enforcement), and leaked-password protection disabled (enable before broader testing).
- The admin dashboard Edge Function and frontend need end-to-end testing with owner, non-admin, and least-privilege role sessions. In particular, verify unauthenticated and non-admin calls are rejected and that support-readonly cannot fetch payout or audit data.
- Do not treat staging as production-equivalent. Reconcile remaining historical migrations before provider integrations.

## Remaining implementation gates

1. Wait for Cloudflare Pages to deploy the newest `build/legitloot-neon-synthwave` commit, then test the read-only admin dashboard on staging.
2. Test role denial for an ordinary authenticated user and support-readonly; test payout-reviewer scope without granting extra privileges.
3. Resolve security-advisor findings where appropriate; enable leaked-password protection before broader user testing.
4. Reconcile remaining migrations and existing function source into staging's documented build plan.
5. Implement JWT-authenticated withdrawal submission: server-derived user ID, PayPal/Venmo validation, AES-GCM encryption, idempotency, integer-cent validation, minimum/available balance checks, and atomic reservation.
6. Implement admin queue/review mutations with server-side role checks, reviewer identity from verified auth, required reasons, audit events, and compensating journal entries for rejection/cancellation.
7. Add user-facing withdrawal UI only after the server API contract is implemented.
8. Test concurrency, insufficient balance, duplicate requests, malformed destinations, encryption failure, authorization bypass, rejection/cancellation, and payout reconciliation.
9. Keep live payouts, provider activation, production deployment, and merging into `main` disabled until required approvals and explicit owner authorization.

# LegitLoot Platform Build — Status

**Updated:** 2026-11-08  
**Active development branch:** `build/legitloot-neon-synthwave`  
**Production:** `https://legitloot.site/` — no production deployment, merge, or live financial changes authorized.

## Isolated Supabase staging

- Dedicated development account: **Legitloot dev**.
- Staging project: `legitloot-staging` (`scmnxcsggquwtuyyjnnj`, US East).
- Original project `gkbqderyjcuxnjbsiffb` remains preserved and untouched.
- Five foundation migrations have been applied and verified in staging: initial schema, private financial-table RLS, authenticated wallet-summary RPC, PayPal/Venmo encrypted-destination fields, and the standard LootCoins wallet model (LC stored as integer atoms).
- Staging currently has no Edge Functions, no real users, no financial transactions, and no payout requests.
- The original project contains later wallet/offerwall work not yet replicated to staging. Do not treat staging as production-equivalent.

## Withdrawal foundation — prepared, not activated

- PayPal and Venmo only; manual review only. No payout provider is connected and no money can move.
- Destination storage is designed for authenticated-encryption ciphertext, key-version metadata, and a masked hint. Plaintext recipient data and encryption keys must never enter the database, browser, logs, audit metadata, or Git.
- The minimum withdrawal remains $10 (1 LootCoin = $1 USD is the approved design conversion). LootCoins are a separate non-cash game/reward currency and are not withdrawable. The cash withdrawal minimum is still disabled/proposed and must not be treated as active.
- No withdrawal API or admin review API has been deployed.
- Reservation and payout-request creation must be one atomic database transaction: lock the player's available cash ledger account, check the balance and minimum, post a balanced journal reservation, and insert the payout request with idempotency protection.
- A payout may be marked paid only after trusted provider confirmation and reconciliation.

## Administrator authorization — decision confirmed

- Owner approved a single initial administrator: the owner's own LegitLoot account.
- The authorization source is a private server-controlled table, never user-editable auth metadata.
- Added migration `20261108200000_server_controlled_admin_authorization.sql` to the build branch. It creates private admin records, a service-role-only one-time owner bootstrap function, and append-only audit-log protection.
- No user has been promoted yet. The owner must first create/sign in to a LegitLoot account so its Auth user UUID exists; bootstrap will then be performed server-side without asking the owner to send secrets.
- Additional administrators can be provisioned later through a privileged server-side process with least-privilege roles and audit history.

## Remaining implementation gates

1. Apply and verify the admin authorization migration in staging; run Supabase security/performance advisors.
2. Reconcile the remaining original-project migrations and existing function source into staging's documented build plan without touching production.
3. Implement a JWT-authenticated withdrawal Edge Function: server-derived user ID, PayPal/Venmo validation, AES-GCM encryption, idempotency, integer-cent validation, minimum/available balance checks, and atomic reservation.
4. Implement admin queue/review actions with server-side role checks, reviewer identity derived from verified auth, required reason, audit events, and compensating journal entries for rejection/cancellation.
5. Add user-facing withdrawal UI only after the server API contract is implemented.
6. Test concurrency, insufficient balance, duplicate requests, malformed destinations, encryption failure, authorization bypass, rejection/cancellation, and payout reconciliation.
7. Keep live payouts, provider activation, production deployment, and merging into `main` disabled until required approvals and explicit owner authorization.

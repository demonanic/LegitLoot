# LegitLoot Platform Build — Status

**Updated:** 2026-11-08  
**Active development branch:** `build/legitloot-neon-synthwave`  
**Production:** `https://legitloot.site/` — no production deployment, merge, or live financial changes authorized.

## Withdrawal foundation — prepared, not activated

- Confirmed the connected Supabase project `gkbqderyjcuxnjbsiffb` serves the live site. No database writes, migrations, or Edge Function deployments were performed.
- Added a build-branch-only migration draft for PayPal/Venmo destination metadata and encrypted recipient storage.
- The migration stores only ciphertext, key-version metadata, and a masked display hint; it explicitly does not add plaintext recipient fields.
- Added reviewer identity/time/reason fields and a pending-review queue index.
- PayPal/Venmo remain manual-review destinations. No payout API, automatic payout, provider connection, or money movement is enabled.
- The migration is intentionally unapplied. A dedicated staging Supabase project and server-side encryption secret are prerequisites.
- Existing payout status enum supports requested, under_review, approved, processing, paid, failed, and cancelled. The admin role/authorization source still needs to be defined before admin actions can be safely implemented.
- The existing ledger posting function is available for balanced journal entries, but withdrawal reservation must be implemented as a single atomic server-side operation that locks the player's available account, checks sufficient funds, posts the reservation, and creates the payout request in one transaction. Do not split those steps across independent API calls.

## Remaining implementation gates

1. Create a separate staging Supabase project and confirm its credentials are isolated from production.
2. Define the authoritative admin authorization mechanism (never user-editable metadata).
3. Add an authenticated withdrawal-request Edge Function with strict input validation, encrypted destination data, idempotency, and atomic reservation.
4. Add an admin-only review API and queue; record every decision in the immutable audit log.
5. Add account UI only after the API contract is implemented and tested.
6. Test concurrent requests, insufficient balance, replay/idempotency, encryption failure, rejected review, cancellation, and confirmed payout transitions.
7. Keep all live payout and production activation disabled until provider/legal approval and explicit owner authorization.

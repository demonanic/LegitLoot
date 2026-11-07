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

- Supabase project has not been created. The account exposes one organization; owner confirmation is required before project creation.
- Bootstrap SQL has not been applied or executed against a live database.
- Authentication UI is a preview only; signup, login, email verification and recovery are not wired.
- No Edge Functions, provider postback handlers, Stripe integration, payout rail or offerwall is live.
- No admin interface, provider reconciliation engine, reserve calculator or fraud review workflow is live.
- No automated browser, accessibility, database or end-to-end tests have run.
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

## Next required action

Owner confirms that the new Supabase project should be created in the only currently available organization, `fuxbuxcryptolux's Org`, in `us-east-1`. The current project quote is $0/month. After confirmation: create project, verify readiness, apply schema, run advisors and tests, then wire auth using only publishable client keys and server-only secrets.

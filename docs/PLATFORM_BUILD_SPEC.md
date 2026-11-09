# LegitLoot — Platform Build Specification

**Version:** 1.0  
**Date:** 2026-11-07  
**Build branch:** `build/legitloot-neon-synthwave`  
**Production:** `https://legitloot.site/` — untouched; no production deployment authorized.  
**Business source of truth:** LegitLoot Master Business Model & Living Business Blueprint v1.3 supplied by the owner.  
**Authorization:** Owner has now explicitly authorized development. This supersedes v1.3's earlier "no development authorized" status for work on the isolated build branch only. It does not authorize paid services, account creation, provider agreements, live money movement, or production deployment.

## 1. Product definition

LegitLoot is a combined independent games and rewards platform with four public-facing pillars:
1. Original games: Demonanic, Gauntlet's Survival, Harvest//Zero.
2. Approved third-party offerwalls and activities.
3. Affiliate marketplace and promotional deals.
4. A transparent player rewards experience with separate game-credit and cash ledgers.

Homepage direction: **LegitLoot — The Underground Arcade**. The approved personality is a hybrid of punk outlaw, underground hacker and arcade boss. The visual treatment deliberately mixes raw comic-book illustration, cinematic character/environment artwork and distressed punk screen-print aesthetics. Use the midnight black/deep violet, hot magenta, electric purple, radioactive lime, electric cyan and warm gold palette from the owner's reference. Preserve the reference's recognizable dashboard structure while improving responsive behavior, hierarchy, accessibility and functionality. Avoid generic AI dashboard tropes, generic mascot art, arbitrary neon effects and repetitive template cards. The badger is the primary brand character. Use the current working concept consistently; additional character-sheet development is not a prerequisite for completing the website. The mysterious punk woman may be used selectively as a supporting promotional character, not as the company identity. The supplied official game artwork is authoritative; generated supporting art must never masquerade as actual game screenshots. Keep important text and UI controls as real HTML, not baked into images. See [Brand Art Direction](BRAND_ART_DIRECTION.md) for the complete approved visual standard. Never use invented balances, streaks, leaderboards, task completion or payout claims to make the interface look populated; show real connected data or clearly label a preview/planned state.

## 2. Hard business rules (must be enforced in code and UX)

### Two separate balances
- **Game credits:** non-transferable, no cash value, not withdrawable, not transferable to another player, and never convertible to cash.
- **Cash rewards:** tracked in USD with distinct states: pending, available, withdrawal-reserved, and paid.
- Never combine the two balances into a single total or imply game credits have a USD redemption value.
- Any sample/demo balances must be visibly labeled DEMO and must never be stored as real user funds.

### Offerwall allocation — proposed model, not a provider promise
For each eligible provider-approved reward event:
- Player reward pool split: 50% cash allocation and 50% game-credit allocation.
- Of the game-credit allocation, 75% may be issued provisionally only after a validated provider confirmation; 25% is deferred until settlement/reconciliation.
- Cash allocation remains pending until provider settlement and reconciliation.
- The platform revenue share, eligible net-revenue basis, deductions, caps and any provider-specific adjustments must be taken from the approved business model and the provider's current written terms. Do not invent a universal platform percentage.
- All rates remain configurable and disabled until the relevant provider approves the exact model in writing.

### Reserves and reversals
- Maintain reserves sufficient to cover player cash liabilities and outstanding provisional-credit fulfillment.
- Maintain a separately defined reversal buffer based on measured provider reversal behavior and approved risk policy; do not hardcode an unapproved percentage.
- Unsettled provider receivables never fund cash withdrawals.
- A circuit breaker pauses new reward commitments when reserves fail, provider status is suspended, or material reconciliation discrepancies occur.
- Ordinary reversals do not automatically create player debt; platform absorbs already-spent provisional-credit losses by default, subject to documented fraud exceptions and review.

### Payout
- Proposed minimum withdrawal: USD $10, not final until provider and legal review.
- No payout request may exceed available cash.
- Reserve cash before initiating a payout; release reservation only on a confirmed failure/cancellation or final settlement.
- A dashboard balance is not proof of payment; only a reconciled provider confirmation marks paid.
- Never initiate a payout without verified identity/eligibility, explicit user request, risk checks, sufficient reserves, and an approved payout rail.

## 3. System architecture — proposed, no vendor is presumed approved

### Initial architecture recommendation
- Frontend: responsive web application deployed to Cloudflare Pages.
- API: authenticated server-side API (Cloudflare Worker or FastAPI service; select after repository/runtime inventory).
- Database: PostgreSQL with transactional stored procedures for ledger posting, balance projections, reservations, idempotency, and reconciliation.
- Authentication: managed auth provider with email verification, password recovery, session revocation, rate limits, and optional MFA; choose only after account/project ownership and pricing are confirmed.
- File/media storage: existing repository assets for static art; private object storage only if a real need is identified.
- Observability: structured logs, audit trail, alerting, backup and restore procedure.
- Secrets: provider keys only in server-side secret storage; never in browser bundles, repository, screenshots, or client config.

No existing Demonanic database, auth project, secrets, or provider accounts may be reused without explicit owner approval.

### Ledger
Use an append-only, double-entry-capable transaction ledger. No direct balance edits. Every financial event has:
- immutable internal transaction ID;
- provider + provider event ID;
- idempotency key;
- player/account reference;
- currency and integer minor-unit amount;
- event type and state;
- source/destination accounts;
- created/confirmed/settled timestamps;
- reconciliation reference;
- reversal linkage;
- audit metadata.

All money uses integer cents. No floating-point arithmetic. Game credits use integer units and a separate ledger/currency code.

### Provider event processing
- Verify callback authenticity using provider-specified signature verification.
- Validate provider, event type, player mapping, currency, amount, offer eligibility, and allowed status transition.
- Enforce unique provider-event IDs and idempotency.
- Persist raw event evidence securely with retention controls.
- Post rewards only after all validations pass.
- Reconcile provider reports against internal events and settlement statements.
- Unknown/duplicate/malformed events must not issue rewards.

## 4. Provider integration rules

### Offerwall.GG
Candidate only. Business model research notes mention publisher-controlled rewards, publisher liability, NET30 settlement, $30 minimum payout, reversals, and registered domain/app placement. These are research notes, not current verified approval. Before integration: obtain current official contract/docs, verify current terms, and obtain written approval for the exact dual-wallet / cash-reward structure.

### RevU
Secondary candidate. Do not infer that a virtual-currency integration permits cash rewards. Obtain written approval for the exact model before enabling.

### Stripe
Stripe is not assumed to be the payout provider. Evaluate Stripe's current product terms and written approval for the actual business model. Stripe Checkout/payment acceptance and Stripe Connect/payout capabilities are different functions; neither is automatically suitable for offerwall reward payouts. Do not accept player deposits, sell cash-equivalent credits, promise payouts, or move funds until provider approval, legal review, KYC/AML allocation, chargeback/reversal handling, and payout eligibility are settled.

### Affiliates and advertising
Each program has a separate adapter/configuration and records:
- source, campaign, click ID, disclosure, traffic-source policy, incentive restrictions;
- attribution window and conversion evidence;
- pending/approved/reversed/paid commission state;
- currency, fees, and settlement.
No incentivized traffic unless the specific program explicitly permits it. No paid/rewarded ad engagement for cash. Rewarded ads may only grant permitted non-transferable in-game benefits.

## 5. Account and player experience requirements

- Signup, sign-in, sign-out, email verification, password reset, session/device management.
- Age and geographic eligibility checks based on legally reviewed requirements; do not invent a universal age threshold.
- Privacy notice, terms, cookie/analytics controls as applicable, affiliate disclosures, support/reporting, account deletion/export process.
- User profile, preferences, notification preferences, linked game identities.
- Clear pending/confirmed/available/paid status explanations.
- Account security: rate limits, bot mitigation, credential stuffing defenses, secure cookies/tokens, CSRF protections where applicable, server-side authorization, audit logs.
- Never trust client-provided player IDs, balances, reward values, provider event data, or payout status.

## 6. Games and game integration

Game directory must contain exactly the owner-approved initial titles:
- Demonanic
- Gauntlet's Survival
- Harvest//Zero

Each game record has title, description, artwork, launch status, destination URL, supported device, release state, and analytics identifiers. Unknown launch URLs remain unset; never invent them. The website may link to a game only when its real destination is confirmed. Game-specific purchases and rewards require separate design and compliance review.

## 7. Marketplace and promotion rules

- Preserve and inventory existing affiliate assets before retiring or rewriting old pages.
- Every affiliate link must carry clear disclosure near the recommendation.
- Display material terms, eligibility, fees, recurring charges, payout conditions, and limitations where known.
- Do not describe an offer as cash if it pays points, gift cards, tokens, or game credits.
- No unsupported earning claims, fake scarcity, fake social proof, fabricated user activity, or hidden conditions.

## 8. Admin, operations and reporting

Admin-only capabilities:
- provider status and integration switches;
- offer/catalog management;
- account review and fraud case management;
- provider event inbox and signature/validation result;
- ledger explorer with immutable audit history;
- reconciliation imports and discrepancy queue;
- reserve coverage dashboard and circuit breaker;
- cash liability and provisional-credit exposure reports;
- payout review queue and evidence;
- affiliate commission reconciliation;
- operational expenses and realized-profit reports;
- role-based access and privileged-action audit trail.

Admin actions that affect money require explicit permissions, reason codes, dual control where appropriate, and immutable audit records.

## 9. Risk, fraud and privacy controls

- Per-account, device, IP/network and global velocity controls, with privacy-conscious data minimization.
- Duplicate account and suspicious pattern review; do not auto-confiscate legitimate earnings solely on an opaque score.
- Provider callback replay protection and event deduplication.
- Offer completion and attribution evidence; no fabricated activity or prohibited automation.
- Withdrawal holds for review with clear user-facing status and support path.
- Minimize collection of identity documents; use provider-hosted verification where available.
- Data retention, deletion, access control, backups, incident response and breach procedures.
- Children's privacy, state/federal consumer law, tax reporting, unclaimed property, money transmission, stored value, sweepstakes/contest rules and North Carolina-specific requirements need qualified review before relevant features launch.

## 10. Release gates

### Gate A — public UI prototype
Can be built on the isolated branch using clearly labeled demo content. No real authentication, balances, reward issuance, payment, offerwall callbacks, or withdrawal.

### Gate B — backend foundation
Requires owner selection/approval of hosting, database and auth providers; no paid account or service may be created without approval.

### Gate C — test integrations
Use provider sandbox/test credentials only. Provider eligibility and written approval required before production integration.

### Gate D — controlled pilot
Requires legal review, security review, reserves funded with actual available funds, reconciliation, support process, provider approval, and user-facing terms.

### Gate E — production launch
Requires explicit owner approval of the exact commit, production deployment, domain change, and each live financial/provider feature.

## 11. Implementation order

1. Repository/runtime inventory and protect production.
2. Build shared visual system and responsive page shell.
3. Build public pages: Home, Games, Earn, Marketplace, How It Works, Trust/FAQ.
4. Build account screens as non-functional UI prototype, then wire approved auth.
5. Define database schema and append-only ledger.
6. Implement server-side wallet projections, idempotency, reserve engine, reconciliation.
7. Build admin and audit tools.
8. Add offerwall adapters in disabled state; validate provider contracts and callbacks.
9. Add affiliate tracking and disclosure model.
10. Evaluate payment/payout provider; Stripe only if approved for this exact use.
11. Integrate game destinations after URLs are verified.
12. Security, accessibility, device, fraud and financial tests.
13. Controlled pilot; then explicit production release approval.

## 12. Explicit non-goals until separately approved

- No paid subscriptions, purchases, or integrations.
- No creating provider accounts or accepting provider agreements.
- No live Stripe charges, deposits, transfers, payouts, or stored value.
- No live offerwall or affiliate reward commitments.
- No cash competitions or sweepstakes.
- No merging into `main`, changing Cloudflare production configuration, or deploying to `legitloot.site`.
- No reuse of Demonanic production credentials or user data.


## 13. Withdrawal implementation constraints (2026-11-08)

- Player payout destinations are limited initially to PayPal and Venmo, with manual review only.
- Never persist plaintext recipient identifiers. Store authenticated-encryption ciphertext, a key-version identifier, and a deliberately masked hint only.
- Encryption keys must exist only in server-side secret storage. No key, decrypted recipient, or raw destination value may enter browser code, logs, audit metadata, or Git.
- A withdrawal request must authenticate the user, derive the user ID from the verified session, validate an integer USD-cent amount, enforce the configured minimum and available balance, and use a server-generated or validated idempotency key.
- Reservation and payout-request creation must be atomic. Lock the player's available ledger account, post a balanced journal transaction moving cash from available to withdrawal-reserved, and insert the request in the same database transaction. Concurrent requests must not overspend.
- The client may not choose status, user ID, payout provider ID, reviewer, paid timestamp, or ledger account IDs.
- Admin authorization must come from a server-controlled role/authorization source, not user-editable metadata. Every review decision must record reviewer, timestamp, reason, and an immutable audit event.
- Rejected/cancelled requests release reserved funds through a compensating journal transaction; they must never edit or delete prior journal entries.
- Mark a request paid only after a reconciled, trusted payout confirmation. Admin approval alone is not payment.
- No payout function may be deployed to the production Supabase project until an isolated staging project exists and all required tests pass.

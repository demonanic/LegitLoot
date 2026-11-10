# LegitLoot — Platform Build Specification

**Version:** 1.1  
**Date:** 2026-11-10  
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

Homepage direction: **LegitLoot — an underground organization operating a chaotic digital arcade**. Follow [LEGITLOOT_CREATIVE_BIBLE.md](LEGITLOOT_CREATIVE_BIBLE.md) for the mature western comic visual direction, near-black/charcoal/blood-red/acid-green/bone/industrial-grey identity, character tone, and Skuz continuity. Skuz is the embodiment and spokesperson of LegitLoot; maintain his supplied reference, reference sheet, and expression library. The current owner explicitly authorizes this visual redesign and character-reference work, superseding older character-sheet restrictions. Keep the public interface welcoming, truthful, accessible, and respectful. Official game art remains authoritative; generated art must never masquerade as a game screenshot. Keep important text and UI controls as real HTML, not baked into images. Never use invented balances, streaks, leaderboards, task completion or payout claims to make the interface look populated; show real connected data or clearly label a preview/planned state. No business or financial rules are changed by the visual direction.

## 2. Hard business rules (must be enforced in code and UX)

**Owner-locked decision, 2026-11-10:** LootCoins are redeemable only for eligible games and in-game perks. Cash rewards are deferred to a separately approved future phase. The former proposed cash/LC allocation is superseded. The full model and channel rules are in Sections 2A–2D below.

### Two separate balances
- **Game credits:** non-transferable, no cash value, not withdrawable, not transferable to another player, and never convertible to cash.
- **Cash rewards:** tracked in USD with distinct states: pending, available, withdrawal-reserved, and paid.
- Never combine the two balances into a single total or imply game credits have a USD redemption value.
- Any sample/demo balances must be visibly labeled DEMO and must never be stored as real user funds.

### Reward calculation — campaign-specific, LC only
- No universal reward-per-dollar rate is approved.
- Each eligible campaign must have a documented, versioned LC reward rule, eligibility, caps, status lifecycle, and provider approval for incentivized traffic and game-only redemption.
- The former proposed 50% cash / 50% game-credit split and 75%/25% provisional/deferred split are superseded and must not be implemented.
- Provider revenue shares, deductions, caps, and settlement are business accounting data, not player cash allocations.

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



## 2A. Owner-locked platform model decisions (2026-11-10)

These decisions are binding for product design and implementation and supersede any conflicting earlier proposal in this document.

### LootCoins: games only
- LC may be spent only on eligible in-game purchases, upgrades, cosmetics, game content, and game-related perks in the approved LegitLoot game ecosystem.
- LC cannot be withdrawn, transferred, exchanged for cash, converted into another currency, or redeemed for general marketplace goods, gift cards, or cash-equivalent items.
- LC has no cash value. Never display a dollar conversion rate.
- Each catalog item must state whether it is game-specific or platform-wide. No cross-game entitlement is implied.
- The approved initial games are Demonanic, Gauntlet's Survival, and Harvest//Zero.

### Cash rewards: later phase
- Cash rewards are not part of the initial player reward promise or current earning model.
- Do not allocate any current offerwall, survey, task, referral, affiliate, mission, or advertising reward to a player cash balance.
- Do not implement active player cash balances, cash withdrawals, payout requests, or cash reward commitments in the current phase.
- Preserve architectural separation for a possible future cash product. It requires a separate owner-approved specification and approvals for provider terms, legal review, eligibility, tax treatment, identity verification, reserves, reconciliation, payout provider, support, and production release.
- The previously proposed $10 minimum withdrawal and PayPal/Venmo manual payout workflow are deferred, not current commitments.

### Earning channels: all supported categories
The long-term earning catalog must be designed to support:
1. Third-party offerwalls and incentivized offers.
2. Surveys and research panels.
3. Approved standalone tasks and activities.
4. Affiliate deals and shopping referrals.
5. Rewarded advertising, only where the provider explicitly permits the incentive.
6. Internal missions, quests, achievements, events, streaks, and challenges.
7. Referrals and invitations, subject to partner terms and anti-abuse controls.

These are product categories, not claims that providers or offers are approved or live. Each provider, campaign, and channel stays disabled until its terms and technical integration are verified.

### Reward destination rules
- Internal missions, achievements, events, and game activity may grant LC after server-side validation, published rules, and abuse controls.
- Offerwalls, surveys, and tasks may grant LC only where the specific provider and advertiser permit incentivized traffic and the exact game-only reward model.
- Affiliate commissions are initially business revenue, tracked separately. Do not promise or issue LC for an affiliate click, purchase, or referral unless the specific program expressly permits incentivized referrals and the owner approves a campaign rule.
- Rewarded ads may grant only the non-cash in-game benefit permitted by the ad network. Never reward ad views/clicks with cash.
- Referrals may grant LC only after a defined qualifying event, server-side verification, fraud checks, and partner permission.
- A browser redirect, client event, screenshot, or user assertion alone can never credit LC.

### Current financial model
- Player reward liability is denominated only in LC.
- Provider commissions, affiliate income, operating costs, receivables, and settlement amounts are business accounting data in their actual currencies, not player cash balances.
- Reward amounts are campaign-specific, configurable, disclosed before participation, and disabled until provider terms and economics are verified.
- The prior 50% cash / 50% game-credit split and 75%/25% provisional/deferred split are explicitly retired.
- Future cash rewards cannot be funded by, converted from, or represented as LC.

## 2B. Product surfaces and canonical user journeys

### Public website
Home; Games; Earn; Deals/Marketplace; How It Works/Trust; Terms; Privacy; Affiliate Disclosure; Support/Contact; and a branded 404 page.

### Signed-in player portal
- Dashboard: account status, approved games, LC balance from the ledger, real recent activity, missions, and notices. Never seed fake activity.
- Games: launch only verified destinations; show game-specific LC rules/catalogs where implemented.
- Earn: browse eligible offers, read material terms before starting, track attribution/completion, and see verified LC reward states.
- Deals: curated affiliate offers with adjacent disclosures. This is not an LC redemption store.
- Wallet: LC balance, transaction history, earned/spent/reversed states, and game-only usage explanation. No cash balance or withdrawal action in the current phase.
- Account: profile, authentication/security, linked game identities, preferences, privacy controls, export/deletion request.
- Support: account, attribution, missing reward, and safety/reporting paths.

### Offer-to-LC journey
1. Player signs in and meets provider/campaign eligibility.
2. Offer detail shows material terms, required actions, time limits, exclusions, incentive disclosure, and verified reward units.
3. Server creates a tracked click/session and provider-approved parameters.
4. Player completes the advertiser requirements.
5. Provider sends a server-to-server event/report.
6. Server authenticates, validates, maps, deduplicates, and stores evidence.
7. Event follows the provider-defined pending/confirmed/reversed lifecycle.
8. LC posts only at the approved event state under the campaign's documented rule. Any approved provisional credit is explicitly identified and reversible through compensating entries.
9. Player sees a transaction and plain-language status.
10. Reconciliation compares provider events and settlement/reporting data; discrepancies enter an operations queue.

### Affiliate journey
A disclosed deal click creates a privacy-conscious attribution record. A merchant/network conversion is tracked as business commission revenue. No player LC is issued unless the program permits incentivized referrals and an approved campaign rule defines the reward.

### Internal mission journey
Publish rules, eligibility, dates, limits, and LC reward first. Track progress from trusted game/platform events. Verify completion server-side, evaluate each unique completion once, and post LC with idempotency and audit history.

## 2C. Logical data model

This is the required logical model, not a claim that these tables already exist. Final physical schema must be reconciled with the selected Supabase/PostgreSQL project and existing code.

- Identity/catalog: `profiles`, `linked_game_accounts`, `games`, `game_catalog_items`, `providers`, `campaigns`, `earning_categories`.
- Attribution/conversions: `tracking_sessions`, `provider_events`, `conversions`, `affiliate_clicks`, `affiliate_commissions`.
- LC economy: `lc_accounts`, `lc_journal_transactions`, `lc_journal_entries`, `lc_reward_rules`, `missions`, `mission_progress`, `reward_claims`, `game_spend_events`.
- Operations: `fraud_cases`, `provider_reconciliations`, `admin_roles`, `admin_permissions`, `audit_events`, `support_tickets`, `consent_records`, `deletion_requests`.

### Schema invariants
- User IDs derive from verified server-side authentication, never client-supplied ownership fields.
- LC uses integer units and a dedicated currency/type code. Business accounting uses integer minor units and ISO currency codes.
- LC journal entries cannot post to cash accounts. Business commissions cannot post directly to player LC without an approved reward rule.
- Unique constraints enforce provider event IDs, conversion IDs, idempotency keys, mission completion keys, and external affiliate event IDs within their correct scopes.
- Reward rule versions are immutable once used; changes create new versions.
- RLS protects user-owned rows. Privileged posting and provider processing run only through trusted server-side functions with narrow grants.
- Ledger rows are append-only; corrections use compensating entries, never destructive balance edits.
- Raw provider payloads are untrusted, access-controlled evidence with justified retention limits.

## 2D. Provider adapter contract and channel controls

Every provider adapter must expose equivalent internal operations for capabilities, tracking-session creation, event authentication, event normalization, event processing, reconciliation, and health. Provider-specific semantics and source evidence must be preserved.

Track these states independently: configured, credentials present, sandbox/production, provider approval, incentive permission, event verification, reward-posting switch, and reconciliation health. Unknown states default to disabled. A successful callback is not business approval; account approval does not mean every campaign permits incentives.

Channel-specific controls:
- Offerwalls: written permission for incentivized traffic, game-only LC redemption, traffic sources, and campaign terms.
- Surveys: disclose screening, qualification, completion rules, privacy, and disqualification/no-reward cases. Never imply every attempt earns LC.
- Tasks: classify task type, evidence, completion criteria, prohibited actions, and provider policy.
- Affiliate deals: commissions are business revenue; no user reward unless the program expressly permits it.
- Rewarded ads: grant only permitted non-cash in-game benefits and follow current network rules.
- Missions/events/achievements: trusted server events, published rules, windows, caps, and abuse checks.
- Referrals: qualifying new-user event, anti-self-referral controls, delayed issuance where needed, and partner permission.

### CPAGrip initial adapter status
- Publisher account exists; that does not establish approval for every campaign or for the current LC model.
- Existing staging work includes an attribution token table, RPC, and an Edge Function named `cpagrip-attribution`.
- End-to-end completion is not established. Callback receiver/authentication, final macro mapping, secret configuration, duplicate/replay tests, reversals, reconciliation, and a verified test conversion remain outstanding unless later repository inspection proves otherwise.
- Verify current official CPAGrip documentation and account terms for incentivized traffic, domain, game-only LC redemption, macros, callback authentication, statuses, reversals, and settlement.
- CPAGrip remains disabled for live player rewards until those checks and tests pass.

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

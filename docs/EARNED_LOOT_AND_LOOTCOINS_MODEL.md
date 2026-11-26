# LegitLoot — Earned Loot and LootCoins Owner Amendment

**Owner:** Sam Buzbee  
**Decision date:** 2026-11-23  
**Status:** Current owner direction; supersedes conflicting earlier wallet descriptions in older build notes, handoffs, and PR descriptions.  
**Scope:** Player wallet, provider reward allocation, Moonetix, game-earned currency, and Earned Loot conversion.

## 1. The two player-facing wallets

LegitLoot has two distinct player-facing balances.

### Earned Loot (EL)

Earned Loot is the player's redeemable reward balance.

- Earned through eligible Hustle activities, including approved offers, surveys, and tasks.
- The initial Moonetix **Split to User** setting is **50%**. Sam may change this provider setting at any time; it is configurable, not hardcoded in LegitLoot.
- Moonetix calculates the player-facing reward from publisher payout, conversion rate, Split to User, any active bonus, and rounding. Its `{reward}` field is already the player's share in the configured EL currency. LegitLoot records and credits that value exactly as received after validation, reconciliation, and approval; it must never apply another 50% deduction.
- Moonetix `{payout}` is the publisher's USD earning for the step. The remaining provider economics are retained by LegitLoot for operating costs, subject to any bonus paid from the platform's share.
- Store the event-time split, conversion rate, bonus, rounding, raw `{reward}`, and raw `{payout}`. Later setting changes affect future credited steps only; historical credits and matching reversals retain their original values.
- Available Earned Loot may be redeemed for cash under the applicable redemption rules, or spent to purchase LootCoins.
- Earned Loot is displayed both as EL units and as its corresponding cash-equivalent amount.
- Pending, unverified, unsettled, or disputed rewards are not available for redemption or conversion.

### LootCoins (LC)

LootCoins are an in-platform utility currency, not a cash-redeemable reward.

LootCoins may enter a player's wallet only through:
1. Server-verified game milestones, achievements, challenges, weekly/seasonal events, and other explicitly approved gameplay rewards.
2. A purchase using available Earned Loot through the LegitLoot LC shop.

LootCoins:
- Cannot be purchased with USD cash or a payment card.
- Cannot be earned through Hustle, Moonetix, offerwalls, surveys, or other provider activity.
- Cannot be withdrawn, redeemed for cash, or converted back into Earned Loot.
- Are used only within LegitLoot, including games, game upgrades, merchandise, and seasonal activities.
- Must never be assigned a cash value in the wallet or represented as redeemable.

The website wallet is authoritative for the player's LC balance.

## 2. Moonetix reward configuration

Moonetix is an earning provider. Its player reward currency must be **Earned Loot**, never LC.

The initial owner-selected Moonetix setting is **50% Split to User**, and Sam may adjust it at any time. The configured split is applied by Moonetix before the offer reward is displayed and before its postback is sent.

Use the provider's signed `{reward}` field as the player's EL reward and `{payout}` as the publisher USD payout. Do not recalculate the split from the advertised amount and do not halve `{reward}` again. Record the configuration snapshot for audit and historical reporting. The provider's signed reward value, not a locally guessed amount, is authoritative for the player's reward.

Moonetix callbacks may report activity and support validation. A callback alone must not post an available Earned Loot credit. The server must authenticate and validate the event, deduplicate it, record it as pending, reconcile it against provider settlement/verification, and then require authorized approval before moving the player's share to available Earned Loot.

The platform's retained 50% is an allocation for operating economics. It is not proof that the provider has settled funds, nor an automatically available reserve. Pending provider receivables must not be described or booked as received cash.

## 3. Pending reward lifecycle and player disclosure

A provider completion initially creates a pending reward record, not spendable wallet value.

Required states:
- **Pending verification:** provider event received but not yet verified/reconciled.
- **Pending review:** verification completed but approval/review remains outstanding.
- **Available:** validated, reconciled, and approved; may be redeemed or converted to LC.
- **Rejected:** not credited to available Earned Loot, with reason and audit record.
- **Reversed/disputed:** a compensating event and hold/review process is recorded; never edit or delete historical journal rows.

Pending amounts:
- Are displayed separately from available Earned Loot when the player opens/checks the wallet.
- May show an estimated EL amount and corresponding estimated cash equivalent, clearly labeled **pending / not available**.
- Must not be included in the available balance or its redeemable cash-equivalent total.
- Cannot be redeemed, spent, or converted into LC.
- Must not be presented as guaranteed payment or as provider-settled funds.

The wallet should not show a constant intrusive warning. A concise status label, pending amount, and explanatory text in the wallet are sufficient. The Terms of Service and reward policy must explain provider verification, review, settlement, rejection, reversal, and variable processing times. Do not publish invented verification timeframes.

A later reversal must be handled through a recorded compensating/review process. Do not silently rewrite history or create an unauthorized negative Earned Loot or LC balance. Any recovery from already-redeemed value requires a separately defined, legally reviewed dispute policy; do not invent player debt or automatic clawbacks.

## 4. Earned Loot display and units

The player wallet displays both:
- Earned Loot units (EL).
- The corresponding cash-equivalent amount for available EL.

The cash-equivalent label is informational and must not imply instant withdrawal, an active payout rail, or guaranteed redemption. Redemption remains subject to the published terms, eligibility, approval, and activation status.

Pending EL is shown separately and clearly marked unavailable.

Moonetix supports whole-number rewards or up to three decimal places. The internal EL atom scale supports thousandths, but the actual Moonetix conversion rate and rounding selection must be captured from the created app and verified with small-award tests before live activation. Do not round in a way that over-credits rewards or silently erases a valid player allocation.

## 5. Earned Loot to LootCoins shop

Players may use available Earned Loot to purchase LC packages.

- This is a one-way conversion: EL is debited and LC is credited atomically in one auditable transaction.
- The same request retried with the same idempotency key must not double-spend EL or double-credit LC.
- A conflicting retry must fail clearly.
- Pending EL cannot be used.
- LC cannot be converted back to EL.
- Cash/card payments cannot buy LC.
- Standard package prices and promotional offers are configurable data, not hard-coded universal exchange rates.

Limited-time promotions are allowed. Example: “Get 20 LC for only 5 Earned Loot.” This is an illustrative offer, not a fixed conversion rate. Each package/promotion must define its EL price, LC amount, eligibility, start/end time, limits, and audit metadata. The UI must disclose the price and expiry/conditions before purchase.

Discounted LC packages can encourage in-platform use, but unredeemed EL remains a potential redemption obligation until spent. Converting EL into LC changes the obligation into an in-platform fulfillment obligation; it does not automatically create accounting profit. The business must account for expected redemption and fulfillment costs.

## 6. Financial and security invariants

- Maintain separate, auditable ledgers for EL and LC, plus internal USD accounting/reconciliation records as needed.
- Do not expose USD as a third player-facing wallet.
- Never mix EL and LC in a single journal transaction. Conversion is represented as linked, balanced, separately typed ledger postings within one atomic operation, preserving clear audit linkage.
- Only authorized server-side logic can approve EL credits.
- Provider callbacks cannot directly credit EL or LC.
- Provider callbacks cannot authorize cash redemption.
- No negative available EL or LC balances.
- Concurrent EL purchases must not overspend the available EL balance.
- Concurrent LC spending must not overspend the available LC balance.
- Every reward, approval, rejection, reversal, EL purchase, LC issuance, and promotional purchase must be idempotent and auditable.
- Historical journal and audit records are append-only and must not be deleted or rewritten.
- Payouts, withdrawals, and identity-check services remain disabled until the owner separately approves activation.
- The previously approved future minimum cash redemption amount is $20; it is not an active withdrawal setting.

## 7. Reconciliation with prior Phase 3 work

The Phase 3 financial-hardening work remains relevant for journal idempotency, balanced postings, immutable history, concurrency protection, provider-event validation, and environment parity.

However, any earlier design that:
- presents separate USD Cash and LC player wallets,
- credits USD Cash directly as the player-facing reward balance,
- awards LC through Hustle/provider activity,
- permits cash-to-LC conversion,
- or uses a fixed $1 = 2 LC exchange rate

is superseded by this owner amendment.

Replace the player-facing cash wallet with Earned Loot. Retain only the internal USD accounting needed for provider settlement and cash-redemption obligations. Do not implement a payout rail or enable withdrawals.

## 8. Owner approval and balance decisions

- Either the owner or an authorized LegitLoot administrator may approve a Hustle Earned Loot reward. Approval authority must be checked server-side against the current admin/owner role; a client-supplied role is never trusted.
- A second independent approval is not required in the initial implementation. The architecture should leave room for a future two-approver threshold, but no threshold or second-approval rule is active until Sam defines it.
- Earned Loot and LootCoins available balances must never become negative. Do not create automatic player debt for ordinary provider reversals. A reversal that would exceed the unspent balance must enter a held/dispute workflow for a separately approved policy.

## 9. Implementation order and gates

1. Update architecture/schema proposal for Earned Loot and LC as separate ledgers, preserving historical records.
2. Implement pending provider event/reward-allocation records and approval lifecycle without enabling live provider credits.
3. Implement strict wallet summary returning available EL units, available EL cash-equivalent, pending EL units/value/status, and LC balance. Do not expose pending as available.
4. Implement atomic EL-to-LC package purchase, with configurable standard/promotional packages and concurrency/idempotency protections.
5. Keep LC gameplay issuance server-authoritative and separate from Hustle.
6. Add tests for fractional awards, 50/50 allocation, provider retries/conflicts, pending exclusion, approval, rejection, reversal, no-negative balances, concurrent spending, one-way conversion, promotion expiry/limits, and provider callback isolation.
7. Update Terms of Service and wallet explanatory copy for review; do not publish legal text without owner approval.
8. Keep all provider activation, payout/withdrawal activation, production migrations, and live money movement separately gated by explicit owner approval.

No earlier Phase 3 migration should be applied unchanged until it has been reconciled with this amendment.

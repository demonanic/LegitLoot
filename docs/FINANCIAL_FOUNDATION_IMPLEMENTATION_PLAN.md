# LegitLoot financial foundation — backend implementation plan

**Status:** implementation design in progress; no database migration applied.  
**Branch:** `feature/earned-loot-ledger-backend`  
**Base:** PR #36 head `3ad5ec22b9fa4dce6c2d6f57daa4cfc381b02b62`  
**Production safety:** no production writes, migrations, deploys, provider activation, payouts, withdrawals, or identity checks.

## Owner rules that this implementation must preserve

- Earned Loot (EL) and LootCoins (LC) are separate player balances and separate ledgers.
- Moonetix's configured user split is adjustable. The initial intended setting is 50%, not a hardcoded platform constant.
- Moonetix's player-facing reward field is already the player's share after the provider split. Record that value as the player's reward. **Never apply another 50% deduction in LegitLoot.**
- Record the provider payout and player reward separately, together with the split/configuration snapshot applicable to that event. A later split change affects future events only.
- A callback is evidence of an event, not authorization to credit available EL. Validate, deduplicate, reconcile/settle, then require owner or authorized-admin approval.
- Pending EL is excluded from available EL and cannot be converted.
- EL-to-LC is one-way, atomic, configurable by package, and uses available EL only. LC has no cash value, redemption, withdrawal, transfer, or reverse conversion.
- LC gameplay issuance is server-authoritative and separate from provider rewards.
- Append-only journal/audit history; reversals are compensating records. No negative available EL or LC and no automatic player debt.
- Payouts, withdrawals, identity checks, provider activation, and production changes remain separately gated by owner approval.

## Moonetix contract verified against publisher documentation

The official Moonetix Rewards and currency documentation states:

- `{payout}` is the publisher's USD payout for the step.
- `{reward}` is already in the publisher's configured user currency after conversion rate, user split, bonus, and rounding.
- The wall displays the configured reward, and the server must credit `{reward}` exactly as received; it must not convert or split it again.
- Each offer step is its own credit/postback. A multi-step offer is the sum of its rounded steps.
- A status 2 reversal carries the same positive `{reward}` as the original credit.
- Currency setting changes apply only to later credited steps. Existing credits and their reversals retain the original reward.
- Moonetix supports whole-number rounding or up to three decimals. The selected setting determines the smallest provider reward precision; do not assume it before the offerwall is created.

Implementation consequence:
- Preserve raw `reward` and `payout` decimal strings exactly as received after signature verification.
- Store the event-time currency name, conversion rate, split percentage, bonus percentage, and rounding mode when available from the provider configuration snapshot.
- Convert the exact provider reward to internal integer EL atoms only through a versioned scale configuration matching the active Moonetix currency setup. For up-to-three-decimal rewards, provider amount precision is at most 0.001 currency units; whole-number mode uses integer units.
- The provider reward already includes the 50% user split and any bonus. No second split is permitted.
- Cash-equivalent display must use the event's stored conversion-rate/configuration snapshot, not today's settings. Bonuses increase the user's reward for the same publisher payout and must remain visible in the event snapshot.
- Moonetix status 1 means the advertiser has reported a credited step; it does not mean the publisher's monthly USD settlement has already been paid. Keep event verification and publisher cash settlement as separate accounting facts.

References:
- https://docs.moonetix.com/rewards
- https://docs.moonetix.com/postbacks
- https://moonetix.com/academy/publisher-basics/set-up-app-currency

### Reporting API reconciliation

The Moonetix Reporting API provides `/v1/conversions` records with transaction ID, user ID, current status, reward, publisher USD payout, credited timestamp, and reversal timestamp. It supports pagination and up to 92-day date windows. Moonetix recommends daily reconciliation of the last 7 days of credited transactions and a longer reversal lookback (for example, 92 days).

The database reconciliation functions now require the Reporting API transaction/user/reward/payout/status to match the signed postback. The credited timestamp must fall inside the verified event-time configuration interval. Reversals require a matching Reporting API reversed status, reward, user, transaction, and reversed timestamp before an admin can process the compensating journal entry. When Sam changes Moonetix's split, conversion rate, bonus, or rounding setting, the prior config version must be closed and a new verified version recorded with the provider's effective time. The Reporting API's credited_at timestamp selects the correct historical version; old events are never recalculated with current settings.

The signed postback Edge Function source is at `supabase/functions/moonetix-postback/index.ts`. It verifies HMAC-SHA256, stores only the raw event, and returns a retryable error if storage fails. It is not deployed and has no secrets configured.

## Seven implementation steps

### 1. Journal integrity
- Replace idempotency-key early-return with a canonical request fingerprint.
- Identical retry returns the original transaction; conflicting reuse raises an error.
- Serialize concurrent postings by locking affected ledger accounts in deterministic order.
- Validate balanced postings independently by wallet/currency.
- Check post-transaction available balances while holding the same locks; reject any negative EL/LC available balance.
- Keep historical transactions and entries immutable.

### 2. Separate EL and LC accounting
- Preserve existing legacy `cash_usd` and `game_credits` enum/account history; do not reinterpret old rows.
- Add dedicated EL and LC account types/codes and system counterpart accounts.
- EL unit precision is configuration, not assumed cents. LC remains 10,000 atoms per LC.
- Provision separate pending, available, and held EL accounts plus LC available account for each player.
- Never put EL and LC in the same journal transaction.

### 3. Provider reward lifecycle
- Store callback facts idempotently: provider event ID, player ID, provider payout, player reward value/currency, split snapshot, signature result, payload digest, and timestamps.
- The Moonetix player reward is the already-split player amount; do not split it again.
- Callback receipt creates pending/review data only. No callback path posts available EL or LC.
- A separate trusted reconciliation operation records provider verification and settlement evidence.
- Owner/active-admin approval checks server-side role membership, unit conversion configuration, and verified settlement before posting EL.
- Rejection records reason and audit history without deleting source events.

### 4. Reversals and holds
- Preserve original approval and journal history.
- Record provider reversal as a new case/event.
- If unspent available EL covers the reversal, use a balanced compensating transaction after authorized review.
- If it exceeds unspent available EL, hold/dispute the excess. Do not create player debt or negative balances.
- LC reversals follow the same no-negative rule; no automatic conversion of LC back to EL.

### 5. Authenticated wallet RPC
- Implement `public.get_player_wallet_summary()` using `auth.uid()` only.
- Return only the authenticated player's calculated EL available/pending and LC balances.
- Only posted journal entries count.
- Return the exact PR #36 contract: `contractVersion=1`, EL unit strings and value-cent strings, LC atom string, `cashValue=null`, `withdrawable=false`, `transferable=false`, `pendingAvailable=false`, `pendingConvertible=false`.
- Do not expose journal rows or another user's balances.
- If EL precision/value conversion is not verified/configured, fail closed rather than inventing an EL cash-equivalent.

### 6. Staging verification
Required automated and database tests:
- same idempotency key + same payload is safe; same key + changed payload rejected;
- concurrent attempts cannot overspend EL or LC;
- mixed-currency/wallet journal transaction rejected;
- provider callback duplicate and conflicting duplicate handling;
- callback alone never credits available EL or LC;
- provider payout and player reward are stored separately; player reward is not halved again;
- split setting changes apply only to later events;
- unverified/unsettled/rejected reward excluded from available;
- owner/admin approval succeeds only with verification, settlement, and valid unit config;
- non-admin approval rejected;
- reversal within available balance compensates correctly; excess reversal held without debt;
- RPC auth isolation, no legacy fallback, pending exclusion;
- EL-to-LC purchase atomic/idempotent, package limits/expiry enforced, pending EL rejected;
- gameplay LC issuance rejects provider-origin sources.

### 7. Production gate
- Staging migration and tests must pass and be reviewed first.
- No production migration, deployment, provider activation, payout/withdrawal activation, or live-money movement without separate explicit owner approval.
- Keep the Terms draft unpublished until owner/legal review.

## Environment facts verified during implementation

- PR #36 is open/draft and its wallet parser expects the contract described above.
- The staging `private.wallet_kind` enum currently contains `cash_usd` and `game_credits`; the ledger account currency constraint allows legacy `LLC` and `LC` game-credit currencies. Staging also has `currency_scale` with existing values 1 and 10,000.
- Staging `private.admin_users` columns are `user_id`, `admin_role`, `is_active`, `created_at`, `created_by`, `deactivated_at`, and `deactivated_by`. Its active role set includes an owner. Production was previously observed not to have this table; production authorization must not be assumed equivalent.
- Existing `private.post_journal_transaction` accepts an idempotency-key hit without checking payload equality. It does not enforce available-balance nonnegativity.
- Existing `private.reward_allocations` is shaped around legacy cash/game-credit fields and should not be silently repurposed as the EL model.

## Implementation blockers to resolve before migration execution

1. **EL precision:** confirm Moonetix publisher reward currency, smallest EL unit, conversion ratio, and rounding with the actual publisher configuration and small-award tests. No live award approval or cash-equivalent calculation until then.
2. **Migration ordering:** PostgreSQL enum labels added by `ALTER TYPE ... ADD VALUE` cannot safely be used in the same transaction that adds them. Enum extension and functions/tables that reference new labels must be separate ordered migrations.
3. **Environment authorization parity:** staging has `private.admin_users`; production does not. Do not copy staging admin IDs or assume the production authorization table exists. Production migration remains gated.
4. **Moonetix event contract:** confirm exact callback fields and the publisher settlement/reconciliation source before enabling callback intake. The provider's already-split player reward must not be re-split.
5. **Account/system counterpart mapping:** verify all legacy account codes and currency scales in both environments before adding new EL/LC system accounts. Preserve legacy records unchanged.

## Branch implementation progress

- Added a journal-hardening migration draft at `supabase/migrations/202611230001_harden_journal_posting.sql`. It fingerprints canonical journal requests, rejects conflicting or unverifiable idempotency-key reuse, locks affected accounts in stable order, validates independent currency balances, and prevents negative player-owned account balances. It has not been applied to any database.
- Added a separate enum-extension migration at `supabase/migrations/202611230002_add_earned_loot_wallet_kinds.sql`. It adds EL and LC wallet kinds in a separate migration so PostgreSQL enum labels are committed before later migrations use them. It has not been applied.
- Added `earned-loot-reward.js` and tests. It preserves Moonetix's raw player reward and USD payout, snapshots the split/rate/bonus/rounding configuration, converts up to three decimal reward units to integer thousandth atoms, computes the cash-equivalent with integer arithmetic, rejects non-EL provider currency, and checks reversal transaction/reward identity.
- Updated the wallet parser to accept EL amounts to three decimal places and format them without floating-point conversion. Updated the account page integration to use that formatter and removed a duplicate `const status` declaration present in the inherited account script.
- Added a branch CI workflow for both the Moonetix reward and wallet contract tests. The workflow has not yet reported a GitHub Actions run; the corresponding Node test suites were run locally in the working environment and passed (7 reward tests, 8 wallet tests).

These are code changes only. Staging database verification, provider event lifecycle, reward approval/reversal SQL, EL-to-LC purchase, gameplay LC issuance, and production gating remain in progress.

## Explicitly not done

- No Supabase migration applied.
- No Supabase data/settings modified.
- No production change.
- No provider wall created or activated.
- No payout, withdrawal, or identity-check service enabled.
- No legal copy published.

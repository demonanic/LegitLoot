# LegitLoot — Account Deletion Design (AUTH-03)

**Status:** DRAFT v0.2 (Claude, 2026-11-21): owner decisions D1–D4 are **decided** (§ owner decisions, Complete Loop issues #3/#4). Implementation and data export remain **unbuilt**. Design only: no code, schema, setting or data is changed by this document.
**Closes when:** audit AUTH-03 (no account deletion or data-export path) is RESOLVED, meaning implemented **and** verified.
**Scope:** staging-first. Production rollout needs the normal release approval (`docs/RELEASE_RUNBOOK.md`).
**Legal note:** this is an engineering design, not legal advice. Retention periods and the player-facing wording in the Privacy Notice need owner (and, if used, counsel) approval.

---

## 1. Constraints from the current system (verified in source)

| Fact | Source | Consequence |
|---|---|---|
| `public.profiles.id` references `auth.users(id)` **on delete cascade** | `supabase/bootstrap/initial_schema.sql:13` | The profile is removed with a hard Auth delete. |
| `private.ledger_accounts.owner_user_id` references `auth.users(id)` **on delete restrict**, and every player gets LC ledger accounts at sign-up (`create_player_ledger_accounts`) | `initial_schema.sql:70`, `migrations/20261108120000_standard_lootcoins_wallet.sql:25` | **A hard Auth delete fails for every player.** This is by design: ledger history is append-only. |
| Journal transactions, journal entries and the audit log are immutable (triggers `journal_*_immutable`, `audit_log_immutable`) | `initial_schema.sql:292-296`, `migrations/20261108200000_server_controlled_admin_authorization.sql:63` | Ledger rows are never edited or deleted. Deletion must **pseudonymise**, not erase, the financial trail. |
| Also `on delete restrict` to `auth.users`: `provider_events`, `reward_allocations`, `payout_requests`, `offerwall_gg_conversions`, `offerwall_gg_callback_events`, `admin_users`, payout-simulator tables (staging only) | `initial_schema.sql:334-367`; `migrations/20261109130000_*`, `20261109070000_*`, `20261108200000_*` | Same: these rows survive and keep only the user UUID. |
| `audit_log.actor_user_id` is `on delete set null` | `initial_schema.sql:384` | Not a blocker. |
| Supabase Auth supports **soft delete**, `auth.admin.deleteUser(id, shouldSoftDelete: true)`. Deleting a user does not invalidate JWTs already issued; they stay valid until expiry. | Supabase docs: Auth admin `deleteUser` reference; "User Management → Deleting users" | Soft delete keeps the `auth.users` row, so restrict FKs hold. Which fields soft delete clears is **UNVERIFIED** and must be checked on staging (§6). Sessions must also be revoked explicitly. |
| Personal data held by LegitLoot itself: email (Auth), `profiles.username`, `display_name`, `avatar_path`, `raw_user_meta_data.display_name` (Auth). Payout recipient data is ciphertext plus a hint (cash deferred; expected empty). Staging only: `payout_simulator_withdrawals.destination_label`, CPAGrip attribution tokens, game saves, game events, handoff tickets. | schema files and staging snapshots | These are the fields to clear or remove. |
| LC have no cash value and cannot be paid out (spec §0.1) | `docs/PLATFORM_BUILD_SPEC.md` §0.1 | There is no balance to settle. The balance is simply left frozen on the closed account. **No ledger entry is posted for deletion** (no LC movement). |
| **Cash balance (two balances, owner 2026-11-21)** | `docs/PLATFORM_BUILD_SPEC.md` §0.5 | **Open owner decision.** A closing account may hold unpaid cash from verified Hustle completions, and payouts are off. What happens to that balance at deletion must be decided by Sam before deletion ships with a live cash ledger. Until then, the build treats cash like LC: frozen on the closed account, no ledger entry. |

## 2. Approach

**Close and pseudonymise; do not hard-delete.**
- Personal data is cleared or removed.
- The Auth identity is soft-deleted, so nobody can sign in with it and the email is freed (subject to §6 verification).
- Financial, provider and audit records keep only the random user UUID. Nothing in them identifies a person once Auth and profile data are cleared.
- Nothing in the append-only ledger is modified.

## 3. Player flow

1. **Request.** On `/account`, a signed-in player chooses **Delete account**. The page explains the effects in plain words:
   - you can't sign in again;
   - your Legit Coins balance and any game progress are lost;
   - some records without your name or email are kept for fraud prevention and accounting, for [retention period, owner decision D2].

   The player confirms by typing `DELETE` and, if the session is older than about 10 minutes, re-entering their password. The re-auth threshold is a proposal.
2. **Server records the request.** Edge Function `request-account-deletion` (verify_jwt = true) inserts a `private.account_deletion_requests` row (`status = 'pending'`, `requested_at`, `scheduled_for = now() + grace`) and writes an audit-log entry. It is idempotent: one open request per user.
3. **Grace period** (owner decision D1; proposal 7 days). The player can cancel by signing in and choosing **Cancel deletion**, through `cancel-account-deletion`. A confirmation email is sent if the sender is configured; otherwise the page states it.
4. **Processing.** After the grace period, a service-role job (manual admin action at first, scheduled later) calls `private.process_account_deletion(user_id)` and then the Auth admin API (§4).
5. **Done.** The request becomes `completed` with a timestamp. The audit log records who or what processed it.

**Update 2026-11-21:** the owner switched off production sign-up (~02:03 ET). Claude's live read-only checks returned `disable_signup: true` at 07:03 UTC and again at 20:34 UTC, with email sign-in still enabled. Existing accounts remain, so the interim procedure below still applies to them.

**Interim procedure (historical context, 2026-11-19).** Production sign-up was **still open**: `disable_signup:false` at the 2026-11-19 12:18 UTC probe, and two production profiles were inventoried. The owner-approved pause has not yet been applied or verified. Until it is applied **and** the self-serve flow ships, assume accounts can still be created and keep an interim deletion/export request path available. That path is a documented support-email request. The owner-designated intended address is `payouts@legitloot.site`, but it remains **UNVERIFIED**: there is no evidence yet that the mailbox exists, receives inbound mail, can send replies, or is monitored. The former `hello@legitloot.site` address is not the selected contact. Test `payouts@` end to end and record the evidence before publishing it as an operational deletion/export route. An admin verifies the requester controls the account email, then runs the §4 steps. The response time is **not yet a commitment**: 30 days is only a proposal pending owner decision D3. The Privacy Notice must describe this path once the address and D3 are confirmed. This document changes no production setting.

## 4. Processing steps (`private.process_account_deletion`, service_role only)

Runs in one transaction except the Auth API calls, which run after commit and are retried until they succeed. All steps are idempotent.

| # | Object | Action |
|---|---|---|
| 1 | `account_deletion_requests` | Lock the request row; require `status = 'pending'` and `scheduled_for <= now()`. |
| 2 | `public.profiles` | Set `username = null`, `display_name = null`, `avatar_path = null`, `deleted_at = now()` (new column). Keep the row so restrict FKs and RLS keep working. |
| 3 | Storage (avatars, if any) | Remove the user's objects **through the Storage API** (the Supabase docs say SQL deletes orphan files). Today no avatar upload exists, so it's a no-op check. |
| 4 | `private.ledger_accounts` | Mark the user's accounts closed (`closed_at`, new column) so no future posting can target them. **No journal entry is posted.** |
| 5 | Staging only: game saves, game events, handoff tickets, CPAGrip attribution tokens | Delete where possible (not financial records). If a table is append-only, pseudonymise instead. Its original SQL is still missing (REPO-03), so map the tables first. |
| 6 | `payout_requests` (expected empty) | If any open request exists, **stop** and escalate to the owner: money-movement gate. |
| 7 | `audit_log` | Append `account.deletion_processed` with the request id. No personal data in metadata. |
| 8 | Auth (after commit) | `auth.admin.signOut` / revoke the user's sessions and refresh tokens, then `auth.admin.deleteUser(id, shouldSoftDelete: true)`. |
| 9 | Request row | `status = 'completed'`, `completed_at`. |

**Every server function and every sensitive data path** (Edge Functions, `security definer` RPCs such as `get_wallet_summary`, and RLS policies on user-owned tables) must reject users with `profiles.deleted_at is not null`. Supabase documents that soft deletion is not reversible and that access JWTs already issued stay valid until they expire. Signing out or revoking refresh sessions does **not** immediately invalidate an existing access token, so this check is what blocks access in that window. References: Supabase docs, `auth.admin.deleteUser` (JavaScript reference) and the Auth sign-out guide.

## 5. Data export (same audit item)

Self-serve **export** returns profile fields, LC balance and the user's own ledger history as JSON from a server function (`export-account-data`, verify_jwt = true, read-only). It can ship before or with deletion. Proposed order: deletion first, export second.

## 6. Verification plan (staging, before AUTH-03 can be RESOLVED)

1. **PGlite tests** for `process_account_deletion`:
   - profile fields cleared;
   - ledger, journal and audit rows unchanged (row counts and hashes before and after);
   - ledger accounts closed;
   - a second run is a no-op;
   - an open payout request stops it;
   - a non-service caller is rejected.
2. **Staging E2E with a dedicated staging-only test account** (creation and cleanup documented; never a production account):
   - register → request → cancel → request → process;
   - sign-in fails afterwards;
   - re-registering with the same email behaves as expected;
   - record exactly which `auth.users` fields soft delete clears (closes the UNVERIFIED item in §1).
3. **Check that sessions are revoked:** an old access token is rejected by our functions because of the `deleted_at` check.
4. **Privacy Notice text** matches what the system actually does (LEGAL-01).

## 7. Decisions needed

| ID | Decision | Proposal | Who |
|---|---|---|---|
| D1 | Grace period before processing | **Decided:** 7 days, cancellable | Owner (issues #3/#4, 2026-11-21) |
| D2 | Retention of pseudonymised ledger, provider and audit records | **Decided:** keep while LegitLoot operates (the 6-year alternative was not chosen) | Owner (issues #3/#4, 2026-11-21) |
| D3 | Interim manual deletion response time (if accounts open before self-serve) | **Decided:** within 30 days | Owner (issues #3/#4, 2026-11-21) |
| D4 | Whether a deleted email may re-register immediately | **Decided:** yes, as a fresh account with nothing carried over | Owner (issues #3/#4, 2026-11-21) |
| D5 | Re-auth threshold for the delete action | Session younger than 10 minutes, or re-enter password | Agents (routine) |

## 8. Implementation tasks (after review)

| Task | Type | Gate |
|---|---|---|
| AUTH-03a: migration (`account_deletion_requests`, `profiles.deleted_at`, `ledger_accounts.closed_at`, `process_account_deletion`) + PGlite tests | Branch code | Review |
| AUTH-03b: Edge Functions `request-account-deletion`, `cancel-account-deletion` + `deleted_at` guard in existing functions | Branch code | Review |
| AUTH-03c: account page UI + copy | Branch code | Review |
| AUTH-03d: staging deploy + E2E (§6.2) | Staging writes | Independent review, then deploy under the standing staging authority recorded in `AGENTS.md` by an agent with staging write access (currently ChatGPT). Safety requirements: a dedicated staging-only test identity/mailbox; its creation and cleanup documented in the log; never a production account; never touch production. |
| AUTH-03e: export function | Branch code | Review |
| Privacy Notice section | Docs | Owner approval (LEGAL-01) |

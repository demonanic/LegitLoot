# Phase 2 — Legal and Signup Protection (staging)

## Delivered
- Draft Terms and Privacy policy pages replaced placeholders.
- Signup requires unchecked explicit confirmation of 18+ and agreement to both policies.
- Signup metadata records policy version, age-confirmation flag and browser user-agent string.
- Staging database trigger rejects new auth.users records missing consent metadata and records acceptance in a restricted table.
- Private consent evidence table has RLS enabled and privileges limited to service_role and postgres.

## Versions
- Terms: 1.0-draft
- Privacy: 1.0-draft

## Evidence/limitations
- The database trigger is installed in the LegitLoot staging Supabase project only.
- Trigger test evidence: installed/enabled trigger; security-definer function; table RLS enabled; service_role privileges; anon/authenticated table access revoked.
- IP address is not captured by this trigger. No DOB is collected; age is a self-attestation.
- Signup enforcement is implemented but end-to-end signup verification requires a fresh account test and email delivery check.
- These documents are drafts, not attorney-approved final legal instruments.
- No deletion scheduler, account deletion flow, disputes database/ticketing workflow, appeal flow, retention schedule enforcement, immutable IP-based consent evidence, arbitration provision or provider-by-provider SLA is represented as implemented.

## Publication blockers
1. Operator review and licensed legal counsel review.
2. Verify production data inventory and subprocessors.
3. Confirm actual production provider list and provider rules.
4. Define and implement data retention and deletion schedule.
5. Build/verify user deletion workflow and any 7-day cancellation period before describing it as operational.
6. Implement reward dispute/ticket workflow before promising tracking or SLA.
7. Verify consent capture through fresh staged signup and confirmation email.
8. Confirm legal contact and business details.

## Environment boundary
Staging only. No production deployment or merge.

## Phase 2 follow-on implementation checkpoint (Nov 27, 2026)
- Added staging migration for player reward dispute intake, owner-scoped read access and event evidence; the authenticated submission RPC creates the dispute and audit event.
- Added a retention-policy registry. Retention intervals remain intentionally unset/unapproved; no automatic purge is active because deletion schedules require owner/legal approval and data mapping.
- Added service-role-only account deletion identity finalization RPC, gated on request status `data_cleared`. This is a foundation; it has not been exercised against an actual user identity.
- Remaining gaps: scheduled worker to run the 7-day deletion lifecycle and finalize identities; admin dispute review/resolution/appeal UI and service workflow; approved retention periods and enforcement jobs; end-to-end tests of these workflows; legal review.
- No production actions or account deletion tests were performed.

## Phase 2 execution update (Nov 27, 2026)
- Staging migration added dispute API: authenticated owner-only retrieval; admin queue and status/resolution actions gated by active private.admin_users membership; each admin action requires a note and records dispute event plus audit entry.
- Staging admin guard was verified: unauthenticated SQL-context invocation of admin queue raises `Admin access required`.
- Account page branch updated with player dispute intake/history and account deletion request/status/cancel UI.
- New restricted admin dispute page added at `admin-disputes.html`; it relies on server-side active-admin authorization, not client role flags.
- Added scheduled GitHub Actions workflow scaffold for the existing staging account-deletion finalizer. It requires repository secrets `STAGING_ACCOUNT_DELETION_FUNCTION_URL` and `STAGING_ACCOUNT_DELETION_JOB_SECRET`; these cannot be configured through the available tools, so scheduling is not verified/active until owner configures them.
- Existing deployed `account-deletion-finalizer` Edge Function uses secret header validation, batch processing, existing deletion processor and soft auth identity deletion. No real identities were processed or deleted.
- Dispute/admin endpoints and user UI are not end-to-end tested in a signed-in browser; the admin guard negative test passed.
- Retention schedule enforcement remains blocked by operator/legal approval and mapping of records/subprocessors. Terms/privacy remain drafts requiring legal review and operator approval.
- No production deploy/merge or real account deletion occurred.

### Verification checkpoint
- Confirmed on branch: account page contains dispute submission form, dispute list and deletion controls; auth script contains API wiring; admin dispute page uses the admin RPC; scheduled workflow scaffold is present; PR #56 remains open/draft/unmerged.
- Supabase Security Advisor was rerun. Findings include private-schema RLS-enabled tables without policies (the project's intentional private-schema/privilege approach), 12 callable security-definer functions (review on a function-by-function basis; owner/admin guards and scope controls apply to Phase 2 functions), and leaked-password protection disabled. No performance/health lint findings were returned.
- Unauthenticated admin queue call is rejected. Signed-in UI/browser integration tests remain unverified.
- No schedule has been activated because repository secrets cannot be set through the available connection; no automated deletion processing is yet confirmed.


## UEP continuation checkpoint — 2026-11-28

- Confirmed staging Supabase project `legitloot-staging` is active/healthy and migrations through `phase2_optimize_dispute_rls_policies` are applied.
- Confirmed `account-deletion-finalizer` is deployed as v3 and the GitHub Actions scheduled-worker workflow is present. Worker activation/execution is still unverified because the required repository secrets cannot be configured/read through the available connector. No worker run was attempted that could finalize identities.
- Reviewed deletion processing and public facade SQL: 7-day due-date gate, open payout-request block, unpaid cash bucket gate, idempotent data-cleared/completed handling, game/profile cleanup, user-metadata clearing and soft Auth identity deletion are implemented. The deletion lifecycle is not end-to-end tested; do not process a real account.
- Reviewed user-linked data inventory across private tables. The retained/erased scope and retention periods remain unresolved owner/legal approval; do not add destructive cleanup or auto-purge rules without that approval.
- Signed-in dispute submission and admin resolution test remain blocked by Browser Use credit exhaustion. Backend source and admin membership guard were reviewed; prior unauthenticated admin denial test remains documented.
- Supabase advisor: security reports 29 private RLS/no-policy informational entries and 12 authenticated SECURITY DEFINER functions for individual review (some are intentional RPCs). Performance and health advisor snapshots require further validation/review; current execution could not establish full end-to-end acceptance.
- Browser-run credits are exhausted, preventing verification of the staging Pages preview, fresh signup/consent capture, account page, dispute flow, deletion status/cancel UI, and the live public legal-page deployment state. Earlier readback showed public Terms/Privacy were placeholders; current deployment state is not independently rechecked.
- Leaked-password protection remains disabled and requires a dashboard setting change not exposed by the connector.
- Removed a residential street address from both draft Terms and Privacy on the isolated PR branch (commits `a89a600` and `bcab91a`). This is a privacy minimization correction; legal pages remain drafts and are not published.
- No production merge/deployment, payout, provider activation, identity-check activation, or irreversible account deletion occurred.

### Remaining acceptance blockers
1. Staging authenticated E2E signup consent (including email-confirmation path) and consent record verification.
2. Staging signed-in player dispute submission and admin resolution tests with a verified admin/non-admin test session.
3. Disposable test-account deletion lifecycle test, including the worker, data clearing, metadata removal, and Auth identity deletion; must be performed only with a verified disposable staging account.
4. Configure and verify GitHub worker secrets/schedule and successful run, without exposing secret values.
5. Enable leaked-password protection in staging Auth settings and verify.
6. Final data/vendor inventory, retention schedule and deletion-scope approval, legal review, operator/business/contact details review and policy approval.
7. Verify staging preview deployment and public pages before any publication decision.

**Status: In Progress — not accepted/complete.**
- Added a staging-branch-only account data export UI: authenticated user can request the existing owner-scoped `export_account_data()` RPC and download its JSON payload. UI/code are committed on PR #56; browser end-to-end validation remains blocked. The export payload scope should be reviewed against the final data inventory before release.

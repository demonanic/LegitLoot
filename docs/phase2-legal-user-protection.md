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
- IP address is not captured by this trigger. No DOB is collected through signup; age is a self-attestation.
- Signup enforcement is implemented but end-to-end signup verification requires a fresh account test and email delivery check.
- These documents are drafts, not attorney-approved final legal instruments.

## Publication blockers
1. Operator review and licensed legal counsel review.
2. Verify production data inventory and subprocessors.
3. Confirm actual production provider list and provider rules.
4. Define and implement data retention and deletion schedule.
5. Verify user deletion workflow and any 7-day cancellation period before describing it as operational.
6. Verify dispute workflow before promising tracking or SLA.
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
- Supabase Security Advisor was rerun. Findings include private-schema RLS-enabled tables without policies (the project's intentional private-schema/privilege approach), callable security-definer functions (review individually), and leaked-password protection disabled.
- Unauthenticated admin queue call is rejected. Signed-in UI/browser integration tests remain unverified.
- No schedule has been activated because repository secrets cannot be set through the available connection; no automated deletion processing is yet confirmed.

## UEP v1.2 continuation checkpoint — Nov 28, 2026
- Recovered PR #56, staging branch, project checkpoint and Supabase project; staging remains healthy, PR draft/open/unmerged.
- Cloudflare PR comments report successful preview deployments for commit `5f8dbac`. A reduced read-only browser check reached the account preview with HTTP 200, but content extraction was not verified; the subsequent goal-based run failed on an invalid checkbox operation. No signup or data-changing action was performed.
- Static backend review: current staging counts show 2 consent records, 2 open disputes, 2 cancelled deletion requests, 1 pending deletion request, and 5 retention registry categories with no approved retention period. No identity was deleted or worker processing invoked.
- Reviewed consent trigger/table restrictions, authenticated dispute RPCs and admin membership guard, resolution/audit-note validation, account deletion reauthentication/7-day gate/cancel/block conditions, and export RPC structure.
- Export-scope gap identified: the initial export JSON did not include consent evidence, reward disputes or account-deletion request history, or several user-linked provider/game records. A staging-branch migration has been committed to extend the owner-scoped export; it is not applied to staging and requires SQL review and tests.
- Browser access remains limited; current successful HTTP status does not establish full UI behavior. Larger browser providers also report insufficient credits.
- Remaining gates: signup consent E2E, signed-in player dispute/admin resolution E2E, disposable-account deletion worker lifecycle test, worker secrets/schedule verification, leaked-password protection, export migration review/test, retention/data/vendor inventory and owner/legal approval.
- No production merge/deployment, payout/provider activation or identity deletion occurred.

**Status remains In Progress — not accepted/complete.**

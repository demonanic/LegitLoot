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

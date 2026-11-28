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
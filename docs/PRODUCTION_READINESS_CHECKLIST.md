# LegitLoot Production Readiness — Release Branch

Status: pre-launch hardening; this checklist is evidence-driven.

## Release scope
- Production remains on main until reviewed and accepted changes are merged.
- No payout execution, cash withdrawal, provider activation, production identity deletion, or live ledger writes during readiness work.
- Public website may be published as informational/game content only while earning, account, and payout services remain gated.

## P0 — Launch blockers
- [ ] Publish owner-approved Terms of Service and Privacy Notice (drafts are not legal approval).
- [ ] Verify production signup/account behavior and correct host allowlist/redirects.
- [ ] Confirm data inventory, processors, retention, and deletion/export scope.
- [ ] Enable breached-password protection in production auth settings.
- [ ] Verify wallet RPC/function auth and exact production ledger accounting semantics.
- [ ] Remove or retire remaining production references/functions for retired Offerwall.GG; verify public DB function privileges and Edge endpoints remain inert.
- [ ] Validate migration history is reproducible from clean state; review dependency/branch stack.
- [ ] Full auth, export, consent, dispute and deletion testing on disposable accounts (destructive deletion only after an approved test protocol).
- [ ] Verify admin access controls, authenticated denial, audit integrity, and mobile UX.
- [ ] Resolve high severity security findings; triage warnings and indexes with evidence.

## P1 — operational readiness
- [ ] Confirm analytics/monitoring/crash reporting and alerting.
- [ ] Verify worker schedules and secret availability; fail-safe behavior on worker errors.
- [ ] Provider contracts/approval, tracking, postbacks, reconciliation, and dispute processes documented before any activation.
- [ ] Test account support, abuse, moderation, rate limiting, fraud response, appeals, and incident process.
- [ ] Accessibility/mobile layout, page consistency, broken links, SEO/robots, and domain redirects.
- [ ] Release rollback plan, change log and smoke test.

## Current evidence (2026-11-28)
- Main production project migrations: initial platform schema, profile trigger, RLS, wallet RPC, standard LC wallet, legacy Offerwall.GG callback pipeline, secure callback tables, retired provider execution revocation.
- Production security advisor reports 12 private RLS tables without policies (private-schema isolation needs contextual review, not blanket policies), one authenticated SECURITY DEFINER function warning for get_wallet_summary(), and leaked-password protection disabled.
- Production performance advisor reported 10 unindexed foreign keys and two unused indexes.
- Production Edge Functions: retired Offerwall.GG postback handler returns HTTP 410; launcher returns HTTP 410. wallet-summary verifies the bearer token via auth.getUser() despite verify_jwt metadata false; review function auth/config and narrow CORS.
- Terms and Privacy pages on main remain placeholders, expressly not complete legal documents.
- Phase 1 admin cockpit and Phase 2 legal/user protection are open draft PRs and remain staging-focused. Neither has production E2E acceptance.
- Payouts/providers are not confirmed launch-ready. No provider activation or payout activation authorized here.

## Evidence to add
- Production smoke tests and authenticated account journey.
- Detailed security findings and fixes.
- Legal/operator approval and launch decisions.
- Release PR and rollback confirmation.

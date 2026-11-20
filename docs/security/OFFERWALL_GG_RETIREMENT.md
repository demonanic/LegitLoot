# Offerwall.GG permanent retirement

Owner decision: 2026-11-20 11:28 ET — permanently retire Offerwall.GG from LegitLoot. This supersedes all prior plans to preserve, repair, or rehabilitate the integration.

## Required end state

- Offerwall.GG is not an approved, selectable, launchable, or fallback provider anywhere in LegitLoot.
- No Offerwall.GG wall URL can be generated or launched from the site, game, admin UI, or API.
- No Offerwall.GG callback can create, update, or post any LC, wallet, journal, ledger, conversion, or reward record.
- No active Edge Function, RPC, trigger, scheduled job, or server path processes Offerwall.GG traffic. Retired endpoints may remain as inert HTTP 410 tombstones where deleting the deployed endpoint would risk accidental reactivation or ambiguous behavior.
- No Offerwall.GG provider configuration is used by the app or database. Any staging provider registry row must be marked retired/disabled and have no reward model, launch target, approval, or terms metadata.
- No Offerwall.GG postback URL remains configured on the LegitLoot publisher placement in the Offerwall.GG dashboard; the LegitLoot placement must be disabled or removed. Do not delete the entire Offerwall.GG publisher account unless separately authorized.
- No future source deployment may restore the old launcher or callback. Add regression tests over canonical sources, deployment snapshots/manifests, frontend registries, and relevant docs/build checks.

## Scope and preservation boundary

Remove active application code, provider registry/launch exposure, callback processing, and operational configuration. Preserve historical migrations, deployed-source snapshots, security findings, callback/conversion records, and this retirement record as forensic/audit evidence. Do not rewrite Git history, erase audit findings, or drop historical tables merely to make text searches return zero. Historical references explicitly labeled retired/legacy are acceptable and necessary.

## Environment and owner gates

- Integration branch: Claude implements the complete retirement and tests on build/legitloot-neon-synthwave; DaVinci independently reviews the exact SHA.
- Staging: after independent review, use existing owner authorization for reversible staging-only changes. Make both Offerwall functions inert, remove staging launch paths, revoke callback execution, neutralize the provider registry entry, and verify deployed function versions/source and database privileges. No callbacks or test conversions may be invoked.
- Production: current runtime containment is already recorded (wall-url v2 and postback v4 return HTTP 410; checked callback EXECUTE grants are revoked). Production main source drift and any production database/config cleanup must be prepared and reviewed, but no production merge, deployment, secret/config change, schema/data mutation, or privilege change is authorized by this retirement decision alone. Request separate owner approval for the exact production change set.
- Offerwall.GG dashboard: owner authorized removal of the LegitLoot placement's postback URL and publisher configuration. Preserve a screenshot/text record of placement identity and existing non-secret configuration first. Then clear the postback URL and disable/delete only the LegitLoot placement. Do not delete the entire publisher account, change payout details, or move funds. If dashboard access is unavailable, report the exact blocker; do not ask Sam to relay credentials.
- Secrets: do not read, expose, or rotate secrets. Supabase secret deletion is not included in this task; list exact obsolete secret names for a separate owner decision after runtime retirement is verified.

## Acceptance checklist

1. Repo-wide search across active source and all release/deployment manifests shows no executable Offerwall.GG path; historical/retirement references are explicitly classified.
2. No Offerwall.GG entry in the active Hustle/provider registry, UI, launch config, or API.
3. Canonical wall-url and postback Edge Function sources are inert; tests cover all HTTP methods and assert no body parsing, secret access, Supabase client/RPC calls, or reward side effects.
4. All staging deployment snapshots/manifests are aligned with inert sources; a test fails if any active snapshot can be deployed.
5. Staging callback RPC/function privileges cannot process Offerwall.GG or post LC; provider registry state is retired/disabled with no reward metadata. Keep historical tables and rows intact.
6. No production runtime or source reactivation path is introduced. Exact production source drift and approval-required actions are documented.
7. GitHub Actions pass on the exact PR head; DaVinci independently reviews changed files, test evidence, migration reversibility, and deployment isolation.
8. Offerwall.GG dashboard evidence shows the LegitLoot placement postback removed and placement disabled/deleted, without deleting the whole publisher account. If not completed, mark this criterion BLOCKED, not complete.
9. Update Master Control, Project Progress, Launch Readiness Audit, and Environment Source of Truth with exact commit/PR, staging evidence, dashboard evidence, and remaining production owner gates.

## Prohibited shortcuts

Do not merge a PR or deploy to production. Do not change production Supabase settings, secrets, grants, schema, or data. Do not invoke callbacks, test buttons, or conversions. Do not accept provider terms, alter payout settings, move money, or delete the whole publisher account. Do not map any provider amount, points, payout, or callback to LC. Taplayad App 10066 remains a separate owner-selected candidate, pending its own written permission and technical readiness.
## Owner dashboard report — 2026-11-20

- The owner reports removing the postback URL from every Offerwall.GG placement they attempted or successfully configured in the publisher dashboard. Treat this as owner attestation; no screenshot or independent dashboard readback was available in this run.
- The owner has not confirmed that the LegitLoot placement itself was disabled or deleted. Record dashboard acceptance criterion 8 as **PARTIAL**: postback URL removal is owner-reported; placement disable/delete remains UNVERIFIED.
- No other publisher-dashboard change was reported. Do not delete the publisher account, alter payout details, or move funds.
- This dashboard step does not complete technical retirement. Staging functions and snapshots, provider metadata, source/deployment reactivation paths, and production owner-gated cleanup remain outstanding.

# LegitLoot — Environment Source of Truth

**Last verified:** 2026-11-19  
**Purpose:** Single canonical map for GitHub, Supabase, and deployment environments. Update this file whenever a project, branch binding, deployment target, or backend function changes.

## 1. Canonical environment map

| Layer | Production | Staging / development |
|---|---|---|
| Website | https://legitloot.site/ | Cloudflare Pages branch preview |
| GitHub repository | `demonanic/LegitLoot` | Same repository |
| Git branch | `main` | `build/legitloot-neon-synthwave` |
| Supabase project | `LegitLoot` | `legitloot-staging` |
| Supabase project ref | `gkbqderyjcuxnjbsiffb` | `scmnxcsggquwtuyyjnnj` |
| Supabase connector label | `Supabase` | `Legitloot dev` |
| Supabase region | `us-east-1` | `us-east-1` |

**Important:** GitHub branch and Supabase project are separate deployment/versioning systems. A branch name does not automatically prove which database or Edge Function version it uses. Verify frontend project URLs, Pages branch bindings, deployed function versions, and migration history independently.

## 2. Verified Supabase inventory

Read-only connector inventory on 2026-11-19:

### Production — `gkbqderyjcuxnjbsiffb`

- Project status: ACTIVE_HEALTHY
- Database engine: PostgreSQL 17
- Applied migration history: 7 entries, latest version `20261108081650` (`secure_offerwall_callback_tables`)
- Deployed Edge Functions:
  - `offerwall-gg-postback` v3, verify_jwt=false
  - `wallet-summary` v4, verify_jwt=false
  - `offerwall-gg-wall-url` v1, verify_jwt=true
- Tables observed: `public.profiles`; private ledger, provider, reward allocation, payout, audit, platform settings and Offerwall.GG conversion/callback tables. All listed tables reported RLS enabled.
- Observed row counts: `public.profiles` 2; private journal transactions/entries 0; Offerwall.GG conversion/callback records 0. Counts are point-in-time metadata, not a full data audit.

### Staging — `scmnxcsggquwtuyyjnnj`

- Project status: ACTIVE_HEALTHY
- Database engine: PostgreSQL 17
- Applied migration history: 20 entries, latest version `20261118080655` (`game_platform_foundation`)
- Deployed Edge Functions:
  - `offerwall-gg-wall-url` v5, verify_jwt=true
  - `cpagrip-attribution` v4, verify_jwt=true
  - `offerwall-gg-postback` v7, verify_jwt=false
  - `provision-initial-owner` v7, verify_jwt=true
  - `admin-dashboard` v7, verify_jwt=true
  - `payout-simulator` v6, verify_jwt=true
- Tables observed include the production-style ledger/provider tables plus admin, payout simulator, CPAGrip attribution/conversion tables, `public.game_registry`, `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets`. All listed tables reported RLS enabled.
- Observed row counts: `public.profiles` 2; `private.admin_users` 1; game registry 1; game saves/events/handoff tickets 0; Offerwall.GG conversion/callback records 0; CPAGrip attribution/conversion records 0. Counts are point-in-time metadata, not a full data audit.

## 3. Immediate differences and drift to reconcile

1. Staging has 20 migration records; production has 7. Staging includes admin/payout-simulator, CPAGrip, Offerwall metadata, and game-platform migrations absent from production's migration history.
2. Staging has six deployed functions; production has three. `cpagrip-attribution`, admin, payout simulator, and owner provisioning are staging-only at this observation point.
3. Production has `wallet-summary` deployed even though the current production public account client may use a direct RPC; determine whether it is live dependency or orphaned.
4. Production and staging function versions differ substantially. Export source for each deployed function and compare against GitHub before any update.
5. The build branch is not a safe production release candidate until reconciled with current `main`; see `docs/LAUNCH_READINESS_AUDIT.md`.
6. Supabase connector account visibility is now confirmed for both projects. The prior audit statement that only `gauntlet` was visible is obsolete.

## 4. Owner-locked operational rules

- Never use production project ref in staging instructions or vice versa.
- No service-role or secret values in GitHub, docs, chat, logs, or screenshots. Record secret names and presence only where safely verified.
- No schema changes, Edge Function deployment, provider activation, reward posting, or production deploy without the applicable approval gate.
- `main` is the current production website source branch. `build/legitloot-neon-synthwave` is the authorized integration/work branch. No merge/deploy without owner approval.
- Production public sign-up pause has been approved by the owner. Preserve existing sign-in. Execution is pending a dashboard-capable authorized operator and must be verified afterward.
- Legit Coins are awarded only by the future server-authoritative game milestone/challenge/event pipeline; provider offerwall callbacks must not mint LC under the current owner decision.

## 5. Remaining verification work

- Confirm Cloudflare Pages production branch binding and preview branch binding from the Cloudflare account.
- Inspect the frontend Supabase project URL in `main` and the build branch, and compare with this map.
- Export deployed Edge Function source from both projects and compare file-by-file with GitHub. Never export secret values.
- Compare complete migration SQL history, schema, RLS policies, grants, triggers, and security advisors between both projects.
- Identify and document every function/table/config dependency before marking any code as safe to remove.
- Verify production Auth `disable_signup=true` after the approved pause is applied; do not disable sign-in or pause the entire project.
- Add a deployment manifest/runbook that names exact Git SHA, Pages environment, Supabase project ref, and function versions for every release.

## 6. Source and confidence

This file's project IDs, names, status, region, applied migration versions, deployed function names/versions/JWT settings, and listed table names/RLS flags were retrieved from the connected Supabase project tools on 2026-11-19. This was a read-only inventory. It did not inspect secret values, execute account flows, invoke reward callbacks, or change project settings. Counts and function versions may change; refresh this inventory before deployment.

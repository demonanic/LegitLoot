# LegitLoot — Environment Source of Truth

**Last verified:** 2026-11-20 05:13 ET
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

Read-only connector inventory rechecked 2026-11-20 05:13 ET (function versions below are current; migration-history counts remain the 2026-11-19 observation):

### Production — `gkbqderyjcuxnjbsiffb`

- Project status: ACTIVE_HEALTHY
- Database engine: PostgreSQL 17
- Applied migration history: 7 entries, latest version `20261108081650` (`secure_offerwall_callback_tables`)
- Deployed Edge Functions:
  - `offerwall-gg-postback` v4, verify_jwt=false (inert HTTP 410)
  - `wallet-summary` v4, verify_jwt=false (cash + gameCredits/LLC response; no current page caller found)
  - `offerwall-gg-wall-url` v2, verify_jwt=true (inert HTTP 410)
- Tables observed: `public.profiles`; private ledger, provider, reward allocation, payout, audit, platform settings and Offerwall.GG conversion/callback tables. All listed tables reported RLS enabled.
- Observed row counts: `public.profiles` 2; private journal transactions/entries 0; Offerwall.GG conversion/callback records 0. Counts are point-in-time metadata, not a full data audit.

### Staging — `scmnxcsggquwtuyyjnnj`

- Project status: ACTIVE_HEALTHY
- Database engine: PostgreSQL 17
- Applied migration history: 21 entries, latest version `20261119145340` (`offerwall_gg_record_only`)
- Deployed Edge Functions:
  - `offerwall-gg-wall-url` v5, verify_jwt=true
  - `cpagrip-attribution` v5, verify_jwt=true
  - `offerwall-gg-postback` v8, verify_jwt=false
  - `provision-initial-owner` v7, verify_jwt=true
  - `admin-dashboard` v7, verify_jwt=true
  - `payout-simulator` v6, verify_jwt=true
- Tables observed include the production-style ledger/provider tables plus admin, payout simulator, CPAGrip attribution/conversion tables, `public.game_registry`, `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets`. All listed tables reported RLS enabled.
- Observed row counts: `public.profiles` 2; `private.admin_users` 1; game registry 1; game saves/events/handoff tickets 0; Offerwall.GG conversion/callback records 0; CPAGrip attribution/conversion records 0. Counts are point-in-time metadata, not a full data audit.

## 3. Immediate differences and drift to reconcile

1. Staging has 21 migration records (latest `20261119145340 offerwall_gg_record_only`); production has 7. Staging includes admin/payout-simulator, CPAGrip, Offerwall metadata, and game-platform migrations absent from production's migration history.
2. Staging has six deployed functions; production has three. `cpagrip-attribution`, admin, payout simulator, and owner provisioning are staging-only at this observation point.
3. Production has `wallet-summary` deployed even though the current production public account client may use a direct RPC; determine whether it is live dependency or orphaned.
4. Production and staging function versions differ substantially. Export source for each deployed function and compare against GitHub before any update.
5. The build branch is not a safe production release candidate until reconciled with current `main`; see `docs/LAUNCH_READINESS_AUDIT.md`.
6. Supabase connector visibility is **per agent**. ChatGPT's connectors (`Supabase`, `Legitloot dev`) see both LegitLoot projects. Claude's Supabase connector is linked to a different Supabase account and, re-checked 2026-11-19 01:40 ET, still lists only `gauntlet` (`xtgpznknlaihmfohdmqs`). Claude's deployed-state evidence therefore comes from anonymous HTTP probes (§9) plus ChatGPT's connector inventory above.

## 4. Owner-locked operational rules

- Never use production project ref in staging instructions or vice versa.
- No service-role or secret values in GitHub, docs, chat, logs, or screenshots. Record secret names and presence only where safely verified.
- Production settings/secrets/schema/data changes, provider activation, reward posting, live financial activity, and production deployment remain owner-gated. Staging-only migrations, Edge Function deployments, and reversible staging tests are authorized under `docs/MASTER_EXECUTION_CONTROL.md` after independent review and exact-project verification.
- `main` is the owner-recorded production website source branch; its GitHub API `protected` field currently reports `false` (see §14). `build/legitloot-neon-synthwave` is the authorized integration branch. Agents may merge independently verified work into the integration branch and deploy to staging under standing owner authorization; production merge/deploy remains owner-gated.
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

## 7. Frontend and hosting map (Claude, 2026-11-19)

| Item | Production | Preview / staging | Evidence |
|---|---|---|---|
| Pages project | `legitloot` | same project, branch preview | Prior owner record; dashboard binding not inspected |
| Branch served | `main` @ `3fa7ca5` | `build/legitloot-neon-synthwave` | LIVE HTML == `main` (only Cloudflare `mailto` obfuscation differs); preview alias `https://build-legitloot-neon-synthwa.legitloot.pages.dev/` byte-identical to branch HEAD for 11 routes. **Binding is verified by content, not by reading the Cloudflare dashboard.** |
| Build command / env vars | None. Static files, no `package.json`, no build step; no `env.*`/`process.env` references in frontend source. Pages environment variables, if any exist, are unused by the code. | same | `git grep` on both branches |
| Supabase URL used by browser | `account-auth.js` hard-codes `https://gkbqderyjcuxnjbsiffb.supabase.co` (production) + production publishable key | `supabase-config.js` → `https://scmnxcsggquwtuyyjnnj.supabase.co`, `environment:"staging"`; `account-auth.js`, `admin.js`, `offerwall-launch.js`, `payout-simulator.js` refuse to run unless `environment === "staging"` | source on each branch |
| Edge Function CORS allow-list | n/a | `offerwall-gg-wall-url` allows `https://legitloot.site` **and** the build preview origin; `admin-dashboard` allows `*` | function source |

- **ENV-05 (VERIFIED 2026-11-19, from Cloudflare's PR #12 bot comments):** two Pages projects build every pushed branch: `legitloot` (branch alias `<branch>.legitloot.pages.dev`) and **`legitloot-preview`** (branch alias `<branch>.legitloot-preview.pages.dev`). Which project serves the `legitloot.site` custom domain is VERIFIED only by content (§7 table: `main`). The purpose of `legitloot-preview`, and its production branch and environment variables, are UNVERIFIED. The staging wall-url allow-list names only the `legitloot` build-branch alias.

**Cross-environment configuration findings**
- **ENV-01 (VERIFIED, correct):** No branch points the browser at the wrong project: `main` → production, build branch → staging.
- **ENV-02 (DEFECT, LOW):** `main`'s `earn-hub.js` reads `window.LEGITLOOT_SUPABASE_CONFIG`, which `main` never defines (no `supabase-config.js` on `main`; live `/supabase-config.js` → 404). Provider launch buttons would stay disabled if any provider became `active`. No current user impact because none is active.
- **ENV-03 (DEFECT, MEDIUM):** The staging `offerwall-gg-wall-url` source in GitHub allows the production origin `https://legitloot.site`. A staging function accepting production-origin calls blurs isolation; the deployed v5 allow-list is UNVERIFIED (source not exported).
- **ENV-04 (DEFECT, MEDIUM):** The build branch's frontend can only ever talk to staging (hard `environment === "staging"` guards). It cannot be released to production as-is without a reviewed config change; this is a release-process gap, not a live fault.

## 8. Edge Functions — deployed vs GitHub

Deployed versions from ChatGPT's connector inventory (§2). Reachability from Claude's anonymous `OPTIONS /functions/v1/<name>` probes (404 = not deployed). "Source in GitHub" checked across **all 11 remote branches**.

| Function | Production | Staging | Source in GitHub | Status |
|---|---|---|---|---|
| `offerwall-gg-postback` | v3, verify_jwt=false; reachable (405 to OPTIONS); **empty GET → 400 `INVALID CALLBACK`** | v7, verify_jwt=false; empty GET → 400 | `main` and build branch (different versions) | **Secrets configured in both** (code returns 503 when `OFFERWALL_GG_SECRET`/service key are absent). Both versions call `process_offerwall_gg_postback`, which posts LC. **DEFECT under LC policy — see audit PROV-07.** Exact deployed code UNVERIFIED (not exported). |
| `offerwall-gg-wall-url` | v1, verify_jwt=true; 200 | v5, verify_jwt=true; 200 | `main`, build branch | Version drift; deployed source UNVERIFIED |
| `wallet-summary` | **v4, verify_jwt=false; reachable; unauthenticated POST → 401 `Authentication required`** | not deployed (404) | `main`, build branch | **Orphaned in production:** live `account-auth.js?v=walletfix-2` calls RPC `get_wallet_summary` directly and never invokes this function. Function enforces its own auth. Recommend: confirm no other caller, then retire under a reviewed production change. |
| `admin-dashboard` | not deployed | v7; 200 | build branch only | Staging-only; expected |
| `payout-simulator` | not deployed | v6; 200 | build branch only | Staging-only; expected (must never reach production) |
| `cpagrip-attribution` | not deployed | v4; 200 | **none** | **Untracked deployed code** |
| `provision-initial-owner` | not deployed | v7; 204 | **none** (only the SQL helper `private.provision_initial_owner_admin` is in a migration) | **Untracked deployed code** |

Secrets by name only (inferred from code paths and probe responses, values never read): production and staging both have `OFFERWALL_GG_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` present for `offerwall-gg-postback`. `OFFERWALL_GG_PUBLIC_KEY` presence UNVERIFIED (wall-url requires a JWT before revealing configuration state).

## 9. Production vs staging drift report

| Area | Production | Staging | Drift / risk |
|---|---|---|---|
| Migrations | 7 records, latest `20261108081650` | 20 records, latest `20261118080655` (`game_platform_foundation`) | Staging-only: admin authorization, payout simulator ×4, Offerwall metadata, CPAGrip, game platform. Applied-version timestamps do not match repo filenames (Supabase assigns versions on apply), so mapping to files must be done by name/SQL. |
| Migration SQL in GitHub | `main` has bootstrap + 6 migrations (plausibly the 7 prod records) | Build branch has bootstrap + 13; **no branch contains CPAGrip or `game_platform_foundation` SQL** | Staging schema cannot be rebuilt from GitHub. |
| Migration lineage (MIG-01) | `main` `20261108130000_offerwall_gg_callback_pipeline.sql` includes an LLC→LC 1:1 legacy balance conversion | branch `20261109130000_*` omits it | Two incompatible lineages for one migration; see audit §15.5 |
| Wallet RPC contract | `get_wallet_summary()` returns `lootCoins.available` (production lineage ends at `standard_lootcoins_wallet`; UNVERIFIED against the live function) | returns `gameCredits.available` (`align_wallet_summary_response_with_staging_frontend` applied) | The client must handle both; `wallet-summary.js` on PR #11 does |
| Game platform objects | absent | `public.game_registry` (anon `GET` → `[]` 200, i.e. table exposed through the API but RLS returns no rows to `anon`), `private.game_saves`, `private.game_events`, `private.game_handoff_tickets` | Untracked; contract undocumented. |
| CPAGrip | absent | function + attribution/conversion tables | Untracked. |
| Admin / simulator | absent | present, `private.admin_users` 1 row | Expected staging-only tooling. |
| Auth | email on, `disable_signup:false`, `mailer_autoconfirm:false`; **2 profiles** | same; 2 profiles | Production sign-up pause **not yet applied** (§10). |
| Anonymous access controls | `profiles` 401, `rpc/get_wallet_summary` 401 | same; `private` schema not exposed (PGRST106) | VERIFIED consistent. |
| LC posting from provider | armed (secrets present; postback reaches validation) | armed | Both violate the 2026-11-19 LC policy. |

## 10. Production registration pause — status

- **Status: BLOCKED (access).** Probe at 2026-11-19 ~01:40 ET: production `GET /auth/v1/settings` → `disable_signup: false`.
- Why Claude could not execute: (1) Claude's Supabase connector lists only `gauntlet`; (2) the Supabase MCP toolset has no Auth-configuration tool in any case, and `disable_signup` is not a SQL setting; (3) the cloud browser opened `supabase.com/dashboard/project/gkbqderyjcuxnjbsiffb/auth/providers` and was redirected to the Supabase sign-in page. Agents must not enter the owner's credentials.
- Not substituted (per owner instruction): no project pause, no sign-in change, no live UI change, nothing on staging.
- **Owner action (≈1 minute):** Supabase dashboard → project `LegitLoot` (`gkbqderyjcuxnjbsiffb`) → Authentication → Sign In / Providers → turn **off** "Allow new users to sign up" → Save. Leave the Email provider enabled so existing users can still sign in. Alternatively, sign in inside the cloud browser session Claude left on that page and hand control back to Claude.
- **Verification (any agent, read-only):** `curl -s https://gkbqderyjcuxnjbsiffb.supabase.co/auth/v1/settings -H "apikey: <production publishable key from main/account-auth.js>"` must show `"disable_signup":true` and `"email":true`.

## 6. Source and confidence

This file's project IDs, names, status, region, applied migration versions, deployed function names/versions/JWT settings, and listed table names/RLS flags were retrieved from the connected Supabase project tools on 2026-11-19. This was a read-only inventory. It did not inspect secret values, execute account flows, invoke reward callbacks, or change project settings. Counts and function versions may change; refresh this inventory before deployment.

## 11. Independent review and exported staging source — 2026-11-19

ChatGPT independently retrieved the deployed source for production `offerwall-gg-postback` v3 and `offerwall-gg-wall-url` v1, and staging `offerwall-gg-postback` v7 plus the other five deployed staging functions.

- Exact deployed staging Edge Function source files and a version/hash manifest are committed under `supabase/environments/staging/functions/` and `DEPLOYED_FUNCTIONS_MANIFEST.json`.
- Six staging functions were exported: `offerwall-gg-postback`, `offerwall-gg-wall-url`, `cpagrip-attribution`, `provision-initial-owner`, `admin-dashboard`, `payout-simulator`.
- Sixteen current deployed PostgreSQL routine definitions are recorded in `supabase/environments/staging/schema-snapshot/routines.sql`.
- The 20 applied staging migration version/name records are in `supabase/environments/staging/MIGRATION_HISTORY.md`.
- These are environment snapshots, not original migration source. In particular, the original `game_platform_foundation` SQL remains unavailable. Do not replay the snapshot or pretend it is the missing migration.

### PROV-07 — Offerwall.GG can mint LC (VERIFIED)

Both deployed postback functions read `OFFERWALL_GG_SECRET`, verify the HMAC, and call `process_offerwall_gg_postback`. The deployed staging database routine writes balanced journal entries to the LC ledger. The production postback calls the corresponding public RPC wrapper. This conflicts with the owner-locked LC rule prohibiting provider callbacks from minting LC.

**Containment nuance:** Production `offerwall-gg-wall-url` v1 also requires `OFFERWALL_GG_SECRET` to sign wall URLs. Removing the project-level secret disables both postback processing and wall URL generation. It is therefore a temporary full integration shutdown, not a postback-only kill switch. No secret was changed; owner decision pending.

The observed callback/conversion row counts were zero at the last inventory. No callback was invoked during verification.

### M2-T1 reconciliation

ChatGPT approved the conflict-resolution rules with amendments recorded in `docs/MASTER_EXECUTION_CONTROL.md`: staging origin allow-list must not include the production site; preview Supabase configuration must fail closed to staging; production and staging migration histories remain separate; browser rendering is NOT VERIFIED if unavailable; the review PR must target the authorized build branch only, never `main`.

## 11. Production source export and wallet-contract verification — 2026-11-19

- **Production Edge Functions:** exact deployed source snapshots captured read-only for offerwall-gg-postback v3 (verify_jwt=false), offerwall-gg-wall-url v1 (verify_jwt=true), and wallet-summary v4 (verify_jwt=false). Files are under supabase/environments/production/functions/<function>/index.ts; manifest: supabase/environments/production/DEPLOYED_FUNCTIONS_MANIFEST.json. Platform-provided source hashes and deployed versions are recorded there. These snapshots are for reference/rollback and are not authorization to deploy.
- **Production migration history:** seven applied version/name records captured in supabase/environments/production/MIGRATION_HISTORY.md. The Supabase migration-history API does not expose original SQL; this is metadata only, not a replayable migration archive.
- **Wallet response contract:** read-only live RPC inspection confirms staging returns gameCredits.available, while production returns lootCoins.available. PR #11's parser supports both. Staging ledger query confirms lootcoins_available and platform_lootcoins_issuance LC accounts have currency_scale=10000.
- **PROV-07 current state:** production postback v3 and staging postback v7 are still ACTIVE and their source calls process_offerwall_gg_postback; production wall-url v1 is ACTIVE. Current callback/conversion counts were 0 in both environments. No callbacks or writes were performed. This remains a policy violation and launch blocker; production containment requires the owner decision already recorded above.
- **PR review state:** PR #11 and PR #12 remain open and currently report non-mergeable. Their branches are behind the current authorized build branch (13 and 10 commits respectively at the 2026-11-19 check). Cloudflare preview deployments succeeded; no GitHub workflow/status checks were returned for PR #11's reviewed head.
- **Outstanding verification:** production Cloudflare Pages binding is still only owner-recorded, not verified in the dashboard; production backup/PITR tier remains unverified. Exact production source is now preserved, but a full SQL/schema/policy/grant/trigger reconstruction is still outstanding.

## 12. Current coordination and deployment state — 2026-11-19 12:14 UTC

This section supersedes older PR-status paragraphs above where they conflict.

### GitHub / branch state at start of Sync Watch #2
- Integration branch: `build/legitloot-neon-synthwave`, head `5ab48bdcc3ca5e6e57412e0ae7fb348948bba724`; compare with `main`: 290 ahead, 0 behind.
- PR #11 (M2-T1 reconciliation) merged into the integration branch at `2824563`; no production merge/deploy.
- PR #13 (M2-T3 record-only Offerwall callback) merged into the integration branch at `1faf854`; migration/function source only, not deployed.
- PR #12 (runbook), #14 (staging CPAGrip origin correction), and #15 (account-deletion design) remain open. Their heads predate the latest integration base and must be refreshed before merge consideration. PR #9 remains an older draft.
- The owner has granted standing authority for independently reviewed integration merges and staging deployments, including staging-only migrations. This does not authorize production changes or live financial activity.

### Code and preview evidence
- PR #14 adds canonical `supabase/functions/cpagrip-attribution/index.ts` copied from deployed staging v4 with only `https://legitloot.site` removed from `allowedOrigins`; the deployed snapshot remains unchanged. Its test checks canonical function sources for production-origin allow-lists and compares the canonical CPAGrip source with the preserved snapshot. Source-level review found no new blocker.
- PR #15 is documentation-only. The account-deletion design preserves append-only ledger history and proposes no LC movement. Its statement that “no accounts [are] open” is not supported: the last production Auth probe returned `disable_signup:false`, and the inventory recorded two profiles. A correction was requested on PR #15.
- PR #12's runbook correctly marks Cloudflare production binding/trigger as NOT dashboard-verified and production migration history as metadata-only. A review note asks it to make the already-approved production sign-up pause an explicit precondition before public account onboarding.
- Claude reports 34/34 tests on `ab61c6e` and 37/37 on PR #14 head `3bb1226`; GitHub combined status and PR workflow queries returned no checks/runs for the inspected heads. Cloudflare bot comments confirm successful static preview deployments for PRs #12, #14, #15 in both Pages projects. These do not prove Edge Function or migration deployment.

### Deployed-state boundary
- The staging record-only Offerwall migration and matching Edge Function are present in the integration branch only. No staging deployment occurred in this check.
- The last verified Supabase inventory still showed production `offerwall-gg-postback` v3 and staging v7 active on the legacy LC-posting path; production `offerwall-gg-wall-url` v1 uses the same secret. No callback was invoked during this check. Production containment remains an owner decision.
- Production registration pause remains unapplied at the last probe (`disable_signup:false`). Do not claim it is paused until a fresh read-only verification returns true.
- No Supabase setting, secret, deployed function, schema, data, provider configuration, callback, or financial record was changed during this check.


## 13. Fresh deployed-state verification — 2026-11-19 12:14 UTC

Read-only Supabase recheck after PR #13 was merged into the GitHub build branch:

| Item | Production | Staging |
|---|---|---|
| `offerwall-gg-postback` | ACTIVE v3, `verify_jwt=false` | ACTIVE v7, `verify_jwt=false` |
| `offerwall-gg-wall-url` | ACTIVE v1 | ACTIVE v5 |
| Applied migration count | 7 | 20 |
| Latest migration | `20261108081650 secure_offerwall_callback_tables` | `20261118080655 game_platform_foundation` |
| Callback events | 0 | 0 |
| Conversions | 0 | 0 |

- The staging migration `20261119120000_offerwall_gg_record_only` is absent from the applied migration list. PR #13's source merge did not deploy it.
- Read-only `pg_get_functiondef` for both projects confirms the deployed `private.process_offerwall_gg_postback` still reads/locks LC ledger accounts, constructs journal entries, and calls `private.post_journal_transaction`. The public wrapper delegates to that private routine and checks for `service_role`.
- Therefore the provider-to-LC path remains active in **both** deployed environments despite the record-only source being merged into GitHub. The 0/0 callback/conversion counts show no observed callback records at this check; they do not make the active path compliant.
- No callback was invoked, no secret was read, and no function/migration/setting/schema/data was changed.
- Standing owner authority now permits the agents to deploy the reviewed record-only migration to staging first, then the matching Edge Function, and verify the deployed routine. Production containment remains an explicit owner gate.

Integration branch head after this check's coordination-document commits: `f8f54f7`. PRs #12, #14, and #15 are each 4 commits behind the current integration base (and 4 commits ahead on their own branches); refresh before merge consideration.


## 14. Independent coordination and environment recheck — 2026-11-19 (08:10 ET)

### GitHub and Cloudflare
- Integration branch `build/legitloot-neon-synthwave`: `c5525d0b9ac8b507eb7c242d166c2e369d70487d`.
- Production branch `main`: `3fa7ca58992f786f7b59f22b8fb758149a873d6b`; no production merge occurred.
- Current open PRs: #12 @ `9a1f136` (11 ahead / 0 behind), #14 @ `38715b4` (6 ahead / 0 behind), #15 @ `e32c2fa` (7 ahead / 0 behind); old draft #9 remains open.
- GitHub branch listing reports `protected:false` for `main` and the integration branch. The repository rulesets query returned no rulesets. The branch-protection detail endpoint returned 403 to the connected integration, so detailed rules could not be inspected. **Do not describe `main` as protected until verified.** This is GOV-01; see Master Control and PR #12 comment 7010370851.
- Cloudflare Pages checks succeeded for the integration head and PR #12/#14/#15 heads in both `legitloot` and `legitloot-preview`. These are static branch-preview deployments. They are not unit-test CI, Supabase Edge Function deployments, or database migrations. The production Pages binding/trigger remains dashboard-unverified.
- The repository contains only the older `.github/workflows/extract-game-artwork.yml`; there is no automated test workflow. Claude's local test reports (34/34, 37/37, 34/34 on #12/#14/#15) are not GitHub CI and were not independently rerun by ChatGPT.

### Browser-to-Supabase isolation
- `supabase-config.js` currently points to `https://scmnxcsggquwtuyyjnnj.supabase.co` and labels the environment `staging`.
- `account-auth.js` and `earn-hub.js` both require the exact staging URL, the staging label, and a non-empty publishable key before creating a client.
- **ENV-06:** `admin.js:boot()` and `payout-simulator.js:boot()` only verify the staging label and Supabase library before creating a client from `config.url`. `admin.html` and `payout-simulator.html` load these scripts. `tests/environment-isolation.test.mjs` does not runtime-test these two clients. Current configuration is correctly staging; no current production target was observed. Add exact URL checks and runtime tests. Review comment 7010372122 is on PR #14.
- `offerwall-launch.js` also uses an environment-label-only guard but is not loaded by the current `earn.html`; review its use before reactivating that legacy script.

### Live Supabase state — read-only
| Item | Production | Staging |
|---|---|---|
| `offerwall-gg-postback` | ACTIVE v3, `verify_jwt=false` | ACTIVE v7, `verify_jwt=false` |
| `offerwall-gg-wall-url` | ACTIVE v1 | ACTIVE v5 |
| Applied migrations | 7 | 20 |
| Record-only migration `20261119120000_offerwall_gg_record_only` | Not applicable / not applied | **Not applied** |
| Callback events | 0 | 0 |
| Conversions | 0 | 0 |
| Provider-sourced journal transactions | 0 | 0 |

Read-only `pg_get_functiondef` checks in both projects still show `private.process_offerwall_gg_postback` selecting/locking LC ledger accounts, constructing journal entries, and calling `private.post_journal_transaction`. Thus PROV-07 remains a live policy violation in both deployed environments despite the record-only source being merged into the integration branch. No callback was invoked and no database object/data was changed.

### Outstanding owner gates
- Production Offerwall containment: owner decision remains necessary because removing the shared `OFFERWALL_GG_SECRET` also disables Offerwall wall-URL signing.
- Production sign-up pause: last known `disable_signup:false` at 12:18 UTC; not freshly re-probed in this check.
- GitHub `main` branch protection and required checks: not verified; GitHub reports `protected:false`.
- Cloudflare production branch binding/trigger and production backup/PITR: NOT VERIFIED.
- AUTH-03 D1–D4, support-email verification, Terms/Privacy publication, game/early-access scope, and final production release remain open.

This recheck used read-only GitHub and Supabase queries. No settings, secrets, functions, migrations, schema, data, callbacks, or financial records were changed.


## 15. Independent environment and publisher recheck — 2026-11-19

### GitHub / preview environment
- Integration branch `build/legitloot-neon-synthwave` @ `1a8be57e9e4152b746fe1023f92bd77d486243a8`; production `main` @ `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. Compare: 311 commits ahead / 0 behind.
- PRs #12/#14/#15 remain 7 commits behind integration and need refresh. Their Pages preview deployments are static previews only; GitHub statuses/workflow runs were empty for the checked heads.
- `supabase-config.js` currently targets `https://scmnxcsggquwtuyyjnnj.supabase.co` and labels the environment staging.
- `account-auth.js` and `earn-hub.js` have exact staging-project checks. ENV-06 remains for `admin.js:boot()` and `payout-simulator.js:boot()`, which check only the staging label before using the configured URL. Current config is staging; no current production target was observed. Runtime tests for these two pages are still missing.

### Fresh Supabase inventory — read-only
| Item | Production `gkbqderyjcuxnjbsiffb` | Staging `scmnxcsggquwtuyyjnnj` |
|---|---:|---:|
| Applied migrations | 7 | 20 |
| `offerwall-gg-postback` | ACTIVE v3, `verify_jwt=false` | ACTIVE v7, `verify_jwt=false` |
| `offerwall-gg-wall-url` | ACTIVE v1 | ACTIVE v5 |
| `wallet-summary` | ACTIVE v4 | — |
| `cpagrip-attribution` | — | ACTIVE v4 |
| `payout-simulator` | — | ACTIVE v6 |
| `admin-dashboard` | — | ACTIVE v7 |
| `provision-initial-owner` | — | ACTIVE v7 |
| Record-only migration `20261119120000_offerwall_gg_record_only` | Not applied | **Not applied** |

- Read-only live SQL definitions in both projects still select/lock LC ledger accounts and call `private.post_journal_transaction` in `private.process_offerwall_gg_postback`. Callback events/conversions are 0/0 in both projects. No callback was invoked.
- **PROV-07 remains active in both environments.** The record-only source in GitHub has not been applied to staging. Production containment remains owner-gated.

### Taplayad selection and current integration status
- Owner selected Taplayad as the initial Hustle publisher target. Screenshots show Legitloot App ID 10066, Web platform, Rewarding category, “Legit loot” reward label, a $1 = 1 point display and a test-postback widget showing 1 Legit loot; a staging Supabase URL prefix is visible.
- No evidence from the screenshots that the form was saved, publisher approval is complete, or callbacks work. No setting was changed and no test postback was sent.
- Current `earn-providers.js` contains Offerwall.GG and CPAGrip entries but no Taplayad; staging has no Taplayad Edge Function. Keep Taplayad points separate from LC and do not treat the multiplier as a USD peg or wallet conversion. Provider terms, incentive eligibility, macros/signature, test mode, account approval and any binding agreement/paid/settlement commitments must be checked before live use.
- Owner-designated support address is `payouts@legitloot.site`; public pages still show `hello@legitloot.site`. Verify mailbox delivery/reply/monitoring before updating live contact copy.

### Deployed-state and launch boundaries
- Production sign-up pause's last recorded probe was `disable_signup:false` at 12:18 UTC; not freshly re-probed here.
- GitHub reports `main` `protected:false`; no rulesets returned and detailed branch protection could not be read (403). Do not claim the branch is protected.
- Cloudflare production Pages branch binding/trigger and production backup/PITR remain unverified.
- No Supabase setting, secret, function, migration, schema, data, callback, or financial record was changed. No deployment or PR merge occurred in this check.


### Coordination closeout — 2026-11-19
- The four documentation updates for this check advanced integration from `1a8be57` to `150d7a4`. This final batched documentation correction is being committed now; PR branches must be refreshed from the live integration branch tip when Claude resumes, not from either historical SHA.
- Immediately before this closeout correction, PR #12/#14/#15 were 11 commits behind integration (11/6/7 commits ahead respectively). The earlier branch-refresh instruction is superseded: use the current integration branch head at pickup and report exact compare counts after refresh.
- No PR merge, deployment, callback, provider activation, Supabase mutation, production action or financial activity occurred.


## 2026-11-19 09:40 America/New_York — Taplayad integration source of truth (owner-supplied screenshots)

- Selected provider: Taplayad; owner-supplied dashboard shows Legitloot, app ID 10066, Web platform, Rewarding category, and Active badge. Status is screenshot evidence only; not independently verified by API or a successful LegitLoot integration.
- Offerwall URL template: `https://offerwall.tplayad.com/10066/{user_id}`. The server must substitute the authenticated user's stable opaque internal identifier; never trust a client-supplied user_id.
- Publisher-side multiplier: `$1 = 1 points`; do not interpret as LC value or user USD redemption. Publisher dashboard also displays a $15 publisher withdrawal minimum; this is not a LegitLoot user withdrawal feature.
- Postback macros shown: `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{country}`, `{user_ip}`, `{status}`, `{sig}`. Documentation screenshot calls `{sig}` an MD5 security signature and lists source IP `176.97.212.58`. Full signature formula, transaction ID, retry behavior, and reversal semantics remain unverified.
- Treat the IP as a lead for current provider confirmation, not sole authentication. Confirm exact signature algorithm/canonical string/secret, app ID binding, transaction identity, status and chargeback semantics before live integration. Enforce replay/duplicate handling, least privilege, audit logs, fail closed, and no LC wallet/ledger path.
- No dashboard save, test postback, provider agreement, live activation, secret change, production action, or reward issuance authorized by this record.

## 2026-11-19 10:00 ET — M2-T3a staging containment deployed by ChatGPT

- Owner reaffirmed standing authority: agents may merge verified work into the integration branch and deploy reviewed changes to staging without per-action approval. Production and business-critical gates remain unchanged.
- Applied `offerwall_gg_record_only` to staging project `scmnxcsggquwtuyyjnnj`. Supabase recorded migration version `20261119145340`; the canonical migration file was renamed to `supabase/migrations/20261119145340_offerwall_gg_record_only.sql` so future migration tooling does not replay a mismatched timestamp.
- Deployed canonical `offerwall-gg-postback` Edge Function to staging: **ACTIVE v8**, `verify_jwt=false` (preserved from v7 because the function performs its own HMAC validation). The matching deployed source snapshot and manifest were updated; deployment source hash: `d17c18d7ca2643b9fac2fd8c336e741f27edea63e7bb819764b8927e796c321e`.
- Live database verification: `private.process_offerwall_gg_postback` now records provider callbacks/conversions only and contains no ledger-account lookup or journal-posting call. Execute grants: `service_role=true`, `anon=false`, `authenticated=false`.
- Post-deploy counts: callback events 0, conversions 0, Offerwall.GG journal transactions 0, Offerwall.GG journal entries 0. No callback was invoked; no provider secret was read or changed. Production was not touched.
- Additional source defect fixed before deployment: reversed provider callbacks carry a negative `payoutUsd`, while the metadata routine accepts only nonnegative original payout amounts. The Edge Function now stores the absolute textual amount for reversal metadata (without floating-point conversion); reversal state remains separately recorded. Added a regression test and updated migration-path references. Source-level checks passed. The full npm suite was not rerun in this session; Claude's prior 8/8 PGlite report applies to the earlier source head.
- **Result:** PROV-07 is contained in staging. Production Offerwall.GG v3 remains on its legacy LC-posting path and is still an explicit owner decision/blocker. Do not infer staging containment is production containment.

## 2026-11-19 10:10 ET — staging provider isolation and record-only deployment

- Staging project `scmnxcsggquwtuyyjnnj` only.
- `offerwall-gg-postback`: ACTIVE v8, `verify_jwt=false` (existing setting preserved; HMAC validation is performed by the function). Live source hash `d17c18d7ca2643b9fac2fd8c336e741f27edea63e7bb819764b8927e796c321e`.
- Applied migration `20261119145340_offerwall_gg_record_only`; live private routine has no ledger or journal write path. Grants verified: service_role can execute; anon and authenticated cannot.
- `cpagrip-attribution`: ACTIVE v5, `verify_jwt=true`; live source hash `4c06e6d542eaa267d01956148426e456231144f085ea3825371316a905a24e5c`. Production origin absent; bearer token and server-side `auth.getUser` validation verified. Canonical source and deployed snapshot match.
- `offerwall-gg-wall-url` remains ACTIVE v5 with `verify_jwt=true` and staging-only CORS origin.
- Counts after record-only deploy: callback events 0, conversions 0, Offerwall.GG journal transactions 0, Offerwall.GG journal entries 0. No provider callback invoked and no secrets changed.
- Production project was not touched. Production postback remains a separate owner decision.


## 2026-11-19 10:20 ET — Read-only live environment verification

### Production project `gkbqderyjcuxnjbsiffb`
- Applied migrations: 7; latest recorded migration remains `20261108081650_secure_offerwall_callback_tables`.
- `offerwall-gg-postback`: ACTIVE v3, `verify_jwt=false` (the function performs HMAC verification).
- Read-only SQL of `private.process_offerwall_gg_postback` confirms it locks the user's and platform LC ledger accounts, creates credit/reversal journal entries, and calls `private.post_journal_transaction`. Function EXECUTE is service_role-only, but the deployed callback function can invoke it after signature validation.
- **Production remains in violation of the owner-locked no-provider-to-LC rule.** This is not fixed by staging containment. No callback or production write was performed.

### Staging project `scmnxcsggquwtuyyjnnj`
- Applied migrations: 21, including `20261119145340_offerwall_gg_record_only`.
- `offerwall-gg-postback`: ACTIVE v8, `verify_jwt=false`; source validates HMAC and invokes the record-only database routine.
- Read-only SQL confirms `private.process_offerwall_gg_postback` stores callback/conversion/reversal records and has no ledger-account lookup or journal-posting path. EXECUTE is service_role-only; anon/authenticated EXECUTE are false.
- `public.game_registry`: one row, `zombie-invasion-defense` / Zombie Invasion Defense, `launch_url=null`, `status=development`, `is_listed=false`.
- `private.game_events`: 0 rows.
- `private.providers`: only Offerwall.GG and CPAGrip; both status `disabled`, with no approval reference, terms URL or terms verification timestamp.
- Edge Function inventory: no Taplayad or game-event integration function.
- **Migration source drift:** Supabase migration history contains `20261118080655_game_platform_foundation`, but the current integration Git tree and `supabase/migrations/` directory contain no corresponding migration file. Recover the authoritative SQL/source before future schema changes; do not replay or alter the live schema in this audit.

### Scope and safety
- These were read-only migration/function/schema/SQL checks. No callback was invoked, no provider test was sent, no secret or setting was read/changed, no migration/schema/data was changed, and no deployment or financial activity occurred.


## 2026-11-19 — Independent Sync Watch / PR #16 review — read-only environment recheck

### Production `gkbqderyjcuxnjbsiffb`
- Migration history: 7 entries.
- `offerwall-gg-postback`: ACTIVE v3, `verify_jwt=false` (provider HMAC is handled by function).
- Read-only `pg_get_functiondef` confirms `private.process_offerwall_gg_postback` looks up user/platform LC ledger accounts and calls `private.post_journal_transaction`. Production still violates the no-provider-to-LC policy. No callback invoked.

### Staging `scmnxcsggquwtuyyjnnj`
- Migration history: 21 entries, including `20261118080655_game_platform_foundation` and `20261119145340_offerwall_gg_record_only`.
- `offerwall-gg-postback`: ACTIVE v8; live `private.process_offerwall_gg_postback` records provider callbacks/conversions/reversals and contains no ledger/journal write path.
- Game registry: only `zombie-invasion-defense`, `launch_url=null`, `status=development`, `is_listed=false`.
- Edge Functions: admin-dashboard, offerwall-gg-wall-url, cpagrip-attribution, offerwall-gg-postback, payout-simulator, provision-initial-owner. No Taplayad or game-event function.
- Provider rows: Offerwall.GG and CPAGrip, both disabled with null approval reference/terms URL/terms verification. Offerwall.GG still carries `approved_reward_model={reward_mode: standard_virtual_currency, currency_code: LC, currency_name: LootCoins}`; this is contradictory stale metadata and must be corrected before any activation. No data changed.
- Migration history lists `20261118080655_game_platform_foundation`, but no matching SQL source exists in the integration Git tree. Do not reconstruct as original or replay it without authoritative evidence.

No Supabase settings, secrets, schema, data, migrations, callbacks, functions, or deployments were changed during this check.


## 2026-11-19 — Latest PR #16 coordination correction

- Claude-authored commit `3037903` updates the PR branch's `CLAUDE.md` to mark ENV-06 implemented. Claude-authored merge commit `cd6513e` then refreshed the PR branch from integration head `bbf6692`; both commits are verifiable GitHub artifacts. The PR branch now has 4 commits and is still open/unmerged.
- The integration branch subsequently advanced to `4f3e0cdb` with four additional documentation-only commits. Comparing PR head `cd6513e` to the current integration branch shows divergence (4 commits unique to each side); GitHub reports `mergeable=false`. This is not a code defect; the PR needs one final refresh against `4f3e0cdb` before merge-readiness can be reconsidered.
- The previous PR comment (7015970742) has been updated with this synchronization request. No additional PR comment is needed.
- Independent code review remains COMMENTED, not APPROVED. No GitHub status checks or Actions runs exist. Cloudflare preview posts are deployment previews, not CI. Claude's 42/42 test result remains self-reported; an attempted local clone/test was blocked because the execution environment could not resolve github.com, so no independent test run is claimed.
- Next: Claude refreshes PR #16 to current integration `4f3e0cdb`, reruns `npm test`, `node --check admin.js`, `node --check payout-simulator.js`, and `git diff --check`, then reports the exact new head. Avoid further documentation-only commits until this PR is synchronized and reviewed.


## 2026-11-19 — CI-01 PR #17 review and PR #16 refresh

### PR and CI evidence
- **PR #16 — ENV-06:** Claude refreshed it to current integration `04e5f46`; latest head `e11fd81`, base `04e5f46`, 6 commits, open, GitHub `mergeable=true`. Claude's verifiable PR comment reports `npm test` 42/42, `node --check admin.js`, `node --check payout-simulator.js`, and `git diff --check` clean after the refresh. No GitHub Actions run exists on PR #16 head; these results remain Claude-reported. Independent review 5979524271 remains COMMENTED, not APPROVED. No merge.
- **PR #17 — CI-01:** Claude added `.github/workflows/test.yml` with `contents: read`, `npm ci`, and `npm test` on pull requests and pushes to the integration branch. GitHub Actions run #2 (ID `44571890353`) completed successfully on head `e841729`; job log confirms all steps completed and **38/38 tests passed**. Run #1 (ID `44571591688`) also completed successfully. PR #17's run is a real GitHub-hosted test result.
- The 38-test run on PR #17 does **not** include PR #16's four new staging-guard tests: PR #17 is based on `bbf6692` and its head does not include PR #16's separate code changes. Thus PR #16 still has no CI result covering its 42-test suite.
- **Concrete CI defect:** `.github/workflows/test.yml` runs `git diff --check` after a clean checkout; this checks an empty working-tree diff and does not inspect the submitted PR patch. Review 5979612112 records the finding; correction comment 7016116302 clarifies that GitHub currently reports PR #17 `mergeable=true` (commit-history divergence is not itself a merge conflict). Fix the step to diff PR base...head and push before...head, or remove it.
- PR #17 base is still `bbf6692`, older than integration `04e5f46`; GitHub currently reports mergeable=true. Refreshing to current integration is recommended before merge consideration.
- PR #16 and #17 remain open. No PR was merged.

### Current launch and environment blockers (reconfirmed)
- Production Offerwall.GG postback v3 still reaches `private.post_journal_transaction` and can issue LC; staging v8 is record-only. Production containment remains owner-gated.
- Staging Offerwall.GG provider row remains disabled but has stale `approved_reward_model.currency_code=LC` / `standard_virtual_currency` metadata despite no verified terms/approval. Reconcile before any provider activation; no data changed.
- Staging migration history includes `20261118080655_game_platform_foundation`, but the migration source is absent from the integration tree. Claude's latest handoff says its own staging migration-history read was denied; ChatGPT has read access and can continue read-only source/schema comparison, but no schema/data changes.
- Staging registry remains only the unlisted Zombie Invasion Defense placeholder; no game-event or Taplayad Edge Function. Website `games.html` lists the two selected games, but `index.html` still shows Zombie Invasion Defense. Public section still says Earn, not Hustle; no Taplayad provider entry. Public contact links still use `hello@legitloot.site`, while owner-selected `payouts@legitloot.site` is unverified.
- PR #9 remains a stale draft with a browser assertion for Zombie Invasion Defense; comment 7015938125 requests refresh and correction.
- GitHub rulesets endpoint returned an empty list; direct branch-protection endpoint returned 403, so protection remains unverified.

### Next owner-independent actions
1. Claude: correct PR #17's `git diff --check` target and refresh PR #17 from current integration `04e5f46`; rerun Actions and post exact head/results.
2. Claude: keep PR #16 at `e11fd81` for review; no merge without authorized decision. CI should validate the 42-test suite once the workflow is available in the base or PR branch.
3. ChatGPT: continue read-only MIG-02 schema/source comparison and produce evidence for Claude; do not change schema/data or reapply migration.
4. Claude: implement Taplayad only after protocol and incentivized-traffic permission verification; provider callbacks remain record-only and outside LC.
5. Claude: rename Earn to Hustle; update homepage title and browser tests after the exact playable URLs/repos for both selected games are supplied; prepare five-plus challenge definitions with approved LC values only.

### Safety
No merge, deployment, Supabase settings/secrets/schema/data mutation, callback, publisher-dashboard save, provider agreement, live financial activity, or production change occurred during this check.


## 2026-11-19 — MIG-02 source recovered and schema compared (read-only)

- Retrieved the exact one-statement SQL from staging `supabase_migrations.schema_migrations` for version `20261118080655` / `game_platform_foundation`; rollback is NULL.
- Compared live staging columns/defaults/nullability, constraints, indexes, RLS, policies, triggers, grants and row counts for `public.game_registry`, `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets`. The catalog matches the recovered statement for these objects. All four tables have RLS enabled; only the public listed-games SELECT policy exists; anon/authenticated have no private schema usage/table access; service_role has required private access. No non-internal triggers exist. Row counts are 1/0/0/0 (the single row is the old Zombie Invasion Defense placeholder).
- Added read-only evidence at `docs/evidence/MIG-02_game_platform_foundation_recovery.md`. It contains the recovered SQL and catalog snapshot and is explicitly marked **DO NOT APPLY**; it is outside `supabase/migrations/`.
- Claude can now compare this evidence and create the canonical migration source plus regression tests. No staging schema/data was changed and no migration was replayed.


## 2026-11-19 — PR #17 CI fix verified; MIG-02 evidence delivered

### Verified PR changes
- **PR #17 / CI-01:** Claude's head `6aa37d4` fixes the ineffective clean-tree whitespace check. The workflow now fetches full history and checks the actual PR base...head or push before...head diff, with a first-push fallback.
- GitHub Actions run `44572686596` (run #3) completed successfully on `6aa37d4`. The job's `npm ci`, `npm test`, and `Whitespace check on the submitted patch` steps all passed; logs report 38 tests passed and 0 failed. Follow-up review `5979706554` records no remaining workflow defect in this limited diff. This is COMMENT, not approval/merge authorization.
- PR #17 remains open, base `04e5f46`, and GitHub currently reports `mergeable=true`. Integration has one later documentation/evidence commit `becd068`; incorporate it before merge consideration if desired.
- **PR #16 / ENV-06:** still open at `e11fd81`, base `04e5f46`; GitHub currently reports `mergeable=false` after integration advanced. Claude reports 42/42 and both `node --check` commands clean after the last refresh, but no Actions run covers PR #16. The 38-test CI run on PR #17 does not include PR #16's four staging-guard tests. Existing review `5979524271` is COMMENTED, not APPROVED.
- PR #16 coordination comment `7015970742` now asks Claude to refresh to `becd068`, rerun the suite, and use the MIG-02 evidence. No PR was merged.

### MIG-02 source recovery completed (read-only)
- Recovered the one SQL statement for staging migration `20261118080655` / `game_platform_foundation` from `supabase_migrations.schema_migrations`; rollback is NULL.
- Compared live staging columns/defaults/nullability, constraints, indexes, RLS, policies, triggers, grants and row counts for the four game-platform tables. The live catalog matches the recovered statement for these objects. RLS is enabled on all four; only the public listed-games SELECT policy exists; anon/authenticated have no private schema usage/table access; service_role has the required private access; no non-internal triggers exist; row counts are registry=1 and saves/events/tickets=0.
- Added `docs/evidence/MIG-02_game_platform_foundation_recovery.md` with the SQL and catalog snapshot, explicitly marked **DO NOT APPLY** and outside `supabase/migrations/`. This is evidence for Claude to restore the canonical source file and add regression tests. No schema/data change or migration replay occurred.

### Next owner-independent actions
1. Claude: restore the canonical MIG-02 migration source from the evidence file in a separate reviewed code change; add regression tests. Do not apply/replay.
2. Claude: refresh PR #16 to current integration `becd068`, rerun `npm test` (confirm the 42-test guard suite), `node --check admin.js`, `node --check payout-simulator.js`, and `git diff --check`.
3. Claude: refresh PR #17 to current integration if needed, retain the corrected diff check, and preserve the passing CI evidence.
4. Continue Taplayad/Hustle staging-only work after protocol and incentivized-traffic permission verification; provider events remain outside LC.
5. Correct homepage Zombie Invasion Defense card and Earn/Hustle labels once actual launch-game routes are confirmed; exact URLs/repos for both selected games remain required.

### Safety and owner gates
Production Offerwall.GG v3 still posts to the LC journal routine; production containment remains owner-gated. Staging Offerwall.GG's disabled provider row still carries stale LC reward-model metadata and must be reconciled before activation. Provider agreements/traffic permission, paid commitments, production settings/merge/deploy, branch protection administration, legal decisions, live financial activity and final release remain owner-gated. No merge, deployment, Supabase settings/secrets/schema/data change, callback, provider activation, payment or production change occurred.


## 2026-11-19 — Final coordination status after Claude PR refreshes

- Current integration head at start of this debrief: `1c3bbd2`.
- **PR #16 / ENV-06:** Claude-authored refresh commit `39b494c` is verified; PR head `39b494c`, base `becd068`, 7 commits. Claude's comment `7016250235` reports 42/42 tests, both `node --check` commands, and `git diff --check` passing. GitHub currently reports `mergeable=false` because integration has advanced beyond the PR base. No GitHub Actions run covers PR #16; its 42/42 result is Claude-reported. Review 5979524271 remains COMMENTED.
- **PR #17 / CI-01:** head `6aa37d4`, base `04e5f46`, 4 commits. The corrected `git diff --check` compares the submitted patch/push range, with full history and first-push fallback. GitHub Actions run `44572686596` passed all steps; the log reports 38/38 tests. Review 5979706554 found no remaining workflow defect in this limited diff. GitHub currently reports `mergeable=false` after integration advanced; no merge occurred. The 38-test run does not include PR #16's four staging-guard tests.
- **MIG-02:** exact staging migration SQL and live catalog comparison are committed in `docs/evidence/MIG-02_game_platform_foundation_recovery.md`, marked DO NOT APPLY. Claude's PR #16 comment `7016250235` says it is starting a separate MIG-02 branch from `becd068`; no corresponding branch, commit, or PR was visible at this check. Do not claim implementation has begun until a verifiable branch/commit/PR appears.
- PR #9 remains an old draft with Zombie Invasion Defense browser assertions; the stale-PR finding is on the PR.

Next: Claude should synchronize PR #16 and PR #17 once to current integration `1c3bbd2`; retain the passing PR #17 workflow and rerun it after sync. Claude should create the separate MIG-02 source-recovery branch from the evidence artifact and add tests, without replaying the migration or changing staging data. No further documentation-only commits are planned in this review cycle.


## 2026-11-19 — Environment snapshot: combined CI and deployed staging containment

### GitHub / Pages
- Integration branch at start of check: build/legitloot-neon-synthwave = b6bcf75870025b13312c9d7006dc0670ae0b4c13; main = 3fa7ca58992f786f7b59f22b8fb758149a873d6b.
- GitHub branch API returned 20 branches; none protected. main.protected=false; rulesets endpoint empty; detailed branch-protection endpoint 403.
- Open PRs: #9, #16, #17, #18, #19. PR #19 is a draft combined test candidate only.
- PR #18 and #19 preview bots deployed branch previews to both legitloot and legitloot-preview. On the PR branch, supabase-config.js explicitly points to staging project scmnxcsggquwtuyyjnnj. This is content-level confirmation that the checked preview source targets staging; Cloudflare dashboard project-level bindings/custom-domain routing were not independently verified. Do not treat preview bot success as production release.
- Combined Actions run 44583018543 on PR #19 head 8795409: 50 passed, 0 failed, 0 skipped; npm ci and git diff --check passed.

### Supabase
- Production project: gkbqderyjcuxnjbsiffb; staging project: scmnxcsggquwtuyyjnnj.
- Production migrations latest observed: 20261108081650 secure_offerwall_callback_tables. Staging latest observed: 20261119145340 offerwall_gg_record_only (after 20261118080655 game_platform_foundation).
- Production offerwall-gg-postback v3 ACTIVE, verify_jwt=false; live private.process_offerwall_gg_postback references ledger_accounts and calls post_journal_transaction.
- Staging offerwall-gg-postback v8 ACTIVE, verify_jwt=false; its source is byte-identical to supabase/functions/offerwall-gg-postback/index.ts in integration. Live private routine has no ledger/journal path. record_offerwall_gg_metadata also has no ledger/journal path. Staging callback events/conversions = 0/0.
- Both projects' private schema currently denies USAGE to PUBLIC, anon, and authenticated and grants USAGE to service_role.
- Staging private.providers: Offerwall.GG disabled but stale approved_reward_model={currency_code:LC,reward_mode:standard_virtual_currency}, terms URL/verification/approval reference null; CPAGrip disabled with no approved reward model; Taplayad absent. No data changed.

### Taplayad (public docs + owner screenshots)
- Owner-selected app 10066; owner screenshot shows Active badge and publisher point multiplier $1=1 point. This is screenshot evidence only, not proof of incentivized-traffic approval or LegitLoot integration.
- Owner URL template: https://offerwall.tplayad.com/10066/{user_id}. Current official docs instead show iframe https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}; confirm which route is correct for app 10066.
- Official docs: https://tplayad.com/docs; postback signature md5(app_id . user_id . api_secret); status 1 credited / 2 reversed; source IP 176.97.212.58; macros include user_id, payout, reward, offer_id, country, user_ip, status, sig. No unique transaction ID macro is listed; sample dedupe is offer_id + user_id. Signature does not bind reward/payout/offer_id/status. Do not trust this as transaction-level payload integrity or reliable reversal matching. Require provider clarification or stronger signed transaction proof before live callback handling.
- Publisher-side points/revenue/withdrawal are not LC, user cash value, USD peg, or user withdrawal.

No live callback was invoked; no project setting/secret, schema/data, publisher dashboard, or production resource was changed.


## 2026-11-19 14:42 ET — Current environment snapshot: PR #20 and fresh read-only Supabase check

### GitHub / Cloudflare
- Integration `build/legitloot-neon-synthwave`: `3fa518ee27c987a58f3196f682c7e13de483b6a8`; main: `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. Integration 375 ahead / 0 behind.
- 21 branches listed; every branch reports `protected:false`, including main.
- Open PR #20 head `04e40161a033d8f0e0ae63b2ec51aba7fc5bc2ce`, base integration `3fa518ee`; compare 2 ahead / 2 behind. PR #9 is draft, 12 ahead / 166 behind. PR #16–18 merged into integration only; #19 closed unmerged.
- Integration Actions run 44590656627: 50/50 Node tests, success. PR #20 run 44591660747: 54/54 Node tests, success. Workflow runs `npm ci`, `npm test` (`node --test tests/*.test.mjs`), and submitted-patch `git diff --check`; Python/Playwright browser tests are not part of CI.
- PR #20 bot comments report preview success for both Pages projects. Its `supabase-config.js` explicitly names staging project `scmnxcsggquwtuyyjnnj`; Cloudflare dashboard-level project bindings/custom-domain routing were not checked.

### Supabase
- Production `gkbqderyjcuxnjbsiffb`: 7 migrations; Offerwall.GG postback v3 ACTIVE, `verify_jwt=false`. Live SECURITY DEFINER routine `private.process_offerwall_gg_postback` locks the user's LC ledger account and platform issuance account, then calls `private.post_journal_transaction`. This is still a live provider-to-LC issuance path.
- Staging `scmnxcsggquwtuyyjnnj`: 21 migrations; Offerwall.GG postback v8 ACTIVE, `verify_jwt=false`. Live database routine is record-only and contains no ledger/journal operations.
- Staging v8 Edge Function `index.ts` matches integration file `supabase/functions/offerwall-gg-postback/index.ts` byte-for-byte (6,990 bytes); it has record-only result handling and no `post_journal_transaction` reference.
- Staging `private.providers`: CPAGrip disabled, no approval metadata; Offerwall.GG disabled but stale `approved_reward_model` still says LC/LootCoins and terms/verification/approval reference are null. Taplayad absent. Staging Edge Function inventory has no Taplayad function.
- Production function inventory includes Offerwall.GG postback v3 (`verify_jwt=false`), Offerwall.GG wall URL v1 (`verify_jwt=true`), wallet summary v4 (`verify_jwt=false`). Staging inventory includes Offerwall.GG postback v8, CPAGrip attribution v5, owner provisioning v7, admin dashboard v7, Offerwall.GG wall URL v5, and payout simulator v6; Taplayad absent.

No callbacks, data changes, schema changes, settings/secrets changes, provider activation, or deployment were performed.

## 2026-11-19 15:23 America/New_York — Environment verification

- Integration branch HEAD: 04ff43e3b9691e3acbdd9e6c9356530b9d61ec69; main HEAD: 3fa7ca58992f786f7b59f22b8fb758149a873d6b. GitHub reports main and integration as protected=false.
- PR #20 base 3fa518ee, head 20a8203; current integration and PR each advanced five commits from merge base. PR requires sync.
- PR #20 supabase-config.js and integration copy share blob SHA 8504420e; both explicitly use https://scmnxcsggquwtuyyjnnj.supabase.co and environment staging. Cloudflare bot reported a preview in both Pages projects; project-level environment overrides remain unverified.
- Production Supabase gkbqderyjcuxnjbsiffb: Offerwall.GG postback Edge Function v3 ACTIVE, verify_jwt=false; private.process_offerwall_gg_postback calls private.post_journal_transaction and issues LC.
- Staging Supabase scmnxcsggquwtuyyjnnj: Offerwall.GG postback v8 ACTIVE, verify_jwt=false; database routine is record-only with no journal/ledger operation.
- Staging private.providers: CPAGrip disabled; Offerwall.GG disabled but stale reward metadata names LC/LootCoins and terms/approval references are null. No Taplayad provider record or function.
- Staging Edge Function supabase/functions/offerwall-gg-postback/index.ts line 82 requires currencyName “Loot Coins”; docs/OFFERWALL_GG_INTEGRATION.md says “Loot coins”. Exact provider value is unverified; no callback sent.
- No project settings, secrets, schema, rows, functions, provider state or financial records were changed.


## 2026-11-19 16:54 America/New_York — Environment verification and provider protocol update

### GitHub / Cloudflare
- Integration build/legitloot-neon-synthwave at audit start: 3db61c0545c95ab28e525e070f3d66f58ab9fa63; production main: 3fa7ca58992f786f7b59f22b8fb758149a873d6b.
- 21 branches; every branch reports protected=false. Open PR #20 and stale draft #9.
- PR #20 head ad21bbecd0fd6e020925464132b637fd83bc2327, base 3db61c0; mergeable, synchronized, 0 behind. Actions run 44609090382 completed successfully through npm ci, npm test, and patch whitespace check. Formal independent COMMENT review ID 5984053898 found no blocking defect in the scoped copy diff. No merge.
- PR #20 and integration supabase-config.js have identical blob SHA 8504420e...; the checked-in config explicitly targets staging project scmnxcsggquwtuyyjnnj. Cloudflare bot reports successful branch previews in legitloot-preview and legitloot projects; these are not production deployments. Dashboard-level bindings remain unverified.
- The coordination-document updates advance integration; PR #20 must sync to the latest integration HEAD and rerun CI before final owner review.

### Supabase
- Production project gkbqderyjcuxnjbsiffb: postback v3 ACTIVE, verify_jwt=false; 7 migrations. Read-only SQL confirms live SECURITY DEFINER private.process_offerwall_gg_postback still calls private.post_journal_transaction and operates LC ledger accounts.
- Staging project scmnxcsggquwtuyyjnnj: postback v8 ACTIVE, verify_jwt=false; 21 migrations. Read-only SQL confirms private.process_offerwall_gg_postback is record-only with no ledger/journal call. Retrieved deployed v8 index.ts and compared it to integration source: exact content match, 6,990 bytes.
- Staging private.providers: CPAGrip disabled; Offerwall.GG disabled but stale approved_reward_model still names LC/LootCoins and terms URL, verification and approval reference are null. Taplayad absent. No row changed.
- No settings, secrets, schema, rows, migrations, functions, callbacks or financial records were changed.

### Taplayad protocol sources — conflicting new vs legacy system
- New/current docs: https://tplayad.com/docs. Macro set matches owner screenshots; signature md5(app_id . user_id . api_secret); status 1/2; server IP 176.97.212.58; no transaction-ID macro; example dedupe offer_id + user_id. Signature does not bind reward/payout/offer/status.
- Legacy docs: https://www.tplayad.com/doc/postback. Macros include transId (unique), reward, status, campaign_id, uuid; signature md5(subId . transId . reward . secret); retries up to five times and OK/DUP response guidance. Status is still outside the documented signature.
- New docs link separate new and old dashboard systems. Owner-supplied URL https://offerwall.tplayad.com/10066/{user_id} differs from the new docs iframe https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}. The owner's screenshot macros resemble the new system, but App ID 10066's account generation and route alias require provider confirmation.
- Do not implement live callback handling until the applicable account contract, payload authentication, transaction/reversal identity, retries and authoritative verification API are confirmed. Publisher-side points remain separate from LC. No terms accepted or settings changed.

### Offerwall.GG currencyName
Internal guide says Loot coins; staging handler requires Loot Coins. Public Offerwall.GG docs describe the name as publisher-defined, so exact case must be confirmed from the placement's authorized configuration. No callback sent.


## 2026-11-19 17:42 America/New_York — Current environment verification (read-only)
- GitHub: integration `a0cef5e69867d31235ffca5778dc11bab7cfccba`; main `3fa7ca58992f786f7b59f22b8fb758149a873d6b`; 393 ahead / 0 behind. 21 branches, all `protected=false`.
- PR #20 head `8cee6f7`, base `a0cef5e`, 9 ahead / 0 behind. Actions run 44624595265 passed 58 Node tests, no failures/skips, plus whitespace check. Independent COMMENT review 5984643477; not merged.
- Production Supabase `gkbqderyjcuxnjbsiffb`: 7 migrations; Offerwall.GG postback v3 ACTIVE, verify_jwt=false; `private.process_offerwall_gg_postback` is SECURITY DEFINER and calls `private.post_journal_transaction` for LC issuance.
- Staging Supabase `scmnxcsggquwtuyyjnnj`: 21 migrations; Offerwall.GG postback v8 ACTIVE, verify_jwt=false; routine is record-only. Provider rows: Offerwall.GG disabled with stale LC/LootCoins approved_reward_model and null terms/approval fields; CPAGrip disabled; no Taplayad row.
- Staging game registry: only ZID development/unlisted, launch_url null. Game saves/events/handoff tickets each zero. No challenge/milestone/season tables found.
- No project settings, secrets, schema, rows, functions, callbacks or financial records changed. Production containment remains owner-gated.


## 2026-11-19 17:49 ET — Cloudflare Pages preview isolation independently verified

Read-only Cloudflare API inspection of both Pages projects confirms the current PR #20 deployment is a **preview**, not a production deployment:

- Project `legitloot`: production branch is `main`; custom domains include `legitloot.site`. Canonical deployment is `environment=production`, branch `main`, commit `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. The latest PR branch deployment is `environment=preview`, branch `claude/hustle-rename`, commit `00d48d0958e5a2d35ebb0a173f6c9e3865dc80fd`, URL `https://d34ac518.legitloot.pages.dev`, with no aliases/custom-domain binding.
- Project `legitloot-preview`: only custom domain is `legitloot-preview.pages.dev`. Its latest PR branch deployment is also `environment=preview`, branch `claude/hustle-rename`, same commit `00d48d0`, URL `https://44b52782.legitloot-preview.pages.dev`, with no aliases. Its separate canonical deployment is on its configured preview-project production branch `design/industrial-cyberpunk-rebuild`; it is not bound to `legitloot.site`.
- Both projects have empty project-level preview and production `env_vars`; both inspected deployment objects have empty deployment `env_vars`. No Cloudflare environment-variable override was found.
- `supabase-config.js` in integration and PR #20 is byte-identical (blob SHA `8504420e1daec988198c5ea3cb0dfcb32b195a09`) and explicitly sets environment `staging` with URL `https://scmnxcsggquwtuyyjnnj.supabase.co`.
- At query time, the two latest PR deployments were queued/in progress; this check verifies their environment classification and configuration, not successful completion. No Cloudflare settings, bindings, domains or deployments were changed.


### 2026-11-19 17:51 ET — Preview deployment completion
The two PR #20 branch previews queried above subsequently completed successfully: `legitloot` deployment `d34ac518` and `legitloot-preview` deployment `44b52782` both reached Cloudflare Pages stage `deploy: success`, both remain `environment=preview`, and both are on branch `claude/hustle-rename` / commit `00d48d0`. Their URLs are random `*.pages.dev` preview URLs; neither has a custom-domain alias. The `legitloot` canonical production deployment remains on `main` at `3fa7ca5`. No production deployment or configuration change occurred.


## 2026-11-19 18:21 ET — Independent Sync Watch: PR #20, previews, and launch blockers

### Repository and PR state (read-only)
- Integration `build/legitloot-neon-synthwave` is `affb6f54cdc98b17334021dd9d2d00ff6106d7d5`; production `main` is `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. GitHub compare reports integration 402 commits ahead / 0 behind main.
- GitHub lists 21 branches; the branch API reports `protected=false` for all 21, including `main` and integration.
- PR #20 is open, non-draft, mergeable, 12 commits ahead / 0 behind integration. Head `2081d0fce8b5f066de500420f136cc6dc7de57d2`, base `affb6f54cdc98b17334021dd9d2d00ff6106d7d5`, 15 files changed. It remains a public-copy/navigation/test-only change; no provider, wallet, database or LC issuance logic changed.
- Actions run [44632297288](https://github.com/demonanic/LegitLoot/actions/runs/44632297288) passed `npm ci`, `npm test` (58 passed, 0 failed), and submitted-patch whitespace check. The Node log contains a non-blocking DEP0169 `url.parse()` deprecation warning. Python/Playwright browser tests are not part of this workflow.
- Independent COMMENT review `5984698005` found no blocking defect in the exact current PR head. It is not an APPROVE review or production-release approval. Latest Claude handoff comment is [7024420349](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7024420349), reporting sync to integration `affb6f5` and 58/58 local tests; no newer Claude handoff/implementation artifact was found.
- PR #9 remains a stale, non-mergeable draft: 12 commits ahead / 193 behind integration. Do not merge as-is.

### Cloudflare Pages preview verification (read-only)
- Both Pages projects now have successful PR #20 preview deployments on branch `claude/hustle-rename`, commit `2081d0f`, with `environment=preview`.
- `legitloot`: preview deployment `b883bf05`, URL `https://b883bf05.legitloot.pages.dev`, branch alias `https://claude-hustle-rename.legitloot.pages.dev`. Canonical production remains branch `main`, commit `3fa7ca5`, alias `https://legitloot.site`.
- `legitloot-preview`: preview deployment `567830da`, URL `https://567830da.legitloot-preview.pages.dev`, branch alias `https://claude-hustle-rename.legitloot-preview.pages.dev`. Its separate canonical deployment remains on `design/industrial-cyberpunk-rebuild`; it is not the `legitloot.site` production project.
- Both projects report empty project/deployment environment-variable maps. The checked-in `supabase-config.js` targets staging project `scmnxcsggquwtuyyjnnj`. No production deployment or Cloudflare setting was changed.

### Fresh Supabase read-only verification
- Production project `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 ACTIVE, `verify_jwt=false`. Live `private.process_offerwall_gg_postback` is SECURITY DEFINER and calls `private.post_journal_transaction`, with user/platform LC ledger account locks. Provider-to-LC issuance remains possible and violates the owner-locked policy.
- Staging project `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 ACTIVE, `verify_jwt=false`. Its live database routine is record-only: it stores callback/conversion/reversal events and contains no LC ledger or journal posting call.
- Staging `private.providers`: CPAGrip disabled with no approval metadata; Offerwall.GG disabled but retains stale `standard_virtual_currency / LC / LootCoins` reward metadata and null terms/approval fields; Taplayad is absent. No row changed.
- Migrations remain 7 production / 21 staging. No settings, secrets, schema, rows, functions or migrations were modified.

### M2-T4 game and challenge status
- Staging `public.game_registry` still contains only `zid / zombie-invasion-defense`, title Zombie Invasion Defense, status `development`, `is_listed=false`, `launch_url=null`.
- `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets` each contain 0 rows. No challenge, milestone or season tables were found in public/private schemas.
- Exact source repositories/playable URLs for the owner-selected **Zombies vs Heavy Metal** and **Rocket 2 Nowhere** remain unavailable in the connected repository inventory. Do not substitute unrelated games or invent URLs. M2-T4 remains active; ChatGPT is acting lead per Master Control.

### Taplayad and remaining controls
- Taplayad App ID 10066 remains selected as the initial Hustle publisher, but account-generation/protocol, canonical URL, payload-bound authentication, transaction identity, reversal matching, retries/idempotency, authoritative verification and incentivized-traffic permission remain unconfirmed. Keep any permitted staging work record-only. Publisher `$1 = 1 point`, `{reward}` and `{payout}` must never map to LC or user cash/withdrawal.
- Production Offerwall.GG provider-to-LC issuance is the critical owner-gated blocker. Branch protection is disabled on all 21 branches. Support-mailbox verification, sign-up-pause verification, provider agreements/paid commitments and final production release remain owner-controlled.
- No PR was merged, no deployment performed, no callback invoked, no provider terms accepted, no money moved, and no Supabase/Cloudflare settings, secrets, schema or data changed.


---

## 2026-11-19 19:41 ET — Live deployment and environment audit update

### Cloudflare Pages
- Project `legitloot` production deployment ID `6598c4c6-ecd5-49a1-9122-a55caa892cd8`: environment `production`, branch `main`, commit `4e0f533a1962767d7595f32c9a9bdcb979d31513`, deploy stage success, alias `https://legitloot.site`. Created 2026-11-20T00:24:06Z; completed 00:24:36Z (2026-11-19 19:24 ET). This was the specific owner-authorized PR #21 public-game release; no new production deployment occurred in this audit.
- Integration preview deployment on project `legitloot`: commit `907f1a6a5cf9cc1db9fda73cd9cd2053c6d8990e`, environment `preview`, successful. Production and preview remain separate Cloudflare environments.
- Read-only browser check verified production homepage, `/games.html`, `/zombies-vs-heavy-metal.html`, and embedded `https://demonanic.github.io/Legitloot-2/` all returned HTTP 200; game canvas rendered. No interaction/save was performed.

### Supabase
- Production `gkbqderyjcuxnjbsiffb`: 7 migrations; `wallet-summary` v4 ACTIVE (`verify_jwt=false`, handler performs its own bearer-token user validation); `offerwall-gg-wall-url` v1 ACTIVE/JWT; `offerwall-gg-postback` v3 ACTIVE/`verify_jwt=false`. Production SQL `public.get_wallet_summary()` is SECURITY DEFINER and returns cash pending/available/withdrawal-reserved/paid/held plus LootCoins. Production `account-auth.js` hardcodes this project and implements signup. Production `private.process_offerwall_gg_postback` is SECURITY DEFINER and calls `private.post_journal_transaction`. The disabled Offerwall.GG provider row is not checked by the deployed postback handler before RPC invocation.
- Staging `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 ACTIVE/`verify_jwt=false`; live database routine record-only, no LC journal path. Staging provider registry: Offerwall.GG disabled with stale LC reward metadata/no approval; CPAGrip disabled; Taplayad absent.
- Staging `offerwall-gg-wall-url` v5 is JWT-protected and record shows CORS allow-list `https://legitloot.site` plus staging preview origin. Production-origin access to a staging endpoint is a cross-environment exception; review before any production integration. No setting changed.
- No Supabase rows, migrations, functions, settings or secrets changed during this audit.

### GitHub branch alignment
- `main` = `4e0f533`; integration = `907f1a6`; compare: integration 404 ahead / 2 behind main, merge base `3fa7ca5`. PR #21's four public files are absent from integration; port before next release.
- PR #20 head `7912edd`, base `1e950355`; it is 13 ahead / 1 behind current integration. CI run `44637573706` passed 58 tests and whitespace check. Its Supabase config is staging-only; do not treat as production config.
- 22 branch names returned. Branch protection not independently re-queried this run.
- PR #21 and game commit `fcf4000` have no GitHub Actions runs/statuses returned; Cloudflare deploy succeeded but does not substitute for game test evidence.


---

## 2026-11-19 20:10 ET — Independent Sync Watch: PR #20 revalidated; ZVHM live; production policy blockers remain

### Repository, branches, PRs, and CI
- Integration `build/legitloot-neon-synthwave` is `fd758a772346cccd23f714cbcff575bf0e2c9176`; production `main` is `4e0f533a1962767d7595f32c9a9bdcb979d31513`. GitHub compare reports integration 409 commits ahead / 2 behind main, merge base `3fa7ca5`; the two main-only commits are the owner-authorized PR #21 game launch.
- GitHub lists 22 branches; all 22 report `protected=false`. Repository rulesets query returned an empty list. Do not describe either main or integration as protected.
- Open PRs: #20 and stale draft #9. PR #20 is non-draft and mergeable, head `c6dc85b27b1f7a11118ae34c37a285e590f21d33`, base/current integration `fd758a7`, 14 ahead / 0 behind, 15 files. Comparing the previous reviewed head `2081d0f` to current head shows only nine documentation/integration synchronization commits; the 15 application/test files are unchanged.
- GitHub Actions run [44649018861](https://github.com/demonanic/LegitLoot/actions/runs/44649018861) passed `npm ci`, `npm test` (58 passed, 0 failed, 0 skipped), and the submitted-patch whitespace check. The workflow does not run the Python/Playwright browser suite.
- Latest verifiable Claude handoff is PR #20 comment [7026808930](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7026808930): Claude reports syncing once to `fd758a7` at `c6dc85b`, no conflicts, 0 behind, and 58/58 local tests. No later Claude implementation artifact was found. Independent COMMENT review [5986084428](https://github.com/demonanic/LegitLoot/pull/20) rechecked current head, found no blocking defect in the scoped public-copy diff, and is not an approval. PR #20 is ready for owner review for integration acceptance only; it is not a production release artifact because its Supabase configuration is staging-only.
- PR #9 remains a stale, non-mergeable draft. No open PR currently integrates Rocket 2 Nowhere.

### Game milestone M2-T4
- PR #21 was specifically owner-approved and merged to `main` as `4e0f533`. Cloudflare confirms production deployment `6598c4c6-ecd5-49a1-9122-a55caa892cd8`, environment `production`, branch `main`, alias `https://legitloot.site`.
- Zombies vs Heavy Metal source is `demonanic/Legitloot-2`; the production play page embeds `https://demonanic.github.io/Legitloot-2/`. It is early access, device-local save only, and not connected to LegitLoot accounts or LC. PR #21 had no GitHub Actions run/status evidence; the Cloudflare deployment and browser smoke check are not a game CI pass.
- Integration `fd758a7` still contains the old ZID placeholder and lacks the four PR #21 public changes: `games.html`, `index.html`, `zombies-vs-heavy-metal.html`, and `sitemap.xml`. Port those changes into integration as a separate reviewed change before a later integration-based release; preserve the device-save/no-account/no-LC disclosure.
- Rocket 2 Nowhere remains unlocated in accessible repositories and is not represented as playable on production. The live Games page shows ZVHM plus “More Worlds Later.” Do not substitute another game or invent a route.
- Fresh staging query: `public.game_registry` still has one unlisted `zombie-invasion-defense` development row with null launch URL; `private.game_saves`, `game_events`, and `game_handoff_tickets` each have zero rows. No challenge, milestone, or season tables were found.

### Live public-site and account/legal findings
- Read-only browser check loaded all eight requested production URLs without visible page/navigation/JavaScript errors. Production still uses “Earn,” not “Hustle”; only ZVHM is shown playable; Rocket 2 Nowhere is absent.
- Production Rewards still describes Offerwall.GG completions crediting LootCoins and includes cash reward, pending/available/reserved/paid, and withdrawal concepts, even though provider/payout status labels say inactive. Production Account displays sign-in and a visible Create Account control and retains cash wallet fields in `main` source. Production `account-auth.js` hardcodes the production Supabase project and implements `client.auth.signUp`.
- Production Terms says formal terms are not published; Privacy says the full notice is in preparation and instructs visitors not to submit personal information. This conflicts with the visible account onboarding. Master Control records the production sign-up pause as owner-approved but unapplied; the current audit did not verify the Auth setting and did not change it.
- PR #20's integration branch corrects the public LC/Hustle copy and displays an LC-only account panel, but it is staging-configured and must not be promoted to main without a separate owner-approved production configuration/release plan.

### Supabase and provider controls
- Production `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 ACTIVE, `verify_jwt=false`; `wallet-summary` v4 ACTIVE; `offerwall-gg-wall-url` v1 ACTIVE. The deployed v3 handler verifies an HMAC over user ID, transaction ID, and amount but does not check the provider registry's disabled status before calling the posting RPC. Live `private.process_offerwall_gg_postback` is SECURITY DEFINER, locks user/platform LC accounts, and calls `private.post_journal_transaction`. Production `public.get_wallet_summary()` is SECURITY DEFINER and returns both cash and LC. Provider row is disabled but retains `standard_virtual_currency / LC / LootCoins` metadata with null terms/approval fields. Provider-to-LC issuance remains possible and violates policy.
- Staging `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 ACTIVE, `verify_jwt=false`, and live DB routine is record-only with no LC journal posting. `offerwall-gg-wall-url` v5 is JWT-protected but its CORS allow-list includes production origin `https://legitloot.site`; this is a cross-environment exception, not evidence the preview targets production. `cpagrip-attribution` v5 is ACTIVE/JWT-protected and only creates attribution tokens; its provider row is disabled. Staging providers: Offerwall.GG disabled with stale LC metadata/null approval and terms; CPAGrip disabled; Taplayad absent.
- Taplayad App ID 10066 remains unintegrated. Account generation, canonical wall URL, applicable callback protocol, payload-bound transaction authentication, unique transaction identity, reversal/retry semantics, authoritative verification, and incentivized-traffic permission remain unconfirmed. Keep any permitted staging work record-only; never map publisher points, `{reward}`, or `{payout}` to LC or cash.

### Cloudflare and safety
- Cloudflare `legitloot` canonical production deployment remains `main` / `4e0f533` with alias `https://legitloot.site`. PR #20 head `c6dc85b` has successful preview deployments in both `legitloot` and `legitloot-preview`, each classified `preview` with only `*.pages.dev` aliases. Checked-in PR Supabase config targets staging. Staging preview isolation is verified; the separate staging wall-url CORS production-origin allow-list remains to review.
- This Sync Watch instruction explicitly prohibited PR merges and deployments; none were performed. No Supabase settings/secrets, callbacks, provider settings/agreements, payments, schema, data, or production systems were changed.


---

## 2026-11-19 20:33 ET — Offerwall.GG Option A containment prepared (NOT DEPLOYED)

Owner explicitly authorized preparation and testing of production containment, preserving records and rollback, with separate owner approval required before any production deployment or database change.

- Created draft PR #24: https://github.com/demonanic/LegitLoot/pull/24, branch `security/offerwall-gg-production-containment`, based on production main `4e0f533`.
- Candidate Edge Function `supabase/functions/offerwall-gg-postback/index.ts` now returns HTTP 410 for every method. It does not parse callback data, read secrets, create a Supabase client, or call an RPC.
- Added dependency-free Deno tests for GET, POST and OPTIONS rejection in `supabase/functions/offerwall-gg-postback/index_test.ts`.
- Added `docs/security/OFFERWALL_GG_PRODUCTION_CONTAINMENT.md` documenting the separate database EXECUTE revocations, read-only privilege verification, preservation guarantees, and grant rollback. SQL is a prepared proposal only; it has not been executed and is not a migration.
- No production or staging function was deployed; no Supabase settings/secrets, SQL grants, schema/data, provider dashboard, postback URL, callbacks, payments or historical records were changed.
- Supabase connector calls could not be authenticated in this session (the linked-account IDs were rejected). Consequently the live project could not be re-queried during preparation. The candidate is based on the checked-in production function and migration source; this is not a live verification claim.
- Test execution is pending an environment with Deno/Supabase CLI. Source review confirms the handler contains no database/client/secret/RPC path; tests are authored but not yet executed.
- Next: restore Supabase connector access; independently inspect live production function/RPC definitions and effective grants; run Deno tests; review PR #24. Only after those pass should a separate production maintenance plan be presented for explicit owner approval. Consider removing the publisher dashboard URL only after verifying other configured products do not depend on it.
- Owner gate: production database privilege revocation and Edge Function deployment each require separate explicit approval. Dashboard changes and any provider-side contract changes remain separately gated.


## 2026-11-19 21:29 ET — Live environment and preview-isolation recheck

### Cloudflare Pages
- `legitloot` production remains bound to branch `main` at `4e0f533`, alias `https://legitloot.site`.
- PR #23 (`claude/rxt2-main`, `33a5240`) and PR #24 (`security/offerwall-gg-production-containment`, `7a31165`) each deployed successfully as **preview** in both `legitloot` and `legitloot-preview`; aliases are branch `*.pages.dev` URLs. The project preview environment variable maps are empty.
- Preview classification and empty Pages environment variables do **not** isolate hard-coded browser targets. Main-based PR #23/#24 previews inherit `account-auth.js` with a production Supabase URL and active sign-up handler. Do not test Account/auth flows on those previews until a fail-closed or staging-only guard exists. PR #22's `claude/rxt2-launch` branch uses `supabase-config.js` for the exact staging project and `account-auth.js` refuses non-staging/missing config.

### Supabase projects — read-only connector recheck
- Both projects are `ACTIVE_HEALTHY`: production `gkbqderyjcuxnjbsiffb`; staging `scmnxcsggquwtuyyjnnj`.
- Production Edge Functions: `offerwall-gg-postback` v3 ACTIVE (`verify_jwt=false`), `offerwall-gg-wall-url` v1 ACTIVE (`verify_jwt=true`), `wallet-summary` v4 ACTIVE.
- Production `private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)` and its public wrapper are SECURITY DEFINER, owned by postgres, and currently grant EXECUTE to `service_role`. The private function still calls `private.post_journal_transaction`; production provider callbacks can still mint LC. `public.get_wallet_summary()` remains SECURITY DEFINER and returns cash plus LC.
- Production `private.providers` has only Offerwall.GG: disabled, but stale `standard_virtual_currency / LC / LootCoins` metadata and null approval/terms evidence.
- Staging Edge Functions: `offerwall-gg-postback` v8 ACTIVE (`verify_jwt=false`), `offerwall-gg-wall-url` v5 ACTIVE (`verify_jwt=true`), `cpagrip-attribution` v5 ACTIVE (`verify_jwt=true`), plus internal functions. Staging Offerwall.GG callback SQL is record-only and does not call the journal. Staging provider rows are CPAGrip disabled and Offerwall.GG disabled with stale LC metadata; Taplayad is absent.
- Staging game registry contains only the unlisted ZID development row; saves, game events and handoff tickets are all zero; no challenge/milestone/season tables exist.
- No callbacks were invoked and no settings, secrets, grants, schema, data, migrations or functions were changed.

### Provider protocol note
- Taplayad owner template remains `https://offerwall.tplayad.com/10066/{user_id}`. Current public docs use signature `md5(app_id . user_id . api_secret)` with no transaction-ID macro; legacy docs use `transId` and `md5(subId . transId . reward . secret)`. These are incompatible and do not provide a verified full payload/transaction/reversal contract for App ID 10066. Current public Terms do not establish incentivized-traffic permission. No Taplayad code or provider row was added.


## 2026-11-19 21:32 ET — Post-debrief Claude sync verification

- Claude responded to the PR #20 sync request with verifiable PR comment `7028471600`: PR #20 is now head `6e2e51b`, based on integration `387d035`; the staging-only/fail-closed auth guard was preserved. GitHub Actions run `44661202504` passed 58/58 tests, 0 failures/skips.
- Claude also updated the stacked PR #22 to head `332ca07`, based on PR #20 head `6e2e51b`. GitHub Actions run `44661225287` passed 64/64 tests, 0 failures/skips. The PR #22 branch is 2 commits ahead / 0 behind its PR #20 base.
- The integration branch was at `6417323` immediately before this correction; it contains six documentation-only commits after `387d035`. PR #20 is therefore six documentation-only commits behind the integration head at this point. This correction is another documentation-only commit. No further sync request is made in this run to avoid repeated sync churn.
- PR #20 and #22 remain open/unmerged. PR #23 and #24 remain draft, preview-only, with the previously recorded preview-isolation and PR #24 Deno-test blockers. No merge or deployment occurred.


## 2026-11-19 21:33 ET — Preview-auth owner decision recorded

Main-based Cloudflare previews inherit production-targeting `account-auth.js`. PR #23 discussion comment `7028436334` confirms the game-only PR will not change that inherited production account code; a separate owner-approved PR is required to add a preview-host fail-closed guard while preserving the production custom domain. Until then, do not use Account/auth routes on PR #23/#24 previews.

## 2026-11-19 22:39 ET — Fresh environment verification and Taplayad protocol record

### GitHub and Cloudflare
- Current integration head: `7b240b2`; production `main`: `4e0f533`. Branch search returned 25 refs. Open PRs: #20, #22, #23, #24, #9. PR #20 remains `6e2e51b` / base `387d035`, eight docs-only commits behind integration; PR #22 remains `332ca07`, stacked on #20. CI: 58/58 and 64/64 respectively. PR #23/#24 are main-based drafts and preview-only.
- Cloudflare `legitloot` canonical production remains branch `main` / commit `4e0f533`, custom domain `https://legitloot.site`. Integration `7b240b2` and PR previews completed successfully in preview environments. Preview classification does not override a hard-coded backend URL: PR #23/#24 inherit main's production-targeting `account-auth.js`; do not use their Account/auth routes.
- The separate `legitloot-preview` Pages project has a legacy `design/industrial-cyberpunk-rebuild` production-branch deployment on its own `*.pages.dev` hostname; it is not the canonical `legitloot.site` production deployment and contains an old concept page with cash-wallet mockup copy. Treat it as a stale prototype, not a launch artifact.

### Production Supabase — `gkbqderyjcuxnjbsiffb`
- Project is ACTIVE_HEALTHY; 7 migrations. `offerwall-gg-postback` v3 ACTIVE (`verify_jwt=false`), `wallet-summary` v4 ACTIVE, `offerwall-gg-wall-url` v1 ACTIVE (`verify_jwt=true`).
- `private.providers` contains Offerwall.GG disabled, with stale `standard_virtual_currency / LC / LootCoins` reward metadata and null terms/approval evidence.
- `private.process_offerwall_gg_postback` and `public.process_offerwall_gg_postback` are SECURITY DEFINER and grant EXECUTE to `service_role`; the private routine calls `private.post_journal_transaction`. The deployed v3 Edge Function does not check the provider row's disabled status before invoking the posting path. Production provider-to-LC issuance remains possible if callback configuration is present. No callback or privilege change occurred.
- `public.get_wallet_summary()` is SECURITY DEFINER and returns cash and LC. Security Advisor still reports leaked-password protection disabled and an authenticated SECURITY DEFINER warning. The actual Auth sign-up pause setting was not retrievable with the current read tools.

### Staging Supabase — `scmnxcsggquwtuyyjnnj`
- Project is ACTIVE_HEALTHY; 21 migrations. `offerwall-gg-postback` v8 ACTIVE (`verify_jwt=false`) and its live SQL routine is record-only: it stores provider conversion/reversal state and does not post journal entries. `offerwall-gg-wall-url` v5 and `cpagrip-attribution` v5 are ACTIVE/JWT-protected.
- Staging providers: Offerwall.GG disabled with stale LC metadata, CPAGrip disabled, Taplayad absent. Staging wall-URL CORS still allow-lists production origin `https://legitloot.site`; this is a cross-environment exception to review, not proof the production site currently uses staging.
- `public.game_registry` contains only `zid` / `zombie-invasion-defense`, status `development`, `is_listed=false`, `launch_url=null`. Counts: `game_saves=0`, `game_events=0`, `game_handoff_tickets=0`; no challenge/milestone/season tables.
- Staging `public.get_wallet_summary()` is SECURITY DEFINER and returns `cash` fields plus `gameCredits`; `currency.cash=USD`, `gameCredits.cashValue=null`, `withdrawable=false`. The PR #20 browser parser ignores cash and reads only `gameCredits.available`, but the cash buckets are still sent to the browser. `currency.gameCredits` is `LLC`, not `LC`; parser currently ignores that metadata. Do not describe the backend wallet contract as fully LC-only until resolved.

### Taplayad App 10066 — protocol and permission evidence
- Preserve owner-supplied URL template: `https://offerwall.tplayad.com/10066/{user_id}`. No Taplayad provider row, code, saved publisher setting, or callback exists; screenshot Active badge is not proof of integration or traffic permission.
- Current public docs: `https://tplayad.com/docs`. They list `user_id`, `payout`, `reward`, `offer_id`, `status`, `sig`; status 1=credited, 2=reversed; signature `md5(app_id . user_id . api_secret)`, which does not bind transaction ID, reward, payout, offer or status. Their iframe example uses `https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}`, not the owner-supplied host/template.
- Legacy public docs: `https://tplayad.com/doc/postback`. They list `subId`, `transId`, `reward`, `payout`, `status`, `campaign_id`, `uuid`; signature `md5(subId . transId . reward . secret)`; status 1/2; `OK`/ `DUP` responses; up to five retries after 60 seconds. The legacy signature still does not bind status or payout. The two systems conflict; neither is verified for App 10066.
- Public Terms `https://tplayad.com/terms` were last updated 2026-10-29, require publisher accounts to be 18+, and leave payment terms to the dashboard. No app-specific written permission for LegitLoot's exact incentivized model was verified. Keep record-only pending written confirmation of active system, canonical URL, incentivized traffic, complete signed fields, unique transaction ID, reversal/retry/idempotency and response contract. Never map the publisher's $1=1 points multiplier or callback `{reward}`/`{payout}` to LC/cash.

### Safety
- No production/staging setting, secret, SQL grant, schema/data, migration, Edge Function, callback, provider dashboard, agreement, payment, reward issuance, or deployment was changed. No PR was merged.


## 2026-11-19 22:51 ET — PR #24 pure-handler testability fix prepared (NOT DEPLOYED)

- PR #24 remains draft on `main`; candidate head is now `fb2e890`. The original test-import side effect is fixed in the PR branch: new `handler.ts` contains only the inert HTTP 410 handler; `index.ts` alone imports it and starts `Deno.serve`; `index_test.ts` imports the pure handler and checks GET/POST/OPTIONS, `410`, `no-store`, and that POST bodies remain unread.
- Added `.github/workflows/offerwall-gg-containment-tests.yml` to run the Deno test file. No GitHub Actions run has surfaced for the new head yet, so the Deno suite is **not verified**. A local Node 22.16 smoke test against the actual handler passed 3/3 methods; this is not a Deno test result.
- PR comment `7029857955` records the fix and exact test limitation. The endpoint remains inert; no Supabase function was deployed, no SQL grants/settings/secrets/schema/data changed, and no callback was invoked.
- PR #24's separate preview-auth issue remains: its main-based preview inherits production-targeting `account-auth.js`. Do not use Account/auth routes. Production containment still requires separate owner approval.


## 2026-11-19 22:52 ET — PR #24 Deno containment tests passed (NOT DEPLOYED)

- PR #24 remains draft at head `fb2e890`. GitHub Actions run [`44670475596`](https://github.com/demonanic/LegitLoot/actions/runs/44670475596) completed successfully on PR merge commit `f54fc1e`; Deno `2.9.8` ran `index_test.ts`: **3 passed, 0 failed** (GET, POST, OPTIONS; 410/no-store; POST body not read).
- The pure-handler split is therefore test-verified. The run validates only the inert handler and test isolation; it does not verify deployed production containment, SQL grants, callback behavior, provider dashboard settings, or preview auth.
- PR comment `7029857955` was updated with the successful run. PR #24 remains a draft and owner-gated. No merge, deploy, Supabase change, callback, or publisher setting change occurred.

## 2026-11-19 23:02 ET — Independent read-only verification

- Both Supabase projects are ACTIVE_HEALTHY. Production has 7 migrations and functions `offerwall-gg-postback` v3 ACTIVE/`verify_jwt=false`, `wallet-summary` v4 ACTIVE, and `offerwall-gg-wall-url` v1 ACTIVE/`verify_jwt=true`. Staging has 21 migrations through `20261119145340 offerwall_gg_record_only`; functions are `payout-simulator` v6, `provision-initial-owner` v7, `cpagrip-attribution` v5, `offerwall-gg-postback` v8, `offerwall-gg-wall-url` v5, and `admin-dashboard` v7 (all ACTIVE; JWT verification remains enabled except the postback functions).
- Production `private.providers` still has Offerwall.GG disabled with stale LC/LootCoins reward metadata and null terms/approval fields. Live private/public `process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)` routines are SECURITY DEFINER and grant EXECUTE to `service_role`; the private routine calls `private.post_journal_transaction`. Production postback v3 still invokes the public wrapper. Staging providers contain only disabled Offerwall.GG and CPAGrip rows; Taplayad is absent.
- Staging `public.game_registry` has one row: `zid` / `zombie-invasion-defense`, development, unlisted, null launch URL. `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets` each have zero rows; no challenge/milestone/season tables exist.
- The owner-supplied Taplayad App-10066 template remains `https://offerwall.tplayad.com/10066/{user_id}`. Current docs use `md5(app_id . user_id . api_secret)` without a transaction-ID macro; legacy docs use `transId` and `md5(subId . transId . reward . secret)`. Current docs describe status 1/2 and `offer_id + user_id` deduplication; legacy docs describe `OK`/`DUP` and up to five retries after 60 seconds. These remain incompatible and neither authenticates the full callback payload. Current Terms do not establish app-specific incentivized-traffic permission.
- No database settings, secrets, grants, schema, data, functions, callbacks, or publisher settings were changed.


## 2026-11-20 00:28 ET — Current environment verification after PR #24 merge

### GitHub and Cloudflare
- Production branch main: bcc19d68694bcef968994c2a0466cecb57218955 (PR #24 merged). Authorized integration branch: 61e6e2f4fd61102a74f296fbd3025a54990c1e2f.
- Open PRs: #20 (6e2e51b, CI 58/58), #22 (332ca07, CI 64/64, stacked on #20), #23 (33a5240, draft/no CI), #9 (stale draft). PR #21 and #24 are merged.
- Integration branch is 34 commits ahead of PR #20's base 387d035; comparison shows changes only in the five shared control documents. PR #20/#22 application diffs were not resynchronized.
- Canonical Pages production deployment: 75207a07-6306-4461-b115-c6c4a508bd97, branch main, commit bcc19d, environment production, successful, alias https://legitloot.site.
- Authorized integration deployment: 94108c1a-d95f-4733-a0d5-24658f53b3ad, branch build/legitloot-neon-synthwave, commit 61e6e2f, environment preview, successful, alias build-legitloot-neon-synthwa.legitloot.pages.dev. This branch's supabase-config.js is pinned to staging and its Account auth code fails closed unless that exact staging config is present.
- PR #23 is a separate main-based preview; its inherited account-auth.js still hardcodes production Supabase and exposes auth.signUp. Do not use its Account/auth routes.

### Production Supabase — gkbqderyjcuxnjbsiffb
- Project ACTIVE_HEALTHY; 7 migrations.
- offerwall-gg-postback v4 ACTIVE/verify_jwt=false: deployed source is inert and returns HTTP 410 OFFERWALL_GG_DISABLED; it does not read body/secrets or call Supabase.
- offerwall-gg-wall-url v2 ACTIVE/verify_jwt=true: deployed source is inert and returns HTTP 410; it no longer creates Offerwall.GG URLs.
- wallet-summary v4 remains ACTIVE. public.get_wallet_summary() is SECURITY DEFINER and returns cash USD buckets plus LC.
- Read-only SQL: service_role EXECUTE false on both private/public process_offerwall_gg_postback; checked anon and authenticated privileges are also false. Both routines remain SECURITY DEFINER.
- private.providers retains one disabled Offerwall.GG row with stale standard_virtual_currency / LC / LootCoins reward metadata and null approval_reference, terms_url, and terms_verified_at. No publisher dashboard setting was changed.
- Repository/live-source drift: main/supabase/functions/offerwall-gg-wall-url/index.ts remains the old active Offerwall.GG launcher even though the deployed production v2 is inert. Correct the canonical source and add regression coverage before any future function redeploy.
- Security Advisor: leaked-password protection disabled (WARN); authenticated SECURITY DEFINER get_wallet_summary() (WARN); 12 private RLS/no-policy notices (INFO). Do not add public policies blindly.

### Staging Supabase — scmnxcsggquwtuyyjnnj
- Project ACTIVE_HEALTHY; 21 migrations.
- offerwall-gg-postback v8 ACTIVE/verify_jwt=false; its live private/public routines are record-only and do not post journal entries.
- offerwall-gg-wall-url v5 ACTIVE/verify_jwt=true; its CORS allow-list includes https://legitloot.site, a cross-environment exception to review. No setting changed.
- Providers: disabled CPAGrip and disabled Offerwall.GG; Taplayad absent. Offerwall.GG retains stale LC metadata.
- public.game_registry contains only unlisted development zid / zombie-invasion-defense, with null launch URL. private.game_saves, private.game_events, and private.game_handoff_tickets each have 0 rows.
- public.get_wallet_summary() remains SECURITY DEFINER and returns cash USD buckets plus gameCredits; currency.gameCredits is LLC, not LC.

### Taplayad App 10066
- Preserve the owner-supplied template exactly: https://offerwall.tplayad.com/10066/{user_id}. No provider row, code, or saved publisher setting exists.
- Current docs https://tplayad.com/docs list user_id,payout,reward,offer_id,country,user_ip,status,sig; status 1=credited/2=reversed; signature md5(app_id . user_id . api_secret); server IP 176.97.212.58; any 2xx marks delivery. No transaction-ID macro; signature does not bind reward, payout, offer, or status. Current iframe host differs from the owner template.
- Legacy https://tplayad.com/doc/postback now returns 404. Current Terms https://tplayad.com/terms were last updated 2026-10-29, require publisher age 18+, and leave payment terms to the dashboard; no App-10066-specific incentivized-traffic permission is established.
- Keep Taplayad unintegrated/record-only. Never map publisher $1=1 points or callback {reward}/{payout} into LC or cash.

### Owner gates and actions
- PR #24 production merge/deployment and Supabase containment were already complete before this check; this run only verified them read-only.
- No Supabase/Cloudflare settings or secrets, grants, schema/data, callbacks, publisher settings, provider agreements, payments, reward issuance, or money movement were changed in this check.


## 2026-11-20 01:36 ET — Independent Sync Watch #4

- GitHub integration branch remains `build/legitloot-neon-synthwave` @ `e868121`; production `main` remains `bcc19d`. PR #25 is a new draft against integration at head `c4cf11f`; it changes only the canonical wall-URL source and tests. No merge or function deployment occurred.
- Cloudflare automatically deployed PR #25 branch previews in both `legitloot` and `legitloot-preview`: each reports `environment=preview`, pages.dev URL and branch alias only, with no `legitloot.site` alias. The branch's `supabase-config.js` points to staging project `scmnxcsggquwtuyyjnnj`; `account-auth.js` requires that exact staging URL and `environment=staging`, otherwise it fails closed. No Cloudflare settings were changed.
- Production deployed Offerwall.GG postback v4 and wall-url v2 remain inert HTTP 410; the checked callback routine EXECUTE grants remain revoked. However, production repository source `main/supabase/functions/offerwall-gg-wall-url/index.ts` is still active. PR #25 only aligns integration source; production source remains owner-gated.
- Current official Taplayad docs show a sample parameter mismatch and an incomplete signature/transaction/reversal/retry contract. No provider settings were saved, no terms accepted, no callback invoked, and no provider row/code added.
- No Supabase project setting, secret, grant, schema, data, function deployment, financial activity or publisher configuration was changed.


## 2026-11-20 01:49 ET — Live environment recheck

- Production project `gkbqderyjcuxnjbsiffb`: Edge Functions `offerwall-gg-wall-url` v2 ACTIVE/JWT and `offerwall-gg-postback` v4 ACTIVE/no-JWT both contain inert HTTP 410 handlers. Read-only SQL shows service_role, anon and authenticated cannot EXECUTE the private/public `process_offerwall_gg_postback` routines.
- Staging project `scmnxcsggquwtuyyjnnj`: `offerwall-gg-wall-url` v5 ACTIVE/JWT still reads the service-role key and Offerwall.GG keys, validates the caller, signs wall parameters and returns an Offerwall.GG URL. Its CORS allow-list includes `https://legitloot.site` and the integration preview origin. The UI registry is disabled, but the endpoint remains callable by an authenticated client. Staging `offerwall-gg-postback` v8 is ACTIVE/no-JWT; its private/public DB routines are SECURITY DEFINER but contain no journal, ledger or LootCoin references.
- Production and staging `private.providers` both contain disabled Offerwall.GG rows with null approval reference, terms URL and terms verification timestamp, but stale `approved_reward_model` JSON naming standard virtual currency / LC / LootCoins. Staging additionally contains disabled CPAGrip and no Taplayad row. No registry rows were changed.
- Current Tplayad docs at `https://tplayad.com/docs` and legacy docs at `https://www.tplayad.com/doc/postback` specify incompatible callback protocols. Current docs omit transaction ID and sign only app_id/user_id/secret; legacy docs include transId/reward and define OK/DUP plus retries. Do not combine; provider must confirm App 10066's actual protocol, reversal linkage, retries and traffic permission. Preserve the owner-supplied template.
- Cloudflare production remains `legitloot` branch `main` @ `bcc19d`, alias `https://legitloot.site`. The authorized integration branch is `432060b`; both Pages projects built it as `environment=preview`, pages.dev branch aliases only. Its `supabase-config.js` pins staging and `account-auth.js` fails closed without the exact staging config. PR #25's branch previews are also preview-only.
- No Supabase function deployment, setting/secret/grant/schema/data change, callback, publisher setting, provider agreement or financial activity occurred.


## 2026-11-20 01:55 ET — Read-only environment recheck

### GitHub and Cloudflare
- Production `main` is `bcc19d`; integration `build/legitloot-neon-synthwave` is `42cf97c`. Integration Actions run [44690472788](https://github.com/demonanic/LegitLoot/actions/runs/44690472788) passed 50/50. PR #25 head `61f9ca8` has successful Node/Deno checks and successful previews in both Pages projects; the preview URLs are pages.dev-only. No production alias was added.
- PR #25 remains draft and integration-only. Its independent COMMENT review [5988741931](https://github.com/demonanic/LegitLoot/pull/25) notes that the static guard does not inspect transitive local imports.

### Production Supabase — `gkbqderyjcuxnjbsiffb`
- Project status: ACTIVE_HEALTHY. `offerwall-gg-wall-url` v2 ACTIVE/JWT and `offerwall-gg-postback` v4 ACTIVE/no-JWT are both deployed inert HTTP 410 handlers.
- Read-only SQL confirms `service_role`, `anon`, and `authenticated` cannot EXECUTE either private/public `process_offerwall_gg_postback` routine. Both remain SECURITY DEFINER. No callback was invoked.
- Production `main/supabase/functions/offerwall-gg-wall-url/index.ts` remains active source and can recreate the launcher on a future redeploy. PR #25 has not changed main.
- Production provider row remains disabled with null approval/terms references but stale `standard_virtual_currency / LC / LootCoins` reward metadata.
- Production `public.get_wallet_summary()` still returns cash USD buckets plus LC; this conflicts with the owner-locked wallet model.

### Staging Supabase — `scmnxcsggquwtuyyjnnj`
- Project status: ACTIVE_HEALTHY. `offerwall-gg-wall-url` v5 ACTIVE/JWT still authenticates callers, reads service-role/provider keys, signs parameters and returns a provider wall URL. Its CORS allow-list includes `https://legitloot.site` and the integration preview origin. The registry is disabled, but a direct authenticated caller can still reach it.
- `offerwall-gg-postback` v8 ACTIVE/no-JWT is record-only. Its HMAC message is only `userId:transactionId:currencyAmount`; offer ID/name, goal ID, payout USD and timestamp are not signed but are stored/updated through service-role RPCs. The private callback routine only records callback/conversion rows and has no journal/ledger/LC write. Treat this as a staging metadata-integrity defect, not an issuance path.
- Both staging callback routines are SECURITY DEFINER and service_role can execute them; anon/authenticated cannot. Staging provider registry contains disabled Offerwall.GG and CPAGrip rows, no Taplayad row, and stale Offerwall.GG LC metadata. Staging `get_wallet_summary()` still returns cash USD buckets and labels `gameCredits` as `LLC`.

### Taplayad App 10066
- Current guide [tplayad.com/docs](https://tplayad.com/docs) documents `md5(app_id . user_id . api_secret)`, no transaction-ID macro, no retry schedule, and a sample parameter mismatch (`offer={offer_id}` vs PHP `offer_id`). Legacy [www guide](https://www.tplayad.com/doc/postback) remains accessible and documents a different `subId/transId/reward` signature and `OK/DUP` retry contract; the non-www path returns 404. Do not combine protocols.
- Terms [updated 2026-10-29](https://tplayad.com/terms) require publishers to be 18+ and do not establish App-10066-specific incentivized-traffic permission. No provider row/code/settings exist for Taplayad. Preserve the owner-supplied URL template exactly.

### No mutations
- No function deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance, or money movement was performed. Automatic Cloudflare builds were branch previews only.


## 2026-11-20 01:56 ET — Documentation CI correction

- The push workflow for documentation commit `5236e7e` ran the full Node suite successfully (50/50) but failed `git diff --check` on trailing spaces in the updated `Last updated` and `Last verified` metadata lines. Follow-up documentation commit `c25df5c` removed those spaces; Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) then passed 50/50 and the whitespace check. No application files or tests changed.


## 2026-11-20 01:57 ET — Documentation CI verified

- Follow-up commit `c25df5c` is the current integration head. Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) completed successfully: Node suite 50/50 and `git diff --check` passed. The prior run [44692216892](https://github.com/demonanic/LegitLoot/actions/runs/44692216892) had the same 50/50 tests but failed only on the two metadata trailing-space lines now corrected.
- PR #25 remains draft and integration-only; its base `e868121` is now eight documentation-only commits behind integration. Application files did not change in the follow-up; no resync is needed solely for documentation.


## 2026-11-20 03:31 ET — Live environment recheck

### Production — `gkbqderyjcuxnjbsiffb`
- `offerwall-gg-wall-url` v2 ACTIVE/JWT returns inert HTTP 410; `offerwall-gg-postback` v4 ACTIVE/no-JWT returns inert HTTP 410.
- Read-only SQL confirms private/public `process_offerwall_gg_postback` are SECURITY DEFINER but EXECUTE is false for service_role, anon and authenticated. Callback-event and conversion counts are both zero.
- The provider row is disabled with null approval/terms references but still has stale `standard_virtual_currency / LC / LootCoins` metadata.
- GitHub `main` @ `bcc19d` has an inert postback entrypoint but the old active wall-url source remains in `supabase/functions/offerwall-gg-wall-url/index.ts`.

### Staging — `scmnxcsggquwtuyyjnnj`
- `offerwall-gg-wall-url` v5 ACTIVE/JWT still authenticates users, reads service-role/provider keys and creates wall URLs. Its CORS allow-list includes `https://legitloot.site` and the integration preview origin.
- `offerwall-gg-postback` v8 ACTIVE/no-JWT is record-only. Its HMAC covers only `userId:transactionId:currencyAmount`; unsigned payout/timestamp metadata is passed to `record_offerwall_gg_metadata` even after a duplicate result. The live process routine has no ledger/journal writes. Callback-event and conversion counts are both zero.
- Both provider registries have disabled Offerwall.GG rows with null approval/terms fields but stale LC reward metadata; staging has no Taplayad row.

### Source and snapshot alignment
- At audit start, integration branch `build/legitloot-neon-synthwave` was @ `0bcd3cb` and still had an active record-only `supabase/functions/offerwall-gg-postback/index.ts`; production `main` has the inert handler. This check added documentation-only updates to integration. PR #25 changes only the integration wall-url source. Do not promote integration until both function sources align with containment.
- `supabase/environments/staging/schema-snapshot/routines.sql` contains the pre-record-only journal-posting callback routine, while applied migration history includes `20261119145340_offerwall_gg_record_only` and the live staging routine is record-only. The README now warns that the snapshot is stale for this routine and must not be replayed.
- Current Tplayad docs specify `md5(app_id . user_id . api_secret)`, status 1/2 and any-2xx acknowledgement, but no transaction-ID macro or retry schedule. Both legacy postback URLs return 404. Preserve the owner's exact App-10066 template and require written confirmation of URL, full callback contract and incentivized-traffic permission.

### No mutations
- This check used GitHub reads, Supabase read-only project/function inspection and SELECT queries, and public documentation fetches. Only shared documentation and a PR #20 clarification comment were updated. No Edge Function deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 04:39 ET — Runtime and preview recheck

### GitHub
- Production main: bcc19d68694bcef968994c2a0466cecb57218955.
- Integration: a345aa35470786f44760b6ac6998db50dd0ee9d3.
- Branch count: 26. GitHub reports protected=false for main and integration.
- Open PRs: #20 head 6e2e51b/base 387d035 (58/58); #22 head 332ca07 stacked on #20 (64/64); #23 head 33a5240 draft/no CI; #25 head 135607e draft with passing Node and Deno workflows; #9 stale draft.
- PR #25's 20 commits of base-to-integration divergence affect only the six shared docs; PR #20's 59 commits of base-to-integration divergence also affect only those six docs. No application-code sync is required solely for this documentation churn.

### Cloudflare Pages
- Production project legitloot: deployment 75207a07-6306-4461-b115-c6c4a508bd97, environment=production, main commit bcc19d, alias https://legitloot.site. No production deployment was initiated in this run.
- PR #25 exact head 135607e: project legitloot preview 3b687da5-66aa-4b69-a0bc-ece246e7df04 and project legitloot-preview preview 8d58bcb9-d489-485f-8be5-92f93c16710c; both environment=preview and pages.dev-only aliases.
- Integration head a345aa3 has environment=preview deployments in both Pages projects; branch alias is build-legitloot-neon-synthwa.legitloot.pages.dev (Cloudflare's truncated branch alias).
- PR #23 head 33a5240: deployment 5c3dd1bf-04d7-4901-8a17-3c30f0302278 in legitloot and eda80ba7-048a-42de-a6a8-94cc58c98dd7 in legitloot-preview; both environment=preview and pages.dev-only aliases. However, the deployed bundle includes account-auth.js hardcoded to production Supabase, with no preview environment variables. Pages environment=preview does not isolate its backend target.

### Supabase — production gkbqderyjcuxnjbsiffb
- offerwall-gg-wall-url v2: ACTIVE/JWT, inert HTTP 410.
- offerwall-gg-postback v4: ACTIVE/no-JWT, inert HTTP 410.
- Checked private/public callback routine EXECUTE grants are false for service_role, anon and authenticated.
- Offerwall callback-event and conversion counts: zero.
- Production provider registry contains only disabled Offerwall.GG; approval_reference, terms_url and terms_verified_at are null; approved_reward_model still says standard_virtual_currency / LC / LootCoins.

### Supabase — staging scmnxcsggquwtuyyjnnj
- offerwall-gg-wall-url v5: ACTIVE/JWT; deployed CORS includes https://legitloot.site and the full build preview origin.
- offerwall-gg-postback v8: ACTIVE/no-JWT; record-only. Signature binds only userId:transactionId:currencyAmount; reconciliation metadata fields are unsigned and can be updated on duplicate callback results.
- Current private/public callback routines are SECURITY DEFINER; service_role EXECUTE is true, anon/authenticated false. Their definitions have no journal, ledger or LootCoin references. Callback-event and conversion counts: zero.
- Staging provider registry: CPAGrip disabled; Offerwall.GG disabled with null approval/terms and stale LC/LootCoins metadata; no Taplayad row.
- The staging schema snapshot routines.sql still contains a pre-record-only Offerwall.GG journal-posting routine. Its README warns that this snapshot is stale and must not be replayed.
- public.get_wallet_summary() returns cash USD buckets and gameCredits currency LLC. Production public.get_wallet_summary() returns cash USD buckets plus lootCoins; production wallet-summary Edge Function v4 also returns cash USD buckets and gameCredits LLC. The integration wallet parser ignores cash fields, but the backend contracts remain outside owner policy.

### Source-of-truth warnings
- Production main's wall-URL source remains active despite the deployed inert v2; a future source-based redeploy could reactivate it.
- Integration canonical wall-URL and postback sources remain active until reviewed source changes are accepted. PR #25 head 135607e makes only the wall-URL source inert; it does not alter the postback source or deployed staging functions.
- Staging deployed wall-URL source includes the production origin in CORS, while the canonical integration source uses the truncated build preview alias and omits production. Treat the deployed staging snapshot as the runtime truth until separately reviewed.
- No Taplayad publisher configuration or callback integration is present. Preserve the owner-supplied template exactly and keep it inactive pending written App-10066 permission and a complete transaction/reversal contract.


## 2026-11-20 04:55 ET — Game route identity correction

- Production main's zombies-vs-heavy-metal.html iframe points to https://demonanic.github.io/Legitloot-2/. The owner-locked Platform Build Spec §0.4 excludes demonanic/Legitloot-2 as Zombie Invasion Defense, not the selected ZVHM launch title. The production route must not be treated as a verified ZVHM build.
- PR #22's games.html links its ZVHM card to the same wrapper and tests/launch-games.test.mjs explicitly asserts the excluded URL. PR #22 remains blocked pending the actual approved ZVHM source/build and a corrected regression test.
- Rocket 2 Nowhere is packaged at games/rocket-2-nowhere/index.html in PR #22/#23 and remains preview-only, device-local.


## 2026-11-20 05:13 ET — Current environment and source verification

### Cloudflare Pages

- Production project legitloot remains bound to main; deployment 75207a07 on commit bcc19d6 completed successfully at 2026-11-20 04:11:50 UTC and aliases https://legitloot.site.
- The PR #23 deployment 5c3dd1bf is environment=preview, branch claude/rxt2-main, commit 33a5240, alias https://claude-rxt2-main.legitloot.pages.dev, and env_vars={}. Its inherited Account/auth bundle still hardcodes production Supabase. Preview classification does not isolate the backend.
- Integration commit 56b98e4 has an automatic branch preview only; it is not the production deployment.

### Current Supabase function inventory

- Production gkbqderyjcuxnjbsiffb: offerwall-gg-postback v4/no-JWT (inert 410); offerwall-gg-wall-url v2/JWT (inert 410); wallet-summary v4/no-JWT (still returns cash USD plus gameCredits/LLC).
- Staging scmnxcsggquwtuyyjnnj: offerwall-gg-postback v8/no-JWT (record-only); offerwall-gg-wall-url v5/JWT (active launcher, CORS allows production origin); cpagrip-attribution v5/JWT; admin-dashboard v7/JWT; payout-simulator v6/JWT; provision-initial-owner v7/JWT.
- The deployed staging wall-url and postback source files match their respective supabase/environments/staging/functions snapshots exactly. Those snapshots are intentionally excluded by tests/staging-function-origins.test.mjs; this leaves a deployment-source test gap recorded in PR #25 comment 7037024928.
- Production callback routines remain SECURITY DEFINER, but checked EXECUTE privileges for service_role/anon/authenticated are false. Staging callback routines remain SECURITY DEFINER and service_role-executable, but their live definitions contain no journal, ledger, or LootCoin references. No callbacks were invoked.
- Production and staging public.get_wallet_summary() both return cash USD buckets. Production returns lootCoins.available; staging returns gameCredits with currency LLC. The separate production wallet-summary v4 Edge Function returns gameCredits/LLC and cash, differing from the production RPC contract; repository code search found no current page caller.

### Repository and policy boundary

- Integration is 56b98e4; production main is bcc19d6; 26 branch refs all report protected:false.
- Production main's Offerwall wall-url source remains active despite deployed v2 being inert; integration canonical wall-url and postback sources remain active; PR #25 changes only wall-url and remains draft. Staging deployment remains active as detailed above.
- No production or staging deployment, Supabase setting/secret/grant/schema/data mutation, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred in this run.

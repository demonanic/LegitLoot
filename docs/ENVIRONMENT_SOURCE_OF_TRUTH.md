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

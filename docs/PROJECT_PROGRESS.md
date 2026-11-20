# LegitLoot project progress

**Updated:** 2026-11-19 22:39 ET
**Active milestone:** M2 — Launch Blocker Closure and Basic-Operable Release
**Active task:** M2-T4 — both owner-selected game titles have playable early-access candidates; ZVHM is live, RXT2 is preview-only
**Integration branch:** `build/legitloot-neon-synthwave` — latest Sync Watch documentation head; PR #20 base remains `387d035` and the intervening changes are documentation-only
**Production branch:** `main` @ `4e0f533`
**Current open PRs:** #20 Hustle/public-copy (head `6e2e51b`, base `387d035`, 58/58 CI, application diff unchanged; base behind integration only by documentation-only Sync Watch commits); #22 game integration (head `332ca07`, base PR #20 head `6e2e51b`, 2 ahead / 0 behind, 64/64 CI); #23 RXT2 production draft (head `33a5240`, no CI, preview only, owner-gated); #24 Offerwall containment draft (head `7a31165`, Deno tests unrun); #9 stale visual redesign draft.

## Current owner-locked operating rules

- Legit Coins (LC) are earned only through verified in-game milestones, weekly challenges, and seasonal events.
- The LegitLoot website wallet is authoritative. Games do not maintain spendable duplicate wallets.
- LC are not cash, withdrawable, transferable, pegged to USD, or issued by provider offerwall callbacks.
- The first public release remains the smallest complete, honest, basic-operable scope; do not expand the product before the core user journey works.
- Claude and ChatGPT may independently merge verified work into the integration branch and deploy reviewed changes to staging. Production merge/deploy, production settings/secrets/data, live financial activity, paid commitments, provider agreements, security weakening, destructive real-data changes, and irreversible legal/business decisions remain owner-gated.

## Current launch blockers and evidence

- **PROV-07 — CRITICAL:** live production Offerwall.GG postback v3 remains ACTIVE (`verify_jwt=false`). Its handler calls the public SECURITY DEFINER callback RPC; both public/private process routines still grant EXECUTE to `service_role`; the private routine calls `private.post_journal_transaction` and posts LC journal entries. The provider row is disabled but retains stale LC/LootCoins reward metadata and has no approval/terms reference. The endpoint does not enforce the provider row's disabled state. No callback was invoked and no production containment was applied.
- **WALLET-01 — HIGH:** production `wallet-summary` v4 remains ACTIVE and its SECURITY DEFINER RPC returns cash and LC fields. Production Rewards/Account source still advertises Offerwall.GG-to-LC, cash/withdrawal states, and account creation. Staging `get_wallet_summary()` also returns cash buckets and `currency.cash=USD` although the client ignores them; `currency.gameCredits` is mislabeled `LLC` rather than `LC`. Terms and Privacy still say they are incomplete.
- **AUTH-02:** production sign-up pause was previously owner-approved but remains unverified as applied. The main-branch Account page exposes Create Account and hardcodes the production Supabase target; no auth form was submitted during this check.
- **GAME-02:** PR #22 contains the integration candidate for both games and passes 64/64 CI; PR #23 contains the production RXT2 candidate and its preview browser check passed. Neither PR is merged. RXT2 is not on production. Staging `game_registry` still contains only the unlisted ZID development row; saves/events/handoff tickets are 0; no challenge/milestone/season tables exist. Shared login/session handoff, cloud saves, and verified LC event ingestion remain incomplete.
- **ENV-07 — CRITICAL:** PR #23 and PR #24 Cloudflare deployments are classified as preview, but their inherited main-branch `account-auth.js` targets production Supabase. The Pages preview env-var maps are empty, so the preview classification does not isolate backend traffic. PR #22's account auth is staging-only and fails closed. Comments were added to #23 and #24; do not use their Account pages until a separate owner-approved preview-host guard is implemented and verified.
- **PR24-TEST — HIGH:** fixed in draft PR #24 head `fb2e890`: pure `handler.ts` is imported by tests; only `index.ts` starts `Deno.serve`. Added a Deno workflow. Local Node 22.16 handler smoke passed 3/3, but no Actions run has surfaced and the Deno suite remains unverified.
- **HUSTLE/TAPLAYAD — HIGH:** owner-selected App ID 10066 and template `https://offerwall.tplayad.com/10066/{user_id}` are recorded, but Taplayad is absent from staging `private.providers` and no integration exists. Current docs use `md5(app_id . user_id . api_secret)` and no transaction-ID macro; legacy docs use `transId` and `md5(subId . transId . reward . secret)`. Neither establishes the app-10066 payload-binding, transaction identity, reversal/retry contract, or incentivized-traffic permission. No mapping of publisher points, `{reward}`, or `{payout}` to LC/cash is allowed.
- **GOV-01 — HIGH:** the previous audit found all then-listed branches `protected:false` and no repository rulesets. The current branch search returned 25 refs, but branch protection was not re-queried this run. Owner approval is not proven to be technically enforced on `main`.
- **LEGAL/SUPPORT/OPS:** Terms/Privacy, monitored support, account deletion/export, sign-up pause verification, monitoring, backup/PITR, and rollback evidence remain incomplete or owner-gated.

## Current verification status

- PR #20 Actions run `44661202504`: 58/58 pass, 0 failures, 0 skips. Claude synced it once to `387d035`; at the start of the 22:39 ET check, integration was `7b240b2` and eight documentation-only commits ahead. This check added further documentation-only coordination records; read Master Control for the current head. No further sync until an owner-approved integration disposition.
- PR #22 Actions run `44661225287`: 64/64 pass, 0 failures, 0 skips. Claude updated the stacked branch to head `332ca07`, 2 ahead / 0 behind PR #20 head `6e2e51b`; independent COMMENT review found no blocker in the scoped game changes.
- PR #23: Cloudflare preview deployed successfully in both Pages projects; read-only browser QA confirmed the Games page and embedded RXT2 start screen. No GitHub Actions run exists for this PR.
- PR #24: head `fb2e890`; pure-handler import-side-effect fix and Deno workflow are prepared. Local Node smoke 3/3; no Actions run yet, so Deno tests remain unverified. Preview-isolation finding remains open.
- Production Cloudflare canonical deployment remains `main` @ `4e0f533`. PR #23/#24 are preview-only; no production deployment occurred.
- Supabase production and staging projects were re-queried read-only at 2026-11-19 22:39 ET. Production Offerwall callback still has a service-role journal-posting path; staging callback routine remains record-only. Staging wallet RPC still returns cash fields. No callbacks, writes, migrations, grants, settings, secrets, schema, or data were changed.
- No merge, deployment, publisher setting, provider agreement, payment, reward issuance, or money movement occurred during this check.

---

## Historical M1 visual-rebuild baseline (retained for context)

## Completed

- Stage 0 source audit, page/asset inventory, and source-level responsive review documented in `docs/WEBSITE_STAGE0_AUDIT.md` and `docs/ASSET_MANIFEST.md`.
- Owner accepted Stage 0 as substantially complete and deferred screenshots; they are not a blocker to visual design implementation.
- Added `docs/LEGITLOOT_CREATIVE_BIBLE.md` with owner-approved brand, visual, tone, Skuz, and product-truth rules.
- Reconciled `AGENTS.md`, `README.md`, `docs/CODEX_EXECUTION_CONSTITUTION.md`, `docs/PLATFORM_BUILD_SPEC.md`, `docs/BRAND_ART_DIRECTION.md`, and `docs/WEBSITE_CREATIVE_WORKFLOW.md` with the current creative decisions while retaining business and financial restrictions.
- Completed the Stage 1 visual blueprint in `docs/DESIGN_BLUEPRINT.md`, mapped to the existing static HTML/CSS system and the current site inventory.

## Historical M1 active sequence

- Public visual system, homepage composition, original artwork briefs/continuity sheet, and visual treatment of all public routes are implemented.
- Source checks are complete and recorded below. Rendered desktop/mobile, browser accessibility, hero crop, and interactive-state checks remain deferred until browser access is available.
- The remaining authorized task is rendered review and any resulting visual corrections. Stop for owner approval at production release; no production action is included here.

## Historical M1 findings / limitations

- `assets/lootbadger.webp` is the supplied Skuz reference candidate (192×244). The new continuity sheet and homepage hero are original illustrations based on it.
- Official game artwork is available for all three approved games; no new game imagery is needed.
- No approved dashboard reference was found. Screenshots are explicitly deferred by the owner.
- Two public explainer routes currently overlap (`trust.html` and `how-it-works.html`). Keep both working and align their visuals; do not delete either route or invent content.
- Page behavior lives in `app.js` for shared navigation/year, `portal.js` for filters, `account-auth.js` for account state, `offerwall-launch.js` for the disabled provider placement, and other page-specific scripts. Functional IDs and backend integrations were preserved.
- Admin and payout simulator tools are out of the public visual-redesign scope.

## Historical M1 verification record

- Stage 0 source/asset inspection is recorded in `docs/WEBSITE_STAGE0_AUDIT.md`.
- Browser screenshot/capture remains DEFERRED by owner acceptance, not a blocker to visual design implementation. Do not claim rendered QA until it is actually performed.

## Visual rebuild implementation

- Added a dedicated public-site visual system (`public.css`, `public-pages.css`, and `public-home.css`) while restoring the shared legacy stylesheets used by internal admin and payout tools.
- Rebuilt the homepage composition with original Skuz hero artwork, existing official game artwork, clear opportunity status, and separate game-credit/cash-reward explanations. No balances, offers, provider approval, or earnings claims were invented.
- Applied the shared header, mobile navigation, page hierarchy, forms, cards, notices, and footer patterns across Home, Games, Earn, Deals, Rewards, Account, How It Works, Trust & Status, Terms, Privacy, and 404.
- Preserved existing account form IDs and authentication scripts, game filter behavior, existing routes, and legal/status content. Added keyboard-operable responsive navigation and visible focus treatment.
- Created `docs/ARTWORK_BRIEFS.md`, the Skuz reference/expression sheet, and optimized homepage hero WebP plus retained PNG master. No production deployment or paid external service used.

## Verification record

- `python3` stdlib `HTMLParser` route audit: PASS for one main landmark, unique IDs, public stylesheet scope, and all local links/assets across 11 public HTML routes.
- `node --check app.js`, `portal.js`, `account-auth.js`, and `offerwall-launch.js`: PASS.
- `git diff --check`: PASS.
- Repository has no configured package test/build runner; no framework test suite was available to run.
- Browser executable/capture access is unavailable in this environment; rendered layout/accessibility testing is DEFERRED per owner direction.
- Release remains blocked on a later browser review and the normal production-release approval boundary; provider, legal, and operational launch requirements remain governed by the project specs.

## Files changed in current visual milestone

See `git show --stat` for the coherent implementation commit; the Creative Bible and Stage 1 blueprint are in the preceding documentation commit.

## Platform model completion — 2026-11-10

- Published `docs/PLATFORM_BUILD_SPEC.md` v1.1 with the owner-locked LC-only/game-only reward model, deferred cash-rewards phase, supported earning-channel categories, channel-specific reward rules, canonical user journeys, logical data model, ledger invariants, provider adapter contract, and CPAGrip status/gates.
- Reconciled the specification's older cash-allocation and withdrawal language so it is explicitly superseded/deferred and cannot be treated as current implementation scope.
- Updated README and Codex operating rules to point to the owner-locked model.
- No source-code, database, provider, production, or financial configuration changes were made as part of this documentation update.

## Remaining gates / next tasks

1. Rendered desktop/mobile review of all public routes, navigation, account states, filters, focus/contrast, and hero crops remains DEFERRED until browser access is available. Do not call the website visually QA-approved until performed.
2. Reconcile the current frontend UI against the v1.1 model. In particular, ensure any old cash-reward wording or withdrawal UI is not presented as a current player feature; preserve restricted staging-only payout simulator as a separate internal tool.
3. Inspect actual Supabase schema, Edge Functions, RLS policies, and CPAGrip staging code before declaring backend or provider readiness.
4. Continue with CPAGrip adapter verification only after current official terms/macros and incentive eligibility for game-only LC are confirmed. Keep live reward posting disabled until all gates pass.
5. Production deployment, merging, paid services, provider agreements, live rewards, and money movement remain outside this authorization.

---

## Owner direction update — 2026-11-19

The owner has selected **launch LegitLoot** as the single primary direction. This update supersedes the older "remaining authorized task is rendered review" as the active priority. Rendered review remains a required release check, but the next task is now governed by `docs/MASTER_EXECUTION_CONTROL.md`.

### Active milestone

**M1 — Launch Readiness Baseline and Blocker Plan**

- Active task: `M1-T1 — Repository, environment, and launch-surface inventory`.
- Task owner: Claude.
- Reviewer: ChatGPT.
- Status: ACCEPTED WITH QUALIFICATIONS by ChatGPT (2026-11-19). Independent review and required corrections are recorded in `docs/LAUNCH_READINESS_AUDIT.md` §12.
- M1-T1 is read-only.

### M1-T1 verified state (2026-11-19, Claude)

- No implementation status changed (read-only task). Headline facts: build branch is 226 ahead / 9 behind `main` and lacks main's 11-12 public-pages release and tests; live production accepts sign-ups to production Supabase while Terms/Privacy are unpublished; player UI still shows a USD cash wallet; Offerwall.GG posting switch is not enforced in code; CPAGrip staging function source is not in the repo; no playable game is linked; no account deletion.
- Recommended first release: account-less early-access portal (audit §8). E1 (production sign-up) remains an owner decision. E2 is a proposal/ownership ambiguity, not a confirmed replacement of the last owner-locked LootCoins policy; see audit §12. M1-T2 must remain read-only; staging auth E2E is a separate write-capable task.
- Required evidence and acceptance criteria are in `docs/MASTER_EXECUTION_CONTROL.md`.

### Shared agent coordination

- `docs/MASTER_EXECUTION_CONTROL.md` is the shared operating agreement and living coordination record for Claude and ChatGPT.
- `CLAUDE.md` is Claude's repository entrypoint.
- `AGENTS.md` directs coding agents to the same control document.
- Agents are authorized to coordinate and complete routine, bounded work autonomously on `build/legitloot-neon-synthwave`.
- Critical owner approval gates remain unchanged: production deployment/merge, paid services, provider agreements, live financial activity, destructive real-data changes, security weakening, LC economic changes, and irreversible legal/business decisions.


### Owner decisions — 2026-11-19

- E1: temporary production public-registration pause approved; preserve existing sign-in. Claude to execute/verify if dashboard access permits; not yet confirmed applied.
- E2: Legit Coins policy confirmed: in-game milestones, weekly challenges, seasonal events; authoritative website wallet; game completion notification prompts player to check wallet. No cash/payout use; amounts and redemption rules remain unapproved.
- Next: cross-agent Supabase/GitHub environment reconciliation; canonical `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`.

### Environment reconciliation — 2026-11-19 (Claude)

- Canonical map extended: `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` §7 (frontend/hosting), §8 (deployed vs GitHub functions), §9 (prod vs staging drift), §10 (sign-up pause status).
- Production sign-up pause: **BLOCKED** — requires the owner to toggle it in the Supabase dashboard (agent access unavailable). Still `disable_signup:false` at last probe.
- New HIGH defect PROV-07: Offerwall.GG postback can mint LC in production and staging (secrets configured), contrary to the LC policy; nothing minted so far. Owner containment decision pending (audit §15.3).
- LC policy and game lineup now governed by `docs/PLATFORM_BUILD_SPEC.md` v1.2 §0; obsolete passages marked superseded.
- No implementation status changed. Proposed M2 task list: audit §15.4.

## Independent review and staging export — 2026-11-19

The earlier M1-T1/M1-T2 status paragraphs above are historical snapshots. Current state is governed by the latest entry in `docs/MASTER_EXECUTION_CONTROL.md` and audit §15.6.

- M1-T1: completed and accepted with qualifications.
- M1-T2 read-only environment reconciliation: Claude completed its inventory; ChatGPT independently verified deployed postback and wall URL function behavior.
- M2-T1: merge rules approved with amendments for an isolated review branch and PR into `build/legitloot-neon-synthwave`. No such review branch exists yet at this check; Claude may create it and proceed. No merge to `main` or production deployment.
- M2-T2: staging deployed-source export completed by ChatGPT. Six Edge Functions, version/hash manifest, 16 deployed routine definitions, and 20 applied migration version/name records are committed under `supabase/environments/staging/`. The routine snapshot is not original migration SQL and must not be replayed.
- PROV-07: verified high-severity policy conflict. Both production and staging Offerwall.GG postback functions can still mint LC. Production's shared secret is also needed by the wall URL function. Owner containment decision remains pending; no secret or function was changed.
- Production registration pause remains NOT APPLIED; `disable_signup:false` at last probe. Owner dashboard action remains outstanding.

No production/staging Auth settings, secrets, deployed functions, database objects/data, provider settings, or deployment targets were changed by ChatGPT.

### M2-T1 executed — 2026-11-19 (Claude)

- PR #11 (`build/m2-t1-main-reconcile` → build branch) is open for ChatGPT review and not merged. It reconciles `main`'s 2026-11-12 public release into the build branch, locks the preview to staging (fail-closed, with tests), archives `main`'s production migrations separately, removes cash wallet UI, and adopts Legit Coins wording. 15/15 tests pass.
- Unchanged: production sign-up still open (owner dashboard action); PROV-07 containment still an owner decision.

## Current coordinated launch status — 2026-11-19

The launch-readiness audit has moved into M2 launch-blocker closure. M1's audit remains the baseline; the active implementation/review work is tracked in the shared control log.

- **PR #11 — M2-T1 reconciliation:** open for review; wallet parser now supports both live RPC shapes and staging scale 10,000 is verified. Follow-ups remain for an explicit Earn client staging guard and complete owner-locked LC source copy. PR head is behind the current build branch and not mergeable; no merge/deploy.
- **PR #12 — M2-T6 release runbook:** open docs-only draft. Must mark Cloudflare production binding as not dashboard-verified and update the production source/history export items as complete. Branch is behind current build branch and not mergeable; no merge/deploy.
- **M2-T2:** production deployed Edge Function source snapshots and seven-entry applied migration metadata are now preserved under supabase/environments/production/. Original SQL is not supplied by the migration-history API.
- **PROV-07:** production postback v3 and staging postback v7 remain active and can post LC through the database routine, contrary to the owner-locked LC model. Callback/conversion tables currently have zero rows in both environments. Production containment remains owner-gated; staging/source-only record-only work is next.
- **Other launch blockers remain:** production registration pause not yet verified; account deletion and approved Terms/Privacy/support route; a complete playable game or truthful early-access portal; monitoring/backup/rollback verification; final browser/accessibility QA and exact production release approval.

No production/staging settings, secrets, deployed functions, database schema/data, provider configuration, or reward records were changed during this review.
### PR #11 follow-up review — 2026-11-19

- Claude's commit cfc370a resolves the reviewed Earn client isolation gap with an explicit staging environment/URL guard and runtime tests using an active provider.
- Player-facing LC source copy now consistently lists verified in-game milestones, weekly challenges, and seasonal events; no LC are awarded yet.
- Claude reports 26/26 Node tests pass. GitHub Actions status/workflow queries returned no checks/runs for this head; no new Cloudflare preview deployment was visible for cfc370a.
- PR #11 remains open and non-mergeable; the review branch is 16 commits behind the current build branch. PR #12 remains open, unchanged, and 13 commits behind. Both require base synchronization before merge consideration.
- Next: Claude refreshes both review branches, updates PR #12's factual runbook items, and continues the separate staging-only record-only postback task. PROV-07 production containment remains owner-gated.
### PR #12 runbook correction and latest synchronization — 2026-11-19

- ChatGPT corrected PR #12's runbook in commit 0e826a2: Cloudflare production binding is marked unverified pending dashboard inspection; production function and migration metadata exports are complete; migration metadata is not original/replayable SQL; both staging client guards are documented.
- PR #11's follow-up guard and copy fixes in cfc370a were independently inspected and appear correct. Claude reports 26/26 tests pass; no GitHub Actions statuses/workflow runs or new preview deployment were returned for that head.
- Current GitHub compare: PR #11 branch 18 commits behind the authorized build branch; PR #12 branch 15 commits behind. Both open and non-mergeable. Claude must refresh branches and rerun checks before final review.
- Next: separate staging-only record-only Offerwall.GG postback implementation (source/tests only; no deployment). Production containment remains owner-gated.
### PR descriptions synchronized — 2026-11-19

- PR #11 and PR #12 descriptions now reflect the latest review state and evidence. PR #11 distinguishes 26/26 tests reported by Claude from earlier preview checks; no CI status or preview deployment for cfc370a was returned. PR #12 records production source/history exports and remaining backup/PITR and Pages binding checks.
- Both PRs remain open and non-mergeable pending branch refresh from the current authorized build branch. No merge or deployment.
### M2-T3 — Offerwall.GG record-only callback review — 2026-11-19

- PR #13 is open for independent review on `build/m2-t3-offerwall-record-only`. It changes the staging-lineage `private.process_offerwall_gg_postback` routine to record callback/conversion data only and never post a journal transaction. The Edge Function rejects the old `posted` result, failing closed if the record-only migration is not present.
- ChatGPT independently inspected the migration, function, test and live staging catalog. The new SQL contains no ledger/journal write path; the public wrapper delegates to the private routine; staging service-role grants and relevant table constraints are present. The PR's function source matches deployed staging v7 except for the accepted-result change.
- Claude reports 7/7 PGlite tests pass after `npm install`; no GitHub Actions status/workflow run was returned. Cloudflare preview succeeded for the static branch only. No migration/function has been deployed and no callback invoked.
- One low-severity result-label mismatch remains: duplicate reversal retries currently return `duplicate`, while comments/allow-list also describe `duplicate_reversal`. Claude has been asked to align semantics and tests.
- PR #13 branch is 10 commits behind the current authorized build branch and reports non-mergeable. Refresh and rerun tests before merge consideration. Staging deployment remains a separate approval gate; production is out of scope.

## 2026-11-19 — Independent coordination update (12:14 UTC)

- **Integration:** M2-T1 PR #11 and M2-T3 PR #13 are merged into `build/legitloot-neon-synthwave` only. The integration base at the start of this check was `5ab48bd`, 290 commits ahead / 0 behind `main`. No production merge or deployment.
- **Open review work:** PR #12 is the release/rollback/monitoring runbook; PR #14 is the staging CPAGrip origin correction; PR #15 is the AUTH-03 account-deletion design. All need refresh from the current integration branch after the coordination-document updates and final independent review. PR #9 remains an older draft.
- **Verification:** Claude reports 34/34 integrated tests on `ab61c6e`, 11/11 JS syntax checks, and clean non-Markdown diff checks. Claude reports 37/37 tests on PR #14. GitHub returned no Actions/status checks for the inspected heads. Cloudflare preview comments show successful static previews, not backend deployments. ChatGPT inspected the source/test diffs but did not independently execute the suite.
- **LC policy:** the merged build source removes cash-wallet/provider-to-LC UI claims and implements a staging-lineage record-only callback path. The record-only migration/function have **not** been deployed. Last verified deployed inventory still shows production Offerwall.GG v3 and staging v7 capable of minting LC; PROV-07 remains a blocker.
- **Staging isolation:** PR #14 removes the production origin from canonical staging CPAGrip source and adds a regression test. It is not yet merged or deployed.
- **Account deletion:** PR #15 proposes close-and-pseudonymise without LC movement. Its interim-procedure section incorrectly assumes no accounts are open while production sign-up remains enabled; correction requested on the PR. D1–D4 remain owner/legal decisions.
- **Registration:** the owner-approved production sign-up pause remains unapplied; last environment probe reported `disable_signup:false`. Existing email sign-in must remain enabled when the pause is applied.
- **Standing authority:** Claude and ChatGPT may independently merge verified work into the integration branch and deploy to staging, including staging-only migrations, without routine owner approval. Production and business-critical gates remain unchanged.
- **Next:** Claude refreshes PRs #12, #14, #15 from the current integration head, addresses review notes, updates permanent agent instructions, reruns the combined suite on the current head, then returns work for independent review. After review, staging work can proceed without routine owner check-ins.


## 2026-11-19 — Live provider-path verification (12:14 UTC)

- Fresh read-only checks of both Supabase projects reconfirmed production `offerwall-gg-postback` v3 and staging v7 are ACTIVE with JWT verification disabled.
- Both deployed `private.process_offerwall_gg_postback` routines still read/lock LC ledger accounts and call `private.post_journal_transaction`. The new record-only migration is not applied in staging; its source is in the build branch only.
- Callback events/conversions are 0/0 in both projects. No callback was invoked and no Supabase setting, secret, function, migration, schema, data or financial record was changed.
- **PROV-07 remains a live policy blocker.** After independent review, Claude may deploy the record-only migration to staging first, then the matching function, and verify the deployed routine. Production containment remains owner-gated.


## 2026-11-19 — M2 handoff and PR re-review update (12:24 UTC)

- **Active milestone:** M2 — Launch Blocker Closure and Basic-Operable Release. **Active next task:** M2-T3a, deploy the reviewed record-only Offerwall.GG migration to staging first, then its matching Edge Function, and verify the live routine has no LC ledger/journal path. ChatGPT has staging deployment access; Claude authored the source. This audit run did not deploy.
- **Claude's latest verified PR artifacts:** #12 head `dfc0e53` (34/34 tests), #14 head `8d80e8a` (37/37), #15 head `9c8a365` (34/34). Claude reports clean PR diff checks and that all three branches were refreshed onto integration head `19aa0f4`. GitHub returned no Actions/status checks; these are local test reports, not CI.
- **PR #12:** release runbook now explicitly requires production `disable_signup:true` and `email:true` until Terms/Privacy and deletion are ready. Remaining correction: callback-event/conversion tables may be nonzero after record-only operation; only provider-sourced LC journal/ledger postings must remain zero.
- **PR #14:** canonical staging CPAGrip source removes the production origin; independent source review found no code blocker. PR description still contains obsolete staging-deploy-gate wording.
- **PR #15:** design now correctly includes an interim deletion/export path while production sign-up remains open and covers `deleted_at` checks across Edge Functions, security-definer RPCs, and RLS. Remaining corrections: verify that `hello@legitloot.site` is actually configured/monitored before presenting it as the support route, and remove obsolete per-action staging approval language. D1–D4 remain owner/legal decisions.
- **PROV-07:** fresh read-only Supabase evidence still shows production v3 and staging v7 active on the legacy LC-posting routine; 0 callback events/conversions in each project; record-only migration not applied to staging.
- **Next:** Claude resolves the remaining PR comments and updates stale PR descriptions. ChatGPT performs the staging-only M2-T3a deployment in a normal implementation turn after this read-only audit. Production containment and release remain owner-gated.


## 2026-11-19 13:09 UTC — Owner decisions finalized: launch scope, games, LC milestones, Hustle

- Owner finalized the initial launch scope: both **Zombies vs Heavy Metal** and **Rocket 2 Nowhere** are selected for launch (supersedes earlier one-game minimum). The owner says both are playable as-is; integration/playability still requires independent evidence.
- Offerwalls remain a separate user-task/discovery feature and must never issue LC. Advertising is allowed at launch with appropriate privacy/consent/disclosure safeguards. Production signup remains paused; no paid features at launch; production release requires explicit owner approval.
- Intended support email is `payouts@legitloot.site`; mailbox existence, routing and monitoring remain unverified and must be checked before public launch.
- Owner authorized Claude to create at least five launch challenges/milestones and wire eligible verified in-game events into the authoritative website wallet. LC eligibility remains limited to server-verified in-game milestones, weekly challenges and seasonal events; existing approved LC values must be used. No new economic values may be invented.
- Former Earning section is renamed **Hustle**. Owner authorized ChatGPT and Claude to design/code the task-discovery framework, including provider adapter, attribution/status tracking, admin and staging/test paths.
- At least one genuine publisher offering user tasks must be researched, selected, technically configured and tested for launch. Provider agreement acceptance, external account activation where legally binding, incentivized-traffic approval, paid terms or other commitments remain owner-gated. Until then, sandbox/test mode only; provider tasks cannot mint LC.
- Next implementation sequence: (1) staging-only PROV-07 record-only containment; (2) verify both game integrations and shared account/save contract; (3) author >=5 challenges and prove server-authoritative/idempotent LC awards in staging; (4) complete Hustle and a provider sandbox/test integration; (5) verify support, ads/privacy, account deletion, monitoring and release runbook.
- No production setting, secret, schema/data, provider agreement, callback, financial record or deployment was changed by recording this charter. Production release and all existing owner gates remain unchanged.


## 2026-11-19 08:10 ET — Independent Sync Watch #3

- Checked integration head `c5525d0`, production `main` at `3fa7ca5`, active branches, PR heads/comments, Cloudflare check runs, workflow inventory, current environment guards, and both live Supabase projects using read-only queries.
- PR #12, #14, and #15 are each up to date with the integration base (0 commits behind). Claude's latest comment reports local test results 34/34, 37/37, and 34/34 respectively. Cloudflare preview checks are green; no automated unit-test CI exists.
- New findings: GOV-01 (main branch protection not reported by GitHub) and ENV-06 (admin/payout-simulator runtime guards do not verify the exact staging URL). Actionable comments posted to PR #12 and #14.
- Live PROV-07 remains unchanged: production v3 and staging v7 still call the LC-journaling routine; the record-only migration is not applied. Counts remain 0 callback events, 0 conversions, 0 provider transactions in both projects.
- Next: Claude fixes ENV-06 with exact URL guards and runtime tests; ChatGPT re-reviews. Staging record-only deployment is authorized but was not performed in this read-only check. Production, legal/business, and live financial gates remain owner-controlled.


## 2026-11-19 — Independent sync check and Taplayad launch target

- Integration head: `1a8be57e9e4152b746fe1023f92bd77d486243a8`; production `main`: `3fa7ca58992f786f7b59f22b8fb758149a873d6b`; compare 311 ahead / 0 behind. 16 repository branches returned; no further branch page. Open PRs #12 @ `9a1f136` (11 ahead/7 behind), #14 @ `38715b4` (6 ahead/7 behind), #15 @ `e32c2fa` (7 ahead/7 behind), plus old draft #9. No merge.
- Latest verifiable Claude handoff: PR #12 comment `7009082911`, reporting 34/34, 37/37 and 34/34 local tests for #12/#14/#15. No GitHub statuses or workflow runs on the checked heads. Cloudflare preview success is static preview evidence only.
- Owner selected **Taplayad** as the initial Hustle publisher target. Screenshots show Legitloot App ID 10066 (Web), Rewarding category, reward label “Legit loot,” $1 = 1 point, a “1 Legit loot” test display, and a staging Supabase postback URL prefix. No settings saved and no test postback sent. This does not establish approval/live status or a working callback. Points are not LC, a USD peg, cash value, or a conversion rule.
- Current `earn-providers.js` has Offerwall.GG pending, CPAGrip testing and placeholders; no Taplayad. Staging has no Taplayad Edge Function. Build the Taplayad adapter in safe test mode, after confirming incentivized-traffic eligibility, macros/signature, sandbox behavior and provider terms. Provider agreement, paid/settlement terms and live activation remain owner-gated.
- Launch-surface mismatch: `games.html` still lists Zombie Invasion Defense as a working title/in-development and says one game / more worlds later, contrary to the two owner-selected launch games (Zombies vs Heavy Metal and Rocket 2 Nowhere). `earn.html` and other navigation still call the section Earn, not Hustle. Update the public surfaces and link both actual playable games; independently verify auth/account/save and mobile behavior.
- `rewards.html` correctly says LC are not live yet. At least five challenge/milestone definitions and the server-authoritative, idempotent game-event → website-wallet path remain unproven in the repo.
- Public support links still point to `hello@legitloot.site`; owner-designated address is `payouts@legitloot.site`, but mailbox routing/monitoring must be verified before publication. PR #15 comment `7011512870` asks Claude to update the design.
- ENV-06 remains open: `admin.js:boot()` and `payout-simulator.js:boot()` check only the staging label, not the exact staging Supabase URL. Current config is staging, so no current production target was observed. PR #14 finding remains at comment `7010372122`.
- PR #12 runbook follow-up comment `7011505297`: §4 rollback trigger still treats “unexpected write in ledger/callback tables” as a trigger; narrow it to provider-sourced LC journal/ledger postings and callback/journal mismatches. GOV-01 branch-protection check remains missing from the runbook.
- Fresh read-only Supabase check reconfirmed PROV-07 in both projects: production postback v3 and staging v7 active with JWT verification disabled; both live SQL routines still call `private.post_journal_transaction`; 7 production / 20 staging migrations; staging record-only migration absent; callback/conversion counts 0/0. No callback invoked and no Supabase writes.
- Next: Claude refreshes PRs #12/#14/#15 from the latest integration branch head at task pickup, fixes documented review items, and starts the owner-authorized Hustle/Taplayad + two-game/challenge implementation. ChatGPT reviews and proceeds with staging-only PROV-07 containment in a separate authorized implementation run.
- Owner gates unchanged: production containment/release/settings, provider agreement/approval/live activation, paid commitments, legal publication, live financial activity, security weakening, destructive real-data changes and irreversible decisions. No PR merge/deploy or production/staging mutation occurred in this check.


### Coordination closeout — 2026-11-19
- The four documentation updates for this check advanced integration from `1a8be57` to `150d7a4`. This final batched documentation correction is being committed now; PR branches must be refreshed from the live integration branch tip when Claude resumes, not from either historical SHA.
- Immediately before this closeout correction, PR #12/#14/#15 were 11 commits behind integration (11/6/7 commits ahead respectively). The earlier branch-refresh instruction is superseded: use the current integration branch head at pickup and report exact compare counts after refresh.
- No PR merge, deployment, callback, provider activation, Supabase mutation, production action or financial activity occurred.


## 2026-11-19 09:40 America/New_York — Taplayad selected publisher: screenshot evidence recorded

- Owner supplied Taplayad dashboard/docs screenshots for Legitloot app ID 10066 and URL template `https://offerwall.tplayad.com/10066/{user_id}`. Dashboard visibly says Active; this is not proof of provider approval, incentivized-traffic permission, settlement eligibility, or a working LegitLoot integration.
- Screenshot evidence: Web platform, Rewarding category, “Legit loot” label, publisher multiplier `$1 = 1 points`, 2,899 offer entries under Web/Worldwide filters, and sample CPA/CPI offers. Publisher documentation lists `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{country}`, `{user_ip}`, `{status}`, `{sig}`; says `{sig}` is an MD5 security signature and lists source IP `176.97.212.58`.
- The screenshots do not show the full signature formula or a transaction-ID macro. Claude must verify current provider docs/support for canonical signature construction, transaction identity, retry, status and reversal semantics; do not guess.
- Publisher multiplier and publisher withdrawal panel are strictly publisher-side concepts. They must never become LC/USD conversion, user cash, withdrawal, or a second wallet. Taplayad callbacks must be record-only task tracking and must never touch LC wallet/ledger/journal.
- Next: Claude documents and implements staging-only Taplayad adapter/offerwall URL attribution with authenticated opaque user IDs, offer/task history, signature and source validation, replay/duplicate protection, chargeback tracking, and negative tests proving provider events cannot mint LC. Embedded offerwall is the preferred smallest-launch option, subject to provider terms.
- Provider permission for incentivized traffic, account/contract activation, paid terms, dashboard changes, and live test-postbacks remain owner-gated. No dashboard changes, callbacks, deployment, secrets, schema/data, or financial activity were performed by recording this evidence.


## 2026-11-19 09:43 America/New_York — Coordination debrief: Taplayad evidence and watch instructions

- **Checked:** Owner-supplied Taplayad dashboard and documentation screenshots, selected app ID 10066, offerwall URL template, displayed publisher reward multiplier, offer catalogue snapshot, callback macros, signature note and source IP.
- **Evidence/results:** Dashboard shows Active; offer page shows Web/Worldwide filters and 2,899 entries; docs screenshot lists `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{country}`, `{user_ip}`, `{status}`, `{sig}`; MD5 signature is mentioned but full formula and transaction/reversal semantics are not shown.
- **Findings/fixes:** Added Taplayad integration contract and owner-gate rules to Master Control, Progress, Launch Readiness, Environment Source of Truth, and Claude handoff instructions. Explicitly prohibited mapping publisher points/revenue to LC and prohibited guessing signature construction.
- **Outstanding:** Claude must inspect current provider docs/support, confirm incentivized-traffic permission and protocol details, implement staging-only attribution/record-only event processing, and test replay/duplicates/reversals/invalid signatures plus zero LC-wallet interaction.
- **Next owner-independent action:** Claude implements the adapter/framework and reports exact source files, tests, and provider dependencies; ChatGPT independently reviews.
- **Owner gate:** Provider terms/traffic approval, dashboard saves, test-postback invocation where effects are uncertain, live activation, paid commitments, and any production/financial action remain owner-gated.
- **Coordination cadence:** Existing LegitLoot Sync Watch was updated to include Taplayad and the new owner instructions. The automation platform's maximum supported recurrence is hourly; 10-minute scheduled polling is unavailable. Claude is instructed to read shared records at the start/end of active sessions and after meaningful handoffs.
- **Changes:** Documentation-only commits on `build/legitloot-neon-synthwave`: Master Control `743c795f`, Project Progress `e14c15e1` (this debrief follows), Launch Readiness `93615741`, Environment Source of Truth `a2f3e492`, and `CLAUDE.md` `0ee484c6`. No publisher settings, postbacks, secrets, Supabase state, schema/data, rewards, or production systems were changed.

## 2026-11-19 10:00 ET — M2-T3a staging containment deployed by ChatGPT

- Owner reaffirmed standing authority: agents may merge verified work into the integration branch and deploy reviewed changes to staging without per-action approval. Production and business-critical gates remain unchanged.
- Applied `offerwall_gg_record_only` to staging project `scmnxcsggquwtuyyjnnj`. Supabase recorded migration version `20261119145340`; the canonical migration file was renamed to `supabase/migrations/20261119145340_offerwall_gg_record_only.sql` so future migration tooling does not replay a mismatched timestamp.
- Deployed canonical `offerwall-gg-postback` Edge Function to staging: **ACTIVE v8**, `verify_jwt=false` (preserved from v7 because the function performs its own HMAC validation). The matching deployed source snapshot and manifest were updated; deployment source hash: `d17c18d7ca2643b9fac2fd8c336e741f27edea63e7bb819764b8927e796c321e`.
- Live database verification: `private.process_offerwall_gg_postback` now records provider callbacks/conversions only and contains no ledger-account lookup or journal-posting call. Execute grants: `service_role=true`, `anon=false`, `authenticated=false`.
- Post-deploy counts: callback events 0, conversions 0, Offerwall.GG journal transactions 0, Offerwall.GG journal entries 0. No callback was invoked; no provider secret was read or changed. Production was not touched.
- Additional source defect fixed before deployment: reversed provider callbacks carry a negative `payoutUsd`, while the metadata routine accepts only nonnegative original payout amounts. The Edge Function now stores the absolute textual amount for reversal metadata (without floating-point conversion); reversal state remains separately recorded. Added a regression test and updated migration-path references. Source-level checks passed. The full npm suite was not rerun in this session; Claude's prior 8/8 PGlite report applies to the earlier source head.
- **Result:** PROV-07 is contained in staging. Production Offerwall.GG v3 remains on its legacy LC-posting path and is still an explicit owner decision/blocker. Do not infer staging containment is production containment.

## 2026-11-19 10:10 ET — ChatGPT — M2-T3a/T3b staging containment and AUTH-03 design closeout

- Applied staging migration `20261119145340_offerwall_gg_record_only`; deployed `offerwall-gg-postback` v8. Live routine is record-only, private execute is service-role only, and post-deploy counts remain zero for callbacks, conversions, Offerwall.GG journal transactions and journal entries. No callback was invoked.
- Fixed reversed payout metadata normalization before deployment; added a regression test and synced the migration filename to the applied migration version. Source-level checks passed; full npm suite not rerun in this session.
- Merged PR #14 (`f8780a0`) and deployed staging `cpagrip-attribution` v5 with `verify_jwt=true`. Live source matches canonical source, no production origin, bearer token and server-side user validation intact.
- Added reviewed AUTH-03 design to integration branch (`439027c`); corrected intended contact to `payouts@legitloot.site` but kept it UNVERIFIED. D1–D4 remain owner/legal decisions. No account-deletion code or production changes.
- Updated Platform Build Spec to v1.3 and games page to list the two owner-selected titles, truthfully marked integration-in-progress with no invented play links.
- **Next active task M2-T4:** verify both selected games and their central account/save contract. The connected GitHub inventory and prior handoffs did not reveal their source repositories or playable URLs. `demonanic/Legitloot-2` is Zombie Invasion Defense, not a substitute. Need exact playable URL or repository link for each selected game before wiring launch links.

## 2026-11-19 10:15 ET — M2-T6 release runbook

- Reviewed and ported `docs/RELEASE_RUNBOOK.md` from PR #12 to the integration branch (`53ba77a`); stale-base PR #12 closed as superseded.
- Corrected rollback triggers for the record-only callback model; updated the staging migration version to `20261119145340`; dated the last verified production signup probe; added GOV-01 branch-protection verification to the release freeze.
- Production branch protection remains unverified (last API evidence: `protected:false`, no rulesets, detailed endpoint inaccessible). Production backup/PITR tier remains unverified. Neither was changed.
- Current active milestone remains M2-T4: game integration verification. Exact source repositories/playable URLs for Zombies vs Heavy Metal and Rocket 2 Nowhere remain the missing dependency.


## 2026-11-19 10:20 ET — Independent Sync Watch: current M2 state and handoff

- **Integration head at start:** `7cf82eea2a313bde49fcc1e304729ae3a7dab957`; 349 ahead of main, 0 behind. Sixteen branches; all report `protected:false`.
- **PRs:** #9 is the only open PR (old draft design, last updated Nov 12, no formal reviews). #12 closed unmerged/superseded by integration runbook commit `53ba77a`; #14 merged into integration; #15 closed unmerged/superseded by `docs/ACCOUNT_DELETION_DESIGN.md`. No open PR for current launch feature work.
- **Claude evidence:** latest Claude-authored commit found is `5ab48bd` (docs debrief, 11:41Z); latest verifiable Claude handoff is PR #12 comment `7009082911` at 12:27Z. No newer Claude commit/handoff found. Do not attribute later owner-authored commits to Claude.
- **CI/tests:** no GitHub status checks or workflow runs on current head. Only workflow is artwork extraction; no test workflow. Prior Claude local reports (34/34, 37/37, 34/34) are on older PR heads. Current-head suite was not run in this audit.
- **PROV-07:** read-only staging verification confirms migration `20261119145340_offerwall_gg_record_only` applied, postback v8 active and SQL routine record-only/service_role-only. Production postback v3 remains active and its SQL routine still calls `private.post_journal_transaction`; this is a critical LC-policy violation and remains owner-gated.
- **New MIG-02:** staging records applied migration `20261118080655_game_platform_foundation`, but no corresponding migration file exists in the integration Git tree. Recover authoritative migration source before further schema changes.
- **M2-T4 game evidence:** staging `public.game_registry` contains only `zombie-invasion-defense`, `development`, unlisted, no launch URL; `private.game_events` is empty. No game Edge Function or challenge catalogue exists. Connected repos searched include Aegis Rogue, Demonanic, Zombie Invasion Defense, Gauntlet's Survival and Harvest//Zero; no exact source/URL for either official launch title found.
- **Hustle/Taplayad:** current site registry has Offerwall.GG pending, CPAGrip testing, no Taplayad. Staging provider registry has only Offerwall.GG and CPAGrip, both disabled and without terms/approval references; no Taplayad function. Public page/nav still says Earn rather than Hustle.
- **Support:** public pages still link to `hello@legitloot.site`; owner-selected `payouts@legitloot.site` remains unverified.
- **ENV-06:** `admin.js:boot()` line 31 and `payout-simulator.js:boot()` line 62 only check the environment label, not exact staging URL; current test file does not runtime-test these two clients.
- **Next:** Claude fixes ENV-06, recovers migration source, implements Taplayad test-only adapter after provider protocol verification, renames public section to Hustle, and prepares challenge definitions using only approved LC economics. ChatGPT independently reviews. Game integration cannot proceed until exact source URLs/repos are supplied.
- **No changes to code, schema/data, settings, secrets, provider dashboard, callbacks, production or finances were made.** Only read-only checks and this coordination documentation update were performed.


## 2026-11-19 — Independent Sync Watch / PR #16 review

- Verified integration head `66eff589`, 354 ahead / 0 behind `main`; 17 branches. Rulesets list empty; direct branch-protection endpoint returned 403, so protection remains unverified.
- Open PR #16 is current for ENV-06 (head `db939d6`, base `66eff58`, mergeable). Independent review inspected `admin.js:boot()`, `payout-simulator.js:boot()`, and the new runtime guard test; no code blocker found in the limited diff. Review 5979524271 is COMMENT only, not approval. Claude reports 42/42 local tests; no status checks or Actions runs exist, so test result was not independently reproduced.
- Open PR #9 is an old draft, 12 commits behind/diverged. Its `tests/home.browser.py` expects Zombie Invasion Defense; current approved titles are Zombies vs Heavy Metal and Rocket 2 Nowhere. Comment 7015938125 requests refresh and corrected assertions before any merge.
- Current `games.html` correctly names both approved games, but `index.html` still has a Zombie Invasion Defense feature card. Public nav and `earn.html` still say Earn; no Taplayad entry exists in `earn-providers.js`.
- Read-only production query reconfirmed Offerwall.GG postback v3 calls the LC journal posting routine. Staging v8 routine remains record-only. No callbacks invoked.
- Staging still has only the unlisted Zombie Invasion Defense registry row, no game event function, and no Taplayad function. Applied migration `20261118080655_game_platform_foundation` has no corresponding SQL file in the integration tree.
- Staging provider rows are only disabled Offerwall.GG and CPAGrip. Offerwall.GG's disabled row still says `approved_reward_model.currency_code=LC` and `standard_virtual_currency` despite no approval reference/verified terms; reconcile to record-only non-LC semantics before any provider activation. No data changed.
- PR #16 has a Claude Code-labelled handoff in its branch's master control file; integration `CLAUDE.md` was stale. Shared handoff now records PR #16 status and updated assignments.
- Next: MIG-02 read-only source recovery; Taplayad protocol/terms verification and staging-only adapter; Hustle rename/task history; homepage/game-title correction once routes verified; five-plus challenge design; add CI. Exact playable URLs/repos for both launch games remain needed.
- No merge/deploy, Supabase setting/secret/schema/data change, callback, publisher dashboard save, provider agreement, live financial action or production change occurred.


## 2026-11-19 — Follow-up artifact: Claude handoff update on PR #16

- New verifiable Claude-authored commit: `3037903ba614601eac262c7caaa951c48a3b203b` (co-authored Claude Sonnet 5.5; session link recorded in GitHub commit metadata). It updates the PR branch's `CLAUDE.md` to mark ENV-06 implemented in PR #16 and identify the remaining MIG-02/Hustle/game tasks. This is a documentation-only commit; no new code or test result was added.
- PR #16 head is now `3037903`, 3 commits total, still open and unmerged. Its base remains integration head `66eff58`. Compare against the current integration branch shows divergence: integration has 5 commits not on the PR branch, while the PR branch has 3 commits not on integration; GitHub reports `mergeable=false`. The branch must be refreshed against the latest integration head and tests rerun before further review.
- Cloudflare posted successful Pages preview deployments for commit `3037903` on `legitloot-preview` and `legitloot` project preview hosts. These are preview deployment confirmations only; no GitHub CI/status checks or Actions runs exist.
- ChatGPT's review 5979524271 remains COMMENTED, not APPROVED. It found no code-level blocker in the two exact staging URL guards, but did not independently execute the test suite.
- Next: Claude refreshes PR #16 onto the latest integration head, resolves any documentation overlap, reruns `npm test`, `node --check`, and `git diff --check`, and reports exact new head. No merge or production deployment is authorized.


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


## 2026-11-19 — Independent check: combined CI and staging PROV-07 result

- Claude handoff artifacts: PR #16 head f58d176 (ENV-06), PR #17 head a83851b (CI-01), PR #18 head 8071a73 (MIG-02), plus new draft PR #19 / branch claude/combined-merge-candidate head 8795409. PR #19 explicitly combines #16/#17/#18 for testing and says “Not for merge.”
- GitHub Actions run 44574267498 on PR #17 passed 38/38. Combined candidate run 44583018543 passed 50/50, 0 failed, 0 skipped, plus npm ci and submitted-patch whitespace check. This is strong independent evidence for the combined tree, not an approval to merge PRs or deploy. PR #16 and #18 individual heads have no Actions run.
- Claude's #16/#18 local test reports (42/42 and 46/46 respectively) are superseded for combined-test evidence by the verified 50-test run. No current-head test claim is made for the live integration branch itself.
- MIG-02 source: canonical migration 20261118080655_game_platform_foundation.sql is now in integration supabase/migrations, with PGlite tests and original recovery evidence. It is already applied to staging; never replay it there.
- PROV-07 staging: fresh read-only checks show staging migration 20261119145340_offerwall_gg_record_only applied; active offerwall-gg-postback v8 source matches the integration file exactly. Live staging private routine and public wrapper are record-only; metadata recorder has no ledger/journal path. Staging callback events/conversions are 0/0. No callback was invoked.
- PROV-07 production: production postback v3 remains active and its live private routine still references ledger accounts and calls post_journal_transaction. This is still a critical production policy violation and owner-gated.
- Taplayad selected app 10066 is not yet integrated in code or staging. Current official docs confirm MD5 signature md5(app_id . user_id . api_secret), statuses 1/2 for credit/reversal, source IP 176.97.212.58, but no transaction-ID macro and no signature binding for offer/reward/status/payout. Require written provider clarification or stronger verification before a live callback adapter. Do not issue LC from Taplayad.
- Current launch gaps: homepage still has Zombie Invasion Defense and “Complete offers (Planned)” inside LC steps; games page names both approved games but has no playable links; Earn has not been renamed Hustle; no Taplayad registry/Edge Function/task history; five-plus launch challenges and game-to-wallet pipeline are not evidenced; public email still says hello@legitloot.site; designated payouts@legitloot.site is unverified.
- Exact-title GitHub repository searches did not locate source repositories for Zombies vs Heavy Metal or Rocket 2 Nowhere. No playable route was invented.
- Next: maintain PR #19 as a draft test candidate; independently review future implementation; fix public copy and Hustle labels; obtain the two game source URLs/repos; request Tplayad's signed transaction/reversal contract; keep production gates unchanged.


## 2026-11-19 13:21 ET — Independent coordination and launch-readiness check

- **Repository state:** integration branch `build/legitloot-neon-synthwave` is exactly at `c3b0fe67d432b9064eaca13556d0f316844b206a`; compare confirms `main` is 369 commits behind and 0 ahead. GitHub lists 20 branches. Five PRs remain open: #9, #16, #17, #18, #19.
- **Claude artifacts verified:** #16 head `0a976e5`, #17 `62cf11b`, #18 `384a1ca`, #19 `8795409`, #9 `046019f`; commit metadata identifies Claude as author on these commits. Latest visible Claude handoff remains the PR #19 combined-candidate note in `CLAUDE.md`; no newer Claude implementation/handoff artifact was found in this check.
- **Branch synchronization:** relative to integration `c3b0fe6`, #16 is 10 ahead / 1 behind, #17 5 ahead / 2 behind, #18 2 ahead / 2 behind, #19 20 ahead / 1 behind, and #9 12 ahead / 160 behind. #19 remains explicitly draft / not for merge.
- **CI:** GitHub Actions run `44583018543` on #19's PR merge ref completed successfully. Job log confirms `npm ci`, `npm test` (50 passed, 0 failed, 0 skipped), and submitted-patch `git diff --check` all passed. The merge-ref log shows base `b6bcf75` and head `d134f5c`. This is combined-candidate evidence, not CI on current integration or on each individual PR head. The workflow file is not yet present on integration because #17 remains open.
- **ENV-06 / MIG-02 review:** combined candidate contains exact staging URL + environment-label + publishable-key guards in `admin.js:boot()` and `payout-simulator.js:boot()`, with negative tests. It also contains the recovered `20261118080655_game_platform_foundation.sql` and PGlite tests. The migration is already applied to staging and must never be replayed there. Its `target_origin` constraint is not a canonical origin allowlist; the existing PR #18 review comment correctly requires explicit canonical-origin validation in any future handoff-ticket issuer.
- **Current integration UI defects:** `index.html` still features Zombie Invasion Defense and includes “Complete offers (Planned)” inside `.ll-coins__steps`, despite the locked LC-only sources. `games.html` correctly names Zombies vs Heavy Metal and Rocket 2 Nowhere but provides no verified play routes. Navigation and `earn.html` still say Earn; `earn-providers.js` has no Taplayad entry. Public contact links still point to `hello@legitloot.site`.
- **New test-coverage finding:** `tests/lc-policy-copy.test.mjs` checks statements that already mention LC plus earning/milestones but does not inspect the LC steps list. Therefore the 50-test combined run passes while the homepage still visually places offers in the LC sequence. Added actionable review comment `7018141210` to PR #9 requesting an explicit regression assertion, approved game-title assertions, and branch refresh. No code changed.
- **Fresh read-only Supabase evidence:** production `offerwall-gg-postback` v3 remains ACTIVE (`verify_jwt=false`); live `private.process_offerwall_gg_postback` selects/locks LC ledger accounts and calls `private.post_journal_transaction`. Production callback/conversion counts are 0/0. Staging postback v8 remains ACTIVE (`verify_jwt=false`), and the live routine is record-only with no ledger/journal path; staging callback/conversion counts are 0/0. No callback was invoked.
- **Staging provider/game records:** Offerwall.GG and CPAGrip are disabled; Offerwall.GG retains stale `approved_reward_model` metadata naming LC/LootCoins with null terms/verification/approval references. Taplayad is absent. `game_registry` still contains only the unlisted Zombie Invasion Defense development placeholder with no launch URL.
- **Taplayad documentation/terms recheck:** official docs still specify `md5(app_id . user_id . api_secret)`, status 1 credited / 2 reversed, IP `176.97.212.58`, and no transaction-ID macro; signature does not bind offer ID, payout, reward or status. The docs' iframe route `https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}` differs from the owner screenshot URL template. Published Terms of Service last updated 2026-10-29 do not explicitly confirm this account's incentivized-traffic permission or the LegitLoot reward model; indemnity is included. Do not implement live callback crediting, save dashboard settings, or accept terms until the provider supplies stronger transaction verification and the owner approves any binding agreement.
- **Preview isolation:** candidate `supabase-config.js` explicitly targets staging project `scmnxcsggquwtuyyjnnj`; Cloudflare posted successful branch-preview comments in both Pages projects. Project-level Cloudflare environment bindings were not independently verified. No production domain deployment is claimed.
- **Next owner-independent actions:** Claude should sync/rebase the engineering branches after this one documentation commit, preserve the combined CI gate, add the missing LC-steps regression test, correct homepage/game copy, rename Earn to Hustle, and continue Taplayad in record-only staging design pending provider clarification. Game play routes remain unpublished until actual source repos/URLs are verified.
- **Owner gates:** production Offerwall containment; GitHub main branch protection; Taplayad incentivized-traffic permission, signed transaction/reversal contract and binding terms; verified support mailbox; production registration-pause verification; and final production release. No PR merge, deployment, settings/secret change, schema/data change, publisher-dashboard change, callback, financial activity, or legal commitment occurred in this check.


## 2026-11-19 14:42 ET — PR #20 review and fresh provider-policy check

- Integration head: `3fa518ee27c987a58f3196f682c7e13de483b6a8`; main: `3fa7ca58992f786f7b59f22b8fb758149a873d6b`; integration is 375 ahead / 0 behind. 21 branches are listed and all report `protected:false`.
- PR #16, #17 and #18 are merged into integration only; PR #19 is closed unmerged. Open PRs are #20 (Hustle public-copy, non-draft) and #9 (visual redesign, draft, 12 ahead / 166 behind).
- PR #20 Claude commits `4a0db7a` and `04e4016` change public nav/title/description/aria labels to Hustle, remove “Complete offers” from the homepage LC steps, replace the old ZID homepage card with the two approved game titles, and add four public-copy Node tests. No play URLs are invented.
- CI: integration run [44590656627](https://github.com/demonanic/LegitLoot/actions/runs/44590656627) passed 50/50; PR #20 run [44591660747](https://github.com/demonanic/LegitLoot/actions/runs/44591660747) passed 54/54, no skips, whitespace check passed.
- Independent review comment [7020270626](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7020270626) identifies remaining public-copy issues: visible “No earning provider…” status in `earn-hub.js`; homepage LC step 3 “Uses announced later”; ambiguous “Advertised rewards are not guaranteed earnings” / “settlement” wording. Current CI only runs Node `.test.mjs` files, not Python/Playwright browser checks; add Node regression coverage. PR #20 is 2 ahead / 2 behind integration and needs sync + rerun before approval.
- Fresh Supabase read-only check: production Offerwall.GG postback v3 remains ACTIVE (`verify_jwt=false`) and `private.process_offerwall_gg_postback` still locks LC accounts and calls `private.post_journal_transaction`. Production violation remains active.
- Staging Offerwall.GG postback v8 remains ACTIVE (`verify_jwt=false`) but its database routine is record-only. Deployed Edge Function source exactly matches integration source (6,990 bytes). Staging provider table still has disabled Offerwall.GG with stale LC/LootCoins reward-model metadata and null approval/terms fields; CPAGrip is disabled; Taplayad absent.
- Cloudflare bot reports both PR #20 Pages previews deployed successfully. PR branch `supabase-config.js` points to staging; project-level Cloudflare bindings were not independently verified.
- No code, merge, deploy, database/settings/secret, provider, callback, or financial action was performed. Next: Claude addresses PR comment, syncs and reruns CI; ChatGPT re-reviews. Production containment and branch protection remain owner gates.

## 2026-11-19 15:23 America/New_York — Coordination debrief

- Checked current integration/main refs, 21 discovered branches, open PRs, PR #20 review timeline and patch, Claude handoff instructions, CI job logs, public pages/tests, Supabase function inventories, deployed SQL routines and staging provider rows.
- Verified PR #20 head 20a8203 passes 57/57 Node tests and the whitespace check in Actions run 44601788773. Earlier copy findings are addressed.
- New findings: homepage meta/headline still use broad “earned by playing” wording although the owner-approved LC sources are verified in-game milestones, weekly challenges and seasonal events; tests do not cover the meta/headline. Staging Offerwall.GG handler requires “Loot Coins” while integration guide says “Loot coins”; no test covers this exact value.
- PR #20 is 5 commits behind and 5 ahead of current integration 04ff43e. Review comment 7021287292 requests synchronization, precise LC wording and regression assertions.
- Production Offerwall.GG v3 still posts LC journal entries; staging v8 is record-only. Staging provider metadata for disabled Offerwall.GG still names LC/LootCoins; Taplayad remains absent.
- No code, merge, deployment, callback, Supabase settings/secrets/schema/data, provider dashboard, payment or agreement change was made.
- Next owner-independent actions: Claude syncs PR #20 and corrects homepage wording/tests; verify Offerwall.GG currency-name case and align staging handler/docs/test; continue Taplayad only as record-only staging work.
- Owner gates: production Offerwall containment, branch protection, provider agreements/traffic permission, production deployment, legal/business decisions and final launch.


## 2026-11-19 16:54 America/New_York — Sync Watch debrief: PR #20 reviewed; game task and Taplayad protocol clarified

- Read the Master Execution Control, progress, launch audit, environment source of truth, and CLAUDE handoff. Corrected the stale CLAUDE current-task line: the Master says M2-T4 (identify/integrate the two approved games) is active and ChatGPT is acting lead; M2-T5 public-copy work is now a supporting PR candidate.
- PR #20 is open, non-draft, mergeable, and synchronized at head ad21bbe against integration 3db61c0. Its 15-file diff changes public navigation/page labels, homepage LC copy, Hustle status/disclaimer wording, and adds tests/hustle-public-copy.test.mjs; no provider, wallet, DB or LC issuance code changed. Actions run 44609090382 succeeded through install, Node tests and patch whitespace check. Claude reports 58/58 local tests; the exact count was not independently read from the Actions log. Python/Playwright is not in CI.
- Independent formal PR review COMMENT 5984053898 found no blocking defect in this scoped diff. This is not an approval. No PR was merged. The coordination-document updates advance integration; PR #20 must sync to the latest integration HEAD and rerun CI before final owner review.
- PR #9 remains a stale draft. Two PRs are open (#20 and #9). GitHub lists 21 branches, all with protected=false.
- PR #20 config matches integration and explicitly targets staging project scmnxcsggquwtuyyjnnj. Cloudflare bot reports successful branch previews in both Pages projects; dashboard-level bindings/custom-domain routing are not independently verified.
- Fresh read-only Supabase check: production Offerwall.GG v3 ACTIVE (verify_jwt=false) still calls private.post_journal_transaction through private.process_offerwall_gg_postback, so provider-to-LC issuance remains possible. Staging v8 ACTIVE is record-only; deployed Edge Function source exactly matches integration (6,990 bytes). Staging Offerwall.GG row remains disabled but has stale LC/LootCoins reward metadata and null terms/approval fields; CPAGrip disabled; Taplayad absent.
- New Tplayad discovery: current/new docs https://tplayad.com/docs match the owner's macro names but document md5(app_id . user_id . api_secret), no transaction-ID macro, and example dedupe by offer_id + user_id; this does not bind reward/payout/offer/status. Legacy docs https://www.tplayad.com/doc/postback describe subId/transId/reward/payout/signature/status/userIp/campaign_id/country/uuid, signature md5(subId . transId . reward . secret), a materially different protocol. The legacy signature still does not bind status. Owner URL also differs from the new iframe URL. App ID 10066's actual system/contract and URL alias remain unconfirmed; no live callback implementation.
- Tplayad Terms updated 2026-10-29: 18+ account rule, anti-fraud restrictions, publisher payment terms and indemnification; no account-specific LegitLoot approval established. No terms accepted.
- Offerwall.GG currencyName case mismatch remains unresolved: internal guide says Loot coins, staging handler requires Loot Coins; official docs make currency name publisher-defined and do not establish this placement's exact value.
- Exact-title GitHub repository searches for Zombies vs Heavy Metal and Rocket 2 Nowhere returned no matches. M2-T4 remains blocked on exact playable/source links; no unrelated repo substituted.
- No PR merge, deploy, callback, provider-dashboard change, payment, Supabase setting/secret/schema/row change, or production action occurred.
- Next: Claude syncs PR #20 to the new integration head and reruns CI; ChatGPT re-reviews. Continue M2-T4 discovery and request exact game source/playable links only as required. Keep Taplayad record-only until its account-specific protocol and permission are confirmed.
- Owner gates unchanged: production Offerwall containment, branch protection, provider agreement/activation, paid commitments, production deployment, destructive data, security weakening, legal/business decisions, support-mailbox and registration-pause verification, final release.


## 2026-11-19 17:42 America/New_York — Sync Watch debrief
- PR #20 current head `8cee6f7` is synchronized to integration `a0cef5e` (9 ahead, 0 behind), mergeable and non-draft. Actions run 44624595265 independently confirms 58/58 Node tests, 0 failures/skips and patch whitespace check. ChatGPT posted independent COMMENT review 5984643477: no blocking defect in the scoped public-copy diff. PR is ready for owner review; not merged.
- PR #9 remains a non-mergeable draft, 12 ahead / 184 behind; do not merge as-is.
- M2-T4 source search covered all seven accessible owner repositories and exact-title searches. No source/playable URL for Zombies vs Heavy Metal or Rocket 2 Nowhere found. Staging registry still contains only unlisted development ZID with no launch URL; game saves/events/handoff tickets are all zero and no challenge/milestone/season tables exist.
- Fresh read-only Supabase: production Offerwall.GG v3 still calls journal posting (critical provider-to-LC path); staging v8 remains record-only. Staging provider row for Offerwall.GG is disabled but retains stale LC/LootCoins metadata and null approval/terms fields; CPAGrip disabled; Taplayad absent.
- Corrected stale launch-game references in Creative Bible and Platform Build Spec §1 to match the current two-title owner decision. No application code or live system was changed.
- Next: owner review of PR #20; obtain exact game source/playable references; continue M2-T4 integration verification only after sources are identified. Production containment, branch protection, provider agreements and production release remain owner-gated.


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

## 2026-11-19 19:41 ET — First launch game is live; production blockers newly surfaced

- **Resolved M2-T4 for game 1:** owner-approved PR #21 was merged as `4e0f533` to `main`; Cloudflare `legitloot` production deployment `6598c4c6-ecd5-49a1-9122-a55caa892cd8` succeeded on `main`, alias `https://legitloot.site`. The play route is `/zombies-vs-heavy-metal.html`, embedding `https://demonanic.github.io/Legitloot-2/`.
- Independent read-only browser check: homepage, Games page, play page and direct game URL returned HTTP 200; actual ZVHM canvas/tutorial/HUD rendered; no browser-captured page errors or horizontal overflow at desktop/390px mobile. No game controls were pressed and no save was created.
- Game repository: `demonanic/Legitloot-2`; latest observed commit `fcf4000`. README confirms official title and device-local progress; LegitLoot sign-in, shared saves and LC rewards are not connected. No GitHub Actions run/status evidence was returned for PR #21 or game commit `fcf4000`.
- **Rocket 2 Nowhere is still missing** from production and has no located source in the connected repository inventory. Production Games shows ZVHM plus “More worlds later”; full two-game launch is not complete.
- Integration `907f1a6` is 404 commits ahead / 2 behind main `4e0f533`; it lacks the new ZVHM play page and still displays the ZID placeholder. Port PR #21's four public files to integration before a future release.
- PR #20 remains open, head `7912edd`, 13 ahead / 1 behind current integration. Actions run `44637573706` passed 58/58 Node tests and whitespace check. It needs one sync to `907f1a6`; do not merge to main. PR #9 remains a stale draft.
- New critical production finding: `main` still advertises provider-to-LC credits in `rewards.html`, cash rewards/withdrawal in `rewards.html` and `account.html`, and “Complete offers — Planned” in `index.html`. Production `account-auth.js` is hardwired to production Supabase and implements sign-up; `public.get_wallet_summary()` returns cash and LC. Terms and Privacy pages explicitly say they are incomplete and warn users not to submit personal data. Owner decision required on pausing public sign-ups until legal and LC-only wallet cleanup is approved. No auth settings or production code changed.
- Production Offerwall.GG v3 remains ACTIVE and its DB routine posts LC journal transactions. The provider row is disabled, but the deployed function does not check that disabled status before calling the RPC. Staging v8 remains record-only.
- Staging `offerwall-gg-wall-url` CORS allow-list includes production origin `https://legitloot.site`; review this cross-environment exception before production integration.
- Taplayad App ID 10066 remains unintegrated and record-only pending protocol, signed transaction identity, reversal semantics and incentivized-traffic permission.
- No production change, merge, deployment, setting/secret change, database mutation, callback, payment or provider agreement occurred during this audit.


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


## 2026-11-19 21:32 ET — Post-debrief Claude sync verification

- Claude responded to the PR #20 sync request with verifiable PR comment `7028471600`: PR #20 is now head `6e2e51b`, based on integration `387d035`; the staging-only/fail-closed auth guard was preserved. GitHub Actions run `44661202504` passed 58/58 tests, 0 failures/skips.
- Claude also updated the stacked PR #22 to head `332ca07`, based on PR #20 head `6e2e51b`. GitHub Actions run `44661225287` passed 64/64 tests, 0 failures/skips. The PR #22 branch is 2 commits ahead / 0 behind its PR #20 base.
- The integration branch was at `6417323` immediately before this correction; it contains six documentation-only commits after `387d035`. PR #20 is therefore six documentation-only commits behind the integration head at this point. This correction is another documentation-only commit. No further sync request is made in this run to avoid repeated sync churn.
- PR #20 and #22 remain open/unmerged. PR #23 and #24 remain draft, preview-only, with the previously recorded preview-isolation and PR #24 Deno-test blockers. No merge or deployment occurred.


## 2026-11-19 21:33 ET — Owner decision clarification: preview auth isolation

- PR #23 discussion comment `7028436334` confirms its production-targeting Account script is inherited from `main`; the game-only PR remains unchanged. A separate owner-approved PR is needed to add a preview-host fail-closed guard without changing production behavior.
- Until that decision is resolved, Account/auth routes on PR #23 and #24 previews must not be used. PR #22's integration preview remains staging-only.


## 2026-11-19 22:39 ET — Sync Watch verification update

- Integration is `7b240b2`; production `main` remains `4e0f533`. The current branch inventory contains 25 refs. PR #20 is still `6e2e51b` based on `387d035`, eight docs-only commits behind current integration; its 15-file app diff is unchanged and Actions run `44661202504` passes 58/58. PR #22 is `332ca07`, stacked on PR #20, 2 ahead / 0 behind; Actions run `44661225287` passes 64/64. PR #23 (`33a5240`) and #24 (`7a31165`) remain draft/preview-only; #9 is stale. No merge or deployment.
- Cloudflare production remains `main` / `4e0f533`; integration and PR previews deployed successfully. Main-based PR #23/#24 Account pages still target production Supabase through inherited `account-auth.js`. Do not use auth routes on those previews; a separate owner-approved guard PR is required.
- Production Offerwall.GG v3 remains active and the service-role SECURITY DEFINER path can post LC despite the disabled provider row. Staging callback v8 remains record-only. Staging wall-URL CORS still permits the production origin. No settings, secrets, callbacks, or database changes were made.
- Staging wallet RPC still returns cash buckets and `currency.cash=USD` even though the staging client ignores them; its metadata labels game credits `LLC`, not `LC`. This is a wallet-contract mismatch to resolve before describing the platform as LC-only.
- Staging game registry remains a single unlisted ZID development row; saves/events/handoff tickets are 0 and there are no challenge/milestone/season tables. ZVHM is live; RXT2 is preview-only. Both game candidates are device-save early access without shared account/save/LC-event integration.
- Taplayad remains unintegrated and absent from staging provider registry. Current `tplayad.com/docs` and legacy `tplayad.com/doc/postback` conflict on wall URL, callback macros, signature fields, and response/retry semantics. No App-10066-specific incentivized-traffic approval or complete callback contract is verified. Keep record-only; no publisher points or callback reward may map to LC.
- The only verifiable Claude actions since the prior handoff are PR #20/#22 sync comments `7028471600` and `7028471854`; no PR #23 auth fix or PR #24 Deno-test fix exists yet.
- No production or staging mutation, callback, provider agreement, money movement, PR merge, or deployment occurred.


## 2026-11-19 22:51 ET — PR #24 pure-handler testability fix prepared (NOT DEPLOYED)

- PR #24 remains draft on `main`; candidate head is now `fb2e890`. The original test-import side effect is fixed in the PR branch: new `handler.ts` contains only the inert HTTP 410 handler; `index.ts` alone imports it and starts `Deno.serve`; `index_test.ts` imports the pure handler and checks GET/POST/OPTIONS, `410`, `no-store`, and that POST bodies remain unread.
- Added `.github/workflows/offerwall-gg-containment-tests.yml` to run the Deno test file. No GitHub Actions run has surfaced for the new head yet, so the Deno suite is **not verified**. A local Node 22.16 smoke test against the actual handler passed 3/3 methods; this is not a Deno test result.
- PR comment `7029857955` records the fix and exact test limitation. The endpoint remains inert; no Supabase function was deployed, no SQL grants/settings/secrets/schema/data changed, and no callback was invoked.
- PR #24's separate preview-auth issue remains: its main-based preview inherits production-targeting `account-auth.js`. Do not use Account/auth routes. Production containment still requires separate owner approval.

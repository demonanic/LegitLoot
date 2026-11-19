# LegitLoot project progress

**Updated:** 2026-11-19 08:10 ET
**Active milestone:** M2 — Launch Blocker Closure and Basic-Operable Release
**Active task:** M2-T3a — staging record-only Offerwall.GG callback containment
**Integration branch:** `build/legitloot-neon-synthwave` @ `c5525d0` at the start of this check
**Production branch:** `main` @ `3fa7ca5`; no production merge or deployment occurred
**Current review PRs:** #12 runbook (`9a1f136`), #14 staging origin isolation (`38715b4`), #15 account-deletion design (`e32c2fa`); older draft #9 remains open

## Current owner-locked operating rules

- Legit Coins (LC) are earned only through verified in-game milestones, weekly challenges, and seasonal events.
- The LegitLoot website wallet is authoritative. Games do not maintain spendable duplicate wallets.
- LC are not cash, withdrawable, transferable, pegged to USD, or issued by provider offerwall callbacks.
- The first public release remains the smallest complete, honest, basic-operable scope; do not expand the product before the core user journey works.
- Claude and ChatGPT may independently merge verified work into the integration branch and deploy reviewed changes to staging. Production merge/deploy, production settings/secrets/data, live financial activity, paid commitments, provider agreements, security weakening, destructive real-data changes, and irreversible legal/business decisions remain owner-gated.

## Current launch blockers and evidence

- **PROV-07:** production Offerwall.GG postback v3 and staging v7 remain active on the old LC-journaling routine. The record-only migration is in the build branch but is not applied to staging. Callback events/conversions/provider transactions were 0/0/0 in both projects at this check; no callback was invoked.
- **AUTH-02:** the last production Auth probe (12:18 UTC) reported `disable_signup:false`; the approved sign-up pause is not yet verified as applied.
- **AUTH-03:** PR #15 is a design only. The support address `hello@legitloot.site` is unverified; owner/legal decisions D1–D4 remain open before the related deletion policy is implemented.
- **LEGAL-01 / GAME-02 / OPS-01 / OPS-03:** accurate approved Terms/Privacy, verified support, playable-game versus early-access scope, monitoring, backup/PITR, and release/rollback readiness still need evidence.
- **GOV-01:** GitHub reports `protected:false` for `main`; no repository rulesets were returned. The branch-protection detail endpoint was inaccessible (403). Do not describe `main` as protected until verified.
- **ENV-06:** current `supabase-config.js` correctly targets staging; `admin.js` and `payout-simulator.js` have weaker environment-label-only guards that need exact staging URL checks and runtime tests. Review comment 7010372122 is on PR #14.

## Current verification status

- Claude's latest verifiable handoff (PR #12 comment, 12:27 UTC) reports 34/34 tests on #12, 37/37 on #14, and 34/34 on #15, with clean diff checks. These are local test reports, not GitHub CI; ChatGPT did not rerun the suite.
- Cloudflare Pages preview checks succeeded for the integration head and PR heads in both Pages projects. These prove static preview deployments only, not Supabase deployment or unit-test CI.
- The repository has no automated test workflow; the only workflow present is the older artwork-extraction workflow.
- No merge, deployment, Supabase setting/secret/schema/data change, callback invocation, reward issuance, or money movement occurred during this read-only check.

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

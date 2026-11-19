# LegitLoot project progress

**Updated:** 2026-11-19
**Branch:** `build/legitloot-neon-synthwave`
**Active milestone:** M1 — Launch Readiness Baseline and Blocker Plan (see `docs/MASTER_EXECUTION_CONTROL.md`)
**Baseline:** Stage 0 accepted by owner; rendered desktop/mobile capture deferred until browser access is available.

## Owner authorization and restrictions

The owner authorized public website visual design and the platform model/specification work on the isolated build branch. The 2026-11-10 owner-locked model is authoritative: LC is game-only; cash rewards are deferred; all supported earning-channel categories are in the long-term architecture, with provider/campaign activation gated by verified terms and approval. This does not authorize production deployment, paid services, provider agreements, live reward issuance, or money movement.

## Completed

- Stage 0 source audit, page/asset inventory, and source-level responsive review documented in `docs/WEBSITE_STAGE0_AUDIT.md` and `docs/ASSET_MANIFEST.md`.
- Owner accepted Stage 0 as substantially complete and deferred screenshots; they are not a blocker to visual design implementation.
- Added `docs/LEGITLOOT_CREATIVE_BIBLE.md` with owner-approved brand, visual, tone, Skuz, and product-truth rules.
- Reconciled `AGENTS.md`, `README.md`, `docs/CODEX_EXECUTION_CONSTITUTION.md`, `docs/PLATFORM_BUILD_SPEC.md`, `docs/BRAND_ART_DIRECTION.md`, and `docs/WEBSITE_CREATIVE_WORKFLOW.md` with the current creative decisions while retaining business and financial restrictions.
- Completed the Stage 1 visual blueprint in `docs/DESIGN_BLUEPRINT.md`, mapped to the existing static HTML/CSS system and the current site inventory.

## Active sequence

- Public visual system, homepage composition, original artwork briefs/continuity sheet, and visual treatment of all public routes are implemented.
- Source checks are complete and recorded below. Rendered desktop/mobile, browser accessibility, hero crop, and interactive-state checks remain deferred until browser access is available.
- The remaining authorized task is rendered review and any resulting visual corrections. Stop for owner approval at production release; no production action is included here.

## Current findings / limitations

- `assets/lootbadger.webp` is the supplied Skuz reference candidate (192×244). The new continuity sheet and homepage hero are original illustrations based on it.
- Official game artwork is available for all three approved games; no new game imagery is needed.
- No approved dashboard reference was found. Screenshots are explicitly deferred by the owner.
- Two public explainer routes currently overlap (`trust.html` and `how-it-works.html`). Keep both working and align their visuals; do not delete either route or invent content.
- Page behavior lives in `app.js` for shared navigation/year, `portal.js` for filters, `account-auth.js` for account state, `offerwall-launch.js` for the disabled provider placement, and other page-specific scripts. Functional IDs and backend integrations were preserved.
- Admin and payout simulator tools are out of the public visual-redesign scope.

## Verification record

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

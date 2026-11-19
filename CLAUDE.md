# CLAUDE — LEGITLOOT PROJECT ENTRYPOINT

You are an autonomous engineering partner for LegitLoot.

**Before doing any work, read `docs/MASTER_EXECUTION_CONTROL.md` in full.** It is the shared owner-authorized operating agreement for Claude and ChatGPT. It defines the current business priority, single active milestone, exact task assignment, agent-to-agent communication protocol, autonomy boundaries, critical escalation conditions, and append-only coordination log.

Then read:

1. `README.md`
2. `AGENTS.md`
3. `docs/PROJECT_PROGRESS.md`
4. `docs/CODEX_EXECUTION_CONSTITUTION.md`
5. `docs/PLATFORM_BUILD_SPEC.md`
6. `docs/LEGITLOOT_CREATIVE_BIBLE.md`
7. `docs/BRAND_ART_DIRECTION.md`
8. `docs/WEBSITE_CREATIVE_WORKFLOW.md`

## Current mandate

The owner has selected **launch LegitLoot** as the primary direction. Do not introduce project creep.

The current milestone and exact active task are defined only by `docs/MASTER_EXECUTION_CONTROL.md`. The M1 audit is historical and accepted with qualifications. The active milestone is now **M2 — Launch Blocker Closure and Basic-Operable Release**.

Current active task: **M2-T5 — Earn → Hustle public naming and launch-copy reconciliation**. Claude is active again; work from the latest dated assignment in `docs/MASTER_EXECUTION_CONTROL.md`. Create a separate feature branch from current integration, audit all public labels/navigation/page titles/homepage copy/tests/docs, and rename public Earn-facing language to Hustle without changing provider/technical identifiers or inventing routes. Correct any copy implying provider offers award LC: provider points remain separate from LC. Keep incomplete systems clearly labeled. Add regression tests and verify the preview. Do not implement Taplayad callbacks until signature, transaction identity, retry/reversal semantics and incentivized-traffic permission are verified.

Continue the supporting PR #12/#14/#15 review work and AUTH-03 design as recorded in the Master Execution Control. Do not wait for routine owner approval for independently reviewed integration merges or staging deployments; the owner has granted standing authority. If your own connector lacks staging write access, hand off the exact reviewed artifact to ChatGPT rather than asking the owner to relay permissions.

Production and business-critical gates remain unchanged.

## Collaboration with ChatGPT

ChatGPT is the architecture/risk reviewer, independent second set of eyes, and staging deployment operator where its connected access permits. Claude is the primary implementation lead for the active M2 milestone.

Both agents are authorized to:
- Review each other's findings and code.
- Assign bounded review or implementation tasks within the active milestone.
- Provide direct technical instructions and recommendations to one another.
- Update shared planning/progress documents.
- Resolve routine engineering questions autonomously using repository evidence and approved specifications.

Use `docs/MASTER_EXECUTION_CONTROL.md` as the shared communication channel. Read the latest log entries at session start. Append a dated entry at session end with findings, files changed, tests/evidence, blockers, and the exact next action. Never erase previous decisions or another agent's work.

Do not edit the same file concurrently. Inspect the latest branch/file state before writing. Use separate branches and reviewed PRs if simultaneous work risks conflicts.

## Standing integration and staging authority — owner direction 2026-11-19

Claude and ChatGPT are authorized to merge independently reviewed and verified work into `build/legitloot-neon-synthwave` and deploy to the staging environment without per-action owner approval. This includes documented staging-only migrations and reversible staging database changes within the active milestone. Confirm the exact staging project/ref, fail closed against production, run the relevant tests, preserve rollback options, and record the action in the shared coordination log. Do not wait for routine approval for these authorized actions. Production merge/deploy and production configuration/data changes, live financial activity/reward issuance, paid commitments, provider agreements, destructive real-data changes, security weakening, and irreversible legal/business decisions remain owner-gated.

## Critical owner escalations only

Stop the affected action and ask the owner only for the critical cases defined in `docs/MASTER_EXECUTION_CONTROL.md`: production deployment/merge, spending or paid services, provider agreements, live money/reward movement, destructive real-data changes, weakening security, changing LC economics, legally consequential commitments, or irreversible business decisions.

Do not interrupt the owner for routine engineering choices, read-only audits, documentation, tests, or reversible staging work already authorized.

## Production protection

Work only on `build/legitloot-neon-synthwave` unless the shared control document is explicitly updated. Do not merge to `main`, deploy production, alter production configuration, or move real funds. Never expose secrets.

**The goal is to finish the defined launch milestone—not to invent another roadmap.**


## Owner update — Taplayad is the selected initial Hustle publisher (2026-11-19)

The owner supplied authenticated Taplayad dashboard/documentation screenshots for Legitloot app ID 10066 and the offerwall template `https://offerwall.tplayad.com/10066/{user_id}`. Read the latest Taplayad section in `docs/MASTER_EXECUTION_CONTROL.md`, `docs/PROJECT_PROGRESS.md`, `docs/LAUNCH_READINESS_AUDIT.md`, and `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` before implementation.

Your next Hustle work must use Taplayad as the selected initial provider, while treating the dashboard Active badge as screenshot evidence only—not proof of incentivized-traffic approval, binding provider terms, settlement eligibility, or successful LegitLoot integration. The screenshot shows publisher-side `$1 = 1 points`; this must never map to LC, a USD peg, or user cash/withdrawal. Provider events must remain entirely separate from the authoritative LC wallet and ledger.

The screenshots show macros `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{country}`, `{user_ip}`, `{status}`, `{sig}`; describe `{sig}` as an MD5 signature and list source IP `176.97.212.58`. The complete signature formula, transaction identity, retry, and reversal semantics are not visible. Verify them from current provider documentation/support; do not guess. Implement authenticated opaque user attribution, signature verification, source-IP defense-in-depth, replay/duplicate protection, reversals, fail-closed behavior, and negative tests proving callbacks cannot touch LC.

Preferred smallest-launch integration is the embedded offerwall if current provider terms permit it. Build staging/test mode only. Do not save publisher settings, send test postbacks, activate live offers, accept terms, commit money, or change production. Escalate only the exact provider/legal/paid decision that requires the owner.

The owner requested more frequent coordination checks. Platform automation supports hourly as its maximum scheduled frequency; do not promise 10-minute polling. Check the shared control documents at the start/end of each active work session and immediately after meaningful implementation/handoff changes. Keep PRs and the coordination record current; no routine owner questions.


## 2026-11-19 10:20 ET — Sync Watch handoff: M2-T4, ENV-06, migration drift, Hustle

Read the latest dated debrief in `docs/MASTER_EXECUTION_CONTROL.md`, `docs/PROJECT_PROGRESS.md`, `docs/LAUNCH_READINESS_AUDIT.md` and `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` before starting.

### Current assignments
1. **ENV-06:** IMPLEMENTED in PR #16 (`claude/env-06-staging-guards`, reviewed at `db939d6`, no code-level blocker; not yet merged). Exact staging URL + label + publishable-key guards in `admin.js` and `payout-simulator.js`, tested in `tests/internal-pages-staging-guard.test.mjs`. Remaining: independent reproduction of `npm test` and merge by an authorized reviewer.
2. **MIG-02:** staging migration history includes `20261118080655_game_platform_foundation`, but the integration Git tree has no corresponding source migration. Recover the authoritative SQL from existing history/artifacts or perform a documented read-only schema reconstruction; compare every table, constraint, index, trigger and policy before committing the migration source. Do not apply it again or change staging schema/data.
3. **M2-T4:** staging game registry currently has only the unlisted Zombie Invasion Defense placeholder with no launch URL. The exact repositories/playable URLs for **Zombies vs Heavy Metal** and **Rocket 2 Nowhere** are still unknown. Do not substitute Aegis Rogue, Demonanic, Zombie Invasion Defense, Gauntlet's Survival or Harvest//Zero. The owner must supply the exact playable URL or source repo for each title; continue independent research but do not invent routes.
4. **Hustle/Taplayad:** public section still says Earn; rename public labels/navigation to **Hustle**. Taplayad app 10066 is owner-selected, but it is absent from `earn-providers.js`, staging `private.providers`, and Edge Function inventory. Build only a staging/test adapter and task history. Confirm the full signature formula, transaction identity, retries and reversal semantics from current provider docs/support before implementing callback verification. Do not guess. Provider events must never touch LC.
5. **Challenges/LC:** prepare at least five milestone/challenge definitions after the actual game event sources are known. Reuse only existing owner-approved LC values; do not invent economy values. Game events must be signed/server-verified and idempotent; website wallet remains authoritative.
6. **Support:** public pages still use `hello@legitloot.site`; owner selected `payouts@legitloot.site`, which remains UNVERIFIED. Do not represent either as a working monitored route until delivery/reply/monitoring evidence exists.
7. **Production risk:** production Offerwall.GG v3 still reaches an LC-posting SQL routine. Do not change production; production containment remains owner-gated.

### Evidence discipline
- Latest Claude-authored commit found by this audit is `5ab48bd` and latest verifiable Claude PR handoff is #12 comment `7009082911`; do not claim newer work without a commit, PR, comment, test output or deployment artifact.
- Current integration head at audit start was `7cf82ee`; all branches currently report unprotected. Only open PR is stale draft #9; #12/#15 are closed unmerged and #14 is merged.
- No GitHub Actions test workflow exists. Run `npm ci`, `npm test`, `node --check` for changed JS and `git diff --check` on your actual updated branch; report exact head SHA and results. Do not present old PR-head test counts as current.
- No production merge/deploy, provider agreement, paid commitment, callback, reward issuance, or irreversible legal/business action is authorized.


## 2026-11-19 — Sync Watch handoff update after independent PR #16 review

Read the latest debrief in the four shared control documents before acting.

### Current repository state
- Integration head: `66eff589`; 354 ahead / 0 behind main; 17 branches.
- PR #16 `ENV-06: exact staging guards` is open and mergeable at head `db939d6`, base `66eff58`. ChatGPT independently reviewed `admin.js:boot()`, `payout-simulator.js:boot()` and `tests/internal-pages-staging-guard.test.mjs`; no code-level blocker found in this limited diff. Review 5979524271 is COMMENT, not approval. Claude's PR body reports 42/42 local tests; there are no GitHub status checks or Actions runs, and ChatGPT did not independently execute the suite. Do not describe PR #16 as merged or deployed to production.
- Cloudflare bot posted successful preview deployments for `ace77a2c.legitloot-preview.pages.dev` and `5f40de67.legitloot.pages.dev`; these are preview URLs, not evidence of CI or production release.
- PR #9 remains an old draft; it is diverged and its browser tests still assert Zombie Invasion Defense as the homepage/game title. A review comment asks for refresh and correction.

### Updated work order
1. **MIG-02 first:** recover authoritative source for applied migration `20261118080655_game_platform_foundation`. Current staging history includes it, but no source file is present in integration tree. Read-only source/history/schema comparison only; do not apply/replay or change data.
2. **HUSTLE/Taplayad:** selected initial publisher is Taplayad app 10066. It remains absent from website registry, staging provider rows and Edge Functions. Build only after exact signature formula, transaction identity, retry/reversal semantics and incentivized-traffic permission are verified. Record-only task history; never touch LC.
3. Rename public Earn labels/navigation to **Hustle**. The public page currently says Earn and the registry contains Offerwall.GG/CPAGrip only.
4. Correct the homepage feature card: current `index.html` still shows Zombie Invasion Defense, while `games.html` correctly names Zombies vs Heavy Metal and Rocket 2 Nowhere. Update browser assertions to owner-approved titles, but do not invent playable routes.
5. Prepare at least five game milestone/challenge definitions using existing owner-approved LC values only; actual game event sources and URLs remain missing.
6. Add a GitHub Actions test workflow as a separate bounded change. Current PR previews are not CI.
7. Support address remains `payouts@legitloot.site`, not yet verified; public pages still show `hello@legitloot.site`.

### Environment constraints
- Production Offerwall.GG v3 SQL routine still posts LC; production containment remains owner-gated.
- Staging v8 is record-only. Staging Offerwall.GG provider row is disabled but still contains an LC standard-virtual-currency approved_reward_model with no verified approval/terms; reconcile before any activation, without bypassing owner gates.
- GitHub rulesets list is empty; direct branch-protection endpoint returns 403. Branch protection is unverified.
- Production merge/deploy, live financial/reward activity, paid commitments, provider agreements, destructive real-data changes, security weakening and irreversible legal/business decisions remain owner-gated.


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


## 2026-11-19 — MIG-02 read-only source export completed

ChatGPT retrieved the exact `statements[1]` for staging migration version `20261118080655` / `game_platform_foundation` and compared live staging columns, defaults, nullability, constraints, indexes, RLS, policies, triggers, grants and row counts. The catalog matches the recovered statement for the four game-platform tables. Evidence is committed at `docs/evidence/MIG-02_game_platform_foundation_recovery.md` on the integration branch. It is explicitly **DO NOT APPLY** and remains outside `supabase/migrations/`.

Next: use this evidence to restore the canonical migration source in a separate reviewed code change and add regression tests. Do not replay the migration or change staging schema/data. The source seeds only the Zombie Invasion Defense development placeholder; do not treat it as either owner-selected launch game. The migration creates no `updated_at` triggers.


## 2026-11-19 — Latest PR/MIG-02 handoff

- PR #17 head `6aa37d4`: the submitted-patch whitespace check is fixed; GitHub Actions run `44572686596` passed `npm ci`, `npm test` (38/38), and the new whitespace step. Review 5979706554 records no remaining workflow defect in this limited diff. PR remains open and unmerged.
- PR #16 head `e11fd81`: exact staging guards are present and Claude reports 42/42, but no Actions run covers the new guard tests. Integration advanced to `becd068`; PR #16 needs refresh and another 42-test run.
- MIG-02 source has been recovered from staging migration history and catalog-compared. Read `docs/evidence/MIG-02_game_platform_foundation_recovery.md`; it is **DO NOT APPLY** evidence, not the canonical migration. Create the canonical migration source and regression tests in a separate reviewed change; do not replay or alter staging.
- Current integration handoff and owner gates remain in the four shared control documents. No production changes, callbacks, schema/data changes or provider activation are authorized.


## 2026-11-19 — Current handoff status

- Integration head: `1c3bbd2`.
- PR #16 head `39b494c`: Claude reports 42/42 plus both syntax checks and diff check; no GitHub Actions run covers its new tests. It is based on `becd068` and needs one refresh to current integration.
- PR #17 head `6aa37d4`: corrected CI workflow; Actions run `44572686596` passed 38/38 and the actual submitted-patch whitespace check. It is based on `04e5f46` and needs one refresh to current integration. The 38 tests do not include PR #16's guard tests.
- MIG-02 source evidence is at `docs/evidence/MIG-02_game_platform_foundation_recovery.md`. Claude's comment says it is starting a separate branch, but no branch/commit/PR was visible at the latest check. When created, compare the evidence to source, add canonical migration and regression tests; never reapply or alter staging schema/data.
- Keep Taplayad record-only and outside LC; no provider terms or live activation without owner approval. Keep production, financial, legal and release gates unchanged.


## 2026-11-19 — Claude handoff: PR #19 combined test candidate and current blockers

Read the latest shared debrief in docs/MASTER_EXECUTION_CONTROL.md, docs/PROJECT_PROGRESS.md, docs/LAUNCH_READINESS_AUDIT.md, and docs/ENVIRONMENT_SOURCE_OF_TRUTH.md before acting.

### Verifiable latest work
- Claude created PR #19 / branch claude/combined-merge-candidate at 8795409, explicitly marked DRAFT — CI candidate only / Not for merge. It combines PR #16 ENV-06, PR #17 CI workflow, and PR #18 MIG-02 source/tests.
- GitHub Actions run 44583018543 passed 50/50, 0 failed, 0 skipped, plus npm ci and submitted-patch git diff --check. Keep PR #19 draft-only; it is evidence, not approval to merge.
- PR #17 individual run 44574267498 passed 38/38. PR #16 and #18 individual heads have no Actions run; the combined PR #19 run is the independent suite evidence.
- Staging PROV-07 is already contained: migration 20261119145340_offerwall_gg_record_only applied, postback function v8 active, source matches integration, live routine record-only. Do not reapply migrations or invoke callbacks. Production v3 still posts to the LC journal; production containment remains owner-gated.

### Immediate implementation/review tasks
1. Refresh PRs/branches against the integration head after the latest coordination-doc update; do not merge anything autonomously.
2. Fix public LC copy: index.html currently lists “Complete offers (Planned)” inside LC earning steps. Remove it from the LC sequence; provider tasks never award LC.
3. Reconcile the homepage's Zombie Invasion Defense feature card with the two approved launch titles, and keep games.html routes unpublished until the actual playable URLs/repos for Zombies vs Heavy Metal and Rocket 2 Nowhere are verified.
4. Rename public Earn labels/navigation to Hustle. Taplayad app 10066 is the selected initial publisher but is not yet in the frontend registry, staging provider table, or Edge Function inventory.
5. Taplayad security blocker: current official docs (https://tplayad.com/docs) say signature = md5(app_id . user_id . api_secret), status 1 credit / 2 reversal, IP 176.97.212.58. The signature does not cover offer_id/reward/payout/status; the macros list no unique transaction ID. Do not implement live postback crediting or claim robust transaction/reversal idempotency until provider supplies a signed transaction ID/payload or authoritative verification API. Use a non-guessable opaque publisher user ID server-generated from the authenticated user; never pass email or trust a client-supplied ID.
6. Owner-supplied wall URL https://offerwall.tplayad.com/10066/{user_id} differs from current official iframe https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}; confirm route with provider before embedding. Do not save dashboard settings or accept terms.
7. Offerwall.GG staging provider row is disabled but retains stale LC reward-model metadata; flag for a separately authorized cleanup before any activation. No provider event may touch LC.
8. Build at least five challenges/milestones and the server-verified game-event -> authoritative website wallet path, using existing approved LC economics only.

### Owner gates — unchanged
No production merge/deploy, production setting/secret changes, real callbacks, live financial activity, paid commitments, provider terms/agreements or live activation, destructive real-data changes, security weakening, legal/business commitments, or final production release. Production Offerwall containment, branch protection, publisher permission, support-mailbox verification, registration pause verification, and final release remain owner-controlled. Do not claim a game source/route is known without a real repo/URL artifact.


## 2026-11-19 14:42 ET — Claude handoff: PR #20 public-copy follow-up

Read the latest debrief in the four shared control documents before further work.

### Verifiable latest Claude work
- Claude-authored PR #20 commits `4a0db7a` and `04e4016`, branch `claude/hustle-rename`, update public navigation, `earn.html` title/description/accessibility labels to Hustle; remove “Complete offers” from homepage LC steps; replace the Zombie Invasion Defense homepage card with the two owner-approved launch titles without inventing playable URLs; add four Node tests.
- GitHub Actions run [44591660747](https://github.com/demonanic/LegitLoot/actions/runs/44591660747) passed 54/54 Node tests, zero skips, and patch whitespace check. The current workflow runs only `npm test` / `tests/*.test.mjs`; Python/Playwright browser tests are not run in CI.
- PR #20 has successful Cloudflare branch-preview bot comments for both Pages projects. The PR branch config explicitly targets staging.
- PR #20 is 2 commits ahead / 2 behind integration head `3fa518ee`. Review comment [7020270626](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7020270626) is outstanding; do not merge before it is addressed and CI reruns.
- PR #16, #17 and #18 were merged into integration only. PR #19 was closed unmerged. PR #9 remains a stale draft, 12 ahead / 166 behind.

### Required PR #20 follow-up
1. In `earn-hub.js`, change the user-visible summary “No earning provider is open…” to Hustle terminology. Keep internal identifiers (`earn-hub-summary`, filenames, provider keys, `earn.html` route) unchanged.
2. Add a Node test in `tests/hustle-public-copy.test.mjs` for the summary copy. Updating `tests/earn-hub.browser.py` alone is insufficient because CI does not run it.
3. Replace homepage LC step 3 “Uses announced later” with a clear accurate step for weekly challenges and seasonal events. Add regression coverage that LC steps reflect only approved sources.
4. Reword Hustle fine print to avoid implying LegitLoot user cash earnings/settlement. State clearly that provider activity does not credit LC or create a LegitLoot cash payout/wallet credit; provider terms remain provider-side.
5. Sync the branch to integration `3fa518ee`, rerun the GitHub Actions workflow, and post verifiable evidence.

### Do not cross these gates
- Production Offerwall.GG v3 still calls `private.post_journal_transaction`; production provider-to-LC issuance remains a critical owner-gated violation. Do not modify production.
- Staging Offerwall.GG v8 is record-only and matches integration exactly. Do not reapply migrations or invoke callbacks.
- Staging Offerwall.GG provider row is disabled but has stale LC/LootCoins reward-model metadata with no terms/approval references. Do not alter provider records without separate authorization.
- Taplayad remains selected but absent from staging; no live callback implementation until provider supplies signed transaction fields/unique transaction and reversal references and owner-specific incentivized-traffic permission is verified.
- No merge to main, production deploy, settings/secrets changes, schema/data mutations, live callback, payment, provider agreement, legal commitment, or final launch without owner approval.

## 2026-11-19 15:23 America/New_York — Claude handoff correction and next tasks

The active integration branch is build/legitloot-neon-synthwave at 04ff43e3b9691e3acbdd9e6c9356530b9d61ec69, not 3fa518e. PR #20 head is 20a82038f1da4d50665bdb7c32eb69bb4f41ea18; Actions run 44601788773 confirms 57/57 Node tests passed. PR #20 is 5 commits behind current integration and must sync to 04ff43e, then rerun CI.

Next tasks:
1. Address review comment https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7021287292: make homepage LC meta description/headline explicitly limited to verified in-game milestones, weekly challenges and seasonal events; consider changing generic “Play games” to verified milestone wording; add regression assertions.
2. Verify Offerwall.GG exact case-sensitive currencyName from current provider documentation or existing authorized configuration evidence. Repo guide says “Loot coins”; staging handler line 82 requires “Loot Coins”. Align staging handler/docs/test only after verification. No callback or publisher setting change.
3. Keep PR #20 unmerged until sync and independent review. Current CI runs npm tests only; the Python/Playwright browser suite remains unexecuted and must not be reported as passed.
4. Continue Taplayad only as record-only staging design. No live callback until payload-bound transaction authentication, unique transaction ID/reversal references and account-specific incentivized-traffic permission are evidenced.
5. Do not change production Offerwall.GG: production v3 and its SQL routine still permit provider-to-LC journal issuance. Production containment remains owner-gated.

Production containment/deployment, main branch protection, provider agreements/live activation, paid commitments, destructive data changes, legal/business approval and final launch remain owner-controlled. Do not change Supabase settings/secrets/schema/data or invoke callbacks.

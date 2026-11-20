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

Current active task: **M2-T4 — integrate Zombies vs Heavy Metal and Rocket 2 Nowhere**. Both owner-selected titles now have playable early-access candidate routes: ZVHM is live on production; RXT2 is preview-only. The owner-supplied RXT2 prototype is a single HTML file, not a separate source repository. PR #22 head `332ca07` adds the integration candidate and ports the ZVHM route; Actions run `44661225287` passes 64/64, and independent COMMENT review `5986626725` found no blocker in the scoped game diff. It is 2 ahead / 0 behind PR #20 head `6e2e51b`. PR #23 head `33a5240` is a draft production publish; its Cloudflare preview and embedded RXT2 start screen passed read-only browser QA, but it has no Actions run and must not be merged without explicit owner approval. The RXT2 build is device-save only and has no account, wallet, or LC code. Staging still has no shared save/event/challenge integration.

PR #20 remains open at head `6e2e51b`, based on integration `387d035`, with Actions run `44661202504` passing 58/58. Claude synced it once and preserved the staging-only/fail-closed auth guard. At the start of the 2026-11-19 22:39 ET check, integration was `7b240b2`; this run added documentation-only coordination records. Read the latest Master Control entry for the current branch head. PR #20's 15-file application diff is unchanged; do not sync again until an owner-approved integration disposition. PR #22 is stacked on PR #20.

**Preview isolation blocker:** PR #23 and #24 are Cloudflare `preview` deployments, but both inherit main's `account-auth.js`, which hardcodes the production Supabase project and exposes sign-up. The preview environment and empty Pages env vars do not change that browser target. Do not use Account/auth flows on those previews until a separate owner-approved PR adds a preview-host fail-closed guard or staging-only configuration. PR #23 discussion comment `7028436334` keeps the games-only PR unchanged and treats the guard as a separate owner decision. PR #22 is different: its `account-auth.js` uses exact staging configuration and fails closed.

**Offerwall containment:** production Offerwall.GG v3 remains ACTIVE with `verify_jwt=false`; the deployed callback still calls a SECURITY DEFINER routine that posts LC through `private.post_journal_transaction`. The provider row is disabled but retains LC metadata and has no approval/terms evidence. PR #24 remains draft and undeployed at head `fb2e890`. Its pure handler is isolated in `handler.ts`; only `index.ts` starts `Deno.serve`. The Deno workflow is added, local Node smoke passed 3/3, but no Actions run has surfaced and Deno tests remain unverified. Separate owner approval is required before production grant revocation or function deployment.

**Taplayad:** use the owner-supplied App ID 10066 template `https://offerwall.tplayad.com/10066/{user_id}`. Current public docs and legacy docs have conflicting signature formulas and transaction identifiers; no complete app-10066 authentication/reversal contract or incentivized-traffic permission is verified. Keep it unintegrated/record-only; never map publisher points, `{reward}`, or `{payout}` to LC or cash.

PR #12, #14, and #15 are historical workstreams; do not reopen them unless new evidence requires it. Continue only the current M2-T4 task and the supporting launch blockers listed in Master Control.

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

The active integration branch and current head are defined by `docs/MASTER_EXECUTION_CONTROL.md`; at the 2026-11-19 22:39 ET check it was `7b240b2`. PR #20 remains head `6e2e51b` on base `387d035`, eight documentation-only commits behind current integration. Do not sync again until an owner-approved integration disposition.

Next tasks:
1. Address review comment https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7021287292: make homepage LC meta description/headline explicitly limited to verified in-game milestones, weekly challenges and seasonal events; consider changing generic “Play games” to verified milestone wording; add regression assertions.
2. Verify Offerwall.GG exact case-sensitive currencyName from current provider documentation or existing authorized configuration evidence. Repo guide says “Loot coins”; staging handler line 82 requires “Loot Coins”. Align staging handler/docs/test only after verification. No callback or publisher setting change.
3. Keep PR #20 unmerged until sync and independent review. Current CI runs npm tests only; the Python/Playwright browser suite remains unexecuted and must not be reported as passed.
4. Continue Taplayad only as record-only staging design. No live callback until payload-bound transaction authentication, unique transaction ID/reversal references and account-specific incentivized-traffic permission are evidenced.
5. Do not change production Offerwall.GG: production v3 and its SQL routine still permit provider-to-LC journal issuance. Production containment remains owner-gated.

Production containment/deployment, main branch protection, provider agreements/live activation, paid commitments, destructive data changes, legal/business approval and final launch remain owner-controlled. Do not change Supabase settings/secrets/schema/data or invoke callbacks.


## 2026-11-19 16:54 America/New_York — Sync Watch handoff: M2-T4 authority, PR #20 review, Taplayad new/legacy protocol split

Read the latest Master Execution Control entry and all four working records before acting.

### Current active task
- M2-T4 is active: identify and integrate the exact playable/source builds for Zombies vs Heavy Metal and Rocket 2 Nowhere. ChatGPT is acting lead per Master Execution Control. Exact-title GitHub repository searches returned no matches; do not substitute unrelated projects or invent URLs. The owner must provide the exact source repo/playable URL for each title if no connected source reveals them.
- M2-T5 public Earn-to-Hustle copy reconciliation is now a supporting PR candidate, not the active milestone. PR #20 is open at head ad21bbe, base integration 3db61c0, mergeable and synchronized at audit time. Its 15-file diff is limited to public labels/copy and tests. Actions run 44609090382 passed the workflow's install, Node test and patch-whitespace steps. Claude reports 58/58 local; the exact Actions test count was not independently retrieved. Python/Playwright remains outside CI.
- ChatGPT's formal PR COMMENT review is ID 5984053898: no blocking defect in the scoped diff. It is not an APPROVE review. No merge occurred. The coordination-document updates advance integration; PR #20 must sync to the latest integration HEAD and rerun CI before final owner review.

### New Taplayad integration finding — do not guess the account protocol
The official public docs now expose two separate systems:
- New/current docs: https://tplayad.com/docs. The macro names match the owner's screenshots. Signature is md5(app_id . user_id . api_secret); no transaction-ID macro is listed; the example dedupe key is offer_id + user_id. The signature does not bind reward, payout, offer ID or status.
- Legacy docs: https://www.tplayad.com/doc/postback. It lists subId, transId (unique), reward, payout, status, campaign_id, uuid, and signature md5(subId . transId . reward . secret); it documents retries and OK/DUP. Status is still outside the signature.
- The new docs link separate new and old dashboard systems. Owner URL https://offerwall.tplayad.com/10066/{user_id} differs from the new iframe https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}. The screenshot macros resemble the new system, but App ID 10066's account generation and URL alias are not confirmed.
- Obtain written account-specific confirmation of system/version, wall URL, signed fields, stable transaction ID, reversal semantics, retries/idempotency, and authoritative transaction verification. No live callback code until this is resolved. Keep any permitted staging work record-only and never issue LC from provider events.
- Terms updated 2026-10-29 require 18+, prohibit fraud, make publisher payments subject to dashboard terms and include indemnification; they do not establish account-specific approval for LegitLoot's exact use. No agreement accepted.

### Fresh environment state
- Production Offerwall.GG v3 remains ACTIVE (verify_jwt=false) and live private.process_offerwall_gg_postback calls private.post_journal_transaction: critical owner-gated LC-policy violation.
- Staging Offerwall.GG v8 is ACTIVE (verify_jwt=false) and record-only. Deployed source exactly matches integration (6,990 bytes). Staging provider row is disabled but stale LC/LootCoins metadata and null terms/approval remain; Taplayad absent.
- PR #20's config matches integration and targets staging. Cloudflare reports successful branch previews in both Pages projects; dashboard-level bindings are unverified.
- Offerwall.GG currencyName casing remains unresolved: internal guide says Loot coins; staging handler requires Loot Coins; public docs call the name publisher-defined. Confirm the actual placement value before any source/doc/test change.

### Next actions and boundaries
1. Sync PR #20 after the new integration docs commit and rerun CI; ask ChatGPT for independent re-review before any integration merge.
2. Continue M2-T4 source discovery; no guessed game URLs.
3. Keep Taplayad record-only until the exact account protocol and permission are confirmed.
4. No production containment, production merge/deploy, setting/secret change, schema/data mutation, live callback, payment, provider agreement, security weakening or legal/business commitment without the existing owner gate.


## 2026-11-19 17:42 ET — Sync Watch handoff

- PR #20 is independently reviewed at current head `8cee6f7` against integration `a0cef5e`; compare is 9 ahead / 0 behind, GitHub reports mergeable. Actions run 44624595265 passed `npm ci`, `npm test` (58/58) and submitted-patch whitespace check. ChatGPT COMMENT review ID 5984643477 found no blocking defect in the scoped 15-file public-copy change. **Do not merge**; owner review is next.
- PR #9 remains draft/non-mergeable, 12 ahead / 184 behind. Do not merge or revive without a fresh scope review.
- M2-T4 remains the active task and ChatGPT the acting lead. Read-only search covered all seven accessible owner repositories; no exact source repo or playable URL for Zombies vs Heavy Metal or Rocket 2 Nowhere was found. Do not substitute Demonanic, Gauntlet's Survival, Harvest//Zero or Zombie Invasion Defense. Staging registry still has only unlisted ZID development placeholder; saves/events/handoff tickets are zero and no challenge tables exist.
- Current production Offerwall.GG v3 still calls journal posting and can issue LC; production containment is owner-gated. Staging v8 is record-only. Staging provider metadata still contains disabled Offerwall.GG with stale LC model; Taplayad absent.
- Taplayad remains record-only design until account 10066's exact protocol, wall URL, signed transaction fields, unique transaction identity, reversal/retry semantics and incentivized-traffic permission are confirmed. Never map publisher points/callback reward to LC.
- Documentation consistency was corrected: Creative Bible now names the two owner-locked portal launch games; Platform Build Spec §1 points to §0.4. No application code, provider configuration, database or deployment changed in this audit.
- Next: preserve PR #20 for owner review; ChatGPT continues M2-T4 only when exact game source/playable references are available. No substitute routes, production action, callback or provider agreement.


## 2026-11-19 18:21 ET — Sync Watch handoff: PR #20 stable; M2-T4 and financial blockers remain

- Current integration is `affb6f54cdc98b17334021dd9d2d00ff6106d7d5`; main is `3fa7ca5`, integration 402 ahead / 0 behind. 21 branches; all report `protected=false`.
- PR #20 is open, non-draft, mergeable, head `2081d0f`, base `affb6f5`, 12 ahead / 0 behind. Actions run `44632297288` passed 58/58 Node tests, 0 failures, 0 skips, plus whitespace check. Independent COMMENT review `5984698005` found no blocking issue. This is ready for owner review for integration only; no merge/deploy is authorized.
- Cloudflare confirms successful preview deployments on the PR head in both Pages projects; both are `environment=preview`. The canonical `legitloot.site` production deployment remains `main` / `3fa7ca5`. Checked-in Supabase config targets staging.
- PR #9 is a stale draft, 12 ahead / 193 behind; do not merge as-is.
- M2-T4 remains active; ChatGPT is acting lead. Staging has only an unlisted ZID development placeholder, no launch URL, zero saves/events/handoff tickets, and no challenge/milestone/season tables. Exact source/playable references for Zombies vs Heavy Metal and Rocket 2 Nowhere remain required; do not substitute games.
- Production Offerwall.GG v3 remains ACTIVE and its SECURITY DEFINER routine calls `private.post_journal_transaction`, so provider-to-LC issuance is still possible. Staging v8 is record-only. Staging provider metadata retains disabled Offerwall.GG with stale LC/LootCoins reward metadata and no terms/approval evidence; CPAGrip disabled; Taplayad absent.
- Taplayad App ID 10066 protocol/account generation, URL alias, signed transaction fields, unique transaction ID, reversal/retry semantics, verification method and incentivized-traffic permission remain unconfirmed. Keep staging record-only; never map publisher points/reward/payout to LC.
- No new Claude implementation or handoff after PR #20 comment `7024420349` was found. No PR merge, deploy, Supabase/Cloudflare settings or secret change, callback, provider agreement, payment, schema/data mutation or production action occurred.
- Next: owner reviews PR #20; Claude should only resync if integration advances again. Continue M2-T4 without inventing routes. Production containment, branch protection, provider terms/activation and final launch remain owner-gated.


---

## Sync Watch handoff — 2026-11-19 19:41 ET

### New verified state
- Owner specifically authorized PR #21 on 2026-11-19 to publish **Zombies vs Heavy Metal** after checks. PR #21 merged as `4e0f533` to `main`; Cloudflare `legitloot` production deployment succeeded on `https://legitloot.site`. This is a narrow past authorization, not blanket production permission.
- Independent browser check: homepage, Games page, ZVHM play page and direct game URL all HTTP 200; actual game canvas/tutorial/HUD rendered; no page errors or horizontal overflow at desktop/390px mobile. The game is device-save only; no LegitLoot account or LC connection yet. No buttons were pressed or progress saved.
- Source: `demonanic/Legitloot-2`; latest observed game commit `fcf4000`. No GitHub Actions runs/statuses returned for PR #21 or game commit. Do not claim automated CI passed.
- Rocket 2 Nowhere remains unlocated and not playable. Do not substitute.
- Main is `4e0f533`; integration is `907f1a6`, 404 ahead / 2 behind. Integration still has the old ZID card and lacks `zombies-vs-heavy-metal.html`. Port PR #21's four public files to integration in a separate integration-only change; preserve the early-access/device-save/no-account/no-LC disclosure. Do not merge/deploy to main.
- PR #20 head `7912edd` is 13 ahead / 1 behind current integration. Actions `44637573706` passed 58/58 Node tests, 0 failures, whitespace check. Sync once to `907f1a6`, rerun CI, then stop. Its account/Supabase config is staging-only; it is not production-ready.
- Production main still has prohibited legacy copy: homepage says offers planned; rewards page says Offerwall.GG completions award LC and describes cash/withdrawals; account page shows cash wallet and withdrawal fields. Production `account-auth.js` hardcodes production Supabase and implements signup; `get_wallet_summary()` returns cash and LC. Terms and Privacy explicitly say they are incomplete and warn users not to submit personal data. Do not change production auth, wallet, legal pages or sign-up status without owner approval; raise the decision whether sign-ups should be paused pending approved legal docs and LC-only wallet.
- Production Offerwall.GG v3 remains active and can call a SECURITY DEFINER journal-posting routine. Provider registry row is disabled, but the function does not check provider status. This is a critical owner-gated financial blocker.
- Staging postback v8 is record-only. Staging wall-url v5 CORS includes `https://legitloot.site`; review this cross-environment allow-list before production integration.
- Taplayad App ID 10066 remains record-only until account protocol, canonical URL, signed transaction identity, reversal/retry semantics and incentivized-traffic permission are confirmed. Never map publisher points/reward/payout to LC.
- No Supabase/Cloudflare changes, secret changes, schema/data mutations, callbacks, payments, provider agreements or new production action occurred in this audit.

### Next authorized engineering work
1. Sync PR #20 once and rerun CI; do not merge to main.
2. Port PR #21 public-page change into integration only.
3. Continue locating Rocket 2 Nowhere source.
4. Prepare an owner decision brief for production sign-up/legal mismatch and Offerwall.GG containment; do not execute.
5. Review staging CORS allow-list; do not alter settings.


---

## Sync Watch handoff — 2026-11-19 20:10 ET

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


### Post-debrief branch note — 2026-11-19 20:12 ET
- Integration advanced from `fd758a7` to `4e2a1f6` through the documentation-only Sync Watch commit. PR #20 remains head `c6dc85b`, base `fd758a7`, 14 ahead / 1 behind; the only incoming commit is this dated coordination record. The 15-file application/test diff is unchanged and its current-head Actions run remains green. Do not request another Claude sync solely for this documentation-only debrief; re-evaluate if application code or a material base change arrives.
- No merge or deployment was performed.


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


## 2026-11-19 21:29 ET — Sync Watch handoff update

- Current game artifacts: PR #22 (integration candidate, 64/64 CI, COMMENT review only) and PR #23 (draft production publish, preview browser pass, no CI, owner approval required). RXT2 is preview-only; production remains ZVHM only.
- PR #23/#24 preview Account pages inherit main's production Supabase target. Do not use account flows on these previews until guarded; comments are on both PRs.
- PR #24 needs a pure handler module because tests import the entrypoint that starts `Deno.serve`. Deno tests are still unrun.
- Live production Offerwall.GG v3 still posts LC through the SECURITY DEFINER RPC; provider disabled status is not checked. Staging callback is record-only. No callbacks or writes occurred.
- Taplayad current/legacy docs disagree on signature and transaction identity; incentivized-traffic permission remains unverified. Keep App ID 10066 unintegrated and record-only.
- Immediate task: sync PR #20 to integration head `387d035`, rerun CI, fix PR #24's test import side effect, and make all previews fail closed against production. Do not merge or deploy production without owner approval.
- No PR merge, deployment, settings/secret/schema/data change, provider agreement, callback, payment, reward issuance, or money movement occurred.


## 2026-11-19 21:32 ET — Post-debrief Claude sync verification

- Claude responded to the PR #20 sync request with verifiable PR comment `7028471600`: PR #20 is now head `6e2e51b`, based on integration `387d035`; the staging-only/fail-closed auth guard was preserved. GitHub Actions run `44661202504` passed 58/58 tests, 0 failures/skips.
- Claude also updated the stacked PR #22 to head `332ca07`, based on PR #20 head `6e2e51b`. GitHub Actions run `44661225287` passed 64/64 tests, 0 failures/skips. The PR #22 branch is 2 commits ahead / 0 behind its PR #20 base.
- The integration branch was at `6417323` immediately before this correction; it contains six documentation-only commits after `387d035`. PR #20 is therefore six documentation-only commits behind the integration head at this point. This correction is another documentation-only commit. No further sync request is made in this run to avoid repeated sync churn.
- PR #20 and #22 remain open/unmerged. PR #23 and #24 remain draft, preview-only, with the previously recorded preview-isolation and PR #24 Deno-test blockers. No merge or deployment occurred.


## 2026-11-19 21:33 ET — Preview-auth owner decision

Keep PR #23 game-only. Its Account page inherits production-targeting auth from `main`; the preview environment does not override that hard-coded URL. A separate owner-approved PR is required to add a preview-host fail-closed guard while preserving production behavior. Until that is authorized and verified, do not use Account/auth routes on PR #23/#24 previews. PR #22 remains staging-only.

## 2026-11-19 22:39 ET — Sync Watch handoff

- Integration is now `7b240b2`; production `main` remains `4e0f533`. PR #20 is still head `6e2e51b` on base `387d035`, eight documentation-only commits behind integration; its application diff is unchanged and Actions run `44661202504` passed 58/58. Do not sync again until an owner-approved integration disposition.
- PR #22 is head `332ca07`, stacked on PR #20, 2 ahead / 0 behind; Actions run `44661225287` passed 64/64. RXT2 is static, device-save only, and has no account/wallet/LC/provider path. Both game candidates remain early access; ZVHM is live and RXT2 preview-only.
- PR #23 remains a draft main-based publish with no CI. PR #24 remains a draft containment candidate; its tests still import the entrypoint that starts `Deno.serve`, and no Deno test result is verified. Main-based PR #23/#24 previews still target production Supabase from inherited `account-auth.js`; do not use their Account/auth routes. A separate owner-approved preview guard PR is required.
- Live production Offerwall.GG v3 still has a service-role SECURITY DEFINER journal-posting path despite the provider row being disabled. Staging v8 is record-only. Staging wall-url CORS still includes the production origin. Staging wallet RPC still returns cash fields and labels gameCredits as `LLC`; the UI ignores cash but the backend contract needs correction.
- Taplayad App 10066 remains unintegrated. Current and legacy official docs conflict on wall URL, callback macros, signature inputs, transaction identity, status binding and retry/response semantics. No App-specific written permission or complete protocol is verified. Keep record-only; never map publisher points or callback reward/payout to LC.
- No code implementation or fix was made by this Sync Watch. No merge, deploy, Supabase/Cloudflare setting or secret change, schema/data/grant change, callback, provider agreement, payment, reward issuance or money movement occurred.


## 2026-11-19 22:51 ET — PR #24 pure-handler testability fix prepared (NOT DEPLOYED)

- PR #24 remains draft on `main`; candidate head is now `fb2e890`. The original test-import side effect is fixed in the PR branch: new `handler.ts` contains only the inert HTTP 410 handler; `index.ts` alone imports it and starts `Deno.serve`; `index_test.ts` imports the pure handler and checks GET/POST/OPTIONS, `410`, `no-store`, and that POST bodies remain unread.
- Added `.github/workflows/offerwall-gg-containment-tests.yml` to run the Deno test file. No GitHub Actions run has surfaced for the new head yet, so the Deno suite is **not verified**. A local Node 22.16 smoke test against the actual handler passed 3/3 methods; this is not a Deno test result.
- PR comment `7029857955` records the fix and exact test limitation. The endpoint remains inert; no Supabase function was deployed, no SQL grants/settings/secrets/schema/data changed, and no callback was invoked.
- PR #24's separate preview-auth issue remains: its main-based preview inherits production-targeting `account-auth.js`. Do not use Account/auth routes. Production containment still requires separate owner approval.

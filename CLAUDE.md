# CLAUDE — LEGITLOOT PROJECT ENTRYPOINT

You are an autonomous engineering partner for LegitLoot.

**Before doing any work, read `docs/MASTER_EXECUTION_CONTROL.md` in full.** It is the shared owner-authorized operating agreement for Claude and ChatGPT. It defines the current business priority, single active milestone, exact task assignment, agent-to-agent communication protocol, autonomy boundaries, critical escalation conditions, and append-only coordination log.

Then read:

1. `README.md`
2. `AGENTS.md`
3. `docs/AGENT_OPERATING_CHARTER.md` — standing role and handoff agreement.
4. `docs/PROJECT_PROGRESS.md`
4. `docs/CODEX_EXECUTION_CONSTITUTION.md`
5. `docs/PLATFORM_BUILD_SPEC.md`
6. `docs/LEGITLOOT_CREATIVE_BIBLE.md`
7. `docs/BRAND_ART_DIRECTION.md`
8. `docs/WEBSITE_CREATIVE_WORKFLOW.md`

## Current mandate

The owner has selected **launch LegitLoot** as the primary direction. Do not introduce project creep.

The current milestone and exact active task are defined only by `docs/MASTER_EXECUTION_CONTROL.md`. The M1 audit is historical and accepted with qualifications. The active milestone is now **M2 — Launch Blocker Closure and Basic-Operable Release**.

Current active task: **M2-T4 — integrate Zombies vs Heavy Metal and Rocket 2 Nowhere** (per MASTER_EXECUTION_CONTROL.md). The owner has also asked Sync Watch to keep Offerwall.GG containment/source alignment as the critical launch/security focus within M2; this does not change the active task assignment.

**Verified repository state — 2026-11-21 02:35 ET (Sync Watch #25):** production main@801f3e7; integration 1466eb6. PR #30 remains draft at exact head 37763d8 (58 files / 85 commits; base 1466eb6). Exact-head Node/whitespace Actions 44873409564 and Deno Actions 44873409629 pass; Claude reports 86/86 local tests, not independently rerun by DaVinci; browser test remains unrun. Eight older review threads are resolved; no formal approval exists. Both PR #30 Cloudflare previews for exact 37763d8 succeeded as environment=preview and candidate supabase-config.js pins staging. PR #27 docs branch is 6db6b04; exact-head Actions 44875190144 passed and both Pages previews succeeded. PR #28 ENV-07 guard remains 93f62ac; Actions 44791797759 passed; scoped owner review only. Nine PRs remain open; all 31 branches report protected:false and repository rulesets are empty. The separate main-based preview main.legitloot-preview.pages.dev remains environment=preview from main@801f3e7 and its Account/auth code targets production Supabase; keep those routes off-limits. Candidate Account sign-in/reset and wallet view remain paused while Terms/Privacy are drafts. Both live wallet RPCs still return cash/USD; production wallet-summary v4 remains cash/legacy-LLC-bearing. Both environments have zero journal entries/transactions. Staging has one legacy unlisted game-registry placeholder and zero events/saves/handoff tickets; neither selected game is registered. Taplayad remains pending. The latest Sync Watch #25 record in Master Control contains exact evidence, new review notes, and the release-runbook side-branch warning.

**Games:** Both owner-selected games are LIVE on legitloot.site as early access with device-local saves and no account/LC connection. Zombies vs Heavy Metal is `demonanic/Legitloot-2` (owner-approved; the earlier exclusion finding was withdrawn, comment 7041463948); Rocket 2 Nowhere is the in-repo build. Remaining under M2-T4: authenticated game handoff, cloud saves and server-verifiable event hooks. M2-T4b-R1 is accepted as a design only: no generic event endpoint, browser-submitted events are `client_reported_telemetry` and never LC-eligible, handoff tickets/verified-tier idempotency keys are server-issued, and one game's hook is piloted first. Staging registry rows, if any, stay `status=development`, `is_listed=false`, `launch_url=null`. **ENV-07:** main-based previews (e.g. `main.legitloot-preview.pages.dev`) still inherit production-targeting `account-auth.js`; do not use Account/auth there. PR #28 is the prepared fix.

**Offerwall.GG:** production wall-url v2 and postback v4 are ACTIVE Edge Functions but their deployed handlers return HTTP 410. Main's wall-url source still contains the old launcher; production private callback SQL still contains an LC journal path, but only postgres has EXECUTE. Staging wall-url v5 and postback v8 remain ACTIVE; staging callback routines are record-only and service_role-executable. Callback/conversion counts are zero in both projects. Both provider rows are disabled but retain stale LC reward metadata. PR #29 head `dad8fd7` replaces canonical sources with 410 tombstones, deletes `offerwall-launch.js`, removes Offerwall.GG from the registry, and carries Taplayad-only pending registry code. DaVinci accepted this exact source-only head for owner review; proposed staging SQL is outside migrations and remains unapplied, and no functions are deployed.

**Wallet and launch:** production and staging `public.get_wallet_summary()` still return cash USD buckets; production grants `authenticated` EXECUTE. Production `account.html`, `account-auth.js` and `rewards.html` still expose cash/withdrawal or USD reward fields; production `earn-providers.js` still lists CPAGrip and provider-to-LootCoins copy. PR #20's LC-only UI is not live and does not fix the backend contract. Both selected games are live early access with device-local saves, but shared account/session, cloud saves and trusted LC-event integration remain incomplete. Staging registry contains only the unlisted `zid` placeholder; game_events, game_saves and game_handoff_tickets are zero rows. Terms/Privacy approval, account deletion/export and monitored support remain incomplete or unverified.

**Taplayad:** preserve the owner-supplied App 10066 template exactly: `https://offerwall.tplayad.com/10066/{user_id}`. The current official guide `https://tplayad.com/docs` specifies `md5(app_id . user_id . api_secret)`, generic postback server IP `176.97.212.58`, status 1/2, any-2xx acknowledgement, and suggested deduplication `offer_id + user_id`. The signature does not bind offer/reward/payout/status; no immutable transaction ID or retry schedule is documented; the sample URL uses `offer={offer_id}` while the PHP example reads `offer_id`; the generic iframe is `https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}`. Direct retrieval of the legacy `https://www.tplayad.com/doc/postback` page returns 404; search-indexed older protocol text is not verified and must not be combined with the current guide. Current Terms (last updated 2026-10-29) do not expressly establish incentivized-traffic permission. Require written App-10066-specific confirmation of exact URL, callback IP, signature coverage, transaction identity, reversal linkage, retry/duplicate behavior and traffic permission. Keep Taplayad `pending_approval`, `launch: null`; never map publisher points, callback reward or payout to LC.

Production and business-critical gates remain unchanged.
## Collaboration with ChatGPT / DaVinci

Read `docs/AGENT_OPERATING_CHARTER.md` as the standing role and handoff agreement.

- **Sam:** owner and final business authority.
- **Claude:** primary implementation lead; turns approved requirements into tested code and implementation commits.
- **ChatGPT / DaVinci:** technical director and independent auditor; coordinates priorities and acceptance criteria, reviews the exact implementation SHA, checks architecture/security/environment boundaries, and records acceptance or precise required changes.

Claude remains the implementation lead even when a particular task assigns DaVinci as task coordinator. DaVinci is not a competing implementation lead. Sam must not be used as a routine message relay.

The shared repository is the agent-to-agent communication channel. Put actionable implementation handoffs in the Agent Coordination Log and, when tied to an open PR, in that PR's comments. Do not assume the other agent has seen a handoff until it is acknowledged in a later session. Each implementation task must end with a commit SHA, changed files, exact test results, limitations, and the next action. DaVinci reviews the exact SHA and records ACCEPTED, CHANGES REQUIRED, BLOCKED, or NOT VERIFIED.

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


## 2026-11-19 22:52 ET — PR #24 Deno containment tests passed (NOT DEPLOYED)

- PR #24 remains draft at head `fb2e890`. GitHub Actions run [`44670475596`](https://github.com/demonanic/LegitLoot/actions/runs/44670475596) completed successfully on PR merge commit `f54fc1e`; Deno `2.9.8` ran `index_test.ts`: **3 passed, 0 failed** (GET, POST, OPTIONS; 410/no-store; POST body not read).
- The pure-handler split is therefore test-verified. The run validates only the inert handler and test isolation; it does not verify deployed production containment, SQL grants, callback behavior, provider dashboard settings, or preview auth.
- PR comment `7029857955` was updated with the successful run. PR #24 remains a draft and owner-gated. No merge, deploy, Supabase change, callback, or publisher setting change occurred.


## Latest Sync Watch — 2026-11-20 00:28 ET
Production Offerwall.GG containment is verified, but the canonical repository wall-URL source remains active and must be aligned before any future redeploy. Main still has cash/withdrawal wallet UI and provider-to-LC wording; Terms/Privacy are incomplete. Read the latest dated entry in docs/MASTER_EXECUTION_CONTROL.md before further work. No production or staging mutation was performed by this check.


## 2026-11-20 01:36 ET — Sync Watch handoff

- Draft PR #25 (`claude/offerwall-gg-wall-url-source-align` → `build/legitloot-neon-synthwave`) aligns the integration-branch Offerwall.GG wall-URL source with inert HTTP 410 behavior. It uses a side-effect-free `handler.mjs`; GET/POST/OPTIONS runtime tests and a static reactivation guard are included. GitHub Actions run [44689653386](https://github.com/demonanic/LegitLoot/actions/runs/44689653386) passed 54/54, 0 failed/skipped; isolated handler test passed 3/3 locally. Keep the PR draft; do not merge or deploy.
- Important limitation: `main/supabase/functions/offerwall-gg-wall-url/index.ts` still contains the old active launcher. PR #25 does not touch main. A separate owner-gated main-source alignment is required before any future production function redeploy.
- Cloudflare automatically built both PR #25 previews as `environment=preview`, pages.dev-only, with no production alias. The branch pins Supabase to staging and fails closed if the staging config is absent. No Supabase function was deployed.
- Fresh Taplayad docs check found `offer={offer_id}` in the sample URL but `$_GET['offer_id']` in the PHP sample; current signature omits transaction identity and reward/status/payout/offer; no transaction-ID macro or retry schedule is documented; reversal matching is underspecified; App-10066 incentivized-traffic permission remains unverified. Keep Taplayad record-only and preserve the owner's exact URL template.
- Current integration is still `e868121`; PR #20/#22 are unchanged at 58/64 passing tests and 39 docs-only commits behind the base; PR #23 is draft/no CI with production-targeting Account/auth in its main-based preview; PR #9 is stale. Production cash/withdrawal and provider-to-LC copy, incomplete legal pages, unverified sign-up pause, and missing shared game/account/LC-event integration remain blockers.


## 2026-11-20 01:49 ET — Current handoff

- Integration is now `build/legitloot-neon-synthwave` @ `432060b`; production main remains `bcc19d`. PR #25 is draft and mergeable, head `c4cf11f`, based on `e868121` (five docs-only commits behind current integration). Do not resync solely for documentation churn.
- PR #25 independently reviewed; Actions run [44689653386](https://github.com/demonanic/LegitLoot/actions/runs/44689653386) passed 54/54; isolated handler test 3/3 locally. It changes integration source only. Production main's wall-url source remains active; a separate owner-gated main alignment is still required.
- Production deployed wall-url v2 and postback v4 are inert 410 handlers; checked callback routine EXECUTE grants are revoked. Staging wall-url v5 remains ACTIVE/JWT and its CORS allow-list includes the production site; it can still create signed Offerwall.GG URLs for authenticated callers. Staging postback v8 and DB routines are record-only with no ledger/journal/LC references. Do not invoke or deploy.
- Production and staging provider registries still contain disabled Offerwall.GG rows with null approval/terms but stale LC reward metadata. Staging has no Taplayad row. Do not alter data in this audit.
- Current and legacy Tplayad docs describe incompatible signature, transaction and retry protocols; the current sample also mismatches its PHP `offer_id` lookup. Do not combine them. Obtain written App-10066 confirmation and incentivized-traffic permission; keep Taplayad record-only and preserve the owner URL exactly.
- PR #20/#22 are green (58/64) and ready for owner review for integration acceptance only; PR #23 is draft/no CI with production-targeting Account/auth in its main-based preview; PR #9 remains stale. Production cash/withdrawal UI, provider-to-LC copy, incomplete legal pages, unverified sign-up pause and incomplete shared game/account/LC-event integration remain launch blockers.


## 2026-11-20 01:55 ET — Sync Watch handoff

- Integration is `42cf97c`; production main is `bcc19d`. PR #20/#22 application diffs remain unchanged with 58/64 passing Actions runs. PR #25 head `61f9ca8` passes 54/54 Node tests plus Deno type-check and handler tests; both Pages builds are preview-only. PR #25 remains draft.
- Production Offerwall.GG runtime is contained, but main's canonical wall-url source remains active. Staging wall-url v5 remains active/JWT with production-origin CORS; staging postback v8 is record-only but signs only user ID, transaction ID and amount while leaving reconciliation metadata unsigned. Keep disabled and do not invoke/deploy during this run.
- Taplayad current and www-legacy guides remain incompatible; the non-www legacy path returns 404, while the www path documents transaction-ID signature and retry semantics. Obtain written App-10066 confirmation and incentivized-traffic permission; preserve the owner's exact URL template and never map publisher points/reward/payout into LC.
- A COMMENT review [5988741931](https://github.com/demonanic/LegitLoot/pull/25) records the non-blocking static-guard import-graph gap. GitHub attributes all 16 PR #25 commits to demonanic; no new Claude-authored commit was verified in this window.
- Production cash/withdrawal wallet fields, provider-to-LC copy, incomplete Terms/Privacy, unverified signup pause, Rocket 2 Nowhere production listing, and shared game/account/LC-event integration remain launch blockers. No gated action was performed.


## 2026-11-20 01:56 ET — Documentation CI correction

- The push workflow for documentation commit `5236e7e` ran the full Node suite successfully (50/50) but failed `git diff --check` on trailing spaces in the updated `Last updated` and `Last verified` metadata lines. Follow-up documentation commit `c25df5c` removed those spaces; Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) then passed 50/50 and the whitespace check. No application files or tests changed.


## 2026-11-20 01:57 ET — Documentation CI verified

- Follow-up commit `c25df5c` is the current integration head. Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) completed successfully: Node suite 50/50 and `git diff --check` passed. The prior run [44692216892](https://github.com/demonanic/LegitLoot/actions/runs/44692216892) had the same 50/50 tests but failed only on the two metadata trailing-space lines now corrected.
- PR #25 remains draft and integration-only; its base `e868121` is now eight documentation-only commits behind integration. Application files did not change in the follow-up; no resync is needed solely for documentation.


## 2026-11-20 04:39 ET — Sync Watch handoff #7

- Integration a345aa3; production main bcc19d. Active task remains M2-T4. The Offerwall.GG containment work is the owner's requested critical focus within the launch milestone.
- PR #20/#22 remain green (58/64); PR #23 is draft/no CI and its preview targets production Supabase through account-auth.js; PR #25 head 135607e passes Node and Deno workflows but changes only wall-url source; PR #9 remains stale.
- Production Offerwall runtime is inert 410 with callback EXECUTE revoked. Main wall-url source and integration wall-url/postback sources still contain active code; staging wall-url v5 remains active with production-origin CORS and postback v8 remains record-only with unsigned reconciliation metadata.
- Production/staging wallet API contracts still expose cash USD buckets; PR #20's UI is LC-only but does not correct those server responses. Production UI/legal/signup blockers remain.
- Taplayad App 10066 remains selected but unintegrated. Current signature formula does not bind transaction identity, reward, payout, offer or status; no transaction-ID macro/retry schedule or App-specific permission is verified. Preserve the exact owner template and never map provider points/reward/payout to LC.
- The only standalone Claude handoff note remains CLAUDE_START_HANDOFF_M1.md. Latest verifiable Claude commits are PR #20 head 6e2e51b, PR #22 head 332ca07 and PR #23 head 33a5240. PR #25 commit 135607e is authored by demonanic.
- Next: owner review PR #25; prepare source alignment for both Offerwall functions and a separate staging containment candidate; do not deploy. Keep PR #23 blocked until preview auth fails closed against production.


## 2026-11-20 04:55 ET — ZVHM identity correction

The production and PR #22 Zombies vs Heavy Metal wrapper loads https://demonanic.github.io/Legitloot-2/. The owner-locked Platform Build Spec §0.4 explicitly excludes that repository as Zombie Invasion Defense, not the selected ZVHM title. PR #22's tests/launch-games.test.mjs currently asserts the excluded URL and hides the excluded game's name. Do not call ZVHM playable/live until the actual owner-approved build/source is identified. Blocking PR #22 comments: 7036549802 and 7036564753. Rocket 2 Nowhere remains preview-only, device-save early access, with no shared account/LC.


**Sync Watch 2026-11-20 05:13 ET:** Production Offerwall runtime remains inert, but main wall-url source is still active. Staging wall-url v5 and postback v8 are active and their deployed sources exactly match the environment snapshots; the wall URL allows the production origin, and the record-only callback has unsigned reconciliation metadata. PR #25 changes only canonical wall-url source; its test guard excludes the active staging deployment snapshots. PR #25 comment 7037024928 records the required separate deployment-source check. Production wallet RPC and deployed wallet-summary v4 still expose cash fields; the Edge Function's gameCredits/LLC shape differs from the production RPC's lootCoins/LC shape and no page caller was found. ZVHM identity remains unverified under Platform Build Spec §0.4; PR #22 tests assert the excluded ZID source. PR #23 preview remains production-connected for Account/auth. Only PR #25's test hardening commit 135607e was authored by demonanic; no new Claude-authored commit or handoff note was verified in this check.

**Documentation CI correction 2026-11-20 05:14 ET:** run 44719170874 passed npm test but failed only whitespace checks (MASTER_EXECUTION_CONTROL.md lines 8/65 and LAUNCH_READINESS_AUDIT.md EOF). The follow-up documentation-only commit removes those exact issues; verify its CI result before treating the shared-record update as green.

**Documentation CI follow-up 2026-11-20 05:15 ET:** run 44719451991 passed npm test and failed only because all five updated shared records had an extra blank line at EOF. Follow-up commit 46be8d7 normalized the final newline; Actions run 44719817398 passed npm test and whitespace checks.


## Latest Sync Watch — 2026-11-20 06:28 ET

- Integration head at check start: `6fc8e48`; Actions run `44719973348` passed. Production main remains `bcc19d6`; containment run `44672601131` passed.
- New RUNBOOK-01: the historical production snapshots for Offerwall.GG postback v3 and wall-url v1 are pre-containment active code, not safe rollback targets. `docs/RELEASE_RUNBOOK.md` now prohibits restoring v1/v3 and requires the inert postback v4/wall-url v2 handlers. Current deployed source hashes are recorded in `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`; the current inert sources are not yet archived in the historical snapshot directory.
- Production runtime remains inert 410 with checked callback EXECUTE privileges revoked; the private production callback routine still contains the old journal/ledger path, so do not restore its grants. Staging wall-url v5 remains active/JWT with production-origin CORS; staging postback v8 remains record-only/no-JWT with unsigned reconciliation metadata and duplicate metadata updates. No callback/conversion rows exist in either environment.
- Both provider registries retain disabled Offerwall.GG rows with stale LC/LootCoins reward metadata. Taplayad App 10066 remains unintegrated pending written permission and a complete transaction/reversal contract.
- PR #25 remains draft and corrects only the integration wall-URL source. It does not align postback or deployed staging functions. Direct GitHub REST reports it clean/mergeable, but that is not merge approval. PR #20/#22 retain known wallet/game blockers; PR #23 preview Account/auth still targets production.
- M2-T1/T3/T3b/T4/T6 and MIG-02 branches are stale relative to integration; the old M2-T3 branch has an obsolete duplicate migration version `20261119120000`. Relevant M2-T4/T6/MIG-02 documents/source are already on integration. No new Claude handoff or new Claude-authored commit was verified.
- No merge/deploy, Supabase mutation, callback, provider agreement, payment, reward issuance or money movement occurred. This update is documentation-only.


## 2026-11-20 06:36 ET — Hustle publisher selection review

- New owner-locked mismatch found in PR #20's effective Hustle UI: `earn-providers.js` lines 61–75 still registers Offerwall.GG as the first provider with a pending_approval state and an `offerwall-gg-wall-url` launch function; lines 79–87 also register CPAGrip as testing. No Taplayad entry exists. `earn-hub.js` lines 13–14 and 113–128 will open any provider changed to active when it has a launch block. The public-copy test `tests/hustle-public-copy.test.mjs` checks LC language but does not assert the owner-selected initial publisher.
- Posted actionable owner-lock finding to PR #20: comment [7038570385](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7038570385). Requested Taplayad App 10066 as the sole initial pending/unavailable provider, no launch function until permission and full protocol readiness, removal of Offerwall.GG/CPAGrip from the initial provider list unless separately approved, and a regression test. No publisher settings were saved and no terms accepted.
- Fresh official Tplayad docs check: signature is `md5(app_id . user_id . api_secret)`; status 1/2 means credited/reversed; no transaction-ID macro is listed; any 2xx acknowledges delivery; server IP is `176.97.212.58`. The sample URL uses `offer={offer_id}` while the PHP example reads `offer_id`; the generic iframe path is `https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}`, different from the owner-supplied `https://offerwall.tplayad.com/10066/{user_id}`. Terms last updated 2026-10-29 require publishers to be 18+ and do not expressly mention incentivized traffic. Treat permission and transaction/reversal semantics as unverified; provider points/reward/payout never map to LC.


## 2026-11-20 06:41 ET — PR #26 independent review and current PR state

- **New Claude-authored PR #26 verified:** `claude/hustle-taplayad-pending` head `778081a8d7`, one commit authored by `claude`, 4 files changed. It is stacked on PR #20 (`claude/hustle-rename`) and explicitly says it must be retargeted to integration after #20 merges. Do not merge independently. PR #26 is open, non-draft, and GitHub REST reports mergeable/clean.
- The code changes the Hustle registry to Taplayad as the sole initial provider, `pending_approval`, `launch: null`, with the exact owner URL stored in `recordedTemplate` only. Offerwall.GG and CPAGrip are removed from the initial provider list. No provider callback, wall launch, Supabase, provider settings, terms acceptance, or LC issuance was added. This directly addresses PR #20 comment 7038570385.
- GitHub Actions run [44729353808](https://github.com/demonanic/LegitLoot/actions/runs/44729353808) passed **59/59 Node tests** and the whitespace check. Cloudflare reported successful branch-preview deployments for both `legitloot` and `legitloot-preview` projects; both URLs are pages.dev preview aliases, not production. `tests/earn-hub.browser.py` was updated but the PR body says it was not run. A separate read-only browser inspection could not be completed because Browser Use credits were unavailable; no interactive preview validation is claimed.
- Independent PR #26 review comment [7038633862](https://github.com/demonanic/LegitLoot/pull/26#issuecomment-7038633862) is non-blocking: clarify the inherited phrase “ledger tests” so it cannot imply provider-to-LC posting, and strengthen the static guard from `ledger_entry` to generic `ledger` detection. No active launch/LC path was found in the PR.
- PR #25 remains draft. Its base is now 47 commits behind current integration; the base-to-integration diff contains documentation files only. Current GitHub REST returns `mergeable=null` / `mergeable_state=unknown`, so mergeability is indeterminate; no merge was attempted.
- Open PRs are #9, #20, #22, #23, #25 and #26. Branch count is 27; every branch still reports `protected=false`. PR #23 remains draft/no CI with production-targeted Account/auth on its preview. PR #22 retains the ZVHM identity/test blocker. No new standalone Claude handoff was found; PR #26 is the new verified Claude-authored artifact.
- The documentation-only update sequence passed GitHub Actions through run [44729867195](https://github.com/demonanic/LegitLoot/actions/runs/44729867195), including npm tests and whitespace checks; no application code changed. PR #26's branch previews are not production deployments.
- No PR was merged, no production/staging deploy was initiated, and no Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 13:30 ET — Current-state refresh (history above preserved)

The "Verified repository state" and "Games" paragraphs above were refreshed; earlier dated sections remain as history. Offerwall.GG is permanently retired from scope: the approved contract is `docs/security/OFFERWALL_GG_RETIREMENT.md`; implement it as one consolidated PR on the integration branch with no migration apply, function deploy, callback or production change. Taplayad stays record-only.

## 2026-11-20 14:45 ET — Claude record refresh (amended 15:20 ET per Sync Watch #13; history — superseded by the 16:28 ET entries) (PR #28/#29 evidence; Sync Watch #12 facts)

- **Repository:** production `main` `801f3e7` (owner-approved PR #23 publish); integration `1466eb6` at this sync (authorized baseline `a529b35` plus documentation-only commits; PR #29 is accepted at `0014d3a` for source-only review at 14:43 ET, review 5998408454). 30 refs all `protected:false`; rulesets empty. Do not describe `main` as protected.
- **Open PRs:** #9 stale draft; #20 (head `6e2e51b`, 58/58) with #22 (`332ca07`, 64/64) and #26 (`778081a`, 59/59) stacked on it; #25 superseded draft (demonanic); #27 this documentation sync; #28 ENV-07 guard (draft to `main`); #29 Offerwall.GG retirement (integration). #20 must not be released alone: the combined release needs the LC-only UI plus the Taplayad-only pending registry from a reviewed exact head.
- **PR #28 (`93f62ac`):** Actions run 44791797759 passed; accepted by DaVinci for **owner review only**. The existing `main.legitloot-preview.pages.dev` deployment still runs the unguarded production-Supabase auth until the owner approves a production merge/deploy. Client-side defense-in-depth only.
- **PR #29 (source only; DaVinci ACCEPTED source-only at `0014d3a` in review 5998408454, then raised a test-evidence-wording CHANGES REQUIRED follow-up, comment 7049589082 — acceptance is therefore qualified):** previous head `cb1f999` got CHANGES REQUIRED solely because the proposed staging SQL rollback reactivated record-only callback RPCs, re-granted `service_role` and restored stale provider metadata. Fixed at `0014d3a`: the SQL header is now a **forward-only, fail-closed recovery plan**; test added (Actions 44802436878 / 44802436895 success). Follow-up fixed at `230b7bf` (tests only): the staging routine snapshot is labelled **historical pre-record-only evidence**, not current deployment state, with a guard test (Actions Node/whitespace 44809587659, Deno 44809587433 success). Re-review of `230b7bf` requested. Nothing deployed or applied; SQL stays unapplied until the exact staging ref and recovery plan are independently checked.
- **Offerwall.GG dashboard evidence:** owner-provided screen recording (PR #29 comment 7047980474): five visible placements with postback fields cleared, including a successful save on the remaining Pending placement. **Not an independent readback**; placement disable/delete remains PARTIAL/UNVERIFIED.
- **Production blockers unchanged:** Earn label, CPAGrip `testing` with provider-set LootCoin copy, no Taplayad entry; cash/withdrawal fields in account/rewards and `get_wallet_summary()`/wallet-summary cash contracts (WALLET-01); incomplete Terms/Privacy; unverified signup pause; Taplayad written confirmation and incentivized-traffic permission missing (keep record-only; never map points/reward/payout to LC).
- **M2-T4:** IN PROGRESS. Both games are early access with device-local saves and no account/LC link. M2-T4b-R1 is accepted as design only; no code, registry row or endpoint exists.
- **Owner gates (unchanged):** production merge/deploy (including PR #28), production config/data, staging deploy/SQL application for retirement, provider agreements/activation, paid commitments, live money/reward movement, signup/legal decisions, branch protection.
- No merge, deploy, SQL application, callback, provider setting, secret change or money movement occurred.
- **Taplayad App 10066 (Sync Watch #13 / DaVinci, 15:07 ET):** current official docs (tplayad.com/docs) define `md5(app_id . user_id . api_secret)`, status 1 credited / 2 reversed, any-2xx acknowledgement and `offer_id + user_id` deduplication, but no immutable transaction ID or retry schedule; the signature does not bind offer, reward, payout or status. The sample URL uses `offer={offer_id}` while its PHP example reads `$_GET['offer_id']`. The indexed legacy page (`www.tplayad.com/doc/postback`, conflicting `md5(subId . transId . reward . secret)`, OK/DUP, retries) returns 404 when opened directly: treat it as **unverified, not a second protocol**. Terms (updated 2026-10-29) require 18+ and prohibit fraud but do not expressly permit LegitLoot's incentivized-traffic model or an App-10066 placement. Required: written support confirmation of exact parameter names, full signature byte sequence, immutable transaction identity, retry/ack/duplicate behavior, reversal linkage and explicit permission. Until then Taplayad stays `pending_approval`, `launch: null`, owner template record-only; never map points/reward/payout to LC.

## 2026-11-20 16:28 ET — Fresh read-only evidence from DaVinci (16:17 ET); recorded by Claude, not re-run

- **Supabase (read-only, DaVinci):** both projects ACTIVE_HEALTHY. Production Edge Functions: postback v4 / wall-url v2 tombstones and wallet-summary v4. Staging: postback v8 and wall-url v5 ACTIVE plus CPAGrip v5. Staging callback routines remain record-only with `service_role` EXECUTE; the staging Offerwall.GG provider row is disabled but retains stale LC reward metadata. Production's private callback routine still contains the historical LC journal-posting body, although EXECUTE is false for anon/authenticated/service_role; its provider row also retains stale LC metadata. Production and staging `get_wallet_summary()` still return cash/USD buckets (staging labels game credits LLC). Staging `game_registry` has only the unlisted `zid` placeholder; `game_events`, `game_saves`, `game_handoff_tickets` are empty. No SQL, data, settings, grants or functions were changed.
- **Cloudflare (read-only, DaVinci):** production `legitloot` remains `main@801f3e7`, deployment `fe4c0f22`, alias `legitloot.site`. PR #27 `a6ef02d` and PR #29 `230b7bf` built successfully in both Pages projects as `environment=preview`, pages.dev aliases, no deployment env vars. The main-based preview `fdf6b609` (`main@801f3e7`, `main.legitloot-preview.pages.dev`, no env vars) still runs `account-auth.js` with the hardcoded production Supabase project and `auth.signUp()`. **ENV-07 remains critical;** keep Account/auth off that preview; PR #28 is draft and owner-gated.
- **Taplayad (DaVinci, re-checked today):** unchanged: `md5(app_id . user_id . api_secret)`, statuses 1/2, any-2xx ack, suggested `offer_id + user_id` dedupe; signature does not bind offer/reward/payout/status; no immutable transaction ID or retry schedule; `offer={offer_id}` vs PHP `offer_id`; Terms (2026-10-29) grant no express incentivized-traffic permission. App 10066 stays `pending_approval`, owner template record-only; never map points/reward/payout to LC.
- **Last-verified bookkeeping:** this entry records DaVinci's 16:17 ET read-only observations; Claude did not query Supabase or Cloudflare. Earlier inventory in this file is carried forward from the last independent verification unless superseded here.
- No merge, deploy, SQL application, callback, provider setting, secret change or money movement occurred.

## 2026-11-20 16:28 ET — Claude record sync to DaVinci's 16:17–16:26 ET findings (PR #27 review)

- **PR #29 exact heads:** `0014d3a` source-only acceptance (qualified) -> `230b7bf` incomplete test wording -> `24950f3` historical-only test correction **accepted by DaVinci** (Node 44819720446, Deno 44819720582) -> `dad8fd7` fixes the last finding, the proposed SQL label "reversible" -> "non-destructive, no data deleted; forward-only", with a regression assertion (Node 44820230399, Deno 44820229990 pass). Re-review of `dad8fd7` requested. SQL unapplied; functions undeployed.
- **Branch previews are staging-bound (DaVinci source inspection, 16:17 ET):** the PR #27 and PR #29 branches' `supabase-config.js` selects the staging project and `account-auth.js` fails closed unless the environment is `staging` and the URL matches that exact staging project before `createClient`. These previews are therefore not production-bound. This does **not** apply to the main-based preview `fdf6b609` (`main@801f3e7`, `main.legitloot-preview.pages.dev`): main `account-auth.js` still hardcodes the production Supabase project and exposes `auth.signUp()`. **ENV-07 remains critical**; keep Account/auth off that preview; PR #28 is draft and owner-gated.
- **Next:** after #29 and #27 re-review, review #20 + #22 + #26 as one release unit (do not release #20 alone). No merge, deploy, SQL application, provider activation or financial action occurred.

## 2026-11-20 17:30 ET — Sync Watch #15 handoff

- DaVinci reviewed PR #29 exact head `dad8fd7` and marked it **ACCEPTED for source-only owner review**. Node/whitespace and Deno CI pass. No deployment or SQL application.
- PR #29 contains byte-identical Taplayad registry/test files to PR #26; reconcile to one copy. PR #20/#22/#26 remain 119 commits behind current integration and require one synchronized release candidate.
- Current and old Tplayad docs are distinct protocol generations. Require written App-10066-specific protocol and incentivized-traffic confirmation; do not guess or map provider values to LC.
- Latest Claude implementation handoffs are PR #27 comment `7051054842` and PR #29 comment `7051020358`. No new standalone M2 handoff file exists; `docs/CLAUDE_START_HANDOFF_M1.md` is historical.
- Exact next action: Claude reconciles the stacked release sequence and posts one current combined candidate SHA; DaVinci reviews that exact SHA. Production, provider-agreement/activation and live financial actions remain owner-gated.

## 2026-11-20 17:44 ET — PR #29 follow-up handoff

Claude's commit `cfe9f0a` was independently reviewed. It changes only the proposed SQL header, retirement-contract wording and a static regression assertion; no executable SQL or runtime code changed. The owner-execution exception is now explicit. Exact-head Node/whitespace and Deno Actions pass. DaVinci's source-only acceptance now applies to `cfe9f0a`; `tests/earn-hub.browser.py` remains unrun. SQL remains unapplied and functions undeployed.

## 2026-11-20 17:50 ET — PR #30 candidate handoff

- Claude's verifiable combined candidate is draft PR #30, head `272a1c1`, base current integration `1466eb6`, 30 commits ahead/0 behind, 43 files. It combines #20/#22/#29/#26 without duplicate registry/test blobs; the unique #26 public-copy test remains. Node/Deno Actions and both Pages previews pass.
- Owner decision PR #22 comment `7041463948` confirms `demonanic/Legitloot-2` is the approved Zombies vs Heavy Metal source. Candidate code/test match; candidate PR description, README and Platform Build Spec still carry stale pre-decision wording.
- Candidate `index.html` retains an unexplained `offerwall-verification` meta token; confirm whether it is Offerwall.GG and remove or document accordingly.
- Branch-only payout simulator remains a staging/admin test tool under Master Control §630; exact staging guards and server-side owner/admin checks are present. It does not move real funds.
- Browser test `tests/earn-hub.browser.py` remains unrun. Terms/Privacy placeholders, account deletion/export, shared account/save handoff, cloud saves and trusted LC-event ingestion remain launch blockers. No merge or deployment.

## 2026-11-20 17:55 ET — Claude record sync: PR #30 head `b773274`; internal-tool access boundary

- **PR #30 current head `b773274`** (supersedes `272a1c1`, `9f2c9a0`): merged PR #27 `4c7dfc3` (production `main@801f3e7`, owner ZVHM-source decision in README/Platform Build Spec), removed the `offerwall-verification` meta from `index.html` with a regression test (origin inferred from tag name and the 2026-11-08 release commit, not provider-confirmed), and documented the internal-tool access boundary. Local `npm test` 76/76; Actions Node `44832701771` and Deno `44832701665` pass; browser test `tests/earn-hub.browser.py` unrun. DaVinci withdrew the ZVHM source blocker (PR #22 comment 7052568879, PR #30 comment 7052569293). Re-review requested. The candidate carries PR #27's records as of the merge point; a further sync to this PR #27 head follows.
- **Internal-tool access boundary (Master Control §630):** `/admin.html` and `/payout-simulator.html` are static Pages routes whose HTML shells are publicly fetchable (not linked from other pages or `sitemap.xml`; no `noindex`). Access is gated at the **data/action level** only: exact-staging-URL guards (ENV-06), authenticated Edge Functions and owner/admin-role RPCs; no production payout-simulator function and no PayPal/Venmo call. This is **not** URL-level denial. A URL-level gate (e.g. Cloudflare Access) or `noindex` needs separate owner approval; no Cloudflare/security setting was changed.
- No merge, deploy, SQL application, callback, provider setting or financial action occurred.


## 2026-11-20 17:58 ET — DaVinci Sync Watch #16 handoff

- Production main still exposes cash/withdrawal UI and signup; production wallet RPC/Edge Function return cash/USD fields. The main-based preview remains production-auth-connected. Do not use Account/auth there. Owner-approved signup pause is not independently verified.
- Staging Offerwall.GG wall-url v5 remains active/JWT and postback v8 active/no-JWT record-only; disabled Offerwall.GG metadata still names LC. Staging game-event/save/handoff tables are empty. No callback was invoked.
- PR #30 candidate is LC-only and Taplayad-pending with the exact owner URL; current and legacy Tplayad docs differ in signature/transaction/retry semantics, and App-10066-specific permission remains unverified. Keep pending; no provider values map to LC.
- Static admin/payout-simulator HTML shells remain publicly fetchable; data/actions are gated. Strict URL-level denial/noindex is a separate owner decision under §630.
- See the 17:58 Sync Watch #16 debrief in Master Control and Project Progress. No merge, deploy, settings/secret/grant/schema/data change, callback, provider setting, agreement, payment or reward issuance occurred.


## 2026-11-20 18:20 ET — DaVinci Sync Watch #17 handoff

- **Exact candidate reviewed:** PR #30 `0e9b9329846d5c4e4cbc65903f7e6bfd28fea4f3`, draft, 52 files / 71 commits. Node/whitespace `44834506860` and Deno `44834506806` pass. Browser test remains unrun. Review disposition: CHANGES REQUIRED; keep draft.
- **Fix the wallet-test provenance:** `tests/wallet-summary.test.mjs:4–6` references repository migration versions that do not match live Supabase history (staging `20261109050922`, production `20261108081619`). Establish and document the exact source mapping or relabel as static fixture coverage. The new alias test does not remove cash/USD fields from the backend.
- **Keep WALLET-01 open:** production and staging `public.get_wallet_summary()` still return cash/USD buckets; production wallet-summary v4 also returns cash fields. Prepare a candidate server-side LC-only response contract and tests as source-only work; do not apply SQL or alter deployed functions in this task.
- **Keep onboarding gated:** candidate Account still exposes `auth.signUp()` while Terms/Privacy are placeholders and deletion/export is incomplete. Do not change Supabase Auth settings; document the required pre-launch state and do not invite users to register.
- **Refresh PR metadata:** update PR #30 description and current-state docs to exact head `0e9b932`, 52 files, 71 commits, 77 local tests (Claude-reported), Node/Deno Actions above, both preview builds, and the unrun browser test.
- **Provider / game limits:** Taplayad remains pending with the exact owner URL; written App-10066 traffic permission and exact protocol are missing. No provider values may become LC. Staging game registry/events/saves/handoff remain incomplete; both games stay early access.
- No merge, deploy, SQL application, callback, settings/secret/grant/schema/data change, provider agreement/activation, payment, reward issuance or money movement.


## 2026-11-20 18:31 ET — DaVinci Sync Watch #17 follow-up handoff

- **Candidate:** PR #30 `ab505225`, 55 files / 74 commits, still draft. Node/whitespace `44837137548` and Deno `44837137501` pass; Claude reports 79/79 local tests. Browser test remains unrun and preview for this SHA is not verified.
- **Progress accepted:** wallet test provenance is now correctly static-only; candidate sign-up UI/client handler is removed; source-only LC response proposal is outside migrations and marked DO NOT APPLY. Live account catalog confirms `lootcoins_available` is the LC-coded account family in both environments.
- **Review before any further approval:** Edge Function source must filter LC accounts and posted transactions; proposed SQL grant statements must match the ACL claim; account copy and the signup test name need correction; `wallet-summary.js` still has stale migration comments; Auth backend `disable_signup` is unverified. Live RPCs remain cash-bearing until a separately approved migration/deployment.
- **Coordination:** PR #27 head `aae268f` passed Actions `44837195049`; PR #30 includes docs only through `e199df3`. Sync latest PR #27 docs once, update PR #30 body to exact head `ab505225` / 55 files / 74 commits / 79 local tests (Claude-reported) / Actions `44837137548` and `44837137501`, and keep the browser-test limitation.
- No Auth setting, Supabase secret/grant/schema/data, function deployment, SQL application, provider action, payment, reward issuance or money movement.


## 2026-11-20 18:36 ET — DaVinci Sync Watch #17 follow-up 2 handoff

- **Latest candidate:** PR #30 `7f1e1c61`, 56 files / 77 commits, draft. Node/whitespace `44837793174` and Deno `44837793169` pass. The last Claude-reported 79/79 local result is on `ab505225`, not this SHA. Browser test remains unrun and preview for the latest SHA is unverified.
- **Accepted:** Edge Function source now filters LC accounts and posted LC entries; account copy is corrected; signup test is UI-only and backend Auth status is explicitly unverified; parser migration comments are corrected; SQL ACL intent is documented.
- **Fix before owner review:** add journal-entry wallet_kind/currency matching to the proposed RPC join and add a PUBLIC-grantee ACL precondition check. Keep SQL DO NOT APPLY.
- **Coordination:** PR #27 `e1146ff` passed Actions `44837816280`; PR #30 still includes docs only through `e199df3`. Sync the latest docs branch once. The PR #30 body still cites `9f2c9a0` and old Actions; update to exact head `7f1e1c61`, 56 files / 77 commits, Actions `44837793174/44837793169`, and browser-test limitation.
- **Owner gates remain:** no Auth setting change; no provider permission or protocol assumption; no production merge/deploy; no financial or irreversible action.


## 2026-11-20 18:38 ET — DaVinci Sync Watch #17 follow-up 3 handoff

- **Latest candidate:** PR #30 `38a9406`, 56 files / 80 commits, draft. Node/whitespace `44838085850` and Deno `44838085857` pass. Last Claude-reported local 80/80 belongs to prior `7f1e1c61`; browser test unrun and latest preview unverified.
- **Accepted source fixes:** proposed RPC now checks journal-entry wallet_kind/currency match and posted status; ACL precondition checks PUBLIC; Edge Function source filters LC accounts/entries and posted transactions; Account copy and signup UI-only test are corrected.
- **Still source-only:** proposed staging RPC remains DO NOT APPLY; Edge Function source not deployed. Live RPCs and deployed production wallet-summary v4 still return cash/USD fields.
- **Runtime gate:** PostgREST `journal_transactions!inner(status)` embed is unexecuted; underlying FK exists in both environments. Validate on staging only after separately authorized action; do not deploy now.
- **Coordination:** PR #27 `26768972` passed Actions `44838133420`; PR #30 contains docs only through `e1146ff`, one commit behind. Update PR #30 current-state header from `7f1e1c6` to exact head `38a9406`, 56 files / 80 commits, Actions `44838085850/44838085857`; last local test count is from the previous SHA.
- **Owner gates:** Auth `disable_signup` unverified; ENV-07, Taplayad terms/protocol, legal/account deletion/export, game/save/verified-event integration remain open.
- No merge, deploy, SQL application, Auth setting, secret/grant/schema/data change, callback, provider action, payment, reward issuance or money movement.


## 2026-11-20 18:39 ET — DaVinci Sync Watch #17 follow-up 4 handoff

- **Latest candidate:** PR #30 `226caadc`, 56 files / 82 commits, draft. Node/whitespace `44838319726` and Deno `44838319730` pass. Last Claude-reported local 81/81 is on prior `38a9406`; browser test unrun and preview for `226caadc` unverified.
- **Docs sync:** PR #30 merged PR #27 through `26768972`; current PR #27 head is `8c6aa8c`, Actions `44838341613` passed. PR #30 remains one docs commit behind.
- **Wallet proposal:** the latest source fixes entry/account wallet_kind/currency matching and PUBLIC ACL precondition. Static tests pass. Proposed SQL remains DO NOT APPLY; Edge Function source remains undeployed and its PostgREST embed unexecuted. Live wallet RPCs remain cash/USD-bearing.
- **PR metadata:** update current-state header from `38a9406` / 80 commits / previous Actions to `226caadc` / 82 commits / Actions `44838319726/44838319730`, and update merged docs through `26768972`. Last local test count is from prior SHA.
- No merge, deployment, SQL application, Auth setting, Supabase secret/grant/schema/data change, callback, provider action, payment, reward issuance or money movement.


## 2026-11-20 19:14 ET — DaVinci Sync Watch #18 handoff

- Re-read the governing control, progress, launch audit, environment map, AGENTS.md and agent charter. Production remains `main@801f3e7`; integration remains `1466eb6`; PR #30 exact draft head is `226caadc` (56 files / 82 commits). Node/whitespace `44838319726` and Deno `44838319730` pass; Claude reports 81/81 local tests on this exact head; both Pages previews succeeded. Browser test remains unrun.
- PR #27 is the canonical shared-record branch at `0269a54`, Actions `44838509525` passed. PR #30 carries docs through `26768972`; later docs-only drift is intentionally deferred until an owner-approved freeze.
- DaVinci posted PR #30 comment `7053977218` with two actionable findings: bump the unchanged `account-auth.js?v=m2t1-1` cache key after the script changed (old cached code can reference the removed signup form and abort later handlers); reconcile Account sign-in/reset instructions with the Privacy page's no-personal-information instruction. No legal copy was changed.
- Live wallet RPCs in both Supabase projects still return cash/USD; production wallet-summary v4 remains cash-bearing. The Edge Function candidate's PostgREST transaction embed remains unexecuted; proposed SQL remains DO NOT APPLY. Production Offerwall.GG endpoints are 410; staging wall-url v5 and postback v8 remain active (wall-url still constructs URLs for authenticated callers; postback is record-only). Game handoff/event tables remain empty; Taplayad remains pending.
- No PR merge, deployment, SQL application, Auth setting, Supabase setting/secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 19:22 ET — DaVinci handoff update — PR #30 `fcd6223`

- Claude addressed DaVinci's cache-bust finding. Exact source now uses `account-auth.js?v=m2t1-2`; the regression test rejects `m2t1-1`. Independently rechecked.
- Exact-head Node/whitespace `44843092983` and Deno `44843092933` pass; Claude reports 82/82 local tests; both Cloudflare Pages previews succeeded. Browser test remains unrun.
- Account/Privacy conflict remains owner/legal-gated; no legal wording changed. Do not use Account sign-in/reset on public previews or open onboarding until approved.
- PR #30 remains draft at `fcd6223`. Wallet source proposal remains DO NOT APPLY and the Edge Function nested embed remains unexecuted. Live wallet RPCs still return cash/USD; game handoff/events, Taplayad approval/protocol, account deletion/export and ENV-07 remain open.

## 2026-11-20 21:25 ET — Claude record alignment to Sync Watch #19 (summary; full evidence in Master Control 19:59/20:05 ET)

- **Refs (per DaVinci #19, not re-queried by Claude):** production `main@801f3e7`; integration `1466eb6`; PR #30 `fcd6223` (56 files / 83 commits, draft; Node `44843092983`, Deno `44843092933`; Claude-reported local 82/82; browser test unrun); PR #28 `93f62ac` (draft, owner-gated; description corrected to allow only `legitloot.site`, comment `7054774673`); docs PR #27 `553f6ae`.
- Handoff: no new implementation pending; waiting on DaVinci re-review / owner-approved freeze point, then one final PR #30 docs sync with fresh tests and header refresh. Account/Privacy decision, `disable_signup`, and ENV-07/PR #28 remain owner-gated.


## 2026-11-21 00:47 ET — DaVinci Sync Watch #23 handoff

- Active milestone/task remains M2 / M2-T4. Do not expand scope.
- PR #30 remains draft at `fcd6223`; exact-head Node and Deno workflows pass. Browser test is still unrun. Both candidate previews are staging-bound. No new wallet/Hustle/retirement source defect was found.
- PR #28 at `93f62ac` passes exact Actions run 44791797759 and is accepted for owner review of the narrow non-production host guard. Do not merge/deploy without owner approval. The main-based preview remains production-auth-connected until that approved remediation is deployed and rechecked.
- PR #30 account page still enables sign-in/reset while Privacy and Terms say personal information should not be submitted until final notices are approved. Keep those flows unavailable on public previews until owner approval of final notices or interim wording; account deletion/export remains missing.
- Current Taplayad docs now publish generic postback IP `176.97.212.58`; this requires App-10066-specific confirmation. Signature/transaction/reversal/retry gaps and missing incentivized-traffic permission remain. Preserve the owner URL and no-provider-to-LC rule.
- Companion working records were stale at Sync Watch #19; this documentation commit aligns them to #23. PR #30's snapshot remains untouched until the owner-approved freeze point.
- No merge, deployment, Supabase mutation, callback, provider setting/agreement, or financial activity was performed.


## 2026-11-21 00:59 ET — Sync Watch #23 follow-up: account legal gate verified

Claude's commit `3bfa615` on PR #30 pauses sign-in/reset while Terms/Privacy remain drafts. Independent review confirmed the gate returns before the Supabase client and auth handlers; the Account auth panel is hidden, and other page scripts do not create a client. Exact-head Node/whitespace and Deno Actions passed; both previews are staging-bound. The signed-in wallet view is also unavailable until owner-approved legal notices are published and the gate is reopened. Do not flip `LEGAL_NOTICES_FINAL` or alter legal copy without owner approval. Production main and the separate main-based preview remain unchanged; PR #28 is still owner-gated. Runtime VM coverage of the closed-gate path is recommended but non-blocking. No merge/deploy or Supabase/legal/financial change occurred.


## 2026-11-21 01:15 ET — DaVinci Sync Watch #24 handoff

- Active milestone/task remains M2 / M2-T4. Do not expand scope.
- PR #30 is draft at `37763d8` (58 files / 85 commits). Latest commit is test-only; the closed-gate VM test asserts zero client creations, zero handlers, zero config reads, hidden panel and pause notice. Exact-head Node/whitespace and Deno Actions #44873409564/#44873409629 passed. Claude reports 86/86 local tests; browser suite remains unrun. Both Cloudflare previews for exact `37763d8` are successful and staging-bound. Eight prior inline review threads are resolved; no formal approval for this SHA.
- Candidate Account gate is accepted for the narrow purpose of preventing credential submission while legal notices are drafts. It also hides the signed-in wallet. Do not reopen `LEGAL_NOTICES_FINAL` or change legal wording without owner approval.
- **New M2-T4 evidence:** staging game registry has only legacy Zombie Invasion Defense (development, unlisted, no launch URL); neither Zombies vs Heavy Metal nor Rocket 2 Nowhere is registered. Events/saves/handoff tickets are zero. The public pages are honestly labelled early access and local-only; the registry gap blocks any claim of trusted account/save/reward integration. See PR #30 comment 7058531808. Do not seed or mutate staging from this handoff.
- Fresh live wallet read: both production and staging RPCs still return cash/USD; production Edge Function v4 is cash/LLC-bearing; staging has no wallet-summary Edge Function. Candidate LC-only SQL/function are source-only, SQL DO NOT APPLY, PostgREST schema exposure/embed unverified. No Supabase changes.
- Taplayad App 10066 remains pending written incentivized-traffic permission and full signed transaction/reversal/retry semantics. Preserve `https://offerwall.tplayad.com/10066/{user_id}`; provider activity never issues LC. Offerwall.GG staging functions remain deployed (wall-url v5, record-only postback v8); no callbacks.
- PR #28 at `93f62ac` remains draft/owner-gated despite passing Actions #44791797759. The main-based preview still targets production Supabase. Keep Account/auth routes off-limits until owner-approved ENV-07 remediation is deployed and rechecked.
- Next: keep M2-T4 active; coordinate registry/session/save/event implementation with staging-only evidence. Do not claim integration complete from static game pages. No merge, deploy, Supabase mutation, callback, provider activation, legal decision or financial action was performed.


## 2026-11-21 02:35 ET — DaVinci Sync Watch #25 handoff

- Keep PR #30 draft at 37763d8; do not merge, deploy, apply proposed SQL, or reopen Account auth. Candidate tests pass, but browser coverage remains unrun and no formal approval exists.
- Review PR #30 comments 7059451348 (Hustle test name/assertion scope) and 7059451679 (draft Privacy contact versus AUTH-03 support design). Both are non-blocking documentation/test corrections; do not invent or publish an unverified support address.
- M2-T4 remains incomplete: selected game registry rows, shared account/session handoff, cloud saves and server-verified LC events are absent. Existing actionable finding is PR #30 comment 7058531808.
- Keep Taplayad pending; exact owner URL is descriptive only; require App-10066-specific written permission and complete protocol confirmation. Provider activity never issues LC.
- Critical release-control warning: do not use or merge owner-authored docs/m2-t6-release-runbook@5fe4cea. It removes the Offerwall.GG rollback exception and could restore pre-containment active postback v3/wall-url v1. Integration docs/RELEASE_RUNBOOK.md at blob 4acf171 remains authoritative.
- Production main remains 801f3e7 with cash/withdrawal and provider-to-LC copy. Main-based preview remains production-auth-connected. All 31 refs are unprotected; production gates remain owner-controlled.
- No production, Supabase, provider, callback, financial or legal action was performed in this check.

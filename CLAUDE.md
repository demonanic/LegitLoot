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

Current active task: **M2-T4 — verify and integrate Zombies vs Heavy Metal and Rocket 2 Nowhere**. ChatGPT is acting lead while Claude's credit allowance is exhausted. Read the active task and latest handoff in `docs/MASTER_EXECUTION_CONTROL.md`. The two launch titles are owner-locked, but their exact source repositories and playable URLs have not been located; do not invent or substitute links. Continue the repository-side account-contract and launch-page audit, then complete integration once exact game sources are identified. Shared contract: one LegitLoot account, game-specific saves remain separate, website-only authoritative LC wallet, and server-verified/idempotent game events. M2-T3a staging record-only containment is complete; staging postback v8 is active.

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

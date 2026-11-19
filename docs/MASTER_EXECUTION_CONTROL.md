# LEGITLOOT — MASTER EXECUTION CONTROL
## Shared operating agreement for ChatGPT, Claude, and the project owner

**Status:** ACTIVE — owner-authorized  
**Last updated:** 2026-11-19  
**Repository:** `demonanic/LegitLoot`  
**Authorized working branch:** `build/legitloot-neon-synthwave`  
**Production branch:** `main` — production; merge/deploy remain owner-gated. GitHub API reports `protected:false`; branch-protection details returned 403 and no repository rulesets were returned (2026-11-19). Do not describe `main` as technically protected until verified.  
**Purpose:** One shared source of truth for priorities, decisions, agent coordination, and the next executable task.

**Explicit owner authorization:** The owner has expressly authorized both ChatGPT and Claude to collaborate autonomously on LegitLoot, inspect shared repository and connected development resources, update documentation, assign bounded tasks, provide implementation/review instructions, and carry out routine reversible work within the active milestone. Effective 2026-11-19, both agents may independently merge independently reviewed and verified work into `build/legitloot-neon-synthwave` and deploy to staging, including documented staging-only migrations and reversible staging database changes, without per-action approval. These are not owner gates. Require independent review, passing tests, exact environment checks, rollback planning, and a dated debrief. This authority does not permit production deployment or merge, production settings/secrets/schema/data changes, real financial activity/reward issuance/payouts, paid commitments, provider agreements, destructive real-data changes, security weakening, or irreversible legal/business decisions. Security clearance authorizes protective security work, not weakening safeguards. These critical categories remain governed by Section 6.

---

# 1. THE PRIMARY DIRECTION — LAUNCH LEGITLOOT

The current business priority is to make LegitLoot launchable.

Do not expand the vision, invent another product, or start unrelated initiatives until the launch milestone is complete or a genuine blocker requires a decision.

LegitLoot is a multi-game and rewards platform. The website and shared backend connect its products:

- Public website and navigation.
- One central LegitLoot account.
- Game directory and game integrations.
- User profile and account management.
- Reward/wallet infrastructure, governed by the separate LegitCoin Economy and Monetization specialists.
- Approved earning-provider integrations.
- Administrative operations, support, trust, and legal information.

The platform must be truthful about what is live, in testing, planned, or unavailable. Never fabricate users, activity, balances, earnings, provider approval, game availability, or successful transactions.

**Launch means a real, coherent, usable product—not merely a deployed website or a collection of finished-looking pages.**

The first release should be deliberately narrow. Finish and verify the minimum complete user journey before activating more providers, games, or secondary products.

# 2. ONE ACTIVE MILESTONE — NO PROJECT CREEP

There is exactly one active milestone at a time.

## Active milestone M2: LAUNCH BLOCKER CLOSURE AND BASIC-OPERABLE RELEASE

**Status:** IN PROGRESS  
**Priority:** P0  
**Owner:** Claude — platform implementation lead  
**Partner:** ChatGPT — independent reviewer, architecture/risk reviewer, and staging deployment operator where connector access is available  
**Owner involvement:** Not required for routine integration merges, staging deployments, staging-only migrations, reversible staging tests, or implementation work already inside this milestone.

### Objective

Deliver the smallest complete, honest, basic-operable version of `legitloot.site`. Do not expand the platform or add unrelated products until the minimum user journey is complete and verified.

The release candidate must truthfully provide:
- Public website/navigation and mobile usability.
- Central account sign-in, recovery, and a working deletion/export path before public account onboarding.
- The website as the authoritative LC wallet; no game-side spendable wallet.
- LC earned only from verified in-game milestones, weekly challenges, and seasonal events.
- No cash, withdrawal, transfer, USD peg, or provider-offerwall-to-LC issuance.
- A verified playable game, or an honestly labelled early-access portal.
- Approved Terms, Privacy, support route, monitoring, backup/recovery expectations, and rollback plan.
- No live financial activity or provider activation without the applicable owner gate.

### Current active task — M2-T4: verify and integrate the two launch games

**Status:** IN PROGRESS — blocked only on identifying the actual playable builds/source repositories.  
**Acting lead:** ChatGPT (Claude's credit allowance is exhausted; Claude can resume from this shared record).  
**Partner:** Claude when available; both agents retain standing integration/staging authority.

**Owner-locked launch titles:** **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**. The owner says both are playable as-is. That statement is direction, not integration test evidence.

**Current evidence and gap:**
- The current `games.html` still contains the obsolete one-game Zombie Invasion Defense card and no playable links.
- The connected GitHub account's visible repositories include `demonanic/Legitloot-2`, whose README identifies it as Zombie Invasion Defense. That is not one of the two selected launch titles.
- No source repository or playable hosting URL for either selected launch title has been located in the connected GitHub repositories or prior handoffs. Do not substitute unrelated game repositories or invent links.
- The shared integration contract remains: one LegitLoot account, game-specific saves retained by each game, website-only authoritative LC wallet, and only server-verified signed/idempotent game events may request eligible LC awards.

**Acceptance criteria:**
1. Identify the exact source repository and playable URL for each selected title.
2. Independently inspect each build for a working play route, mobile usability, save persistence, and account integration.
3. Implement a shared LegitLoot login/session handoff without moving game-specific saves into a duplicate central save.
4. Prove no game can mint or spend LC locally; only authenticated server-verified milestone events may reach the central reward service.
5. Add truthful game cards and working launch links; test on mobile and desktop preview.
6. Record exact evidence and unresolved dependencies. No production release.

**Immediate next action:** Owner to provide the playable URL or repository link for each game if not discoverable from existing connected sources. In parallel, ChatGPT will complete the repository-side launch-page and account-contract audit without inventing destinations.

### Supporting M2 work

- **M2-T6 / OPS-01 / OPS-03 / GOV-01:** COMPLETE FOR RUNBOOK — `docs/RELEASE_RUNBOOK.md` is on the integration branch. It distinguishes expected record-only callback/conversion rows from forbidden provider LC journal postings, uses the actual staging migration version, and adds `main` branch-protection verification to the release freeze. Production backup/PITR tier and branch-protection configuration still require verification.
- **PR #14 / ENV-03:** COMPLETE — merged as `f8780a0`; staging `cpagrip-attribution` deployed as ACTIVE v5 with `verify_jwt=true`; production origin absent and bearer/JWT validation preserved.
- **AUTH-03 design:** COMPLETE FOR DESIGN REVIEW — `docs/ACCOUNT_DELETION_DESIGN.md` is now on the integration branch. `payouts@legitloot.site` remains UNVERIFIED; D1–D4 owner/legal decisions remain open. No deletion implementation or production change has occurred.
- **AUTH-02:** the owner-approved production sign-up pause remains unapplied; verify `disable_signup:true` while preserving email sign-in before public account onboarding.
- **LEGAL-01 / GAME-02 / OPS-01 / OPS-03:** complete accurate Terms/Privacy/support, the playable-game vs early-access scope, monitoring, backup/PITR verification, and release/rollback readiness.

M1 audit and environment inventory are historical completed work, accepted with qualifications. Current implementation status is recorded in `docs/PROJECT_PROGRESS.md`, `docs/LAUNCH_READINESS_AUDIT.md`, and `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`.

# 3. LAUNCH SCOPE — WHAT WE ARE TRYING TO FINISH

The goal is a controlled first public release, not the entire long-term vision.

The minimum launch candidate must provide:

1. A polished, navigable public website with truthful page states.
2. Working central account registration and sign-in, if accounts are exposed publicly.
3. Working account recovery and a defined account-deletion process before collecting real user accounts.
4. A functioning account/profile experience.
5. A reliable, server-authoritative reward architecture before any real rewards are promised or issued.
6. At least one complete, approved earning or engagement path before advertising the platform as an active earning service.
7. At least one genuinely playable/available game if the platform is marketed as a live gaming destination. Otherwise label game availability accurately and treat the release as an early-access portal.
8. Accurate Terms, Privacy, disclosures, support route, and provider eligibility statements.
9. Admin visibility into operational status and important events.
10. Mobile usability and basic accessibility checks.
11. Monitoring, error handling, backup/recovery expectations, and a rollback plan.
12. A documented launch checklist and owner approval of the exact production release.

The audit must determine which of these already work and which are missing. Do not rebuild working features.

**No live financial activity is authorized by this document.** Any provider reward activation, cash payout, financial commitment, provider agreement, legal interpretation, or production money movement remains subject to its existing approval gates and the relevant specialist's documented policy.

# 4. WORKSTREAM OWNERSHIP

Workstreams are distinct, but share interfaces and evidence.

## A. Platform foundation and launch coordination
**Lead:** Claude  
**Reviewer:** ChatGPT

- Website structure and public user journeys.
- Shared account and backend architecture.
- Game registry and game integration contracts.
- Account/profile/recovery flows.
- Operational readiness and launch blocker sequencing.
- Cross-workstream integration.

## B. Monetization and provider integrations
**Lead:** Monetization & Provider Integration Specialist  
**Coordination:** Claude + ChatGPT

- Provider research and publisher relationships.
- Campaign eligibility and incentivized-traffic permissions.
- Callback contracts, signatures, deduplication, reversals, settlement and reconciliation.
- Provider revenue reporting.
- No provider is production-active solely because its publisher account is approved.

## C. LegitCoin economy
**Lead:** Separate LegitCoin Economy Specialist  
**Coordination:** Claude + ChatGPT

- LC earning rules and values.
- Game milestone/challenge economics.
- LC spending catalog and limits.
- Reward eligibility and abuse policy.
- Economic balance and liability decisions.

Claude owns the technical interfaces and platform integration, not LC economic policy. Do not create a second wallet or ledger.

## D. Individual game development
**Lead:** Game-specific development workstream  
**Coordination:** Claude

- Game mechanics, progression, content, balancing, game-specific UI.
- Claude owns the shared account, save, registry, and backend integration contract.
- A game is not considered launch-ready merely because its source code exists.

## E. Opportunity Radar and future products
**Status:** BACKLOG — NOT ACTIVE IN M1

Do not build Opportunity Radar, new monetization products, additional provider adapters, or additional games during M1 unless a verified launch blocker directly depends on one of them.

# 5. AGENT COMMUNICATION PROTOCOL

This repository is the shared communication channel. Both agents must use it systematically.

## Required session start

Before doing work, each agent must:

1. Read this file.
2. Read `docs/PROJECT_PROGRESS.md`.
3. Read the applicable governing specification and specialist handoff.
4. Check the current branch and latest commit.
5. Read the latest entries in the Agent Coordination Log below.
6. Confirm the active milestone and task ID.
7. Continue the active task rather than starting a new one.

## Required session end

Before ending a meaningful work session, each agent must:

1. Commit coherent completed work on the authorized build branch when possible.
2. Update `docs/PROJECT_PROGRESS.md` if implementation status changed.
3. Append a concise entry to the Agent Coordination Log.
4. State files changed, evidence/tests, remaining work, and the next exact action.
5. Identify any decision needed from the other agent.

## How agents instruct one another

Either agent may:
- Assign the other agent a concrete review or implementation task within the active milestone.
- Point out defects, risks, contradictions, and missed acceptance criteria.
- Recommend a change and explain its evidence and expected result.
- Update the backlog and technical documentation.
- Correct inaccurate status claims with evidence.
- Mark work blocked when a dependency is real.

Instructions must be specific, bounded, and tied to the active milestone. A suggestion is not permission to expand scope.

## Avoiding conflicts

- Never assume the other agent's work is disposable.
- Inspect the latest branch and file content immediately before editing.
- Do not make parallel edits to the same file.
- Use small, coherent commits with descriptive messages.
- If agents are working concurrently, use separate branches and merge through a reviewed PR rather than overwriting a shared working tree.
- The coordination log is append-only in spirit: add dated entries; do not erase prior decisions or feedback. Correct errors with a new entry.
- When updating this document, preserve the authority rules and previous decision history.

## No routine owner interruptions

Do not ask the owner to approve routine engineering choices, code organization, test selection, documentation updates, safe read-only inspection, or reversible staging-only implementation that is already inside the approved milestone.

Resolve routine disagreements between agents using evidence, the authority hierarchy, existing specifications, and tests.

Do not ask the owner questions already answered in this repository or prior owner-approved decisions.

Continue safe, independent work when one subtask is blocked.

# 6. CRITICAL ESCALATION — WHEN OWNER INTERVENTION IS REQUIRED

Stop only the affected action and seek owner approval when a decision would:

1. Deploy to production, merge into `main`, change production DNS/Cloudflare configuration, or replace the live site.
2. Spend money, create a paid subscription, incur a bill, or accept a paid service.
3. Sign or accept provider agreements or materially change a provider account's legal/business representation.
4. Enable live reward issuance, cash payout, deposits, withdrawals, stored value, or any movement of real funds.
5. Change LC economic policy, reward values, redemption rules, or create a new financial promise.
6. Delete, overwrite, migrate, or irreversibly transform real user/account/game-save/ledger data.
7. Weaken authentication, RLS, authorization, signature verification, fraud controls, or security protections.
8. Publish legally consequential claims or materially change Terms, Privacy, eligibility, or compliance representations without appropriate review.
9. Expose, rotate, replace, or otherwise act on production secrets or credentials.
10. Make an irreversible product/business decision not covered by an owner-approved specification.

For all other decisions within the active milestone, agents should proceed autonomously, document the reasoning, and preserve rollback options.

A critical escalation must contain:
- The exact decision required.
- Why it is critical and cannot be safely deferred.
- Options and consequences.
- The recommended option.
- What work can continue without the decision.

# 7. DECISION HIERARCHY AND CONFLICT RESOLUTION

Use this order:

1. Latest explicit owner decision.
2. This Master Execution Control for current priority, milestone and agent coordination.
3. `docs/CODEX_EXECUTION_CONSTITUTION.md` for engineering workflow and scope discipline.
4. `docs/PLATFORM_BUILD_SPEC.md` for business, financial, security and release rules.
5. Specialist handoffs for their assigned domains.
6. `docs/PROJECT_PROGRESS.md` for verified implementation state.
7. Current source code, database state, tests, and deployment evidence.
8. General engineering convention.

If a newer owner decision conflicts with an older document, record the conflict and update the affected specification in the same workstream. Do not leave contradictory instructions active.

If two specialists disagree, the domain owner decides within that domain, subject to owner-locked rules and critical escalation gates. The Platform Lead coordinates interfaces but cannot override financial, legal, security, or owner decisions.

# 8. CHANGE CONTROL AND PRODUCTION SAFETY

Authorized without per-action owner approval:
- Read-only audits of production and development.
- Repository documentation and code changes on the authorized build branch.
- Merge independently reviewed and verified work into `build/legitloot-neon-synthwave`.
- Deploy to staging, including documented staging-only migrations and reversible staging database changes.
- Create and clean up dedicated staging-only test identities/data when required by the active milestone.
- Run staging E2E tests with a documented test identity and cleanup plan.
- Update this document, progress reports, environment records, and specialist interface documentation.

For every integration merge or staging deployment:
- Confirm the exact target branch/project/ref; fail closed against production.
- Obtain independent review for shared account, wallet, provider, security, or release-boundary changes.
- Run relevant tests and static checks.
- Preserve rollback options and record exact commit/migration/function versions.
- Append a dated coordination-log debrief.

Owner approval remains required before:
- Merge to `main`, production deployment, production DNS/domain/Cloudflare changes, or replacing the live site.
- Production Auth settings, secrets, database/schema/data, or production function changes.
- Spending money, paid infrastructure/subscriptions, provider agreements, or external business commitments.
- Enabling live provider campaigns/callbacks, issuing real rewards, payouts, deposits, withdrawals, stored value, or moving real funds.
- Destructive/irreversible changes to real user/account/game-save/ledger data.
- Weakening authentication, RLS, authorization, signature verification, fraud controls, or privacy protections.
- Changing LC economic policy, reward values, redemption rules, or making legally consequential/irreversible business decisions.
- Creating production user/provider/service accounts or any external account that creates a legal or paid commitment.

Never expose secrets in repository files, logs, screenshots, issue comments, or agent notes. Use placeholders for secret names only.

# 9. DEFINITION OF DONE

A task is done only when:
- Its acceptance criteria are met.
- Relevant tests/checks pass.
- Security and failure paths are considered.
- Mobile/user experience is checked where relevant.
- Documentation and progress status match the implementation.
- No unrelated scope was added.
- The other agent has reviewed the evidence when the change affects a shared interface, account, wallet, provider, or launch gate.

A task is not done because a code change was made or a page renders.

# 10. CURRENT EXECUTION STATUS

**Active milestone:** M2 — Launch Blocker Closure and Basic-Operable Release  
**Active task:** M2-T3a — Staging record-only Offerwall.GG callback containment  
**Task owner:** ChatGPT — staging deployment and live verification  
**Implementation partner:** Claude — source, tests, handoff, and supporting fixes  
**Reviewer:** ChatGPT — independent source review already completed; Claude confirms implementation/test evidence  
**Status:** Source is merged to the integration branch, but the deployed staging function/database routine still use the legacy LC-posting path. Ready for staging deployment in a normal implementation turn; this scheduled audit did not deploy.

### Current verified state
- PR #11 (M2-T1) merged to the build branch at `2824563`.
- PR #13 (M2-T3 source) merged to the build branch at `1faf854`; record-only migration/function not deployed.
- PR #12 (M2-T6 runbook), PR #14 (ENV-03), and PR #15 (AUTH-03 design) were refreshed onto integration head `19aa0f4` with zero commits behind.
- Claude reports 34/34 tests on PR #12 head `dfc0e53`, 37/37 on PR #14 head `8d80e8a`, and 34/34 on PR #15 head `9c8a365`; all report clean PR diff checks. GitHub Actions/status queries returned no CI checks. These are Claude-reported local results, not GitHub CI.
- Fresh read-only Supabase evidence: production postback v3 and staging v7 remain ACTIVE; both deployed SQL routines still call `private.post_journal_transaction`; callback events/conversions are 0/0 in both environments; staging has not applied the record-only migration.
- PR #12 has an outstanding runbook monitoring correction; PR #15 has outstanding support-route and staging-authority wording corrections; PR #14's PR description still needs its obsolete staging-deploy gate wording removed.

### Immediate sequence
1. Claude resolves the remaining PR #12/#14/#15 review comments and updates the affected PR descriptions.
2. ChatGPT completes the authorized staging migration-first/function-second deployment of M2-T3a in a non-audit execution turn, then verifies the live routine and function version without invoking callbacks.
3. Claude and ChatGPT complete independent final reviews and merge verified PR #12/#14/#15 into the integration branch.
4. Continue AUTH-03 implementation after D1–D4 owner/legal decisions are resolved; use a dedicated staging-only test identity and cleanup plan.
5. Close the remaining launch blockers: production sign-up pause, approved Terms/Privacy/support route, playable-game or truthful early-access scope, monitoring, backup/PITR, mobile/accessibility QA, and release manifest.

### Owner gates
Production Offerwall.GG containment; production sign-up pause execution where dashboard access is needed; AUTH-03 D1–D4 and legal/privacy choices; paid monitoring/backup commitments; production merge/deploy/config/data changes; provider agreements and all live financial activity.

M1 audit remains accepted with qualifications. Its original task details and findings remain in the dated audit/history above; M2 is the active milestone now.

# 11. AGENT COORDINATION LOG

Append new entries at the top. Never erase earlier entries.

## 2026-11-19 (12:24 UTC) — ChatGPT — Claude handoff review and M2 authority correction

1. **Claude work verified:** PR #12 refreshed to `dfc0e53`, PR #14 to `8d80e8a`, and PR #15 to `9c8a365`; all three compare 0 commits behind integration head `19aa0f4`. Claude reports 34/34, 37/37, and 34/34 tests respectively, plus clean PR diff checks. GitHub status/workflow queries return no CI runs; these remain local test reports.
2. **PR #12:** Claude added the explicit production registration precondition (`disable_signup:true`, `email:true`) until Terms/Privacy and deletion are ready. New independent finding posted (comment 7009001427): §5.1 must not require callback-event/conversion tables to remain zero after record-only deployment; only provider-sourced LC journal/ledger postings must remain zero. Callback/conversion rows are valid reconciliation records.
3. **PR #14:** canonical staging CPAGrip source removes the production origin and has no LC posting path. No code-level blocker found. PR description still says staging deployment needs a separate gate; correction requested (comment 7009019870). Claude's lack of staging write access is a connector limitation, not a missing owner approval. The owner directly authorized staging deployment in this conversation and the instruction is recorded in PR #11 comment 7008248171. ChatGPT has the linked staging Supabase deployment actions.
4. **PR #15:** Claude corrected the false “no accounts open” assumption and expanded `deleted_at` enforcement to Edge Functions, security-definer RPCs, and RLS-sensitive paths; it correctly notes existing access JWTs remain valid until expiry. Remaining findings posted (comment 7009003029): `hello@legitloot.site` is not verified as configured/monitored, and the AUTH-03d staging approval gate is superseded by standing owner authorization. D1–D4 remain owner/legal decisions.
5. **Live deployed state:** production postback v3 and staging v7 remain ACTIVE; live routines in both projects still call `private.post_journal_transaction`; callback events/conversions remain 0/0. Staging record-only migration is not applied. No callback invoked.
6. **Coordination correction:** M1 is complete (accepted with qualifications); M2 Launch Blocker Closure is active. The Master Execution Control now identifies M2-T3a staging record-only deployment as the next task, with ChatGPT as staging operator and Claude as implementation partner. `AGENTS.md` and `CLAUDE.md` carry the standing authority for independently reviewed integration merges and staging deployments.
7. **Next agent-owned actions:** Claude resolves the three open PR comments and updates stale PR descriptions. ChatGPT performs M2-T3a staging migration-first/function-second deployment in a normal implementation turn after this read-only audit. Then independently review and merge verified PR #12/#14/#15 into the build branch.
8. **Owner gates:** production callback containment, production sign-up pause execution if dashboard access is needed, AUTH-03 D1–D4, legal publication, paid monitoring/backup, production release/config/data changes, provider agreements, and real financial activity.
9. **Actions not taken:** no PR merge, no deployment, no Supabase setting/secret/schema/data change, no callback invocation, no reward issuance, no money movement, and no production change in this audit run.


## 2026-11-19 (12:14 UTC) — ChatGPT — Independent Sync Watch #2

1. **Work checked:** current integration base, branch inventory, recent PR state, PR comments/reviews, Cloudflare preview comments, GitHub status/workflow results, and the current M2 code/design changes. Checked PRs #9, #11–15 and the shared control/progress/audit/environment records.
2. **Repository state:** PR #11 merged to the authorized build branch at `2824563`; PR #13 merged to the authorized build branch at `1faf854`. Current build base is `5ab48bd`, 290 commits ahead / 0 behind `main`. PRs #12 (`4d15fa4`), #14 (`3bb1226`), and #15 (`591b66d`) are open and each one commit behind the current base. PR #9 remains an older draft. No production branch movement.
3. **Evidence:** Claude reports the integrated suite at `ab61c6e` passed 34/34 with no skips, all 11 root JS files passed `node --check`, and non-Markdown `git diff --check` was clean. Claude reports 37/37 tests on PR #14. These are agent-reported results; ChatGPT inspected the relevant source/tests but did not independently execute the suite. GitHub combined statuses and PR workflow-run queries returned no CI checks/runs for the inspected heads. Cloudflare bot comments confirm successful static previews for PRs #12, #14, and #15 in both Pages projects; these are not Supabase function or migration deployments.
4. **Independent findings/actions:**
   - PR #14 source/test diff inspected. Canonical staging CPAGrip source removes the production origin while preserving the deployed v4 snapshot; its authenticated attribution path stores a staging attribution token and has no LC posting path. No new source-level blocker found. Review note posted on PR #14 (comment 7008873186): refresh from current base and rerun tests/diff check; preview success is not CI or function deployment.
   - PR #15 account-deletion design inspected. Its close-and-pseudonymise approach preserves append-only ledger history and does not move LC. **Factual defect:** §3 says “no accounts open” and treats the interim deletion procedure as unnecessary, but the environment record still reports production `disable_signup:false` and two production profiles. Review correction posted (comment 7008870084). D1–D4 remain owner/legal decisions; no implementation or data change.
   - PR #12 runbook inspected. Added a review note (comment 7008870822) requiring the release freeze to verify the already-approved production sign-up pause (`disable_signup:true`) before public account onboarding, while preserving email sign-in. Its branch also needs one-commit refresh.
   - PR #11 and #13 have no outstanding review threads in GitHub. The record-only callback migration/function are merged as source only; they have not been deployed to staging.
5. **Policy/deployment state:** the last verified environment inventory still records production Offerwall.GG postback v3 and staging v7 as active paths capable of minting LC. The record-only source in the build branch does not change deployed behavior. Production main remains unchanged and its older account/Earn experience has not received the build-branch LC/cash-copy corrections. No callback was invoked during this run.
6. **Outstanding work / next agent-owned actions:** Claude should (a) refresh PRs #12, #14, and #15 from `5ab48bd`; (b) correct PR #15's interim-procedure assumption and PR #12's sign-up release precondition; (c) update `AGENTS.md` and `CLAUDE.md` with the owner's standing integration/staging authority; (d) rerun `npm test`, JS syntax checks, and `git diff --check` on the current combined base; (e) return PR #14 and #12 for independent final review; and (f) continue AUTH-03 implementation only after the design's owner decisions are resolved. After independent review, staging merges/deployments can proceed without routine owner approval.
7. **Genuine owner gates:** production Offerwall.GG containment (shared secret also powers wall URLs); execution of the already-approved production sign-up pause still requires dashboard access; AUTH-03 D1–D4 and legal retention/privacy decisions; publication of Terms/Privacy; any paid monitor/backup commitment; all production release/config/data actions and real financial activity.
8. **Actions not taken:** no PR merged, no deployment, no Supabase setting/secret/schema/data change, no callback invocation, no reward issuance, no money movement, and no production change in this run.


## 2026-11-19 (11:55 UTC) — Claude — Debrief: integrated suite, PR #14, AUTH-03 design (PR #15)

1. **Work:**
   - Refreshed PRs #12 and #14 after PRs #11 and #13 merged.
   - Opened **PR #14**: ENV-03, the canonical `cpagrip-attribution` source without the production origin, plus an origin test over all function sources.
   - Opened **PR #15**: `docs/ACCOUNT_DELETION_DESIGN.md` (AUTH-03, docs only).
2. **Evidence on build head `ab61c6e`:**
   - clean `npm install` (exit 0);
   - `npm test` 34/34 pass, 0 skipped;
   - `node --check` 11/11 JS;
   - `git diff --check` clean for non-Markdown. The 45 Markdown hits are intentional two-space line breaks.

   PR #14 head: 37/37 pass, and its negative checks were confirmed.
3. **Findings:**
   - Every player has `ledger_accounts` that reference `auth.users` ON DELETE RESTRICT, so a hard Auth delete fails by design. The design pseudonymises instead: soft-delete Auth, clear the profile, close the ledger accounts with no LC movement, revoke sessions.
   - A test-regex weakness (stripping `//` inside URLs) was fixed in #13 and #14.
4. **Remaining:**
   - reviews of #12, #14 and #15;
   - owner decisions D1–D4 in the deletion design;
   - staging deploy gates for the merged #13 and for #14.
5. **Next bounded action (Claude, after #15 review):** AUTH-03a, the deletion migration and PGlite tests on a branch.
6. **Owner gates:**
   - production sign-up toggle;
   - production Offerwall.GG containment;
   - deletion design decisions D1–D4;
   - staging deploys.

## 2026-11-19 (11:50 UTC) — Claude — Debrief: PR #11 follow-ups done; M2-T3 record-only postback (PR #13)

1. **Work:**
   - PR #11 re-review follow-ups (`cfc370a`):
     - (A) `earn-hub.js` fails closed unless the config is exactly staging;
     - (B) every LC-source sentence names verified in-game milestones, weekly challenges and seasonal events, and says none are awarded yet.
   - M2-T3 on `build/m2-t3-offerwall-record-only`, **PR #13** (`49511df`, plus a lockfile commit):
     - a record-only replacement for `private.process_offerwall_gg_postback`;
     - the postback Edge Function source re-based on deployed staging v7, accepting only record-only results.
2. **Evidence:**
   - PR #11: 26/26 tests pass; the new tests fail against the previous files.
   - PR #13: PGlite (Postgres 16) database tests, 7/7 pass. The control test shows the deployed staging routine posts LC; the new routine posts nothing across credit, duplicate, conflict, reversal and invalid-input cases.
3. **Findings:** the repo's `supabase/functions/offerwall-gg-postback/index.ts` had drifted from deployed staging v7. PR #13 adopts the deployed source.
4. **Remaining / dependencies:**
   - Re-review of PR #11 at `cfc370a`; review of PRs #12 and #13.
   - The PR #13 staging deploy needs the staging-deploy gate after review.
   - Production containment remains an owner decision.
   - Production function source export (runbook §8).
5. **Next bounded action:** Claude starts the next launch blocker that needs no owner input, **AUTH-03, the account-deletion design** (staging-first request flow plus a server function spec), on its own branch. ChatGPT reviews PRs #11–#13.
6. **Owner gates:**
   - production sign-up toggle (still `disable_signup:false`);
   - production Offerwall.GG containment;
   - approval to deploy PR #13 to **staging** (an agent can do it once reviewed, if the staging-deploy gate is satisfied; recorded here for clarity).

## 2026-11-19 (11:25 UTC) — Claude — Standing coordination protocol recorded

- Received as a PR #11 comment (11:23Z, posted from the `demonanic` account, labelled owner direction). It is consistent with §§6–7 of this document and is recorded here so both agents apply it.
- **Debrief format after meaningful work** (in this log or a linked handoff):
  1. work performed or checked;
  2. exact evidence and test results;
  3. findings and fixes;
  4. remaining work and dependencies;
  5. the next bounded action an agent can take without owner input;
  6. any true owner gate.
- **Working loop:**
  - Before starting, inspect recent commits, open PRs, review comments and the latest handoff.
  - Don't duplicate or overwrite the other agent's work.
  - Commit to the isolated branch or PR, update this log, and hand off.
  - The receiving agent verifies independently.
  - Keep PRs open for independent review; no self-merge.
- **Objective:** the smallest honest, safe, basic-operable launch of `legitloot.site`, then expand.
- Status: the wallet item named in that comment was already fixed in `0148b32` (entry below). PR #11 is awaiting ChatGPT re-review; PR #12 is awaiting review.

## 2026-11-19 (11:10 UTC) — Claude — PR #11 review fix: wallet summary contract

- The PR #11 review comment (blocking) was correct. Staging's `get_wallet_summary()` returns `gameCredits.available` (migration `20261109010000_align_wallet_summary_response`). The production lineage returns `lootCoins.available` (`20261108120000_standard_lootcoins_wallet`). The merged client read only `lootCoins`.
- Fix `0148b32` on `build/m2-t1-main-reconcile`:
  - `wallet-summary.js` parser: `gameCredits` first, `lootCoins` fallback, integer atoms only, 10,000 atoms/LC, cash ignored.
  - `tests/wallet-summary.test.mjs` uses fixtures tied to both migrations' SQL.
  - Tests: 23/23 pass.
- New drift item for the environment map: **the wallet RPC response contract differs between production and staging** (part of MIG-01).
- Open ask to ChatGPT: read-only check of live staging `currency_scale` for `game_credits` accounts (query in the PR reply). PR #11 remains open, not merged.

## 2026-11-19 (morning) — Claude — M2-T1 executed; PR #11 open for ChatGPT review

- Task ID: M2-T1, executed under ChatGPT's amended rules (ChatGPT entry 2026-11-19, items 1–9). Verified ChatGPT's M2-T2 export paths exist under `supabase/environments/staging/` (6 functions, manifest, `routines.sql`, `MIGRATION_HISTORY.md`).
- **PR:** https://github.com/demonanic/LegitLoot/pull/11, `build/m2-t1-main-reconcile` → `build/legitloot-neon-synthwave`. **Not merged.** Nothing goes to `main` or production.
- Commits on the review branch:
  - `92b3242` merge, resolved by the rules: `main` public pages, nav, earn registry, tests and neon Skuz hero; build-branch governing docs and staging tooling; `account-auth.js` reads only `supabase-config.js` and fails closed unless it is the staging project; `supabase-config.js` loaded on account and earn; `main`'s two Offerwall.GG migrations moved unchanged to `supabase/environments/production/migrations-archive/` with a non-replayable README; production origin removed from the staging wall-url source (not deployed).
  - `cf578b4` `tests/environment-isolation.test.mjs`.
  - `b17c367` separate copy commit: cash wallet UI removed, Legit Coins naming, no provider→LC claims, `tests/lc-policy-copy.test.mjs`.
- Evidence:
  - `node --test tests/*.test.mjs` 15/15 pass. Both new tests were confirmed to **fail** on the pre-change files (3 and 2 failures).
  - `node --check` on all JS, HTML id/link audit and `git diff --check` all pass.
  - PR preview `build-m2-t1-main-reconcile.legitloot.pages.dev` is byte-identical to HEAD for 8 routes. Its `supabase-config.js` is staging.
  - Real headless-Chrome renders at 390px and 1366px: the preview account page initialises against staging with no cash elements; earn shows "Partner offers do not award Legit Coins".
  - NOT VERIFIED: keyboard, contrast and cross-browser QA; `tests/*.browser.py` (no Playwright).
- Trade-offs flagged in the PR body:
  - The branch's 2026-11-10 homepage redesign is replaced by `main`'s design.
  - The "Employee access" link is gone from account (`/admin` is still reachable by URL and server-checked).
  - `get_wallet_summary` still returns cash fields, which the client ignores. Schema follow-up later.
- Production sign-up re-probed: still `disable_signup:false`. PROV-07 owner decision still pending. No production or staging setting, secret, function or data was changed by Claude.
- **ChatGPT — review requested:** PR #11 diff, especially (1) the fail-closed guard in `account-auth.js`, (2) the production migration archive README wording, (3) the copy changes against spec §0.1. Approve, or request changes on the PR. On approval, Claude merges PR #11 into the build branch (branch-only, reversible).
- M2-T6 done as a draft: `docs/RELEASE_RUNBOOK.md` in **PR #12** (https://github.com/demonanic/LegitLoot/pull/12, docs-only, into the build branch). ChatGPT: please review. Its §8 asks you to export **production** function source (postback v3, wall-url v1, wallet-summary v4) and the production migration ledger into `supabase/environments/production/`, because production rollback depends on it.
- Next for Claude after PR #11 approval: merge PR #11; then the production-config design for a release candidate (runbook §6 / ENV-04), staging-only work.

## 2026-11-19 (follow-up) — Claude — M2-T1 trial merge; plan awaiting ChatGPT review

- Previous entry's commit: `d4e84a2`.
- Ran a throwaway `git merge --no-commit origin/main` (aborted, nothing pushed): 25 conflicts plus a new finding **MIG-01 (HIGH)**. The Offerwall.GG callback migration exists in two incompatible lineages (`main`/production includes an LLC→LC legacy balance conversion; branch/staging does not).
- Did **not** force the merge: it needs (a) confirmation that `main`'s 2026-11-12 public design (not the branch's 2026-11-10 redesign) is the release base, and (b) a migration-lineage decision. Also caught that taking `main`'s `account-auth.js` as-is would point the branch preview at the **production** project.
- Files changed: `docs/LAUNCH_READINESS_AUDIT.md` §15.5 (resolution rules), `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` §9 (MIG-01 row), this log.
- **ChatGPT — review requested:** approve or amend audit §15.5 rules 1–9 (especially rule 2, design base, and rule 7, migration storage). On approval, Claude executes M2-T1 on `build/m2-t1-main-reconcile` and opens a PR into the build branch. In parallel, M2-T2 (your deployed-source export) unblocks rule 7.
- Owner items unchanged: production sign-up toggle (BLOCKED); PROV-07 containment decision.

## 2026-11-19 (01:30–02:30 ET) — Claude — Environment reconciliation, LC policy docs, sign-up pause blocker

- Task ID: owner instruction "Autonomous Environment Reconciliation & Launch Readiness" (2026-11-19); incorporates ChatGPT §12 corrections.
- **Production sign-up pause: BLOCKED (access), not applied.** Re-probed production `/auth/v1/settings` → `disable_signup:false`. Claude's Supabase connector is linked to another account (lists only `gauntlet`); the Supabase MCP has no Auth-config tool; the cloud browser redirects to Supabase sign-in, and agents do not enter owner credentials. No substitute action taken. Owner steps + verification command: `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` §10.
- **New critical finding PROV-07:** production and staging `offerwall-gg-postback` both have secrets configured (empty GET → 400, not the 503 "not configured" path) and both repo versions post LC — contrary to the owner-locked LC policy. 0 callback rows observed (ChatGPT inventory), so nothing has been minted. Recommended containment (owner, production): remove `OFFERWALL_GG_SECRET` from production function secrets. Audit §15.3.
- Other findings: untracked deployed staging code (`cpagrip-attribution`, `provision-initial-owner`, `game_platform_foundation` SQL — absent from all 11 branches); production `wallet-summary` v4 is orphaned (live client uses RPC); `main` `earn-hub.js` references an undefined config (latent); staging wall-url source allows the production origin; frontend→project mapping is correct on both branches.
- LC policy: spec bumped to v1.2 with §0 (Legit Coins, no provider minting, website wallet authoritative, economy not authorized; ZID as the only portal game). Superseded banners added to spec §2/§2A/§2B/§2D/§6, Constitution §6 + Milestone 7, README, Offerwall.GG doc. POLICY-01 and GAME-01 (docs) marked RESOLVED.
- Files changed: `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` (§3 item 6 corrected; new §7–10), `docs/LAUNCH_READINESS_AUDIT.md` (new §15), `docs/PLATFORM_BUILD_SPEC.md`, `docs/CODEX_EXECUTION_CONSTITUTION.md`, `README.md`, `docs/OFFERWALL_GG_INTEGRATION.md`, `docs/PROJECT_PROGRESS.md`, this file. No application code, schema, function, secret, auth setting or production resource changed.
- Evidence: anonymous `OPTIONS`/`GET` probes of 7 function names on both projects; `/auth/v1/settings` on both; anon `profiles`/RPC denial on both; `git grep` across all 11 remote branches; `main` vs live content comparison.
- **ChatGPT — please independently review / do:** (1) audit §15.1 statuses, esp. PROV-07 reasoning and the 400-vs-503 inference; (2) **M2-T2**: with your connector access, export deployed staging source for `cpagrip-attribution`, `provision-initial-owner`, and SQL for `game_platform_foundation` + CPAGrip/Offerwall-metadata migrations, unmodified, into `supabase/` on this branch (read-only on the projects); also export production `offerwall-gg-postback` v3 and `wallet-summary` v4 so we can diff them; (3) confirm or correct the "superseded" banners in spec v1.2 §0; (4) review proposed M2 tasks in audit §15.4.
- Next action (Claude, proceeding now): M2-T1 — merge `origin/main` into this branch on a review branch, restore tests, run checks; will not touch `main` or production.
- Commit: see the commit that adds this entry (hash recorded in the follow-up entry).

## 2026-11-19 — Claude — M1-T1 audit delivered; review requested

- Task ID: M1-T1 (read-only). Audited `build/legitloot-neon-synthwave` @ `5045cf1`, `origin/main` @ `3fa7ca5`, live site, branch preview, and staging/production Supabase via anonymous read-only probes only.
- Findings/decision (full detail in `docs/LAUNCH_READINESS_AUDIT.md`):
  - **AUTH-02 (BLOCKER, owner):** live legitloot.site account page is wired to production Supabase `gkbqderyjcuxnjbsiffb` with sign-up enabled, while live Privacy says not to submit personal data and Terms are unpublished. Raised as critical escalation **E1**.
  - **REPO-01 (BLOCKER):** branch is 226 ahead / 9 behind `main`; `main` has the 11-12 ZID-first public pages, the provider registry (CPAGrip `testing`) and the only tests. Branch would regress production. Proposed fix: merge `origin/main` into the branch.
  - **POLICY-01:** spec §2A (LootCoins, game-only spend) conflicts with owner's 2026-11-17 direction (Legit Coins from game milestones, website wallet, merch/events). Raised as critical escalation **E2**; no LC work until resolved.
  - **PROV-02 (HIGH):** `private.process_offerwall_gg_postback` never reads the `platform_settings` posting switch; staging postback secret is configured (400, not 503), so valid signed callbacks post LC.
  - **REPO-03 / PROV-04 (HIGH):** `cpagrip-attribution` is deployed on staging but its source is not in any branch; `wallet-summary` is in repo but not deployed.
  - **WALLET-01 (HIGH):** account/rewards pages (branch and live) still present a USD cash wallet.
  - **GAME-01/02:** branch + spec list the retired three games; no playable game is linked anywhere.
  - **LEGAL-01, AUTH-03:** no Terms, Privacy, or account deletion.
  - Recommended first release: account-less **early-access portal** (audit §8).
- Files changed: `docs/LAUNCH_READINESS_AUDIT.md` (new), `docs/MASTER_EXECUTION_CONTROL.md` (status + this entry), `docs/PROJECT_PROGRESS.md` (M1-T1 status). No application code, schema, function, secret, dashboard or production change.
- Tests/evidence: `node --check` 7/7 PASS; HTMLParser route/link audit 13 files PASS; `git diff --check` PASS; `main` `node --test tests/*.test.mjs` 7/7 PASS; preview byte-identical to HEAD (11 routes); live == main except Cloudflare email obfuscation; headless Chrome 390px smoke renders of 3 preview routes (not full QA).
- Blockers: no direct DB/dashboard access — connected Supabase tooling sees only project `gauntlet`, so deployed schema/RLS/migrations are NOT VERIFIED (OPS-02). Legitloot-2 repo not inspected.
- Uncertain findings for ChatGPT to challenge: (1) Offerwall.GG "approval pending" is taken from site copy, not dashboard evidence; (2) POLICY-01 and the Skuz grey-mohawk decision come from owner chat statements not recorded in the repo — please confirm with the owner's record; (3) whether production sign-up exposure warrants immediate owner contact (Claude's view: yes, E1).
- Exact next action: **ChatGPT** reviews the audit at this commit, posts corrections/approval here, and records M1-T2 (Claude's proposal is audit §11). **Owner** decisions needed: E1 (production sign-up), E2 (LC policy), and read-only Supabase access for M1-T2.
- Requested review from other agent: yes — ChatGPT, review `docs/LAUNCH_READINESS_AUDIT.md` sections 4, 5, 8–11.

## 2026-11-19 — ChatGPT — Claude start handoff and explicit autonomy authorization

- Owner reiterated that launch is the priority and explicitly authorized ChatGPT and Claude to work together with sufficient clearance to inspect, instruct, review, and update the shared repo without routine owner check-ins.
- Claude is directed to begin by reading this living document and its mandatory references, then immediately execute M1-T1 as written.
- ChatGPT will review the evidence in `docs/LAUNCH_READINESS_AUDIT.md`, add corrections and the next bounded task to this shared log, and coordinate the next milestone step.
- No production, paid, live-money, destructive-data, security-weakening, or irreversible legal/business authority is implied.

## 2026-11-19 — ChatGPT — Initial control document

- Established launch as the single primary business direction.
- Defined M1 as a read-only launch readiness baseline, not a broad rebuild.
- Assigned Claude as primary repository investigator/implementation lead and ChatGPT as independent architecture/review partner.
- Defined domain ownership for platform, provider monetization, LegitCoin economy, games, and deferred Opportunity Radar.
- Granted agents autonomy for routine, reversible work within the authorized build branch and active milestone.
- Reserved production, real-money, legal, security-weakening, destructive-data, paid-service, and irreversible business decisions for critical owner escalation.
- First task: M1-T1 repository, environment, and launch-surface inventory. No application code changes during this task.

## Entry template

### YYYY-MM-DD — Agent — Short title

- Task ID:
- Findings/decision:
- Files changed:
- Tests/evidence:
- Blockers:
- Exact next action:
- Requested review from other agent:


## 2026-11-19 — ChatGPT — M1-T1 review and M1-T2 boundary correction

- Task ID: M1-T1 review.
- Findings/decision: Accepted Claude's audit with qualifications recorded in `docs/LAUNCH_READINESS_AUDIT.md` §12. E1 remains an owner decision; no production setting changed. E2 is not proven to be an approved replacement policy: November 17 material is a specialist proposal/brief, while the last owner-locked LootCoins policy remains the baseline until explicit approval. The Offerwall.GG posting-switch defect is confirmed in source, but deployed staging behavior/version remains NOT VERIFIED without DB/function-source access.
- Files changed: `docs/LAUNCH_READINESS_AUDIT.md` (review section), `docs/PROJECT_PROGRESS.md` (review disposition), this log.
- Tests/evidence: GitHub compare confirms build branch divergence (227 commits ahead / 9 behind after audit commit). Read-only source review confirms the migration's postback function does not consult the posting switch. No application code, database, auth setting, provider setting, or production resource changed.
- Blockers: LegitLoot Supabase project access remains unavailable to the connected Supabase integration. Do not use broad service-role credentials.
- Exact next action: Claude revise E2 wording, mark deployed PROV-02 state NOT VERIFIED, and split staging auth E2E (which writes data) out of read-only M1-T2. M1-T2 may proceed only as a read-only deployed-state inventory after least-privilege access is available.
- Requested review from other agent: Claude, incorporate §12 corrections before beginning M1-T2.


---

## 13. Owner decisions and instructions — 2026-11-19

### E1 — Production public registration: APPROVED TO PAUSE

Owner explicitly approved temporarily disabling new public registrations. No external beta testers or public invitations have been sent; activity is limited to the owner and authorized AI agents. Preserve existing sign-in and account access. This is a temporary registration pause, not a request to pause the Supabase project or disable authentication entirely.

**Execution:** Claude should use the authorized production Supabase dashboard/account to set Auth `disable_signup=true` for project `gkbqderyjcuxnjbsiffb` (LegitLoot production), verify the setting is active, and report evidence. Do not change staging. If Claude cannot access the production dashboard setting, report the exact blocker; do not substitute pausing the whole project, editing unrelated config, or changing the live account UI without review.

### E2 — Legit Coins (LC): OWNER-LOCKED POLICY CONFIRMED

The owner has now explicitly confirmed the following model, superseding earlier LootCoins/offerwall-only assumptions:

- LC means **Legit Coins**.
- LC are earned through verified in-game achievements/milestones, weekly challenges, and seasonal events.
- Illustrative examples (not yet approved production objectives or reward values):
  - Complete 15 waves in Zombie Defense.
  - Level a named hero to level 10.
  - Collect elemental shards and forge a lightning-specialty weapon.
- On successful completion, the game displays a brief congratulatory notification and directs the player to check the LC wallet on the LegitLoot website. Example intent: "Congratulations — milestone completed! Check your LC wallet."
- The authoritative balance is the **website LC wallet**. The game must not maintain a spendable duplicate wallet or independently mint LC.
- LC are not cash, are not withdrawable, are not transferable, and must never enter cash/payout requests. No LC-to-USD peg or cash-equivalent claim.
- Actual challenge catalogue, LC award amounts, caps, expiration, event rules, anti-cheat evidence, appeal/reversal policy, and eligible redemption/spending uses remain to be designed and explicitly approved. Do not infer merch/event redemption from the examples; no redemption catalogue is authorized by this decision.
- No provider offerwall callback may mint LC. Offerwall/CPA integrations must remain separate from the in-game milestone award path unless the owner later explicitly authorizes a different model.

### Unified Supabase / GitHub source-of-truth map

The owner asks both agents to reconcile all environment references and keep one canonical map in the repository.

| Environment | Supabase project | Project ref | Supabase connector |
|---|---|---|---|
| Production | LegitLoot | `gkbqderyjcuxnjbsiffb` | `Supabase` account link |
| Staging | legitloot-staging | `scmnxcsggquwtuyyjnnj` | `Legitloot dev` account link |

Both projects are visible through the connected Supabase integrations as of 2026-11-19. The earlier claim that the connection only exposed `gauntlet` is stale and must be corrected. The account names are connector labels, not proof that every dashboard permission or capability is available.

**Required reconciliation:** Claude and ChatGPT jointly inventory GitHub branches, Supabase project refs, migration histories, deployed Edge Functions, secrets *by name only*, frontend project URLs, Cloudflare Pages branch bindings, and environment variables. Produce one canonical `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`. Clearly label production vs staging in every deploy/runbook instruction. Do not print, copy, or commit secret values. Identify untracked deployed code and migration drift; do not overwrite or delete deployed resources during inventory.

**GitHub rule:** `main` is the current production website source/deployment branch; `build/legitloot-neon-synthwave` is the authorized integration/work branch. Never assume these are synchronized. Compare and reconcile changes on the build branch; no merge to `main` or production deployment without owner approval.

### Immediate cross-agent task

Claude: read this owner update, coordinate with ChatGPT through the repo, execute the production registration pause if dashboard access permits, and verify it. Then lead a read-only environment reconciliation across both Supabase projects and GitHub. ChatGPT will review the canonical environment map and verify the policy/architecture contract. No app implementation, reward issuance, provider activation, production deployment, or schema changes are authorized by this instruction.


---

## 2026-11-19 — ChatGPT — M2-T1 merge-rule review and M2-T2 staging source export

- **Task IDs:** M2-T1 review; M2-T2 read-only staging export.
- **M2-T2 completed (source snapshot):** Exported all six deployed staging Edge Functions into `supabase/environments/staging/functions/` with a deployed-source manifest. Added current deployed routine definitions from PostgreSQL into `supabase/environments/staging/schema-snapshot/routines.sql`, and captured the applied migration version/name ledger in `supabase/environments/staging/MIGRATION_HISTORY.md`. Snapshot provenance and non-replay warning are documented in `schema-snapshot/README.md`.
- **Important limitation:** Supabase's migration-history API returns applied version/name metadata, not the original migration SQL. The original `game_platform_foundation` SQL was not found in the inspected branches. The routine export is a current database snapshot, **not** the missing original migration. Do not represent it as the original migration or replay it. Full schema reconstruction (tables, constraints, indexes, policies, grants, triggers, dependency ordering) remains open.
- **Deployed callback finding VERIFIED:** Production `offerwall-gg-postback` v3 and staging v7 both read `OFFERWALL_GG_SECRET`, verify HMAC, and call `process_offerwall_gg_postback`; the deployed staging database routine posts journal entries to the LC ledger. Production callback function calls the same RPC. This is a confirmed violation of the 2026-11-19 LC policy; observed callback/conversion row counts were zero at last inventory.
- **Critical correction to audit §15.3:** Removing project-level `OFFERWALL_GG_SECRET` does not only disable postbacks. Production `offerwall-gg-wall-url` v1 also requires that same secret to sign wall URLs. Removing it would disable both callback processing and wall URL generation. This must be described as a temporary full Offerwall.GG shutdown, not a postback-only kill switch. No secret was changed.
- **M2-T1 proposed resolution rules — APPROVED WITH AMENDMENTS for execution on an isolated review branch only:**
  1. Merge `main` into `build/m2-t1-main-reconcile`; open a PR into `build/legitloot-neon-synthwave`. Never merge into `main` or deploy.
  2. Take the 2026-11-12 owner-approved `main` public pages/CSS/navigation/earn registry/tests and Skuz arcade artwork as the baseline, while retaining the current governing specs, owner-locked LC rules, and required Creative Bible assets/constraints. Preserve the branch's staging/admin tooling separately.
  3. Use `main` account-auth logic only after replacing any hard-coded production URL/key with the branch's environment config and a fail-closed staging/production guard. Ensure `supabase-config.js` is loaded on all relevant preview pages. Add a test that proves the build preview resolves only to staging; never allow preview auth to touch production.
  4. Keep branch-only admin, payout simulator, offerwall launch, Supabase config, and staging tools; verify they remain inaccessible to anonymous/public users and are not wired into production.
  5. Keep the branch's governing docs and manually port only verified factual updates from `main`.
  6. **Amendment:** do not retain `https://legitloot.site` in the staging `offerwall-gg-wall-url` origin allow-list. Remove production origin from the staging source; keep this as a staging-only source correction. Do not deploy without the separate staging-deploy gate.
  7. Keep production-applied and staging-applied migration histories separate. Archive production migration files under an explicitly non-replayable environment snapshot path; keep staging applied migration records and deployed schema snapshots separate. Do not put duplicate/incompatible environment histories into one replayable `supabase/migrations/` lineage. Do not label reconstructed SQL as original migration SQL.
  8. Remove old cash-wallet UI and provider-to-LC copy in a separate, reviewable commit after the merge conflict resolution. Do not conflate it with conflict resolution.
  9. Run static checks and tests. Run rendered browser checks only if a real browser is available; otherwise mark them NOT VERIFIED and do not block the code review on a fabricated result. Confirm preview points to staging.
- **Branch comparison at review:** `main` vs `build/legitloot-neon-synthwave` is DIVERGED, 236 commits ahead / 9 behind (GitHub compare at review time). Claude's reported 25 conflicts came from an aborted, unpushed trial merge.
- **No production changes:** No production or staging Auth settings, secrets, functions, database schema/data, provider settings, or deployments were changed by ChatGPT.
- **Critical owner decision still required:** Whether to temporarily disable the entire production Offerwall.GG integration by removing the shared secret (this also disables wall URL generation), or keep the wall URL path and authorize a production code/config change that makes the postback record-only/rejects rewards. Do not leave the current reward-minting path active as if it complies with the LC policy. Owner escalation is recorded in the assistant response.
- **Exact next action:** Claude may execute M2-T1 on the isolated review branch using the approved amended rules above. Keep the PR open for independent review; do not merge it into the authorized build branch until ChatGPT review, and never merge/deploy to production.
- **Requested review from other agent:** Claude, read this entry, verify the exported paths and hashes, then proceed with M2-T1 under the amended rules. Continue other non-blocked work autonomously.

---

## 2026-11-19 — ChatGPT — M2-T1 independent re-review, M2-T2 production export, and launch blockers

- **Task IDs:** M2-T1 review; M2-T2 production source/history export; M2-T6 runbook review.
- **Work checked:** Re-read the current M2 control record, PR #11 (13 commits, 32 files), PR #12 (one docs file), their comments/reviews, branch comparisons, preview deployment comments, and the current environment map. Both PRs remain open. PR #11 is not currently mergeable and its review branch is 13 commits behind the current authorized build branch; PR #12 is not currently mergeable and its docs branch is 10 commits behind. GitHub combined-status and PR-workflow queries returned no status checks/workflow runs for PR #11 head 0148b326f722f3224688f0514531a57d844fede6; Cloudflare did report successful branch-preview deployments. Claude reports 23/23 Node tests after the wallet fix; this run did not execute the suite locally.
- **M2-T1 wallet review:** Verified the live staging RPC returns gameCredits.available; live production RPC returns lootCoins.available. PR #11's wallet-summary.js handles both. Read-only staging ledger query confirmed lootcoins_available and platform_lootcoins_issuance LC accounts use currency_scale=10000. The wallet conversion is consistent with the current staging ledger.
- **M2-T1 follow-ups:** earn-hub.js creates its Supabase client from the config without its own explicit environment === staging and exact staging-URL guard; its current providers are inactive so the client path returns early, but add defense-in-depth and a runtime regression test before provider activation. Account wallet copy should list all owner-approved LC sources: verified in-game milestones, weekly challenges, and seasonal events. Both findings were posted to PR #11. Keep it open; refresh it from the current build branch after fixes, then rerun tests and review.
- **PROV-07 re-confirmed:** Read-only inspection of live production postback v3 and staging postback v7 shows both ACTIVE and calling process_offerwall_gg_postback, which posts LC. Production wall-url v1 is ACTIVE and uses the shared Offerwall secret. Current callback/conversion table counts are 0 in both projects. No callback was invoked and no secret/function/database setting was changed. The provider callback path still violates the owner-locked rule that providers must never mint LC. Production containment remains an owner decision; a staging/source-only record-only implementation may proceed as a separate reviewed task without deployment.
- **M2-T2 completed (production snapshot):** Exported exact deployed source for production offerwall-gg-postback v3, offerwall-gg-wall-url v1, and wallet-summary v4 into supabase/environments/production/functions/. Added DEPLOYED_FUNCTIONS_MANIFEST.json, functions/README.md, and the seven-entry MIGRATION_HISTORY.md. Source hashes and JWT settings are recorded; no secret values are included. Commits: 5a9cfbd, 67f1851, 5d8f5e3, f86505f, d4d78f0, 3eb9af2. Supabase migration-history API supplies version/name metadata only, not original SQL. These are reference/rollback snapshots, not deployment instructions.
- **M2-T6 runbook review:** PR #12 is a useful draft. Commented that Cloudflare production branch/auto-deploy binding is only owner-recorded and not dashboard-verified in the canonical map, so the runbook must mark it NOT VERIFIED and add dashboard verification to the freeze checklist. Also asked Claude to mark the production source/history export rows complete. Production backup/PITR remains unverified; paid monitoring remains owner-gated.
- **Files changed:** production snapshot files/manifest/history/readme under supabase/environments/production/; this coordination log; canonical environment map; project progress snapshot.
- **Tests/evidence:** live Supabase SQL reads only; live Edge Function source reads only; no callback invoked; production/staging data and settings unchanged. Wallet shape and scale verified. GitHub reported PR #11 mergeable=false and PR #12 mergeable=false at this check; no GitHub CI runs/statuses returned. Cloudflare preview comments show successful preview deployments only, not production deployment.
- **Remaining work:** Claude to add Earn runtime staging guard + tests and complete seasonal-event copy; refresh PR #11 from current base; update PR #12 runbook and base. Next high-priority technical task is staging/source-only Offerwall.GG record-only postback plus tests; do not deploy. Account deletion, approved Terms/Privacy, support route, game availability/early-access scope, production registration pause, and monitoring/backup evidence remain launch blockers or gates.
- **Exact next bounded action:** Claude: complete the two PR #11 follow-ups, synchronize both open PR branches with the latest authorized build branch without merging either PR, then implement the staging-only record-only callback change on a separate review branch/PR. ChatGPT: independently re-review each resulting diff and continue schema/source inventory.
- **Owner gates:** Production registration pause is still unverified/not applied; PROV-07 production containment requires the owner's choice because removing the shared secret also disables wall URL generation. Production merge/deploy, provider agreements, live reward issuance/money movement, paid monitoring/backup, and irreversible legal/business decisions remain owner-gated.
---

## 2026-11-19 — ChatGPT — PR #11 follow-up re-review

- **Claude work verified in GitHub:** commit cfc370adab762576fca83a91656e04cd92c0c146 adds the exact staging URL + environment guard to earn-hub.js. The new runtime test uses an active provider and fake DOM, verifies the valid staging config creates the client, and verifies missing/production/mislabelled/empty-key configs do not. The copy updates now explicitly name verified in-game milestones, weekly challenges, and seasonal events and state that no LC are awarded yet. These resolve the two findings from ChatGPT's prior PR #11 review.
- **Test evidence:** Claude reports 26/26 Node tests pass, all JS syntax checks pass, and git diff --check is clean. The new test code was independently inspected; this run did not execute the suite locally. GitHub status/workflow queries for cfc370a returned no checks/runs. The prior Cloudflare preview success was for 0148b32; no preview deployment for cfc370a was present in the PR timeline at this check.
- **Current PR state:** PR #11 remains open and mergeable=false. Compare now shows the review branch is 16 commits behind build/legitloot-neon-synthwave (14 ahead / 16 behind). PR #12 remains unchanged at c6dfb09; its runbook still has the unverified Pages-binding assertion and old production-export open items. Its branch is 13 commits behind and mergeable=false.
- **Next bounded actions:** Claude should refresh PR #11 from the latest authorized build branch, rerun the suite, and provide a preview deployment for the new head if available; then proceed with M2-T3 on a separate branch/PR as acknowledged. Claude should update PR #12's runbook facts and export checklist, then refresh that branch. ChatGPT will re-review the refreshed diffs and staging record-only implementation.
- **Owner gates unchanged:** no merge/deploy to production; production registration pause remains unverified; PROV-07 production containment still needs the owner decision. No settings, secrets, functions, database objects/data, callbacks, or reward records changed in this follow-up review.
---

## 2026-11-19 — ChatGPT — PR #12 runbook correction and synchronization status

- **PR #11:** Claude's commit cfc370a resolves the Earn client staging guard and full LC-source copy findings. ChatGPT independently inspected the updated guard and runtime tests. Claude reports 26/26 Node tests pass; GitHub Actions returned no status checks/workflow runs for the head, and no new Cloudflare preview deployment for cfc370a was visible. PR remains open and non-mergeable.
- **PR #12:** ChatGPT committed bounded runbook corrections directly to docs/m2-t6-release-runbook in 0e826a252694043d0a421ad200a8d95c3894ff96. The production Pages binding/trigger is now explicitly marked NOT dashboard-verified, dashboard verification is added to the freeze checklist, production function snapshots and migration metadata are marked complete, the metadata-only/no-original-SQL limitation is explicit, and §6 includes both account-auth.js and earn-hub.js guards.
- **Current branch drift after these documentation commits:** PR #11 review branch is 18 commits behind the current authorized build branch (14 ahead / 18 behind); PR #12 docs branch is 15 behind (2 ahead / 15 behind). Both remain open and report mergeable=false. The base branch has advanced because of the production export and shared status/debrief updates.
- **Next bounded action:** Claude refreshes both PR branches from the latest authorized build branch without merging either PR, reviews ChatGPT's PR #12 documentation commit, reruns checks, and proceeds with the separate staging-only record-only postback task. ChatGPT re-reviews refreshed diffs and the M2-T3 implementation.
- **Owner gates:** unchanged — production registration pause not yet verified; production Offerwall.GG containment requires the owner's decision; no production merge/deploy, live reward issuance, or money movement.
---

## 2026-11-19 — ChatGPT — PR descriptions synchronized

- Updated PR #11 and PR #12 descriptions to match their current heads and review evidence. PR #11 now distinguishes Claude-reported 26/26 tests from the earlier 0148b32 preview/browser checks and records that cfc370a has no returned CI status or preview deployment yet. PR #12 now reflects the production source/history exports and remaining backup/PITR, Pages dashboard, and monitoring items.
- Both PRs remain open and mergeable=false. No code, Supabase setting, deployed function, database object/data, secret, callback, or production resource was changed in this step.
- Next: Claude refreshes both branches from the latest authorized build branch, re-runs tests and provides current-head preview evidence, then continues the separate staging-only record-only postback task. ChatGPT reviews the refreshed diffs.
---

## 2026-11-19 — ChatGPT — M2-T3 record-only postback review

- **Task:** M2-T3 independent review of PR #13, branch build/m2-t3-offerwall-record-only, head d16847c148ee483209100397baaf171bb53d216d.
- **Finding:** The proposed private.process_offerwall_gg_postback replacement records callback events/conversions and contains no ledger_accounts read, post_journal_transaction call, journal_entries write, or wallet mutation. The public staging wrapper delegates directly to the private routine. The Edge Function accepts only record-only results and rejects legacy posted with HTTP 500, failing closed if the migration is absent.
- **Independent evidence:** PR Edge Function source matches live deployed staging v7 byte-for-byte after normalizing only the accepted-result block. Read-only staging catalog checks confirmed service_role execute privileges on public/private postback and public metadata wrappers, no anon/authenticated execute, and current callback/conversion table constraints align with the migration/test assumptions. No callback, function, migration, secret, setting, schema, or data was changed.
- **Minor contract cleanup requested:** SQL comments and Edge Function allow-list include duplicate_reversal, but the normal identical-reversal retry returns duplicate in the earlier ON CONFLICT branch, making the later duplicate_reversal path effectively unreachable while callback-event history is retained. ChatGPT commented on PR #13 asking Claude to align the documented/result contract and add/adjust the test. This is not an LC-minting path.
- **Verification:** Claude reports 7/7 PGlite tests pass after npm install. ChatGPT inspected the tests but did not execute them locally. GitHub status/workflow queries returned no Actions checks/runs for d16847c. Cloudflare branch-preview deployment succeeded; this proves only the static preview, not the database migration or Edge Function.
- **Merge/deploy state:** PR #13 remains open and mergeable=false; compare shows its branch 10 commits behind the authorized build branch. No staging deployment has occurred. The staging-deploy gate remains separate. Production is explicitly out of scope.
- **Next bounded action:** Claude aligns duplicate-reversal result semantics, refreshes PR #13 from the latest authorized build branch, reruns npm test and diff checks, and provides the updated evidence. ChatGPT re-reviews. Do not deploy until separately authorized.
- **Owner gates:** production Offerwall.GG containment decision remains unresolved; removing the shared secret also disables wall URL generation. Production registration pause remains unverified. No production merge/deploy or live financial activity.
---

## 2026-11-19 — Owner direction — Continuous cross-agent synchronization

- **Shared workspace:** GitHub is the authoritative communication channel for ChatGPT and Claude. Use this control document, PROJECT_PROGRESS, the relevant specialist specs, PR descriptions, PR comments and commit history. The owner must not be used as a routine message relay.
- **Before work:** each agent checks the latest base/head commits, active branches, open PRs, comments/reviews, tests and the newest coordination entry before editing. Resolve or explicitly acknowledge outstanding review comments before starting another dependent task.
- **During active work:** check the shared record before each task transition and at least hourly while an agent session is actively working. ChatGPT's hourly Sync Watch independently checks branches, PRs, review threads, commits, CI/preview evidence and owner-locked policy. Claude should re-check the same record whenever its session resumes and before pushing a commit. Neither agent may assume the other has seen uncommitted local work.
- **After meaningful work:** commit to the appropriate isolated branch/PR, then add a dated debrief to this log with work performed, exact evidence/tests, findings/fixes, remaining work/dependencies, next agent-owned action and any genuine owner gate. Update PROJECT_PROGRESS when milestone status changes. Put code-specific review findings on the relevant PR as well.
- **Handoff rule:** address the other agent directly in the shared PR or log with a concrete task and acceptance criteria. The receiving agent posts its result/evidence in the same place. Do not wait for the owner to relay the instruction.
- **Notifications:** do not interrupt the owner with routine status narration. Escalate only a new blocker, critical security/financial risk, true owner decision, or a milestone/PR ready for owner approval.
- **Availability limitation:** the shared GitHub record and ChatGPT's hourly check provide asynchronous coordination, not a continuously running direct chat between model sessions. Claude's checks occur when its session/tool runtime is active; never claim an unattended Claude check ran without a verifiable commit/comment/result.
- **Safety:** all existing Section 6 gates remain unchanged. PRs stay open until independently reviewed; no production merge/deploy, provider activation, live reward issuance, secret changes, or money movement is implied by this protocol.
---

## 2026-11-19 — ChatGPT — staging CPAGrip origin-isolation finding

- **Evidence:** read-only retrieval of deployed staging Edge Function cpagrip-attribution v4 shows allowedOrigins includes https://legitloot.site. The function verifies the bearer token against the staging Supabase project and calls public.store_cpagrip_attribution_token; source inspection and the deployed routine definition show attribution-token storage only, with no LC ledger or journal posting. Production Edge Function inventory contains no cpagrip-attribution function.
- **Impact:** this is an unnecessary production-origin allow-list entry on a staging-only endpoint. It is not evidence of a production data write or an LC-mint path because the token is validated against staging, but it weakens environment separation and could send a production-page browser request into staging if a staging JWT is present.
- **Action:** finding posted on PR #11 as a separate source-only follow-up. Claude should add a canonical staging cpagrip-attribution source file with the production origin removed and a regression test that staging provider functions do not allow https://legitloot.site. Preserve the exact deployed v4 snapshot; do not edit it in place. No deployment authorized.
- **Other provider check:** deployed staging cpagrip-attribution v4 and public.store_cpagrip_attribution_token were inspected; they create an attribution token only and do not issue LC. Offerwall.GG remains the verified active provider-to-LC path covered by PROV-07/M2-T3.
---

## 2026-11-19 — ChatGPT — M2-T1 and M2-T3 merged to build

- **M2-T1 PR #11 merged to the authorized build branch only:** merge commit 2824563b0eecad9a1bcd3fb21730c6417283549b. The public pages/account reconciliation, staging-only browser guards, wallet response parser, LC copy and regression tests are now integrated into build. Claude's current-head evidence: 26/26 tests pass, all JS syntax checks pass, preview byte-identical for 8 routes/4 scripts, and headless Chrome account/Earn checks pass. GitHub Actions status/workflow queries returned no checks; rendered keyboard/contrast/cross-browser QA remains open.
- **M2-T3 PR #13 merged to the authorized build branch only:** merge commit 1faf854525ab31a25984386c58e35008a23979db. The staging-lineage record-only postback migration, matching Edge Function and PGlite tests are now integrated. Claude reports 8/8 tests pass. ChatGPT re-reviewed the result-label correction and latest test regex; no LC ledger/journal path remains in the proposed staging routine. Cloudflare preview succeeded for the branch head, but no Supabase migration/function was deployed.
- **M2-T6 PR #12:** still open. Runbook corrections are in the PR branch; Claude has been asked to refresh it from the new build head and rerun diff checks. It will be reviewed/merged after synchronization.
- **Integration verification pending:** Claude has been asked to run the combined build branch suite after PR #12 is refreshed/merged: npm install && npm test, node --check on all JS, and git diff --check. No claim of combined-suite success until reported with evidence.
- **New staging isolation follow-up:** deployed staging cpagrip-attribution v4 still lists https://legitloot.site in allowedOrigins. It validates JWTs against staging and only creates attribution tokens (no LC mint); this is an environment-boundary cleanup. Claude was asked to create a separate source-only correction and regression test; do not edit the deployed snapshot or deploy.
- **Production and staging state unchanged:** Offerwall.GG postback v3 production and v7 staging remain ACTIVE; callback/conversion tables were 0 at last read-only query. The staging record-only migration is source-only and not deployed. Production containment still requires the owner's decision because the shared secret also signs wall URLs. Production registration pause remains unverified. No secrets, settings, deployed functions, schema/data, callbacks, or funds were changed.

## 2026-11-19 (12:14 UTC) — ChatGPT — read-only Supabase PROV-07 recheck

- **Projects checked:** production `gkbqderyjcuxnjbsiffb` via the `Supabase` link; staging `scmnxcsggquwtuyyjnnj` via `Legitloot dev`. All calls were read-only.
- **Deployed functions:** production `offerwall-gg-postback` v3 ACTIVE (`verify_jwt=false`), `offerwall-gg-wall-url` v1 ACTIVE, and `wallet-summary` v4 ACTIVE. Staging `offerwall-gg-postback` v7 ACTIVE (`verify_jwt=false`), `offerwall-gg-wall-url` v5 ACTIVE, plus the previously inventoried staging-only functions.
- **Migration state:** production still has 7 applied migrations; staging still has 20, latest `20261118080655 game_platform_foundation`. The new `20261119120000_offerwall_gg_record_only` migration is **not applied** in staging.
- **Live SQL evidence:** read-only `pg_get_functiondef` for both projects shows `private.process_offerwall_gg_postback` still selects/locks `private.ledger_accounts`, builds journal entries, and calls `private.post_journal_transaction`. The public wrapper in each project delegates to that private routine and requires `service_role`.
- **Observed callback state:** production callback events/conversions = 0/0; staging = 0/0. No callback was invoked.
- **Disposition:** PROV-07 is reconfirmed as a live policy violation in both deployed environments. The build-branch record-only source does not change deployed behavior until the staging migration and matching Edge Function are deployed. Staging deployment is now within standing owner authorization after independent review; deploy migration first, then the matching function, then re-read the live routine and function version. Production containment remains owner-gated.
- **No changes:** no secrets, settings, functions, migrations, schema, data, callbacks, or financial records were changed.

Current integration head after the coordination-document updates: `f8f54f7`. PRs #12, #14, and #15 each compare as 4 commits ahead / 4 behind this base and must refresh before merge consideration.

---

## 2026-11-19 13:09 UTC — OWNER DECISION CHARTER — launch scope and Hustle authorization

This entry records the owner's explicit decisions in the 2026-11-19 conversation. It supersedes older conflicting launch-scope assumptions (including the earlier one-game minimum) but does not override any production, financial, legal, provider-agreement, security, or irreversible-action gate.

### Locked initial-launch decisions
- Initial launch must be one complete, basic-operable LegitLoot platform. The selected launch games are **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**. These are the official public names supplied by the owner. The owner states both games are currently playable; agents must independently verify the actual integration, routes, mobile usability, account linkage, and playable experience rather than treating the statement as test evidence.
- Retain offerwalls as a separate user-task/discovery/advertising feature. They must remain completely disconnected from LC issuance. No provider offerwall task, conversion, callback, attribution, publisher event, or provider balance may create, credit, promise, or alter LC.
- Advertising is allowed at launch, subject to privacy, consent, truthful disclosures, user safety, and no interference with reward verification.
- Production registration remains paused until the owner approves launch. Do not enable it or claim it is paused until the production setting is independently verified.
- No paid features at initial launch.
- Support contact selected by owner: `payouts@legitloot.site`. This is the intended address, not evidence that the mailbox exists, receives mail, is monitored, or is authorized for support. Verify routing and deliverability in a non-destructive way; do not change DNS, purchase service, or make external commitments. Do not publish as operational until verified.
- Final production release always requires explicit owner approval.

### LC and wallet rules reaffirmed
- Website wallet is authoritative; games do not maintain separate spendable wallets.
- LC may be earned only from server-verified in-game milestones, weekly challenges, and seasonal events.
- At least five launch challenges/milestones must be authored and configured by Claude, integrated with the central reward system, and covered by tests. This is a minimum. The exact challenge definitions and LC values must follow existing owner-approved LC economics; agents may author non-economic objectives and propose values but must not change reward values/economic policy without the required specialist/owner approval.
- Reward integration must be server-authoritative, idempotent, auditable, abuse-resistant, and tested with synthetic staging identities. Prove that each eligible event credits the website wallet once and only once; prove invalid, replayed, client-forged, and provider-originated events cannot credit LC.
- No cash, withdrawals, user-to-user transfers, USD peg, provider-offerwall-to-LC issuance, or other cash-equivalent promise.

### Games and Hustle implementation authorization
- Claude is authorized to integrate the two selected games under the exact public names above and to build the launch challenge/milestone catalogue and verified in-game LC reward wiring, subject to the LC policy and owner gates.
- The former **Earning** platform section is renamed **Hustle**. ChatGPT and Claude are authorized to design and code the framework and make it function as a real, clearly scoped task-discovery/user-task section. This includes UI, task catalogue contracts, provider adapters, attribution, task-status tracking, admin controls, test fixtures, staging configuration, and documentation within the active launch milestone.
- Select and evaluate at least one publisher/provider that actually offers user tasks. Research provider eligibility, incentive-traffic rules, technical integration, test/sandbox availability, settlement model, fees, and agreement requirements. Configure and validate a staging/test integration where permitted. Do not claim a publisher is launch-ready merely because a provider is selected or a dashboard exists.
- The owner requires at least one publisher account offering tasks to be selected and completely configured/working for launch. However, creating/activating an external publisher account, accepting terms, agreeing to incentivized traffic, signing or accepting a provider agreement, making a representation on the owner's behalf, paying fees, or committing to spend/revenue terms remains owner-gated. Agents must complete all independent research and technical preparation, then escalate only the exact binding step and provide the terms/options. Until owner approval and provider authorization are evidenced, use sandbox/test mode and do not expose provider tasks as live.
- Provider tasks are not LC earning events. Any third-party reward or payment offered by a publisher must be kept distinct from the LegitLoot LC wallet and must not be described as a LegitLoot cash withdrawal or LC redemption. Do not add cash handling, withdrawal, transfer, USD peg, or a second wallet.

### Existing owner gates remain unchanged
No authorization here permits production merge/deploy or production configuration/secrets/schema/data changes; live financial activity or reward issuance; cash movement; paid commitments; provider agreements or binding publisher activation; destructive real-data changes; weakening security/privacy; legal publication/commitments; or irreversible business decisions. Staging-only, reversible implementation/testing and integration-branch work may proceed under the standing authorization already recorded above. No real reward callback or financial transaction may be invoked for testing.

### Required implementation sequence and acceptance evidence
1. Continue the existing PROV-07 containment task: independently verify and deploy the reviewed record-only callback path to staging only, then prove the live staging SQL routine has no LC ledger/journal posting path. Never invoke a real provider callback. Production containment remains owner-gated.
2. Claude inventories the two game repositories/routes and proves both selected games launch, authenticate/link to the same LegitLoot account, preserve game-specific saves, and emit only signed/server-verified milestone events.
3. Claude proposes at least five launch challenges/milestones with objective eligibility, event source, anti-replay rule, completion state, and test cases. Existing approved LC values must be reused; unresolved values are escalated as an LC-economy decision, not invented.
4. Build and test the central reward path end-to-end in staging using synthetic users: game event -> server verification -> idempotent award -> authoritative website wallet -> transaction history. Negative tests must prove clients and provider callbacks cannot mint LC.
5. Build Hustle as a distinct task-discovery system. Choose a provider through documented research, complete sandbox/test configuration, test attribution/completion callbacks without issuing LC, and identify any owner-gated legal/account step precisely.
6. Verify the intended support mailbox, ad disclosures/consent, account recovery/deletion, monitoring, mobile flows, and launch runbook.
7. Keep production signup paused. Prepare the final release package and request owner approval only when the complete evidence-backed release candidate is ready.

### Agent ownership
- Claude: implementation lead for both game integrations, challenge/milestone catalogue, Hustle framework, publisher technical research/configuration, tests, and progress/handoff notes.
- ChatGPT: independent architecture/security/reward-policy reviewer, coordination lead, staging operator where connected access permits, and verification of Claude's evidence.
- Both agents: update the shared progress and launch-readiness records, maintain isolated branches/PRs, and report only verifiable artifacts. No agent may claim external provider approval, mailbox readiness, game integration, reward wiring, or a successful launch without direct evidence.


## 2026-11-19 08:10 ET — ChatGPT — independent coordination and launch-readiness check #3

- **Repository state:** integration branch `build/legitloot-neon-synthwave` at `c5525d0`; production `main` at `3fa7ca5` (last commit 2026-11-12). Open PRs: #12 runbook (`9a1f136`, 11 ahead / 0 behind), #14 staging origin isolation (`38715b4`, 6 ahead / 0 behind), #15 account-deletion design (`e32c2fa`, 7 ahead / 0 behind). Older draft #9 remains open. No PRs were merged.
- **Claude artifacts verified:** PR conversation handoff at 12:27 UTC records 34/34 tests for #12, 37/37 for #14, and 34/34 for #15, with clean diff checks on those heads. These are Claude-reported local results, not CI and not independently rerun here. The PR heads and Cloudflare preview check runs corroborate the refreshed artifacts.
- **Preview/CI:** Cloudflare Pages preview checks succeeded for integration and all three PR heads on both `legitloot` and `legitloot-preview`. These are static preview deployments only. The repository has no automated test workflow; its only workflow is the older artwork-extraction workflow. No Supabase function or database deployment is implied by a Pages check.
- **LC policy / deployed state:** read-only Supabase inventory confirms production `offerwall-gg-postback` v3 and staging v7 remain ACTIVE with `verify_jwt=false`; production wall-url v1 and staging wall-url v5 are ACTIVE. Production has 7 applied migrations; staging has 20 and does not include `20261119120000_offerwall_gg_record_only`. Both live `private.process_offerwall_gg_postback` routines still lock LC ledger accounts and call `private.post_journal_transaction`. Callback events/conversions/provider transactions are 0/0/0 in both projects. No callback was invoked. **PROV-07 remains a live policy violation** until staging and production containment are completed under their respective authorities.
- **Environment isolation:** `supabase-config.js` currently names the exact staging project; `account-auth.js` and `earn-hub.js` enforce exact staging URL checks. New finding **ENV-06**: `admin.js:boot()` and `payout-simulator.js:boot()` only check the environment label before creating a client; their pages are active staging-only routes, but the tests do not exercise these guards. Current config is correct, so no present production targeting was observed. Actionable review comment posted to PR #14 (comment 7010372122) requesting exact-URL guards and runtime tests.
- **Production branch governance:** GitHub branch listing reports `protected:false` for `main`; the repository rulesets query returned no rulesets. The branch-protection detail endpoint returned 403, so detailed rules could not be inspected. This contradicts the old “main — protected” header and creates a release-control gap if the owner-recorded Cloudflare `main` binding is correct. Finding **GOV-01** posted to PR #12 (comment 7010370851). No GitHub security settings were changed.
- **PR review:** #12's provider-monitoring invariant now correctly distinguishes callback/conversion records (may be nonzero) from provider-sourced LC journal/ledger postings (must remain zero). #14's canonical CPAGrip source removes the production origin. #15's deletion design marks the support address unverified and removes the obsolete per-action staging gate; D1–D4 remain owner/legal decisions. No formal review submissions or inline review threads were present; review activity is in PR conversation comments.
- **Owner gates / outstanding:** production Offerwall containment remains owner-gated because the shared secret also signs wall URLs; production sign-up pause was last verified `disable_signup:false` at 12:18 UTC and was not freshly probed in this read-only check; production Pages binding/trigger and backup/PITR remain unverified; production branch protection needs verification/strengthening; AUTH-03 D1–D4 (grace period, retention, interim response commitment, email re-registration) must be decided before implementing the corresponding policy choices. `hello@legitloot.site` remains unverified as a monitored support route.
- **Next owner-independent actions:** Claude addresses ENV-06 with exact staging guards/tests and keeps PR descriptions/handoffs current; ChatGPT independently reviews the follow-up and the refreshed PRs. The reviewed staging record-only migration/function may be deployed in a separate authorized implementation run, migration first then function, with no callback invocation. Production changes remain gated.
- **Actions this check:** read-only GitHub/Supabase inspection; comments posted to #12 and #14; no merge, deploy, schema/data/settings/secret change, callback, reward issuance, or money movement.


---

## 2026-11-19 — ChatGPT — independent coordination check; Taplayad launch selection recorded

### Owner decision: initial Hustle publisher
- The owner selected **Taplayad** as the initial publisher target for the basic Hustle launch.
- Owner-provided dashboard screenshots show property **Legitloot**, App ID **10066**, platform **Web**, category **Rewarding**, reward label **Legit loot**, multiplier display **$1 = 1 point**, and a test-postback panel displaying **1 Legit loot**. A staging Supabase postback URL prefix is visible.
- These screenshots are evidence of the owner's intended account/configuration, not proof that settings were saved, the publisher approved the account, the endpoint is correct, or live/test callbacks work. No settings were saved and no test postback was sent in this check.
- The publisher's points/multiplier and displayed test label are **not LC**, not a USD peg, not a cash value, and not permission to issue LC. Keep Taplayad task activity and any publisher-defined points completely separate from the authoritative website LC wallet.
- Taplayad is selected as the initial Hustle provider target. Provider eligibility for incentivized traffic, current terms, account approval, postback macros/signature requirements, sandbox/test mode, and any agreement or paid/settlement commitments remain to be verified. Binding provider acceptance, paid terms, and live activation remain owner-gated.

### Repository and coordination evidence
- Integration branch `build/legitloot-neon-synthwave` is at `1a8be57e9e4152b746fe1023f92bd77d486243a8`; compare with production `main` at `3fa7ca58992f786f7b59f22b8fb758149a873d6b` is 311 commits ahead / 0 behind. No production merge occurred.
- Branch inventory returned 16 branches across the first page and no further page. Open PRs: #12 runbook @ `9a1f136` (11 ahead / 7 behind), #14 staging origin isolation @ `38715b4` (6 ahead / 7 behind), #15 account-deletion design @ `e32c2fa` (7 ahead / 7 behind), and older draft #9. No PR was merged.
- Latest verifiable Claude handoff is PR #12 comment `7009082911` (2026-11-19 12:27 UTC). Claude reports #12 34/34, #14 37/37, #15 34/34 local tests and clean diff checks. These were not independently reproduced. GitHub combined statuses and workflow runs were empty for the integration head and all three PR heads; Cloudflare Pages preview comments are successful static previews only.
- PR #12 now has a further actionable review note from ChatGPT, comment `7011505297`: §4 rollback trigger says unexpected writes in “ledger/callback tables,” which conflicts with the record-only callback design because callback/conversion records are expected. It must target provider-sourced LC journal/ledger postings and callback-to-journal mismatches. The same note reiterates that GOV-01 branch-protection verification is missing from the runbook.
- PR #15 has owner-support update comment `7011512870`: replace the old `hello@` candidate with owner-designated `payouts@legitloot.site`, but keep it UNVERIFIED until delivery/reply/monitoring are tested.
- PR #14's prior ENV-06 finding remains open in comment `7010372122`.

### Independent code and launch-scope findings
- `games.html` still says one game is in development, lists “Zombie Invasion Defense” as a working title, and says “More worlds later.” It does not list the owner's two selected launch games **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**, and it offers no launch links. This conflicts with the owner-locked two-game launch scope.
- `earn.html`, `rewards.html`, `marketplace.html`, `privacy.html` and navigation/mobile-dock copy still use **Earn/Earning**. The owner renamed the section **Hustle**.
- `earn-providers.js` currently lists Offerwall.GG (pending approval), CPAGrip (testing), and category placeholders; it contains no Taplayad entry. The staging Edge Function inventory also contains no Taplayad adapter/function. Taplayad is selected but not integrated or verified.
- `rewards.html` still truthfully states LC are NOT LIVE YET and that no LC are awarded. No evidence in the current website launch surface demonstrates the required five-or-more challenge/milestone catalogue or an end-to-end game-event → server verification → idempotent award → website-wallet path. This remains launch work, not a claim that the feature exists.
- Public page contact links still use `hello@legitloot.site`; the owner-designated contact is `payouts@legitloot.site`. Update public/design references only after mailbox existence, inbound delivery, outbound reply and monitoring are verified.
- `admin.js:boot()` and `payout-simulator.js:boot()` still gate only on `config.environment === "staging"` and Supabase library presence before using `config.url`. Current `supabase-config.js` points to the exact staging project, so no current production target was observed; however, the exact-URL guard and runtime tests requested in ENV-06 are still absent from these two clients.

### Fresh read-only Supabase evidence
- Production `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 ACTIVE (`verify_jwt=false`), `offerwall-gg-wall-url` v1, `wallet-summary` v4. `private.process_offerwall_gg_postback` still selects/locks `private.ledger_accounts` and calls `private.post_journal_transaction`.
- Staging `scmnxcsggquwtuyyjnnj`: 20 migrations; `offerwall-gg-postback` v7 ACTIVE (`verify_jwt=false`), `offerwall-gg-wall-url` v5, `cpagrip-attribution` v4, `payout-simulator` v6, `admin-dashboard` v7 and `provision-initial-owner` v7. The record-only migration `20261119120000_offerwall_gg_record_only` is not applied. The live postback routine still selects/locks LC ledger accounts and calls `private.post_journal_transaction`.
- Callback-event and conversion counts are 0/0 in both projects. No callback was invoked. **PROV-07 remains a live critical financial-policy violation in both deployed environments.** The record-only implementation is source-only until staging migration and function deployment occur.
- No Supabase setting, secret, function, migration, schema, data, or financial record was changed in this check.

### Findings, actions, and next work
- Posted PR #12 comment `7011505297` (record-only rollback-trigger correction + GOV-01 runbook gap).
- Posted PR #15 comment `7011512870` (use `payouts@` as the intended support contact, retain UNVERIFIED status).
- No PR was merged; no deployment, callback, mailbox/DNS action, provider activation, or financial action occurred.
- Next owner-independent actions: Claude refreshes #12/#14/#15 from integration head `1a8be57`; corrects the runbook; implements ENV-06 exact URL guards/tests; updates account-deletion contact reference; starts the Hustle/Taplayad adapter in safe test mode; updates games/Hustle launch surfaces and supplies game/challenge/reward evidence. ChatGPT independently reviews each result and continues the separately authorized staging-only PROV-07 remediation after source review.
- Owner gates: production Offerwall containment, production merge/deploy and signup changes, provider agreements/approval/live activation and paid/settlement terms, production branch-protection administration, legal publication, live financial activity, and irreversible business decisions. The last recorded production signup probe remains `disable_signup:false` at 12:18 UTC; it was not freshly re-probed in this check.


### Coordination closeout — 2026-11-19
- The four documentation updates for this check advanced integration from `1a8be57` to `150d7a4`. This final batched documentation correction is being committed now; PR branches must be refreshed from the live integration branch tip when Claude resumes, not from either historical SHA.
- Immediately before this closeout correction, PR #12/#14/#15 were 11 commits behind integration (11/6/7 commits ahead respectively). The earlier branch-refresh instruction is superseded: use the current integration branch head at pickup and report exact compare counts after refresh.
- No PR merge, deployment, callback, provider activation, Supabase mutation, production action or financial activity occurred.


---

## 2026-11-19 09:40 America/New_York — Owner-supplied Taplayad publisher evidence and Hustle integration contract

The owner supplied screenshots from the authenticated Taplayad dashboard and documentation for Legitloot app/property ID **10066**, plus the offerwall URL template `https://offerwall.tplayad.com/10066/{user_id}`. The dashboard visibly labels the publisher as **Active**. This is evidence of the dashboard status, not independent proof of account approval, contractual permission for incentivized traffic, settlement eligibility, or successful end-to-end integration.

### Evidence captured from screenshots (not independently queried)
- Property name: Legitloot; app ID: `10066`; platform: Web; site category: Rewarding.
- Reward label shown: “Legit loot”; multiplier shown: `$1 = 1 points`. This is publisher-side configuration only. It must not be mapped to LegitCoins, a USD peg, user cash value, wallet balance, withdrawal, or redemption.
- Offerwall URL template: `https://offerwall.tplayad.com/10066/{user_id}`. Replace the placeholder server-side with the authenticated LegitLoot user's stable opaque identifier. Never accept a user ID supplied by an untrusted client as authority for another account.
- Dashboard offers view shows Web device and Worldwide country filters, 2,899 total entries, 30 entries per page. Visible examples include Ipsos - iSay Survey (CPA, offer 227048, Italy), Hot Adventure Slots (CPI, 227047, US), Crossword Jam: Fun Word Search (CPA, 227046, US), Word Search Explorer (CPA, 227045, US), and Free Score Fast (CPI, 227044, US). This is a screenshot snapshot, not a guarantee of current availability or suitability.
- Publisher documentation screenshot describes server-to-server postbacks and exposes macros: `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{country}`, `{user_ip}`, `{status}`, and `{sig}`. It describes `{sig}` as an MD5 security signature and instructs publishers to validate it and accept postbacks only from the documented source IP `176.97.212.58`.
- The screenshot also shows a publisher dashboard earnings/withdrawal panel with a $15 publisher minimum. This concerns the publisher's own account/revenue interface; it does not authorize or imply user withdrawals from LegitLoot.
- Taplayad documentation screenshot advertises a server-to-server postback, Offers API and embeddable offerwall. The selected integration method must be justified against launch scope and verified using current provider documentation.

### Security and policy requirements
- Taplayad is the owner-selected initial Hustle publisher. Treat it as selected for implementation/research; do not describe it as fully approved, live in LegitLoot, or launch-ready until provider terms/traffic eligibility and technical tests are evidenced.
- Build the offerwall as a separate Hustle task/discovery experience. Publisher offer completion, `{reward}`, `{payout}`, callbacks, and reversals must never create, credit, debit, or otherwise modify LC or the authoritative website wallet.
- Record publisher task events separately with provider transaction identity, offer ID, authenticated internal user mapping, status, timestamps, payout/reward metadata, signature-verification result, source-IP result, and reversal/chargeback history. Minimize/secure IP data and apply retention controls.
- Verify the exact signature construction, canonicalization, secret handling, status semantics, transaction-ID availability, retry behavior, and reversal protocol from the current Taplayad docs/provider support. The screenshots identify an MD5 signature macro but do not show the full signing formula. Do not guess the formula or treat MD5 alone as sufficient authentication.
- Verify source IP against current provider documentation; use the displayed `176.97.212.58` as a lead requiring confirmation, not a sole security boundary. Add replay/duplicate protection and fail closed on missing/invalid signature, unknown user, unknown offer, invalid status, or mismatched app ID.
- Use the exact authenticated user's stable opaque ID in the offerwall URL. Do not leak email, credentials, sequential database IDs, or another user's identifier.
- Any test postback must be performed only in a provider-approved test/sandbox mode with synthetic staging users and no LC issuance. Do not press “Send Test Postback” or change the publisher dashboard in this workstream without confirming its destination and effects.
- No provider account activation, terms acceptance, incentivized-traffic agreement, payment, paid commitment, or live activation is authorized by these screenshots or the owner's selection. Those remain owner-gated.
- Do not copy the publisher's `$1 = 1 points` multiplier into product copy as an LC exchange rate. Avoid displaying publisher payout/revenue as a user reward or promise.

### Next implementation actions
1. Claude: add Taplayad as the selected provider in Hustle's architecture/registry and document the adapter contract; do not change publisher dashboard settings.
2. Claude: inspect current Taplayad documentation for the full signature formula and transaction/reversal semantics. If unavailable, request written clarification from provider support and flag it as a provider dependency.
3. Implement staging-only offerwall URL generation, authenticated opaque user attribution, task catalogue/offer listing strategy (embedded wall first is preferred for smallest launch, subject to provider terms), event recording, idempotency, chargeback tracking, and administrative visibility.
4. Add tests for bad/missing signatures, wrong app ID, spoofed user ID, replayed callbacks, duplicate transaction IDs, unknown offers, status transitions, reversals, and the invariant that no provider event touches LC tables or wallet APIs.
5. Confirm provider allows this site's task/reward/advertising model and incentivized traffic before live use. Until then, use only permitted sandbox/test facilities.
6. ChatGPT independently reviews source, tests, staging isolation, and LC separation before any staging deployment.

### Owner boundary
This evidence does not authorize saving dashboard changes, sending test postbacks, activating live offers, accepting provider terms, changing secrets, deploying to production, or issuing rewards. Existing production, legal, financial, provider-agreement and final-release gates remain unchanged.

## 2026-11-19 10:00 ET — M2-T3a staging containment deployed by ChatGPT

- Owner reaffirmed standing authority: agents may merge verified work into the integration branch and deploy reviewed changes to staging without per-action approval. Production and business-critical gates remain unchanged.
- Applied `offerwall_gg_record_only` to staging project `scmnxcsggquwtuyyjnnj`. Supabase recorded migration version `20261119145340`; the canonical migration file was renamed to `supabase/migrations/20261119145340_offerwall_gg_record_only.sql` so future migration tooling does not replay a mismatched timestamp.
- Deployed canonical `offerwall-gg-postback` Edge Function to staging: **ACTIVE v8**, `verify_jwt=false` (preserved from v7 because the function performs its own HMAC validation). The matching deployed source snapshot and manifest were updated; deployment source hash: `d17c18d7ca2643b9fac2fd8c336e741f27edea63e7bb819764b8927e796c321e`.
- Live database verification: `private.process_offerwall_gg_postback` now records provider callbacks/conversions only and contains no ledger-account lookup or journal-posting call. Execute grants: `service_role=true`, `anon=false`, `authenticated=false`.
- Post-deploy counts: callback events 0, conversions 0, Offerwall.GG journal transactions 0, Offerwall.GG journal entries 0. No callback was invoked; no provider secret was read or changed. Production was not touched.
- Additional source defect fixed before deployment: reversed provider callbacks carry a negative `payoutUsd`, while the metadata routine accepts only nonnegative original payout amounts. The Edge Function now stores the absolute textual amount for reversal metadata (without floating-point conversion); reversal state remains separately recorded. Added a regression test and updated migration-path references. Source-level checks passed. The full npm suite was not rerun in this session; Claude's prior 8/8 PGlite report applies to the earlier source head.
- **Result:** PROV-07 is contained in staging. Production Offerwall.GG v3 remains on its legacy LC-posting path and is still an explicit owner decision/blocker. Do not infer staging containment is production containment.

## 2026-11-19 10:10 ET — ChatGPT — M2-T3b and AUTH-03 design closeout; M2-T4 pickup

- **PR #14 / ENV-03:** independently checked canonical CPAGrip against the deployed staging v4 snapshot (only the production origin removed), confirmed bearer token required and server-side `auth.getUser(jwt)` verification, and confirmed regression tests cover all canonical provider function origins. Merged PR #14 into the integration branch (`f8780a0`).
- **Staging deploy:** deployed `cpagrip-attribution` to staging as ACTIVE v5, `verify_jwt=true`. The live deployed source exactly matches the canonical integration source; production origin is absent; bearer and JWT validation remain. Updated staging function snapshot and deployment manifest.
- **PR #15 / AUTH-03:** corrected the intended support contact to `payouts@legitloot.site` while retaining UNVERIFIED status, then ported the reviewed design to `docs/ACCOUNT_DELETION_DESIGN.md` on the integration branch (`439027c`). Closed stale-base PR #15 as superseded. D1–D4 remain open; no deletion implementation, legal publication, production setting or user data was changed.
- **Platform spec:** updated to v1.3, reconciling the later owner decision for two launch games and at least five challenges using only existing approved LC values. No new LC amounts or redemption rules were created.
- **Games page:** replaced the obsolete Zombie Invasion Defense placeholder with the two owner-selected launch titles. It truthfully labels both as integration-in-progress and publishes no unverified links.
- **M2-T4:** active task advanced to game integration verification. Connected GitHub repo inventory and prior handoffs did not reveal source repositories or playable URLs for either selected game. `demonanic/Legitloot-2` is explicitly Zombie Invasion Defense and is not a substitute. Exact game URLs/repositories are the sole immediate dependency for completing the integration audit.

## 2026-11-19 10:15 ET — ChatGPT — M2-T6 release runbook closeout

- Independently reviewed PR #12's release/rollback/monitoring runbook and corrected the rollback trigger so expected record-only callback/conversion writes do not trigger rollback; provider-sourced LC journal/ledger postings, callback-to-journal mismatches, or malformed callback state remain incident conditions.
- Updated the migration reference to the actual staging-applied version `20261119145340_offerwall_gg_record_only.sql`.
- Qualified the production sign-up state with its last verified timestamp (2026-11-19 12:18 UTC; `disable_signup:false`) rather than presenting it as a fresh probe.
- Added GOV-01 to the release freeze: `main` must have verified PR-only protection, independent review and required checks before a production release. Current API evidence reports `protected:false`, no rulesets, and inaccessible detailed protection settings; do not claim protection exists.
- Ported reviewed `docs/RELEASE_RUNBOOK.md` to integration branch commit `53ba77a`; closed stale-base PR #12 as superseded. No production setting, backup tier, DNS, release or deployment was changed.


---

## 2026-11-19 10:20 ET — Independent Sync Watch debrief

### Work checked
- Read current Master Control, Project Progress, Launch Readiness Audit, Environment Source of Truth, CLAUDE.md and the legacy M1 Claude handoff.
- Checked integration history, all 16 branches, open/closed PR state, review comments, GitHub statuses/workflows, Claude-authored commits/handoffs, current website/provider code, migration tree, and read-only Supabase staging/production state.
- Integration branch at start: `7cf82eea2a313bde49fcc1e304729ae3a7dab957`, 349 commits ahead of `main`, 0 behind. All 16 branch API entries report `protected:false`.
- Only open PR is #9, an old draft design PR last updated 2026-11-12; no formal reviews and only old Cloudflare preview comments. #12 is closed unmerged/superseded by the runbook port on integration; #14 is merged into integration; #15 is closed unmerged/superseded by the account-deletion design port. No open PR covers Taplayad, the two selected games, challenges, or Hustle.
- Latest Claude-authored commit found: `5ab48bd` (documentation debrief, 2026-11-19 11:41Z). Latest verifiable Claude PR handoff: #12 comment `7009082911` (2026-11-19 12:27Z). No later Claude commit/handoff was found in the inspected branch history/comments. Subsequent integration commits were authored by `demonanic`; do not attribute them to Claude.
- Current integration head has no GitHub combined statuses and no workflow runs. The only workflow in `.github/workflows` is the artwork-extraction workflow; no automated test workflow exists. `npm test` is defined, but no current-head test run was independently executed in this audit. Claude's prior 34/34, 37/37 and 34/34 reports apply to older PR heads, not current head.
- Read-only live verification: staging has 21 migrations including `20261119145340_offerwall_gg_record_only`; `offerwall-gg-postback` is ACTIVE v8, `verify_jwt=false`, with HMAC validation in the function; the live SQL routine records callback/conversion events only and has no ledger/journal posting path; EXECUTE is service_role-only. Production has 7 migrations; `offerwall-gg-postback` is ACTIVE v3 and its live SQL routine still calls `private.post_journal_transaction` to credit/reverse LC. No callback was invoked.
- Staging currently has one `public.game_registry` row: `zombie-invasion-defense`, status `development`, `is_listed=false`, `launch_url=null`. `private.game_events` has 0 rows. The provider registry contains only Offerwall.GG and CPAGrip, both disabled, with no approval reference or verified terms. No Taplayad provider row or Taplayad/game Edge Function exists.
- The applied staging migration `20261118080655_game_platform_foundation` is recorded in Supabase migration history, but no matching migration file or game-platform path exists in the current integration Git tree. This is a source-control/migration reproducibility gap.
- Website source now lists the two owner-selected game titles but provides no playable links and labels both integration-in-progress. The public earning page/navigation still says “Earn,” not the owner-selected “Hustle.” Public pages still link to `hello@legitloot.site`; the owner-designated `payouts@legitloot.site` remains unverified.
- `earn-providers.js` still contains Offerwall.GG (pending approval), CPAGrip (testing), and category placeholders; no Taplayad. Publisher points/callbacks are not mapped to LC. Public Rewards/Account copy still states the LC-only/no-cash/no-transfer model.

### Findings and status
1. **PROD-PROV-07 — CRITICAL, still active:** production Offerwall.GG callback SQL can post LC through `private.post_journal_transaction`. Staging is contained; production is not. Production containment remains owner-gated. No production change made.
2. **GOV-01 — HIGH, reconfirmed:** all 16 branches, including `main` and integration, report `protected:false`; prior ruleset query returned none and detailed protection endpoint returned 403. Do not claim production PR protection is enforced. Owner/admin action is required.
3. **ENV-06 — HIGH, still open:** `admin.js:boot()` line 31 and `payout-simulator.js:boot()` line 62 check only `environment === "staging"` before `createClient(config.url,...)`; they do not assert the exact staging URL. `tests/environment-isolation.test.mjs` tests account-auth and earn-hub fail-closed behavior but does not runtime-test either internal page. Current config is staging; no current production target was observed.
4. **MIG-02 — HIGH, new:** staging's applied game-platform migration is absent from the integration repository. Recover/commit the exact migration source from authoritative history or a reviewed schema reconstruction before further schema work; do not replay or change staging data as part of this audit.
5. **M2-T4 — BLOCKER:** neither official launch game's exact source repository nor playable URL was found in the connected GitHub inventory or prior handoff context. Existing repos include Aegis Rogue, Demonanic, Zombie Invasion Defense, Gauntlet's Survival and Harvest//Zero; none is to be substituted without evidence. Staging registry still contains only the unlisted Zombie Invasion Defense placeholder with no launch URL.
6. **HUSTLE-01 — HIGH:** Taplayad is owner-selected but absent from the website provider registry, staging provider registry and Edge Function inventory. The current public section still says Earn. No task attribution/history or Taplayad integration is evidenced. Provider terms, incentive eligibility, exact signature formula and transaction/reversal semantics remain unverified.
7. **SUPPORT-01 — MEDIUM:** public pages still link to `hello@legitloot.site`; selected `payouts@legitloot.site` is not yet verified. Do not claim either mailbox is operational without delivery/reply/monitoring evidence.
8. **CI-01 — MEDIUM:** no GitHub test workflow or current-head status checks exist. Local test claims are stale relative to current head.

### Fixes/actions made
- No source code, database schema/data, settings, secrets, provider dashboard, callback, financial record, deployment or branch protection was changed.
- This dated evidence and the next work order are being added to the shared control documents and CLAUDE handoff only.

### Next owner-independent actions
1. Claude: implement ENV-06 exact staging URL guards in admin and payout-simulator plus negative runtime tests.
2. Claude: recover the missing game-platform migration source from authoritative SQL/history; compare it with current staging schema and add source-level regression coverage without applying schema changes.
3. Claude: add Taplayad as a test-only Hustle adapter only after confirming the full provider signature, transaction identity, retry and reversal contract; never map provider points/revenue/callbacks to LC.
4. Claude: consistently rename public Earning labels to Hustle, keeping provider tasks separate from LC.
5. Claude: prepare the five-plus challenge/milestone definitions and server-authoritative reward contract, but do not invent LC values or connect unverified game events.
6. ChatGPT: independently review the changed files/tests and re-check staging/production isolation before any authorized staging deployment.
7. Game integration remains blocked until the actual playable URLs or source repository links for both selected games are identified.

### Genuine owner gates
- Production Offerwall.GG containment choice; production merge/deploy/configuration and sign-up settings; GitHub branch protection administration; provider terms/traffic approval, binding agreements, paid/settlement commitments and live activation; legal/account-deletion decisions; live financial/reward activity; final production release.
- Required owner input for M2-T4: exact playable URL or source repository for **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**. Do not substitute Zombie Invasion Defense or another existing game.
- This audit performed read-only environment checks and documentation writes only. No callback, deployment, production setting/secret change, schema/data mutation or money movement occurred.


---

## 2026-11-19 — Independent Sync Watch / PR #16 review

### Repository and PR state
- Integration branch head verified as `66eff589c132402bb1adf294279467124642dff9`; comparison with `main` (`3fa7ca58992f786f7b59f22b8fb758149a873d6b`) is 354 commits ahead and 0 behind.
- 17 repository branches were returned (no further page). Rulesets endpoint returned an empty list. Direct `main` branch-protection endpoint returned 403, so enforceable protection could not be independently verified; do not state that protection is configured.
- Open PRs: #16 (ENV-06 guards, head `db939d6`, base integration `66eff58`, mergeable=true) and #9 (old draft design, head `046019f`). #16 has no GitHub status checks or Actions runs; Cloudflare posted two successful Pages preview deployments, which are deployment-preview evidence, not CI. Claude's PR body reports 42/42 local tests plus syntax/diff checks; these results were not independently reproduced in this run.
- PR #16 source review: `admin.js:boot()` and `payout-simulator.js:boot()` now require the staging label, exact staging URL, and a nonempty publishable key before client creation. `tests/internal-pages-staging-guard.test.mjs` exercises valid staging and negative/mislabelled/production/keyless configurations. No code-level blocker found in this limited diff. A COMMENT review (not approval) was posted as review 5979524271, recording the CI/test limitation and stale-handoff correction.
- PR #9 remains a stale draft and is diverged from current integration (12 commits not in integration). Its `tests/home.browser.py` still asserts Zombie Invasion Defense as the homepage/game-page title. A comment was posted (7015938125): do not merge as-is; refresh and align the homepage/tests to the owner-approved Zombies vs Heavy Metal and Rocket 2 Nowhere.

### Current code and launch findings
- `games.html` correctly names Zombies vs Heavy Metal and Rocket 2 Nowhere and says integration is in progress. `index.html` still displays a Zombie Invasion Defense feature card. This is a public launch-scope inconsistency; update the homepage and browser tests to the two approved launch titles when the real playable routes are verified.
- Public navigation and `earn.html` still say **Earn**; `earn-providers.js` has no Taplayad entry. The website provider registry contains Offerwall.GG pending approval and CPAGrip testing; the public copy correctly states partner offers do not award LC.
- The designated `payouts@legitloot.site` is not verified. Public pages still link to `hello@legitloot.site`.
- PR #16 contains a new Claude Code-labelled handoff in its branch copy of the master control document. The integration-branch `CLAUDE.md` was stale (still listed ENV-06 as work to implement and referred to the old PR/branch count); this entry updates the shared handoff. PR #16 is not merged.

### Read-only Supabase verification
- Production project `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 active; `private.process_offerwall_gg_postback` still selects LC ledger accounts and calls `private.post_journal_transaction`. This remains a critical production violation of the no-provider-to-LC rule. No callback was invoked.
- Staging project `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 active; the live SQL routine is record-only and has no ledger/journal posting path. Staging migration history still contains `20261118080655_game_platform_foundation`, but no matching source migration exists in the integration Git tree. Do not replay or alter the schema.
- Staging game registry still contains only `zombie-invasion-defense`, unlisted, development, with no launch URL.
- Staging Edge Function inventory contains no Taplayad or game-event function. `private.providers` contains only disabled Offerwall.GG and CPAGrip rows. The disabled Offerwall.GG row nevertheless has `approved_reward_model.currency_code = LC` and `reward_mode = standard_virtual_currency`, with no approval reference or verified terms. This is stale/contradictory metadata against the owner-locked policy; do not activate it or alter data during this audit. Reconcile the model to a non-LC, record-only task model before any future provider activation.
- Taplayad app 10066 remains owner-selected but not integrated. Its screenshot-supplied multiplier and callback reward must never be mapped to LC. Exact signature, transaction, retry and reversal semantics and incentivized-traffic permission remain unverified.

### Next owner-independent actions
1. Claude: continue MIG-02 source recovery through read-only comparison only; do not alter/replay staging schema.
2. Claude: implement Taplayad only in staging/test mode after provider protocol and permitted traffic model are verified; provider events must be record-only and never touch LC.
3. Claude: rename public Earn labels/navigation to Hustle and add task-history UI with no LC wallet coupling.
4. Claude: correct the homepage's Zombie Invasion Defense card and update browser assertions to the two approved titles once their real routes are known.
5. Claude: prepare at least five challenge definitions using existing approved LC values only; do not connect unverified game events.
6. Add a GitHub Actions test workflow as a separate bounded task; current PR previews do not provide CI.
7. ChatGPT: independently review the next source/test changes and keep the coordination log current.

### Owner gates and actions not taken
Production Offerwall containment, production settings/merge/deploy, branch protection administration, provider terms/traffic approval and binding agreements, paid/settlement commitments, live provider activation, live financial/reward activity, legal/account-deletion decisions, and final production release remain owner-gated. The exact playable URL/source repo for each selected game remains required to complete M2-T4. This check did not deploy, merge, alter Supabase settings/secrets/schema/data, invoke callbacks, save publisher settings, accept terms, move money, or modify production.


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


### PR/CI state at this check
- PR #16 head `e11fd81`, base integration `04e5f46`, mergeable=true; Claude reports 42/42 after refresh, but no Actions run covers this PR. Review 5979524271 remains COMMENTED.
- PR #17 adds CI-01. Actions run `44571890353` on `e841729` passed 38/38 tests. It does not include PR #16's four staging-guard tests. `.github/workflows/test.yml` has a no-op `git diff --check` step on a clean checkout; review 5979612112 and correction comment 7016116302 record the finding.
- PR #17 base is `bbf6692`; GitHub currently reports mergeable=true, though the commit histories diverge from current integration. Refresh before merge consideration.


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

---

---

---

---

---

---

---

## 2026-11-19 12:40 ET — Claude — ENV-06 implementation (PR #16)

1. **Work performed:** Synced to integration head `66eff58` (PRs #12/#15 closed as superseded, #14 merged — acknowledged). Implemented ENV-06 on branch `claude/env-06-staging-guards`.
2. **Evidence:** `admin.js` and `payout-simulator.js` now require `environment==="staging"`, the exact staging URL and a non-empty publishable key. New `tests/internal-pages-staging-guard.test.mjs` (missing/production/mislabelled/keyless/valid). Unguarded admin.js fails the new test. `npm test` 42/42; `node --check`, `git diff --check` clean.
3. **Findings:** GOV-01 and the CI-01 gap (no test workflow) acknowledged; both need owner/admin or a separate PR.
4. **Remaining work:** MIG-02 (recover game-platform migration source), CI-01 test workflow, Hustle relabel, challenge contract design, Taplayad adapter only after signature/reversal contract is verified.
5. **Next bounded action:** ChatGPT independent review of PR #16; then Claude starts MIG-02 recovery (read-only comparison with staging, no schema change).
6. **Owner gates:** unchanged — production Offerwall.GG containment, sign-up pause, branch protection, D1–D4, game URLs/repos for M2-T4. No production, staging, callback or data change made.

---

## 2026-11-19 14:00 ET — Claude — Debrief: PRs #16/#17/#18 and combined CI gate

1. **Work performed:** ENV-06 guards (PR #16, head `f58d176`), CI-01 workflow with corrected submitted-patch whitespace check (PR #17, `a83851b`), MIG-02 canonical migration source + 8 PGlite tests restored from the recovery evidence (PR #18, `8071a73`), each refreshed to integration `b6bcf75`. Built throwaway draft PR #19 (`8795409` = integration + #17 + #16 + #18) solely to give the three PRs a combined GitHub Actions run.
2. **Evidence:** Actions run `44583018543` on `8795409`: 50 passed / 0 failed (38 baseline + 4 ENV-06 + 8 MIG-02), `npm ci` and patch-level `git diff --check` successful. Cloudflare previews green on all heads. Negative proofs: unguarded `admin.js` fails the new guard test; weakening the `game_registry` select policy fails 2 MIG-02 tests. Not a run on each PR's own head.
3. **Findings:** none new in code. Noted for the future handoff-ticket issuer: `target_origin` CHECK (`^https://[^/]+$`) is not an origin allowlist; the server function must canonicalise and compare against an explicit allowlist with negative tests. The applied historical migration is not to be rewritten or replayed.
4. **Remaining:** authorized reviewer merge decision for #16/#17/#18 (then close #19); Taplayad (blocked on verified signature/transaction/reversal semantics and incentivized-traffic permission); Earn→Hustle rename, homepage title and browser-test correction; five-plus challenge definitions (blocked on game event sources); AUTH-03a after D1–D4.
5. **Next bounded action:** Claude refreshes the merge-candidate set once if reviewers request it; no further log-only commits from Claude until a merge decision. Then Claude starts the Earn→Hustle rename on a separate branch.
6. **Owner gates:** unchanged — production Offerwall.GG containment, production sign-up pause, `main` branch protection (GOV-01), D1–D4 deletion/legal decisions, playable URLs/repos for Zombies vs Heavy Metal and Rocket 2 Nowhere, provider terms/traffic approval. No production, staging, callback, schema or data change was made.


---

## 2026-11-19 — Independent coordination check: combined CI, staging containment, Taplayad protocol

- Integration at review start: b6bcf75870025b13312c9d7006dc0670ae0b4c13; main: 3fa7ca58992f786f7b59f22b8fb758149a873d6b. GitHub listed 20 branches; none protected. Main reports protected=false; rulesets endpoint returned none; detailed branch-protection endpoint is inaccessible (403).
- Open PRs: #9 (old draft), #16 (ENV-06), #17 (CI-01), #18 (MIG-02), and #19 (draft combined CI candidate). PR #14 is merged; #12 and #15 are closed without merge.
- CI: PR #17 Actions run 44574267498 passed 38/38 tests and the submitted-patch whitespace check. Claude created draft PR #19 / branch claude/combined-merge-candidate. Actions run 44583018543 passed 50/50, 0 failed, 0 skipped, including ENV-06 and MIG-02 tests, plus npm ci and git diff --check. PR #19 is explicitly not for merge; this is combined-tree test evidence, not merge or production approval. PR #16 and #18 still have no Actions run on their individual heads.
- Staging PROV-07 containment is now live: staging applied migration 20261119145340_offerwall_gg_record_only; offerwall-gg-postback is active v8 (verify_jwt=false). The live staging private.process_offerwall_gg_postback and public wrapper are record-only and do not reference ledger accounts or call post_journal_transaction. The live v8 Edge Function source is byte-identical to the integration source file. record_offerwall_gg_metadata also has no ledger/journal path. Staging callback events/conversions remain 0/0; no callback was invoked in this review.
- Production remains a critical owner gate: production offerwall-gg-postback v3 is active (verify_jwt=false); production private.process_offerwall_gg_postback still references ledger_accounts and calls post_journal_transaction. No production change was made.
- Staging private.providers: Offerwall.GG is disabled but retains stale approved_reward_model currency_code=LC / standard_virtual_currency metadata with no verified terms; CPAGrip is disabled; Taplayad is absent. Do not activate providers or treat this stale row as policy approval.
- Current integration UI still needs launch reconciliation: index.html features Zombie Invasion Defense and places “Complete offers (Planned)” inside the LC earning steps; games.html lists Zombies vs Heavy Metal and Rocket 2 Nowhere but has no playable links; earn.html/navigation still say Earn; earn-providers.js has no Taplayad entry. Public contact links still use hello@legitloot.site; payouts@legitloot.site is not yet verified.
- Current official Taplayad docs (https://tplayad.com/docs) specify md5(app_id . user_id . api_secret), statuses 1=credited and 2=reversed, source IP 176.97.212.58, and macros user_id, payout, reward, offer_id, country, user_ip, status, sig. The signature does not cover offer_id, payout, reward, or status; no unique transaction ID macro is documented, and the sample only suggests de-duplication by offer_id + user_id. This is not adequate evidence for reliable transaction-level idempotency/reversal or cryptographic payload integrity. Do not implement live callback crediting or claim robust conversion matching until Tplayad supplies a signed transaction identifier/payload or authoritative verification API. Provider IP allowlisting is defense-in-depth, not a substitute for signed transaction fields.
- The owner-supplied wall URL https://offerwall.tplayad.com/10066/{user_id} differs from the current official iframe URL https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}. Confirm which route applies to app 10066 before coding. Generate a non-guessable opaque publisher user ID server-side from the authenticated session; never use email or trust a client-selected user ID. Publisher $1=1 point is not LC/USD value.
- Next owner-independent work: keep PR #19 draft-only; use the 50-test run as combined evidence; synchronize real PRs only after this debrief commit; continue public-copy/game/Hustle work and prepare a provider clarification request. No schema/data, settings/secrets, provider dashboard, callbacks, money, production deployment, merge, terms acceptance, or legal/business commitment was changed.
- Owner gates remain: production Offerwall containment, GitHub branch protection, provider terms/traffic permission and any account activation, game source URLs/repos, verified support mailbox, production registration pause verification, legal decisions, and final production release.


---

## 2026-11-19 13:45 ET — ChatGPT — ENV-06 / CI-01 / MIG-02 merged; next task: Earn → Hustle

1. **Work performed:** Merged PR #17 (CI-01) as `29f758930decf6903f7d6247700be6c171340deb`; merged PR #16 (ENV-06) as `bd72f51325e61f52b1b3b81a259028c6eb70c6c8`; merged PR #18 (MIG-02) as `3cf3578019eeaf1d256bad584bf7a35f8b7acabc`. All three were merged into `build/legitloot-neon-synthwave` only. Closed throwaway draft PR #19 unmerged after its combined-test purpose was complete.
2. **Evidence:** Combined candidate `88ab0a3` passed 50/50 in Actions run [44588538481](https://github.com/demonanic/LegitLoot/actions/runs/44588538481). After sequential merges, integration push run [44590472777](https://github.com/demonanic/LegitLoot/actions/runs/44590472777) completed successfully: `npm ci`, `npm test`, and submitted-patch whitespace check all passed on final integration commit `3cf3578019eeaf1d256bad584bf7a35f8b7acabc`.
3. **Safety:** No merge to `main`, production deployment, Supabase migration replay, staging/production setting change, callback, or data mutation. MIG-02 source was restored only; historical migration was not re-applied. PR #19 was closed, not merged.
4. **Next active task:** **M2-T5 — Earn → Hustle public naming and launch-copy reconciliation**, on a separate feature branch from current integration. Audit all user-facing labels, navigation, page titles, homepage cards, links, tests and docs. Rename only the public section/navigation labels; preserve provider/technical identifiers and routes unless a verified route migration is explicitly required. Remove misleading statements that offers generate LC; offers/provider points remain separate from LC. Keep all incomplete features honestly labeled. Add/update regression tests and preview checks. Do not add Taplayad callback behavior until signature, transaction identity, retry/reversal semantics and incentivized-traffic permission are verified.
5. **Parallel blockers remain:** M2-T4 source repositories/playable URLs for Zombies vs Heavy Metal and Rocket 2 Nowhere remain unlocated; do not invent links. Taplayad provider clarification remains required. Challenge definitions may use only existing owner-approved LC values; no invented award values. Production Offerwall.GG v3 still has the legacy LC-posting path and is a critical production blocker.
6. **Owner gates unchanged:** no merge to `main`, production deployment, production setting/secret changes, paid/provider commitments, live financial activity, destructive real-data changes, security weakening, legal/business commitments, or final release without the applicable owner gate. Existing standing authority covers independently reviewed work and routine reversible changes on the isolated integration branch and staging only.


---

## 2026-11-19 14:42 ET — Independent check: Hustle public-copy PR, CI, and live provider-policy state

### Repository / Claude evidence
- Integration branch `build/legitloot-neon-synthwave`: `3fa518ee27c987a58f3196f682c7e13de483b6a8`; `main`: `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. Compare: integration is 375 commits ahead, 0 behind.
- GitHub lists 21 branches; every branch reports `protected:false`, including `main`. Main-branch protection remains an owner/admin release gate.
- PR #16 (ENV-06), #17 (CI-01), and #18 (MIG-02) are confirmed merged into the integration branch only. PR #19 is closed unmerged (combined CI candidate only).
- Current open PRs: #20 (Hustle public-copy changes; non-draft) and #9 (old visual redesign; draft). PR #9 is 12 commits ahead / 166 behind current integration and remains stale; its prior review comments document the old game-title and LC-copy conflicts.
- Claude-authored commits on PR #20: `4a0db7a` and `04e4016`. PR #20 changes public labels/copy and adds tests; it does not change backend, Supabase, provider, or LC-economy code.
- Integration push Actions run [44590656627](https://github.com/demonanic/LegitLoot/actions/runs/44590656627) passed: npm ci, 50/50 Node tests, and submitted-patch whitespace check. PR #20 Actions run [44591660747](https://github.com/demonanic/LegitLoot/actions/runs/44591660747) passed: 54/54 Node tests, 0 failures, 0 skips, and whitespace check.
- Cloudflare bot comments on PR #20 report successful branch-preview deployments in both Pages projects. The PR branch's `supabase-config.js` explicitly targets staging project `scmnxcsggquwtuyyjnnj`; project-level Cloudflare environment bindings/custom-domain routing were not independently verified. These are preview URLs, not a production deployment.

### Independent PR #20 review — comment 7020270626
- `earn.html` title, meta description, navigation, and accessible labels now use Hustle. Homepage removed the old “Complete offers” LC step and replaces the Zombie Invasion Defense feature card with Zombies vs Heavy Metal and Rocket 2 Nowhere, without inventing playable URLs.
- Remaining user-facing defects: `earn-hub.js` still displays “No earning provider is open…” and `tests/earn-hub.browser.py` asserts that phrase; homepage LC step 3 says “Uses announced later”; `earn.html` says “Advertised rewards are not guaranteed earnings” and mentions provider “settlement”, which can be read as a LegitLoot payout promise.
- CI workflow runs only `npm test` (`node --test tests/*.test.mjs`), not the Python/Playwright browser test. The review requests a Node regression assertion for the summary wording, a meaningful weekly-challenges/seasonal-events step and assertion, and copy explicitly separating provider activity from LC/cash/wallet credit.
- PR #20 branch is 2 commits ahead / 2 behind integration. Claude was asked to synchronize to `3fa518ee` and rerun CI. PR is not yet ready for owner approval. No code was changed by this review.

### Fresh read-only Supabase verification
- Production project `gkbqderyjcuxnjbsiffb`: `offerwall-gg-postback` v3 ACTIVE, `verify_jwt=false`; 7 migrations. Live `private.process_offerwall_gg_postback` is SECURITY DEFINER, locks user/platform LC ledger accounts and calls `private.post_journal_transaction`. This is a confirmed active path for provider-to-LC issuance, contrary to owner policy.
- Staging project `scmnxcsggquwtuyyjnnj`: `offerwall-gg-postback` v8 ACTIVE, `verify_jwt=false`; 21 migrations. Live routine is record-only and contains no ledger/journal operation. Deployed v8 `index.ts` is byte-for-byte identical to `supabase/functions/offerwall-gg-postback/index.ts` at integration (6,990 bytes).
- Staging `private.providers`: CPAGrip disabled with no approval metadata; Offerwall.GG disabled but still has stale `approved_reward_model={reward_mode:standard_virtual_currency,currency_code:LC,currency_name:LootCoins}` and null terms/verification/approval references. Taplayad is absent. Staging Edge Function inventory has no Taplayad function.
- No callbacks were invoked; no Supabase setting, secret, schema, row, or provider state was changed.

### Next owner-independent actions
1. Claude addresses comment 7020270626, syncs PR #20 with integration, and reruns CI.
2. Independently review the updated PR and its copy regression tests.
3. Keep PR #9 draft-only until it is rebased and its obsolete homepage/game assertions are replaced.
4. Continue Taplayad only as record-only staging design until the provider supplies payload-bound transaction authentication, unique transaction identity/reversal matching, and account-specific incentivized-traffic permission.
5. Continue launch game routes and challenge/wallet integration only after real game sources and approved LC rules are evidenced.

### Owner gates
Production Offerwall containment is still critical and owner-gated. Main branch protection, Taplayad binding terms/traffic permission and any live activation, production deployment, paid commitments, destructive data changes, support mailbox verification, production registration pause, legal/business decisions, and final launch remain owner-controlled.

---
## 2026-11-19 15:23 America/New_York — Independent coordination check: PR #20, LC copy and provider callback

Repository evidence:
- Integration HEAD 04ff43e3b9691e3acbdd9e6c9356530b9d61ec69; main HEAD 3fa7ca58992f786f7b59f22b8fb758149a873d6b.
- 21 branches discovered. GitHub explicitly reports main and integration as unprotected.
- Two open PRs: #20 (Hustle/public copy) and #9 (old visual redesign, draft). PR #9 remains divergent/non-mergeable: compare shows 171 commits on integration side and 12 on draft side from merge base.
- PR #20 head 20a82038f1da4d50665bdb7c32eb69bb4f41ea18. Actions run 44601788773 is green; inspected job log confirms 57 Node tests passed, 0 failed; whitespace check passed.
- PR #20 base is 3fa518ee27c987a58f3196f682c7e13de483b6a8. Current integration and PR head have each advanced five commits from that merge base: PR is 5 ahead / 5 behind current integration. It must sync to 04ff43e and rerun CI before approval.
- Independent review comment posted: https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7021287292.

New finding HUSTLE-COPY-20261119-01:
- index.html line 7 says “Legit Coins are earned by playing”; line 84 says “Earned by playing. Never cash.”
- Fine print at line 92 correctly limits LC to verified in-game milestones, weekly challenges and seasonal events, but headline/meta wording is broader.
- tests/hustle-public-copy.test.mjs lines 49–63 validates the step list but not the headline/meta description.
- Correct the headline/meta to explicitly state the three approved LC sources; consider changing generic “Play games” to “Complete verified in-game milestones”; add regression assertions.

Fresh read-only Supabase evidence:
- Production gkbqderyjcuxnjbsiffb: Offerwall.GG postback v3 ACTIVE, verify_jwt=false. private.process_offerwall_gg_postback still locks LC ledger accounts and calls private.post_journal_transaction. Provider-to-LC issuance remains possible and violates owner policy.
- Staging scmnxcsggquwtuyyjnnj: Offerwall.GG postback v8 ACTIVE, verify_jwt=false; database routine is record-only with no ledger/journal call.
- Staging private.providers: CPAGrip disabled; Offerwall.GG disabled but stale approved_reward_model names LC/LootCoins and terms URL, terms verification and approval reference are null. Taplayad is absent from provider rows and Edge Function inventory.
- No callback or database/configuration change was made.

New finding PROV-CURRENCY-CASE-20261119-01:
- docs/OFFERWALL_GG_INTEGRATION.md says exact callback currencyName is “Loot coins”.
- Staging supabase/functions/offerwall-gg-postback/index.ts line 82 rejects unless currencyName is exactly “Loot Coins”.
- tests/offerwall-record-only.test.mjs has no assertion for the exact value.
- Confirm the provider’s actual case-sensitive value, then align staging handler, docs and regression test. Do not change publisher settings or send a callback.

Preview check:
- PR #20 and integration supabase-config.js have the same blob SHA and explicitly point to staging project scmnxcsggquwtuyyjnnj with environment “staging”.
- Cloudflare bot reported branch previews in both legitloot-preview and legitloot Pages projects. Checked-in config points to staging; project-level Cloudflare overrides were not independently verified.

Next actions:
1. Claude syncs PR #20 to 04ff43e, tightens homepage LC source wording, adds tests and reruns Actions.
2. Verify Offerwall.GG currencyName case from current provider evidence; align staging handler/docs/test only after verification.
3. Keep Taplayad record-only until payload-bound transaction authentication, unique transaction identity/reversal matching and account-specific incentivized-traffic permission are confirmed.
4. Production Offerwall containment, main branch protection, provider agreements/activation, production deployment, legal/business approval and final launch remain owner-gated.


---

## 2026-11-19 16:54 America/New_York — Independent Sync Watch: PR #20 review, M2 task alignment, and Tplayad protocol ambiguity

### Current milestone/task authority
- This file remains authoritative. Active milestone is M2 — Launch Blocker Closure and Basic-Operable Release. The current active task is **M2-T4: verify and integrate Zombies vs Heavy Metal and Rocket 2 Nowhere**; ChatGPT is the acting lead for this task. CLAUDE.md incorrectly still named M2-T5 as active; that entry is corrected in the same documentation update.
- Exact source repositories/playable URLs for both approved games remain unidentified. Exact-title searches across accessible GitHub repositories returned no matches. Do not substitute Zombie Invasion Defense, Legitloot-2, Demonanic, Aegis Rogue, Gauntlet or other unrelated projects, and do not invent URLs. The minimum remaining owner input for M2-T4 is the exact source repo or playable URL for each title.
- M2-T5 public Earn-to-Hustle copy work is complete as a scoped PR candidate, not merged. PR #20 head ad21bbecd0fd6e020925464132b637fd83bc2327, base 3db61c0545c95ab28e525e070f3d66f58ab9fa63; it was synchronized to the integration HEAD and GitHub reports mergeable. The 15-file diff changes public navigation/page labels, homepage LC wording, Hustle status/disclaimer copy, and adds static Node regression assertions; it does not change provider, wallet, database, or LC issuance code.
- Actions run 44609090382 on PR #20 completed successfully through npm ci, npm test, and submitted-patch whitespace check. Claude's latest handoff reports 58/58 local tests; GitHub's run is independently confirmed green, but its test-step log count was not independently retrieved. The Python/Playwright browser suite is not part of the workflow; the changed visible status string is covered by the Node source-copy test.
- Independent formal PR review COMMENT 5984053898 found no blocking defect in the scoped public-copy diff. It is not an APPROVE review and no merge was performed. The coordination-document updates advance integration; PR #20 must sync to the latest integration HEAD and rerun CI before final owner review.
- PR #9 remains a stale draft visual redesign. Open PRs at check start: #20 and #9. GitHub listed 21 branches and reported protected=false for every branch, including main and integration.

### Preview/environment evidence
- PR #20's supabase-config.js blob SHA matches integration and explicitly targets staging project scmnxcsggquwtuyyjnnj with environment staging; no key value is copied into this record.
- Cloudflare bot comments report successful branch previews for PR #20 in both legitloot-preview and legitloot Pages projects. These are branch preview URLs, not evidence of a production custom-domain deployment. Cloudflare dashboard-level project overrides/custom-domain bindings remain unverified.

### Fresh read-only Supabase verification
- Production gkbqderyjcuxnjbsiffb: offerwall-gg-postback v3 ACTIVE, verify_jwt=false. Live SECURITY DEFINER private.process_offerwall_gg_postback locks user/platform LC ledger accounts and calls private.post_journal_transaction. Provider-to-LC issuance remains possible and violates the owner-locked rule.
- Staging scmnxcsggquwtuyyjnnj: offerwall-gg-postback v8 ACTIVE, verify_jwt=false. The live routine is record-only; deployed v8 index.ts is exactly equal to integration source (6,990 bytes). No ledger/journal path is present in the staging routine.
- Staging private.providers: CPAGrip disabled with no approval metadata; Offerwall.GG disabled but still has stale approved_reward_model metadata naming LC / LootCoins, with null terms URL, terms verification and approval reference. Taplayad has no provider row and no Edge Function in the staging inventory. No row was changed.
- Production Offerwall.GG v3 remains a critical owner-gated financial-policy violation. No function, SQL routine, setting, secret, schema, row or financial state was changed.

### New Taplayad protocol ambiguity — do not implement a live callback yet
Official public documentation exposes two materially different systems:
1. Current/new system at https://tplayad.com/docs (page links separately to the new dashboard and old system). Its macros match the owner's screenshots: user_id, payout, reward, offer_id, country, user_ip, status, sig. It documents md5(app_id . user_id . api_secret), status 1/2, server IP 176.97.212.58, and deduplication example offer_id + user_id. It does not document a transaction-ID macro. This signature does not bind reward, payout, offer ID or status; the sample dedupe key cannot safely distinguish repeat conversions/multiple rewards for one user/offer.
2. Legacy system at https://www.tplayad.com/doc/postback documents subId, transId, reward, payout, signature, status, userIp, campaign_id, country, and uuid. It documents a unique transId and md5(subId . transId . reward . secret), plus OK/DUP responses and retries. This is a different protocol; its signature still does not bind status or campaign metadata.
- The owner-supplied URL https://offerwall.tplayad.com/10066/{user_id} differs from the new-system iframe documented at https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}. The screenshot macro names resemble the new system, but account 10066's actual dashboard generation/contract and the URL alias are not proven. Do not select a protocol by guess.
- Before live handling, obtain written account-specific confirmation of which system applies to App ID 10066, the canonical wall URL, complete signed fields, stable transaction identity, reversal matching, retry/duplicate semantics, and an authoritative transaction-verification API or stronger payload-bound signature. Keep any staging work strictly record-only and never let provider callbacks touch LC.
- Public Terms of Service last updated 2026-10-29 require account holders to be at least 18, prohibit fraudulent activity, make publisher earnings subject to dashboard payment terms, and include an indemnification clause. They do not establish account-specific approval for LegitLoot's exact placement/reward presentation. No terms were accepted.
- Publisher-side $1 = 1 points, payout and withdrawal settings remain publisher accounting only, never LC value, user cash, transfer or withdrawal.

### Other unresolved integration detail
- Offerwall.GG public developer docs describe currencyName as publisher-defined and do not prescribe the exact casing. Internal docs/OFFERWALL_GG_INTEGRATION.md says Loot coins; staging handler line 82 requires Loot Coins. The exact configured placement value is not independently available. Keep the mismatch open; do not change provider settings or send a callback to resolve it.

### Next owner-independent actions
1. Claude synchronizes PR #20 after this documentation commit and reruns CI; ChatGPT rechecks the final head before any integration decision.
2. ChatGPT continues M2-T4 repository/account-contract review without inventing game routes; owner supplies exact source/playable URLs when available.
3. Keep Taplayad as the selected initial Hustle publisher, but only design/record-only staging work until account generation and callback protocol are confirmed and adequate transaction verification is documented.
4. Confirm Offerwall.GG placement's actual currencyName through authorized dashboard evidence/provider documentation before aligning the handler/docs/test.
5. Keep PR #9 draft-only and stale until its obsolete content is reconciled.

### Owner gates
Production Offerwall containment, main branch protection, Taplayad account-specific terms/traffic approval and live activation, publisher dashboard changes, production deployment, paid commitments, destructive real-data changes, security weakening, support-mailbox verification, production sign-up-pause verification, legal/business decisions, and final release remain owner-controlled. No PR was merged, no deployment occurred, no callback was invoked, and no Supabase or provider setting/data was changed.

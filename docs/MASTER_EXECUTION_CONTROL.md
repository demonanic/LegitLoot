# LEGITLOOT — MASTER EXECUTION CONTROL
## Shared operating agreement for ChatGPT, Claude, and the project owner

**Status:** ACTIVE — owner-authorized  
**Last updated:** 2026-11-19  
**Repository:** `demonanic/LegitLoot`  
**Authorized working branch:** `build/legitloot-neon-synthwave`  
**Production branch:** `main` — protected; no merge or deployment authorized  
**Purpose:** One shared source of truth for priorities, decisions, agent coordination, and the next executable task.

**Explicit owner authorization:** The owner has expressly granted both ChatGPT and Claude the clearance and authority to collaborate autonomously on LegitLoot, inspect the shared repository and connected development resources, update project documentation, assign bounded tasks to one another, provide direct implementation/review instructions, and carry out routine reversible work within the active milestone without seeking routine owner check-ins. This authority is intended to minimize owner-as-middleman delays. It does not override the critical escalation boundaries in Section 6 or authorize production deployment, paid commitments, provider agreements, live financial activity, destructive real-data changes, security weakening, or irreversible legal/business decisions.

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

## Active milestone M1: LAUNCH READINESS BASELINE AND BLOCKER PLAN

**Status:** READY TO EXECUTE  
**Priority:** P0  
**Owner:** Claude — primary repository investigator and implementation lead  
**Partner:** ChatGPT — architecture reviewer, risk reviewer, and independent second set of eyes  
**Owner involvement:** Not required for routine inspection, documentation, or safe staging work.

### Objective

Establish the verified current state of the actual repository, deployed website, development backend, authentication, account experience, wallet/reward systems, provider integrations, game entry points, admin operations, and legal/trust surfaces.

Then produce one evidence-based launch blocker list, ordered by dependency and severity, and recommend the smallest viable public launch scope.

This milestone is an audit and launch-plan milestone. Do not start unrelated feature development during it.

### Exact execution steps

1. Read `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/CODEX_EXECUTION_CONSTITUTION.md`, `docs/PLATFORM_BUILD_SPEC.md`, `docs/PROJECT_PROGRESS.md`, `docs/LEGITLOOT_CREATIVE_BIBLE.md`, and this document.
2. Confirm current branch, HEAD commit, working-tree state, and whether the branch contains uncommitted or unreviewed work. Do not overwrite another agent's work.
3. Inspect all public routes and their actual user-visible states. Check navigation, mobile behavior from source, forms, buttons, links, status labels, and dead ends. Distinguish source inspection from rendered/browser testing.
4. Inspect authentication implementation and configuration without exposing or copying secrets. Verify registration, email verification, login, logout, password recovery, session persistence, and account deletion status. Mark anything not actually tested as NOT VERIFIED.
5. Inspect the development Supabase project: schema, RLS, functions, triggers, auth configuration, wallet/ledger structures, provider registry, and relevant migrations. Read-only by default. Do not touch production.
6. Inspect provider integration status using current code and dashboard evidence already available. Distinguish publisher approval, placement approval, technical integration, test verification, and production activation.
7. Inspect game registry, game links, game-specific integration state, account linking, save architecture, and actual game launch availability. Do not treat planned integrations as implemented.
8. Inspect legal, privacy, terms, support, fraud, and account-deletion disclosures. Identify contradictions between public copy and actual functionality.
9. Run available static checks and tests. Record exact commands and results. Do not claim browser QA unless a real browser session was used.
10. Compare observed facts with the governing specifications. Record conflicts explicitly; do not silently choose whichever document is convenient.
11. Produce/update `docs/LAUNCH_READINESS_AUDIT.md` with evidence, findings, severity, and file/function references.
12. Update this document's status and next milestone only after the audit is complete and reviewed by the other agent.

### Required audit output

Every finding must have:
- ID (e.g. `AUTH-01`, `WALLET-02`, `PROVIDER-03`).
- Severity: BLOCKER / HIGH / MEDIUM / LOW.
- Status: VERIFIED / NOT VERIFIED / FAIL / DEFERRED.
- Evidence: exact file, function, database object, test, URL, or provider documentation.
- User/business impact.
- Smallest safe corrective action.
- Dependencies.
- Whether owner approval is required.

### M1 acceptance criteria

M1 is complete only when:

- The current branch and repository state are recorded.
- Every public route has an implementation/status inventory.
- Authentication capabilities and gaps are evidenced.
- Development backend schema, RLS, and Edge Functions are inventoried.
- Wallet and reward architecture is mapped without changing economic policy.
- Each provider has a truthful status: account approval, placement approval, integration, test, and launch state.
- Game/account/save integration status is evidenced.
- Legal/trust/account-deletion launch gaps are identified.
- Available automated checks have been run and results recorded.
- Conflicts between current code, specifications, and recent owner decisions are listed.
- A smallest-viable-launch recommendation and sequenced blocker backlog are written.
- ChatGPT has reviewed the audit and either approved it or posted specific evidence-based corrections in the shared log.

**Do not declare M1 complete merely because a report exists. It must be grounded in repository/backend evidence.**

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

Authorized:
- Read-only audits of production and development.
- Repository documentation changes on the authorized build branch.
- Code changes on the authorized build branch that satisfy the active milestone.
- Development/staging inspection and reversible tests within existing approved access.
- Updating this document, the progress report, and specialist interface documentation.

Not authorized by this document:
- Merge to `main`.
- Production deployment or DNS/domain changes.
- Production database/schema/data changes.
- Live reward issuance, real user payouts, or movement of money.
- Paid infrastructure, subscriptions, provider agreements, or new account creation.
- Enabling provider campaigns or production callbacks.
- Destructive data migrations or deletion of real user data.

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

**Active milestone:** M1 — Launch Readiness Baseline and Blocker Plan  
**Active task:** M1-T1 — Repository, environment, and launch-surface inventory  
**Task owner:** Claude  
**Reviewer:** ChatGPT  
**Status:** DELIVERED — AWAITING CHATGPT REVIEW (2026-11-19). See `docs/LAUNCH_READINESS_AUDIT.md` and the latest coordination-log entry.

### M1-T1 exact deliverable

Create the initial sections of `docs/LAUNCH_READINESS_AUDIT.md` covering:

- Branch/commit/working-tree state.
- Public route inventory and current state.
- Current frontend architecture and entry points.
- Existing authentication UI and backend connection points.
- Existing game listing/launch links and current availability claims.
- Existing admin entry points and operational tools.
- Static checks that can be run immediately.

Do not modify application code during M1-T1. This is a read-only inventory. Do not expose secrets. Mark untested behavior NOT VERIFIED.

After M1-T1, ChatGPT reviews the evidence and adds a bounded next task for the backend/auth/provider audit. Continue through M1 in the same manner. Do not wait for owner confirmation between routine subtasks.

### Next milestone after M1

**M2 — Launch Blocker Closure**

M2 will be defined only from the verified M1 audit. It will contain the smallest ordered set of changes required to make the approved launch scope work. No speculative features.

---

# 11. AGENT COORDINATION LOG

Append new entries at the top. Never erase earlier entries.

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

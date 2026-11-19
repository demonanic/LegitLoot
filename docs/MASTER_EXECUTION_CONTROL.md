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
**Status:** M1-T1 ACCEPTED WITH QUALIFICATIONS (ChatGPT, audit §12). Environment reconciliation delivered 2026-11-19 (audit §15, `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` §7–10). Proposed next milestone tasks: audit §15.4 (M2-T1…T7), pending ChatGPT review. Open owner items: production sign-up toggle (BLOCKED on dashboard sign-in), PROV-07 containment.

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

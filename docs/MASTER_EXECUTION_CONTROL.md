# LEGITLOOT — MASTER EXECUTION CONTROL
## Shared operating agreement for ChatGPT, Claude, and the project owner

**Status:** ACTIVE — owner-authorized
**Last updated:** 2026-11-20 23:33 ET
**Repository:** `demonanic/LegitLoot`  
**Authorized working branch:** `build/legitloot-neon-synthwave`  
**Production branch:** `main` — production; merge/deploy remain owner-gated. GitHub API at Sync Watch #18 (2026-11-20 19:14 ET) reports all 31 refs `protected:false` and repository rulesets empty. Authorized integration application baseline is `a529b35` plus documentation-only commits; current head `1466eb6`. Do not describe `main` as technically protected.
**Purpose:** One shared source of truth for priorities, decisions, agent coordination, and the next executable task.
**Standing role authority:** `docs/AGENT_OPERATING_CHARTER.md` is the role/handoff authority: Sam owns the business; Claude is primary implementation lead; ChatGPT/DaVinci is technical director and independent auditor. Task-specific acting leads do not change these standing roles. Read the charter before work. It supplements this control document and does not change owner gates.

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

### Current active task — M2-T4: integrate the two owner-selected launch games

**Status:** IN PROGRESS — both owner-selected games are present in the production build as early access with device-local saves; shared account/session, cloud saves, and server-verified LC-event integration remain unfinished. The older evidence block below is historical and superseded by Sync Watch #10.
**Acting lead:** ChatGPT.  
**Partner:** Claude when available; both agents retain standing integration/staging authority under Section 2, subject to the more restrictive instruction governing each individual run.

**Owner-locked launch titles:** **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**.

**Historical evidence and gap (superseded by Sync Watch #10 below):**

- **Zombies vs Heavy Metal — LIVE (owner-approved; identity resolved 2026-11-20):** `zombies-vs-heavy-metal.html` embeds https://demonanic.github.io/Legitloot-2/, the owner-approved ZVHM build (renamed from the Zombie Invasion Defense working title in game-repo commit `fcf4000`). Owner decision 2026-11-19 19:40 ET, re-confirmed 2026-11-20; DaVinci withdrew the identity blocker in PR #22 comment `7041463948`. Published by owner-approved PR #21 (main `4e0f533`). Early access, device-local saves, no LegitLoot account or LC connection.
- **Rocket 2 Nowhere — LIVE (owner-approved):** self-contained build at `games/rocket-2-nowhere/index.html`, play page `/rocket-2-nowhere`, published by PR #23 (main `801f3e7`; Cloudflare production deployment confirmed, alias https://legitloot.site; live fetches returned 200 with the title and no prototype names). Early access, device-local saves, no shared account/session, cloud save or LC-event integration.
- **PR #22** (claude/rxt2-launch, head 332ca07, stacked on PR #20): integration-branch copy of the RXT2 package and ZVHM wrapper; Actions run 44661225287 passed 64/64. Its URL assertion is consistent with the owner decision (blocker withdrawn, comment 7041463948). Open for integration acceptance after PR #20; not merged.
- **PR #23 — MERGED to main as `801f3e7` (owner-approved production publish, 2026-11-20).** It touched 7 files and did not change `account-auth.js`. **Open issue (ENV-07):** Cloudflare `legitloot-preview` has an `environment=preview` deployment of `main` @ `801f3e7` (alias main.legitloot-preview.pages.dev, no environment variables); main `account-auth.js` hardcodes production Supabase and exposes `auth.signUp()`. Do not use Account/auth routes on main-based previews. A separate owner-approved PR against main is required to fail closed on preview hosts.
- **PR #20** remains open at head 6e2e51b; exact-head Actions run 44661202504 passed 58/58. Its description remains stale; comment 7036351593 records the correction. By ancestry it is 15 commits ahead / 61 behind current integration; the behind-side changes are docs/README-only. PR #22 is two commits ahead of PR #20.
- **Production main:** `801f3e7` (PR #23, Rocket 2 Nowhere), after `bcc19d6` (PR #24, Offerwall.GG containment merged by owner account 2026-11-20 04:10 UTC; Cloudflare deployment 75207a07). Production Offerwall.GG wall-url v2 and postback v4 are inert HTTP 410 handlers; checked callback routine EXECUTE is false for service_role, anon and authenticated. No callback was invoked.
- **Offerwall.GG source drift:** Production main's wall-url source still contains the old active launcher while main's postback source is inert. Integration's canonical wall-url and postback sources remain active; PR #25 changes only wall-url. Staging wall-url v5 and postback v8 are ACTIVE, and their deployed source exactly matches the checked-in supabase/environments/staging/functions snapshots. Staging wall-url is JWT-protected but allows https://legitloot.site in CORS and generates signed provider URLs. Staging postback is no-JWT and record-only; its HMAC binds only userId:transactionId:currencyAmount, leaving offer/goal/payout/timestamp metadata unsigned. Live staging callback routines are service_role-executable but currently contain no journal, ledger, or LootCoin references; callback/conversion counts are zero.
- **PR #25** remains draft at head 135607e; Node tests passed 54/54 and Deno type-check/handler tests passed (runs 44713338718, 44713338856). Its recursive guard covers canonical supabase/functions imports but tests/staging-function-origins.test.mjs deliberately excludes supabase/environments/* snapshots. Those excluded snapshots exactly match the active staging wall-url/postback deployments. New actionable comment 7037024928 requests a separate deployment-source/manifest guard; do not treat PR #25 as staging containment. Relative to current integration it is 17 commits ahead / 22 behind; the behind-side changes are docs/README-only.
- **Wallet/LC policy:** Production and staging public.get_wallet_summary() still return cash USD buckets. Production RPC returns lootCoins.available plus cash; staging RPC returns gameCredits labeled LLC plus cash. Deployed production wallet-summary v4 also returns cash and gameCredits: LLC, which differs from the production RPC contract; repository code search found no current page caller, so treat it as a deployed stale endpoint, not a verified active page path. Production account.html, rewards.html, earn.html, and account-auth.js still expose cash/withdrawal or provider-to-LC behavior. PR #20's integration UI is LC-only but does not fix backend response contracts.
- **Taplayad App 10066:** Preserve the owner URL exactly: https://offerwall.tplayad.com/10066/{user_id}. Current official docs specify md5(app_id . user_id . api_secret), status 1/2, and any-2xx acknowledgement, but no transaction-ID macro or retry schedule; the sample URL uses offer={offer_id} while the PHP example reads offer_id. Direct fetch of the legacy postback page returns 404. Current Terms (2026-10-29) do not establish App-10066-specific incentivized-traffic permission. Keep Taplayad unintegrated; never map publisher points or callback reward/payout into LC.
- **Branches and attribution:** 26 refs were checked at 05:13 ET and all reported protected:false (28 refs were enumerated at 11:14 ET; the two newer refs have not been checked). Only standalone Claude handoff found is docs/CLAUDE_START_HANDOFF_M1.md. Verified Claude-authored commits include PR #21 (970dbbf), PR #20 (6e2e51b), PR #22 (332ca07), and PR #23 (33a5240). PR #25 test commit 135607e is authored by demonanic, not Claude.

**Acceptance criteria:**
1. PR #20 and PR #22 are synchronized with each other and their latest Actions runs pass. The integration branch has only documentation-only updates after PR #20's base `387d035`; defer any further sync until an owner-approved integration disposition. No merge is permitted by the current Sync Watch run.
2. Independently test both game routes, mobile controls, save persistence, and truthful early-access disclosures.
3. Complete the one-account/session handoff while retaining game-specific saves; do not create duplicate spendable wallets.
4. Implement and test server-verified, idempotent game events for approved milestones, weekly challenges, and seasonal events before any LC awards.
5. Confirm that neither game nor any provider callback can mint or spend LC locally.
6. PR #23 published with owner approval (main `801f3e7`). Before any account testing on main-based previews, a separate owner-approved PR must make main's auth target fail closed or staging-only (ENV-07).
7. Record exact evidence and unresolved dependencies. No production release without separate owner approval.

**Immediate next action (as of 2026-11-20 23:33 ET):** Keep PR #30 draft and review-only at exact head `fcd62237f6a7afe5ab7622d50039bcb101360aa3` (56 files / 83 commits; base integration `1466eb6`). Exact-head Node/whitespace Actions `44843092983` and Deno Actions `44843092933` pass; Claude reports 82/82 local tests on this SHA, not independently rerun by DaVinci. The formal browser suite remains unrun. Eight older inline findings are resolved as addressed in source, but no approval exists for this exact head. The latest code commit `fcd6223` changes only the Account auth cache key and its regression test. PR #27's current documentation head is `9c55da4`; PR #30 still carries the earlier docs snapshot through `26768972`. Preserve the documented rule: do not sync PR #27 into #30 on every watch; perform one final sync at an owner-approved freeze point.
 
Fresh read-only Supabase checks at 23:33 ET confirm both production and staging projects are ACTIVE_HEALTHY. Both live `public.get_wallet_summary()` RPCs still return cash/USD fields; production uses the `lootCoins` key, while staging still returns `gameCredits` labelled `LLC`. Both ACLs grant authenticated and service_role EXECUTE, with anon denied. Production wallet-summary v4 still reads all non-system accounts and journal entries without a posted-transaction filter, uses legacy `game_credits_*` / `LLC` account codes, and returns cash/USD buckets; its handler manually validates a Bearer token. Read-only counts show zero journal-entry rows across all non-system wallet accounts in both environments, so no current wallet posting or misreported balance was observed. Candidate LC-only Edge Function and proposed SQL remain source-only; the SQL stays DO NOT APPLY. The candidate's `journal_transactions!inner(status)` PostgREST embed is still NOT VERIFIED. The FK exists in both environments; the owner's note that the deployed v4 already queries the `private` schema is supporting context, not proof that this relationship embed resolves.
 
Staging remains at one game-registry placeholder and zero game events, saves, or handoff tickets. CPAGrip and Offerwall.GG provider rows are disabled; the Offerwall.GG row still carries stale LC reward metadata; no Taplayad row exists. Production Offerwall.GG wall-url v2 and postback v4 are active HTTP 410 tombstones. Staging wall-url v5 remains active/JWT and can construct legacy Offerwall.GG URLs for authenticated callers; postback v8 remains active/no-JWT and record-only. No callbacks were invoked.
 
**Remaining launch gates:** production cash/USD wallet contract and UI/copy, Account/Privacy conflict, unverified Auth `disable_signup`, account deletion/export, shared account/save/verified-event integration for both games, Taplayad App-10066 written permission and complete protocol, ENV-07 main-preview production-auth exposure, and staging Offerwall.GG wall-url containment. Taplayad remains `pending_approval` with the exact owner template only; never map publisher points, callback reward, or payout to LC. No new candidate code defect was found.

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
2. Read `docs/AGENT_OPERATING_CHARTER.md` for standing roles and handoff rules.
3. Read `docs/PROJECT_PROGRESS.md`.
4. Read the applicable governing specification and specialist handoff.
5. Check the current branch and latest commit.
6. Read the latest entries in the Agent Coordination Log below.
7. Confirm the active milestone and task ID.
8. Continue the active task rather than starting a new one.

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


---

## 2026-11-19 17:42 America/New_York — Independent Sync Watch: PR #20 re-review, M2-T4 source search, and live environment verification

### Repository and PR evidence
- Integration `build/legitloot-neon-synthwave`: `a0cef5e69867d31235ffca5778dc11bab7cfccba`; production `main`: `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. Integration is 393 commits ahead, 0 behind. GitHub lists 21 branches; all report `protected=false`, including main and integration.
- Open PRs: #20 and #9. PR #20 is non-draft, mergeable, 9 commits ahead / 0 behind integration. Head `8cee6f7f5e5208363fe4f58077173dd0f8897575`, base `a0cef5e69867d31235ffca5778dc11bab7cfccba`. GitHub Actions run [44624595265](https://github.com/demonanic/LegitLoot/actions/runs/44624595265) passed `npm ci`, `npm test` (58 passed, 0 failed, 0 skipped), and submitted-patch whitespace check. The workflow does not run the Python/Playwright browser suite.
- ChatGPT independently reviewed the current 15-file PR #20 diff and posted COMMENT review `5984643477`: no blocking defect in the scoped public-copy/navigation change. It updates Hustle labels, correct LC-source wording, the two selected game names, and regression tests; it does not alter provider, wallet, database or LC-issuance logic. This is not an APPROVE review or production-release approval. No merge was performed.
- PR #9 remains a stale, non-mergeable draft: 12 commits ahead / 184 behind integration. Its old game assertions and design branch must not be merged as-is.
- Latest verifiable Claude handoff is PR #20 comment [7023430231](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7023430231), which reports sync to `a0cef5e` and 58/58 local tests. GitHub Actions independently confirms the 58-test run. No newer handoff file was found; the only handoff document in the integration tree is the older M1 start handoff.

### M2-T4 — exact launch-game sources remain unavailable
- The active task remains M2-T4, with ChatGPT as acting lead per this control document. Owner-approved titles are exactly **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**; both were described by the owner as playable as-is, but each still needs its exact source repository/playable URL and technical verification.
- Read-only inventory of all seven accessible owner repositories found: `ageis_game`, `Demonanic`, `Sweeps`, `Gauntlet-s-survival`, `LegitLoot`, `Legitloot-2`, and `Fresh`. Repository README/code searches found no exact source for either selected title. `Legitloot-2` is Zombie Invasion Defense; `Gauntlet-s-survival`, `Demonanic`, and `Fresh` (Harvest//Zero) are distinct projects and must not be substituted. Exact-title searches also returned no repositories.
- Fresh staging read-only SQL: `public.game_registry` still contains only `zid / zombie-invasion-defense`, status `development`, `is_listed=false`, `launch_url=null`. `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets` each contain 0 rows. No challenge/milestone/season tables are present. No game integration or reward event is verified.
- Continue without guessing routes. The remaining M2-T4 dependency is the exact owner-provided source/playable reference for each selected title; once supplied, verify mobile behavior, shared account linkage and game-specific save persistence before publishing links.

### Fresh financial/provider verification (read-only)
- Production project `gkbqderyjcuxnjbsiffb`: 7 migrations; Offerwall.GG postback v3 ACTIVE, `verify_jwt=false`. Live `private.process_offerwall_gg_postback` is SECURITY DEFINER and calls `private.post_journal_transaction`, locking user/platform LC ledger accounts. Provider-to-LC issuance remains possible and violates §0.1.
- Staging project `scmnxcsggquwtuyyjnnj`: 21 migrations; Offerwall.GG postback v8 ACTIVE, `verify_jwt=false`. Live `private.process_offerwall_gg_postback` is record-only and has no ledger/journal operation.
- Staging `private.providers`: Offerwall.GG disabled but stale `approved_reward_model` still names `standard_virtual_currency / LC / LootCoins`; terms URL, terms verification and approval reference are null. CPAGrip is disabled with no approval metadata. Taplayad is absent. No row was changed.
- Taplayad remains unresolved between new/current and legacy protocols. Do not implement live callback handling until App ID 10066's account generation, canonical URL, authenticated transaction identity, signed fields, reversal matching, retry/idempotency and authoritative verification are confirmed in writing. Provider points never map to LC.

### Documentation consistency corrections
- `docs/LEGITLOOT_CREATIVE_BIBLE.md` contained an obsolete initial-game list naming Demonanic, Gauntlet's Survival and Harvest//Zero. It is corrected to the two current owner-locked portal launch titles and explicitly excludes the older independent projects as substitutes.
- `docs/PLATFORM_BUILD_SPEC.md` §1 item 1 contained an obsolete one-game Zombie Invasion Defense reference. It is corrected to point to the current §0.4 two-game launch decision.

### Safety and next actions
- No PR merge, deployment, Supabase settings/secrets/schema/data mutation, publisher change, callback, payment, provider agreement or production action occurred. Production containment and branch protection remain owner-gated.
- Next: owner reviews PR #20 as an integration-only public-copy change; ChatGPT continues M2-T4 when exact game sources are supplied; Claude must not substitute other games. Continue record-only staging/provider design and keep production Offerwall.GG v3 disabled from any new use; do not alter production under this check.


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

## 2026-11-19 19:40 ET — Claude: Zombies vs Heavy Metal identified and live on legitloot.site (owner-approved production change)

### Owner decisions (in chat, 2026-11-19)
- **Zombies vs Heavy Metal is this game:** repo `demonanic/Legitloot-2` (README title "Zombie Invasion Defense", internal id `zid`). Show it on the site as **Zombies vs Heavy Metal**. This resolves the M2-T4 "source repository not found" gap for the first launch title. **Rocket 2 Nowhere** is still not located.
- The owner asked to "put it live after checks". This explicitly authorized the production merge below.

### What changed in production
- PR [#21](https://github.com/demonanic/LegitLoot/pull/21) (`claude/zvhm-play`, commit `970dbbf`, branched from `main` `3fa7ca5`) was merged to `main` as `4e0f533`. Public pages only:
  - `games.html` and `index.html`: the game card now shows *Zombies vs Heavy Metal · Playable · Early access* with **Play now**.
  - New `zombies-vs-heavy-metal.html`: a full-height iframe of `https://demonanic.github.io/Legitloot-2/` under a slim LegitLoot bar with Exit and Full screen.
  - `sitemap.xml`: lists the play page.
- The copy states that progress is saved on the device and that LegitLoot accounts and Legit Coins are not connected yet.
- No change to accounts, wallet, Supabase, Cloudflare settings, secrets or rewards.

### Evidence
- Cloudflare `legitloot` and `legitloot-preview` previews both passed. `https://claude-zvhm-play.legitloot-preview.pages.dev` was checked on a 412×915 mobile viewport: the cards render, Play now navigates, and the embedded game runs (`phase=prep, wave=1`, canvas present), takes taps, and logs no page errors.
- After the merge, `https://legitloot.site/games` shows the new card and `https://legitloot.site/zombies-vs-heavy-metal` returns 200. The same mobile check passed on production.
- Game build state at merge: Legitloot-2 `main` `a9b3018` (CI green). It has 253 automated tests and a balance sim (bot median around wave 23).

### Follow-ups for whoever picks up M2-T4
- **Integration branch drift:** this branch's `games.html`/`index.html` still have the old card. Bring `main` `4e0f533` into `build/legitloot-neon-synthwave` (or port the 4 files) before the next release, so the next production merge doesn't revert the live card.
- Staging `public.game_registry` row `zid`: update the title/listing to match the owner decision when the next staging change is made. It was not changed here.
- Account handoff and LC milestone events for this game are still unbuilt. LC economy implementation remains owner-gated.

Rollback: revert merge `4e0f533` on `main`. No data to restore.


---

## 2026-11-19 19:41 ET — Independent Sync Watch: ZVHM is live; production policy conflicts and branch drift identified

### Verified owner authorization and production deployment
- PR [#21](https://github.com/demonanic/LegitLoot/pull/21) records the owner's specific 2026-11-19 approval to publish **Zombies vs Heavy Metal** on the live site after checks. This was a narrow authorization for public game-page changes only; it is not blanket permission for future production merges, deployments, account/wallet changes, provider activation, financial activity, or legal decisions.
- Claude's PR head: `970dbbfeabce8eebdd02e61ef652ba0b7d96f03d`; merge commit on `main`: `4e0f533a1962767d7595f32c9a9bdcb979d31513`.
- Cloudflare API independently confirms `legitloot` production deployment `6598c4c6-ecd5-49a1-9122-a55caa892cd8`, environment `production`, branch `main`, commit `4e0f533`, alias `https://legitloot.site`, all deploy stages successful at 2026-11-20 00:24:36Z (2026-11-19 19:24 ET).
- Read-only browser verification returned HTTP 200 for the homepage, `/games.html`, and `/zombies-vs-heavy-metal.html`; the play page loads the actual GitHub Pages game at `https://demonanic.github.io/Legitloot-2/`. The game canvas/tutorial/HUD rendered. No page errors or horizontal overflow at desktop and 390px mobile width. No controls were pressed and no progress was saved.
- Game source is `demonanic/Legitloot-2`; README identifies the official title **Zombies vs Heavy Metal** and says progress is saved on-device. LegitLoot account sign-in, cross-game save handoff and LC are not connected. The game repo's latest observed commit is `fcf4000` (official-title rename). No GitHub Actions workflow runs or commit status checks were returned for PR #21 head `970dbbf` or game commit `fcf4000`; Cloudflare previews and production deploy succeeded, but that is not a GitHub test-suite pass.
- **Rocket 2 Nowhere remains unresolved**: exact-title searches of connected repositories and public repository search did not locate its source. Production Games currently shows only Zombies vs Heavy Metal plus a “More worlds later” placeholder.

### Integration and PR drift
- Current `main`: `4e0f533`. Current integration: `907f1a6`. Compare reports integration 404 commits ahead and 2 behind main (merge base `3fa7ca5`); the two main-only commits are PR #21 head/merge.
- Integration `games.html` and `index.html` still show the old ZID placeholder; `zombies-vs-heavy-metal.html` is absent from integration. Port PR #21's public-page changes into integration before any later production release, or the next integration-based release risks losing the live game page. Do not merge/deploy as part of this audit.
- PR #20 remains open, non-draft. Head `7912edd`, base recorded at `1e950355`; comparison against current integration `907f1a6` is 13 ahead / 1 behind. Latest Actions run `44637573706` completed successfully: `npm ci`, `npm test` (58 passed, 0 failed), and patch whitespace check. Its previously reviewed 15-file application diff remains scoped to public copy/navigation/account preview. It must sync once to current integration and rerun CI. PR #9 remains a stale draft. GitHub currently returns 22 branch names; branch-protection state was not independently re-queried in this run (last recorded audit found the then-existing branches unprotected).

### New production policy and privacy/legal blocker — no changes made
- Production `main` is still on the pre-PR20 copy. `index.html` says “Complete offers — Planned” and “Earn LootCoins”; `rewards.html` says Offerwall.GG completions credit LootCoins and describes cash rewards/withdrawal; `account.html` renders cash wallet, pending cash, withdrawal-reserved and paid fields.
- Production `account-auth.js` hardcodes the production Supabase project `gkbqderyjcuxnjbsiffb`, initializes the Supabase client and implements `client.auth.signUp`. It calls `public.get_wallet_summary()`; the live SECURITY DEFINER RPC returns both cash fields and LootCoins. The page contains sign-in/create-account forms. No account was created and no personal data was queried.
- Production `terms.html` says formal Terms are not yet published; `privacy.html` says the full Privacy Notice is not approved and instructs visitors not to submit personal information. The production account form is nevertheless present and wired to production auth. This is a critical launch/privacy/legal readiness mismatch. Owner decision required on whether to pause public sign-ups until approved Terms/Privacy and the LC-only wallet experience are in place. No auth settings or production code changed.
- PR #20's branch corrects the public copy, removes cash/withdrawal UI and uses a staging-only Supabase configuration guard. It is not a production-ready release artifact and must not be merged to `main` without a separate owner-approved production configuration/release plan.

### Provider and environment controls rechecked
- Production Supabase: 7 migrations; Offerwall.GG postback v3 ACTIVE, `verify_jwt=false`; live `private.process_offerwall_gg_postback` is SECURITY DEFINER and calls `private.post_journal_transaction`. The production provider registry row is disabled but retains stale LC reward metadata and no terms/approval evidence. Crucially, the deployed v3 Edge Function does not check the provider registry's disabled status before invoking the posting RPC. Provider-to-LC issuance remains possible and violates policy.
- Staging Supabase: 21 migrations; Offerwall.GG postback v8 ACTIVE, `verify_jwt=false`; live routine is record-only and contains no LC journal posting. Staging providers: Offerwall.GG disabled with stale LC metadata; CPAGrip disabled; Taplayad absent.
- Staging `offerwall-gg-wall-url` v5 is JWT-protected but its CORS allow-list includes `https://legitloot.site` as well as the staging preview origin. This allows a production-origin browser to call a staging endpoint; it is not proof production currently uses staging, but it is a cross-environment exception to review before any production integration.
- Taplayad App ID 10066 remains selected but its account protocol, canonical wall URL, payload-bound transaction authentication, unique transaction ID, reversal/retry semantics and incentivized-traffic permission remain unconfirmed. Keep record-only; never map publisher points, `{reward}` or `{payout}` to LC.

### Next actions
1. Claude: synchronize PR #20 once to integration `907f1a6`, rerun Actions, and do not merge to main.
2. Prepare a separate integration-only port of PR #21's four public files so integration cannot regress the live ZVHM route; preserve the early-access/device-save/no-account-or-LC disclosure.
3. Continue locating Rocket 2 Nowhere source; do not substitute a different game.
4. Owner gate: decide sign-up pause/legal readiness and separately authorize production containment of Offerwall.GG provider-to-LC issuance. No automated production action.
5. Review staging wall-url CORS production-origin allowance; no setting change without authorization.
6. Continue Taplayad record-only design pending written provider confirmation.

No production change, PR merge, deployment, Supabase/Cloudflare setting or secret change, database mutation, callback, provider agreement, payment, or personal-data access was performed by this audit.


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


## 2026-11-19 21:29 ET — Sync Watch debrief: RXT2 candidate reviewed, preview isolation blocker, live provider recheck

- Read the shared control documents and `CLAUDE.md` at session start. The repository has no new standalone Claude handoff file beyond the historical M1 handoff; the current Claude implementation artifacts are PRs #20, #22, and #23 and their GitHub descriptions/comments.
- Open PRs are #9 (stale draft), #20 (Hustle/public-copy), #22 (integration game package, stacked on #20), #23 (draft production RXT2 publish), and #24 (draft Offerwall.GG containment). PR #21 is merged. No PR was merged and no deployment was initiated.
- PR #22 head `c70c3d3`: independent source/policy review found no blocker in its scoped game changes. Its Actions run passed 64/64, 0 failures, 0 skips. The RXT2 source uses device-local save state and Google Fonts only; it contains no Supabase, account, wallet, LC, or provider callback code. Both game cards accurately disclose early access and no account/LC connection. COMMENT review `5986626725` was added.
- PR #23 head `33a5240`: Cloudflare preview deployments in both Pages projects are environment `preview`, with `*.pages.dev` aliases and no Pages environment variables. Read-only browser QA confirmed `/games`, `/rocket-2-nowhere`, and the embedded game start screen load. The preview Account page's inherited `account-auth.js` hardcodes the production Supabase project and includes sign-up. This is a critical preview-isolation defect, even though the Pages deployment itself is classified as preview. Comment `7028430944` added; do not use account flows on this preview.
- PR #24 head `7a31165`: candidate remains draft/unmerged/undeployed. Review found `index_test.ts` imports `index.ts`, which immediately executes top-level `Deno.serve(handleRequest)`; unit-test module loading therefore starts a listener and can fail on missing network permission or hold the test process open. Move the pure handler into a separate module and test that module; run Deno tests in CI. PR #24 preview inherits the same production-targeting Account page. Comment `7028431331` added. Deno is unavailable in the current execution environment; tests remain unrun.
- PR #20 head `c6dc85b`: Actions passed 58/58, 0 failures, 0 skips. Integration head is now `387d035`; PR #20's base `fd758a7` is seven documentation-only commits behind. Comment `7028460618` asks Claude to sync once and rerun CI. PR #22 remains stacked on PR #20.
- Current production `main` is `4e0f533`; PR #23 is not published. Main still lists only ZVHM, and its Rewards/Account source still advertises Offerwall.GG-to-LC, cash/withdrawal states, and account creation. Terms and Privacy still say they are incomplete.
- Supabase access is restored and read-only checks were repeated. Production Offerwall.GG postback v3 remains ACTIVE with `verify_jwt=false`; its live handler calls `public.process_offerwall_gg_postback`. Both public and private process routines are SECURITY DEFINER, owned by postgres, and still grant EXECUTE to service_role. The private routine calls `private.post_journal_transaction` and posts LC journal entries. The provider row is disabled but retains `standard_virtual_currency / LC / LootCoins` metadata and null approval/terms fields. Production `wallet-summary` v4 remains ACTIVE and its SECURITY DEFINER RPC returns cash and LC fields. Provider-to-LC issuance remains a critical production violation.
- Staging Offerwall.GG postback v8 remains ACTIVE with `verify_jwt=false`, but its live database routine is record-only and does not call the journal. The staging provider row remains disabled with stale LC metadata and null approval/terms fields. Taplayad is absent from staging `private.providers`. No callbacks or writes were performed.
- Taplayad owner target remains `https://offerwall.tplayad.com/10066/{user_id}`; the dashboard Active badge remains screenshot evidence only. Current public docs and legacy docs conflict: current docs use `md5(app_id . user_id . api_secret)`, omit a transaction-ID macro, and suggest dedupe by `offer_id + user_id`; legacy docs expose `transId` and `md5(subId . transId . reward . secret)`. Neither document establishes a single account-10066 protocol that cryptographically binds status, amount, offer, and transaction identity. Current public Terms (last updated 2026-10-29) do not establish permission for incentivized traffic or LegitLoot's exact reward model. Keep Taplayad record-only/not integrated; never map publisher points, `{reward}`, or `{payout}` to LC or cash.
- GitHub reports `protected:false` for every listed branch and no repository rulesets. The production owner gate is therefore not technically enforced by branch protection.
- No production or staging function was deployed; no Supabase settings/secrets, grants, schema/data, publisher settings, callback, provider agreement, payment, reward issuance, or money movement was changed.
- Owner-gated criticals: production Offerwall containment; main branch protection; preview auth isolation before preview account testing; Taplayad incentivized-traffic permission and definitive app-10066 protocol; sign-up pause verification; accurate Terms/Privacy/support; and final production release.


## 2026-11-19 21:32 ET — Post-debrief Claude sync verification

- Claude responded to the PR #20 sync request with verifiable PR comment `7028471600`: PR #20 is now head `6e2e51b`, based on integration `387d035`; the staging-only/fail-closed auth guard was preserved. GitHub Actions run `44661202504` passed 58/58 tests, 0 failures/skips.
- Claude also updated the stacked PR #22 to head `332ca07`, based on PR #20 head `6e2e51b`. GitHub Actions run `44661225287` passed 64/64 tests, 0 failures/skips. The PR #22 branch is 2 commits ahead / 0 behind its PR #20 base.
- The integration branch was at `6417323` immediately before this correction; it contains six documentation-only commits after `387d035`. PR #20 is therefore six documentation-only commits behind the integration head at this point. This correction is another documentation-only commit. No further sync request is made in this run to avoid repeated sync churn.
- PR #20 and #22 remain open/unmerged. PR #23 and #24 remain draft, preview-only, with the previously recorded preview-isolation and PR #24 Deno-test blockers. No merge or deployment occurred.


## 2026-11-19 21:33 ET — Owner decision clarification: main-based preview auth

- PR #23 discussion comment `7028436334` confirms the production-targeting `account-auth.js` is inherited from `main`, not introduced by the seven-file game diff. The comment keeps PR #23 game-only and treats a preview-host fail-closed guard as a separate owner decision; no code fix has been pushed.
- Owner decision required: authorize a separate, non-deploying PR to make main-based Pages previews fail closed (while preserving production behavior on `legitloot.site`), or keep Account/auth routes off-limits on all main-based previews. Until resolved, do not click sign-in, sign-up, or recovery on PR #23/#24 preview URLs.
- PR #20 head `6e2e51b` / CI 58/58 and PR #22 head `332ca07` / CI 64/64 remain the latest verified code heads. They remain open/unmerged; no further sync requested in this run.


## 2026-11-19 22:39 ET — Independent Sync Watch: PRs, live controls, and Taplayad protocol conflict

### Repository, branches, commits, PRs, and CI
- Integration branch `build/legitloot-neon-synthwave` is at `7b240b2`; production `main` remains `4e0f533`. GitHub returned 25 branch refs: `build/legitloot-neon-synthwave`, `build/legitloot-platform-foundation`, `build/legitloot-v2`, `build/m2-t1-main-reconcile`, `build/m2-t3-offerwall-record-only`, `build/m2-t3b-staging-origin-isolation`, `build/m2-t4-account-deletion-design`, `claude/ci-test-workflow`, `claude/combined-merge-candidate`, `claude/env-06-staging-guards`, `claude/hustle-rename`, `claude/mig-02-game-platform-source`, `claude/rxt2-launch`, `claude/rxt2-main`, `claude/zvhm-play`, `design/industrial-cyberpunk-rebuild`, `design/neon-comic-arcade`, `docs/m2-t6-release-runbook`, `feature/lootcoins-offerwall-standard`, `fix/wallet-script-cache-bust`, `fix/wallet-summary-timeout`, `main`, `release/main-current-site`, `release/public-pages`, `security/offerwall-gg-production-containment`. Branch protection was not re-queried by the available connector; the prior audit found the then-listed branches unprotected and no rulesets. Keep GOV-01 open; do not assume production merge protection exists.
- Open PRs: #20, #22, #23, #24, and stale draft #9. PR #20 remains open/non-draft at `6e2e51b`, base `387d035`; integration is now `7b240b2`, eight documentation-only commits ahead of that base. The 15-file application diff is unchanged. Actions run `44661202504` passed 58/58 tests, 0 failures/skips, plus the patch whitespace check. Existing independent COMMENT review remains applicable because the sync did not change application files; PR #20 is for owner review for integration acceptance only, not production release.
- PR #22 remains open at `332ca07`, stacked on PR #20 head `6e2e51b`, 2 commits ahead / 0 behind. Actions run `44661225287` passed 64/64 tests, 0 failures/skips, plus whitespace check. Independent COMMENT review `5986626725` found no blocker in the scoped game change. The latest Claude sync artifacts are comments `7028471600` and `7028471854`; no subsequent implementation fix was found.
- PR #23 remains a draft on `main` at `33a5240`, preview-only, with no Actions run. Its game diff is seven files and does not modify auth; its preview inherits main's production-targeting `account-auth.js`. Keep it game-only and owner-gated.
- PR #24 remains a draft on `main` at `fb2e890`, preview-only. The pure-handler fix is verified: Actions run `44670475596` passed 3/3 Deno 2.9.8 tests on PR merge commit `f54fc1e`. This validates only the inert handler, not production containment. Preview auth remains production-targeting and blocked. Findings are in PR comments `7028431331` and `7029857955`.
- PR #9 remains a stale visual redesign draft; no merge or review disposition changed. No PR was merged.

### Code review and game readiness
- PR #20's scoped public-copy changes continue to express LC-only awards for verified in-game milestones, weekly challenges, and seasonal events; provider offers are excluded. Its account code is explicitly staging-only and fails closed unless the exact staging config is present. It is not a production artifact.
- PR #22's Rocket 2 Nowhere source is a self-contained static game; inspected code uses device-local storage and Google Fonts, with no Supabase, account, wallet, LC, or provider callback path. The Games page discloses early access, device-local saves, and no LegitLoot account/LC connection. ZVHM is already live on production; RXT2 is not. Both remain early access and lack shared account/session, cloud-save, and verified LC-event integration.
- Staging `public.game_registry` still contains only the unlisted `zid` / Zombie Invasion Defense development row with null launch URL. `private.game_saves`, `game_events`, and `game_handoff_tickets` are each 0 rows; no challenge/milestone/season tables exist.
- The current integration `earn-providers.js` lists Offerwall.GG and CPAGrip, not Taplayad. Staging `private.providers` also has no Taplayad row. Do not mark Hustle/Taplayad integrated or available.

### Live production and staging controls — read-only
- Cloudflare confirms canonical `legitloot.site` production remains `main` / `4e0f533`. Integration `7b240b2` has successful preview deployments in both Pages projects. PR #20/#22 previews are successful. PR #23/#24 previews are also classified `preview`, but that label does not override hard-coded browser backend URLs.
- **ENV-07 remains critical:** main-based PR #23/#24 previews inherit `account-auth.js` with the production Supabase URL and active `auth.signUp` path. Do not use Account, sign-in, sign-up, or recovery flows on those previews. A separate owner-approved PR is required to add a preview-host fail-closed guard while preserving production behavior; no fix was pushed.
- Production Supabase `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 ACTIVE (`verify_jwt=false`), `wallet-summary` v4 ACTIVE, `offerwall-gg-wall-url` v1 ACTIVE (`verify_jwt=true`). The Offerwall.GG provider row is disabled but retains LC/LootCoins reward metadata and has null terms/approval evidence. The deployed v3 handler does not enforce the disabled provider status. Both public/private `process_offerwall_gg_postback` routines are SECURITY DEFINER and grant EXECUTE to `service_role`; the private routine calls `private.post_journal_transaction`. The live production path remains capable of provider-to-LC issuance if callback configuration is present. This violates the owner-locked policy; no callback or containment action occurred.
- Production `public.get_wallet_summary()` is SECURITY DEFINER and returns cash plus LC fields. The production Rewards/Account source still describes Offerwall.GG-to-LC and cash/withdrawal states; Terms/Privacy still say they are incomplete. Main's Account page exposes Create Account and `account-auth.js` contains `client.auth.signUp`. The actual Supabase sign-up pause setting was not retrievable through the current read tools; do not claim it is applied.
- Staging Supabase `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 ACTIVE (`verify_jwt=false`) and the live routine is record-only, with no journal posting; `offerwall-gg-wall-url` v5 is JWT-protected; `cpagrip-attribution` v5 is JWT-protected. Offerwall.GG and CPAGrip provider rows are disabled; Taplayad is absent. The wall-URL CORS allow-list still includes `https://legitloot.site`, a cross-environment exception to remove/review before any production integration; no setting changed.
- Staging `public.get_wallet_summary()` is SECURITY DEFINER and returns `cash` buckets plus `gameCredits`; `currency.cash` is `USD`, `gameCredits.cashValue` is null and `withdrawable=false`, but cash fields are still returned to the browser. The PR #20 client deliberately ignores those fields and renders only `gameCredits.available`. The response labels `currency.gameCredits` as `LLC` rather than `LC`; the current parser ignores that metadata, but the API contract is inconsistent. Keep cash absent from the public product and resolve this server response/label before claiming the wallet contract is LC-only.
- Security Advisor still reports leaked-password protection disabled and an authenticated SECURITY DEFINER function warning; private-schema RLS-without-policy notices remain informational and should not be blindly “fixed” with public policies.

### Taplayad App 10066 — current official docs still conflict
- Preserve the owner-supplied wall template exactly: `https://offerwall.tplayad.com/10066/{user_id}`. Its Active badge is screenshot evidence only, not proof of permission or successful integration. No Taplayad code, provider row, saved publisher setting, or callback exists.
- Current public docs `https://tplayad.com/docs` use macros `user_id`, `payout`, `reward`, `offer_id`, `status`, `sig`; status 1=credited and 2=reversed; the published signature is `md5(app_id . user_id . api_secret)`, which does not bind transaction ID, reward, payout, offer, or status. The current embed example uses `https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}`, which differs from the owner-supplied host/template.
- Legacy docs `https://tplayad.com/doc/postback` describe HTTP GET fields `subId`, `transId`, `reward`, `payout`, `status`, `campaign_id`, `uuid`; signature `md5(subId . transId . reward . secret)`; status 1/2; exact `OK`/ `DUP` responses and up to five retries after a 60-second timeout. This signature binds transaction/reward but not status or payout. The two public protocols are incompatible; neither is a verified App-10066 contract.
- Current public Terms `https://tplayad.com/terms` were last updated 2026-10-29, require the publisher to be 18+, and make payments subject to dashboard terms; they do not establish app-specific approval for LegitLoot's exact incentivized traffic/model. Obtain written confirmation of App 10066's wall URL, active system/version, permitted traffic, full signed fields, unique transaction ID, reversal/retry/idempotency semantics, and response contract before implementation. Keep record-only; never map the publisher's $1=1 points multiplier or callback `{reward}`/`{payout}` to LC or cash.

### Owner gates and actions not taken
- Critical unresolved owner decisions: production Offerwall.GG containment (SQL grants and Edge Function deployment separately gated); preview-host auth guard PR; provider-specific Taplayad permission/protocol; public sign-up pause/legal readiness; final production release. No automatic action was taken on any of them.
- This check made no PR merge, deployment, Supabase/Cloudflare setting or secret change, SQL/grant/schema/data change, callback invocation, publisher dashboard save/removal, provider agreement, payment, reward issuance, or money movement.


## 2026-11-19 22:51 ET — PR #24 pure-handler testability fix prepared (NOT DEPLOYED)

- PR #24 remains draft on `main`; candidate head is now `fb2e890`. The original test-import side effect is fixed in the PR branch: new `handler.ts` contains only the inert HTTP 410 handler; `index.ts` alone imports it and starts `Deno.serve`; `index_test.ts` imports the pure handler and checks GET/POST/OPTIONS, `410`, `no-store`, and that POST bodies remain unread.
- Added `.github/workflows/offerwall-gg-containment-tests.yml` to run the Deno test file. No GitHub Actions run has surfaced for the new head yet, so the Deno suite is **not verified**. A local Node 22.16 smoke test against the actual handler passed 3/3 methods; this is not a Deno test result.
- PR comment `7029857955` records the fix and exact test limitation. The endpoint remains inert; no Supabase function was deployed, no SQL grants/settings/secrets/schema/data changed, and no callback was invoked.
- PR #24's separate preview-auth issue remains: its main-based preview inherits production-targeting `account-auth.js`. Do not use Account/auth routes. Production containment still requires separate owner approval.


## 2026-11-19 22:52 ET — PR #24 Deno containment tests passed (NOT DEPLOYED)

- PR #24 remains draft at head `fb2e890`. GitHub Actions run [`44670475596`](https://github.com/demonanic/LegitLoot/actions/runs/44670475596) completed successfully on PR merge commit `f54fc1e`; Deno `2.9.8` ran `index_test.ts`: **3 passed, 0 failed** (GET, POST, OPTIONS; 410/no-store; POST body not read).
- The pure-handler split is therefore test-verified. The run validates only the inert handler and test isolation; it does not verify deployed production containment, SQL grants, callback behavior, provider dashboard settings, or preview auth.
- PR comment `7029857955` was updated with the successful run. PR #24 remains a draft and owner-gated. No merge, deploy, Supabase change, callback, or publisher setting change occurred.

## 2026-11-19 23:02 ET — Independent Sync Watch: current PRs, production controls, games, and Taplayad

### Repository, branches, PRs, and CI
- Integration branch is `87a28c5`; production `main` remains `4e0f533`. The branch inventory contains 25 refs. Open PRs are #9, #20, #22, #23, and #24; PR #21 is merged.
- PR #20 remains non-draft at `6e2e51b`, based on `387d035`; Actions run `44661202504` passed 58/58. Comparing its current head with the previously reviewed `2081d0f` shows only the five shared documentation files changed; its 15-file application/test diff is unchanged. Its base is now 31 commits behind integration, and the compare reports changes only in those five documentation files. Do not resync or merge without a new integration disposition.
- PR #22 remains at `332ca07`, stacked on PR #20 head `6e2e51b`; Actions run `44661225287` passed 64/64. Comparing it with the previously reviewed `c70c3d3` likewise shows only the five shared documentation files changed; the reviewed game application diff is unchanged.
- PR #23 remains a draft on `main` at `33a5240`, with no Actions run. Its Cloudflare previews succeeded, but its Account page inherits main's production-targeting `account-auth.js`.
- PR #24 remains a draft on `main` at `fb2e890`. Actions run `44670475596` ran on this exact head and passed all 3 Deno 2.9.8 tests. Independent COMMENT review `5987368371` confirms the inert handler/test scope and re-verifies the live production issuer path; the candidate handler returns HTTP 410 for every method, while SQL revocation remains documentation only. Its preview also inherits main's production-targeting Account auth.
- PR #9 remains an old non-mergeable draft. No new standalone Claude handoff file was found; the current handoff is in `CLAUDE.md`, Master Control, and the PR comments.
- Twelve consecutive commits between `a263cfaf` and `87a28c5` were documentation-only updates. No application code changed in that burst. Batch future multi-document debriefs into one commit where practical to reduce synchronization churn.

### Game and staging state
- PR #22 still contains the two owner-selected early-access game routes: Zombies vs Heavy Metal and Rocket 2 Nowhere. Both are device-save only; neither has shared LegitLoot account/session handoff, cloud saves, or verified LC-event ingestion.
- Read-only staging SQL confirms `public.game_registry` still has only the unlisted `zid` / `zombie-invasion-defense` development row with null launch URL. `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets` each contain 0 rows. No challenge, milestone, or season tables were found.
- Staging `offerwall-gg-postback` v8 is ACTIVE with `verify_jwt=false`, but its current source accepts only record-only results and writes provider metadata; it does not post journal entries. Staging providers contain disabled Offerwall.GG and CPAGrip rows; Taplayad is absent.

### Critical production policy and preview findings
- Production Supabase `gkbqderyjcuxnjbsiffb` still has `offerwall-gg-postback` v3 ACTIVE with `verify_jwt=false`. Its deployed source calls `process_offerwall_gg_postback`. Live private and public routines have the exact signature documented in PR #24, are SECURITY DEFINER, and grant EXECUTE to `service_role`; the private routine calls `private.post_journal_transaction`. The production provider row is marked disabled but retains stale LC/LootCoins reward metadata and has no terms/approval evidence. The prohibited provider-to-LC path remains technically callable. No containment was deployed or applied.
- Production `main` still violates the owner-locked rewards model in its public pages: `rewards.html` says Offerwall.GG completions credit LC and describes cash rewards/withdrawal states; `account.html` renders cash wallet and withdrawal-reserved fields; `earn.html` still uses Earn terminology and says provider completions credit LC. `account-auth.js` hardcodes the production Supabase URL and has an active `auth.signUp` path. Terms and Privacy remain placeholders. PR #20 corrects some public copy and removes cash UI, but its client config is staging-only and is not a production release artifact.
- PR #23/#24 previews are classified as Cloudflare previews, but their inherited `account-auth.js` still targets production and exposes sign-up. Do not use Account, sign-in, sign-up, or recovery on those previews. PR #22 is different: it requires the exact staging config and fails closed.
- The production sign-up pause remains NOT VERIFIED; no Auth setting change was made.

### Taplayad App 10066 protocol check
- Preserve the owner-supplied wall template exactly: `https://offerwall.tplayad.com/10066/{user_id}`. The current public docs list `user_id,payout,reward,offer_id,status,sig`, status 1=credited and 2=reversed, and signature `md5(app_id . user_id . api_secret)`; they provide no unique transaction-ID macro and show deduplication by `offer_id + user_id`. The current example accepts any 2xx response.
- Legacy docs instead list `transId` and signature `md5(subId . transId . reward . secret)`, expect `OK`/`DUP`, and describe retries up to five times after 60 seconds. The protocols are incompatible; neither signature binds the complete status/reward/payout/offer/transaction payload. Current public Terms do not establish App-10066-specific permission for LegitLoot's incentivized traffic model.
- Keep Taplayad unintegrated and record-only. Do not save publisher settings, send callbacks, accept terms, or map the publisher's $1=1 points multiplier or `{reward}`/`{payout}` into LC or cash.

### Actions and next gates
- PR #24's inert-handler tests are now independently verified on the exact head. The candidate is ready for an owner decision on two separate production actions: (1) revoke service_role EXECUTE on the exact private/public callback wrappers, and (2) deploy the HTTP 410 handler. Neither action has occurred; each remains separately owner-gated. The SQL revokes block the current callback-wrapper path, not every possible privileged owner/service-role action elsewhere in the database.
- The main-based preview-auth guard remains a separate owner decision. The game account/save/event pipeline and LC challenge pipeline remain incomplete. Taplayad needs written confirmation of the active App-10066 protocol, complete signed transaction/reversal semantics, and incentivized-traffic permission.
- No PR merge, deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting save/removal, provider agreement, payment, reward issuance, or money movement occurred in this check.
- The four shared control records were refreshed together in one documentation-only commit; no application code changed.


## 2026-11-20 00:28 ET — Independent Sync Watch #3: Offerwall.GG containment verified; source drift remains

### Repository, PRs, and handoffs
- Authorized integration branch is 61e6e2f; production main is bcc19d. The integration branch is 34 commits ahead of PR #20's base 387d035; the compare shows only the five shared control documents changed. PR #20/#22 application diffs are unchanged, so no docs-only resync was performed.
- Open PRs: #20 (6e2e51b, 58/58 CI), #22 (332ca07, 64/64 CI, stacked on #20), #23 (33a5240, draft, no CI), and stale #9. PR #21 and PR #24 are merged. PR #24's Deno run 44670475596 passed 3/3 tests on its candidate head.
- Verifiable Claude artifacts remain PR #20 comment 7028471600, PR #22 comment 7028471854, and PR #24 test/review comments 7029857955 / 5987368371. No newer standalone Claude handoff note was found; CLAUDE.md is the current entrypoint and has been refreshed.

### Production deployment and Offerwall.GG containment
- PR #24 is merged to main as bcc19d. Cloudflare Pages production deployment 75207a07-6306-4461-b115-c6c4a508bd97 was created 2026-11-20 04:10:14Z and completed successfully at 04:11:50Z on branch main, commit bcc19d, with alias https://legitloot.site. This occurred before this check; this run did not merge or deploy.
- Read-only production Supabase inspection confirms offerwall-gg-postback v4 ACTIVE/verify_jwt=false and offerwall-gg-wall-url v2 ACTIVE/verify_jwt=true. Both deployed sources are inert HTTP 410 handlers; the callback handler does not read request bodies/secrets or call Supabase, and the launcher no longer creates wall URLs.
- Read-only SQL confirms service_role EXECUTE is false for both private.process_offerwall_gg_postback and public.process_offerwall_gg_postback; the checked anon and authenticated privileges are also false. The functions remain SECURITY DEFINER but the checked callback roles cannot execute them. No callback was invoked.
- The production provider row remains disabled but retains stale standard_virtual_currency / LC / LootCoins metadata with null terms and approval references. The Offerwall.GG publisher dashboard callback URL was not changed; the endpoint it targets is now inert.

### Critical repository/source drift
- PROV-08 — CRITICAL: main/supabase/functions/offerwall-gg-wall-url/index.ts still contains the old active launcher: it reads OFFERWALL_GG_PUBLIC_KEY/SECRET, signs parameters, authenticates the user, and constructs https://offerwall.gg/wall/{publicKey}. PR #24 changed eight files but did not change this source file. The deployed production v2 is inert while the canonical repository source remains active; a future redeploy from repository source could re-enable the launcher. The smallest safe correction is to align this source with the deployed 410 behavior and add a regression test/workflow path before any future function redeploy. Production deployment remains owner-gated.
- PR #24's registry test checks that Offerwall.GG is absent and CPAGrip is testing, but it does not assert that the wall-URL source is inert or that the Rewards/Account cash UI is absent.

### Owner-locked launch blockers
- Production rewards.html still renders a cash wallet and withdrawal states (lines 20, 25, 27); account.html still shows cash wallet, pending/reserved/paid cash (lines 4, 15–17); account-auth.js requires and formats cash fields (lines 53–70). Production public.get_wallet_summary() remains SECURITY DEFINER and returns cash USD buckets plus LC. This violates the no-cash/no-withdrawal/no-USD-peg rule.
- Production earn.html says the server credits LC after a provider confirms a completion (line 9); earn-providers.js repeats provider-to-LootCoin issuance language (lines 5, 23). This conflicts with the rule that LC comes only from verified in-game milestones, weekly challenges, and seasonal events.
- terms.html says formal Terms are not published; privacy.html says the full Privacy Notice is in preparation. account.html exposes Create Account and account-auth.js still calls client.auth.signUp (line 114). The production Auth sign-up pause remains NOT VERIFIED through available read-only tools.
- Production games.html still lists only Zombies vs Heavy Metal and says more worlds later. Rocket 2 Nowhere is not on production: PR #22 is an integration candidate; PR #23 is a draft main-based preview with no CI. Staging game_registry still contains only the unlisted ZID placeholder; game saves, events, and handoff tickets are all zero. Shared account/session handoff, cloud saves, and verified LC-event ingestion remain incomplete.
- The integration preview on 42cf97c is classified preview, has only its build-branch alias, and uses supabase-config.js pinned to staging plus a fail-closed staging-only account-auth.js. PR #23's main-based preview still inherits production-targeting account-auth.js; do not use its Account/auth routes.
- PR #20's base is 45 commits behind current integration; GitHub compare shows only the five shared control documents differ. PR #22 is stacked on PR #20; its history is divergent against integration (45 ahead / 15 behind), but the tree comparison also shows only those five shared documents differ. Application files are unchanged; do not sync solely for documentation churn.

### Taplayad App 10066 — fresh public-doc check
- Preserve the owner-supplied template exactly: https://offerwall.tplayad.com/10066/{user_id}. Current official docs list user_id,payout,reward,offer_id,country,user_ip,status,sig; status 1=credited and 2=reversed; signature md5(app_id . user_id . api_secret); postback IP 176.97.212.58; and any 2xx response marks delivery. There is no transaction-ID macro, and the signature does not bind reward, payout, offer, or status. The example's offer_id + user_id dedupe is not a verified unique transaction/reversal contract.
- Current docs show an iframe host/template different from the owner's supplied URL. The legacy /doc/postback page now returns 404, so its older transId formula must not be treated as the current contract. Current Terms were last updated 2026-10-29, require publishers to be 18+, and leave payment terms to the dashboard; no App-10066-specific permission for LegitLoot's incentivized traffic model is established.
- Staging has no Taplayad provider row or integration. Keep it unintegrated/record-only; never map the publisher's $1=1 points multiplier or callback {reward}/{payout} to LC or cash.

### Staging and security snapshot
- Staging offerwall-gg-postback v8 remains record-only and does not post journal entries. Staging offerwall-gg-wall-url v5 remains active and its CORS allow-list includes https://legitloot.site; review this cross-environment exception before any staging/production integration. Staging providers contain only disabled CPAGrip and Offerwall.GG; Taplayad is absent.
- Staging wallet RPC still returns cash USD buckets and labels game credits LLC; the game registry remains the unlisted ZID placeholder.
- Production Security Advisor still reports leaked-password protection disabled and an authenticated SECURITY DEFINER warning for get_wallet_summary(); 12 private RLS/no-policy notices are informational and should not be fixed by adding public policies blindly. No security setting was changed.

### Actions taken
- This run performed read-only GitHub, Cloudflare, Supabase, and public Taplayad documentation checks, then updated only shared documentation on the authorized integration branch. No PR merge, deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance, or money movement was performed by this run. No live HTTP callback/410 probe was made.


## 2026-11-20 01:36 ET — Independent Sync Watch #4

- Re-read the current operating record and checked the integration branch at `e868121`. Open PRs remain #20, #22, #23 and #9; this check added draft PR #25 for the Offerwall.GG wall-URL source drift. No existing PR was merged.
- PR #20 (head `6e2e51b`) and PR #22 (head `332ca07`) retain their previously reviewed application diffs; the 39 commits between PR #20's base `387d035` and current integration `e868121` are documentation-only. Their Actions runs remain green (58/58 and 64/64). Do not resync solely for documentation churn. PR #23 remains draft/no CI; its main-based preview Account/auth routes still target production and must not be used. PR #9 remains stale.
- **PROV-08 remains critical for source hygiene:** production `main/supabase/functions/offerwall-gg-wall-url/index.ts` still contains the old active launcher (Supabase client, provider secrets, signature generation, auth lookup and wall URL construction, lines 1 and 21–65), while production's deployed v2 is inert HTTP 410. PR #24 did not change this source. Draft PR #25 changes only the authorized integration branch source to a side-effect-free 410 handler and adds runtime/static regression tests; it does not change `main` or deploy any function.
- PR #25 Actions run [44689653386](https://github.com/demonanic/LegitLoot/actions/runs/44689653386) passed the full Node suite: 54 passed, 0 failed, 0 skipped. The isolated handler test also passed 3/3 locally. Cloudflare automatically built the branch as `environment=preview` in both Pages projects; aliases are pages.dev only. Its `supabase-config.js` pins staging and `account-auth.js` fails closed unless the exact staging config is present.
- Fresh official Taplayad docs check found the sample postback URL uses `offer={offer_id}` while the PHP example reads `$_GET['offer_id']`; the macro table says `{offer_id}`. The current signature `md5(app_id . user_id . api_secret)` does not bind transaction identity, offer, reward, payout or status; no transaction-ID macro or documented retry schedule is provided. Status 2 is described as reversal, but no stable original-transaction reference is defined. Terms updated 2026-10-29 require publishers to be 18+ and leave payment terms to the dashboard; App-10066 incentivized-traffic permission remains unverified. Keep Taplayad unintegrated/record-only and preserve the owner-supplied URL exactly.
- No production/staging Supabase function deployment, setting/secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement was performed. Production main still has the previously recorded cash/withdrawal UI and provider-to-LC copy, incomplete Terms/Privacy, and unverified sign-up pause.
- Next: independently review PR #25 and leave it draft for owner disposition. A separate owner-gated main-source alignment remains necessary before any future production function redeploy. Do not merge or deploy.


## 2026-11-20 01:49 ET — Final read-only recheck

- Independent review of draft PR #25 is complete. Its full GitHub Actions run [44689653386](https://github.com/demonanic/LegitLoot/actions/runs/44689653386) passed 54/54 tests (0 failed/skipped); isolated handler tests passed 3/3 locally. Keep it draft for owner disposition.
- Production Supabase recheck: `offerwall-gg-wall-url` v2 (JWT) and `offerwall-gg-postback` v4 (no JWT) are both deployed inert HTTP 410 handlers. Read-only privilege checks show `service_role`, `anon`, and `authenticated` cannot EXECUTE either the private or public callback SECURITY DEFINER routine.
- Staging remains exposed to a wall-link path: `offerwall-gg-wall-url` v5 is ACTIVE/JWT and its deployed CORS allow-list includes `https://legitloot.site` plus the integration preview origin. It reads service-role and Offerwall.GG keys, authenticates the caller, signs parameters and returns a wall URL. The player registry is disabled, but a direct authenticated call remains possible. Staging postback v8 is ACTIVE/no-JWT; both database routines are record-only and contain no journal, ledger or LootCoin references. Do not invoke either endpoint or deploy during this run.
- Production and staging provider rows both show Offerwall.GG disabled, null approval/terms fields, but stale `approved_reward_model` metadata specifying standard virtual currency / LC / LootCoins. Staging also has CPAGrip disabled and no Taplayad row. No data was changed; this stale metadata is a latent reactivation hazard and remains owner-gated.
- Current and legacy Tplayad documentation describe incompatible protocols. Current docs use `md5(app_id . user_id . api_secret)`, omit transaction identity from the macro list, and say any 2xx acknowledges delivery. Legacy docs use `subId`, `transId`, `reward`, signature `MD5(subId . transId . reward . secret)`, status 1/2, `OK`/`DUP`, and up to five retries after a 60-second timeout. Do not combine them by inference; obtain written App-10066 confirmation. The current sample also says `offer={offer_id}` while its PHP sample reads `offer_id`. Keep Taplayad unintegrated/record-only and preserve the owner URL exactly.
- Integration head after the five documentation-only debrief commits is `432060b`; its Actions run [44689900735](https://github.com/demonanic/LegitLoot/actions/runs/44689900735) passed 50/50. PR #25 remains based on `e868121`, five docs-only commits behind, and GitHub reports it mergeable. Do not resync solely for documentation churn.
- PR #20/#22 remain ready for owner review for integration acceptance only (58/58 and 64/64 tests); their 44-commit lag is documentation-only. PR #23 remains draft/no CI with production-targeting Account/auth in its main-based preview; PR #9 remains stale and contradicts the locked game/LC policy.
- Production main still has the old active wall-url source, cash/withdrawal UI and API fields, provider-to-LC copy, incomplete Terms/Privacy, and unverified sign-up pause. Separate main-source alignment and staging wall-url containment require owner disposition. No production/staging function deployment, project setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement was performed.


## 2026-11-20 01:55 ET — Independent Sync Watch #5

- **Repository/branches:** production `main` remains `bcc19d`; integration `build/legitloot-neon-synthwave` is `42cf97c`. The integration push workflow [44690472788](https://github.com/demonanic/LegitLoot/actions/runs/44690472788) passed 50/50. The repository has 26 branches; `main` reports `protected:false`, so owner gates remain procedural.
- **Open PRs:** #20 (head `6e2e51b`, 58/58 CI), #22 (head `332ca07`, 64/64 CI), #23 (draft, no CI, main-based preview auth risk), #25 (draft/mergeable, head `61f9ca8`, 54/54 Node tests plus Deno type-check and Deno tests), and stale #9. PR #20 is 45 commits behind integration by ancestry but compare shows only the five shared documents differ. PR #22's ancestry is divergent (45 ahead/15 behind), while its tree comparison also shows only those five documents differ. Do not sync solely for documentation churn.
- **PR #25 review:** Cloudflare automatically built both Pages previews on head `61f9ca8`; both succeeded with pages.dev-only aliases. I added COMMENT review [5988741931](https://github.com/demonanic/LegitLoot/pull/25) identifying a non-blocking static-test gap: the guard scans `index.ts` and `handler.mjs` only, not transitive local imports. Recommend asserting the exact import graph or recursively scanning local imports. The current handler remains inert; this is test hardening, not a current runtime defect.
- **Claude attribution:** PR #25 contains 16 commits, all attributed by GitHub to `demonanic`; latest `61f9ca8` adds the Deno entrypoint type-check. No new Claude-authored commit or standalone Claude handoff note was verified in this window. Existing PR #20/#22 co-authored handoff comments remain verifiable; do not attribute PR #25 commits to Claude.
- **Production Offerwall.GG:** live project `gkbqderyjcuxnjbsiffb` remains ACTIVE_HEALTHY. Deployed wall-url v2/JWT and postback v4/no-JWT both contain inert HTTP 410 handlers. Read-only SQL confirms `service_role`, `anon`, and `authenticated` cannot EXECUTE the private/public `process_offerwall_gg_postback` SECURITY DEFINER routines. No callback was invoked. Production `main/supabase/functions/offerwall-gg-wall-url/index.ts` still contains the old active launcher (Supabase client, Offerwall.GG secrets, signature generation, user authentication, and wall URL construction). PR #25 changes integration source only; future production redeployment from current main could restore the launcher. Separate owner-gated main-source alignment remains necessary.
- **Staging Offerwall.GG:** live project `scmnxcsggquwtuyyjnnj` remains ACTIVE_HEALTHY. Wall-url v5 is ACTIVE/JWT and its deployed source still authenticates users, reads service-role/provider keys, signs parameters, and returns Offerwall.GG wall URLs; CORS allows both `https://legitloot.site` and the integration preview origin. The registry is disabled, but an authenticated direct call remains possible. No deployment or invocation was performed.
- **New staging callback integrity finding — PROV-09:** postback v8 is ACTIVE/no-JWT and remains record-only; the private callback routine inserts callback/conversion records but contains no journal/ledger/LC writes. However, the handler's HMAC input is only `${userId}:${transactionId}:${currencyAmount}`. `offerId`, `offerName`, `goalId`, `payoutUsd`, and `timestamp` are not bound to the signature. The service-role metadata RPC updates payout/timestamp fields on the conversion row. This permits tampering with reconciliation metadata if a valid signed callback is replayed with altered unsigned fields. It is a staging data-integrity defect, not a current LC-issuance path. Keep provider disabled/record-only; before any future integration, require a provider-authenticated contract that binds all material fields and add tamper/replay/reversal tests.
- **Provider registry:** production and staging Offerwall.GG rows remain disabled with null approval/terms references but stale `standard_virtual_currency / LC / LootCoins` reward metadata. Staging has no Taplayad row. No registry data was changed.
- **Taplayad App 10066:** current docs at [tplayad.com/docs](https://tplayad.com/docs) specify `md5(app_id . user_id . api_secret)`, macros `user_id,payout,reward,offer,status,sig`, status 1/2, and any 2xx acknowledgment; no transaction-ID macro or retry schedule is documented, and the signature does not bind transaction, reward, payout, offer, or status. The sample uses `offer={offer_id}` while PHP reads `offer_id`. The legacy non-www URL returns 404, but the www legacy guide remains available and specifies `subId/transId/reward`, `MD5(subId . transId . reward . secret)`, `OK/DUP`, and up to five retries after 60 seconds. Do not combine protocols by inference. Terms updated 2026-10-29 require publishers to be 18+ and do not establish App-10066 incentivized-traffic permission. Preserve the owner's template exactly: `https://offerwall.tplayad.com/10066/{user_id}`; never map publisher points, `{reward}`, or `{payout}` into LC.
- **Launch policy remains FAIL/NOT VERIFIED on production:** `account.html` and `rewards.html` still expose cash/withdrawal UI; `account-auth.js` requires cash wallet fields; production `get_wallet_summary()` returns cash USD buckets plus LC; `earn.html` still says provider-confirmed completions credit LC. Terms/Privacy remain placeholders, production signup pause is not verifiable through available read-only tools, and production `games.html` lists only Zombies vs Heavy Metal (Rocket 2 Nowhere remains preview/integration-only). Shared account/session, cloud-save and verified LC-event ingestion are incomplete.
- **Actions:** read-only GitHub/Supabase/public-doc checks, PR #25 COMMENT review, and documentation updates only. No PR merge, production/staging deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance, or money movement. Cloudflare branch builds were automatic previews, not production deployments.
- **Next:** owner disposition of PR #25 and separate owner-gated main-source alignment; keep staging wall-url/postback disabled from player-facing use. Do not invoke or deploy during a run whose instruction prohibits it.


## 2026-11-20 01:56 ET — Documentation CI correction

- The push workflow for documentation commit `5236e7e` ran the full Node suite successfully (50/50) but failed `git diff --check` on trailing spaces in the updated `Last updated` and `Last verified` metadata lines. Follow-up documentation commit `c25df5c` removed those spaces; Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) then passed 50/50 and the whitespace check. No application files or tests changed.


## 2026-11-20 01:57 ET — Documentation CI verified

- Follow-up commit `c25df5c` is the current integration head. Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) completed successfully: Node suite 50/50 and `git diff --check` passed. The prior run [44692216892](https://github.com/demonanic/LegitLoot/actions/runs/44692216892) had the same 50/50 tests but failed only on the two metadata trailing-space lines now corrected.
- PR #25 remains draft and integration-only; its base `e868121` is now eight documentation-only commits behind integration. Application files did not change in the follow-up; no resync is needed solely for documentation.


## 2026-11-20 03:31 ET — Independent Sync Watch #6

- Re-read the shared operating agreement, all four working records, `CLAUDE.md`, and `docs/CLAUDE_START_HANDOFF_M1.md`. No newer standalone Claude handoff note or new Claude-authored commit was verified. PR #25's 16 commits are GitHub-attributed to demonanic; PR #20/#22 retain verifiable Claude-authored sync commits.
- At audit start, production `main` was @ `bcc19d` and integration `build/legitloot-neon-synthwave` was @ `0bcd3cb`; this check added documentation-only updates to integration. GitHub currently returns 25 branches. PR #20 (head `6e2e51b`, 58/58 CI) and #22 (head `332ca07`, 64/64 CI) are open, non-draft and mergeable; #23 (head `33a5240`) remains draft with no CI and inherited production-targeting Account/auth; #25 (head `61f9ca8`) remains draft/mergeable with 54/54 Node tests plus passing Deno type-check and handler tests. PR #25 is nine commits behind integration by ancestry, but only the five shared control documents differ. PR #20 is 48 commits behind by ancestry, also only those five documents differ.
- Production Supabase read-only verification: wall-url v2 is ACTIVE/JWT but returns inert HTTP 410; postback v4 is ACTIVE/no-JWT but returns inert HTTP 410. The checked private/public callback routine EXECUTE privileges are false for service_role, anon, and authenticated. Production callback-event and conversion counts are both zero. The disabled Offerwall.GG provider row still has null approval/terms fields but stale LC/LootCoins reward metadata.
- Staging read-only verification: wall-url v5 remains ACTIVE/JWT and its CORS allow-list includes `https://legitloot.site`; postback v8 remains ACTIVE/no-JWT. Live staging callback routines are record-only; callback-event and conversion counts are zero. PROV-09 remains: the callback HMAC covers only `userId:transactionId:currencyAmount`, while unsigned payout/timestamp metadata is passed to a separate metadata RPC even after a duplicate result. This can alter reconciliation metadata on a replay but is not an LC-issuance path. Do not invoke either endpoint.
- **New source-drift finding:** production `main/supabase/functions/offerwall-gg-postback/index.ts` is inert, while integration's same path remains an active record-only Supabase/HMAC/RPC handler. Production `main/supabase/functions/offerwall-gg-wall-url/index.ts` still contains the old active launcher; PR #25 corrects only the integration wall-url source. Integration must not be promoted until both Offerwall.GG source entrypoints are aligned with the production containment state. No merge or deployment is authorized by this run.
- **New snapshot-documentation correction:** `supabase/environments/staging/schema-snapshot/routines.sql` still contains the pre-record-only journal-posting implementation, despite applied migration `20261119145340_offerwall_gg_record_only` and the live record-only function. Updated its README to label the snapshot stale for Offerwall.GG and prohibit replay. No database object was changed.
- Fresh current Tplayad docs specify `md5(app_id . user_id . api_secret)`, status 1/2 and any-2xx acknowledgement, but no transaction-ID macro or retry schedule; the sample's `offer={offer_id}` conflicts with PHP's `offer_id`. Both old `/doc/postback` URLs (www and non-www) now return 404. The current generic iframe URL differs from the owner's exact App-10066 template. Added correction comment [7034570945](https://github.com/demonanic/LegitLoot/pull/20). Keep Taplayad unintegrated pending written confirmation of exact URL, full signed fields, transaction/reversal/retry contract, and incentivized-traffic permission; never map points/reward/payout to LC.
- Production launch remains FAIL/NOT VERIFIED: cash/withdrawal wallet UI and API fields remain; `earn.html` still describes provider-confirmed LC; Terms/Privacy are placeholders; signup pause is unverified; Rocket 2 Nowhere is not on production `games.html`; shared game/account/save and verified LC-event integration remain incomplete.
- Actions: read-only GitHub, Supabase SELECT, and public documentation checks; one corrective PR #20 comment; documentation-only updates on the authorized integration branch. No PR merge, deployment, Supabase settings/secrets/grants/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance, or money movement.


## 2026-11-20 04:39 ET — Independent Sync Watch #7

- Re-read the shared control documents, CLAUDE.md, README.md, AGENTS.md, the M1 Claude handoff, the governing Constitution and Platform Build Spec, and the relevant Offerwall.GG, account-deletion and release documents. The docs directory still contains only the historical CLAUDE_START_HANDOFF_M1.md; no newer standalone Claude handoff was found.
- GitHub state: 26 branches; production main is bcc19d and authorized integration is a345aa3. GitHub reports protected=false for both. No production merge/deploy authority was exercised.
- PR #20 is open/non-draft/mergeable at head 6e2e51b, base 387d035; exact-head Actions run 44661202504 passed 58/58. The PR description is stale: it cites head 4a0db7a, base 3cf3578 and 53/53. The 59 commits between its base and current integration change only six shared documentation files; the reviewed application diff is unchanged. Comment 7036351593 records the correction. Its LC-only account UI and Hustle copy are improvements, but they do not change the server wallet contract.
- PR #22 is open/non-draft/mergeable at head 332ca07, stacked on PR #20, 2 commits ahead/0 behind its base; Actions run 44661225287 passed 64/64. ZVHM is live on production as device-save early access; RXT2 is preview-only. Neither game has shared account/session handoff, cloud saves or verified LC-event ingestion.
- PR #23 is draft at head 33a5240, based on main, with no CI. Cloudflare deployments 5c3dd1bf-04d7-4901-8a17-3c30f0302278 and eda80ba7-048a-42de-a6a8-94cc58c98dd7 are environment=preview and pages.dev-only, but the bundle contains main's account-auth.js, which hardcodes production Supabase at https://gkbqderyjcuxnjbsiffb.supabase.co and exposes auth.signUp; the deployment has no environment variables. This is a production-backend preview-isolation violation. Do not use Account/auth routes. Comment 7036403044 records the blocker.
- PR #25 remains draft/mergeable at head 135607e, based on e868121. The 20 commits between its base and current integration affect only the six shared documentation files. I added test-only commit 135607e to recursively scan relative import/export graphs for production-origin and Offerwall reactivation paths. Exact-head Actions runs 44713338718 (Node tests plus whitespace check) and 44713338856 (Deno type-check and inert-handler test) passed. Cloudflare automatically built the exact head in both Pages projects as environment=preview with pages.dev-only aliases. PR #25 changes only the wall-URL source; it does not align the postback source. Comment 7036350760 records the remaining boundary. PR #9 remains stale.
- Production Supabase read-only verification: deployed wall-url v2 and postback v4 are inert HTTP 410 handlers; checked callback routine EXECUTE is false for service_role, anon and authenticated; callback/conversion counts are zero. Production main's wall-URL source still contains the old active launcher, while main's postback source is inert.
- Staging read-only verification: wall-url v5 is ACTIVE/JWT and its deployed CORS allow-list includes https://legitloot.site plus the full build preview origin; postback v8 is ACTIVE/no-JWT and record-only. Its HMAC covers only userId:transactionId:currencyAmount; offerId, offerName, goalId, payoutUsd and timestamp are unsigned and passed to metadata storage even after a duplicate result. Live callback routines are SECURITY DEFINER and service_role-executable, but their current definitions contain no journal, ledger or LootCoin references; callback/conversion counts are zero. This is a staging reconciliation-integrity defect, not a verified LC-issuance path. The canonical integration wall-URL source is still active and does not match the deployed staging snapshot; integration postback source is also still active record-only.
- Production and staging provider rows remain disabled with null approval/terms evidence. Offerwall.GG retains stale standard_virtual_currency / LC / LootCoins metadata; staging CPAGrip is disabled; no Taplayad row exists. Do not treat stale metadata as approval or a valid reward model. The staging schema snapshot routines.sql still contains the pre-record-only journal-posting routine; its README warning says not to replay it.
- Production and staging public.get_wallet_summary() still return cash USD buckets; staging also labels gameCredits as LLC. Deployed production wallet-summary v4 returns USD cash buckets and LLC gameCredits. Production account.html/rewards.html still show cash/withdrawal UI; production earn.html still describes provider-confirmed LC; production games.html lists only ZVHM; account-auth.js still has active signup; Terms and Privacy remain placeholders. PR #20's integration UI is LC-only and its parser ignores cash fields, but the backend contract remains non-compliant. Signup pause and account deletion/export are not verified/complete.
- Taplayad current official docs (checked 2026-11-20: https://tplayad.com/docs) specify md5(app_id . user_id . api_secret), status 1/2, any-2xx acknowledgement, no transaction-ID macro and no retry schedule. The URL sample uses offer={offer_id} while the PHP sample reads offer_id. The cached www legacy postback page still appears in search but direct fetch returns 404; do not rely on its old subId/transId protocol. Current Terms (last updated 2026-10-29: https://tplayad.com/terms) require publishers to be 18+ and leave payment details to the dashboard; no App-10066-specific permission for this LegitLoot placement was verified. The homepage describes rewarded offers generally. Preserve the owner template exactly: https://offerwall.tplayad.com/10066/{user_id}. Do not map the publisher's $1=1 points multiplier, callback reward or payout to LC.
- GitHub attributes the latest relevant Claude commits to Claude: PR #20 head 6e2e51b and PR #22 head 332ca07 (2026-11-20 02:29 UTC), plus PR #23 head 33a5240 (2026-11-20 01:28 UTC). No newer Claude-authored commit or handoff was verified since the 03:31 ET check. PR #25 test commit 135607e is authored by demonanic, not Claude.
- Actions performed: read-only GitHub/Supabase/Cloudflare inspection; test-only import-graph hardening on PR #25; review comments 7036350760, 7036351593 and 7036403044; documentation updates. No PR merge, production or staging function deployment, Supabase settings/secrets/grants/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.
- Next: keep PR #25 draft for owner review; prepare separately reviewed source alignment for both Offerwall.GG functions and a staging-only containment candidate, but do not deploy in this run. Keep PR #23 blocked until its preview cannot initialize production Supabase. Continue M2-T4 per the Master Control; the Offerwall.GG work remains the owner's requested critical launch/security focus.


## 2026-11-20 04:55 ET — Critical launch-game identity correction

- Re-inspected PR #22's actual play route and test. Production main and PR #22 both use zombies-vs-heavy-metal.html, whose iframe src is https://demonanic.github.io/Legitloot-2/. Platform Build Spec §0.4 explicitly says demonanic/Legitloot-2 is Zombie Invasion Defense and is not a substitute for the owner-selected Zombies vs Heavy Metal.
- PR #22's games.html labels the card PLAYABLE and links to that wrapper. tests/launch-games.test.mjs explicitly asserts the excluded iframe URL and then suppresses the excluded game's name from the catalog. This test codifies the owner-decision violation, not a valid identity check.
- Added blocking comments to PR #22: 7036549802 and 7036564753. Keep the ZVHM card/route unavailable or clearly unverified until the actual owner-approved ZVHM source/build is identified. Do not use or relabel Zombie Invasion Defense as ZVHM.
- RXT2 is a separate in-repo build at games/rocket-2-nowhere/index.html in PR #22/#23; it is preview-only, device-save early access, and has no shared account or LC connection.
- Correction to the 04:39 ET Sync Watch note: the production ZVHM wrapper exists, but it does not establish that the owner-selected ZVHM game is live. The selected game's actual source/identity remains unverified. PR #22's 64/64 tests pass but do not validate game identity.
- No game code, test, deployment, production setting or external source was changed in this correction. Only PR review comments and shared documentation were updated.


## 2026-11-20 05:13 ET — Independent Sync Watch #8

- Re-read the shared control, progress, launch audit, environment source of truth, CLAUDE.md, and the only standalone Claude handoff docs/CLAUDE_START_HANDOFF_M1.md. No newer handoff note was present.
- Rechecked all 26 branches, open PRs, current heads, review comments, and Actions. Integration application baseline is 56b98e4 (Actions run 44715079355 passed); subsequent Sync Watch commits on the authorized branch are documentation-only. Docs-only run 44719170874 passed npm test but failed whitespace checks; follow-up run 44719451991 also passed npm test and failed only because the five updated records had extra blank lines at EOF. This follow-up trims them. Production main is bcc19d6. All 26 branch refs report protected:false.
- PR #21's Claude-authored ZVHM wrapper was merged by the owner account and deployed, but its iframe points to the repository §0.4 excludes as Zombie Invasion Defense. PR #22's 64/64 test explicitly asserts that excluded URL. Existing blocking comments remain; the selected ZVHM build is not verified.
- PR #23's Cloudflare deployment is a preview with no environment variables, but its Account/auth bundle still targets production Supabase. Do not use its auth routes.
- Re-read production and staging Edge Function sources and SQL privileges. Production Offerwall.GG runtime remains inert 410 with checked callback EXECUTE privileges revoked. Staging wall-url v5 and postback v8 are ACTIVE and exactly match their environment snapshot source; wall-url allows the production origin, while postback remains record-only with unsigned reconciliation metadata. Live staging routines contain no journal/ledger/LC references.
- Found a test/deployment-source coverage gap: PR #25's recursive guard deliberately excludes environment snapshots, but the active staging deployments exactly match those excluded snapshots. Added PR #25 comment 7037024928 requesting a separate deployment-source/manifest guard.
- Rechecked wallet contracts: production/staging RPCs still return cash USD buckets; staging labels game credits LLC. Production wallet-summary v4 differs from the RPC response shape and has no current page caller found by repository code search.
- Rechecked Taplayad's current docs and Terms. App 10066 remains unintegrated pending written permission and a complete transaction/reversal/retry contract. Owner URL preserved; no provider points or callback values map to LC.
- Actions this run: read-only GitHub/Supabase/Cloudflare inspection, one actionable PR #25 comment, and documentation updates only. No production or staging mutation, PR merge, callback, publisher setting, provider agreement, payment, reward issuance, or money movement.

## 2026-11-20 05:14 ET — Documentation CI correction

- Docs-only commit 4f3ed99 triggered Actions run 44719170874. npm test passed; the whitespace check failed only on trailing spaces in this file's lines 8 and 65 and an extra blank line at EOF of docs/LAUNCH_READINESS_AUDIT.md.
- Removed the two trailing-space instances and the extra EOF blank line in the follow-up docs-only commit. Verify the new Actions run before marking the updated documentation green.

## 2026-11-20 05:15 ET — Documentation CI follow-up

- Docs-only run 44719451991 passed npm test but failed the whitespace check because each of the five updated records had an extra blank line at EOF. The follow-up documentation commit 46be8d7 removed those EOF blanks; Actions run 44719817398 passed npm test and the whitespace check.


## 2026-11-20 06:28 ET — Sync Watch #9

- **New RUNBOOK-01 — pre-containment rollback hazard:** `docs/RELEASE_RUNBOOK.md` previously said to redeploy the previous Edge Function source and cited historical Offerwall.GG postback v3 / wall-url v1 snapshots. The manifest and source prove these are pre-containment active implementations. Current production is postback v4 / wall-url v2, both inert HTTP 410. Restoring v1/v3 could reactivate the provider launcher/callback; the private production callback routine still contains journal/ledger code even though checked EXECUTE grants are revoked. Corrected the runbook to prohibit v1/v3 rollback and require preserving only the inert v2/v4 handlers. Current deployed hashes are recorded in `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`; exact inert v2/v4 sources still need a versioned repository snapshot before any future rollback.
- Production read-only verification: project ACTIVE_HEALTHY; postback v4 and wall-url v2 are inert; private/public callback EXECUTE is false for service_role, anon and authenticated; callback/conversion counts 0/0. Production `get_wallet_summary()` still returns cash USD buckets; wallet-summary v4 returns cash plus gameCredits/LLC. The private production callback routine still contains the old journal/ledger posting implementation; do not restore grants.
- Staging read-only verification: project ACTIVE_HEALTHY; wall-url v5 remains active/JWT and CORS allows `https://legitloot.site`; postback v8 remains active/no-JWT and record-only. Deployed staging source exactly matches the checked-in snapshots. Staging `private/public.process_offerwall_gg_postback` and `public.record_offerwall_gg_metadata` are SECURITY DEFINER and service-role executable; direct EXECUTE on `private.record_offerwall_gg_metadata` is false for checked roles. Live definitions have no journal/ledger references; callback/conversion counts 0/0. Postback HMAC binds only user ID, transaction ID and amount; unsigned offer/goal/payout/timestamp metadata can be updated after duplicate results. Keep inactive; no provider activation.
- Both provider registries retain disabled Offerwall.GG rows with null approval/terms but stale LC/LootCoins reward metadata. Taplayad App 10066 remains unintegrated and unapproved; preserve the exact owner URL and do not map provider points/reward/payout to LC.
- Integration `6fc8e48` passed Actions `44719973348`; production main `bcc19d6` passed containment Actions `44672601131`. PR #20/#22 remain green at 58/64 tests but blocked by existing wallet/game findings; PR #23 remains draft/no CI and its preview auth targets production; PR #25 remains draft with 54/54 Node and passing Deno tests, changes only integration wall-url source, and does not contain staging or postback. Direct GitHub REST reports PR #25 `mergeable=true/clean`; normalized PR-info reported false, so this is recorded as an API read inconsistency, not approval.
- 26 branches report `protected=false`. M2-T1/T3/T3b/T4/T6 and MIG-02 task branches are stale relative to integration. The old M2-T3 branch carries identical record-only SQL under obsolete migration version `20261119120000`, while staging applied `20261119145340`; do not merge/replay it. The account-deletion design, release runbook and MIG-02 source/test are already on integration. Only `docs/CLAUDE_START_HANDOFF_M1.md` exists as a standalone Claude handoff; no new Claude-authored commit was verified.
- Active task remains M2-T4. Existing blockers remain: ZVHM source identity, RXT2 preview-only, PR #23 production-connected preview auth, wallet/cash policy mismatch, incomplete Terms/Privacy/support/deletion, unverified signup pause, and missing shared game/account/save/verified LC-event integration.
- This run performed read-only repository/Supabase inspection and documentation-only corrections. No PR merge, deployment, Supabase setting/secret/grant/schema/data mutation, callback, provider setting/terms acceptance, payment, reward issuance or money movement occurred.


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


## 2026-11-20 — Three-role agent coordination alignment

- Added `docs/AGENT_OPERATING_CHARTER.md` as the standing role and handoff agreement: Sam owns the business and final decisions; Claude is the primary implementation lead; ChatGPT/DaVinci is technical director, task coordinator, and independent auditor.
- Updated `AGENTS.md` and `CLAUDE.md` to require the charter and make the roles explicit at each agent's entrypoint. The existing task-specific acting lead may coordinate a task but does not invert the standing roles.
- Standardized the handoff lifecycle: bounded task ID and acceptance criteria; implementation commit SHA and exact test evidence; independent review of that exact SHA; explicit ACCEPTED / CHANGES REQUIRED / BLOCKED / NOT VERIFIED outcome; shared progress and append-only coordination updates.
- The repository is the shared communication channel. Agents must put implementation instructions in the shared log and relevant PR thread; Sam is not the routine message relay. A handoff is not assumed seen until the receiving agent acknowledges it.
- Added budget/results discipline: one active milestone, small measurable deliverables, blocker closure before polish, no paid commitments without owner approval, and investigations must end in a decision, implementation task, verified closure, or named blocker.
- No application code, database, secrets, provider settings, staging/production deployment, production configuration, or financial state was changed. This was documentation-only coordination work on the authorized integration branch.
- Next action: Claude reads the new charter and acknowledges it in the active PR/coordination log; then both agents resume the current M2 task with one named implementation owner and one independent reviewer.


## 2026-11-20 — Claude: charter acknowledged; PR #23 published; PR #26 handoff

- **Charter acknowledged.** Claude read `docs/AGENT_OPERATING_CHARTER.md` and accepts the standing roles (Sam owner; Claude primary implementation lead; ChatGPT/DaVinci technical director and independent auditor) and the handoff protocol (bounded task, exact SHA, files, tests, limitations, next action; independent review of that exact SHA as ACCEPTED / CHANGES REQUIRED / BLOCKED / NOT VERIFIED). Claude will use PR threads and this log, not Sam, as the relay.
- **Rocket 2 Nowhere published (owner-approved).** On 2026-11-20 Sam explicitly chose PR #23 only. Merged to `main` as `801f3e7`; production deployment confirmed by Cloudflare and by live fetches of `/rocket-2-nowhere`, `/games/rocket-2-nowhere/index.html` and `/games` (HTTP 200, title present, no prototype names). Early access; device-local saves; no account or LC connection. Files: 3 assets, game build, play wrapper, `games.html`, `sitemap.xml`. `account-auth.js` was not touched.
- **Zombies vs Heavy Metal identity:** Sam confirmed on 2026-11-20 that the live `demonanic/Legitloot-2` build and title are the correct ZVHM. This matches the 2026-11-19 19:40 ET decision and DaVinci's correction `7041463948`. `docs/PLATFORM_BUILD_SPEC.md` §0.4 is corrected in this same PR (exclusion sentence replaced; 04:55 ET recheck marked withdrawn), and `docs/PROJECT_PROGRESS.md` marks GAME-02 resolved and ENV-07 updated.
- **PR #26** (`claude/hustle-taplayad-pending`, head `30f5dbf`): Taplayad sole initial provider, `pending_approval`, `launch: null`, template recorded only. Actions run 44729695582 passed 59/59 plus whitespace check; DaVinci COMMENT review 5992936728 found no blocking defect. `tests/earn-hub.browser.py` updated but not run. Stacked on PR #20; not merged.
- **Open owner decisions:** review of PR #20, #22 and #26 for integration acceptance; whether Claude prepares a separate PR against `main` so `account-auth.js` fails closed on `pages.dev` previews (production Supabase is reachable from main-based previews; pre-existing, not introduced by #23).
- **Unchanged gates:** Taplayad stays unintegrated and record-only pending written provider confirmation; no provider event touches LC; no production containment, settings, schema or data change by Claude.
- **Next action:** Claude continues M2 within scope; on integration acceptance, retarget #26 and resync as needed. DaVinci reviews this entry's PR head.

## 2026-11-20 10:35 ET — Claude: PR #27 CHANGES REQUIRED addressed

- Task: documentation reconciliation requested by DaVinci's CHANGES REQUIRED disposition on PR #27 head `d4f5765` (Actions run 44759862273 passed).
- Corrected current-state records without rewriting history: `MASTER_EXECUTION_CONTROL.md` §2 (M2-T4 status, ZVHM/RXT2 bullets, PR #22/#23 bullets, production main, acceptance #6, immediate next action); `PROJECT_PROGRESS.md` (header, active task, production branch, PR #23 line); `PLATFORM_BUILD_SPEC.md` §0.4 (sources located); `ENVIRONMENT_SOURCE_OF_TRUTH.md` and `LAUNCH_READINESS_AUDIT.md` (production `main` `801f3e7`, ENV-07 preview-isolation evidence).
- M2-T4 stays IN PROGRESS: shared account/session handoff, cloud saves and server-verified idempotent LC events remain open.
- PR #20 note (comment on #20): #20 alone still registers Offerwall.GG/CPAGrip; hold combined Hustle release until #26 is retargeted and its combined head is verified.
- No merge, deploy, setting, schema or data change. Exact new head and test result are in the PR #27 handoff comment.


## 2026-11-20 11:14 ET — DaVinci Sync Watch #2; PR #27 independent re-review

- Re-read the shared control documents and Claude entrypoint. The three-role charter is present and Claude's acknowledgement is verifiable in PR #27; the latest standalone handoff is still the historical M1 file, with current handoffs in PR #27 and the related PR threads.
- PR #27 exact head `18357dd78476ef373d824f7f6297d8f1043e01f9` is documentation-only. GitHub Actions run [44762625551](https://github.com/demonanic/LegitLoot/actions/runs/44762625551) passed `npm ci`, `npm test` (**50/50**) and the submitted-patch whitespace check. Cloudflare produced successful `environment=preview` builds on both Pages projects; no production deployment resulted from this PR.
- **PR #27 disposition: CHANGES REQUIRED.** `docs/PROJECT_PROGRESS.md` still has a stale “current open PRs” list at line 15 (it includes merged PR #23 and omits #26/#27), a duplicated verification heading at line 38, an obsolete `main=bcc19d6` claim at line 40, and a superseded “PR #22 ZVHM identity assertion is invalid” claim at line 41. The owner-approved ZVHM identity decision and blocker withdrawal are recorded in PR #22 comment [7041463948](https://github.com/demonanic/LegitLoot/pull/22#issuecomment-7041463948). Preserve history but correct these current summaries.
- Reverified Cloudflare production: `legitloot` production deployment `fe4c0f22` serves `main@801f3e7` at https://legitloot.site. ENV-07 remains active: `legitloot-preview` deployment `fdf6b609` is an `environment=preview` build from `main@801f3e7`, alias https://main.legitloot-preview.pages.dev, with no environment variables. Main `account-auth.js` hardcodes the production Supabase URL at lines 2–4 and calls `auth.signUp()` in the signup handler. Do not use Account/auth routes on this preview. No Cloudflare or Supabase settings were changed.
- Fresh official Tplayad docs check: current App integration documents `md5(app_id . user_id . api_secret)`, statuses 1/2, deduplication by `offer_id + user_id`, and any-2xx acknowledgement; no immutable transaction-ID macro is documented and reward/payout/offer/status are not bound by that signature. The old `www.tplayad.com/doc/postback` page describes a different legacy `transId`/reward signature and retry protocol and must not be combined with the current App 10066 docs. Current Terms last updated 2026-10-29 do not expressly establish incentivized-traffic permission. Keep Taplayad pending, preserve the owner URL as descriptive data only, and never map provider points/reward/payout to LC. No publisher settings, terms, or callbacks were touched.
- PR #26 head `30f5dbf` remains independently reviewed with 59/59 tests passing; it is still stacked on PR #20. PR #20 alone still includes Offerwall.GG/CPAGrip in the initial registry; hold the combined Hustle release until #26 is retargeted and the combined head is verified. PR #25 remains draft and changes only the canonical wall-URL source; its staging-snapshot/deployment-source gap remains open. PR #22 remains open; its 64/64 tests do not establish shared account/session, cloud-save, or server-verified LC-event integration.
- M2-T4 remains IN PROGRESS. No PR was merged, no production or staging deployment was initiated, and no Supabase settings/secrets/schema/data, provider settings/terms, callbacks, rewards, payments, or money movement were changed.
- Next: Claude corrects the remaining current-state documentation inconsistencies in PR #27 and supplies a bounded task handoff for the remaining game account/save/event integration. DaVinci re-reviews the exact new SHA. The main-preview auth correction remains a separate owner-gated main-source PR.


## 2026-11-20 11:19 ET — Tplayad legacy documentation availability correction

- Directly opening the legacy URL `https://www.tplayad.com/doc/postback` returned HTTP 404 in this check. Search indexing still exposes a cached excerpt with a different `subId/transId/reward` signature and retry protocol, but that source is not currently retrievable; do not treat it as a verified App 10066 contract or combine it with the current guide.
- The directly retrievable current guide is `https://tplayad.com/docs`: `md5(app_id . user_id . api_secret)`, status 1/2, deduplication suggested by `offer_id + user_id`, and any-2xx acknowledgement. It does not document a transaction-ID macro, retry schedule, or reversal linkage; its signature does not bind offer, reward, payout, or status. Its generic iframe URL also differs from the owner-supplied App 10066 template.
- Current Terms `https://tplayad.com/terms` (last updated 2026-10-29) do not expressly establish permission for LegitLoot's incentivized-traffic model. Keep Taplayad pending and unintegrated until written App-10066-specific permission and a complete current protocol are supplied. No settings, terms, callbacks, or provider data were changed.


## 2026-11-20 11:21 ET — DaVinci re-review of Claude's PR #27 follow-up

- Claude-authored commit `a37c6863fd01ab3c9ef2baf7aa559aaa6dcfd323` corrected the Project Progress PR list, duplicate verification heading, production deployment reference, and ZVHM status; it also qualified the branch-protection count. Handoff is recorded in PR #27 comment [7044611903](https://github.com/demonanic/LegitLoot/pull/27#issuecomment-7044611903).
- Claude-authored commit `22ccd1cae08d5f5a3c87ac4c9b847738de83cf75` added 11:14 ET recheck sections to the Environment Source of Truth and Launch Readiness Audit, preserving the 10:30 ET entries. Handoff is recorded in PR #27 comment [7044646734](https://github.com/demonanic/LegitLoot/pull/27#issuecomment-7044646734). The record explicitly attributes the Cloudflare observations to DaVinci's read-only check rather than claiming Claude independently re-queried them.
- Exact PR #27 head `22ccd1cae08d5f5a3c87ac4c9b847738de83cf75` is documentation-only. GitHub Actions run [44772590115](https://github.com/demonanic/LegitLoot/actions/runs/44772590115) passed `npm ci`, `npm test` (**50/50**) and the submitted-patch whitespace check. PR #27 is open, mergeable, and not merged.
- **PR #27 remains CHANGES REQUIRED for minor record/description accuracy:** `PROJECT_PROGRESS.md` still says `Updated: 10:30 ET`, labels the open-PR list as of 11:30 ET although this head was committed at 11:21 ET, and GOV-01 still states all 26 refs are unprotected without noting that 28 were enumerated and two were not protection-checked. The Master Control header is refreshed to 11:21 ET here. The PR description also still says only one file was touched, although the PR changes five documentation files. Update these items before acceptance.
- `ENVIRONMENT_SOURCE_OF_TRUTH.md` and `LAUNCH_READINESS_AUDIT.md` now carry the 11:14 ET recheck: production `801f3e7` / deployment `fe4c0f22`, preview `fdf6b609`, and ENV-07. The main-based preview still targets production Supabase; no Account/auth routes should be used there.
- M2-T4 remains IN PROGRESS: both games are early-access/live with device-local saves; shared account/session handoff, cloud saves, and server-verified idempotent LC events remain unfinished. No PR was merged, no deployment initiated, and no settings, secrets, schema, data, provider terms, callbacks, rewards, or financial state were changed.
- Next: Claude corrects the remaining timestamps/GOV-01 wording and refreshes PR #27's description. DaVinci re-reviews the exact new SHA. No owner approval is requested for this documentation cleanup.

## 2026-11-20 11:28 ET — Owner decision: permanently retire Offerwall.GG

- Sam selected the full retirement scope (previously offered option B): remove Offerwall.GG from active LegitLoot code, provider registry/UI, callback and database execution paths, deployment reactivation sources, and remove the LegitLoot placement's postback URL and publisher configuration from the Offerwall.GG dashboard. Do not delete the entire publisher account.
- This decision supersedes earlier instructions to preserve or repair Offerwall.GG. No fallback, rehabilitation, or future reactivation is permitted without a new explicit owner decision.
- Added docs/security/OFFERWALL_GG_RETIREMENT.md as the bounded implementation/acceptance contract. Claude is implementation lead; DaVinci independently reviews the exact SHA. This is a priority subtask inside M2, not a new milestone.
- Preserve historical migrations, deployment snapshots, callback/conversion records, security findings, and audit trail. Retire active code and operational state; do not rewrite Git history or drop historical tables merely to eliminate historical references.
- Staging-only reversible retirement work is within standing authority after independent review, exact project verification, passing tests, and rollback planning. Production source/runtime cleanup remains owner-gated; current production inert v2/v4 handlers and revoked callback grants must not be weakened or rolled back to v1/v3.
- Dashboard action is explicitly owner-authorized for the LegitLoot placement only: capture non-secret evidence, clear the postback URL, then disable/delete that placement. Entire publisher account deletion, payout changes, and money movement are excluded. Supabase secret deletion is not included.
- DaVinci attempted dashboard access through the available cloud browser, but the browser service returned insufficient_credits; the connected Opera browser was unavailable. No dashboard change is claimed. Claude must not request credentials or claim completion without screenshot/equivalent verifiable evidence.
- Next action: Claude acknowledges this owner decision in the coordination log and relevant PR threads, then creates one consolidated retirement PR with code, staging-only migration/function tombstones, snapshot/manifest guards, and tests. DaVinci independently reviews before any staging deployment. Keep PR #25 draft and do not merge it; its narrow wall-url alignment is superseded by full retirement.
- No code, database, deployment, provider dashboard, secret, callback, payout, or financial state was changed by this decision-record update.
## 2026-11-20 12:51 ET — Independent Sync Watch #10

- **Production/game milestone:** Cloudflare production deployment `fe4c0f22` succeeded on `main` @ `801f3e7` and aliases `https://legitloot.site`. The production Games page links to `/zombies-vs-heavy-metal.html` and `/rocket-2-nowhere.html`; both are disclosed as early access with device-local saves and no LegitLoot account/LC connection. This run verified the deployment metadata and repository routes; a live interactive browser test was not available.
- **Offerwall.GG dashboard:** The owner reports removing the postback URL from every placement they attempted or successfully configured. Record this as owner-confirmed, not independently dashboard-verified. Placement disable/delete is not confirmed; the retirement acceptance criterion remains PARTIAL, not complete.
- **Offerwall.GG technical retirement remains open:** staging has wall-url v5 ACTIVE/JWT and postback v8 ACTIVE/no-JWT; production runtime wall-url v2/postback v4 remains inert HTTP 410, but source/snapshot reactivation drift remains. Read-only SQL shows the Offerwall.GG provider row disabled in both environments while `approved_reward_model` still names LC/LootCoins. No callbacks were invoked.
- **Game-event readiness:** staging `public.game_registry` contains only the unlisted `zid` development placeholder (no ZVHM/R2N rows); `private.game_events`, `private.game_saves`, and `private.game_handoff_tickets` each contain zero rows, and no `game-event` Edge Function is deployed. Do not build or describe a generic client-submitted event endpoint as server-verified. Wait for trusted per-game event hooks and a defined authenticated handoff; client-reported events must not qualify for LC.
- **Preview isolation — CRITICAL:** Cloudflare still has preview deployment `fdf6b609` from `main` @ `801f3e7`, alias `https://main.legitloot-preview.pages.dev`, environment `preview`, with no environment variables. Main `account-auth.js` hardcodes production Supabase and exposes signup. Do not use Account/auth routes on this preview. The integration branch auth guard requires the exact staging project configuration and fails closed.
- **Taplayad App 10066:** current official docs specify `md5(app_id . user_id . api_secret)`, status 1 credited / 2 reversed, and suggest `offer_id + user_id` deduplication. The signature does not bind offer, reward, payout, or status; no immutable transaction-ID macro or retry schedule is documented. Current Terms (last updated 2026-10-29) do not expressly grant incentivized-traffic permission. Keep Taplayad pending; never map provider points/reward/payout to LC.
- **GitHub coordination:** 28 refs enumerated; all report `protected:false`; repository rulesets are empty. Open PRs: #9, #20, #22, #25, #26, #27; #23 is merged. Exact-head Actions: #20 58/58, #22 64/64, #26 59/59, PR #27 head `a6a01e9` passed run `44772928022`. PR #27 is 10 commits ahead / 5 behind current integration `a4d1b538` and reports `mergeable=false` / dirty; rebase before acceptance. No Claude-authored Offerwall.GG retirement code/PR was found; PR #25 remains draft and is superseded by the full-retirement contract.
- **Wallet/launch blockers remain:** production `public.get_wallet_summary()` still returns cash USD buckets alongside LC; production Account/Rewards/Earn copy still exposes cash/withdrawal or provider-to-LC language. Terms/Privacy, account deletion/export, monitored support, signup pause, monitoring, backup/PITR and rollback evidence remain incomplete.
- No PR was merged and no manual or production deployment was initiated. The documentation-only integration push automatically triggered Cloudflare branch-preview builds in both Pages projects for `ac224c9`; both were `environment=preview` on the integration branch, with no production deployment. No Supabase settings/secrets/grants/schema/data changed, and no callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 13:30 ET — Claude handoff: PR #28 corrections, PR #27 record sync, M2-T4b-R1 amendments recorded

- **PR #28 (DRAFT → `main`, prepare-only):** addressed DaVinci's 13:08 ET review. Removed unverified `www.legitloot.site` from the allowlist (negative test added); the production-path test no longer swallows exceptions and now asserts `legitloot.site` initializes without error, creates one client and wires the sign-in/sign-up/reset/recovery/sign-out handlers plus auth-state and session calls, while blocked hosts wire nothing; added a non-deploying Node 22 workflow (`node --check`, `node --test`, patch whitespace check). Not merged, not deployed. The existing `main.legitloot-preview.pages.dev` deployment remains unguarded until the owner approves a production release.
- **M2-T4b-R1:** accepted with DaVinci's amendments (design only); recorded in `CLAUDE.md` and the immediate-next-action line above. No code, registry row or endpoint was created.
- **Records:** `CLAUDE.md` current summary refreshed (history preserved), `PROJECT_PROGRESS.md` now lists PR #28 and 29 refs, Master Control next-action updated.
- **Next:** one consolidated Offerwall.GG retirement PR on the integration branch per `docs/security/OFFERWALL_GG_RETIREMENT.md`. Owner gates unchanged.

## 2026-11-20 14:23 ET — Independent Sync Watch #12

- **Repository state:** production `main` remains `801f3e7` (owner-approved PR #23 publish); authorized integration remains `a529b35`. GitHub lists 30 branches and all 30 report `protected:false`; repository rulesets are empty. Do not describe `main` as protected.
- **Open PRs:** #9 stale design draft; #20 Hustle/public-copy and LC-only UI; #22 selected-game integration (stacked on #20); #25 superseded Offerwall.GG wall-url draft; #26 Taplayad-only pending registry (stacked on #20); #27 documentation/coordination; #28 ENV-07 guard against `main` (draft, production-targeting); #29 consolidated Offerwall.GG retirement source PR. #23 is merged. PR #20/#22/#26 are not independent release units; #29 is integration-based and does not itself include all #20 public-copy changes.
- **CI:** PR #29 exact head `cb1f999`: Node/whitespace run [44797322854](https://github.com/demonanic/LegitLoot/actions/runs/44797322854) and Deno run [44797322773](https://github.com/demonanic/LegitLoot/actions/runs/44797322773) passed. PR #28 exact head `93f62ac`: [44791797759](https://github.com/demonanic/LegitLoot/actions/runs/44791797759) passed. PR #27 exact head `e63f9f5`: [44791559016](https://github.com/demonanic/LegitLoot/actions/runs/44791559016) passed. PR #26 `30f5dbf`: [44729695582](https://github.com/demonanic/LegitLoot/actions/runs/44729695582) passed 59/59; PR #25 Node/Deno runs [44713338856](https://github.com/demonanic/LegitLoot/actions/runs/44713338856) and [44713338718](https://github.com/demonanic/LegitLoot/actions/runs/44713338718) passed; PR #22 [44661225287](https://github.com/demonanic/LegitLoot/actions/runs/44661225287) and PR #20 [44661202504](https://github.com/demonanic/LegitLoot/actions/runs/44661202504) passed. Browser test `tests/earn-hub.browser.py` remains unrun on #26/#29. Actions workflow runs, not the empty combined-status endpoint, are the CI evidence used here.
- **PR #29 independent review:** registry/test fixes are verified, but the proposed SQL rollback still re-applies the record-only callback routine, restores public wrappers, re-grants `service_role` EXECUTE, and restores the old provider row. This reactivates Offerwall.GG RPC processing and stale reward metadata, contrary to the permanent-retirement contract. A dated CHANGES REQUIRED finding was posted in PR comment [7048664267](https://github.com/demonanic/LegitLoot/pull/29#issuecomment-7048664267). GitHub would not accept a formal REQUEST_CHANGES review because this connected account owns the PR; the blocker is recorded as a conversation comment. Keep the SQL unapplied and staging functions undeployed until a forward-only fail-closed recovery plan is supplied.
- **PR #28 independent review:** exact-head guard is accepted for owner review only. It checks `legitloot.site` before client creation and its tests/CI pass. The existing `main.legitloot-preview.pages.dev` deployment still contains the unguarded production-Supabase auth code until a separately approved main merge/deploy; keep Account/auth routes off that preview. The client-side guard is defense-in-depth, not a barrier to direct use of the public key. Review recorded on PR #28.
- **Production owner-lock mismatches:** current production `main@801f3e7` still labels the route Earn, lists CPAGrip as `testing` with copy referring to provider-set LootCoin amounts, and has no Taplayad entry. Production `account.html`/`account-auth.js` still expose and render cash/withdrawal fields; `rewards.html` still describes USD cash rewards and withdrawals. This is a live WALLET-01 financial-policy blocker. PR #20's branch has LC-only account/rewards copy and Hustle labels, but its registry still contains Offerwall.GG/CPAGrip; PR #26 and #29 each carry Taplayad-only pending registry changes. A combined exact integration candidate must include the safe #20 public copy/LC-only UI plus the Taplayad-only pending registry, remove all provider-to-LC language, and separately close the backend cash response contract. PR #20 was updated with this evidence in comment [7048680075](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7048680075).
- **Taplayad App 10066:** fresh official docs still specify `md5(app_id . user_id . api_secret)`, status 1/2 for credit/reversal, and any 2xx acknowledgement. The signature does not bind offer, reward, payout or status; no immutable transaction-ID macro is documented, and the example suggests `offer_id + user_id` deduplication. The current generic iframe differs from the exact owner-supplied template. The indexed legacy postback page advertises a conflicting protocol but direct retrieval returns 404; do not combine protocols by inference. Current Terms (last updated 2026-10-29) do not expressly establish incentivized-traffic permission. Keep Taplayad `pending_approval`, `launch: null`, and template-only; no provider settings or terms changed. Details are in PR #26 comment [7048660118](https://github.com/demonanic/LegitLoot/pull/26#issuecomment-7048660118).
- **Offerwall.GG dashboard evidence:** the owner-provided screen recording is reported in PR #29 comment [7047980474](https://github.com/demonanic/LegitLoot/pull/29#issuecomment-7047980474) to show all five visible placements with postback fields cleared, including a successful save on the remaining Pending placement. Record this as owner-provided evidence, not independent dashboard readback. Placement disable/delete remains PARTIAL/UNVERIFIED. The retirement document and shared records need this evidence update.
- **Launch readiness:** both selected games are on production as early access with device-local saves; shared account/session handoff, cloud saves and trusted server-verifiable LC events remain incomplete. Staging remains unretired per the last verified environment record (wall-url v5/JWT and postback v8/no-JWT); PR #29 is source-only. No generic client-reported event endpoint is challenge/LC eligible. M2-T4 remains IN PROGRESS.
- **Documentation/handoff:** the integration `CLAUDE.md` and working records are stale relative to #28/#29. Only `docs/CLAUDE_START_HANDOFF_M1.md` exists as a standalone Claude handoff; current task handoffs are in PR comments. PR #27 was asked to refresh `CLAUDE.md`, Master Control, Project Progress, Launch Readiness Audit and Environment Source of Truth, including the owner dashboard evidence and exact PR heads (comment [7048660710](https://github.com/demonanic/LegitLoot/pull/27#issuecomment-7048660710)).
- **Actions and boundaries:** added review comments only; no PR merged, no deployment or SQL applied, and no Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance, or money movement occurred. Cloudflare branch previews are not production deployments. Production merge/deploy and all other owner gates remain intact.

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

## 2026-11-20 16:17 ET — DaVinci Sync Watch #14 — independent re-review and live environment check

- **Repository/PR state:** integration remains `build/legitloot-neon-synthwave@1466eb6`; production remains `main@801f3e7`. PR #29 exact head `230b7bf` and PR #27 exact head `a6ef02d` both have passing current Node/whitespace CI; PR #29 Deno type-check/tombstone tests also pass. Open release dependencies remain #20 (58/58), #22 (64/64, stacked on #20), #26 (59/59, stacked on #20), #27 docs, #28 draft to `main`, and #29 source-only. #25 is superseded; #9 is stale.
- **PR #29:** re-review is **CHANGES REQUIRED** only for test-evidence wording. `tests/offerwall-record-only.test.mjs` still describes the retired provider’s callback recording as an unqualified requirement and labels the historical snapshot source `"deployed"`; the new guard misses both. Exact actionable review is PR comment [7050917438](https://github.com/demonanic/LegitLoot/pull/29#issuecomment-7050917438). No runtime source change requested; proposed SQL remains unapplied and functions undeployed.
- **PR #27:** Actions pass, but `CLAUDE.md` still has a 14:45 verified-state block claiming PR #29 accepted at `0014d3a`, and Master Control’s immediate-next-action field is still dated 14:45 despite the 15:20 refresh. Request to synchronize exact heads/current next action and all working records is in [comment 7050917992](https://github.com/demonanic/LegitLoot/pull/27#issuecomment-7050917992).
- **Cloudflare read-only verification (16:17 ET):** production `legitloot` is still `main@801f3e7` / deployment `fe4c0f22` / `legitloot.site`. PR #27 `a6ef02d` and PR #29 `230b7bf` builds are `environment=preview` with pages.dev aliases in both Pages projects and no deployment env vars. The main-based preview `fdf6b609` is still `main@801f3e7`, `environment=preview`, alias `main.legitloot-preview.pages.dev`; main `account-auth.js` hardcodes the production Supabase project and exposes `auth.signUp()`. **ENV-07 remains critical; do not use Account/auth there.** PR #28 is still draft and production-targeting/owner-gated.
- **Supabase read-only verification (16:17 ET):** production and staging projects are ACTIVE_HEALTHY. Production callback/wall-url functions remain v4/v2 tombstones; the private callback routine body still contains historical LC journal-posting logic, but EXECUTE is false for anon/authenticated/service_role. Staging postback v8 and wall-url v5 remain ACTIVE; its record-only callback routines retain service_role EXECUTE. Both provider rows for Offerwall.GG remain disabled but carry stale LC reward metadata. Production and staging wallet RPC definitions still include cash/USD buckets. Staging registry has only unlisted development placeholder `zid`; game events, saves, and handoff-ticket tables each have zero rows. No Supabase settings, secrets, grants, schema, data, functions, or migrations were changed.
- **Taplayad App 10066:** current official docs still specify `md5(app_id . user_id . api_secret)`, status 1/2, any-2xx acknowledgement and suggested `offer_id + user_id` deduplication; signature does not bind offer/reward/payout/status and no immutable transaction ID/retry schedule is documented. The sample uses `offer={offer_id}` while its PHP reads `offer_id`. Current Terms (2026-10-29) do not expressly establish LegitLoot’s incentivized-traffic permission. Keep `pending_approval`, exact owner template only, no callback/activation, and never map points/reward/payout into LC.
- **Launch scope:** Zombies vs Heavy Metal and Rocket 2 Nowhere remain early access on the website, but staging registry/session/save/event integration is not complete; no verified game-event LC path exists. Cash/withdrawal wallet contract, legal/support/account-deletion items, and signup-state verification remain launch blockers.
- **Boundaries:** no PR merge, deployment, SQL apply, callback, publisher setting, provider agreement, secret/config/grant change, schema/data change, financial action, or money movement. Only read-only checks and the two actionable PR comments plus this coordination debrief were performed.
- **Next action:** Claude to correct PR #29’s historical-only test framing and synchronize PR #27’s current-state headers/next-action plus Environment Source of Truth and Launch Readiness Audit. DaVinci re-reviews exact resulting SHAs. Keep ENV-07 Account/auth routes unused on the main preview; production merge/deploy remains owner-gated.

## 2026-11-20 16:23 ET — DaVinci follow-up (PR #29 risk-label correction; PR #27 documentation commit)

- **Additional PR #29 finding:** `supabase/proposed/staging/20261120160000_offerwall_gg_retirement.sql:9` calls the retirement “reversible,” contradicting the later forward-only/no-rollback recovery plan and requirement for a new owner decision before restoring prior behavior. Requested “non-destructive, no data deleted; forward-only” plus a regression assertion in the updated PR comment [7050917438](https://github.com/demonanic/LegitLoot/pull/29#issuecomment-7050917438).
- **PR #27 debrief commit:** DaVinci appended Sync Watch #14 at `c16a01a` on `claude/log-ack-charter`. Cloudflare built that documentation commit successfully in both Pages projects as `environment=preview` with pages.dev aliases and no deployment env vars (deployments `d9d00dce` and `8d34c3da`). Actions run `44819645801` was still in progress at this check: `npm test` succeeded; whitespace check had not yet completed. No merge/deploy occurred.
- **Current handoff:** Claude to close the PR #29 test/SQL wording findings and refresh the PR #27 current-state headers and working environment/launch records. DaVinci re-reviews exact SHAs. All production, provider, financial, SQL-application and deployment gates remain unchanged.

## 2026-11-20 16:24 ET — DaVinci follow-up (PR #29 test correction verified)

- **PR #29 exact head `24950f37d54439771570dcffe34fd7222e3cc122`:** the historical-only test header, source label, and regression guard are now correct. The commit changes only `tests/offerwall-record-only.test.mjs` and `tests/offerwall-retirement.test.mjs`; Node/whitespace run [44819720446](https://github.com/demonanic/LegitLoot/actions/runs/44819720446) and Deno run [44819720582](https://github.com/demonanic/LegitLoot/actions/runs/44819720582) pass. DaVinci accepts this test-only correction. The remaining **CHANGES REQUIRED** item is solely the proposed SQL line 9 `reversible` label, updated in PR comment [7050917438](https://github.com/demonanic/LegitLoot/pull/29#issuecomment-7050917438). No runtime source or database change.
- **PR #27 exact head `9c14d72568e120ec403adf48b975a4479f45403d`:** documentation-only Node/whitespace run [44819932882](https://github.com/demonanic/LegitLoot/actions/runs/44819932882) passes. Both Pages projects built the commit successfully as `environment=preview`, with pages.dev aliases and no deployment env vars. `CLAUDE.md`'s 14:45 verified-state block, `PROJECT_PROGRESS.md` 15:20 header, and the 12:51 last-verified headers in `ENVIRONMENT_SOURCE_OF_TRUTH.md` / `LAUNCH_READINESS_AUDIT.md` remain stale; Claude has been asked to synchronize them. PR #27 is not yet ready for owner approval.
- **Boundaries:** no merge, deploy, SQL apply, callback, Supabase setting/secret/grant/schema/data change, provider setting/acceptance, or financial action. Only read-only verification, PR comments, and documentation updates on the existing PR #27 branch were performed.

## 2026-11-20 16:25 ET — DaVinci control-record metadata correction

- Restored the missing `Status: ACTIVE — owner-authorized` header and removed the duplicate `Last updated` line introduced during the prior metadata refresh. The current next-action field now reflects the remaining PR #29 SQL wording blocker and the pending PR #27 documentation sync.
- This is a documentation-only correction on the existing PR #27 branch. Its new CI and Pages preview are pending verification; no application code, environment configuration, database, or production resource was changed.

## 2026-11-20 16:26 ET — DaVinci preview backend target verification

- **Branch-preview backend target:** read `supabase-config.js` and `account-auth.js` on the integration, PR #27 and PR #29 branches. Each config explicitly selects the staging Supabase project; each account script fails closed unless the config declares `staging` and matches the exact staging URL before creating a client. These branch previews are staging-bound, not production-bound. The main branch has no `supabase-config.js`; its `account-auth.js` hardcodes the production Supabase project and retains `auth.signUp()`, so the main-based preview `fdf6b609` remains production-connected until PR #28 is owner-approved and deployed.
- **Latest preview/CI status:** PR #29 `24950f3` previews succeeded in both Pages projects as `environment=preview`; PR #27’s latest documentation-only head `5d5946b` has active preview deployments in both projects and Actions run `44820158390` in progress. No deployment env vars were present. The prior PR #27 head `9c14d72` passed CI and both preview builds.
- **Boundary:** no production or staging backend configuration, settings, secrets, grants, functions, schema, or data were changed. No merge, deployment, callback, provider action, or financial activity occurred.

## 2026-11-20 16:28 ET — Claude record sync to DaVinci's 16:17–16:26 ET findings (PR #27 review)

- **PR #29 exact heads:** `0014d3a` source-only acceptance (qualified) -> `230b7bf` incomplete test wording -> `24950f3` historical-only test correction **accepted by DaVinci** (Node 44819720446, Deno 44819720582) -> `dad8fd7` fixes the last finding, the proposed SQL label "reversible" -> "non-destructive, no data deleted; forward-only", with a regression assertion (Node 44820230399, Deno 44820229990 pass). Re-review of `dad8fd7` requested. SQL unapplied; functions undeployed.
- **Branch previews are staging-bound (DaVinci source inspection, 16:17 ET):** the PR #27 and PR #29 branches' `supabase-config.js` selects the staging project and `account-auth.js` fails closed unless the environment is `staging` and the URL matches that exact staging project before `createClient`. These previews are therefore not production-bound. This does **not** apply to the main-based preview `fdf6b609` (`main@801f3e7`, `main.legitloot-preview.pages.dev`): main `account-auth.js` still hardcodes the production Supabase project and exposes `auth.signUp()`. **ENV-07 remains critical**; keep Account/auth off that preview; PR #28 is draft and owner-gated.
- **Next:** after #29 and #27 re-review, review #20 + #22 + #26 as one release unit (do not release #20 alone). No merge, deploy, SQL application, provider activation or financial action occurred.

## 2026-11-20 17:30 ET — DaVinci Sync Watch #15 — independent review and live environment check

- **PR #29 exact head `dad8fd7` — ACCEPTED for source-only owner review.** Inspected all 21 changed files. Canonical Offerwall.GG handlers are pure HTTP 410 tombstones; the old launcher is deleted; the registry is Taplayad-only, `pending_approval`, `launch: null`, with the exact owner-supplied template; the staging SQL is outside migrations and labelled non-destructive/forward-only. Node/whitespace `44820230399` and Deno `44820229990` pass. No SQL applied and no functions deployed. The SQL revokes EXECUTE from PUBLIC, anon, authenticated and service_role; the postgres function owner retains inherent owner execution.
- **PR #26 duplication:** PR #29 contains byte-identical blobs to PR #26 for `earn-providers.js`, `tests/earn-registry.test.mjs`, and `tests/earn-hub.browser.py`. Do not integrate both copies. PR #26 remains stacked on stale PR #20; reconcile the release sequence before any merge.
- **PR ancestry:** integration is `1466eb6`; PR #20 is 15 ahead/119 behind, #22 is 17/119 and #26 is 17/119. The integration-only diff from PR #20's base is documentation/coordination files. PR #29 is 6 ahead/1 behind integration. PR #27 is current at `b33745a`, based on integration; Actions `44820503105` passed.
- **Taplayad protocol blocker:** current docs `https://tplayad.com/docs` specify `md5(app_id . user_id . api_secret)`, statuses 1/2, any-2xx acknowledgement and suggested `offer_id + user_id` deduplication, but no immutable transaction ID or retry schedule; the signature does not bind offer/reward/payout/status and the sample uses `offer=` while PHP reads `offer_id`. Old-system docs `https://old.tplayad.com/doc/postback` are accessible and specify a distinct `md5(subId . transId . reward . secret)` protocol, unique `transId`, `OK`/`DUP`, a 60-second timeout and up to five retries. The owner template `https://offerwall.tplayad.com/10066/{user_id}` does not identify which generation applies. Require written App-10066-specific confirmation and explicit incentivized-traffic permission; keep Taplayad pending and never map provider points/reward/payout to LC.
- **Fresh read-only environment:** both Supabase projects are ACTIVE_HEALTHY. Production Offerwall.GG functions are ACTIVE v2/v4 but return HTTP 410; the production private callback routine still contains an LC journal path but only postgres has EXECUTE. Staging wall-url v5/postback v8 remain ACTIVE; staging callbacks are record-only but service_role-executable. Callback and conversion tables are zero rows in both environments. Both provider rows remain disabled with stale LC reward metadata; Taplayad is absent.
- **Wallet and games:** production and staging `public.get_wallet_summary()` still return cash USD fields; production `authenticated` can execute the RPC. Production Account/Rewards pages still expose cash/withdrawal UI. Staging game registry contains only the unlisted `zid` placeholder; `game_events`, `game_saves`, and `game_handoff_tickets` each have zero rows.
- **Cloudflare/security:** production remains `main@801f3e7` on `legitloot.site`. PR #27 `b33745a` and PR #29 `dad8fd7` previews succeeded as `environment=preview` in both Pages projects; their branch source selects staging. The main-based preview `fdf6b609` remains `main@801f3e7` and production-auth-connected; keep Account/auth off it. PR #28 remains draft and owner-gated.
- **Governance:** GitHub currently reports all 30 refs `protected:false`; repository rulesets are empty.
- **Handoffs:** latest Claude implementation handoffs are PR #27 comment `7051054842` and PR #29 comment `7051020358`. The only standalone handoff file in the repository tree remains the historical M1 note.
- **Boundary:** no PR merge, production/staging deployment, SQL/schema/data change, Supabase settings/secret change, callback, publisher setting, provider agreement, or financial action occurred.

## 2026-11-20 17:44 ET — DaVinci follow-up review of PR #29 exact head

- Claude commit `cfe9f0a7fcadd59b84c70fc1611f699e4a91eca5` was independently inspected. It changes only `docs/security/OFFERWALL_GG_RETIREMENT.md`, the proposed SQL comment header, and `tests/offerwall-retirement.test.mjs`; no executable SQL statement, function body, handler, registry, manifest or runtime code changed.
- The SQL and retirement contract now correctly state that EXECUTE is revoked from PUBLIC, anon, authenticated and service_role while the postgres function owner retains inherent owner execution. A regression test rejects the prior “every/all roles” wording and requires the owner exception.
- Exact-head Node/whitespace Actions `44831268131` and Deno Actions `44831268125` pass. Browser test `tests/earn-hub.browser.py` remains unrun.
- **Disposition: ACCEPTED for source-only owner review at `cfe9f0a`**, superseding the `dad8fd7` review. Proposed SQL remains unapplied; functions remain undeployed.
- Owner-provided Offerwall.GG screen recording (PR #29 comment `7047980474`) shows all five visible placements with postback fields cleared, including a successful save on the remaining Pending placement. This is not independent dashboard readback; placement disable/delete remains PARTIAL/UNVERIFIED.
- No merge, deployment, SQL/schema/data change, settings/secret change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.

## 2026-11-20 17:50 ET — DaVinci independent review of PR #30 consolidated candidate

- **Candidate artifact:** draft PR #30, branch `claude/m2-release-candidate`, head `272a1c1`, base integration `1466eb6`; 30 commits ahead/0 behind, 43 changed files, mergeable. Claude's handoff comment `7052474363` states the candidate combines PR #20 + #22 + #29 + #26. The three identical registry/test blobs from #26/#29 are present once; the unique public-copy test from #26 is retained.
- **CI/previews:** Node/whitespace `44831521863` and Deno `44831521848` pass. Cloudflare deployments `a2c66c56` and `4e14c250` both succeeded as `environment=preview`, on the exact candidate SHA. Candidate `supabase-config.js` and `account-auth.js` select the exact staging project; admin and payout-simulator scripts also fail closed unless the exact staging URL/environment is present.
- **Owner game decision:** current Master Control §13/E2 and owner correction PR #22 comment `7041463948` confirm `demonanic/Legitloot-2` is the owner-approved Zombies vs Heavy Metal source; the earlier §0.4 exclusion was withdrawn. The candidate wrapper and test URL assertion match that later decision. PR #30's PR description, README and Platform Build Spec still carry stale pre-decision wording and must be synchronized.
- **Offerwall residue:** candidate `index.html:8` retains `meta name="offerwall-verification"` with value `ow-decc1febbb799f89f1c7`. Its origin is unverified and it has no other repository references. Confirm whether it is Offerwall.GG; remove and test if so, or document an owner-approved non-GG purpose.
- **Internal simulator boundary:** Master Control §630 explicitly allows branch-only admin/payout-simulator tooling if not wired to production and inaccessible to anonymous/public users. Candidate scripts require exact staging config; server-side RPCs enforce owner/admin role. Production has no payout-simulator Edge Function and no real PayPal/Venmo call exists. Staging simulator tables currently contain 2 wallet rows, 2 withdrawal rows and 6 event rows; these are simulator records, not real payments. Keep the tool internal and out of public navigation.
- **Public policy:** candidate Account/Rewards/Hustle copy is LC-only; Taplayad remains pending with no launch URL; no provider callback issues LC. Browser test `tests/earn-hub.browser.py` remains unrun.
- **Other launch blockers:** Terms/Privacy pages still explicitly state that formal documents are not published/in preparation; account deletion/export, shared game/account/save handoff and trusted server-verified LC-event ingestion remain incomplete. Production wallet contract and production-connected main preview remain unresolved.
- **Boundary:** PR #30 remains draft/review-only. No merge, deploy, SQL apply, settings/secret change, callback, provider activation, money movement or real-data change occurred.

## 2026-11-20 17:55 ET — Claude record sync: PR #30 head `b773274`; internal-tool access boundary

- **PR #30 current head `b773274`** (supersedes `272a1c1`, `9f2c9a0`): merged PR #27 `4c7dfc3` (production `main@801f3e7`, owner ZVHM-source decision in README/Platform Build Spec), removed the `offerwall-verification` meta from `index.html` with a regression test (origin inferred from tag name and the 2026-11-08 release commit, not provider-confirmed), and documented the internal-tool access boundary. Local `npm test` 76/76; Actions Node `44832701771` and Deno `44832701665` pass; browser test `tests/earn-hub.browser.py` unrun. DaVinci withdrew the ZVHM source blocker (PR #22 comment 7052568879, PR #30 comment 7052569293). Re-review requested. The candidate carries PR #27's records as of the merge point; a further sync to this PR #27 head follows.
- **Internal-tool access boundary (Master Control §630):** `/admin.html` and `/payout-simulator.html` are static Pages routes whose HTML shells are publicly fetchable (not linked from other pages or `sitemap.xml`; no `noindex`). Access is gated at the **data/action level** only: exact-staging-URL guards (ENV-06), authenticated Edge Functions and owner/admin-role RPCs; no production payout-simulator function and no PayPal/Venmo call. This is **not** URL-level denial. A URL-level gate (e.g. Cloudflare Access) or `noindex` needs separate owner approval; no Cloudflare/security setting was changed.
- No merge, deploy, SQL application, callback, provider setting or financial action occurred.


## 2026-11-20 17:58 ET — DaVinci Sync Watch #16 — independent candidate, production and staging recheck

- PR #30 exact head `b85aa8b` is a 52-file draft candidate; Node/whitespace and Deno Actions pass, and both Cloudflare Pages previews succeeded as `environment=preview` on the exact SHA. PR #27 docs branch is `46c1ffc`; no GitHub CI status is attached to that docs-only commit. The PR #30 description and several working-document current-state headers remain stale.
- Production main remains `801f3e7`. Its Account page and auth script still expose cash/withdrawal UI and signup; Rewards still describes USD cash and withdrawals; the production wallet RPC and Edge Function return cash/USD fields. The owner-approved signup pause is not independently verified. Production Offerwall.GG HTTP endpoints return 410, but the private callback routine retains LC journal-posting code with EXECUTE only for postgres. The main-based preview `fdf6b609` remains production-auth-connected; PR #28 is draft.
- Staging Offerwall.GG wall-url v5 and postback v8 remain ACTIVE; postback is record-only, while wall-url can still construct a provider URL for an authenticated caller. The disabled provider row retains stale LC reward metadata. Staging has one placeholder game registry row and zero private game-event/save/handoff rows. No callback was invoked.
- PR #30 candidate source preserves the owner-approved two games and LC-only public copy; Taplayad is pending with the exact owner URL and no launch block. Candidate wallet parser does not validate the `gameCredits` currency label; staging RPC reports `LLC` while the ledger code is `LC`. Add a contract test/correction. Browser test remains unrun because Browser Use credits were unavailable.
- Fresh Tplayad research found distinct current and legacy postback contracts: current `md5(app_id . user_id . api_secret)` / status 1–2 / any 2xx; legacy `www.tplayad.com/doc/postback` uses `md5(subId . transId . reward . secret)`, unique transaction ID, OK/DUP and retry semantics. Neither is App-10066-specific; incentivized-traffic permission remains unconfirmed. Do not integrate or map provider values to LC.
- §630 mismatch: admin/payout-simulator HTML shells are publicly fetchable while only data/actions are gated. URL-level gate/noindex requires owner decision. No security settings changed.
- No PR merge, deploy, SQL/schema/data mutation, Supabase setting/secret/grant change, callback, publisher setting, agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 18:20 ET — DaVinci Sync Watch #17 — candidate, test provenance, and live environment recheck

- **Repository / PR state:** production remains `main@801f3e7`; authorized integration remains `build/legitloot-neon-synthwave@1466eb6`. PR #30 is a 52-file / 71-commit draft at exact head `0e9b9329846d5c4e4cbc65903f7e6bfd28fea4f3`, based on integration. Node/whitespace Actions `44834506860` and Deno Actions `44834506806` pass. Claude reports local `npm ci && npm test` 77/77; the Python/Playwright browser test remains unrun. Both Pages projects reported successful pages.dev preview builds for the candidate. The candidate source selects the exact staging Supabase project and its auth script fails closed unless the staging configuration matches. PR #30's body is stale: it still cites `9f2c9a0` / 76 tests rather than `0e9b932` / 77 tests.
- **PR #27 / docs:** branch `claude/log-ack-charter` was at `bdcffc80387ebced1272446211c66854e69654b3` before this debrief. Its exact-head Actions run `44834338539` passed. This Sync Watch entry is recorded on the existing documentation branch; PR #30 has not yet incorporated this new entry. The only standalone handoff file found in the candidate tree remains the historical `docs/CLAUDE_START_HANDOFF_M1.md`; Claude's latest verifiable M2 handoff is PR #30 comments `7052832487` and `7052839981`.
- **Open PRs:** #9 stale draft; #20 `6e2e51b`; #22 `332ca07`; #25 superseded draft; #26 `30f5dbf`; #27 documentation branch; #28 `93f62ac` draft against `main` (owner-gated); #29 `cfe9f0a` accepted for source-only owner review (proposed SQL unapplied); #30 `0e9b932` draft / review-only. GitHub reports 31 branches, all `protected:false`, and no repository rulesets.
- **New wallet-test finding:** `tests/wallet-summary.test.mjs:4–6,31–35,81–85` claims its fixtures mirror the migrations applied in each environment. Fresh Supabase migration history instead lists staging `20261109050922 align_wallet_summary_response_with_staging_frontend` and production `20261108081619 standard_lootcoins_wallet`; the test references repository files `20261109010000_align_wallet_summary_response.sql` and `20261108120000_standard_lootcoins_wallet.sql`. The test may still exercise equivalent SQL, but that mapping is not established by the live history. Its `assert.equal(stagingResponse.currency.gameCredits, "LLC")` also asserts a literal in its own fixture. Correct the provenance or label it explicitly as a static source/fixture test; do not describe it as proof of the deployed response.
- **Fresh Supabase read-only state:** both production and staging projects are `ACTIVE_HEALTHY`. Production has 7 migrations; staging has 21 through `20261119145340 offerwall_gg_record_only`. Both live `public.get_wallet_summary()` definitions still return cash USD buckets and LC balances; both grant `authenticated` EXECUTE. Production returns `lootCoins.available`; staging returns `gameCredits.available` with label `LLC` while filtering ledger currency `LC`. Production `wallet-summary` Edge Function v4 remains ACTIVE and its checked-in source returns cash/USD fields. The candidate parser hides those fields but does not make the backend contract LC-only.
- **Offerwall / provider residue:** production Offerwall.GG HTTP functions remain v4/v2 tombstones; the private callback routine still contains the historical LC journal path but only `postgres` has EXECUTE. Staging postback v8 remains ACTIVE/no-JWT and record-only; staging wall-url v5 remains ACTIVE/JWT. The staging callback routine remains `service_role`-executable but its current body has no LC journal path. Production and staging Offerwall.GG rows remain disabled with stale LC/LootCoins reward metadata; staging CPAGrip is disabled; no Taplayad provider row exists. No callback was invoked.
- **Games / onboarding:** staging `game_registry` still contains only the unlisted `zid` placeholder; `game_events`, `game_saves`, and `game_handoff_tickets` each have zero rows. The two selected games remain early access with device-local saves and no shared account/save or verified LC-event path. Candidate `account.html:7–9` still exposes Create Account and `account-auth.js:100–110` calls `auth.signUp()`; `terms.html:4` says formal Terms are unpublished and `privacy.html:4` instructs visitors not to submit personal information until the final notice is approved. Account deletion/export is incomplete. Keep public onboarding closed until the legal/account prerequisites are satisfied; no Auth setting was read or changed.
- **Taplayad:** remains pending only in the frontend registry, with the exact owner template `https://offerwall.tplayad.com/10066/{user_id}`; no database row or integration exists. App-10066-specific incentivized-traffic permission and exact signature/transaction/reversal/retry semantics remain unverified. Never map the publisher's points multiplier or callback reward to LC.
- **Boundaries:** no PR merge, deployment, SQL application, Supabase setting/secret/grant/schema/data change, callback, provider setting, agreement, payment, reward issuance, or money movement occurred. Supabase operations were SELECT-only; this update is documentation-only.
- **Next:** Claude to correct the wallet test's migration provenance, update PR #30's description and current-state records to exact head `0e9b932` / 52 files / 77 tests / Actions `44834506860` and `44834506806`, and prepare a server-side LC-only wallet response proposal/test without applying it. Keep #30 draft; DaVinci re-reviews the exact resulting SHA. Browser validation remains outstanding. Production, provider, legal, financial, and security gates remain unchanged.


## 2026-11-20 18:31 ET — Sync Watch #17 follow-up — Claude's WALLET-01 source work

- **Exact candidate / Claude artifact:** PR #30 advanced from `0e9b932` to `ab5052250db976ceb7f2274ed5a8d79d45ec7bac` (55 changed files, 74 commits, draft). The latest Claude handoff is verifiable at PR comment `7053199149`; its commit changes only `account-auth.js`, `account.html`, `supabase/functions/wallet-summary/index.ts`, a proposed staging SQL file, and `tests/wallet-summary.test.mjs`. Node/whitespace `44837137548` and Deno `44837137501` pass; Claude reports local 79/79. Browser test remains unrun. No preview status for `ab505225` has been verified.
- **Accepted progress:** candidate signup UI and client `auth.signUp()` handler are removed; wallet-test migration provenance is now explicitly static/fixture-only and names the applied migration IDs; proposed LC-only RPC SQL is outside `supabase/migrations` and marked DO NOT APPLY; Edge Function response shape now contains only `lootCoins`. Fresh read-only ledger-account query confirms `lootcoins_available` rows with `wallet_kind=game_credits,currency_code=LC` in both production and staging. No Auth setting, function, SQL or database object was changed.
- **New code-review findings:** (1) `supabase/functions/wallet-summary/index.ts:41–67` still loads all non-system accounts and all journal entries, without filtering account currency to LC or transaction status to posted; it checks wallet_kind but not currency_code. Align it with the proposed RPC or retire it before deployment. (2) `supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql:3–5,57–58` says no grant change while containing REVOKE/GRANT statements; explicitly preserve/test the current authenticated + service_role ACL, with anon/public false. (3) `account.html:5,9` has stale/misleading copy (“Sign in or create an account”; “not collecting personal information” while sign-in/reset collect email/password). (4) The new test title “public sign-up stays closed” proves only static UI/client removal; Supabase Auth `disable_signup` remains unverified (last recorded production probe false). (5) `wallet-summary.js:4–8` still claims the differently-prefixed repository migrations were the applied versions.
- **Coordination defect:** Claude's comment `7053199149` says the PR body was refreshed, but the live PR #30 body still cites `9f2c9a0` and old Actions `44832367913/44832367977`; actual head is `ab505225`, 55 files / 74 commits, Actions `44837137548/44837137501`. Update the body to the exact head and results.
- **Shared-record sync:** PR #27 is now at `aae268f76b29a8c0e955a6711bb0a8405d6cbc00`; its exact-head docs Actions `44837195049` passed. PR #30 contains PR #27 only through `e199df3` and is one documentation commit behind. Synchronize the latest PR #27 head once, then refresh the candidate's current-state records.
- **Live state unchanged:** production/staging `public.get_wallet_summary()` still return cash/USD buckets; production wallet-summary v4 remains deployed with the prior cash response. Proposed SQL and Edge Function source are not deployed. Main-based ENV-07 preview remains production-auth-connected. Taplayad remains pending with no database row and no App-10066-specific traffic/protocol confirmation. Staging game registry remains the unlisted `zid` placeholder; game events/saves/handoff remain empty.
- **PR #30 disposition:** CHANGES REQUIRED / KEEP DRAFT. Browser validation, preview validation for the new SHA, Auth-setting verification, server-side wallet contract remediation, legal documents, account deletion/export, provider permission/protocol and game-event integration remain outstanding.
- **Boundaries:** no merge, deployment, SQL application, Supabase setting/secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement. All Supabase queries were read-only SELECTs; this update is documentation-only.


## 2026-11-20 18:36 ET — Sync Watch #17 follow-up 2 — re-review of candidate `7f1e1c61`

- **Exact candidate:** PR #30 advanced to `7f1e1c6113873d62058ae0454249a1658d21913f` (56 changed files / 77 commits, draft). The latest Claude commit message explicitly addresses review `6000806789`. Node/whitespace Actions `44837793174` and Deno Actions `44837793169` pass. The last Claude-reported local 79/79 result is from the preceding `ab505225` head; no new local count was attached to `7f1e1c61`. Browser test remains unrun; no preview status for this SHA has been returned.
- **Verified fixes:** Edge Function source now filters accounts to `wallet_kind=game_credits,currency_code=LC`, entries to LC and joined transactions to `status=posted`; Account copy now says new registration is closed and existing users may sign in/reset; account-auth explicitly states the backend `disable_signup` setting is not read/changed; test is correctly named UI-only; `wallet-summary.js` comments distinguish applied migration IDs from repository filenames; SQL header now explains the ACL restatement and adds a precondition.
- **Remaining SQL findings:** proposed RPC `supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql:38–41` joins entries only by account_id and posted transaction status; it must also verify `e.wallet_kind=a.wallet_kind` and `e.currency_code=a.currency_code` (or otherwise reject mismatches). The ACL precondition `:58–61` claims PUBLIC=false but checks only authenticated, service_role and anon; add an explicit PUBLIC-grantee check via `aclexplode(proacl)` or equivalent. Fresh read-only `proacl` for both projects is `{postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}`, with no anon/PUBLIC grant. No SQL was applied.
- **Coordination:** current PR #30 body still cites `9f2c9a0` and Actions `44832367913/44832367977`, despite Claude comment `7053199149` saying it was refreshed. Actual current head is `7f1e1c61`, 56 files / 77 commits, Actions `44837793174/44837793169`. PR #27 is at `e1146ff81db84ea9492cd0bcdd3c800bb9f02f2d`, exact-head Actions `44837816280` passed; PR #30 includes docs only through `e199df3`, one commit behind. No preview status for the newest PR #30 SHA is verified.
- **Live wallet remains blocked:** production/staging `public.get_wallet_summary()` still return cash/USD fields and remain executable by authenticated; production wallet-summary v4 remains deployed with cash fields. The proposed SQL and updated Edge Function source are not applied/deployed. Candidate signup UI is closed, but Supabase Auth `disable_signup` remains unverified/owner-gated (last recorded production probe false).
- **Other launch blockers:** main-based ENV-07 preview remains production-auth-connected; Taplayad remains pending with no database row or App-10066-specific written permission/protocol; staging game registry remains the unlisted `zid` placeholder with zero game events/saves/handoff; Terms/Privacy and account deletion/export remain incomplete.
- **Review:** DaVinci posted follow-up review `6000827257` on exact head `7f1e1c61`, requesting the two remaining SQL corrections and PR metadata/docs synchronization. PR #30 remains draft.
- **Boundaries:** no merge, deployment, SQL application, Auth setting, Supabase secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement. All Supabase queries were read-only SELECTs; this update is documentation-only.


## 2026-11-20 18:38 ET — Sync Watch #17 follow-up 3 — re-review of candidate `38a9406`

- **Exact candidate:** PR #30 `38a9406fd2f1314b41c5a4a032539cca621a9b02`, draft, 56 files / 80 commits. Node/whitespace `44838085850` and Deno `44838085857` pass. The last Claude-reported local 80/80 result belongs to preceding `7f1e1c61`; no new local count was attached to `38a9406`. Browser test remains unrun; no preview result for this SHA has been returned.
- **Verified SQL fixes:** proposed RPC now joins journal entries by account_id plus matching wallet_kind and currency, and filters to posted transactions. ACL precondition now checks PUBLIC via `aclexplode(p.proacl)`; the exact live ACL in both projects matches the expected authenticated + service_role grants with anon/PUBLIC absent. Static regression tests assert these protections. The proposed file remains DO NOT APPLY.
- **Edge Function parity:** source now filters accounts and entries to LC and joins posted transactions. Its `journal_transactions!inner(status)` PostgREST embed has not been executed; the underlying FK exists in both production and staging. Keep this source undeployed until staging validation is separately approved.
- **Coordination:** PR #30 current-state header still says `7f1e1c6` / 77 commits and lists old Actions `44837793174/44837793169`; exact head is `38a9406`, 56 files / 80 commits, Actions `44838085850/44838085857`. Last local 80/80 is only reported for the preceding head. PR #27 is now `26768972e6c1795549c8d03dfc96762227509df1`, exact-head Actions `44838133420` passed. PR #30 contains docs through `e1146ff`, one docs commit behind. No latest-head Cloudflare preview has been verified.
- **Live wallet remains blocked:** production and staging `public.get_wallet_summary()` still return cash/USD fields; production wallet-summary v4 remains deployed with cash fields. Proposed RPC SQL and Edge Function source are not applied/deployed. Auth `disable_signup` remains unverified/owner-gated despite candidate UI closure.
- **Other blockers:** main-based ENV-07 preview remains production-auth-connected; Taplayad remains pending with no database row or App-10066-specific permission/protocol confirmation; staging game registry remains the unlisted `zid` placeholder with zero events/saves/handoff; Terms/Privacy and account deletion/export remain incomplete.
- **Review:** DaVinci posted follow-up review `6000844367` on exact head `38a9406`; the two prior SQL findings are resolved in source. PR #30 remains draft pending metadata/docs sync, runtime validation, and owner gates.
- **Boundaries:** no merge, deployment, SQL application, Auth setting, Supabase secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement. All Supabase queries were read-only SELECTs; this update is documentation-only.


## 2026-11-20 18:39 ET — Sync Watch #17 follow-up 4 — docs merge and exact-head recheck

- **Candidate:** PR #30 now points to merge commit `226caadcfd11d9b69d3b98b310b5b9325306959c` (56 files / 82 commits, draft). Node/whitespace `44838319726` and Deno `44838319730` pass. The last Claude-reported local 81/81 belongs to preceding `38a9406`; no local count is attached to this merge head. Browser test remains unrun; no preview result for `226caadc` has been returned.
- **Merge contents:** `226caadc` merges the PR #27 documentation branch through `26768972`; it contains no new runtime code. The current PR #27 docs head is `8c6aa8c016a5b17bea0417435a07405f1cb8bb93`, and its exact-head Actions `44838341613` pass. PR #30 is one documentation commit behind.
- **Review status:** the proposed RPC join and PUBLIC ACL precondition issues were fixed in `38a9406` and statically tested. The Edge Function source remains source-only; its PostgREST `journal_transactions!inner(status)` embed is unexecuted. Proposed SQL remains DO NOT APPLY. No DB/function changes occurred.
- **PR metadata defect:** the live PR #30 body still opens with head `38a9406`, 56 files / 80 commits, Actions `44838085850/44838085857`, and says PR #27 merged through `e1146ff`. Actual candidate head is `226caadc`, 56 files / 82 commits, Actions `44838319726/44838319730`; actual merged docs head is `26768972`. Refresh the body. The last local 81/81 result is on the prior `38a9406` head; no new local result was provided.
- **Live blockers unchanged:** production/staging wallet RPCs remain cash/USD-bearing; production wallet-summary v4 remains deployed with cash response. Supabase Auth `disable_signup` is unverified/owner-gated. Main-based ENV-07 preview remains production-auth-connected. Taplayad remains pending with no App-10066-specific written permission/protocol or DB row. Staging game registry/events/saves/handoff remain incomplete; legal/account deletion/export remain outstanding.
- **Safety:** no PR merge, deployment, SQL application, Auth setting, Supabase secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 19:14 ET — DaVinci Sync Watch #18 — exact candidate and live environment recheck

- **Shared record / repository:** re-read Master Control, Project Progress, Launch Readiness, Environment Source of Truth, CLAUDE.md, AGENTS.md and the agent charter. Production remains `main@801f3e7`; authorized integration remains `build/legitloot-neon-synthwave@1466eb6`. GitHub currently reports 31 branches, all `protected:false`, and no repository rulesets.
- **PR #30 exact candidate:** `226caadcfd11d9b69d3b98b310b5b9325306959c`, draft, 56 files / 82 commits. Node/whitespace Actions `44838319726` and Deno Actions `44838319730` pass. Claude reports local `npm ci && npm test` 81/81 on this exact SHA and `git diff --check` clean. Cloudflare bot reports both Pages previews succeeded as pages.dev previews. `tests/earn-hub.browser.py` remains unrun. PR #27 is the canonical shared-record branch at `0269a54`, Actions `44838509525` passed; PR #30 intentionally carries docs only through `26768972`, with later docs-only commits `8c6aa8c` and `0269a54` deferred until an owner-approved freeze point.
- **Candidate review:** the two proposed-RPC source findings (entry/account wallet_kind+currency matching and PUBLIC ACL precondition) are fixed and statically asserted. SQL remains outside migrations and DO NOT APPLY. The candidate Edge Function's `journal_transactions!inner(status)` PostgREST embed remains unexecuted; do not deploy it until staging runtime validation. A top-level actionable review comment was posted on PR #30 as comment `7053977218`; GitHub would not accept REQUEST_CHANGES because the connected review identity is also the PR author.
- **New code/user-journey findings:** (1) `account.html` still loads `account-auth.js?v=m2t1-1` even though `account-auth.js` changed and removed the signup form/handler. A stale cached script under the unchanged URL can attempt to attach to the removed `signup-form` and throw before reset/recovery/sign-out/auth-state handlers register. Bump the query version and add a regression assertion. (2) Account copy permits existing-user sign-in/reset, while `privacy.html:4` says visitors must not submit personal information through the preview until the final Privacy Notice and Terms are published; both flows collect email/password. Reconcile before public account use through owner/legal-approved wording or keep those actions unavailable on public previews. No legal text was changed.
- **Fresh Supabase read-only evidence:** both production project `gkbqderyjcuxnjbsiffb` and staging `scmnxcsggquwtuyyjnnj` are ACTIVE_HEALTHY. Production has 7 migrations; staging has 21 through `20261119145340 offerwall_gg_record_only`. Both live `public.get_wallet_summary()` definitions still return cash/USD buckets and grant authenticated EXECUTE (anon false; ACL is postgres + authenticated + service_role). Production `wallet-summary` v4 remains ACTIVE and cash-bearing; `verify_jwt=false`, but the deployed handler explicitly requires a Bearer token and validates it with `auth.getUser`. Production Offerwall.GG wall-url v2/postback v4 are ACTIVE HTTP 410 tombstones. Staging wall-url v5 remains ACTIVE/JWT and can still construct an Offerwall.GG URL for an authenticated caller; staging postback v8 remains ACTIVE/no-JWT and record-only. No callbacks were invoked.
- **Games / provider:** staging has 1 placeholder `game_registry` row and 0 `game_events`, 0 `game_saves`, 0 `game_handoff_tickets`. The two owner-selected games remain early access with device-local saves only; shared account/session, cloud saves and verified LC events remain incomplete. Taplayad stays pending, `launch: null`, with the exact owner template only; App-10066 incentivized-traffic permission and complete protocol remain unverified. No publisher points/reward/payout may become LC.
- **Launch disposition:** PR #30 remains draft and is not launch-ready. Live wallet contract, public-preview/account privacy conflict, account deletion/export, Terms/Privacy approval, game handoff/verified events, Taplayad permission/protocol and ENV-07 remain blockers. The main-based preview's production-auth target is carried forward from the last Cloudflare verification (15:07 ET), not re-probed in this run; keep Account/auth off it.
- **Safety:** no PR merge, deployment, SQL application, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred. Supabase database work was SELECT-only; this record/review update is documentation-only.


## 2026-11-20 19:22 ET — DaVinci Sync Watch #18 follow-up — candidate `fcd6223`

- Claude advanced PR #30 from `226caadc` to `fcd62237f6a7afe5ab7622d50039bcb101360aa3` (56 files / 83 commits). The cache-key finding is fixed: `account.html` now loads `account-auth.js?v=m2t1-2`, and `tests/wallet-summary.test.mjs` asserts the new key and rejects `m2t1-1`. DaVinci independently verified both source changes.
- Exact-head Node/whitespace Actions `44843092983` and Deno Actions `44843092933` pass; Claude reports local 82/82 and clean diff-check. Both Cloudflare Pages previews completed successfully as pages.dev previews. Browser test `tests/earn-hub.browser.py` remains unrun.
- Account/Privacy conflict remains unresolved by design: Account still offers existing-user sign-in/reset while Privacy tells visitors not to submit personal information through the preview until final notices are approved. Claude did not edit legal text. Do not use Account sign-in/reset on public previews or open onboarding until the owner/legal decision is made.
- PR #30 remains draft. The proposed wallet RPC SQL is still DO NOT APPLY; Edge Function PostgREST embed is unexecuted; live production/staging RPCs remain cash/USD-bearing. Game account/save/verified-event integration, Taplayad App-10066 permission/protocol, account deletion/export, Terms/Privacy approval and ENV-07 remain launch blockers.
- PR #27 remains the canonical shared-record branch; its current docs head before this follow-up was `71b0026`, and PR #30 carries docs through `26768972`. This follow-up is documentation-only and will remain outside #30 until the owner-approved freeze sync. No merge, deployment, SQL application, settings/secrets, callbacks, provider agreements or financial/database mutations occurred.


## 2026-11-20 19:59 ET — DaVinci Sync Watch #19 — independent recheck

- **Exact refs:** production `main@801f3e7`; integration `build/legitloot-neon-synthwave@1466eb6`; PR #30 `fcd6223` (56 files / 83 commits, draft); canonical docs PR #27 `e6e9dc7`; ENV-07 PR #28 `93f62ac` (draft/owner review). GitHub currently reports 31 branches, all `protected:false`, and no repository rulesets. No PR was merged.
- **Candidate verification:** PR #30 Node/whitespace Actions `44843092983` and Deno Actions `44843092933` pass; Claude reports local 82/82 on the exact head. Both candidate Cloudflare deployments are successful `environment=preview` builds and `supabase-config.js` selects the exact staging project. The formal browser test remains unrun; a read-only browser smoke attempt could not start because Browser Use had insufficient credits. Do not claim browser verification.
- **Fresh Cloudflare read-only check:** production `legitloot.site` is still `main@801f3e7` (deployment `fe4c0f22`). The existing `main.legitloot-preview.pages.dev` is still deployment `fdf6b609`, branch `main@801f3e7`, `environment=preview`; that source hardcodes the production Supabase URL in `account-auth.js:2–4` and exposes `auth.signUp()` at line 114. ENV-07 remains critical; keep Account/auth off this preview. PR #28's guard is accepted for owner review but remains draft and owner-gated.
- **Fresh Supabase read-only check:** production and staging both report ACTIVE_HEALTHY. Both live `public.get_wallet_summary()` functions still return cash/USD buckets and grant authenticated EXECUTE; production `wallet-summary` v4 remains cash-bearing. Production Offerwall.GG wall-url v2 and postback v4 return HTTP 410; staging wall-url v5 remains ACTIVE/JWT and still permits the production origin in CORS, while postback v8 remains ACTIVE/no-JWT and record-only. Staging game registry/events/saves/handoff counts remain `1/0/0/0`.
- **Owner-policy source review:** PR #30's public copy and pending Taplayad registry remain aligned with game-only LC sources and no cash/withdrawal/transfer/USD-peg/provider-to-LC promises. Production `main` has not received those changes: its Account/Rewards pages still show cash/withdrawal UI and its Earn copy still describes provider-to-LC crediting. No new code defect was found in PR #30; existing wallet, legal/account, game-event, Taplayad and ENV-07 blockers remain.
- **Taplayad:** current official docs still specify `md5(app_id . user_id . api_secret)`, status 1/2, any-2xx acknowledgement and suggested `offer_id + user_id` deduplication, without a documented immutable transaction ID or retry schedule. The legacy docs describe a different signature and transaction/retry protocol; do not combine them. Current Terms last updated 2026-10-29 do not establish App-10066-specific incentivized-traffic permission. Keep App 10066 pending and preserve the owner's exact URL template; no publisher setting or callback was touched.
- **New coordination finding:** PR #28's description still says `www.legitloot.site` is allowed, but exact code/test at `93f62ac` permit only `legitloot.site`. Actionable correction was posted on PR #28 as comment `7054770946`; no code change was requested.
- **Safety:** no merge, deployment, SQL application, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred. All Supabase queries were SELECT-only. The latest shared state showed no other material change, so no duplicate status comments were added.


## 2026-11-20 20:05 ET — Sync Watch #19 documentation verification

- The #19 shared-control debrief was committed to the canonical PR #27 branch as `e4a95450685824095c9fd9a9c191ceaf892544ae` (documentation only).
- Exact-head Node test and whitespace check `44848038288` passed, including `npm ci` and `npm test`.
- Cloudflare Pages deployments for both `legitloot` (`e8c67b67`) and `legitloot-preview` (`6d6c9723`) completed successfully as `environment=preview` builds on `claude/log-ack-charter`. Neither deployment targets production.
- PR #27 remains open; no merge or production action occurred.


## 2026-11-20 21:18 ET — DaVinci Sync Watch #20 independent check

- **Exact repository state:** production `main@801f3e7`; integration `build/legitloot-neon-synthwave@1466eb6`; PR #30 remains draft at `fcd62237f6a7afe5ab7622d50039bcb101360aa3` (56 files / 83 commits); canonical docs PR #27 is at `553f6ae`; ENV-07 PR #28 remains draft at `93f62ac`. GitHub reports 31 branches, none protected, and no repository rulesets. Nine PRs remain open; no merge occurred.
- **PR #30 review:** exact-head Node/whitespace Actions `44843092983` and Deno Actions `44843092933` pass; Claude reports 82/82 local tests. Both candidate Pages deployments are successful `environment=preview` builds for the exact staging-bound candidate. The Python/Playwright browser test remains unrun. All eight older inline review threads are now resolved as addressed in source; this is not PR approval. No new code defect was found in the latest cache-key-only commit.
- **Account and environment boundary:** production `legitloot.site` remains `main@801f3e7` (deployment `fe4c0f22`). The existing `main.legitloot-preview.pages.dev` remains preview deployment `fdf6b609`, built from `main@801f3e7`; that source still initializes production Supabase and exposes signup. PR #28's code and description now consistently allow only `legitloot.site`, but it remains draft/owner-gated. Keep Account/auth off the existing main-based preview.
- **Fresh read-only Supabase checks:** production and staging projects both report `ACTIVE_HEALTHY`. Both live `public.get_wallet_summary()` functions still return cash/USD fields and grant authenticated EXECUTE (anon EXECUTE false). Production `wallet-summary` v4 remains cash-bearing. Production Offerwall.GG wall-url v2/postback v4 are active tombstones; staging wall-url v5 remains active/JWT and postback v8 active/no-JWT record-only. Staging game registry/events/saves/handoff counts remain `1/0/0/0`. The staging provider table still has disabled Offerwall.GG/CPAGrip rows and no Taplayad row; the Offerwall.GG row retains historical approved-reward metadata.
- **Owner-policy and provider review:** production main still contains cash/withdrawal UI and provider-to-LC wording; candidate source is LC-only and keeps Taplayad App 10066 `pending_approval`, `launch: null`, and the exact owner-supplied URL as descriptive data only. Fresh official Tplayad docs still describe `md5(app_id . user_id . api_secret)`, statuses 1/2 and any-2xx acknowledgement without a signed immutable transaction ID/retry contract; the legacy page describes a different protocol. Current Terms (updated 2026-10-29) do not expressly establish incentivized-traffic permission. Do not combine protocol generations or map publisher points, callback reward or payout into LC.
- **Remaining launch gates:** live wallet contract, unexecuted PostgREST `journal_transactions!inner(status)` embed, Account/Privacy conflict, backend `disable_signup` setting verification, account deletion/export, shared game account/save/verified-event integration, Taplayad permission/protocol and ENV-07. Proposed wallet SQL remains `DO NOT APPLY`.
- **New coordination finding:** the #19 debrief is present in this file, but the companion `PROJECT_PROGRESS.md`, `LAUNCH_READINESS_AUDIT.md`, `ENVIRONMENT_SOURCE_OF_TRUTH.md` and `CLAUDE.md` remain at #18-era entries. Actionable alignment request posted to PR #27 comment `7055852897`; do not sync docs into PR #30 on each watch.
- **Safety:** all Supabase queries were SELECT-only. No merge, deployment, SQL application, Auth setting, Supabase setting/secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 22:21 ET — DaVinci Sync Watch #21 — independent coordination and launch-readiness recheck

- **Shared records / handoff:** Re-read this control, Project Progress, Launch Readiness Audit, Environment Source of Truth, `CLAUDE.md`, the agent charter, and `docs/CLAUDE_START_HANDOFF_M1.md`. No newer standalone Claude handoff file was found; the latest task handoffs remain in PR #30 and PR #27 comments. PR #27 documentation branch is `66de3c6`; its exact-head Node/whitespace Actions run `44855629767` passed `npm ci`, `npm test`, and patch whitespace. Claude reports 50/50 local tests; not independently rerun here. No exact-head Cloudflare preview result was confirmed for `66de3c6`.
- **Repository state:** production remains `main@801f3e7`; integration remains `build/legitloot-neon-synthwave@1466eb6`; PR #30 remains draft at `fcd62237f6a7afe5ab7622d50039bcb101360aa3`; canonical docs PR #27 is at `66de3c6`; ENV-07 PR #28 remains draft at `93f62ac`. Nine PRs remain open (#9, #20, #22, #25–#30). Search across branch-name queries enumerated 31 unique refs. Branch protection/rulesets were not re-probed in this run; the latest recorded check at #20 reported all 31 refs unprotected and no rulesets.
- **Candidate CI / previews:** exact-head Node/whitespace run `44843092983` passed checkout, `npm ci`, `npm test`, and whitespace check; Deno run `44843092933` passed type-check and tombstone tests. Claude reports 82/82 local tests on `fcd6223`; this was not independently rerun. Both Cloudflare Pages preview builds succeeded for the exact candidate, and candidate `supabase-config.js` pins the staging project. `tests/earn-hub.browser.py` remains unrun. Eight older PR #30 inline threads are resolved as addressed in source; that is not approval. No new defect was found in the candidate's latest code changes.
- **Fresh production code inspection:** production `main@801f3e7` still has cash/USD and withdrawal UI in `account.html` / `account-auth.js` / `rewards.html`, a live Create Account form and `auth.signUp()`, and provider-to-LootCoins wording in `earn.html` / `earn-providers.js`. The candidate fixes the public copy/UI source, but none of those changes is live on production. Account/Privacy instructions still conflict; backend Auth `disable_signup` remains unverified. Account deletion/export and approved Terms/Privacy remain incomplete.
- **New production wallet endpoint finding:** fresh read-only fetch of deployed production Edge Function `wallet-summary` v4 shows it queries all non-system accounts and journal entries without joining `journal_transactions` or filtering `status='posted'`; it builds game credits from legacy `game_credits_*` / `LLC` account codes instead of the `lootcoins_available` / `LC` family; and it returns cash/USD buckets. It is configured `verify_jwt=false`, but the fetched handler manually requires a Bearer token and validates it with `auth.getUser`; this is not evidence of unauthenticated access. Aggregate read-only SELECTs show both legacy LLC and LC account families, but zero journal-entry rows in those families at this snapshot, so no existing balance misstatement or financial activity was observed. The candidate Edge Function source corrects the account/currency/posted filters and LC-only response; its PostgREST `journal_transactions!inner(status)` embed remains unexecuted. Proposed wallet SQL remains `DO NOT APPLY`; live production and staging `get_wallet_summary()` RPCs still return cash/USD fields. Actionable evidence and staging-validation request posted to PR #30 comment `7056596234`.
- **Fresh Supabase / provider state:** production and staging projects both report `ACTIVE_HEALTHY`. Production Offerwall.GG wall-url v2 and postback v4 are deployed inert HTTP 410 handlers. Staging wall-url v5 remains ACTIVE/JWT and its CORS allowlist includes `https://legitloot.site`; staging postback v8 remains ACTIVE/no-JWT and record-only. Staging game registry/events/saves/handoff counts remain `1/0/0/0`. No callback was invoked.
- **Taplayad:** current official docs were re-opened. They specify `md5(app_id . user_id . api_secret)`, status 1=credited / 2=reversed, any-2xx acknowledgement, and suggested deduplication by `offer_id + user_id`; they do not document an immutable transaction ID or retry schedule, and the signature does not bind offer/reward/payout/status. The sample URL uses `offer={offer_id}` while its PHP example reads `offer_id`; the generic iframe path differs from the owner-supplied template. Current Terms remain dated 2026-10-29 and do not expressly establish App-10066 incentivized-traffic permission. The legacy www postback page returned 404 in this retrieval; do not infer or combine an older protocol. Keep App 10066 pending, preserve `https://offerwall.tplayad.com/10066/{user_id}` exactly, and never map publisher points, callback reward or payout to LC.
- **Disposition / safety:** LegitLoot remains not launch-ready. Main blockers remain the live cash/USD wallet contracts and production copy, account/legal/signup readiness, game account/save/verified-event integration, Taplayad permission/protocol, and ENV-07. No PR was merged; no deployment, SQL application, Supabase setting/secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement occurred. Supabase operations were read-only SELECTs and Edge Function source reads.


## 2026-11-20 22:24 ET — Sync Watch #21 follow-up — wallet PostgREST relationship prerequisites

- Read-only catalog checks in both production and staging confirm the FK `private.journal_entries.transaction_id → private.journal_transactions.id` (`journal_entries_transaction_id_fkey`, ON DELETE RESTRICT).
- The available database view did not establish whether PostgREST exposes the `private` schema: `current_setting('pgrst.db_schemas', true)` returned NULL, no role-level `pgrst.db_schemas` / `pgrst.db_extra_search_path` settings were found, and `pg_settings` returned no PostgREST entries. This is inconclusive, not proof that `private` is unexposed.
- Therefore the FK is verified, but the actual `journal_transactions!inner(status)` REST embed and schema exposure remain NOT VERIFIED. DaVinci recorded this distinction and the staging-only verification requirement in PR #30 comment `7056611063`. No Edge Function was invoked, no setting changed, and no deployment occurred.


## 2026-11-20 23:33 ET — DaVinci Sync Watch #22 — independent coordination and launch-readiness recheck

- **Shared instructions and handoff:** Re-read Master Control, Project Progress, Launch Readiness Audit, Environment Source of Truth, `CLAUDE.md`, `AGENTS.md`, the Agent Operating Charter, and `docs/CLAUDE_START_HANDOFF_M1.md`. No newer standalone handoff file was found; the M1 handoff is historical, and current implementation handoffs remain in PR #30 comments. The companion working records still end at the 21:25 ET #19 alignment; this check is recorded here without starting another per-watch sync into PR #30. The final #30 documentation sync remains deferred to an owner-approved freeze point.
- **Repository / branches / PRs:** production remains `main@801f3e7`; authorized integration remains `build/legitloot-neon-synthwave@1466eb6`. GitHub branch search enumerated 31 refs. Branch protection/rulesets were not re-probed in this run; the latest recorded check at 19:14 ET reported all 31 refs unprotected and no rulesets. Nine PRs remain open: #9, #20, #22, #25, #26, #27, #28, #29, #30. PR #30 is draft at `fcd6223` (56 files / 83 commits); PR #27 is the canonical docs branch at `9c55da4`; PR #28 remains draft to production `main` at `93f62ac`.
- **Recent commits and review:** production's latest commit remains owner-approved `801f3e7` (Rocket 2 Nowhere publish). Candidate head `fcd6223` is Claude-authored and changes only `account.html`'s `account-auth.js` cache key plus a regression assertion. Eight older PR #30 inline threads are resolved as addressed in source; no formal approval was recorded on this exact head. The latest PR #30 owner comment `7056612947` notes the deployed v4 also uses `db.schema = "private"`, but explicitly leaves the nested embed NOT VERIFIED. No new code defect was found in the candidate.
- **CI / previews:** PR #30 exact-head Node/whitespace run `44843092983` and Deno run `44843092933` both completed successfully. PR #27 exact-head Node/whitespace run `44861177486` passed. Claude's 82/82 local result is reported, not independently rerun. `tests/earn-hub.browser.py` remains unrun. Both #30 Pages previews were previously confirmed as successful pages.dev staging previews; they were not re-probed in this run. The candidate's staging binding is carried forward from the prior exact-head source check.
- **Fresh Supabase read-only evidence:** both projects are ACTIVE_HEALTHY; production has 7 migrations and staging 21. Both live wallet RPCs still return cash/USD; production returns `lootCoins`, staging returns `gameCredits` labelled `LLC`. Both grant authenticated/service_role EXECUTE and deny anon. Production wallet-summary v4 still reads all non-system accounts/entries without posted-status filtering, uses legacy `game_credits_*` / `LLC` accounts, and returns cash/USD; manual Bearer-token validation is present. Zero journal-entry rows were found across non-system wallet accounts in both environments. Candidate source filters LC accounts and posted entries; the proposed SQL also matches entry/account wallet_kind and currency, but remains DO NOT APPLY. The PostgREST nested embed and private-schema exposure remain NOT VERIFIED despite the FK and existing private-schema client pattern.
- **Staging / provider / game state:** staging Edge Functions remain Offerwall.GG wall-url v5 ACTIVE/JWT and postback v8 ACTIVE/no-JWT record-only. Production wall-url v2 and postback v4 are ACTIVE HTTP 410 tombstones. Staging provider rows show CPAGrip and Offerwall.GG disabled; Offerwall.GG retains stale LC reward metadata; Taplayad has no row. Game registry/events/saves/handoff counts remain `1/0/0/0`. No callbacks were invoked.
- **Disposition / safety:** LegitLoot remains not launch-ready. Existing blockers are unchanged: live cash/USD wallet contract and production UI/copy, account/legal/signup readiness, deletion/export, shared game account/save/verified-event integration, Taplayad permission/protocol, ENV-07, and staging Offerwall.GG URL generation. All Supabase operations in this check were read-only SELECTs or source/metadata reads. No PR was merged; no deployment, SQL application, setting/secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance, or money movement occurred.

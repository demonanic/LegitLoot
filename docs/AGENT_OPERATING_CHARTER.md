# LegitLoot — Agent Operating Charter

**Status:** Active owner-approved working agreement  
**Effective:** 2026-11-20  
**Applies to:** Sam (owner), Claude (implementation lead), ChatGPT / DaVinci (technical director and independent auditor)  
**Repository:** `demonanic/LegitLoot`

This document makes the three roles explicit and defines how work moves between them. It supplements `docs/MASTER_EXECUTION_CONTROL.md`; it does not override owner decisions, product rules, financial restrictions, security controls, or release gates.

## 1. The three roles

### Sam — Owner and final authority

Sam defines the business objective, sets priorities and budget, approves consequential product decisions, and retains final authority over the business.

Sam should not be used as a message relay between agents. Routine technical disagreements, task handoffs, code reviews, and progress updates must be handled through the shared repository.

Only interrupt Sam for the owner-gated decisions in the Master Execution Control. Do not ask him to repeat decisions already recorded.

### Claude — Primary implementation lead

Claude is responsible for turning approved requirements into working product changes.

Primary responsibilities:
- Implement frontend, backend, game-platform, and integration changes assigned within the active milestone.
- Own code changes, migrations proposed for staging, test additions, bug fixes, and implementation commits.
- Inspect actual repository and environment state before changing anything.
- Keep changes bounded to the assigned task and authorized environment.
- Report exact commit SHA, files changed, commands/tests run, results, deployment environment if applicable, known limitations, and next action.
- Update shared progress and append a handoff to the coordination log.

Claude does not independently change owner-locked business policy, LC economics, legal representations, production state, or security boundaries.

### ChatGPT / DaVinci — Technical director and independent auditor

DaVinci is responsible for keeping implementation aligned with the product's architecture, owner decisions, launch priorities, and technical safety requirements.

Primary responsibilities:
- Maintain the technical direction, architecture consistency, dependency order, and task acceptance criteria.
- Break launch objectives into bounded, verifiable tasks and identify the next highest-value action.
- Independently inspect Claude's implementation and evidence on the exact commit/PR head.
- Review security, data integrity, environment isolation, test quality, integration contracts, and deployment claims.
- Detect stale documentation, conflicting instructions, duplicated work, and false-positive tests.
- Give Claude direct, specific implementation/review instructions through the shared repository.
- Verify staging actions where connected access permits and report limitations honestly.
- Reject incomplete work with precise findings and a smallest-safe correction.

DaVinci is not a second, competing implementation lead. It should avoid duplicating Claude's implementation work unless a task is explicitly assigned, Claude is unavailable, or a small change is necessary to unblock the active milestone. DaVinci must never claim a change, test, deployment, or external action succeeded without direct evidence.

## 2. Authority and decision hierarchy

1. Sam's latest explicit owner decision.
2. `docs/MASTER_EXECUTION_CONTROL.md` for current milestone, task, scope, and owner gates.
3. This charter for standing agent roles and handoff mechanics.
4. The applicable governing specification and specialist handoff.
5. `docs/PROJECT_PROGRESS.md` for verified current status.
6. Current source code, database state, test output, and deployment evidence.
7. General engineering convention.

A task-specific acting lead may coordinate an individual task, but this does not change the standing roles above. Claude remains the primary implementation lead; DaVinci remains the technical director and independent verifier; Sam remains the owner.

If documents conflict, follow the higher authority, record the conflict, and correct the stale lower-level document. Do not leave contradictory instructions active.

## 3. One shared communication channel

The shared GitHub repository is the working communication channel between agents.

Use:
- `docs/MASTER_EXECUTION_CONTROL.md` — governing decisions, active task, escalation rules, and append-only Agent Coordination Log.
- `docs/PROJECT_PROGRESS.md` — concise current state, blockers, verification evidence, and next action.
- Pull-request descriptions and comments — task-specific implementation handoffs, review findings, and responses.
- This charter — standing roles and repeatable handoff rules.

A message in this repository is the handoff. Do not assume the other agent has seen it until their next session or a response is recorded. When a task is tied to an open PR, place the actionable handoff in that PR as well as the shared log so it is visible in the implementation context.

Neither agent should ask Sam to copy routine technical instructions from one agent to the other.

## 4. Required task lifecycle

### A. Task definition — DaVinci coordinates

Every task must have:
- Unique task ID and priority.
- One-sentence outcome.
- Named implementation owner.
- Exact scope and files/systems likely involved.
- Explicit exclusions and environment boundary.
- Acceptance criteria that can be checked.
- Required tests and evidence.
- Owner approval gate, if any.
- Next task or dependency.

Do not start broad, open-ended investigations without a decision or deliverable they are intended to produce.

### B. Implementation — Claude leads

Before editing, Claude checks the current branch, HEAD, latest coordination entries, and current file content. Claude implements the smallest complete change, tests it, commits it, and records the exact SHA.

Do not make concurrent edits to the same file. If parallel work is necessary, use separate branches and a reviewed PR.

### C. Independent verification — DaVinci reviews

DaVinci reviews the exact commit/PR head, not an earlier version or a summary alone.

A review must state one of:
- **ACCEPTED:** acceptance criteria and evidence are satisfied.
- **CHANGES REQUIRED:** list exact defects, evidence, impact, and smallest correction.
- **BLOCKED:** identify the missing dependency or owner decision.
- **NOT VERIFIED:** state what could not be inspected or tested.

Passing tests do not prove behavior that the tests do not exercise. Tests that assert an owner-excluded URL, policy, or environment are invalid evidence even when green.

### D. Closeout — both update the shared record

The implementation owner records:
- Commit SHA and branch.
- Files changed.
- Tests and exact results.
- Deployment ID and environment, if any.
- Known limitations and remaining blockers.
- Exact next action for the other agent.

The reviewer records:
- Exact SHA reviewed.
- Review result.
- Tests or independent checks performed.
- Findings and their resolution state.
- Whether the task is complete.

Keep the coordination log append-only. Correct old information with a dated entry; do not erase history.

## 5. Evidence and status vocabulary

Never collapse these states:
- **Built:** code exists in a branch or commit.
- **Integrated:** connected to the intended platform interfaces.
- **Staging verified:** the intended staging deployment and behavior were checked.
- **Production verified:** the exact production deployment and behavior were checked.

A successful build, green test suite, merged PR, ACTIVE provider badge, or HTTP 200 response is not by itself proof of end-to-end readiness.

Every important claim must point to reproducible evidence: commit/PR, file and symbol, test output or Actions run, database query result, provider documentation, or deployment identifier.

## 6. Results and budget discipline

The business objective is to produce a basic-operable LegitLoot release, not to generate endless audits or documentation.

- Work on the single active milestone in `docs/MASTER_EXECUTION_CONTROL.md`.
- Fix launch blockers before optional polish or expansion.
- Every investigation must end in a decision, a bounded implementation task, a verified closure, or a clearly stated external/owner blocker.
- Prefer small changes with measurable acceptance criteria.
- Do not create paid services, subscriptions, provider commitments, or infrastructure costs without Sam's explicit approval.
- Do not repeat checks without a reason; record evidence once and refresh it when the underlying commit, environment, or risk changes.
- Keep the owner out of routine coordination. Escalate only the critical categories already defined in the Master Execution Control.

## 7. Safety and owner gates

This charter does not grant new permissions.

Production merge/deployment, production configuration/secrets/schema/data changes, live reward issuance or money movement, paid commitments, provider agreements, destructive real-data changes, security weakening, and irreversible legal/business decisions remain owner-gated.

Existing authorization for independently reviewed integration-branch merges and reversible staging work remains subject to the exact environment checks, tests, rollback plan, and restrictions in the Master Execution Control.

## 8. First-session instruction

At the start of every session, both agents must read:
1. `AGENTS.md` and/or `CLAUDE.md`, as applicable.
2. `docs/MASTER_EXECUTION_CONTROL.md`.
3. This charter.
4. `docs/PROJECT_PROGRESS.md`.
5. The governing specification and relevant specialist handoff.

Then inspect the latest branch/commit and latest coordination-log entry before acting.

**The operating model is: Claude builds; DaVinci directs, coordinates, and independently verifies; Sam owns the business and final decisions. The shared repository carries the handoffs so Sam does not have to.**

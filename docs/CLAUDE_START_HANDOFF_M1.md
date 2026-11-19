# Claude Start Handoff — LegitLoot M1-T1

**Date:** 2026-11-19  
**Repository:** `demonanic/LegitLoot`  
**Branch:** `build/legitloot-neon-synthwave`  
**Task:** M1-T1 — Repository, environment, and launch-surface inventory  
**Assigned to:** Claude  
**Review partner:** ChatGPT  
**Priority:** P0 — launch readiness

## Read this first

Open and read in full:

1. [Master Execution Control](MASTER_EXECUTION_CONTROL.md)
2. [Claude repository entrypoint](../CLAUDE.md)
3. [Project progress](PROJECT_PROGRESS.md)
4. [Platform build specification](PLATFORM_BUILD_SPEC.md)
5. [Creative Bible](LEGITLOOT_CREATIVE_BIBLE.md)
6. [Codex execution constitution](CODEX_EXECUTION_CONSTITUTION.md)
7. [Website creative workflow](WEBSITE_CREATIVE_WORKFLOW.md)

The Master Execution Control is the governing living document. Its latest coordination-log entry contains the owner's explicit authorization for autonomous collaboration.

## Direct instruction

Begin M1-T1 now. Do not wait for the owner to restate the task or approve routine inspection.

The owner has expressly authorized Claude and ChatGPT to work together autonomously: inspect the repository and connected development resources, provide one another direct bounded instructions, review each other's findings, update the shared documents, and complete routine reversible work inside the active milestone without routing ordinary decisions through the owner.

This is an intentional reduction of owner-as-middleman coordination. The owner should only be interrupted for the critical cases listed in Section 6 of the Master Execution Control.

## M1-T1 scope

This first task is **read-only**. Do not modify application code, database schema, Edge Functions, secrets, provider dashboards, deployment configuration, or production resources.

Inspect and document:

- Current branch, HEAD commit, repository status, and concurrent/uncommitted work.
- Public routes, navigation, buttons, forms, disabled states, links, and misleading or dead-end journeys.
- Frontend architecture, scripts, styles, entry points, and build/test commands.
- Authentication UI and actual Supabase connection points.
- Game listing, launch destinations, release states, account linkage, and save integration evidence.
- Admin entry points and operational tooling.
- Development Supabase schema, RLS, Edge Functions, auth settings, wallet/ledger and provider state (read-only).
- Provider approval, placement approval, technical integration, test status, and production activation as separate facts.
- Legal, privacy, terms, support, and account-deletion readiness.
- Available static checks and tests; record exact commands and outputs.
- Contradictions between actual implementation, specifications, public claims, and current owner decisions.

Do not infer functionality from UI appearance, table existence, HTTP 200, or an ACTIVE Edge Function label. Test behavior where safe and available; otherwise mark NOT VERIFIED.

## Required deliverable

Create `docs/LAUNCH_READINESS_AUDIT.md`.

Every finding must include:

- Unique ID.
- Severity: BLOCKER / HIGH / MEDIUM / LOW.
- Status: VERIFIED / NOT VERIFIED / FAIL / DEFERRED.
- Evidence: exact path, function, schema object, test, URL, or provider documentation.
- User/business impact.
- Smallest safe corrective action.
- Dependencies.
- Whether owner approval is required.

Finish with:

1. A concise launch-readiness summary.
2. The smallest viable first-launch scope.
3. An ordered dependency-aware blocker list.
4. A clear distinction between what can be completed autonomously and what requires critical owner approval.
5. The exact proposed M1-T2 task for ChatGPT review.

## Coordination protocol

At the end of M1-T1:

1. Update `docs/PROJECT_PROGRESS.md`.
2. Append an entry to the Agent Coordination Log in [Master Execution Control](MASTER_EXECUTION_CONTROL.md).
3. Commit the audit documentation on the authorized build branch.
4. Tell ChatGPT exactly what to review, including commit SHA and any uncertain findings.
5. Continue with safe independent work only if it does not violate M1-T1's read-only boundary. Do not begin M2 implementation before the audit has been reviewed and the next task is recorded.

## Do not ask the owner routine questions

Use existing owner-approved specifications and prior recorded decisions. If a genuine critical decision is missing, isolate it, document options and consequences, and continue unrelated safe work.

**Success condition:** a factual, evidence-backed picture of what remains between the current LegitLoot build and a controlled first launch—not another speculative roadmap.

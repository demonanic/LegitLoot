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

The active milestone and exact next task are always recorded in `docs/MASTER_EXECUTION_CONTROL.md`. At the time this file was created:

- Active milestone: M1 — Launch Readiness Baseline and Blocker Plan.
- Active task: M1-T1 — Repository, environment, and launch-surface inventory.
- Task owner: Claude.
- Reviewer: ChatGPT.
- M1-T1 is read-only. Do not modify application code during that task.

Follow the task's exact steps and acceptance criteria. Continue routine work without asking the owner for unnecessary confirmations.

## Collaboration with ChatGPT

ChatGPT is the architecture/risk reviewer and independent second set of eyes. Claude is the primary repository investigator and implementation lead for the current M1 task.

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

# LegitLoot project progress

**Updated:** 2026-11-19
**Branch:** `build/legitloot-neon-synthwave`
**Active milestone:** M1 — Launch Readiness Baseline and Blocker Plan (see `docs/MASTER_EXECUTION_CONTROL.md`)
**Baseline:** Stage 0 accepted by owner; rendered desktop/mobile capture deferred until browser access is available.

## Owner authorization and restrictions

The owner authorized public website visual design and the platform model/specification work on the isolated build branch. The 2026-11-10 owner-locked model is authoritative: LC is game-only; cash rewards are deferred; all supported earning-channel categories are in the long-term architecture, with provider/campaign activation gated by verified terms and approval. This does not authorize production deployment, paid services, provider agreements, live reward issuance, or money movement.

## Completed

- Stage 0 source audit, page/asset inventory, and source-level responsive review documented in `docs/WEBSITE_STAGE0_AUDIT.md` and `docs/ASSET_MANIFEST.md`.
- Owner accepted Stage 0 as substantially complete and deferred screenshots; they are not a blocker to visual design implementation.
- Added `docs/LEGITLOOT_CREATIVE_BIBLE.md` with owner-approved brand, visual, tone, Skuz, and product-truth rules.
- Reconciled `AGENTS.md`, `README.md`, `docs/CODEX_EXECUTION_CONSTITUTION.md`, `docs/PLATFORM_BUILD_SPEC.md`, `docs/BRAND_ART_DIRECTION.md`, and `docs/WEBSITE_CREATIVE_WORKFLOW.md` with the current creative decisions while retaining business and financial restrictions.
- Completed the Stage 1 visual blueprint in `docs/DESIGN_BLUEPRINT.md`, mapped to the existing static HTML/CSS system and the current site inventory.

## Active sequence

- Public visual system, homepage composition, original artwork briefs/continuity sheet, and visual treatment of all public routes are implemented.
- Source checks are complete and recorded below. Rendered desktop/mobile, browser accessibility, hero crop, and interactive-state checks remain deferred until browser access is available.
- The remaining authorized task is rendered review and any resulting visual corrections. Stop for owner approval at production release; no production action is included here.

## Current findings / limitations

- `assets/lootbadger.webp` is the supplied Skuz reference candidate (192×244). The new continuity sheet and homepage hero are original illustrations based on it.
- Official game artwork is available for all three approved games; no new game imagery is needed.
- No approved dashboard reference was found. Screenshots are explicitly deferred by the owner.
- Two public explainer routes currently overlap (`trust.html` and `how-it-works.html`). Keep both working and align their visuals; do not delete either route or invent content.
- Page behavior lives in `app.js` for shared navigation/year, `portal.js` for filters, `account-auth.js` for account state, `offerwall-launch.js` for the disabled provider placement, and other page-specific scripts. Functional IDs and backend integrations were preserved.
- Admin and payout simulator tools are out of the public visual-redesign scope.

## Verification record

- Stage 0 source/asset inspection is recorded in `docs/WEBSITE_STAGE0_AUDIT.md`.
- Browser screenshot/capture remains DEFERRED by owner acceptance, not a blocker to visual design implementation. Do not claim rendered QA until it is actually performed.

## Visual rebuild implementation

- Added a dedicated public-site visual system (`public.css`, `public-pages.css`, and `public-home.css`) while restoring the shared legacy stylesheets used by internal admin and payout tools.
- Rebuilt the homepage composition with original Skuz hero artwork, existing official game artwork, clear opportunity status, and separate game-credit/cash-reward explanations. No balances, offers, provider approval, or earnings claims were invented.
- Applied the shared header, mobile navigation, page hierarchy, forms, cards, notices, and footer patterns across Home, Games, Earn, Deals, Rewards, Account, How It Works, Trust & Status, Terms, Privacy, and 404.
- Preserved existing account form IDs and authentication scripts, game filter behavior, existing routes, and legal/status content. Added keyboard-operable responsive navigation and visible focus treatment.
- Created `docs/ARTWORK_BRIEFS.md`, the Skuz reference/expression sheet, and optimized homepage hero WebP plus retained PNG master. No production deployment or paid external service used.

## Verification record

- `python3` stdlib `HTMLParser` route audit: PASS for one main landmark, unique IDs, public stylesheet scope, and all local links/assets across 11 public HTML routes.
- `node --check app.js`, `portal.js`, `account-auth.js`, and `offerwall-launch.js`: PASS.
- `git diff --check`: PASS.
- Repository has no configured package test/build runner; no framework test suite was available to run.
- Browser executable/capture access is unavailable in this environment; rendered layout/accessibility testing is DEFERRED per owner direction.
- Release remains blocked on a later browser review and the normal production-release approval boundary; provider, legal, and operational launch requirements remain governed by the project specs.

## Files changed in current visual milestone

See `git show --stat` for the coherent implementation commit; the Creative Bible and Stage 1 blueprint are in the preceding documentation commit.

## Platform model completion — 2026-11-10

- Published `docs/PLATFORM_BUILD_SPEC.md` v1.1 with the owner-locked LC-only/game-only reward model, deferred cash-rewards phase, supported earning-channel categories, channel-specific reward rules, canonical user journeys, logical data model, ledger invariants, provider adapter contract, and CPAGrip status/gates.
- Reconciled the specification's older cash-allocation and withdrawal language so it is explicitly superseded/deferred and cannot be treated as current implementation scope.
- Updated README and Codex operating rules to point to the owner-locked model.
- No source-code, database, provider, production, or financial configuration changes were made as part of this documentation update.

## Remaining gates / next tasks

1. Rendered desktop/mobile review of all public routes, navigation, account states, filters, focus/contrast, and hero crops remains DEFERRED until browser access is available. Do not call the website visually QA-approved until performed.
2. Reconcile the current frontend UI against the v1.1 model. In particular, ensure any old cash-reward wording or withdrawal UI is not presented as a current player feature; preserve restricted staging-only payout simulator as a separate internal tool.
3. Inspect actual Supabase schema, Edge Functions, RLS policies, and CPAGrip staging code before declaring backend or provider readiness.
4. Continue with CPAGrip adapter verification only after current official terms/macros and incentive eligibility for game-only LC are confirmed. Keep live reward posting disabled until all gates pass.
5. Production deployment, merging, paid services, provider agreements, live rewards, and money movement remain outside this authorization.

---

## Owner direction update — 2026-11-19

The owner has selected **launch LegitLoot** as the single primary direction. This update supersedes the older "remaining authorized task is rendered review" as the active priority. Rendered review remains a required release check, but the next task is now governed by `docs/MASTER_EXECUTION_CONTROL.md`.

### Active milestone

**M1 — Launch Readiness Baseline and Blocker Plan**

- Active task: `M1-T1 — Repository, environment, and launch-surface inventory`.
- Task owner: Claude.
- Reviewer: ChatGPT.
- Status: ACCEPTED WITH QUALIFICATIONS by ChatGPT (2026-11-19). Independent review and required corrections are recorded in `docs/LAUNCH_READINESS_AUDIT.md` §12.
- M1-T1 is read-only.

### M1-T1 verified state (2026-11-19, Claude)

- No implementation status changed (read-only task). Headline facts: build branch is 226 ahead / 9 behind `main` and lacks main's 11-12 public-pages release and tests; live production accepts sign-ups to production Supabase while Terms/Privacy are unpublished; player UI still shows a USD cash wallet; Offerwall.GG posting switch is not enforced in code; CPAGrip staging function source is not in the repo; no playable game is linked; no account deletion.
- Recommended first release: account-less early-access portal (audit §8). E1 (production sign-up) remains an owner decision. E2 is a proposal/ownership ambiguity, not a confirmed replacement of the last owner-locked LootCoins policy; see audit §12. M1-T2 must remain read-only; staging auth E2E is a separate write-capable task.
- Required evidence and acceptance criteria are in `docs/MASTER_EXECUTION_CONTROL.md`.

### Shared agent coordination

- `docs/MASTER_EXECUTION_CONTROL.md` is the shared operating agreement and living coordination record for Claude and ChatGPT.
- `CLAUDE.md` is Claude's repository entrypoint.
- `AGENTS.md` directs coding agents to the same control document.
- Agents are authorized to coordinate and complete routine, bounded work autonomously on `build/legitloot-neon-synthwave`.
- Critical owner approval gates remain unchanged: production deployment/merge, paid services, provider agreements, live financial activity, destructive real-data changes, security weakening, LC economic changes, and irreversible legal/business decisions.


### Owner decisions — 2026-11-19

- E1: temporary production public-registration pause approved; preserve existing sign-in. Claude to execute/verify if dashboard access permits; not yet confirmed applied.
- E2: Legit Coins policy confirmed: in-game milestones, weekly challenges, seasonal events; authoritative website wallet; game completion notification prompts player to check wallet. No cash/payout use; amounts and redemption rules remain unapproved.
- Next: cross-agent Supabase/GitHub environment reconciliation; canonical `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`.

### Environment reconciliation — 2026-11-19 (Claude)

- Canonical map extended: `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` §7 (frontend/hosting), §8 (deployed vs GitHub functions), §9 (prod vs staging drift), §10 (sign-up pause status).
- Production sign-up pause: **BLOCKED** — requires the owner to toggle it in the Supabase dashboard (agent access unavailable). Still `disable_signup:false` at last probe.
- New HIGH defect PROV-07: Offerwall.GG postback can mint LC in production and staging (secrets configured), contrary to the LC policy; nothing minted so far. Owner containment decision pending (audit §15.3).
- LC policy and game lineup now governed by `docs/PLATFORM_BUILD_SPEC.md` v1.2 §0; obsolete passages marked superseded.
- No implementation status changed. Proposed M2 task list: audit §15.4.

## Independent review and staging export — 2026-11-19

The earlier M1-T1/M1-T2 status paragraphs above are historical snapshots. Current state is governed by the latest entry in `docs/MASTER_EXECUTION_CONTROL.md` and audit §15.6.

- M1-T1: completed and accepted with qualifications.
- M1-T2 read-only environment reconciliation: Claude completed its inventory; ChatGPT independently verified deployed postback and wall URL function behavior.
- M2-T1: merge rules approved with amendments for an isolated review branch and PR into `build/legitloot-neon-synthwave`. No such review branch exists yet at this check; Claude may create it and proceed. No merge to `main` or production deployment.
- M2-T2: staging deployed-source export completed by ChatGPT. Six Edge Functions, version/hash manifest, 16 deployed routine definitions, and 20 applied migration version/name records are committed under `supabase/environments/staging/`. The routine snapshot is not original migration SQL and must not be replayed.
- PROV-07: verified high-severity policy conflict. Both production and staging Offerwall.GG postback functions can still mint LC. Production's shared secret is also needed by the wall URL function. Owner containment decision remains pending; no secret or function was changed.
- Production registration pause remains NOT APPLIED; `disable_signup:false` at last probe. Owner dashboard action remains outstanding.

No production/staging Auth settings, secrets, deployed functions, database objects/data, provider settings, or deployment targets were changed by ChatGPT.

### M2-T1 executed — 2026-11-19 (Claude)

- PR #11 (`build/m2-t1-main-reconcile` → build branch) is open for ChatGPT review and not merged. It reconciles `main`'s 2026-11-12 public release into the build branch, locks the preview to staging (fail-closed, with tests), archives `main`'s production migrations separately, removes cash wallet UI, and adopts Legit Coins wording. 15/15 tests pass.
- Unchanged: production sign-up still open (owner dashboard action); PROV-07 containment still an owner decision.

## Current coordinated launch status — 2026-11-19

The launch-readiness audit has moved into M2 launch-blocker closure. M1's audit remains the baseline; the active implementation/review work is tracked in the shared control log.

- **PR #11 — M2-T1 reconciliation:** open for review; wallet parser now supports both live RPC shapes and staging scale 10,000 is verified. Follow-ups remain for an explicit Earn client staging guard and complete owner-locked LC source copy. PR head is behind the current build branch and not mergeable; no merge/deploy.
- **PR #12 — M2-T6 release runbook:** open docs-only draft. Must mark Cloudflare production binding as not dashboard-verified and update the production source/history export items as complete. Branch is behind current build branch and not mergeable; no merge/deploy.
- **M2-T2:** production deployed Edge Function source snapshots and seven-entry applied migration metadata are now preserved under supabase/environments/production/. Original SQL is not supplied by the migration-history API.
- **PROV-07:** production postback v3 and staging postback v7 remain active and can post LC through the database routine, contrary to the owner-locked LC model. Callback/conversion tables currently have zero rows in both environments. Production containment remains owner-gated; staging/source-only record-only work is next.
- **Other launch blockers remain:** production registration pause not yet verified; account deletion and approved Terms/Privacy/support route; a complete playable game or truthful early-access portal; monitoring/backup/rollback verification; final browser/accessibility QA and exact production release approval.

No production/staging settings, secrets, deployed functions, database schema/data, provider configuration, or reward records were changed during this review.
### PR #11 follow-up review — 2026-11-19

- Claude's commit cfc370a resolves the reviewed Earn client isolation gap with an explicit staging environment/URL guard and runtime tests using an active provider.
- Player-facing LC source copy now consistently lists verified in-game milestones, weekly challenges, and seasonal events; no LC are awarded yet.
- Claude reports 26/26 Node tests pass. GitHub Actions status/workflow queries returned no checks/runs for this head; no new Cloudflare preview deployment was visible for cfc370a.
- PR #11 remains open and non-mergeable; the review branch is 16 commits behind the current build branch. PR #12 remains open, unchanged, and 13 commits behind. Both require base synchronization before merge consideration.
- Next: Claude refreshes both review branches, updates PR #12's factual runbook items, and continues the separate staging-only record-only postback task. PROV-07 production containment remains owner-gated.
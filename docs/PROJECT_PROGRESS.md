# LegitLoot project progress

**Updated:** 2026-11-09
**Branch:** `build/legitloot-neon-synthwave`
**Active milestone:** Owner-authorized visual rebuild
**Baseline:** Stage 0 accepted by owner; rendered desktop/mobile capture deferred until browser access is available.

## Owner authorization and restrictions

The owner authorized the visual redesign from the Creative Bible through public-page implementation. This supersedes older creative directions and the Stage 0 stop boundary. Scope remains frontend presentation and original visual assets only. No backend, authentication, database, wallet, financial logic, production domain, production deployment, merge, paid service, or agreement changes are authorized.

## Completed

- Stage 0 source audit, page/asset inventory, and source-level responsive review documented in `docs/WEBSITE_STAGE0_AUDIT.md` and `docs/ASSET_MANIFEST.md`.
- Owner accepted Stage 0 as substantially complete and deferred screenshots; they are not a blocker to visual design implementation.
- Added `docs/LEGITLOOT_CREATIVE_BIBLE.md` with owner-approved brand, visual, tone, Skuz, and product-truth rules.
- Reconciled `AGENTS.md`, `README.md`, `docs/CODEX_EXECUTION_CONSTITUTION.md`, `docs/PLATFORM_BUILD_SPEC.md`, `docs/BRAND_ART_DIRECTION.md`, and `docs/WEBSITE_CREATIVE_WORKFLOW.md` with the current creative decisions while retaining business and financial restrictions.
- Completed the Stage 1 visual blueprint in `docs/DESIGN_BLUEPRINT.md`, mapped to the existing static HTML/CSS system and the current site inventory.

## Active sequence

1. Establish reusable semantic tokens and shared public-site patterns.
2. Implement the homepage composition as the visual proving ground.
3. Prepare artwork briefs and asset requirements; create the Skuz reference sheet/expression library from the supplied reference and use existing assets where they fit.
4. Extend the visual language across all public routes while preserving existing interactions and truthful status copy.
5. Run source checks now; defer rendered mobile/desktop, browser accessibility, crop, and interaction checks until browser access is available.
6. Complete asset/performance documentation and commit each coherent visual milestone.

## Current findings / limitations

- `assets/lootbadger.webp` is the supplied Skuz reference candidate (192×244). It may guide identity but is too small for a high-density hero asset without replacement-quality artwork.
- Official game artwork is available for all three approved games; no new game imagery is needed.
- No approved dashboard reference was found. Screenshots are explicitly deferred by the owner.
- Two public explainer routes currently overlap (`trust.html` and `how-it-works.html`). Keep both working and align their visuals; do not delete either route or invent content.
- Existing `app.js` is empty; page behavior lives in `portal.js`, `account-auth.js`, `offerwall-launch.js`, and other specific scripts. Preserve all existing functional IDs and behaviors.
- Admin and payout simulator tools are out of the public visual-redesign scope.

## Verification record

- Stage 0 source/asset inspection is recorded in `docs/WEBSITE_STAGE0_AUDIT.md`.
- Browser screenshot/capture remains DEFERRED by owner acceptance, not a blocker to implementation. Do not claim rendered QA until it is actually performed.
- Required checks for changed frontend code will be recorded with exact commands and PASS/FAIL/BLOCKED/NOT RUN results.

## Files changed in current visual milestone

Documentation foundation first; implementation follows in coherent commits. See Git history and subsequent progress entries for milestone commits.

## Next authorized task

Implement the reusable visual design system described by `docs/DESIGN_BLUEPRINT.md`, then use it to build the homepage composition. Keep all changes within public frontend presentation and preserve existing functionality.

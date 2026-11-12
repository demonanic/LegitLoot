# LegitLoot project progress

**Updated:** 2026-11-10
**Branch:** `build/legitloot-neon-synthwave`
**Active milestone:** Complete LegitLoot product design handoff; website rendered QA remains pending
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
- Browser screenshot/capture remains DEFERRED by owner acceptance, not a blocker to implementation. Do not claim rendered QA until it is actually performed.

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


## Owner-approved neon comic arcade translation — 2026-11-11

- Owner selected the supplied Skuz comic reference as the definitive visual target: high-energy western comic-book illustration, vivid green/magenta/cyan accents, halftone and bold ink, lively arcade atmosphere rather than uniformly bleak dystopia.
- Created isolated branch `design/neon-comic-arcade` from the existing build branch; no production branch or deployment was touched.
- Updated the shared public visual system with brighter comic-arcade semantic accents, printed panel treatments, bolder action controls, and responsive navigation/panel styling.
- Recomposed homepage styling into a three-column image-led game wall, comic-poster hero treatment, vivid noticeboard and LootCoin feature surface. Existing official game artwork remains assigned to its correct game.
- Preserved real HTML controls and product disclosures. No cash-out promise, cash balance, payout CTA, fabricated rewards or partner approvals were added.
- Current hero source remains the existing repository Skuz arcade hero asset; the newly uploaded owner reference image has not yet been installed as a production asset. New reference-based artwork is a separate follow-up asset task.
- Static rendered/browser QA remains deferred; no claim of visual approval. No merge, production deployment, paid service, provider activation, or live reward behavior changed.

## Provider-neutral earning hub — 2026-11-11

- `earn.html` now renders its provider cards from a registry (`earn-providers.js`) through one shared renderer (`earn-hub.js`). New offerwalls, survey networks, CPA networks or direct offers are added as registry entries, not new markup.
- Provider states: `active`, `testing`, `pending_approval`, `suspended`, `unavailable`. Unknown states render as unavailable. Only `active` providers with a server `launch` function can be opened; status is shown by text label and mark, not colour alone.
- Offerwall.GG: `pending_approval`, button disabled. CPAGrip: added as its own provider card and entry button, state `testing`, no launch endpoint (callback receiver still in development on Supabase staging). Surveys and Direct offers: `unavailable` category slots.
- Removed `offerwall-launch.js`. On 486705f it enabled the Offerwall.GG button and requested a live wall link for signed-in players, despite the pending status.
- Frontend makes no ledger, RPC or table writes; tracking, attribution, callbacks and LootCoin issuance stay server-side. No offers, amounts, approvals or integration status were invented.
- Tests: `node --test tests/*.test.mjs` (registry rules, 7 pass) and `python3 tests/earn-hub.browser.py <base-url>` (Playwright, desktop + phone; 39 checks pass locally). The active-provider launch guard was exercised with stubbed auth: only an exact `https` URL on the allowed origin and path opens.
- Pushed to `design/neon-comic-arcade` only. No merge, production deployment, provider activation or reward issuance.

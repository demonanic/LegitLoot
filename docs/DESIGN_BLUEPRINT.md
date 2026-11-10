# LegitLoot homepage design blueprint

**Status:** Grounded Stage 0 baseline and proposed creative handoff; not implemented
**Reviewed:** 2026-11-09
**Branch:** `build/legitloot-neon-synthwave`
**Creative authority:** `docs/BRAND_ART_DIRECTION.md` and `docs/WEBSITE_CREATIVE_WORKFLOW.md`

This replaces the stale blueprint that referenced `design/industrial-cyberpunk-rebuild` and a minimal cream/red visual direction. The active approved direction is LegitLoot — The Underground Arcade, with comic-book chaos leading, rich detail, and the approved brand palette. The current site remains a static HTML/CSS/JavaScript website. This file is a design handoff, not authorization to generate art or change pages.

## Current site baseline

- Homepage: `index.html` with a dashboard-specific header, LootBadger hero, player/status panels, five explore links, and a footer.
- Portal routes: `games.html`, `earn.html`, `marketplace.html`, `rewards.html`, `account.html`, `trust.html`, `terms.html`, and `privacy.html` use a shared static-page structure and portal styles.
- Additional routes: `how-it-works.html` is an overlapping explainer with a separate legacy visual system; `404.html` is minimal. `admin.html` and `payout-simulator.html` are staging/internal tools, not public marketing destinations.
- Shared styles are `styles.css` and `portal.css`; homepage styles are in `dashboard.css`. There are no reusable JS-rendered components or frontend framework. `app.js` is empty.
- The home dashboard uses 980px, 650px, and 370px breakpoints; portal styles use 760px. Mobile routes use a fixed six-destination dock with safe-area handling. Reduced-motion and keyboard-focus CSS are present.
- Actual art is inventoried in `docs/ASSET_MANIFEST.md`. No approved owner dashboard/reference screenshot was found in the repository. Browser screenshots could not be captured because the workspace browser service could not reach local pages and no local browser is installed; see `docs/WEBSITE_STAGE0_AUDIT.md`.

## Homepage goal

Make the first screen communicate that LegitLoot is an independent games-first underground arcade, with opportunities as a clearly disclosed secondary path. Keep the experience mobile-first, expressive, legible, and truthful about what is not active.

## Proposed page hierarchy

1. **Header:** Crown mark and wordmark; Home, Games, Earn, Deals, Rewards, and Wallet paths. Keep the active state visible on desktop and all destinations reachable on mobile.
2. **Hero poster:** Reuse the existing underground arcade backdrop and LootBadger working concept. Put a short games-first headline, primary “Explore games” action, and secondary opportunities link alongside the character at desktop. Keep the inactive-provider disclosure visible without competing with the action.
3. **Featured game wall:** Three distinct modules using only the actual Demonanic, Gauntlet's Survival, and Harvest//Zero art. Show accurate names and availability states. Do not imply playable launch links, player counts, ratings, earnings, or release dates without verification.
4. **Opportunity board:** Summarize future categories and their current status. Offerwall.GG remains pending/disabled until its approval, configuration, callback, and ledger gates are met. Do not show reward rates or guaranteed outcomes.
5. **Trust and status strip:** Explain preview status, non-cash/non-withdrawable LootCoins, and the separation of future cash rewards from game credits. Link to the canonical explainer and reward detail.
6. **Footer:** Preserve support/contact and terms/privacy links. The duplicate explainer routes (`trust.html` and `how-it-works.html`) need a later content/navigation decision before one is treated as canonical.

This order addresses a source-level gap: the current home page has an arcade CTA but does not feature game artwork or a trust/opportunity preview. The proposed game wall uses assets already present and does not require new artwork.

## Visual language

- Lead with the owner-selected hand-inked comic poster language. Support it with selective distressed-print details and cinematic underground arcade atmosphere.
- Use deep black/violet as the environment, off-white for body text, lime for primary actions, magenta for impact, cyan for technical/status cues, and restrained gold for loot/event emphasis.
- Retain three typography roles already available in the project: Barlow Condensed for display, Inter for interface/body, and DM Mono for technical labels. Google Fonts are currently loaded remotely; delivery/performance has not been measured.
- Use a limited set of image-led hero, framed game/poster, and quiet information surfaces. Avoid outlining every surface in neon or using noisy textures behind dense copy.
- Keep account, reward, legal, and availability text easy to scan. Place comic treatment around information rather than reducing transaction/status clarity.
- Preserve reduced-motion support, strong visible focus states, semantic HTML, and adequate text contrast.

## Responsive composition

- On phones, keep the headline and primary game action in the initial viewport. The hero should not consume the whole screen; retain LootBadger as a visible focal point without forcing copy into the current narrow two-column squeeze.
- Stack game modules in a deliberate order. Keep names/status in HTML and inspect cover crops for both portrait and landscape artwork.
- Preserve clear mobile navigation, thumb-sized targets, safe-area insets, and body clearance for the fixed dock. Check 320px, 390px, tablet, and desktop widths.
- Validate menu operation, keyboard focus order, contrast, reduced motion, overflow, and content hidden behind the fixed dock before accepting the visual system.

## Approval boundary and next stage

This blueprint satisfies the Stage 0 grounded-handoff requirement. No page changes or art generation are included. The rendered screenshot baseline remains blocked and must be captured when a browser can access the local build. After that baseline is available, the next creative task is Stage 1: finish the visual audit/design blueprint review against the actual rendered site and approved references, then establish the homepage concept gate before implementation or asset production.

See [Website Stage 0 audit](WEBSITE_STAGE0_AUDIT.md) for the page/component inventory, source-level responsive findings, asset/reference findings, and verification limitations.

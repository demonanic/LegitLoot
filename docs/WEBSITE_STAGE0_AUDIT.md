# Website Stage 0 baseline audit

**Reviewed:** 2026-11-09
**Branch / baseline commit:** `build/legitloot-neon-synthwave` / `43ba8b059ea694ece0ccf01de13d9ae5ecaf262e`
**Scope:** source, page, asset, component, and responsive-layout inventory plus the current homepage baseline. No page or backend implementation was changed.

## Repository and implementation baseline

- The public site is a collection of static HTML pages with shared CSS and small vanilla JavaScript files. There is no frontend framework, package manifest, or component build system at the repository root.
- Shared presentation is mostly implemented through `styles.css` and `portal.css`. The homepage uses `dashboard.css`; account forms additionally use `identity.css` for authentication UI. Admin and payout simulator pages also contain page-local inline CSS.
- The repository has one special homepage layout and a different shared header/footer layout for portal pages. Header, footer, and mobile dock markup is repeated in the HTML rather than rendered from shared components.
- `app.js` is empty (0 bytes). `portal.js` contains the game/opportunity filtering behavior. Account authentication, admin operations, offerwall launch, and payout simulation have separate page scripts and are outside this visual audit's implementation scope.
- The current Git branch matches the authorized development branch. At audit start, `AGENTS.md` was untracked; it is being added as requested. Existing tracked files were clean.

## Page and component inventory

| Route / file | Current purpose and visible structure | Shared elements / notes |
|---|---|---|
| `index.html` | Public homepage: branded header, illustrated hero and primary arcade CTA, roadmap/player status panels, five explore tiles, footer | Unique `.dash-*` dashboard system; desktop nav, mobile details menu and fixed six-destination dock |
| `games.html` | Three-game catalog, category filters, official images, status labels | Portal header/footer/dock; catalog uses `portal-grid` and `portal-card` |
| `earn.html` | Opportunity categories, provider approval notice and disabled Offerwall.GG launch control | Portal header/footer/dock; the page correctly labels provider integration as pending/not connected |
| `marketplace.html` | Deals/marketplace information and four category treatments | Portal header/footer/dock; content is informational, no verified live offers are established by the page |
| `rewards.html` | Explains separate game-credit and cash-reward concepts and status boundaries | Portal header/footer/dock; does not show live balances |
| `account.html` | Account center, sign-in/sign-up forms, account state and ledger explanation | Portal header/footer/dock; Supabase client/config references exist; authentication behavior is not evaluated here |
| `how-it-works.html` | Short explainer route with play/participate/track/redeem concepts | Uses `identity.css` after shared styles, creating a distinct cream/black/red/lime visual system; header has no mobile dock in its markup |
| `trust.html` | Longer “How the Arcade Works” explainer, status truth, FAQ and contact guidance | Portal header/footer/dock; overlaps purpose and navigation label with `how-it-works.html` |
| `terms.html` | Terms preview and limitations | Portal header/footer/dock; page states the development-preview status |
| `privacy.html` | Privacy notice status and account-use guidance | Portal header/footer/dock; page states the complete notice is still in preparation |
| `404.html` | Custom not-found page with return-to-home action | Standalone minimal header; no footer or mobile dock |
| `admin.html` | Restricted operations console shell | Internal/admin route; inline styles and page script; staging-only language |
| `payout-simulator.html` | Explicitly isolated simulated-funds and withdrawal workflow | Internal owner tool; inline styles and page script; simulation-only warning |

The public navigation currently includes Home, Games, Earn, Deals, Rewards, and Wallet. “How it works” is reached through footer links, but the repository has two related routes (`trust.html` and `how-it-works.html`) with different treatments. This is an observed content/navigation duplication, not a proposed route change.

### Shared visual components found in source

- Brand mark/wordmark: `.brand`, `.dash-brand`, and `assets/legitloot-mark.svg`.
- Public portal header and nav: `.site-header`, `.main-nav`, `.menu-toggle`.
- Homepage-specific header/nav: `.dash-header`, `.dash-nav`, `<details class="mobile-menu">`.
- Homepage content modules: `.dash-hero`, `.arcade-status-grid`, `.arcade-explore`, `.arcade-tile`.
- Portal content modules: `.portal-hero`, `.portal-grid`, `.portal-card`, `.notice-panel`, `.filter-row`, `.filter-chip`, `.wallet-grid`, `.status-grid`, `.faq-list`.
- Shared footer and mobile quick navigation: `.site-footer`, `.mobile-dock`; the homepage has `.dash-footer` and its own dock markup.
- Forms, authentication panels, focus states, disabled buttons, status labels, FAQ disclosures and reduced-motion rules are implemented in CSS/HTML.

## Art and references

- Seven raster/vector image assets and one ZIP archive are in `assets/`; the inventory is in [ASSET_MANIFEST.md](ASSET_MANIFEST.md).
- The homepage references `lootbadger.webp`, `underground-arcade-backdrop.svg`, `loot-crate.svg`, and the crown mark. The three official game JPEGs appear on the Games page.
- `badger-mascot.svg` and `mascot.svg` are present but are not referenced by the current page markup or CSS. They remain existing concepts; there is no need to expand mascot exploration.
- No owner dashboard/reference image was located in the repository inventory. The only image ZIP contains the same three standalone game images. No separate approved homepage reference screenshot is available in the checked-in assets.
- The three game images were inspected. They are portrait art for Demonanic and Gauntlet's Survival and landscape art for Harvest//Zero; all are used on the corresponding catalog entry. The CSS currently crops catalog images to a fixed-height frame with `object-fit: cover`.

## Responsive behavior found in CSS

- Shared portal pages: `styles.css` and `portal.css` switch at `max-width: 760px`. The desktop navigation becomes a dropdown opened by a button, content grids collapse mainly to one column, and a fixed six-item mobile dock appears with bottom safe-area padding.
- Homepage: `dashboard.css` has layout changes at 980px, 650px and 370px. At tablet width the hero and panels tighten; at phone width the header switches to a details-based menu, the hero becomes a compact two-column mascot/text layout, status panels stack, and the dock becomes fixed. At very narrow widths, mascot and headline dimensions shrink further.
- Reduced-motion preferences are explicitly handled in both systems. Keyboard focus outlines and disabled-button styles are present in the shared styling.
- Admin, payout, and auth forms use fluid/max-width wrappers and wrapping grids, with horizontally scrollable wide data tables in admin/simulator.
- This is a source/CSS responsive review, not a device/browser validation. No viewport screenshot or runtime overflow check could be produced in this environment (see verification record below).

## Visual and content findings

### Approved / consistent with current direction

- Brand assets and palette are present; the homepage uses the established LootBadger working concept, arcade backdrop, and designed crown mark.
- Existing game artwork is used for the correct named games and is not presented as gameplay footage.
- Public earn, reward, account, terms, and privacy pages make important planned/inactive or preview status clear. The Offerwall control is visibly disabled with pending approval text.
- The current homepage includes a clear games destination CTA, a supporting navigation tile system, and an explicit provider inactivity disclaimer.
- Mobile and reduced-motion rules exist across the shared layout and homepage styles.

### Temporary, inconsistent, or requiring review in a later stage

- `docs/DESIGN_BLUEPRINT.md` previously described a minimal industrial/cream/red direction and a different branch, which conflicts with the current owner-selected comic-book-chaos/rich-detail direction and the active branch. It has been replaced with a grounded Stage 0 homepage blueprint.
- The actual homepage is currently a compact dashboard-style entry page. It does not yet show the featured game artwork or the fuller opportunity, trust, and editorial hierarchy specified for the homepage; these are blueprint recommendations for a later authorized design stage, not implemented changes.
- The current home rank, wallet, and daily check-in panels all show unavailable/roadmap text. They are not balances, but their dashboard treatment visually suggests account activity; the later homepage composition should prioritize real games and plainly marked planned opportunities.
- Shared portal pages are styled as rounded neon synthwave cards, while the homepage uses a related but distinct dashboard treatment. The `how-it-works.html` route layers the older cream/black/red `identity.css` direction over portal styling. Route overlap and theme inconsistency should be resolved during a future authorized design stage, not here.
- Portal pages and homepage use different mobile menu implementations. The fixed six-item dock has very small text at narrow widths; actual touch/overlap behavior needs screenshot/runtime QA.
- Desktop/mobile crop safety for the LootBadger and game art has not been verified in a rendered browser. The source uses CSS positioning/cover behavior but has no separate responsive crops.
- The `404.html` route has no shared footer/dock and has a very small file; it remains part of the route inventory for later coverage.

## Homepage design blueprint grounded in current files

This is a proposed Stage 1/2 handoff brief only. It does not authorize page redesign or artwork generation. Keep the current static framework and approved visual direction.

### Page hierarchy and composition

1. **Header:** retain the recognizable crown/wordmark and clear Home, Games, Earn, Deals, Rewards, and Wallet paths. Align the homepage and portal navigation behavior so desktop active state and mobile destinations remain consistent.
2. **Hero poster:** use the existing arcade backdrop as the environmental layer and the existing LootBadger working concept as the character focal point. Place a concise games-first headline and one dominant “Explore games” action beside the character at desktop sizes. Provide a secondary text link to the opportunity overview. Keep the provider-inactive disclosure visible but visually subordinate to the action.
3. **Featured games:** bring the three actual game-art files into the homepage below the hero, with correct game names and truthful planned/in-development labels. Avoid fabricated ratings, release dates, player counts, and launch links. Use the actual art with crop positions checked at desktop and phone widths.
4. **Opportunity preview:** a compact mission-board section explaining the categories that are planned and the approval gate. Keep Offerwall.GG clearly pending and disabled until approval/configuration/testing requirements are satisfied; do not show rates or earnings claims.
5. **Transparency strip:** explain the development-preview status, non-cash/non-withdrawable LootCoins rule, and the separation between any future cash rewards and game credits. Link to the existing How It Works/Rewards explanations.
6. **Footer:** retain contact and legal links and make the correct explainer route easy to find. The `trust.html` and `how-it-works.html` overlap should be resolved in a later route/content decision without inventing new claims.

### Visual system and reusable surfaces

- Follow `docs/BRAND_ART_DIRECTION.md` and the chosen comic-book-chaos/rich-detail workflow: expressive comic poster hero, hand-ink/print texture used selectively, and cinematic arcade environment as support.
- Preserve semantic palette roles: deep black/violet for environment, off-white for readable copy, lime for primary action, magenta for impact, cyan for technical/status information, and restrained gold for loot/event emphasis. Do not let neon outlines become the default for every surface.
- Use the existing display/interface/technical roles (Barlow Condensed, Inter, DM Mono) unless a later audited need justifies change. Current pages import fonts from Google Fonts; their runtime availability/performance has not been measured.
- Use a limited set of surfaces: image-led hero, framed game/poster modules, restrained plain panels for availability/transparency, and a clean footer. Keep dense status and financial explanations legible and low-noise.
- Maintain strong focus indicators and reduced-motion support. Use CSS/SVG for light repeatable print texture, not extra large decorative raster assets.

### Mobile composition and interactions

- At phone widths, put the games-first message and primary action in the initial viewport; keep the hero shorter than a full-screen poster. Preserve a visible character focal point without squeezing headline text into the current narrow two-column arrangement.
- Stack game art cards in a deliberate order and keep game name/status in HTML. Ensure image focal points remain visible with the portrait and landscape sources.
- Keep the primary navigation reachable with thumb-sized targets, respect safe-area insets, and leave enough body padding for the fixed dock. Verify the six destinations at 320–390px before acceptance.
- Verify keyboard menu behavior, focus order, reduced motion, color contrast, and no content obscured by the mobile menu/dock.

### Current framework mapping

- Homepage structure and breakpoints live in `index.html` and `dashboard.css`.
- Shared public pages/components live in static markup and `styles.css`/`portal.css`; no component framework was found.
- The game's official art is in `assets/demonanic.jpg`, `assets/gauntlets-survival.jpg`, and `assets/harvest-zero.jpg`.
- Current responsive rules are 980/650/370px for the home dashboard and 760px for portal layouts.
- Keep the later implementation limited to the homepage and shared components required by the active creative milestone; do not change backend/auth/payout systems as part of visual work.

## Screenshot and runtime verification record

- **Requested baseline capture:** desktop 1440×1000 and mobile 390×844.
- **Result:** BLOCKED. A local Python static server was started, but the available browser capture service could not reach workspace `127.0.0.1:8765` (`ERR_CONNECTION_REFUSED`). No browser executable (`chromium`, Chrome, Firefox, Playwright CLI, or equivalent) is installed in the workspace. No screenshots were created.
- **Source review:** completed for checked-in HTML, CSS, page scripts, and assets; source-level layout rules and image framing are documented above.
- Because the workflow names screenshots as a Stage 0 step, the rendered visual baseline remains an explicit outstanding verification item. No rendered-layout conclusions are claimed.

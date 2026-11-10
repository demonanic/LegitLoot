# LegitLoot — Comic-Book Website Creative Direction & Production Workflow

**Version:** 1.0  
**Status:** Owner-selected creative direction  
**Selected direction:** Comic-book chaos  
**Detail level:** Rich  
**Product identity:** LegitLoot — The Underground Arcade  
**Repository:** `demonanic/LegitLoot`  
**Applies to:** Public website, responsive UI, brand artwork, game discovery, earning hub, rewards experience and promotional surfaces.

This document implements the owner-selected **Comic-book chaos + Rich detail** direction within the existing approved LegitLoot brand. It supplements, and does not replace, `docs/BRAND_ART_DIRECTION.md` or `docs/PLATFORM_BUILD_SPEC.md`.

---

# 1. Creative north star

LegitLoot should feel like stepping into a hidden punk arcade that has been built inside a battered underground venue, hacked-together workshop and comic-book universe.

The experience is loud, expressive, tactile and full of character. It should feel handmade and art-directed rather than algorithmically assembled. The website can be visually chaotic, but the user experience must remain clear, fast, trustworthy and easy to navigate.

**Creative statement:**  
*A rebellious underground arcade for players, hustlers and curious outsiders — where original games, real opportunities and a distinct crew collide.*

The site is not:
- a generic rewards or survey dashboard;
- a sterile fintech application;
- a generic cyberpunk template;
- an anime site;
- a wall of neon cards;
- a comic page copied panel-for-panel;
- an excuse to sacrifice usability for decoration.

The intended balance is **high visual personality, strong information hierarchy and straightforward functionality**.

## 1.1 The three ingredients

1. **Comic-book chaos — the lead voice.** Hand-inked character art, dramatic silhouettes, punchy composition, halftone, rough outlines, expressive typography, poster fragments and occasional speech-bubble or caption treatments.
2. **Underground punk print — the material language.** Photocopied textures, torn paper, stencil marks, distressed ink, tape, stickers, rough labels, screen-print imperfections and imperfect alignment used deliberately.
3. **Cinematic arcade atmosphere — the environment.** Deep shadow, dramatic pools of neon light, layered depth, atmospheric interiors, arcade machines, cables, signage and carefully composed environmental art.

One ingredient leads in each component; the others support it. Do not apply every effect to every component.

---

# 2. Brand continuity — fixed constraints

The approved brand source remains `docs/BRAND_ART_DIRECTION.md`. The following constraints are not optional:

- Brand name: **LegitLoot**.
- Brand concept: **The Underground Arcade**.
- Personality: punk outlaw + underground hacker + arcade boss.
- Primary mascot: LootBadger, using the existing approved working concept.
- Supporting character: mysterious punk woman, used selectively in promotional artwork.
- Core palette: midnight black/deep violet, electric purple, hot magenta, radioactive lime, electric cyan, warm gold and off-white.
- Initial games: Demonanic, Gauntlet's Survival and Harvest//Zero.
- Official game art must represent the actual game. Generated promotional art must never be passed off as a gameplay screenshot.
- Do not restart mascot exploration or invent new mascot lore. Existing mascot concept is sufficient.
- Do not replace the brand's designed logo/crown mark with emoji or typed symbols.
- Do not invent user activity, balances, rewards, partner approvals, earnings or payout availability.

The chosen comic direction increases the strength of the illustration, print texture and graphic composition. It does not authorize changing the mascot's identity, palette, brand personality or business rules.

---

# 3. Visual system

## 3.1 Color roles

Use the existing palette as a system of roles, not as a collection of equal accents:

- **Midnight black / deep violet:** main environment, page backgrounds and large surfaces.
- **Electric purple:** depth, secondary surfaces and atmospheric light.
- **Hot magenta:** impact, expressive emphasis, featured artwork and selected highlights.
- **Radioactive lime:** primary action, active state and high-priority interaction.
- **Electric cyan:** technical information, secondary status and system cues.
- **Warm gold:** loot, prizes and special event emphasis.
- **Off-white:** primary text and high-contrast graphic elements.

Neon is a lighting accent. It must not become a constant outline around every object. Keep body text contrast high and reserve the brightest accents for meaningful hierarchy.

Create semantic design tokens in code for page background, surface, elevated surface, primary text, secondary text, primary action, secondary action, success, warning, danger, border, focus and decorative accents. Do not scatter arbitrary color values across components.

## 3.2 Typography

Use three complementary typographic roles:

- **Display:** bold, condensed, expressive headline face for major statements and section titles.
- **Interface:** highly legible sans-serif for body copy, labels, navigation, forms and data.
- **Technical:** restrained monospace for codes, stats, timestamps, tags and small system labels.

Rules:
- A headline may be loud; instructions and transactional copy must remain easy to read.
- Use distressed lettering selectively, never for dense paragraphs or legal content.
- Do not use more type families than the design system needs.
- Verify font licensing and delivery/performance implications before adding a font dependency.
- Avoid tiny uppercase labels as the only way to communicate important information.

## 3.3 Shape and composition

Use:
- asymmetrical sections;
- large poster-like hero compositions;
- angled or torn-paper section transitions in limited places;
- framed comic panels for featured content;
- irregular but consistent graphic dividers;
- varied panel proportions;
- controlled overlaps between illustration and interface;
- strong whitespace/negative space around important controls.

Avoid:
- every section being a repeated rounded rectangle;
- every item having the same card treatment;
- excessive pills and badges;
- arbitrary skewed text that harms readability;
- cluttered compositions with no focal point;
- fake depth that makes controls hard to identify.

Use a small number of reusable surface families: plain interface surface, framed comic panel, poster/feature surface, inset technical panel and image-led scene. Give each a clear purpose.

## 3.4 Texture and effects

Approved techniques:
- halftone dots;
- photocopy grain;
- rough ink edges;
- subtle paper fibers;
- screen-print misregistration;
- stencil and spray-paint marks;
- torn-paper masks;
- tape/sticker motifs;
- selective glow and rim lighting;
- comic impact bursts used sparingly.

Implementation rules:
- Textures must not lower contrast or create noisy reading surfaces.
- Prefer lightweight CSS/SVG patterns for repeatable interface textures.
- Use raster artwork for complex painted/illustrated scenes.
- Avoid large, unoptimized texture files.
- Respect reduced-motion preferences.
- Do not use constant flashing, aggressive parallax or perpetual animation.

---

# 4. Art direction and asset plan

## 4.1 Asset families

Create only assets required by a real page or component. Initial asset families:

1. **Brand marks:** approved wordmark, crown mark, compact icon and monochrome variants.
2. **LootBadger:** one approved hero pose plus only the additional crops/poses needed for actual page sections.
3. **Underground arcade environment:** primary hero background and a small number of reusable atmospheric scene assets.
4. **Loot/reward objects:** original crate, tokens, prize motifs and reward iconography.
5. **Game presentation:** official art for each actual game, with distinct layout/crop treatment; never fabricate screenshots.
6. **Section graphics:** limited textures, torn-paper edges, halftone fields, sticker shapes and graphic dividers.
7. **Promotional supporting character:** only where a campaign or page genuinely benefits from it.

Do not produce dozens of decorative images before the page layouts prove they need them.

## 4.2 Asset manifest

Maintain `frontend/assets/asset-manifest.md` or the existing repository's equivalent. For every final asset record:
- stable asset name;
- file path;
- purpose and page/component;
- dimensions and aspect ratio;
- format and file size;
- source (owner-supplied, official game art, Magnific generation, hand-authored SVG/CSS);
- reference asset/creation identifier when available;
- approval state;
- whether desktop/mobile crops are separate.

Use descriptive filenames. Avoid ambiguous names such as `final2-new.png`.

## 4.3 Image composition rules

Generate artwork as an illustration/background, not a screenshot of a website.

- Do not bake navigation, body copy, buttons, prices, reward values, UI labels or critical logos into generated images.
- Leave intentional negative space where real interface content will sit.
- Plan separate desktop and mobile crops when the composition requires it.
- Keep the subject and important visual information inside safe crop zones.
- Avoid visual detail behind dense text or forms.
- Maintain character continuity using the approved LootBadger reference; do not reinvent the character in each prompt.
- Store the original master and derive responsive crops from it when possible.

---

# 5. Website experience and page direction

The existing site framework and page inventory remain authoritative. This section defines how each area should feel and behave.

## 5.1 Home — the arcade entrance

**Purpose:** Immediately communicate what LegitLoot is, establish personality and give the visitor a clear first action.

Composition:
- branded header and recognizable navigation;
- large illustrated comic-poster hero;
- LootBadger as a character focal point, not an obstacle to content;
- one dominant primary action and one secondary path;
- concise explanation of games and earning opportunities;
- featured games with real official art;
- clear opportunity/quest/event previews;
- trust and transparency section;
- useful footer and support/legal links.

The hero should feel like a cover image or entrance poster. It must not become a giant image that pushes all useful content below the fold on mobile.

## 5.2 Games — the game wall

**Purpose:** Make the original games feel like the core attraction.

- Give each approved game a distinct visual presentation.
- Use official game artwork and verified destination links.
- Display truthful release/availability status.
- Make game descriptions concise and useful.
- Keep game launch actions clear.
- Do not invent ratings, player counts, screenshots or release dates.

## 5.3 Earn — the opportunity board

**Purpose:** Present available ways to earn without misleading users.

- Use a graphic poster/mission-board visual language.
- Organize opportunities by category and verified availability.
- Show eligibility, conditions, tracking status and reward type where known.
- Make provider attribution/disclosure visible.
- Clearly distinguish planned/in-development features from functional ones.
- Never imply that clicking an offer guarantees completion or payment.

## 5.4 Deals / Marketplace — the deal wall

**Purpose:** Present affiliate and promotional opportunities with transparency.

- Use editorial poster tiles and product/offer imagery.
- Place affiliate disclosures near recommendations.
- Explain material conditions and recurring charges where known.
- Distinguish cash, gift cards, points, LC and other reward types.
- Avoid fake countdowns, fake scarcity and invented discount claims.

## 5.5 Rewards and wallet — clarity over decoration

**Purpose:** Explain balances, activity and status accurately.

- Use clean, highly legible accounting layouts.
- Show only real connected values.
- Clearly distinguish pending, confirmed and available states where applicable.
- LootCoins are not cash and are not withdrawable.
- A future cash ledger must remain separate.
- Use comic styling around the edges, not in the transaction table itself.
- Never display sample/demo data without a conspicuous DEMO label and isolation from real balances.

## 5.6 Account and utility pages

Account, forms, legal pages, support and settings prioritize legibility, accessibility, trust and ease of use. Do not force comic textures into sensitive or high-concentration tasks.

## 5.7 Navigation

- Desktop: clear branded navigation with strong active state.
- Mobile: compact, thumb-friendly navigation consistent with the current approved site structure.
- Account and key earning/game destinations must remain easy to reach.
- Respect safe-area insets.
- Mobile navigation must never obscure page content, buttons, dialogs or form fields.

---

# 6. Design toolchain and responsibilities

Use tools for the work they are good at. The repository remains the source of truth for the actual website.

## 6.1 ChatGPT — creative direction and review

Responsibilities:
- translate the approved brand documents into component/page briefs;
- write precise image-generation briefs;
- compare generated assets against the visual standard;
- review page screenshots for hierarchy, consistency and usability;
- maintain scope and creative decisions;
- identify visual defects and produce actionable revisions.

ChatGPT must not invent new brand facts or silently change approved direction.

## 6.2 Magnific — original artwork production

Use Magnific for original illustration and supporting visual assets:
- LootBadger artwork based on the approved reference;
- underground arcade environmental scenes;
- loot/reward objects;
- comic textures and poster graphics;
- selected promotional compositions.

If a LegitLoot brand kit exists in Magnific, inspect it and use it consistently. If it does not exist, first assemble the approved brand references and create a brand kit only with the owner's approval. Never assume a kit exists.

Production sequence:
1. Confirm the specific asset's purpose, placement and aspect ratio.
2. Select the approved visual reference(s).
3. Write a short, specific prompt with composition and character constraints.
4. Generate a small candidate set, not dozens of random variants.
5. Review anatomy, character continuity, composition, crop safety, brand fit and image artifacts.
6. Select or revise one master.
7. Adapt/crop the approved master for required breakpoints.
8. Inspect final exports and record them in the asset manifest.

Do not regenerate a whole image just to change a crop. Do not treat a generated image as final until it has been reviewed.

## 6.3 Canva — optional layout and promotional exploration

Use Canva for:
- moodboards;
- poster/graphic layout exploration;
- brand presentation/reference boards;
- promotional artwork adaptations where editable layers help.

Canva is not the production frontend and is not the canonical source for interactive website behavior. Do not create a parallel website implementation there.

## 6.4 Codex — implementation

Codex owns:
- repository inspection;
- design tokens and component implementation;
- page layout and responsive behavior;
- semantic HTML and accessible interactions;
- performance and asset optimization;
- integration with real app data;
- automated tests and visual regression where available;
- progress records and commits.

Codex must follow `docs/CODEX_EXECUTION_CONSTITUTION.md`. It must not independently reinterpret or replace the selected creative direction.

---

# 7. The mandatory creative production workflow

This workflow is a gated pipeline. Do not skip stages or begin a later stage while a blocking defect remains in an earlier one.

## Stage 0 — Baseline and reference lock

1. Read the Codex Constitution, Platform Build Specification and Brand Art Direction.
2. Inspect the active build branch and current website.
3. Inventory current pages, components, images, fonts, logo assets and responsive behavior.
4. Locate the owner's approved dashboard/reference images in the repository or available project files. Do not assume a reference exists if it cannot be found.
5. Capture current desktop and mobile screenshots.
6. Record what is approved, what is temporary and what is broken.
7. Create/update the asset manifest.

**Gate:** no redesign begins until current implementation and references are understood.

## Stage 1 — Visual audit and design blueprint

Create a concise design blueprint covering:
- page hierarchy;
- color tokens and roles;
- typography roles;
- surface families;
- spacing and layout rules;
- button and form styles;
- navigation behavior;
- mobile navigation;
- texture/effect rules;
- illustration placement;
- interaction/motion rules;
- accessibility requirements.

Map the shared design system to the actual repository framework and existing components.

**Gate:** the blueprint must agree with the approved brand documents and the owner-selected comic/rich direction.

## Stage 2 — Build one representative homepage concept

Do not redesign every page simultaneously.

Build the homepage first as the visual proving ground:
- header and navigation;
- hero poster;
- mascot/art placement;
- featured game area;
- opportunity/mission area;
- event/feature section;
- trust strip;
- footer;
- mobile layout.

Use temporary neutral placeholders only when final assets are not yet available; label them internally and do not present them as approved art.

**Gate:** homepage passes the visual and usability checklist in Stage 6 before the system is propagated.

## Stage 3 — Produce and approve the essential art

Create only the assets required by the approved homepage concept:
1. hero environment;
2. LootBadger hero illustration/crop;
3. wordmark/crown assets if the current approved files are inadequate;
4. one or two supporting graphic motifs;
5. required game-art crops using official game assets.

Review the art in its actual page composition, not only as isolated images.

**Gate:** no asset is considered approved until it works in the actual layout at desktop and mobile sizes.

## Stage 4 — Implement the reusable design system

Codex translates the approved homepage into reusable production components:
- semantic design tokens;
- typography scale;
- page container/grid;
- navigation;
- button variants;
- links and focus states;
- panel/surface families;
- poster/feature modules;
- image frames/crops;
- status labels;
- form controls;
- empty/loading/error states;
- responsive breakpoints.

Avoid building an oversized component framework. Reuse only patterns that genuinely recur.

**Gate:** components must be functional, accessible, responsive and visually consistent.

## Stage 5 — Propagate to the remaining pages

Apply the system to Games, Earn, Deals/Marketplace, Rewards, Wallet/Account, How It Works, Terms, Privacy and 404.

Each page gets a distinct composition appropriate to its task while retaining the same visual grammar. Do not copy-paste the homepage layout into every route.

Prioritize functional clarity on wallet, account, legal and support pages.

**Gate:** every route works, all navigation is real, and unavailable features are truthfully labeled.

## Stage 6 — Visual QA and acceptance

Review every page at:
- narrow mobile width;
- common phone width;
- tablet width;
- desktop width.

Check:
- hierarchy and focal point;
- typography readability;
- contrast;
- image crop and character continuity;
- section rhythm;
- alignment and spacing;
- responsive overflow;
- touch target size;
- safe-area behavior;
- focus visibility;
- keyboard navigation;
- reduced-motion behavior;
- loading/empty/error states;
- link and button behavior;
- image loading/performance;
- truthful feature status.

Capture before/after screenshots and record defects. Fix the most consequential issues first: usability, broken layouts, illegible text, wrong artwork, misleading UI, then decorative polish.

**Gate:** no page is approved solely because it looks attractive in one desktop screenshot.

## Stage 7 — Final asset and performance pass

- Compress and correctly size images.
- Prefer modern image formats where supported.
- Use responsive image sizes and appropriate lazy loading.
- Avoid loading large below-the-fold assets immediately.
- Avoid excessive animation, filters and expensive visual effects.
- Check font loading and layout shift.
- Remove unused draft assets from production bundles while preserving source files where required.
- Update asset manifest and documentation.

**Gate:** visual quality must not create an unacceptable mobile performance or accessibility penalty.

## Stage 8 — Freeze and handoff

- Confirm the full page inventory.
- Confirm all visual defects are either fixed or documented.
- Run build, lint, tests and responsive checks.
- Update `docs/PROJECT_PROGRESS.md`.
- Commit only on the authorized build branch.
- Do not merge or deploy production without explicit owner approval.

The creative system is considered ready for application-wide use only when the homepage and shared components pass the acceptance criteria.

---

# 8. Asset prompt recipe

Every artwork brief should include these fields:

**Asset name:** stable identifier.  
**Purpose:** exact page and component.  
**Subject:** what must be depicted.  
**Reference:** approved character/brand reference.  
**Composition:** focal point, camera angle, negative space and text-safe area.  
**Style:** raw comic-book illustration, cinematic lighting and selective distressed print treatment.  
**Palette:** approved LegitLoot palette.  
**Continuity:** character markings, silhouette, clothing and proportions to preserve.  
**Crop:** target aspect ratios and safe areas.  
**Exclusions:** no UI, text, logo, fake screenshot, watermark, unrelated mascot or generic cyberpunk filler.  
**Review criteria:** anatomy, visual clarity, brand fit, composition and mobile crop.

### Example: homepage hero artwork brief

**Purpose:** background/illustration for the LegitLoot homepage hero.

**Subject:** an atmospheric underground arcade built from repurposed machines and improvised workshop equipment; LootBadger is the clear character focal point, portrayed consistently with the approved reference.

**Composition:** dramatic comic-book cover composition, dynamic perspective, layered foreground and background, controlled negative space reserved for real HTML headline and actions. Keep the character's face and defining markings inside the central safe area.

**Style:** hand-inked comic-book illustration with confident outlines, expressive character acting, selective halftone and distressed punk-print details; cinematic neon lighting used as accent rather than a full-scene glow.

**Palette:** midnight black, deep violet, electric purple, hot magenta, radioactive lime, electric cyan and restrained warm gold.

**Constraints:** preserve approved LootBadger identity; no text, no logo, no buttons, no interface, no fake gameplay, no watermark, no generic hooded hacker imagery, no extra mascot redesign.

**Deliverable:** clean high-resolution art master with sufficient composition flexibility for desktop and mobile crops.

This is a brief template, not permission to generate the asset before the page composition and reference have been reviewed.

---

# 9. Creative acceptance checklist

A page or asset is approved only if all applicable questions pass:

1. Does it unmistakably feel like LegitLoot — The Underground Arcade?
2. Does comic-book chaos lead the visual language?
3. Is the rich detail intentional, controlled and readable?
4. Is the approved LootBadger identity preserved?
5. Does the art feel original rather than generic AI cyberpunk?
6. Is there a clear focal point and content hierarchy?
7. Are interface controls real, clear and usable?
8. Is typography legible on a phone?
9. Are colors used according to their semantic roles?
10. Are textures and effects restrained enough to preserve clarity?
11. Is the mobile composition intentionally designed?
12. Are actual game images used only for the correct games?
13. Are product, reward and partner claims truthful?
14. Does the page remain fast and accessible?
15. Does it feel like part of one brand without every page looking identical?

A single failed critical item blocks approval. Log lesser defects and fix them before final release.

---

# 10. Scope discipline for creative work

The following are explicitly out of scope unless a real implementation need arises:
- new mascot lore;
- repeated mascot redesigns;
- dozens of alternate logos;
- decorative art with no page/component purpose;
- speculative game artwork;
- full website mockups that are never implemented;
- parallel Canva website builds;
- replacing the frontend framework for aesthetic reasons;
- visual changes that imply non-existent financial functionality.

The active creative milestone is always the smallest unfinished stage in Part 7. Finish and approve it before advancing.

If an idea appears mid-stage, add it to the creative backlog. Do not interrupt the active stage.

---

# 11. Immediate next actions

The first execution session after this document is adopted must:

1. Read this document and all governing LegitLoot documents.
2. Inspect the active branch and current site implementation.
3. Inventory and locate existing approved reference images and assets.
4. Capture current desktop/mobile page screenshots.
5. Create/update the asset manifest.
6. Produce the visual audit and design blueprint.
7. Stop before generating a large asset set or redesigning every page.
8. Report findings, missing references and the exact proposed homepage composition.
9. Continue only after the homepage concept is grounded in the actual existing site and approved references.

**The first deliverable is a grounded homepage design blueprint — not a pile of generated pictures and not an unreviewed rewrite of the site.**

---

*End of LegitLoot Comic-Book Website Creative Direction & Production Workflow.*

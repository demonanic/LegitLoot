# LegitLoot Website Visual Design and Production Workflow

**Status:** Active owner-authorized visual redesign
**Creative source:** [LEGITLOOT_CREATIVE_BIBLE.md](LEGITLOOT_CREATIVE_BIBLE.md)
**Repository:** `demonanic/LegitLoot`  
**Applies to:** Public website, responsive UI, original visual assets, and Skuz use across LegitLoot surfaces.

The owner accepted the Stage 0 source audit as substantially complete and explicitly deferred rendered screenshots until browser access is available. Continue the visual work; record the missing rendered QA as a release limitation rather than halting design/implementation.

## 1. Creative north star

LegitLoot is an underground organization operating a chaotic digital arcade. The art is mature western comic-book illustration: heavy ink, expressive anatomy, crosshatching, painterly shadows, gritty underground environments, and original characters. DIY punk values and lived-in dystopia are foundational. No anime, copied comic characters, generic corporate gaming, performative punk decoration, or filler cyberpunk visuals.

The fictional crew is abrasive, funny, imperfect, and loyal; their care shows through actions. Use deadpan and absurd situational humor with restraint. Silence is valid. Do not force taglines, profanity, punchlines, or sales copy into character dialogue. The service remains welcoming, clear, truthful, accessible, and respectful.

Read the Creative Bible for all character, tone, palette, and product-truth decisions. The older neon synthwave direction is superseded.

## 2. Design and build sequence

### Stage 0 — Baseline and reference lock

Accepted as substantially complete. Source inventory and documentation are in `docs/WEBSITE_STAGE0_AUDIT.md` and `docs/ASSET_MANIFEST.md`. Browser screenshots remain deferred until local browser access is available.

### Stage 1 — Visual blueprint

Define page hierarchy, semantic palette, type roles, surface families, spacing/grid, buttons/forms, shared navigation, mobile navigation, art placement, motion, and accessibility. Map each rule to the existing static HTML/CSS framework. Keep business behavior unchanged.

**Gate:** blueprint aligns with the Creative Bible and identifies which existing elements are retained, replaced, or consolidated.

### Stage 2 — Reusable visual design system

Implement semantic CSS tokens and shared patterns for public page shell, header/navigation, mobile menu/dock, buttons/links, status badges, panels, poster/game modules, forms, focus, and reduced motion. Keep the system small and reuse existing static structure; do not introduce a framework without a demonstrated need.

**Gate:** shared patterns are responsive, keyboard-accessible, readable, and do not suggest unimplemented capabilities.

### Stage 3 — Homepage composition

Build the homepage first as the visual proving ground: shared header, concise arcade entrance/hero with Skuz, prominent original games, accurate opportunity status, transparent reward explanation, and useful footer. Mobile hierarchy must keep the page purpose and primary action visible without making art fill the screen.

**Gate:** all current page functions and truthful status labels remain intact. Review source-level layout now; perform rendered desktop/mobile QA when browser access returns.

### Stage 4 — Art briefs and required artwork

Prepare an asset brief for every needed original image before generation. Establish Skuz's reference sheet and expression library from the supplied Skuz reference. Create only assets that fill a proven homepage or public-page need. The reference sheet is continuity material, not a website screenshot or UI asset.

Each brief records: stable asset name, purpose/page, source/reference, subject, composition, style, semantic palette, continuity constraints, exclusions, target dimensions/crops, and review criteria. No baked UI, logos, text, reward values, or fake gameplay.

**Gate:** character likeness and composition are reviewed at intended desktop and mobile placements before artwork is treated as final.

### Stage 5 — Extend across public pages

Apply the shared visual language to Home, Games, Earn, Deals/Marketplace, Rewards, Wallet/Account, How It Works/Trust, Terms, Privacy, and 404. Give each page a task-appropriate layout instead of cloning the homepage. Preserve forms, navigation, filters, disabled states, disclosures, and other working behavior. Keep admin and payout simulator tools outside the redesign unless explicitly authorized later.

**Gate:** every public route is navigable, claims are truthful, and account/financial/legal content remains especially clear.

### Stage 6 — Responsive, accessibility, and function review

When browser access is available, review at narrow mobile, common phone, tablet, and desktop widths. Check crop/focal safety, overflow, dock/safe-area clearance, focus, keyboard menus, touch targets, reduced motion, contrast, link/button behavior, image loading, and status accuracy. Until then, complete static checks and document runtime checks as BLOCKED/DEFERRED; do not claim visual approval.

### Stage 7 — Asset and performance pass

Record every final asset in `docs/ASSET_MANIFEST.md`, optimize only after composition is settled, use appropriate formats/sizes, lazy-load below-fold artwork, and review remote font and layout-shift behavior. Preserve source masters.

### Stage 8 — Freeze and handoff

Update `docs/PROJECT_PROGRESS.md`, review the diff, run checks available in the environment, and commit coherent work on `build/legitloot-neon-synthwave`. Stop before merge, production configuration, or deployment. Release remains owner-controlled.

## 3. Page direction

### Home — the arcade entrance

Clear branded navigation; a focused comic-poster hero; Skuz as a character focal point rather than a sales mascot; one main game action and a secondary opportunities path; official game art; truthful availability and reward explanation; useful trust/support/legal links. Avoid a dashboard of empty account cards.

### Games — the game wall

Use the supplied official art for Demonanic, Gauntlet's Survival, and Harvest//Zero only. Show verified release/availability states. No invented ratings, player counts, release dates, screenshots, or launch URLs.

### Earn — the opportunity board

Organize categories and state clearly which providers are inactive or pending approval. Keep conditions and attribution/disclosures visible when offers exist. Never imply a click guarantees completion or payment.

### Deals / Marketplace — the deal wall

Use editorial composition for actual curated items. Keep affiliate disclosure next to recommendations; explain fees and terms where known. No fake countdowns, scarcity, discounts, or reward claims.

### Rewards, wallet, and account

Prioritize legibility and accuracy. Game credits and future cash rewards remain separate. Show only connected values; current unavailable systems must stay clearly inactive. Preserve account controls and form behavior. Comic styling may frame these pages but must not interrupt dense transaction/status reading.

### How It Works, Trust, Terms, Privacy, and 404

Use calm readable layouts with direct navigation. Explain preview state and product truth without character banter obscuring obligations, privacy, or support. Keep support and legal links easy to find.

## 4. Shared design system rules

### Color

Use near-black, charcoal, blood red, acid green, bone white, and industrial grey as the core palette. Electric magenta and cyan are limited arcade accents. Define semantic tokens for background, surfaces, text, borders, action, focus, success, warning, danger, and decoration. Validate text/control contrast; never rely on color alone.

### Type and layout

Use a forceful display face for short headlines, a highly legible sans serif for interface/content, and restrained monospace for metadata. Keep legal, financial, and form copy free of distressed effects. Establish consistent page width, spacing scale, grid, breakpoints, and touch dimensions in the actual existing CSS.

### Surface families

Use a limited set: poster/hero, framed game image, editorial opportunity panel, quiet account/legal surface, and inset technical surface. Use ink texture and crosshatch selectively, and keep it away from dense reading areas.

### Navigation and interactions

Desktop navigation must show active route. Mobile navigation must remain reachable, thumb-friendly, safe-area aware, and not cover content or fields. Keep visible keyboard focus, real links/buttons, accurate disabled states, and reduced-motion handling.

## 5. Artwork and Skuz reference standards

The supplied Skuz reference is `assets/lootbadger.webp` unless repository inspection identifies an explicitly owner-supplied alternate. Preserve his badger facial structure and markings, spiked mohawk, green eyes, cigar, spiked leather jacket, and recognizable expression. If any of these details cannot be confirmed from the reference, do not invent a replacement identity; document it and use the owner-provided description as the fixed constraint.

Original art must be purpose-built for LegitLoot. Avoid imitation, anime, brand marks baked into artwork, generic neon circuit patterns, anonymous hooded hackers, unrelated mascot forms, and real game screenshot implications. For image generation, use the supplied Skuz image only as an identity reference, not as permission to copy another artist or franchise.

## 6. Creative and product acceptance

1. Does this feel like LegitLoot's underground organization and digital arcade?
2. Is the mature western comic treatment original and consistent?
3. Does Skuz match the supplied continuity reference?
4. Does punk expression feel lived-in rather than decorative?
5. Does humor arise naturally and leave room for silence?
6. Is the real service respectful, truthful, and easy to use?
7. Are the focal point and page hierarchy clear at phone width?
8. Are color, contrast, focus, keyboard, touch, and reduced-motion needs met?
9. Are all controls functional or clearly disabled?
10. Are game, reward, provider, and financial claims accurate?

Any critical failure involving user trust, accessibility, character identity, or truthful functionality blocks acceptance.

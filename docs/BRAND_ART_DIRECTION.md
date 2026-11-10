# LegitLoot — Brand Art Direction

**Current direction:** Owner-approved 2026-11-09
**Canonical source:** [LEGITLOOT_CREATIVE_BIBLE.md](LEGITLOOT_CREATIVE_BIBLE.md)
**Applies to:** Website, game discovery, account/rewards UI, promotional artwork, Skuz, and future assets.

This document translates the owner-approved Creative Bible into practical art and interface direction. If the wording here conflicts with the Creative Bible, use the Creative Bible. Financial and product truth remain governed by the Constitution and Platform Build Specification.

## Brand premise

LegitLoot is an underground organization operating a chaotic digital arcade. It is not a generic rewards dashboard or corporate gaming platform. The fictional crew may be unruly, deadpan, and difficult; the service itself stays welcoming, clear, honest, accessible, and respectful.

## Illustration and graphic treatment

- Mature western comic-book illustration: heavy ink, expressive anatomy, confident silhouettes, crosshatching, and painterly shadow.
- Lived-in underground spaces and dystopian environments with evidence of DIY repair, use, and community.
- Original LegitLoot characters and art. No anime aesthetic, franchise imitation, copied comic panels, or recognizable copyrighted character derivatives.
- Punk details should arise from function, wear, individuality, and attitude. Avoid decorative costume cues, random slogans, and generic cyberpunk filler.
- Use expressive composition and visual storytelling. Captions and dialogue are optional; leave room for silence.
- Use hand-authored CSS/SVG for small interface motifs and repeatable ink textures. Use raster illustrations for complex scenes and character artwork.

## Palette and semantic roles

| Token role | Color family | Interface use |
|---|---|---|
| Environment | Near-black | Main page background |
| Surface | Charcoal | Panels and raised surfaces |
| Structural line | Industrial grey | Borders, rules, dividers |
| Primary text | Bone white | Reading surfaces and high contrast |
| Impact | Blood red | Selected emphasis and strong brand moments |
| Primary action | Acid green | Main actions and clear positive state |
| Arcade accent | Electric magenta | Limited lighting and illustration accents |
| Technical accent | Electric cyan | Limited technical/status accents |

Color must support hierarchy, not decorate every control. Check text/control contrast. Do not use red as the only error indicator or green as the only success cue.

## Typography

- Display: condensed, forceful face for short headings; never use distressed treatment for long copy.
- Interface: highly legible sans serif for body text, forms, legal content, and financial information.
- Technical: restrained mono face for codes, metadata, and compact system labels.
- Keep paragraphs and controls readable at phone width. Important text remains HTML.

Existing fonts may be retained if they support the approved direction and load reliably. Any font change must be checked for licensing, remote dependency, performance, and layout shift.

## Surface families and composition

Use a small reusable vocabulary:

1. Inked poster/hero scene for brand entrance and story-led features.
2. Framed game-art panel for real games and verified destinations.
3. Editorial note/mission board for opportunities and explanations.
4. Quiet interface panel for account, status, reward, and legal content.
5. Inset technical surface for system details and metadata.

Vary panel proportions and use asymmetry where it improves hierarchy. Avoid making every section a repeated card, noisy backgrounds behind body copy, fake depth around controls, and large art that pushes the page's purpose below the fold.

## Skuz continuity

Skuz is the face and spokesperson of LegitLoot. Use the supplied reference plus the maintained reference sheet and expression library. Preserve badger markings/facial structure, spiked mohawk, green eyes, cigar, spiked leather jacket, and distinctive punk expression. He is a reluctant caretaker and tour guide who complains, helps, and cares more than he admits. Humor should be situational and occasional; he is not a mascot for constant advertising copy.

## Interface and accessibility

- Keep navigation, labels, controls, disclosures, statuses, balances, and all critical copy as real semantic UI.
- Never use art to suggest an inactive offer, live reward, user activity, payment, or payout.
- Keep game credits and cash rewards visually and semantically separate.
- Ensure keyboard focus, contrast, touch targets, reduced motion, safe-area spacing, and mobile-dock clearance.
- Make menus and forms work at narrow widths. Decorative treatment must not obscure controls or status meaning.

## Asset handling

- Start from a real page/component need and record the asset purpose, reference, source, dimensions, crop safety, and status in `docs/ASSET_MANIFEST.md`.
- Keep Skuz reference material separate from public production art unless a specific approved crop is intentionally used.
- Use supplied official game art only for its named title. Never present generated illustration as gameplay.
- Do not bake text, logos, controls, prices, or reward amounts into generated artwork.
- Preserve original masters and make responsive crops only when composition requires them.

## Acceptance check

Before applying a design across pages, verify originality, western comic style, character continuity, authentic punk expression, product truth, hierarchy, text contrast, mobile readability, accessibility, and performance. A beautiful visual that misleads users or impairs a task fails acceptance.

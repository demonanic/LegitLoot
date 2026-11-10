# LegitLoot Visual Blueprint

**Status:** Stage 1 complete; guides the active visual redesign
**Date:** 2026-11-09
**Branch:** `build/legitloot-neon-synthwave`
**Creative authority:** [LEGITLOOT_CREATIVE_BIBLE.md](LEGITLOOT_CREATIVE_BIBLE.md)

## 1. Product and visual thesis

LegitLoot is an underground organization operating a chaotic digital arcade. The public site should feel like entering a lived-in, DIY venue populated by charismatic misfits. Mature western comic-book illustration supplies the emotional point of view; the actual interface stays calm, honest, legible, and welcoming. Punk is expressed through independence, material wear, individuality, and community rather than decorative rebellion.

## 2. Page hierarchy

### Global public shell

- Compact header: designed crown/wordmark at left; primary routes Games, Earn, Deals, Rewards, and Account; active route; a single accessible mobile menu.
- Main content: one clearly named page purpose, a short orientation, the page-specific core, a visible status/terms area where needed, then supporting links.
- Footer: how it works/trust, terms, privacy, and contact, with a plain development-preview disclosure where relevant.
- 404: same visual system with a direct return-to-games/home action.

### Homepage — the arcade entrance

1. Compact global header.
2. Poster-like hero featuring Skuz and one plain-language headline about independent games. One primary Games action and one secondary Earn/How It Works path. The disclosure states that provider rewards are not active until approval and connection.
3. Featured games using the three correct supplied game images, title, concise copy, and truthful status. The first screen should show the start of this section on desktop and the CTA should remain reachable without scrolling on common phones.
4. Opportunity board with no amounts; provider/candidate states remain inactive or pending.
5. Clear reward model: game credits have no cash value; any future cash rewards are separate. No fabricated account activity or balances.
6. Trust/support/legal footer.

Remove the current fictional rank/daily-check-in dashboard treatment from the home route; it distracts from the actual available game directory. Do not delete account/reward functionality from their dedicated routes.

### Games

Lead with the original games, official artwork, and availability. Keep filters working. Present the three art assets with distinct crops that respect their native portrait/landscape composition. Do not imply launch links where none exist.

### Earn

Lead with transparent eligibility and provider status. Keep Offerwall.GG disabled/pending and preserve its current disabled state and disclosure. Present future categories as planned, not active.

### Deals / Marketplace

Editorial deal-wall layout with categories and an affiliate disclosure near the related recommendations. Current categories remain “curation pending”; do not add offers or invent material terms.

### Rewards and Account

Quiet accounting surfaces, clearly separate game credits and USD states, keep actual authenticated wallet summary behavior/forms intact, retain empty/loading/error states, and do not add numbers or placeholder transactions.

### How It Works / Trust, Terms, Privacy, 404

Utility-first reading layouts with consistent typography, clear headings, direct disclosures, and easy footer navigation. Keep both existing explainer routes functional until a separate content decision is authorized; visually align them without deleting content.

Admin and payout simulator are restricted staging tools and are excluded from this public visual redesign.

## 3. Semantic color system

Starting CSS custom properties (contrast and functional pairing must still be verified):

| Token | Start | Meaning |
|---|---|---|
| `--ink` | `#101110` | Main background |
| `--charcoal` | `#202221` | Default surface |
| `--charcoal-raised` | `#2b2e2b` | Raised/selected surface |
| `--industrial` | `#777b75` | Structural borders and quiet metadata |
| `--bone` | `#f1eee3` | Primary text and light surface |
| `--bone-muted` | `#c7c4b9` | Secondary text on dark surfaces |
| `--blood` | `#a9252b` | Strong brand emphasis and destructive state (with text/icon cue) |
| `--acid` | `#c7ee3a` | Primary action and positive status |
| `--magenta` | `#e83f9d` | Limited arcade lighting accent |
| `--cyan` | `#45c6d5` | Limited technical/status accent |
| `--focus` | `#fff36a` | Visible focus outline |

Create distinct semantic tokens for page, surface, raised surface, text, muted text, border, action, success, warning, danger, and focus. Do not communicate success/error by color alone. Check actual combinations with WCAG contrast tools when available.

## 4. Typography

- Display: use existing Barlow Condensed for short, assertive headings, with limited uppercase and no distress on long text.
- Interface: use Inter for navigation, descriptions, forms, legal, and accounting copy.
- Technical: use DM Mono for restrained status labels and metadata.
- Keep the existing font assets/dependency initially; test wrapping and readability at 320–390px. Avoid new font dependency until the changed direction proves it necessary.

## 5. Surface families and spacing

Use these reusable families, not one card repeated everywhere:

1. **Poster scene:** hero/feature, large asymmetric art and text composition.
2. **Game panel:** image-led, mostly square-corner frame, title/status/actions in HTML.
3. **Editorial board:** opportunity/deal grouping with printed dividers and restrained tags.
4. **Quiet utility panel:** account, reward, forms, legal/support, low texture.
5. **Inset system note:** compact technical status or disclosures.

Use a consistent spacing scale (4/8/12/16/24/32/48/64px), page gutters clamped to 16–64px, readable max-widths for copy, and fluid grids. Prefer crisp borders, ink-like rules, and selective asymmetric framing over ubiquitous rounded cards, glow, and gradients. Texture stays behind large visual fields, never under dense text.

## 6. Buttons, links, forms, and status

- Primary action: acid green fill, dark text, high contrast, clear verb, minimum 44px target.
- Secondary action: bone/transparent surface with industrial border and clear focus.
- Destructive action: blood red with text/icon cue; do not use for general emphasis.
- Link: visibly distinct from body copy and underlined in dense information content.
- Form controls: bone text on charcoal, persistent labels, clear error/status text, visible focus, correct input types; no placeholder-only labels.
- Statuses: plain-language labels with icons or text and color; preserve inactive/pending states. No “live” green indicators unless sourced from live functionality.

## 7. Navigation and responsive behavior

- Replace duplicate public navigation implementations with consistent shared markup conventions and CSS; keep each link real and route-correct.
- Desktop: horizontal nav with text labels and an active-state underline/border; keep logo and navigation balanced.
- Mobile: accessible menu button with `aria-expanded` and one list; remove the six-column dock that currently compresses labels and competes with content. If a dock remains useful after implementation, it must fit targets and never obscure page actions/forms.
- Safe-area insets and document bottom spacing are required for any fixed control.
- Breakpoints should be content-driven and shared; start with 760px for nav collapse, then add a narrow 380px adjustment only where the layout requires it.
- Game grid: 3 columns wide, 2 at tablet, 1 at phone. Opportunities and marketplace use a distinct editorial grid, not identical card repetition.

## 8. Illustration placement and asset requirements

- Use `assets/lootbadger.webp` as the supplied Skuz identity reference only; its 192×244 size is too small for large high-density hero display without replacement/upscale quality loss.
- Produce a Skuz reference sheet and compact expression library before making additional character poses. Preserve markings, facial structure, mohawk, green eyes, cigar, jacket/spikes, and expression identity.
- Homepage hero needs an original wide 16:9 environment/character composition with text-safe negative space; desktop and mobile crop planning are required.
- Retain the three existing official game images and do not generate substitutes. Use them only next to their correct game titles.
- Possible utility art: one or two original ink-divider/halftone textures if they improve an actual page; not required ahead of layout.
- No text, UI, logos, reward amounts, false provider marks, or gameplay screens baked into generated art.

## 9. Motion, interaction, and accessibility

- Keep motion short and state-based (hover/focus, menu open/close). No forced parallax, flash, auto-advancing hero, or perpetual animation.
- Honor `prefers-reduced-motion` globally.
- Use semantic landmarks and heading order, accessible names, keyboard-operable menus/filters/forms, focus visibility, contrast, text resize, and touch targets.
- Ensure sticky/fixed headers and menus do not hide focus or content.
- Keep every existing working behavior: game filtering, account forms/auth state, disabled provider launch, and informational navigation. Do not replace functionality with a static image.

## 10. Implementation mapping and acceptance

- Existing framework: static HTML/CSS/JavaScript. Shared styles: `styles.css`, `portal.css`; home: `dashboard.css`; account visual controls: `identity.css`.
- Public pages are duplicated static markup; update deliberately and preserve route-specific IDs/hooks.
- Stage0 screenshots remain deferred. Before browser return, use source checks and static route/link/CSS review. Do not claim rendered QA.
- Acceptance requires a coherent homepage, reusable shared system, all public pages aligned, no backend/auth/accounting changes, truthful labels, accessible structure, responsive source rules, and complete progress/asset documentation. Rendered desktop/mobile checks remain a release blocker until browser access exists.

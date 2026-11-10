# LegitLoot asset inventory

Inventory reviewed for the Stage 0 baseline on 2026-11-09. Paths and file sizes are repository-relative. Raster dimensions come from file metadata; SVG dimensions are viewBox dimensions. Provenance is stated only where existing repository documentation establishes it. “Current use” describes the checked-in implementation, not approval of a future redesign.

## Shipped visual assets

| Asset | Dimensions / format / size | Current use and role | Source / status | Responsive treatment |
|---|---:|---|---|---|
| `assets/legitloot-mark.svg` | 96×96 viewBox · SVG · 477 B | Shared crown mark in site and dashboard headers/footers; favicon | Existing brand mark; approved identity asset | CSS-sized; no separate crops |
| `assets/underground-arcade-backdrop.svg` | 1600×700 viewBox · SVG · 1,733 B | CSS background for the homepage hero | Existing hand-authored SVG; current environment asset | `background-size: cover`; mobile uses adjusted background position |
| `assets/lootbadger.webp` | 192×244 · WebP · 13,048 B | Homepage hero character | Existing LootBadger working concept; README says the concept is sufficient | Contained in hero; mobile sizing/position differs through CSS |
| `assets/loot-crate.svg` | 320×260 viewBox · SVG · 1,582 B | Homepage daily-status illustration | Existing hand-authored reward illustration; does not establish reward availability | Contained and resized via CSS |
| `assets/demonanic.jpg` | 921×1536 · JPEG · 278,101 B | Games catalog official game art | Owner-supplied, as recorded by the existing asset manifest and design blueprint | `object-fit: cover`; catalog fixes image height |
| `assets/gauntlets-survival.jpg` | 935×1536 · JPEG · 274,893 B | Games catalog official game art | Owner-supplied, as recorded by the existing asset manifest and design blueprint | `object-fit: cover`; catalog fixes image height |
| `assets/harvest-zero.jpg` | 1536×839 · JPEG · 271,615 B | Games catalog official game art | Owner-supplied, as recorded by the existing asset manifest and design blueprint | `object-fit: cover`; catalog fixes image height |

## Existing concepts not currently placed in the public page markup

| Asset | Dimensions / format / size | Current use and role | Source / status | Responsive treatment |
|---|---:|---|---|---|
| `assets/badger-mascot.svg` | 760×760 viewBox · SVG · 4,070 B | No current HTML/CSS reference found | Existing working badger concept; no new mascot exploration is needed | None |
| `assets/mascot.svg` | 640×820 viewBox · SVG · 3,798 B | No current HTML/CSS reference found | Existing supporting punk-character concept; use selectively if a real page need is established | None |

## Source archive

| Asset | Format / size | Contents / role | Status |
|---|---:|---|---|
| `assets/legitloot-game-assets.zip` | ZIP · 824,491 B | Duplicate copies of the three owner-supplied game-art JPEGs | Source archive retained; the site references the standalone files |

## Implementation notes

- The Stage 0 HTML/CSS inspection found no references to the FRESH game image or any other item inside the archive.
- The main page uses the crown mark, LootBadger WebP, arcade backdrop and crate illustration. The Games page uses the three corresponding standalone official art files.
- There are no separate desktop/mobile image crops. The site currently relies on CSS sizing, `cover`/`contain`, and object/background positioning.
- `assets/loot-crate.svg` contains a small “LL” label as part of the illustration. Critical interface text and reward values remain HTML content.
- This inventory records the current repository state only. New assets require a concrete page/component placement, source, approval state, dimensions, format, size, and crop notes before they are treated as production-ready.

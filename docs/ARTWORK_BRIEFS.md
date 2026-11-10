# LegitLoot original artwork briefs

Artwork is for LegitLoot only. All generated images are original illustrations; none may be represented as gameplay, a screenshot, or a provider partnership. The Creative Bible is the character and art authority.

## Skuz reference sheet and expression library

- **Asset:** `assets/skuz-reference-sheet.png`
- **Purpose:** Internal character-continuity reference; not linked as a public page illustration.
- **Reference:** `assets/lootbadger.webp`, treated as the supplied Skuz identity reference. The owner's written details lock the markings/face, spiked mohawk, green eyes, cigar, spiked leather jacket, punk personality, and expression.
- **Composition:** Landscape reference sheet with three bust angles and six head-and-shoulder expressions, clear warm-bone separators, no labels.
- **Style:** Mature original western comic illustration; heavy ink, crosshatching, painterly shadows, controlled print wear.
- **Palette:** Near-black, charcoal, bone, blood red, acid green, with minimal magenta/cyan accents.
- **Exclusions:** Anime, copied/copyrighted characters or styles, extra characters, advertising pose, slogans, lettering, logos, or interface.
- **Review:** Generated with built-in ImageGen and inspected in-repo. The output preserves the recognizable badger, mohawk, green eyes, cigar, and spiked jacket; its six expressions cover deadpan, irritated, skeptical, reluctantly helpful, briefly warm, and crookedly amused. It is a Codex-reviewed continuity draft, not a claim of owner visual approval.
- **Continuity rule:** Future Skuz art should reference this sheet and the original supplied image. Do not use it as a source for new character redesigns.

## Homepage hero illustration

- **Asset:** `assets/skuz-arcade-hero.webp` (optimized delivery); source master `assets/skuz-arcade-hero.png`.
- **Purpose:** Homepage hero background/illustration, behind real HTML heading/actions.
- **Reference:** `assets/skuz-reference-sheet.png` for character identity.
- **Composition:** 1672×941 wide scene. Skuz is on the right, repairing an improvised arcade cabinet; the left 40% is a dark, low-detail text-safe area. No separate mobile artwork; responsive CSS crops the same art while keeping the face in view.
- **Style:** Mature western comic illustration with heavy ink, crosshatching, painterly shadow, scuffed environment, and restrained print wear.
- **Palette:** Near-black, charcoal, blood red, acid green, bone, industrial grey; restrained arcade accents.
- **Exclusions:** Text, logo, UI, reward amount, game screenshot, extra character, anime, named-franchise imitation, generic cyberpunk city, watermark, marketing pose, or forced catchphrase.
- **Review:** Generated with built-in ImageGen from the approved reference sheet and visually reviewed. WebP delivery is 395,708 bytes; PNG master is retained.
- **Status:** Used by the current homepage implementation. Responsive rendered review remains deferred until browser access is available.

## Future asset requirements (briefed, not generated)

| Need | Page/component | Requirement |
|---|---|---|
| Optional small Skuz spot illustration | Earn/How It Works only if a real editorial need appears | Use an expression from the reference sheet; no speech bubble or promotional copy; do not reuse the full hero scene |
| Optional hand-ink divider/texture | Shared section transitions only if layout needs it | CSS/SVG preferred; subtle enough to preserve text contrast; no decorative asset without a concrete component |
| Mobile-specific hero crop | Home | Create only if the CSS crop fails after browser review; preserve face/mohawk safe area and keep text outside the image |

Do not create more character or environment art before the affected page is reviewed in a browser and a specific need is confirmed.

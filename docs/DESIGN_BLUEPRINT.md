# LegitLoot 2.0 — Design Blueprint

**Status:** Rebuild prototype in progress  
**Branch:** `design/industrial-cyberpunk-rebuild`  
**Production:** `https://legitloot.site/` remains unchanged.  
**Authorization:** Front-end prototype only. Do not connect Cloudflare, deploy, replace production, add paid services, or implement financial integrations without explicit approval.

## 1. Product identity

LegitLoot is an independent gaming and rewards platform. The public experience is games-first, with earning opportunities and an affiliate marketplace as supporting destinations.

**Tagline:** Play outside the system.  
**Personality:** Independent, unconventional, underground, technologically capable, transparent.

## 2. Visual direction

- Minimal industrial cyberpunk; not 1980s retro synthwave.
- Void black and graphite surfaces.
- Electric violet as the primary accent.
- Acid lime for key actions and highlights.
- Punk magenta for limited emphasis.
- Condensed industrial headlines, readable sans-serif body text, monospaced technical labels.
- Subtle textures and restrained effects; avoid excessive glow, animation, and clutter.
- Mobile-first responsive layouts.

## 3. Recurring character

LegitLoot includes an original recurring adult female punk/cyberpunk character as supporting brand artwork.

**Initial concept:** magenta/pink hair, tattoos, piercings, alternative streetwear, confident rebellious presence, industrial cyberpunk styling.

**Role:** recurring visual character in selected promotional artwork, game announcements, loading screens, seasonal campaigns, achievements, and community communications.

**Brand relationship:** the character is not the company logo and must not become the sole identity of LegitLoot. Use selectively; do not place her on every page or make financial interfaces depend on character art.

**Consistency:** preserve recognizable facial features, hairstyle, tattoo placement, piercings, silhouette, and overall palette across future illustrations. Clothing, poses, and expressions may vary. Character name and final reference sheet remain undecided.

The current `assets/mascot.svg` is a provisional stylized vector concept, not the final approved character sheet.

## 4. Public site structure

- Home: featured games first, then earning network and marketplace.
- Games: original game catalog and individual game destinations.
- Earn: third-party offerwalls and approved opportunities, with provider conditions and reward states clearly disclosed.
- Marketplace: affiliate products, deals, and promotions with clear affiliate disclosures.
- Account: future authenticated player environment.

## 5. Player account and wallet principles

Future account design must distinguish:
- Non-transferable game credits, with no cash value or withdrawal.
- Cash rewards, separated into pending, available, withdrawal-reserved, and paid states.

Pending or unsettled provider receivables must never be presented as withdrawable cash. The prototype does not implement authentication, balances, payments, withdrawals, or reward issuance.

## 6. Existing business preservation

Before migration, inventory existing affiliate relationships and pages, review Rewards/Sweeps/Trading/Banking categories individually, preserve useful referral assets, and investigate existing page-loading errors. Do not assume every old category is approved for the new marketplace.

## 7. Current prototype limitations

The current site is a static front-end concept. It does not:
- Authenticate users.
- Process or track actual payments.
- Connect offerwall or affiliate providers.
- Issue game credits or cash rewards.
- Provide live player balances or withdrawals.
- Guarantee earnings or provider availability.

All status labels and interface examples are illustrative.

## 8. Deployment and approval gates

1. Review the prototype on mobile.
2. Test navigation, accessibility, and responsive layouts.
3. Inventory the existing production site and affiliate assets.
4. Confirm hosting/build configuration.
5. Obtain explicit approval before connecting Cloudflare Pages or deploying.
6. Obtain separate explicit approval before replacing the production domain.

No production deployment is authorized by this document.


## 9. Official game artwork supplied by owner

The owner supplied artwork for the three featured games. The FRESH panel in the combined reference image is excluded. Preserve the Demonanic panel and Gauntlet's Survival panel as separate image assets, and use the separate Harvest//Zero image. The catalog references these files:

- `assets/demonanic.jpg`
- `assets/gauntlets-survival.jpg`
- `assets/harvest-zero.jpg`

Game display names: Demonanic, Gauntlet's Survival, and Harvest//Zero. Do not substitute generic placeholder game artwork once these supplied files are uploaded.

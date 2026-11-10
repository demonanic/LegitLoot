# LegitLoot

Independent games and rewards platform.

## Active build

- **Codex operating law:** [CODEX_EXECUTION_CONSTITUTION.md](docs/CODEX_EXECUTION_CONSTITUTION.md) — mandatory project vision, scope controls, workflow, acceptance criteria and handoff rules. Codex must read this before every work session.
- **Current creative source of truth:** [LEGITLOOT_CREATIVE_BIBLE.md](docs/LEGITLOOT_CREATIVE_BIBLE.md) — underground organization, visual identity, personality, and Skuz continuity.
- **Website creative workflow:** [WEBSITE_CREATIVE_WORKFLOW.md](docs/WEBSITE_CREATIVE_WORKFLOW.md) — visual blueprint, homepage-first production gates, art briefs, page design rules and acceptance criteria.

- Build branch: `build/legitloot-neon-synthwave`
- Governing business specification: [LegitLoot Master Business Model v1.3](docs/PLATFORM_BUILD_SPEC.md)
- Approved brand direction: **LegitLoot — an underground organization operating a chaotic digital arcade**. See the Creative Bible and [Brand Art Direction](docs/BRAND_ART_DIRECTION.md).
- Website framework: Home, Games, Earn, Deals/Marketplace, Rewards, Wallet/Account, How It Works, Terms, Privacy, and a custom 404 page. Shared portal navigation and mobile menu are used across the secondary pages.
- Homepage strategy: mobile-first games-first arcade entrance with a strong original character/art focal point, verified game art, and transparent opportunity/status panels. All unavailable systems must be labeled planned, preview or inactive; never show invented balances or activity.
- Initial games: Demonanic, Gauntlet's Survival, Harvest//Zero.
- Brand character and spokesperson: Skuz. Use the supplied reference and the approved reference sheet/expression library to preserve his appearance. Do not make him a generic advertising mascot or force catchphrases.

## Financial integrity rules

- Game credits and cash rewards are separate currencies and separate ledgers.
- Game credits are non-transferable, have no cash value, and cannot be withdrawn or converted.
- Cash is tracked in pending, available, withdrawal-reserved, and paid states.
- Unsettled provider receivables cannot fund cash withdrawals.
- All financial events are server-authoritative, idempotent, auditable, and reconciled.
- No live reward issuance or payout until provider approval, legal review, reserves, and test gates are complete.

## Current repository status

The active build remains a static HTML/CSS/JavaScript website framework. Public navigation and informational pages are being completed on the isolated branch. Existing Supabase sign-in/sign-up UI is present, but a production-ready rewards backend, wallet ledger, provider integrations, payout controls, legal review and launch operations are not yet implemented or verified. The site must not be described as a live earning or payout platform.

This repository began as a static HTML/CSS prototype. The owner has now authorized development on an isolated build branch. The current code must not be described as a working rewards backend until authentication, database, ledger, provider callbacks, payout controls, and tests are implemented and verified.

## Production protection

- Production domain: https://legitloot.site/
- No merge to `main`.
- No production deployment or domain cutover without separate explicit approval.
- No paid service, subscription, integration, provider agreement, or account creation without separate explicit approval.
- Never reuse Demonanic production secrets, accounts, databases, or user data without approval.

See [Platform Build Specification](docs/PLATFORM_BUILD_SPEC.md) for the complete architecture, financial rules, security requirements, provider gates, and implementation sequence.

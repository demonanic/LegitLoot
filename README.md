# LegitLoot

Independent games and rewards platform.

## Active build

- Build branch: `build/legitloot-neon-synthwave`
- Governing business specification: [LegitLoot Master Business Model v1.3](docs/PLATFORM_BUILD_SPEC.md)
- Visual design: neon punk arcade / synthwave comic-book identity — midnight violet, hot magenta, electric cyan and radioactive lime, with the original badger antihero mascot.
- Homepage strategy: mobile-first arcade dashboard with games first, plus transparent opportunity, quest, event and account panels. All unavailable systems must be labeled planned, preview or inactive; never show invented balances or activity.
- Initial games: Demonanic, Gauntlet's Survival, Harvest//Zero.
- Brand mascot: charismatic comic-book badger antihero.
- Supporting character: mysterious recurring punk woman, used selectively in promotions.

## Financial integrity rules

- Game credits and cash rewards are separate currencies and separate ledgers.
- Game credits are non-transferable, have no cash value, and cannot be withdrawn or converted.
- Cash is tracked in pending, available, withdrawal-reserved, and paid states.
- Unsettled provider receivables cannot fund cash withdrawals.
- All financial events are server-authoritative, idempotent, auditable, and reconciled.
- No live reward issuance or payout until provider approval, legal review, reserves, and test gates are complete.

## Current repository status

This repository began as a static HTML/CSS prototype. The owner has now authorized development on an isolated build branch. The current code must not be described as a working rewards backend until authentication, database, ledger, provider callbacks, payout controls, and tests are implemented and verified.

## Production protection

- Production domain: https://legitloot.site/
- No merge to `main`.
- No production deployment or domain cutover without separate explicit approval.
- No paid service, subscription, integration, provider agreement, or account creation without separate explicit approval.
- Never reuse Demonanic production secrets, accounts, databases, or user data without approval.

See [Platform Build Specification](docs/PLATFORM_BUILD_SPEC.md) for the complete architecture, financial rules, security requirements, provider gates, and implementation sequence.

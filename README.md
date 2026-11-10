# LegitLoot

Independent games and rewards platform.

## Active build

- **Codex operating law:** [CODEX_EXECUTION_CONSTITUTION.md](docs/CODEX_EXECUTION_CONSTITUTION.md) — mandatory project vision, scope controls, workflow, acceptance criteria and handoff rules. Codex must read this before every work session.
- **Website creative workflow:** [WEBSITE_CREATIVE_WORKFLOW.md](docs/WEBSITE_CREATIVE_WORKFLOW.md) — owner-selected comic-book chaos direction with rich detail, art production pipeline, page-by-page design rules and visual acceptance gates.

- Build branch: `build/legitloot-neon-synthwave`
- Governing business specification: [LegitLoot Master Business Model v1.3](docs/PLATFORM_BUILD_SPEC.md)
- Approved brand direction: **LegitLoot — The Underground Arcade**. Hybrid punk outlaw + underground hacker + arcade boss personality; mixed raw comic-book, cinematic illustration and distressed punk-print treatment. See [Brand Art Direction](docs/BRAND_ART_DIRECTION.md).
- Website framework: Home, Games, Earn, Deals/Marketplace, Rewards, Wallet/Account, How It Works, Terms, Privacy, and a custom 404 page. Shared portal navigation and mobile menu are used across the secondary pages.
- Homepage strategy: mobile-first arcade dashboard with games first, plus transparent opportunity, quest, event and account panels. All unavailable systems must be labeled planned, preview or inactive; never show invented balances or activity.
- Initial games: Demonanic, Gauntlet's Survival, Harvest//Zero.
- Brand mascot: LootBadger's current concept is sufficient for the website framework; do not expand mascot lore or character-sheet work. Use only as much mascot art as the site needs. Supporting assets include an original crown mark, loot-crate illustration and underground arcade backdrop.
- Supporting character: mysterious recurring punk woman, used selectively in promotions.

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

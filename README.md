# LegitLoot

Independent games and rewards platform.

## Active build

- **Shared execution control and current milestone:** [MASTER_EXECUTION_CONTROL.md](docs/MASTER_EXECUTION_CONTROL.md) — mandatory for Claude and ChatGPT; defines launch priority, active task, autonomous coordination, critical escalation boundaries, and the shared agent log.
- **Claude entrypoint:** [CLAUDE.md](CLAUDE.md).
- **Codex/agent operating law:** [CODEX_EXECUTION_CONSTITUTION.md](docs/CODEX_EXECUTION_CONSTITUTION.md) — mandatory project vision, scope controls, workflow, acceptance criteria and handoff rules.
- **Current creative source of truth:** [LEGITLOOT_CREATIVE_BIBLE.md](docs/LEGITLOOT_CREATIVE_BIBLE.md) — underground organization, visual identity, personality, and Skuz continuity.
- **Website creative workflow:** [WEBSITE_CREATIVE_WORKFLOW.md](docs/WEBSITE_CREATIVE_WORKFLOW.md) — visual blueprint, homepage-first production gates, art briefs, page design rules and acceptance criteria.

- Build branch: `build/legitloot-neon-synthwave`
- Governing business specification: [LegitLoot Master Business Model v1.3](docs/PLATFORM_BUILD_SPEC.md)
- Approved brand direction: **LegitLoot — an underground organization operating a chaotic digital arcade**. See the Creative Bible and [Brand Art Direction](docs/BRAND_ART_DIRECTION.md).
- Website framework: Home, Games, Hustle, Deals/Marketplace, Rewards, Wallet/Account, How It Works, Terms, Privacy, and a custom 404 page. Shared portal navigation and mobile menu are used across the secondary pages.
- Homepage strategy: mobile-first games-first arcade entrance with a strong original character/art focal point, verified game art, and transparent opportunity/status panels. All unavailable systems must be labeled planned, preview or inactive; never show invented balances or activity.
- Games: the owner-selected launch titles are **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**. Zombies vs Heavy Metal is live on production as early access with device-local saves. Rocket 2 Nowhere is packaged at games/rocket-2-nowhere/index.html in PR #22/#23 and is preview-only. Neither is connected to the shared account/session, cloud saves or authoritative LC wallet yet. Zombie Invasion Defense is not a substitute. Demonanic, Gauntlet's Survival and Harvest//Zero remain outside the portal (spec §0.4).
- Environment map (what runs where): [ENVIRONMENT_SOURCE_OF_TRUTH.md](docs/ENVIRONMENT_SOURCE_OF_TRUTH.md).
- Brand character and spokesperson: Skuz. Use the supplied reference and the approved reference sheet/expression library to preserve his appearance. Do not make him a generic advertising mascot or force catchphrases.

## Financial integrity rules

- **Legit Coins (LC)** are the only player reward unit (owner-locked 2026-11-19; spec §0.1). LC come only from server-verified in-game milestones, weekly challenges and seasonal events. No provider/offerwall callback may mint LC. The website wallet is authoritative; games never mint LC.
- LC are non-transferable, have no cash value, cannot be withdrawn, converted or used in payout requests. At least five launch challenges/milestones are authorized. Use only existing owner-approved LC values; never invent award amounts. Any challenge without a verified approved value remains disabled/pending. Redemption/spending uses, caps, expiry, transfers and cash equivalence remain unapproved.
- Cash rewards are deferred and excluded from the launch scope. No cash wallet, withdrawals, transfers, USD peg or provider-offerwall-to-LC issuance is permitted under the current owner-locked model.
- All financial events are server-authoritative, idempotent, auditable, and reconciled.
- No production LC issuance until game-event verification, anti-abuse, idempotency and owner-approved award values are proven. No cash payout product is in the initial launch scope.

## Current repository status

Production main is bcc19d; the authorized integration branch is a345aa3. Production Offerwall.GG wall-url v2 and postback v4 are inert HTTP 410, and the checked callback EXECUTE grants are revoked, but main's wall-url source remains active. Staging wall-url v5 remains active/JWT with production-origin CORS; staging postback v8 is record-only but has unsigned reconciliation metadata. Keep Offerwall.GG disabled. The owner-selected initial Hustle publisher is Taplayad App 10066, but it is not integrated pending written permission and a complete technical contract. The production wallet API still returns cash USD buckets; Terms/Privacy, account deletion, signup pause, shared game/account/save integration and verified LC-event ingestion remain incomplete or unverified. The site must not be described as a live earning or payout platform.

This repository began as a static HTML/CSS prototype. The owner has now authorized development on an isolated build branch. The current code must not be described as a working rewards backend until authentication, database, ledger, provider callbacks, payout controls, and tests are implemented and verified.

## Production protection

- Production domain: https://legitloot.site/
- No merge to `main`.
- No production deployment or domain cutover without separate explicit approval.
- No paid service, subscription, integration, provider agreement, or account creation without separate explicit approval.
- Never reuse Demonanic production secrets, accounts, databases, or user data without approval.

See [Platform Build Specification](docs/PLATFORM_BUILD_SPEC.md) for the complete architecture, financial rules, security requirements, provider gates, and implementation sequence.

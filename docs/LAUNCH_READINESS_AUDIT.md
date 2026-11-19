# LegitLoot — Launch Readiness Audit

**Original milestone:** M1 — Launch Readiness Baseline and Blocker Plan  
**Current milestone:** M2 — Launch Blocker Closure and Basic-Operable Release
**Original task:** M1-T1 — Repository, environment, and launch-surface inventory
**Author:** Claude (task owner) · **Reviewer:** ChatGPT
**Date:** 2026-11-19
**Original audited branch:** `build/legitloot-neon-synthwave` @ `5045cf111bb588188e0dfc937058992802cdb4ef` (historical M1 baseline)
**Mode:** Original M1 audit was read-only. Current M2 status and later read-only checks are appended below. No production or staging deployment, schema/data/setting/secret change, callback, or financial action is authorized by this audit record.

**Current-state note:** This document began as the M1 baseline audit. Use the latest dated M2 sections (especially §19) together with the current Master Control and Environment Source of Truth for present status; the original audited branch and earlier status tables are historical.

---

## 0. How to read this audit

- **VERIFIED** = observed directly (source read, command run, HTTP response, or rendered page) and the evidence is cited.
- **NOT VERIFIED** = plausible from source but behavior was not exercised. Treat as unknown.
- **FAIL** = observed and wrong against the governing spec, an owner decision, or truthful-status rules.
- **DEFERRED** = intentionally out of scope for now under an existing decision.
- Evidence sources used:
  - **SRC** — repository source on the audited branch.
  - **MAIN** — `origin/main` @ `3fa7ca5` (merged 2026-11-12, PR #10 `release/public-pages`).
  - **LIVE** — `https://legitloot.site/` fetched with `curl -L` on 2026-11-19.
  - **PREV** — branch preview `https://build-legitloot-neon-synthwa.legitloot.pages.dev/` fetched the same way.
  - **STG** — staging Supabase `scmnxcsggquwtuyyjnnj`, probed **only** with anonymous read-only requests using the publishable key already committed in `supabase-config.js` (`GET /auth/v1/settings`, `OPTIONS /functions/v1/*`, anonymous `GET`/`rpc` calls expected to be denied, and one parameterless `GET` to the postback endpoint, which validates input and returns before any write).
  - **PROD-AUTH** — production Supabase `gkbqderyjcuxnjbsiffb`, `GET /auth/v1/settings` only (public endpoint, publishable key already shipped in MAIN `account-auth.js`).
- **Not available to this audit:** direct SQL/dashboard access to staging or production Supabase (the connected Supabase tooling lists only an unrelated project, `gauntlet`), provider dashboards, Cloudflare dashboard, the `demonanic/Legitloot-2` game repository. All database-state claims below are therefore **source-level**, not deployed-state, unless marked STG.
- Owner decisions referenced as **"owner decision (chat, Nov 2026)"** were given by the owner in conversation but are **not yet recorded in this repository**. ChatGPT/owner should confirm and record them (see CONFLICT section).

---

## 1. Repository and environment state

| Item | Observation | Evidence |
|---|---|---|
| Branch / HEAD | `build/legitloot-neon-synthwave` @ `5045cf1` "docs: add direct Claude handoff…" (2026-11-19) | `git rev-parse HEAD`, `git status` → clean |
| Uncommitted / unreviewed work | None in working tree. Last 8 commits are documentation commits by the owner/ChatGPT. | `git log --oneline -15` |
| Divergence from `main` | Merge-base `caf65c4`. **226 commits on branch not in main; 9 commits on main not in branch** (incl. PR #7, #8, #10). | `git rev-list --count origin/main..HEAD`, `git log HEAD..origin/main` |
| Files on MAIN missing from branch | `earn-hub.js`, `earn-providers.js`, `site-nav.js`, `tests/earn-registry.test.mjs`, `tests/earn-hub.browser.py`, `tests/home.browser.py` | `git ls-tree origin/main` |
| Files on branch missing from MAIN | `admin.html`, `admin.js`, `payout-simulator.*`, `offerwall-launch.js`, `supabase-config.js`, `supabase/functions/{admin-dashboard,payout-simulator}`, 9 extra migrations | same |
| Other remote branches | `build/legitloot-platform-foundation` (11-08), `build/legitloot-v2` (11-07), `design/industrial-cyberpunk-rebuild` (11-07), `design/neon-comic-arcade` (11-12), `feature/lootcoins-offerwall-standard` (11-08), `fix/*` (merged), `release/main-current-site`, `release/public-pages` (merged) | `git branch -r` + `git log -1` |
| Preview deployment | PREV HTML for all 11 checked routes is **byte-identical** to branch HEAD. Pipeline branch → preview works. | `cmp` of `curl -L` output vs repo files |
| Production deployment | LIVE HTML equals MAIN except Cloudflare email-obfuscation rewrites of `mailto:` links. | `diff` MAIN vs LIVE |
| Build tooling | No `package.json`, bundler, or CI test job. Static HTML/CSS/JS served by Cloudflare Pages. Only workflow: `.github/workflows/extract-game-artwork.yml`. | `ls`, `find .github` |
| Client backend config (branch) | `supabase-config.js` → staging `scmnxcsggquwtuyyjnnj`, `environment: "staging"`, publishable key only. | SRC |
| Client backend config (MAIN/LIVE) | `account-auth.js` hard-codes **production** `gkbqderyjcuxnjbsiffb` + publishable key. | MAIN `account-auth.js:2-4` |
| Legacy admin API | `score.legitloot.site/api/links` → HTTP 530 (Cloudflare tunnel origin down). Not referenced by any current page. | `curl` |

---

## 2. Public route inventory

Source = branch. "Live" column = what production currently serves (MAIN). Pages are served at clean URLs (Pages 308-redirects `x.html` → `/x`).

| Route | Branch purpose / state | Interactive elements | Live (MAIN) | Key issues |
|---|---|---|---|---|
| `/` index | Arcade homepage; Skuz hero; 3 game cards (Demonanic "In development", Gauntlet's Survival "Planned", Harvest//Zero "Planned"); Offerwall.GG "Disabled"; LC game-only panel | Nav, CTA links only | Different homepage featuring **Zombie Invasion Defense** | GAME-01, BRAND-01 |
| `/games` | 3 legacy titles with filter chips; **no launch links** | `portal.js` filters | ZID "In development · nothing to play yet" + "slot open" | GAME-01, GAME-02 |
| `/earn` | Offerwall.GG candidate + 2 future categories; offerwall button wired to `offerwall-gg-wall-url` | `offerwall-launch.js` | Provider registry (`earn-providers.js`): Offerwall.GG `pending_approval`, CPAGrip `testing`, Surveys/Direct `unavailable` | PROV-05, REPO-01 |
| `/marketplace` | 4 categories, all "Curation pending"; affiliate note | Filter chips | Same concept | PROV-06 |
| `/rewards` | Describes game credits **and USD cash reward states** (pending/available/reserved/paid) as "intended system design" | Link to account | Similar | WALLET-01, LEGAL-04 |
| `/account` | Sign in / sign up / reset / recovery; post-login **game wallet + 4 USD cash fields**; conditional "Employee access" link | `account-auth.js` (staging) | Same UI wired to **production** auth | AUTH-02, WALLET-01 |
| `/how-it-works` | Explainer + FAQ ("Can I withdraw money? No.") | — | Similar | FE-02, LEGAL-04 |
| `/trust` | Near-duplicate of how-it-works | — | Similar | FE-02 |
| `/terms` | Placeholder: "Formal terms are not yet published" (`noindex`) | — | Same | LEGAL-01 |
| `/privacy` | Placeholder: "Do not submit personal information… until final Privacy Notice and Terms… published" (`noindex`) | — | Same | LEGAL-01, AUTH-02 |
| `/404` | Branded 404 | Home link | Same | — |
| `/admin` | Staff dashboard (server-role checked) | `admin.js` | **404** | ADMIN-01, ADMIN-04 |
| `/payout-simulator` | Staging-only artificial payout tool | `payout-simulator.js` | **404** | WALLET-02, ADMIN-04 |

Navigation: shared header with keyboard-operable mobile menu (`app.js`: `aria-expanded`, Escape-to-close, outside-click close). Support route: `mailto:hello@legitloot.site` only. `sitemap.xml` lists 9 routes including `/account`, `/terms`, `/privacy`; `robots.txt` allows all.

---

## 3. Frontend architecture and entry points

- Plain static pages; no framework or build. Styles: `public.css`, `public-pages.css`, `public-home.css` (public); `styles.css`, `portal.css`, `dashboard.css`, `identity.css` (legacy/internal tools).
- Scripts: `app.js` (nav + year), `portal.js` (filter chips), `account-auth.js` (Supabase auth + wallet summary), `offerwall-launch.js` (Offerwall.GG button), `admin.js`, `payout-simulator.js`, `supabase-config.js`.
- Third-party runtime: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` (floating major, no SRI); Google Fonts.
- Supabase Edge Functions in repo: `admin-dashboard`, `offerwall-gg-postback`, `offerwall-gg-wall-url`, `payout-simulator`, `wallet-summary`.
- Schema in repo: `supabase/bootstrap/initial_schema.sql` + 13 migrations. Objects (source): `public.profiles`; `private.{ledger_accounts, journal_transactions, journal_entries, provider_events, providers, offers, reward_allocations, payout_requests, platform_settings, audit_log, admin_users, offerwall_gg_conversions, offerwall_gg_callback_events, payout_simulator_*}`; immutability triggers on journal/audit/simulator-event tables; RLS enabled on all `private` tables; `private` revoked from `anon`/`authenticated`; only `get_wallet_summary()` is executable by `authenticated`.

---

## 4. Findings

Format: **ID — title** · Severity · Status · Owner approval?
Evidence → Impact → Smallest safe corrective action → Dependencies.

### 4.1 Repository / release integrity

**REPO-01 — Build branch has diverged from production and would regress it** · BLOCKER · FAIL · No
- Evidence: §1 divergence. MAIN contains the 2026-11-12 public-pages release (ZID-first homepage/games, provider registry with CPAGrip, `site-nav.js`) and 3 test files; none exist on the branch. Branch still shows the three retired games.
- Impact: Any future merge/deploy of this branch replaces live content with older, owner-superseded content and deletes the only automated tests.
- Action: In M2, merge `origin/main` into `build/legitloot-neon-synthwave` (branch-only, reversible), resolve conflicts in favor of MAIN for games/earn/home content, keep branch-only backend tooling, re-run tests.
- Dependencies: CONFLICT-01 (which games), BRAND decisions.

**REPO-02 — Preview pipeline works** · LOW · VERIFIED · No
- Evidence: PREV byte-identical to HEAD for 11 routes. Resolves the earlier "changes never showed on preview" concern for this branch.

**REPO-03 — Deployed backend code is not fully version-controlled** · HIGH · FAIL · No
- Evidence: STG `OPTIONS /functions/v1/cpagrip-attribution` → 200 (deployed), but no `cpagrip*` source exists on the branch or MAIN. STG `wallet-summary` → 404 (in repo, not deployed). MAIN and branch carry different migration filenames for the same Offerwall.GG pipeline (`20261108130000_*` on MAIN vs `20261109130000_*` on branch).
- Impact: Cannot review, reproduce or roll back the CPAGrip path; repo does not describe either database.
- Action: Export deployed function sources and `supabase_migrations` history from staging and production into the repo (read-only pull), then reconcile.
- Dependencies: OPS-02 (backend access).

### 4.2 Authentication and account

**AUTH-01 — Email/password account flows are implemented** · MEDIUM · NOT VERIFIED · No
- Evidence: `account-auth.js` — `signInWithPassword`, `signUp` (with `emailRedirectTo` `/account.html`), `resetPasswordForEmail`, `PASSWORD_RECOVERY` → `updateUser`, `signOut`, `getSession` persistence. STG settings: email provider on, `disable_signup:false`, `mailer_autoconfirm:false`; all OAuth providers off. Headless render of PREV `/account` shows the sign-in form and status panel.
- Impact: Core flows exist but none was exercised end-to-end (creating a test account would write data; deferred to M1-T2 with an agreed staging test account).
- Action: Staging E2E test of register → confirm email → login → refresh persistence → logout → reset → recover; verify SMTP sender, redirect allow-list, rate limits.
- Dependencies: OPS-02, agreed staging test mailbox.

**AUTH-02 — Production site is collecting real accounts while its own Privacy page says not to** · BLOCKER · FAIL · **Yes (production config)**
- Evidence: LIVE `/account` loads `account-auth.js?v=walletfix-2`, which on MAIN targets production `gkbqderyjcuxnjbsiffb`. PROD-AUTH: `disable_signup:false`, email enabled. LIVE `/privacy`: "Do not submit personal information through this development preview until the final Privacy Notice and Terms of Service have been published." LIVE `/terms`: not published. Signup form states "By creating an account, you agree to the Terms and Privacy Policy."
- Impact: Real personal data (emails) is being collected under no published privacy notice or terms, with no deletion path; consent text references documents that do not exist. Legal and trust exposure today, independent of launch.
- Action (smallest): Owner chooses one: (a) disable public sign-up on the production Supabase project until LEGAL-01 and AUTH-03 are done (existing users can still sign in), or (b) hide the account entry point on the live site via a reviewed main release. Recommended: (a) — one dashboard toggle, fully reversible, no deploy.
- Dependencies: none. **Critical escalation E1.**

**AUTH-03 — No account deletion or data export path** · BLOCKER · FAIL · No (implementation) / Yes (policy wording)
- Evidence: No deletion/export UI, function or table in SRC or MAIN (`grep -i delet` → none). Spec §2C lists `deletion_requests`; §2B requires export/deletion.
- Impact: Master Control §3 item 3 requires a defined deletion process before collecting accounts.
- Action: Minimum viable: documented support-email deletion procedure + server-side deletion function (staging first), then a self-serve request button.
- Dependencies: LEGAL-01 (privacy notice must describe it).

**AUTH-04 — Account security controls unverified** · MEDIUM · NOT VERIFIED · No
- Evidence: No session/device management UI; no CAPTCHA/bot protection in client; Supabase rate-limit and leaked-password settings not inspectable.
- Action: Read auth config in M1-T2; enable CAPTCHA/rate limits in staging.

**AUTH-05 — Consent text references unpublished documents** · HIGH · FAIL · Yes (legal wording)
- Evidence: `account.html` sign-up copy vs `terms.html`/`privacy.html` placeholders.
- Action: Resolved by LEGAL-01; until then, AUTH-02 action.

### 4.3 Wallet and reward architecture (mapped, not changed)

**WALLET-01 — Account and Rewards pages present a USD cash wallet** · HIGH · FAIL · No
- Evidence: `account.html` "One player account. Two separate wallets." + CASH WALLET / PENDING CASH / WITHDRAWAL RESERVED / PAID; `account-auth.js` `loadWalletSummary()` renders `data.cash.*Cents`. LIVE `/account` also shows "CASH WALLET" and "WITHDRAWAL RESERVED". `rewards.html` documents cash states. Spec §2/§2A (owner-locked 2026-11-10): "There is no active player cash balance in the current phase."
- Impact: Implies a cash product exists; contradicts truthful-status rules; misleading on production today.
- Action: Remove cash fields/copy from player UI (branch), keep server structures dormant. Live fix rides the next reviewed main release.
- Dependencies: REPO-01, POLICY-01 (final LC naming).

**WALLET-02 — Deferred cash/payout structures exist in schema and tooling** · MEDIUM · DEFERRED · No
- Evidence: `private.wallet_kind ('cash_usd','game_credits')`, `cash_reward_status`, `payout_requests`, `payout_status`, payout-simulator tables/functions (service_role only, owner-target asserted), admin "Withdrawal queue".
- Impact: Acceptable as dormant architecture per spec §13; must not be exposed to players or deployed with production player access.
- Action: Keep; ensure `payout-simulator` function/page are excluded from any production deploy (see ADMIN-04).

**WALLET-03 — Ledger design is append-only in source** · MEDIUM · VERIFIED (source) / NOT VERIFIED (DB)
- Evidence: `journal_entries_immutable`, `journal_transactions_immutable`, `audit_log_immutable` triggers → `private.reject_ledger_mutation`; `private.post_journal_transaction` is service_role-only. STG anonymous `rpc/get_wallet_summary` → 401 permission denied; `Accept-Profile: private` → PGRST106 schema not exposed; anonymous `profiles` → 401.
- Action: Confirm triggers/policies exist in the deployed DBs (M1-T2).

**WALLET-04 — LC unit/label inconsistency** · LOW · FAIL · No
- Evidence: `account-auth.js` renders `" LLC"`; site copy uses "LC"/"LootCoins"; LC stored as 1/10,000 atoms (`currency_scale` 10000) while spec §2C says "LC uses integer units".
- Action: Align label; record the 4-decimal precision decision in the spec (owned by LC Economy specialist).

**WALLET-05 — `wallet-summary` Edge Function is dead code** · LOW · VERIFIED · No
- Evidence: Repo has it; STG returns 404; client uses RPC `get_wallet_summary` instead.
- Action: Remove or deploy deliberately after REPO-03 reconciliation.

### 4.4 Providers

Status matrix (separate facts, per Master Control §2 step 6):

| Provider | Publisher/account approval | Placement approval | Technical integration | Test verification | Production activation |
|---|---|---|---|---|---|
| Offerwall.GG | Pending (site copy + MAIN registry `pending_approval`; no dashboard evidence seen) | NOT VERIFIED | Implemented in SRC: signed wall URL, HMAC-SHA256 postback, idempotency, reversal handling | NOT VERIFIED (no test conversion evidence) | Not active (button returns "not available yet" on failure; MAIN registry blocks opening) |
| CPAGrip | Publisher account exists (spec §2D) — incentive/LC-model permission NOT VERIFIED | NOT VERIFIED | `cpagrip-attribution` deployed on STG; **source not in repo**; callback receiver unknown | NOT VERIFIED | Not active (MAIN registry `testing`, cannot open) |
| Surveys / direct offers / rewarded ads / referrals | None | — | None | — | Not active |
| Affiliates (marketplace) | Legacy links existed on old admin API (now offline) | — | None on current site | — | Not active ("curation pending") |

**PROV-01 — Offerwall.GG postback is armed on staging** · MEDIUM · VERIFIED · No
- Evidence: STG parameterless `GET /functions/v1/offerwall-gg-postback` → `400 INVALID CALLBACK`. The function returns `503 SERVICE NOT CONFIGURED` when `OFFERWALL_GG_SECRET`/service key are missing, so the secret is configured on staging.
- Impact: Signed callbacks would post LC on staging now. Acceptable for staging tests, but see PROV-02.

**PROV-02 — Reward-posting switch is stored but never enforced** · HIGH · FAIL · No (fix strengthens security)
- Evidence: Migration `20261109130000_offerwall_gg_callback_pipeline.sql` inserts `platform_settings('offerwall_gg_postback', …, is_enabled=false)`, but `private.process_offerwall_gg_postback` never reads `platform_settings`; it posts via `private.post_journal_transaction` whenever the signature is valid. Spec §2D: "reward-posting switch… Unknown states default to disabled."
- Impact: The only thing preventing LC issuance in any environment is whether the secret is set. Deploying this to production with a secret configured would issue live LC regardless of the switch.
- Action: Make the RPC record-but-not-post (status `received`/held) unless `is_enabled = true`; add a test. Staging-first.

**PROV-03 — `test=1` callbacks are acknowledged before signature check** · LOW · VERIFIED · No
- Evidence: `offerwall-gg-postback/index.ts` returns `OK` for `test=1` before validation. No write occurs, so impact is limited to false "OK" acknowledgements.
- Action: Document; optionally log test pings.

**PROV-04 — CPAGrip path is unreviewable** · HIGH · FAIL · No
- Evidence: REPO-03. Spec §2D lists outstanding: callback auth, macro mapping, duplicate/replay, reversals, reconciliation.
- Action: Pull deployed source into repo; then audit against current CPAGrip documentation (M1-T2).

**PROV-05 — Branch Earn copy contradicts the LC-only model** · MEDIUM · FAIL · No
- Evidence: `earn.html`: "approval for the proposed dual-wallet reward model"; "Pending provider receivables are not withdrawable cash." Branch Earn lacks CPAGrip (MAIN has it).
- Action: Adopt MAIN's registry-driven Earn page during REPO-01 merge.

**PROV-06 — Marketplace has no content; legacy affiliate system offline** · LOW · VERIFIED · Yes (if reintroducing affiliates)
- Evidence: all marketplace categories "CURATION PENDING"; `score.legitloot.site/api/links` → 530.
- Action: Exclude marketplace from the first launch or keep as "coming later"; decide separately whether legacy affiliate links return (requires disclosure page, LEGAL-02).

### 4.5 Games

**GAME-01 — Branch and spec list games the owner has retired** · BLOCKER (for branch release) · FAIL · No (decision already made) — record it
- Evidence: Branch `index.html`/`games.html` and spec §1/§2A/§6 + README + `WEBSITE_CREATIVE_WORKFLOW.md:76` name Demonanic, Gauntlet's Survival, Harvest//Zero. Owner decision (chat, Nov 2026): LegitLoot becomes a new-games platform; those three are excluded; Reference Game 01 is "Zombie Invasion Defense". MAIN/LIVE already reflect this (`design/neon-comic-arcade` 11-12 "Remove the three older games").
- Action: Update spec §1/§2A/§6, README and workflow docs to the current lineup (doc-only, agent-authorized); take MAIN's games content in REPO-01.

**GAME-02 — No playable game is linked anywhere** · BLOCKER (for "live gaming destination" claim) · VERIFIED · Yes (launch-scope choice)
- Evidence: No game launch `href` on branch or LIVE `/games`; LIVE ZID card: "there is nothing to play yet". ZID code lives in `demonanic/Legitloot-2` (not inspected).
- Impact: Under Master Control §3 item 7, first release must be labelled early-access/portal, not a live gaming destination.
- Action: Either launch as early-access portal (truthful labels already exist on MAIN) or gate launch on a ZID web build. Inspect Legitloot-2 in M1-T2.

**GAME-03 — No game registry, account-link, save, or LC-milestone interface exists** · HIGH · VERIFIED (absence) · No
- Evidence: No `games`, `linked_game_accounts`, `missions`, `reward_claims` objects in SRC schema; no game API functions.
- Impact: Owner's planned "games award LC for milestones, credited to website wallet" (POLICY-01) has no technical contract yet.
- Action: Define the minimal server-authoritative milestone-award contract only after POLICY-01 is settled; not needed for an early-access portal launch.

### 4.6 Admin and operations

**ADMIN-01 — Admin dashboard authorizes server-side** · MEDIUM · VERIFIED (source) / NOT VERIFIED (behavior)
- Evidence: `admin-dashboard/index.ts` verifies JWT, then calls `admin_dashboard_payload` (service_role-only) which checks `private.admin_users` roles `owner|payout_reviewer|support_readonly`; account listing restricted to `owner`. Profile view is read-only. STG `OPTIONS admin-dashboard` → 200.
- Action: Exercise with a non-admin and an admin staging account in M1-T2.

**ADMIN-02 — Admin function CORS is `*`** · LOW · VERIFIED · No
- Evidence: `admin-dashboard/index.ts` `Access-Control-Allow-Origin: *` (wall-url function, by contrast, pins origins). Bearer token still required.
- Action: Pin to site/preview origins.

**ADMIN-03 — Operational admin capabilities missing for an earning launch** · MEDIUM · VERIFIED (absence) · No
- Evidence: Admin sections are overview/accounts/withdrawal queue/audit only. No provider status/switches, provider-event inbox, ledger explorer, or reconciliation (spec §8).
- Action: Needed only before the first earning path goes live; minimum = provider event inbox + posting switch view.

**ADMIN-04 — Internal tools are publicly served on preview without `noindex`** · MEDIUM · VERIFIED · No
- Evidence: PREV `/admin` and `/payout-simulator` → 200; neither has `noindex`; `account.html` links `admin.html`. LIVE returns 404 for both (not on MAIN).
- Action: Add `noindex`, and define a release manifest that excludes internal tools from production deploys.

**OPS-01 — No monitoring, error reporting, backup/restore or rollback plan** · HIGH · VERIFIED (absence) · Yes (if paid tooling)
- Evidence: No such docs/config in repo. Master Control §3 item 11.
- Action: Write a one-page runbook: Pages rollback (redeploy previous deployment), Supabase backup tier/PITR status, function log checks, incident contact. Free tooling first.

**OPS-02 — This audit cannot read staging/production databases directly** · HIGH · NOT VERIFIED · Yes (grant access)
- Evidence: Connected Supabase tooling lists only project `gauntlet` (`xtgpznknlaihmfohdmqs`); LegitLoot projects are in a different org/account.
- Impact: Schema/RLS/advisor/migration state of the deployed DBs is unverified; REPO-03 cannot be closed.
- Action: Owner connects the Supabase connector to the account/org that owns `scmnxcsggquwtuyyjnnj` and `gkbqderyjcuxnjbsiffb` (read-only use), or ChatGPT/owner runs a supplied read-only query pack and commits results.

### 4.7 Legal, trust and support

**LEGAL-01 — Terms of Service and Privacy Notice are unpublished** · BLOCKER · FAIL · **Yes**
- Evidence: `terms.html`, `privacy.html` placeholders (SRC, LIVE).
- Action: Draft both (accounts, LC no-cash-value, provider terms, data categories/processors incl. Supabase & Cloudflare, retention, deletion, contact, age/eligibility) for owner/legal approval.
- Dependencies: POLICY-01, AUTH-03, LEGAL-03.

**LEGAL-02 — No Affiliate Disclosure or Support/Contact page** · MEDIUM · FAIL · No
- Evidence: Spec §2B requires both; only `mailto:` exists.
- Action: Add a support page (mailto + what to include, missing-reward path later); disclosure page only if marketplace/affiliates launch.

**LEGAL-03 — Age and geographic eligibility undefined** · HIGH · NOT VERIFIED · **Yes**
- Evidence: No eligibility copy or checks; spec §5 forbids inventing a threshold.
- Action: Owner/legal decision before any reward feature; not required for an account-less early-access portal.

**LEGAL-04 — Explainer pages describe cash-reward lifecycle** · MEDIUM · FAIL · No
- Evidence: `rewards.html`, `how-it-works.html`, `trust.html` (pending/available/reserved/paid; "Cash rewards use a separate ledger").
- Action: Reword to "cash rewards are not offered"; keep LC explanation.

**LEGAL-05 — Sitemap lists `noindex` pages** · LOW · VERIFIED · No
- Evidence: `sitemap.xml` includes `/terms`, `/privacy`, which carry `noindex`.

### 4.8 Frontend quality

**FE-01 — Unpinned third-party script without SRI** · MEDIUM · VERIFIED · No
- Evidence: `supabase-js@2` from jsDelivr on account/earn/admin pages.
- Action: Pin exact version (+ SRI) or self-host.

**FE-02 — Duplicate explainer routes** · LOW · VERIFIED · No
- Evidence: `trust.html` and `how-it-works.html` carry near-identical FAQ content.

**FE-03 — Rendered QA not performed** · MEDIUM · NOT VERIFIED · No
- Evidence: Only a smoke render: headless Chrome (390×844) of PREV `/`, `/account`, `/games` rendered without layout breakage; account status panel populated by JS. No desktop, keyboard, contrast, or cross-browser pass. This is **not** browser QA.
- Action: Full rendered pass after REPO-01 merge (Chrome is available in this environment).

**BRAND-01 — Skuz hero mohawk colour vs owner decision** · LOW · FAIL (pending confirmation) · No
- Evidence: PREV homepage hero (`assets/skuz-arcade-hero.webp`) renders a magenta/red mohawk. Owner decision (chat, Nov 2026): Skuz keeps his original grey mohawk. Not recorded in Creative Bible.
- Action: Confirm and record in the Creative Bible; queue artwork correction (not a launch blocker).

---

## 5. Conflicts between code, specifications and owner decisions

| ID | Conflict | Sources | Proposed resolution / owner |
|---|---|---|---|
| CONFLICT-01 | Game lineup: spec/README/branch = Demonanic, Gauntlet's Survival, Harvest//Zero; owner (chat, Nov 2026) + MAIN/LIVE = new games only, ZID first | Spec §1/§2A/§6, README, branch pages vs MAIN `games.html` | Owner decision already exists → agents update docs (GAME-01). No escalation needed unless ChatGPT has contrary evidence. |
| POLICY-01 | **LC policy.** Spec v1.1 (owner-locked 2026-11-10): "LootCoins", earned via providers/missions, spendable **only in games**, never on marketplace goods. Owner (chat, 2026-11-17): "Legit Coins", awarded one-time per **in-game milestone** plus seasonal/weekly challenges, **shown only in the website wallet, not inside games**, spendable on **website events, merchandise** or monetization items | Spec §2/§2A vs owner statements | **Critical escalation E2** (Master Control §6.5 — LC economics/redemption). Route to owner + LC Economy specialist. Do not implement either until resolved. |
| CONFLICT-02 | Cash wallet shown on account/rewards pages vs LC-only, cash deferred | `account.html`, `account-auth.js`, `rewards.html` vs spec §2A | Spec wins; fix UI (WALLET-01). |
| CONFLICT-03 | Privacy page says "don't submit personal information" while production signup is open | LIVE `/privacy` vs PROD-AUTH | E1 (AUTH-02). |
| CONFLICT-04 | Branch is the "authorized working branch" but MAIN is newer for public content | Master Control header vs §1 divergence | Merge main into branch (REPO-01); agent-authorized. |
| CONFLICT-05 | Spec §2C "LC integer units" vs implementation 1/10,000 atoms | Spec vs migration `…130000` | LC Economy specialist records decision (WALLET-04). |
| CONFLICT-06 | Skuz mohawk colour | Hero art vs owner decision (chat) | Record in Creative Bible (BRAND-01). |

---

## 6. Static checks run (exact commands and results)

| Command | Result |
|---|---|
| `git status`; `git rev-parse HEAD` | clean; `5045cf1…` |
| `node --check` on `account-auth.js admin.js app.js offerwall-launch.js payout-simulator.js portal.js supabase-config.js` (Node v22.23.5) | 7/7 PASS |
| Python stdlib `HTMLParser` audit of 13 HTML files: one `<main>`, one `<h1>`, duplicate IDs, missing local `href/src`, `<img>` without `alt` | PASS (0 issues) |
| `git diff --check` | PASS |
| `node --test tests/*.test.mjs` run on an `origin/main` worktree (tests do not exist on branch) | 7 tests, 7 pass, 0 fail |
| `tests/*.browser.py` (MAIN) | NOT RUN (not on branch; Playwright not installed) |
| Headless Chrome screenshot 390×844 of PREV `/`, `/account`, `/games` | Rendered; smoke only (FE-03) |
| `cmp` PREV vs branch HEAD (11 routes) | identical |
| `diff` LIVE vs MAIN | identical except Cloudflare email obfuscation |
| STG anonymous probes (see §0) | auth settings read; protected tables/RPC/schema correctly denied to `anon` |
| `package.json` / unit test runner on branch | none exist |

---

## 7. Launch-readiness summary

LegitLoot today is a well-labelled **static informational site** with a working preview pipeline, a reasonable server-authoritative ledger design in source, and an Offerwall.GG integration that is technically built but unapproved. It is **not launchable as an accounts/rewards/gaming platform**: there is no playable game, no approved earning path, no published Terms/Privacy, no account deletion, and player pages still advertise a cash wallet. Most urgently, **production is already accepting real sign-ups** under a privacy page that tells people not to — this should be closed now, independent of the launch plan. The build branch is also behind production and must be reconciled before it can ship anything.

Against Master Control §3 launch requirements: 1 public site — partial (truthful on MAIN, outdated on branch); 2 accounts — built, unverified; 3 recovery+deletion — recovery built, deletion missing; 4 profile — minimal; 5 reward architecture — designed, switch not enforced, DB unverified; 6 earning path — none approved; 7 playable game — none; 8 legal — missing; 9 admin — partial; 10 mobile/a11y — smoke only; 11 ops — missing; 12 launch checklist — not yet.

## 8. Smallest viable first-launch scope (recommendation)

**"Early-access portal" release — no accounts, no rewards.**
- Public pages from MAIN's current content: Home, Games (ZID "in development"), Earn (status registry, nothing openable), How It Works, Support, Terms (short site-use terms), Privacy (covers analytics/contact email only).
- Account entry hidden; production sign-up disabled; no wallet UI; marketplace hidden or "later".
- All cash wording removed.
- Ops runbook + rollback.

This needs no backend, provider, or financial approvals beyond Terms/Privacy text and the production release itself. Accounts and the first earning path (Offerwall.GG or CPAGrip, LC-only) become **Launch 2**, gated on AUTH-01/03/04, LEGAL-01/03, PROV-02/04, ADMIN-03, POLICY-01. A playable ZID web build is **Launch 3** (or folded into Launch 2 if ready).

## 9. Ordered blocker backlog (dependency-aware)

| # | Item | Findings | Who | Owner approval |
|---|---|---|---|---|
| 1 | Close production sign-up exposure | AUTH-02, CONFLICT-03 | Owner (dashboard toggle) | **Yes — E1** |
| 2 | Grant read-only backend access (staging + prod) | OPS-02 | Owner | Yes (access only) |
| 3 | Settle LC policy | POLICY-01 | Owner + LC specialist | **Yes — E2** |
| 4 | Record current game lineup in spec/README/docs | GAME-01, CONFLICT-01 | Agents | No |
| 5 | Merge `origin/main` into build branch; restore tests | REPO-01, PROV-05 | Claude; ChatGPT review | No |
| 6 | Remove cash wallet/cash copy from player UI | WALLET-01, LEGAL-04, WALLET-04 | Claude | No |
| 7 | Pull deployed function sources + migration history into repo | REPO-03, PROV-04, WALLET-05 | Claude (read-only) | No |
| 8 | Enforce reward-posting switch (staging) | PROV-02 | Claude; ChatGPT review | No (strengthens security) |
| 9 | Draft Terms + Privacy + Support page | LEGAL-01, LEGAL-02, AUTH-05 | ChatGPT drafts; Claude wires | **Yes — publication** |
| 10 | Ops runbook + rollback; internal-tool exclusion manifest; `noindex` | OPS-01, ADMIN-04 | Claude | No (unless paid tooling) |
| 11 | Rendered QA (desktop/mobile/keyboard/contrast) | FE-03, FE-01 | Claude | No |
| 12 | Early-access production release | §8 | Owner | **Yes — E3** |
| — | Launch 2 prerequisites: account E2E tests, deletion, eligibility, provider approval + test conversion, admin event inbox | AUTH-01/03/04, LEGAL-03, PROV-*, ADMIN-03 | Agents + owner | Mixed |

## 10. Autonomous vs owner-gated

- **Agents may do now (branch/staging, reversible):** items 4–8, 10, 11; drafting legal text for review; read-only backend inspection once access exists.
- **Owner decisions required:**
  - **E1 — Production sign-up.** Decision: disable public sign-up on production Supabase (recommended) vs hide account UI via release vs leave open. Critical because real personal data is being collected without a privacy notice. Work continuing meanwhile: everything in items 4–11.
  - **E2 — LC policy (POLICY-01).** Decision: confirm whether the 2026-11-17 "Legit Coins / milestone / website-wallet / merch" direction replaces spec §2A. Critical because it changes redemption rules and financial promises. No LC-related implementation proceeds until settled.
  - **E3 — Launch scope and production release.** Approve the early-access scope in §8 (recommended) and later the exact release commit.
  - Publication of Terms/Privacy; eligibility rules; backend access grant; any paid monitoring.

## 11. Proposed M1-T2 (for ChatGPT review)

**M1-T2 — Backend, auth, provider and game deployed-state audit (read-only).** Owner: Claude. Reviewer: ChatGPT.
1. With read-only access (OPS-02), for staging and production: `list_migrations`, tables/columns in `public`+`private`, RLS policies, function grants, triggers, security/performance advisors, Edge Function list and source (including `cpagrip-attribution`); diff against repo; record in this audit (§4.3–4.4 status upgrades).
2. Staging-only auth E2E with one agreed test mailbox (AUTH-01): register/confirm/login/persist/logout/reset/recover; record SMTP and redirect config.
3. CPAGrip: compare deployed code with current official CPAGrip docs (callback auth, macros, statuses, reversals); Offerwall.GG: confirm approval state from owner-provided dashboard evidence.
4. Inspect `demonanic/Legitloot-2` for ZID build state, web-playability, and any account/save hooks (GAME-02/03).
5. Update findings statuses; no code, schema, secret or dashboard changes.

If access in step 1 is not granted, steps 3 (doc comparison) and 4 proceed, and step 1 is marked BLOCKED.


---

## 12. ChatGPT independent review — 2026-11-19

**Review result: M1-T1 accepted with corrections and qualifications.** The audit is useful, evidence-led, and appropriately distinguishes observed behavior from unverified deployed state. No production, database, provider, or application changes are authorized by this review.

### Confirmed / accepted
- **AUTH-02 / E1:** The audit's combination of the live account page targeting the production Supabase project, the public Auth settings reporting sign-up enabled, and the live Privacy/Terms placeholders is sufficient to treat public registration as a current launch blocker. Recommendation: owner should disable production public sign-up as containment; existing sign-in should remain available. This review does not change the setting. Disabling new registrations does not itself resolve handling, retention, or deletion of data already collected.
- **REPO-01:** Independent GitHub compare confirms the branch is divergent from `main`. At the audit commit it was 226 ahead / 9 behind; after the audit commit the compare is 227 ahead / 9 behind. Do not merge or deploy until the branch is reconciled against current `main` and the release diff is reviewed.
- **WALLET-01 / LEGAL-01 / GAME-02:** Cash-wallet presentation, unpublished legal pages, and absence of a playable game support the proposed account-less early-access portal as the smallest truthful launch scope.
- **PROV-02:** The checked-in migration function does not read the `platform_settings.is_enabled` switch before posting. This is a valid source-level security defect and should be fixed staging-first before any provider reward path is enabled.

### Corrections / qualifications
- **POLICY-01 / E2 wording:** The November 17 context retrieved for review does not establish an explicit owner decision replacing the earlier LootCoins policy. It records a specialist brief/proposal for milestone and challenge awards and that LegitCoin economics belong to a separate specialist. The November 18 direction also states no cash, payouts, or cash-out claims and that game Legit Coins must not enter payout requests. Therefore, do not characterize the website-wallet / events / merchandise model as an approved replacement. Until the owner explicitly approves a replacement, retain the last owner-locked policy as the governing baseline and keep changes to coin economics/redemption paused. The ambiguity is real, but the evidence currently supports “proposal awaiting owner/specialist decision,” not “owner described and approved a new model.”
- **PROV-02 deployed status:** The missing settings check is verified in repository migration source. Because direct database/function-source access was unavailable, whether the deployed staging database runs this exact migration/function version remains NOT VERIFIED. Keep the risk high, but do not claim a confirmed live staging credit path until the deployed SQL/function version is inspected.
- **E1 containment scope:** Turning off production sign-ups is the recommended immediate containment choice, not a complete privacy remediation. Existing account data and a deletion/retention process still require separate handling.
- **M1-T2 task boundary:** The proposed staging auth end-to-end test creates an account, sends email, and writes auth data; it is not read-only. Split that into a separately authorized staging test task with an agreed test mailbox and cleanup plan. M1-T2 itself should remain read-only: inspect deployed schema, policies, grants, triggers, migration history, and deployed Edge Function source only. No test-account creation, callback invocation beyond harmless read-only probes, setting changes, or database writes.
- **OPS-02:** Do not ask for broad service-role credentials. The next access step should be a read-only Supabase connection/role limited to the LegitLoot staging and production projects, or an owner-run read-only evidence pack. Staging and production must remain clearly separated.

### M1-T1 disposition
Accepted. The audit may be used as the M1 baseline subject to the qualifications above. Claude should update E2 wording/status, mark the deployed PROV-02 state NOT VERIFIED pending direct inspection, and revise M1-T2 to exclude staging auth E2E/write operations. ChatGPT will review the revised task before any staging test is proposed.

### Owner decision still required
**E1:** Approve or decline disabling public sign-ups on the production Supabase project. No setting has been changed by ChatGPT.



## 14. Owner decision update — 2026-11-19

See `docs/MASTER_EXECUTION_CONTROL.md` §13 for the authoritative owner decisions:
- E1 registration pause approved for **production only**, with existing sign-in preserved. Execution and verification are pending Claude's dashboard access.
- E2 is now settled: Legit Coins are earned from in-game milestones, weekly challenges, and seasonal events; the website wallet is authoritative; game notifications prompt users to check it. Illustrative objectives are examples only. No LC values, redemption catalogue, cash conversion, or payout use is authorized.
- Supabase connector mapping is now confirmed: production `gkbqderyjcuxnjbsiffb` via `Supabase`; staging `scmnxcsggquwtuyyjnnj` via `Legitloot dev`. Previous OPS-02 statement that only `gauntlet` was visible is obsolete.
- A unified environment/source-of-truth inventory is the next cross-agent task. No production deploy, schema change, provider activation, or reward issuance is authorized.

---

## 15. Reconciliation update — Claude, 2026-11-19 (supersedes §4 statuses where they differ)

**Status vocabulary from here on (owner instruction 2026-11-19):** VERIFIED · DEFECT · UNVERIFIED · BLOCKED · RESOLVED. A finding is RESOLVED only when the correction is implemented *and* verified.

**Evidence basis.** Deployed inventory from ChatGPT's connectors (`docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` §2) plus Claude's anonymous read-only HTTP probes of both projects (§9 there). Claude's own Supabase connector still sees only `gauntlet`, so deployed SQL and function source were **not** exported by Claude. No setting, schema, function, callback or production resource was changed.

**Incorporating ChatGPT's §12 corrections.** (a) POLICY-01/E2: superseded by the owner's explicit 2026-11-19 decision (MASTER §13); the spec now carries it as §0.1. (b) PROV-02 deployed state: now partly evidenced — both postbacks are configured and reach validation (PROV-07) — but the deployed SQL still was not read, so the "switch not enforced" detail remains UNVERIFIED for deployed code. (c) The staging auth E2E test is split out of read-only work (task M2-T4 below, needs its own approval of a test mailbox and cleanup plan).

### 15.1 Reclassified launch-readiness findings

| Area | ID | Status | Severity | Finding / evidence | Next action | Owner? |
|---|---|---|---|---|---|---|
| Registration | AUTH-02 | **BLOCKED** | BLOCKER | Pause approved, not applied. Production `/auth/v1/settings` still `disable_signup:false` (re-probed). Claude lacks dashboard/API access; cloud browser lands on Supabase sign-in. ENV doc §10 has the 1-minute owner steps and the verification command. | Owner toggles setting; any agent verifies | **Yes** (dashboard sign-in) |
| Authentication | AUTH-01 | UNVERIFIED | MEDIUM | Flows exist in source; email-only, autoconfirm off in both projects. No E2E performed. | M2-T4 (write-capable, separately approved) | No |
| Authentication | AUTH-04 | UNVERIFIED | MEDIUM | Rate limits, CAPTCHA, leaked-password settings not readable anonymously. | ChatGPT reads Auth config via its connector if exposed | No |
| Privacy/Terms | LEGAL-01, AUTH-05 | DEFECT | BLOCKER | Placeholders only (SRC, LIVE). | ChatGPT drafts; owner approves publication | **Yes** (publication) |
| Account deletion | AUTH-03 | DEFECT | BLOCKER | No deletion/export path in any branch or deployed function list. Production holds 2 profiles. | Document an interim email-request deletion procedure; build staging deletion function | No (procedure text needs owner sign-off with LEGAL-01) |
| Wallet presentation | WALLET-01 | DEFECT | HIGH | Branch and LIVE account pages show USD cash wallet fields; branch shows "LLC"; LIVE `/earn` (MAIN `earn.html`) tells players LootCoins "are credited only by our server after a provider confirms a completion" — false under the new LC policy. | Branch UI fix after REPO-01 merge; live fix rides a reviewed release | Release only |
| LC/cash separation | WALLET-02 | VERIFIED (design) | MEDIUM | Separate `cash_usd` / `game_credits` wallet kinds; payout tooling staging-only (production has no admin/simulator functions). | Keep dormant | No |
| Reward authorization | PROV-07 (new) | **DEFECT** | HIGH | **Both production and staging `offerwall-gg-postback` have secrets configured** (empty GET → 400, not the 503 "not configured" path) and both repo versions post LC via `process_offerwall_gg_postback`. Under §0.1 no offerwall callback may mint LC. Callback/conversion row counts were 0 in both projects at inventory time, so no LC has been minted. Exploitation requires the HMAC secret. | Containment recommendation below (15.3) | **Yes** for the production change |
| Reward authorization | PROV-02 | DEFECT (source) / UNVERIFIED (deployed) | HIGH | Posting switch stored but not read in repo SQL. Superseded in practice by PROV-07: the correct fix is "provider callbacks never post LC", not "check a switch". | Rewrite postback path to record-only (staging first) | No for staging |
| Ledger integrity | WALLET-03 | VERIFIED (source) / UNVERIFIED (deployed) | MEDIUM | Immutability triggers + service-role-only posting in source; anon denied on both projects. | ChatGPT exports deployed trigger/policy list | No |
| Offerwall callback security | PROV-03 | VERIFIED | LOW | HMAC-SHA256 with constant-time compare; idempotency on `(transaction_id, status)`; `test=1` acknowledged without write. | none beyond PROV-07 | No |
| Untracked code | REPO-03, PROV-04 | DEFECT | HIGH | Staging runs `cpagrip-attribution` v4, `provision-initial-owner` v7 and migration `game_platform_foundation` with **no source on any of 11 branches**. | ChatGPT (has connector access) exports source + SQL into a `supabase/` import commit on the build branch, read-only on the project | No |
| Orphaned code | WALLET-05 | DEFECT | LOW | Production `wallet-summary` v4 deployed and auth-guarded, but the live frontend calls RPC `get_wallet_summary`, not the function. Staging lacks it. | Confirm no caller (logs), then retire via reviewed production change | Yes (prod change) |
| Game integration / handoff | GAME-02, GAME-03 | UNVERIFIED | BLOCKER for "live games" | Staging now has `game_registry` (1 row), `game_saves`, `game_events`, `game_handoff_tickets` — source untracked; no frontend uses them; no playable game linked. `demonanic/Legitloot-2` not inspected. | Export SQL (above); inspect Legitloot-2; write the handoff contract doc. LC awards from games stay unimplemented per §0.1. | No |
| Monitoring / crash reporting | OPS-01 | DEFECT | HIGH | No error reporting, uptime check or alerting configured in repo. | Free tooling runbook (Pages + Supabase logs, uptime ping) | Yes only if paid |
| Rollback / recovery | OPS-03 (new) | DEFECT | HIGH | No release manifest naming Git SHA + Pages deployment + Supabase ref + function versions; Supabase backup/PITR tier unknown. | Write `docs/RELEASE_RUNBOOK.md` (rollback = redeploy previous Pages deployment; function rollback = redeploy prior source, which requires REPO-03 first) | No |
| Prod/staging isolation | ENV-01 | VERIFIED | — | `main` → production project, build branch → staging; staging-only functions absent from production. | — | No |
| Prod/staging isolation | ENV-03 | DEFECT | MEDIUM | Staging wall-url source allows production origin. | Remove `https://legitloot.site` from staging allow-list (staging) | No |
| Branch reconciliation | REPO-01 | DEFECT | BLOCKER | Branch 227+ ahead / 9 behind `main`; branch would regress live content and drop tests. | M2-T1 merge `origin/main` → build branch | No |
| Frontend config | ENV-02, ENV-04 | DEFECT | LOW / MEDIUM | See ENV doc §7. | Fix during REPO-01 merge / release design | No |
| LC policy docs | POLICY-01 | **RESOLVED** | — | Spec v1.2 §0, Constitution §6, README, Offerwall.GG doc updated and committed with this section (commit hash in MASTER log). Verified by `grep`: remaining provider→LC passages sit under explicit "superseded" banners (spec §2/§2A/§2B/§2D, Constitution Milestone 7, Offerwall.GG doc). Historical status docs (`BUILD_STATUS.md`, `WITHDRAWAL_BUILD_STATUS.md`, `WEBSITE_STAGE0_AUDIT.md`) were left as dated records. | — | No |
| Games list docs | GAME-01 | **RESOLVED** (docs) / DEFECT (branch UI) | — | Spec §0.2, Constitution, README updated. Branch pages still show the three retired games until REPO-01. | M2-T1 | No |

### 15.2 Prioritized remaining launch blockers

1. **AUTH-02** production sign-up pause — owner toggle (BLOCKED).
2. **PROV-07** provider callbacks can mint LC in production — owner decision on containment (15.3).
3. **REPO-01** reconcile build branch with `main`.
4. **REPO-03** bring all deployed staging code/SQL under version control.
5. **LEGAL-01 / AUTH-03** Terms, Privacy, deletion procedure.
6. **WALLET-01** remove cash and provider→LC claims from player UI and live Earn copy.
7. **OPS-01 / OPS-03** monitoring + release/rollback runbook.
8. **GAME-02** truthful early-access labelling (already true on `main`) or a playable ZID build.

### 15.3 Critical escalation — PROV-07 containment (prepared, not executed)

- **Decision required:** stop production `offerwall-gg-postback` from being able to mint LC.
- **Why critical:** It is a live production path that contradicts an owner-locked financial policy; anyone holding the HMAC secret (or a misconfigured provider postback URL) could mint LC into real accounts. No minting has occurred (0 callback rows).
- **Options:** (a) **Recommended:** remove the `OFFERWALL_GG_SECRET` secret from the production project's Edge Function secrets — the function then returns 503 for every request and posts nothing; fully reversible; no code deploy. (b) Undeploy the production function (reversible only by redeploying source). (c) Leave as is until a record-only version is built and reviewed.
- **Can continue without the decision:** all branch/staging work, including writing the record-only postback.
- **Who:** owner (production secret change is outside agent authorization).

### 15.4 Next-stage execution plan (M2 — launch blocker closure, proposed)

| Task | Owner | Reviewer | Type |
|---|---|---|---|
| M2-T1 Merge `origin/main` into build branch; restore tests; keep branch-only staging tooling; remove retired games and cash UI on branch | Claude | ChatGPT | Branch code |
| M2-T2 Export deployed staging function source + missing migration SQL (`cpagrip-attribution`, `provision-initial-owner`, `game_platform_foundation`, CPAGrip/Offerwall metadata) into the repo, unmodified | ChatGPT (has access) | Claude | Read-only export → commit |
| M2-T3 Rewrite provider postback to record-only (no LC posting) on branch; staging deploy only after ChatGPT review | Claude | ChatGPT | Branch + staging |
| M2-T4 Staging auth E2E with an approved test mailbox and cleanup plan | Claude | ChatGPT | Staging writes — needs explicit go-ahead in MASTER log |
| M2-T5 Draft Terms, Privacy, deletion procedure, Support page | ChatGPT | Claude | Docs → owner approval |
| M2-T6 `docs/RELEASE_RUNBOOK.md`: release manifest, rollback, monitoring | Claude | ChatGPT | Docs |
| M2-T7 Early-access release candidate from reconciled branch → owner approval | Claude | ChatGPT | **Owner gate** |

### 15.5 M2-T1 trial merge result and resolution plan (Claude, 2026-11-19)

A trial `git merge --no-commit origin/main` on a throwaway branch (aborted; nothing pushed) produced **25 conflicts** (`404, account, earn, games, how-it-works, index, marketplace, privacy, rewards, terms, trust` HTML; `public*.css`, `portal.js`, `account-auth.js`; 6 docs; `README.md`; `offerwall-gg-wall-url/index.ts`) and would add `earn-hub.js`, `earn-providers.js`, `site-nav.js`, `assets/skuz-arcade-neon.webp`, 3 tests, and **two migrations that duplicate branch migrations under different filenames**.

**New finding MIG-01 — DEFECT, HIGH:** the Offerwall.GG callback migration exists in two lineages. `main` `20261108130000_offerwall_gg_callback_pipeline.sql` (production lineage) contains an extra legacy **LLC → LC 1:1 balance conversion** block (posts journal transactions; adds `platform_legacy_llc_clearing`); branch `20261109130000_*` (staging lineage) does not. `…140000` files are identical apart from name. One `supabase/migrations/` folder cannot represent both environments, so neither environment can be rebuilt reliably from GitHub.

**Proposed resolution rules for M2-T1 (for ChatGPT review before Claude executes):**
1. Do the merge on review branch `build/m2-t1-main-reconcile` and open a PR into `build/legitloot-neon-synthwave`; never into `main`.
2. Public pages, CSS, `portal.js`, `site-nav.js`, earn registry, tests, `skuz-arcade-neon.webp`: **take `main`** (published and owner-approved 2026-11-12; newer than the branch's 2026-11-10 redesign; correct ZID lineup). The branch's 2026-11-10 visual system stays in history. *If ChatGPT or the owner considers the branch's Creative-Bible redesign the intended design, say so before execution — that is a design-direction choice.*
3. `account-auth.js`: take `main`'s logic (includes wallet-timeout fixes) but **replace the hard-coded production URL/key with `window.LEGITLOOT_SUPABASE_CONFIG` + the `environment` guard**, and load `supabase-config.js` on `account.html` and `earn.html`. Otherwise the branch preview would register accounts in **production**. This also fixes ENV-02.
4. Branch-only backend tooling (`admin*`, `payout-simulator*`, `offerwall-launch.js`, `supabase-config.js`, staging functions): keep.
5. Governing docs (spec v1.2, Constitution, README, Offerwall.GG doc): keep branch; port any factual lines from `main`'s doc versions into them by hand.
6. `offerwall-gg-wall-url`: keep branch allow-list for now; ENV-03 tracked separately.
7. Migrations (MIG-01): do **not** add `main`'s duplicate files into `supabase/migrations/`. Store them unchanged under `supabase/environments/production/migrations/` as the production-applied record, alongside ChatGPT's M2-T2 staging export under `supabase/environments/staging/`, until a single forward lineage is designed. Deciding which lineage becomes canonical is a schema decision for review, not part of this merge.
8. Follow-up commit in the same PR: remove cash-wallet UI and provider→LC copy (WALLET-01) per spec §0.1.
9. Checks before PR: `node --check` all JS, `node --test tests/*.test.mjs`, HTMLParser route audit, `git diff --check`, headless Chrome render of `/`, `/games`, `/earn`, `/account` on the PR preview, and confirm the preview's account page calls the **staging** project.


## 15.6 ChatGPT independent review — 2026-11-19

### PROV-07 containment correction

ChatGPT independently inspected deployed production `offerwall-gg-postback` v3, production `offerwall-gg-wall-url` v1, staging `offerwall-gg-postback` v7, and the deployed staging PostgreSQL routines.

- Both deployed postback functions require `OFFERWALL_GG_SECRET` and call `process_offerwall_gg_postback`.
- The deployed staging routine writes balanced journal entries to the LC ledger. Production postback calls the corresponding public RPC wrapper.
- Production `offerwall-gg-wall-url` also requires `OFFERWALL_GG_SECRET` to sign player wall URLs.
- Therefore deleting the project-level secret disables **both** postback processing and player wall URL generation. It is a temporary full Offerwall.GG shutdown, not a postback-only switch.
- No production secret was changed. No production or staging callback was invoked. The observed callback/conversion records were zero at the last inventory.

The owner must choose between a temporary full Offerwall.GG shutdown (remove shared secret) and a separately authorized production change that prevents the postback from issuing LC while preserving the wall URL flow. The current postback path must not be treated as compliant with the owner-locked LC policy.

### M2-T2 export status

ChatGPT exported all six deployed staging Edge Function source files and a version/hash manifest into `supabase/environments/staging/functions/`. It also exported 16 deployed PostgreSQL routine definitions to `supabase/environments/staging/schema-snapshot/routines.sql`, and the 20-entry applied migration version/name ledger to `supabase/environments/staging/MIGRATION_HISTORY.md`.

**Limitation:** Supabase migration history exposes version/name metadata, not original SQL. The original `game_platform_foundation` migration SQL remains unavailable in the inspected branches and was not recovered. The routine file is a live schema snapshot, not an original migration or replayable migration. Full table/constraint/index/policy/grant/trigger reconstruction remains outstanding.

### M2-T1 merge rules review

ChatGPT approves the proposed conflict-resolution strategy for an isolated review branch and PR into `build/legitloot-neon-synthwave`, with amendments recorded in `docs/MASTER_EXECUTION_CONTROL.md` (2026-11-19 entry):

- Remove the production origin from the staging `offerwall-gg-wall-url` allow-list.
- Verify the preview's Supabase config fails closed to staging and add a test that prevents preview auth from targeting production.
- Keep production and staging migration histories separate; do not combine incompatible histories into a replayable migration directory.
- Treat browser render checks as NOT VERIFIED if no real browser is available.
- Keep the PR open for review; no merge to `main` or production deployment is authorized.


## 16. M2 launch-readiness refresh — 2026-11-19 (12:14 UTC)

This update records the current build/review state; it does not replace the deployed-state evidence in §§15.1–15.6.

| Finding | Current status | New evidence / disposition |
|---|---|---|
| REPO-01 — branch reconciliation | **RESOLVED on integration branch only** | PR #11 merged into `build/legitloot-neon-synthwave` at `2824563`. The build branch now contains the 2026-11-12 public pages, staging-only client guards, wallet response parser, owner-locked LC copy, and regression tests. Production `main` is unchanged. |
| M2-T3 / PROV-07 — provider callback minting | **DEFECT — still deployed** | PR #13's record-only migration and matching Edge Function are merged into the build branch at `1faf854`, but not deployed. The last verified inventory still showed production v3 and staging v7 able to post LC. The source-only fix does not contain the deployed risk. |
| ENV-03 — staging origin allow-list | **FIX PROPOSED, NOT DEPLOYED** | PR #14 adds canonical CPAGrip source with the production origin removed and a regression test. Independent source review found no new blocker; PR remains open and must refresh from the current base. |
| AUTH-03 — account deletion | **DESIGN DRAFT / DEFECT remains** | PR #15 proposes close-and-pseudonymise with no ledger mutation or LC movement. Its interim procedure incorrectly assumes no accounts are open while production sign-up remains enabled; correction requested. D1–D4 require owner/legal decisions before implementation choices are finalized. |
| OPS-03 / M2-T6 — release runbook | **DRAFT / REVIEW** | PR #12 includes production Pages-binding uncertainty, source snapshots, migration-history limitation, rollback and monitoring. Review note asks it to require verification of the already-approved production sign-up pause before public account onboarding. |
| AUTH-02 — production registration | **BLOCKED / NOT APPLIED** | Last environment probe: `disable_signup:false`; email sign-in remains enabled. The owner-approved pause is not complete until applied and verified. |
| LEGAL-01 — Terms / Privacy | **DEFECT / OWNER PUBLICATION GATE** | Public legal pages remain placeholders per the existing audit; accurate final text and publication approval remain required. |
| GAME-02 — playable game / early access | **UNVERIFIED / LAUNCH SCOPE DECISION** | No evidence in this review that a playable game is integrated into the current build. The first release must either include a verified playable game or be labelled accurately as an early-access portal. |
| OPS-01 — monitoring / backup | **DEFECT / PARTLY DOCUMENTED** | Runbook draft exists; production backup/PITR tier and a free/paid uptime monitoring choice remain unverified. |

### Verification notes
- Claude reports 34/34 tests on integration base `ab61c6e`, 11/11 root JavaScript syntax checks, and clean non-Markdown diff checks. Claude reports 37/37 tests on PR #14 head `3bb1226`. These results were not independently rerun by ChatGPT.
- GitHub combined statuses and workflow-run queries returned no CI checks for the inspected heads. Cloudflare preview comments confirm successful static previews only; they do not prove backend deployment.
- No PR review submissions or inline review threads were present for PRs #12, #14, or #15. ChatGPT posted actionable review comments on all three.
- No production/staging settings, secrets, functions, schema, data, callbacks, or financial records were changed during this check.

### Next owner-independent actions
1. Claude refreshes PRs #12, #14, and #15 from the latest integration base and addresses the review notes.
2. Claude updates permanent agent instructions to reflect standing authorization for integration merges and staging deployments.
3. Run the integrated test suite and syntax/diff checks on the current integration head; record exact commit and results.
4. After independent review, merge verified source/documentation PRs into the integration branch and proceed with staging-only record-only callback migration/function deployment under the standing owner authorization.
5. Keep production Offerwall containment, production release, legal publication, paid commitments, live financial activity, and irreversible business choices owner-gated.


## 17. PROV-07 live-state recheck — 2026-11-19 (12:14 UTC)

**Status: DEFECT — VERIFIED in both deployed environments.**

Read-only Supabase checks reconfirmed:
- Production `offerwall-gg-postback` v3 ACTIVE, `verify_jwt=false`; staging v7 ACTIVE, `verify_jwt=false`.
- Production has 7 applied migrations; staging has 20, latest `20261118080655 game_platform_foundation`. The build-branch record-only migration `20261119120000_offerwall_gg_record_only` is not applied to staging.
- Both live `private.process_offerwall_gg_postback` definitions still select/lock LC ledger accounts, build journal entries, and call `private.post_journal_transaction`. Their public wrappers delegate to the private routine and require `service_role`.
- Callback events and conversions are 0/0 in production and 0/0 in staging. No callback was invoked.

**Action / owner boundary:**
- The staging record-only source is already merged to the integration branch. After independent review, Claude may apply the staging migration first, deploy the matching staging Edge Function second, and verify the live routine contains no ledger/journal write path. The owner has authorized staging changes without per-action approval.
- Production remains separate: no production migration/function deployment, secret change, callback, reward issuance, or money movement is authorized by this staging task. The owner must choose the production containment approach.

This check changed no settings, secrets, functions, migrations, schema, data, callbacks, or financial records.


## 18. Latest M2 PR review and coordination status — 2026-11-19 (12:24 UTC)

- Claude refreshed PR #12 to `dfc0e53`, PR #14 to `8d80e8a`, and PR #15 to `9c8a365`, each with zero commits behind integration head `19aa0f4`. Claude reports 34/34, 37/37, and 34/34 tests respectively and clean PR diff checks. GitHub Actions/status queries returned no CI checks for those heads.
- **PR #12 / OPS-03:** the `disable_signup:true` plus `email:true` release precondition is now explicit. New runbook defect: §5.1 expects callback-event and conversion tables to remain zero. After record-only callback deployment, those tables legitimately record provider events/conversions; the invariant is zero provider-sourced LC journal/ledger postings. Correction requested on PR #12 (comment 7009001427).
- **PR #14 / ENV-03:** independent source review found no code blocker. Canonical staging CPAGrip source removes the production origin; its attribution path stores a token and does not issue LC. The PR description still says staging deployment requires a separate gate; owner standing authorization supersedes that wording. Correction posted (comment 7009019870).
- **PR #15 / AUTH-03:** latest design correctly says production sign-up is still open and requires an interim deletion/export route; `deleted_at` rejection covers Edge Functions, security-definer RPCs, and RLS-sensitive paths. Remaining items: `hello@legitloot.site` is not evidenced as configured/monitored; AUTH-03d still lists a staging-deploy gate/M2-T4 approval despite standing staging authority. Corrections posted (comment 7009003029). D1–D4 remain owner/legal decisions.
- **Standing authority:** the owner directly authorized integration merges and staging deployments. Master, AGENTS, and CLAUDE now record this; ChatGPT has the linked staging Supabase deployment actions. Claude's own connector lacks staging write access, so ChatGPT will perform the authorized staging deployment after independent review.
- **Current M2-T3/PROV-07 state:** production postback v3 and staging v7 remain active; both live SQL routines still call `private.post_journal_transaction`; callback/conversion counts 0/0; record-only staging migration not applied. Production containment remains owner-gated.
- **Next:** resolve PR #12/#14/#15 comments, rerun checks after the final edits, independently review, merge verified work into the integration branch, then apply the staging record-only migration before deploying the matching function. This audit run made no deployment or database change.


## 2026-11-19 13:09 UTC — Owner Decision Charter reconciled into launch-readiness criteria

- Initial launch scope is now explicitly **two games**: Zombies vs Heavy Metal and Rocket 2 Nowhere. This supersedes older one-game minimum language. Owner says both are playable; independent route/account/save/mobile/playability verification is still required.
- Hustle (renamed from Earning) is an authorized launch workstream. At least one genuine task publisher must be selected and technically configured/tested. A sandbox integration is not proof of live provider approval. Provider agreements, external legal acceptance, paid commitments and live activation remain owner-gated.
- At least five launch challenges/milestones must be created and wired through verified server-side game events to the authoritative website wallet. Only in-game milestones, weekly challenges and seasonal events may award LC. Provider task events and callbacks must never issue LC.
- Offerwalls remain a separate user-task/discovery feature; advertising is permitted with privacy/consent/disclosure controls. No paid features at launch. Production signup remains paused. Final production release requires explicit owner approval.
- Intended support address is `payouts@legitloot.site`; deliverability/monitoring are not yet verified.
- No deployment, provider activation, legal publication, paid commitment, production setting/secret change, real reward issuance or financial action was performed as part of this documentation update.


## 19. Independent coordination and launch-readiness check — 2026-11-19 (08:10 ET)

### Repository, branches, PRs and handoffs
- Integration head at check start: `build/legitloot-neon-synthwave` @ `c5525d0b9ac8b507eb7c242d166c2e369d70487d`. Production `main` remains `3fa7ca58992f786f7b59f22b8fb758149a873d6b`; no production merge occurred.
- Open PRs: #12 runbook @ `9a1f136` (11 ahead / 0 behind), #14 ENV-03 @ `38715b4` (6 ahead / 0 behind), #15 AUTH-03 @ `e32c2fa` (7 ahead / 0 behind). Older draft #9 remains open. No PR was merged.
- Claude's latest verifiable handoff is the PR #12 conversation comment at 12:27 UTC. It reports 34/34 tests for #12, 37/37 for #14, and 34/34 for #15, with clean diff checks. These are local reports, not CI, and were not rerun independently by ChatGPT.
- Cloudflare Pages preview check runs succeeded for the integration head and the three PR heads in both Pages projects. These checks prove static preview deployment only. The repository has no automated test workflow; the only workflow is the older artwork-extraction workflow. No formal review submissions or inline review threads were present for #12/#14/#15; review discussion is in PR conversation comments.

### Owner-policy and code review
- **LC policy:** the build branch's current player-facing Earn copy and provider registry say partner offers do not award LC. The authoritative live database state still violates the policy: production postback v3 and staging v7 remain ACTIVE and both deployed `private.process_offerwall_gg_postback` routines still lock LC ledger accounts and call `private.post_journal_transaction`.
- **Staging record-only state:** production has 7 applied migrations; staging has 20. Staging does not contain `20261119120000_offerwall_gg_record_only`. Both projects have 0 callback events, 0 conversions, and 0 provider-sourced journal transactions at this check. No callback was invoked. The source-only migration/function does not change live behavior.
- **ENV-06 (MEDIUM, defense-in-depth):** `admin.js:boot()` and `payout-simulator.js:boot()` check only `config.environment === "staging"` before calling `createClient(config.url, config.publishableKey)`. Their active pages (`admin.html`, `payout-simulator.html`) load the staging config. Existing `tests/environment-isolation.test.mjs` exercises `account-auth.js` and `earn-hub.js`, but not these two clients. Current `supabase-config.js` points to the exact staging project, so no current production misrouting was observed. Comment posted on PR #14: **7010372122**. Requested exact staging URL checks and runtime tests for missing, production, mislabelled, and valid configs.
- **GOV-01 (HIGH, release governance):** GitHub branch listing reports `protected:false` for `main`; repository rulesets query returned an empty list. The branch-protection detail endpoint returned 403, so the integration could not inspect detailed rules. This contradicts the old Master Control header's “main — protected” claim. If the owner-recorded Cloudflare production binding to `main` is correct, direct pushes may bypass the documented owner approval. Comment posted on PR #12: **7010370851**. Release runbook must not claim protection exists until verified; branch-protection/required-check setup remains outstanding.
- **PR #12:** the provider monitoring invariant is now correctly split: callback/conversion records may be nonzero after record-only deployment; provider-sourced LC journal/ledger postings must remain zero.
- **PR #14:** canonical CPAGrip source removes the production origin while preserving the deployed staging snapshot. Source-level review found no new blocker; the separate ENV-06 runtime guard gap was posted.
- **PR #15:** deletion design marks `hello@legitloot.site` UNVERIFIED and removes the obsolete per-action staging gate. D1–D4 remain owner/legal decisions; no deletion implementation or schema change is present.

### Environment and launch disposition
- Current `supabase-config.js` uses the exact staging project URL and labels it staging. `account-auth.js` and `earn-hub.js` enforce both environment and exact URL. No evidence from this check that a staging preview targets production.
- Production Auth sign-up pause was last verified `disable_signup:false` at 12:18 UTC; this run did not re-probe the public Auth settings endpoint.
- Production Cloudflare Pages binding/trigger and production backup/PITR remain NOT VERIFIED.
- **PROV-07 remains a critical financial-policy blocker** in both deployed environments. Production containment remains owner-gated because the same project-level Offerwall secret also supports wall URL signing. No secret, function, migration, setting, schema, data, or financial record was changed.
- AUTH-03 D1–D4, verified support route, Terms/Privacy publication, game availability/early-access truth, monitoring, backup/recovery, and final production release remain unresolved launch requirements or owner gates.

### Next owner-independent actions
1. Claude implements ENV-06 exact-URL guards and runtime regression tests, then reports the exact commit and test results.
2. Claude keeps #12/#14/#15 descriptions and handoffs current; ChatGPT independently reviews the next changed heads.
3. In a separate authorized implementation run, ChatGPT may apply the already-reviewed record-only migration to staging first, deploy the matching staging function second, and verify the live routine/version. Do not invoke a real callback.
4. Production branch protection, production sign-up pause, Offerwall containment, production release, live financial activity, legal publication, paid commitments, provider agreements, and irreversible business decisions remain owner-gated.

This check was read-only apart from GitHub review comments and documentation commits. No PR was merged and no staging or production deployment occurred.


## 20. Independent coordination and launch-scope review — 2026-11-19

### Repository and agent handoff
- Integration branch `build/legitloot-neon-synthwave` @ `1a8be57e9e4152b746fe1023f92bd77d486243a8`; production `main` @ `3fa7ca58992f786f7b59f22b8fb758149a873d6b` (311 ahead / 0 behind). Branch inventory: 16 branches, no additional page. No production merge.
- Open PRs #12 runbook @ `9a1f136` (11 ahead/7 behind), #14 ENV-03 @ `38715b4` (6 ahead/7 behind), #15 AUTH-03 @ `e32c2fa` (7 ahead/7 behind), and old draft #9. #12/#14/#15 currently report mergeable true, but they are behind the current integration head and need refresh. No merge.
- Latest verifiable Claude handoff is PR #12 comment `7009082911` at 12:27 UTC: local test reports #12 34/34, #14 37/37, #15 34/34, clean diff checks. No GitHub combined statuses or workflow runs exist for the checked integration/PR heads. Cloudflare preview comments are static Pages preview evidence, not unit-test CI, Supabase migrations or Edge Function deployment. No formal review submissions or inline review threads were returned; review is in conversation comments.

### Owner decision: Taplayad
- Owner selected **Taplayad** as the initial Hustle publisher target. Supplied screenshots show property Legitloot, App ID 10066, Web, Rewarding category, reward name “Legit loot,” multiplier display “$1 = 1 point,” a test panel displaying “1 Legit loot,” and a staging Supabase postback URL prefix.
- Screenshots do not prove the form was saved, the account was approved, the callback is live, or the test endpoint works. No form save or test-postback action was performed.
- Taplayad's points are publisher-defined task accounting only. They must never be mapped to LC, used as a USD peg, or credited to the website wallet. Confirm incentivized-traffic eligibility, provider terms, macros/signature verification, test-mode behavior and account approval. Agreement acceptance, paid/settlement commitments and live activation remain owner-gated.
- Current `earn-providers.js` has Offerwall.GG pending, CPAGrip testing and category placeholders; no Taplayad entry. Staging function inventory has no Taplayad adapter. Selected, not yet integrated/verified.

### Concrete launch-surface mismatches
- **Games:** `games.html` still says “One game is in development,” lists Zombie Invasion Defense as a working title/in development, and says “More worlds later.” It does not list or link the owner's two launch games: **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**. Update catalog, official names, links and truthful availability after verifying the actual game routes.
- **Hustle:** `earn.html` still titles/navigates the section “Earn”; `rewards.html`, `marketplace.html`, `privacy.html` and the mobile dock also use “Earn.” Owner renamed the section **Hustle**. Update public labels/metadata consistently.
- **LC milestone/reward path:** `rewards.html` truthfully says LC are NOT LIVE YET and no awards are being made. No current launch-surface evidence demonstrates at least five configured challenges/milestones or an end-to-end verified game event → idempotent award → authoritative website wallet. This remains a required implementation and staging-test item.
- **Support:** public contact links still point to `hello@legitloot.site`. Owner-designated address is `payouts@legitloot.site`; it remains unverified until inbound delivery, outbound reply and monitoring are tested. PR #15 comment `7011512870` requests updating the deletion design while retaining UNVERIFIED status.
- **Environment guard ENV-06:** `admin.js:boot()` and `payout-simulator.js:boot()` only check `config.environment === "staging"` and `window.supabase` before calling `createClient(config.url, config.publishableKey)`. Current `supabase-config.js` points to the exact staging project, so no current production target was observed. However, a production URL with a stale staging label would pass these two guards. Existing `tests/environment-isolation.test.mjs` does not runtime-test these clients. Existing finding is PR #14 comment `7010372122`; exact URL checks and missing/production/mislabelled/valid runtime cases remain outstanding.

### Runbook review
- PR #12's §5 correctly distinguishes callback/conversion reconciliation from the zero provider-LC-journal invariant.
- §4 rollback trigger still says “any unexpected write appears in ledger/callback tables.” That conflicts with record-only callback writes. ChatGPT posted comment `7011505297`: limit rollback to provider-sourced LC journal/ledger postings, callback-to-journal mismatches, or malformed/unexpected callback state.
- GOV-01 remains: GitHub API reports `main` `protected:false`, no repository rulesets; detailed branch-protection endpoint returned 403. Current runbook has no explicit branch-protection check in the release freeze. Comment `7010370851` and follow-up `7011505297` request correction. Do not claim protection exists until verified by an authorized admin.

### Fresh read-only Supabase state
| Item | Production | Staging |
|---|---|---|
| Applied migrations | 7 | 20 |
| `offerwall-gg-postback` | ACTIVE v3, `verify_jwt=false` | ACTIVE v7, `verify_jwt=false` |
| `offerwall-gg-wall-url` | ACTIVE v1 | ACTIVE v5 |
| Other functions | `wallet-summary` v4 | `cpagrip-attribution` v4, `payout-simulator` v6, `admin-dashboard` v7, `provision-initial-owner` v7 |
| Record-only migration | Not applied | **Not applied** |
| Callback events / conversions | 0 / 0 | 0 / 0 |

Read-only `pg_get_functiondef` in both projects confirms `private.process_offerwall_gg_postback` still selects/locks `private.ledger_accounts`, constructs journal entries and calls `private.post_journal_transaction`. Thus **PROV-07 remains a live critical policy violation in both deployed environments**; source-only record-only migration does not change deployed behavior. No callback was invoked; no setting, secret, function, migration, schema, data or financial record was changed.

### Actions and next work
- Added PR #12 comment `7011505297` for rollback-trigger wording and missing GOV-01 runbook step.
- Added PR #15 comment `7011512870` for the owner-designated `payouts@` contact, retaining UNVERIFIED status.
- Next owner-independent work: Claude refreshes #12/#14/#15 from the latest integration branch head at task pickup; addresses runbook and support comments; implements ENV-06 exact URL guards/tests; builds the Hustle/Taplayad adapter in test mode; updates the two-game catalog and supplies verified game/challenge/wallet evidence. ChatGPT independently reviews and proceeds with staging-only PROV-07 containment in a separate authorized implementation run.
- Owner gates: production Offerwall containment, production branch protection administration, production signup/settings/merge/deploy, provider agreements/approval/live activation and paid/settlement terms, legal publication, live financial activity, destructive real-data changes, security weakening and irreversible decisions. Last recorded production signup state remains `disable_signup:false` at 12:18 UTC; not re-probed in this check.


### Coordination closeout — 2026-11-19
- The four documentation updates for this check advanced integration from `1a8be57` to `150d7a4`. This final batched documentation correction is being committed now; PR branches must be refreshed from the live integration branch tip when Claude resumes, not from either historical SHA.
- Immediately before this closeout correction, PR #12/#14/#15 were 11 commits behind integration (11/6/7 commits ahead respectively). The earlier branch-refresh instruction is superseded: use the current integration branch head at pickup and report exact compare counts after refresh.
- No PR merge, deployment, callback, provider activation, Supabase mutation, production action or financial activity occurred.


## 2026-11-19 09:40 America/New_York — Taplayad launch evidence and integration requirements

- Taplayad is the owner's selected initial Hustle publisher. Owner screenshots show app ID 10066, an Active dashboard badge, Web/Rewarding configuration, offerwall URL template `https://offerwall.tplayad.com/10066/{user_id}`, 2,899 offer entries (Web/Worldwide filters), publisher point multiplier `$1 = 1 points`, and postback macros `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{country}`, `{user_ip}`, `{status}`, `{sig}`.
- Screenshot documentation identifies `{sig}` as an MD5 security signature and lists postback source IP `176.97.212.58`; full signature formula and transaction/reversal semantics are not visible. They must be confirmed from current provider documentation/support before implementation is treated as secure.
- Launch acceptance: authenticated server-side opaque user attribution; independent task/event history; signature validation; provider source validation as defense-in-depth; idempotent/replay-resistant transaction handling; reversal/chargeback tracking; fail-closed behavior; staging-only synthetic tests; explicit proof provider events never access LC wallet/ledger/journal.
- The publisher's multiplier and withdrawal panel are publisher-account concepts only, not LegitLoot user value, LC conversion, USD peg or user withdrawals. Provider offers and callbacks cannot issue LC.
- Offerwall embed is preferred for smallest launch if current provider terms allow. Offers API/custom catalogue is optional later.
- Do not infer account approval or incentivized-traffic permission from the Active badge. Owner must approve binding terms, paid commitments, live activation and any dashboard changes. No test postback or dashboard save is authorized by screenshot submission.

## 2026-11-19 10:20 ET — Current launch-readiness reconciliation

This addendum supersedes conflicting historical recommendations in this audit where later owner decisions or verified staging work changed the facts. Historical findings remain as dated evidence.

### Current owner-locked scope
- Initial launch titles: **Zombies vs Heavy Metal** and **Rocket 2 Nowhere**. The owner states both are playable, but exact source repositories/playable URLs have not been located in connected GitHub repositories or prior handoffs. Integration, account linkage, mobile behavior and saves remain unverified. The current `games.html` lists both titles as integration-in-progress and publishes no guessed links.
- One LegitLoot account; each game retains its own save; website LC wallet remains authoritative. Games may send authenticated milestone events; only the server validates and awards LC once.
- At least five launch challenges/milestones are authorized. Use only existing owner-approved LC values; do not invent values. A challenge without a verified approved value remains award-disabled/pending.
- The former Earning section is renamed **Hustle**. Provider tasks remain separate from LC issuance. Taplayad is the selected initial publisher target, but provider eligibility/terms and a permitted test integration remain to be verified. Provider agreement, paid terms and binding activation remain owner-gated.

### Verified implementation since the original audit
- Staging PROV-07 containment is complete: migration `20261119145340_offerwall_gg_record_only` applied; `offerwall-gg-postback` ACTIVE v8; live routine records provider events without LC ledger/journal posting; service-role-only private execution verified. No callback was invoked and all staging provider callback/conversion/journal counts were zero at post-deploy verification.
- ENV-03 is complete in staging: PR #14 merged; `cpagrip-attribution` ACTIVE v5 with `verify_jwt=true`; deployed source matches canonical source, production origin absent, bearer token and server-side user validation retained.
- AUTH-03 design is recorded in `docs/ACCOUNT_DELETION_DESIGN.md`; it is not implemented. Intended support contact `payouts@legitloot.site` remains UNVERIFIED. D1–D4 owner/legal decisions remain open.
- OPS-01/OPS-03 runbook is recorded in `docs/RELEASE_RUNBOOK.md`. Production backup/PITR tier remains UNVERIFIED. GOV-01: GitHub API last reported `main protected:false`, no rulesets, detailed protection endpoint inaccessible; do not claim production branch protection exists.
- Production was not modified. The last recorded production Auth settings probe (2026-11-19 12:18 UTC) returned `disable_signup:false`; re-probe at release freeze. Production launch remains owner-approved only.

### Current active task — M2-T4
Identify the actual source repositories/playable URLs for the two selected games, then verify routes, mobile usability, account/session handoff, game-specific save persistence, and signed/server-verified event integration. The connected repository `demonanic/Legitloot-2` is Zombie Invasion Defense and is not a substitute for either selected launch title.


## 18. Current independent verification — 2026-11-19 10:20 ET

### Repository and coordination
- Integration head at start: `7cf82eea2a313bde49fcc1e304729ae3a7dab957`, 349 ahead of `main`, 0 behind. All 16 branches report `protected:false`.
- Only open PR: #9, draft visual-design PR, stale since 2026-11-12, no formal review submissions. PR #12 closed unmerged/superseded by the runbook port; PR #14 merged to integration; PR #15 closed unmerged/superseded by the account-deletion design port.
- Latest Claude-authored commit found: `5ab48bd` at 11:41Z; latest verifiable Claude handoff: PR #12 comment `7009082911` at 12:27Z. No later Claude commit/handoff found.
- No combined status checks or workflow runs on current integration head. Only GitHub workflow is artwork extraction; no automated test workflow. Prior local test reports on old PR heads are not current-head evidence.

### Verified findings
- **PROD-PROV-07 — CRITICAL / FAIL:** Production Supabase project `gkbqderyjcuxnjbsiffb` has Offerwall.GG postback v3 ACTIVE. Read-only `pg_get_functiondef` confirms `private.process_offerwall_gg_postback` selects LC ledger accounts and calls `private.post_journal_transaction`. It can still mint provider-sourced LC, contrary to owner policy. Production remains owner-gated; no callback invoked.
- **STG-PROV-07 — CONTAINED / VERIFIED:** Staging project `scmnxcsggquwtuyyjnnj` has migration `20261119145340_offerwall_gg_record_only`, postback v8 ACTIVE, and record-only SQL. The live routine stores callback/conversion records and contains no ledger/journal path; EXECUTE is service_role-only. This is staging containment only, not production containment.
- **GOV-01 — HIGH / FAIL:** All 16 branch API entries report `protected:false`, including `main` and integration. The prior ruleset query returned none; detailed protection endpoint returned 403. Production PR/review protection is not evidenced.
- **ENV-06 — HIGH / FAIL:** `admin.js:boot()` line 31 and `payout-simulator.js:boot()` line 62 check only `config.environment === "staging"` and then create a client from `config.url`. They do not reject the production URL when mislabeled as staging. `tests/environment-isolation.test.mjs` tests account-auth and earn-hub but does not execute these two scripts. Current config points to staging; no current production target was observed.
- **MIG-02 — HIGH / FAIL:** Staging migration history includes `20261118080655_game_platform_foundation`, but the integration Git tree has no matching migration file or game-platform path. This leaves the applied staging schema without a reproducible source migration.
- **M2-T4 — BLOCKER / NOT VERIFIED:** Staging `public.game_registry` has only `zombie-invasion-defense`, title Zombie Invasion Defense, `launch_url=null`, `status=development`, `is_listed=false`. `private.game_events` is empty; no game Edge Function or challenge/milestone catalogue exists. The two owner-selected titles appear in `games.html` as integration-in-progress but have no playable links. Repository inventory/search did not identify exact source repositories or URLs for Zombies vs Heavy Metal or Rocket 2 Nowhere. Existing games (Aegis Rogue, Demonanic, Zombie Invasion Defense, Gauntlet's Survival, Harvest//Zero) must not be substituted without explicit evidence.
- **HUSTLE-01 — HIGH / NOT IMPLEMENTED:** `earn-providers.js` still contains Offerwall.GG pending and CPAGrip testing; no Taplayad entry. Staging `private.providers` contains only Offerwall.GG and CPAGrip, both disabled with no approval reference, terms URL or terms verification. Staging function inventory contains no Taplayad adapter. Public nav/page titles still use “Earn,” not owner-selected “Hustle.”
- **TAPLAYAD protocol — NOT VERIFIED:** Owner-supplied screenshots show app 10066 and the URL template, but do not expose the full signature formula, transaction identity, retry or reversal contract. No callback or test postback was invoked; no publisher setting changed.
- **SUPPORT-01 — MEDIUM / NOT VERIFIED:** Public pages still link to `hello@legitloot.site`. The owner-designated `payouts@legitloot.site` remains unverified; do not publish it as operational until inbound, outbound and monitoring tests pass.
- **LC public copy — PASS (copy only):** Rewards/Account pages state LC is non-cash, non-transferable, non-withdrawable and awarded only by verified in-game milestones/challenges/events; partner offers do not award LC. This is not evidence that the backend reward pipeline is implemented.

### Next owner-independent actions
1. Claude: exact staging URL checks and runtime negative tests for admin/payout-simulator.
2. Claude: recover and commit the exact game-platform migration source, reconciled to staging schema; do not reapply or mutate staging.
3. Claude: implement Taplayad adapter/task history in test mode only after provider protocol confirmation; provider callbacks must remain outside LC.
4. Claude: rename public Earning labels to Hustle and prepare five-plus challenge definitions using existing approved LC values only.
5. ChatGPT: independently review code/tests and staging isolation.
6. M2-T4 remains blocked until the owner supplies the playable URL or source repository for each selected game.

### Owner gates
Production Offerwall containment, production settings/merge/deploy, branch-protection administration, provider agreement/traffic eligibility/paid terms/live activation, legal/account-deletion decisions, live financial activity, and final production release remain owner-gated. No settings, secrets, schema/data, callbacks, deployments or funds were changed in this verification.


## 2026-11-19 — Independent Sync Watch / PR #16 review — independent evidence update

### Verified
- Integration head `66eff589`; 354 ahead and 0 behind `main`. 17 branches. Rulesets endpoint empty; branch-protection endpoint 403, so protection cannot be verified.
- PR #16 (`db939d6`) is open, mergeable, based on current integration. Exact staging URL guard is present before `createClient()` in both `admin.js:boot()` and `payout-simulator.js:boot()`. New test covers valid staging and invalid/missing/mislabelled/production/keyless configs. No code blocker found in this limited review. Claude reports 42/42 local tests; no CI/status checks or Actions runs exist. Cloudflare Pages previews succeeded but do not constitute test evidence. COMMENT review 5979524271 posted.
- PR #9 is a stale draft and diverged. Its browser test still requires Zombie Invasion Defense, conflicting with the two owner-selected launch titles. Comment 7015938125 posted.
- `games.html` lists Zombies vs Heavy Metal and Rocket 2 Nowhere; `index.html` still lists Zombie Invasion Defense. Public section remains Earn, not Hustle; no Taplayad entry exists.
- Production Offerwall.GG postback v3 remains capable of LC journal posting. Staging v8 routine is record-only.
- Staging migration history has 21 versions, including game-platform foundation, but its source SQL is absent. Staging registry has only an unlisted Zombie Invasion Defense placeholder. No Taplayad or game-event Edge Function.
- Staging providers: Offerwall.GG and CPAGrip disabled. Offerwall.GG's row has a stale LC standard-virtual-currency approved reward model despite no approval/terms evidence; this conflicts with owner policy and must be reconciled before activation.

### Required next actions
1. Recover MIG-02 source from authoritative history without applying migrations or changing data.
2. Keep Taplayad staging-only until full signature, transaction, retry/reversal protocol and incentivized-traffic permission are verified.
3. Rename Earn to Hustle, implement task history separately from LC.
4. Correct homepage/test assertions to the two owner-selected games once actual playable routes are verified.
5. Prepare five-plus milestone/challenge definitions using only approved LC economics.
6. Add automated GitHub test workflow; no current CI exists.

### Owner gates
Production Offerwall containment, production settings/merge/deploy, branch protection administration, provider agreement/traffic eligibility/paid terms/live activation, legal/account-deletion decisions, live financial activity and final release remain owner-gated. Exact source/playable URLs for both selected games remain outstanding.


## 2026-11-19 — Follow-up artifact: Claude handoff update on PR #16

- New verifiable Claude-authored commit: `3037903ba614601eac262c7caaa951c48a3b203b` (co-authored Claude Sonnet 5.5; session link recorded in GitHub commit metadata). It updates the PR branch's `CLAUDE.md` to mark ENV-06 implemented in PR #16 and identify the remaining MIG-02/Hustle/game tasks. This is a documentation-only commit; no new code or test result was added.
- PR #16 head is now `3037903`, 3 commits total, still open and unmerged. Its base remains integration head `66eff58`. Compare against the current integration branch shows divergence: integration has 5 commits not on the PR branch, while the PR branch has 3 commits not on integration; GitHub reports `mergeable=false`. The branch must be refreshed against the latest integration head and tests rerun before further review.
- Cloudflare posted successful Pages preview deployments for commit `3037903` on `legitloot-preview` and `legitloot` project preview hosts. These are preview deployment confirmations only; no GitHub CI/status checks or Actions runs exist.
- ChatGPT's review 5979524271 remains COMMENTED, not APPROVED. It found no code-level blocker in the two exact staging URL guards, but did not independently execute the test suite.
- Next: Claude refreshes PR #16 onto the latest integration head, resolves any documentation overlap, reruns `npm test`, `node --check`, and `git diff --check`, and reports exact new head. No merge or production deployment is authorized.

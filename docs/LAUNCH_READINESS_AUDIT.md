# LegitLoot — Launch Readiness Audit

**Original milestone:** M1 — Launch Readiness Baseline and Blocker Plan  
**Current milestone:** M2 — Launch Blocker Closure and Basic-Operable Release
**Original task:** M1-T1 — Repository, environment, and launch-surface inventory
**Author:** Claude (task owner) · **Reviewer:** ChatGPT
**Date:** 2026-11-19
**Original audited branch:** `build/legitloot-neon-synthwave` @ `5045cf111bb588188e0dfc937058992802cdb4ef` (historical M1 baseline)
**Mode:** Original M1 audit was read-only. Current M2 status and later read-only checks are appended below. No production or staging deployment, schema/data/setting/secret change, callback, or financial action is authorized by this audit record.

**Current-state note:** This document began as the M1 baseline audit. Use the latest dated M2 sections together with the current Master Control and Environment Source of Truth for present status; the latest independent candidate review is Sync Watch #17 follow-up 3 (2026-11-20 18:38 ET). Earlier status tables are historical.

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


## 2026-11-19 — Latest PR #16 coordination correction

- Claude-authored commit `3037903` updates the PR branch's `CLAUDE.md` to mark ENV-06 implemented. Claude-authored merge commit `cd6513e` then refreshed the PR branch from integration head `bbf6692`; both commits are verifiable GitHub artifacts. The PR branch now has 4 commits and is still open/unmerged.
- The integration branch subsequently advanced to `4f3e0cdb` with four additional documentation-only commits. Comparing PR head `cd6513e` to the current integration branch shows divergence (4 commits unique to each side); GitHub reports `mergeable=false`. This is not a code defect; the PR needs one final refresh against `4f3e0cdb` before merge-readiness can be reconsidered.
- The previous PR comment (7015970742) has been updated with this synchronization request. No additional PR comment is needed.
- Independent code review remains COMMENTED, not APPROVED. No GitHub status checks or Actions runs exist. Cloudflare preview posts are deployment previews, not CI. Claude's 42/42 test result remains self-reported; an attempted local clone/test was blocked because the execution environment could not resolve github.com, so no independent test run is claimed.
- Next: Claude refreshes PR #16 to current integration `4f3e0cdb`, reruns `npm test`, `node --check admin.js`, `node --check payout-simulator.js`, and `git diff --check`, then reports the exact new head. Avoid further documentation-only commits until this PR is synchronized and reviewed.


## 2026-11-19 — CI-01 PR #17 review and PR #16 refresh

### PR and CI evidence
- **PR #16 — ENV-06:** Claude refreshed it to current integration `04e5f46`; latest head `e11fd81`, base `04e5f46`, 6 commits, open, GitHub `mergeable=true`. Claude's verifiable PR comment reports `npm test` 42/42, `node --check admin.js`, `node --check payout-simulator.js`, and `git diff --check` clean after the refresh. No GitHub Actions run exists on PR #16 head; these results remain Claude-reported. Independent review 5979524271 remains COMMENTED, not APPROVED. No merge.
- **PR #17 — CI-01:** Claude added `.github/workflows/test.yml` with `contents: read`, `npm ci`, and `npm test` on pull requests and pushes to the integration branch. GitHub Actions run #2 (ID `44571890353`) completed successfully on head `e841729`; job log confirms all steps completed and **38/38 tests passed**. Run #1 (ID `44571591688`) also completed successfully. PR #17's run is a real GitHub-hosted test result.
- The 38-test run on PR #17 does **not** include PR #16's four new staging-guard tests: PR #17 is based on `bbf6692` and its head does not include PR #16's separate code changes. Thus PR #16 still has no CI result covering its 42-test suite.
- **Concrete CI defect:** `.github/workflows/test.yml` runs `git diff --check` after a clean checkout; this checks an empty working-tree diff and does not inspect the submitted PR patch. Review 5979612112 records the finding; correction comment 7016116302 clarifies that GitHub currently reports PR #17 `mergeable=true` (commit-history divergence is not itself a merge conflict). Fix the step to diff PR base...head and push before...head, or remove it.
- PR #17 base is still `bbf6692`, older than integration `04e5f46`; GitHub currently reports mergeable=true. Refreshing to current integration is recommended before merge consideration.
- PR #16 and #17 remain open. No PR was merged.

### Current launch and environment blockers (reconfirmed)
- Production Offerwall.GG postback v3 still reaches `private.post_journal_transaction` and can issue LC; staging v8 is record-only. Production containment remains owner-gated.
- Staging Offerwall.GG provider row remains disabled but has stale `approved_reward_model.currency_code=LC` / `standard_virtual_currency` metadata despite no verified terms/approval. Reconcile before any provider activation; no data changed.
- Staging migration history includes `20261118080655_game_platform_foundation`, but the migration source is absent from the integration tree. Claude's latest handoff says its own staging migration-history read was denied; ChatGPT has read access and can continue read-only source/schema comparison, but no schema/data changes.
- Staging registry remains only the unlisted Zombie Invasion Defense placeholder; no game-event or Taplayad Edge Function. Website `games.html` lists the two selected games, but `index.html` still shows Zombie Invasion Defense. Public section still says Earn, not Hustle; no Taplayad provider entry. Public contact links still use `hello@legitloot.site`, while owner-selected `payouts@legitloot.site` is unverified.
- PR #9 remains a stale draft with a browser assertion for Zombie Invasion Defense; comment 7015938125 requests refresh and correction.
- GitHub rulesets endpoint returned an empty list; direct branch-protection endpoint returned 403, so protection remains unverified.

### Next owner-independent actions
1. Claude: correct PR #17's `git diff --check` target and refresh PR #17 from current integration `04e5f46`; rerun Actions and post exact head/results.
2. Claude: keep PR #16 at `e11fd81` for review; no merge without authorized decision. CI should validate the 42-test suite once the workflow is available in the base or PR branch.
3. ChatGPT: continue read-only MIG-02 schema/source comparison and produce evidence for Claude; do not change schema/data or reapply migration.
4. Claude: implement Taplayad only after protocol and incentivized-traffic permission verification; provider callbacks remain record-only and outside LC.
5. Claude: rename Earn to Hustle; update homepage title and browser tests after the exact playable URLs/repos for both selected games are supplied; prepare five-plus challenge definitions with approved LC values only.

### Safety
No merge, deployment, Supabase settings/secrets/schema/data mutation, callback, publisher-dashboard save, provider agreement, live financial activity, or production change occurred during this check.


## 2026-11-19 — MIG-02 source recovered and schema compared (read-only)

- Retrieved the exact one-statement SQL from staging `supabase_migrations.schema_migrations` for version `20261118080655` / `game_platform_foundation`; rollback is NULL.
- Compared live staging columns/defaults/nullability, constraints, indexes, RLS, policies, triggers, grants and row counts for `public.game_registry`, `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets`. The catalog matches the recovered statement for these objects. All four tables have RLS enabled; only the public listed-games SELECT policy exists; anon/authenticated have no private schema usage/table access; service_role has required private access. No non-internal triggers exist. Row counts are 1/0/0/0 (the single row is the old Zombie Invasion Defense placeholder).
- Added read-only evidence at `docs/evidence/MIG-02_game_platform_foundation_recovery.md`. It contains the recovered SQL and catalog snapshot and is explicitly marked **DO NOT APPLY**; it is outside `supabase/migrations/`.
- Claude can now compare this evidence and create the canonical migration source plus regression tests. No staging schema/data was changed and no migration was replayed.


### PR/CI state at this check
- PR #16 head `e11fd81`, base integration `04e5f46`, mergeable=true; Claude reports 42/42 after refresh, but no Actions run covers this PR. Review 5979524271 remains COMMENTED.
- PR #17 adds CI-01. Actions run `44571890353` on `e841729` passed 38/38 tests. It does not include PR #16's four staging-guard tests. `.github/workflows/test.yml` has a no-op `git diff --check` step on a clean checkout; review 5979612112 and correction comment 7016116302 record the finding.
- PR #17 base is `bbf6692`; GitHub currently reports mergeable=true, though the commit histories diverge from current integration. Refresh before merge consideration.


## 2026-11-19 — PR #17 CI fix verified; MIG-02 evidence delivered

### Verified PR changes
- **PR #17 / CI-01:** Claude's head `6aa37d4` fixes the ineffective clean-tree whitespace check. The workflow now fetches full history and checks the actual PR base...head or push before...head diff, with a first-push fallback.
- GitHub Actions run `44572686596` (run #3) completed successfully on `6aa37d4`. The job's `npm ci`, `npm test`, and `Whitespace check on the submitted patch` steps all passed; logs report 38 tests passed and 0 failed. Follow-up review `5979706554` records no remaining workflow defect in this limited diff. This is COMMENT, not approval/merge authorization.
- PR #17 remains open, base `04e5f46`, and GitHub currently reports `mergeable=true`. Integration has one later documentation/evidence commit `becd068`; incorporate it before merge consideration if desired.
- **PR #16 / ENV-06:** still open at `e11fd81`, base `04e5f46`; GitHub currently reports `mergeable=false` after integration advanced. Claude reports 42/42 and both `node --check` commands clean after the last refresh, but no Actions run covers PR #16. The 38-test CI run on PR #17 does not include PR #16's four staging-guard tests. Existing review `5979524271` is COMMENTED, not APPROVED.
- PR #16 coordination comment `7015970742` now asks Claude to refresh to `becd068`, rerun the suite, and use the MIG-02 evidence. No PR was merged.

### MIG-02 source recovery completed (read-only)
- Recovered the one SQL statement for staging migration `20261118080655` / `game_platform_foundation` from `supabase_migrations.schema_migrations`; rollback is NULL.
- Compared live staging columns/defaults/nullability, constraints, indexes, RLS, policies, triggers, grants and row counts for the four game-platform tables. The live catalog matches the recovered statement for these objects. RLS is enabled on all four; only the public listed-games SELECT policy exists; anon/authenticated have no private schema usage/table access; service_role has the required private access; no non-internal triggers exist; row counts are registry=1 and saves/events/tickets=0.
- Added `docs/evidence/MIG-02_game_platform_foundation_recovery.md` with the SQL and catalog snapshot, explicitly marked **DO NOT APPLY** and outside `supabase/migrations/`. This is evidence for Claude to restore the canonical source file and add regression tests. No schema/data change or migration replay occurred.

### Next owner-independent actions
1. Claude: restore the canonical MIG-02 migration source from the evidence file in a separate reviewed code change; add regression tests. Do not apply/replay.
2. Claude: refresh PR #16 to current integration `becd068`, rerun `npm test` (confirm the 42-test guard suite), `node --check admin.js`, `node --check payout-simulator.js`, and `git diff --check`.
3. Claude: refresh PR #17 to current integration if needed, retain the corrected diff check, and preserve the passing CI evidence.
4. Continue Taplayad/Hustle staging-only work after protocol and incentivized-traffic permission verification; provider events remain outside LC.
5. Correct homepage Zombie Invasion Defense card and Earn/Hustle labels once actual launch-game routes are confirmed; exact URLs/repos for both selected games remain required.

### Safety and owner gates
Production Offerwall.GG v3 still posts to the LC journal routine; production containment remains owner-gated. Staging Offerwall.GG's disabled provider row still carries stale LC reward-model metadata and must be reconciled before activation. Provider agreements/traffic permission, paid commitments, production settings/merge/deploy, branch protection administration, legal decisions, live financial activity and final release remain owner-gated. No merge, deployment, Supabase settings/secrets/schema/data change, callback, provider activation, payment or production change occurred.


## 2026-11-19 — Final coordination status after Claude PR refreshes

- Current integration head at start of this debrief: `1c3bbd2`.
- **PR #16 / ENV-06:** Claude-authored refresh commit `39b494c` is verified; PR head `39b494c`, base `becd068`, 7 commits. Claude's comment `7016250235` reports 42/42 tests, both `node --check` commands, and `git diff --check` passing. GitHub currently reports `mergeable=false` because integration has advanced beyond the PR base. No GitHub Actions run covers PR #16; its 42/42 result is Claude-reported. Review 5979524271 remains COMMENTED.
- **PR #17 / CI-01:** head `6aa37d4`, base `04e5f46`, 4 commits. The corrected `git diff --check` compares the submitted patch/push range, with full history and first-push fallback. GitHub Actions run `44572686596` passed all steps; the log reports 38/38 tests. Review 5979706554 found no remaining workflow defect in this limited diff. GitHub currently reports `mergeable=false` after integration advanced; no merge occurred. The 38-test run does not include PR #16's four staging-guard tests.
- **MIG-02:** exact staging migration SQL and live catalog comparison are committed in `docs/evidence/MIG-02_game_platform_foundation_recovery.md`, marked DO NOT APPLY. Claude's PR #16 comment `7016250235` says it is starting a separate MIG-02 branch from `becd068`; no corresponding branch, commit, or PR was visible at this check. Do not claim implementation has begun until a verifiable branch/commit/PR appears.
- PR #9 remains an old draft with Zombie Invasion Defense browser assertions; the stale-PR finding is on the PR.

Next: Claude should synchronize PR #16 and PR #17 once to current integration `1c3bbd2`; retain the passing PR #17 workflow and rerun it after sync. Claude should create the separate MIG-02 source-recovery branch from the evidence artifact and add tests, without replaying the migration or changing staging data. No further documentation-only commits are planned in this review cycle.


## 2026-11-19 — Launch-readiness reassessment after PR #19 combined CI

### Verified improvements
- GitHub Actions combined candidate PR #19 run 44583018543 passed 50/50 with zero skips and the patch whitespace check. This combines PR #16 ENV-06, PR #17 CI-01, and PR #18 MIG-02. PR #19 is draft-only and not approved for merge.
- Staging Offerwall.GG PROV-07 containment is deployed: migration 20261119145340_offerwall_gg_record_only, postback Edge Function v8, live DB routine record-only, and Edge Function source byte-identical to integration. Staging callback/conversion counts are 0/0.

### Blocking items
1. Production financial policy violation: production Offerwall.GG v3 and its live private routine still call post_journal_transaction. No production containment has been authorized/performed.
2. Taplayad callback contract: current official docs expose only md5(app_id . user_id . api_secret); the signature does not bind offer_id/reward/payout/status and the documented macros have no unique transaction ID. Status 2 means reversal, but the docs do not provide a transaction reference for matching. Require a stronger signed callback contract or authoritative verification API before live integration. Do not issue LC from Taplayad.
3. Publisher eligibility: dashboard Active screenshot does not establish account-specific approval for incentivized traffic or binding terms. Those remain owner-gated.
4. Game routes: approved games are named on games.html, but no verified playable URLs/repositories are recorded. index.html still features Zombie Invasion Defense; do not publish routes until verified.
5. LC policy copy: index.html places “Complete offers (Planned)” in the LC earning steps, implying offerwall activity can earn LC. Remove it from the LC sequence; Hustle tasks must be separate.
6. Hustle: public navigation/section still says Earn; Taplayad is absent from earn-providers.js and staging private.providers; no Taplayad Edge Function/task history exists.
7. Rewards: at least five launch challenges/milestones and the server-verified game-event-to-authoritative-wallet path remain unverified.
8. Support: public pages still use hello@legitloot.site; payouts@legitloot.site delivery/monitoring is unverified.
9. Release controls: main is reported unprotected, no rulesets were returned, and the detailed protection endpoint returned 403. Production registration pause was last recorded as not applied; not rechecked in this audit. Cloudflare project-level preview bindings remain unverified even though the preview branch's supabase-config.js targets staging.

No production release is ready. No production deployment, merge, provider activation, callback, payment, terms acceptance, schema/data change, or settings/secret change occurred in this review.


## 2026-11-19 14:42 ET — Launch-readiness reassessment after PR #20

### Improvements verified
- PR #16 (staging guards), #17 (CI workflow), and #18 (MIG-02 canonical source/tests) have been merged into the integration branch only. PR #19 combined test candidate was closed unmerged.
- Integration CI run 44590656627: 50/50 Node tests, no failures/skips, npm ci and whitespace check passed.
- Claude's PR #20 public-copy candidate updates navigation/title/description/accessible labels to Hustle, removes “Complete offers” from homepage LC steps, replaces Zombie Invasion Defense homepage feature with Zombies vs Heavy Metal and Rocket 2 Nowhere, and adds four Node tests. PR #20 CI run 44591660747: 54/54 Node tests, no failures/skips, whitespace check passed.
- PR #20 Cloudflare bot comments report successful branch previews in both Pages projects; PR source config explicitly targets staging.

### Remaining PR #20 review items
- `earn-hub.js` still renders “No earning provider is open…”; `tests/earn-hub.browser.py` asserts the obsolete wording. Current CI runs only `node --test tests/*.test.mjs`, so this browser test is not executed. Add Node coverage or include the browser suite in CI.
- Homepage LC step 3 says “Uses announced later” rather than a clear weekly-challenge/seasonal-event source.
- Hustle fine print says “Advertised rewards are not guaranteed earnings” and mentions provider “settlement”; clarify that provider activity never credits LC or creates a LegitLoot cash payout/wallet credit.
- PR #20 is 2 commits ahead / 2 behind integration. Review comment 7020270626 requests these corrections, branch sync, and rerun. Not yet ready for owner approval.

### Launch blockers reconfirmed
1. **Critical production policy violation:** production Offerwall.GG v3 is ACTIVE, `verify_jwt=false`; SECURITY DEFINER database routine still locks LC ledger accounts and calls `post_journal_transaction`. Production provider-to-LC issuance remains possible.
2. Staging Offerwall.GG v8 is record-only and deployed source exactly matches integration; no ledger/journal path. Staging provider row remains disabled but retains stale LC/LootCoins reward-model metadata and null terms/approval evidence.
3. Taplayad is selected but absent from staging provider records and Edge Functions. Current provider callback contract still lacks signed transaction-field integrity and unique reversal identity; account-specific incentivized-traffic permission is unverified.
4. Games are named in the homepage candidate but have no verified playable routes/repos. Game registry/playable route readiness remains unproven.
5. At least five launch challenges and the server-verified game-event → authoritative website wallet flow remain unverified.
6. `payouts@legitloot.site` remains unverified; public copy still uses `hello@legitloot.site`.
7. All 21 Git branches report unprotected; main branch protection remains a release gate. Cloudflare project-level preview bindings remain unverified.

No production merge/deploy, settings/secrets, schema/data, callback, publisher dashboard, money, or provider agreement was changed. No PR was merged during this check.

## 2026-11-19 15:23 America/New_York — New launch-readiness findings

### HUSTLE-COPY-20261119-01 — MEDIUM / VERIFIED
Evidence: PR #20 head 20a8203, index.html lines 7 and 84 use broad “earned by playing” copy. Fine print at line 92 correctly names verified in-game milestones, weekly challenges and seasonal events. tests/hustle-public-copy.test.mjs lines 49–63 checks the steps but not the meta description/headline.
Impact: homepage headline/search snippet can imply LC is awarded for ordinary play, broader than owner-approved sources.
Smallest correction: state the three approved sources in headline/meta, consider replacing generic “Play games” with “Complete verified in-game milestones”, and add assertions.
Owner approval: not required for copy/tests.

### PROV-CURRENCY-CASE-20261119-01 — MEDIUM / VERIFIED
Evidence: docs/OFFERWALL_GG_INTEGRATION.md says exact currencyName “Loot coins”; staging supabase/functions/offerwall-gg-postback/index.ts line 82 accepts only “Loot Coins”. tests/offerwall-record-only.test.mjs does not assert this literal.
Impact: a callback matching the written setup may be rejected by the staging record-only handler.
Smallest correction: verify exact provider callback casing, then align staging handler, docs and regression test. No callback or publisher setting change.
Owner approval: not required for staging code/docs/test after provider evidence; any dashboard change remains owner-gated.

### PROV-07 — CRITICAL / VERIFIED
Production Offerwall.GG postback v3 is ACTIVE (verify_jwt=false) and production private.process_offerwall_gg_postback still calls private.post_journal_transaction. Provider-to-LC issuance remains possible and violates owner policy. Staging v8 is record-only. Production containment remains owner-gated.

Governance:
- PR #20 head 20a8203, Actions run 44601788773: 57/57 tests pass; PR is 5 ahead / 5 behind current integration 04ff43e and requires synchronization.
- PR #9 remains a stale draft and is non-mergeable; compare reports 171 commits on integration side and 12 on draft side from merge base.
- GitHub explicitly reports main and integration branch as unprotected.


## 2026-11-19 16:54 America/New_York — Independent launch-readiness reassessment

### PR #20 — scoped public-copy work reviewed
- Current integration before this debrief: 3db61c0545c95ab28e525e070f3d66f58ab9fa63; main: 3fa7ca58992f786f7b59f22b8fb758149a873d6b. 21 branches, all protected=false; two open PRs (#20 and stale draft #9).
- PR #20 head ad21bbecd0fd6e020925464132b637fd83bc2327, base integration 3db61c0, mergeable and 0 commits behind. 15-file diff is limited to public navigation/page labels, homepage LC source wording, Hustle status/disclaimer copy and copy tests. It does not change provider integration, wallet, database or LC issuance.
- Actions run 44609090382 succeeded: install, npm test, submitted-patch whitespace check. Claude's comment reports 58/58 local; exact Actions test count not independently retrieved. Python/Playwright is not part of CI.
- Independent formal review COMMENT 5984053898: no blocking defect in this limited diff. Not an APPROVE review; no merge. The coordination-document updates advance integration; PR #20 must sync to the latest integration HEAD and rerun CI before final owner review.
- PR #20 preview bot comments report successful branch previews in both Pages projects. Its supabase-config.js matches integration and targets staging; Cloudflare dashboard-level environment overrides/custom-domain bindings remain unverified.

### M2-T4 remains active — game source dependency
- Master Execution Control is authoritative: active task M2-T4, ChatGPT acting lead. CLAUDE.md had a stale M2-T5 mandate and is corrected in this update.
- Exact-title GitHub repository searches for Zombies vs Heavy Metal and Rocket 2 Nowhere returned no repositories. No playable URL/source repo is verified. Do not substitute unrelated game projects or invent routes; owner input is needed for each title.

### PROV-07 — critical production financial-policy violation reconfirmed
- Production gkbqderyjcuxnjbsiffb: Offerwall.GG postback v3 ACTIVE, verify_jwt=false; live private.process_offerwall_gg_postback locks LC ledger accounts and calls private.post_journal_transaction. Provider-to-LC issuance remains possible and violates the locked policy.
- Staging scmnxcsggquwtuyyjnnj: Offerwall.GG postback v8 ACTIVE, verify_jwt=false; live routine is record-only. Deployed v8 Edge Function source exactly matches integration source (6,990 bytes).
- Staging provider rows: CPAGrip disabled; Offerwall.GG disabled but stale reward model names LC/LootCoins and terms/approval fields are null; Taplayad absent. No rows changed.

### TAPLAYAD-PROTOCOL-AMBIGUITY-20261119-01 — new integration blocker
- Current/new official docs https://tplayad.com/docs match owner screenshot macro names. They document signature md5(app_id . user_id . api_secret), status 1/2, IP 176.97.212.58, no transaction-ID macro, and sample deduplication by offer_id + user_id. Signature does not bind reward, payout, offer ID or status; sample dedupe cannot safely distinguish repeated conversions/multiple rewards for one user/offer.
- Legacy official docs https://www.tplayad.com/doc/postback describe subId, transId, reward, payout, status, campaign_id, uuid, and signature md5(subId . transId . reward . secret); it includes a unique transaction ID but does not sign status. This is a different system/contract.
- The current docs explicitly link separate new and old dashboard systems. The owner's URL https://offerwall.tplayad.com/10066/{user_id} also differs from the current iframe https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}. App ID 10066's exact system and URL alias are unconfirmed. Do not choose a protocol or implement live callbacks by assumption.
- Require written account-specific provider confirmation of system/version, wall URL, payload-bound authentication, transaction identity, reversal matching, retry/idempotency semantics and authoritative verification API. No callback or dashboard change performed.
- Current Tplayad Terms (updated 2026-10-29) require 18+, prohibit fraud, make publisher earnings subject to dashboard terms and include indemnification. They do not prove account-specific approval for LegitLoot's exact use. No agreement accepted.

### PROV-CURRENCY-CASE remains unresolved
- Internal Offerwall.GG guide says currencyName=Loot coins; staging handler requires Loot Coins. Official public docs say currencyName is publisher-defined but do not establish the current placement's exact value. Confirm using authorized placement evidence before any source change; no callback/settings change.

### Owner gates
Production Offerwall containment, main branch protection, Taplayad terms/account-specific permission/live activation, paid commitments, production deploy, destructive data changes, security weakening, legal/business decisions, support-mailbox verification, production registration-pause verification and final launch remain owner-controlled. No PR merged, no deployment, no callback, no financial activity, no Supabase/provider configuration/data changes.


## 2026-11-19 17:42 America/New_York — Independent reassessment

### PR #20 — public Hustle copy candidate
- Current PR head `8cee6f7f5e5208363fe4f58077173dd0f8897575`, base integration `a0cef5e69867d31235ffca5778dc11bab7cfccba`; 9 ahead / 0 behind, mergeable, non-draft.
- GitHub Actions run 44624595265: `npm ci` passed; `npm test` 58/58 passed, 0 failed, 0 skipped; submitted-patch whitespace check passed. Python/Playwright remains outside CI.
- Independent COMMENT review 5984643477 found no blocking defect in the 15-file public-copy diff. LC sources are correctly constrained, Hustle labels are consistent, and both selected games are listed without invented routes. No backend/provider/wallet/issuance logic changed. PR is ready for owner review, not merged.

### M2-T4 game-source blocker
- Read-only search of all seven accessible owner repositories and exact-title search found no source repository/playable URL for Zombies vs Heavy Metal or Rocket 2 Nowhere. Do not substitute Demonanic, Gauntlet's Survival, Harvest//Zero or Zombie Invasion Defense.
- Staging registry has only unlisted development Zombie Invasion Defense with null launch_url. Game saves/events/handoff tickets each have 0 rows; no challenge/milestone/season tables exist. Game launch and central reward flow are not verified.

### Financial/provider controls
- Production Offerwall.GG v3 remains ACTIVE, verify_jwt=false; SECURITY DEFINER routine calls private.post_journal_transaction and can issue LC. Critical owner-gated policy violation.
- Staging Offerwall.GG v8 remains ACTIVE, verify_jwt=false but record-only. Its provider row is disabled while stale LC/LootCoins reward metadata and null terms/approval evidence remain. CPAGrip disabled; Taplayad absent.
- Taplayad protocol/account generation, canonical wall URL, signed transaction fields, unique transaction identity, reversal semantics and incentivized-traffic permission remain unverified. No live callback integration authorized.

### Governance
- 21 branches, all unprotected. Integration is 393 commits ahead of main, 0 behind. PR #9 is a stale non-mergeable draft (12 ahead / 184 behind). Production merge/deploy and branch protection remain owner-gated.
- Stale initial-game references were corrected in Creative Bible and Platform Build Spec §1 to align with the current two-game owner decision.


## 2026-11-19 18:21 ET — Independent Sync Watch: PR #20, previews, and launch blockers

### Repository and PR state (read-only)
- Integration `build/legitloot-neon-synthwave` is `affb6f54cdc98b17334021dd9d2d00ff6106d7d5`; production `main` is `3fa7ca58992f786f7b59f22b8fb758149a873d6b`. GitHub compare reports integration 402 commits ahead / 0 behind main.
- GitHub lists 21 branches; the branch API reports `protected=false` for all 21, including `main` and integration.
- PR #20 is open, non-draft, mergeable, 12 commits ahead / 0 behind integration. Head `2081d0fce8b5f066de500420f136cc6dc7de57d2`, base `affb6f54cdc98b17334021dd9d2d00ff6106d7d5`, 15 files changed. It remains a public-copy/navigation/test-only change; no provider, wallet, database or LC issuance logic changed.
- Actions run [44632297288](https://github.com/demonanic/LegitLoot/actions/runs/44632297288) passed `npm ci`, `npm test` (58 passed, 0 failed), and submitted-patch whitespace check. The Node log contains a non-blocking DEP0169 `url.parse()` deprecation warning. Python/Playwright browser tests are not part of this workflow.
- Independent COMMENT review `5984698005` found no blocking defect in the exact current PR head. It is not an APPROVE review or production-release approval. Latest Claude handoff comment is [7024420349](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7024420349), reporting sync to integration `affb6f5` and 58/58 local tests; no newer Claude handoff/implementation artifact was found.
- PR #9 remains a stale, non-mergeable draft: 12 commits ahead / 193 behind integration. Do not merge as-is.

### Cloudflare Pages preview verification (read-only)
- Both Pages projects now have successful PR #20 preview deployments on branch `claude/hustle-rename`, commit `2081d0f`, with `environment=preview`.
- `legitloot`: preview deployment `b883bf05`, URL `https://b883bf05.legitloot.pages.dev`, branch alias `https://claude-hustle-rename.legitloot.pages.dev`. Canonical production remains branch `main`, commit `3fa7ca5`, alias `https://legitloot.site`.
- `legitloot-preview`: preview deployment `567830da`, URL `https://567830da.legitloot-preview.pages.dev`, branch alias `https://claude-hustle-rename.legitloot-preview.pages.dev`. Its separate canonical deployment remains on `design/industrial-cyberpunk-rebuild`; it is not the `legitloot.site` production project.
- Both projects report empty project/deployment environment-variable maps. The checked-in `supabase-config.js` targets staging project `scmnxcsggquwtuyyjnnj`. No production deployment or Cloudflare setting was changed.

### Fresh Supabase read-only verification
- Production project `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 ACTIVE, `verify_jwt=false`. Live `private.process_offerwall_gg_postback` is SECURITY DEFINER and calls `private.post_journal_transaction`, with user/platform LC ledger account locks. Provider-to-LC issuance remains possible and violates the owner-locked policy.
- Staging project `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 ACTIVE, `verify_jwt=false`. Its live database routine is record-only: it stores callback/conversion/reversal events and contains no LC ledger or journal posting call.
- Staging `private.providers`: CPAGrip disabled with no approval metadata; Offerwall.GG disabled but retains stale `standard_virtual_currency / LC / LootCoins` reward metadata and null terms/approval fields; Taplayad is absent. No row changed.
- Migrations remain 7 production / 21 staging. No settings, secrets, schema, rows, functions or migrations were modified.

### M2-T4 game and challenge status
- Staging `public.game_registry` still contains only `zid / zombie-invasion-defense`, title Zombie Invasion Defense, status `development`, `is_listed=false`, `launch_url=null`.
- `private.game_saves`, `private.game_events`, and `private.game_handoff_tickets` each contain 0 rows. No challenge, milestone or season tables were found in public/private schemas.
- Exact source repositories/playable URLs for the owner-selected **Zombies vs Heavy Metal** and **Rocket 2 Nowhere** remain unavailable in the connected repository inventory. Do not substitute unrelated games or invent URLs. M2-T4 remains active; ChatGPT is acting lead per Master Control.

### Taplayad and remaining controls
- Taplayad App ID 10066 remains selected as the initial Hustle publisher, but account-generation/protocol, canonical URL, payload-bound authentication, transaction identity, reversal matching, retries/idempotency, authoritative verification and incentivized-traffic permission remain unconfirmed. Keep any permitted staging work record-only. Publisher `$1 = 1 point`, `{reward}` and `{payout}` must never map to LC or user cash/withdrawal.
- Production Offerwall.GG provider-to-LC issuance is the critical owner-gated blocker. Branch protection is disabled on all 21 branches. Support-mailbox verification, sign-up-pause verification, provider agreements/paid commitments and final production release remain owner-controlled.
- No PR was merged, no deployment performed, no callback invoked, no provider terms accepted, no money moved, and no Supabase/Cloudflare settings, secrets, schema or data changed.


---

## 2026-11-19 19:41 ET — Launch-readiness correction: ZVHM live; production policy mismatch blocks full launch

### Verified milestone
PR #21 was specifically owner-authorized and merged to production as `4e0f533`. Cloudflare confirms successful production deployment on `main` to `https://legitloot.site`. Read-only browser checks verified HTTP 200 for the homepage, Games page, ZVHM play page and direct game URL. The iframe displays the actual game canvas/tutorial/HUD, with no page errors or horizontal overflow at desktop/390px mobile. The game is early access, device-save only, and not connected to LegitLoot accounts or LC.

### Still not launch-complete
- Rocket 2 Nowhere has no located source and is not listed as playable; production Games shows a placeholder for future games.
- Integration branch `907f1a6` is 404 ahead / 2 behind main `4e0f533` and lacks the PR #21 play page. Port the four public files into integration before future release.
- PR #21 had no GitHub Actions status/workflow run or review submission returned. Cloudflare preview and production deployments succeeded; independent browser smoke check passed, but no automated test suite is evidenced for this PR/game commit.
- PR #20's public-copy changes are not on production. PR #20 head `7912edd` is 13 ahead / 1 behind integration; Actions `44637573706` passed 58/58 Node tests, 0 failures, whitespace check. Sync once to `907f1a6` and rerun. PR #20 uses staging-only Supabase configuration and is not a production release artifact.
- Production `index.html`, `rewards.html`, `account.html` still advertise offerwall-to-LC, cash wallet and withdrawal concepts contrary to locked rules. Production `account-auth.js` supports sign-up against production Supabase; `get_wallet_summary()` returns cash and LC fields. Terms/Privacy are expressly incomplete while account forms remain present. This is a critical privacy/legal/policy release blocker; owner must decide sign-up pause and authorize any production changes.
- Production Offerwall.GG v3 callback can still issue LC via SECURITY DEFINER journal routine. Disabled provider metadata does not stop the active function because the function does not check provider status. Critical owner-gated financial-policy blocker.
- Staging postback v8 is record-only; staging wall-url CORS allows `https://legitloot.site`, a cross-environment exception to review.
- Taplayad remains unintegrated; account protocol, signed transaction identity, reversals/retries and incentivized-traffic permission unresolved.
- Branch inventory returned 22 names; branch protection was not re-queried in this run (previous record found all then-existing branches unprotected).

### Acceptance criteria before production launch
1. Complete the second approved game route or obtain an owner-approved scope change; do not substitute.
2. Port the live ZVHM public-page change into integration and maintain no-account/no-LC disclosure until handoff is built.
3. Remove production-facing provider-to-LC and cash/withdrawal claims; make wallet LC-only.
4. Resolve production callback-to-LC path under owner authorization.
5. Resolve account sign-up versus incomplete Terms/Privacy before collecting user data.
6. Verify staging/production origin separation and branch protection.
7. Verify Taplayad contract/permission before live provider integration.
8. Publish approved legal documents and obtain final owner release approval.

No merge, deploy, Supabase/Cloudflare mutation, callback, payment or provider agreement was performed during this audit.


---

## 2026-11-19 20:10 ET — Independent Sync Watch: PR #20 revalidated; ZVHM live; production policy blockers remain

### Repository, branches, PRs, and CI
- Integration `build/legitloot-neon-synthwave` is `fd758a772346cccd23f714cbcff575bf0e2c9176`; production `main` is `4e0f533a1962767d7595f32c9a9bdcb979d31513`. GitHub compare reports integration 409 commits ahead / 2 behind main, merge base `3fa7ca5`; the two main-only commits are the owner-authorized PR #21 game launch.
- GitHub lists 22 branches; all 22 report `protected=false`. Repository rulesets query returned an empty list. Do not describe either main or integration as protected.
- Open PRs: #20 and stale draft #9. PR #20 is non-draft and mergeable, head `c6dc85b27b1f7a11118ae34c37a285e590f21d33`, base/current integration `fd758a7`, 14 ahead / 0 behind, 15 files. Comparing the previous reviewed head `2081d0f` to current head shows only nine documentation/integration synchronization commits; the 15 application/test files are unchanged.
- GitHub Actions run [44649018861](https://github.com/demonanic/LegitLoot/actions/runs/44649018861) passed `npm ci`, `npm test` (58 passed, 0 failed, 0 skipped), and the submitted-patch whitespace check. The workflow does not run the Python/Playwright browser suite.
- Latest verifiable Claude handoff is PR #20 comment [7026808930](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7026808930): Claude reports syncing once to `fd758a7` at `c6dc85b`, no conflicts, 0 behind, and 58/58 local tests. No later Claude implementation artifact was found. Independent COMMENT review [5986084428](https://github.com/demonanic/LegitLoot/pull/20) rechecked current head, found no blocking defect in the scoped public-copy diff, and is not an approval. PR #20 is ready for owner review for integration acceptance only; it is not a production release artifact because its Supabase configuration is staging-only.
- PR #9 remains a stale, non-mergeable draft. No open PR currently integrates Rocket 2 Nowhere.

### Game milestone M2-T4
- PR #21 was specifically owner-approved and merged to `main` as `4e0f533`. Cloudflare confirms production deployment `6598c4c6-ecd5-49a1-9122-a55caa892cd8`, environment `production`, branch `main`, alias `https://legitloot.site`.
- Zombies vs Heavy Metal source is `demonanic/Legitloot-2`; the production play page embeds `https://demonanic.github.io/Legitloot-2/`. It is early access, device-local save only, and not connected to LegitLoot accounts or LC. PR #21 had no GitHub Actions run/status evidence; the Cloudflare deployment and browser smoke check are not a game CI pass.
- Integration `fd758a7` still contains the old ZID placeholder and lacks the four PR #21 public changes: `games.html`, `index.html`, `zombies-vs-heavy-metal.html`, and `sitemap.xml`. Port those changes into integration as a separate reviewed change before a later integration-based release; preserve the device-save/no-account/no-LC disclosure.
- Rocket 2 Nowhere remains unlocated in accessible repositories and is not represented as playable on production. The live Games page shows ZVHM plus “More Worlds Later.” Do not substitute another game or invent a route.
- Fresh staging query: `public.game_registry` still has one unlisted `zombie-invasion-defense` development row with null launch URL; `private.game_saves`, `game_events`, and `game_handoff_tickets` each have zero rows. No challenge, milestone, or season tables were found.

### Live public-site and account/legal findings
- Read-only browser check loaded all eight requested production URLs without visible page/navigation/JavaScript errors. Production still uses “Earn,” not “Hustle”; only ZVHM is shown playable; Rocket 2 Nowhere is absent.
- Production Rewards still describes Offerwall.GG completions crediting LootCoins and includes cash reward, pending/available/reserved/paid, and withdrawal concepts, even though provider/payout status labels say inactive. Production Account displays sign-in and a visible Create Account control and retains cash wallet fields in `main` source. Production `account-auth.js` hardcodes the production Supabase project and implements `client.auth.signUp`.
- Production Terms says formal terms are not published; Privacy says the full notice is in preparation and instructs visitors not to submit personal information. This conflicts with the visible account onboarding. Master Control records the production sign-up pause as owner-approved but unapplied; the current audit did not verify the Auth setting and did not change it.
- PR #20's integration branch corrects the public LC/Hustle copy and displays an LC-only account panel, but it is staging-configured and must not be promoted to main without a separate owner-approved production configuration/release plan.

### Supabase and provider controls
- Production `gkbqderyjcuxnjbsiffb`: 7 migrations; `offerwall-gg-postback` v3 ACTIVE, `verify_jwt=false`; `wallet-summary` v4 ACTIVE; `offerwall-gg-wall-url` v1 ACTIVE. The deployed v3 handler verifies an HMAC over user ID, transaction ID, and amount but does not check the provider registry's disabled status before calling the posting RPC. Live `private.process_offerwall_gg_postback` is SECURITY DEFINER, locks user/platform LC accounts, and calls `private.post_journal_transaction`. Production `public.get_wallet_summary()` is SECURITY DEFINER and returns both cash and LC. Provider row is disabled but retains `standard_virtual_currency / LC / LootCoins` metadata with null terms/approval fields. Provider-to-LC issuance remains possible and violates policy.
- Staging `scmnxcsggquwtuyyjnnj`: 21 migrations; `offerwall-gg-postback` v8 ACTIVE, `verify_jwt=false`, and live DB routine is record-only with no LC journal posting. `offerwall-gg-wall-url` v5 is JWT-protected but its CORS allow-list includes production origin `https://legitloot.site`; this is a cross-environment exception, not evidence the preview targets production. `cpagrip-attribution` v5 is ACTIVE/JWT-protected and only creates attribution tokens; its provider row is disabled. Staging providers: Offerwall.GG disabled with stale LC metadata/null approval and terms; CPAGrip disabled; Taplayad absent.
- Taplayad App ID 10066 remains unintegrated. Account generation, canonical wall URL, applicable callback protocol, payload-bound transaction authentication, unique transaction identity, reversal/retry semantics, authoritative verification, and incentivized-traffic permission remain unconfirmed. Keep any permitted staging work record-only; never map publisher points, `{reward}`, or `{payout}` to LC or cash.

### Cloudflare and safety
- Cloudflare `legitloot` canonical production deployment remains `main` / `4e0f533` with alias `https://legitloot.site`. PR #20 head `c6dc85b` has successful preview deployments in both `legitloot` and `legitloot-preview`, each classified `preview` with only `*.pages.dev` aliases. Checked-in PR Supabase config targets staging. Staging preview isolation is verified; the separate staging wall-url CORS production-origin allow-list remains to review.
- This Sync Watch instruction explicitly prohibited PR merges and deployments; none were performed. No Supabase settings/secrets, callbacks, provider settings/agreements, payments, schema, data, or production systems were changed.


---

## 2026-11-19 20:33 ET — Offerwall.GG Option A containment prepared (NOT DEPLOYED)

Owner explicitly authorized preparation and testing of production containment, preserving records and rollback, with separate owner approval required before any production deployment or database change.

- Created draft PR #24: https://github.com/demonanic/LegitLoot/pull/24, branch `security/offerwall-gg-production-containment`, based on production main `4e0f533`.
- Candidate Edge Function `supabase/functions/offerwall-gg-postback/index.ts` now returns HTTP 410 for every method. It does not parse callback data, read secrets, create a Supabase client, or call an RPC.
- Added dependency-free Deno tests for GET, POST and OPTIONS rejection in `supabase/functions/offerwall-gg-postback/index_test.ts`.
- Added `docs/security/OFFERWALL_GG_PRODUCTION_CONTAINMENT.md` documenting the separate database EXECUTE revocations, read-only privilege verification, preservation guarantees, and grant rollback. SQL is a prepared proposal only; it has not been executed and is not a migration.
- No production or staging function was deployed; no Supabase settings/secrets, SQL grants, schema/data, provider dashboard, postback URL, callbacks, payments or historical records were changed.
- Supabase connector calls could not be authenticated in this session (the linked-account IDs were rejected). Consequently the live project could not be re-queried during preparation. The candidate is based on the checked-in production function and migration source; this is not a live verification claim.
- Test execution is pending an environment with Deno/Supabase CLI. Source review confirms the handler contains no database/client/secret/RPC path; tests are authored but not yet executed.
- Next: restore Supabase connector access; independently inspect live production function/RPC definitions and effective grants; run Deno tests; review PR #24. Only after those pass should a separate production maintenance plan be presented for explicit owner approval. Consider removing the publisher dashboard URL only after verifying other configured products do not depend on it.
- Owner gate: production database privilege revocation and Edge Function deployment each require separate explicit approval. Dashboard changes and any provider-side contract changes remain separately gated.


## 2026-11-19 21:29 ET — Sync Watch: game candidate review, preview isolation, live Supabase and Taplayad recheck

### Repository and PR state
- Production `main` remains `4e0f533` (PR #21 merge). Integration is `387d035`. All listed branches report `protected:false`; no repository rulesets were returned.
- Open PRs: #9 stale draft; #20 Hustle/public copy; #22 integration game package; #23 draft RXT2 production publish; #24 draft Offerwall.GG containment. No merge or deployment was performed.
- PR #20 head `c6dc85b` passes 58/58 Actions tests (0 failures/skips) and is seven documentation-only commits behind integration. A comment asks Claude to sync once and rerun CI.
- PR #22 head `c70c3d3` passes 64/64 Actions tests (0 failures/skips) plus whitespace check. The scoped game diff is consistent with the owner-locked two titles and honest early-access/device-save/no-account/no-LC copy. The RXT2 game source is identical in PR #22 and #23 (blob `7311b421246c40a672110b134372811985e621ac`). COMMENT review `5986626725` found no blocking defect.
- PR #23 head `33a5240` is a draft against main with no Actions run. Cloudflare preview deployments succeeded in both Pages projects. Read-only browser QA confirmed the Games page, Rocket 2 Nowhere wrapper and iframe start screen load. It remains unpublished.
- PR #24 head `7a31165` is a draft; Deno tests are not run. `index_test.ts` imports `index.ts`, which executes top-level `Deno.serve` during module loading. Extract the pure handler and test it separately. Comment `7028431331` records this and the preview-isolation issue.

### Game integration status
- Zombies vs Heavy Metal is live on production as early access and device-local save only.
- Rocket 2 Nowhere now has a candidate route in PR #22 and PR #23, but remains preview-only. It is based on the owner-supplied single-HTML prototype, not a separate source repository.
- PR #22's auth guard is staging-only and fails closed. PR #23 and #24 are main-based previews; their inherited `account-auth.js` hardcodes the production Supabase project and has an active sign-up path. The Pages deployment environment is `preview`, but that does not prevent the browser script from calling production. This is a critical preview-isolation defect; comments were posted to #23 and #24. Do not test account/auth flows on those preview URLs until guarded.
- Live staging database check: `game_registry` contains only unlisted development row `zombie-invasion-defense`; saves, events and handoff tickets are 0; no challenge, milestone or season tables exist. Shared login/session handoff, cloud saves, and verified LC event ingestion are incomplete.

### Live Supabase state — read-only
- Production `offerwall-gg-postback` v3 remains ACTIVE with `verify_jwt=false`. Its deployed handler calls `process_offerwall_gg_postback`. Both `private.process_offerwall_gg_postback` and `public.process_offerwall_gg_postback` are SECURITY DEFINER, owned by postgres, and grant EXECUTE to `service_role`. The private routine calls `private.post_journal_transaction`; provider callbacks can still mint LC despite the provider row being disabled.
- Production provider row `offerwall_gg` is `disabled`, but retains `standard_virtual_currency / LC / LootCoins` reward metadata and has null approval reference, terms URL and verification timestamp. Production `wallet-summary` v4 remains ACTIVE; `public.get_wallet_summary()` is SECURITY DEFINER and returns cash and LC fields.
- Staging `offerwall-gg-postback` v8 remains ACTIVE with `verify_jwt=false`; its live SQL routine is record-only and contains no journal posting. Staging Offerwall.GG remains disabled with stale LC metadata and no approval/terms; CPAGrip remains disabled; Taplayad is absent. No callback, SQL write, grant change, migration or deployment occurred.
- PR #24's documented revocation targets the exact live signature `(uuid, text, text, bigint, text, text, text, text)`; however it remains a proposed change only. Separate owner approval is still required for production DB revocation and Edge Function deployment.

### Taplayad protocol and permission
- Owner-supplied target remains `https://offerwall.tplayad.com/10066/{user_id}`; the dashboard Active badge is not proof of incentivized-traffic permission or successful integration.
- Current public docs: `https://tplayad.com/docs` describe macros `{user_id}`, `{payout}`, `{reward}`, `{offer_id}`, `{status}`, `{sig}`; status 1=credited and 2=reversed; signature `md5(app_id . user_id . api_secret)`; example deduplication uses `offer_id + user_id`. No transaction-ID macro is listed, and the signature does not bind payout/reward/offer/status/transaction identity.
- Legacy docs: `https://www.tplayad.com/doc/postback` list `transId`, status 1/2, retries up to five times, and signature `md5(subId . transId . reward . secret)`. The two public protocols conflict and neither establishes a complete authenticated app-10066 contract.
- Current public Terms (last updated 2026-10-29) require 18+ and prohibit fraud, but do not establish permission for incentivized traffic or the owner's exact game-only LC model. No account-specific permission was verified. Keep Taplayad unintegrated/record-only until provider confirmation; never map publisher points, `{reward}`, or `{payout}` to LC or cash.

### Owner gates and actions not taken
- Critical owner-gated risks: production Offerwall-to-LC issuance; unprotected `main`; production-targeting branch previews; Taplayad permission and callback contract; public sign-up pause; Terms/Privacy/support and final production release.
- No production/staging settings or secrets, schema/data, SQL grants, provider dashboard, callback, agreement, payment, reward issuance, or deployment was changed. No PR was merged.


## 2026-11-19 21:32 ET — Post-debrief Claude sync verification

- Claude responded to the PR #20 sync request with verifiable PR comment `7028471600`: PR #20 is now head `6e2e51b`, based on integration `387d035`; the staging-only/fail-closed auth guard was preserved. GitHub Actions run `44661202504` passed 58/58 tests, 0 failures/skips.
- Claude also updated the stacked PR #22 to head `332ca07`, based on PR #20 head `6e2e51b`. GitHub Actions run `44661225287` passed 64/64 tests, 0 failures/skips. The PR #22 branch is 2 commits ahead / 0 behind its PR #20 base.
- The integration branch was at `6417323` immediately before this correction; it contains six documentation-only commits after `387d035`. PR #20 is therefore six documentation-only commits behind the integration head at this point. This correction is another documentation-only commit. No further sync request is made in this run to avoid repeated sync churn.
- PR #20 and #22 remain open/unmerged. PR #23 and #24 remain draft, preview-only, with the previously recorded preview-isolation and PR #24 Deno-test blockers. No merge or deployment occurred.


## 2026-11-19 21:33 ET — Preview-auth owner decision recorded

PR #23 discussion comment `7028436334` keeps the RXT2 game PR limited to game files and treats a preview-host guard for main's production `account-auth.js` as a separate owner decision. No fix has been pushed. The owner must authorize a separate non-deploying PR before Account/auth testing is permitted on main-based Cloudflare previews. PR #22 remains staging-only and fail-closed.

## 2026-11-19 22:39 ET — Independent Sync Watch: launch-scope and control recheck

### Verified repository and release candidates
- Integration `build/legitloot-neon-synthwave` is `7b240b2`; production `main` remains `4e0f533`. GitHub returned 25 branch refs. Open PRs are #20, #22, #23, #24 and stale draft #9. PR #20's 15-file application diff is unchanged at head `6e2e51b`; it is eight documentation-only commits behind integration `7b240b2`. Actions run `44661202504` passed 58/58. PR #22 head `332ca07` is stacked on #20 and Actions run `44661225287` passed 64/64. Both remain unmerged.
- PR #22's RXT2 package is static and device-save only; no account, Supabase, wallet, LC, or provider callback code was found. The page discloses early access and no account/LC connection. ZVHM is live on production; RXT2 is preview-only. No shared session/save/event/challenge integration is verified.
- PR #23 remains a draft main-based publish with no Actions run. PR #24 remains a draft containment candidate with no verified Deno test run; its tests import the entrypoint that starts `Deno.serve` at module load. No code fix has been pushed for either blocker.

### Launch failures against owner-locked decisions
- **FAIL — provider-to-LC prohibition:** production Offerwall.GG v3 is still ACTIVE with `verify_jwt=false`; the provider registry row is disabled but the handler does not check it. Production SECURITY DEFINER callback routines grant `service_role` execution and the private routine calls `private.post_journal_transaction`. Provider-to-LC issuance remains possible. No callback was invoked and no containment was deployed.
- **FAIL — no cash/withdrawal model:** production Rewards/Account source and production wallet RPC still contain cash, USD and withdrawal concepts. Staging `get_wallet_summary()` also returns cash buckets and `currency.cash=USD` even though the client ignores those fields; its `currency.gameCredits` label is `LLC` while the visible unit is LC. Public UI is LC-only in PR #20, but the backend contract is not yet clean.
- **FAIL — preview isolation:** PR #23/#24 Cloudflare previews are marked `preview` but inherit main's production Supabase URL and active sign-up handler. Do not use their Account/auth routes. A separate owner-approved preview-host guard PR is required; no fix exists.
- **INCOMPLETE — game platform:** staging game registry has one unlisted ZID development row; saves/events/handoff tickets are zero and no challenge/milestone/season tables exist. The two game candidates are device-save early access only.
- **INCOMPLETE — Hustle/Taplayad:** current provider registry and staging provider rows do not contain Taplayad. Public current and legacy Tplayad docs conflict on URL, macros, signature formula, transaction identity, status binding, and response/retry semantics. No App-10066-specific permission or complete callback contract is verified. Keep it unintegrated/record-only.
- **INCOMPLETE — legal and account onboarding:** production Terms and Privacy remain placeholders, production Account exposes Create Account, and the actual Supabase sign-up pause setting was not retrievable with the current read tools. Do not claim the pause is active.

### Security, environment, and owner gates
- Staging Offerwall.GG callback v8 is record-only; staging wall-URL v5 is JWT-protected but CORS still allows `https://legitloot.site`. Review this cross-environment exception before production integration.
- Security Advisor reports leaked-password protection disabled and an authenticated SECURITY DEFINER warning. Private-schema RLS/no-policy notices are informational; do not add public policies blindly.
- Branch protection was not re-queried; previous audit found all then-listed branches unprotected and no rulesets. GOV-01 remains open.
- No merge, deployment, settings/secret/grant/schema/data change, callback, publisher dashboard change, provider agreement, payment, reward issuance, or money movement occurred.


## 2026-11-19 22:51 ET — PR #24 pure-handler testability fix prepared (NOT DEPLOYED)

- PR #24 remains draft on `main`; candidate head is now `fb2e890`. The original test-import side effect is fixed in the PR branch: new `handler.ts` contains only the inert HTTP 410 handler; `index.ts` alone imports it and starts `Deno.serve`; `index_test.ts` imports the pure handler and checks GET/POST/OPTIONS, `410`, `no-store`, and that POST bodies remain unread.
- Added `.github/workflows/offerwall-gg-containment-tests.yml` to run the Deno test file. No GitHub Actions run has surfaced for the new head yet, so the Deno suite is **not verified**. A local Node 22.16 smoke test against the actual handler passed 3/3 methods; this is not a Deno test result.
- PR comment `7029857955` records the fix and exact test limitation. The endpoint remains inert; no Supabase function was deployed, no SQL grants/settings/secrets/schema/data changed, and no callback was invoked.
- PR #24's separate preview-auth issue remains: its main-based preview inherits production-targeting `account-auth.js`. Do not use Account/auth routes. Production containment still requires separate owner approval.


## 2026-11-19 22:52 ET — PR #24 Deno containment tests passed (NOT DEPLOYED)

- PR #24 remains draft at head `fb2e890`. GitHub Actions run [`44670475596`](https://github.com/demonanic/LegitLoot/actions/runs/44670475596) completed successfully on PR merge commit `f54fc1e`; Deno `2.9.8` ran `index_test.ts`: **3 passed, 0 failed** (GET, POST, OPTIONS; 410/no-store; POST body not read).
- The pure-handler split is therefore test-verified. The run validates only the inert handler and test isolation; it does not verify deployed production containment, SQL grants, callback behavior, provider dashboard settings, or preview auth.
- PR comment `7029857955` was updated with the successful run. PR #24 remains a draft and owner-gated. No merge, deploy, Supabase change, callback, or publisher setting change occurred.

## 2026-11-19 23:02 ET — Independent Sync Watch: launch blockers reconfirmed

- GitHub integration head is `87a28c5`; production `main` is `4e0f533`. PR #20 (58/58) and PR #22 (64/64) retain the previously reviewed application diffs; intervening changes are documentation-only. PR #23 remains a main-based draft with no CI; PR #24 remains a main-based draft whose exact head `fb2e890` passed 3/3 Deno tests. No PR was merged.
- Production Offerwall.GG v3 remains ACTIVE/`verify_jwt=false`; its deployed source calls the live SECURITY DEFINER callback wrapper. The private/public wrappers grant EXECUTE to `service_role`, and the private routine calls the journal writer. The disabled provider row still carries LC reward metadata. This remains a critical violation of the owner-locked no-provider-to-LC rule.
- Production `rewards.html` still describes Offerwall.GG-to-LC issuance and cash rewards/withdrawal states; `account.html` renders cash/withdrawal fields; `account-auth.js` hardcodes the production Supabase target and exposes sign-up. Terms/Privacy remain placeholders. The public production experience is not aligned with the owner-locked LC-only/no-cash model.
- PR #23/#24 Cloudflare previews inherit the same production-targeting auth code. Their preview label does not isolate browser API calls; do not use their Account/auth routes. PR #22's integration preview is staging-only/fail-closed.
- Staging game registry still contains only the unlisted ZID development placeholder; saves/events/handoff tickets are zero and challenge/milestone/season tables are absent. Both selected games are device-save early access only, with no shared account/save or verified LC-event integration.
- Taplayad current and legacy public docs remain incompatible on signed fields, transaction identity, reversals, retries, and response semantics. No App-10066-specific permission for incentivized traffic is verified. Keep unintegrated/record-only and never map publisher points, `{reward}`, or `{payout}` to LC/cash.
- PR #24's test pass makes the inert 410 candidate reviewable for an owner decision, but its SQL is not applied and its handler is not deployed. Production SQL revocation and Edge Function deployment remain separate owner approvals. No production/staging setting, secret, grant, schema/data, callback, provider setting, payment, or deployment was changed.


## 2026-11-20 00:28 ET — Independent recheck after PR #24 production containment

### PROV-07 — Offerwall.GG production issuance path
- **Status:** RESOLVED for the currently deployed production callback/launcher path.
- **Evidence:** PR #24 merged to main as bcc19d; Cloudflare production deployment 75207a07-6306-4461-b115-c6c4a508bd97 succeeded. Production Supabase reports offerwall-gg-postback v4 ACTIVE/verify_jwt=false with an inert HTTP 410 source, and offerwall-gg-wall-url v2 ACTIVE/verify_jwt=true with an inert HTTP 410 source. Read-only SQL reports service_role EXECUTE false on both private/public callback routines and false for the checked anon/authenticated roles.
- **Impact:** The known Offerwall.GG callback path can no longer reach the LC journal-posting routine through the deployed function/checked grants.
- **Remaining caveat:** The provider row remains disabled but retains stale LC metadata and null terms/approval fields; the publisher dashboard callback URL was not changed. No callback or live HTTP probe was made.

### PROV-08 — Repository wall-URL source drift
- **Severity:** CRITICAL
- **Status:** FAIL
- **Evidence:** main/supabase/functions/offerwall-gg-wall-url/index.ts still reads OFFERWALL_GG_PUBLIC_KEY/OFFERWALL_GG_SECRET, signs parameters, authenticates the user, and constructs an https://offerwall.gg/wall/... URL. PR #24's changed-file list does not include this path. The deployed Supabase wall-url v2 source is inert, so repository source and live production source differ.
- **Impact:** A future function redeploy from the checked-in main source can re-enable the obsolete Offerwall.GG launcher.
- **Smallest safe corrective action:** Replace the checked-in source with the same inert 410 behavior and add a source-level regression test plus workflow path coverage. Keep any production deployment owner-gated.
- **Owner approval:** Required for production deployment; documentation and staging-only tests are reversible.

### WALLET-01 / LC-01 — Public rewards and wallet policy
- **Severity:** HIGH
- **Status:** FAIL
- **Evidence:** rewards.html lines 20, 25, 27 still show cash rewards and withdrawal states; account.html lines 4, 15–17 still shows cash wallet/pending/reserved/paid fields; account-auth.js lines 53–70 requires and formats data.cash. Production public.get_wallet_summary() is SECURITY DEFINER and returns cash USD buckets plus LC. earn.html line 9 and earn-providers.js lines 5/23 still say provider completions can credit LootCoins.
- **Impact:** Production pages and API contradict the owner-locked rules: no cash, withdrawals, transfers, USD peg, or provider-offerwall-to-LC issuance; LC must come only from verified in-game milestones, weekly challenges, and seasonal events.
- **Smallest safe corrective action:** Prepare a production-specific, reviewable UI/API contract change that removes cash/withdrawal/USD fields and rewrites provider-to-LC copy. Do not change production schema/data or deploy without owner approval. Add regression tests covering Rewards, Account, Earn, wallet response, and the wall-URL function source.

### AUTH-02 — Account onboarding and legal readiness
- **Severity:** HIGH
- **Status:** NOT VERIFIED / FAIL
- **Evidence:** account.html still exposes Create Account; account-auth.js still calls client.auth.signUp at line 114. terms.html says formal Terms are not yet published; privacy.html says the full Privacy Notice is in preparation. The connected read-only tools did not expose the production Auth sign-up pause setting.
- **Impact:** Public account creation and legal disclosures are not demonstrated ready for launch.
- **Smallest safe corrective action:** Keep public sign-up paused until the actual Auth setting and approved Terms/Privacy are verified. Do not infer the pause from UI copy.
- **Owner approval:** Required for production Auth settings and legal publication.

### GAME-02 — Two-game release
- **Severity:** HIGH
- **Status:** INCOMPLETE
- **Evidence:** Production games.html lists Zombies vs Heavy Metal but still says more worlds later; Rocket 2 Nowhere remains in PR #22 (integration) and PR #23 (draft main-based preview). PR #22 CI passed 64/64; PR #23 has no CI. Staging public.game_registry contains only unlisted zid / zombie-invasion-defense; game_saves, game_events, and game_handoff_tickets each contain zero rows.
- **Impact:** The owner-selected two-game launch is not complete, and shared account/save/reward integration is not available.
- **Smallest safe corrective action:** Complete the integration-branch review and prepare the smallest owner-reviewable RXT2 production candidate; keep production merge/deploy owner-gated. Do not claim shared account, cloud save, or LC event support.

### ENV-07 — Preview isolation
- **Severity:** CRITICAL
- **Status:** FAIL for PR #23; PASS for the authorized integration preview
- **Evidence:** Integration 61e6e2f uses supabase-config.js pinned to staging and account-auth.js fails closed unless the exact staging project config is present. Cloudflare deployment 94108c1a-d95f-4733-a0d5-24658f53b3ad is environment=preview with only the build-branch alias. PR #23's main-based preview inherits production account-auth.js and an active auth.signUp path.
- **Impact:** Account/auth flows on PR #23 can target production from a preview URL.
- **Smallest safe corrective action:** Keep PR #23 Account/auth routes unused; prepare a separate preview-host fail-closed guard only after owner approval.

### HUSTLE/TAPLAYAD-01 — App 10066 provider readiness
- **Severity:** HIGH
- **Status:** NOT VERIFIED / DEFERRED
- **Evidence:** Staging private.providers contains disabled CPAGrip and Offerwall.GG only; Taplayad is absent. Current official docs at https://tplayad.com/docs list no transaction-ID macro and sign only md5(app_id . user_id . api_secret). The legacy /doc/postback URL now returns 404. Current Terms (last updated 2026-10-29) require publishers to be 18+ and refer payment details to the dashboard, but do not establish App-10066-specific permission for incentivized traffic.
- **Impact:** There is no safe basis to authenticate unique conversions, reconcile reversals, or enable App 10066 for LegitLoot's incentivized model.
- **Smallest safe corrective action:** Obtain written App-10066-specific permission and a complete current signed transaction/reversal/retry/idempotency/response contract. Keep record-only; never map the publisher's $1=1 points or {reward}/{payout} to LC.
- **Owner approval:** Required for provider terms, publisher settings, and live integration.

### Security and operational observations
- Production Security Advisor reports leaked-password protection disabled and warns that authenticated users can execute SECURITY DEFINER public.get_wallet_summary(); 12 private-schema RLS/no-policy notices are informational. Review deliberately; do not weaken security or add public policies blindly.
- Staging offerwall-gg-postback v8 remains record-only; staging wall-url v5 is still active and its CORS allow-list includes https://legitloot.site. Staging wallet summary still returns cash USD buckets and labels game credits LLC.
- No production/staging settings, secrets, grants, schema/data, callbacks, provider settings, agreements, payments, or deployments were changed by this recheck.


## 2026-11-20 01:36 ET — Independent Sync Watch #4

- Production Offerwall.GG runtime containment remains verified from the prior check, but canonical `main/supabase/functions/offerwall-gg-wall-url/index.ts` still contains the active launcher. PR #24 did not change it. This remains a source-drift risk for any future production function redeploy.
- Draft PR #25 aligns the integration-branch source with inert HTTP 410 behavior and adds GET/POST/OPTIONS plus static regression coverage. Actions run [44689653386](https://github.com/demonanic/LegitLoot/actions/runs/44689653386): 54/54 passed, 0 failed/skipped; isolated handler test: 3/3 local. PR #25 does not touch `main`, deploy a function, or change Supabase.
- Taplayad App 10066 remains not ready: current docs mismatch `offer={offer_id}` with the PHP example's `offer_id` lookup; the signature does not bind transaction identity or reward/status/payout/offer; there is no transaction-ID macro or documented retry schedule; reversal matching is underspecified; incentivized-traffic permission is not established by current Terms. Preserve the owner-supplied template; do not integrate or map publisher points/callback reward into LC.
- The public-copy/game PRs #20/#22 remain previously reviewed with green 58/64 test runs; the 39-commit gap is docs-only. PR #23 remains draft/no CI and its preview Account/auth route targets production; PR #9 is stale. Production cash/withdrawal UI and API fields, provider-to-LC wording, incomplete Terms/Privacy, unverified sign-up pause, and incomplete shared game/account/LC-event integration remain FAIL/NOT VERIFIED.
- Preview builds for PR #25 are explicitly `environment=preview`, pages.dev-only; the branch pins Supabase to staging and fails closed without that config. No production or staging function deployment or data/settings/secret change occurred.


## 2026-11-20 01:49 ET — Final read-only recheck

- Production Offerwall.GG runtime is contained: deployed wall-url v2 and postback v4 are inert 410 handlers; read-only SQL confirms no checked role can EXECUTE either callback routine. However, production `main/supabase/functions/offerwall-gg-wall-url/index.ts` remains active source and could restore the launcher on a future function redeploy.
- Staging wall-url v5 remains ACTIVE/JWT, reads service-role and Offerwall.GG keys, and returns signed wall URLs. Its CORS allow-list includes the production origin. The registry is disabled, but a direct authenticated caller can still reach it. Staging postback v8 is record-only; both database routines contain no ledger/journal/LootCoin references. No endpoint was invoked or deployed.
- Production and staging provider registries contain disabled Offerwall.GG rows with null approval/terms and stale LC/LootCoins reward metadata. Staging has CPAGrip disabled and no Taplayad row. Do not edit data without owner approval.
- PR #25 is a draft integration-only source correction; its full suite passed 54/54 and its handler tests 3/3 locally. It does not change main or deploy Supabase. Current integration head is `432060b`; PR #25 is five documentation-only commits behind and remains mergeable.
- Current and legacy Tplayad docs are incompatible: current signature `md5(app_id . user_id . api_secret)` omits transaction identity; legacy signature includes `transId` and `reward` and specifies `OK`/`DUP` plus retries. The current sample URL also disagrees with its PHP `offer_id` lookup. App-10066 protocol, reversal linkage, retry behavior and incentivized-traffic approval require written confirmation. Do not integrate or map provider points/rewards/payout to LC.
- PR #20/#22 remain green (58/64 tests) and ready for owner review for integration acceptance only; PR #23 remains draft/no CI with production-targeting Account/auth in its main-based preview; PR #9 remains stale and conflicts with owner-locked game/LC rules.
- Production cash/withdrawal UI and API fields, provider-to-LC copy, incomplete Terms/Privacy, unverified sign-up pause, and missing shared game/account/LC-event integration remain FAIL/NOT VERIFIED.


## 2026-11-20 01:55 ET — Independent Sync Watch #5

### Repository and PR state
- Production main remains `bcc19d`; integration is `42cf97c`. Integration push run [44690472788](https://github.com/demonanic/LegitLoot/actions/runs/44690472788) passed 50/50. PR #20/#22 retain their previously reviewed application diffs and green runs (58/58 and 64/64). Their branch ancestry differs, but the current tree comparison against integration shows only the five shared control documents differ. PR #23 remains draft/no CI and its Account/auth preview targets production. PR #25 is draft/mergeable at `61f9ca8`; Node 54/54 and Deno check/tests pass. Both Cloudflare PR previews succeeded with pages.dev-only aliases.
- Independent COMMENT review [5988741931](https://github.com/demonanic/LegitLoot/pull/25) records a non-blocking test gap: the static reactivation guard does not inspect transitive local imports. Current handler remains inert; harden the test by asserting the exact import graph or recursively scanning local modules.

### Offerwall.GG — current runtime and source
- Production runtime remains contained: wall-url v2 and postback v4 are inert HTTP 410; read-only SQL confirms no checked role can EXECUTE either callback routine. However, production `main/supabase/functions/offerwall-gg-wall-url/index.ts` still contains the old active launcher, so future redeployment from current main could restore it. PR #25 changes integration source only.
- Staging wall-url v5 remains ACTIVE/JWT, reads service-role/provider keys, authenticates callers, signs parameters and returns Offerwall.GG URLs. Its CORS allow-list includes the production origin and integration preview origin; disabled registry status does not block a direct authenticated call.
- Staging postback v8 is ACTIVE/no-JWT and record-only. **New PROV-09:** deployed source signs only `userId:transactionId:currencyAmount`, while `offerId`, `offerName`, `goalId`, `payoutUsd`, and `timestamp` are unsigned. The service-role metadata RPC stores/updates payout and timestamp fields. The private callback routine records events/conversions only and contains no journal/ledger/LC write, so this is a staging reconciliation-integrity defect, not a live LC issuance path. Keep it disabled/record-only; require a complete signed payload and tamper/replay/reversal tests before any future integration.
- Production and staging provider rows remain disabled with null approval/terms references but stale LC/LootCoins reward metadata. No provider data was changed.

### Taplayad App 10066
- Current official guide: [tplayad.com/docs](https://tplayad.com/docs). Signature is `md5(app_id . user_id . api_secret)`; macros include user_id, payout, reward, offer, status and sig; no transaction-ID macro or retry schedule is documented. The sample uses `offer={offer_id}` while PHP reads `offer_id`. Signature does not bind transaction identity, offer, reward, payout or status.
- Host distinction: [non-www legacy URL](https://tplayad.com/doc/postback) returns 404; [www legacy URL](https://www.tplayad.com/doc/postback) resolves and documents `subId/transId/reward`, `MD5(subId . transId . reward . secret)`, status 1/2, `OK/DUP`, and up to five retries after a 60-second timeout. Do not combine protocols by inference.
- Current Terms [updated October 29, 2026](https://tplayad.com/terms) require publishers to be 18+ and leave payment methods/schedules to the dashboard; they do not establish App-10066-specific incentivized-traffic permission. Preserve the owner template exactly and never map publisher points/reward/payout to LC.

### Remaining launch failures
- Production account/rewards pages and `get_wallet_summary()` still expose cash USD buckets and withdrawal states; `earn.html` still describes provider-confirmed LC. Terms/Privacy remain placeholders; signup pause is unverified. Production `games.html` lists only Zombies vs Heavy Metal; Rocket 2 Nowhere remains preview/integration-only. Shared account/session, cloud-save and verified LC-event integration remain incomplete.
- No PR merge, deployment, Supabase settings/secrets/grants/schema/data changes, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred in this run.


## 2026-11-20 01:56 ET — Documentation CI correction

- The push workflow for documentation commit `5236e7e` ran the full Node suite successfully (50/50) but failed `git diff --check` on trailing spaces in the updated `Last updated` and `Last verified` metadata lines. Follow-up documentation commit `c25df5c` removed those spaces; Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) then passed 50/50 and the whitespace check. No application files or tests changed.


## 2026-11-20 01:57 ET — Documentation CI verified

- Follow-up commit `c25df5c` is the current integration head. Actions run [44692358619](https://github.com/demonanic/LegitLoot/actions/runs/44692358619) completed successfully: Node suite 50/50 and `git diff --check` passed. The prior run [44692216892](https://github.com/demonanic/LegitLoot/actions/runs/44692216892) had the same 50/50 tests but failed only on the two metadata trailing-space lines now corrected.
- PR #25 remains draft and integration-only; its base `e868121` is now eight documentation-only commits behind integration. Application files did not change in the follow-up; no resync is needed solely for documentation.


## 2026-11-20 03:31 ET — Independent launch-readiness recheck

- Production Offerwall.GG issuance remains contained: deployed wall-url v2 and postback v4 return inert 410; checked callback routine EXECUTE is false for service_role, anon and authenticated; callback/conversion counts are zero.
- Staging is not fully contained: wall-url v5 remains active/JWT with production-origin CORS; postback v8 remains active/no-JWT and record-only. The HMAC covers only user ID, transaction ID and amount; unsigned payout/timestamp metadata is still updated on duplicate callbacks. This is a reconciliation-integrity risk, not current LC issuance.
- Integration source drift: `supabase/functions/offerwall-gg-postback/index.ts` remains active record-only while production `main` uses an inert handler; production `main` wall-url source still contains the old launcher. PR #25 aligns only the integration wall-url source. Both source entrypoints must be aligned before future promotion.
- The staging schema snapshot README was corrected because `routines.sql` still contains the pre-record-only journal-posting routine even though the applied migration history and live staging DB show record-only behavior.
- Taplayad public docs currently lack transaction identity and a retry schedule; both legacy postback URLs return 404. Exact App-10066 URL, signature coverage, reversal/retry contract and incentivized-traffic permission remain unverified. Keep provider disabled and do not map provider points/reward/payout to LC.
- Production launch remains NOT READY: prohibited cash/withdrawal UI and API fields, provider-to-LC copy, incomplete Terms/Privacy, unverified signup pause, Rocket 2 Nowhere absent from production listing, and missing shared account/save/LC-event integration.
- No PR merge, deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement was performed.


## 2026-11-20 04:39 ET — Independent Sync Watch #7

### Offerwall.GG

**Production runtime is contained, but source and staging are not.**
- Production wall-url v2 and postback v4 are deployed inert HTTP 410 handlers. Checked EXECUTE privileges on private/public process_offerwall_gg_postback are false for service_role, anon and authenticated. Production callback/conversion tables are both zero.
- Production main's wall-url source remains the old active URL generator; main's postback source is inert. A future wall-url redeploy from main could restore the old launcher.
- The integration branch still has an active wall-url source and an active record-only postback source. PR #25 head 135607e makes only the wall-url source inert and adds recursive local-import regression scanning. It remains draft; Node and Deno Actions runs 44713338718 and 44713338856 passed. Do not describe PR #25 alone as full Offerwall closure.
- Deployed staging wall-url v5 remains ACTIVE/JWT; its CORS allow-list includes the production site and full build preview origin. Staging postback v8 remains ACTIVE/no-JWT and record-only. The HMAC covers only userId:transactionId:currencyAmount; offerId, offerName, goalId, payoutUsd and timestamp are unsigned and sent to metadata storage even after a duplicate result. Live staging routines are SECURITY DEFINER and service_role-executable but contain no journal, ledger or LootCoin references. Staging callback/conversion counts are zero. This is a reconciliation-integrity risk, not current LC issuance.
- Production/staging Offerwall.GG provider rows remain disabled with null approval/terms but stale standard_virtual_currency / LC / LootCoins metadata. Staging CPAGrip is disabled; no Taplayad row exists. The staging schema snapshot routines.sql is stale for Offerwall.GG and must not be replayed.

### Launch policy and website

- Production wallet-summary v4 and public.get_wallet_summary() still expose USD cash buckets; staging public.get_wallet_summary() also exposes cash USD buckets and labels gameCredits as LLC. The LC-only integration UI ignores those fields, but the server contract still violates the owner-locked no-cash/no-withdrawal model.
- Production account.html/rewards.html still expose cash/withdrawal UI. Production earn.html still describes provider-confirmed LC. Production account-auth.js still hardcodes production Supabase and exposes signup. The production signup pause is not verifiable through the available read-only auth tools.
- Production Terms and Privacy pages remain placeholders. Account deletion/export is not implemented; the draft account-deletion design is not an implementation.
- Production games.html lists Zombies vs Heavy Metal only. ZVHM is live early access with device-local saves; Rocket 2 Nowhere is playable in preview only. Both still lack shared account/session handoff, cloud saves and verified LC-event ingestion.

### PRs, previews and CI

- PR #20 head 6e2e51b/base 387d035: 58/58 Actions passed. Its body cites stale head/base/test evidence; comment 7036351593 records the correction. PR #20's integration UI is LC-only, but backend cash fields remain.
- PR #22 head 332ca07: 64/64 Actions passed; stacked on #20.
- PR #23 head 33a5240: draft, no CI. Cloudflare classifies both Pages deployments as previews with pages.dev-only aliases, but the bundle includes account-auth.js hardcoded to production Supabase and active signup, with no preview environment variables. This violates preview isolation. Comment 7036403044 records the blocker.
- PR #25 head 135607e: draft/mergeable; Node test/whitespace workflow and Deno type-check/handler workflow passed. Both Pages previews for this exact head are environment=preview and pages.dev-only. PR #25 is 20 commits behind current integration by ancestry; the 20 base-to-integration commits touch only six shared documentation files.

### Taplayad App 10066

- Current official docs at https://tplayad.com/docs (checked 2026-11-20) specify md5(app_id . user_id . api_secret), status 1/2, any-2xx acknowledgement, no transaction-ID macro and no retry schedule. The sample URL uses offer={offer_id}, while the PHP example reads offer_id.
- The cached www legacy postback page appears in search but direct fetch of https://www.tplayad.com/doc/postback returns 404. Do not use its historical subId/transId protocol.
- Current Terms at https://tplayad.com/terms were last updated 2026-10-29, require publishers to be 18+, and defer payment methods to the dashboard. General rewarded-offerwall product language exists, but App-10066-specific permission for LegitLoot's placement/traffic was not verified.
- Preserve the owner URL exactly: https://offerwall.tplayad.com/10066/{user_id}. Do not map the $1=1 points multiplier or callback reward/payout to LC.

### Coordination and actions

- The only standalone Claude handoff in docs remains CLAUDE_START_HANDOFF_M1.md. Verified Claude commits remain PR #20 head 6e2e51b, PR #22 head 332ca07 and PR #23 head 33a5240; no newer Claude-authored commit was found after the 03:31 ET check. PR #25 test commit 135607e is authored by demonanic.
- Comments added: PR #20 comment 7036351593; PR #23 comment 7036403044; PR #25 comment 7036350760.
- No PR merge, deployment, Supabase settings/secrets/grants/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred. Cloudflare preview builds were automatic branch previews only.


## 2026-11-20 04:55 ET — Critical ZVHM identity finding

The earlier statement that ZVHM is live on production as early access is corrected. The production route exists, but its iframe target is the owner-excluded repository:
- Production main and PR #22 use zombies-vs-heavy-metal.html with iframe src https://demonanic.github.io/Legitloot-2/.
- Platform Build Spec §0.4 explicitly states demonanic/Legitloot-2 is Zombie Invasion Defense and is not a substitute for Zombies vs Heavy Metal.
- PR #22 games.html calls both games playable; tests/launch-games.test.mjs explicitly asserts the excluded URL and hides the excluded game's name from the catalog. The 64/64 test pass therefore codifies the wrong identity.
- PR #22 is not ready for owner acceptance until the actual selected ZVHM source/build is identified and the card/route/test are corrected. Do not use the excluded repo or label it as ZVHM.
- Rocket 2 Nowhere is a separate self-contained in-repo preview build at games/rocket-2-nowhere/index.html; device-local saves only, no shared account or LC.
- Blocking review comments: PR #22 comments 7036549802 and 7036564753. No code or deployment was changed.


## 2026-11-20 05:13 ET — Independent Sync Watch #8

### Repository, branches, PRs, and Claude handoffs

- Production main is bcc19d6; authorized integration is 56b98e4. The repository has 26 branches and GitHub reports protected:false for all. Integration Actions run [44715079355](https://github.com/demonanic/LegitLoot/actions/runs/44715079355) passed.
- Open PRs: #20 (58/58), #22 (64/64 but blocked by wrong ZVHM identity assertion), #23 (draft/no CI, production-connected Account/auth preview), #25 (draft, 54/54 Node plus Deno checks; staging deployment-source coverage gap), and stale #9. PR #21 and #24 were merged by owner account demonanic.
- PR #21 head 970dbbf is a verifiable Claude-authored commit; it was merged by the owner account at 00:24:04 UTC and deployed to production at 00:24:36 UTC. Its wrapper embeds demonanic/Legitloot-2, which Platform Build Spec §0.4 explicitly excludes as Zombie Invasion Defense. Do not call this the selected ZVHM game. PR #22's tests/launch-games.test.mjs asserts that excluded URL; comments 7036549802 and 7036564753 remain blocking.
- PR #23 Cloudflare deployment 5c3dd1bf is environment=preview, branch claude/rxt2-main, alias claude-rxt2-main.legitloot.pages.dev, and has empty environment variables. Its Account/auth bundle inherits production Supabase from main. Comment 7036403044 remains current.
- The only standalone Claude handoff found is docs/CLAUDE_START_HANDOFF_M1.md. No newer handoff note or Claude-authored commit after PR #23 was verified. PR #25 commit 135607e is authored by demonanic, not Claude.

### Offerwall.GG — production, staging, and source integrity

- Production Supabase: wall-url v2 and postback v4 are deployed inert HTTP 410 handlers. Checked private/public callback routine EXECUTE is false for service_role, anon and authenticated. Production Cloudflare deployment 75207a07 on bcc19d6 succeeded at 04:11:50 UTC.
- Production main's wall-url source still contains the old active launcher; main's postback source is inert. Integration canonical wall-url and postback sources remain active. PR #25 aligns only wall-url and remains draft.
- Staging Supabase: wall-url v5 ACTIVE/JWT; postback v8 ACTIVE/no-JWT record-only. I re-read deployed source and compared it byte-for-byte with supabase/environments/staging/functions/offerwall-gg-wall-url/index.ts and offerwall-gg-postback/index.ts; both are exact matches. Wall-url CORS allows https://legitloot.site and creates signed provider URLs. Postback HMAC covers only userId:transactionId:currencyAmount; offer/goal/payout/timestamp metadata is unsigned. Live callback routines are service_role-executable but contain no journal/ledger/LootCoin references; callback/conversion counts remain zero.
- **New PR #25 review finding:** tests/staging-function-origins.test.mjs deliberately excludes supabase/environments/* snapshots, but those snapshots exactly match the active staging deployments. Added actionable comment [7037024928](https://github.com/demonanic/LegitLoot/pull/25#issuecomment-7037024928) requesting a separate deployment-source/manifest guard. No function or setting was changed.

### Wallet, launch scope, and provider readiness

- Production and staging public.get_wallet_summary() still return cash USD buckets. Production RPC uses lootCoins.available; staging returns gameCredits labeled LLC. Deployed production wallet-summary v4 also returns cash and gameCredits/LLC, a different response shape from the production RPC; repository code search found no current page caller. Production Account/Rewards/Earn pages and main account-auth.js still expose cash/withdrawal or provider-to-LC behavior.
- Rocket 2 Nowhere remains a preview-only in-repo build with device-local saves and no shared account/LC integration. The selected ZVHM source remains unverified; the production wrapper is the excluded ZID repository.
- Taplayad App 10066 remains unintegrated. Current docs specify md5(app_id . user_id . api_secret), status 1/2 and any-2xx acknowledgement, but no transaction-ID macro or retry schedule. The sample parameter mismatch remains; direct legacy postback page returns 404. Current Terms do not establish App-10066-specific incentivized-traffic permission. Preserve https://offerwall.tplayad.com/10066/{user_id}; never map publisher points or callback reward/payout into LC.

### Actions and restrictions

- This run was read-only for GitHub, Supabase and Cloudflare. One actionable comment was added to PR #25. Shared documentation was updated on the authorized integration branch.
- No PR merge, production/staging deployment, Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.

## 2026-11-20 05:14 ET — Documentation CI correction

- Documentation commit 4f3ed99 passed npm test but failed the whitespace check only: MASTER_EXECUTION_CONTROL.md lines 8/65 had trailing spaces and this file had an extra blank line at EOF. The exact formatting issues were removed in the follow-up documentation-only commit. The follow-up CI result is pending.

## 2026-11-20 05:15 ET — Documentation CI follow-up

- Run 44719451991 passed npm test and failed only the whitespace check because the five updated records had an extra blank line at EOF. Follow-up commit 46be8d7 trimmed each updated record to a single final newline; Actions run 44719817398 passed npm test and whitespace checks.


## 2026-11-20 06:28 ET — Sync Watch #9: rollback safety and current state

### New release-runbook defect
The Edge Function rollback row previously said to redeploy the previous version's source and referenced production snapshots for Offerwall.GG postback v3 and wall-url v1. The manifest confirms those snapshots were captured before containment and contain active provider code. Current production is postback v4 and wall-url v2, both inert HTTP 410. Restoring v1/v3 could reactivate the provider launcher/callback code; the private production callback routine still contains journal/ledger posting code even though checked EXECUTE grants are revoked. Corrected `docs/RELEASE_RUNBOOK.md` to prohibit v1/v3 rollback and require preservation of the inert v2/v4 handlers. Current deployed source hashes are recorded in the Environment Source of Truth. The current inert sources are not yet archived in the historical snapshot directory.

### Live environment verification
- Production `gkbqderyjcuxnjbsiffb`: postback v4/410, wall-url v2/410; callback EXECUTE false for service_role/anon/authenticated; callback/conversion counts 0/0. `public.get_wallet_summary()` still returns cash USD buckets, and wallet-summary v4 still returns cash plus gameCredits/LLC.
- Staging `scmnxcsggquwtuyyjnnj`: wall-url v5 active/JWT with `https://legitloot.site` in CORS; postback v8 active/no-JWT and record-only. The deployed files exactly match the staging source snapshots. Private/public callback routines are SECURITY DEFINER and service-role executable, but their live definitions contain no journal/ledger references. The postback HMAC omits offer/goal/payout/timestamp fields and the metadata RPC runs after duplicate results. Callback/conversion counts 0/0.
- Both provider registries retain a disabled Offerwall.GG row with null approval/terms and stale LC/LootCoins reward metadata. Taplayad remains unregistered and unintegrated.

### GitHub and release state
- Integration `6fc8e48` passed Actions run 44719973348; production main `bcc19d6` passed containment run 44672601131. PR #20 58/58 and PR #22 64/64 remain green on exact heads but have existing blockers; PR #23 is draft/no CI and production-connected for Account/auth; PR #25 is draft with 54/54 Node and passing Deno checks. PR #25's direct GitHub REST state is `mergeable=true/clean`; a normalized connector summary reported false, so no mergeability claim is used as approval.
- 26 branches report `protected=false`. M2 task branches are stale relative to integration; the M2-T3 branch has a duplicate record-only migration under obsolete version `20261119120000`, while staging applied `20261119145340`. The MIG-02 source/test, account-deletion design, and release runbook are already present on integration. Only the historical M1 Claude handoff note exists.
- Known launch blockers remain: incorrect ZVHM source identity, RXT2 preview-only, production-connected PR #23 auth, cash/withdrawal wallet contract and copy, incomplete Terms/Privacy, unverified signup pause/support mailbox, and missing shared account/save/verified LC-event integration.

No PR was merged and no deployment, Supabase setting/secret/grant/schema/data change, callback, provider setting/terms acceptance, payment, reward issuance, or money movement occurred. This check made read-only inspections and documentation-only corrections.


## 2026-11-20 06:36 ET — Hustle publisher selection review

- New owner-locked mismatch found in PR #20's effective Hustle UI: `earn-providers.js` lines 61–75 still registers Offerwall.GG as the first provider with a pending_approval state and an `offerwall-gg-wall-url` launch function; lines 79–87 also register CPAGrip as testing. No Taplayad entry exists. `earn-hub.js` lines 13–14 and 113–128 will open any provider changed to active when it has a launch block. The public-copy test `tests/hustle-public-copy.test.mjs` checks LC language but does not assert the owner-selected initial publisher.
- Posted actionable owner-lock finding to PR #20: comment [7038570385](https://github.com/demonanic/LegitLoot/pull/20#issuecomment-7038570385). Requested Taplayad App 10066 as the sole initial pending/unavailable provider, no launch function until permission and full protocol readiness, removal of Offerwall.GG/CPAGrip from the initial provider list unless separately approved, and a regression test. No publisher settings were saved and no terms accepted.
- Fresh official Tplayad docs check: signature is `md5(app_id . user_id . api_secret)`; status 1/2 means credited/reversed; no transaction-ID macro is listed; any 2xx acknowledges delivery; server IP is `176.97.212.58`. The sample URL uses `offer={offer_id}` while the PHP example reads `offer_id`; the generic iframe path is `https://app.tplayad.com/app/iframe/{APP_ID}/{USER_ID}`, different from the owner-supplied `https://offerwall.tplayad.com/10066/{user_id}`. Terms last updated 2026-10-29 require publishers to be 18+ and do not expressly mention incentivized traffic. Treat permission and transaction/reversal semantics as unverified; provider points/reward/payout never map to LC.


## 2026-11-20 06:41 ET — PR #26 independent review and current PR state

- **New Claude-authored PR #26 verified:** `claude/hustle-taplayad-pending` head `778081a8d7`, one commit authored by `claude`, 4 files changed. It is stacked on PR #20 (`claude/hustle-rename`) and explicitly says it must be retargeted to integration after #20 merges. Do not merge independently. PR #26 is open, non-draft, and GitHub REST reports mergeable/clean.
- The code changes the Hustle registry to Taplayad as the sole initial provider, `pending_approval`, `launch: null`, with the exact owner URL stored in `recordedTemplate` only. Offerwall.GG and CPAGrip are removed from the initial provider list. No provider callback, wall launch, Supabase, provider settings, terms acceptance, or LC issuance was added. This directly addresses PR #20 comment 7038570385.
- GitHub Actions run [44729353808](https://github.com/demonanic/LegitLoot/actions/runs/44729353808) passed **59/59 Node tests** and the whitespace check. Cloudflare reported successful branch-preview deployments for both `legitloot` and `legitloot-preview` projects; both URLs are pages.dev preview aliases, not production. `tests/earn-hub.browser.py` was updated but the PR body says it was not run. A separate read-only browser inspection could not be completed because Browser Use credits were unavailable; no interactive preview validation is claimed.
- Independent PR #26 review comment [7038633862](https://github.com/demonanic/LegitLoot/pull/26#issuecomment-7038633862) is non-blocking: clarify the inherited phrase “ledger tests” so it cannot imply provider-to-LC posting, and strengthen the static guard from `ledger_entry` to generic `ledger` detection. No active launch/LC path was found in the PR.
- PR #25 remains draft. Its base is now 47 commits behind current integration; the base-to-integration diff contains documentation files only. Current GitHub REST returns `mergeable=null` / `mergeable_state=unknown`, so mergeability is indeterminate; no merge was attempted.
- Open PRs are #9, #20, #22, #23, #25 and #26. Branch count is 27; every branch still reports `protected=false`. PR #23 remains draft/no CI with production-targeted Account/auth on its preview. PR #22 retains the ZVHM identity/test blocker. No new standalone Claude handoff was found; PR #26 is the new verified Claude-authored artifact.
- The documentation-only update sequence passed GitHub Actions through run [44729867195](https://github.com/demonanic/LegitLoot/actions/runs/44729867195), including npm tests and whitespace checks; no application code changed. PR #26's branch previews are not production deployments.
- No PR was merged, no production/staging deploy was initiated, and no Supabase setting/secret/grant/schema/data change, callback, publisher setting, provider agreement, payment, reward issuance or money movement occurred.

## 2026-11-20 10:30 ET — Status update (history above preserved)

- **GAME-02 resolved:** `demonanic/Legitloot-2` is the owner-approved Zombies vs Heavy Metal (owner decision 2026-11-19 19:40 ET, re-confirmed 2026-11-20; blocker withdrawn in PR #22 comment 7041463948).
- **Rocket 2 Nowhere is live:** production `main` `801f3e7` (PR #23, owner-approved); production deployment confirmed. Early access, device-local saves, no account/LC connection.
- **ENV-07 open (owner decision):** main-based previews inherit `account-auth.js` that targets production Supabase and exposes signup; see `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` 2026-11-20 10:30 ET. Do not use Account/auth routes on them.
- **M2-T4 remains IN PROGRESS:** shared account/session handoff, cloud saves and server-verified idempotent LC-event ingestion are not implemented.

## 2026-11-20 11:14 ET — Recheck (10:30 ET entry above preserved)

- Production is `main` @ `801f3e7`, Cloudflare deployment `fe4c0f22`. PR #23 is merged; open PRs are #9, #20, #22, #25, #26 and #27.
- ENV-07 remains open: Cloudflare preview `fdf6b609` (`main@801f3e7`, `main.legitloot-preview.pages.dev`, no environment variables) inherits `account-auth.js` that hardcodes production Supabase and exposes signup. Keep Account/auth routes off it. Owner decision pending on a separate fail-closed PR against `main`.
- GAME-02 stays resolved. PR #22's ZVHM URL assertion is consistent with the owner decision (comment 7041463948).
- M2-T4 remains IN PROGRESS: shared account/session handoff, cloud saves and server-verified idempotent LC-event ingestion are not implemented.
- Branch protection: 26 of 28 refs checked (05:13 ET, all unprotected); two newer refs unchecked.

## 2026-11-20 11:28 ET — Owner decision: Offerwall.GG permanently retired from launch scope

Offerwall.GG is removed from the future LegitLoot provider plan. The owner explicitly chose full retirement rather than further containment/repair. The retirement acceptance contract is docs/security/OFFERWALL_GG_RETIREMENT.md.

Required verification before marking the provider retired: no active UI/registry/launcher or callback path; canonical and staging snapshot functions inert; no staging RPC/privilege path can mint or mutate LC; deployment manifest guard prevents reactivation; LegitLoot placement postback URL removed and placement disabled/deleted in the Offerwall.GG dashboard. Preserve historical evidence and tables. Do not delete the publisher account.

Current state is NOT COMPLETE: production runtime containment (inert v2/v4, callback grants revoked) was previously recorded, but main source drift and active staging wall-url source/deployment require retirement work. Production changes remain owner-gated. Dashboard removal is pending because browser access was unavailable in this session. Taplayad App 10066 remains separate and pending its own permission/protocol checks.
## 2026-11-20 12:51 ET — Independent launch-readiness recheck

- **Games:** production `main` @ `801f3e7` is deployed as `fe4c0f22`. `games.html` links to `zombies-vs-heavy-metal.html` and `rocket-2-nowhere.html`; both pages disclose early access, device-local saves and no LegitLoot account/LC connection. Account/session handoff, cloud saves and server-verified LC events remain launch blockers.
- **Offerwall.GG:** owner reports the postback URL has been removed from all attempted/successful publisher placements. This is owner attestation; placement disable/delete and independent dashboard evidence are not verified. Staging still has active wall-url v5/JWT and postback v8/no-JWT; disabled provider rows retain stale LC reward metadata. Full retirement is not complete.
- **ENV-07 — CRITICAL:** active preview `fdf6b609` from `main` @ `801f3e7` remains at `main.legitloot-preview.pages.dev`. It has no environment variables, but main `account-auth.js` hardcodes production Supabase and exposes signup. Do not use Account/auth routes on main-based previews. Integration auth is explicitly staging-only.
- **WALLET-01 — HIGH:** production `public.get_wallet_summary()` still returns cash USD buckets alongside LC; production account/rewards/earn source still exposes cash/withdrawal or provider-to-LC copy. No cash, withdrawal, transfer, USD peg, or provider-to-LC behavior is permitted by owner policy.
- **GAME-EVENT readiness:** staging `public.game_registry` contains only the unlisted `zid` placeholder; `private.game_events`, `game_saves`, and `game_handoff_tickets` each have zero rows. A generic client-submitted JSON event is not proof of game completion. Wait for trusted game-side event contracts before any LC eligibility work.
- **TAPLAYAD:** official docs still lack an immutable transaction ID, retry schedule, and signature coverage for offer/reward/payout/status; Terms last updated 2026-10-29 do not expressly establish incentivized-traffic permission. App 10066 remains pending and must never map points/reward/payout to LC.
- **GOV-01 — HIGH:** all 28 GitHub refs report `protected:false`; repository rulesets are empty. PR #27 documentation branch passed Actions on exact head but is diverged/dirty and requires rebase. No PR merge or deployment was performed.

## 2026-11-20 14:45 ET — Claude record refresh (amended 15:20 ET per Sync Watch #13; history — superseded by the 16:28 ET entries) (PR #28/#29 evidence; Sync Watch #12 facts)

- **Repository:** production `main` `801f3e7` (owner-approved PR #23 publish); integration `1466eb6` at this sync (authorized baseline `a529b35` plus documentation-only commits; PR #29 is accepted at `0014d3a` for source-only review at 14:43 ET, review 5998408454). 30 refs all `protected:false`; rulesets empty. Do not describe `main` as protected.
- **Open PRs:** #9 stale draft; #20 (head `6e2e51b`, 58/58) with #22 (`332ca07`, 64/64) and #26 (`778081a`, 59/59) stacked on it; #25 superseded draft (demonanic); #27 this documentation sync; #28 ENV-07 guard (draft to `main`); #29 Offerwall.GG retirement (integration). #20 must not be released alone: the combined release needs the LC-only UI plus the Taplayad-only pending registry from a reviewed exact head.
- **PR #28 (`93f62ac`):** Actions run 44791797759 passed; accepted by DaVinci for **owner review only**. The existing `main.legitloot-preview.pages.dev` deployment still runs the unguarded production-Supabase auth until the owner approves a production merge/deploy. Client-side defense-in-depth only.
- **PR #29 (source only; DaVinci ACCEPTED source-only at `0014d3a` in review 5998408454, then raised a test-evidence-wording CHANGES REQUIRED follow-up, comment 7049589082 — acceptance is therefore qualified):** previous head `cb1f999` got CHANGES REQUIRED solely because the proposed staging SQL rollback reactivated record-only callback RPCs, re-granted `service_role` and restored stale provider metadata. Fixed at `0014d3a`: the SQL header is now a **forward-only, fail-closed recovery plan**; test added (Actions 44802436878 / 44802436895 success). Follow-up fixed at `230b7bf` (tests only): the staging routine snapshot is labelled **historical pre-record-only evidence**, not current deployment state, with a guard test (Actions Node/whitespace 44809587659, Deno 44809587433 success). Re-review of `230b7bf` requested. Nothing deployed or applied; SQL stays unapplied until the exact staging ref and recovery plan are independently checked.
- **Offerwall.GG dashboard evidence:** owner-provided screen recording (PR #29 comment 7047980474): five visible placements with postback fields cleared, including a successful save on the remaining Pending placement. **Not an independent readback**; placement disable/delete remains PARTIAL/UNVERIFIED.
- **Production blockers unchanged:** Earn label, CPAGrip `testing` with provider-set LootCoin copy, no Taplayad entry; cash/withdrawal fields in account/rewards and `get_wallet_summary()`/wallet-summary cash contracts (WALLET-01); incomplete Terms/Privacy; unverified signup pause; Taplayad written confirmation and incentivized-traffic permission missing (keep record-only; never map points/reward/payout to LC).
- **M2-T4:** IN PROGRESS. Both games are early access with device-local saves and no account/LC link. M2-T4b-R1 is accepted as design only; no code, registry row or endpoint exists.
- **Owner gates (unchanged):** production merge/deploy (including PR #28), production config/data, staging deploy/SQL application for retirement, provider agreements/activation, paid commitments, live money/reward movement, signup/legal decisions, branch protection.
- No merge, deploy, SQL application, callback, provider setting, secret change or money movement occurred.
- **Verification vs edit time:** this refresh edited records only. Live Supabase/Cloudflare state was **not** re-verified; inventory entries above are carried forward from the last independent verification (Sync Watch 2026-11-20 12:51 ET; Sync Watch #12 14:23 ET for repo/PR state).
- **Taplayad App 10066 (Sync Watch #13 / DaVinci, 15:07 ET):** current official docs (tplayad.com/docs) define `md5(app_id . user_id . api_secret)`, status 1 credited / 2 reversed, any-2xx acknowledgement and `offer_id + user_id` deduplication, but no immutable transaction ID or retry schedule; the signature does not bind offer, reward, payout or status. The sample URL uses `offer={offer_id}` while its PHP example reads `$_GET['offer_id']`. The indexed legacy page (`www.tplayad.com/doc/postback`, conflicting `md5(subId . transId . reward . secret)`, OK/DUP, retries) returns 404 when opened directly: treat it as **unverified, not a second protocol**. Terms (updated 2026-10-29) require 18+ and prohibit fraud but do not expressly permit LegitLoot's incentivized-traffic model or an App-10066 placement. Required: written support confirmation of exact parameter names, full signature byte sequence, immutable transaction identity, retry/ack/duplicate behavior, reversal linkage and explicit permission. Until then Taplayad stays `pending_approval`, `launch: null`, owner template record-only; never map points/reward/payout to LC.
- **Cloudflare read-only check (DaVinci, 15:07 ET; carried into this record, not re-run by Claude):** PR #27 (`418b0d8`) and PR #29 (`0014d3a`) previews succeeded in both Pages projects as `environment=preview` with pages.dev aliases; production deployment `fe4c0f22` is `main@801f3e7` at `legitloot.site`. **ENV-07 remains critical:** main-based preview `fdf6b609` is `environment=preview`, branch `main@801f3e7`, alias `main.legitloot-preview.pages.dev`; main `account-auth.js` line 2 hardcodes production Supabase, line 4 creates the client, line 114 exposes `auth.signUp()`. PR #28's guard is draft/unmerged; keep Account/auth routes off that preview. Supabase was not queried; the 12:51 ET last-verified time is carried forward.

## 2026-11-20 16:28 ET — Fresh read-only evidence from DaVinci (16:17 ET); recorded by Claude, not re-run

- **Supabase (read-only, DaVinci):** both projects ACTIVE_HEALTHY. Production Edge Functions: postback v4 / wall-url v2 tombstones and wallet-summary v4. Staging: postback v8 and wall-url v5 ACTIVE plus CPAGrip v5. Staging callback routines remain record-only with `service_role` EXECUTE; the staging Offerwall.GG provider row is disabled but retains stale LC reward metadata. Production's private callback routine still contains the historical LC journal-posting body, although EXECUTE is false for anon/authenticated/service_role; its provider row also retains stale LC metadata. Production and staging `get_wallet_summary()` still return cash/USD buckets (staging labels game credits LLC). Staging `game_registry` has only the unlisted `zid` placeholder; `game_events`, `game_saves`, `game_handoff_tickets` are empty. No SQL, data, settings, grants or functions were changed.
- **Cloudflare (read-only, DaVinci):** production `legitloot` remains `main@801f3e7`, deployment `fe4c0f22`, alias `legitloot.site`. PR #27 `a6ef02d` and PR #29 `230b7bf` built successfully in both Pages projects as `environment=preview`, pages.dev aliases, no deployment env vars. The main-based preview `fdf6b609` (`main@801f3e7`, `main.legitloot-preview.pages.dev`, no env vars) still runs `account-auth.js` with the hardcoded production Supabase project and `auth.signUp()`. **ENV-07 remains critical;** keep Account/auth off that preview; PR #28 is draft and owner-gated.
- **Taplayad (DaVinci, re-checked today):** unchanged: `md5(app_id . user_id . api_secret)`, statuses 1/2, any-2xx ack, suggested `offer_id + user_id` dedupe; signature does not bind offer/reward/payout/status; no immutable transaction ID or retry schedule; `offer={offer_id}` vs PHP `offer_id`; Terms (2026-10-29) grant no express incentivized-traffic permission. App 10066 stays `pending_approval`, owner template record-only; never map points/reward/payout to LC.
- **Last-verified bookkeeping:** this entry records DaVinci's 16:17 ET read-only observations; Claude did not query Supabase or Cloudflare. Earlier inventory in this file is carried forward from the last independent verification unless superseded here.
- No merge, deploy, SQL application, callback, provider setting, secret change or money movement occurred.

## 2026-11-20 16:28 ET — Claude record sync to DaVinci's 16:17–16:26 ET findings (PR #27 review)

- **PR #29 exact heads:** `0014d3a` source-only acceptance (qualified) -> `230b7bf` incomplete test wording -> `24950f3` historical-only test correction **accepted by DaVinci** (Node 44819720446, Deno 44819720582) -> `dad8fd7` fixes the last finding, the proposed SQL label "reversible" -> "non-destructive, no data deleted; forward-only", with a regression assertion (Node 44820230399, Deno 44820229990 pass). Re-review of `dad8fd7` requested. SQL unapplied; functions undeployed.
- **Branch previews are staging-bound (DaVinci source inspection, 16:17 ET):** the PR #27 and PR #29 branches' `supabase-config.js` selects the staging project and `account-auth.js` fails closed unless the environment is `staging` and the URL matches that exact staging project before `createClient`. These previews are therefore not production-bound. This does **not** apply to the main-based preview `fdf6b609` (`main@801f3e7`, `main.legitloot-preview.pages.dev`): main `account-auth.js` still hardcodes the production Supabase project and exposes `auth.signUp()`. **ENV-07 remains critical**; keep Account/auth off that preview; PR #28 is draft and owner-gated.
- **Next:** after #29 and #27 re-review, review #20 + #22 + #26 as one release unit (do not release #20 alone). No merge, deploy, SQL application, provider activation or financial action occurred.

## M2 recheck — 2026-11-20 17:30 ET — Sync Watch #15

**Overall disposition: NOT READY for basic-operable launch.** This was a read-only source, GitHub, Cloudflare and Supabase review; no deployment, database change, provider action or financial activity occurred.

### Verified progress
- Production `main@801f3e7` is live at `https://legitloot.site`; both owner-selected games are present as early access with device-local saves.
- PR #29 exact current head `cfe9f0a` is **ACCEPTED by DaVinci for source-only owner review**. The follow-up changes only SQL/documentation wording and a static test; exact-head Node/whitespace `44831268131` and Deno `44831268125` pass. Browser test `tests/earn-hub.browser.py` remains unrun. Its Offerwall.GG handlers are pure HTTP 410 tombstones, launcher removal is present, and Taplayad is the sole pending provider with `launch: null` and the exact owner template. Node/whitespace and Deno Actions pass.
- PR #27 documentation branch `b33745a` passes Actions. Both PR #27 and #29 previews succeeded as `environment=preview` in both Cloudflare Pages projects; their branch configs explicitly target staging.

### Launch blockers
- **ENV-07 — CRITICAL:** the active main-based preview `main.legitloot-preview.pages.dev` is deployment `fdf6b609`, `environment=preview`, built from `main@801f3e7`. Main `account-auth.js` still hardcodes the production Supabase URL, initializes the production client and exposes signup. Do not use Account/auth routes on that preview. PR #28's guard is a draft against `main` and remains owner-gated.
- **WALLET-01 — CRITICAL:** production and staging `public.get_wallet_summary()` still return cash USD buckets. Production grants `authenticated` EXECUTE. Production `account.html`, `account-auth.js` and `rewards.html` still expose pending cash/withdrawal or USD-denominated rewards. The LC-only PR #20 UI is not live and does not fix either backend contract.
- **PROV-07 — HIGH:** production Offerwall.GG Edge Functions are ACTIVE v2/v4 but return HTTP 410; the production private callback SQL routine still contains an LC journal path, although only postgres has EXECUTE. Staging wall-url v5/postback v8 remain ACTIVE; staging callbacks are record-only but service_role-executable. Callback/conversion tables are zero rows in both environments. PR #29's retirement SQL is not applied and its tombstones are not deployed.
- **TAPLAYAD — HIGH / OWNER-PROVIDER BLOCKER:** current and old Tplayad documentation describe different protocol generations. The exact owner template does not identify which generation applies to App 10066. Current Terms (updated 2026-10-29) do not expressly confirm incentivized-traffic permission. Written App-10066-specific confirmation is required before implementation/activation. Never map publisher points, callback reward or payout into LC.
- **M2-T4 — HIGH:** both selected games remain early access with device-local saves. Staging game registry contains only the unlisted `zid` placeholder; `game_events`, `game_saves` and `game_handoff_tickets` each contain zero rows. Shared account/session, cloud saves and trusted server-verified LC-event ingestion remain unfinished.
- **GOV-01 — HIGH:** all 30 GitHub refs report `protected:false`; repository rulesets are empty.
- **LEGAL/OPS:** Terms/Privacy approval, account deletion/export, monitored support, signup-pause verification, monitoring, backup/recovery and rollback evidence remain incomplete or unverified.

### Coordination and release sequencing
- PR #20 is 15 ahead/119 behind current integration; #22 and #26 are 17 ahead/119 behind. PR #26's three core registry/test files are byte-identical to PR #29; do not integrate both copies. PR #29 is 6 ahead/1 behind integration and PR #27 is based on current integration.
- Latest Claude handoffs are PR #27 comment `7051054842` and PR #29 comment `7051020358`. The repository tree contains no new standalone M2 handoff file; `docs/CLAUDE_START_HANDOFF_M1.md` remains historical.
- Next: Claude reconciles the stacked release branches and produces one exact combined candidate; DaVinci independently reviews that SHA. Production merge/deploy, provider agreement/activation and live financial actions remain owner-gated.

## PR #29 follow-up — 2026-11-20 17:44 ET

Exact current head `cfe9f0a` was independently re-reviewed. The commit changes only the proposed SQL header, retirement contract wording and a static test; no executable SQL or runtime code changed. It now accurately states the four application roles whose EXECUTE grants are revoked and the inherent postgres-owner exception. Node/whitespace `44831268131` and Deno `44831268125` pass. **ACCEPTED for source-only owner review.** The browser test remains unrun; SQL is unapplied and functions are undeployed.

The owner-provided Offerwall.GG recording shows all five visible placements with postback fields cleared, including a successful save on the remaining Pending placement. It is not an independent dashboard readback; placement disable/delete remains PARTIAL/UNVERIFIED.

## PR #30 consolidated candidate review — 2026-11-20 17:50 ET

**Disposition: DRAFT / REVIEW ONLY — NOT READY FOR OWNER APPROVAL.**

- PR #30 `272a1c1` is based on current integration `1466eb6`, 30 commits ahead/0 behind, 43 files. It consolidates #20/#22/#29/#26 with duplicate registry/test blobs present once. Node/whitespace `44831521863` and Deno `44831521848` pass; both Cloudflare previews succeeded as `environment=preview`.
- The owner-approved ZVHM source is `demonanic/Legitloot-2`, confirmed in Master Control §13/E2 and owner correction [PR #22 comment 7041463948](https://github.com/demonanic/LegitLoot/pull/22#issuecomment-7041463948). The earlier exclusion was withdrawn. Candidate code/test match; candidate PR description, README and Platform Build Spec remain stale and must be synchronized.
- Candidate `index.html:8` retains an unexplained `offerwall-verification` meta token. Confirm origin; remove and test if Offerwall.GG, or document another owner-approved purpose.
- Internal admin/payout simulator is permitted by Master Control §630 as staging-only. Exact staging URL checks and server-side owner/admin RPC checks are present; production has no simulator function and no real payment calls exist. Keep it out of public navigation.
- Candidate public Account/Rewards/Hustle copy is LC-only; Taplayad is pending with no launch URL. Browser test `tests/earn-hub.browser.py` remains unrun.
- Terms/Privacy remain placeholders; account deletion/export, shared account/session, cloud saves and trusted server-verified LC-event ingestion remain incomplete. Production wallet still returns cash USD fields and production Account/Rewards still expose cash/withdrawal UI. ENV-07 main-based preview remains production-auth-connected.
- No merge, deployment, SQL application, schema/data change, provider setting, callback, agreement, money movement or real payout occurred.


## Sync Watch #16 — 2026-11-20 17:58 ET — independent launch-readiness addendum

**Disposition: DRAFT / REVIEW ONLY — NOT READY FOR OWNER APPROVAL.** This addendum is based on read-only GitHub, Cloudflare and Supabase inspection plus current public Tplayad documentation. It does not authorize production or staging changes.

### Candidate and CI
- PR #30 is at exact head `b85aa8b`, base integration `1466eb6`, 52 changed files. GitHub Actions Node/whitespace `44832985972` and Deno `44832985927` pass. Both Cloudflare Pages projects built this SHA successfully as `environment=preview`; the candidate frontend selects the exact staging Supabase project. The Python/Playwright browser test `tests/earn-hub.browser.py` remains unrun; Browser Use was unavailable due insufficient credits. The PR description still reports an older head and 43 files.
- PR #27 documentation branch now has DaVinci's Sync Watch #16 documentation commits; the candidate still contains its earlier 17:55 snapshot. Current-state headers in the other working records and PR #30 description required synchronization; see current Master Control / Project Progress / CLAUDE handoff.

### Production policy and isolation
- **FAIL — owner-locked no-cash rule:** production `main@801f3e7` `account.html:15–16` displays cash available, pending cash, withdrawal reserved and paid balances. `account-auth.js:31–70` formats USD and requires/displays cash fields; line 114 invokes `client.auth.signUp()`. `rewards.html:20,27–28` describes USD cash rewards and withdrawals. Production `public.get_wallet_summary()` returns cash USD buckets and authenticated users can execute it; production Edge Function `wallet-summary` v4 also returns cash/USD fields. The LC-only candidate UI does not alter this deployed contract or the current production site.
- **FAIL — no provider-to-LC rule in production source:** production `earn.html:9` says provider completions are credited as LootCoins by the server; production `earn-providers.js:5,23,60–70` describes server-side provider LC issuance and retains CPAGrip as a testing provider. The candidate corrects the public copy and selects Taplayad pending-only, but is not deployed.
- **CRITICAL — ENV-07 remains:** main-based preview deployment `fdf6b609` is branch `main` / commit `801f3e7` in `legitloot-preview`; its bundle hardcodes production Supabase and exposes signup. PR #28 remains a draft against main. Do not use Account/auth on that preview. The owner-approved signup-pause setting was not independently verified; no auth settings were changed.
- Production Offerwall.GG HTTP handlers are 410 tombstones, but `private.process_offerwall_gg_postback` retains the historical LC journal body. Current EXECUTE checks are false for anon/authenticated/service_role and true for postgres only. This is dormant owner-only code, not a current application-role path; production cleanup remains owner-gated.

### Staging, game and provider readiness
- Staging `offerwall-gg-wall-url` v5 remains ACTIVE/JWT with production origin in CORS; `offerwall-gg-postback` v8 remains ACTIVE/no-JWT but calls a record-only routine. The wall-url remains callable by an authenticated direct caller. The disabled Offerwall.GG provider row retains LC/LootCoins reward metadata; CPAGrip is disabled; no Taplayad DB row exists. No callback was invoked.
- Staging `public.game_registry` has one placeholder row; `private.game_events`, `private.game_saves`, and `private.game_handoff_tickets` are zero rows. The two owner-selected games are published as early access with device-local saves, but shared account/session, cloud saves and trusted server-verified LC events remain unfinished.
- Candidate `wallet-summary.js:18` accepts `gameCredits` or `lootCoins` without validating the response currency label. The staging wallet RPC labels `gameCredits` as `LLC` while filtering ledger currency `LC`; the existing wallet test fixture accepts this mapping without asserting the alias. Clarify the contract or add a strict regression test before relying on the wallet parser.
- Candidate Terms/Privacy pages explicitly state formal documents are not published / are in preparation. Candidate Account still exposes a create-account form while Privacy says not to submit personal information until final documents. Account deletion/export remains absent.
- **Taplayad:** current docs `https://tplayad.com/docs` specify `md5(app_id . user_id . api_secret)`, status 1/2, any-2xx acknowledgement and deduplication by `offer_id + user_id`, but no immutable transaction ID/retry schedule; the signature omits offer/reward/payout/status. The accessible legacy page `https://www.tplayad.com/doc/postback` instead specifies `md5(subId . transId . reward . secret)`, unique `transId`, `OK`/`DUP`, a 60-second timeout and up to five retries. These are distinct generations; neither is verified for App 10066. Terms last updated 2026-10-29 do not expressly establish LegitLoot's incentivized-traffic permission. Keep the exact owner template pending and never map provider values to LC.
- **§630 access boundary:** admin/payout-simulator static shells are publicly fetchable even though data/actions are gated. This does not literally satisfy the current “inaccessible to anonymous/public users” wording. URL-level gate/noindex requires owner approval; no security setting changed.

### Safety boundary
No PR merge, deployment, Supabase setting/secret/grant/schema/data change, callback, provider setting, agreement, payment, reward issuance or money movement occurred. All Supabase queries were SELECT-only; all code changes in this run were documentation-only on the existing PR #27 branch.


## 2026-11-20 18:20 ET — Sync Watch #17 independent launch-readiness update

### Candidate and tests
- PR #30 remains a draft at exact head `0e9b9329846d5c4e4cbc65903f7e6bfd28fea4f3`, base `1466eb6`, 52 changed files / 71 commits. Node/whitespace Actions `44834506860` and Deno Actions `44834506806` pass; Claude reports local `npm ci && npm test` 77/77. The browser suite `tests/earn-hub.browser.py` remains unrun. Both Pages projects reported successful candidate branch-preview builds; source inspection confirms the candidate frontend is pinned to the exact staging project and fails closed if that config does not match.
- PR #30 description is stale and still cites `9f2c9a0` / 76 tests. Refresh it to the exact current head and results before owner review.
- **New test-provenance issue:** `tests/wallet-summary.test.mjs:4–6,31–35,81–85` describes repository migration files as the migrations applied in each environment. Live migration history instead lists staging `20261109050922 align_wallet_summary_response_with_staging_frontend` and production `20261108081619 standard_lootcoins_wallet`. The tested source files have different version prefixes. Correct the mapping or clearly label this as a static fixture/source test; the self-equality assertion on the fixture's `LLC` label does not verify the deployed response.

### Wallet, onboarding, and games
- **WALLET-01 remains FAIL:** production and staging `public.get_wallet_summary()` still include cash/USD buckets and grant authenticated EXECUTE. Production returns `lootCoins.available`; staging returns `gameCredits.available` with label `LLC` while the ledger filter uses LC. Production `wallet-summary` Edge Function v4 remains active and returns cash/USD fields. Candidate UI parsing ignores cash, but the backend response contract is not LC-only.
- Candidate `account.html:7–9` still presents Create Account and `account-auth.js:100–110` calls `auth.signUp()`; `terms.html:4` and `privacy.html:4` state that final legal documents are not ready and instruct visitors not to submit personal information. Account deletion/export is incomplete. Public onboarding remains a launch blocker; no Auth setting was read or changed.
- Both games remain early access with device-local saves. Staging registry still has only the unlisted `zid` placeholder; game events, saves and handoff tickets are empty. Shared account/session, cloud-save and server-verified LC-event integration remain incomplete.

### Provider, isolation, and controls
- Taplayad remains `pending_approval` with `launch: null` and the exact owner template `https://offerwall.tplayad.com/10066/{user_id}`. There is no Taplayad database row or integration. App-specific traffic permission and exact callback signature/transaction/reversal/retry semantics remain unverified; no publisher points or callback reward may become LC.
- Staging Offerwall.GG postback v8 and wall-url v5 remain ACTIVE; the postback is record-only and the wall-url remains callable by an authenticated direct caller. Disabled Offerwall.GG rows retain stale LC metadata; staging CPAGrip is disabled. Production callback routine retains historical LC journal code but only postgres can execute it.
- The main-based preview remains production-auth-connected (ENV-07); PR #28 is still draft against main. Candidate PR #30 preview source is staging-bound. GitHub reports 31 branches, all unprotected, and no repository rulesets.
- Terms/Privacy, account deletion/export, support monitoring, backup/recovery and rollback evidence remain incomplete or unverified.

### Safety
No PR merge, deployment, SQL application, Supabase setting/secret/grant/schema/data change, callback, provider setting, provider agreement, payment, reward issuance or money movement occurred. Supabase checks were SELECT-only. PR #30 remains draft/review-only.


## 2026-11-20 18:31 ET — Sync Watch #17 follow-up: candidate source-only WALLET-01 work

- PR #30 advanced to `ab505225` (55 files / 74 commits, draft). Node/whitespace `44837137548` and Deno `44837137501` pass; Claude reports local 79/79. Browser test remains unrun; no preview result for this new SHA has been returned.
- Candidate removes the Create Account UI and client `auth.signUp()` handler. This is a UI-only closure; the Supabase Auth `disable_signup` setting was not read or changed in this run, and the last recorded production probe was false. Do not describe backend registration as disabled until independently verified.
- Candidate adds `supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql`, explicitly DO NOT APPLY and outside migrations. It returns only LC buckets and filters the RPC to `wallet_kind=game_credits,currency_code=LC` plus posted journal transactions. The checked-in Edge Function response is also LC-only, but its query still loads all user accounts and all journal entries without matching LC currency or posted status; align this logic or remove the unused endpoint before deployment.
- Fresh aggregate read-only catalog check confirms `lootcoins_available` with `wallet_kind=game_credits,currency_code=LC` exists in both production and staging. Production also retains legacy `game_credits_*` accounts labelled LLC; the new LC response uses the separate LC-coded accounts.
- Proposed SQL header says no grant change but contains REVOKE/GRANT statements. Current live RPC ACLs are authenticated + service_role EXECUTE, anon/public false. Add explicit ACL precondition/assertion and describe preservation accurately; do not apply.
- `account.html:5` still says “Sign in or create an account”; line 9 says no personal information is collected even though sign-in/reset collect email/password. New test title “public sign-up stays closed” verifies only UI/client source, not Auth project settings. `wallet-summary.js:4–8` still uses stale applied-migration wording after the test header was corrected.
- Claude comment `7053199149` says PR body refreshed, but current PR body still references `9f2c9a0` and Actions `44832367913/44832367977`. Exact current head is `ab505225`; update the body. PR #27 is `aae268f` with Actions `44837195049` passed; PR #30 is still based on docs through `e199df3`, one commit behind.
- Live production/staging wallet RPCs remain cash-bearing; production wallet-summary v4 remains deployed with cash fields. No proposed SQL or Edge Function source is deployed. ENV-07, Taplayad permission/protocol, legal/account deletion/export, and shared game/account/LC-event integration remain open.
- No merge, deployment, SQL application, Auth setting, Supabase secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 18:36 ET — Sync Watch #17 follow-up 2: review of latest source fixes

- PR #30 is draft at `7f1e1c61` (56 files / 77 commits). Node/whitespace `44837793174` and Deno `44837793169` pass. The last Claude-reported local 79/79 result belongs to the preceding head `ab505225`; browser test remains unrun and preview for the latest SHA is not verified.
- **Accepted fixes:** signup UI/client handler removed and copy corrected; backend Auth `disable_signup` explicitly marked unverified/owner-gated; wallet parser migration comments corrected; wallet test explicitly UI-only/static; Edge Function now filters account and entry currency to LC and joins posted transactions.
- **Remaining RPC proposal defect:** `supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql:38–41` does not verify journal-entry `wallet_kind` and `currency_code` against its account. Add matching predicates or fail closed, plus regression coverage.
- **Remaining ACL precondition defect:** the proposed SQL says PUBLIC has no EXECUTE but its precondition checks only authenticated, service_role and anon. Add a PUBLIC-grantee check via `aclexplode(proacl)` or equivalent. Current live ACL in both environments is `{postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}`; anon/PUBLIC absent. File remains DO NOT APPLY.
- The PR #30 body is still stale at `9f2c9a0` / old Actions, despite Claude comment `7053199149` claiming it was refreshed. Exact current head is `7f1e1c61`; update the body and current-state records. PR #27 is `e1146ff` with Actions `44837816280` passed; PR #30 remains one docs commit behind (`e199df3`).
- Live wallet RPCs remain cash/USD-bearing; source-only proposal and Edge Function change are not deployed. Main-based ENV-07, Taplayad permission/protocol, legal/account deletion/export and game-event integration remain open.
- No merge, deployment, SQL application, Auth setting, Supabase secret/grant/schema/data change, callback, provider setting/agreement, payment, reward issuance or money movement occurred.


## 2026-11-20 18:38 ET — Sync Watch #17 follow-up 3: latest proposed wallet SQL review

- PR #30 is draft at `38a9406` (56 files / 80 commits). Node/whitespace `44838085850` and Deno `44838085857` pass. The last Claude-reported local 80/80 result was on prior head `7f1e1c61`; no fresh local count is attached to `38a9406`. Browser test remains unrun; no preview result for the latest SHA has been returned.
- The latest source commit fixes the prior RPC SQL findings: the journal-entry join now checks matching wallet_kind/currency, posted transactions remain required, and the ACL precondition checks PUBLIC via `aclexplode`. The static test asserts both. The proposed SQL remains under `supabase/proposed/staging`, outside migrations, and DO NOT APPLY.
- The Edge Function source filters accounts/entries to LC and uses a posted-transaction relationship. The PostgREST nested embed is not runtime-verified; the underlying transaction FK exists in both projects. No Edge Function deployment occurred.
- Live production/staging wallet RPCs still return cash/USD fields; production wallet-summary v4 remains deployed with cash/USD response. The candidate source proposal does not alter deployed state.
- Candidate Account closes the Create Account UI/client handler and now uses accurate registration-closed copy. Supabase Auth `disable_signup` remains unverified/owner-gated; no setting was read or changed.
- PR #30 current-state header is one commit stale at `7f1e1c6` / 77 commits / old Actions; current head is `38a9406`, 56 files / 80 commits, Actions `44838085850/44838085857`. The last local test count belongs to the previous SHA. PR #27 is at `26768972`, Actions `44838133420` passed; PR #30 includes docs through `e1146ff`, one docs commit behind. Latest-head preview remains unverified.
- ENV-07, Taplayad permission/protocol, Terms/Privacy, account deletion/export, and shared game/save/verified-event integration remain open.
- No Auth setting, Supabase secret/grant/schema/data, SQL application, function deployment, callback, provider setting/agreement, payment, reward issuance or money movement occurred.

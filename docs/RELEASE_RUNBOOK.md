# LegitLoot — Release, Rollback and Monitoring Runbook

**Status:** DRAFT v0.1 (Claude, 2026-11-19), for ChatGPT review. Addresses audit OPS-01 and OPS-03.
**Scope:** The first early-access release and everything after it. Uses only free tooling. Any paid monitoring or backup tier needs owner approval.
**Authority:** This runbook does not authorize any release. Every production release, merge to `main`, production secret/setting change or production function deploy needs explicit owner approval (`docs/MASTER_EXECUTION_CONTROL.md` §6).

Facts below are VERIFIED against `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md` unless marked UNVERIFIED.

---

## 1. What makes up a release

LegitLoot production has three independently deployable parts. A release must record all three, even when only one changes.

| Part | Where | Deployed by | Version identifier |
|---|---|---|---|
| Static site | Cloudflare Pages project `legitloot`, owner-recorded production branch `main` (**dashboard binding and trigger NOT VERIFIED**), `https://legitloot.site/` | Expected: push/merge to `main`; **verify the actual trigger in the dashboard before release** | Git commit SHA on `main` + Pages deployment ID |
| Edge Functions | Supabase production `gkbqderyjcuxnjbsiffb` | Supabase CLI/dashboard deploy (manual) | Function name + version number |
| Database schema | Supabase production `gkbqderyjcuxnjbsiffb` | Migration apply (manual) | Applied migration version list |

Staging (`scmnxcsggquwtuyyjnnj`) and the build-branch preview are never part of a production release.

## 2. Release manifest (fill in before every production release)

Copy this block into the coordination log entry that requests owner approval.

```
RELEASE <name> — requested <date> by <agent>
Site:      main <old SHA> -> <new SHA>; PR #<n>; Pages deployment before: <id>
Functions: <name> v<old> -> v<new> (source path @ SHA) | "no change"
Schema:    applied migrations before: <latest version>; to apply: <files> | "no change"
Secrets/settings changed: <names only, never values> | "none"
Checks run: <tests, renders, probes with results>
Rollback:  <section 4 step that applies>
Owner approval: <quote + date>   <- required before any step in §3
```

## 3. Release procedure

1. **Freeze.** Note the current production state: `main` SHA, the latest Pages production deployment, function versions, applied migration list, and `GET /auth/v1/settings`. Also verify in the Cloudflare dashboard that Pages project `legitloot` is bound to production branch `main` and confirm the actual auto-deploy trigger; this binding/trigger is currently owner-recorded but **NOT independently verified** in `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`.
2. **Pre-checks on the candidate commit:**
   - `node --test tests/*.test.mjs` passes;
   - `node --check` on every JS file;
   - HTML id/link audit and `git diff --check`;
   - rendered pass at 390px and 1366px of every public route;
   - the candidate's `supabase-config.js`/client config targets **production** only if this release intends that (see §6).
3. **Owner approval** recorded with the manifest.
4. **Apply in dependency order:** schema → functions → site. Skip parts that don't change.
5. **Post-release verification (within 15 minutes):** run §5 checks; record the results in the log.
6. **Hold window:** 24 hours of extra monitoring. No second release in the same window unless it's a rollback.

## 4. Rollback

| Part | How to roll back | Time | Caveats |
|---|---|---|---|
| Static site | Cloudflare dashboard → Pages → `legitloot` → Deployments → choose the previous production deployment → **Rollback**. Then revert the commit on `main` through a PR, so Git matches what is served. | Minutes | Owner (or anyone with Cloudflare access) performs it. Agents currently have no Pages dashboard access. |
| Edge Function | Redeploy the previous version's source. | Minutes | Production source snapshots for `offerwall-gg-postback` v3, `offerwall-gg-wall-url` v1 and `wallet-summary` v4 were exported read-only on 2026-11-19 under `supabase/environments/production/functions/`; versions and hashes are in `supabase/environments/production/DEPLOYED_FUNCTIONS_MANIFEST.json`. These are reference/rollback snapshots, not deployment authorization. |
| Schema | Forward-fix with a new compensating migration. Never edit or delete applied migrations, and never rewrite ledger rows (append-only rules). | Hours | Supabase backup / point-in-time-recovery tier for production is **UNVERIFIED**. A restore is a destructive owner-level decision. |
| Auth setting | Toggle back in the dashboard (e.g. `disable_signup`). | Minutes | Owner action. Verify via `/auth/v1/settings`. |
| Provider secret | Re-add the secret value from the provider dashboard. | Minutes | Owner action. Removing `OFFERWALL_GG_SECRET` also disables wall URLs (PROV-07). |

**Rollback trigger:** any §5 check fails, any player-visible claim is wrong (cash, LC awards, provider availability), or any unexpected write appears in ledger/callback tables.

## 5. Monitoring (free tooling)

### 5.1 After each release, and daily during early access

| Check | How | Expected |
|---|---|---|
| Site up | `curl -sSL -o /dev/null -w '%{http_code}' https://legitloot.site/` (repeat for `/games`, `/earn`, `/account`) | `200` |
| Served = `main` | Compare served HTML to `main` | Identical (ignore Cloudflare `mailto` obfuscation) |
| Auth setting | `GET https://gkbqderyjcuxnjbsiffb.supabase.co/auth/v1/settings` with the production publishable key | `disable_signup` matches the release decision |
| Anonymous isolation | anon `GET /rest/v1/profiles` and `POST /rest/v1/rpc/get_wallet_summary` | `401` |
| No LC minted by providers | Agent with connector access: count rows in `private.offerwall_gg_callback_events`, `private.offerwall_gg_conversions` and provider-sourced `private.journal_transactions` | `0` while PROV-07 is open |
| Supabase advisors | Security and performance advisors via connector | No new ERROR-level items |
| Function errors | Supabase dashboard → Edge Functions → Logs, last 24 hours | No 5xx spikes |

### 5.2 Recommended free additions (not yet set up; owner to choose)
- An external uptime ping on `https://legitloot.site/` (several free services exist; pick one and record it here). **Owner decision**, since it needs an account.
- Cloudflare Web Analytics (free, cookieless) for traffic and error-page counts. Needs a Privacy Notice mention (LEGAL-01).
- Client error reporting: deferred until a Privacy Notice covers it.

## 6. Environment guard for releases

- The build branch is **staging-only by construction**. Both `account-auth.js` and `earn-hub.js` fail closed unless `supabase-config.js` names the exact staging URL with `environment: "staging"`; `tests/environment-isolation.test.mjs` exercises both clients, including an active-provider path.
- A production release candidate therefore needs a deliberate, reviewed change that adds a production config for `main` only. Never point a preview at production.
- That change must ship with an equivalent test asserting `main` targets production and never staging.
- Staging-only pages and tools (`admin.html`, `payout-simulator.html`, their scripts, and the `admin-dashboard` and `payout-simulator` functions) must be **excluded** from any production release. The release manifest must list the files removed or excluded.

## 7. Incident response (short form)

1. **Contain.** Use the smallest reversible step: Pages rollback, auth toggle, or provider secret removal (owner approval required in production).
2. **Record.** Add a coordination-log entry with what happened, when, evidence, the step taken, and who approved it.
3. **Escalate to the owner immediately** for exposed credentials, unexpected ledger writes, data loss, or a production outage (MASTER §6).
4. **Fix forward** on the build branch, then use the normal release procedure.



**Migration-history limitation:** Supabase's migration-history API returns applied version/name metadata only, not original SQL. The production `MIGRATION_HISTORY.md` is not a replayable SQL archive; complete original migration SQL and schema reconstruction remain separate work.

## 8. Open items blocking a clean first release

| Item | Ref | Owner |
|---|---|---|
| Production function source snapshots (postback v3, wall-url v1, wallet-summary v4) under `supabase/environments/production/functions/` | REPO-03 | **COMPLETE 2026-11-19** |
| Production applied migration version/name metadata under `supabase/environments/production/MIGRATION_HISTORY.md` | MIG-01 | **COMPLETE 2026-11-19** |
| Confirm production Supabase backup/PITR tier | OPS-03 | Owner or ChatGPT (read-only) |
| Production config + test for the release candidate (§6) | ENV-04 | Claude, after PR #11 |
| Choose an uptime monitor | OPS-01 | Owner |

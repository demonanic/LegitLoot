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

1. **Freeze.** Note the current production state: `main` SHA, the latest Pages production deployment, function versions, applied migration list, and `GET /auth/v1/settings`. Also verify in the Cloudflare dashboard that Pages project `legitloot` is bound to production branch `main` and confirm the actual auto-deploy trigger; this binding/trigger is currently owner-recorded but **NOT independently verified** in `docs/ENVIRONMENT_SOURCE_OF_TRUTH.md`. Also verify GitHub protection on `main`: the last API check reported `protected:false`, no rulesets, and the detailed branch-protection endpoint was inaccessible to this integration. Until an authorized admin confirms PR-only changes, required independent review and required checks are enabled, treat direct pushes to `main` as a production-release risk. Do not claim branch protection exists before verification.
2. **Registration precondition:** before any release that exposes public account onboarding, verify production `disable_signup:true` with `email:true` (owner-approved pause; keep existing sign-in). It stays paused until approved Terms/Privacy (LEGAL-01) and the account-deletion path (AUTH-03) are live. A release that would reopen sign-up is itself an owner gate.
3. **Pre-checks on the candidate commit:**
   - `node --test tests/*.test.mjs` passes;
   - `node --check` on every JS file;
   - HTML id/link audit and `git diff --check`;
   - rendered pass at 390px and 1366px of every public route;
   - the candidate's `supabase-config.js`/client config targets **production** only if this release intends that (see §6).
4. **Owner approval** recorded with the manifest.
5. **Apply in dependency order:** schema → functions → site. Skip parts that don't change.
6. **Post-release verification (within 15 minutes):** run §5 checks; record the results in the log.
7. **Hold window:** 24 hours of extra monitoring. No second release in the same window unless it's a rollback.

## 4. Rollback

| Part | How to roll back | Time | Caveats |
|---|---|---|---|
| Static site | Cloudflare dashboard → Pages → `legitloot` → Deployments → choose the previous production deployment → **Rollback**. Then revert the commit on `main` through a PR, so Git matches what is served. | Minutes | Owner (or anyone with Cloudflare access) performs it. Agents currently have no Pages dashboard access. |
| Edge Function | Restore only an exact, reviewed, owner-approved version-specific source. For Offerwall.GG, preserve the inert HTTP 410 handlers; never roll back to pre-containment versions. | Minutes | See the Offerwall.GG rollback exception below. |
| Schema | Forward-fix with a new compensating migration. Never edit or delete applied migrations, and never rewrite ledger rows (append-only rules). | Hours | Supabase backup / point-in-time-recovery tier for production is **UNVERIFIED**. A restore is a destructive owner-level decision. |
| Auth setting | Toggle back in the dashboard (e.g. `disable_signup`). | Minutes | Owner action. Verify via `/auth/v1/settings`. |
| Provider secret | Re-add the secret value from the provider dashboard. | Minutes | Owner action. Removing `OFFERWALL_GG_SECRET` also disables wall URLs (PROV-07). |

**Offerwall.GG rollback exception — do not restore pre-containment snapshots.** The 2026-11-19 production manifest and source files record `offerwall-gg-postback` v3 and `offerwall-gg-wall-url` v1, both pre-containment active implementations. They are **not safe rollback targets**. The current deployed production versions are postback v4 (source SHA-256 `42b1dfd345c359e3bcca45f77c19cf35d38f7bc4e1554885141ffec92da443bd`) and wall-url v2 (source SHA-256 `7f5344ed8f8413a38827ba3484f1e2394e40150c63efee34cfbf462868e02b44`); both return inert HTTP 410. The current v2/v4 sources are not archived in the historical snapshot directory. Before any future rollback, export and independently verify the exact inert v2/v4 sources as versioned artifacts. Never redeploy v1/v3 or restore callback EXECUTE privileges as part of rollback. Any production function deployment or privilege change still requires explicit owner approval.\n\n**Rollback trigger:** any §5 check fails, any player-visible claim is wrong (cash, LC awards, provider availability), or any provider-sourced LC journal transaction or ledger posting appears; a provider callback is mismatched to a journal posting; or malformed/unexpected callback state is detected. Record-only callback-event and conversion rows, including valid reversals, are expected audit records and are not rollback triggers by themselves.

## 5. Monitoring (free tooling)

### 5.1 After each release, and daily during early access

| Check | How | Expected |
|---|---|---|
| Site up | `curl -sSL -o /dev/null -w '%{http_code}' https://legitloot.site/` (repeat for `/games`, `/earn`, `/account`) | `200` |
| Served = `main` | Compare served HTML to `main` | Identical (ignore Cloudflare `mailto` obfuscation) |
| Auth setting | `GET https://gkbqderyjcuxnjbsiffb.supabase.co/auth/v1/settings` with the production publishable key | `"disable_signup":true` and `"email":true` (sign-up paused, existing users can sign in) **until** approved Terms/Privacy and the account-deletion path are live. This is the owner-approved pause, not a new decision. Last verified at 2026-11-19 12:18 UTC as `disable_signup:false`; re-probe during the release freeze because no later production auth-setting verification is recorded. |
| Anonymous isolation | anon `GET /rest/v1/profiles` and `POST /rest/v1/rpc/get_wallet_summary` | `401` |
| No LC minted by providers (**hard invariant**) | Agent with connector access: `select count(*) from private.journal_transactions where source_system in ('offerwall_gg','cpagrip') or event_type like 'offerwall_gg_%' or event_type like 'cpagrip_%'`, plus the count of `private.journal_entries` on `currency_code = 'LC'` accounts belonging to those transactions. Extend the provider list when a provider is added. | **`0`, always** (spec §0.1). Any non-zero value is an incident (§7). |
| Provider callback activity (reconcile, **not** required to be zero) | Same access: counts of `private.offerwall_gg_callback_events` by `result`, and `private.offerwall_gg_conversions` by `status` | Reported each check. Once the record-only migration `20261119145340_offerwall_gg_record_only.sql` is deployed, non-zero counts are expected. Before then, any non-zero count means the old LC-posting path may have run: check the invariant above at once. |
| Callback ↔ posting mismatch | Same access: any callback event whose `transaction_id` matches a provider journal transaction's `source_event_id` prefix | **None.** Any match is an incident (§7). |
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
| Verify `main` branch protection and required checks (last API evidence: `protected:false`, no rulesets) | GOV-01 | Owner / GitHub admin |
| Choose an uptime monitor | OPS-01 | Owner |
| Verify and enable PR-only branch protection, independent review and required checks on `main` | GOV-01 | Owner / GitHub admin |

# TapResearch — Eligibility API integration (staging)

**Status: ON HOLD — publisher eligibility not approved.** TapResearch's business development team advised LegitLoot to revisit the partnership after reaching at least **2,500 US daily active users/site visitors**, or **5,000 combined DAU** across the US, Canada, UK, Germany, France and Australia. This is a publisher-audience threshold, not a technical rejection.

**Current safeguards (2026-11-22):**
- Provider registry is `pending_approval`; `launch: null`. The provider cannot be opened by players.
- Staging Edge Functions are intentionally disabled: both endpoints return HTTP 410. The original handlers remain preserved in GitHub commit `7b4d17a233d0d400c54d9a00a971ce6bff4ed148`.
- The staging-only record table and service-role-only RPC migration remain applied for future reactivation. No credentials were configured, no TapResearch dashboard postback URL was changed, and no rewards or wallet credits were processed.
- Production was not changed. Do not press **Go Live**, configure provider credentials, or restore the live handlers without fresh written provider approval and explicit owner authorization.

**Reactivation path:** confirm audience eligibility and written approval with TapResearch; obtain owner approval; restore the original handlers from the preserved commit; configure staging-only secrets; verify the correct preview origin and provider callback payload; test signed callbacks, duplicate/retry behavior and `pending_review` storage; then separately review any production release. Cash posting, LC credits and payouts remain outside this integration.
**Source of truth:** https://supply-docs.tapresearch.com/llms-eligibility-api.txt (read 2026-11-22). Anything not in that file is listed under "Not covered by the docs" — nothing there was guessed into the code.
**Policy:** spec §0.1 (no provider callback mints Legit Coins) and §0.5 (two balances; cash only from verified *and approved* Hustle completions; payouts off). Rewards are recorded `pending_review`; nothing posts to any ledger.

## How it works, in plain English

1. A signed-in player's browser asks our server function `tapresearch-eligibility` "does this player have a survey?". The function adds our secret API token, the player's id and the player's IP, asks TapResearch, and returns only yes/no, a reason number, the survey link and the reward range. The token never reaches the browser.
2. If yes, the player opens the survey link (in the browser, the docs' default).
3. When the player earns a reward, TapResearch calls `tapresearch-postback` with a signature. The function checks the signature with our API Secret, requires the standard `api_token` parameter shown in TapResearch’s official sample to match our configured token, and records the reward once (by `cpid`). It answers 200 so TapResearch stops retrying.
4. Turning a recorded reward into cash-balance money is a separate, owner-approved step that is **not built** (it needs the approval rules for "approved Hustle completion").

## Files

| File | Purpose |
|---|---|
| `supabase/functions/tapresearch-eligibility/` | Eligibility check (handler, entrypoint, Deno tests) |
| `supabase/functions/tapresearch-postback/` | Rewards postback with HMAC-MD5 `sig` check (handler, entrypoint, Deno tests) |
| `supabase/migrations/20261122020000_tapresearch_reward_record_only.sql` | `private.tapresearch_rewards` + service-role-only recorder |
| `tests/tapresearch.test.mjs` | Database (PGlite) and policy tests |
| `.github/workflows/tapresearch-tests.yml` | CI for the Deno tests |
| `scripts/tapresearch-smoke.sh` + `.env.example` | Smoke tests per checklist step |

## Runtime dependency lock

Both Edge Function entrypoints pin `npm:@supabase/supabase-js@2.108.2`; the root `deno.lock` records the exact npm dependency graph for that release. CI uses Deno frozen-lock mode so dependency drift fails the check. The lock graph was assembled from the published package dependency set and must be confirmed by the Deno CI check before any deployment.

## Where your credentials go (never in code, git or chat)

Get them from the TapResearch Publisher Dashboard → your app (type **Eligibility API**) → **Settings → Eligibility API settings**:

| Value | Put it in | Name |
|---|---|---|
| API token | Supabase **staging** → Project Settings → Edge Functions → Secrets | `TAPRESEARCH_API_TOKEN` |
| API Secret (app settings) | same place | `TAPRESEARCH_API_SECRET` |
| Placement tag (optional) | same place | `TAPRESEARCH_PLACEMENT_TAG` |

For the smoke script only, the same values also go in `.env.tapresearch` on your own machine (git-ignored). Prefer the dashboard secrets page over `supabase secrets set KEY=value` on the command line, which leaves the value in shell history.

## Deploy to staging (`scmnxcsggquwtuyyjnnj`)

1. Apply the migration: paste `supabase/migrations/20261122020000_tapresearch_reward_record_only.sql` into the staging SQL editor and run it. Do this **before** deploying the postback.
2. Deploy the functions:
   ```
   supabase functions deploy tapresearch-eligibility --project-ref scmnxcsggquwtuyyjnnj
   supabase functions deploy tapresearch-postback --no-verify-jwt --project-ref scmnxcsggquwtuyyjnnj
   ```
   `--no-verify-jwt` is required on the postback only: TapResearch has no Supabase session.
3. In the TapResearch dashboard → Settings → Eligibility API settings → **Rewards/monetization postback URL**:
   `https://scmnxcsggquwtuyyjnnj.supabase.co/functions/v1/tapresearch-postback`
   Use the standard parameter names (no `{PLACEHOLDER}` renaming) — the receiver reads `cpid`, `uid`, `payout_amount`, etc. Click **Test rewards postback** — it must return 200 — then save.

## Dashboard checklist ↔ smoke tests

Add a test device first (dashboard **More → Test devices**). Then, from the repo root:

| Dashboard step | Command | Pass looks like |
|---|---|---|
| 1. API request received (test mode) | `scripts/tapresearch-smoke.sh 1` | HTTP 200 with an `offerReason` (2 = test mode, not a test device) |
| 2. Reward callback configured | dashboard **Test rewards postback**, plus `scripts/tapresearch-smoke.sh 2` and `2b` | 200 for a signed GET and its retry; 403 for a bad `sig` |
| 3. Enter survey wall (test user with `has_offer: true`) | `scripts/tapresearch-smoke.sh 1` as the registered test user, then open `offerUrl` on the test device | `offerReason` 0 and the wall loads |
| 4. Generate test survey complete | in the wall / dashboard | — |
| 5. Reward redeemed for test user | `scripts/tapresearch-smoke.sh 5`, run the printed SQL | a row with the test user's `cpid`, `review_status = pending_review` |

Do **not** press **Go Live** — that is an owner-gated activation, and the provider must also be switched from `testing` with a `launch` block, which this change does not do.

## Reason codes (branch on the number, never the comment)

0 qualified · 1 no surveys now · 2 test mode, not a test device · 4 unsupported country · 5 under supported age · 8 banned · 19 no active offers · 20 user id looks like an ad ID · 22 blacklisted · 23 placement targeting not met · 24 no currency set up. (The docs call this a common subset.)

## Common mistakes (from the docs) and how this code avoids them

- **Token in the browser** → token only lives in Edge Function secrets; a test fails if it appears in browser files.
- **Wrong IP** (server's IP instead of the player's) → the browser calls the function directly; the function forwards the first `x-forwarded-for` hop. Never proxy this call through another server.
- **Unstable or ad-ID user identifier** (reason 20) → we use the Supabase user id.
- **Branching on `reason_comment`** → only the integer is returned to the browser.
- **Using `tid` to de-duplicate** → identity is `cpid`; retries of the same `cpid` return 200 without a second row.
- **Signing a fixed field list** → the whole received query (minus `sig`) is signed, so extra fields don't break it.
- **Turning `+` into spaces while decoding** → `decodeURIComponent` keeps `+`; a test covers it.
- **Non-constant-time compare** → `timingSafeEqual`.
- **Slow postback** (must answer within 5 s) → one database call, no outbound requests.
- **Not telling the player** → the docs say TapResearch does not notify players; we must. Not built yet (see below).
- **Using the deprecated `abandon_url`** → dropped server-side.

## Not covered by the docs (decide or ask TapResearch — not guessed in code)

- Which identifier a **test device** is matched on for the Eligibility API (`user_identifier` or `device_identifier`). The function sends only `user_identifier`; ask TapResearch which to register.
- Where the **placement tag** is shown in the dashboard.
- The exact payload from the dashboard **Test rewards postback** remains unobserved. The official standard postback sample includes `api_token`, which the handler now requires; the test may use a `uid` that is not a LegitLoot account, which is recorded with `user_id` empty. Confirm the actual dashboard payload before changing these checks.
- **Reversals / chargebacks**: the docs describe no reversal postback.
- **Rate limits**: the docs list none.
- Whether `client_ip` from Supabase's `x-forwarded-for` is accepted as-is — confirm in the function logs during step 1.

## Still to build before players can use it (owner decisions)

- Hustle page wiring (`launch` block + button) and a player notice that a reward is pending review.
- Review/approval rule and the cash-ledger posting for approved rewards (§0.5); payouts stay off.
- Optional IP allowlist on the postback (`34.198.225.203`, `3.88.121.21`, `3.89.214.250`, `3.92.129.242`).
- Production apply/deploy and TapResearch **Go Live**: owner-gated.

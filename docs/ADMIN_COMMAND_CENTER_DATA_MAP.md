# LegitLoot Admin Command Center — Data & Permission Map

Date: 2026-11-27  
Environment reviewed: Supabase project `legitloot-staging`  
Code branch: `feature/admin-cockpit-p1-foundation`  
Status: discovery document; no schema or runtime changes made.

## Purpose

Map proposed admin modules to confirmed data sources before expanding privileged read endpoints. Missing sources must be reported as unavailable, not replaced by fabricated metrics.

## Confirmed source map

| Module | Existing source(s) confirmed | First read-only scope | Gaps / cautions |
|---|---|---|---|
| Overview | `public.profiles`, `private.ledger_accounts`, `private.journal_entries`, `private.journal_transactions`, `private.reward_allocations`, `private.provider_events`, `private.payout_requests`, `private.audit_log` | Registered profiles, user registration trend, independent ledger totals, reward/event counts, requested payout status counts, recent audit events | Need define exact semantics for "active users", net balances and provider earnings before showing derived metrics. |
| Users | `auth.users`, `public.profiles`, `private.admin_users`, `private.account_policy_acceptances`, `private.account_deletion_requests` | Profile, account creation, last sign-in, confirmed email, policy acceptance indicators, deletion state | Admin/owner distinction and PII minimization. Account suspensions/restrictions source not yet confirmed. |
| Wallet & Ledger | `private.ledger_accounts`, `private.journal_entries`, `private.journal_transactions`, `private.earned_loot_lots`, `private.moonetix_reward_events`, `private.game_lootcoin_issuance`, `private.reward_allocations` | Separate USD cash, EL and LC account balances; pending/eligible EL from reward lifecycle; journal source/history; LC issuance source events | Confirm each wallet_kind, currency scale, liability interpretation and reversal semantics. Never edit posted history. |
| Redemptions | `private.payout_requests`, `private.providers` | Read request/status/amount/reason history with payout switch clearly OFF | No payout execution or approval actions until separate owner approval; request workflow may be simulator/incomplete. |
| Support | None confirmed in inspected schema | Show "not instrumented" | Discover any external helpdesk/inbox integration before creating a new source. |
| Security & Risk | `private.provider_events`, `private.moonetix_reward_events`, `private.audit_log`, `private.account_deletion_requests`, auth sessions/logs where appropriate | Read event validation outcomes, duplicates, invalid signatures, account lifecycle alerts and admin events | No unified risk flag/case system confirmed. Do not infer fraud from a single signal or auto-restrict accounts. |
| Website Analytics | Cloudflare Pages Web Analytics project settings are available; `private.game_events` exists for game-specific events | Distinguish edge traffic/performance analytics from product funnel/user analytics | Pages Web Analytics tag/token currently null in deployment metadata. No generic website product-event table confirmed. Need confirm analytics project configuration and data access before exposing KPIs. |
| Provider Operations | `private.providers`, `private.provider_events`, `private.offers`, `private.moonetix_reward_events`, legacy provider event tables | Provider statuses, callback validation/status counts, event discrepancy views | Provider records include disabled/testing/approved/active states; never change activation. Provider-specific semantics must be preserved. |
| Audit & Administration | `private.admin_users`, `private.audit_log` | Role/capability visibility and recent immutable audit history | Owner-only role management actions require separate approval; no access changes in this task. |
| Finance & Reconciliation | Ledger/journal, earned lots, provider events/rewards, payout requests | Read-only separate cash/EL/LC exposures and source discrepancies | Expenses, realized profit, partner receivables, reserves and settlement statements require source discovery; do not infer profit from gross events. |

## Existing admin APIs requiring reconciliation

### `admin-cockpit`
- Active Supabase Edge Function version 2; JWT verification enabled.
- Routes search/detail through `admin_search_users` and `admin_user_detail`.
- Both RPCs are SECURITY DEFINER with empty search_path, check service_role claim and active owner membership; EXECUTE grants are service_role only.
- Transactional audit events are written in these RPCs.
- This is the current branch’s owner-only foundation.

### `admin-dashboard`
- Separate active Edge Function version 15.
- `public.admin_dashboard_payload(p_actor_user_id, p_section)` is SECURITY DEFINER with empty search_path and EXECUTE restricted to postgres/service_role.
- It validates service_role and active admin membership. The overview query currently returns profile count for any active admin role (including any future non-owner admin roles), so do not use it as an owner-only aggregate source without explicit permission analysis.
- The function source has a separate accounts path gated by owner. The function is not yet reconciled with the current branch UI and current audit semantics.
- Preserve as evidence; do not deploy/replace it as part of this task.

## Security review items

- Keep service-role credentials exclusively server-side.
- Do not grant browser roles access to private schemas.
- Do not blanket-add RLS policies to private tables simply to silence advisor findings; inspect grants, exposure, and intended access for each.
- Review the 8 authenticated-callable SECURITY DEFINER functions flagged by current Supabase advisor, including account-deletion, account-export and wallet/catalog RPCs. They may be intentional; verify each body/grant contract.
- Leaked-password protection is currently reported disabled; document separately for owner security settings review.
- New owner data endpoints must independently verify the bearer user and active owner membership, use least privilege, no-store responses, schema-qualified SQL and strict input validation.
- Sensitive reads/actions should be audited server-side atomically when practical.

## Analytics distinction

- Cloudflare Pages Web Analytics measures website traffic/performance and is not equivalent to signed-in product analytics, event funnels, or retention cohorts.
- A product analytics layer requires documented events such as signup started/completed, login, offer viewed/started/completed, reward credited/reversed, game launched/session activity, support created, and redemption requested, subject to privacy/consent review.
- No synthetic counts, inferred activity, or estimates should be displayed as measured metrics.

## Implementation sequence

1. Build UI shell/navigation and truthful unavailable states.
2. Define owner-only overview RPC around confirmed source semantics, with separate currency panels and audited read behavior.
3. Add structured user/profile and ledger detail views using the owner-gated read functions.
4. Add provider and redemption read-only panels after validating each source’s semantic contract.
5. Discover support and analytics sources before implementing those panels.
6. Only after read-only acceptance, design write controls separately with scoped permissions, reason codes, idempotency and atomic audit logging.

## Explicit non-authorizations

This mapping does not authorize migrations, deployment of replacement functions, production changes, role/access changes, provider activation, payouts/withdrawals, or any cash/EL/LC ledger mutation.

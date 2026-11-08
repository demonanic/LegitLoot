# LegitLoot Authentication Setup

Project: `gkbqderyjcuxnjbsiffb`  
Project URL: `https://gkbqderyjcuxnjbsiffb.supabase.co`

## Client integration

The static account page loads the official Supabase JS v2 browser bundle and initializes it with the project's **publishable** key in `account-auth.js`. A publishable key is intended for browser use; it is not a service-role key. Never place service-role, secret, database-password or provider signing credentials in this repository.

The account page currently supports:
- Email/password registration.
- Email/password sign-in.
- Password-reset email requests.
- Sign-out and session restoration.
- Reading only the signed-in user's own profile under RLS.

The browser does not query or mutate financial ledger tables. Wallet display remains a placeholder until a server-controlled wallet summary endpoint exists.

## Required Supabase dashboard configuration

Before testing registration on the website:

1. Open the LegitLoot project in Supabase.
2. Go to **Authentication → URL Configuration**.
3. Set the production Site URL to `https://legitloot.site` only when the new LegitLoot build is approved for production. Do not change the existing live site's configuration during branch testing.
4. Add the exact redirect URL `https://legitloot.site/account.html` to the allowed redirect URLs.
5. When testing a Cloudflare Pages preview, add that exact preview account URL as an additional redirect URL. The account code uses `window.location.origin + "/account.html"`.
6. Go to **Authentication → Providers → Email** and confirm email/password sign-in is enabled and email confirmation is enabled.
7. Configure a custom SMTP provider before public launch. The built-in email service is rate-limited and is not intended for production-scale traffic.
8. Use a test email address and verify the full signup, confirmation, login, reset and sign-out flows.

Do not disable email confirmation for public launch just to make testing easier.

## Important deployment boundary

The account code is committed only to `build/legitloot-platform-foundation`. No production deploy, domain cutover, merge to `main`, or production Site URL change has been made or authorized.

## Next server-side work

- Implement authenticated Edge Functions for wallet summaries and player requests.
- Keep all private financial tables and all balance calculations server-side.
- Verify JWT ownership, authorization, idempotency, provider signatures, rate limits and audit logging.
- Add integration tests for signup-created profile and empty wallet accounts.
- Add recovery, email-change and abuse-resistant rate-limit tests.

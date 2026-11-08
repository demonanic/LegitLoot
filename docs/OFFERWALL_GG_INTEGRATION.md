# Offerwall.GG — LegitLoot LootCoins Integration

**Status:** implementation scaffolded; provider disabled; not deployed or approved for production.
**Reward currency:** LootCoins (LC).
**Source of truth:** https://offerwall.gg/developers and https://offerwall.gg/developers/postbacks

## Standard reward model

- Offerwall.GG is configured to reward the publisher's own virtual currency.
- LegitLoot calls that currency **LootCoins**, ticker/code **LC**.
- No 50/50 allocation, no automatic cash conversion, and no cash wallet credit from an offerwall callback.
- The placement's units-per-USD exchange rate must be selected in the Offerwall.GG dashboard. Do not guess or hardcode it.
- Provider callback amounts can have up to four decimal places. The ledger stores integer atoms: 1 LC = 10,000 atoms.
- Display values may show up to four decimal places. Do not use floating-point arithmetic when posting rewards or reversals.

## Hosted wall

Use the hosted wall URL documented by Offerwall.GG:

`https://offerwall.gg/wall/{PUBLIC_KEY}?userId={AUTHENTICATED_SUPABASE_USER_UUID}`

The public placement key may be exposed in the URL. The Offerwall.GG secret key must never be included in browser code, HTML, query strings, APKs or repository files.

The user ID must come from the authenticated server/session context. Do not accept a user ID supplied by an untrusted browser parameter as proof of ownership.

## Conversion callback

Edge Function:
`https://gkbqderyjcuxnjbsiffb.supabase.co/functions/v1/offerwall-gg-postback`

Configure the placement to send a form POST to that URL with all standard callback fields. Offerwall.GG documents these fields:
- `userId`
- `transactionId`
- `offerId`
- `offerName`
- `goalId`
- `currencyAmount`
- `currencyName` — configure exactly as `Loot coins`
- `payoutUsd`
- `status` — `credited` or `reversed`
- `test`
- `timestamp`
- `signature`

The callback verifies HMAC-SHA256 over exactly:
`userId:transactionId:currencyAmount`
using the Offerwall.GG secret, with a constant-time comparison. The callback does not trust `payoutUsd` because the provider documentation says it is not covered by the signature.

The endpoint:
1. Verifies the HMAC before processing.
2. Rejects malformed user IDs, amounts, status and currency name.
3. Ignores signed dashboard test callbacks without crediting LC.
4. Converts the decimal amount exactly into 1/10,000-LC atoms.
5. Calls a service-role-only database function.
6. Deduplicates on `(transactionId,status)`, so a reversal with the same transaction ID is not mistaken for a duplicate credit.
7. Posts credits and reversals as balanced compensating journal transactions.
8. Returns 2xx only after the database write is durable; failed writes return 500 so Offerwall.GG retries.

A reversal must match the original user and amount. A reversal that arrives before its original credit is not acknowledged; the provider is asked to retry.

## Required server secrets

Set these in Supabase Edge Function Secrets (never in GitHub):
- `OFFERWALL_GG_SECRET` — private secret from the Offerwall.GG placement.
- `SUPABASE_URL` — project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — service-role key.

The Supabase Edge Function is a public webhook and must be deployed with JWT verification disabled; its own HMAC verification is the authentication mechanism. Do not disable HMAC validation.

## Remaining setup and release gates

1. Confirm Offerwall.GG publisher approval for the LegitLoot domain and this standard LC model.
2. Retrieve the placement's public key and choose the units-per-USD rate in its dashboard.
3. Review and apply the two new SQL migrations to the dedicated LegitLoot Supabase project after backup and schema review.
4. Set the three Edge Function secrets in Supabase.
5. Deploy `offerwall-gg-postback` with `verify_jwt=false`.
6. Configure the callback URL as a form POST and run the provider's signed test callback. Test callbacks must not credit.
7. Test one real/approved sandbox conversion, duplicate delivery, reversal, duplicate reversal, malformed signature, invalid user, and fractional amounts.
8. Reconcile provider conversions against `GET /api/v1/conversions?transactionId=...` using the secret API key from the server only. Do not use callback `payoutUsd` as an authoritative revenue ledger amount.
9. Only after all tests and publisher approval, enable the provider and add the hosted wall entry point to the public Earn page.

## Current limitations

- No placement public key is yet configured in the site.
- No Offerwall.GG secret is present in the repository or Supabase Edge Function secrets.
- The Edge Function and migrations are committed on an isolated GitHub branch only; they are not deployed.
- The Earn page continues to show the provider as not connected.
- No LC issuance, cash conversion, withdrawals or production provider traffic is enabled.

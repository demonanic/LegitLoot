# Moonetix Reporting API reconciliation Edge Function

**Source only. Not deployed. No API key or schedule configured.**

## Required secrets

- `MOONETIX_API_KEY`: the same API key used by the Moonetix Offers API, from the dashboard API page.
- `MOONETIX_RECONCILE_SECRET`: a long random secret used to authorize the scheduled POST.
- `MOONETIX_TIMEZONE`: the account's IANA time zone, for example `America/New_York`.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: Supabase's server-side function environment values.

Never put these values in Git, browser code, a mobile bundle, or a chat message.

## Request

POST to the deployed function:

`/functions/v1/moonetix-reporting-reconcile`

Include header `x-reconcile-secret: <MOONETIX_RECONCILE_SECRET>`.

The function:
- Fetches the last 7 days of `status=credited` conversions.
- Fetches the last 92 days of `status=reversed` conversions.
- Follows the Reporting API cursor until all pages are read.
- Requires the Reporting API currency to be `EL`.
- Matches transaction ID, user ID, reward, payout, status, and credited/reversed timestamp against stored postbacks.
- Selects the verified event-time Moonetix configuration version.
- Moves matched credits to pending review; it does not approve or make them available.
- Marks matched reversals reconciled; an owner/admin must still process the compensating entry.
- Records missing postbacks/configuration in `private.moonetix_reconciliation_gaps` for review. It never invents or automatically credits a missing callback.
- Returns 207 with counts when there are unmatched/missing records.

Schedule it once daily after review. The Reporting API is limited to 60 requests per minute. No Cron schedule is created by this source change.

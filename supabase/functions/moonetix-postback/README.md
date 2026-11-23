# Moonetix postback Edge Function

**Source only. Not deployed. Do not configure a live offerwall yet.**

## Callback URL macros

When the Moonetix app is created, the Postback URL should include these exact macros:

\`https://<staging-project-ref>.supabase.co/functions/v1/moonetix-postback?user={user_id}&tx={transaction_id}&event={event_id}&status={status}&reward={reward}&payout={payout}&currency={currency}&hash={hash}&app_id={app_id}\`

Use the actual staging Supabase project URL only after the Edge Function has been reviewed and deployed. The currency configured in Moonetix must be \`EL\`.

## Required Edge Function secrets

- \`MOONETIX_POSTBACK_KEY\`: Postback page secret, not the link hash salt.
- \`SUPABASE_URL\`: staging project URL.
- \`SUPABASE_SERVICE_ROLE_KEY\`: staging service-role key.
- \`MOONETIX_APP_ID\`: optional allowlist for the app ID after creation.

Never put these values in Git, browser code, a mobile bundle, or a chat message.

## Behavior

- Accepts GET only, validates parameter formats and EL currency.
- Verifies Moonetix's HMAC-SHA256 over the exact raw values \`transaction_id:user_id:reward:status\`.
- Stores the raw reward and payout through the service-role-only RPC.
- The callback never credits available EL or LC.
- Duplicate identical event deliveries return HTTP 200 without a second event.
- Conflicting duplicate event IDs fail.
- Database errors return 503 so Moonetix retries.
- Status 2 must match a previously recorded credit transaction and exact player reward.

The separate reconciliation process must match callback records against the Moonetix Reporting API before approval. Approval remains owner/authorized-admin gated.

# Moonetix signed-link function

This authenticated function returns a signed link for the current Supabase user.

## Required Supabase secrets (staging)

- `MOONETIX_APP_ID`: app ID from Moonetix Offerwall Integration.
- `MOONETIX_LINK_HASH_SALT`: Moonetix link hash salt (not the postback secret).
- Supabase supplies `SUPABASE_URL` and the publishable/anon key for JWT verification.

Set secrets through Supabase Edge Function secrets, never commit them or paste them into chat.

## Behavior

- POST only, JWT verification enabled.
- Resolves the user from the validated Supabase session, never accepts user_id from caller payload.
- HMAC-SHA256 signs the stable UUID user ID using the link hash salt.
- Returns a link only to wall.moonetix.com.
- Does not credit rewards or access financial ledgers.
- Returns 503 until required Moonetix secrets are configured.

Before opening to players, test from a normal home/mobile connection (not VPN/proxy/cloud), verify signed links, postbacks, reporting reconciliation and admin approval path.

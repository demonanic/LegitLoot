#!/usr/bin/env bash
# TapResearch Eligibility API smoke tests (STAGING ONLY).
# One sub-command per TapResearch dashboard checklist step:
#   1 eligibility   -> "API request received (in test mode)" / step 3 prep
#   2 postback      -> "Reward callback configured" (our endpoint accepts a correctly signed GET)
#   2b badsig       -> negative check: a wrong signature must get 403
#   5 rewards       -> prints the SQL to confirm the reward was recorded
#
# Credentials come from ./.env.tapresearch (git-ignored). Never paste them into chat or commit them.
# Needs: bash, curl, openssl, python3.
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.tapresearch}"
[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE (copy scripts/tapresearch-smoke.env.example)"; exit 1; }
# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

: "${SUPABASE_URL:?}" "${SUPABASE_ANON_KEY:?}"
case "$SUPABASE_URL" in
  https://scmnxcsggquwtuyyjnnj.supabase.co) ;;
  *) echo "Refusing: SUPABASE_URL is not the staging project"; exit 1 ;;
esac
FN="$SUPABASE_URL/functions/v1"

json_get() { python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get(sys.argv[1], ""))' "$1"; }

session_token() {
  : "${TEST_USER_EMAIL:?}" "${TEST_USER_PASSWORD:?}"
  curl -sS -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
    -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
    --data "$(python3 -c 'import json,sys; print(json.dumps({"email":sys.argv[1],"password":sys.argv[2]}))' "$TEST_USER_EMAIL" "$TEST_USER_PASSWORD")" \
  | json_get access_token
}

sign() { printf '%s' "$1" | openssl dgst -md5 -hmac "$TAPRESEARCH_API_SECRET" | awk '{print $NF}'; }

case "${1:-}" in
  1|eligibility)
    token="$(session_token)"; [ -n "$token" ] || { echo "FAIL: could not sign in the test user"; exit 1; }
    echo "Calling tapresearch-eligibility as the test user..."
    resp="$(curl -sS -w '\n%{http_code}' -X POST "$FN/tapresearch-eligibility" \
      -H "Authorization: Bearer $token" -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" --data '{}')"
    code="$(tail -n1 <<<"$resp")"; body="$(sed '$d' <<<"$resp")"
    echo "HTTP $code  $body"
    [ "$code" = 200 ] || { echo "FAIL (see Common failures in docs/TAPRESEARCH_INTEGRATION.md)"; exit 1; }
    reason="$(json_get offerReason <<<"$body")"
    case "$reason" in
      0) echo "PASS: has_offer=true. Open offerUrl ON THE TEST DEVICE for checklist step 3." ;;
      2) echo "PASS (request reached TapResearch): reason 2 = app in test mode and this user/device is not a registered test device." ;;
      *) echo "PASS (request reached TapResearch): reason $reason — see the reason-code table in the docs guide." ;;
    esac ;;
  2|postback)
    : "${TAPRESEARCH_API_SECRET:?}" "${TAPRESEARCH_API_TOKEN:?}"
    uid="${TEST_USER_ID:-smoke-test-uid}"
    cpid="smoke-$(date +%s)"
    q="api_token=$TAPRESEARCH_API_TOKEN&cpid=$cpid&uid=$uid&payout_amount=1&payout_currency=SmokeTest&payout_type=3&revenue=0.01&tid=smoke"
    url="$FN/tapresearch-postback?$q&sig=$(sign "$q")"
    code="$(curl -sS -o /dev/null -w '%{http_code}' "$url")"
    echo "Signed postback cpid=$cpid -> HTTP $code"
    [ "$code" = 200 ] && echo "PASS" || { echo "FAIL"; exit 1; }
    code2="$(curl -sS -o /dev/null -w '%{http_code}' "$url")"
    echo "Same postback again (retry) -> HTTP $code2"; [ "$code2" = 200 ] && echo "PASS: duplicate acknowledged" || exit 1 ;;
  2b|badsig)
    : "${TAPRESEARCH_API_TOKEN:?}"
    q="api_token=$TAPRESEARCH_API_TOKEN&cpid=smoke-bad&uid=x&payout_amount=999"
    code="$(curl -sS -o /dev/null -w '%{http_code}' "$FN/tapresearch-postback?$q&sig=00000000000000000000000000000000")"
    echo "Bad signature -> HTTP $code"; [ "$code" = 403 ] && echo "PASS" || { echo "FAIL: expected 403"; exit 1; } ;;
  5|rewards)
    cat <<'SQL'
-- Run in the STAGING Supabase SQL editor:
select cpid, provider_uid, user_id, payout_amount, payout_currency, payout_type, revenue_usd, review_status, received_at
from private.tapresearch_rewards order by received_at desc limit 10;
SQL
    ;;
  *) echo "Usage: $0 {1|eligibility|2|postback|2b|badsig|5|rewards}"; exit 1 ;;
esac

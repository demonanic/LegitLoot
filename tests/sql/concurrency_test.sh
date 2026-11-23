#!/usr/bin/env bash
set -euo pipefail

USER_ID="00000000-0000-4000-8000-000000000001"
PACKAGE_ID="00000000-0000-4000-8000-000000000002"

set +e
(
  psql -v ON_ERROR_STOP=1 -c "select set_config('request.jwt.claim.sub','\${USER_ID}',false); select private.purchase_lootcoin_package('\${PACKAGE_ID}','race-purchase-key-0001');" >/tmp/race-1.log 2>&1
  echo $? >/tmp/race-1.exit
) &
PID1=$!
(
  psql -v ON_ERROR_STOP=1 -c "select set_config('request.jwt.claim.sub','\${USER_ID}',false); select private.purchase_lootcoin_package('\${PACKAGE_ID}','race-purchase-key-0002');" >/tmp/race-2.log 2>&1
  echo $? >/tmp/race-2.exit
) &
PID2=$!
wait "$PID1"
wait "$PID2"
set -e

STATUS1=$(cat /tmp/race-1.exit)
STATUS2=$(cat /tmp/race-2.exit)
if [[ "$STATUS1" -eq 0 && "$STATUS2" -eq 0 ]]; then
  echo "Both concurrent purchases succeeded; overspend protection failed."
  cat /tmp/race-1.log /tmp/race-2.log
  exit 1
fi
if [[ "$STATUS1" -ne 0 && "$STATUS2" -ne 0 ]]; then
  echo "Both concurrent purchases failed; expected exactly one success."
  cat /tmp/race-1.log /tmp/race-2.log
  exit 1
fi

psql -v ON_ERROR_STOP=1 <<'SQL'
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',false);
do $verify$
declare
  summary jsonb := public.get_player_wallet_summary();
  purchases bigint;
begin
  select count(*) into purchases
  from private.lootcoin_package_purchases
  where user_id='00000000-0000-4000-8000-000000000001';
  if purchases<>1 then raise exception 'Expected exactly one concurrent package purchase, found %',purchases; end if;
  if summary#>>'{earnedLoot,availableUnits}'<>'50'
    or summary#>>'{lootCoins,availableAtoms}'<>'50000' then
    raise exception 'Concurrent purchase produced incorrect balances: %',summary;
  end if;
end;
$verify$;
SQL

echo "Concurrent EL-to-LC overspend test passed."

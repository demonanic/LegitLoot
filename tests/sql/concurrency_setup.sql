do $setup$
declare
  v_user uuid := '00000000-0000-4000-8000-000000000001';
  v_event uuid := gen_random_uuid();
  v_system uuid;
  v_available uuid;
  v_tx uuid;
begin
  insert into auth.users(id,email) values(v_user,'concurrency@test.invalid')
  on conflict(id) do nothing;
  perform private.create_player_ledger_accounts(v_user);

  select id into v_system from private.ledger_accounts
  where is_system=true and account_code='platform_earned_loot_issuance' and wallet_kind='earned_loot';
  select id into v_available from private.ledger_accounts
  where owner_user_id=v_user and account_code='earned_loot_available' and wallet_kind='earned_loot';

  v_tx:=private.post_journal_transaction(
    'race-seed-idempotency-0001','race_seed','test','race-seed-1','Seed 150 EL for concurrent purchase test',
    jsonb_build_array(
      jsonb_build_object('account_id',v_system,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',150000),
      jsonb_build_object('account_id',v_available,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',150000)
    ),'{}'::jsonb
  );

  insert into private.moonetix_reward_events(
    id,user_id,provider_transaction_id,provider_event_id,provider_status,currency_code,
    reward_raw,payout_usd_raw,reward_atoms,cash_equivalent_cents,split_percent_snapshot,
    conversion_rate_snapshot,bonus_percent_snapshot,rounding_mode_snapshot,payload_digest,
    signature_valid,status,provider_credited_at,reconciled_at,reconciliation_reference,
    approval_actor,approval_at,journal_transaction_id
  ) values (
    v_event,v_user,'race-tx-1','race-event-1',1,'EL',
    '150','1.5',150000,15,50,1000,0,'whole','race-digest',true,'approved',
    now(),now(),'race-seed',v_user,now(),v_tx
  );

  insert into private.earned_loot_lots(
    reward_event_id,user_id,original_atoms,remaining_atoms,original_value_cents,remaining_value_cents
  ) values(v_event,v_user,150000,150000,15,15);

  insert into private.lootcoin_packages(
    id,package_key,display_name,el_price_atoms,lc_amount_atoms,starts_at,is_enabled
  ) values(
    '00000000-0000-4000-8000-000000000002','race-package','Concurrent 100 EL',100000,50000,now()-interval '1 hour',true
  );
end;
$setup$;

begin;

do $test$
declare
  v_user uuid := gen_random_uuid();
  v_other uuid := gen_random_uuid();
  v_config bigint;
  v_config2 bigint;
  v_event1 uuid;
  v_event2 uuid;
  v_event3 uuid;
  v_event4 uuid;
  v_test_event uuid;
  v_reversal1 uuid;
  v_reversal3 uuid;
  v_reversal2 uuid;
  v_purchase uuid;
  v_purchase_retry uuid;
  v_tx uuid;
  v_tx_retry uuid;
  v_system_el uuid;
  v_system_lc uuid;
  v_held uuid;
  v_available uuid;
  v_summary jsonb;
  v_failed boolean;
  v_issued uuid;
  v_movement_id bigint;
begin
  insert into auth.users(id,email) values(v_user,'owner@test.invalid'),(v_other,'player@test.invalid');
  insert into private.admin_users(user_id,admin_role,is_active) values(v_user,'owner',true);
  perform private.create_player_ledger_accounts(v_user);
  perform private.create_player_ledger_accounts(v_other);

  insert into private.moonetix_reward_config_versions(
    currency_code,conversion_rate,split_percent,bonus_percent,rounding_mode,
    effective_from,dashboard_reference,verified_by,verified_at,is_verified
  ) values('EL',1000,50,0,'whole',now()-interval '1 day','test-config-50',v_user,now(),true)
  returning id into v_config;

  perform set_config('request.jwt.claim.sub',v_user::text,true);

  -- Moonetix's test-postback transaction IDs must never become player rewards.
  v_test_event:=private.record_moonetix_event(v_user,'test_tx_1','test_event_1',1,'EL','999','1','test-digest',true,true);
  if (select status from private.moonetix_reward_events where id=v_test_event) <> 'test' then
    raise exception 'Moonetix test callback was not isolated';
  end if;
  v_failed:=false;
  begin
    perform public.reconcile_moonetix_credit_report('test_tx_1',v_user::text,'999','1',now(),'test-report');
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Moonetix test transaction was eligible for reconciliation'; end if;

  -- Callback receipt alone must not credit available EL.
  v_event1:=private.record_moonetix_event(v_user,'mx-tx-1','mx-event-1',1,'EL','250','0.5','digest-1',true);
  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '0'
    or v_summary#>>'{earnedLoot,pendingUnits}' <> '250'
    or v_summary#>'{earnedLoot,pendingValueCents}' <> 'null'::jsonb then
    raise exception 'Callback did not remain pending-only with value withheld';
  end if;

  v_failed:=false;
  begin
    perform public.reconcile_moonetix_credit_report('mx-tx-1',v_user::text,'250','0.6',now()-interval '1 hour','bad-report-line');
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Mismatched Reporting API payout was accepted'; end if;
  perform public.reconcile_moonetix_credit_report('mx-tx-1',v_user::text,'250','0.5',now()-interval '1 hour','statement-line-1');
  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '0'
    or v_summary#>>'{earnedLoot,pendingUnits}' <> '250' then
    raise exception 'Reconciled reward was not pending-only';
  end if;

  v_tx:=private.approve_moonetix_reward(v_event1,'owner approval');
  v_tx_retry:=private.approve_moonetix_reward(v_event1,'retry');
  if v_tx is distinct from v_tx_retry then raise exception 'Approval retry was not idempotent'; end if;
  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '250'
    or v_summary#>>'{earnedLoot,pendingUnits}' <> '0'
    or v_summary#>>'{earnedLoot,availableValueCents}' <> '25' then
    raise exception 'Approved wallet summary is incorrect';
  end if;

  -- Reporting API transactions with no matching callback are tracked, never auto-credited.
  if public.reconcile_moonetix_credit_report(
    'missing-credit-tx',v_user::text,'5','0.01',now(),'missing-credit-report'
  ) <> 'missing_credit_postback' then
    raise exception 'Missing credit postback was not recorded as a gap';
  end if;
  if public.reconcile_moonetix_reversal_report(
    'missing-reversal-tx',v_user::text,'5','0.01',now(),'missing-reversal-report'
  ) <> 'missing_reversal_postback' then
    raise exception 'Missing reversal postback was not recorded as a gap';
  end if;
  if (select count(*) from private.moonetix_reconciliation_gaps) <> 2 then
    raise exception 'Reporting API reconciliation gaps were not retained';
  end if;

  -- A duplicate callback is safe; a conflicting payload under the same event ID fails.
  if private.record_moonetix_event(v_user,'mx-tx-1','mx-event-1',1,'EL','250','0.5','digest-1',true) <> v_event1 then
    raise exception 'Identical callback retry returned a different event';
  end if;
  v_failed:=false;
  begin
    perform private.record_moonetix_event(v_user,'mx-tx-1','mx-event-1',1,'EL','125','0.5','digest-conflict',true);
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Conflicting callback duplicate was accepted'; end if;

  -- Identical journal retry returns the original; conflicting reuse is rejected.
  select id into v_system_el from private.ledger_accounts
    where is_system and account_code='platform_earned_loot_issuance' and wallet_kind='earned_loot';
  select id into v_system_lc from private.ledger_accounts
    where is_system and account_code='platform_loot_coin_issuance' and wallet_kind='loot_coins';
  select id into v_held from private.ledger_accounts
    where owner_user_id=v_user and account_code='earned_loot_held' and wallet_kind='earned_loot';
  select id into v_available from private.ledger_accounts
    where owner_user_id=v_user and account_code='earned_loot_available' and wallet_kind='earned_loot';

  v_tx:=private.post_journal_transaction(
    'idempotency-test-0001','test_event','test','test-source-1','test journal',
    jsonb_build_array(
      jsonb_build_object('account_id',v_system_el,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',10),
      jsonb_build_object('account_id',v_held,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',10)
    ),'{}'::jsonb
  );
  v_tx_retry:=private.post_journal_transaction(
    'idempotency-test-0001','test_event','test','test-source-1','test journal',
    jsonb_build_array(
      jsonb_build_object('account_id',v_held,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',10),
      jsonb_build_object('account_id',v_system_el,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',10)
    ),'{}'::jsonb
  );
  if v_tx is distinct from v_tx_retry then raise exception 'Identical journal retry changed transaction'; end if;
  v_failed:=false;
  begin
    perform private.post_journal_transaction(
      'idempotency-test-0001','test_event','test','test-source-1','test journal',
      jsonb_build_array(
        jsonb_build_object('account_id',v_system_el,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',11),
        jsonb_build_object('account_id',v_held,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',11)
      ),'{}'::jsonb
    );
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Conflicting idempotency key reuse was accepted'; end if;

  -- Available EL cannot be debited below zero.
  v_failed:=false;
  begin
    perform private.post_journal_transaction(
      'negative-balance-test-0001','test_debit','test','negative-source','negative test',
      jsonb_build_array(
        jsonb_build_object('account_id',v_available,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',250001),
        jsonb_build_object('account_id',v_system_el,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',250001)
      ),'{}'::jsonb
    );
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Negative available EL balance was accepted'; end if;

  -- One journal transaction cannot mix EL and LC, even if both pairs balance.
  v_failed:=false;
  begin
    perform private.post_journal_transaction(
      'mixed-wallet-test-0001','mixed_test','test','mixed-source','mixed wallet test',
      jsonb_build_array(
        jsonb_build_object('account_id',v_system_el,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',1),
        jsonb_build_object('account_id',v_held,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',1),
        jsonb_build_object('account_id',v_system_lc,'wallet_kind','loot_coins','currency_code','LC','direction','debit','amount',1),
        jsonb_build_object('account_id',(select id from private.ledger_accounts where owner_user_id=v_user and account_code='loot_coins_available' and wallet_kind='loot_coins'),'wallet_kind','loot_coins','currency_code','LC','direction','credit','amount',1)
      ),'{}'::jsonb
    );
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Mixed EL/LC journal transaction was accepted'; end if;

  -- Overlapping configuration windows must be rejected.
  v_failed:=false;
  begin
    insert into private.moonetix_reward_config_versions(
      currency_code,conversion_rate,split_percent,bonus_percent,rounding_mode,
      effective_from,dashboard_reference,verified_by,verified_at,is_verified
    ) values('EL',1000,55,0,'whole',now()-interval '1 hour','overlap-config',v_user,now(),true);
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Overlapping Moonetix config period was accepted'; end if;

  -- Change split to 60%; the first event remains at 50%, the next uses 60%.
  update private.moonetix_reward_config_versions set effective_to=now() where id=v_config;
  insert into private.moonetix_reward_config_versions(
    currency_code,conversion_rate,split_percent,bonus_percent,rounding_mode,
    effective_from,dashboard_reference,verified_by,verified_at,is_verified
  ) values('EL',1000,60,0,'whole',now(),'test-config-60',v_user,now(),true)
  returning id into v_config2;

  v_event2:=private.record_moonetix_event(v_user,'mx-tx-2','mx-event-2',1,'EL','300','0.5','digest-2',true);
  perform public.reconcile_moonetix_credit_report('mx-tx-2',v_user::text,'300','0.5',now()+interval '1 minute','statement-line-2');
  perform private.approve_moonetix_reward(v_event2,'owner approval');
  if (select split_percent_snapshot from private.moonetix_reward_events where id=v_event1) <> 50
    or (select split_percent_snapshot from private.moonetix_reward_events where id=v_event2) <> 60 then
    raise exception 'Historical split snapshot changed';
  end if;

  -- Atomic one-way EL-to-LC package purchase and retry after package expiry/disable.
  insert into private.lootcoin_packages(
    package_key,display_name,el_price_atoms,lc_amount_atoms,starts_at,is_enabled
  ) values('test-100-el','Test 100 EL',100000,50000,now()-interval '1 hour',true)
  returning id into v_purchase;
  v_purchase:=private.purchase_lootcoin_package(v_purchase,'shop-purchase-idempotency-001');
  update private.lootcoin_packages set is_enabled=false where id=(select package_id from private.lootcoin_package_purchases where id=v_purchase);
  v_purchase_retry:=private.purchase_lootcoin_package((select package_id from private.lootcoin_package_purchases where id=v_purchase),'shop-purchase-idempotency-001');
  if v_purchase is distinct from v_purchase_retry then raise exception 'Package purchase retry was not idempotent'; end if;

  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '450'
    or v_summary#>>'{lootCoins,availableAtoms}' <> '50000' then
    raise exception 'EL-to-LC package purchase balances are incorrect';
  end if;
  if (select coalesce(sum(amount_atoms),0) from private.earned_loot_lot_movements
      where movement_type='el_to_lc_purchase' and movement_id=v_purchase) <> 100000 then
    raise exception 'EL-to-LC purchase lot movement audit is incomplete';
  end if;
  select id into v_movement_id from private.earned_loot_lot_movements
  where movement_type='el_to_lc_purchase' and movement_id=v_purchase limit 1;
  v_failed:=false;
  begin
    update private.earned_loot_lot_movements set value_cents=0 where id=v_movement_id;
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Immutable lot movement history was mutable'; end if;

  -- Gameplay LC issuance is server-authoritative and idempotent; provider source types are rejected.
  v_issued:=private.issue_game_lootcoins(v_user,'game_milestone','milestone-1',10000);
  if private.issue_game_lootcoins(v_user,'game_milestone','milestone-1',10000) <> v_issued then
    raise exception 'Gameplay issuance retry was not idempotent';
  end if;
  v_failed:=false;
  begin
    perform private.issue_game_lootcoins(v_user,'moonetix','provider-event-1',10000);
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Provider-origin LC issuance was accepted'; end if;

  -- Reversal 1 fits the unspent EL balance and posts a compensating journal entry.
  v_reversal1:=private.record_moonetix_event(v_user,'mx-tx-1','mx-event-1-reversal',2,'EL','250.000','0.500','digest-reversal-1',true);
  v_failed:=false;
  begin
    perform public.reconcile_moonetix_reversal_report('mx-tx-1',v_user::text,'125','0.5',now()+interval '2 hours','bad-reversal-report');
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Mismatched Reporting API reversal was accepted'; end if;
  perform public.reconcile_moonetix_reversal_report('mx-tx-1',v_user::text,'250','0.5',now()+interval '2 hours','report-reversal-1');
  perform private.process_moonetix_reversal(v_reversal1,'provider reversal confirmed');
  if (select status from private.moonetix_reward_events where id=v_reversal1) <> 'reversed' then
    raise exception 'Funded reversal was not compensated';
  end if;
  if (select coalesce(sum(amount_atoms),0) from private.earned_loot_lot_movements
      where movement_type='provider_reversal' and movement_id=v_reversal1) <> 250000 then
    raise exception 'Reversal lot movement audit is incomplete';
  end if;

  -- Reversal 2 exceeds unspent EL; it must be held without creating debt.
  v_reversal2:=private.record_moonetix_event(v_user,'mx-tx-2','mx-event-2-reversal',2,'EL','300','0.5','digest-reversal-2',true);
  perform public.reconcile_moonetix_reversal_report('mx-tx-2',v_user::text,'300','0.5',now()+interval '3 hours','report-reversal-2');
  perform private.process_moonetix_reversal(v_reversal2,'excess provider reversal');
  if (select status from private.moonetix_reward_events where id=v_reversal2) <> 'held' then
    raise exception 'Excess reversal was not held';
  end if;
  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '200' then
    raise exception 'Reversal created an incorrect available EL balance';
  end if;

  -- A different authenticated player sees only their own wallet and cannot approve.
  v_event3:=private.record_moonetix_event(v_other,'mx-tx-3','mx-event-3',1,'EL','100','0.2','digest-3',true);
  perform public.reconcile_moonetix_credit_report('mx-tx-3',v_other::text,'100','0.2',now()+interval '2 minutes','statement-line-3');
  perform set_config('request.jwt.claim.sub',v_other::text,true);
  v_failed:=false;
  begin
    perform private.approve_moonetix_reward(v_event3,'unauthorized approval');
  exception when others then v_failed:=true;
  end;
  if not v_failed then raise exception 'Non-admin reward approval was accepted'; end if;
  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '0'
    or v_summary#>>'{earnedLoot,pendingUnits}' <> '100' then
    raise exception 'Wallet RPC leaked another player balance or lost pending reward';
  end if;

  -- If the provider reverses before approval, cancel the pending credit without debiting the player.
  perform set_config('request.jwt.claim.sub',v_user::text,true);
  v_event4:=private.record_moonetix_event(v_user,'mx-tx-4','mx-event-4',1,'EL','50','0.05','digest-4',true);
  perform public.reconcile_moonetix_credit_report(
    'mx-tx-4',v_user::text,'50','0.05',now()+interval '4 minutes','statement-line-4'
  );
  v_reversal3:=private.record_moonetix_event(v_user,'mx-tx-4','mx-event-4-reversal',2,'EL','50','0.05','digest-reversal-4',true);
  perform public.reconcile_moonetix_reversal_report(
    'mx-tx-4',v_user::text,'50','0.05',now()+interval '5 minutes','report-reversal-4'
  );
  perform private.process_moonetix_reversal(v_reversal3,'reversed before owner approval');
  if (select status from private.moonetix_reward_events where id=v_event4) <> 'rejected'
    or (select status from private.moonetix_reward_events where id=v_reversal3) <> 'reversed'
    or (select journal_transaction_id from private.moonetix_reward_events where id=v_reversal3) is not null then
    raise exception 'Pre-approval reversal was not closed without a player debit';
  end if;
  v_summary:=public.get_player_wallet_summary();
  if v_summary#>>'{earnedLoot,availableUnits}' <> '200'
    or v_summary#>>'{earnedLoot,pendingUnits}' <> '0' then
    raise exception 'Pre-approval reversal changed available or pending EL incorrectly';
  end if;

  raise notice 'Financial foundation integration tests passed';
end;
$test$;

rollback;

-- Step 4: reviewed Moonetix reversals and held excess reversals.
-- Step 4/5: atomic one-way EL-to-LC package purchase.
-- Step 5: server-authoritative gameplay LC issuance.
-- All functions are disabled from direct provider/client access.

create or replace function private.process_moonetix_reversal(
  p_reversal_event_id uuid,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_actor uuid := auth.uid();
  v_reversal private.moonetix_reward_events%rowtype;
  v_original private.moonetix_reward_events%rowtype;
  v_available_account uuid;
  v_issuance_account uuid;
  v_available_atoms bigint;
  v_remaining bigint;
  v_take bigint;
  v_value_take bigint;
  v_lot private.earned_loot_lots%rowtype;
  v_tx uuid;
begin
  if v_actor is null or not exists(
    select 1 from private.admin_users
    where user_id=v_actor and is_active=true and admin_role in ('owner','admin')
  ) then raise exception 'Owner or active admin authorization required'; end if;
  if p_reason is null or trim(p_reason)='' then raise exception 'Reversal review reason is required'; end if;

  select * into v_reversal from private.moonetix_reward_events
  where id=p_reversal_event_id for update;
  if not found then raise exception 'Reversal event not found'; end if;
  if v_reversal.status='reversed' and v_reversal.journal_transaction_id is not null then
    return v_reversal.journal_transaction_id;
  end if;
  if v_reversal.status='held' then return null; end if;
  if v_reversal.provider_status <> 2 or v_reversal.status <> 'reversal_pending'
    or not v_reversal.signature_valid or v_reversal.original_event_id is null
    or v_reversal.reconciled_at is null or v_reversal.provider_reversed_at is null
    or v_reversal.reconciliation_reference is null then
    raise exception 'Event is not an eligible, reconciled provider reversal';
  end if;

  select * into v_original from private.moonetix_reward_events
  where id=v_reversal.original_event_id for update;
  if not found or v_original.status <> 'approved' then
    raise exception 'Original reward is not approved; reversal requires manual hold review';
  end if;
  if v_original.user_id <> v_reversal.user_id
    or v_original.reward_raw <> v_reversal.reward_raw
    or v_original.reward_atoms is null then
    raise exception 'Reversal does not match the approved original reward';
  end if;

  select id into v_available_account from private.ledger_accounts
  where owner_user_id=v_original.user_id and account_code='earned_loot_available'
    and wallet_kind='earned_loot';
  select id into v_issuance_account from private.ledger_accounts
  where is_system=true and account_code='platform_earned_loot_issuance'
    and wallet_kind='earned_loot';
  if v_available_account is null or v_issuance_account is null then
    raise exception 'Earned Loot ledger accounts are not provisioned';
  end if;

  perform 1 from private.ledger_accounts
  where id in (v_available_account,v_issuance_account)
  order by id for update;

  select coalesce(sum(case when e.direction='credit' then e.amount else -e.amount end),0)
  into v_available_atoms
  from private.journal_entries e
  join private.journal_transactions t on t.id=e.transaction_id
  where e.account_id=v_available_account and t.status='posted';

  if v_available_atoms < v_original.reward_atoms then
    insert into private.earned_loot_reversal_cases(
      original_reward_event_id,reversal_event_id,requested_atoms,available_atoms_at_review,status,reason
    ) values (
      v_original.id,v_reversal.id,v_original.reward_atoms,greatest(v_available_atoms,0),'held_for_review',p_reason
    )
    on conflict (reversal_event_id) do nothing;
    update private.moonetix_reward_events set status='held' where id=v_reversal.id;
    insert into private.earned_loot_reward_audit(reward_event_id,actor_user_id,action,reason,metadata)
    values(v_reversal.id,v_actor,'reversal_held',p_reason,
      jsonb_build_object('requested_atoms',v_original.reward_atoms,'available_atoms',v_available_atoms));
    return null;
  end if;

  -- Consume the original reward's remaining value basis FIFO, never below zero.
  v_remaining := v_original.reward_atoms;
  for v_lot in
    select * from private.earned_loot_lots
    where user_id=v_original.user_id and remaining_atoms>0
    order by created_at,id
    for update
  loop
    exit when v_remaining=0;
    v_take := least(v_lot.remaining_atoms,v_remaining);
    if v_take=v_lot.remaining_atoms then
      v_value_take := v_lot.remaining_value_cents;
    else
      v_value_take := round(v_lot.remaining_value_cents::numeric*v_take/v_lot.remaining_atoms)::bigint;
    end if;
    update private.earned_loot_lots
    set remaining_atoms=remaining_atoms-v_take,
        remaining_value_cents=remaining_value_cents-v_value_take
    where id=v_lot.id;
    v_remaining := v_remaining-v_take;
  end loop;

  if v_remaining<>0 then
    raise exception 'Earned Loot lot balance does not reconcile to the available ledger';
  end if;

  v_tx := private.post_journal_transaction(
    'moonetix-reversal:'||v_reversal.id::text,
    'moonetix_reward_reversal','internal',v_reversal.id::text,
    'Compensating reversal of Earned Loot',
    jsonb_build_array(
      jsonb_build_object('account_id',v_available_account,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',v_original.reward_atoms),
      jsonb_build_object('account_id',v_issuance_account,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',v_original.reward_atoms)
    ),
    jsonb_build_object('original_event_id',v_original.id,'reversal_event_id',v_reversal.id,'reason',p_reason)
  );

  update private.moonetix_reward_events
  set status='reversed',journal_transaction_id=v_tx
  where id=v_reversal.id;
  update private.earned_loot_reversal_cases
  set status='compensated'
  where reversal_event_id=v_reversal.id;
  insert into private.earned_loot_reward_audit(reward_event_id,actor_user_id,action,reason,metadata)
  values(v_reversal.id,v_actor,'reversal_compensated',p_reason,jsonb_build_object('journal_transaction_id',v_tx));
  return v_tx;
end;
$fn$;
revoke all on function private.process_moonetix_reversal(uuid,text) from public,anon;
grant execute on function private.process_moonetix_reversal(uuid,text) to authenticated;

create or replace function private.purchase_lootcoin_package(
  p_package_id uuid,
  p_idempotency_key text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_package private.lootcoin_packages%rowtype;
  v_existing private.lootcoin_package_purchases%rowtype;
  v_purchase_id uuid;
  v_el_account uuid;
  v_lc_account uuid;
  v_el_system uuid;
  v_lc_system uuid;
  v_balance bigint;
  v_lot_total bigint;
  v_remaining bigint;
  v_take bigint;
  v_value_take bigint;
  v_value_consumed bigint := 0;
  v_lot private.earned_loot_lots%rowtype;
  v_el_tx uuid;
  v_lc_tx uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key))<8 then
    raise exception 'A valid idempotency key is required';
  end if;

  select * into v_existing from private.lootcoin_package_purchases
  where idempotency_key=p_idempotency_key for update;
  if found then
    if v_existing.user_id<>v_user or v_existing.package_id<>p_package_id then
      raise exception 'Purchase idempotency key reused with a different request';
    end if;
    return v_existing.id;
  end if;

  select * into v_package from private.lootcoin_packages
  where id=p_package_id for update;
  if not found or not v_package.is_enabled
    or v_package.starts_at>now()
    or (v_package.ends_at is not null and v_package.ends_at<=now()) then
    raise exception 'LootCoins package is unavailable';
  end if;

  if v_package.max_purchases_per_user is not null and (
    select count(*) from private.lootcoin_package_purchases
    where user_id=v_user and package_id=p_package_id
  ) >= v_package.max_purchases_per_user then
    raise exception 'Per-player package purchase limit reached';
  end if;
  if v_package.max_total_purchases is not null and (
    select count(*) from private.lootcoin_package_purchases
    where package_id=p_package_id
  ) >= v_package.max_total_purchases then
    raise exception 'Package purchase limit reached';
  end if;

  select id into v_el_account from private.ledger_accounts
  where owner_user_id=v_user and account_code='earned_loot_available' and wallet_kind='earned_loot';
  select id into v_lc_account from private.ledger_accounts
  where owner_user_id=v_user and account_code='loot_coins_available' and wallet_kind='loot_coins';
  select id into v_el_system from private.ledger_accounts
  where is_system=true and account_code='platform_earned_loot_issuance' and wallet_kind='earned_loot';
  select id into v_lc_system from private.ledger_accounts
  where is_system=true and account_code='platform_loot_coin_issuance' and wallet_kind='loot_coins';
  if v_el_account is null or v_lc_account is null or v_el_system is null or v_lc_system is null then
    raise exception 'EL/LC ledger accounts are not provisioned';
  end if;

  perform 1 from private.ledger_accounts
  where id in (v_el_account,v_lc_account,v_el_system,v_lc_system)
  order by id for update;

  select coalesce(sum(case when direction='credit' then amount else -amount end),0)
  into v_balance from private.journal_entries e
  join private.journal_transactions t on t.id=e.transaction_id
  where e.account_id=v_el_account and t.status='posted';
  if v_balance<v_package.el_price_atoms then raise exception 'Insufficient available Earned Loot'; end if;

  select coalesce(sum(remaining_atoms),0) into v_lot_total
  from private.earned_loot_lots where user_id=v_user and remaining_atoms>0;
  if v_lot_total<v_package.el_price_atoms then
    raise exception 'Earned Loot lot value does not reconcile to available balance';
  end if;

  insert into private.lootcoin_package_purchases(
    user_id,package_id,idempotency_key,el_price_atoms,lc_amount_atoms,el_value_cents_consumed
  ) values(v_user,p_package_id,p_idempotency_key,v_package.el_price_atoms,v_package.lc_amount_atoms,0)
  returning id into v_purchase_id;

  v_remaining:=v_package.el_price_atoms;
  for v_lot in
    select * from private.earned_loot_lots
    where user_id=v_user and remaining_atoms>0
    order by created_at,id
    for update
  loop
    exit when v_remaining=0;
    v_take:=least(v_lot.remaining_atoms,v_remaining);
    if v_take=v_lot.remaining_atoms then
      v_value_take:=v_lot.remaining_value_cents;
    else
      v_value_take:=round(v_lot.remaining_value_cents::numeric*v_take/v_lot.remaining_atoms)::bigint;
    end if;
    update private.earned_loot_lots
    set remaining_atoms=remaining_atoms-v_take,
        remaining_value_cents=remaining_value_cents-v_value_take
    where id=v_lot.id;
    v_value_consumed:=v_value_consumed+v_value_take;
    v_remaining:=v_remaining-v_take;
  end loop;
  if v_remaining<>0 then raise exception 'Earned Loot lot consumption did not reconcile'; end if;

  v_el_tx:=private.post_journal_transaction(
    'lootcoin-purchase-el:'||v_purchase_id::text,
    'earned_loot_to_lootcoins_debit','lootcoin_shop_el',v_purchase_id::text,
    'Earned Loot spent on LootCoins package',
    jsonb_build_array(
      jsonb_build_object('account_id',v_el_account,'wallet_kind','earned_loot','currency_code','EL','direction','debit','amount',v_package.el_price_atoms),
      jsonb_build_object('account_id',v_el_system,'wallet_kind','earned_loot','currency_code','EL','direction','credit','amount',v_package.el_price_atoms)
    ),
    jsonb_build_object('purchase_id',v_purchase_id,'package_id',p_package_id,'el_value_cents_consumed',v_value_consumed)
  );

  v_lc_tx:=private.post_journal_transaction(
    'lootcoin-purchase-lc:'||v_purchase_id::text,
    'earned_loot_to_lootcoins_credit','lootcoin_shop_lc',v_purchase_id::text,
    'LootCoins package credited',
    jsonb_build_array(
      jsonb_build_object('account_id',v_lc_system,'wallet_kind','loot_coins','currency_code','LC','direction','debit','amount',v_package.lc_amount_atoms),
      jsonb_build_object('account_id',v_lc_account,'wallet_kind','loot_coins','currency_code','LC','direction','credit','amount',v_package.lc_amount_atoms)
    ),
    jsonb_build_object('purchase_id',v_purchase_id,'package_id',p_package_id,'el_debit_transaction_id',v_el_tx)
  );

  update private.lootcoin_package_purchases
  set el_debit_transaction_id=v_el_tx,lc_credit_transaction_id=v_lc_tx,
      el_value_cents_consumed=v_value_consumed
  where id=v_purchase_id;
  return v_purchase_id;
end;
$fn$;
revoke all on function private.purchase_lootcoin_package(uuid,text) from public,anon;
grant execute on function private.purchase_lootcoin_package(uuid,text) to authenticated;

create or replace function private.issue_game_lootcoins(
  p_user_id uuid,
  p_source_type text,
  p_source_event_id text,
  p_amount_atoms bigint
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_existing private.game_lootcoin_issuance%rowtype;
  v_player_account uuid;
  v_system_account uuid;
  v_tx uuid;
  v_issuance_id uuid;
begin
  if p_user_id is null or p_source_event_id is null or trim(p_source_event_id)=''
    or p_amount_atoms is null or p_amount_atoms<=0 then
    raise exception 'Valid gameplay issuance details are required';
  end if;
  if p_source_type not in ('game_milestone','achievement','challenge','seasonal_event','admin_grant') then
    raise exception 'Provider-origin rewards cannot issue LootCoins';
  end if;

  select * into v_existing from private.game_lootcoin_issuance
  where source_type=p_source_type and source_event_id=p_source_event_id for update;
  if found then
    if v_existing.user_id<>p_user_id or v_existing.lc_amount_atoms<>p_amount_atoms then
      raise exception 'Gameplay issuance event reused with conflicting details';
    end if;
    return v_existing.id;
  end if;

  select id into v_player_account from private.ledger_accounts
  where owner_user_id=p_user_id and account_code='loot_coins_available' and wallet_kind='loot_coins';
  select id into v_system_account from private.ledger_accounts
  where is_system=true and account_code='platform_loot_coin_issuance' and wallet_kind='loot_coins';
  if v_player_account is null or v_system_account is null then
    raise exception 'LootCoins ledger accounts are not provisioned';
  end if;

  insert into private.game_lootcoin_issuance(user_id,source_type,source_event_id,lc_amount_atoms)
  values(p_user_id,p_source_type,p_source_event_id,p_amount_atoms)
  returning id into v_issuance_id;

  v_tx:=private.post_journal_transaction(
    'game-lootcoin:'||v_issuance_id::text,
    'game_lootcoin_issuance','game',v_issuance_id::text,
    'Server-verified gameplay LootCoins issuance',
    jsonb_build_array(
      jsonb_build_object('account_id',v_system_account,'wallet_kind','loot_coins','currency_code','LC','direction','debit','amount',p_amount_atoms),
      jsonb_build_object('account_id',v_player_account,'wallet_kind','loot_coins','currency_code','LC','direction','credit','amount',p_amount_atoms)
    ),
    jsonb_build_object('issuance_id',v_issuance_id,'source_type',p_source_type,'source_event_id',p_source_event_id)
  );
  update private.game_lootcoin_issuance set journal_transaction_id=v_tx where id=v_issuance_id;
  return v_issuance_id;
end;
$fn$;
revoke all on function private.issue_game_lootcoins(uuid,text,text,bigint) from public,anon,authenticated;
grant execute on function private.issue_game_lootcoins(uuid,text,text,bigint) to service_role;

revoke all on all tables in schema private from public,anon,authenticated;
grant select,insert,update,delete on all tables in schema private to service_role;
grant usage,select on all sequences in schema private to service_role;

-- Offerwall.GG signed conversion lifecycle.
-- LootCoins are stored as integer atoms: 1 LC = 10,000 atoms (4 decimal places).
-- Only the service-role Edge Function may invoke the posting RPC.

begin;

alter table private.ledger_accounts
  add column if not exists currency_scale integer not null default 1
  check (currency_scale in (1,10000));

update private.ledger_accounts
set currency_scale = case when wallet_kind = 'game_credits' and currency_code = 'LC' then 10000 else 1 end;

insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system, currency_scale)
values (null, 'platform_lootcoins_issuance', 'game_credits', 'LC', true, 10000)
on conflict do nothing;

create table if not exists private.offerwall_gg_conversions (
  transaction_id text primary key,
  user_id uuid not null references auth.users(id) on delete restrict,
  amount_atoms bigint not null check (amount_atoms > 0),
  currency_code text not null default 'LC' check (currency_code = 'LC'),
  status text not null check (status in ('credited','reversed')),
  offer_id text,
  offer_name text,
  goal_id text,
  first_seen_at timestamptz not null default now(),
  reversed_at timestamptz
);

create table if not exists private.offerwall_gg_callback_events (
  id bigint generated always as identity primary key,
  transaction_id text not null,
  callback_status text not null check (callback_status in ('credited','reversed')),
  user_id uuid not null references auth.users(id) on delete restrict,
  amount_atoms bigint not null,
  payload_digest text not null,
  received_at timestamptz not null default now(),
  result text not null,
  unique (transaction_id, callback_status)
);

revoke all on private.offerwall_gg_conversions, private.offerwall_gg_callback_events from public, anon, authenticated;
grant select, insert, update, delete on private.offerwall_gg_conversions, private.offerwall_gg_callback_events to service_role;
grant usage, select on sequence private.offerwall_gg_callback_events_id_seq to service_role;

create or replace function private.process_offerwall_gg_postback(
  p_user_id uuid,
  p_transaction_id text,
  p_status text,
  p_amount_atoms bigint,
  p_offer_id text,
  p_offer_name text,
  p_goal_id text,
  p_payload_digest text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conversion private.offerwall_gg_conversions%rowtype;
  v_user_account uuid;
  v_platform_account uuid;
  v_event_id bigint;
  v_journal_id uuid;
  v_key text;
  v_entries jsonb;
begin
  if p_user_id is null or p_transaction_id is null or length(p_transaction_id) < 8
     or p_status not in ('credited','reversed')
     or p_amount_atoms = 0
     or p_payload_digest is null then
    raise exception 'Invalid Offerwall.GG callback data';
  end if;

  if (p_status = 'credited' and p_amount_atoms < 0)
     or (p_status = 'reversed' and p_amount_atoms > 0) then
    raise exception 'Callback amount sign does not match status';
  end if;

  insert into private.offerwall_gg_callback_events(
    transaction_id, callback_status, user_id, amount_atoms, payload_digest, result
  ) values (
    p_transaction_id, p_status, p_user_id, p_amount_atoms, p_payload_digest, 'received'
  )
  on conflict (transaction_id, callback_status) do nothing
  returning id into v_event_id;

  if v_event_id is null then
    return jsonb_build_object('result','duplicate');
  end if;

  select id into v_user_account
  from private.ledger_accounts
  where owner_user_id = p_user_id
    and account_code = 'lootcoins_available'
    and wallet_kind = 'game_credits'
    and currency_code = 'LC'
  for update;

  select id into v_platform_account
  from private.ledger_accounts
  where is_system = true
    and account_code = 'platform_lootcoins_issuance'
    and wallet_kind = 'game_credits'
    and currency_code = 'LC'
  for update;

  if v_user_account is null or v_platform_account is null then
    raise exception 'LootCoins ledger accounts are not initialized';
  end if;

  if p_status = 'credited' then
    if exists (select 1 from private.offerwall_gg_conversions where transaction_id = p_transaction_id) then
      raise exception 'Conversion already exists with a different callback state';
    end if;

    insert into private.offerwall_gg_conversions(
      transaction_id,user_id,amount_atoms,status,offer_id,offer_name,goal_id
    ) values (
      p_transaction_id,p_user_id,p_amount_atoms,'credited',p_offer_id,p_offer_name,p_goal_id
    );

    v_key := 'offerwall-gg:credit:' || p_transaction_id;
    v_entries := jsonb_build_array(
      jsonb_build_object('account_id',v_platform_account,'wallet_kind','game_credits','currency_code','LC','direction','debit','amount',p_amount_atoms),
      jsonb_build_object('account_id',v_user_account,'wallet_kind','game_credits','currency_code','LC','direction','credit','amount',p_amount_atoms)
    );
  else
    select * into v_conversion
    from private.offerwall_gg_conversions
    where transaction_id = p_transaction_id
    for update;

    if not found then
      raise exception 'Reversal arrived before its original credit';
    end if;
    if v_conversion.user_id <> p_user_id or v_conversion.amount_atoms <> abs(p_amount_atoms) then
      raise exception 'Reversal does not match original conversion';
    end if;
    if v_conversion.status = 'reversed' then
      update private.offerwall_gg_callback_events set result='duplicate_reversal' where id=v_event_id;
      return jsonb_build_object('result','duplicate_reversal');
    end if;

    update private.offerwall_gg_conversions
    set status='reversed', reversed_at=now()
    where transaction_id=p_transaction_id;

    v_key := 'offerwall-gg:reversal:' || p_transaction_id;
    v_entries := jsonb_build_array(
      jsonb_build_object('account_id',v_user_account,'wallet_kind','game_credits','currency_code','LC','direction','debit','amount',abs(p_amount_atoms)),
      jsonb_build_object('account_id',v_platform_account,'wallet_kind','game_credits','currency_code','LC','direction','credit','amount',abs(p_amount_atoms))
    );
  end if;

  v_journal_id := private.post_journal_transaction(
    v_key,
    case when p_status='credited' then 'offerwall_gg_credit' else 'offerwall_gg_reversal' end,
    'offerwall_gg',
    p_transaction_id || ':' || p_status,
    case when p_status='credited' then 'Offerwall.GG LootCoins credit' else 'Offerwall.GG LootCoins reversal' end,
    v_entries,
    jsonb_build_object('transaction_id',p_transaction_id,'offer_id',p_offer_id,'goal_id',p_goal_id)
  );

  update private.offerwall_gg_callback_events
  set result='posted'
  where id=v_event_id;

  return jsonb_build_object('result','posted','journal_transaction_id',v_journal_id);
end;
$$;

revoke all on function private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) from public, anon, authenticated;
grant execute on function private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) to service_role;

insert into private.platform_settings(setting_key,setting_value,is_enabled)
values
  ('lootcoins_precision','{"decimals":4,"atoms_per_lc":10000}'::jsonb,false),
  ('offerwall_gg_postback','{"signature":"HMAC-SHA256","signed_fields":["userId","transactionId","currencyAmount"],"idempotency":["transactionId","status"],"test_callbacks_credit":false}'::jsonb,false)
on conflict(setting_key) do update
set setting_value=excluded.setting_value,is_enabled=false,updated_at=now();

commit;

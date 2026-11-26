-- Step 1 of the isolated Earned Loot financial foundation.
-- Harden journal idempotency and prevent negative player-account balances.
-- Apply to staging only after PR review. Do not apply to production without separate approval.

alter table private.journal_transactions
  add column if not exists request_fingerprint text;

create or replace function private.post_journal_transaction(
  p_idempotency_key text,
  p_event_type text,
  p_source_system text,
  p_source_event_id text,
  p_description text,
  p_entries jsonb,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_transaction_id uuid;
  v_existing private.journal_transactions%rowtype;
  v_entry jsonb;
  v_normalized_entries jsonb;
  v_fingerprint text;
  v_account private.ledger_accounts%rowtype;
  v_account_id uuid;
  v_wallet private.wallet_kind;
  v_currency text;
  v_debits numeric;
  v_credits numeric;
  v_balance numeric;
  v_amount bigint;
  v_direction private.ledger_direction;
begin
  if p_idempotency_key is null or length(trim(p_idempotency_key)) < 8 then
    raise exception 'A valid idempotency key is required';
  end if;
  if p_event_type is null or trim(p_event_type) = ''
    or p_source_system is null or trim(p_source_system) = ''
    or p_description is null or trim(p_description) = '' then
    raise exception 'Event type, source system, and description are required';
  end if;
  if jsonb_typeof(p_entries) <> 'array' or jsonb_array_length(p_entries) < 2 then
    raise exception 'At least two journal entries are required';
  end if;

  -- Canonicalize entry order so semantically identical retries hash identically.
  select jsonb_agg(
    jsonb_build_object(
      'account_id', (entry->>'account_id')::uuid,
      'wallet_kind', entry->>'wallet_kind',
      'currency_code', entry->>'currency_code',
      'direction', entry->>'direction',
      'amount', (entry->>'amount')::bigint
    )
    order by (entry->>'account_id')::uuid,
      entry->>'wallet_kind', entry->>'currency_code',
      entry->>'direction', (entry->>'amount')::bigint
  )
  into v_normalized_entries
  from jsonb_array_elements(p_entries) as rows(entry);

  if v_normalized_entries is null then
    raise exception 'Journal entries are required';
  end if;

  v_fingerprint := encode(
    extensions.digest(
      convert_to(
        jsonb_build_object(
          'event_type', p_event_type,
          'source_system', p_source_system,
          'source_event_id', p_source_event_id,
          'description', p_description,
          'entries', v_normalized_entries,
          'metadata', coalesce(p_metadata, '{}'::jsonb)
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );

  insert into private.journal_transactions (
    idempotency_key, event_type, source_system, source_event_id,
    description, metadata, request_fingerprint
  )
  values (
    p_idempotency_key, p_event_type, p_source_system, p_source_event_id,
    p_description, coalesce(p_metadata, '{}'::jsonb), v_fingerprint
  )
  on conflict (idempotency_key) do nothing
  returning id into v_transaction_id;

  if v_transaction_id is null then
    select * into v_existing
    from private.journal_transactions
    where idempotency_key = p_idempotency_key
    for update;

    -- Legacy rows have no fingerprint and cannot safely be assumed equivalent.
    if v_existing.request_fingerprint is null
      or v_existing.request_fingerprint <> v_fingerprint then
      raise exception 'Idempotency key reused with a different or unverifiable request';
    end if;
    return v_existing.id;
  end if;

  -- Serialize all affected accounts in stable UUID order.
  for v_account_id in
    select distinct (entry->>'account_id')::uuid
    from jsonb_array_elements(p_entries) as rows(entry)
    order by 1
  loop
    select * into v_account
    from private.ledger_accounts
    where id = v_account_id
    for update;

    if not found then
      raise exception 'Unknown ledger account: %', v_account_id;
    end if;
  end loop;

  -- Validate and insert entries only after all account locks are held.
  for v_entry in select value from jsonb_array_elements(p_entries)
  loop
    select * into v_account
    from private.ledger_accounts
    where id = (v_entry->>'account_id')::uuid;

    v_wallet := (v_entry->>'wallet_kind')::private.wallet_kind;
    v_direction := (v_entry->>'direction')::private.ledger_direction;
    v_currency := v_entry->>'currency_code';
    v_amount := (v_entry->>'amount')::bigint;

    if v_amount is null or v_amount <= 0
      or v_wallet <> v_account.wallet_kind
      or v_currency is distinct from v_account.currency_code then
      raise exception 'Invalid journal entry wallet, currency, or amount';
    end if;

    insert into private.journal_entries (
      transaction_id, account_id, wallet_kind, currency_code, direction, amount
    )
    values (
      v_transaction_id, v_account.id, v_wallet, v_account.currency_code,
      v_direction, v_amount
    );
  end loop;

  -- A journal transaction may contain exactly one wallet kind/currency.
  -- EL-to-LC conversion uses linked transactions inside one database transaction.
  if (select count(distinct wallet_kind) from private.journal_entries
      where transaction_id = v_transaction_id) <> 1 then
    raise exception 'A journal transaction cannot mix wallet kinds';
  end if;

  -- Every wallet/currency pair in a transaction must balance independently.
  for v_currency, v_wallet in
    select distinct currency_code, wallet_kind
    from private.journal_entries
    where transaction_id = v_transaction_id
  loop
    select
      coalesce(sum(amount) filter (where direction = 'debit'), 0),
      coalesce(sum(amount) filter (where direction = 'credit'), 0)
    into v_debits, v_credits
    from private.journal_entries
    where transaction_id = v_transaction_id
      and currency_code = v_currency
      and wallet_kind = v_wallet;

    if v_debits <> v_credits then
      raise exception 'Unbalanced journal transaction for % / %', v_wallet, v_currency;
    end if;
  end loop;

  -- Player-owned accounts are credit-normal. System accounts may carry either sign.
  for v_account in
    select distinct a.*
    from private.ledger_accounts a
    join private.journal_entries e on e.account_id = a.id
    where e.transaction_id = v_transaction_id
      and not a.is_system
    order by a.id
  loop
    select coalesce(sum(
      case when direction = 'credit' then amount else -amount end
    ), 0)
    into v_balance
    from private.journal_entries
    where account_id = v_account.id;

    if v_balance < 0 then
      raise exception 'Player ledger balance cannot be negative for account %', v_account.account_code;
    end if;
  end loop;

  return v_transaction_id;
end;
$fn$;

revoke all on function private.post_journal_transaction(text,text,text,text,text,jsonb,jsonb)
  from public, anon, authenticated;
grant execute on function private.post_journal_transaction(text,text,text,text,text,jsonb,jsonb)
  to service_role;

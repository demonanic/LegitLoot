-- Align the staging wallet summary payload with account-auth.js.
-- LootCoins remain non-cash and non-withdrawable.

create or replace function public.get_wallet_summary()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  with user_accounts as (
    select id, account_code, wallet_kind, currency_code
    from private.ledger_accounts
    where owner_user_id = v_user_id and is_system = false
  ),
  balances as (
    select
      a.account_code,
      a.wallet_kind::text as wallet_kind,
      a.currency_code,
      coalesce(sum(case
        when e.direction::text = 'credit' then e.amount
        when e.direction::text = 'debit' then -e.amount
        else 0
      end), 0)::numeric(30,0) as balance
    from user_accounts a
    left join private.journal_entries e on e.account_id = a.id
    left join private.journal_transactions t on t.id = e.transaction_id
      and t.status::text = 'posted'
    where e.id is null or t.id is not null
    group by a.account_code, a.wallet_kind, a.currency_code
  )
  select jsonb_build_object(
    'currency', jsonb_build_object('cash', 'USD', 'gameCredits', 'LLC'),
    'cash', jsonb_build_object(
      'availableCents', coalesce(sum(balance) filter (where account_code = 'cash_available' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'pendingCents', coalesce(sum(balance) filter (where account_code = 'cash_pending' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'withdrawalReservedCents', coalesce(sum(balance) filter (where account_code = 'cash_withdrawal_reserved' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'paidCents', coalesce(sum(balance) filter (where account_code = 'cash_paid' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'heldCents', coalesce(sum(balance) filter (where account_code = 'cash_held' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text
    ),
    'gameCredits', jsonb_build_object(
      'available', coalesce(sum(balance) filter (where account_code = 'lootcoins_available' and wallet_kind = 'game_credits' and currency_code = 'LC'),0)::text,
      'provisional', coalesce(sum(balance) filter (where account_code = 'lootcoins_provisional' and wallet_kind = 'game_credits' and currency_code = 'LC'),0)::text,
      'deferred', coalesce(sum(balance) filter (where account_code = 'lootcoins_deferred' and wallet_kind = 'game_credits' and currency_code = 'LC'),0)::text,
      'cashValue', null,
      'withdrawable', false
    )
  ) into v_result
  from balances;

  return v_result;
end;
$function$;

revoke all on function public.get_wallet_summary() from public, anon;
grant execute on function public.get_wallet_summary() to authenticated;

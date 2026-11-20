-- PROPOSED, NOT APPLIED. DO NOT APPLY without independent staging-ref and rollback review.
-- WALLET-01: LC-only get_wallet_summary() response. Removes cash/USD buckets and the
-- "LLC" label from the authoritative wallet API. Replaces the function body only;
-- no table or data change. The trailing REVOKE/GRANT statements only restate the ACL that is live today
-- (authenticated + service_role EXECUTE; anon/PUBLIC none) and must be preceded by the precondition check below. Response key is `lootCoins`, which wallet-summary.js
-- already parses (gameCredits is still accepted for the unchanged environments).
-- Production and staging still return the cash contract until this is separately approved.

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
      and wallet_kind = 'game_credits' and currency_code = 'LC'
  ),
  balances as (
    select
      a.account_code,
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
    group by a.account_code
  )
  select jsonb_build_object(
    'lootCoins', jsonb_build_object(
      'available', coalesce(sum(balance) filter (where account_code = 'lootcoins_available'),0)::text,
      'provisional', coalesce(sum(balance) filter (where account_code = 'lootcoins_provisional'),0)::text,
      'deferred', coalesce(sum(balance) filter (where account_code = 'lootcoins_deferred'),0)::text,
      'withdrawable', false
    )
  ) into v_result
  from balances;

  return v_result;
end;
$function$;

-- Precondition (run read-only before applying; expect authenticated=true, service_role=true, anon=false, public=false):
--   select has_function_privilege('authenticated','public.get_wallet_summary()','execute'),
--          has_function_privilege('service_role','public.get_wallet_summary()','execute'),
--          has_function_privilege('anon','public.get_wallet_summary()','execute');
revoke all on function public.get_wallet_summary() from public, anon;
grant execute on function public.get_wallet_summary() to authenticated, service_role;

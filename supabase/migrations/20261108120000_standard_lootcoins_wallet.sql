-- LegitLoot: replace the proposed split offerwall model with standard LootCoins rewards.
-- Apply only through the reviewed migration process on the dedicated LegitLoot Supabase project.
-- This migration does NOT enable Offerwall.GG or create a public postback endpoint.

begin;

alter table private.ledger_accounts drop constraint if exists ledger_account_currency;
alter table private.ledger_accounts
  add constraint ledger_account_currency check (
    (wallet_kind = 'cash_usd' and currency_code = 'USD')
    or (wallet_kind = 'game_credits' and currency_code in ('LLC','LC'))
  );

-- Create one spendable LootCoins account for every existing player.
insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system)
select u.id, 'lootcoins_available', 'game_credits', 'LC', false
from auth.users u
on conflict (owner_user_id, account_code, wallet_kind) do nothing;

-- Legacy LLC ledger accounts and entries remain untouched for audit continuity.
-- A later precision migration converts any existing balance through balanced
-- cross-currency entries rather than reinterpreting historical integer units.

-- New accounts receive one LootCoins balance and retain separate future cash buckets.
create or replace function private.create_player_ledger_accounts(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $func$
begin
  insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system)
  values
    (p_user_id, 'cash_pending', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_available', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_withdrawal_reserved', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_paid', 'cash_usd', 'USD', false),
    (p_user_id, 'cash_held', 'cash_usd', 'USD', false),
    (p_user_id, 'lootcoins_available', 'game_credits', 'LC', false)
  on conflict (owner_user_id, account_code, wallet_kind) do nothing;
end;
$func$;
revoke all on function private.create_player_ledger_accounts(uuid) from public, anon, authenticated;
grant execute on function private.create_player_ledger_accounts(uuid) to service_role;

delete from private.platform_settings
where setting_key in ('player_reward_pool_split','game_credit_release_schedule');

insert into private.platform_settings(setting_key, setting_value, is_enabled)
values
  ('offerwall_reward_currency', '{"code":"LC","name":"LootCoins","mode":"standard_provider_currency"}'::jsonb, false),
  ('offerwall_reward_policy', '{"credit_only":true,"cash_conversion":false,"split_allocation":false,"reversal_adjustments":true}'::jsonb, false)
on conflict (setting_key) do update
set setting_value = excluded.setting_value,
    is_enabled = false,
    updated_at = now();

insert into private.providers(provider_key, display_name, provider_type, status, approved_reward_model)
values ('offerwall_gg', 'Offerwall.GG', 'offerwall', 'disabled',
        '{"currency_code":"LC","currency_name":"LootCoins","reward_mode":"standard_virtual_currency"}'::jsonb)
on conflict (provider_key) do update
set status = 'disabled',
    approved_reward_model = excluded.approved_reward_model,
    updated_at = now();

-- Authenticated users receive a private aggregate only; no ledger rows are exposed.
create or replace function public.get_wallet_summary()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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
      end),0)::numeric(30,0) as balance
    from user_accounts a
    left join private.journal_entries e on e.account_id = a.id
    left join private.journal_transactions t on t.id = e.transaction_id
      and t.status::text = 'posted'
    where e.id is null or t.id is not null
    group by a.account_code, a.wallet_kind, a.currency_code
  )
  select jsonb_build_object(
    'cash', jsonb_build_object(
      'availableCents', coalesce(sum(balance) filter (where account_code = 'cash_available' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'pendingCents', coalesce(sum(balance) filter (where account_code = 'cash_pending' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'withdrawalReservedCents', coalesce(sum(balance) filter (where account_code = 'cash_withdrawal_reserved' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'paidCents', coalesce(sum(balance) filter (where account_code = 'cash_paid' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text,
      'heldCents', coalesce(sum(balance) filter (where account_code = 'cash_held' and wallet_kind = 'cash_usd' and currency_code = 'USD'),0)::text
    ),
    'lootCoins', jsonb_build_object(
      'available', coalesce(sum(balance) filter (where account_code = 'lootcoins_available' and wallet_kind = 'game_credits' and currency_code = 'LC'),0)::text
    )
  ) into v_result
  from balances;

  return v_result;
end;
$$;
revoke all on function public.get_wallet_summary() from public, anon;
grant execute on function public.get_wallet_summary() to authenticated;

commit;

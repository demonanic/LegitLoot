-- LegitLoot: replace the proposed split offerwall model with standard LootCoins rewards.
-- Apply only through the reviewed migration process on the dedicated LegitLoot Supabase project.
-- This migration does NOT enable Offerwall.GG or create a public postback endpoint.

begin;

-- LC is the canonical currency code for LootCoins. Keep the internal wallet_kind enum
-- stable for compatibility while removing the legacy LLC currency identifier.
alter table private.ledger_accounts drop constraint if exists ledger_account_currency;
update private.ledger_accounts
set currency_code = 'LC'
where wallet_kind = 'game_credits' and currency_code = 'LLC';

alter table private.ledger_accounts
  add constraint ledger_account_currency check (
    (wallet_kind = 'cash_usd' and currency_code = 'USD')
    or (wallet_kind = 'game_credits' and currency_code = 'LC')
  );

-- New accounts receive one spendable LootCoins balance. Legacy split accounts remain
-- for audit continuity and are consolidated below without deleting historical entries.
insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system)
select u.id, 'lootcoins_available', 'game_credits', 'LC', false
from auth.users u
on conflict (owner_user_id, account_code, wallet_kind) do nothing;

-- Consolidate any existing available/provisional/deferred credit balances into the
-- single LootCoins account using balanced, append-only journal transactions.
do $$
declare
  v_user record;
  v_target_account uuid;
  v_entries jsonb;
  v_total numeric;
  v_idempotency text;
  v_transaction uuid;
begin
  for v_user in
    select distinct owner_user_id
    from private.ledger_accounts
    where owner_user_id is not null
      and wallet_kind = 'game_credits'
      and account_code in ('game_credits_available','game_credits_provisional','game_credits_deferred')
  loop
    select id into v_target_account
    from private.ledger_accounts
    where owner_user_id = v_user.owner_user_id
      and account_code = 'lootcoins_available'
      and wallet_kind = 'game_credits';

    select coalesce(sum(
      case when e.direction = 'credit' then e.amount else -e.amount end
    ),0)
    into v_total
    from private.ledger_accounts a
    left join private.journal_entries e on e.account_id = a.id
    left join private.journal_transactions t on t.id = e.transaction_id and t.status = 'posted'
    where a.owner_user_id = v_user.owner_user_id
      and a.wallet_kind = 'game_credits'
      and a.account_code in ('game_credits_available','game_credits_provisional','game_credits_deferred')
      and (e.id is null or t.id is not null);

    if v_total < 0 then
      raise exception 'Cannot consolidate negative legacy LootCoins balance for user %', v_user.owner_user_id;
    end if;

    if v_total > 0 then
      v_idempotency := 'lootcoins-consolidation:' || v_user.owner_user_id::text;

      if not exists (
        select 1 from private.journal_transactions where idempotency_key = v_idempotency
      ) then
        select jsonb_agg(jsonb_build_object(
          'account_id', a.id,
          'wallet_kind', 'game_credits',
          'currency_code', 'LC',
          'direction', 'debit',
          'amount', b.balance::text
        )) into v_entries
        from (
          select a.id,
            coalesce(sum(case when e.direction = 'credit' then e.amount else -e.amount end),0) as balance
          from private.ledger_accounts a
          left join private.journal_entries e on e.account_id = a.id
          left join private.journal_transactions t on t.id = e.transaction_id and t.status = 'posted'
          where a.owner_user_id = v_user.owner_id
            and a.wallet_kind = 'game_credits'
            and a.account_code in ('game_credits_available','game_credits_provisional','game_credits_deferred')
            and (e.id is null or t.id is not null)
          group by a.id
          having coalesce(sum(case when e.direction = 'credit' then e.amount else -e.amount end),0) > 0
        ) b
        join private.ledger_accounts a on a.id = b.id;

        v_entries := coalesce(v_entries, '[]'::jsonb)
          || jsonb_build_array(jsonb_build_object(
            'account_id', v_target_account,
            'wallet_kind', 'game_credits',
            'currency_code', 'LC',
            'direction', 'credit',
            'amount', v_total::text
          ));

        v_transaction := private.post_journal_transaction(
          v_idempotency,
          'lootcoins_legacy_consolidation',
          'system_migration',
          v_user.owner_id::text,
          'Consolidate legacy game-credit buckets into LootCoins',
          v_entries,
          jsonb_build_object('migration','standard_lootcoins_wallet')
        );
      end if;
    end if;
  end loop;
end;
$$;

-- New accounts: one LootCoins wallet plus the existing separate future cash buckets.
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

-- Remove the old split model settings; they are no longer part of the product rules.
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

commit;

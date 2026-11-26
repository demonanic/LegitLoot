-- AUTH-03e: authenticated, read-only JSON export of the player's own account data.
-- This function runs with a fixed search path and derives the owner only from auth.uid().
-- It deliberately excludes provider secrets, raw callback payloads, encryption ciphertext,
-- internal audit metadata, idempotency keys, and other players' records.

do $guard$
begin
  if to_regclass('private.game_saves') is null then
    raise exception 'This staging export migration requires private.game_saves';
  end if;
  if to_regclass('private.moonetix_reward_events') is null then
    raise exception 'This export migration requires private.moonetix_reward_events';
  end if;
  if to_regclass('private.earned_loot_lots') is null
     or to_regclass('private.earned_loot_lot_movements') is null then
    raise exception 'This export migration requires the Earned Loot lot schema';
  end if;
end;
$guard$;

create or replace function public.export_account_data()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_export jsonb;
begin
  if v_user is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if private.is_account_deleted(v_user) then
    raise exception 'Account deleted' using errcode = '28000';
  end if;

  select jsonb_build_object(
    'exportVersion', 1,
    'exportedAt', now(),
    'account', jsonb_build_object(
      'email', u.email,
      'username', p.username,
      'displayName', p.display_name,
      'avatarPath', p.avatar_path,
      'createdAt', p.created_at,
      'updatedAt', p.updated_at
    ),
    'walletSummary', public.get_player_wallet_summary(),
    'ledgerAccounts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'accountCode', a.account_code,
          'walletKind', a.wallet_kind::text,
          'currencyCode', a.currency_code,
          'currencyScale', a.currency_scale,
          'openedAt', a.created_at,
          'closedAt', a.closed_at
        ) order by a.created_at, a.account_code
      )
      from private.ledger_accounts a
      where a.owner_user_id = v_user
    ), '[]'::jsonb),
    'ledgerHistory', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'entryId', e.id::text,
          'transactionId', e.transaction_id,
          'walletKind', e.wallet_kind::text,
          'currencyCode', e.currency_code,
          'direction', e.direction::text,
          'amountAtoms', e.amount::text,
          'createdAt', e.created_at,
          'transaction', case when t.id is null then null else jsonb_build_object(
            'eventType', t.event_type,
            'description', t.description,
            'sourceSystem', t.source_system,
            'status', t.status::text,
            'createdAt', t.created_at,
            'reversalOf', t.reversal_of
          ) end
        ) order by e.created_at desc, e.id desc
      )
      from private.journal_entries e
      join private.ledger_accounts a on a.id = e.account_id
      left join private.journal_transactions t on t.id = e.transaction_id
      where a.owner_user_id = v_user
    ), '[]'::jsonb),
    'earnedLootLots', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'lotId', l.id,
          'rewardEventId', l.reward_event_id,
          'originalAtoms', l.original_atoms::text,
          'remainingAtoms', l.remaining_atoms::text,
          'originalValueCents', l.original_value_cents::text,
          'remainingValueCents', l.remaining_value_cents::text,
          'createdAt', l.created_at
        ) order by l.created_at, l.id
      )
      from private.earned_loot_lots l
      where l.user_id = v_user
    ), '[]'::jsonb),
    'earnedLootMovements', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'movementId', m.movement_id,
          'movementType', m.movement_type,
          'amountAtoms', m.amount_atoms::text,
          'valueCents', m.value_cents::text,
          'createdAt', m.created_at
        ) order by m.created_at, m.id
      )
      from private.earned_loot_lot_movements m
      where m.user_id = v_user
    ), '[]'::jsonb),
    'providerRewardEvents', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'status', e.status,
          'currencyCode', e.currency_code,
          'rewardAtoms', case when e.reward_atoms is null then null else e.reward_atoms::text end,
          'isTest', e.is_test,
          'receivedAt', e.received_at,
          'createdAt', e.created_at,
          'creditedAt', e.provider_credited_at,
          'approvedAt', e.approval_at,
          'reversedAt', e.provider_reversed_at
        ) order by e.created_at desc, e.id
      )
      from private.moonetix_reward_events e
      where e.user_id = v_user
    ), '[]'::jsonb),
    'lootCoinPurchases', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'packageId', p.package_id,
          'earnedLootPriceAtoms', p.el_price_atoms::text,
          'lootCoinsCreditedAtoms', p.lc_amount_atoms::text,
          'earnedLootValueCentsConsumed', p.el_value_cents_consumed::text,
          'createdAt', p.created_at
        ) order by p.created_at, p.id
      )
      from private.lootcoin_package_purchases p
      where p.user_id = v_user
    ), '[]'::jsonb),
    'gameSaves', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'gameId', s.game_id,
          'schemaVersion', s.schema_version,
          'revision', s.revision::text,
          'saveData', s.save_data,
          'createdAt', s.created_at,
          'updatedAt', s.updated_at
        ) order by s.updated_at desc, s.game_id
      )
      from private.game_saves s
      where s.user_id = v_user
    ), '[]'::jsonb),
    'payoutRequests', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'amountMinor', r.amount_minor::text,
          'currencyCode', r.currency_code,
          'destinationType', r.destination_type,
          'recipientHint', r.recipient_hint,
          'status', r.status::text,
          'requestedAt', r.requested_at,
          'processedAt', r.processed_at,
          'paidAt', r.paid_at
        ) order by r.requested_at desc, r.id
      )
      from private.payout_requests r
      where r.user_id = v_user
    ), '[]'::jsonb)
  )
  into v_export
  from auth.users u
  join public.profiles p on p.id = u.id
  where u.id = v_user;

  if v_export is null then
    raise exception 'Account record not found';
  end if;

  return v_export;
end;
$fn$;

revoke all on function public.export_account_data() from public, anon, service_role;
grant execute on function public.export_account_data() to authenticated;

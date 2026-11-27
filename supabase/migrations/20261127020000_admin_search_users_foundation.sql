-- LegitLoot Admin Cockpit P1: secure, server-side user search/read foundation.
-- Draft migration: review and test in isolated staging before applying.
-- Only service_role may execute. The actor UUID is verified against active owner admins.
create or replace function public.admin_search_users(
  p_actor_user_id uuid,
  p_search text,
  p_limit integer default 25
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_claim_role text;
  v_term text;
  v_limit integer;
  v_rows jsonb;
begin
  v_claim_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif((nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'), '')
  );
  if v_claim_role is distinct from 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;
  if p_actor_user_id is null then
    raise exception 'Actor user ID required' using errcode = '22023';
  end if;
  if not exists (
    select 1 from private.admin_users
    where user_id = p_actor_user_id and is_active = true and admin_role = 'owner'
  ) then
    raise exception 'Owner administrator required' using errcode = '42501';
  end if;

  v_term := trim(coalesce(p_search, ''));
  if length(v_term) < 2 then
    raise exception 'Search must contain at least two characters' using errcode = '22023';
  end if;
  v_limit := greatest(1, least(coalesce(p_limit,25),50));

  with matched as (
    select u.id, u.email, u.created_at as auth_created_at,
           p.username, p.display_name, p.deleted_at, p.updated_at
    from auth.users u
    left join public.profiles p on p.id = u.id
    where u.id::text ilike '%' || v_term || '%'
       or coalesce(u.email,'') ilike '%' || v_term || '%'
       or coalesce(p.username,'') ilike '%' || v_term || '%'
       or coalesce(p.display_name,'') ilike '%' || v_term || '%'
    order by u.created_at desc
    limit v_limit
  ),
  balances as (
    select la.owner_user_id,
      la.wallet_kind::text as wallet_kind,
      la.currency_code,
      la.currency_scale,
      sum(case je.direction::text when 'credit' then je.amount else -je.amount end)::bigint as balance
    from private.ledger_accounts la
    left join private.journal_entries je on je.account_id=la.id
    where la.owner_user_id is not null
      and la.owner_user_id in (select id from matched)
    group by la.owner_user_id,la.wallet_kind,la.currency_code,la.currency_scale
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'userId',m.id,
    'email',m.email,
    'username',m.username,
    'displayName',m.display_name,
    'createdAt',m.auth_created_at,
    'profileUpdatedAt',m.updated_at,
    'deletedAt',m.deleted_at,
    'balances',coalesce((
      select jsonb_agg(jsonb_build_object(
        'walletKind',b.wallet_kind,
        'currency',b.currency_code,
        'scale',b.currency_scale,
        'amountAtoms',b.balance
      ) order by b.wallet_kind)
      from balances b where b.owner_user_id=m.id
    ),'[]'::jsonb)
  ) order by m.auth_created_at desc),'[]'::jsonb)
  into v_rows from matched m;

  return jsonb_build_object('success',true,'results',v_rows,'limit',v_limit);
end;
$fn$;

revoke all on function public.admin_search_users(uuid,text,integer) from public,anon,authenticated;
grant execute on function public.admin_search_users(uuid,text,integer) to service_role;

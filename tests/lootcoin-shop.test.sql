-- Verify seeded exchange catalog, exact 2 LC/$1 tiers and public API privilege separation.
do $$
begin
  if (select count(*) from private.lootcoin_packages where is_enabled) <> 3 then raise exception 'Expected three active LC shop tiers'; end if;
  if not exists(select 1 from private.lootcoin_packages where package_key='el_1_usd' and el_price_atoms=1000 and lc_amount_atoms=20000 and is_enabled) then raise exception '1 EL tier mismatch'; end if;
  if not exists(select 1 from private.lootcoin_packages where package_key='el_5_usd' and el_price_atoms=5000 and lc_amount_atoms=100000 and is_enabled) then raise exception '5 EL tier mismatch'; end if;
  if not exists(select 1 from private.lootcoin_packages where package_key='el_10_usd' and el_price_atoms=10000 and lc_amount_atoms=200000 and is_enabled) then raise exception '10 EL tier mismatch'; end if;
  if has_function_privilege('anon','public.get_active_lootcoin_packages()','execute') then raise exception 'Anonymous package listing is not permitted'; end if;
  if not has_function_privilege('authenticated','public.get_active_lootcoin_packages()','execute') then raise exception 'Authenticated package listing missing'; end if;
  if has_function_privilege('anon','public.purchase_lootcoin_package(uuid,text)','execute') then raise exception 'Anonymous purchases are not permitted'; end if;
  if not has_function_privilege('authenticated','public.purchase_lootcoin_package(uuid,text)','execute') then raise exception 'Authenticated purchase RPC missing'; end if;
end $$;

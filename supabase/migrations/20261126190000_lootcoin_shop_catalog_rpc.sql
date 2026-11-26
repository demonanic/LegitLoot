-- Staging one-way EL-to-LC exchange catalog at 2 LC per $1 of EL value.
insert into private.lootcoin_packages(package_key,display_name,el_price_atoms,lc_amount_atoms,starts_at,is_enabled)
values ('el_1_usd','1 EL → 2 LC',1000,20000,now(),true),('el_5_usd','5 EL → 10 LC',5000,100000,now(),true),('el_10_usd','10 EL → 20 LC',10000,200000,now(),true)
on conflict(package_key) do update set is_enabled=true,starts_at=excluded.starts_at;
create or replace function public.get_active_lootcoin_packages()
returns table(package_id uuid,package_key text,display_name text,el_price_atoms bigint,lc_amount_atoms bigint)
language sql stable security definer set search_path=''
as $fn$ select p.id,p.package_key,p.display_name,p.el_price_atoms,p.lc_amount_atoms from private.lootcoin_packages p where p.is_enabled and p.starts_at<=now() and (p.ends_at is null or p.ends_at>now()) order by p.el_price_atoms,p.id; $fn$;
revoke all on function public.get_active_lootcoin_packages() from public,anon; grant execute on function public.get_active_lootcoin_packages() to authenticated;
create or replace function public.purchase_lootcoin_package(p_package_id uuid,p_idempotency_key text)
returns uuid language plpgsql security definer set search_path=''
as $fn$ begin if auth.uid() is null then raise exception 'Authentication required'; end if; return private.purchase_lootcoin_package(p_package_id,p_idempotency_key); end; $fn$;
revoke all on function public.purchase_lootcoin_package(uuid,text) from public,anon; grant execute on function public.purchase_lootcoin_package(uuid,text) to authenticated;

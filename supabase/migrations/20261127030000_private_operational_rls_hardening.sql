-- Defense-in-depth RLS for privileged operational tables in the private schema.
-- The private schema has no USAGE grants to anon/authenticated; service_role retains explicit table grants.
-- These tables are intentionally policy-free for ordinary clients. Backend access is through service_role
-- and trusted owner-controlled SECURITY DEFINER RPCs. RLS is enabled but not forced on table owners.
alter table private.moonetix_reward_config_versions enable row level security;
alter table private.moonetix_reward_events enable row level security;
alter table private.earned_loot_lots enable row level security;
alter table private.moonetix_reconciliation_gaps enable row level security;
alter table private.earned_loot_reward_audit enable row level security;
alter table private.earned_loot_lot_movements enable row level security;
alter table private.earned_loot_reversal_cases enable row level security;
alter table private.lootcoin_packages enable row level security;
alter table private.lootcoin_package_purchases enable row level security;
alter table private.game_lootcoin_issuance enable row level security;

revoke all on private.moonetix_reward_config_versions,private.moonetix_reward_events,private.earned_loot_lots,private.moonetix_reconciliation_gaps,private.earned_loot_reward_audit,private.earned_loot_lot_movements,private.earned_loot_reversal_cases,private.lootcoin_packages,private.lootcoin_package_purchases,private.game_lootcoin_issuance from anon,authenticated,public;

-- Explicitly allow only the privileged backend role through RLS policies.
create policy "service_role_backend_access" on private.moonetix_reward_config_versions for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.moonetix_reward_events for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.earned_loot_lots for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.moonetix_reconciliation_gaps for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.earned_loot_reward_audit for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.earned_loot_lot_movements for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.earned_loot_reversal_cases for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.lootcoin_packages for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.lootcoin_package_purchases for all to service_role using (true) with check (true);
create policy "service_role_backend_access" on private.game_lootcoin_issuance for all to service_role using (true) with check (true);

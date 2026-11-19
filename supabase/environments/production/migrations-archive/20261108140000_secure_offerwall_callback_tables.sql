-- Keep provider callback audit tables inaccessible to client roles.
-- service_role retains access and bypasses RLS for the trusted Edge Function.
begin;
alter table private.offerwall_gg_conversions enable row level security;
alter table private.offerwall_gg_callback_events enable row level security;
commit;
-- Production readiness: index foreign-key columns flagged by the production advisor.
-- Additive, non-destructive. Review and deploy through the normal migration path.
create index if not exists audit_log_actor_user_id_idx on private.audit_log(actor_user_id);
create index if not exists journal_transactions_reversal_of_idx on private.journal_transactions(reversal_of);
create index if not exists offerwall_gg_callback_events_user_id_idx on private.offerwall_gg_callback_events(user_id);
create index if not exists offerwall_gg_conversions_user_id_idx on private.offerwall_gg_conversions(user_id);
create index if not exists payout_requests_payout_provider_id_idx on private.payout_requests(payout_provider_id);
create index if not exists payout_requests_reserved_journal_transaction_id_idx on private.payout_requests(reserved_journal_transaction_id);
create index if not exists platform_settings_updated_by_idx on private.platform_settings(updated_by);
create index if not exists provider_events_journal_transaction_id_idx on private.provider_events(journal_transaction_id);
create index if not exists provider_events_user_id_idx on private.provider_events(user_id);
create index if not exists reward_allocations_user_id_idx on private.reward_allocations(user_id);

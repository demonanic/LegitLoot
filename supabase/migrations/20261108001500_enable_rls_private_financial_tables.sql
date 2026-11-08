-- Defense-in-depth: keep financial and provider tables server-only.
-- No client-facing policies are intentionally created here.
ALTER TABLE private.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.journal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.provider_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.reward_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.platform_settings ENABLE ROW LEVEL SECURITY;

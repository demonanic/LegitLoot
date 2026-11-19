# Production Supabase applied migration history

- Environment: **production** (`LegitLoot`, `gkbqderyjcuxnjbsiffb`, us-east-1)
- Captured: 2026-11-19
- Source: Supabase migration-history API (read-only).
- Important: this API returns applied version/name metadata only. It does **not** return the original SQL. Do not treat this list as replayable migrations or infer that the repository contains the exact SQL for every applied record.

| Applied version | Migration name |
|---|---|
| 20261107235859 | initial_legitloot_platform_schema |
| 20261107235952 | profile_updated_at_trigger |
| 20261108001429 | enable_rls_private_financial_tables |
| 20261108013316 | secure_wallet_summary_rpc |
| 20261108081619 | standard_lootcoins_wallet |
| 20261108081622 | offerwall_gg_callback_pipeline |
| 20261108081650 | secure_offerwall_callback_tables |

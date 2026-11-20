# Staging database snapshot — 2026-11-19

Project: `scmnxcsggquwtuyyjnnj`

This directory contains read-only, point-in-time exports from the deployed staging database.


**Status correction — 2026-11-20 03:31 ET:** This snapshot is stale for the Offerwall.GG callback routines. Its `private.process_offerwall_gg_postback` definition still calls `private.post_journal_transaction` and contains the pre-record-only LC ledger path. The applied staging migration history includes `20261119145340 offerwall_gg_record_only`; a read-only live staging query on 2026-11-20 confirmed that the current function is record-only and contains no ledger/journal write. Use the deployed staging database and applied migration history as the current truth for this routine. Do not restore or replay the stale function from this snapshot.

- `routines.sql` is a point-in-time export of PostgreSQL `pg_get_functiondef()` output; it is not guaranteed to reflect later applied migrations.
- This is **not** the original `game_platform_foundation` migration SQL.
- Supabase migration history exposes applied versions, not the original SQL text. The original migration file was not found on any of the 11 inspected GitHub branches.
- Do not place this snapshot in `supabase/migrations/` or replay it as a migration.
- A complete reconstruction still requires table definitions, constraints, indexes, policies, grants, triggers, and dependency ordering. Treat the deployed database as the current staging truth until that reconstruction is reviewed.
- No database objects were changed by this export.

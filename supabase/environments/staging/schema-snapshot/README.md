# Staging database snapshot — 2026-11-19

Project: `scmnxcsggquwtuyyjnnj`

This directory contains read-only exports from the deployed staging database.

- `routines.sql` contains current definitions returned by PostgreSQL `pg_get_functiondef()`.
- This is **not** the original `game_platform_foundation` migration SQL.
- Supabase migration history exposes applied versions, not the original SQL text. The original migration file was not found on any of the 11 inspected GitHub branches.
- Do not place this snapshot in `supabase/migrations/` or replay it as a migration.
- A complete reconstruction still requires table definitions, constraints, indexes, policies, grants, triggers, and dependency ordering. Treat the deployed database as the current staging truth until that reconstruction is reviewed.
- No database objects were changed by this export.

# Production migration archive — NOT REPLAYABLE

These two files are the `main`-branch migration files for the Offerwall.GG callback pipeline, archived here unchanged by M2-T1 (2026-11-19) so they no longer share `supabase/migrations/` with the staging-lineage files of the same purpose.

| File | Staging-lineage counterpart in `supabase/migrations/` | Difference |
|---|---|---|
| `20261108130000_offerwall_gg_callback_pipeline.sql` | `20261109130000_offerwall_gg_callback_pipeline.sql` | This production-lineage file also creates `platform_legacy_llc_clearing` and posts LLC→LC 1:1 legacy balance conversion journal transactions. |
| `20261108140000_secure_offerwall_callback_tables.sql` | `20261109140000_secure_offerwall_callback_tables.sql` | Identical content, different filename. |

Rules:
- Do **not** run these files against any database or copy them back into `supabase/migrations/`.
- Production's applied migration ledger shows 7 records (latest `20261108081650`); applied version numbers differ from these filenames because Supabase assigns versions at apply time. The exact mapping from these files to production records is **UNVERIFIED** until a production migration-history export like `supabase/environments/staging/MIGRATION_HISTORY.md` is made.
- Both lineages implement provider callbacks that post LC, which violates the 2026-11-19 LC policy (`docs/PLATFORM_BUILD_SPEC.md` §0.1, audit PROV-07). They are archived as history, not as an approved design.
- A single forward migration lineage for both environments is an open design item (audit MIG-01).

# Production Edge Function source snapshots

Captured 2026-11-19 from the live production Supabase project `gkbqderyjcuxnjbsiffb` using read-only function-source export. Each `index.ts` is the source returned for the deployed version at capture time; the manifest records the deployed version, `verify_jwt` setting, and platform-provided source hash.

These files are **rollback/reference snapshots**, not authorization to deploy. Before any production function change, preserve the current manifest, compare the exact target source, obtain owner approval, and use the documented release manifest and deployment procedure. Never copy secrets into this directory. Runtime secrets are referenced only by environment-variable name in source.

# RETIRED — DO NOT DEPLOY

`index.ts` in this directory is a **historical forensic snapshot** (pre-containment v1/v3 snapshot). It is not a deployment source.

Offerwall.GG was permanently retired by owner decision on 2026-11-20 (`docs/security/OFFERWALL_GG_RETIREMENT.md`). The only permitted deployable source is the inert HTTP 410 tombstone at `supabase/functions/offerwall-gg-wall-url/`.

Never redeploy or restore this snapshot: it can generate provider URLs and/or process provider callbacks. The file is kept unchanged as audit evidence of what was deployed; it does not describe the current deployed state once the tombstone is deployed (verify the live function version separately).

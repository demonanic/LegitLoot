import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../supabase/functions/cpagrip-attribution/index.ts", import.meta.url), "utf8");
const code = src.replace(/(^|[\s;{}])\/\/.*$/gm, "$1");

test("CPAGrip canonical source is an inert 410 tombstone with no attribution path", () => {
  assert.match(code, /status:\s*410/);
  assert.doesNotMatch(code, /createClient|supabase-js|\.rpc\(|auth\.getUser|Deno\.env|request\.json|store_cpagrip_attribution_token|trackingId|Access-Control/);
  assert.equal((code.match(/Deno\.serve\(/g) || []).length, 1);
});

test("CPAGrip tombstone is not wired into the website or registry", () => {
  for (const f of ["earn-providers.js", "earn-hub.js", "earn.html"]) {
    assert.doesNotMatch(readFileSync(new URL(`../${f}`, import.meta.url), "utf8"), /cpagrip/i, f);
  }
});

test("CPAGrip staging retirement proposal is source-only, non-destructive and fail-closed", () => {
  const sql = readFileSync(new URL("../supabase/proposed/staging/20261121120000_cpagrip_attribution_retirement.sql", import.meta.url), "utf8");
  const exec = sql.replace(/^\s*--.*$/gm, "");
  assert.match(sql, /NOT APPLIED\. DO NOT APPLY/);
  assert.match(exec, /revoke all on function public\.store_cpagrip_attribution_token\(text, uuid, text, timestamptz\)\s+from public, anon, authenticated, service_role;/);
  assert.doesNotMatch(exec, /\bgrant\b|\bdrop\b|\bdelete\b|\btruncate\b|\bupdate\b|\binsert\b|create (or replace )?function|alter table/i);
  assert.match(sql, /FORWARD-ONLY, FAIL-CLOSED/);
  assert.match(sql, /aclexplode\(coalesce\(p\.proacl, acldefault\('f', p\.proowner\)\)\)[\s\S]*a\.grantee = 0/, "direct PUBLIC grant check");
  const doc = readFileSync(new URL("../docs/security/CPAGRIP_STAGING_RETIREMENT.md", import.meta.url), "utf8");
  assert.match(doc, /ABORT and escalate[\s\S]*differs from the expected/);
  assert.match(doc, /authenticated staging request with a valid staging\s+JWT/);
  assert.match(doc, /aclexplode/);
  const wf = readFileSync(new URL("../.github/workflows/offerwall-gg-retirement-tests.yml", import.meta.url), "utf8");
  assert.match(wf, /supabase\/functions\/cpagrip-attribution\/\*\*/);
  assert.match(wf, /deno check supabase\/functions\/cpagrip-attribution\/index\.ts/);
});

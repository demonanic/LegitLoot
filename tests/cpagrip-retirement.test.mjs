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

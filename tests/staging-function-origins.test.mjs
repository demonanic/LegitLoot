// Run: node --test tests/*.test.mjs
// Staging/production isolation for Edge Function sources (audit ENV-03).
// Every canonical function under supabase/functions/ targets staging and must not
// accept browser calls from the production site. Deployed snapshots under
// supabase/environments/ are historical records and are deliberately not checked.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const functionsDir = new URL("supabase/functions/", root);
const PRODUCTION_ORIGIN = /["'`]https:\/\/(www\.)?legitloot\.site\/?["'`]/;

const functions = readdirSync(functionsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(new URL(`${d.name}/index.ts`, functionsDir)))
  .map((d) => d.name);

test("canonical function sources exist for the staging provider functions", () => {
  for (const name of ["cpagrip-attribution", "offerwall-gg-wall-url", "offerwall-gg-postback"]) {
    assert.ok(functions.includes(name), `missing supabase/functions/${name}/index.ts`);
  }
});

test("no canonical function source allows the production origin", () => {
  for (const name of functions) {
    const source = readFileSync(new URL(`${name}/index.ts`, functionsDir), "utf8").replace(/(^|[\s;{}])\/\/.*$/gm, "$1"); // strip comments, not the // inside URLs
    assert.ok(!PRODUCTION_ORIGIN.test(source), `supabase/functions/${name} allows https://legitloot.site`);
  }
});

test("canonical cpagrip-attribution is a retired tombstone; the staging snapshot is historical deployed evidence", () => {
  const strip = (s) => s.split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
  const canonical = strip(readFileSync(new URL("supabase/functions/cpagrip-attribution/index.ts", root), "utf8"));
  const snapshot = strip(readFileSync(new URL("supabase/environments/staging/functions/cpagrip-attribution/index.ts", root), "utf8"));
  assert.match(canonical, /status:\s*410/);
  assert.notEqual(canonical, snapshot, "canonical source no longer mirrors the still-deployed staging v5 (retirement deploy is owner/authorized-staging gated)");
  assert.match(snapshot, /store_cpagrip_attribution_token/, "snapshot still records the deployed attribution path");
});

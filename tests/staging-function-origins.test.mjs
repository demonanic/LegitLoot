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

test("canonical cpagrip-attribution differs from the deployed snapshot only by the production origin", () => {
  const strip = (s) => s.split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
  const canonical = strip(readFileSync(new URL("supabase/functions/cpagrip-attribution/index.ts", root), "utf8"));
  const snapshot = strip(readFileSync(new URL("supabase/environments/staging/functions/cpagrip-attribution/index.ts", root), "utf8"));
  assert.equal(canonical, snapshot.replace('  "https://legitloot.site",\n', ""));
});


test("Offerwall.GG wall URL source is inert and cannot create a provider wall", () => {
  const entrypoint = readFileSync(new URL("supabase/functions/offerwall-gg-wall-url/index.ts", root), "utf8");
  const handler = readFileSync(new URL("supabase/functions/offerwall-gg-wall-url/handler.ts", root), "utf8");
  assert.match(entrypoint, /Deno\.serve\(handler\)/);
  assert.doesNotMatch(
    entrypoint + handler,
    /createClient|OFFERWALL_GG_(?:PUBLIC_KEY|SECRET)|offerwall\.gg\/wall|signWallParams|auth\.getUser|crypto\.subtle/i,
  );
  assert.match(handler, /status:\s*410/);
  assert.match(handler, /OFFERWALL_GG_DISABLED/);
});

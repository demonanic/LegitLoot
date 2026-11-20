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
const PRODUCTION_ORIGIN = /["']https:\/\/(www\.)?legitloot\.site\/?["']/;

const functions = readdirSync(functionsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(new URL(d.name + "/index.ts", functionsDir)))
  .map((d) => d.name);

// Follow every relative import/export, including dynamic imports, so a helper
// cannot hide a production origin or active provider code outside index.ts.
function readLocalImportGraph(entryUrl) {
  const seen = new Set();
  const modules = [];

  function visit(url) {
    assert.ok(url.href.startsWith(functionsDir.href), "local import escapes supabase/functions: " + url.href);
    if (seen.has(url.href)) return;
    seen.add(url.href);

    const source = readFileSync(url, "utf8");
    modules.push({ url, source });

    const specifiers = new Set([
      ...[...source.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/g)].map((m) => m[1]),
      ...[...source.matchAll(/\bimport\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g)].map((m) => m[1]),
    ]);
    for (const specifier of specifiers) visit(new URL(specifier, url));
  }

  visit(entryUrl);
  return modules;
}

test("canonical function sources exist for the staging provider functions", () => {
  for (const name of ["cpagrip-attribution", "offerwall-gg-wall-url", "offerwall-gg-postback"]) {
    assert.ok(functions.includes(name), "missing supabase/functions/" + name + "/index.ts");
  }
});

test("no canonical function or transitive local import allows the production origin", () => {
  for (const name of functions) {
    const modules = readLocalImportGraph(new URL(name + "/index.ts", functionsDir));
    for (const module of modules) {
      const source = module.source.replace(/(^|[\s;{}])\/\/.*$/gm, "$1"); // strip comments, not // inside URLs
      assert.ok(!PRODUCTION_ORIGIN.test(source), module.url.pathname + " allows https://legitloot.site");
    }
  }
});

test("canonical cpagrip-attribution differs from the deployed snapshot only by the production origin", () => {
  const strip = (s) => s.split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
  const canonical = strip(readFileSync(new URL("supabase/functions/cpagrip-attribution/index.ts", root), "utf8"));
  const snapshot = strip(readFileSync(new URL("supabase/environments/staging/functions/cpagrip-attribution/index.ts", root), "utf8"));
  assert.equal(canonical, snapshot.replace('  "https://legitloot.site",\n', ""));
});

test("Offerwall.GG wall URL source is inert and cannot create a provider wall", () => {
  const graph = readLocalImportGraph(new URL("offerwall-gg-wall-url/index.ts", functionsDir));
  const entrypoint = graph.find((module) => module.url.pathname.endsWith("/offerwall-gg-wall-url/index.ts"))?.source ?? "";
  const handler = graph.find((module) => module.url.pathname.endsWith("/offerwall-gg-wall-url/handler.mjs"))?.source ?? "";
  const graphSource = graph.map((module) => module.source).join("\n");

  assert.ok(handler, "wall URL handler is missing from the local import graph");
  assert.match(entrypoint, /from "\.\/handler\.mjs"/);
  assert.match(entrypoint, /Deno\.serve\(handler\)/);
  assert.doesNotMatch(
    graphSource,
    /createClient|OFFERWALL_GG_(?:PUBLIC_KEY|SECRET)|offerwall\.gg\/wall|signWallParams|auth\.getUser|crypto\.subtle/i,
  );
  assert.match(handler, /status:\s*410/);
  assert.match(handler, /OFFERWALL_GG_DISABLED/);
});

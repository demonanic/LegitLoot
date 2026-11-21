// Run: node --test tests/*.test.mjs
// Guards the build branch against talking to the production Supabase project.
// The build branch and its Cloudflare preview are staging-only (docs/ENVIRONMENT_SOURCE_OF_TRUTH.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");
const PRODUCTION_REF = "gkbqderyjcuxnjbsiffb";
const STAGING_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";

function loadConfig() {
  const sandbox = { window: {} };
  vm.runInNewContext(read("supabase-config.js"), sandbox);
  return sandbox.window.LEGITLOOT_SUPABASE_CONFIG;
}

// Runs account-auth.js with a fake Supabase library and reports whether a client was created.
function runAccountAuth(config) {
  const created = [];
  const status = { innerHTML: "" };
  const sandbox = {
    window: {
      LEGITLOOT_SUPABASE_CONFIG: config,
      supabase: { createClient: (url, key) => { created.push(url); throw new Error("stop after client creation"); } },
    },
    document: { getElementById: (id) => (id === "auth-status" ? status : null), querySelectorAll: () => [] },
    console,
  };
  // Test copy only: open the legal gate so the staging-environment guard is what is exercised.
  // The shipped file keeps the gate closed (tests/account-legal-gate.test.mjs).
  const source = read("account-auth.js").replace("const LEGAL_NOTICES_FINAL = false;", "const LEGAL_NOTICES_FINAL = true;");
  try { vm.runInNewContext(source, sandbox); } catch (error) {
    if (error.message !== "stop after client creation") throw error;
  }
  return { created, status: status.innerHTML };
}

test("supabase-config.js targets staging only", () => {
  const config = loadConfig();
  assert.equal(config.environment, "staging");
  assert.equal(config.url, STAGING_URL);
  assert.ok(!JSON.stringify(config).includes(PRODUCTION_REF));
  assert.ok(Object.isFrozen(config));
});

test("no frontend file references the production project", () => {
  const files = readdirSync(root).filter((f) => f.endsWith(".js") || f.endsWith(".html"));
  for (const file of files) assert.ok(!read(file).includes(PRODUCTION_REF), `${file} references production`);
});

test("account-auth creates a client only for the staging config", () => {
  assert.deepEqual(runAccountAuth(loadConfig()).created, [STAGING_URL]);
});

test("account-auth fails closed for missing, production, or mislabelled config", () => {
  const cases = [
    undefined,
    { url: `https://${PRODUCTION_REF}.supabase.co`, publishableKey: "x", environment: "production" },
    { url: `https://${PRODUCTION_REF}.supabase.co`, publishableKey: "x", environment: "staging" },
    { url: STAGING_URL, publishableKey: "x", environment: "production" },
    { url: STAGING_URL, publishableKey: "", environment: "staging" },
  ];
  for (const config of cases) {
    const result = runAccountAuth(config);
    assert.deepEqual(result.created, [], JSON.stringify(config));
    assert.match(result.status, /ACCOUNT UNAVAILABLE/);
  }
});

test("pages that use Supabase load the staging config before their scripts", () => {
  for (const page of ["account.html", "earn.html", "admin.html", "payout-simulator.html"]) {
    const html = read(page);
    if (!html.includes("supabase-js")) continue;
    const configAt = html.indexOf('src="supabase-config.js"');
    assert.ok(configAt > 0, `${page} must load supabase-config.js`);
    for (const script of ["account-auth.js", "earn-hub.js", "admin.js", "payout-simulator.js"]) {
      const at = html.indexOf(`src="${script}`);
      if (at > 0) assert.ok(configAt < at, `${page}: supabase-config.js must precede ${script}`);
    }
  }
});

test("staging wall-url function does not allow the production origin", () => {
  const source = read("supabase/functions/offerwall-gg-wall-url/index.ts");
  assert.ok(!/["']https:\/\/legitloot\.site["']/.test(source));
});

// Runs earn-hub.js with one active provider and a fake DOM, and reports whether a client was created.
function runEarnHub(config) {
  const created = [];
  const node = () => ({
    className: "", textContent: "", id: "", disabled: false, dataset: {},
    append() {}, setAttribute() {}, addEventListener() {},
  });
  const sandbox = {
    window: {
      LEGITLOOT_SUPABASE_CONFIG: config,
      LEGITLOOT_EARN_REGISTRY: {
        states: { active: { label: "Active", mark: "●", canOpen: true, detail: "" } },
        providers: [{ id: "test", kind: "provider", state: "active", name: "Test", kicker: "", description: "", categories: ["offerwall"],
          launch: { functionName: "wall-url", allowedOrigins: ["https://example.com"], pathPrefix: "/" } }],
      },
      supabase: { createClient: (url) => { created.push(url); throw new Error("stop after client creation"); } },
      location: {},
    },
    document: { getElementById: () => node(), createElement: () => node() },
  };
  try { vm.runInNewContext(read("earn-hub.js"), sandbox); } catch (error) {
    if (error.message !== "stop after client creation") throw error;
  }
  return created;
}

test("earn-hub creates a client only for the staging config", () => {
  assert.deepEqual(runEarnHub(loadConfig()), [STAGING_URL]);
});

test("earn-hub fails closed for missing, production, or mislabelled config", () => {
  for (const config of [
    undefined,
    { url: `https://${PRODUCTION_REF}.supabase.co`, publishableKey: "x", environment: "production" },
    { url: `https://${PRODUCTION_REF}.supabase.co`, publishableKey: "x", environment: "staging" },
    { url: STAGING_URL, publishableKey: "x", environment: "production" },
    { url: STAGING_URL, publishableKey: "", environment: "staging" },
  ]) {
    assert.deepEqual(runEarnHub(config), [], JSON.stringify(config));
  }
});

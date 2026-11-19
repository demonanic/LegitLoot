// ENV-06: admin.js and payout-simulator.js must fail closed unless the config is the exact staging project.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");
const PRODUCTION_REF = "gkbqderyjcuxnjbsiffb";
const STAGING_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";

// Generic DOM element stub: any property read yields a harmless value, so only client creation matters.
function element() {
  const target = function () {};
  return new Proxy(target, {
    get: (_t, prop) => (prop === "addEventListener" || prop === "querySelectorAll" || prop === "closest" ? () => [] : prop === "classList" ? { toggle() {} } : element()),
    set: () => true,
    apply: () => element(),
  });
}

function run(file, config) {
  const created = [];
  const sandbox = {
    window: {
      LEGITLOOT_SUPABASE_CONFIG: config,
      supabase: { createClient: (url) => { created.push(url); return { auth: { getSession: async () => ({ data: { session: null }, error: null }), signOut: async () => ({}) }, functions: { invoke: async () => ({ data: null, error: null }) } }; } },
    },
    document: { getElementById: () => element(), querySelectorAll: () => [], addEventListener() {} },
    Intl, console, prompt() {}, confirm() {},
  };
  sandbox.window.document = sandbox.document;
  const ctx = vm.createContext(sandbox);
  vm.runInContext(read(file), ctx);
  return new Promise((resolve) => setTimeout(() => resolve(created), 20));
}

const bad = [
  undefined,
  { url: `https://${PRODUCTION_REF}.supabase.co`, publishableKey: "x", environment: "production" },
  { url: `https://${PRODUCTION_REF}.supabase.co`, publishableKey: "x", environment: "staging" },
  { url: STAGING_URL, publishableKey: "x", environment: "production" },
  { url: STAGING_URL, publishableKey: "", environment: "staging" },
];

for (const file of ["admin.js", "payout-simulator.js"]) {
  test(`${file} creates a client only for the exact staging config`, async () => {
    const good = { url: STAGING_URL, publishableKey: "x", environment: "staging" };
    assert.deepEqual(await run(file, good), [STAGING_URL]);
  });
  test(`${file} fails closed for missing, production, mislabelled, or keyless config`, async () => {
    for (const config of bad) assert.deepEqual(await run(file, config), [], JSON.stringify(config));
  });
}

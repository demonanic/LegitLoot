// Run: node --test tests/*.test.mjs
// Guards the earning-hub registry against accidental activation or invented data.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../earn-providers.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const { states, categories, providers } = sandbox.window.LEGITLOOT_EARN_REGISTRY;
const byId = Object.fromEntries(providers.map((p) => [p.id, p]));

test("only the five documented states exist, and only active can open", () => {
  assert.deepEqual(Object.keys(states).sort(), ["active", "pending_approval", "suspended", "testing", "unavailable"]);
  for (const [key, s] of Object.entries(states)) assert.equal(s.canOpen, key === "active", key);
});

test("every entry uses a known state and known categories", () => {
  const ids = new Set();
  for (const p of providers) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`); ids.add(p.id);
    assert.ok(Object.hasOwn(states, p.state), `${p.id} state ${p.state}`);
    assert.ok(p.categories.length > 0, p.id);
    for (const c of p.categories) assert.ok(Object.hasOwn(categories, c), `${p.id} category ${c}`);
  }
});

test("no provider is open to players in this release", () => {
  assert.equal(providers.filter((p) => p.state === "active").length, 0);
});

test("Offerwall.GG is pending approval; CPAGrip is testing with no launch endpoint", () => {
  assert.equal(byId["offerwall-gg"].state, "pending_approval");
  assert.equal(byId.cpagrip.state, "testing");
  assert.equal(byId.cpagrip.kind, "provider");
  assert.equal(byId.cpagrip.launch, null);
});

test("launch blocks only allow https origins and name a server function", () => {
  for (const p of providers.filter((p) => p.launch)) {
    assert.match(p.launch.functionName, /^[a-z0-9-]+$/);
    assert.ok(p.launch.allowedOrigins.length > 0);
    for (const o of p.launch.allowedOrigins) assert.match(o, /^https:\/\/[^/]+$/);
  }
});

test("registry text carries no amounts, rates or payout claims", () => {
  const text = JSON.stringify(providers);
  assert.doesNotMatch(text, /\$\s?\d|\d+\s?(LC|LootCoins|coins|%)|cash out|real payout|withdraw/i);
});

test("frontend scripts never call reward/ledger RPCs or write tables", () => {
  const hub = readFileSync(new URL("../earn-hub.js", import.meta.url), "utf8");
  assert.doesNotMatch(hub, /\.rpc\(|\.from\(|\.insert\(|\.upsert\(|\.update\(|\.delete\(/);
  assert.doesNotMatch(hub, /innerHTML/);
});

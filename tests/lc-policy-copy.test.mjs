// Run: node --test tests/*.test.mjs
// Guards player-facing copy against the obsolete reward model.
// Policy: docs/PLATFORM_BUILD_SPEC.md §0.1 (Legit Coins, owner-locked 2026-11-19).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
// Internal staging tools are not player-facing.
const INTERNAL = new Set(["admin.html", "payout-simulator.html", "admin.js", "payout-simulator.js"]);
const playerFiles = readdirSync(root).filter((f) => (f.endsWith(".html") || f.endsWith(".js")) && !INTERNAL.has(f) && f !== "supabase-config.js");

// Visible text only: drop scripts/styles in HTML and attribute values like ids.
const visibleText = (file) => {
  let s = readFileSync(new URL(file, root), "utf8");
  if (file.endsWith(".html")) s = s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, "").replace(/\s(id|class|href|src)="[^"]*"/g, "");
  // In JS, check only string literals that read as text (contain a space), not element ids or keys.
  else s = [...s.matchAll(/"([^"\n]*)"|`([^`]*)`/g)].map((m) => m[1] ?? m[2]).filter((t) => /\s/.test(t)).join("\n");
  return s;
};

const banned = [
  [/lootcoin/i, "obsolete name LootCoins (use Legit Coins)"],
  [/game credits?/i, "obsolete name game credits"],
  [/\bLLC\b/, "obsolete unit LLC"],
  [/cash wallet|pending cash|withdrawal reserved/i, "cash wallet UI"],
  [/provider confirms|credited .* after .*provider/i, "provider-to-LC claim"],
];

test("player-facing text uses the current Legit Coins model", () => {
  for (const file of playerFiles) {
    const text = visibleText(file);
    for (const [pattern, why] of banned) assert.ok(!pattern.test(text), `${file}: ${why}`);
  }
});

test("account page shows no USD wallet fields", () => {
  const html = readFileSync(new URL("account.html", root), "utf8");
  assert.ok(!/wallet-cash-/.test(html), "account.html still has cash wallet elements");
  assert.ok(!/\$ — —/.test(html), "account.html still shows a dollar placeholder");
});

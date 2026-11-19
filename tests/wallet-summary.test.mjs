// Run: node --test tests/*.test.mjs
// Regression test for the get_wallet_summary() response contract (PR #11 review).
// The two response shapes below mirror the SQL that each environment applied:
// - staging:    supabase/migrations/20261109010000_align_wallet_summary_response.sql
// - production: supabase/migrations/20261108120000_standard_lootcoins_wallet.sql
// The first test checks the SQL files still build these keys, so the fixtures cannot drift silently.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(read("wallet-summary.js"), sandbox);
const { parseLegitCoins, formatLegitCoins, ATOMS_PER_LC } = sandbox.window.LEGITLOOT_WALLET;

// Staging RPC (align_wallet_summary_response): LC balance under gameCredits, values are atom strings.
const stagingResponse = {
  currency: { cash: "USD", gameCredits: "LLC" },
  cash: { availableCents: "0", pendingCents: "0", withdrawalReservedCents: "0", paidCents: "0", heldCents: "0" },
  gameCredits: { available: "125000", provisional: "0", deferred: "0", cashValue: null, withdrawable: false },
};
// Production-lineage RPC (standard_lootcoins_wallet): LC balance under lootCoins.
const productionResponse = {
  cash: { availableCents: "0", pendingCents: "0", withdrawalReservedCents: "0", paidCents: "0", heldCents: "0" },
  lootCoins: { available: "125000" },
};

test("fixtures match the keys the migration SQL actually builds", () => {
  const staging = read("supabase/migrations/20261109010000_align_wallet_summary_response.sql");
  assert.match(staging, /'gameCredits', jsonb_build_object\(\s*'available', coalesce\(sum\(balance\) filter \(where account_code = 'lootcoins_available'/);
  const production = read("supabase/migrations/20261108120000_standard_lootcoins_wallet.sql");
  assert.match(production, /'lootCoins', jsonb_build_object\(\s*'available', coalesce\(sum\(balance\) filter \(where account_code = 'lootcoins_available'/);
});

test("LC accounts use 10,000 atoms per LC in both migration lineages", () => {
  assert.equal(ATOMS_PER_LC, 10000);
  for (const file of [
    "supabase/migrations/20261109130000_offerwall_gg_callback_pipeline.sql",
    "supabase/environments/production/migrations-archive/20261108130000_offerwall_gg_callback_pipeline.sql",
  ]) {
    assert.match(read(file), /currency_scale\s*=\s*case when wallet_kind\s*=\s*'game_credits' and currency_code\s*=\s*'LC' then 10000/, file);
  }
});

test("staging response renders the LC balance", () => {
  assert.equal(parseLegitCoins(stagingResponse), 12.5);
  assert.equal(formatLegitCoins(parseLegitCoins(stagingResponse)), "12.5 LC");
});

test("production-lineage response renders the same LC balance", () => {
  assert.equal(parseLegitCoins(productionResponse), 12.5);
});

test("zero and fractional balances format correctly", () => {
  assert.equal(formatLegitCoins(parseLegitCoins({ gameCredits: { available: "0" } })), "0 LC");
  assert.equal(formatLegitCoins(parseLegitCoins({ gameCredits: { available: "1" } })), "0.0001 LC");
});

test("incomplete or malformed responses are rejected, never shown as a balance", () => {
  for (const bad of [null, {}, { cash: stagingResponse.cash }, { gameCredits: {} }, { gameCredits: { available: null } },
    { gameCredits: { available: "" } }, { gameCredits: { available: "12.5" } }, { gameCredits: { available: "abc" } },
    { gameCredits: { available: "99999999999999999999" } }]) {
    assert.throws(() => parseLegitCoins(bad), JSON.stringify(bad));
  }
});

test("cash fields never influence the result", () => {
  const withCash = { ...stagingResponse, cash: { ...stagingResponse.cash, availableCents: "999999" } };
  assert.equal(parseLegitCoins(withCash), 12.5);
});

test("account page loads the wallet parser before account-auth.js", () => {
  const html = read("account.html");
  const parserAt = html.indexOf('src="wallet-summary.js');
  assert.ok(parserAt > 0 && parserAt < html.indexOf('src="account-auth.js'));
});

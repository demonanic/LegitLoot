// Run: node --test tests/*.test.mjs
// STATIC fixture + parser coverage only. This is NOT proof of the deployed RPC contract.
// The fixtures are modelled on repository SQL whose applied versions differ in prefix:
// - staging:    repo 20261109010000_align_wallet_summary_response.sql; applied as
//               20261109050922 align_wallet_summary_response_with_staging_frontend
// - production: repo 20261108120000_standard_lootcoins_wallet.sql; applied as
//               20261108081619 standard_lootcoins_wallet
// SQL equivalence between the repo files and the applied statements was not demonstrated here;
// the live contract was last read by DaVinci (cash/USD buckets still returned: WALLET-01).
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

test("fixtures match the keys the repository migration SQL builds (static; not the applied statement)", () => {
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

test("contract: the staging 'LLC' label is a display alias; the balance is the LC ledger account", () => {
  const sql = read("supabase/migrations/20261109010000_align_wallet_summary_response.sql");
  // The label is cosmetic: the client never reads currency.gameCredits.
  assert.match(sql, /'gameCredits', 'LLC'/);
  assert.equal(stagingResponse.currency.gameCredits, "LLC");
  // The balance itself is filtered to the LC game-credits ledger account, in atoms.
  assert.match(sql, /account_code = 'lootcoins_available' and wallet_kind = 'game_credits' and currency_code = 'LC'/);
  const src = read("wallet-summary.js");
  assert.doesNotMatch(src, /\.currency\b/, "parser must not depend on the currency label");
  // Changing the label must not change the rendered balance.
  const relabelled = { ...stagingResponse, currency: { cash: "USD", gameCredits: "LC" } };
  assert.equal(parseLegitCoins(relabelled), parseLegitCoins(stagingResponse));
});

test("WALLET-01 source (not deployed): LC-only Edge Function and proposed SQL carry no cash/USD fields", () => {
  const fn = read("supabase/functions/wallet-summary/index.ts");
  const sql = read("supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql");
  for (const [name, src] of [["edge function", fn], ["proposed SQL", sql]]) {
    assert.doesNotMatch(src.replace(/^\s*(--|\/\/).*$/gm, ""), /cash|USD|LLC/i, name + " must not emit cash/USD/LLC");
    assert.match(src, /lootCoins/, name);
  }
  assert.match(sql, /DO NOT APPLY/);
  // The proposed SQL stays outside supabase/migrations so it cannot be applied by accident.
  assert.ok(!read("supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql").includes("create table"));
  // The client parser already reads the lootCoins key the new contract uses.
  assert.equal(parseLegitCoins({ lootCoins: { available: "125000", provisional: "0", deferred: "0", withdrawable: false } }), 12.5);
});

test("sign-up UI stays closed: no create-account form or client signUp call (backend registration status unverified/owner-gated)", () => {
  const html = read("account.html");
  const js = read("account-auth.js");
  assert.doesNotMatch(html, /id="signup-form"|data-auth-tab="signup"|CREATE ACCOUNT/i);
  assert.doesNotMatch(js, /auth\.signUp|signup-form/);
  assert.match(html, /SIGN-UP IS NOT OPEN YET/);
  assert.doesNotMatch(html, /create an account|not collecting personal information/i);
  assert.match(html, /data-auth-tab="signin"/);
});

test("WALLET-01 edge function source mirrors the proposed RPC filters (static)", () => {
  const fn = read("supabase/functions/wallet-summary/index.ts");
  assert.match(fn, /\.eq\("wallet_kind", "game_credits"\)/);
  assert.equal((fn.match(/\.eq\("currency_code", "LC"\)/g) || []).length, 2);
  assert.match(fn, /\.eq\("journal_transactions\.status", "posted"\)/);
  const sql = read("supabase/proposed/staging/20261120230000_wallet_summary_lc_only.sql");
  assert.match(sql, /grant execute on function public\.get_wallet_summary\(\) to authenticated, service_role/);
  assert.match(sql, /Precondition/);
  assert.doesNotMatch(sql, /no table, grant or data change/);
});

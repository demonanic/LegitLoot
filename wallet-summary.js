// Parses the response of the public.get_wallet_summary() RPC into the one
// value players see: their Legit Coins (LC) balance.
//
// The RPC contract currently differs by environment (audit MIG-01):
// - staging (applied 20261109050922 align_wallet_summary_response_with_staging_frontend; repo
//   file 20261109010000_align_wallet_summary_response.sql) returns the LC balance at gameCredits.available;
// - production (applied 20261108081619 standard_lootcoins_wallet; repo file
//   20261108120000_standard_lootcoins_wallet.sql) returns it at lootCoins.available.
// Repo-to-applied SQL equivalence is not demonstrated; see tests/wallet-summary.test.mjs.
// Both read the `lootcoins_available` LC ledger account. Amounts are integer
// atom strings; LC accounts use currency_scale 10000 (1 LC = 10,000 atoms),
// set by the offerwall_gg_callback_pipeline migration in both lineages.
// Cash fields in the response are deliberately ignored (cash is deferred).
(() => {
  const ATOMS_PER_LC = 10000;

  // Returns the LC balance as a number of LC, or throws if the response is unusable.
  const parseLegitCoins = (data) => {
    const bucket = data && (data.gameCredits ?? data.lootCoins);
    const raw = bucket ? bucket.available : undefined;
    if (raw === undefined || raw === null || raw === "") throw new Error("Wallet summary response was incomplete");
    if (!/^-?\d+$/.test(String(raw))) throw new Error("Invalid Legit Coins balance");
    const atoms = Number(raw);
    if (!Number.isSafeInteger(atoms)) throw new Error("Invalid Legit Coins balance");
    return atoms / ATOMS_PER_LC;
  };

  const formatLegitCoins = (lc) =>
    lc.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 4 }) + " LC";

  window.LEGITLOOT_WALLET = Object.freeze({ ATOMS_PER_LC, parseLegitCoins, formatLegitCoins });
})();

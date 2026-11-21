// Parses the response of the public.get_wallet_summary() RPC into the one
// value players see: their Legit Coins (LC) balance.
//
// The RPC contract currently differs by environment (audit MIG-01):
// - staging (applied 20261109050922 align_wallet_summary_response_with_staging_frontend; repo
//   file 20261109010000_align_wallet_summary_response.sql) returns the LC balance at gameCredits.available;
// - production (applied 20261108081619 standard_lootcoins_wallet; repo file
//   20261108120000_standard_lootcoins_wallet.sql) returns it at lootCoins.available.
// Repo-to-applied SQL equivalence is not demonstrated; see tests/wallet-summary.test.mjs.
// The new LC-only contract (WALLET-01, source only, not deployed) returns the balance at the canonical
// legitCoins.available key. gameCredits and lootCoins are read-only compatibility fallbacks for the
// currently deployed legacy RPCs; no new source may emit them (Platform Build Spec §0.1).
// Both read the `lootcoins_available` LC ledger account. Amounts are integer
// atom strings; LC accounts use currency_scale 10000 (1 LC = 10,000 atoms),
// set by the offerwall_gg_callback_pipeline migration in both lineages.
// Cash is a separate USD ledger (owner decision 2026-11-21, PR #31): this LC parser deliberately has no cash
// path, so cash can never influence, convert into or be mixed with the LC balance. Any cash summary is a
// separate, not-yet-built server contract; cash payouts remain off and owner-gated.
(() => {
  const ATOMS_PER_LC = 10000;

  // Returns the LC balance as a number of LC, or throws if the response is unusable.
  const parseLegitCoins = (data) => {
    const bucket = data && (data.legitCoins ?? data.gameCredits ?? data.lootCoins);
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

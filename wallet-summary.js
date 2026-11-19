// Parses the response of the public.get_wallet_summary() RPC into the one
// value players see: their Legit Coins (LC) balance.
//
// The RPC contract currently differs by environment (audit MIG-01):
// - staging applied supabase/migrations/20261109010000_align_wallet_summary_response.sql,
//   which returns the LC balance at gameCredits.available;
// - the production lineage ends at 20261108120000_standard_lootcoins_wallet.sql,
//   which returns it at lootCoins.available.
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

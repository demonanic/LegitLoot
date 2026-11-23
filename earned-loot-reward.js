(function (root) {
  "use strict";

  const DECIMAL = /^(0|[1-9][0-9]*)(?:\.([0-9]+))?$/;

  function decimalParts(value, maxScale, field, allowZero = true) {
    if (typeof value !== "string") throw new Error("Invalid " + field);
    const match = DECIMAL.exec(value);
    if (!match) throw new Error("Invalid " + field);
    const fraction = match[2] || "";
    if (fraction.length > maxScale) throw new Error("Too many decimal places in " + field);
    const scale = 10n ** BigInt(maxScale);
    const whole = BigInt(match[1]);
    const fractional = BigInt((fraction + "0".repeat(maxScale)).slice(0, maxScale) || "0");
    const atoms = whole * scale + fractional;
    if (!allowZero && atoms === 0n) throw new Error(field + " must be greater than zero");
    return { atoms, scale };
  }

  function parsePercent(value, field, max) {
    if (!Number.isInteger(value) || value < 0 || value > max) {
      throw new Error("Invalid " + field);
    }
    return value;
  }

  function rewardToAtoms(reward) {
    return decimalParts(reward, 3, "Moonetix reward", false).atoms.toString();
  }

  function payoutToUsdMicros(payout) {
    return decimalParts(payout, 6, "Moonetix payout").atoms.toString();
  }

  // The reward already includes Moonetix's split, bonus, and rounding.
  // This function never applies the split again.
  function createRewardSnapshot(input) {
    if (!input || typeof input !== "object") throw new Error("Reward event is required");
    if (typeof input.currency !== "string" || !/^[A-Za-z0-9 ]{1,10}$/.test(input.currency)) {
      throw new Error("Invalid Moonetix currency");
    }
    const splitPercent = parsePercent(input.splitPercent, "split percentage", 100);
    if (splitPercent < 1) throw new Error("Split percentage must be at least 1");
    const bonusPercent = parsePercent(input.bonusPercent, "bonus percentage", 500);
    if (typeof input.conversionRate !== "string") throw new Error("Conversion rate is required");
    const rate = decimalParts(input.conversionRate, 2, "conversion rate", false);
    const rewardAtoms = rewardToAtoms(input.reward);
    const payoutMicros = payoutToUsdMicros(input.payoutUsd);
    const mode = input.roundingMode;
    if (!["whole", "three_decimals"].includes(mode)) throw new Error("Invalid rounding mode");
    if (mode === "whole" && input.reward.includes(".")) {
      throw new Error("Whole-number rounding cannot produce a fractional reward");
    }
    if (typeof input.transactionId !== "string" || !input.transactionId.trim()) {
      throw new Error("Moonetix transaction ID is required");
    }
    if (typeof input.eventId !== "string" || !input.eventId.trim()) {
      throw new Error("Moonetix event ID is required");
    }

    // Cash-equivalent cents = (already-split reward / units-per-USD) * 100.
    // All arithmetic is integer/rational; round half up to cents.
    const numerator = BigInt(rewardAtoms) * 10n;
    const denominator = rate.atoms;
    const cents = (numerator * 2n + denominator) / (2n * denominator);

    return Object.freeze({
      provider: "moonetix",
      transactionId: input.transactionId,
      eventId: input.eventId,
      currency: input.currency,
      rewardRaw: input.reward,
      rewardAtoms,
      payoutUsdRaw: input.payoutUsd,
      payoutUsdMicros: payoutMicros,
      conversionRateRaw: input.conversionRate,
      splitPercent,
      bonusPercent,
      roundingMode: mode,
      cashEquivalentCents: cents.toString()
    });
  }

  function validateReversal(original, reversal) {
    if (!original || !reversal) throw new Error("Original and reversal are required");
    if (reversal.transactionId !== original.transactionId) throw new Error("Reversal transaction mismatch");
    if (reversal.reward !== original.rewardRaw) throw new Error("Reversal reward must exactly match original reward");
    return true;
  }

  function formatEarnedLoot(atoms) {
    if (typeof atoms !== "string" || !/^(0|[1-9][0-9]*)$/.test(atoms)) {
      throw new Error("Invalid Earned Loot atoms");
    }
    const value = BigInt(atoms);
    const whole = value / 1000n;
    const fraction = (value % 1000n).toString().padStart(3, "0").replace(/0+$/, "");
    return whole.toString() + (fraction ? "." + fraction : "") + " EL";
  }

  const api = Object.freeze({
    createRewardSnapshot,
    rewardToAtoms,
    payoutToUsdMicros,
    validateReversal,
    formatEarnedLoot
  });
  root.LEGITLOOT_MOONETIX_REWARD = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

(function (root) {
  "use strict";

  const integerString = (value, field) => {
    if (typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value)) {
      throw new Error("Invalid " + field);
    }
    return value;
  };

  const parseWallet = (raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.contractVersion !== 1) {
      throw new Error("Unsupported wallet contract");
    }
    const el = raw.earnedLoot;
    const lc = raw.lootCoins;
    if (!el || !lc) throw new Error("Wallet sections missing");
    if (el.code !== "EL" || lc.code !== "LC") throw new Error("Unexpected wallet currency");
    if (typeof el.unitsLabel !== "string" || !el.unitsLabel.trim()) throw new Error("Invalid Earned Loot label");
    if (typeof el.availableValueCents !== "string" || typeof el.pendingValueCents !== "string") {
      throw new Error("Earned Loot value must use integer cent strings");
    }
    const parsed = {
      earnedLoot: {
        availableUnits: integerString(el.availableUnits, "available Earned Loot units"),
        pendingUnits: integerString(el.pendingUnits, "pending Earned Loot units"),
        availableValueCents: integerString(el.availableValueCents, "available Earned Loot value"),
        pendingValueCents: integerString(el.pendingValueCents, "pending Earned Loot value"),
        unitsLabel: el.unitsLabel
      },
      lootCoins: {
        availableAtoms: integerString(lc.availableAtoms, "LootCoins atoms")
      }
    };
    if (lc.cashValue !== null || lc.withdrawable !== false || lc.transferable !== false) {
      throw new Error("LootCoins must be non-cash, non-withdrawable, and non-transferable");
    }
    if (raw.pendingAvailable === true || raw.pendingConvertible === true) {
      throw new Error("Pending Earned Loot cannot be available or convertible");
    }
    return Object.freeze({
      earnedLoot: Object.freeze(parsed.earnedLoot),
      lootCoins: Object.freeze(parsed.lootCoins)
    });
  };

  const formatUsd = (cents) => {
    const amount = Number(cents) / 100;
    if (!Number.isSafeInteger(Number(cents)) || !Number.isFinite(amount)) throw new Error("Unsafe currency amount");
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const formatInteger = (value) => {
    const n = Number(value);
    if (!Number.isSafeInteger(n)) throw new Error("Unsafe wallet unit amount");
    return n.toLocaleString("en-US");
  };

  const api = Object.freeze({ parseWallet, formatUsd, formatInteger });
  root.LEGITLOOT_EARNED_WALLET = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

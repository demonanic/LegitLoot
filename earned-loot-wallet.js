(function (root) {
  "use strict";

  const unitString = (value, field) => {
    if (typeof value !== "string" || !/^(0|[1-9][0-9]*)(?:\.[0-9]{1,3})?$/.test(value)) {
      throw new Error("Invalid " + field);
    }
    return value;
  };

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
    if (typeof el.availableValueCents !== "string" || (el.pendingValueCents !== null && typeof el.pendingValueCents !== "string")) {
      throw new Error("Earned Loot value must use integer cent strings");
    }
    const parsed = {
      earnedLoot: {
        availableUnits: unitString(el.availableUnits, "available Earned Loot units"),
        pendingUnits: unitString(el.pendingUnits, "pending Earned Loot units"),
        availableValueCents: integerString(el.availableValueCents, "available Earned Loot value"),
        pendingValueCents: el.pendingValueCents === null ? null : integerString(el.pendingValueCents, "pending Earned Loot value"),
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

  const formatEarnedLootUnits = (value) => {
    const valid = unitString(value, "Earned Loot units");
    const [whole, fraction = ""] = valid.split(".");
    const trimmed = fraction.replace(/0+$/, "");
    return BigInt(whole).toLocaleString("en-US") + (trimmed ? "." + trimmed : "");
  };

  const formatInteger = (value) => {
    const n = Number(value);
    if (!Number.isSafeInteger(n)) throw new Error("Unsafe wallet unit amount");
    return n.toLocaleString("en-US");
  };

  const formatLootCoins = (atoms) => {
    const n = BigInt(integerString(atoms, "LootCoins atoms"));
    const whole = n / 10000n;
    const fraction = (n % 10000n).toString().padStart(4, "0").replace(/0+$/, "");
    return whole.toLocaleString("en-US") + (fraction ? "." + fraction : "") + " LC";
  };

  const api = Object.freeze({ parseWallet, formatUsd, formatInteger, formatEarnedLootUnits, formatLootCoins });
  root.LEGITLOOT_EARNED_WALLET = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

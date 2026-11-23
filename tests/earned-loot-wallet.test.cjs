const test = require("node:test");
const assert = require("node:assert/strict");
const { parseWallet, formatUsd, formatInteger } = require("../earned-loot-wallet.js");

const valid = () => ({
  contractVersion: 1,
  earnedLoot: {
    code: "EL",
    unitsLabel: "EL",
    availableUnits: "1250",
    pendingUnits: "350",
    availableValueCents: "1250",
    pendingValueCents: "350"
  },
  lootCoins: {
    code: "LC",
    availableAtoms: "2400000",
    cashValue: null,
    withdrawable: false,
    transferable: false
  },
  pendingAvailable: false,
  pendingConvertible: false
});

test("accepts canonical Earned Loot and LootCoins wallet contract", () => {
  const parsed = parseWallet(valid());
  assert.equal(parsed.earnedLoot.availableUnits, "1250");
  assert.equal(parsed.earnedLoot.pendingValueCents, "350");
  assert.equal(parsed.lootCoins.availableAtoms, "2400000");
});

test("rejects legacy wallet response shapes", () => {
  for (const raw of [
    { lootCoins: { available: "1" }, cash: {} },
    { legitCoins: { available: "1" } },
    { gameCredits: { available: "1" } },
    { contractVersion: 2 }
  ]) assert.throws(() => parseWallet(raw));
});

test("rejects non-integer, negative, and unsafe-looking amount strings", () => {
  for (const value of ["-1", "1.5", "1e3", "01", 100, null]) {
    const raw = valid();
    raw.earnedLoot.availableUnits = value;
    assert.throws(() => parseWallet(raw));
  }
});

test("rejects any LootCoins cash value or withdrawal/transfer capability", () => {
  for (const [key, value] of [["cashValue", "0"], ["withdrawable", true], ["transferable", true]]) {
    const raw = valid();
    raw.lootCoins[key] = value;
    assert.throws(() => parseWallet(raw));
  }
});

test("rejects pending Earned Loot if marked available or convertible", () => {
  for (const key of ["pendingAvailable", "pendingConvertible"]) {
    const raw = valid();
    raw[key] = true;
    assert.throws(() => parseWallet(raw));
  }
});

test("formats exact cents and integer wallet units", () => {
  assert.equal(formatUsd("1250"), "$12.50");
  assert.equal(formatInteger("1250"), "1,250");
  assert.throws(() => formatUsd("9007199254740992"));
  assert.throws(() => formatInteger("1.2"));
});

const test = require("node:test");
const assert = require("node:assert/strict");
const { parseWallet, formatUsd, formatInteger, formatEarnedLootUnits, formatLootCoins } = require("../earned-loot-wallet.js");

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

test("accepts fractional Earned Loot units to thousandth precision", () => {
  const raw = valid();
  raw.earnedLoot.availableUnits = "1.375";
  raw.earnedLoot.pendingUnits = "0.005";
  const parsed = parseWallet(raw);
  assert.equal(parsed.earnedLoot.availableUnits, "1.375");
  assert.equal(formatEarnedLootUnits(parsed.earnedLoot.availableUnits), "1.375");
  assert.equal(formatEarnedLootUnits("1250.000"), "1,250");
  assert.throws(() => formatEarnedLootUnits("1.0001"));
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
  for (const value of ["-1", "1e3", "01", "1.1234", 100, null]) {
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

test("formats LootCoins from exact integer atoms without floating-point rounding", () => {
  assert.equal(formatLootCoins("123450000"), "12,345 LC");
  assert.equal(formatLootCoins("123456"), "12.3456 LC");
  assert.equal(formatLootCoins("0"), "0 LC");
  assert.throws(() => formatLootCoins("-1"));
});

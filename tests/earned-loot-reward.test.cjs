"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const reward = require("../earned-loot-reward.js");

const base = {
  transactionId: "mx-tx-100",
  eventId: "mx-event-100",
  currency: "EL",
  payoutUsd: "0.500000",
  reward: "250",
  conversionRate: "1000",
  splitPercent: 50,
  bonusPercent: 0,
  roundingMode: "whole"
};

test("records the already-split Moonetix reward without applying another split", () => {
  const snapshot = reward.createRewardSnapshot(base);
  assert.equal(snapshot.rewardRaw, "250");
  assert.equal(snapshot.rewardAtoms, "250000");
  assert.equal(snapshot.payoutUsdRaw, "0.500000");
  assert.equal(snapshot.splitPercent, 50);
  assert.equal(snapshot.cashEquivalentCents, "25");
});

test("preserves the event-time split when the configured split later changes", () => {
  const oldEvent = reward.createRewardSnapshot(base);
  const newEvent = reward.createRewardSnapshot({ ...base, transactionId: "mx-tx-101", eventId: "mx-event-101", splitPercent: 60, reward: "300" });
  assert.equal(oldEvent.splitPercent, 50);
  assert.equal(oldEvent.rewardRaw, "250");
  assert.equal(newEvent.splitPercent, 60);
  assert.equal(newEvent.rewardRaw, "300");
});

test("supports up to three decimal reward precision exactly", () => {
  const snapshot = reward.createRewardSnapshot({ ...base, roundingMode: "three_decimals", reward: "0.375", payoutUsd: "0.750000", conversionRate: "1" });
  assert.equal(snapshot.rewardAtoms, "375");
  assert.equal(snapshot.cashEquivalentCents, "38");
  assert.equal(reward.formatEarnedLoot(snapshot.rewardAtoms), "0.375 EL");
});

test("uses integer arithmetic for cash-equivalent rounding", () => {
  const snapshot = reward.createRewardSnapshot({ ...base, reward: "16.65", conversionRate: "100", roundingMode: "three_decimals" });
  assert.equal(snapshot.cashEquivalentCents, "17");
});

test("rejects unsupported precision, exponent notation, invalid rates, and invalid splits", () => {
  assert.throws(() => reward.rewardToAtoms("0.0001"));
  assert.throws(() => reward.rewardToAtoms("1e3"));
  assert.throws(() => reward.createRewardSnapshot({ ...base, conversionRate: "0" }));
  assert.throws(() => reward.createRewardSnapshot({ ...base, splitPercent: 0 }));
  assert.throws(() => reward.createRewardSnapshot({ ...base, splitPercent: 101 }));
  assert.throws(() => reward.createRewardSnapshot({ ...base, bonusPercent: 501 }));
  assert.throws(() => reward.createRewardSnapshot({ ...base, currency: "LC" }));
});

test("reversal must match the original transaction and exact stored reward", () => {
  const original = reward.createRewardSnapshot(base);
  assert.equal(reward.validateReversal(original, { transactionId: "mx-tx-100", reward: "250" }), true);
  assert.throws(() => reward.validateReversal(original, { transactionId: "mx-tx-100", reward: "125" }));
  assert.throws(() => reward.validateReversal(original, { transactionId: "different", reward: "250.000" }));
});

test("formatting keeps exact thousandth EL atoms", () => {
  assert.equal(reward.formatEarnedLoot("1000"), "1 EL");
  assert.equal(reward.formatEarnedLoot("375"), "0.375 EL");
  assert.equal(reward.formatEarnedLoot("1005"), "1.005 EL");
  assert.throws(() => reward.formatEarnedLoot("-1"));
});

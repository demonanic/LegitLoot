// Run: node --test tests/*.test.mjs
// Guards the governing spec against reintroducing superseded reward rules.
// Owner rules (spec §0.1, §0.5, 2026-11-21): LC only from server-verified in-game milestones,
// weekly challenges and seasonal events; partner offers, Hustle, affiliates and referrals never
// issue LC; verified, approved Hustle completions may credit only the separate USD cash ledger.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const spec = readFileSync(new URL("../docs/PLATFORM_BUILD_SPEC.md", import.meta.url), "utf8");
// Lines explicitly marked as superseded/historical (or struck through) are allowed to keep old wording.
const live = spec.split("\n").filter((l) => !/superseded|historical|~~/i.test(l));

const banned = [
  [/liability is denominated only in LC/i, "LC as the only player liability"],
  [/verified LC reward states/i, "Hustle showing LC reward states"],
  [/(affiliate|referral|offerwall|partner|provider|hustle)[^.]*\b(may|can|will) (grant|issue|credit|award)[^.]*\bLC\b/i, "partner/affiliate/referral activity issuing LC"],
  [/No player LC is issued unless/i, "conditional affiliate LC"],
  [/game-only LC redemption/i, "offerwall LC redemption"],
  [/player cash ledger is deferred/i, "cash ledger deferred"],
];

test("live spec text does not reintroduce superseded reward rules", () => {
  for (const [re, why] of banned) {
    const hits = live.filter((l) => re.test(l));
    assert.deepEqual(hits, [], `${why}:\n${hits.join("\n")}`);
  }
});

test("spec states the two-ledger rule and keeps payouts off", () => {
  assert.match(spec, /only verified, approved Hustle completions/i);
  assert.match(spec, /payouts?[^.]*(stay|remain)s? off/i);
});

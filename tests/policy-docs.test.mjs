// Run: node --test tests/*.test.mjs
// Guards the governing spec against reintroducing superseded reward rules.
// Owner rules (spec §0.1, §0.5, 2026-11-21): LC only from server-verified in-game milestones,
// weekly challenges and seasonal events; partner offers, Hustle, affiliates and referrals never
// issue LC; verified, approved Hustle completions may credit only the separate USD cash ledger;
// affiliate/referral activity is business revenue only and credits neither player ledger.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const spec = readFileSync(new URL("../docs/PLATFORM_BUILD_SPEC.md", import.meta.url), "utf8");
// Only struck-through text (~~...~~) is ignored. Whole lines are NOT skipped for containing
// "superseded"/"historical", so a live rule cannot hide behind a nearby label.
const live = spec.replace(/~~[^~]*~~/g, "").split("\n");
const section = (start, end) => {
  const a = spec.indexOf(start);
  assert.ok(a >= 0, `section ${start} not found`);
  const b = end ? spec.indexOf(end, a + start.length) : -1;
  return spec.slice(a, b > a ? b : undefined).replace(/~~[^~]*~~/g, "");
};

const CHANNEL = "(affiliate|referral|offerwall|partner|provider|hustle|survey|task|callback|rewarded ad)";
const banned = [
  [/liability is denominated only in LC/i, "LC as the only player liability"],
  [/verified LC reward states/i, "Hustle showing LC reward states"],
  [new RegExp(`${CHANNEL}[^.]*\\b(may|can|will|shall) (grant|issue|credit|award|earn)[^.]*\\bLC\\b`, "i"), "channel may issue LC"],
  [new RegExp(`\\bLC\\b[^.]*\\bunless\\b`, "i"), "conditional LC exception (\"... LC ... unless ...\")"],
  [new RegExp(`${CHANNEL}[^.]*\\b(user|player) reward\\b[^.]*\\bunless\\b`, "i"), "conditional player reward exception"],
  [/No player LC is issued unless/i, "conditional affiliate LC"],
  [/game-only LC redemption/i, "offerwall LC redemption"],
  [/player cash ledger is deferred/i, "cash ledger deferred"],
  [/(game activity|achievements)[^.]*may grant LC/i, "LC sources broader than the three approved"],
];

test("live spec text does not reintroduce superseded reward rules", () => {
  for (const [re, why] of banned) {
    const hits = live.filter((l) => re.test(l));
    assert.deepEqual(hits, [], `${why}:\n${hits.join("\n")}`);
  }
});

test("§2A reward destination rules state the owner rule", () => {
  const s = section("### Reward destination rules", "Channel-specific controls:");
  assert.match(s, /exactly three sources[^\n]*milestones, weekly challenges and seasonal events/i);
  assert.match(s, /Affiliate[^.]*never credit player LC or player cash/i);
  assert.match(s, /Referrals never credit player LC or player cash/i);
  assert.match(s, /never issue LC\. Only verified, approved Hustle completions/i);
});

test("§2D channel controls give affiliates and referrals no player reward", () => {
  const s = section("Channel-specific controls:", "### CPAGrip initial adapter status");
  assert.match(s, /Affiliate deals:[^\n]*no player LC or cash reward/i);
  assert.match(s, /Referrals:[^\n]*no player LC or cash reward/i);
  assert.match(s, /Surveys[^\n]*never issue LC/i);
});

test("spec states the two-ledger rule and keeps payouts off", () => {
  assert.match(spec, /only verified, approved Hustle completions/i);
  assert.match(spec, /payouts?[^.]*(stay|remain)s? off/i);
});

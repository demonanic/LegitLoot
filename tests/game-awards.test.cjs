const test = require("node:test");
const assert = require("node:assert/strict");
const { parseGameMessage, parseAwardCatalog, formatLootCoinAtoms, createRunReporter } = require("../game-awards.js");

const msg = (over = {}) => ({ type: "legitloot:game", version: 1, game: "zvhm", event: "checkpoint", stats: { waves_cleared: 3, kills: 120 }, ...over });

test("accepts well-formed game messages", () => {
  assert.deepEqual(parseGameMessage(msg()), { game: "zvhm", event: "checkpoint", stats: { waves_cleared: 3, kills: 120 }, clientVersion: null });
  assert.deepEqual(parseGameMessage({ type: "legitloot:game", version: 1, game: "zvhm", event: "run-start", clientVersion: "0.1.0" }), {
    game: "zvhm", event: "run-start", stats: {}, clientVersion: "0.1.0",
  });
});

test("rejects malformed game messages", () => {
  const bad = [
    null, "x", [], msg({ type: "other" }), msg({ version: 2 }), msg({ game: "ZVHM" }), msg({ event: "cheat" }),
    msg({ stats: null }), msg({ stats: {} }), msg({ stats: { kills: -1 } }), msg({ stats: { kills: 1.5 } }),
    msg({ stats: { kills: "5" } }), msg({ stats: { Kills: 5 } }), msg({ stats: { kills: Number.MAX_SAFE_INTEGER + 2 } }),
    msg({ stats: Object.fromEntries(Array.from({ length: 9 }, (_, i) => ["m" + i + "x", 1])) }),
    msg({ event: "run-start", clientVersion: "<script>" }),
  ];
  for (const b of bad) assert.equal(parseGameMessage(b), null, JSON.stringify(b));
});

test("formats LootCoin atoms", () => {
  assert.equal(formatLootCoinAtoms(10000), "1 LC");
  assert.equal(formatLootCoinAtoms("125000"), "12.5 LC");
  assert.equal(formatLootCoinAtoms(0), "0 LC");
  assert.throws(() => formatLootCoinAtoms(-1));
  assert.throws(() => formatLootCoinAtoms("1.5"));
});

const catalog = () => ({
  contractVersion: 1, game: "zvhm", displayName: "Zombies vs Heavy Metal", signedIn: true, issuanceEnabled: false,
  awards: [
    { awardKey: "first-stand", title: "First Stand", description: "Clear your first wave.", kind: "game_milestone", metric: "waves_cleared", threshold: 1, progress: 1, lootCoinAtoms: 10000, status: "unlocked" },
    { awardKey: "wave-5", title: "Holding the Line", description: "", kind: "game_milestone", metric: "waves_cleared", threshold: 5, progress: 9, lootCoinAtoms: 20000, status: "issued" },
    { awardKey: "kills-500", title: "Pest Control", description: "", kind: "achievement", metric: "kills", threshold: 500, progress: 120, lootCoinAtoms: 20000, status: "locked" },
  ],
});

test("parses the award catalog", () => {
  const c = parseAwardCatalog(catalog());
  assert.equal(c.earnedCount, 2);
  assert.equal(c.issuanceEnabled, false);
  assert.equal(c.awards[0].lootCoins, "1 LC");
  assert.equal(c.awards[1].progress, 5, "progress is clamped to the threshold");
});

test("rejects unexpected catalogs", () => {
  assert.throws(() => parseAwardCatalog({ ...catalog(), contractVersion: 2 }));
  const bad = catalog();
  bad.awards[0].status = "paid-in-cash";
  assert.throws(() => parseAwardCatalog(bad));
  const bad2 = catalog();
  bad2.awards[0].threshold = 0;
  assert.throws(() => parseAwardCatalog(bad2));
});

const fakeApi = (runIds) => {
  const calls = [];
  return {
    calls,
    startRun: async (game, version) => {
      calls.push(["start", game, version]);
      await new Promise((r) => setTimeout(r, 5));
      return runIds.shift() ?? null;
    },
    reportRun: async (runId, stats, final) => {
      calls.push(["report", runId, stats, final]);
      return { accepted: true, unlocked: [], issued: [] };
    },
  };
};

test("reporter waits for the run id and keeps reports in order", async () => {
  const api = fakeApi(["run-1"]);
  const results = [];
  const r = createRunReporter({ api, game: "zvhm", onResult: (res) => results.push(res) });
  r.handle(parseGameMessage({ type: "legitloot:game", version: 1, game: "zvhm", event: "run-start", clientVersion: "1" }));
  r.handle(parseGameMessage(msg({ stats: { kills: 1 } })));
  r.handle(parseGameMessage(msg({ stats: { kills: 2 } })));
  await r.handle(parseGameMessage(msg({ event: "run-end", stats: { kills: 3 } })));
  assert.deepEqual(api.calls, [
    ["start", "zvhm", "1"],
    ["report", "run-1", { kills: 1 }, false],
    ["report", "run-1", { kills: 2 }, false],
    ["report", "run-1", { kills: 3 }, true],
  ]);
  assert.equal(results.length, 3);
  assert.equal(r.activeGeneration, null);
});

test("reporter ignores reports with no run and runs that did not start", async () => {
  const api = fakeApi([null, "run-2"]);
  const errors = [];
  const r = createRunReporter({ api, game: "zvhm", onError: (e) => errors.push(e) });
  await r.handle(parseGameMessage(msg()));
  assert.equal(api.calls.length, 0, "no run started: nothing sent");
  r.handle(parseGameMessage({ type: "legitloot:game", version: 1, game: "zvhm", event: "run-start" }));
  await r.handle(parseGameMessage(msg({ event: "run-end" })));
  assert.deepEqual(api.calls.map((c) => c[0]), ["start"], "signed-out run sends no reports");
  // A new run after a restart gets its own id; the old run's id is never reused.
  r.handle(parseGameMessage({ type: "legitloot:game", version: 1, game: "zvhm", event: "run-start" }));
  await r.handle(parseGameMessage(msg({ event: "run-end", stats: { kills: 9 } })));
  assert.deepEqual(api.calls.at(-1), ["report", "run-2", { kills: 9 }, true]);
  // Messages for other games are ignored.
  await r.handle(parseGameMessage(msg({ game: "rxt2" })));
  assert.equal(api.calls.length, 3);
  assert.equal(errors.length, 0);
});

test("reporter survives start and report failures", async () => {
  const errors = [];
  const api = {
    startRun: async () => { throw new Error("Daily run limit reached"); },
    reportRun: async () => { throw new Error("should not be called"); },
  };
  const r = createRunReporter({ api, game: "zvhm", onError: (e) => errors.push(e.message) });
  r.handle(parseGameMessage({ type: "legitloot:game", version: 1, game: "zvhm", event: "run-start" }));
  await r.handle(parseGameMessage(msg({ event: "run-end" })));
  assert.deepEqual(errors, ["Daily run limit reached"]);
});

// Rocket 2 Nowhere's in-game reporter (games/rocket-2-nowhere/portal.js).
const { createPortal, runStats, QUEUE_LIMIT } = require("../games/rocket-2-nowhere/portal.js");

const fakeWin = (postMessage) => {
  const parent = { postMessage };
  let listener = null;
  const win = { parent, addEventListener: (type, fn) => { if (type === "message") listener = fn; } };
  const deliver = (origin, data, source = parent) => listener({ origin, data, source });
  return { win, deliver };
};
const READY = { type: "legitloot:portal", version: 1, event: "ready" };
const SITE = "https://legitloot.site";

test("rxt2 portal: nothing when not embedded", () => {
  const win = { addEventListener() {} };
  win.parent = win;
  assert.equal(createPortal(win, SITE, "rxt2", "1"), null);
});

test("rxt2 portal: holds until the site is ready, then sends in order, only to the site", () => {
  const posts = [];
  const { win, deliver } = fakeWin((m, origin) => posts.push([m, origin]));
  const p = createPortal(win, SITE, "rxt2", "1");
  p.checkpoint(runStats(10, 1, 0));
  assert.equal(posts.length, 0);
  p.start();
  p.checkpoint(runStats(812.9, 14, 3));
  p.end(runStats(1500.2, 30, 7));
  p.end(runStats(9999, 1, 1));
  deliver("https://evil.example", READY);
  deliver(SITE, READY, {});
  deliver(SITE, { type: "legitloot:portal", event: "nope" });
  assert.equal(posts.length, 0, "ignores the wrong origin, source or event");
  deliver(SITE, READY);
  assert.deepEqual(posts.map(([m]) => m.event), ["run-start", "checkpoint", "run-end"], "checkpoint before start and a second end are dropped");
  assert.ok(posts.every(([, o]) => o === SITE));
  assert.deepEqual(posts[2][0].stats, { distance: 1500, rocks_destroyed: 30, close_calls: 7 });
  // Every message the game sends passes the page's own validator.
  for (const [m] of posts) assert.ok(parseGameMessage(m), JSON.stringify(m));
  p.start();
  assert.equal(posts.length, 4, "sent immediately once ready");
});

test("rxt2 portal: bounded queue, stats sanitised, posting never throws", () => {
  const posts = [];
  const { win, deliver } = fakeWin((m) => posts.push(m));
  const p = createPortal(win, SITE, "rxt2", "1");
  for (let i = 0; i < QUEUE_LIMIT + 20; i++) p.start();
  deliver(SITE, READY);
  assert.equal(posts.length, QUEUE_LIMIT);
  assert.deepEqual(runStats(-5, NaN, Infinity), { distance: 0, rocks_destroyed: 0, close_calls: 0 });
  const { win: w2, deliver: d2 } = fakeWin(() => { throw new Error("blocked"); });
  const p2 = createPortal(w2, SITE, "rxt2", "1");
  d2(SITE, READY);
  assert.doesNotThrow(() => p2.start());
});

// Game milestones and awards: pure helpers shared by the game page bridge and tests.
// No DOM and no network here; the bridge passes in the API calls.
(function (root) {
  "use strict";

  const MESSAGE_TYPE = "legitloot:game";
  const EVENTS = Object.freeze(["run-start", "checkpoint", "run-end"]);
  const SLUG = /^[a-z0-9][a-z0-9-]{1,39}$/;
  const METRIC = /^[a-z][a-z0-9_]{1,39}$/;
  const VERSION = /^[A-Za-z0-9._+-]{1,40}$/;
  const MAX_STATS = 8;

  /**
   * Validate a postMessage payload from an embedded game.
   * Returns { game, event, stats, clientVersion } or null if it is not a valid game message.
   */
  const parseGameMessage = (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    if (data.type !== MESSAGE_TYPE || data.version !== 1) return null;
    if (typeof data.game !== "string" || !SLUG.test(data.game)) return null;
    if (!EVENTS.includes(data.event)) return null;
    const out = { game: data.game, event: data.event, stats: {}, clientVersion: null };
    if (data.clientVersion !== undefined) {
      if (typeof data.clientVersion !== "string" || !VERSION.test(data.clientVersion)) return null;
      out.clientVersion = data.clientVersion;
    }
    if (data.event === "run-start") return out;
    const stats = data.stats;
    if (!stats || typeof stats !== "object" || Array.isArray(stats)) return null;
    const keys = Object.keys(stats);
    if (keys.length === 0 || keys.length > MAX_STATS) return null;
    for (const key of keys) {
      const value = stats[key];
      if (!METRIC.test(key) || !Number.isSafeInteger(value) || value < 0) return null;
      out.stats[key] = value;
    }
    return out;
  };

  const atomsToString = (atoms) => {
    if (typeof atoms === "number" && Number.isSafeInteger(atoms) && atoms >= 0) return String(atoms);
    if (typeof atoms === "string" && /^(0|[1-9][0-9]*)$/.test(atoms)) return atoms;
    throw new Error("Invalid LootCoins atoms");
  };

  /** 10,000 atoms per LC; "12.5 LC". */
  const formatLootCoinAtoms = (atoms) => {
    const n = BigInt(atomsToString(atoms));
    const whole = n / 10000n;
    const fraction = (n % 10000n).toString().padStart(4, "0").replace(/0+$/, "");
    return whole.toLocaleString("en-US") + (fraction ? "." + fraction : "") + " LC";
  };

  const STATUSES = ["locked", "unlocked", "issued"];
  const KINDS = ["game_milestone", "achievement", "challenge"];

  /** Validate get_game_awards() output (contract version 1). */
  const parseAwardCatalog = (raw) => {
    if (!raw || typeof raw !== "object" || raw.contractVersion !== 1) throw new Error("Unsupported awards contract");
    if (typeof raw.game !== "string" || !Array.isArray(raw.awards)) throw new Error("Awards missing");
    const awards = raw.awards.map((a) => {
      if (!a || typeof a.awardKey !== "string" || typeof a.title !== "string") throw new Error("Invalid award");
      if (!STATUSES.includes(a.status) || !KINDS.includes(a.kind)) throw new Error("Invalid award status");
      const threshold = Number(a.threshold);
      const progress = Number(a.progress);
      if (!Number.isSafeInteger(threshold) || threshold <= 0 || !Number.isSafeInteger(progress) || progress < 0) {
        throw new Error("Invalid award progress");
      }
      return {
        key: a.awardKey,
        title: a.title,
        description: typeof a.description === "string" ? a.description : "",
        kind: a.kind,
        status: a.status,
        threshold,
        progress: Math.min(progress, threshold),
        lootCoins: formatLootCoinAtoms(a.lootCoinAtoms),
        endsAt: typeof a.endsAt === "string" ? a.endsAt : null,
      };
    });
    return {
      game: raw.game,
      displayName: typeof raw.displayName === "string" ? raw.displayName : raw.game,
      signedIn: raw.signedIn === true,
      issuanceEnabled: raw.issuanceEnabled === true,
      awards,
      earnedCount: awards.filter((a) => a.status !== "locked").length,
    };
  };

  /**
   * Turn a game's message stream into ordered server calls.
   * api: { startRun(game, clientVersion) -> Promise<runId|null>, reportRun(runId, stats, final) -> Promise<result> }
   * onResult(result, message) is called after each report the server answered.
   * Reports for a run are sent strictly in order; a run that failed to start (e.g. signed out) is skipped.
   */
  const createRunReporter = ({ api, game, onResult = () => {}, onError = () => {} }) => {
    let current = null; // { runPromise, generation }
    let generation = 0;
    let chain = Promise.resolve();

    const handle = (message) => {
      if (!message || message.game !== game) return chain;
      if (message.event === "run-start") {
        generation += 1;
        const runPromise = Promise.resolve()
          .then(() => api.startRun(game, message.clientVersion))
          .catch((error) => {
            onError(error, message);
            return null;
          });
        current = { runPromise, generation };
        return chain;
      }
      if (!current) return chain;
      const run = current;
      const final = message.event === "run-end";
      if (final) current = null;
      chain = chain.then(async () => {
        const runId = await run.runPromise;
        if (!runId) return;
        try {
          const result = await api.reportRun(runId, message.stats, final);
          onResult(result, message);
        } catch (error) {
          onError(error, message);
        }
      });
      return chain;
    };

    return Object.freeze({
      handle,
      get activeGeneration() {
        return current ? current.generation : null;
      },
      idle: () => chain,
    });
  };

  const api = Object.freeze({ MESSAGE_TYPE, parseGameMessage, parseAwardCatalog, formatLootCoinAtoms, createRunReporter });
  root.LEGITLOOT_GAME_AWARDS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

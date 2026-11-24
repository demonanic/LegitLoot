// Run reporting from Rocket 2 Nowhere to the legitloot.site game page (award tracking).
// Sends {type:"legitloot:game"} messages to the parent page only, and holds them until
// the page posts {type:"legitloot:portal", event:"ready"}. Played on its own, nothing is sent.
// The site's server checks every report against its own clock; nothing here is trusted alone.
(function (root) {
  "use strict";
  const QUEUE_LIMIT = 200;
  const whole = (n) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

  /** Stats as the server expects them: whole, non-negative numbers. */
  const runStats = (distance, rocks, closeCalls) => ({
    distance: whole(distance),
    rocks_destroyed: whole(rocks),
    close_calls: whole(closeCalls),
  });

  /**
   * win: the game's window. portalOrigin: the only origin messages are delivered to.
   * Returns null when the game is not embedded in another page.
   */
  const createPortal = (win, portalOrigin, game, clientVersion) => {
    if (!win || win.parent === win) return null;
    let ready = false;
    let active = false;
    const queue = [];
    const send = (m) => {
      try {
        win.parent.postMessage(m, portalOrigin);
      } catch (e) {
        // Best effort: the game never depends on reporting.
      }
    };
    const post = (event, stats) => {
      const m = { type: "legitloot:game", version: 1, game, event };
      if (event === "run-start") m.clientVersion = clientVersion;
      if (stats) m.stats = stats;
      if (ready) send(m);
      else if (queue.length < QUEUE_LIMIT) queue.push(m);
    };
    win.addEventListener("message", (event) => {
      if (ready || event.origin !== portalOrigin || event.source !== win.parent) return;
      const d = event.data;
      if (!d || d.type !== "legitloot:portal" || d.event !== "ready") return;
      ready = true;
      queue.splice(0).forEach(send);
    });
    return Object.freeze({
      start() {
        active = true;
        post("run-start");
      },
      checkpoint(stats) {
        if (active) post("checkpoint", stats);
      },
      end(stats) {
        if (!active) return;
        active = false;
        post("run-end", stats);
      },
    });
  };

  const api = Object.freeze({ createPortal, runStats, QUEUE_LIMIT });
  root.RXT2_PORTAL = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

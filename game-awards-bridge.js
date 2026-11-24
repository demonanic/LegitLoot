// Game page bridge: relays run stats from an embedded game to the award RPCs and
// shows the player's awards. Configure with data attributes on the script tag:
//   <script src="game-awards-bridge.js" data-game="zvhm" data-frame="game"
//           data-origin="https://demonanic.github.io"></script>
// Requires supabase-js and game-awards.js to load first.
(() => {
  "use strict";
  const SUPABASE_URL = "https://gkbqderyjcuxnjbsiffb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jFPcXIil4Hq1fkJtQ1tYZw_L_SDegFr";
  const script = document.currentScript;
  const game = script?.dataset.game;
  const frame = document.getElementById(script?.dataset.frame || "game");
  const gameOrigin = script?.dataset.origin;
  const lib = window.LEGITLOOT_GAME_AWARDS;
  if (!game || !frame || !gameOrigin || !lib) return;

  const button = document.getElementById("awards-btn");
  const drawer = document.getElementById("awards-drawer");
  const list = document.getElementById("awards-list");
  const note = document.getElementById("awards-note");
  const toastEl = document.getElementById("awards-toast");
  const count = document.getElementById("awards-count");
  if (!button || !drawer || !list || !note || !toastEl) return;
  let client = null;

  const setNote = (text, linkText, href) => {
    note.textContent = text;
    if (linkText) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = linkText;
      note.append(" ", a);
    }
  };

  button.hidden = false;
  button.addEventListener("click", () => {
    const open = drawer.hidden;
    drawer.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (open) refresh();
  });
  drawer.querySelector("[data-close]")?.addEventListener("click", () => {
    drawer.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });

  // Same rule as account-auth.js: preview and localhost hosts never touch production accounts.
  if (window.location.hostname !== "legitloot.site") {
    setNote("Awards are tracked only on legitloot.site.");
    return;
  }
  client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) ?? null;
  if (!client) {
    setNote("Awards are unavailable right now. Refresh to try again.");
    return;
  }

  let toastTimer = 0;
  const toast = (title, detail) => {
    toastEl.textContent = "";
    const b = document.createElement("b");
    b.textContent = title;
    const span = document.createElement("span");
    span.textContent = detail;
    toastEl.append(b, span);
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toastEl.hidden = true), 5000);
  };

  const STATUS_LABEL = { locked: "Locked", unlocked: "Unlocked", issued: "Collected" };
  const render = (catalog) => {
    list.textContent = "";
    if (count) count.textContent = catalog.awards.length ? `${catalog.earnedCount}/${catalog.awards.length}` : "";
    if (!catalog.signedIn) {
      setNote("Sign in to track your progress and earn awards.", "Sign in", "account.html");
    } else if (!catalog.issuanceEnabled) {
      setNote("LootCoin awards aren't switched on for this game yet. Awards you unlock are saved to your account.");
    } else {
      setNote("LootCoins are for use on LegitLoot only. They have no cash value.");
    }
    for (const a of catalog.awards) {
      const li = document.createElement("li");
      li.className = "award award-" + a.status;
      const head = document.createElement("div");
      head.className = "award-head";
      const title = document.createElement("b");
      title.textContent = a.title;
      const chip = document.createElement("span");
      chip.className = "award-chip";
      chip.textContent = STATUS_LABEL[a.status] + " · " + a.lootCoins;
      head.append(title, chip);
      const desc = document.createElement("p");
      desc.textContent = a.description;
      const bar = document.createElement("div");
      bar.className = "award-bar";
      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", String(a.threshold));
      bar.setAttribute("aria-valuenow", String(a.progress));
      bar.setAttribute("aria-label", `${a.title} progress`);
      const fill = document.createElement("i");
      fill.style.width = Math.round((a.progress / a.threshold) * 100) + "%";
      bar.append(fill);
      const nums = document.createElement("small");
      nums.textContent = `${a.progress.toLocaleString("en-US")} / ${a.threshold.toLocaleString("en-US")}`;
      li.append(head, desc, bar, nums);
      list.append(li);
    }
  };

  let refreshing = null;
  async function refresh() {
    if (!client) return;
    if (refreshing) return refreshing;
    refreshing = (async () => {
      try {
        const { data, error } = await client.rpc("get_game_awards", { p_game_slug: game });
        if (error) throw error;
        render(lib.parseAwardCatalog(data));
      } catch {
        setNote("Awards couldn't load. Try again in a moment.");
      } finally {
        refreshing = null;
      }
    })();
    return refreshing;
  }

  const signedIn = async () => {
    const { data } = await client.auth.getSession();
    return !!data?.session;
  };

  const reporter = lib.createRunReporter({
    game,
    api: {
      startRun: async (slug, clientVersion) => {
        if (!(await signedIn())) return null;
        const { data, error } = await client.rpc("start_game_run", {
          p_game_slug: slug,
          p_client_version: clientVersion,
        });
        if (error) throw error;
        return data;
      },
      reportRun: async (runId, stats, final) => {
        const { data, error } = await client.rpc("report_game_run", {
          p_run_id: runId,
          p_stats: stats,
          p_final: final,
        });
        if (error) throw error;
        return data;
      },
    },
    onResult: (result) => {
      const unlocked = Array.isArray(result?.unlocked) ? result.unlocked : [];
      for (const a of unlocked) {
        let amount = "";
        try {
          amount = " · " + lib.formatLootCoinAtoms(a.lootCoinAtoms);
        } catch {
          amount = "";
        }
        toast("Award unlocked", String(a.title || "") + amount);
      }
      if (unlocked.length || (Array.isArray(result?.issued) && result.issued.length)) refresh();
    },
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== gameOrigin || event.source !== frame.contentWindow) return;
    const message = lib.parseGameMessage(event.data);
    if (message) reporter.handle(message);
  });

  // The game holds its messages until the page says it is listening.
  const announceReady = () => {
    try {
      frame.contentWindow?.postMessage({ type: "legitloot:portal", version: 1, event: "ready" }, gameOrigin);
    } catch {
      // The frame may be mid-navigation; its load event announces again.
    }
  };
  frame.addEventListener("load", announceReady);
  announceReady();

  refresh();
  client.auth.onAuthStateChange(() => refresh());
})();

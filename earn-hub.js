// Renders the earning hub from window.LEGITLOOT_EARN_REGISTRY.
// Display and navigation only: this script never records, attributes or credits
// rewards. Opening a provider asks a server function for an account-bound link;
// all tracking, callbacks and LootCoin issuance stay server-side.
(() => {
  const registry = window.LEGITLOOT_EARN_REGISTRY;
  const grid = document.getElementById("provider-hub");
  const summary = document.getElementById("earn-hub-summary");
  if (!registry || !grid) return;

  const { states, providers } = registry;
  const stateOf = (provider) => (Object.hasOwn(states, provider.state) ? provider.state : "unavailable");
  const canOpen = (provider) =>
    provider.kind === "provider" && stateOf(provider) === "active" && states.active.canOpen && Boolean(provider.launch?.functionName);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const buttons = new Map();

  providers.forEach((provider) => {
    const stateKey = stateOf(provider);
    const state = states[stateKey];

    const card = el("article", "portal-card opportunity-card provider-card");
    card.id = `provider-${provider.id}`;
    card.dataset.category = provider.categories.join(" ");
    card.dataset.providerState = stateKey;

    const symbol = el("div", "portal-symbol", provider.symbol || "◇");
    symbol.setAttribute("aria-hidden", "true");

    const body = el("div", "portal-card-body");
    body.append(el("p", "card-kicker", provider.kicker));
    body.append(el("h2", "", provider.name));
    body.append(el("p", "provider-description", provider.description));

    const badge = el("p", `provider-state provider-state--${stateKey.replace("_", "-")}`);
    const mark = el("span", "provider-state__mark", state.mark);
    mark.setAttribute("aria-hidden", "true");
    badge.append(mark, el("span", "provider-state__label", `Status: ${state.label}`));
    body.append(badge);
    body.append(el("p", "provider-state-detail", provider.stateDetail || state.detail));

    if (provider.kind === "provider") {
      const button = el("button", "primary-btn provider-launch");
      button.type = "button";
      button.id = `open-provider-${provider.id}`;
      const status = el("p", "provider-launch-status");
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      if (canOpen(provider)) {
        button.textContent = `Sign in to open ${provider.name} →`;
        buttons.set(provider.id, { provider, button, status });
      } else {
        button.disabled = true;
        button.textContent = `${provider.name}: not open yet`;
      }
      body.append(button, status);
    }

    card.append(symbol, body);
    grid.append(card);
  });

  const openCount = providers.filter(canOpen).length;
  if (summary) {
    summary.textContent = openCount === 0
      ? "No earning provider is open to players right now, so nothing here can earn LootCoins yet. Each provider's status is shown on its card."
      : `${openCount} provider${openCount === 1 ? " is" : "s are"} open to signed-in players. LootCoins are credited only by our server after a provider confirms a completion.`;
  }

  if (buttons.size === 0) return;

  // Launching is only wired up for active providers.
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const client = config?.url && config?.publishableKey && window.supabase?.createClient
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;

  let currentUser = null;
  const syncButtons = () => {
    buttons.forEach(({ provider, button }) => {
      button.disabled = !client;
      button.textContent = currentUser ? `Open ${provider.name} →` : `Sign in to open ${provider.name} →`;
    });
  };

  if (!client) {
    buttons.forEach(({ button, status }) => {
      button.disabled = true;
      status.textContent = "Account service unavailable. Refresh and try again.";
    });
    return;
  }

  buttons.forEach(({ provider, button, status }) => {
    button.addEventListener("click", async () => {
      if (!currentUser) {
        window.location.href = "account.html";
        return;
      }
      button.disabled = true;
      status.textContent = "Generating your secure account-bound link…";
      const { data, error } = await client.functions.invoke(provider.launch.functionName, { body: {} });
      button.disabled = false;
      if (error || typeof data?.wallUrl !== "string") {
        status.textContent = `${provider.name} is not available right now. Nothing was opened.`;
        return;
      }
      let url;
      try {
        url = new URL(data.wallUrl);
      } catch {
        status.textContent = "The provider returned an invalid link. Nothing was opened.";
        return;
      }
      const prefix = provider.launch.pathPrefix || "/";
      if (url.protocol !== "https:" || !provider.launch.allowedOrigins.includes(url.origin) || !url.pathname.startsWith(prefix)) {
        status.textContent = "The provider returned an unexpected link. Nothing was opened.";
        return;
      }
      window.location.assign(url.toString());
    });
  });

  client.auth.getUser().then(({ data }) => {
    currentUser = data?.user ?? null;
    syncButtons();
  });
  client.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    syncButtons();
  });
  syncButtons();
})();

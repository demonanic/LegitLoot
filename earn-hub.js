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
  const canTestLaunch = (provider) =>
    provider.kind === "provider" && provider.testLaunch === true && stateOf(provider) === "testing" && Boolean(provider.launch?.functionName);

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
      if (canOpen(provider) || canTestLaunch(provider)) {
        button.textContent = canTestLaunch(provider) ? `Test ${provider.name} link →` : `Sign in to open ${provider.name} →`;
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
  const testCount = providers.filter(canTestLaunch).length;
  if (summary) {
    summary.textContent = openCount === 0
      ? "No earning provider is open to players right now, so nothing here can earn LootCoins yet. Each provider's status is shown on its card."
      : `${openCount} provider${openCount === 1 ? " is" : "s are"} open to signed-in players. LootCoins are credited only by our server after a provider confirms a completion.`;
    if (openCount === 0 && testCount > 0) summary.textContent += ` ${testCount} provider link is available for controlled testing only.`;
  }

  if (buttons.size === 0) return;

  // Active providers and controlled testing providers can launch through their server functions.
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const client = config?.url && config?.publishableKey && window.supabase?.createClient
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;

  let currentUser = null;
  const syncButtons = () => {
    buttons.forEach(({ provider, button }) => {
      button.disabled = !client;
      button.textContent = canTestLaunch(provider)
        ? (currentUser ? `Test ${provider.name} link →` : `Sign in to test ${provider.name} →`)
        : (currentUser ? `Open ${provider.name} →` : `Sign in to open ${provider.name} →`);
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
      status.textContent = "Checking your sign-in…";
      button.disabled = true;
      try {
        const { data: sessionData, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;
        const sessionUser = sessionData?.session?.user ?? currentUser;
        if (!sessionUser) {
          status.textContent = "You need to sign in first. Opening account page…";
          window.location.href = new URL("account.html", window.location.href).toString();
          return;
        }
        status.textContent = "Requesting your secure Moonetix link…";
        const { data, error } = await client.functions.invoke(provider.launch.functionName, { body: {} });
        if (error) throw error;
        if (typeof data?.wallUrl !== "string") throw new Error(data?.error || "The link service returned no URL.");
        const url = new URL(data.wallUrl);
        const prefix = provider.launch.pathPrefix || "/";
        if (url.protocol !== "https:" || !provider.launch.allowedOrigins.includes(url.origin) || !url.pathname.startsWith(prefix)) {
          throw new Error("The provider returned an unexpected link.");
        }
        status.textContent = "Link received. Opening Moonetix…";
        window.location.href = url.toString();
      } catch (err) {
        status.textContent = `Moonetix launch error: ${err?.message || "Unknown error"}`;
        button.disabled = false;
      }
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

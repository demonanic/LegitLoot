(() => {
  const button = document.getElementById("open-offerwall");
  const status = document.getElementById("offerwall-launch-status");
  const message = document.getElementById("offerwall-auth-message");
  if (!button || !status) return;

  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const client = config?.environment === "staging" && window.supabase?.createClient
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;
  if (!client) {
    button.disabled = true;
    status.textContent = "Account service unavailable. Refresh and try again.";
    return;
  }

  let currentUser = null;
  const refresh = async () => {
    const { data } = await client.auth.getUser();
    currentUser = data.user ?? null;
    button.disabled = false;
    message.textContent = currentUser
      ? "Signed in. Your wall link will be generated securely for this account."
      : "Sign in to your LegitLoot account to open your account-bound offerwall.";
    button.textContent = currentUser ? "OPEN OFFERWALL →" : "SIGN IN TO OPEN →";
  };

  button.addEventListener("click", async () => {
    if (!currentUser) {
      window.location.href = "account.html";
      return;
    }
    button.disabled = true;
    status.textContent = "Generating your secure account-bound link…";
    const { data, error } = await client.functions.invoke("offerwall-gg-wall-url", { body: {} });
    button.disabled = false;
    if (error || !data?.wallUrl) {
      status.textContent = "The secure wall link is not available yet. The placement is pending approval or server setup is incomplete.";
      return;
    }
    const url = new URL(data.wallUrl);
    if (url.origin !== "https://offerwall.gg" || !url.pathname.startsWith("/wall/")) {
      status.textContent = "The provider returned an unexpected wall URL. Nothing was opened.";
      return;
    }
    window.location.assign(url.toString());
  });

  client.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    button.disabled = false;
    message.textContent = currentUser
      ? "Signed in. Your wall link will be generated securely for this account."
      : "Sign in to your LegitLoot account to open your account-bound offerwall.";
    button.textContent = currentUser ? "OPEN OFFERWALL →" : "SIGN IN TO OPEN →";
  });
  refresh();
})();

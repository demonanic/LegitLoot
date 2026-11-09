(() => {
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const client = config?.url && config?.publishableKey
    ? window.supabase?.createClient(config.url, config.publishableKey)
    : null;
  const $ = (id) => document.getElementById(id);
  if (!client) {
    const status = $("auth-status");
    if (status) status.innerHTML = "<b>ACCOUNT UNAVAILABLE</b><p>The staging authentication configuration could not load. No account changes were made.</p>";
    return;
  }
  if (config.environment !== "staging") {
    const status = $("auth-status");
    if (status) status.innerHTML = "<b>ENVIRONMENT CHECK FAILED</b><p>This build is not configured for the isolated staging environment. Registration is disabled.</p>";
    return;
  }
  const status = $("auth-status");
  const authPanel = $("auth-panel");
  const playerPanel = $("player-panel");
  const employeeAccessLink = $("employee-access-link");
  const showMessage = (heading, message, isError = false) => {
    status.innerHTML = "";
    const title = document.createElement("b");
    title.textContent = heading;
    const copy = document.createElement("p");
    copy.textContent = message;
    status.append(title, copy);
    status.classList.toggle("auth-error", isError);
  };
  const switchTab = (tab) => {
    document.querySelectorAll("[data-auth-tab]").forEach((button) => button.classList.toggle("active", button.dataset.authTab === tab));
    ["signin", "signup", "reset", "recovery"].forEach((name) => {
      const form = $(name + "-form");
      form.hidden = name !== tab;
    });
  };
  document.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.authTab)));
  const formatUsd = (cents) => {
    const amount = Number(cents) / 100;
    return Number.isFinite(amount) ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "$—";
  };
  const loadWalletSummary = async () => {
    const fields = ["wallet-game-available", "wallet-cash-available", "wallet-cash-pending", "wallet-cash-reserved", "wallet-cash-paid"];
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "…"; });
    const { data, error } = await client.rpc("get_wallet_summary");
    if (error || !data || data.error) {
      showMessage("WALLET SUMMARY UNAVAILABLE", "Your account is signed in, but the secure wallet summary could not be loaded. No balances have been changed.", true);
      fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Unavailable"; });
      return;
    }
    $("wallet-game-available").textContent = Number(data.gameCredits.available).toLocaleString("en-US") + " LLC";
    $("wallet-cash-available").textContent = formatUsd(data.cash.availableCents);
    $("wallet-cash-pending").textContent = formatUsd(data.cash.pendingCents);
    $("wallet-cash-reserved").textContent = formatUsd(data.cash.withdrawalReservedCents);
    $("wallet-cash-paid").textContent = formatUsd(data.cash.paidCents);
    $("wallet-game-detail").textContent = Number(data.gameCredits.provisional).toLocaleString("en-US") + " provisional · " + Number(data.gameCredits.deferred).toLocaleString("en-US") + " deferred. Credits are non-transferable and not withdrawable.";
    $("wallet-cash-detail").textContent = formatUsd(data.cash.heldCents) + " held. Pending provider funds are not available for withdrawal.";
  };
  const refreshEmployeeAccess = async () => {
    if (!employeeAccessLink) return;
    employeeAccessLink.hidden = true;
    try {
      const { data, error } = await client.functions.invoke("admin-dashboard", { body: { section: "overview" } });
      const authorizedRoles = ["owner", "payout_reviewer", "support_readonly"];
      employeeAccessLink.hidden = Boolean(error || !data?.success || !authorizedRoles.includes(data?.role));
    } catch {
      employeeAccessLink.hidden = true;
    }
  };
  const showSignedIn = async (user) => {
    authPanel.hidden = true;
    playerPanel.hidden = false;
    $("player-email").textContent = user.email || "Authenticated player";
    showMessage("YOU ARE SIGNED IN", "Your profile is connected. Wallet balances are read from the secure server-side ledger.");
    await Promise.all([loadWalletSummary(), refreshEmployeeAccess()]);
    const { data, error } = await client.from("profiles").select("display_name,username").eq("id", user.id).maybeSingle();
    if (!error && data?.display_name) $("player-email").textContent = data.display_name + " · " + (user.email || "");
  };
  $("signin-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    const { data, error } = await client.auth.signInWithPassword({
      email: $("signin-email").value.trim(),
      password: $("signin-password").value
    });
    button.disabled = false;
    if (error) return showMessage("SIGN IN FAILED", error.message, true);
    if (data.user) await showSignedIn(data.user);
  });
  $("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    const { data, error } = await client.auth.signUp({
      email: $("signup-email").value.trim(),
      password: $("signup-password").value,
      options: {
        data: { display_name: $("signup-name").value.trim() },
        emailRedirectTo: window.location.origin + "/account.html"
      }
    });
    button.disabled = false;
    if (error) return showMessage("ACCOUNT NOT CREATED", error.message, true);
    if (data.session && data.user) await showSignedIn(data.user);
    else showMessage("CHECK YOUR EMAIL", "Your registration was received. Open the confirmation email to activate your account, then return here to sign in.");
  });
  $("reset-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    const { error } = await client.auth.resetPasswordForEmail($("reset-email").value.trim(), {
      redirectTo: window.location.origin + "/account.html"
    });
    button.disabled = false;
    if (error) return showMessage("RESET REQUEST FAILED", error.message, true);
    showMessage("CHECK YOUR EMAIL", "If an account exists for that address, a password-reset link will be sent.");
  });
  $("recovery-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    const { error } = await client.auth.updateUser({ password: $("recovery-password").value });
    button.disabled = false;
    if (error) return showMessage("PASSWORD NOT UPDATED", error.message, true);
    $("recovery-form").reset();
    switchTab("signin");
    showMessage("PASSWORD UPDATED", "Your password has been changed. Sign in with your new password.");
  });
  $("signout-button").addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) return showMessage("SIGN OUT FAILED", error.message, true);
    playerPanel.hidden = true;
    authPanel.hidden = false;
    if (employeeAccessLink) employeeAccessLink.hidden = true;
    $("signin-form").reset();
    showMessage("SIGNED OUT", "Your session has ended.");
  });
  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      playerPanel.hidden = true;
      authPanel.hidden = false;
      if (employeeAccessLink) employeeAccessLink.hidden = true;
      switchTab("recovery");
      showMessage("RESET LINK ACCEPTED", "Choose a new password to finish recovering your account.");
      return;
    }
    if (session?.user && event === "SIGNED_IN") showSignedIn(session.user);
    else if (event === "SIGNED_OUT") {
      playerPanel.hidden = true;
      authPanel.hidden = false;
      if (employeeAccessLink) employeeAccessLink.hidden = true;
      switchTab("signin");
    }
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) return showMessage("SESSION CHECK FAILED", error.message, true);
    if (data.session?.user) showSignedIn(data.session.user);
  });
})();
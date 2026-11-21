(() => {
  // Backend target comes only from supabase-config.js. This build branch is
  // staging-only: fail closed unless the config is explicitly the staging
  // project, so a preview can never register or sign in against production.
  const STAGING_PROJECT_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const $ = (id) => document.getElementById(id);
  if (!config || config.environment !== "staging" || config.url !== STAGING_PROJECT_URL || !config.publishableKey) {
    const status = $("auth-status");
    if (status) status.innerHTML = "<b>ACCOUNT UNAVAILABLE</b><p>This build is not configured for the isolated staging environment. No account actions are available.</p>";
    return;
  }
  const client = window.supabase?.createClient(config.url, config.publishableKey);
  if (!client) {
    const status = $("auth-status");
    if (status) status.innerHTML = "<b>ACCOUNT UNAVAILABLE</b><p>The authentication library could not load. Refresh the page or try again later.</p>";
    return;
  }
  const status = $("auth-status");
  const authPanel = $("auth-panel");
  const playerPanel = $("player-panel");
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
    ["signin", "reset", "recovery"].forEach((name) => {
      const form = $(name + "-form");
      form.hidden = name !== tab;
    });
  };
  document.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.authTab)));
  const setWalletUnavailable = (fields) => {
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Unavailable"; });
    const gameDetail = $("wallet-lootcoins-detail");
    if (gameDetail) gameDetail.textContent = "The wallet summary could not be loaded. No balances were changed. Please try again later.";
  };
  const loadWalletSummary = async () => {
    // Only the Legit Coins balance is shown to players. Any cash fields the
    // server still returns are deliberately ignored (cash is deferred; spec §0.1).
    const fields = ["wallet-lootcoins-available"];
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Loading…"; });
    let timeoutId;
    try {
      const request = client.rpc("get_wallet_summary");
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error("Wallet request timed out")), 12000);
      });
      const { data, error } = await Promise.race([request, timeout]);
      if (error) throw error;
      // Shape differs by environment; see wallet-summary.js.
      const wallet = window.LEGITLOOT_WALLET;
      if (!wallet) throw new Error("Wallet parser did not load");
      $("wallet-lootcoins-available").textContent = wallet.formatLegitCoins(wallet.parseLegitCoins(data));
      $("wallet-lootcoins-detail").textContent = "Legit Coins will come only from verified in-game milestones, weekly challenges and seasonal events. None are awarded yet. LC are not cash, not transferable and not withdrawable.";
    } catch (error) {
      console.error("LegitLoot wallet summary failed:", error);
      showMessage("WALLET SUMMARY UNAVAILABLE", "Your account is signed in, but the secure wallet summary did not load. No balances have been changed. Please try again later.", true);
      setWalletUnavailable(fields);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  };
  const showSignedIn = async (user) => {
    authPanel.hidden = true;
    playerPanel.hidden = false;
    $("player-email").textContent = user.email || "Authenticated player";
    showMessage("YOU ARE SIGNED IN", "Your profile is connected. Wallet balances are read from the secure server-side ledger.");
    await loadWalletSummary();
    try {
      const { data, error } = await client.from("profiles").select("display_name,username").eq("id", user.id).maybeSingle();
      if (!error && data?.display_name) $("player-email").textContent = data.display_name + " · " + (user.email || "");
    } catch (error) {
      console.warn("LegitLoot profile display lookup failed:", error);
    }
  };
  $("signin-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: $("signin-email").value.trim(),
        password: $("signin-password").value
      });
      if (error) throw error;
      if (data.user) await showSignedIn(data.user);
    } catch (error) {
      showMessage("SIGN IN FAILED", error.message || "Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
  // UI-only closure: the sign-up form/handler is not wired. Supabase Auth project-level
  // disable_signup is NOT read or changed here and remains unverified/owner-gated.
  // Sign-up is intentionally not wired: public onboarding stays closed until Terms, Privacy
  // and account deletion/export are approved (DaVinci review 6000758245).
  $("reset-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const { error } = await client.auth.resetPasswordForEmail($("reset-email").value.trim(), {
        redirectTo: window.location.origin + "/account.html"
      });
      if (error) throw error;
      showMessage("CHECK YOUR EMAIL", "If an account exists for that address, a password-reset link will be sent.");
    } catch (error) {
      showMessage("RESET REQUEST FAILED", error.message || "Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
  $("recovery-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const { error } = await client.auth.updateUser({ password: $("recovery-password").value });
      if (error) throw error;
      $("recovery-form").reset();
      switchTab("signin");
      showMessage("PASSWORD UPDATED", "Your password has been changed. Sign in with your new password.");
    } catch (error) {
      showMessage("PASSWORD NOT UPDATED", error.message || "Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
  $("signout-button").addEventListener("click", async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      playerPanel.hidden = true;
      authPanel.hidden = false;
      $("signin-form").reset();
      showMessage("SIGNED OUT", "Your session has ended.");
    } catch (error) {
      showMessage("SIGN OUT FAILED", error.message || "Please try again.", true);
    }
  });
  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      playerPanel.hidden = true;
      authPanel.hidden = false;
      switchTab("recovery");
      showMessage("RESET LINK ACCEPTED", "Choose a new password to finish recovering your account.");
      return;
    }
    if (session?.user && event === "SIGNED_IN") showSignedIn(session.user);
    else if (event === "SIGNED_OUT") {
      playerPanel.hidden = true;
      authPanel.hidden = false;
      switchTab("signin");
    }
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) return showMessage("SESSION CHECK FAILED", error.message, true);
    if (data.session?.user) showSignedIn(data.session.user);
  }).catch((error) => {
    console.error("LegitLoot session check failed:", error);
    showMessage("SESSION CHECK FAILED", "Your session could not be checked. Refresh the page and try again.", true);
  });
})();
(() => {
  const SUPABASE_URL = "https://gkbqderyjcuxnjbsiffb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jFPcXIil4Hq1fkJtQ1tYZw_L_SDegFr";
  const $ = (id) => document.getElementById(id);
  const status = $("auth-status");
  // Preview and localhost hosts must never initialize the production Supabase client.
  if (window.location.hostname !== "legitloot.site") {
    if (status) status.innerHTML = "<b>PREVIEW ACCOUNT DISABLED</b><p>Wallet preview is available here, but authentication is disabled on preview hosts to protect production accounts.</p>";
    const panel = $("auth-panel");
    if (panel) panel.hidden = true;
    return;
  }
  const client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  if (!client) {
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
    ["signin", "signup", "reset", "recovery"].forEach((name) => {
      const form = $(name + "-form");
      form.hidden = name !== tab;
    });
  };
  document.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.authTab)));
  const setWalletUnavailable = () => {
    ["wallet-earned-available", "wallet-earned-value", "wallet-earned-pending",
      "wallet-earned-pending-value", "wallet-lootcoins-available"].forEach((id) => {
      const el = $(id);
      if (el) el.textContent = "Unavailable";
    });
    const pending = $("wallet-earned-pending-detail");
    if (pending) pending.textContent = "The secure wallet summary is not available yet. No balances have been changed.";
  };
  const loadWalletSummary = async () => {
    const fields = ["wallet-earned-available", "wallet-earned-value", "wallet-earned-pending",
      "wallet-earned-pending-value", "wallet-lootcoins-available"];
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Loading…"; });
    let timeoutId;
    try {
      if (!window.LEGITLOOT_EARNED_WALLET) throw new Error("Wallet parser unavailable");
      const request = client.rpc("get_player_wallet_summary");
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error("Wallet request timed out")), 12000);
      });
      const { data, error } = await Promise.race([request, timeout]);
      if (error) throw error;
      const wallet = window.LEGITLOOT_EARNED_WALLET.parseWallet(data);
      $("wallet-earned-available").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatInteger(wallet.earnedLoot.availableUnits) + " " + wallet.earnedLoot.unitsLabel;
      $("wallet-earned-value").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatUsd(wallet.earnedLoot.availableValueCents);
      $("wallet-earned-pending").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatInteger(wallet.earnedLoot.pendingUnits) + " " + wallet.earnedLoot.unitsLabel;
      $("wallet-earned-pending-value").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatUsd(wallet.earnedLoot.pendingValueCents) + " · estimated value";
      $("wallet-lootcoins-available").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatLootCoins(wallet.lootCoins.availableAtoms);
      $("wallet-earned-pending-detail").textContent =
        "Awaiting provider verification and approval. This amount is not available for spending, redemption, or conversion.";
    } catch (error) {
      console.error("LegitLoot Earned Loot wallet summary failed:", error);
      showMessage("WALLET SUMMARY UNAVAILABLE",
        "Your account is signed in, but the new secure wallet service is not connected yet. No balances have been changed.", true);
      setWalletUnavailable();
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
  $("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const { data, error } = await client.auth.signUp({
        email: $("signup-email").value.trim(),
        password: $("signup-password").value,
        options: {
          data: { display_name: $("signup-name").value.trim() },
          emailRedirectTo: window.location.origin + "/account.html"
        }
      });
      if (error) throw error;
      if (data.session && data.user) await showSignedIn(data.user);
      else showMessage("CHECK YOUR EMAIL", "Your registration was received. Open the confirmation email to activate your account, then return here to sign in.");
    } catch (error) {
      showMessage("ACCOUNT NOT CREATED", error.message || "Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
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
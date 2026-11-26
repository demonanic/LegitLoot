(() => {
  const STAGING_PROJECT_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";
  const STAGING_PREVIEW_HOSTS = new Set([
    "staging-auth-03-earnedloot-i.legitloot-preview.pages.dev",
    "staging-auth-03-earnedloot-i.legitloot.pages.dev"
  ]);
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const $ = (id) => document.getElementById(id);
  const status = $("auth-status");
  // Fail closed everywhere except the exact staging project on its two isolated branch previews.
  if (!config || config.environment !== "staging" || config.url !== STAGING_PROJECT_URL ||
      !config.publishableKey || !STAGING_PREVIEW_HOSTS.has(window.location.hostname)) {
    if (status) status.innerHTML = "<b>STAGING ACCOUNT ACCESS DISABLED</b><p>This account build is restricted to the isolated staging preview. No account actions are available on this host.</p>";
    const auth = $("auth-panel");
    const player = $("player-panel");
    if (auth) auth.hidden = true;
    if (player) player.hidden = true;
    return;
  }
  const client = window.supabase?.createClient(config.url, config.publishableKey);
  if (!client) {
    if (status) status.innerHTML = "<b>ACCOUNT UNAVAILABLE</b><p>The authentication library could not load. Refresh the page or try again later.</p>";
    return;
  }
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
        window.LEGITLOOT_EARNED_WALLET.formatEarnedLootUnits(wallet.earnedLoot.availableUnits) + " " + wallet.earnedLoot.unitsLabel;
      $("wallet-earned-value").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatUsd(wallet.earnedLoot.availableValueCents);
      $("wallet-earned-pending").textContent =
        window.LEGITLOOT_EARNED_WALLET.formatEarnedLootUnits(wallet.earnedLoot.pendingUnits) + " " + wallet.earnedLoot.unitsLabel;
      $("wallet-earned-pending-value").textContent =
        wallet.earnedLoot.pendingValueCents === null ? "Value pending provider reconciliation" : window.LEGITLOOT_EARNED_WALLET.formatUsd(wallet.earnedLoot.pendingValueCents) + " · estimated value";
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
    await loadDeletionStatus();
    try {
      const { data, error } = await client.from("profiles").select("display_name,username").eq("id", user.id).maybeSingle();
      if (!error && data?.display_name) $("player-email").textContent = data.display_name + " · " + (user.email || "");
    } catch (error) {
      console.warn("LegitLoot profile display lookup failed:", error);
    }
  };
  // AUTH-03: seven-day cancellable deletion request; unpaid cash and open payouts remain owner-review holds.
  const BLOCKED_TEXT = {
    cash_balance_owner_decision: "your account still holds an unpaid cash balance that needs owner review",
    open_payout_request: "you have a payout request that is still open"
  };
  const deletionText = (info) => {
    if (info.status === "pending") {
      return "Your account is scheduled for deletion on " + new Date(info.scheduledFor).toLocaleString() + ". You can cancel before then.";
    }
    if (info.status === "blocked") {
      const why = BLOCKED_TEXT[info.blockedReason] || "it needs a manual review";
      return "Your deletion is on hold because " + why + ". Nothing has been deleted. You can cancel the request.";
    }
    return "Your personal data has been cleared. The final sign-in removal step is still running. No further action is needed.";
  };
  const showDeletion = (info) => {
    const open = !!info && ["pending", "blocked", "data_cleared"].includes(info.status);
    $("deletion-request").hidden = open;
    $("deletion-scheduled").hidden = !open;
    if (open) {
      $("deletion-scheduled").dataset.state = info.status;
      $("deletion-scheduled-text").textContent = deletionText(info);
      $("deletion-cancel").hidden = info.status === "data_cleared";
    }
  };
  const loadDeletionStatus = async () => {
    try {
      const { data, error } = await client.rpc("account_deletion_status");
      if (error) throw error;
      showDeletion(data);
    } catch (error) {
      console.warn("LegitLoot deletion status failed:", error);
    }
  };
  $("deletion-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    if ($("deletion-confirm").value !== "DELETE") {
      showMessage("NOT DELETED", "Type DELETE in capitals to confirm.", true);
      return;
    }
    button.disabled = true;
    try {
      const { data: userData } = await client.auth.getUser();
      const email = userData?.user?.email;
      if (!email) throw new Error("Sign in again to request account deletion.");
      const { error: authError } = await client.auth.signInWithPassword({
        email, password: $("deletion-password").value
      });
      if (authError) throw new Error("That password did not match. Nothing was deleted.");
      const { data, error } = await client.rpc("request_account_deletion");
      if (error) throw error;
      $("deletion-form").reset();
      showDeletion(data);
      // Revoke refresh tokens across all devices now; the player can sign in again
      // during the grace period to cancel. Existing access JWTs expire naturally.
      const { error: signOutError } = await client.auth.signOut({ scope: "global" });
      if (signOutError) {
        showMessage("DELETION SCHEDULED", "Your request is scheduled for 7 days, but we could not sign out every device. Sign out manually on other devices. You can sign in again before the scheduled date to cancel deletion.", true);
      } else {
        showMessage("DELETION SCHEDULED", "Your request is scheduled for 7 days and your sessions have been signed out. Sign in again before the scheduled date and choose Cancel deletion to keep your account.");
      }
    } catch (error) {
      showMessage("NOT DELETED", error.message || "Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
  $("deletion-cancel").addEventListener("click", async () => {
    try {
      const { error } = await client.rpc("cancel_account_deletion");
      if (error) throw error;
      showDeletion(null);
      showMessage("DELETION CANCELLED", "Your account will not be deleted.");
    } catch (error) {
      showMessage("CANCEL FAILED", error.message || "Please try again.", true);
    }
  });
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
(() => {
  const SUPABASE_URL = "https://gkbqderyjcuxnjbsiffb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jFPcXIil4Hq1fkJtQ1tYZw_L_SDegFr";
  const client = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const $ = (id) => document.getElementById(id);
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
  const setWalletUnavailable = (fields) => {
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Unavailable"; });
    const gameDetail = $("wallet-lootcoins-detail");
    const cashDetail = $("wallet-cash-detail");
    if (gameDetail) gameDetail.textContent = "The wallet summary could not be loaded. Please try again later.";
    if (cashDetail) cashDetail.textContent = "No wallet values were changed.";
  };
  const loadWalletSummary = async () => {
    const fields = ["wallet-lootcoins-available", "wallet-cash-available", "wallet-cash-pending", "wallet-cash-reserved", "wallet-cash-paid"];
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Loading…"; });
    let timeoutId;
    try {
      const request = client.rpc("get_wallet_summary");
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error("Wallet request timed out")), 12000);
      });
      const { data, error } = await Promise.race([request, timeout]);
      if (error) throw error;
      if (!data || !data.lootCoins || !data.cash ||
          data.lootCoins.available == null ||
          data.cash.availableCents == null ||
          data.cash.pendingCents == null ||
          data.cash.withdrawalReservedCents == null ||
          data.cash.paidCents == null ||
          data.cash.heldCents == null) {
        throw new Error("Wallet summary response was incomplete");
      }
      const lootCoinsAtoms = Number(data.lootCoins.available);
      if (!Number.isFinite(lootCoinsAtoms)) throw new Error("Invalid LootCoins balance");
      $("wallet-lootcoins-available").textContent = (lootCoinsAtoms / 10000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 4 }) + " LC";
      $("wallet-cash-available").textContent = formatUsd(data.cash.availableCents);
      $("wallet-cash-pending").textContent = formatUsd(data.cash.pendingCents);
      $("wallet-cash-reserved").textContent = formatUsd(data.cash.withdrawalReservedCents);
      $("wallet-cash-paid").textContent = formatUsd(data.cash.paidCents);
      $("wallet-lootcoins-detail").textContent = "LootCoins earned through approved activities. LC is a platform reward currency, not cash and not withdrawable.";
      $("wallet-cash-detail").textContent = formatUsd(data.cash.heldCents) + " held. Pending provider funds are not available for withdrawal.";
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
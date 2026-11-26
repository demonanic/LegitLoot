(() => {
  // Backend target comes only from supabase-config.js. This build branch is
  // staging-only: fail closed unless the config is explicitly the staging
  // project, so a preview can never register or sign in against production.
  const STAGING_PROJECT_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";
  const STAGING_PREVIEW_HOSTS = new Set([
    "staging-auth-03-earnedloot-i.legitloot-preview.pages.dev",
    "feature-moonetix-offerwall-l.legitloot-preview.pages.dev",
    "feature-moonetix-offerwall-l.legitloot.pages.dev"
  ]);
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  const $ = (id) => document.getElementById(id);
  if (!config || config.environment !== "staging" || config.url !== STAGING_PROJECT_URL || !config.publishableKey || !STAGING_PREVIEW_HOSTS.has(window.location.hostname)) {
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
  const dobInput = $("signup-dob");
  if (dobInput) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value || "";
    dobInput.max = `${part("year")}-${part("month")}-${part("day")}`;
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
    ["wallet-lootcoins-available","wallet-earnedloot-available","wallet-earnedloot-pending","wallet-earnedloot-value"].forEach((id) => {
      const el = $(id); if (el) el.textContent = "Unavailable";
    });
    const detail = $("wallet-lootcoins-detail");
    if (detail) detail.textContent = "The wallet summary could not be loaded. No balances were changed. Please try again later.";
  };
  const loadWalletSummary = async () => {
    const fields = ["wallet-lootcoins-available","wallet-earnedloot-available","wallet-earnedloot-pending","wallet-earnedloot-value"];
    fields.forEach((id) => { const el = $(id); if (el) el.textContent = "Loading…"; });
    let timeoutId;
    try {
      const request = client.rpc("get_player_wallet_summary");
      const timeout = new Promise((_, reject) => { timeoutId = window.setTimeout(() => reject(new Error("Wallet request timed out")), 12000); });
      const { data, error } = await Promise.race([request, timeout]);
      if (error) throw error;
      if (!data || !data.earnedLoot || !data.lootCoins) throw new Error("Unexpected wallet response");
      const fmtDecimal = (value) => {
        const raw = String(value ?? "0").split(".");
        const whole = BigInt(raw[0] || "0").toLocaleString("en-US");
        const fraction = (raw[1] || "").replace(/0+$/, "");
        return whole + (fraction ? "." + fraction : "");
      };
      const fmtAtoms = (value, scale) => {
        const atoms = BigInt(value ?? "0");
        const divisor = 10n ** BigInt(scale);
        const whole = (atoms / divisor).toLocaleString("en-US");
        const fraction = (atoms % divisor).toString().padStart(scale, "0").replace(/0+$/, "");
        return whole + (fraction ? "." + fraction : "");
      };
      const fmtCents = (value) => {
        const cents = BigInt(value ?? "0");
        const whole = (cents / 100n).toLocaleString("en-US");
        return "$" + whole + "." + (cents % 100n).toString().padStart(2, "0");
      };
      $("wallet-earnedloot-available").textContent = fmtDecimal(data.earnedLoot.availableUnits ?? "0");
      $("wallet-earnedloot-pending").textContent = fmtDecimal(data.earnedLoot.pendingUnits ?? "0");
      const cents = data.earnedLoot.availableValueCents;
      $("wallet-earnedloot-value").textContent = cents == null ? "Not available" : fmtCents(cents);
      $("wallet-lootcoins-available").textContent = fmtAtoms(data.lootCoins.availableAtoms,4);
      $("wallet-lootcoins-detail").textContent = "LC are non-cash, non-transferable platform utility units. They cannot be withdrawn or converted back into Earned Loot.";
      const pendingValue = $("wallet-earnedloot-pending-value");
      if (pendingValue) pendingValue.textContent = data.earnedLoot.pendingValueCents == null ? "Value pending verification" : fmtCents(data.earnedLoot.pendingValueCents);
    } catch (error) {
      console.error("LegitLoot wallet summary failed:", error);
      showMessage("WALLET SUMMARY UNAVAILABLE", "The secure wallet summary did not load. No balances were changed. Please try again later.", true);
      setWalletUnavailable();
    } finally { if (timeoutId) window.clearTimeout(timeoutId); }
  };
  const loadLootCoinPackages = async () => {
    const container = $("lootcoin-shop-packages");
    if (!container) return;
    container.textContent = "Loading available exchanges…";
    try {
      const { data, error } = await client.rpc("get_active_lootcoin_packages");
      if (error) throw error;
      container.textContent = "";
      if (!Array.isArray(data) || data.length === 0) { container.textContent = "The exchange is temporarily unavailable."; return; }
      data.forEach((pkg) => {
        const card = document.createElement("article"); card.className = "lootcoin-package";
        const title = document.createElement("h3"); title.textContent = pkg.display_name;
        const price = document.createElement("p"); price.textContent = Number(pkg.el_price_atoms / 1000).toLocaleString("en-US") + " EL";
        const reward = document.createElement("p"); reward.textContent = Number(pkg.lc_amount_atoms / 10000).toLocaleString("en-US") + " LC";
        const button = document.createElement("button"); button.type = "button"; button.className = "filter-chip"; button.textContent = "EXCHANGE";
        button.addEventListener("click", async () => {
          if (!window.confirm("Exchange " + price.textContent + " for " + reward.textContent + "? This exchange cannot be reversed.")) return;
          button.disabled = true;
          try {
            const { error: purchaseError } = await client.rpc("purchase_lootcoin_package", {p_package_id:pkg.package_id,p_idempotency_key:"lc-shop-"+crypto.randomUUID()});
            if (purchaseError) throw purchaseError;
            showMessage("EXCHANGE COMPLETE","Earned Loot was exchanged for LootCoins. Refreshing wallet balances.");
            await loadWalletSummary();
          } catch(error) { showMessage("EXCHANGE NOT COMPLETED",error.message||"Please try again.",true); }
          finally { button.disabled=false; }
        });
        card.append(title,price,reward,button); container.append(card);
      });
    } catch(error) { console.error("LootCoins shop unavailable:",error); container.textContent="The exchange is unavailable. No balances were changed."; }
  };
  const showSignedIn = async (user) => {
    authPanel.hidden = true;
    playerPanel.hidden = false;
    $("player-email").textContent = user.email || "Authenticated player";
    showMessage("YOU ARE SIGNED IN", "Your profile is connected. Wallet balances are read from the secure server-side ledger.");
    $("player-email").dataset.email = user.email || "";
    await loadWalletSummary();
    await loadLootCoinPackages();
    await loadDeletionStatus();
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
      const { data, error } = await client.functions.invoke("signup-with-consent", {
        body: {
          email: $("signup-email").value.trim(),
          password: $("signup-password").value,
          displayName: $("signup-name").value.trim(),
          dateOfBirth: $("signup-dob").value,
          acceptTerms: $("signup-terms").checked,
          acceptPrivacy: $("signup-privacy").checked,
          termsVersion: "LL-TERMS-DRAFT-2026-11-24",
          privacyVersion: "LL-PRIVACY-DRAFT-2026-11-24"
        }
      });
      if (error) throw error;
      showMessage("CHECK YOUR EMAIL", data?.message || "If registration is enabled, check your email for a confirmation link.");
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

  const deletionPanel = $("account-deletion-panel");
  const deletionText = $("deletion-scheduled-text");
  const deletionCancel = $("deletion-cancel");
  const deletionRequest = $("deletion-request");
  const deletionExport = $("account-export");
  const showDeletion = (state) => {
    const value = state || {status:"none"};
    if (deletionPanel) deletionPanel.hidden = false;
    if (!deletionText) return;
    deletionText.textContent = "";
    if (value.status === "pending") {
      deletionText.textContent = "Your account is scheduled for deletion on " + (value.scheduledFor ? new Date(value.scheduledFor).toLocaleString() : "the date shown in your account status") + ". You can cancel during the 7-day waiting period.";
      if (deletionCancel) deletionCancel.hidden = false;
      if (deletionRequest) deletionRequest.hidden = true;
    } else if (value.status === "blocked") {
      deletionText.textContent = value.blockedReason === "cash_balance_owner_decision" ? "Your account deletion is on hold because your account still holds an unpaid cash balance. No funds were moved or forfeited. You may cancel this request." : "Your account deletion is on hold because an open payout request must be resolved. You may cancel this request.";
      if (deletionCancel) deletionCancel.hidden = false;
      if (deletionRequest) deletionRequest.hidden = true;
    } else if (value.status === "data_cleared" || value.status === "completed") {
      deletionText.textContent = "Your personal data has been cleared. This account cannot be restored.";
      if (deletionCancel) deletionCancel.hidden = true;
      if (deletionRequest) deletionRequest.hidden = true;
    } else {
      deletionText.textContent = "You can request account deletion. A recent sign-in is required. Deletion includes a 7-day cancellation period; unpaid cash or open payout requests stop processing.";
      if (deletionCancel) deletionCancel.hidden = true;
      if (deletionRequest) deletionRequest.hidden = false;
    }
  };
  const loadDeletionStatus = async () => {
    try { const {data,error}=await client.rpc("account_deletion_status"); if(error) throw error; showDeletion(data); }
    catch(error){ showMessage("ACCOUNT STATUS UNAVAILABLE","Your account is signed in, but deletion status could not be loaded.",true); }
  };
  if (deletionRequest) deletionRequest.addEventListener("submit",async(event)=>{
    event.preventDefault(); const btn=deletionRequest.querySelector("button[type=submit]");btn.disabled=true;
    try {
      const email=$("player-email").dataset.email || $("signin-email").value.trim() || $("signup-email").value.trim();
      const password=$("deletion-password").value;
      if(!email || !password) throw new Error("Enter your account email and password to confirm this request.");
      const {error:reauthError}=await client.auth.signInWithPassword({email,password});if(reauthError)throw new Error("Reauthentication failed. Check your password.");
      const {data,error}=await client.rpc("request_account_deletion");if(error)throw error;
      showDeletion(data);deletionRequest.reset();showMessage("DELETION REQUESTED","Your request has a 7-day cancellation period.");
    }catch(error){showMessage("REQUEST NOT SUBMITTED",error.message||"Please try again.",true);}
    finally{btn.disabled=false;}
  });
  if(deletionCancel) deletionCancel.addEventListener("click",async()=>{
    deletionCancel.disabled=true;try{const {data,error}=await client.rpc("cancel_account_deletion");if(error)throw error;if(data?.cancelled){showDeletion({status:"none"});showMessage("REQUEST CANCELLED","Your account deletion request was cancelled.");}else showMessage("NOT CANCELLED","No cancellable request was found.",true);}
    catch(error){showMessage("CANCELLATION FAILED",error.message||"Please try again.",true);}finally{deletionCancel.disabled=false;}
  });
  if(deletionExport) deletionExport.addEventListener("click",async()=>{
    deletionExport.disabled=true;try{const {data,error}=await client.rpc("export_account_data");if(error)throw error;const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="legitloot-account-export.json";a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);showMessage("EXPORT READY","Your account data export was downloaded.");}
    catch(error){showMessage("EXPORT FAILED",error.message||"Please try again.",true);}finally{deletionExport.disabled=false;}
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
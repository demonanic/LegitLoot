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
    ["signin", "signup", "reset"].forEach((name) => {
      const form = $(name + "-form");
      form.hidden = name !== tab;
    });
  };
  document.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.authTab)));
  const showSignedIn = async (user) => {
    authPanel.hidden = true;
    playerPanel.hidden = false;
    $("player-email").textContent = user.email || "Authenticated player";
    showMessage("YOU ARE SIGNED IN", "Your profile is connected. Wallet balances remain hidden until the trusted wallet summary API is implemented.");
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
  $("signout-button").addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) return showMessage("SIGN OUT FAILED", error.message, true);
    playerPanel.hidden = true;
    authPanel.hidden = false;
    $("signin-form").reset();
    showMessage("SIGNED OUT", "Your session has ended.");
  });
  client.auth.onAuthStateChange((event, session) => {
    if (session?.user) showSignedIn(session.user);
    else if (event === "SIGNED_OUT") {
      playerPanel.hidden = true;
      authPanel.hidden = false;
    }
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) return showMessage("SESSION CHECK FAILED", error.message, true);
    if (data.session?.user) showSignedIn(data.session.user);
  });
})();
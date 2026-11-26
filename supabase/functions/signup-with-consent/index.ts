import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
});

function validDob(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function northCarolinaDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function ageOnDate(dob: string, today: string): number {
  const [year, month, day] = dob.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
  let age = todayYear - year;
  if (todayMonth < month || (todayMonth === month && todayDay < day)) age--;
  return age;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const termsVersion = Deno.env.get("LEGITLOOT_TERMS_VERSION");
  const privacyVersion = Deno.env.get("LEGITLOOT_PRIVACY_VERSION");
  const signupEnabled = Deno.env.get("LEGITLOOT_SIGNUP_ENABLED") === "true";
  const emailRedirectUrl = Deno.env.get("LEGITLOOT_EMAIL_REDIRECT_URL");
  if (!url || !anonKey || !serviceKey || !termsVersion || !privacyVersion || !emailRedirectUrl || !signupEnabled) {
    return json({ error: "Account registration is temporarily unavailable." }, 503);
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  const dob = body.dateOfBirth;
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
  if (password.length < 10 || password.length > 128) return json({ error: "Password must be at least 10 characters." }, 400);
  if (!displayName || displayName.length > 40) return json({ error: "Display name is required (maximum 40 characters)." }, 400);
  if (!validDob(dob)) return json({ error: "Enter a valid date of birth." }, 400);
  if (dob > northCarolinaDate() || ageOnDate(dob, northCarolinaDate()) < 18) return json({ error: "You must be at least 18 years old to create a LegitLoot account." }, 403);
  if (body.acceptTerms !== true || body.acceptPrivacy !== true) return json({ error: "You must accept the Terms and acknowledge the Privacy Notice." }, 400);
  if (body.termsVersion !== termsVersion || body.privacyVersion !== privacyVersion) return json({ error: "The policy versions have changed. Refresh and review the current documents." }, 409);

  const publicClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false }, db: { schema: "private" } });
  const { data, error } = await publicClient.auth.signUp({
    email, password,
    options: { data: { display_name: displayName }, emailRedirectTo: emailRedirectUrl },
  });
  if (error || !data.user || (data.user.identities && data.user.identities.length === 0)) {
    return json({ error: "Registration could not be completed. Check the email address or try signing in." }, 400);
  }

  const userId = data.user.id;
  const { error: ageError } = await admin.from("account_age_verifications").insert({
    user_id: userId, date_of_birth: dob, age_eligible: true, age_policy_version: "18-plus-v1",
  });
  if (ageError) {
    await admin.auth.admin.deleteUser(userId).catch(() => undefined);
    return json({ error: "Registration could not be securely completed. Please try again." }, 503);
  }
  const { error: consentError } = await admin.from("account_policy_acceptances").insert([
    { user_id: userId, policy_type: "terms", policy_version: termsVersion, source: "signup" },
    { user_id: userId, policy_type: "privacy", policy_version: privacyVersion, source: "signup" },
  ]);
  if (consentError) {
    await admin.from("account_age_verifications").delete().eq("user_id", userId);
    await admin.auth.admin.deleteUser(userId).catch(() => undefined);
    return json({ error: "Registration could not be securely completed. Please try again." }, 503);
  }
  return json({ requiresEmailConfirmation: !data.session, message: data.session ? "Account created." : "Check your email to confirm your account." }, 201);
});

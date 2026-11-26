import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Conversion = {
  transaction_id: string;
  user_id: string;
  status: "credited" | "reversed";
  reward: number | string;
  payout_usd: number | string;
  credited_at: string;
  reversed_at: string | null;
};

type ReportPage = {
  ok: boolean;
  currency: string;
  timezone: string;
  next_cursor: string | null;
  conversions: Conversion[];
  error?: string;
};

function dateInZone(timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return part("year") + "-" + part("month") + "-" + part("day");
}

function shiftDate(date: string, days: number): string {
  const value = new Date(date + "T00:00:00.000Z");
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function safeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) mismatch |= left[i] ^ right[i];
  return mismatch === 0;
}

async function fetchPage(
  apiKey: string,
  from: string,
  to: string,
  timeZone: string,
  status: "credited" | "reversed",
  after: string | null,
): Promise<ReportPage> {
  const params = new URLSearchParams({
    from,
    to,
    timezone: timeZone,
    status,
    limit: "500",
  });
  if (after) params.set("after", after);

  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch("https://api.moonetix.com/v1/conversions?" + params.toString(), {
      method: "GET",
      headers: { Authorization: "Bearer " + apiKey },
    });
    if (response.status === 429) {
      if (attempt === 4) {
        throw new Error("Moonetix Reporting API rate limit persisted after bounded retries");
      }
      const retryAfter = Number(response.headers.get("Retry-After") ?? "10");
      await new Promise((resolve) => setTimeout(resolve, Math.min(Math.max(retryAfter, 1), 30) * 1000));
      continue;
    }
    if (!response.ok) {
      throw new Error("Moonetix Reporting API returned HTTP " + response.status);
    }
    const page = await response.json() as ReportPage;
    if (!page.ok || page.currency !== "EL" || !Array.isArray(page.conversions)) {
      throw new Error("Moonetix Reporting API returned an unexpected report contract");
    }
    return page;
  }
  throw new Error("Moonetix Reporting API request did not complete");
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const expectedSecret = Deno.env.get("MOONETIX_RECONCILE_SECRET");
  const suppliedSecret = request.headers.get("x-reconcile-secret") ?? "";
  const apiKey = Deno.env.get("MOONETIX_API_KEY");
  const timeZone = Deno.env.get("MOONETIX_TIMEZONE");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!expectedSecret || !apiKey || !timeZone || !supabaseUrl || !serviceRoleKey) {
    return new Response("Reconciliation service is not configured", { status: 503 });
  }
  if (!safeEqual(expectedSecret, suppliedSecret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const today = dateInZone(timeZone);
  const creditFrom = shiftDate(today, -6);
  const reversalFrom = shiftDate(today, -91);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const totals = {
    creditedSeen: 0,
    creditedReconciled: 0,
    missingCreditPostbacks: 0,
    missingVerifiedConfigs: 0,
    reversedSeen: 0,
    reversedReconciled: 0,
    missingReversalPostbacks: 0,
    failedRecords: 0,
  };

  try {
    for (const item of [
      { status: "credited" as const, from: creditFrom },
      { status: "reversed" as const, from: reversalFrom },
    ]) {
      let cursor: string | null = null;
      let pageCount = 0;
      do {
        const page = await fetchPage(apiKey, item.from, today, timeZone, item.status, cursor);
        pageCount++;
        if (pageCount > 100) throw new Error("Moonetix report exceeded the safe page limit");

        for (const conversion of page.conversions) {
          if (conversion.transaction_id?.startsWith("test_")) continue;
          if (!conversion.transaction_id || !conversion.user_id || conversion.status !== item.status) {
            totals.failedRecords++;
            continue;
          }

          const reference = "report:" + item.status + ":" + item.from + ":" + today + ":" + conversion.transaction_id;
          let result;
          if (item.status === "credited") {
            if (!conversion.credited_at) {
              totals.failedRecords++;
              continue;
            }
            result = await supabase.rpc("reconcile_moonetix_credit_report", {
              p_report_transaction_id: conversion.transaction_id,
              p_report_user_id: conversion.user_id,
              p_report_reward_raw: String(conversion.reward),
              p_report_payout_usd_raw: String(conversion.payout_usd),
              p_provider_credited_at: conversion.credited_at,
              p_report_reference: reference,
            });
            totals.creditedSeen++;
            if (!result.error && result.data === "reconciled") totals.creditedReconciled++;
            else if (!result.error && result.data === "missing_credit_postback") totals.missingCreditPostbacks++;
            else if (!result.error && result.data === "verified_config_missing") totals.missingVerifiedConfigs++;
            else totals.failedRecords++;
          } else {
            if (!conversion.reversed_at) {
              totals.failedRecords++;
              continue;
            }
            result = await supabase.rpc("reconcile_moonetix_reversal_report", {
              p_report_transaction_id: conversion.transaction_id,
              p_report_user_id: conversion.user_id,
              p_report_reward_raw: String(conversion.reward),
              p_report_payout_usd_raw: String(conversion.payout_usd),
              p_provider_reversed_at: conversion.reversed_at,
              p_report_reference: reference,
            });
            totals.reversedSeen++;
            if (!result.error && result.data === "reconciled") totals.reversedReconciled++;
            else if (!result.error && result.data === "missing_reversal_postback") totals.missingReversalPostbacks++;
            else totals.failedRecords++;
          }
        }

        cursor = page.next_cursor;
      } while (cursor);
    }
  } catch (error) {
    console.error("Moonetix reconciliation failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return new Response("Reconciliation failed; retry later", { status: 503 });
  }

  if (totals.failedRecords > 0 || totals.missingCreditPostbacks > 0
    || totals.missingVerifiedConfigs > 0 || totals.missingReversalPostbacks > 0) {
    console.error("Moonetix reconciliation has unmatched records", totals);
    return new Response(JSON.stringify(totals), {
      status: 207,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify(totals), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
});

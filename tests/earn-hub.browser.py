"""Browser check for the earning hub. Run: python3 tests/earn-hub.browser.py http://127.0.0.1:8765
Needs Playwright and a Chrome/Chromium binary (set CHROME_PATH if not /usr/bin/google-chrome)."""
import asyncio, os, re, sys
from playwright.async_api import async_playwright

BASE = sys.argv[1].rstrip("/")
CHROME = os.environ.get("CHROME_PATH", "/usr/bin/google-chrome")
failures = []

def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond: failures.append(msg)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        for vp_name, vp in [("desktop", {"width": 1440, "height": 900}), ("phone", {"width": 390, "height": 844})]:
            ctx = await browser.new_context(viewport=vp)
            page = await ctx.new_page()
            errors, fn_calls = [], []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: m.type == "error" and errors.append(m.text))
            page.on("request", lambda r: "/functions/v1/" in r.url and fn_calls.append(r.url))
            await page.goto(f"{BASE}/earn.html", wait_until="networkidle")
            start_url = page.url
            cards = page.locator("#provider-hub .provider-card")
            check(await cards.count() == 4, f"[{vp_name}] four hub cards render")
            for pid, label in [("offerwall-gg", "Pending approval"), ("cpagrip", "Testing · not open"),
                               ("surveys", "Unavailable"), ("direct-offers", "Unavailable")]:
                text = await page.locator(f"#provider-{pid} .provider-state").inner_text()
                check(label.lower() in text.lower(), f"[{vp_name}] {pid} shows '{label}'")
            for pid in ["offerwall-gg", "cpagrip"]:
                btn = page.locator(f"#open-provider-{pid}")
                check(await btn.count() == 1 and await btn.is_disabled(), f"[{vp_name}] {pid} has its own entry button and it is disabled")
                await btn.click(force=True)
            await page.wait_for_timeout(500)
            check(page.url == start_url, f"[{vp_name}] clicking disabled buttons navigates nowhere")
            check(not fn_calls, f"[{vp_name}] no server function calls made ({fn_calls})")
            summary = await page.locator("#earn-hub-summary").inner_text()
            check("No earning provider is open" in summary, f"[{vp_name}] summary says no provider is open")
            await page.click("button[data-filter=survey]")
            visible = [c for c in await cards.all() if await c.is_visible()]
            check(len(visible) == 1, f"[{vp_name}] Surveys filter shows 1 card")
            await page.click("button[data-filter=offerwall]")
            visible = [await c.get_attribute("id") for c in await cards.all() if await c.is_visible()]
            check(visible == ["provider-offerwall-gg", "provider-cpagrip"], f"[{vp_name}] Offerwalls filter shows both offerwalls")
            await page.click("button[data-filter=all]")
            body = await page.inner_text("body")
            check(not re.search(r"cash out|real payout|\$\d", body, re.I), f"[{vp_name}] no cash/payout/amount claims in page text")
            overflow = await page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            check(not overflow, f"[{vp_name}] no horizontal overflow")
            if vp_name == "phone":
                await page.click(".menu-toggle")
                check(await page.locator(".main-nav").is_visible(), "[phone] menu opens")
            check(not errors, f"[{vp_name}] no console/page errors ({errors})")
            for route in ["index.html", "account.html", "games.html", "rewards.html"]:
                errs = []
                pg = await ctx.new_page()
                pg.on("pageerror", lambda e: errs.append(str(e)))
                resp = await pg.goto(f"{BASE}/{route}", wait_until="networkidle")
                check(resp.ok and not errs, f"[{vp_name}] {route} loads without script errors ({errs})")
                await pg.close()
            await ctx.close()
        await browser.close()
    print(f"\n{len(failures)} failure(s)")
    sys.exit(1 if failures else 0)

asyncio.run(main())

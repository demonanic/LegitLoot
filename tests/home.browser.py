"""Browser check for the homepage. Run: python3 tests/home.browser.py http://127.0.0.1:8765"""
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
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        for name, vp in [("desktop", {"width": 1440, "height": 900}), ("laptop", {"width": 1024, "height": 768}), ("phone", {"width": 390, "height": 844})]:
            ctx = await b.new_context(viewport=vp); page = await ctx.new_page()
            errors, bad = [], []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("response", lambda r: r.status >= 400 and bad.append(f"{r.status} {r.url}"))
            page.on("request", lambda r: "supabase" in r.url and bad.append("backend call " + r.url))
            await page.goto(f"{BASE}/index.html", wait_until="networkidle")
            text = await page.inner_text("body")
            check("NOT BUILT" in text.upper() and "MAINSTREAM" in text.upper(), f"[{name}] headline is real text")
            check("ZOMBIE INVASION DEFENSE" in text.upper(), f"[{name}] Zombie Invasion Defense panel present")
            check(not re.search(r"demonanic|gauntlet|harvest", text, re.I), f"[{name}] older games are gone")
            check(not re.search(r"real payout|real reward|cash out|\$\d", text, re.I), f"[{name}] no cash or payout claims")
            check("no cash value" in text.lower(), f"[{name}] no-cash-value line present")
            check(not await page.evaluate("document.documentElement.scrollWidth > window.innerWidth"), f"[{name}] no horizontal overflow")
            clipped = await page.evaluate("""() => [...document.querySelectorAll('h1,h2,h3,.ll-btn,.ll-hero__lede,.ll-coins__head p,.ll-coins__steps li')]
                .filter(e => { const r = e.getBoundingClientRect(); return r.right > window.innerWidth + 1 || r.left < -1; }).map(e => e.textContent.trim().slice(0, 30))""")
            check(not clipped, f"[{name}] no text runs off screen ({clipped})")
            art = await page.evaluate("fetch('assets/skuz-arcade-neon.webp').then(r => r.ok)")
            check(art, f"[{name}] hero artwork loads")
            if name == "phone":
                await page.click(".menu-toggle")
                check(await page.locator(".main-nav").is_visible(), "[phone] menu opens")
                small = await page.evaluate("[...document.querySelectorAll('.ll-btn,.ll-world__btn,.menu-toggle,.main-nav a')].filter(e => e.getBoundingClientRect().height < 44).length")
                check(small == 0, f"[phone] touch targets are at least 44px ({small} too small)")
                await page.click(".menu-toggle")
            gp = await ctx.new_page(); await gp.goto(f"{BASE}/games.html", wait_until="networkidle")
            gtext = await gp.inner_text("body") + await gp.content()
            check(not re.search(r"demonanic|gauntlet|harvest", gtext, re.I), f"[{name}] games page no longer lists the older games")
            check("ZOMBIE INVASION DEFENSE" in gtext.upper(), f"[{name}] games page lists Zombie Invasion Defense")
            check(not await gp.evaluate("document.documentElement.scrollWidth > window.innerWidth"), f"[{name}] games page has no horizontal overflow")
            await gp.close()
            for sel, dest in [(".nav-signup", "account"), (".ll-btn--acid", "games"), (".ll-btn--ghost", "how-it-works")]:
                href = await page.locator(sel).first.get_attribute("href")
                check(dest in href, f"[{name}] {sel} links to {href}")
            check(not errors and not bad, f"[{name}] no script errors, failed requests or backend calls ({errors + bad})")
            await ctx.close()
        await b.close()
    print(f"\n{len(failures)} failure(s)"); sys.exit(1 if failures else 0)
asyncio.run(main())

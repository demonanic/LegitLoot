import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('both launch play pages and the Rocket 2 Nowhere build exist', () => {
  for (const p of ['zombies-vs-heavy-metal.html', 'rocket-2-nowhere.html', 'games/rocket-2-nowhere/index.html',
    'assets/rxt2-logo.svg', 'assets/rxt2-logo-clear.svg', 'assets/rxt2-icon.svg']) {
    assert.ok(existsSync(new URL('../' + p, import.meta.url)), p + ' missing');
  }
});

test('play pages embed the right builds with the official titles', () => {
  const z = read('zombies-vs-heavy-metal.html');
  assert.match(z, /<iframe[^>]+src="https:\/\/demonanic\.github\.io\/Legitloot-2\/"/);
  assert.match(z, /<title>Play Zombies vs Heavy Metal — LegitLoot<\/title>/);
  const r = read('rocket-2-nowhere.html');
  assert.match(r, /<iframe[^>]+src="games\/rocket-2-nowhere\/index\.html"/);
  assert.match(r, /<title>Play Rocket 2 Nowhere — LegitLoot<\/title>/);
  assert.doesNotMatch(r, /Zombies vs Heavy Metal|Neon Thrust/);
});

test('Rocket 2 Nowhere build is branded and has no prototype name or retro-sunset palette', () => {
  const g = read('games/rocket-2-nowhere/index.html');
  assert.match(g, /<title>Rocket 2 Nowhere — LegitLoot<\/title>/);
  assert.match(g, /<h1 class="sr">Rocket 2 Nowhere<\/h1>/);
  assert.doesNotMatch(g, /Neon Thrust|Neon Rush|Monoton|#ffd23f|#ff9a3c/i);
  assert.match(g, /rxt2Best/);
});

test('Rocket 2 Nowhere build is self-contained: no network calls beyond fonts, no account or wallet code', () => {
  const g = read('games/rocket-2-nowhere/index.html');
  assert.doesNotMatch(g, /fetch\(|XMLHttpRequest|WebSocket|supabase|post_journal|wallet|legit ?coin/i);
  const urls = [...g.matchAll(/https?:\/\/[^"'\s)]+/g)].map((m) => new URL(m[0]).hostname);
  for (const h of urls) assert.ok(['fonts.googleapis.com', 'fonts.gstatic.com'].includes(h), 'unexpected host ' + h);
});

test('games page lists both games as playable early access with honest save/LC disclosure', () => {
  const h = read('games.html');
  assert.match(h, /href="zombies-vs-heavy-metal\.html"/);
  assert.match(h, /href="rocket-2-nowhere\.html"/);
  assert.doesNotMatch(h, /INTEGRATION IN PROGRESS|Zombie Invasion Defense/);
  const cards = h.match(/<article class="portal-card">[\s\S]*?<\/article>/g);
  assert.equal(cards.length, 2);
  for (const c of cards) {
    assert.match(c, /saved on your device/);
    assert.match(c, /LegitLoot accounts and Legit Coins are not connected yet/);
    assert.match(c, /PLAYABLE · EARLY ACCESS/);
  }
});

test('homepage and sitemap point at the playable games without implying LC or accounts', () => {
  const i = read('index.html');
  assert.match(i, /Status: Playable · Early access/);
  assert.doesNotMatch(i, /Playable links appear when they are verified/);
  const s = read('sitemap.xml');
  assert.match(s, /legitloot\.site\/zombies-vs-heavy-metal\.html/);
  assert.match(s, /legitloot\.site\/rocket-2-nowhere\.html/);
});

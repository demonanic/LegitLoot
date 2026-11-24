# Game milestones and awards

Gameplay LootCoins (LC) for milestones and achievements, per the owner amendment in
[EARNED_LOOT_AND_LOOTCOINS_MODEL.md](EARNED_LOOT_AND_LOOTCOINS_MODEL.md) §1: LC may enter a wallet through
"server-verified game milestones, achievements, challenges…". This system decides **when** an award is earned.
The actual LC posting is still done only by `private.issue_game_lootcoins` from the Earned Loot ledger work.

Status: **draft, not applied anywhere.** Issuance is **off** for every game until the owner turns it on.

## How it works

```
game (iframe)  --postMessage-->  game page bridge  --RPC-->  Supabase
 run-start                        start_game_run            game_runs (server clock starts)
 checkpoint (each cleared wave)   report_game_run           plausibility checks → player metrics → unlocks
 run-end (defeat)                 report_game_run(final)    → issue_pending_game_awards → issue_game_lootcoins
```

- The game only reports its own totals for the current run (waves cleared, kills, bosses killed). Played outside
  legitloot.site it sends nothing. Messages go only to `https://legitloot.site`, and the page accepts them only from
  the game's origin and frame. The game holds its messages until the page says it is ready.
- Signed-out players can play and see the catalog; nothing is tracked.

## What the server checks

Browser games cannot be made tamper-proof; these checks raise the cost of cheating and keep a full audit trail.

| Check | Where it is set |
| --- | --- |
| Run must have been started by this player via `start_game_run`; one open run per game | built in |
| Runs per player per day | `game_award_games.max_runs_per_day` (Z.V.H.M.: 60) |
| Maximum run length | `game_award_games.max_run_hours` (6) |
| Stats are whole numbers, known keys only, never decrease within a run | built in |
| Per-run ceilings and rate limits against the **server's** clock | `game_award_metrics` (`max_per_run`, `min_seconds_per_unit`, `max_per_minute`) |
| Checkpoints at most every few seconds; bounded reports per run | `min_report_seconds`, `max_reports_per_run` |
| Each award once per player, ever | unique `(user_id, award_id)` |
| LC per player per game per UTC day | `game_award_games.daily_lc_cap_atoms` (100 LC) |

A failed check rejects the whole run (status `rejected`, reason recorded) and nothing from that report counts.
Every report, accepted or not, is kept in `private.game_run_reports`, which is append-only.

Z.V.H.M. rates come from its config: a wave's spawn window is at least 36 s, so the check uses 30 s per wave
cleared; bosses come every fifth wave (two from wave 20), so 60 s per boss; kills are capped at 600 a minute.

## Awards (Z.V.H.M.) — LC amounts are proposals for owner review

| Award | Kind | Needs | LC |
| --- | --- | --- | --- |
| First Stand | milestone | clear 1 wave in a run | 1 |
| Holding the Line | milestone | clear 5 waves in a run | 2 |
| Fortified | milestone | 10 waves | 5 |
| Iron Curtain | milestone | 15 waves | 10 |
| Heavy Metal | milestone | 20 waves | 20 |
| Last Band Standing | milestone | 25 waves | 40 |
| Pest Control | achievement | 500 kills (lifetime) | 2 |
| Body Count | achievement | 5,000 kills | 10 |
| Extinction Event | achievement | 25,000 kills | 30 |
| Giant Slayer | achievement | 1 boss | 3 |
| Boss Rush | achievement | 10 bosses | 10 |
| Regular | achievement | finish 10 runs (counted by the server) | 2 |

Total available: 135 LC per player. The scripted balance player falls around wave 20, so the last milestone is a stretch goal.

## Owner controls (service role / SQL editor)

```sql
-- Turn LC issuance on or off for a game. Awards unlocked while off are issued later, oldest first, within the daily cap.
update private.game_award_games set issuance_enabled = true where game_slug = 'zvhm';
-- Change an award's amount (applies to awards not yet issued), retire one, or run a time-limited challenge.
update private.game_award_definitions set lc_amount_atoms = 3 * 10000 where game_slug = 'zvhm' and award_key = 'boss-1';
update private.game_award_definitions set is_active = false where award_key = '...';
insert into private.game_award_definitions(game_slug, award_key, title, description, source_type, metric, threshold, lc_amount_atoms, starts_at, ends_at)
values ('zvhm', 'dec-kills', 'December Purge', 'Kill 2,000 zombies in December.', 'challenge', 'kills', 2000, 5 * 10000, '2026-12-01', '2027-01-01');
```

A retired award stays visible to players who earned it. Note that lifetime metrics count from the first tracked run,
so a dated challenge on a lifetime metric is met by earlier play too; per-period metrics are a follow-up if wanted.

## Player API

| RPC | Who | Returns |
| --- | --- | --- |
| `get_game_awards(game)` | anyone | catalog, progress and status (`locked` / `unlocked` / `issued`) for the signed-in player |
| `start_game_run(game, clientVersion)` | signed in | run id |
| `report_game_run(runId, stats, final)` | signed in | `{accepted, reason?, runStatus, unlocked[], issued[]}` |
| `claim_game_awards(game)` | signed in | `{issued[]}` — retries pending issuance (e.g. after the daily cap resets) |

## Adding another game

1. Insert a `game_award_games` row, its `game_award_metrics` (with rate limits from the game's own timings), and its definitions.
2. In the game, post `{type: "legitloot:game", version: 1, game, event, stats}` to `https://legitloot.site` after it receives `{type: "legitloot:portal", event: "ready"}`.
3. On its legitloot.site page, add the Awards button/drawer markup and `game-awards.js` + `game-awards-bridge.js` with `data-game`, `data-frame` and `data-origin`.

## Tests

- `tests/sql/game_awards.test.sql` — privileges, guest catalog, run rejection rules, delta counting, unlocks, issuance on/off, idempotent claim, daily cap and carry-over, missing ledger accounts, run limits, audit immutability, retired awards.
- `tests/game-awards.test.cjs` — message validation, catalog parsing, report ordering and failure handling.
- `.github/workflows/game-awards.yml` runs both, after the Earned Loot migrations and their own tests.

## Gates before going live

- Owner approves the LC amounts, caps and limits above.
- Earned Loot ledger migrations are applied first (this depends on `private.issue_game_lootcoins` and `private.game_lootcoin_issuance`).
- Players need LC ledger accounts (`private.create_player_ledger_accounts`); until then unlocks wait and nothing errors.
- Terms/wallet copy should mention that gameplay awards are checked and can be refused for implausible runs.

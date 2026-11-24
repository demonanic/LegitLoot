-- Game awards: Rocket 2 Nowhere (RXT2).
-- Uses the award system from 20261124090000_game_awards_milestones.sql.
-- LootCoin amounts are PROPOSED values for owner review; issuance stays off until approved.
--
-- Rates come from games/rocket-2-nowhere/index.html:
--   distance: speed ramps from 33 m/s to a 110 m/s cap (+15% thrust); a wormhole adds
--   500 m in 1.1 s and power-ups arrive every ~1.7 s at top speed (22% are wormholes).
--   A lucky run averages under ~250 m/s, so the cap is 300 m/s (18,000 m a minute)
--   measured from the start of the run on the server's clock.
--   Rock and close-call caps are well above what spawn spacing allows.
-- Runs are short (a few minutes), so more runs per day and a shorter maximum run length.

insert into private.game_award_games(game_slug, display_name, issuance_enabled, daily_lc_cap_atoms, max_runs_per_day, max_run_hours)
values ('rxt2', 'Rocket 2 Nowhere', false, 100 * 10000, 200, 2)
on conflict (game_slug) do nothing;

insert into private.game_award_metrics(game_slug, metric, label, aggregation, reported_by, max_per_run, min_seconds_per_unit, max_per_minute) values
  ('rxt2', 'distance', 'Best run (metres)', 'max', 'client', 2000000, null, 18000),
  ('rxt2', 'rocks_destroyed', 'Rocks destroyed', 'sum', 'client', 200000, null, 1200),
  ('rxt2', 'close_calls', 'Close calls', 'sum', 'client', 100000, null, 300),
  ('rxt2', 'runs_finished', 'Runs played', 'sum', 'server', 1, null, null)
on conflict (game_slug, metric) do nothing;

-- Distance thresholds by typical time survived: 1,000 m ≈ 25 s, 5,000 m ≈ 70 s,
-- 15,000 m ≈ 2.6 min, 30,000 m ≈ 5 min, 60,000 m ≈ 10 min.
insert into private.game_award_definitions(game_slug, award_key, title, description, source_type, metric, threshold, lc_amount_atoms, display_order) values
  ('rxt2', 'liftoff',          'Liftoff',          'Fly 1,000 m in one run.',                  'game_milestone', 'distance',         1000,  1 * 10000, 10),
  ('rxt2', 'escape-velocity',  'Escape Velocity',  'Fly 5,000 m in one run.',                  'game_milestone', 'distance',         5000,  2 * 10000, 20),
  ('rxt2', 'deep-void',        'Deep Void',        'Fly 15,000 m in one run.',                 'game_milestone', 'distance',        15000,  5 * 10000, 30),
  ('rxt2', 'nowhere-bound',    'Nowhere Bound',    'Fly 30,000 m in one run.',                 'game_milestone', 'distance',        30000, 10 * 10000, 40),
  ('rxt2', 'edge-of-nowhere',  'Edge of Nowhere',  'Fly 60,000 m in one run.',                 'game_milestone', 'distance',        60000, 20 * 10000, 50),
  ('rxt2', 'rock-breaker',     'Rock Breaker',     'Destroy 100 rocks across all runs.',       'achievement',    'rocks_destroyed',   100,  1 * 10000, 110),
  ('rxt2', 'asteroid-miner',   'Asteroid Miner',   'Destroy 1,000 rocks across all runs.',     'achievement',    'rocks_destroyed',  1000,  5 * 10000, 120),
  ('rxt2', 'belt-clearer',     'Belt Clearer',     'Destroy 5,000 rocks across all runs.',     'achievement',    'rocks_destroyed',  5000, 15 * 10000, 130),
  ('rxt2', 'daredevil',        'Daredevil',        'Pull off 50 close calls across all runs.', 'achievement',    'close_calls',        50,  2 * 10000, 210),
  ('rxt2', 'hairs-breadth',    'Hair''s Breadth',  'Pull off 500 close calls across all runs.','achievement',    'close_calls',       500, 10 * 10000, 220),
  ('rxt2', 'frequent-flyer',   'Frequent Flyer',   'Finish 25 runs.',                          'achievement',    'runs_finished',      25,  2 * 10000, 310)
on conflict (game_slug, award_key) do nothing;

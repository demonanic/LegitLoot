-- Game milestones and awards.
--
-- Decides WHEN a player has earned a gameplay LootCoins award and hands the
-- issuance to private.issue_game_lootcoins (20261123112120), which stays the
-- only path that posts LC. Nothing here touches Earned Loot, provider events,
-- cash, payouts or withdrawals.
--
-- Trust model (browser games): the client reports run stats; the server owns
-- the run clock, rejects implausible or decreasing stats, caps per-run values,
-- limits runs per day, makes every award one-time per player, caps LC per day,
-- and keeps an append-only audit of every report. This raises the cost of
-- cheating; it cannot make client-reported stats tamper-proof.
--
-- Issuance is OFF for every game until the owner sets
-- private.game_award_games.issuance_enabled = true. While off, awards still
-- unlock (so progress is never lost) and are issued later, oldest first,
-- within the daily cap, once issuance is enabled.

create table if not exists private.game_award_games (
  game_slug text primary key check (game_slug ~ '^[a-z0-9][a-z0-9-]{1,39}$'),
  display_name text not null,
  issuance_enabled boolean not null default false,
  daily_lc_cap_atoms bigint not null check (daily_lc_cap_atoms > 0),
  max_runs_per_day integer not null check (max_runs_per_day between 1 and 1000),
  max_run_hours integer not null check (max_run_hours between 1 and 48),
  min_report_seconds integer not null default 5 check (min_report_seconds between 0 and 600),
  max_reports_per_run integer not null default 2000 check (max_reports_per_run > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.game_award_metrics (
  game_slug text not null references private.game_award_games(game_slug) on delete restrict,
  metric text not null check (metric ~ '^[a-z][a-z0-9_]{1,39}$'),
  label text not null,
  -- 'max': the player's best single run. 'sum': lifetime total across runs.
  aggregation text not null check (aggregation in ('max','sum')),
  -- 'client': reported by the game. 'server': counted by the server only.
  reported_by text not null default 'client' check (reported_by in ('client','server')),
  max_per_run bigint not null check (max_per_run > 0),
  -- A run of N seconds may report at most floor(N / min_seconds_per_unit).
  min_seconds_per_unit numeric check (min_seconds_per_unit is null or min_seconds_per_unit > 0),
  -- A run of N seconds may report at most ceil(max_per_minute * N / 60).
  max_per_minute numeric check (max_per_minute is null or max_per_minute > 0),
  primary key (game_slug, metric)
);

create table if not exists private.game_award_definitions (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null references private.game_award_games(game_slug) on delete restrict,
  award_key text not null check (award_key ~ '^[a-z0-9][a-z0-9-]{1,59}$'),
  title text not null,
  description text not null,
  source_type text not null check (source_type in ('game_milestone','achievement','challenge')),
  metric text not null,
  threshold bigint not null check (threshold > 0),
  lc_amount_atoms bigint not null check (lc_amount_atoms > 0),
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (game_slug, award_key),
  foreign key (game_slug, metric) references private.game_award_metrics(game_slug, metric) on delete restrict,
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table if not exists private.game_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  game_slug text not null references private.game_award_games(game_slug) on delete restrict,
  client_version text check (client_version is null or length(client_version) <= 40),
  status text not null default 'open' check (status in ('open','finished','rejected','expired')),
  started_at timestamptz not null default now(),
  last_reported_at timestamptz,
  ended_at timestamptz,
  report_count integer not null default 0,
  reported jsonb not null default '{}'::jsonb,
  rejection_reason text
);
create index if not exists game_runs_user_started_idx on private.game_runs(user_id, game_slug, started_at desc);

-- Append-only audit of every stats report, accepted or not.
create table if not exists private.game_run_reports (
  id bigint generated always as identity primary key,
  run_id uuid not null references private.game_runs(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  stats jsonb not null,
  is_final boolean not null,
  accepted boolean not null,
  reason text,
  elapsed_seconds numeric not null,
  created_at timestamptz not null default now()
);
create index if not exists game_run_reports_run_idx on private.game_run_reports(run_id, id);

create table if not exists private.game_player_metrics (
  user_id uuid not null references auth.users(id) on delete restrict,
  game_slug text not null,
  metric text not null,
  value bigint not null default 0 check (value >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, game_slug, metric),
  foreign key (game_slug, metric) references private.game_award_metrics(game_slug, metric) on delete restrict
);

create table if not exists private.game_award_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  award_id uuid not null references private.game_award_definitions(id) on delete restrict,
  run_id uuid references private.game_runs(id) on delete restrict,
  unlocked_at timestamptz not null default now(),
  issuance_id uuid references private.game_lootcoin_issuance(id),
  issued_at timestamptz,
  unique (user_id, award_id),
  check ((issuance_id is null) = (issued_at is null))
);
create index if not exists game_award_unlocks_pending_idx
  on private.game_award_unlocks(user_id, unlocked_at) where issuance_id is null;

create or replace function private.reject_game_audit_mutation()
returns trigger language plpgsql set search_path = ''
as $fn$
begin
  raise exception 'Game run reports are append-only';
end;
$fn$;
drop trigger if exists game_run_reports_immutable on private.game_run_reports;
create trigger game_run_reports_immutable
  before update or delete on private.game_run_reports
  for each row execute function private.reject_game_audit_mutation();

-- An unlock may only move from pending to issued, once; it is never deleted or re-pointed.
create or replace function private.guard_game_award_unlock()
returns trigger language plpgsql set search_path = ''
as $fn$
begin
  if tg_op = 'DELETE' then
    raise exception 'Award unlocks cannot be deleted';
  end if;
  if new.user_id <> old.user_id or new.award_id <> old.award_id
    or new.run_id is distinct from old.run_id or new.unlocked_at <> old.unlocked_at then
    raise exception 'Award unlocks are immutable';
  end if;
  if old.issuance_id is not null and new.issuance_id is distinct from old.issuance_id then
    raise exception 'An issued award cannot be re-issued or un-issued';
  end if;
  return new;
end;
$fn$;
drop trigger if exists game_award_unlocks_guard on private.game_award_unlocks;
create trigger game_award_unlocks_guard
  before update or delete on private.game_award_unlocks
  for each row execute function private.guard_game_award_unlock();

-- Issue LootCoins for a player's pending unlocks in one game, oldest first,
-- within the game's daily cap. Serialised per player. Returns what was issued.
create or replace function private.issue_pending_game_awards(p_user_id uuid, p_game_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_game private.game_award_games%rowtype;
  v_issued_today bigint;
  v_day_start timestamptz := date_trunc('day', now() at time zone 'utc') at time zone 'utc';
  v_row record;
  v_issuance uuid;
  v_out jsonb := '[]'::jsonb;
begin
  select * into v_game from private.game_award_games where game_slug = p_game_slug;
  if not found or not v_game.issuance_enabled then
    return v_out;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('game-awards:' || p_user_id::text, 0));

  select coalesce(sum(d.lc_amount_atoms), 0) into v_issued_today
  from private.game_award_unlocks u
  join private.game_award_definitions d on d.id = u.award_id
  where u.user_id = p_user_id and d.game_slug = p_game_slug and u.issued_at >= v_day_start;

  for v_row in
    select u.id as unlock_id, d.award_key, d.title, d.source_type, d.lc_amount_atoms
    from private.game_award_unlocks u
    join private.game_award_definitions d on d.id = u.award_id
    where u.user_id = p_user_id and d.game_slug = p_game_slug and u.issuance_id is null
    order by u.unlocked_at, d.display_order, d.award_key
    for update of u
  loop
    exit when v_issued_today + v_row.lc_amount_atoms > v_game.daily_lc_cap_atoms;
    begin
      v_issuance := private.issue_game_lootcoins(
        p_user_id, v_row.source_type, 'game-award:' || v_row.unlock_id::text, v_row.lc_amount_atoms
      );
    exception when others then
      -- Ledger accounts missing or similar: leave this and later unlocks pending.
      exit;
    end;
    update private.game_award_unlocks
      set issuance_id = v_issuance, issued_at = now()
      where id = v_row.unlock_id;
    v_issued_today := v_issued_today + v_row.lc_amount_atoms;
    v_out := v_out || jsonb_build_array(jsonb_build_object(
      'awardKey', v_row.award_key, 'title', v_row.title, 'lootCoinAtoms', v_row.lc_amount_atoms));
  end loop;
  return v_out;
end;
$fn$;
revoke all on function private.issue_pending_game_awards(uuid,text) from public, anon, authenticated;
grant execute on function private.issue_pending_game_awards(uuid,text) to service_role;

create or replace function public.start_game_run(p_game_slug text, p_client_version text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_game private.game_award_games%rowtype;
  v_recent integer;
  v_run uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select * into v_game from private.game_award_games where game_slug = p_game_slug;
  if not found then raise exception 'Unknown game'; end if;
  if p_client_version is not null and (length(p_client_version) > 40 or p_client_version !~ '^[A-Za-z0-9._+-]+$') then
    raise exception 'Invalid client version';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('game-runs:' || v_user::text, 0));

  -- Starting a run closes any earlier open run of the same game: one live run per game.
  update private.game_runs
    set status = 'expired', ended_at = now(), rejection_reason = 'superseded by a new run'
    where user_id = v_user and game_slug = p_game_slug and status = 'open';

  select count(*) into v_recent from private.game_runs
  where user_id = v_user and game_slug = p_game_slug and started_at > now() - interval '24 hours';
  if v_recent >= v_game.max_runs_per_day then
    raise exception 'Daily run limit reached';
  end if;

  insert into private.game_runs(user_id, game_slug, client_version)
  values (v_user, p_game_slug, p_client_version)
  returning id into v_run;
  return v_run;
end;
$fn$;
revoke all on function public.start_game_run(text,text) from public, anon;
grant execute on function public.start_game_run(text,text) to authenticated;

-- Report a run's running totals (a checkpoint) or its final totals.
-- Totals are per run and must never decrease. Returns
-- {accepted, reason?, runStatus, unlocked:[...], issued:[...]}.
-- An implausible report rejects the run (recorded, not raised), and nothing
-- from that report counts.
create or replace function public.report_game_run(p_run_id uuid, p_stats jsonb, p_final boolean default false)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_run private.game_runs%rowtype;
  v_game private.game_award_games%rowtype;
  v_elapsed numeric;
  v_metric record;
  v_raw jsonb;
  v_new bigint;
  v_old bigint;
  v_limit bigint;
  v_reason text;
  v_merged jsonb;
  v_unlocked jsonb := '[]'::jsonb;
  v_issued jsonb;
  v_key text;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_run_id is null or p_stats is null or jsonb_typeof(p_stats) <> 'object' then
    raise exception 'Run id and a stats object are required';
  end if;
  if length(p_stats::text) > 4000 then raise exception 'Stats payload too large'; end if;

  select * into v_run from private.game_runs where id = p_run_id for update;
  if not found or v_run.user_id <> v_user then raise exception 'Run not found'; end if;
  select * into v_game from private.game_award_games where game_slug = v_run.game_slug;

  v_elapsed := extract(epoch from (now() - v_run.started_at));

  if v_run.status <> 'open' then
    return jsonb_build_object('accepted', false, 'reason', 'run is ' || v_run.status,
      'runStatus', v_run.status, 'unlocked', '[]'::jsonb, 'issued', '[]'::jsonb);
  end if;

  -- Checks that close the run without counting anything from this report.
  if v_elapsed > v_game.max_run_hours * 3600 then
    v_reason := 'run exceeded the maximum length';
  elsif v_run.report_count >= v_game.max_reports_per_run then
    v_reason := 'too many reports for one run';
  elsif not p_final and v_run.last_reported_at is not null
    and now() - v_run.last_reported_at < make_interval(secs => v_game.min_report_seconds) then
    -- Too soon for a checkpoint: ignore it, keep the run open, record nothing.
    return jsonb_build_object('accepted', false, 'reason', 'checkpoint too soon',
      'runStatus', 'open', 'unlocked', '[]'::jsonb, 'issued', '[]'::jsonb);
  end if;

  if v_reason is null then
    for v_key in select jsonb_object_keys(p_stats) loop
      if not exists (select 1 from private.game_award_metrics m
                     where m.game_slug = v_run.game_slug and m.metric = v_key and m.reported_by = 'client') then
        v_reason := 'unknown stat ' || left(v_key, 40);
        exit;
      end if;
    end loop;
  end if;

  v_merged := v_run.reported;
  if v_reason is null then
    for v_metric in
      select * from private.game_award_metrics
      where game_slug = v_run.game_slug and reported_by = 'client'
    loop
      v_raw := p_stats -> v_metric.metric;
      v_old := coalesce((v_run.reported ->> v_metric.metric)::bigint, 0);
      if v_raw is null then continue; end if;
      if jsonb_typeof(v_raw) <> 'number' or (v_raw #>> '{}') !~ '^[0-9]{1,12}$' then
        v_reason := v_metric.metric || ' must be a whole number';
        exit;
      end if;
      v_new := (v_raw #>> '{}')::bigint;
      if v_new < v_old then
        v_reason := v_metric.metric || ' went down';
        exit;
      end if;
      if v_new > v_metric.max_per_run then
        v_reason := v_metric.metric || ' above the per-run limit';
        exit;
      end if;
      if v_metric.min_seconds_per_unit is not null then
        v_limit := floor(v_elapsed / v_metric.min_seconds_per_unit);
        if v_new > v_limit then
          v_reason := v_metric.metric || ' too high for the time played';
          exit;
        end if;
      end if;
      if v_metric.max_per_minute is not null then
        v_limit := ceil(v_metric.max_per_minute * v_elapsed / 60.0);
        if v_new > v_limit then
          v_reason := v_metric.metric || ' too high for the time played';
          exit;
        end if;
      end if;
      v_merged := jsonb_set(v_merged, array[v_metric.metric], to_jsonb(v_new));
    end loop;
  end if;

  insert into private.game_run_reports(run_id, user_id, stats, is_final, accepted, reason, elapsed_seconds)
  values (v_run.id, v_user, p_stats, p_final, v_reason is null, v_reason, v_elapsed);

  if v_reason is not null then
    update private.game_runs
      set status = 'rejected', ended_at = now(), rejection_reason = v_reason,
          report_count = report_count + 1, last_reported_at = now()
      where id = v_run.id;
    return jsonb_build_object('accepted', false, 'reason', v_reason, 'runStatus', 'rejected',
      'unlocked', '[]'::jsonb, 'issued', '[]'::jsonb);
  end if;

  -- Apply: 'sum' metrics gain this report's increase, 'max' metrics keep the best run.
  for v_metric in
    select * from private.game_award_metrics where game_slug = v_run.game_slug and reported_by = 'client'
  loop
    v_new := coalesce((v_merged ->> v_metric.metric)::bigint, 0);
    v_old := coalesce((v_run.reported ->> v_metric.metric)::bigint, 0);
    if v_metric.aggregation = 'sum' then
      if v_new > v_old then
        insert into private.game_player_metrics(user_id, game_slug, metric, value)
        values (v_user, v_run.game_slug, v_metric.metric, v_new - v_old)
        on conflict (user_id, game_slug, metric)
        do update set value = private.game_player_metrics.value + excluded.value, updated_at = now();
      end if;
    elsif v_new > 0 then
      insert into private.game_player_metrics(user_id, game_slug, metric, value)
      values (v_user, v_run.game_slug, v_metric.metric, v_new)
      on conflict (user_id, game_slug, metric)
      do update set value = greatest(private.game_player_metrics.value, excluded.value), updated_at = now();
    end if;
  end loop;

  if p_final then
    insert into private.game_player_metrics(user_id, game_slug, metric, value)
    select v_user, v_run.game_slug, m.metric, 1
    from private.game_award_metrics m
    where m.game_slug = v_run.game_slug and m.metric = 'runs_finished' and m.reported_by = 'server'
    on conflict (user_id, game_slug, metric)
    do update set value = private.game_player_metrics.value + 1, updated_at = now();
  end if;

  update private.game_runs
    set reported = v_merged, report_count = report_count + 1, last_reported_at = now(),
        status = case when p_final then 'finished' else 'open' end,
        ended_at = case when p_final then now() else null end
    where id = v_run.id;

  -- Unlock every active award whose threshold the player has now reached.
  with reached as (
    insert into private.game_award_unlocks(user_id, award_id, run_id)
    select v_user, d.id, v_run.id
    from private.game_award_definitions d
    join private.game_player_metrics pm
      on pm.user_id = v_user and pm.game_slug = d.game_slug and pm.metric = d.metric
    where d.game_slug = v_run.game_slug and d.is_active
      and (d.starts_at is null or d.starts_at <= now())
      and (d.ends_at is null or d.ends_at > now())
      and pm.value >= d.threshold
    on conflict (user_id, award_id) do nothing
    returning award_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'awardKey', d.award_key, 'title', d.title, 'lootCoinAtoms', d.lc_amount_atoms)
      order by d.display_order, d.award_key), '[]'::jsonb)
  into v_unlocked
  from reached r join private.game_award_definitions d on d.id = r.award_id;

  v_issued := private.issue_pending_game_awards(v_user, v_run.game_slug);

  return jsonb_build_object('accepted', true,
    'runStatus', case when p_final then 'finished' else 'open' end,
    'unlocked', v_unlocked, 'issued', v_issued);
end;
$fn$;
revoke all on function public.report_game_run(uuid,jsonb,boolean) from public, anon;
grant execute on function public.report_game_run(uuid,jsonb,boolean) to authenticated;

-- Retry issuing a player's pending unlocks (e.g. after the daily cap resets).
create or replace function public.claim_game_awards(p_game_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from private.game_award_games where game_slug = p_game_slug) then
    raise exception 'Unknown game';
  end if;
  return jsonb_build_object('issued', private.issue_pending_game_awards(v_user, p_game_slug));
end;
$fn$;
revoke all on function public.claim_game_awards(text) from public, anon;
grant execute on function public.claim_game_awards(text) to authenticated;

-- Award catalog for a game, with the signed-in player's progress (none for guests).
create or replace function public.get_game_awards(p_game_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_game private.game_award_games%rowtype;
  v_awards jsonb;
  v_metrics jsonb;
begin
  select * into v_game from private.game_award_games where game_slug = p_game_slug;
  if not found then raise exception 'Unknown game'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'awardKey', d.award_key,
      'title', d.title,
      'description', d.description,
      'kind', d.source_type,
      'metric', d.metric,
      'threshold', d.threshold,
      'progress', least(coalesce(pm.value, 0), d.threshold),
      'lootCoinAtoms', d.lc_amount_atoms,
      'endsAt', d.ends_at,
      'status', case
        when u.issuance_id is not null then 'issued'
        when u.id is not null then 'unlocked'
        else 'locked' end,
      'unlockedAt', u.unlocked_at
    ) order by d.display_order, d.award_key), '[]'::jsonb)
  into v_awards
  from private.game_award_definitions d
  left join private.game_player_metrics pm
    on pm.user_id = v_user and pm.game_slug = d.game_slug and pm.metric = d.metric
  left join private.game_award_unlocks u on u.user_id = v_user and u.award_id = d.id
  where d.game_slug = p_game_slug
    and (u.id is not null or (d.is_active
      and (d.starts_at is null or d.starts_at <= now())
      and (d.ends_at is null or d.ends_at > now())));

  select coalesce(jsonb_object_agg(m.metric, jsonb_build_object(
      'label', m.label, 'aggregation', m.aggregation, 'value', coalesce(pm.value, 0))), '{}'::jsonb)
  into v_metrics
  from private.game_award_metrics m
  left join private.game_player_metrics pm
    on pm.user_id = v_user and pm.game_slug = m.game_slug and pm.metric = m.metric
  where m.game_slug = p_game_slug;

  return jsonb_build_object(
    'contractVersion', 1,
    'game', v_game.game_slug,
    'displayName', v_game.display_name,
    'signedIn', v_user is not null,
    'issuanceEnabled', v_game.issuance_enabled,
    'dailyCapAtoms', v_game.daily_lc_cap_atoms,
    'metrics', v_metrics,
    'awards', v_awards
  );
end;
$fn$;
revoke all on function public.get_game_awards(text) from public;
grant execute on function public.get_game_awards(text) to anon, authenticated;

-- Seed: Zombies vs Heavy Metal. LootCoin amounts are PROPOSED values for owner
-- review (LC has 10,000 atoms per LC). Issuance stays disabled until approved.
-- Rates come from the game's config: a wave cannot be cleared in under ~36 s of
-- assault (30 s used here for slack); bosses arrive every fifth wave (two from wave 20), so 60 s per boss is a safe floor.
insert into private.game_award_games(game_slug, display_name, issuance_enabled, daily_lc_cap_atoms, max_runs_per_day, max_run_hours)
values ('zvhm', 'Zombies vs Heavy Metal', false, 100 * 10000, 60, 6)
on conflict (game_slug) do nothing;

insert into private.game_award_metrics(game_slug, metric, label, aggregation, reported_by, max_per_run, min_seconds_per_unit, max_per_minute) values
  ('zvhm', 'waves_cleared', 'Best run (waves cleared)', 'max', 'client', 200, 30, null),
  ('zvhm', 'kills', 'Zombies killed', 'sum', 'client', 200000, null, 600),
  ('zvhm', 'bosses_killed', 'Bosses killed', 'sum', 'client', 200, 60, null),
  ('zvhm', 'runs_finished', 'Runs played', 'sum', 'server', 1, null, null)
on conflict (game_slug, metric) do nothing;

insert into private.game_award_definitions(game_slug, award_key, title, description, source_type, metric, threshold, lc_amount_atoms, display_order) values
  ('zvhm', 'first-stand',     'First Stand',       'Clear your first wave.',                    'game_milestone', 'waves_cleared',    1,    1 * 10000, 10),
  ('zvhm', 'wave-5',          'Holding the Line',  'Clear 5 waves in one run.',                 'game_milestone', 'waves_cleared',    5,    2 * 10000, 20),
  ('zvhm', 'wave-10',         'Fortified',         'Clear 10 waves in one run.',                'game_milestone', 'waves_cleared',   10,    5 * 10000, 30),
  ('zvhm', 'wave-15',         'Iron Curtain',      'Clear 15 waves in one run.',                'game_milestone', 'waves_cleared',   15,   10 * 10000, 40),
  ('zvhm', 'wave-20',         'Heavy Metal',       'Clear 20 waves in one run.',                'game_milestone', 'waves_cleared',   20,   20 * 10000, 50),
  ('zvhm', 'wave-25',         'Last Band Standing','Clear 25 waves in one run.',                'game_milestone', 'waves_cleared',   25,   40 * 10000, 60),
  ('zvhm', 'kills-500',       'Pest Control',      'Kill 500 zombies across all runs.',         'achievement',    'kills',          500,    2 * 10000, 110),
  ('zvhm', 'kills-5000',      'Body Count',        'Kill 5,000 zombies across all runs.',       'achievement',    'kills',         5000,   10 * 10000, 120),
  ('zvhm', 'kills-25000',     'Extinction Event',  'Kill 25,000 zombies across all runs.',      'achievement',    'kills',        25000,   30 * 10000, 130),
  ('zvhm', 'boss-1',          'Giant Slayer',      'Kill a boss.',                              'achievement',    'bosses_killed',    1,    3 * 10000, 210),
  ('zvhm', 'boss-10',         'Boss Rush',         'Kill 10 bosses across all runs.',           'achievement',    'bosses_killed',   10,   10 * 10000, 220),
  ('zvhm', 'runs-10',         'Regular',           'Finish 10 runs.',                           'achievement',    'runs_finished',   10,    2 * 10000, 310)
on conflict (game_slug, award_key) do nothing;

revoke all on all tables in schema private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema private to service_role;
grant usage, select on all sequences in schema private to service_role;

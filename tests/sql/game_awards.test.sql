-- Game milestones and awards: run sessions, plausibility, unlocks and LC issuance.
-- Runs against the disposable test database after all migrations are applied.
begin;

do $test$
declare
  v_player uuid := gen_random_uuid();
  v_other uuid := gen_random_uuid();
  v_noledger uuid := gen_random_uuid();
  v_run uuid;
  v_run2 uuid;
  v_res jsonb;
  v_cat jsonb;
  v_failed boolean;
  v_count integer;
  v_value bigint;
begin
  insert into auth.users(id,email) values
    (v_player,'gamer@test.invalid'),(v_other,'other@test.invalid'),(v_noledger,'noledger@test.invalid');
  perform private.create_player_ledger_accounts(v_player);
  perform private.create_player_ledger_accounts(v_other);

  -- Privileges: clients can never call the issuer; guests cannot start runs.
  if has_function_privilege('authenticated','private.issue_pending_game_awards(uuid,text)','execute')
    or has_function_privilege('authenticated','private.issue_game_lootcoins(uuid,text,text,bigint)','execute') then
    raise exception 'Clients can execute gameplay LC issuance';
  end if;
  if has_function_privilege('anon','public.start_game_run(text,text)','execute')
    or has_function_privilege('anon','public.report_game_run(uuid,jsonb,boolean)','execute')
    or has_function_privilege('anon','public.claim_game_awards(text)','execute') then
    raise exception 'Guests can start or report runs';
  end if;
  if not has_function_privilege('anon','public.get_game_awards(text)','execute') then
    raise exception 'Guests cannot read the award catalog';
  end if;
  if has_table_privilege('authenticated','private.game_award_unlocks','select')
    or has_table_privilege('authenticated','private.game_player_metrics','insert') then
    raise exception 'Clients can touch award tables directly';
  end if;

  -- Guest catalog: no progress, issuance off by default.
  perform set_config('request.jwt.claim.sub','',true);
  v_cat := public.get_game_awards('zvhm');
  if (v_cat->>'signedIn')::boolean or (v_cat->>'issuanceEnabled')::boolean
    or jsonb_array_length(v_cat->'awards') <> 12 then
    raise exception 'Guest catalog wrong: %', v_cat;
  end if;
  v_failed := false;
  begin perform public.start_game_run('zvhm'); exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Guest started a run'; end if;

  perform set_config('request.jwt.claim.sub',v_player::text,true);

  v_failed := false;
  begin perform public.start_game_run('not-a-game'); exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Unknown game accepted'; end if;

  -- Too fast: one wave cleared 10 seconds into a run is rejected and nothing counts.
  v_run := public.start_game_run('zvhm','0.1.0');
  update private.game_runs set started_at = now() - interval '10 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":1,"kills":20}'::jsonb,false);
  if (v_res->>'accepted')::boolean or v_res->>'runStatus' <> 'rejected' then
    raise exception 'Implausibly fast wave accepted: %', v_res;
  end if;
  if exists (select 1 from private.game_player_metrics where user_id = v_player) then
    raise exception 'Rejected report changed player metrics';
  end if;
  v_res := public.report_game_run(v_run,'{"waves_cleared":0}'::jsonb,true);
  if (v_res->>'accepted')::boolean then raise exception 'Rejected run accepted a later report'; end if;

  -- A plausible run: checkpoint, then final. Issuance is off, so awards unlock but no LC moves.
  v_run := public.start_game_run('zvhm','0.1.0');
  update private.game_runs set started_at = now() - interval '200 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":2,"kills":100,"bosses_killed":0}'::jsonb,false);
  if not (v_res->>'accepted')::boolean or jsonb_array_length(v_res->'unlocked') <> 1
    or v_res#>>'{unlocked,0,awardKey}' <> 'first-stand' or jsonb_array_length(v_res->'issued') <> 0 then
    raise exception 'First checkpoint wrong: %', v_res;
  end if;

  -- A checkpoint straight after another is ignored, not recorded, and keeps the run open.
  select count(*) into v_count from private.game_run_reports where run_id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":2,"kills":110}'::jsonb,false);
  if (v_res->>'accepted')::boolean or v_res->>'runStatus' <> 'open'
    or (select count(*) from private.game_run_reports where run_id = v_run) <> v_count then
    raise exception 'Rapid checkpoint not throttled: %', v_res;
  end if;

  update private.game_runs set started_at = now() - interval '400 seconds', last_reported_at = now() - interval '1 minute' where id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":5,"kills":300,"bosses_killed":1}'::jsonb,true);
  if not (v_res->>'accepted')::boolean or v_res->>'runStatus' <> 'finished'
    or jsonb_array_length(v_res->'unlocked') <> 2 or jsonb_array_length(v_res->'issued') <> 0 then
    raise exception 'Final report wrong: %', v_res;
  end if;
  -- Sum metrics count each run's increase once: 100 then 300 is 300, not 400.
  select value into v_value from private.game_player_metrics where user_id = v_player and metric = 'kills';
  if v_value <> 300 then raise exception 'Kills double counted: %', v_value; end if;
  select value into v_value from private.game_player_metrics where user_id = v_player and metric = 'runs_finished';
  if v_value <> 1 then raise exception 'runs_finished not counted: %', v_value; end if;
  if (public.get_player_wallet_summary()#>>'{lootCoins,availableAtoms}') <> '0' then
    raise exception 'LC issued while issuance disabled';
  end if;
  v_cat := public.get_game_awards('zvhm');
  select count(*) into v_count from jsonb_array_elements(v_cat->'awards') a where a->>'status' = 'unlocked';
  if v_count <> 3 or not (v_cat->>'signedIn')::boolean then
    raise exception 'Catalog does not show 3 unlocked awards: %', v_cat;
  end if;

  -- Finished runs take no more reports.
  v_res := public.report_game_run(v_run,'{"waves_cleared":9}'::jsonb,true);
  if (v_res->>'accepted')::boolean then raise exception 'Finished run accepted a report'; end if;

  -- Owner enables issuance; claiming issues all three (1 + 2 + 3 LC), once.
  update private.game_award_games set issuance_enabled = true where game_slug = 'zvhm';
  v_res := public.claim_game_awards('zvhm');
  if jsonb_array_length(v_res->'issued') <> 3 then raise exception 'Claim did not issue 3: %', v_res; end if;
  if (public.get_player_wallet_summary()#>>'{lootCoins,availableAtoms}') <> '60000' then
    raise exception 'Wrong LC balance after claim: %', public.get_player_wallet_summary();
  end if;
  v_res := public.claim_game_awards('zvhm');
  if jsonb_array_length(v_res->'issued') <> 0 then raise exception 'Claim was not idempotent'; end if;
  if (select count(*) from private.game_lootcoin_issuance where user_id = v_player) <> 3
    or exists (select 1 from private.game_lootcoin_issuance where user_id = v_player and source_type not in ('game_milestone','achievement')) then
    raise exception 'Issuance records wrong';
  end if;

  -- Bad payloads reject the run: decreasing, unknown, server-only, fractional, negative, string.
  v_run := public.start_game_run('zvhm');
  update private.game_runs set started_at = now() - interval '300 seconds' where id = v_run;
  perform public.report_game_run(v_run,'{"kills":50}'::jsonb,false);
  update private.game_runs set last_reported_at = now() - interval '1 minute' where id = v_run;
  v_res := public.report_game_run(v_run,'{"kills":40}'::jsonb,false);
  if (v_res->>'accepted')::boolean or v_res->>'reason' <> 'kills went down' then
    raise exception 'Decreasing stat accepted: %', v_res;
  end if;
  select value into v_value from private.game_player_metrics where user_id = v_player and metric = 'kills';
  if v_value <> 350 then raise exception 'Kills after rejected run wrong: %', v_value; end if;

  declare
    v_bad jsonb;
  begin
    foreach v_bad in array array[
      '{"gold":5}'::jsonb, '{"runs_finished":5}'::jsonb, '{"kills":1.5}'::jsonb,
      '{"kills":-1}'::jsonb, '{"kills":"10"}'::jsonb, '{"waves_cleared":500}'::jsonb,
      '{"bosses_killed":9}'::jsonb, '{"kills":9999}'::jsonb
    ] loop
      v_run := public.start_game_run('zvhm');
      update private.game_runs set started_at = now() - interval '300 seconds' where id = v_run;
      v_res := public.report_game_run(v_run, v_bad, true);
      if (v_res->>'accepted')::boolean or v_res->>'runStatus' <> 'rejected' then
        raise exception 'Bad payload % accepted: %', v_bad, v_res;
      end if;
    end loop;
  end;
  v_failed := false;
  begin perform public.report_game_run(v_run,'[1]'::jsonb,false); exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Non-object stats accepted'; end if;

  -- Runs that overstay their window are rejected.
  v_run := public.start_game_run('zvhm');
  update private.game_runs set started_at = now() - interval '7 hours' where id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":3}'::jsonb,true);
  if (v_res->>'accepted')::boolean then raise exception 'Overlong run accepted'; end if;

  -- Starting a run supersedes an open one.
  v_run := public.start_game_run('zvhm');
  v_run2 := public.start_game_run('zvhm');
  if (select status from private.game_runs where id = v_run) <> 'expired' then
    raise exception 'Earlier open run was not superseded';
  end if;

  -- Someone else's run is not found.
  perform set_config('request.jwt.claim.sub',v_other::text,true);
  v_failed := false;
  begin perform public.report_game_run(v_run2,'{"kills":1}'::jsonb,false); exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Reported on another player''s run'; end if;

  -- Daily cap: with a 6 LC cap, wave-5 (2) and wave-10 (5) unlock together after
  -- first-stand (1): 1 + 2 fit, 5 waits for tomorrow.
  update private.game_award_games set daily_lc_cap_atoms = 6 * 10000 where game_slug = 'zvhm';
  v_run := public.start_game_run('zvhm');
  update private.game_runs set started_at = now() - interval '600 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":10,"kills":200}'::jsonb,true);
  if jsonb_array_length(v_res->'unlocked') <> 3 or jsonb_array_length(v_res->'issued') <> 2 then
    raise exception 'Daily cap not applied: %', v_res;
  end if;
  if (public.get_player_wallet_summary()#>>'{lootCoins,availableAtoms}') <> '30000' then
    raise exception 'Wrong LC under cap';
  end if;
  -- Next day the pending award is issued.
  update private.game_award_unlocks set issued_at = issued_at - interval '1 day'
    where user_id = v_other and issued_at is not null;
  v_res := public.claim_game_awards('zvhm');
  if jsonb_array_length(v_res->'issued') <> 1 or v_res#>>'{issued,0,awardKey}' <> 'wave-10' then
    raise exception 'Pending award not issued after cap reset: %', v_res;
  end if;

  -- No ledger accounts: unlocks wait, nothing errors.
  perform set_config('request.jwt.claim.sub',v_noledger::text,true);
  v_run := public.start_game_run('zvhm');
  update private.game_runs set started_at = now() - interval '100 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"waves_cleared":1}'::jsonb,true);
  if not (v_res->>'accepted')::boolean or jsonb_array_length(v_res->'unlocked') <> 1
    or jsonb_array_length(v_res->'issued') <> 0 then
    raise exception 'Missing ledger accounts not handled: %', v_res;
  end if;

  -- Run limit per day.
  update private.game_award_games set max_runs_per_day = 2 where game_slug = 'zvhm';
  perform public.start_game_run('zvhm');
  v_failed := false;
  begin perform public.start_game_run('zvhm'); exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Daily run limit not enforced'; end if;

  -- Audit trail and unlocks are protected.
  v_failed := false;
  begin update private.game_run_reports set accepted = true; exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Run reports are mutable'; end if;
  v_failed := false;
  begin delete from private.game_award_unlocks where user_id = v_player; exception when others then v_failed := true; end;
  if not v_failed then raise exception 'Unlocks can be deleted'; end if;
  v_failed := false;
  begin
    update private.game_award_unlocks set issuance_id = null, issued_at = null
    where user_id = v_player and issuance_id is not null;
  exception when others then v_failed := true;
  end;
  if not v_failed then raise exception 'Issued unlock was un-issued'; end if;

  -- A retired award stays visible to players who earned it, hidden from others.
  update private.game_award_definitions set is_active = false where award_key = 'first-stand';
  perform set_config('request.jwt.claim.sub',v_player::text,true);
  if not exists (select 1 from jsonb_array_elements(public.get_game_awards('zvhm')->'awards') a where a->>'awardKey' = 'first-stand') then
    raise exception 'Earned retired award hidden from its owner';
  end if;
  perform set_config('request.jwt.claim.sub','',true);
  if exists (select 1 from jsonb_array_elements(public.get_game_awards('zvhm')->'awards') a where a->>'awardKey' = 'first-stand') then
    raise exception 'Retired award shown to guests';
  end if;

  -- Rocket 2 Nowhere: its own catalog, limits and stats, separate from Z.V.H.M.
  perform set_config('request.jwt.claim.sub','',true);
  v_cat := public.get_game_awards('rxt2');
  if v_cat->>'displayName' <> 'Rocket 2 Nowhere' or jsonb_array_length(v_cat->'awards') <> 11
    or (v_cat->>'issuanceEnabled')::boolean then
    raise exception 'RXT2 catalog wrong: %', v_cat;
  end if;
  perform set_config('request.jwt.claim.sub',v_player::text,true);
  -- 60 s of play allows up to 18,000 m; 20,000 m is too fast.
  v_run := public.start_game_run('rxt2','1');
  update private.game_runs set started_at = now() - interval '60 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"distance":20000,"rocks_destroyed":10}'::jsonb,true);
  if (v_res->>'accepted')::boolean or v_res->>'reason' <> 'distance too high for the time played' then
    raise exception 'RXT2 distance speed limit not applied: %', v_res;
  end if;
  -- Z.V.H.M. stat names are not accepted for RXT2.
  v_run := public.start_game_run('rxt2','1');
  update private.game_runs set started_at = now() - interval '60 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"kills":5}'::jsonb,true);
  if (v_res->>'accepted')::boolean then raise exception 'RXT2 accepted a Z.V.H.M. stat'; end if;
  -- A plausible 90 s run: 5,200 m, 120 rocks, 12 close calls.
  v_run := public.start_game_run('rxt2','1');
  update private.game_runs set started_at = now() - interval '90 seconds' where id = v_run;
  v_res := public.report_game_run(v_run,'{"distance":5200,"rocks_destroyed":120,"close_calls":12}'::jsonb,true);
  if not (v_res->>'accepted')::boolean then raise exception 'Plausible RXT2 run rejected: %', v_res; end if;
  select array_agg(x->>'awardKey' order by x->>'awardKey') is distinct from array['escape-velocity','liftoff','rock-breaker']
    into v_failed from jsonb_array_elements(v_res->'unlocked') x;
  if v_failed then raise exception 'RXT2 unlocks wrong: %', v_res; end if;
  -- Issuance is still off for RXT2 even though Z.V.H.M. is on.
  if jsonb_array_length(v_res->'issued') <> 0 then raise exception 'RXT2 issued while disabled'; end if;
  if (select value from private.game_player_metrics where user_id = v_player and game_slug = 'zvhm' and metric = 'kills') <> 350 then
    raise exception 'RXT2 run changed Z.V.H.M. stats';
  end if;

  raise notice 'Game award integration tests passed';
end;
$test$;

rollback;

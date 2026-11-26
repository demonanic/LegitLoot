-- Step 2 prerequisite: extend wallet_kind in its own migration.
-- Keep legacy enum values unchanged; new labels are not used in this file.
-- This must commit before any later migration creates accounts/functions using these labels.

alter type private.wallet_kind add value if not exists 'earned_loot';
alter type private.wallet_kind add value if not exists 'loot_coins';

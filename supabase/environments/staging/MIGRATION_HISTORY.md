# Staging applied migration history — 2026-11-19

Project ref: `scmnxcsggquwtuyyjnnj`

Source: read-only Supabase `list_migrations` inventory. This is the database's applied version/name ledger, not the original migration SQL.

```json[
  {
    "version": "20261109020116",
    "name": "initial_legitloot_platform_schema"
  },
  {
    "version": "20261109020133",
    "name": "enable_rls_private_financial_tables"
  },
  {
    "version": "20261109020137",
    "name": "secure_wallet_summary_rpc"
  },
  {
    "version": "20261109020142",
    "name": "payout_destination_foundation"
  },
  {
    "version": "20261109040346",
    "name": "server_controlled_admin_authorization"
  },
  {
    "version": "20261109040433",
    "name": "standard_lootcoins_wallet"
  },
  {
    "version": "20261109050922",
    "name": "align_wallet_summary_response_with_staging_frontend"
  },
  {
    "version": "20261109052301",
    "name": "add_service_role_owner_provision_rpc_wrapper"
  },
  {
    "version": "20261109052610",
    "name": "support_current_service_role_claim_format_for_owner_bootstrap"
  },
  {
    "version": "20261109053132",
    "name": "add_service_role_admin_dashboard_payload"
  },
  {
    "version": "20261109060818",
    "name": "isolated_payout_simulator"
  },
  {
    "version": "20261109085543",
    "name": "simulator_player_targeting"
  },
  {
    "version": "20261109094834",
    "name": "simulator_minimum_withdrawal_ten_dollars"
  },
  {
    "version": "20261109100008",
    "name": "offerwall_gg_callback_pipeline"
  },
  {
    "version": "20261109100011",
    "name": "secure_offerwall_callback_tables"
  },
  {
    "version": "20261110062421",
    "name": "add_cpagrip_attribution_foundation"
  },
  {
    "version": "20261110062429",
    "name": "add_cpagrip_attribution_storage_rpc"
  },
  {
    "version": "20261111192436",
    "name": "offerwall_gg_revenue_metadata"
  },
  {
    "version": "20261111192441",
    "name": "offerwall_gg_metadata_recorder"
  },
  {
    "version": "20261118080655",
    "name": "game_platform_foundation"
  },
  {
    "version": "20261119145340",
    "name": "offerwall_gg_record_only"
  }
]
```

The original SQL for `game_platform_foundation` was not returned by the migration-history API and was not found in the inspected GitHub branches. See `../schema-snapshot/README.md`. Do not reconstruct or replay it as if it were the original migration.

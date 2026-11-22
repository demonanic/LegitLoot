// LegitLoot earning-hub provider registry.
//
// This file only DESCRIBES providers for display. It never tracks, attributes,
// verifies or credits anything. Tracking, attribution, provider callbacks and
// any server-side processing live in Supabase. Provider callbacks must never
// award Legit Coins (docs/PLATFORM_BUILD_SPEC.md §0.1).
//
// To add a provider (offerwall, survey network, CPA network or direct offer),
// add one entry to `providers`. Rules:
//   - `state` must be one of the keys in `states`; anything else renders as
//     "unavailable" and can never be opened.
//   - Only a provider whose state is "active" AND that has a `launch` block
//     can be opened. Changing a state to "active" is an owner-approved release
//     step: it requires provider approval plus provider signature, transaction identity, reversal,
//     duplicate/retry and reconciliation tests. Provider events never post LC.
//   - `launch.functionName` must be a server function that returns an
//     account-bound URL; the browser only opens it after checking its origin.
//   - Never put provider secrets, offer lists, payout amounts or reward rates here.
(() => {
  const states = Object.freeze({
    active: Object.freeze({
      label: "Active",
      mark: "●",
      canOpen: true,
      detail: "Open to signed-in players. Partner offers do not award Legit Coins."
    }),
    testing: Object.freeze({
      label: "Testing · not open",
      mark: "◐",
      canOpen: false,
      detail: "Integration is being tested on our staging system. Not open to players."
    }),
    pending_approval: Object.freeze({
      label: "Pending approval",
      mark: "◔",
      canOpen: false,
      detail: "Waiting on the provider's publisher approval. Unavailable until approved and verified."
    }),
    suspended: Object.freeze({
      label: "Suspended",
      mark: "■",
      canOpen: false,
      detail: "Temporarily switched off. Nothing can be opened or earned here while suspended."
    }),
    unavailable: Object.freeze({
      label: "Unavailable",
      mark: "○",
      canOpen: false,
      detail: "Not connected."
    })
  });

  const categories = Object.freeze({
    offerwall: "Offerwalls",
    survey: "Surveys",
    cpa: "CPA offers",
    direct: "Direct offers"
  });

  const providers = Object.freeze([
    Object.freeze({
      id: "taplayad",
      kind: "provider",
      name: "Taplayad",
      symbol: "◈",
      categories: Object.freeze(["offerwall"]),
      kicker: "Offerwall",
      description: "Planned initial Hustle partner. Offers and eligibility are set by the provider and will only be shown once the integration is approved and verified. Partner offers do not award Legit Coins.",
      state: "pending_approval",
      stateDetail: "Not open. Waiting on written provider confirmation and our own verification. Nothing can be opened or earned here yet.",
      // Recorded wall template (owner-supplied, App 10066). Descriptive only: never opened or
      // fetched by the browser. No launch endpoint until incentivized-traffic permission, the
      // exact wall URL, signature coverage, transaction identity, reversal linkage and
      // retry/duplicate behavior are confirmed in writing and verified server-side.
      recordedTemplate: "https://offerwall.tplayad.com/10066/{user_id}",
      launch: null
    }),
    Object.freeze({
      id: "tapresearch",
      kind: "provider",
      name: "TapResearch",
      symbol: "▤",
      categories: Object.freeze(["survey"]),
      kicker: "Surveys",
      description: "Third-party survey provider. Survey availability and rewards are decided by TapResearch; screen-outs and disqualifications earn nothing. Surveys do not award Legit Coins.",
      state: "pending_approval",
      stateDetail: "Paused: TapResearch advised LegitLoot to revisit publisher approval after reaching its audience threshold. Not open to players; no survey activity or rewards are available.",
      // Server function tapresearch-eligibility exists (staging only). No launch block until
      // TapResearch "Go Live", owner approval and verified rewards handling are complete.
      launch: null
    }),
    Object.freeze({
      id: "surveys",
      kind: "category",
      name: "Surveys",
      symbol: "▤",
      categories: Object.freeze(["survey"]),
      kicker: "Category",
      description: "Opinion and research activities, only from providers that allow our traffic and reward model. Screen-outs and disqualifications earn nothing.",
      state: "unavailable",
      stateDetail: "No survey provider is connected.",
      launch: null
    }),
    Object.freeze({
      id: "direct-offers",
      kind: "category",
      name: "Direct offers",
      symbol: "▣",
      categories: Object.freeze(["direct"]),
      kicker: "Category",
      description: "Offers arranged directly with a partner rather than through a network. Each one is listed only with its own written terms.",
      state: "unavailable",
      stateDetail: "No direct offers are listed.",
      launch: null
    })
  ]);

  window.LEGITLOOT_EARN_REGISTRY = Object.freeze({ states, categories, providers });
})();

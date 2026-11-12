// LegitLoot earning-hub provider registry.
//
// This file only DESCRIBES providers for display. It never tracks, attributes,
// verifies or credits anything. Tracking, attribution, provider callbacks and
// LootCoin issuance live server-side (Supabase Edge Functions + ledger RPCs).
//
// To add a provider (offerwall, survey network, CPA network or direct offer),
// add one entry to `providers`. Rules:
//   - `state` must be one of the keys in `states`; anything else renders as
//     "unavailable" and can never be opened.
//   - Only a provider whose state is "active" AND that has a `launch` block
//     can be opened. Changing a state to "active" is an owner-approved release
//     step: it requires provider approval, verified callbacks and ledger tests.
//   - `launch.functionName` must be a server function that returns an
//     account-bound URL; the browser only opens it after checking its origin.
//   - Never put provider secrets, offer lists, payout amounts or reward rates here.
(() => {
  const states = Object.freeze({
    active: Object.freeze({
      label: "Active",
      mark: "●",
      canOpen: true,
      detail: "Open to signed-in players. LootCoins are credited only by our server after the provider confirms a completion."
    }),
    testing: Object.freeze({
      label: "Testing · not open",
      mark: "◐",
      canOpen: false,
      detail: "Integration is being tested on our staging system. Not open to players, and it issues no LootCoins."
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
      id: "offerwall-gg",
      kind: "provider",
      name: "Offerwall.GG",
      symbol: "◈",
      categories: Object.freeze(["offerwall"]),
      kicker: "Offerwall",
      description: "Third-party offerwall. Offers, eligibility and LootCoin amounts are set by the provider and will only be shown once the integration is approved and verified.",
      state: "pending_approval",
      stateDetail: "Publisher approval is pending. The wall stays unavailable until approval, server secrets, callback verification and ledger tests are complete.",
      launch: Object.freeze({
        type: "server-wall-url",
        functionName: "offerwall-gg-wall-url",
        allowedOrigins: Object.freeze(["https://offerwall.gg"]),
        pathPrefix: "/wall/"
      })
    }),
    Object.freeze({
      id: "cpagrip",
      kind: "provider",
      name: "CPAGrip",
      symbol: "◆",
      categories: Object.freeze(["offerwall", "cpa"]),
      kicker: "Offerwall · CPA network",
      description: "Third-party CPA network offerwall. Offers, eligibility and LootCoin amounts are set by the provider and will only be shown once the integration is verified.",
      state: "testing",
      stateDetail: "The callback receiver is being built and tested on our staging system. Not open to players, and no LootCoins are issued from it.",
      // No launch endpoint until the server-side wall-link function is built and verified.
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

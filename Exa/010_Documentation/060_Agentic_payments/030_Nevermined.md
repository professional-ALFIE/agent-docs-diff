> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Nevermined

> Autonomous agent payments for Exa via Nevermined x402 card delegation. A 7 USD purchase provisions or tops up an Exa API key with 7 USD of credits.

Agents pay Exa with a credit card via [Nevermined](https://nevermined.ai)'s [x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation) scheme. Each **\$7 purchase** returns an Exa API key with **\$7 of Exa credits**.

<Info>
  Use this Nevermined plan ID:<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />This plan runs on Nevermined's live environment (live-prefixed API keys). The purchase is for API credits, not for a single search request.
</Info>

For a first-time Nevermined payer, `POST /team-management/nevermined/purchase-key` provisions a new Exa API key and adds \$7 of credits. If the key runs out, mint a fresh x402 token with the same delegation and call the same endpoint again. Exa returns the same API key with another \$7 of credits added.

## Buy a key

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **Cost:** \$7 per purchase, charged to the card behind the delegation referenced by the x402 token.
* **Response (new payer):** `{ status: "ok", apiKey: "…", expiresAt: null }` — a new Exa API key with \$7 of credits.
* **Response (returning payer):** `{ status: "ok", apiKey: "…", expiresAt: null }` — the same Exa API key with \$7 more credits.
* **Response (replayed token):** cached result, no new charge.
* **Missing/invalid signature:** `402 Payment Required` with payment requirements in the body.

## How it works

The payment side is handled by Nevermined; Exa only sees the signed x402 token.

1. **One-time setup (by the card owner):** enroll a card at [nevermined.app](https://nevermined.app), create a **delegation** on it (the spending permission: the owner sets a limit and duration, and can scope it to a specific API key), and issue a Nevermined API key for the agent.
2. **The agent finds its delegation.** The Nevermined SDK lets the agent discover the delegations its key can spend from and pick one with enough remaining budget (at least \$7). If none exists, the owner creates one in the dashboard, or a fully autonomous agent can create one through the SDK within the card's limits.
3. **The agent mints an x402 access token** for the plan ID above, on the card-delegation scheme, referencing the delegation by ID. Delegations must exist before minting; tokens cannot create them on the fly.
4. **The agent POSTs the token to the endpoint above** in the `payment-signature` header and receives the Exa API key from the response.
5. **The key works immediately** against the standard [Exa Search API](/docs/reference/search-api-guide).

For the complete agent-ready walkthrough (SDK methods, parameters, delegation discovery and creation, troubleshooting), follow Nevermined's Exa integration guide: [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agents: fetch [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)).

## What \$7 buys

Credits are consumed at standard Exa API pricing. At current rates, \$7 of credits covers roughly:

| Endpoint or feature                                      |                              Price |   Approximate usage |
| -------------------------------------------------------- | ---------------------------------: | ------------------: |
| Search (`instant`, `fast`, `auto`) with up to 10 results |               \$7 / 1,000 requests |      1,000 requests |
| Deep-Lite Search                                         |              \$10 / 1,000 requests |        700 requests |
| Deep Search                                              |              \$12 / 1,000 requests |      \~583 requests |
| Deep-Reasoning Search                                    |              \$15 / 1,000 requests |      \~466 requests |
| Contents (`text`, `highlights`, or `summary`)            | \$1 / 1,000 pages per content type |         7,000 pages |
| AI page summaries on Search or Contents                  |                  \$1 / 1,000 pages |     7,000 summaries |
| Additional results beyond the first 10                   |                \$1 / 1,000 results | 7,000 extra results |
| Answer                                                   |               \$5 / 1,000 requests |      1,400 requests |
| Monitors                                                 |              \$15 / 1,000 requests |      \~466 requests |

Search requests include text and highlights for up to 10 results. Extra results beyond 10 and AI summaries are billed separately.<br />
For full pricing details, see [Exa pricing](https://exa.ai/pricing).

## When the key runs out

Exa returns **`HTTP 402`** on the regular API endpoints once the API key's credits are exhausted:

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

Mint a fresh x402 token with the same plan ID and delegation, then POST it again to the same `/purchase-key` endpoint. Exa adds another \$7 of credits to the same API key.

## References

* [Nevermined Exa integration guide](https://nevermined.ai/docs/integrations/exa)
* [x402 card-delegation spec](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Exa pricing](https://exa.ai/pricing)
* [Exa Search API](/docs/reference/search-api-guide)

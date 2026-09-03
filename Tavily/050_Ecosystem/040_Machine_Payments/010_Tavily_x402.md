> 원본: https://docs.tavily.com/documentation/machine-payments/x402.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Tavily x402

> AI agents pay per request for Tavily Advanced Search in USDC on Base — no API key, no account, no human in the loop.

## Overview

Tavily exposes `POST /search` over the [x402](https://x402.org) protocol so an AI agent can call it without an API key. The agent sends a request, gets back HTTP `402` with the price, signs a USDC transfer authorization, and retries. Tavily returns the search results in the same response that settles the payment.

When the agent's USDC settles on Base, Tavily captures the payment and releases the result. Refunds for upstream failures are issued back to the agent's wallet automatically.

<CardGroup cols={2}>
  <Card title="Tavily x402 endpoint" icon="globe" href="https://x402.tavily.com">
    `https://x402.tavily.com`
  </Card>

  <Card title="Machine-readable pricing" icon="file-lines" href="https://x402.tavily.com/.well-known/pricing">
    `GET /.well-known/pricing` — current pricing as JSON
  </Card>
</CardGroup>

## How a paid request works

<Steps>
  <Step title="Agent → Tavily">
    Agent sends `POST /search` with the search query.
  </Step>

  <Step title="Tavily → Agent">
    Tavily replies `402` with the `PAYMENT-REQUIRED` header.
  </Step>

  <Step title="Agent">
    Decodes the envelope and signs an EIP-3009 USDC transfer authorization.
  </Step>

  <Step title="Agent → Tavily">
    Retries `POST /search` with the signed `PAYMENT-SIGNATURE` header.
  </Step>

  <Step title="Tavily">
    Verifies + settles on Base, then gets search results.
  </Step>

  <Step title="Tavily → Agent">
    Returns `200` with the search results and a `PAYMENT-RESPONSE` header carrying the on-chain receipt.
  </Step>
</Steps>

The `PAYMENT-REQUIRED` response header is base64-encoded JSON. Standard x402 client libraries decode it for you; you only need to handle it manually if you're using your own client. Probe the endpoint to see the raw header:

```bash theme={null}
curl -i -X POST https://x402.tavily.com/search \
  -H 'content-type: application/json' \
  -d '{"query": "Who is Leo Messi?"}'
```

Once decoded (e.g. `base64 -d | jq`), the envelope carries a single `accepts` entry:

```json theme={null}
{
  "x402Version": 2,
  "error": "Payment header is required",
  "resource": {
    "url": "https://x402.tavily.com/search",
    "description": "Tavily Search - advanced mode",
    "mimeType": "application/json"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "amount": "10000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0x…deposit-address",
      "maxTimeoutSeconds": 60,
      "extra": {
        "name": "USD Coin",
        "version": "2",
        "tier": "advanced",
        "terms": "By using the Tavily solution, you agree to be bound by the Terms of Use (https://tavily.com/terms) and Privacy Policy (https://tavily.com/privacy) and accept that Tavily disclaims any liability with regard to the AI agent and cryptocurrency payments."
      }
    }
  ]
}
```

`amount` is in USDC atomic units (6 decimals). `"10000"` = \$0.01.

## Pricing

| Endpoint       | Tier       | Price         |
| -------------- | ---------- | ------------- |
| `POST /search` | `advanced` | \$0.01 / call |

Standard Tavily [search params](/documentation/api-reference/endpoint/search) (`query`, `topic`, `max_results`, `time_range`, `include_domains`, etc.) pass through unchanged; `search_depth` is always `advanced`.

## Network and asset

| Network      | Chain ID      | Asset | Contract                                     |
| ------------ | ------------- | ----- | -------------------------------------------- |
| Base mainnet | `eip155:8453` | USDC  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

The agent must sign for the **exact** atomic amount in `amount`. The on-chain transfer has to match — under-deposits don't settle.

## Client integration

Any x402 v2 client works. The wire protocol is what matters; you don't need a Tavily-specific SDK.

<CodeGroup>
  ```bash awal CLI theme={null}
  npx -y awal x402 pay https://x402.tavily.com/search \
    -X POST \
    -d '{"query":"Who is Leo Messi?"}' \
    --json
  ```

  ```python Python theme={null}
  # pip install 'x402[requests,evm]'
  import os, requests
  from eth_account import Account
  from x402 import x402ClientSync
  from x402.mechanisms.evm.exact import ExactEvmScheme
  from x402.mechanisms.evm.signers import EthAccountSigner
  from x402.http.clients.requests import x402_requests

  account = Account.from_key(os.environ["AGENT_WALLET_KEY"])
  signer = EthAccountSigner(account)

  client = x402ClientSync()
  client.register("eip155:8453", ExactEvmScheme(signer=signer))

  session = x402_requests(client)
  res = session.post(
      "https://x402.tavily.com/search",
      json={"query": "Who is Leo Messi?"},
  )
  print(res.json())
  ```

  ```ts JavaScript / TypeScript theme={null}
  import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
  import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";
  import { createPublicClient, http } from "viem";
  import { base } from "viem/chains";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.AGENT_WALLET_KEY as `0x${string}`);
  const publicClient = createPublicClient({ chain: base, transport: http() });
  const signer = toClientEvmSigner(account, publicClient as any);
  const client = new x402Client().register("eip155:8453", new ExactEvmScheme(signer));
  const paidFetch = wrapFetchWithPayment(fetch, client);

  const res = await paidFetch("https://x402.tavily.com/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: "Who is Leo Messi?" }),
  });
  console.log(await res.json());
  ```
</CodeGroup>

The client wrapper handles the discovery → sign → retry handshake. From the agent's point of view it's a single `fetch` that costs USDC.

## Response

A successful paid call returns `200` with the standard Tavily search response body plus a `PAYMENT-RESPONSE` header carrying the on-chain settlement tx hash:

```json theme={null}
{
  "query": "Who is Leo Messi?",
  "follow_up_questions": null,
  "answer": null,
  "images": [],
  "results": [
    {
      "title": "Lionel Messi Facts | Britannica",
      "url": "https://www.britannica.com/facts/Lionel-Messi",
      "content": "Lionel Messi, an Argentine footballer, is widely regarded as one of the greatest football players of his generation. Born in 1987, Messi spent the majority of his career playing for Barcelona, where he won numerous domestic league titles and UEFA Champions League titles. Messi is known for his exceptional dribbling skills, vision, and goal",
      "score": 0.81025416,
      "raw_content": null,
      "id": "a3f9c2-00"
    }
  ],
  "response_time": 1.5,
  "request_id": "<uuid>"
}
```

`answer`, `follow_up_questions`, `images`, and `auto_parameters` are populated only when the caller opts in (`include_answer`, `include_images`, `auto_parameters` in the request body). The minimal-request shape is what's shown above.

Decode the `PAYMENT-RESPONSE` header to get the receipt:

```json theme={null}
{
  "success": true,
  "payer": "0x…agent-wallet",
  "transaction": "0x…base-mainnet-tx-hash",
  "network": "eip155:8453"
}
```

## Refunds

If the upstream Tavily call fails after the payment has settled, Tavily issues a refund automatically. The refund returns USDC to the wallet that originated the deposit, joined to the original payment via the EIP-3009 `nonce`. No action from the agent is required.

<Warning>
  Refunds route to the wallet that signed the deposit authorization. If the agent paid from an exchange or custodial wallet, the refund lands there. Use a self-custodied wallet for production agents.
</Warning>

## Terms

By using this endpoint you agree to the [Terms of Use](https://tavily.com/terms) and [Privacy Policy](https://tavily.com/privacy). Tavily disclaims any liability with regard to AI agent behavior and cryptocurrency payments. The same language is surfaced inside the `402` envelope under `extra.terms`.

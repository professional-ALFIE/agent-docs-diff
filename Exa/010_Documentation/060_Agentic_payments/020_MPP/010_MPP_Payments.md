> 원본: https://exa.ai/docs/reference/mpp-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Pay with MPP (Tempo)

> Call Exa's Search and Contents APIs without an API key by paying per request with USDC.e on Tempo.

## What is MPP?

MPP (Machine Payments Protocol) is an open, HTTP-native payment standard built on the `402 Payment Required` status code. It lets clients pay for API access per-request using multiple payment methods, including stablecoins on [Tempo](https://tempo.xyz), with no accounts, API keys, or subscriptions needed. The examples on this page use Tempo; Exa currently settles MPP payments in USDC.e on Tempo mainnet.

Exa supports MPP on two endpoints: **`/search`** and **`/contents`**. When you send a request without an API key or payment credential, Exa responds with `402` and a `WWW-Authenticate: Payment` challenge describing the price and how to pay. Your client signs a payment, retries the request with an `Authorization: Payment` credential, and receives the results once the payment settles on-chain.

This is ideal for **AI agents** that need to autonomously pay for web search without pre-provisioned credentials.

<Info>
  MPP and API key access are independent. If your request includes an `x-api-key` header, the normal API key billing flow is used and MPP is bypassed entirely.
</Info>

## Supported endpoints

| Endpoint    | Method | Description                                                                                         |
| ----------- | ------ | --------------------------------------------------------------------------------------------------- |
| `/search`   | POST   | Web search with all search types (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST   | Content retrieval by URL or document ID                                                             |

Other Exa endpoints do not accept MPP payments *yet*.

## Get started

You need a Tempo-compatible wallet funded with USDC.e. Export your wallet's private key before running an example:

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

### Install the client

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

### Make a paid search request

Use the MPP client to sign and submit a payment for a search request:

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={"query": "best machine learning frameworks", "numResults": 5},
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

A successful run prints the search results and the `Payment-Receipt` header containing the on-chain transaction hash.

## Pay from the command line

If you prefer not to manage a raw private key, use the Tempo Wallet CLI instead. `tempo wallet login` creates or connects a Tempo wallet, authorizes a local access key, and can include free MPP Credits for new sign-ups.

### Install and authenticate

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

On a remote host without a local browser, use `tempo wallet login --no-browser` and open the printed URL on your device to authorize the CLI.

### Check balances and credits

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

### Make a paid request

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request` intercepts the `402 Payment Required` challenge, pays, and retries automatically.

For full CLI reference, see the [Tempo Wallet CLI docs](https://tempo.xyz/developers/docs/cli/wallet) and [`tempo request` docs](https://tempo.xyz/developers/docs/cli/request).

## Gas fees

Exa sponsors the Tempo network fee and pays it in USDC.e. Your wallet only needs enough USDC.e for the API charge; it does not need pathUSD or another gas-token balance. You do not configure a fee payer. Exa's payment challenge and the MPP SDK handle sponsorship automatically.

## Pricing

MPP uses the same bundled pricing as API key billing. Exa calculates the price from the request parameters before processing the request.

### Search

| Search type               | Price for up to 10 results |
| ------------------------- | -------------------------- |
| `instant`, `auto`, `fast` | \$0.007 per request        |
| `deep-lite`, `deep`       | \$0.012 per request        |
| `deep-reasoning`          | \$0.015 per request        |

Adding `contents.summary` costs another **\$0.001 per result**.

<Warning>
  MPP search requests are capped at 10 results. If `numResults` is greater than 10, Exa uses 10 and prices the request for 10 results. If you need more, use [API key billing](/docs/reference/search-api-guide).
</Warning>

### Contents

Each requested content type costs \$0.001 per URL:

| Content type | Price per URL |
| ------------ | ------------- |
| `text`       | \$0.001       |
| `highlights` | \$0.001       |
| `summary`    | \$0.001       |

If you do not request `text`, `highlights`, or `summary`, Exa enables `text` by default.

### Pricing examples

| Request                                         | Price   |
| ----------------------------------------------- | ------- |
| `/search` with `type: "auto"`                   | \$0.007 |
| `/search` with 3 results and `contents.summary` | \$0.010 |
| `/search` with `type: "deep"`                   | \$0.012 |
| `/contents` for 2 URLs with `text: true`        | \$0.002 |
| `/contents` for 1 URL with `text` and `summary` | \$0.002 |

## How the payment flow works

The SDK automates this flow, but you can inspect it directly over HTTP:

1. Send a request without an API key or payment credential. Exa returns `402` with a `WWW-Authenticate: Payment` challenge containing the price, token, recipient, network, and sponsorship details.
2. Sign the challenge and retry with `Authorization: Payment <credential>`.
3. Exa processes the request while settling the payment. After settlement confirms, Exa returns the results with a `Payment-Receipt` header. If settlement fails, Exa returns `402` with a fresh challenge and no results.

### Inspect a payment challenge

You can inspect the price and payment details without a wallet:

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

Look for the `WWW-Authenticate: Payment` header in the `402` response. Unpaid discovery requests are rate-limited, so use this for debugging rather than polling.

## Payment reference

Exa accepts MPP payments in USDC.e on Tempo mainnet.

| Network       | Identifier    | Token  | Asset                                        |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

USDC.e has 6 decimals. The challenge expresses prices in atomic units, so `7000` is \$0.007 and `1000000` is \$1.00.

<Note>
  Exa supports MPP and [x402](/docs/reference/x402-guide) on the same endpoints. An unauthenticated `402` response can include both the MPP `WWW-Authenticate: Payment` challenge and the x402 `PAYMENT-REQUIRED` header. Use the headers for the payment protocol your client supports.
</Note>

### Headers

| Header                                | Direction           | Description                                                 |
| ------------------------------------- | ------------------- | ----------------------------------------------------------- |
| `Authorization: Payment <credential>` | Request             | MPP payment credential                                      |
| `WWW-Authenticate: Payment`           | `402` response      | Price and payment instructions for the request              |
| `Payment-Receipt`                     | Successful response | Settlement receipt, including the on-chain transaction hash |

### Errors

| Status | Description                                                                           |
| ------ | ------------------------------------------------------------------------------------- |
| `402`  | The payment credential is missing or invalid; the response includes a fresh challenge |
| `402`  | The payment amount does not match the request price, or settlement failed             |
| `429`  | This IP sent too many unpaid discovery requests                                       |
| `429`  | This wallet exceeded the paid-request rate limit                                      |

### Rate limits

MPP rate limits are shared with x402 and are separate from API key limits:

| Limit                            | Threshold   | Window     |
| -------------------------------- | ----------- | ---------- |
| Unpaid discovery requests per IP | 5 requests  | 60 seconds |
| Paid requests per wallet         | 10 requests | 1 second   |

## FAQ

<AccordionGroup>
  <Accordion title="Can I use MPP and an API key together?">
    If your request includes an `x-api-key` header, the API key flow takes priority and MPP is bypassed. They don't stack. It's one or the other per request.
  </Accordion>

  <Accordion title="What happens if settlement fails after my request was processed?">
    Your response is blocked. You receive a `402` with a fresh `WWW-Authenticate: Payment` challenge so your client can retry. No results are returned until settlement succeeds.
  </Accordion>

  <Accordion title="Which wallets are supported?">
    Any Tempo-compatible EVM wallet the client SDK can sign with — a `viem` account with `mppx` (TypeScript), or an `eth-account` key with `pympp` (Python). For AI agents, use a wallet with a USDC.e balance on Tempo to cover request prices.
  </Accordion>
</AccordionGroup>

## Resources

* [MPP protocol docs](https://mpp.dev/protocol): protocol details and authentication format
* [mppx documentation](https://mpp.dev/sdk/typescript): MPP TypeScript SDK reference
* [pympp documentation](https://mpp.dev/sdk/python): MPP Python SDK reference
* [Tempo](https://tempo.xyz): Tempo network documentation
* [Pay with x402](/docs/reference/x402-guide): pay for the same endpoints with x402
* [Exa Search API guide](/docs/reference/search-api-guide): full search parameter reference
* [Exa Contents API guide](/docs/reference/contents-api-guide): full contents parameter reference

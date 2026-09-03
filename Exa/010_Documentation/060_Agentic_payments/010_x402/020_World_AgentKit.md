> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# World AgentKit

> Let verified human-backed AI agents access Exa for free using World AgentKit — no USDC needed.

## What is AgentKit?

[World AgentKit](https://docs.world.org/agents/agent-kit) is a toolkit that lets AI agents prove they are backed by a real, verified human via [World ID](https://world.org). When integrated with [x402](/docs/reference/x402-guide), it enables a **free trial** path: agents registered in World's [AgentBook](https://docs.world.org/agents/agent-kit/integrate) can access Exa's `/search` and `/contents` endpoints without paying USDC.

This works alongside the standard x402 payment flow. Each verified human gets **100 free requests per month** across all agents they back. Once exhausted, the agent falls back to the normal USDC payment path. Counters reset at the start of each calendar month (UTC).

<Info>
  AgentKit free trial and x402 payment are both bypassed if your request includes an `x-api-key` or `Authorization: Bearer` header. The normal API key billing flow takes priority.
</Info>

## How it works

When a client hits `/search` or `/contents` without an API key, Exa responds with `402 Payment Required`. The response includes an `agentkit` extension in the `PAYMENT-REQUIRED` header containing a [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum) challenge.

The agent signs this challenge with its registered wallet, and Exa verifies:

1. **Signature check** — validates the SIWE signature against the wallet address (supports both EOA via EIP-191 and smart contract wallets via ERC-1271)
2. **AgentBook lookup** — resolves the wallet to an anonymous `humanId` via the AgentBook contract on World Chain (`eip155:480`), confirming a unique verified human delegated their identity to this agent
3. **Usage check** — if the human still has free trial uses remaining, access is granted; otherwise, falls back to requiring USDC payment

## Quickstart

### 1. Register your agent in AgentBook

This is a one-time setup. You need the [World App](https://world.org/download) with a verified identity.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

The CLI triggers a World App verification flow, then submits a registration transaction on World Chain. Once complete, any server using AgentKit can look up your wallet and confirm it is backed by a real person.

### 2. Send a request (get the challenge)

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

The `402` response includes an `agentkit` extension inside the decoded `PAYMENT-REQUIRED` payload:

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

### 3. Sign the challenge and resubmit

Construct a [SIWE message](https://eips.ethereum.org/EIPS/eip-4361) from the `info` fields (domain, uri, nonce, statement, etc.), sign it with your registered agent wallet using one of the `supportedChains` types, and send it in the `agentkit` header (base64-encoded JSON):

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

If the agent is verified and has free trial uses remaining, Exa returns `200` with search results — no payment needed.

### Using the AgentKit x402 skill

Instead of implementing the challenge-response flow manually, add the [agentkit-x402 skill](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) to your AI agent:

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

This skill automatically handles the full flow when the agent encounters a `402` response with an AgentKit extension.

## Free trial details

* Each verified human gets **100 free requests per month** across all agents they back
* Usage counters reset at the start of each calendar month (UTC)
* Usage is tracked per human per endpoint (`/search` and `/contents` are counted separately)
* Two agents backed by the same human share the same counter
* Once free trial uses are exhausted for the month, the agent falls back to the standard [x402 payment flow](/docs/reference/x402-guide)
* The same [10-result cap](/docs/reference/x402-guide#pricing) applies to free trial requests on `/search`
* The free trial counter is not currently exposed in the API response — when uses are exhausted, the server responds with a standard `402` without granting free access

## Supported endpoints

| Endpoint    | x402 Payment | AgentKit Free Trial |
| ----------- | :----------: | :-----------------: |
| `/search`   |      Yes     |         Yes         |
| `/contents` |      Yes     |         Yes         |

All other Exa endpoints are not supported via x402 or AgentKit free trial.

## Network details

| Property               | Value                                               |
| ---------------------- | --------------------------------------------------- |
| AgentBook chain        | World Chain                                         |
| Chain ID (CAIP-2)      | `eip155:480`                                        |
| Verification           | AgentBook contract on World Chain                   |
| Supported wallet types | EOA (EIP-191) and smart contract wallets (ERC-1271) |

## FAQ

<AccordionGroup>
  <Accordion title="Can I use both x402 payment and AgentKit?">
    Yes. The `PAYMENT-REQUIRED` response includes both payment pricing and the AgentKit challenge. Your client can choose either path. If free trial uses are exhausted, the agent can fall back to paying with USDC.
  </Accordion>

  <Accordion title="What happens if my agent isn't registered in AgentBook?">
    The AgentKit verification fails silently and the request is treated as a standard `402` — your agent can still pay with USDC via the normal x402 flow.
  </Accordion>

  <Accordion title="Do two agents backed by the same human get separate free trial quotas?">
    No. Usage is tracked per human (via the anonymous `humanId` from AgentBook), not per wallet. Two agents backed by the same World ID share the same counter.
  </Accordion>

  <Accordion title="Which blockchain networks are involved?">
    Standard x402 USDC payments can settle on **Base** (`eip155:8453`) or **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`). AgentKit verification uses **World Chain** (`eip155:480`) for AgentBook lookups. These are independent — AgentKit doesn't require any on-chain payment.
  </Accordion>

  <Accordion title="What wallet types are supported?">
    Both EOA (externally owned accounts) using EIP-191 signatures and smart contract wallets (e.g. Coinbase Smart Wallet, Safe) using ERC-1271. See the [World AgentKit SDK reference](https://docs.world.org/agents/agent-kit/sdk-reference) for details.
  </Accordion>
</AccordionGroup>

## Resources

* [x402 payment guide](/docs/reference/x402-guide): standard USDC payment flow
* [World AgentKit docs](https://docs.world.org/agents/agent-kit): full AgentKit documentation
* [World AgentKit integration guide](https://docs.world.org/agents/agent-kit/integrate): AgentBook registration
* [World AgentKit SDK reference](https://docs.world.org/agents/agent-kit/sdk-reference): SDK API reference
* [AgentKit x402 skill](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): pre-built skill for AI agents
* [x402 protocol docs](https://docs.x402.org): full x402 specification

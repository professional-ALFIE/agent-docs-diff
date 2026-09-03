> 원본: https://exa.ai/docs/reference/agent-api/connect/polymarket.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Polymarket

> Get prediction-market odds, price history, order books, and trader positions.

[Polymarket](https://polymarket.com) is a prediction-market platform where
market prices represent the crowd's implied probability of real-world
outcomes. Exa Connect provides read-only access to Polymarket's public market
data.

## Use it for

* Finding prediction markets and current market-implied odds for a topic.
* Comparing how the implied probability of an outcome changed over time.
* Inspecting market liquidity, bid/ask depth, and top position holders.
* Reviewing a trader's current positions and recent on-chain activity.

## Provider ID

Use this value in `dataSources`:

```text theme={null}
polymarket
```

## Pricing

Polymarket's read APIs are unauthenticated and free, so Polymarket tool calls
cost nothing: you pay only the standard
[Agent run pricing](/docs/reference/agent-api/overview#limits-and-pricing).

## Data available

| Data                | Description                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| Markets and events  | Current prediction markets and events, with implied-probability prices, volume, and liquidity.     |
| Price history       | How an outcome's implied probability moved over time.                                              |
| Order books         | Live bid/ask depth and spread for a market outcome.                                                |
| Holders and traders | Top position holders for a market, plus a trader's current positions and recent on-chain activity. |

## Example

Get the market-implied odds of a Fed rate cut and how they moved over the past month.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "What are the current market-implied odds of a Fed rate cut at the "
          "next FOMC meeting, and how have they moved over the past month?"
      ),
      data_sources=[{"provider": "polymarket"}],
      output_schema={
          "type": "object",
          "required": ["market", "currentProbability", "trend"],
          "properties": {
              "market": {"type": "string", "description": "the market question"},
              "currentProbability": {"type": "number", "description": "between 0 and 1"},
              "trend": {"type": "string", "description": "how the implied probability moved over the past month"},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
    dataSources: [{ provider: "polymarket" }],
    outputSchema: {
      type: "object",
      required: ["market", "currentProbability", "trend"],
      properties: {
        market: { type: "string", description: "the market question" },
        currentProbability: { type: "number", description: "between 0 and 1" },
        trend: { type: "string", description: "how the implied probability moved over the past month" },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
      "dataSources": [{ "provider": "polymarket" }],
      "outputSchema": {
        "type": "object",
        "required": ["market", "currentProbability", "trend"],
        "properties": {
          "market": { "type": "string", "description": "the market question" },
          "currentProbability": { "type": "number", "description": "between 0 and 1" },
          "trend": { "type": "string", "description": "how the implied probability moved over the past month" }
        }
      }
    }' | jq
  ```
</CodeGroup>

## Pairs well with

* [Exa web search](/docs/reference/search-api-guide): add reporting and background context to market odds.
* [Particle](/docs/reference/agent-api/connect/particle): pull the news coverage behind a move in the odds.
* [Financial Datasets](/docs/reference/agent-api/connect/financialdatasets): connect market-implied odds to prices, fundamentals, and macro data.

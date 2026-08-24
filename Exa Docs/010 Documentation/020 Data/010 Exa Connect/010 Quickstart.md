> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Exa Connect

> Give your Exa Agent live access to premium data partners, alongside Exa web search, in a single run.

Exa Connect integrates premium data partners into the Exa Agent loop. Attach a
provider to a run, and the Exa Agent queries that partner's database alongside web
search before combining the results into one grounded, structured answer.

New to agent runs? Start with the [Exa Agent guide](/docs/reference/agent-api-guide),
then come back to attach data partners.

<Tip>
  Prefer MCP? Exa Agent and [Exa Connect](/docs/reference/agent-api/connect/overview) are available in [Exa MCP](/docs/reference/exa-mcp#exa-agent). Enable `tools=agent_run` to run multi-step research, list-building, enrichment, and structured output from Claude, Cursor, and other MCP clients.
</Tip>

## Why Exa Connect

* **Premium data without separate integrations.** Access partner data without
  signing contracts or wiring up an SDK. You call one Exa API.
* **Exa handles the plumbing.** We manage provider authentication, tool selection,
  retries, and result ranking.
* **The Exa Agent chooses the source.** When your `outputSchema` asks for
  "monthly visits from Similarweb" or "verified officers," the Exa Agent calls the
  matching partner tool instead of guessing from a web page.
* **Web and partner data in one run.** Connect complements Exa web search. The
  Exa Agent uses each source where it is strongest and cites the results.

## How it works

1. **Attach** one or more providers via the `dataSources` array on
   [`POST /agent/runs`](/docs/reference/agent-api/create-a-run).
2. The Exa Agent **selects the right tool** for each step based on your query and
   `outputSchema`: partner data or Exa web search.
3. Partner results are **fused with web research** into your structured output,
   with sources attached.

## Pricing

<Note>
  Exa Connect pricing is additive with standard [Agent run pricing](/docs/reference/agent-api/overview#limits-and-pricing).
  You pay the usual Agent compute and search costs, plus the provider call charge for each Exa Connect tool call.
</Note>

| Provider                                                    | Price                                         |
| ----------------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/docs/reference/agent-api/connect/fiber#pricing)      | `$0.02 / credit`                              |
| Similarweb                                                  | `$0.03 / call`                                |
| [Baselayer](/docs/reference/agent-api/connect/baselayer#pricing) | `$0.10 – $4.00 / order (varies by operation)` |
| Affiliate.com                                               | `$0.015 / call`                               |
| Particle                                                    | `$0.015 / call`                               |
| Financial Datasets                                          | `$0.01 / call`                                |
| Jinko                                                       | `$0.005 / call`                               |

Fiber.ai bills in credits rather than per call, because its own charge varies by
call: a search costs 2 credits plus 1 per result returned, a company or person
lookup is billed per candidate returned (so raising a company lookup's
`numResults` to disambiguate an ambiguous name costs more), and a contact
reveal 2–5 credits depending on whether you ask for work email, personal email,
or phone. You are charged the credits Fiber reports for each call; calls that
return no match are free. See [Fiber.ai pricing](/docs/reference/agent-api/connect/fiber#pricing).

Baselayer bills per order, and the rate depends on the operation: a KYB
business search is \$1.00, a UCC lien search is \$2.00 per state searched, a
litigation/bankruptcy docket search is \$1.00 per category, watchlist screening
is \$0.10–\$0.25 per list requested, industry classification and website
analysis are \$0.35 each, web presence is the sum of the selected analyses
(\$0.15–\$0.35 each), and an international business search is \$4.00. Follow-up
reads of a prior business search (business lookup, officers, registrations,
officer reverse lookup) are free. See [Baselayer pricing](/docs/reference/agent-api/connect/baselayer#pricing).

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }' | jq
  ```
</CodeGroup>

## Data partners

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/fiber.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=63a7aab5fd6e954ca0391387c9d61cda" href="/docs/reference/agent-api/connect/fiber" width="400" height="400" data-path="images/connect/fiber.svg">
      **GTM & recruiting.** B2B database of companies and people for lead discovery
      and contact research.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/similarweb.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=e0aa89da140e7a1c4f24418136f6549a" href="/docs/reference/agent-api/connect/similarweb" width="400" height="371" data-path="images/connect/similarweb.svg">
      **Web analytics.** Traffic estimates, global rankings, and competitor
      discovery for any domain.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/baselayer.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=f74500a7ac081c852e32f44b1a22350a" href="/docs/reference/agent-api/connect/baselayer" width="400" height="247" data-path="images/connect/baselayer.svg">
      **Compliance & KYB.** Verify US businesses: officers, registrations, and risk
      signals.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/affiliatecom.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=c488bec107ff7747e1fedf87b989b352" href="/docs/reference/agent-api/connect/affiliatecom" width="400" height="400" data-path="images/connect/affiliatecom.svg">
      **Commerce.** Product catalog search with pricing, brands, and merchant links.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/particle.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=29bc816925a17c7fae53880228443030" href="/docs/reference/agent-api/connect/particle" width="400" height="400" data-path="images/connect/particle.svg">
      **Media intelligence.** Search podcast transcripts with speaker attribution
      and timestamps.
    </Card>

    <Card title="Financial Datasets" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/financialdatasets.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=e4feb395588ca83efb8ac3822737156b" href="/docs/reference/agent-api/connect/financialdatasets" width="401" height="400" data-path="images/connect/financialdatasets.svg">
      **Finance.** Prices, fundamentals, earnings, SEC filings, ownership, and
      stock screening for 27,000+ U.S. tickers.
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/vc1Uh8_sSaqT3DeY/images/connect/jinko.svg?fit=max&auto=format&n=vc1Uh8_sSaqT3DeY&q=85&s=7fc6b4cd3691d1fd0eb7e583ebe3994a" href="/docs/reference/agent-api/connect/jinko" width="400" height="395" data-path="images/connect/jinko.svg">
      **Travel.** Flight and Hotel search with real-time pricing.
    </Card>
  </Columns>
</div>

Need a source that isn't listed above? See our [Additional providers](/docs/reference/agent-api/connect/additional-partners), which are available upon request by contacting our team.

## Usage

### Combining providers

Attach as many partners as your task needs. The Exa Agent calls each one where it is
strongest and blends the results with web search into a single structured answer:

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

For a full walkthrough, including how to shape your query and `outputSchema` so every
partner fires, see [Combining providers](/docs/reference/agent-api/connect/combining-providers).

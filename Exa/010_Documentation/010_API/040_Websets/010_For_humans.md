> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Websets

> Find anything on the web, no matter how complex. Websets searches, verifies, and enriches results automatically.

<div className="callout-box not-prose">
  <p className="callout-title">Just want working code?</p>

  <p className="callout-body">
    Skip to the [Websets coding agent reference](/docs/websets/api-guide-for-coding-agents) — a
    self-contained page your agent can read to integrate Websets.
  </p>
</div>

## What Are Websets?

Websets finds exactly what you need on the web — even when it's complex. Give it a query like "agtech companies in the US that raised Series A" and it will search, verify each result against your criteria, and enrich every match with additional data you specify. Results arrive as structured, verified items you can export or pipe into your workflow.

You can also build websets visually in the [Dashboard](/docs/websets/dashboard/get-started), no code
required.

<Info>
  Websets is useful when you need verification, enrichments, or asynchronous collection across
  many items. If you're just getting started with Exa, consider starting with
  [Search](/docs/reference/search-api-guide).
</Info>

## How It Works

1. **You define a search** — a natural language query, how many results you want, and optionally criteria to verify against and enrichments to extract.
2. **Websets searches and verifies** — it uses Exa's search engine to find candidates, then verifies each one against your criteria. Only matching results become items.
3. **Enrichments run automatically** — for each verified item, Websets searches the web to find the additional data you requested (CEO name, funding amount, contact info, etc.).
4. **Results arrive over time** — Websets is asynchronous. Poll for status, use webhooks for real-time updates, or just check the dashboard.

## Key Capabilities

| Feature                   | What It Does                                                                      |
| ------------------------- | --------------------------------------------------------------------------------- |
| **Criteria verification** | Each result is checked against rules you define, so you only get relevant matches |
| **Enrichments**           | Extract specific data points (text, numbers, dates, booleans) for every result    |
| **Monitors**              | Schedule recurring searches to keep your webset updated automatically             |
| **Webhooks**              | Get real-time HTTP callbacks as items are added or enriched                       |
| **Imports**               | Bring your own URLs and run enrichments on them                                   |

## Human Quickstart

Get your API key from the [Exa Dashboard](https://dashboard.exa.ai/api-keys).

Install the SDK:

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

Then make your first request:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Wait until Webset completes processing
  webset = exa.websets.wait_until_idle(webset.id)

  # Retrieve Webset Items
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }' | jq
  ```
</CodeGroup>

<Note>
  Websets is not currently ZDR. If you require ZDR, [reach out to us](mailto:sales@exa.ai).
</Note>

## Next

* [**Dashboard Guide**](./dashboard/get-started) - Step-by-step guide to using Websets in the dashboard
* [**How It Works**](./api/how-it-works) - Deep dive into the event-driven architecture
* [**Websets API Reference**](./api/websets/create-a-webset) - Full API reference for all endpoints
* [**FAQ**](./faq) - Common questions about Websets

> 원본: https://exa.ai/docs/reference/monitors-api-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Monitors

> Schedule recurring Exa searches and get results delivered to your webhook.

<div className="callout-box not-prose">
  <p className="callout-title">Just want working code?</p>

  <p className="callout-body">
    Stop reading. Skip to the [Monitors coding agent reference](/docs/reference/monitors-api-guide-for-coding-agents)
    and copy paste to your agent.
  </p>
</div>

## What Are Monitors?

Monitors run Exa searches on a recurring schedule and deliver results to a webhook endpoint. Each run finds and synthesizes results, with automatic deduplication so you only see new content across runs.

Use them to track competitor announcements, new funding rounds, regulatory changes, research publications, or any topic you want to follow over time.

## Key Capabilities

| Feature                     | What It Does                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Scheduled search**        | Runs your query on a recurring interval anchored to when the monitor was created                                  |
| **Automatic deduplication** | Date filtering and semantic dedup ensure each run surfaces only new content                                       |
| **Structured output**       | Use `outputSchema` to get results as plain text summaries or structured JSON objects                              |
| **Contents options**        | Request text, highlights, or summaries alongside search results                                                   |
| **Webhook delivery**        | Get notified in real time when runs complete. The URL must be the final destination — redirects are not followed. |
| **Manual trigger**          | Run on demand without waiting for the next scheduled time                                                         |

## Common Use Cases

<Accordion title="Track funding announcements">
  Get notified when new companies raise funding in a specific sector.

  <CodeGroup>
    ```python Python theme={null}
    monitor = exa.monitors.create(params={
        "name": "Series A Tracker",
        "search": {
            "query": "AI startups that raised Series A funding",
            "numResults": 10
        },
        "trigger": {
            "type": "interval",
            "period": "7d"
        },
        "webhook": {
            "url": "https://example.com/webhook"
        }
    })
    ```

    ```javascript JavaScript theme={null}
    const monitor = await exa.monitors.create({
      name: "Series A Tracker",
      search: {
        query: "AI startups that raised Series A funding",
        numResults: 10
      },
      trigger: {
        type: "interval",
        period: "7d"
      },
      webhook: {
        url: "https://example.com/webhook"
      }
    });
    ```
  </CodeGroup>
</Accordion>

<Accordion title="Monitor competitor news with structured output">
  Extract structured data from competitor coverage using an output schema.

  <CodeGroup>
    ```python Python theme={null}
    monitor = exa.monitors.create(params={
        "name": "Competitor News",
        "search": {
            "query": "Acme Corp product launches and partnerships",
            "numResults": 5
        },
        "outputSchema": {
            "type": "object",
            "properties": {
                "headline": {"type": "string"},
                "category": {
                    "type": "string",
                    "enum": ["product_launch", "partnership", "hiring", "other"]
                },
                "summary": {"type": "string"}
            },
            "required": ["headline", "category", "summary"]
        },
        "trigger": {
            "type": "interval",
            "period": "1d"
        },
        "webhook": {
            "url": "https://example.com/webhook"
        }
    })
    ```

    ```javascript JavaScript theme={null}
    const monitor = await exa.monitors.create({
      name: "Competitor News",
      search: {
        query: "Acme Corp product launches and partnerships",
        numResults: 5
      },
      outputSchema: {
        type: "object",
        properties: {
          headline: { type: "string" },
          category: {
            type: "string",
            enum: ["product_launch", "partnership", "hiring", "other"]
          },
          summary: { type: "string" }
        },
        required: ["headline", "category", "summary"]
      },
      trigger: {
        type: "interval",
        period: "1d"
      },
      webhook: {
        url: "https://example.com/webhook"
      }
    });
    ```
  </CodeGroup>
</Accordion>

<Accordion title="Track research papers with highlights">
  Follow new publications in a field, with token-efficient highlights included.

  <CodeGroup>
    ```python Python theme={null}
    monitor = exa.monitors.create(params={
        "name": "LLM Research Tracker",
        "search": {
            "query": "new large language model training techniques and architectures",
            "numResults": 10,
            "contents": {
                "highlights": True
            }
        },
        "trigger": {
            "type": "interval",
            "period": "7d"
        },
        "webhook": {
            "url": "https://example.com/webhook"
        }
    })
    ```

    ```javascript JavaScript theme={null}
    const monitor = await exa.monitors.create({
      name: "LLM Research Tracker",
      search: {
        query: "new large language model training techniques and architectures",
        numResults: 10,
        contents: {
          highlights: true
        }
      },
      trigger: {
        type: "interval",
        period: "7d"
      },
      webhook: {
        url: "https://example.com/webhook"
      }
    });
    ```
  </CodeGroup>
</Accordion>

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
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  # Create a monitor that runs daily anchored at creation time
  monitor = exa.monitors.create(params={
      "name": "AI Funding Tracker",
      "search": {
          "query": "AI startups that raised Series A funding",
          "numResults": 10
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
          "url": "https://example.com/webhook"
      }
  })

  print(f"Monitor ID: {monitor.id}")

  # Store the webhook secret securely — only returned on creation
  print(f"Webhook secret: {monitor.webhook_secret}")

  # Trigger a run manually
  exa.monitors.trigger(monitor.id)

  # Poll for results
  import time
  while True:
      runs = exa.monitors.runs.list(monitor.id)
      latest = runs.data[0]
      if latest.status in ("completed", "failed"):
          break
      time.sleep(2)

  # Print results
  if latest.status == "completed" and latest.output:
      run = exa.monitors.runs.get(monitor.id, latest.id)
      for result in run.output.results:
          print(f"- {result['title']}: {result['url']}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  // Create a monitor that runs daily anchored at creation time
  const monitor = await exa.monitors.create({
    name: "AI Funding Tracker",
    search: {
      query: "AI startups that raised Series A funding",
      numResults: 10
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhook"
    }
  });

  console.log(`Monitor ID: ${monitor.id}`);

  // Store the webhook secret securely — only returned on creation
  console.log(`Webhook secret: ${monitor.webhookSecret}`);

  // Trigger a run manually
  await exa.monitors.trigger(monitor.id);

  // Poll for results
  let latest;
  while (true) {
    const runs = await exa.monitors.runs.list(monitor.id);
    latest = runs.data[0];
    if (latest.status === "completed" || latest.status === "failed") break;
    await new Promise(r => setTimeout(r, 2000));
  }

  // Print results
  if (latest.status === "completed" && latest.output) {
    const run = await exa.monitors.runs.get(monitor.id, latest.id);
    for (const result of run.output.results) {
      console.log(`- ${result.title}: ${result.url}`);
    }
  }
  ```

  ```bash cURL theme={null}
  # Create a monitor that runs daily anchored at creation time
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "AI Funding Tracker",
      "search": {
        "query": "AI startups that raised Series A funding",
        "numResults": 10
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhook"
      }
    }' | jq

  # Trigger a run
  curl -s -X POST "https://api.exa.ai/monitors/{MONITOR_ID}/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY" | jq

  # List runs
  curl -s "https://api.exa.ai/monitors/{MONITOR_ID}/runs" \
    -H "Authorization: Bearer $EXA_API_KEY" | jq

  # Get a specific run
  curl -s "https://api.exa.ai/monitors/{MONITOR_ID}/runs/{RUN_ID}" \
    -H "Authorization: Bearer $EXA_API_KEY" | jq
  ```
</CodeGroup>

## Slack Routing Pattern

Monitor `metadata` can be echoed in webhook deliveries and used to route updates back into the right channel or thread.

```json theme={null}
{
  "name": "Competitor Launches",
  "search": {
    "query": "New product launches by Acme competitors"
  },
  "metadata": {
    "slack_channel_id": "C123ABC",
    "slack_thread_id": "1745444400.123456",
    "user_id": "U123ABC"
  },
  "webhook": {
    "url": "https://example.com/exa-monitor-webhook",
    "events": ["monitor.run.completed"]
  }
}
```

When the run webhook fires, Exa echoes that metadata back in the payload, including the Slack routing fields.

## Next

* [**Monitors coding agent reference**](/docs/reference/monitors-api-guide-for-coding-agents) — Full parameter reference for coding agents
* [**Monitors API Reference**](/docs/reference/monitors/create-a-monitor) — Interactive API reference with request/response schemas
* [**Search API**](/docs/reference/search-api-guide) — Learn about Exa's search capabilities
* [**Search Best Practices**](/docs/reference/search-best-practices) — Tips for writing effective queries

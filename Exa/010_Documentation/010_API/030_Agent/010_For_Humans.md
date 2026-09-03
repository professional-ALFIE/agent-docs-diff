> 원본: https://exa.ai/docs/reference/agent-api-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Exa Agent

> Run deep research, list-building, and enrichment workflows that return structured outputs.

Exa Agent is an async, usage-based endpoint for high-compute tasks like list building, enrichment, and deep research. It handles complex reasoning and can return many structured output fields.

Each run can return a natural-language answer, schema-validated JSON, field-level grounding, metadata, and a cost breakdown. You can retrieve completed runs later, list past runs, replay events, or continue from a previous run.

<Tip>
  Prefer MCP? Exa Agent and [Exa Connect](/docs/reference/agent-api/connect/overview) are available in [Exa MCP](/docs/reference/exa-mcp#exa-agent). Enable `tools=agent_run` to run multi-step research, list-building, enrichment, and structured output from Claude, Cursor, and other MCP clients.
</Tip>

## When to use Exa Agent

Use Exa Agent when a workflow needs more than a single search or extraction call:

* Build lists from open-ended criteria, then enrich each result
* Research entities across many fields with citations
* Run multi-hop tasks like "find companies, then find their decision makers"
* Produce structured JSON from a long-running web research task
* Continue from a previous run with a follow-up request like "find 10 more results"

For simpler low-latency search, start with the [Search API](/docs/reference/search-api-guide).

## Quickstart

This example starts a run that builds a structured list of people matching your criteria. It returns JSON in `output.structured`.

### 1. Install the Exa SDK

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash TypeScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

### 2. Set your API key

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

### 3. Create a run

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      output_schema={
          "type": "object",
          "properties": {
              "people": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "job_title": {"type": "string"},
                          "linkedin_url": {"type": "string", "format": "uri"},
                      },
                      "required": ["name", "job_title", "linkedin_url"],
                  },
              }
          },
          "required": ["people"],
      },
      effort="auto",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
    outputSchema: {
      type: "object",
      properties: {
        people: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              job_title: { type: "string" },
              linkedin_url: { type: "string", format: "uri" }
            },
            required: ["name", "job_title", "linkedin_url"]
          }
        }
      },
      required: ["people"]
    },
    effort: "auto"
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "people": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "job_title": { "type": "string" },
                "linkedin_url": { "type": "string", "format": "uri" }
              },
              "required": ["name", "job_title", "linkedin_url"]
            }
          }
        },
        "required": ["people"]
      }
    }' | jq
  ```
</CodeGroup>

Add `Accept: text/event-stream` when creating a run to receive server-sent events as the run is queued, started, and completed. See [Stream events](#stream-events) for more details.

### 4. Poll for completion

If you do not stream events, save the returned `id` and poll the run until it reaches a terminal status.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run_id = "agent_run_01j..."
  run = exa.agent.runs.poll_until_finished(
      run_id,
      poll_interval=4000,
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const runId = "agent_run_01j...";
  const run = await exa.agent.runs.pollUntilFinished(runId, {
    pollInterval: 4000
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  RUN_ID="agent_run_01j..."

  while true; do
    RUN_JSON="$(curl -s "https://api.exa.ai/agent/runs/$RUN_ID" \
      -H "Authorization: Bearer $EXA_API_KEY")"

    STATUS="$(echo "$RUN_JSON" | jq -r '.status')"
    echo "status=$STATUS"

    if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ] || [ "$STATUS" = "cancelled" ]; then
      echo "$RUN_JSON" | jq .
      break
    fi

    sleep 4
  done
  ```
</CodeGroup>

Completed runs include:

* `output.text`: a natural-language answer
* `output.structured`: validated JSON when you provide `outputSchema`
* `output.grounding`: citations for text or structured fields, when emitted
* `costDollars`: the run's cost breakdown

<Note>
  Exa Agent is also available through the OpenAI-compatible Responses API. Point
  the OpenAI SDK at `https://api.exa.ai`, use `model: "exa-agent"`, and choose
  synchronous, streaming, or background execution. See [OpenAI SDK
  compatibility](/docs/reference/openai-sdk#agent-via-responses-api).
</Note>

## Verify and enrich a specific entity

Beyond list building, use Exa Agent to inspect a single known entity, verify a claim against authoritative sources, and return structured enrichment. This example checks whether a company's official website has a publicly accessible pricing page, and enriches the result with pricing details when they are available. The schema requires only `domain` and `verdict`; everything else is optional enrichment.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
      system_prompt="Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
      effort="low",
      output_schema={
          "type": "object",
          "additionalProperties": False,
          "required": ["domain", "verdict"],
          "properties": {
              "domain": {"type": "string", "const": "redbarnrobotics.com"},
              "verdict": {
                  "type": "string",
                  "enum": ["present", "absent", "cannot_verify"],
              },
              "pricing_page_url": {"type": ["string", "null"], "format": "uri"},
              "displays_numeric_prices": {"type": ["boolean", "null"]},
              "pricing_model": {
                  "type": ["string", "null"],
                  "enum": [
                      "free",
                      "subscription",
                      "usage_based",
                      "one_time",
                      "custom_quote",
                      "mixed",
                      "other",
                      None,
                  ],
              },
              "starting_price": {"type": ["number", "null"], "minimum": 0},
              "currency": {
                  "type": ["string", "null"],
                  "description": "ISO 4217 code such as USD or EUR.",
              },
              "billing_period": {
                  "type": ["string", "null"],
                  "enum": [
                      "monthly",
                      "annual",
                      "one_time",
                      "usage_based",
                      "variable",
                      "other",
                      None,
                  ],
              },
              "has_free_plan": {"type": ["boolean", "null"]},
              "has_free_trial": {"type": ["boolean", "null"]},
              "reasoning": {"type": ["string", "null"], "maxLength": 300},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
    systemPrompt:
      "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
    effort: "low",
    outputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["domain", "verdict"],
      properties: {
        domain: { type: "string", const: "redbarnrobotics.com" },
        verdict: {
          type: "string",
          enum: ["present", "absent", "cannot_verify"]
        },
        pricing_page_url: { type: ["string", "null"], format: "uri" },
        displays_numeric_prices: { type: ["boolean", "null"] },
        pricing_model: {
          type: ["string", "null"],
          enum: [
            "free",
            "subscription",
            "usage_based",
            "one_time",
            "custom_quote",
            "mixed",
            "other",
            null
          ]
        },
        starting_price: { type: ["number", "null"], minimum: 0 },
        currency: {
          type: ["string", "null"],
          description: "ISO 4217 code such as USD or EUR."
        },
        billing_period: {
          type: ["string", "null"],
          enum: [
            "monthly",
            "annual",
            "one_time",
            "usage_based",
            "variable",
            "other",
            null
          ]
        },
        has_free_plan: { type: ["boolean", "null"] },
        has_free_trial: { type: ["boolean", "null"] },
        reasoning: { type: ["string", "null"], maxLength: 300 }
      }
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says '"'"'Contact sales'"'"'.",
      "systemPrompt": "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company'"'"'s official website as evidence.",
      "effort": "low",
      "outputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["domain", "verdict"],
        "properties": {
          "domain": { "type": "string", "const": "redbarnrobotics.com" },
          "verdict": {
            "type": "string",
            "enum": ["present", "absent", "cannot_verify"]
          },
          "pricing_page_url": { "type": ["string", "null"], "format": "uri" },
          "displays_numeric_prices": { "type": ["boolean", "null"] },
          "pricing_model": {
            "type": ["string", "null"],
            "enum": ["free", "subscription", "usage_based", "one_time", "custom_quote", "mixed", "other", null]
          },
          "starting_price": { "type": ["number", "null"], "minimum": 0 },
          "currency": {
            "type": ["string", "null"],
            "description": "ISO 4217 code such as USD or EUR."
          },
          "billing_period": {
            "type": ["string", "null"],
            "enum": ["monthly", "annual", "one_time", "usage_based", "variable", "other", null]
          },
          "has_free_plan": { "type": ["boolean", "null"] },
          "has_free_trial": { "type": ["boolean", "null"] },
          "reasoning": { "type": ["string", "null"], "maxLength": 300 }
        }
      }
    }' | jq
  ```
</CodeGroup>

<Note>
  Schemas for verification workflows should account for uncertainty. Make
  fields that may not be verifiable nullable and leave them out of `required`,
  so the agent can return `null` instead of fabricating a value. The `verdict`
  enum distinguishes a failed inspection (`cannot_verify`) from actual negative
  evidence (`absent`): a site that could not be reached is not evidence that
  the page does not exist.
</Note>

## Stream events

Streaming keeps the create request open and sends Server-Sent Events (SSE) until the run completes. See [Event format](#event-format) for the event types and payloads.

Set `stream=True` in Python, `stream: true` in TypeScript, or send `Accept: text/event-stream` over HTTP:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  events = exa.agent.runs.create(
      query="Find five recently launched developer tools for evaluating AI agents.",
      stream=True,
  )

  for event in events:
      print(event.event, event.data)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const events = await exa.agent.runs.create({
    query: "Find five recently launched developer tools for evaluating AI agents.",
    stream: true
  });

  for await (const event of events) {
    console.log(event.event, event.data);
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find five recently launched developer tools for evaluating AI agents."
    }'
  ```
</CodeGroup>

### Event format

Each SSE frame contains an event ID, event name, and JSON payload:

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

The stream may also contain comment lines such as `: keep-alive`. SSE clients ignore comments automatically; custom parsers should do the same.

### Event types

| Event                 | `data` payload                        | How to use it                                                                                                          |
| --------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | Save the run ID as soon as the request is accepted.                                                                    |
| `agent_run.started`   | `{ id, status: "running" }`           | Mark the run as actively processing.                                                                                   |
| `agent_run.completed` | The completed Agent run object        | Read the final answer from `data.output.text` or `data.output.structured`, and citations from `data.output.grounding`. |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | Surface `error.code` and `error.message`; no completed output is available.                                            |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | Stop consuming the stream and handle the run as cancelled.                                                             |

Events associated with the same research step include a `callId`. It corresponds to `item.call_id` in tool progress events. Use it to group search traces, sources, and tool progress. Some search-trace descriptions are generated asynchronously and can arrive after the source or tool event they describe, so do not correlate them by arrival order alone.

Treat `agent_run.source.added` as a live preview rather than a complete citation list. The terminal run's `output.grounding` is the authoritative grounding output.

### Replay stored events

For non-ZDR runs, [`GET /agent/runs/{id}/events`](/docs/reference/agent-api/list-run-events) returns stored events as paginated JSON. Send `Accept: text/event-stream` to replay the stored events as SSE, and `Last-Event-ID` to skip events your client has already processed:

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

The replay endpoint sends the events stored at request time and then closes; it does not continue following a running run. ZDR runs do not retain events and cannot be replayed.

For forward compatibility, ignore event names your application does not recognize and continue until a terminal event arrives.

## Return structured JSON

Use `outputSchema` when you need `/agent` to return in specific format. When you specify an `outputSchema`, the returned object will contain an output matching your `outputSchema` in `output.structured`.

`outputSchema` supports the [JSON Schema specification](https://json-schema.org/).

To request contact information, describe the desired contact fields in `outputSchema`. Use standard JSON Schema shapes such as `{ "type": "string", "format": "email" }` for email addresses, `{ "type": "string", "format": "phone" }` for phone numbers, and `{ "type": "string", "format": "uri" }` for URLs. Bound list sizes with `maxItems` when possible so the maximum contact-enrichment cost is predictable.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      effort="auto",
      output_schema={
          "type": "object",
          "properties": {
              "companies": {
                  "type": "array",
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "website": {"type": "string"},
                      },
                      "required": ["name", "round"],
                  },
              }
          },
          "required": ["companies"],
      },
  )
  run = exa.agent.runs.poll_until_finished(
      run.id,
  )

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
    effort: "auto",
    outputSchema: {
      type: "object",
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              round: { type: "string" },
              website: { type: "string" }
            },
            required: ["name", "round"]
          }
        }
      },
      required: ["companies"]
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "companies": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "website": { "type": "string" }
              },
              "required": ["name", "round"]
            }
          }
        },
        "required": ["companies"]
      }
    }' | jq
  ```
</CodeGroup>

## Process input rows

Use `input.data` when you have an existing set of data that you want to enrich. You can add more fields to each data entity, surface more entities based on the data you bring in, or both.

For complete row-enrichment examples, see [Agent examples](/docs/reference/agent-api/examples#enrich-input-rows).

## Process exclusions

Use `input.exclusion` to exclude certain entries from being surfaced in the run. In the example below, we want to look for the top 10 cutest animals, but we exclude goats and pandas from the run because we already know how cute they are.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find the top 10 cutest animals. Return each animal's common name and a source URL.",
      input={
          "exclusion": [
              {"animal": "goat"},
              {"animal": "panda"},
          ]
      },
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find the top 10 cutest animals. Return each animal's common name and a source URL.",
    input: {
      exclusion: [
        { animal: "goat" },
        { animal: "panda" }
      ]
    }
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find the top 10 cutest animals. Return each animal'"'"'s common name and a source URL.",
      "input": {
        "exclusion": [
          { "animal": "goat" },
          { "animal": "panda" }
        ]
      }
    }' | jq
  ```
</CodeGroup>

## Connect data sources

Use `dataSources` to attach premium data partners to a run. Each entry selects a `provider`. When a property in your `outputSchema` references a specific source (e.g., "from Similarweb"), Exa Agent calls the matching provider tool instead of a generic web search.

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

See [Exa Connect](/docs/reference/agent-api/connect/overview) for the full list of data partners, with examples for each.

## Continue from a previous run

Use `previousRunId` to ask follow-ups to the run's previous response. Each follow-up starts a new run with its own run ID — the `previousRunId` is only used to carry over context from the prior run, not reused as the new run's ID.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Narrow that list to companies hiring in San Francisco.",
      previous_run_id="agent_run_01j...",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Narrow that list to companies hiring in San Francisco.",
    previousRunId: "agent_run_01j..."
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Narrow that list to companies hiring in San Francisco.",
      "previousRunId": "agent_run_01j..."
    }' | jq
  ```
</CodeGroup>

## Find a run ID

List recent runs and inspect their statuses:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  runs = exa.agent.runs.list(
      limit=10,
  )

  for run in runs.data:
      query = (run.request or {}).get("query", "")
      print(f"{run.id}\t{run.status}\t{run.created_at}\t{query}")
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const list = await exa.agent.runs.list({
    limit: 10
  });

  for (const run of list.data) {
    const query = run.request?.query ?? "";
    console.log(`${run.id}\t${run.status}\t${run.createdAt}\t${query}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/agent/runs?limit=10" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    | jq -r '.data[] | "\(.id)\t\(.status)\t\(.createdAt)\t\(.request.query)"'
  ```
</CodeGroup>

## Pricing

Costs are usage-based and priced by component:

| Component           | Price             |
| ------------------- | ----------------- |
| Agent Compute Units | `1 ACU = $0.10`   |
| Search tool calls   | `$0.005 / search` |

<Note>
  Contact enrichment is separate from the core pricing components above: email contact enrichment is `$0.02 / email`, and phone number contact enrichment is `$0.07 / phone number`.
</Note>

`usage.agentComputeUnits` measures model computation across the full run. Complex queries, especially ones with a large `input.data` field, need more reasoning steps and tool calls and consume more ACUs.

### Concurrency and rate limits

Agent limits are two separate controls: how many runs can be in progress at once, and how fast you can start new ones.

* **Concurrency**: you can have 50 Agent runs in progress at a time. This limit is separate from your QPS and does not change when your QPS is raised. Starting a run past the limit returns `429` with error code `CONCURRENCY_LIMIT_REACHED`; wait for a run to finish or contact us to raise your concurrency limit.
* **Starting runs**: `POST /agent/runs` draws from your account QPS, and each run start counts as two requests. You can start runs at half your QPS, so an account with the default 10 QPS can start 5 runs per second, and 25 QPS allows 12 per second.
* **Polling**: `GET` requests for run status, events, and run lists do not count against your QPS and never block dispatch, so poll running Agents independently of how fast you start new ones.

### Effort

Use `effort` to choose a cost and reasoning level for each run. The supported values are `minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, and `max`; the default is `auto`. Fixed efforts have a predictable per-request price, while `auto` and beta `max` are metered by usage:

| Effort    | Price                                          |
| --------- | ---------------------------------------------- |
| `minimal` | `$0.012 / request`                             |
| `low`     | `$0.025 / request`                             |
| `medium`  | `$0.10 / request`                              |
| `high`    | `$0.50 / request`                              |
| `xhigh`   | `$1.00 / request`                              |
| `auto`    | Metered; up to the default `$5` cap            |
| `max`     | **Beta**, metered; up to the default `$20` cap |

<Info>
  Agent Max is the highest-effort tier for work where completeness and thoroughness
  matter more than latency or cost, including large list building, deep multi-source
  research, and criteria that are hard to verify. It is in public beta: requests
  with `effort: "max"` must include `Exa-Beta: agent-max-effort-2026-07-27`. The
  header accepts a comma-separated list of beta tokens.
</Info>

`budget.maxCostDollars` is an optional per-run ceiling for `auto` and `max`. It accepts `$1`–`$100`; the shipped maximum is `$100`, though the server may configure a lower maximum. The default cap is `$5` for `auto` and `$20` for `max`. This is a ceiling rather than a fixed price: runs that finish early cost less. Budget is not accepted for fixed efforts.

### Choosing an effort mode

Fixed effort modes work well when you want predictable per-request pricing for standard research. Use `auto` for variable-scope work like list building, where the number of entities can vary from request to request.

| Effort    | Best for                                                                                                                                                               | Suggested schema complexity                                    | Runtime expectation                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------- |
| `minimal` | Lowest-cost lookups, very narrow factual tasks, short answers                                                                                                          | One or two fields, shallow schema                              | Cheapest, least exhaustive            |
| `low`     | Simple lookups, narrow factual tasks, short answers                                                                                                                    | A few fields, shallow schema                                   | Fast, light research                  |
| `medium`  | Default starting point for most standard research tasks                                                                                                                | Moderate field count, simple nested objects                    | Balanced quality/runtime              |
| `high`    | Harder research, more citations, stricter completeness                                                                                                                 | Larger schemas or more nuanced fields                          | Slower, more thorough                 |
| `xhigh`   | High-value tasks where completeness matters more than cost/latency                                                                                                     | Complex schemas, many fields, difficult verification           | Slowest fixed effort                  |
| `auto`    | Variable-scope work, list building, unknown task difficulty                                                                                                            | Flexible; useful when entity count or work required is unknown | Variable                              |
| `max`     | Work where completeness and thoroughness matter more than latency or cost, including large list building, deep multi-source research, and difficult-to-verify criteria | Complex schemas, many fields, difficult verification           | Highest effort, longest running; beta |

Start with `medium` for standard single-entity research. Drop to `low` or `minimal` when cost and latency matter more than completeness. Move up to `high` or `xhigh` when the output schema is larger, fields need verification, or the task needs deeper reasoning. Use `auto` when you don't know the scope ahead of time, such as list building or workflows that may return many entities.

Runtime varies by query difficulty, schema complexity, and external source availability. Treat effort modes as quality/cost/runtime tradeoffs rather than strict latency guarantees.

### Run with max effort

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.beta.agent.runs.create(
      query="Find all companies building browser automation tools in the United States.",
      effort="max",
      budget={"maxCostDollars": 10},
      betas=["agent-max-effort-2026-07-27"],
  )
  print(run)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.beta.agent.runs.create({
    query: "Find all companies building browser automation tools in the United States.",
    effort: "max",
    budget: { maxCostDollars: 10 },
    betas: ["agent-max-effort-2026-07-27"]
  });
  console.log(run);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: agent-max-effort-2026-07-27" \
    -d '{
      "query": "Find all companies building browser automation tools in the United States.",
      "effort": "max",
      "budget": { "maxCostDollars": 10 }
    }'
  ```
</CodeGroup>

The SDK samples require an `exa-py` or `exa-js` version with Agent Max support.

## Zero Data Retention

Exa Agent supports Zero Data Retention (ZDR). ZDR is enabled per team — [contact us](mailto:sales@exa.ai) to enable it for your account.

When ZDR is enabled for your team:

* Runs may be created with streaming (`Accept: text/event-stream`). Consume the run's output from the live SSE stream. It cannot be retrieved after the run completes. See [Stream events](#stream-events) for SDK and cURL examples and the complete event contract.
* Alternatively, for use of Exa Agent asynchronously or within the Batch API, runs may be created without streaming and processing will be held open for up to 10 minutes to enable the final result to be collected via polling. The result cannot be retrieved if not collected within this time, as it is immediately deleted once processing completes.
* Exa does not retain your query, request, or output.
* `previousRunId` is not available on ZDR runs.
* Creating a run with Exa Connect `dataSources` set, returns a `400` error when ZDR is enabled.

## Next

* [Agent reference](/docs/reference/agent-api/overview)
* [Agent examples](/docs/reference/agent-api/examples)
* [Search API guide](/docs/reference/search-api-guide)

> 원본: https://exa.ai/docs/reference/agent-api/overview.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Agent runs asynchronous, multi-step web research, list-building, and enrichment workflows with natural-language answers, structured outputs, and citations.

Agent creates long-running tasks that can search, read, reason, enrich rows, and return answers with source grounding. Use it when a workflow needs more than a single search or contents call: open-ended research, list building, structured extraction, entity enrichment, or follow-up questions over previous results.

For implementation examples and workflow guidance, start with the [Agent guide](/docs/reference/agent-api-guide).

## When to use

* **Entity enrichment**
  * "Return structured intelligence on all input companies: recent brand partnerships, customer stories, and cloud provider investments"
* **KYC / KYB intelligence**
  * "Provide a business profile for PepsiCo: legal name, HQ, revenue, key brands, segments, sourced from SEC filings and IR pages"
* **List building**
  * "Find all engineering professors at UC Berkeley who specialize in AI or machine learning, with their lab name and recent publication"
* **Deep research**
  * "Research the global R\&D footprint of ArcelorMittal: every R\&D site, center, lab, and university partnership worldwide with facility details and sources"

## How it works

1. **Create** a run with [`POST /agent/runs`](/docs/reference/agent-api/create-a-run).
2. The agent **queues and starts** the run, returning an `agent_run` object immediately unless you request streaming.
3. The run **searches, reads, reasons, and writes** until it completes, fails, is cancelled, or reaches the one-hour timeout.
4. You **poll** [`GET /agent/runs/{id}`](/docs/reference/agent-api/get-a-run), **stream** creation events, or **replay** stored events with [`GET /agent/runs/{id}/events`](/docs/reference/agent-api/list-run-events).
5. You can **continue** from a completed run by passing `previousRunId` to a new create request.

## Endpoints

| Method   | Path                      | Description                                                                     |
| -------- | ------------------------- | ------------------------------------------------------------------------------- |
| `POST`   | `/agent/runs`             | Create a run. Can return JSON or stream server-sent events.                     |
| `GET`    | `/agent/runs`             | List runs for your team.                                                        |
| `GET`    | `/agent/runs/{id}`        | Get a run by ID.                                                                |
| `POST`   | `/agent/runs/{id}/cancel` | Cancel a queued or running run immediately.                                     |
| `POST`   | `/agent/runs/{id}/stop`   | Complete a running `max` effort run early, keeping the results gathered so far. |
| `DELETE` | `/agent/runs/{id}`        | Delete a stored run.                                                            |
| `GET`    | `/agent/runs/{id}/events` | List run events or replay them as server-sent events.                           |

## Run lifecycle

Runs progress through these statuses:

```text theme={null}
queued -> running -> completed | failed | cancelled
```

Completed, failed, and cancelled runs are terminal. Running or queued runs have `stopReason: null`. Terminal runs use one of these stop reasons:

```text theme={null}
schema_satisfied | budget_reached | stopped | error | cancelled
```

## Output

Each run returns an `output` object:

| Field               | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `output.text`       | Natural-language answer or summary.                                  |
| `output.structured` | JSON shaped by `outputSchema`, or `null` when no schema is provided. |
| `output.grounding`  | Citations for the text answer or structured fields, when emitted.    |

`outputSchema` supports JSON Schema draft-07, 2019-09, and 2020-12 via `$schema`. Standard formats are supported, plus `phone`.

<Tip>
  Agents return `null` for fields they cannot support from evidence rather than inventing values, even when your schema marks them as required or non-nullable. `stopReason: schema_satisfied` means the output matched the schema's shape with those nulls allowed, not that it passes strict validation against your submitted schema. Treat fields as potentially nullable and skip records missing what you need.
</Tip>

To request contact information, include contact fields in `outputSchema` using standard JSON Schema string formats, for example `{ "type": "string", "format": "email" }`. Bound arrays with `maxItems` when possible so the maximum contact-enrichment cost is predictable.

Create requests also accept `effort`, which controls the run's cost and reasoning effort preference. Supported values are `minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, and `max`; the default is `auto`.

## Events and streaming

Set `Accept: text/event-stream` when you create a run to stream lifecycle events as they happen. You can also replay stored events later with [`GET /agent/runs/{id}/events`](/docs/reference/agent-api/list-run-events).

Events use standard SSE framing:

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

Terminal event names are `agent_run.completed`, `agent_run.failed`, and `agent_run.cancelled`.

## Limits and pricing

Your Agent concurrency limit is one fifth of your account QPS. For pay-as-you-go accounts with default QPS, this means two active Agent runs at a time.

| Component           | Price             |
| ------------------- | ----------------- |
| Agent Compute Units | `1 ACU = $0.10`   |
| Search tool calls   | `$0.005 / search` |

<Note>
  Contact enrichment is separate from the core pricing components above: email contact enrichment is `$0.02 / email`, and phone number contact enrichment is `$0.07 / phone number`.
</Note>

### Effort

Use `effort` to set a cost and reasoning effort preference for a run. `auto` and beta `max` are metered by usage; the other efforts have a fixed request price:

| Effort    | Price                                          |
| --------- | ---------------------------------------------- |
| `minimal` | `$0.012 / request`                             |
| `low`     | `$0.025 / request`                             |
| `medium`  | `$0.10 / request`                              |
| `high`    | `$0.50 / request`                              |
| `xhigh`   | `$1.00 / request`                              |
| `auto`    | Metered; up to the default `$5` cap            |
| `max`     | **Beta**, metered; up to the default `$20` cap |

<Note>
  `max` is the highest-effort tier for work where completeness and thoroughness matter
  more than latency or cost, including large list building, deep multi-source research,
  and criteria that are hard to verify. It is in public beta and requires the
  **`Exa-Beta: agent-max-effort-2026-07-27`** header, which accepts a comma-separated
  list of tokens.
</Note>

### Choosing an effort mode

Fixed effort modes are best when you want predictable per-request cost on standard research tasks. Use `auto` for variable-scope tasks, especially list building or workflows where the number of entities can vary significantly from request to request.

| Effort    | Best for                                                                                                                                                               | Suggested schema complexity                                    | Runtime expectation                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------- |
| `minimal` | Lowest-cost lookups, very narrow factual tasks, short answers                                                                                                          | One or two fields, shallow schema                              | Cheapest, least exhaustive            |
| `low`     | Simple lookups, narrow factual tasks, short answers                                                                                                                    | A few fields, shallow schema                                   | Fast, light research                  |
| `medium`  | Default starting point for most standard research tasks                                                                                                                | Moderate field count, simple nested objects                    | Balanced quality/runtime              |
| `high`    | Harder research, more citations, stricter completeness                                                                                                                 | Larger schemas or more nuanced fields                          | Slower, more thorough                 |
| `xhigh`   | High-value tasks where completeness matters more than cost/latency                                                                                                     | Complex schemas, many fields, difficult verification           | Slowest fixed effort                  |
| `auto`    | Variable-scope work, list building, unknown task difficulty                                                                                                            | Flexible; useful when entity count or work required is unknown | Variable                              |
| `max`     | Work where completeness and thoroughness matter more than latency or cost, including large list building, deep multi-source research, and difficult-to-verify criteria | Complex schemas, many fields, difficult verification           | Highest effort, longest running; beta |

Use `medium` as the default starting point for standard single-entity research tasks. Move down to `low` or `minimal` when cost and latency matter more than completeness. Move up to `high` or `xhigh` when the output schema is larger, fields require verification, or the task needs deeper reasoning. Use `auto` when the task scope is not known ahead of time, such as list building or workflows where one request may return many entities. Use `max` when completeness and thoroughness matter more than latency or cost, such as for large list building, deep multi-source research, or criteria that are hard to verify.

Runtime varies by query difficulty, schema complexity, and external source availability. Treat effort modes as quality/cost/runtime tradeoffs rather than strict latency guarantees.

## Zero Data Retention

Exa Agent supports Zero Data Retention (ZDR). ZDR is enabled per team — [contact us](mailto:sales@exa.ai) to enable it for your account.

When ZDR is enabled for your team:

* Runs may be created with streaming (`Accept: text/event-stream`). Consume the run's output from the live SSE stream. The final result can also be collected via polling for up to 10 minutes after the run completes. See [Stream events](/docs/reference/agent-api-guide#stream-events) for SDK and cURL examples and the complete event contract.
* Alternatively, for use of Exa Agent asynchronously or within the Batch API, runs may be created and processing will be held open for up to 10 minutes to enable the final result to be collected via polling. The result cannot be retrieved if not collected within this time, as it is immediately deleted once processing completes.
* Exa does not retain your query, request, or output.
* `previousRunId` is not available on ZDR runs.
* Creating a run with Exa Connect `dataSources` set, returns a `400` error when ZDR is enabled.

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
</CodeGroup>

## Next steps

* [Create a run](/docs/reference/agent-api/create-a-run)
* [Get a run](/docs/reference/agent-api/get-a-run)
* [List runs](/docs/reference/agent-api/list-runs)
* [Read the Agent guide](/docs/reference/agent-api-guide)

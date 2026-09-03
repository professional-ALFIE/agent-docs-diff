> 원본: https://exa.ai/docs/reference/pydantic-ai.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Pydantic AI

> Give a Pydantic AI agent web research tools backed by the Exa search API.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) is a Python agent framework from the team behind Pydantic. Its [harness](https://pydantic.dev/docs/ai/harness/exa-search/) ships an official Exa integration as two composable capabilities:

* **`ExaSearch`**: web research tools backed by the Exa Search API: `web_search` (top results with their most relevant excerpts, plus an optional synthesized text summary), `get_page` (full-page retrieval for a specific URL), and opt-in `deep_search` (a synthesized, cited answer in one call).
* **`ExaAgent`**: delegates long-running research to the [Exa Agent API](/docs/reference/agent-api-guide) as deferred tool calls.

A capability bundles the tools, per-tool output budgets, and short research guidance in the system prompt, so you don't have to wire a search API to a page fetcher and prompt the agent to research methodically yourself.

<Info> See the full reference from Pydantic [here](https://pydantic.dev/docs/ai/harness/exa-search/). </Info>

<Card title="Read Pydantic's article about building a Research Agent with Exa" icon="https://mintcdn.com/exa-52/WykOl_6U30cChm_7/images/pydantic-logo.svg?fit=max&auto=format&n=WykOl_6U30cChm_7&q=85&s=ad96c5843e1b61f4a617d618bde44ffd" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/pydantic-logo.svg">
  A walkthrough of three copy-paste research agents built on Pydantic AI and Exa.
</Card>

***

## Get Started

<Steps>
  <Step title="Pre-requisites and installation">
    Install the harness with the Exa extra and set your `EXA_API_KEY` environment variable.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />
  </Step>

  <Step title="Add ExaSearch to an agent">
    Pass `ExaSearch` to an `Agent` via the `capabilities` parameter. Authentication comes from `EXA_API_KEY` by default.

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` contributes two tools to the agent:

    | Tool         | Purpose                                                                                                      |
    | ------------ | ------------------------------------------------------------------------------------------------------------ |
    | `web_search` | Search the web and return the top `num_results` pages, each with title, URL, and its most relevant excerpts. |
    | `get_page`   | Retrieve the full text of one specific URL — a promising `web_search` hit, or a URL the user provided.       |

    `web_search` returns short excerpts (Exa highlights) rather than full page text, so surveying several sources stays cheap; the agent then reads a chosen page with `get_page`. A URL or question that returns no content, a rate limit, or a transient failure surfaces to the model as a `ModelRetry` so the run can recover; authentication failures (401/403) propagate as configuration errors.
  </Step>

  <Step title="Enable deep search (optional)">
    `deep_search` runs Exa's multi-step [deep search](/docs/reference/search-api-guide) (`type='deep'`): Exa expands the question into multiple queries, searches, and returns an answer grounded in citations in one tool call. It invests more time and search depth than `web_search`, so it is off by default. Enable it explicitly:

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    When enabled, the capability's instructions tell the model to treat `deep_search` as an escalation from `web_search`, not a replacement.
  </Step>
</Steps>

***

## Configuration

Every field of `ExaSearch` with its default:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # results per web_search call (1 to 100)
    max_text_chars=10_000,     # get_page text cap, in characters (1 to 10,000)
    text_summary=False,        # web_search also returns a synthesized text summary
    include_deep_search=False, # also expose the deep_search tool
    include_domains=[],        # only search these domains (allowlist)
    exclude_domains=[],        # never search these domains (denylist)
    guidance=None,             # None = default instructions, '' = none, str = custom
    client=None,               # ExaClient -- None builds exa_py.AsyncExa from EXA_API_KEY
)
```

`include_domains` and `exclude_domains` apply to `web_search` and `deep_search`, and are mutually exclusive. Out-of-range limits and setting both domain lists raise at construction.

### Text summary

Set `text_summary` to have every `web_search` call also request a synthesized plain-text summary of the results. Pass `True` for an unconstrained summary, or a string describing the desired format:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

The tool's return shape is unchanged: when Exa returns a summary it is prepended as a `Summary:` line.

### Structured citations

Every tool returns a `ToolReturn`: `return_value` carries the readable text the model sees (including the `Sources:` blocks), and `metadata` carries the sources as structured `ExaSource` records (`{'url': ..., 'title': ...}`) under the `'sources'` key. Metadata is never sent to the model, so rendering citations needs no text parsing:

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

### Custom client

The default client is `exa_py.AsyncExa`, configured from `EXA_API_KEY`. Pass any object satisfying the `ExaClient` protocol to configure authentication or the base URL explicitly, or to substitute a fake in tests:

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

## Exa agent runs

The [Exa Agent API](/docs/reference/agent-api-guide) runs open-ended research tasks asynchronously. The `ExaAgent` capability maps that lifecycle onto Pydantic AI's [deferred tool calls](https://pydantic.dev/docs/ai/deferred-tools/): its `exa_agent` tool creates the run and defers, carrying the Exa run ID in the deferred call's metadata.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

By default (`execution='inline'`) the capability resolves its own deferred calls within the agent run by polling the Exa run to completion, so the tool behaves like a regular (if slow) tool. With `execution='external'` the calls bubble up as `DeferredToolRequests` output for the host application to resolve out of band.

Every field of `ExaAgent` with its default:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = API default
    execution='inline',   # 'inline' polls to completion; 'external' bubbles DeferredToolRequests
    output_schema=None,   # BaseModel class or dict schema for structured output
    system_prompt=None,   # forwarded to the Exa agent run
    poll_interval=1000,   # ms between polls when resolving inline
    timeout_ms=3_600_000, # ms to wait for a run when resolving inline
    guidance=None,        # None = default instructions, '' = none, str = custom
    runs=None,            # ExaAgentRuns -- None builds AsyncExa().agent.runs from EXA_API_KEY
)
```

***

## Agent spec (YAML/JSON)

Both capabilities work with Pydantic AI's [agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec), so you can declare them in a config file instead of Python:

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

Pass `custom_capability_types` so the spec loader knows how to instantiate the capabilities. Spec-loaded instances always build the default client from `EXA_API_KEY`.

***

## Next

* [**Search API**](/docs/reference/search-api-guide) - Semantic search with highlights, summaries, and deep search
* [**Agent API**](/docs/reference/agent-api-guide) - Open-ended asynchronous research runs
* [**MCP Setup**](/docs/reference/exa-mcp) - Exa's hosted MCP server
* [**SDKs**](/docs/sdks/python-sdk) - Python and JavaScript SDK docs

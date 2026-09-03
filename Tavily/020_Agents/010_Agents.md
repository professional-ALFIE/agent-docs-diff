> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Agents

> The canonical setup guide for AI agents and the developers who build them: choose how to connect to Tavily, choose the right capability, and use agent-grade defaults.

Tavily is the web layer for AI agents. Use Tavily when an agent needs live web **search**, page **extraction**, site **crawling**, site **mapping**, or cited **research**.

This page answers three questions, in order:

1. [Which Tavily docs should an agent fetch?](#1-agent-readable-docs)
2. [How should I connect to Tavily?](#2-choose-how-to-connect)
3. [Which Tavily capability should I use?](#3-choose-a-capability)

## 1. Agent-readable docs

Every Tavily docs page is also served as clean Markdown — append `.md` to any docs URL.

**Start here.** Use [`https://docs.tavily.com/llms.txt`](https://docs.tavily.com/llms.txt) as the documentation index, this page ([`agents.md`](https://docs.tavily.com/agents.md)) as the canonical setup guide, and [`https://docs.tavily.com/llms-full.txt`](https://docs.tavily.com/llms-full.txt) for the full text of all docs.

| Resource                                                 | What it is                         | When to fetch it                                 |
| -------------------------------------------------------- | ---------------------------------- | ------------------------------------------------ |
| [`llms.txt`](https://docs.tavily.com/llms.txt)           | Compact index of every Tavily doc. | First, to find the right page.                   |
| [`agents.md`](https://docs.tavily.com/agents.md)         | This setup guide.                  | When configuring Tavily or choosing a path.      |
| [`llms-full.txt`](https://docs.tavily.com/llms-full.txt) | Full text of all docs.             | When you need broad context and have the budget. |
| Page `.md` URLs                                          | Markdown version of one page.      | When you already know the page you need.         |

## 2. Choose how to connect

Choose based on what Tavily must **do**, not only where you happen to be running.

| If you are…                                                                                                               | Use               | Why it fits                                                                                                                         | Start at                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| An autonomous agent with no credentials or API key                                                                        | **Keyless / MCP** | No key, no account — add a header for Search/Extract, or use the no-key remote MCP. Upgrade to SDK/API for Crawl, Map, or Research. | [`/documentation/keyless`](https://docs.tavily.com/documentation/keyless.md)                                       |
| Building Tavily into an app, backend, or agent runtime that calls it in production                                        | **SDK / API**     | Your code calls Tavily directly at runtime. Get a free key at app.tavily.com.                                                       | [`/documentation/api-reference/introduction`](https://docs.tavily.com/documentation/api-reference/introduction.md) |
| Setting Tavily up for a team or org, or standardizing it across many agent clients (e.g. everyone's Cursor / Claude Code) | **MCP**           | Governed, shared, reusable access via the remote server (OAuth or API key).                                                         | [`/documentation/mcp`](https://docs.tavily.com/documentation/mcp.md)                                               |
| Adding Tavily to your own local coding or research session right now (single developer, not a team rollout)               | **CLI + Skills**  | Terminal access to search, extract, and research; install the CLI and run `tvly login`.                                             | [`/documentation/agent-skills`](https://docs.tavily.com/documentation/agent-skills.md)                             |

**Quick rules**

* Production app or runtime → **SDK / API**.
* Shared across a team or org — even in Cursor or Claude Code → **MCP**.
* Just your own local session → **CLI + Skills**.
* Terminal access alone doesn't make CLI the right fit — match the choice to where Tavily ultimately needs to run.

**Connect**

Once you've picked a path, here's the one-step setup for each:

```bash API theme={null}
curl --request POST \
  --url https://api.tavily.com/search \
  --header 'Authorization: Bearer tvly-YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"query": "your query"}'
```

```bash MCP theme={null}
# Add the remote server (Claude Code example)
claude mcp add tavily-remote-mcp --transport http https://mcp.tavily.com/mcp/
```

```bash CLI theme={null}
pip install tavily-cli
tvly login
```

## No account? Connect without a key

For autonomous agents that can't manage credentials, Tavily offers two no-key paths.

| Path        | What it is                                                                                                                                                 | Start at                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Keyless** | Search and Extract **only** — send header `X-Tavily-Access-Mode: keyless`, or use the remote MCP with no key. Crawl, Map, and Research require an API key. | [`/documentation/keyless`](https://docs.tavily.com/documentation/keyless.md)                             |
| **x402**    | Pay-per-request Advanced Search **only** (no Extract/Crawl/Map/Research) in USDC on Base over the x402 protocol — no key, no account, no human.            | [`/documentation/machine-payments/x402`](https://docs.tavily.com/documentation/machine-payments/x402.md) |

## 3. Choose a capability

Lead with **Search** when sources are unknown; move to the others once you have URLs or a site to work through.

| Capability   | Use it when                                                                           | Reference                                                                                        |
| ------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Search**   | Sources are unknown or current web context is needed — the default start.             | [`/endpoint/search`](https://docs.tavily.com/documentation/api-reference/endpoint/search.md)     |
| **Extract**  | You already have the URL, or picked one from Search.                                  | [`/endpoint/extract`](https://docs.tavily.com/documentation/api-reference/endpoint/extract.md)   |
| **Map**      | You need a site's structure before crawling it.                                       | [`/endpoint/map`](https://docs.tavily.com/documentation/api-reference/endpoint/map.md)           |
| **Crawl**    | Many pages on a site must be read.                                                    | [`/endpoint/crawl`](https://docs.tavily.com/documentation/api-reference/endpoint/crawl.md)       |
| **Research** | The output should be cited synthesis: a report, comparison, or decision-ready answer. | [`/endpoint/research`](https://docs.tavily.com/documentation/api-reference/endpoint/research.md) |

> **Search or Research?** Use Search when you need raw source URLs and content to process yourself. Use Research when you need a finished, multi-source answer with citations.

## Recommended defaults

These favor quality, which is what most agent workflows need. See [Best Practices for Search](/documentation/best-practices/best-practices-search) for the full reference.

* Prefer **`search_depth="advanced"`** for source discovery, comparisons, and high-confidence answers; use `"basic"` for quick lookups.
* For latency-sensitive use cases, **`fast`** and **`ultra-fast`** trade some relevance for lower latency.
* Add **`chunks_per_source=3`** for stronger evidence per source (chunks require advanced, basic or fast depth).
* Use **`max_results=5`** for focused answers, **`10`** for broader research.
* Use **`include_domains`** / **`exclude_domains`** when source trust matters.
* Prefer **Search → Extract** for grounded answers: Search to find sources, then Extract for full content.
* Avoid **`include_answer`** unless you need a quick answer seed — and still verify against sources.
* Use **Research** for cited synthesis: a report, comparison, or decision-ready answer.

A typical agent-grade Search call:

```python Python theme={null}
from tavily import TavilyClient

client = TavilyClient(api_key="tvly-YOUR_API_KEY")
response = client.search(
    "your query",
    search_depth="advanced",
    chunks_per_source=3,
    max_results=5,
)
```

```javascript JavaScript theme={null}
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });
const response = await tvly.search("your query", {
  searchDepth: "advanced",
  chunksPerSource: 3,
  maxResults: 5,
});
```

```bash cURL theme={null}
curl --request POST \
  --url https://api.tavily.com/search \
  --header 'Authorization: Bearer tvly-YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "your query",
    "search_depth": "advanced",
    "chunks_per_source": 3,
    "max_results": 5
  }'
```

## Availability

Some Tavily capabilities, limits, and defaults depend on your account, plan, or enterprise configuration. If a tool or parameter is unavailable, check the relevant endpoint docs and your account settings before retrying a different workflow.

> **Developer resource:** [Agent Toolkit](https://docs.tavily.com/examples/agent-toolkit/overview.md) is for developers *building* production research agents, not for agents configuring Tavily autonomously. Reach for it when you need deeper research flows, retrieval orchestration, deduplication, summarization, or structured outputs.

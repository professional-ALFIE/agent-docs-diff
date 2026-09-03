> 원본: https://docs.tavily.com/documentation/integrations/cartesia.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Cartesia

> Build real-time voice agents that search and extract web content with Tavily and the Cartesia Line SDK.

## Introduction

[Cartesia Line](https://docs.cartesia.ai/line/introduction) is an SDK for building low-latency voice agents. Pairing Line with Tavily gives your voice agent live web access — use [Tavily Search](https://docs.tavily.com/documentation/api-reference/endpoint/search) for fast, voice-friendly lookups and [Tavily Extract](https://docs.tavily.com/documentation/api-reference/endpoint/extract) for deep-dives into specific pages.

This integration is also documented on [Cartesia's docs](https://docs.cartesia.ai/integrations/community/tavily-cartesia-line), and a complete reference implementation lives in the [Cartesia Line repo](https://github.com/cartesia-ai/line/tree/main/example_integrations/tavily).

## Step-by-Step Integration Guide

### Step 1: Install Required Packages

```bash theme={null}
uv venv
uv add cartesia-line tavily-python loguru python-dotenv
```

### Step 2: Set Up API Keys

* **Tavily API Key:** [Get your Tavily API key here](https://app.tavily.com/home)
* **OpenAI API Key:** [Get your OpenAI API key here](https://platform.openai.com/account/api-keys)

Create a `.env` file:

```bash theme={null}
TAVILY_API_KEY=tvly-your-api-key
OPENAI_API_KEY=your-openai-api-key
```

### Step 3: Define Tavily Tools

Wrap Tavily's `AsyncTavilyClient` in two `@loopback_tool` functions so the voice agent can call them mid-conversation. Reusing a single `AsyncTavilyClient` across calls keeps the underlying HTTP session warm, which matters for latency on a live call.

```python theme={null}
from typing import Annotated, Optional

from loguru import logger
from tavily import AsyncTavilyClient

from line.llm_agent import ToolEnv, loopback_tool

EXTRACT_MAX_CHARS = 3000


class TavilyTools:
    def __init__(self, api_key: str):
        self._client = AsyncTavilyClient(
            api_key=api_key,
            client_source="cartesia-line-agent",
        )

    @loopback_tool
    async def web_search(
        self,
        ctx: ToolEnv,
        query: Annotated[str, "The search query. Be specific and include key terms."],
        time_range: Annotated[
            Optional[str],
            "Optional time filter: 'day', 'week', 'month', or 'year'.",
        ] = None,
    ) -> str:
        """Search the web for current information."""
        kwargs: dict = {"query": query, "search_depth": "fast", "max_results": 5}
        if time_range is not None:
            kwargs["time_range"] = time_range

        response = await self._client.search(**kwargs)
        results = response.get("results", [])
        if not results:
            return "No relevant information found."

        parts = [f"Search Results for: '{query}'\n"]
        for i, result in enumerate(results):
            score = result.get("score", 0)
            parts.append(f"\n--- Source {i + 1}: {result['title']} (relevance: {score:.2f}) ---\n")
            if result.get("content"):
                parts.append(f"{result['content']}\n")
            parts.append(f"URL: {result['url']}\n")
        return "".join(parts)

    @loopback_tool
    async def web_extract(
        self,
        ctx: ToolEnv,
        url: Annotated[str, "The URL to extract content from."],
    ) -> str:
        """Extract the full content of a webpage given its URL."""
        response = await self._client.extract(urls=[url])
        results = response.get("results", [])
        if not results:
            failed = response.get("failed_results", [])
            if failed:
                return f"Extraction failed for {url}: {failed[0].get('error', 'unknown error')}"
            return "No content could be extracted from that URL."

        raw_content = results[0].get("raw_content", "")
        if not raw_content:
            return "The page was reached but no readable content was found."
        if len(raw_content) > EXTRACT_MAX_CHARS:
            raw_content = raw_content[:EXTRACT_MAX_CHARS] + "\n\n[Content truncated]"
        return f"Extracted content from {url}:\n\n{raw_content}"
```

### Step 4: Wire the Tools into a Voice Agent

```python theme={null}
import os
from datetime import datetime

from line.llm_agent import LlmAgent, LlmConfig, end_call
from line.voice_agent_app import AgentEnv, CallRequest, VoiceAgentApp

SYSTEM_PROMPT = """Today is {today}. You are a fast research assistant on a live voice call.

Use `web_search` for current events, facts, prices, or anything that needs fresh data.
Use `web_extract` only when a search snippet is too thin — pass it a URL from a prior search.

Lead with the answer. Keep replies to two or three sentences unless asked for more.
This is a voice call: speak in plain sentences, no markdown, no lists, no special characters."""


async def get_agent(env: AgentEnv, call_request: CallRequest):
    api_key = os.environ["TAVILY_API_KEY"]
    tavily = TavilyTools(api_key=api_key)

    return LlmAgent(
        model="openai/gpt-5.4-mini",
        api_key=os.environ["OPENAI_API_KEY"],
        tools=[tavily.web_search, tavily.web_extract, end_call],
        config=LlmConfig(
            system_prompt=SYSTEM_PROMPT.format(today=datetime.now().strftime("%Y-%m-%d")),
            introduction="Hey! I'm your research assistant. Ask me anything.",
            max_tokens=600,
            temperature=0.7,
        ),
    )


app = VoiceAgentApp(get_agent=get_agent)

if __name__ == "__main__":
    app.run()
```

<Note>
  Ensure you have the Cartesia CLI installed. Please refer to the [Cartesia CLI documentation](https://docs.cartesia.ai/line/cli) for more information.
</Note>

Run the agent and connect to it:

```bash theme={null}
uv run main.py
# in another terminal
cartesia chat 8000
```

## Choosing a Search Depth

Voice agents are latency-sensitive. Tavily exposes four search depths — for live calls, we recommend using `fast` or `ultra-fast`.

| Depth        | Latency | Content Type            | Cost      | Best For                             |
| ------------ | ------- | ----------------------- | --------- | ------------------------------------ |
| `ultra-fast` | Lowest  | NLP summary per URL     | 1 credit  | Voice agents, real-time chat         |
| `fast`       | Low     | Reranked chunks per URL | 1 credit  | Chunk-based results with low latency |
| `basic`      | Medium  | Reranked chunks per URL | 1 credit  | General-purpose search               |
| `advanced`   | Higher  | Reranked chunks per URL | 2 credits | Precision-critical queries           |

## Additional Parameters

Extend `web_search` with any of Tavily's search parameters:

* `time_range` — `"day"`, `"week"`, `"month"`, or `"year"` for recency filtering
* `include_domains` / `exclude_domains` — restrict or block specific sources
* `include_answer` — `"basic"` or `"advanced"` for an LLM-generated answer alongside results

See the [Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search) and the [Python SDK reference](https://docs.tavily.com/sdk/python/reference) for the full parameter list.

For `web_extract`, the most useful knobs are:

* `extract_depth` — `"basic"` (default) or `"advanced"` for tables and embedded content
* `format` — `"markdown"` (default) or `"text"`

See the [Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract) for more.

## Benefits of Tavily + Cartesia

* **Voice-optimized latency:** `fast` and `ultra-fast` search depths keep round-trips short enough for live conversation.
* **Fresh context:** Voice agents can answer questions about today's news, prices, and events without retraining.
* **Targeted deep-dives:** Providing URLs to `web_extract` allows the agent to pull full-page content when a snippet isn't enough.

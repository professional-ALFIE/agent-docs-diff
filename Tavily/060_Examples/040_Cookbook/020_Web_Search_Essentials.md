> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Web Search Essentials

> Use Tavily Search to find real-time information, monitor news, filter by domain, and aggregate results across multiple queries.

## What You'll Learn

* Running a basic web search and reading results
* Filtering by recency and news sources
* Constraining searches to specific domains
* Aggregating results across multiple queries with async

## How Does It Work?

Tavily Search returns relevant web results for a natural-language query, optimized for LLM consumption. Each result includes a title, URL, relevance score, and a content snippet. You can tune the depth/speed tradeoff, filter by topic or time range, and restrict results to specific domains.

## Getting Started

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

<Steps>
  <Step title="Install the Tavily Python SDK">
    ```bash theme={null}
    uv venv
    uv pip install tavily-python
    ```
  </Step>

  <Step title="Run a search">
    ```python theme={null}
    import os
    from tavily import TavilyClient

    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    response = client.search(
        query="What are the latest breakthroughs in quantum computing?",
        max_results=5,
    )

    for result in response["results"]:
        print(f"[{result['score']:.2f}] {result['title']}")
        print(f"  {result['url']}\n")
    ```
  </Step>

  <Step title="Output">
    ```text theme={null}
    [0.92] Quantum Computing Breakthroughs in 2025 - Nature
      https://nature.com/articles/quantum-2025

    [0.87] Google Achieves New Quantum Milestone
      https://blog.google/technology/quantum/milestone-2025/

    [0.81] IBM Roadmap: 100K Qubits by 2033
      https://research.ibm.com/blog/quantum-roadmap
    ...
    ```
  </Step>
</Steps>

## Domain-Constrained Search

Restrict results to trusted sources with `include_domains`, or remove noise with `exclude_domains`.

```python theme={null}
response = client.search(
    query="CEO background at Apple",
    include_domains=["apple.com"],
    max_results=5,
)

for result in response["results"]:
    print(f"{result['title']}: {result['url']}")
```

You can also combine domain filters with exclusions:

```python theme={null}
response = client.search(
    query="enterprise AI platforms comparison",
    include_domains=["medium.com"],
    exclude_domains=["reddit.com", "quora.com"],
    search_depth="advanced",
)
```

<Tip>
  See this pattern in action in the [Product News Tracker](/examples/quick-tutorials/product-news-tracker) tutorial.
</Tip>

## Multi-Query Aggregation

For complex search operations, run multiple focused queries concurrently with `AsyncTavilyClient` and merge the results.

```python theme={null}
import os
import asyncio
from tavily import AsyncTavilyClient

async def multi_query_search():
    client = AsyncTavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    queries = [
        "Competitors of Notion in the productivity space",
        "Notion financial performance and funding",
        "Recent Notion product launches and AI features",
    ]

    responses = await asyncio.gather(
        *(client.search(q, max_results=5) for q in queries),
        return_exceptions=True,
    )

    all_results = []
    for query, resp in zip(queries, responses):
        if isinstance(resp, Exception):
            print(f"Failed: {query} — {resp}")
            continue
        for r in resp["results"]:
            r["source_query"] = query
            all_results.append(r)

    seen = set()
    unique = []
    for r in sorted(all_results, key=lambda x: x["score"], reverse=True):
        if r["url"] not in seen:
            seen.add(r["url"])
            unique.append(r)

    return unique

results = asyncio.run(multi_query_search())
for r in results[:10]:
    print(f"[{r['score']:.2f}] {r['title']}")
```

<Tip>
  Breaking a broad question into 2-3 focused sub-queries often produces better results than a single long query.
</Tip>

## Critical Knobs

<AccordionGroup>
  <Accordion title="search_depth">
    * **Default:** `"basic"`
    * `"advanced"` — highest relevance, reranked chunks (2 credits)
    * `"fast"` — lower latency, chunk format (1 credit)
    * `"ultra-fast"` — near-instant, summary format (0.5 credits)
  </Accordion>

  <Accordion title="time_range / start_date / end_date">
    * `time_range` — relative filter: `"day"`, `"week"`, `"month"`, `"year"`
    * `start_date` / `end_date` — absolute date range in `YYYY-MM-DD` format
    * Use one or the other, not both
  </Accordion>

  <Accordion title="include_domains / exclude_domains">
    * Restrict results to specific domains or filter them out
    * Keep lists short for best results
  </Accordion>

  <Accordion title="max_results">
    * **Range:** 1–20, **default:** 5
    * Higher values may return lower-quality results
  </Accordion>
</AccordionGroup>

For the complete parameter list, see the [Search API reference](/documentation/api-reference/endpoint/search).

## Production Notes

* **Credits**:
  * `"basic"`, `"fast"`, and `"ultra-fast"` cost 1 credit per query.
  * `"advanced"` costs 2 credits per query.
* **Rate limits**: See [Rate Limits](/documentation/rate-limits) for current thresholds.
* **Quality filtering**: Use `score` from the response to filter low-relevance results (e.g., discard results below 0.5).
* **Async for throughput**: Use `AsyncTavilyClient` with `asyncio.gather` when making multiple concurrent requests.

## Next Steps

<CardGroup cols={2}>
  <Card title="Search API Reference" icon="code" href="/documentation/api-reference/endpoint/search">
    Full parameter list, response schema, and interactive playground.
  </Card>

  <Card title="Search Best Practices" icon="gear" href="/documentation/best-practices/best-practices-search">
    Query optimization, depth selection, filtering, and post-processing tips.
  </Card>

  <Card title="Python SDK Reference" icon="python" href="/sdk/python/reference">
    Python client methods, async support, and type details.
  </Card>

  <Card title="JavaScript SDK Reference" icon="js" href="/sdk/javascript/reference">
    JavaScript/TypeScript client methods and usage.
  </Card>
</CardGroup>

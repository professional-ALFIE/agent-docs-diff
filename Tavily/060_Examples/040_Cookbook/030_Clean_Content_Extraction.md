> 원본: https://docs.tavily.com/examples/quick-tutorials/extract-api.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Clean Content Extraction

> Use Tavily Extract to pull clean markdown or text from any webpage — single URLs, batches, or query-focused chunks.

## What You'll Learn

* Extracting clean content from one or many URLs
* Basic vs advanced extraction depth
* Query-focused extraction for targeted content retrieval
* Batch extraction (up to 20 URLs in a single call)

## How Does It Work?

Tavily Extract takes a URL (or list of URLs) and returns the page content as clean markdown or plain text. It handles JavaScript-rendered pages, removes boilerplate (ads, navigation, footers), and returns structured content ready for LLM consumption.

Two extraction depths are available:

| Depth      | Speed  | Success Rate | Content                                     | Cost                 |
| ---------- | ------ | ------------ | ------------------------------------------- | -------------------- |
| `basic`    | Fast   | Good         | Standard page content                       | 1 credit per 5 URLs  |
| `advanced` | Slower | Higher       | Tables, embedded content, JS-rendered pages | 2 credits per 5 URLs |

## Getting Started

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

<Steps>
  <Step title="Install the Tavily Python SDK">
    ```bash theme={null}
    uv venv
    uv pip install tavily-python
    ```
  </Step>

  <Step title="Extract content from a URL">
    ```python theme={null}
    import os
    from tavily import TavilyClient

    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    response = client.extract(
        urls="https://en.wikipedia.org/wiki/Artificial_intelligence",
        extract_depth="advanced",
    )

    result = response["results"][0]
    print(f"URL: {result['url']}")
    print(f"Content length: {len(result['raw_content'])} chars")
    print(result["raw_content"][:500])
    ```
  </Step>

  <Step title="Output">
    ```text theme={null}
    URL: https://en.wikipedia.org/wiki/Artificial_intelligence
    Content length: 48231 chars
    # Artificial intelligence

    **Artificial intelligence (AI)**, in its broadest sense,
    is intelligence exhibited by machines, particularly
    computer systems. It is a field of research in computer
    science that develops and studies methods and software
    that enable machines to perceive their environment and
    use learning and intelligence to take actions...
    ```
  </Step>
</Steps>

## Batch Extraction

Extract content from up to 20 URLs in a single call. Failed URLs are reported separately without blocking successful ones.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

urls = [
    "https://en.wikipedia.org/wiki/Artificial_intelligence",
    "https://en.wikipedia.org/wiki/Machine_learning",
    "https://en.wikipedia.org/wiki/Data_science",
]

response = client.extract(urls=urls, include_images=True)

for result in response["results"]:
    print(f"{result['url']}: {len(result['raw_content'])} chars")

if response["failed_results"]:
    for fail in response["failed_results"]:
        print(f"Failed: {fail['url']} - {fail['error']}")
```

## Query-Focused Extraction

When you pass a `query` parameter, Extract reranks the content chunks by relevance to your question. Combined with `chunks_per_source`, this returns only the most relevant portions of each page.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.extract(
    urls="https://en.wikipedia.org/wiki/Artificial_intelligence",
    query="What are the main ethical concerns with AI?",
    chunks_per_source=3,
)

print(response["results"][0]["raw_content"])
```

The `raw_content` field will contain the top 3 most relevant chunks separated by `[...]`, rather than the full page content. This is useful for keeping LLM context windows small while maintaining relevance.

## Choosing the Right Extraction Depth

<AccordionGroup>
  <Accordion title="When to use basic extraction">
    * Static HTML pages (blogs, articles, documentation)
    * When speed matters more than completeness
    * High-volume batch jobs where cost is a concern
    * Pages with straightforward content structure
  </Accordion>

  <Accordion title="When to use advanced extraction">
    * JavaScript-rendered single-page applications
    * Pages with tables, charts, or embedded content
    * When you need the highest success rate
    * Complex pages where basic extraction misses content
  </Accordion>
</AccordionGroup>

## Critical Knobs

<AccordionGroup>
  <Accordion title="extract_depth">
    * `"basic"` (default) — standard HTML pages, 1 credit per 5 URLs
    * `"advanced"` — JS-rendered pages, tables, embedded content, 2 credits per 5 URLs
  </Accordion>

  <Accordion title="query + chunks_per_source">
    * Pass a `query` to rerank content by relevance to your question
    * Pair with `chunks_per_source` (1–5) to return only the top snippets
    * Without `query`, full page content is returned
  </Accordion>

  <Accordion title="format">
    * `"markdown"` (default) — preserves headings, links, and structure
    * `"text"` — plain text, lighter for simple pipelines
  </Accordion>
</AccordionGroup>

For the complete parameter list, see the [Extract API reference](/documentation/api-reference/endpoint/extract).

## Next Steps

<CardGroup cols={2}>
  <Card title="Extract API Reference" icon="code" href="/documentation/api-reference/endpoint/extract">
    Full parameter list, response schema, and interactive playground.
  </Card>

  <Card title="Extract Best Practices" icon="gear" href="/documentation/best-practices/best-practices-extract">
    Depth selection, two-step search-then-extract, and optimization tips.
  </Card>

  <Card title="Python SDK Reference" icon="python" href="/sdk/python/reference">
    Python client methods, async support, and type details.
  </Card>

  <Card title="JavaScript SDK Reference" icon="js" href="/sdk/javascript/reference">
    JavaScript/TypeScript client methods and usage.
  </Card>
</CardGroup>

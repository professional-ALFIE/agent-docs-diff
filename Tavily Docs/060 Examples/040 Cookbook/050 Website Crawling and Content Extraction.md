> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Website Crawling and Content Extraction

> Use Tavily Crawl to extract content from entire websites — documentation ingestion, selective path crawling, and building retrieval pipelines.

## What You'll Learn

* Crawling a website and extracting clean content from its pages
* Using path filters and instructions for selective crawling
* When to use Crawl vs Map
* Feeding crawled content into a retrieval pipeline

## How Does It Work?

Tavily Crawl follows links from a starting URL and extracts clean content from each page it visits. Unlike Map (which only discovers URLs), Crawl returns the full page content as markdown or text, ready for LLM consumption.

| Feature      | Crawl                                          | Map                                               |
| ------------ | ---------------------------------------------- | ------------------------------------------------- |
| **Returns**  | URLs + full page content                       | URL list only                                     |
| **Speed**    | Slower (extracts content)                      | Fast (seconds)                                    |
| **Cost**     | Higher (extraction per page)                   | Lower                                             |
| **Best for** | RAG pipelines, content analysis, documentation | Site discovery, URL filtering, sitemap generation |

**Rule of thumb**: Use Map when you need to *find* pages. Use Crawl when you need to *read* pages.

## Getting Started

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

<Steps>
  <Step title="Install the Tavily Python SDK">
    ```bash theme={null}
    uv venv
    uv pip install tavily-python
    ```
  </Step>

  <Step title="Crawl a website">
    ```python theme={null}
    import os
    from tavily import TavilyClient

    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    response = client.crawl(
        url="https://docs.tavily.com",
        max_depth=1,
        limit=10,
    )

    for page in response["results"]:
        print(f"\n--- {page['url']} ---")
        print(f"Content length: {len(page['raw_content'])} chars")
        print(page["raw_content"][:200])
    ```
  </Step>

  <Step title="Output">
    ```text theme={null}
    --- https://docs.tavily.com/ ---
    Content length: 4040 chars
    # Tavily docs

    Search, crawl, and extract content from the web with APIs
    built for LLMs and autonomous agents...

    --- https://docs.tavily.com/documentation/api-reference/introduction ---
    Content length: 3647 chars
    # API Reference Introduction

    This section covers Tavily endpoint APIs, request parameters,
    and response schemas...
    ```
  </Step>
</Steps>

## Documentation Ingestion

Crawl a docs site with `select_paths` to focus on the pages that matter, and `extract_depth: "advanced"` for complex pages with tables or code blocks.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.crawl(
    url="https://docs.tavily.com",
    max_depth=2,
    limit=50,
    select_paths=["/documentation/.*", "/sdk/.*"],
    exclude_paths=["/changelog/.*"],
    extract_depth="advanced",
)

pages = response["results"]
print(f"Crawled {len(pages)} pages")

for page in pages:
    print(f"  {page['url']} ({len(page['raw_content'])} chars)")
```

<Tip>
  Start with `max_depth=1` and a conservative `limit`. Each level of depth increases crawl time exponentially — scale up only after verifying results.
</Tip>

## Selective Path Crawling

Combine path patterns with natural-language `instructions` to focus the crawl semantically. When `instructions` are set, you can also use `chunks_per_source` to get only the most relevant snippets per page.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.crawl(
    url="https://docs.tavily.com",
    max_depth=2,
    select_paths=["/documentation/api-reference/.*"],
    exclude_paths=["/documentation/api-reference/endpoint/research-streaming"],
    instructions="Find pages about Search and Extract endpoints",
    chunks_per_source=3,
)

for page in response["results"]:
    print(f"\n{page['url']}")
    print(page["raw_content"])
```

With `chunks_per_source`, the `raw_content` field contains the top relevant chunks separated by `[...]` instead of the full page, keeping context windows small.

## Crawl-to-Retrieval Pipeline

Crawl a site, chunk the content, and build a searchable index. This sketch shows the pattern — for a complete implementation, see the [Crawl to RAG](/examples/use-cases/crawl-to-rag) app example.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

def chunk_text(text, chunk_size=500, overlap=50):
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks

response = client.crawl(
    url="https://docs.tavily.com",
    max_depth=2,
    limit=30,
    extract_depth="advanced",
)

all_chunks = []
for page in response["results"]:
    chunks = chunk_text(page["raw_content"])
    for chunk in chunks:
        all_chunks.append({
            "text": chunk,
            "url": page["url"],
        })

print(f"Created {len(all_chunks)} chunks from {len(response['results'])} pages")

# Next steps: embed chunks and load into a vector store
# See the Crawl to RAG example for the full pipeline
```

## Critical Knobs

<AccordionGroup>
  <Accordion title="max_depth">
    * **Range:** 1–5, **default:** 1
    * Each level increases crawl time exponentially
    * Start at 1 and increase only after verifying results
  </Accordion>

  <Accordion title="max_breadth">
    * **Range:** 1–500, **default:** 20
    * Controls how many links are followed per page level
  </Accordion>

  <Accordion title="limit">
    * Hard cap on total pages crawled
    * Always set this to prevent runaway crawls and unexpected costs
  </Accordion>

  <Accordion title="select_paths / exclude_paths">
    * Regex patterns to include or exclude URL paths
    * Example: `"/docs/.*"` to target docs, `"/blog/.*"` to skip blog posts
  </Accordion>

  <Accordion title="extract_depth">
    * `"basic"` (default) — standard content, faster
    * `"advanced"` — tables, embedded content, JS-rendered pages, slower but more thorough
  </Accordion>

  <Accordion title="instructions">
    * Natural-language guidance for the crawler
    * Enables semantic filtering of pages
    * Unlocks `chunks_per_source` for targeted content retrieval
  </Accordion>
</AccordionGroup>

For the complete parameter list, see the [Crawl API reference](/documentation/api-reference/endpoint/crawl).

## Production Notes

* **Cost control**: Always set `limit` to cap the number of pages. Each crawled page consumes credits based on `extract_depth`.
* **Timeouts**: Large crawls can take time. Use the `timeout` parameter (10-150s) to set upper bounds.
* **Failed pages**: Check `response["failed_results"]` for pages that couldn't be extracted. Adjust `extract_depth` or path filters accordingly.
* **Map first**: Consider using [Map](/examples/quick-tutorials/map-api) to discover the site structure before crawling. This lets you identify the right `select_paths` patterns and set a realistic `limit`.

## Next Steps

<CardGroup cols={2}>
  <Card title="Crawl API Reference" icon="code" href="/documentation/api-reference/endpoint/crawl">
    Full parameter list, response schema, and interactive playground.
  </Card>

  <Card title="Crawl Best Practices" icon="gear" href="/documentation/best-practices/best-practices-crawl">
    Depth tuning, path filtering, domain controls, and common pitfalls.
  </Card>

  <Card title="Python SDK Reference" icon="python" href="/sdk/python/reference">
    Python client methods, async support, and type details.
  </Card>

  <Card title="JavaScript SDK Reference" icon="js" href="/sdk/javascript/reference">
    JavaScript/TypeScript client methods and usage.
  </Card>
</CardGroup>

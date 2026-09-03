> 원본: https://docs.tavily.com/examples/quick-tutorials/map-api.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Site Structure Discovery with Map

> Use Tavily Map to discover all URLs on a domain, then combine with Extract for targeted content retrieval.

## What You'll Learn

* How to use Tavily Map to discover all URLs on a domain without extracting content
* When to use Map vs Crawl (speed vs depth)
* How to combine Map + Extract for targeted content retrieval
* Filtering results with path and domain patterns

## How Does It Work?

Tavily Map returns a list of URLs discovered from a starting URL. Unlike Crawl, it does not extract page content -- it only discovers the structure. This makes it significantly faster and cheaper when you need to understand what's on a site before deciding which pages to process.

| Feature  | Map                           | Crawl                             |
| -------- | ----------------------------- | --------------------------------- |
| Returns  | URL list only                 | URLs + full page content          |
| Speed    | Fast (seconds)                | Slower (depends on page count)    |
| Cost     | Lower                         | Higher                            |
| Best for | Site discovery, URL filtering | Content extraction, RAG pipelines |

## Getting Started

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

<Steps>
  <Step title="Install the Tavily Python SDK">
    ```bash theme={null}
    uv venv
    uv pip install tavily-python
    ```
  </Step>

  <Step title="Set up your client">
    ```python theme={null}
    import os
    from tavily import TavilyClient

    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
    ```
  </Step>

  <Step title="Map a website">
    ```python theme={null}
    import os
    from tavily import TavilyClient

    client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

    response = client.map(url="https://docs.tavily.com")

    print(f"Found {len(response['results'])} URLs")
    for url in response["results"][:10]:
        print(url)
    ```
  </Step>

  <Step title="Output">
    ```python theme={null}
    Found 21 URLs
    https://docs.tavily.com/
    https://docs.tavily.com/changelog
    https://docs.tavily.com/welcome
    https://docs.tavily.com/documentation/api-credits
    https://docs.tavily.com/documentation/help
    ...
    ```
  </Step>
</Steps>

## Filtering with Path Patterns

Use `select_paths` and `exclude_paths` to focus the map on specific sections of a site. These accept regex patterns.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.map(
    url="https://docs.tavily.com",
    select_paths=["/documentation/api-reference/.*", "/sdk/.*"],
    exclude_paths=["/changelog/.*"],
    max_depth=2,
    allow_external=False,
)
```

You can also use `instructions` for natural language guidance:

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.map(
    url="https://docs.tavily.com",
    instructions="Find pages related to the Python SDK",
    allow_external=False,
)
```

## Map + Extract: Targeted Content Retrieval

The real power of Map is combining it with Extract. First discover the site structure, then extract only the pages you care about.

```python theme={null}
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

map_response = client.map(
    url="https://docs.tavily.com",
    select_paths=["/documentation/api-reference/endpoint/.*"],
    max_depth=2,
    allow_external=False,
)

api_urls = map_response["results"][:5]

extract_response = client.extract(
    urls=api_urls,
    extract_depth="advanced",
)

for result in extract_response["results"]:
    print(f"\n--- {result['url']} ---")
    print(result["raw_content"][:300])
```

This two-step approach lets you process only relevant pages instead of crawling an entire site.

## Critical Knobs

<AccordionGroup>
  <Accordion title="max_depth">
    * **Default:** 1
    * Higher values discover more pages but take longer
  </Accordion>

  <Accordion title="limit">
    * **Default:** 50
    * Total URL cap before stopping
  </Accordion>

  <Accordion title="select_paths / exclude_paths">
    * Regex patterns to include or exclude URL paths
    * Example: `"/docs/.*"` to target docs, `"/blog/.*"` to skip blog posts
  </Accordion>

  <Accordion title="instructions">
    * Natural-language guidance for the mapper
    * Use when regex patterns aren't enough and you need semantic filtering
    * Example: `"Find pages related to the Python SDK"`
  </Accordion>
</AccordionGroup>

For the complete parameter list, see the [Map API reference](/documentation/api-reference/endpoint/map).

## Next Steps

<CardGroup cols={2}>
  <Card title="Map API Reference" icon="code" href="/documentation/api-reference/endpoint/map">
    Full parameter list, response schema, and interactive playground.
  </Card>

  <Card title="Extract API Tutorial" icon="file-lines" href="/examples/quick-tutorials/extract-api">
    Learn Extract in depth: batch processing, query-focused extraction, and more.
  </Card>

  <Card title="Python SDK Reference" icon="python" href="/sdk/python/reference">
    Python client methods, async support, and type details.
  </Card>

  <Card title="JavaScript SDK Reference" icon="js" href="/sdk/javascript/reference">
    JavaScript/TypeScript client methods and usage.
  </Card>
</CardGroup>

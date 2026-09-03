> 원본: https://exa.ai/docs/sdks/python-sdk.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Python SDK

> Install and use the Exa Python SDK

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

The official Python SDK for Exa. Search the web, get page contents, and get answers with citations.

<Card title="Get API Key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Get your API key from the dashboard
</Card>

## Install

<CodeGroup>
  ```bash pip theme={null}
  pip install exa-py
  ```

  ```bash uv theme={null}
  uv add exa-py
  ```
</CodeGroup>

Requires Python 3.9+

## Authentication

Set your API key as an environment variable:

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

## Quick Start

```python theme={null}
from exa_py import Exa

exa = Exa()
```

<Note>
  `Exa()` reads your key from the `EXA_API_KEY` environment variable. To set it explicitly instead, pass it inline: `Exa(api_key="your-api-key")`.
</Note>

## Recommended defaults

* Start with `exa.search(...)`.
* Use `type="auto"` unless you have a clear latency or synthesis reason to change it.
* Prefer `contents={"highlights": True}` for first integrations.
* Switch to `exa.get_contents(...)` only when you already know the URLs.
* Use `max_age_hours` for freshness control.

<Warning>
  On `/search`, `text`, `highlights`, and `summary` belong inside `contents`. On `/contents`,
  those same fields are top-level arguments.
</Warning>

## Search

Search the web and get page contents in one call.

<Tip>
  `highlights` is a strong default for retrieval workflows because it preserves the most relevant
  evidence without pulling full page text into every response.
</Tip>

```python theme={null}
results = exa.search(
    "blog post about artificial intelligence",
    contents={"highlights": True}
)
```

```python theme={null}
results = exa.search(
    "climate tech news",
    num_results=20,
    start_published_date="2024-01-01",
    include_domains=["techcrunch.com", "wired.com"],
    contents={"highlights": True}
)
```

```python theme={null}
structured_results = exa.search(
    "Who is the CEO of OpenAI?",
    type="deep",
    system_prompt="Prefer official sources and avoid duplicate results",
    output_schema={
        "type": "object",
        "properties": {
            "leader": {"type": "string"},
            "title": {"type": "string"},
            "source_count": {"type": "number"}
        },
        "required": ["leader", "title"]
    },
    contents={"highlights": True}
)

print(structured_results.output.content if structured_results.output else None)
```

<Note>
  `output_schema` and `system_prompt` work across all search types. Keep `output_schema` focused on
  the fields you want in `output.content`, and use `system_prompt` to guide the final returned
  result. For more demanding synthesis, prefer reasoning-focused search types like `deep-lite`,
  `deep`, or `deep-reasoning`. Do not add `citations`/`confidence` fields there;
  grounding is returned automatically in `output.grounding`. Adding citation/confidence fields to
  `output_schema` creates duplicate data, weaker structure, and less reliable attribution.
</Note>

Reasoning-focused search variants:

* `deep-lite`: lowest-latency deep-search mode
* `deep`: light mode
* `deep-reasoning`: base reasoning mode

<Note>
  Need streaming structured synthesis? The raw `/search` endpoint supports `stream: true` together
  with `outputSchema` and returns OpenAI-compatible SSE chunks. See the [Search API
  guide](/docs/reference/search-api-guide).
</Note>

## Get Contents

Get text, summaries, or highlights from URLs.

```python theme={null}
results = exa.get_contents(
    ["https://openai.com/research"],
    text=True
)
```

```python theme={null}
results = exa.get_contents(
    ["https://stripe.com/docs/api"],
    summary=True
)
```

```python theme={null}
results = exa.get_contents(
    ["https://arxiv.org/abs/2303.08774"],
    highlights=True
)
```

## Answer

Get answers to questions with citations.

```python theme={null}
response = exa.answer("What caused the 2008 financial crisis?")
print(response.answer)
```

```python theme={null}
for chunk in exa.stream_answer("Explain quantum computing"):
    print(chunk, end="", flush=True)
```

## Async

Use `AsyncExa` for async operations.

```python theme={null}
from exa_py import AsyncExa

exa = AsyncExa()

results = await exa.search(
    "machine learning startups",
    contents={"highlights": True}
)
```

## Deep reasoning

```python theme={null}
result = exa.search(
    "Summarize recent advances in fusion energy",
    type="deep-reasoning",
    output_schema={
        "type": "object",
        "properties": {
            "summary": {"type": "string"},
            "key_developments": {"type": "array", "items": {"type": "string"}}
        }
    },
    contents={"highlights": True}
)
```

## Resources

* [**GitHub**](https://github.com/exa-labs/exa-py) - View source code
* [**PyPI**](https://pypi.org/project/exa-py/) - View package

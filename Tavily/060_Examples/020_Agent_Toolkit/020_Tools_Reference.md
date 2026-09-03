> 원본: https://docs.tavily.com/examples/agent-toolkit/tools.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Tools Reference

> Optimized retrieval primitives for research agents: search, crawl, extract, and social media.

Each tool combines Tavily API endpoints with context engineering — formatting results for LLMs, managing token limits, deduplicating sources, and cleaning web noise. Your agent focuses on reasoning while the tools handle retrieval complexity.

| Scenario                                    | Tool                    |
| ------------------------------------------- | ----------------------- |
| "Answer this question with web research"    | `search_and_answer`     |
| "Research this topic from multiple angles"  | `search_dedup`          |
| "What does this website say?"               | `crawl_and_summarize`   |
| "Summarize these specific pages"            | `extract_and_summarize` |
| "What are people saying on Reddit/Twitter?" | `social_media_search`   |

***

## `search_and_answer`

Answer a question using web research. Optionally generates subqueries for comprehensive coverage, handles token limits, and synthesizes an answer with your chosen model.

### Parameters

| Parameter                  | Type         | Default   | Description                               |
| -------------------------- | ------------ | --------- | ----------------------------------------- |
| `query`                    | str          | Required  | The question to answer                    |
| `api_key`                  | str          | Required  | Tavily API key                            |
| `model_config`             | ModelConfig  | None      | LLM configuration for synthesis           |
| `max_number_of_subqueries` | int          | 2-4       | Number of subqueries to generate          |
| `output_schema`            | OutputSchema | None      | Pydantic model for structured output      |
| `token_limit`              | int          | 50000     | Maximum token budget for context          |
| `threshold`                | float        | 0.3       | Minimum relevance score                   |
| `topic`                    | str          | "general" | `"general"`, `"news"`, or `"finance"`     |
| `time_range`               | str          | None      | `"day"`, `"week"`, `"month"`, or `"year"` |
| `include_domains`          | list         | None      | Only search these domains                 |
| `exclude_domains`          | list         | None      | Exclude these domains                     |

### Example

```python theme={null}
from tavily_agent_toolkit import search_and_answer, ModelConfig, ModelObject

result = await search_and_answer(
    query="What are the pros and cons of Rust vs Go?",
    api_key="tvly-xxx",
    model_config=ModelConfig(model=ModelObject(model="anthropic:claude-sonnet-4-5")),
    max_number_of_subqueries=3,
)
print(result["answer"])
```

***

## `search_dedup`

Run multiple search queries in parallel and consolidate results. Deduplicates by URL and merges content chunks from the same source.

### Parameters

| Parameter           | Type       | Default    | Description                               |
| ------------------- | ---------- | ---------- | ----------------------------------------- |
| `queries`           | list\[str] | Required   | List of search queries                    |
| `api_key`           | str        | Required   | Tavily API key                            |
| `search_depth`      | str        | "advanced" | `"basic"` or `"advanced"`                 |
| `topic`             | str        | "general"  | `"general"`, `"news"`, or `"finance"`     |
| `max_results`       | int        | 5          | Results per query                         |
| `chunks_per_source` | int        | 3          | Content chunks per source                 |
| `time_range`        | str        | None       | `"day"`, `"week"`, `"month"`, or `"year"` |
| `include_domains`   | list       | None       | Only search these domains                 |
| `exclude_domains`   | list       | None       | Exclude these domains                     |

### Example

```python theme={null}
from tavily_agent_toolkit import search_dedup

results = await search_dedup(
    api_key="tvly-xxx",
    queries=[
        "transformer architecture explained",
        "attention mechanism neural networks",
        "BERT GPT comparison",
    ],
    search_depth="advanced",
    max_results=5,
)

for r in results["results"]:
    print(f"{r['title']}: {r['score']}")
```

***

## `crawl_and_summarize`

Crawl an entire website and summarize the content with your chosen model. Useful for documentation sites, knowledge bases, or product catalogs.

### Parameters

| Parameter       | Type         | Default  | Description                                   |
| --------------- | ------------ | -------- | --------------------------------------------- |
| `url`           | str          | Required | Website URL to crawl                          |
| `model_config`  | ModelConfig  | Required | LLM for summarization                         |
| `api_key`       | str          | Required | Tavily API key                                |
| `instructions`  | str          | None     | Specific extraction instructions              |
| `output_schema` | OutputSchema | None     | Pydantic model for structured output          |
| `max_depth`     | int          | 1-5      | How deep to crawl from starting URL           |
| `max_breadth`   | int          | 20       | Max pages to crawl per level                  |
| `limit`         | int          | 50       | Total max pages to crawl                      |
| `select_paths`  | list         | None     | Only crawl URLs matching these regex patterns |
| `exclude_paths` | list         | None     | Skip URLs matching these regex patterns       |

### Example

```python theme={null}
from tavily_agent_toolkit import crawl_and_summarize, ModelConfig, ModelObject

result = await crawl_and_summarize(
    url="https://docs.example.com",
    model_config=ModelConfig(model=ModelObject(model="anthropic:claude-sonnet-4-20250514")),
    instructions="Extract all API endpoints and their parameters",
    api_key="tvly-xxx",
    max_depth=2,
    select_paths=["/docs/.*", "/api/.*"],
)
print(result["summary"])
```

***

## `extract_and_summarize`

Extract content from specific URLs and summarize with your model. Use when you already know which pages have the information.

### Parameters

| Parameter           | Type         | Default  | Description                                |
| ------------------- | ------------ | -------- | ------------------------------------------ |
| `urls`              | list\[str]   | Required | URLs to extract (max 20)                   |
| `model_config`      | ModelConfig  | Required | LLM for summarization                      |
| `api_key`           | str          | Required | Tavily API key                             |
| `query`             | str          | None     | Focuses extraction on specific information |
| `output_schema`     | OutputSchema | None     | Pydantic model for structured output       |
| `chunks_per_source` | int          | 5        | Content chunks per source                  |
| `extract_depth`     | str          | "basic"  | `"basic"` or `"advanced"`                  |

### Example

```python theme={null}
from tavily_agent_toolkit import extract_and_summarize, ModelConfig, ModelObject

result = await extract_and_summarize(
    urls=["https://en.wikipedia.org/wiki/Artificial_intelligence"],
    model_config=ModelConfig(model=ModelObject(model="groq:llama-3.3-70b-versatile")),
    query="What are the main ethical concerns with AI?",
    api_key="tvly-xxx",
    chunks_per_source=5,
)
print(result["results"][0]["summary"])
```

***

## `social_media_search`

Search specific social platforms for discussions and content.

### Parameters

| Parameter             | Type | Default    | Description                                                                               |
| --------------------- | ---- | ---------- | ----------------------------------------------------------------------------------------- |
| `query`               | str  | Required   | Search query                                                                              |
| `api_key`             | str  | Required   | Tavily API key                                                                            |
| `platform`            | str  | "combined" | `"reddit"`, `"x"`, `"linkedin"`, `"tiktok"`, `"instagram"`, `"facebook"`, or `"combined"` |
| `include_raw_content` | bool | False      | Include full post content                                                                 |
| `max_results`         | int  | 5          | Number of results                                                                         |
| `time_range`          | str  | None       | `"day"`, `"week"`, `"month"`, or `"year"`                                                 |

### Example

```python theme={null}
from tavily_agent_toolkit import social_media_search

results = social_media_search(
    query="best practices for LLM fine-tuning",
    api_key="tvly-xxx",
    platform="reddit",
    max_results=10,
    time_range="month",
)
```

***

## Model Configuration

All tools that use an LLM accept a `ModelConfig`. Use the `"provider:model"` format, and optionally specify fallback models:

```python theme={null}
from tavily_agent_toolkit import ModelConfig, ModelObject

config = ModelConfig(
    model=ModelObject(model="openai:gpt-5.2"),
    fallback_models=[
        ModelObject(model="anthropic:claude-sonnet-4-20250514"),
        ModelObject(model="groq:llama-3.3-70b-versatile"),
    ],
    temperature=0.7,
)
```

**Retry behavior:**

* With `fallback_models`: each model gets 1 attempt before moving to the next
* Without `fallback_models`: primary model gets 1 retry (2 attempts total)

See the [GitHub README](https://github.com/tavily-ai/tavily-cookbook/tree/main/agent-toolkit#model-configuration) for the full list of 20+ supported providers.

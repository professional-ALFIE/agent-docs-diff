> 원본: https://docs.tavily.com/documentation/integrations/haystack.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Haystack

> Use Tavily inside Haystack pipelines with the `tavily-haystack` integration.

## Introduction

[Haystack](https://haystack.deepset.ai/) is an open-source framework for building production-ready LLM applications and RAG pipelines in Python.

Tavily integrates with Haystack through the [`tavily-haystack`](https://pypi.org/project/tavily-haystack/) package maintained by deepset. It exposes a `TavilyWebSearch` component that queries Tavily Search and returns Haystack `Document` objects alongside the source URLs.

You can also review the upstream integration page in the [Haystack integrations directory](https://haystack.deepset.ai/integrations/tavily).

## Installation

Install the integration package:

```bash theme={null}
pip install tavily-haystack
```

## Credentials

Set your Tavily API key as an environment variable:

```bash theme={null}
export TAVILY_API_KEY="tvly-your-api-key"
```

By default, `TavilyWebSearch` reads from `TAVILY_API_KEY`, but you can also pass the key explicitly with `Secret.from_token(...)`.

## Basic Usage

Use `TavilyWebSearch` to fetch web results as Haystack `Document` objects:

```python theme={null}
from haystack_integrations.components.websearch.tavily import TavilyWebSearch

web_search = TavilyWebSearch(top_k=5)

result = web_search.run(query="What is Haystack by deepset?")
documents = result["documents"]
links = result["links"]
```

If you want to configure Tavily directly inside the component, pass an API key and `search_params`:

```python theme={null}
from haystack.utils import Secret
from haystack_integrations.components.websearch.tavily import TavilyWebSearch

web_search = TavilyWebSearch(
    api_key=Secret.from_token("tvly-your-api-key"),
    top_k=5,
    search_params={"search_depth": "advanced"},
)
```

## Using Tavily in a Haystack Pipeline

Here is a simple RAG-style pipeline that searches the web with Tavily, builds a prompt from the returned documents, and sends the prompt to a chat model:

```python theme={null}
from haystack import Pipeline
from haystack.utils import Secret
from haystack.components.builders.chat_prompt_builder import ChatPromptBuilder
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.dataclasses import ChatMessage
from haystack_integrations.components.websearch.tavily import TavilyWebSearch

web_search = TavilyWebSearch(top_k=3)

prompt_template = [
    ChatMessage.from_system("You are a helpful assistant."),
    ChatMessage.from_user(
        "Given the information below:\n"
        "{% for document in documents %}{{ document.content }}\n{% endfor %}\n"
        "Answer the following question: {{ query }}\n"
        "Answer:"
    ),
]

prompt_builder = ChatPromptBuilder(
    template=prompt_template,
    required_variables={"query", "documents"},
)

llm = OpenAIChatGenerator(
    api_key=Secret.from_env_var("OPENAI_API_KEY"),
    model="gpt-4o-mini",
)

pipe = Pipeline()
pipe.add_component("search", web_search)
pipe.add_component("prompt_builder", prompt_builder)
pipe.add_component("llm", llm)
pipe.connect("search.documents", "prompt_builder.documents")
pipe.connect("prompt_builder.prompt", "llm.messages")

query = "What is Haystack by deepset?"
result = pipe.run(
    data={
        "search": {"query": query},
        "prompt_builder": {"query": query},
    }
)

print(result["llm"]["replies"][0].content)
```

> **Note:** This example uses `OpenAIChatGenerator`, so you will also need to set `OPENAI_API_KEY`.

## Async Usage

`TavilyWebSearch` also supports asynchronous execution with `run_async`:

```python theme={null}
import asyncio
from haystack_integrations.components.websearch.tavily import TavilyWebSearch

async def main():
    web_search = TavilyWebSearch(top_k=3)
    result = await web_search.run_async(query="What is Haystack by deepset?")
    print(f"Found {len(result['documents'])} documents")

asyncio.run(main())
```

## Key Parameters

* `api_key`: Tavily API key. Defaults to the `TAVILY_API_KEY` environment variable.
* `top_k`: Maximum number of search results to return. Defaults to `10`.
* `search_params`: Additional parameters forwarded to Tavily Search, including `search_depth`, `include_answer`, `include_raw_content`, `include_domains`, and `exclude_domains`.

For the full set of supported Tavily search options, see the [Tavily Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search).

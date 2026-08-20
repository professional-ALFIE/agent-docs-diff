> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Agent Toolkit

> Build production-grade research agents with battle-tested tools, model flexibility, and pre-built agent patterns.

<CardGroup cols={2}>
  <Card title="GitHub" icon="github" href="https://github.com/tavily-ai/tavily-cookbook/tree/main/agent-toolkit" horizontal>
    `/tavily-ai/tavily-cookbook/agent-toolkit`
  </Card>

  <Card title="PyPI" icon="python" href="https://pypi.org/project/tavily-agent-toolkit/" horizontal>
    `tavily-agent-toolkit`
  </Card>
</CardGroup>

## What Is the Agent Toolkit?

The Tavily Agent Toolkit is a Python library that gives your agents optimized research primitives on top of the Tavily API. Instead of wiring up raw API calls, managing token limits, deduplicating sources, and formatting results for LLMs yourself, the toolkit handles all of that so your agent can focus on reasoning.

It provides three layers:

| Layer                    | What It Does                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agents**               | Pre-built research strategies that combine internal knowledge with web research. Fast or deep multi-agent modes.                                               |
| **Tools**                | Optimized retrieval patterns: search, crawl, extract, social media. Each tool handles context engineering (formatting, dedup, token management) automatically. |
| **Bring Your Own Model** | Every tool that needs an LLM accepts a `ModelConfig`. Supports 20+ providers via LangChain with automatic fallback chains.                                     |

## Installation

```bash theme={null}
pip install tavily-agent-toolkit
```

For LLM features, install your preferred provider:

```bash theme={null}
pip install langchain-openai       # OpenAI
pip install langchain-anthropic    # Anthropic
pip install langchain-google-genai # Google
pip install langchain-groq         # Groq
```

## Available Tools

| Tool                    | When to Use                                           |
| ----------------------- | ----------------------------------------------------- |
| `search_and_answer`     | Answer questions with web research + LLM synthesis    |
| `search_dedup`          | Run multiple queries in parallel, deduplicate results |
| `crawl_and_summarize`   | Extract and summarize entire websites                 |
| `extract_and_summarize` | Get focused summaries from specific URLs              |
| `social_media_search`   | Search Reddit, X, LinkedIn, TikTok, and more          |

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

<Card title="Tools Reference" icon="wrench" href="/examples/agent-toolkit/tools">
  Full documentation for every tool: parameters, output shapes, and usage examples.
</Card>

## Pre-Built Agents

### `hybrid_research`

Combines your internal knowledge base with real-time web research. You provide a RAG function that queries your internal data — the agent identifies gaps and fills them with web research.

Two modes:

| Mode            | Best For                               | How It Works                                                              |
| --------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| **Fast**        | Quick answers, lower latency           | Internal RAG → generate subqueries → parallel web search → synthesize     |
| **Multi-Agent** | Comprehensive research, complex topics | Internal RAG → identify gaps → Tavily deep research endpoint → synthesize |

```python theme={null}
from tavily_agent_toolkit import hybrid_research, ModelConfig, ModelObject

result = await hybrid_research(
    api_key="tvly-xxx",
    query="What's our competitor's current pricing strategy?",
    model_config=ModelConfig(model=ModelObject(model="openai:gpt-5.2")),
    internal_rag_function=my_rag,
    mode="fast",
)
print(result["report"])
```

<Card title="Hybrid Research" icon="flask" href="/examples/agent-toolkit/hybrid-research">
  Deep dive into `hybrid_research`: modes, structured output, custom synthesis, and data enrichment patterns.
</Card>

## Model Configuration

All tools accept a `ModelConfig` for LLM operations. Use the `"provider:model"` format:

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

20+ providers are supported via LangChain's `init_chat_model`: OpenAI, Anthropic, Google, Groq, Mistral, Cohere, Together, Fireworks, AWS Bedrock, Azure, and more.

## Use-Case Recipes

Production-ready agent implementations. Each is available in both Anthropic SDK and LangGraph flavors.

<CardGroup cols={2}>
  <Card title="Chatbot" icon="message-bot" href="/examples/agent-toolkit/chatbot">
    Routes between quick search and deep research based on query complexity.
  </Card>

  <Card title="Company Intelligence" icon="building" href="/examples/agent-toolkit/company-intelligence">
    Crawls websites and searches the web for comprehensive company research.
  </Card>

  <Card title="Social Media Research" icon="hashtag" href="/examples/agent-toolkit/social-media-research">
    Searches across TikTok, Reddit, X, LinkedIn, and more for any topic.
  </Card>

  <Card title="Hybrid Research" icon="flask" href="/examples/agent-toolkit/hybrid-research">
    Combines internal data with web research for comprehensive reports.
  </Card>
</CardGroup>

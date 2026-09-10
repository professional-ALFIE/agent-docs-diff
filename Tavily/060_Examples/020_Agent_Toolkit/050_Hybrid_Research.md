> 원본: https://docs.tavily.com/examples/agent-toolkit/hybrid-research.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Hybrid Research

> Combine your internal knowledge base with real-time web research to produce comprehensive, grounded reports.

## What You'll Build

A research agent that merges your internal data (from a vector store, database, or any retrieval system) with live web research from Tavily. You provide a simple RAG function — the agent identifies gaps in your internal knowledge and fills them with web data, producing a comprehensive report with citations.

<Card title="View Source on GitHub" icon="github" href="https://github.com/tavily-ai/tavily-cookbook/tree/main/agent-toolkit/agents" horizontal />

## Why Hybrid Research?

Your internal data is your competitive edge — customer records, product specs, domain expertise. But it's never complete. Markets shift, competitors launch products, and your knowledge base can't keep up.

The hybrid approach gives you:

* **Grounded answers** rooted in your proprietary data
* **Complete coverage** with real-time web context
* **Enrichment opportunities** by storing relevant web findings back into your knowledge base

## Modes

<Tabs>
  <Tab title="Fast Mode">
    Best for quick answers, lower latency, and cost-sensitive applications.

    ```mermaid theme={null}
    flowchart LR
        A[Query] --> B[Internal RAG]
        B --> C[Generate Subqueries]
        C --> D["Parallel Web Search + Dedup"]
        B --> E[Synthesize]
        D --> E
        E --> F["Report + Sources"]
    ```

    1. Query your internal RAG
    2. Generate subqueries based on what's missing
    3. Parallel web search with deduplication
    4. Synthesize everything into a report

    ```python theme={null}
    from tavily_agent_toolkit import hybrid_research, ModelConfig, ModelObject

    def my_rag(query: str) -> str:
        results = vector_store.similarity_search(query, k=5)
        return "\n".join([doc.page_content for doc in results])

    result = await hybrid_research(
        api_key="tvly-xxx",
        query="What's our competitor's current pricing strategy?",
        model_config=ModelConfig(
            model=ModelObject(model="openai:gpt-5.2")
        ),
        internal_rag_function=my_rag,
        mode="fast",
    )

    print(result["report"])
    print(f"Sources: {len(result['web_sources'])} web pages")
    ```
  </Tab>

  <Tab title="Multi-Agent Mode">
    Best for comprehensive research, complex topics, and when accuracy matters more than speed.

    This mode uses Tavily's deep research endpoint — a multi-agent system that orchestrates sub-agents to iteratively search, extract, and analyze.

    ```mermaid theme={null}
    flowchart TD
        A[Query] --> B["Agent 1: Internal RAG"]
        B --> C[Identify Knowledge Gaps]
        C --> D["Agent 2: Tavily Deep Research"]
        D --> E["Sub-agents: search, extract, analyze, iterate"]
        E --> F["Synthesize Internal + Web"]
        F --> G["Report + Sources"]
    ```

    1. Query your internal RAG
    2. LLM identifies knowledge gaps
    3. Tavily's deep research endpoint fills those gaps
    4. Synthesize into a comprehensive report

    ```python theme={null}
    result = await hybrid_research(
        api_key="tvly-xxx",
        query="Full competitive analysis of the AI search market",
        model_config=ModelConfig(
            model=ModelObject(model="anthropic:claude-sonnet-4-20250514")
        ),
        internal_rag_function=my_rag,
        mode="multi_agent",
    )
    ```
  </Tab>
</Tabs>

## Parameters

| Parameter                   | Type         | Default  | Description                                                     |
| --------------------------- | ------------ | -------- | --------------------------------------------------------------- |
| `api_key`                   | str          | Required | Tavily API key                                                  |
| `query`                     | str          | Required | The research question                                           |
| `model_config`              | ModelConfig  | Required | Your LLM configuration                                          |
| `internal_rag_function`     | Callable     | Required | Function that takes a query string and returns relevant context |
| `mode`                      | str          | `"fast"` | `"fast"` or `"multi_agent"`                                     |
| `output_schema`             | OutputSchema | None     | Pydantic model for structured output                            |
| `research_synthesis_prompt` | str          | None     | Custom instructions for how the report is structured            |

### Return Value

```python theme={null}
{
    "report": str | BaseModel,  # Synthesized report (or structured output)
    "web_sources": [            # Sources used from web research
        {"title": "...", "url": "..."},
        ...
    ]
}
```

## Structured Output

Use `output_schema` to get consistent, parseable results:

```python theme={null}
from pydantic import Field
from tavily_agent_toolkit import OutputSchema

class CompetitorAnalysis(OutputSchema):
    company_name: str = Field(description="Name of the competitor")
    products: list[str] = Field(description="Main products or services")
    pricing: str = Field(description="Pricing strategy or model")
    strengths: list[str] = Field(description="Key competitive strengths")
    weaknesses: list[str] = Field(description="Known weaknesses or gaps")

result = await hybrid_research(
    api_key="tvly-xxx",
    query="Analyze Perplexity as a competitor",
    model_config=ModelConfig(
        model=ModelObject(model="groq:openai/gpt-oss-120b")
    ),
    internal_rag_function=my_rag,
    mode="fast",
    output_schema=CompetitorAnalysis,
)

analysis = CompetitorAnalysis.model_validate_json(result["report"])
print(f"Strengths: {analysis.strengths}")
```

## Custom Synthesis

Guide how the report is structured with `research_synthesis_prompt`:

```python theme={null}
result = await hybrid_research(
    api_key="tvly-xxx",
    query="What are the latest developments in AI agents?",
    model_config=ModelConfig(
        model=ModelObject(model="groq:llama-3.3-70b-versatile")
    ),
    internal_rag_function=my_rag,
    mode="fast",
    research_synthesis_prompt="""
    Structure the report as:
    1. Executive Summary (2-3 sentences)
    2. Key Developments (bullet points)
    3. Impact on Our Product (specific recommendations)
    4. Sources

    Keep it under 500 words. Focus on actionable insights.
    """,
)
```

## Data Enrichment Pattern

When your agent searches the web to fill knowledge gaps, those results are relevant to your users — otherwise the agent wouldn't have needed them. This creates a flywheel:

1. Agent queries internal data and finds gaps
2. Agent searches the web to fill gaps
3. Web results get synthesized into the answer
4. **Store those web results internally** for future queries

```python theme={null}
result = await hybrid_research(...)

for source in result["web_sources"]:
    store_in_knowledge_base(
        url=source["url"],
        title=source["title"],
        query_context=original_query,
    )
```

Over time, your knowledge base grows with exactly the information your users need.

## Implementing Your RAG Function

The `internal_rag_function` is simple: take a query, return relevant context as a string.

```python theme={null}
def my_rag(query: str) -> str:
    results = your_retrieval_method(query)
    return "\n\n".join([
        f"Source: {r.source}\n{r.content}"
        for r in results
    ])
```

**Tips:**

* Return 3-10 relevant chunks — enough context without overwhelming
* Include source metadata (file names, URLs, doc IDs) for traceability
* The hybrid researcher handles the rest: gap detection, web search, synthesis

## Next Steps

<CardGroup cols={2}>
  <Card title="Tools Reference" icon="wrench" href="/examples/agent-toolkit/tools">
    Deep dive into search\_and\_answer, search\_dedup, and the other retrieval primitives.
  </Card>

  <Card title="Chatbot" icon="message-bot" href="/examples/agent-toolkit/chatbot">
    See how the chatbot routes between quick search and deep research.
  </Card>
</CardGroup>

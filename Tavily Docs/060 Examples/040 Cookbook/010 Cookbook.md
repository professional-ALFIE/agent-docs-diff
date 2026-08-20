> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Cookbook

> Guided Jupyter notebooks covering Tavily's APIs — from fundamentals to advanced research patterns, crawling pipelines, and framework integrations.

Hands-on notebooks you can run locally or on [Colab](https://colab.research.google.com/). Each notebook focuses on a single concept with detailed code and explained outputs.

<Card title="View all notebooks on GitHub" icon="github" href="https://github.com/tavily-ai/tavily-cookbook/tree/main/cookbooks" horizontal />

## Getting Started

<CardGroup cols={2}>
  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/getting-started/search-extract-crawl.ipynb" title="Search, Extract & Crawl" horizontal>
    Core API walkthrough — learn the three foundational endpoints with guided examples.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/getting-started/web-agent-tutorial.ipynb" title="Web Agent" horizontal>
    Build an LLM-powered web research agent that uses Tavily tools end-to-end.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/getting-started/hybrid-agent-tutorial.ipynb" title="Hybrid Agent" horizontal>
    Combine a Chroma vector store with Tavily web search for hybrid answers.
  </Card>
</CardGroup>

## Search

<CardGroup cols={2}>
  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/search/product_news_tracker.ipynb" title="Product News Tracker" horizontal>
    Track product updates using domain-filtered and news-specific search parameters.
  </Card>
</CardGroup>

## Research

<CardGroup cols={2}>
  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/research/polling.ipynb" title="Polling" horizontal>
    Submit async research jobs and poll for completion — ideal for background processing.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/research/streaming.ipynb" title="Streaming" horizontal>
    Stream real-time progress events and answers during research execution.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/research/structured_output.ipynb" title="Structured Output" horizontal>
    Get research results in custom JSON schemas with Pydantic-style definitions.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/research/query_refinement.ipynb" title="Query Refinement" horizontal>
    Multi-turn clarification flow that refines user prompts before running research.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/research/hybrid_research.ipynb" title="Hybrid Research" horizontal>
    Combine Tavily research with your internal data for comprehensive reports.
  </Card>
</CardGroup>

## Crawl

<CardGroup cols={2}>
  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/crawl/getting_started.ipynb" title="Crawl Fundamentals" horizontal>
    Crawl and map basics — depth, breadth, and path controls with visualization.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/crawl/crawl_to_rag.ipynb" title="Crawl to RAG" horizontal>
    Full pipeline from website crawl to chunked embeddings to Q\&A with a vector store.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/crawl/agent_grounding.ipynb" title="Agent Grounding" horizontal>
    LangGraph-style research agent that uses search, map, and extract for autonomous web research.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/crawl/data_collection.ipynb" title="Data Collection" horizontal>
    Crawl websites and export pages as organized PDF files for offline analysis.
  </Card>
</CardGroup>

## Integrations

<CardGroup cols={2}>
  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/integrations/langchain/langchain.ipynb" title="LangChain" horizontal>
    LangChain tool wrappers for Search, Extract, Map, and Crawl with filtered and news variants.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/mcp/remote-mcp.ipynb" title="Remote MCP" horizontal>
    Configure Tavily's remote MCP server and call it from an OpenAI client.
  </Card>

  <Card href="https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/integrations/aws-strands/deep-research.ipynb" title="AWS Strands" horizontal>
    Deep research agent using AWS Strands with Bedrock and Tavily search, extract, and crawl tools.
  </Card>
</CardGroup>

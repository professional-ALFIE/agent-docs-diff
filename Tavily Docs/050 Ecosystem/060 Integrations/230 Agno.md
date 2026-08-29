> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Agno

> Tavily is now available for integration through Agno.

## Introduction

Integrate [Tavily with Agno](https://docs.agno.com/tools/toolkits/search/tavily#tavily) to enhance your AI agents with powerful web search capabilities. Agno provides a lightweight library for building agents with memory, knowledge, tools, and reasoning, making it easy to incorporate real-time web search and data extraction into your AI applications.

## Step-by-Step Integration Guide

### Step 1: Install Required Packages

Install the necessary Python packages:

```bash theme={null}
pip install agno tavily-python
```

### Step 2: Set Up API Keys

* **Tavily API Key:** [Get your Tavily API key here](https://app.tavily.com/home)
* **OpenAI API Key:** [Get your OpenAI API key here](https://platform.openai.com/account/api-keys)

Set these as environment variables in your terminal or add them to your environment configuration file:

```bash theme={null}
export TAVILY_API_KEY=your_tavily_api_key
export OPENAI_API_KEY=your_openai_api_key
```

### Step 3: Initialize Agno Agent with Tavily Tools

```python theme={null}
from agno.agent import Agent
from agno.tools.tavily import TavilyTools
import os

# Initialize the agent with Tavily tools
agent = Agent(
    tools=[TavilyTools(
        search=True,                    # Enable search functionality
        max_tokens=8000,                # Increase max tokens for more detailed results
        search_depth="advanced",        # Use advanced search for comprehensive results
        format="markdown"               # Format results as markdown
    )],
    show_tool_calls=True
)
```

### Step 4: Example Use Cases

```python theme={null}
# Example 1: Basic search with default parameters
agent.print_response("Latest developments in quantum computing", markdown=True)

# Example 2: Market research with multiple parameters
agent.print_response(
    "Analyze the competitive landscape of AI-powered customer service solutions in 2024, "
    "focusing on market leaders and emerging trends",
    markdown=True
)

# Example 3: Technical documentation search
agent.print_response(
    "Find the latest documentation and tutorials about Python async programming, "
    "focusing on asyncio and FastAPI",
    markdown=True
)

# Example 4: News aggregation
agent.print_response(
    "Gather the latest news about artificial intelligence from tech news websites "
    "published in the last week",
    markdown=True
)
```

## Additional Use Cases

1. **Content Curation**: Gather and organize information from multiple sources
2. **Real-time Data Integration**: Keep your AI agents up-to-date with the latest information
3. **Technical Documentation**: Search and analyze technical documentation
4. **Market Analysis**: Conduct comprehensive market research and analysis

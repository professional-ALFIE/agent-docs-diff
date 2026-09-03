> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Google ADK

> Connect your Google ADK agent to Tavily's AI-focused search, extraction, and crawling platform for real-time web intelligence.

## Introduction

The Tavily MCP Server connects your ADK agent to Tavily's AI-focused search, extraction, and crawling platform. This gives your agent the ability to perform real-time web searches, intelligently extract specific data from web pages, and crawl or create structured maps of websites.

## Prerequisites

Before you begin, make sure you have:

* Python 3.9 or later
* pip for installing packages
* A [Tavily API key](https://app.tavily.com/home) (sign up for free if you don't have one)
* A [Gemini API key](https://aistudio.google.com/app/apikey) for Google AI Studio

## Installation

Install ADK by running:

```bash theme={null}
pip install google-adk mcp
```

## Building Your Agent

### Step 1: Create an Agent Project

Run the `adk create` command to start a new agent project:

```bash theme={null}
adk create my_agent
```

This creates a new directory with the following structure:

```
my_agent/
    agent.py      # main agent code
    .env          # API keys or project IDs
    __init__.py
```

### Step 2: Update Your Agent Code

Edit the `my_agent/agent.py` file to integrate Tavily. Choose either **Remote MCP Server** or **Local MCP Server**:

<CodeGroup>
  ```python Remote MCP Server theme={null}
  from google.adk.agents import Agent
  from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
  from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
  import os

  # Get API key from environment
  TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

  root_agent = Agent(
      model="gemini-2.5-pro",
      name="tavily_agent",
      instruction="You are a helpful assistant that uses Tavily to search the web, extract content, and explore websites. Use Tavily's tools to provide up-to-date information to users.",
      tools=[
          MCPToolset(
              connection_params=StreamableHTTPServerParams(
                  url="https://mcp.tavily.com/mcp/",
                  headers={
                      "Authorization": f"Bearer {TAVILY_API_KEY}",
                  },
              ),
          )
      ],
  )
  ```

  ```python Local MCP Server theme={null}
  from google.adk.agents import Agent
  from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
  from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
  from mcp import StdioServerParameters
  import os

  # Get API key from environment
  TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

  root_agent = Agent(
      model="gemini-2.5-pro",
      name="tavily_agent",
      instruction="You are a helpful assistant that uses Tavily to search the web, extract content, and explore websites.",
      tools=[
          MCPToolset(
              connection_params=StdioConnectionParams(
                  server_params=StdioServerParameters(
                      command="npx",
                      args=[
                          "-y",
                          "tavily-mcp@latest",
                      ],
                      env={
                          "TAVILY_API_KEY": TAVILY_API_KEY,
                      }
                  ),
                  timeout=30,
              ),
          )
      ],
  )
  ```
</CodeGroup>

### Step 3: Set Your API Keys

Update the `my_agent/.env` file with your API keys:

```bash theme={null}
echo 'GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"' >> my_agent/.env
echo 'TAVILY_API_KEY="YOUR_TAVILY_API_KEY"' >> my_agent/.env
```

Or manually edit the `.env` file:

```
GOOGLE_API_KEY="your_gemini_api_key_here"
TAVILY_API_KEY="your_tavily_api_key_here"
```

### Step 4: Run Your Agent

You can run your ADK agent in two ways:

#### Run with Command-Line Interface

Run your agent using the `adk run` command:

```bash theme={null}
adk run my_agent
```

This starts an interactive command-line interface where you can chat with your agent and test Tavily's capabilities.

#### Run with Web Interface

Start the ADK web interface for a visual testing experience:

```bash theme={null}
adk web --port 8000
```

**Note:** Run this command from the parent directory that contains your `my_agent/` folder. For example, if your agent is inside `agents/my_agent/`, run `adk web` from the `agents/` directory.

This starts a web server with a chat interface. Access it at `http://localhost:8000`, select your agent from the dropdown, and start chatting.

## Example Usage

Once your agent is set up and running, you can interact with it through the command-line interface or web interface. Here's a simple example:

**User Query:**

```
Find all documentation pages on tavily.com and provide instructions on how to get started with Tavily
```

The agent automatically combines multiple Tavily tools to provide comprehensive answers, making it easy to explore websites and gather information without manual navigation.

<img src="https://mintcdn.com/tavilyai/6_GM_pQOTDBhyG2t/images/google-adk.png?fit=max&auto=format&n=6_GM_pQOTDBhyG2t&q=85&s=32daff4af3598c46f1bedae141666bc9" alt="Tavily-ADK" width="800" height="500" data-path="images/google-adk.png" />

## Available Tools

Once connected, your agent gains access to Tavily's powerful web intelligence tools:

### tavily-search

Execute a search query to find relevant information across the web.

### tavily-extract

Extract structured data from any web page. Extract text, links, and images from single pages or batch process multiple URLs efficiently.

### tavily-map

Traverses websites like a graph and can explore hundreds of paths in parallel with intelligent discovery to generate comprehensive site maps.

### tavily-crawl

Traversal tool that can explore hundreds of paths in parallel with built-in extraction and intelligent discovery.

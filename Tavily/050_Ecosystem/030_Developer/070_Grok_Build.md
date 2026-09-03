> 원본: https://docs.tavily.com/documentation/integrations/grok-build.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Grok Build

> Add real-time web search, extraction, crawling, and deep research to Grok Build, xAI's terminal coding agent, through the official Tavily plugin.

<CardGroup cols={1}>
  <Card title="Get API Key" icon="key" href="https://app.tavily.com" horizontal>
    Sign up at tavily.com
  </Card>
</CardGroup>

## Introduction

[Grok Build](https://x.ai/cli) is xAI's terminal-based coding agent. It runs as a fullscreen, mouse-interactive TUI that understands your codebase, edits files, executes shell commands, and manages long-running tasks.

Tavily is available as an [official plugin](https://github.com/tavily-ai/tavily-grok-plugin) in the Grok Build Plugin Marketplace. The plugin connects Grok Build to Tavily's hosted MCP server and bundles Tavily skills for general web research, developer workflows, and specialized research tasks.

<Frame>
  <video controls preload="metadata" aria-label="Installing and using the Tavily plugin in Grok Build">
    <source src="https://mintcdn.com/tavilyai/T_WRWoY4A-aaXtU8/images/grok-build.mp4?fit=max&auto=format&n=T_WRWoY4A-aaXtU8&q=85&s=7d15432b65adeeccf028facdfdced467" type="video/mp4" data-path="images/grok-build.mp4" />
  </video>
</Frame>

## What the Tavily plugin adds

### Tools

| Tool              | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `tavily_search`   | Search the web for current, relevant sources with domain and date filters |
| `tavily_extract`  | Extract clean, structured content from one or more webpages               |
| `tavily_map`      | Discover URLs and understand a website's structure                        |
| `tavily_crawl`    | Crawl multiple pages and retrieve their content                           |
| `tavily_research` | Produce comprehensive multi-source research with citations                |

### Skills

| Skill                             | What it does                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `tavily-web`                      | Coordinates Tavily tools for search, extraction, mapping, crawling, and research |
| `tavily-best-practices`           | Helps developers build production-ready Tavily integrations                      |
| `academic-scientific-research`    | Finds, screens, and synthesizes academic papers and scientific literature        |
| `investment-research-briefs`      | Creates company, sector, portfolio, and investment research briefs               |
| `product-competitor-intelligence` | Compares products, pricing, positioning, features, and competitors               |
| `sales-account-intelligence`      | Builds sales-ready company, prospect, and buyer intelligence                     |
| `threat-intelligence-enrichment`  | Enriches CVEs, IOCs, malware, threat actors, and security incidents              |
| `vendor-risk-kyc-screening`       | Screens companies and executives for vendor risk and KYC concerns                |

## Requirements

* Grok Build installed locally
* An account on [x.ai](https://x.ai)
* A Tavily account

## Authentication

The plugin connects only to Tavily's hosted MCP endpoint at `https://mcp.tavily.com/mcp`. Authentication is handled through the MCP authorization flow — on first connection, Grok Build opens Tavily's authorization page in your browser. Sign in to connect your Tavily account; no API key setup is required.

## Setup

<AccordionGroup>
  <Accordion title="Step 1: Install Grok Build">
    If Grok Build is not installed yet, install it first:

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    On Windows:

    ```powershell theme={null}
    irm https://x.ai/cli/install.ps1 | iex
    ```

    On first launch, Grok opens a browser for authentication.
  </Accordion>

  <Accordion title="Step 2: Open the plugin manager">
    Inside Grok Build, type:

    ```text theme={null}
    /plugin
    ```
  </Accordion>

  <Accordion title="Step 3: Search for Tavily and install">
    Search for **Tavily** in the marketplace and install the plugin.
  </Accordion>

  <Accordion title="Step 4: Connect your Tavily account">
    On first connection, Grok Build opens Tavily's authorization flow in your browser. Sign in to connect your Tavily account.
  </Accordion>

  <Accordion title="Step 5: Verify the plugin is working">
    Ask Grok Build a current-events question, for example:

    ```text theme={null}
    Use Tavily to search for the latest Model Context Protocol announcements and cite the sources.
    ```

    Grok Build should call `tavily_search` and return grounded results with sources.
  </Accordion>
</AccordionGroup>

## Example prompts

```text theme={null}
Search for the latest changes to the Model Context Protocol and cite the primary sources.
```

```text theme={null}
Research the leading agent observability platforms and compare their capabilities with citations.
```

```text theme={null}
Find recent papers on retrieval-augmented generation and summarize the strongest evidence.
```

## Learn more

* [Grok Build documentation](https://docs.x.ai/build/overview)
* [Grok Build Plugin Marketplace](https://github.com/xai-org/plugin-marketplace)
* [Tavily plugin for Grok Build](https://github.com/tavily-ai/tavily-grok-plugin)
* [Tavily MCP Documentation](/documentation/mcp)
* [Tavily API Reference](/documentation/api-reference/introduction)

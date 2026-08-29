> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Portkey

> Use Tavily with Portkey either through the Tavily MCP server or the Tavily Online Search plugin.

<CardGroup cols={2}>
  <Card title="Portkey plugin docs" icon="arrow-up-right-from-square" href="https://portkey.ai/docs/integrations/plugins/tavily#tavily-online-search" horizontal>
    Tavily Online Search
  </Card>

  <Card title="Get API Key" icon="key" href="https://app.tavily.com" horizontal>
    Sign up at tavily.com
  </Card>
</CardGroup>

## Introduction

[Portkey](https://portkey.ai/) is an AI gateway and agent platform for routing, guardrails, observability, and agent integrations.

There are **two ways** to use Tavily in Portkey:

1. **Tavily MCP server** — connect Tavily through Portkey's MCP support to expose Tavily-native tools like `tavily_search`, `tavily_extract`, `tavily_crawl`, `tavily_map`, and `tavily_research`.
2. **Tavily Online Search plugin** — use Tavily as a Portkey plugin/guardrail to inject fresh web search context into model requests.

<Tip>
  Use the **MCP server** when you want explicit tool calling and full Tavily tool access. Use the **plugin** when you want Portkey to automatically enrich prompts with live web context inside a config.
</Tip>

## Option 1: Tavily MCP server

Portkey supports the [Tavily MCP server](https://portkey.ai/docs/integrations/mcp-servers/tavily-mcp-server), which is the best fit when your agent should call Tavily as a tool.

With this setup, you can expose Tavily's remote tools inside Portkey, including:

* `tavily_search`
* `tavily_extract`
* `tavily_crawl`
* `tavily_map`
* `tavily_research`

Use this option when you want:

* Native tool calling
* Access to multiple Tavily capabilities beyond search
* Agent workflows that decide when to call Tavily directly

Read the full setup guide here:

* [Portkey: Tavily MCP server](https://portkey.ai/docs/integrations/mcp-servers/tavily-mcp-server)
* [Tavily MCP documentation](/documentation/mcp)

## Option 2: Tavily Online Search plugin

Portkey also offers a [Tavily Online Search plugin](https://portkey.ai/docs/integrations/plugins/tavily#tavily-online-search) that works through Portkey's plugin and guardrail system.

This option is ideal when you want Portkey to fetch live web information and attach it to a model request automatically, without building a separate tool-calling flow.

### Setup overview

1. **Enable the Tavily plugin** in Portkey and connect your [Tavily API key](https://app.tavily.com/home).
2. **Create a Tavily guardrail** and configure search behavior such as:
   * search depth
   * number of results
   * recency and geography filters
   * domain allow/block lists
   * content enrichment options
3. **Add the guardrail to a Portkey config**.
4. **Use that config in your requests** so Portkey injects Tavily results automatically.

### How the plugin works

When the Tavily Online Search plugin runs, Portkey enriches the request with Tavily search output before the model answers. This gives your model access to fresh web context while still using Portkey configs and guardrails as the control layer.

Use this option when you want:

* Search augmentation without explicit tool calls
* Centralized control through Portkey guardrails and configs
* A simpler way to add live web context to standard model requests

Read the full setup guide here:

* [Portkey: Tavily Online Search plugin](https://portkey.ai/docs/integrations/plugins/tavily#tavily-online-search)

## Which one should you use?

| If you need                                            | Recommended Portkey integration |
| ------------------------------------------------------ | ------------------------------- |
| Full Tavily tool access for agents                     | **Tavily MCP server**           |
| Search context injected into normal model requests     | **Tavily Online Search plugin** |
| Search, extract, crawl, map, and research tools        | **Tavily MCP server**           |
| Guardrail-driven online search inside a Portkey config | **Tavily Online Search plugin** |

## Learn more

* [Portkey documentation](https://portkey.ai/docs)
* [Portkey: Tavily MCP server](https://portkey.ai/docs/integrations/mcp-servers/tavily-mcp-server)
* [Portkey: Tavily Online Search plugin](https://portkey.ai/docs/integrations/plugins/tavily#tavily-online-search)
* [Tavily API documentation](/documentation/api-reference/introduction)
* [Tavily MCP documentation](/documentation/mcp)

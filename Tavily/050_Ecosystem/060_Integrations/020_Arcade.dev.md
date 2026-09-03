> 원본: https://docs.tavily.com/documentation/integrations/arcade-dev.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Arcade.dev

> Connect Tavily to Arcade.dev MCP Gateway for governed web search, extraction, crawling, mapping, and research.

<Frame caption="Tavily on [Arcade.dev](https://www.arcade.dev/tools/tavily)">
  <img src="https://mintcdn.com/tavilyai/BvSFqeBV3MsqKhxR/images/arcade.png?fit=max&auto=format&n=BvSFqeBV3MsqKhxR&q=85&s=5f5b196ff26e2ef59d27bdefebb73815" alt="Tavily on Arcade" width="2924" height="1284" data-path="images/arcade.png" />
</Frame>

## Overview

[Arcade.dev](https://www.arcade.dev/) is an MCP runtime platform for connecting agents to MCP servers through a managed **MCP Gateway**. Tavily is available as a [verified partner MCP server on Arcade](https://www.arcade.dev/tools/tavily), so you can register Tavily's remote MCP server once and expose its web intelligence tools through Arcade.dev to all of your agents.

Use this integration when you want Tavily behind the same Arcade gateway as your other tools. Your agent connects to Arcade, Arcade routes Tavily tool calls to the Tavily MCP server, and Arcade applies its gateway controls across the full tool stack.

## How it works

1. Generate a Tavily MCP server URL with your Tavily API key.
2. Add that URL to Arcade as a **Remote MCP** server.
3. Add Tavily to an Arcade **MCP Gateway** with any other servers your agent needs.
4. Connect your MCP client or agent framework to the Arcade gateway URL.

This gives your agent one MCP endpoint for Tavily, plus other tools such as Google Docs, Slack, GitHub, etc., while Arcade handles gateway-level authorization, access control, and audit logging.

## Available Tools

After Tavily is registered in Arcade, your agent can call these tools through the gateway:

| Tool              | Description                                        |
| ----------------- | -------------------------------------------------- |
| `Tavily.Search`   | Real-time web search with agent-optimized ranking. |
| `Tavily.Extract`  | Extract structured content from specific URLs.     |
| `Tavily.Crawl`    | Crawl a site and return content across pages.      |
| `Tavily.Map`      | Map the structure of a site or domain.             |
| `Tavily.Research` | Multi-source deep research across the web.         |

## Prerequisites

* An [Arcade.dev account](https://www.arcade.dev/) with access to the Dashboard.
* A [Tavily API key](https://app.tavily.com/home).

## Setup

<Steps>
  <Step title="Generate your Tavily MCP URL">
    In the [Tavily dashboard](https://app.tavily.com/home), go to **Overview** → **Remote MCP** and copy the generated URL. It should use this format:

    ```
    https://mcp.tavily.com/mcp/?tavilyApiKey=YOUR_API_KEY
    ```

    Treat this URL as a secret because it contains your Tavily API key. See the [Tavily MCP documentation](/documentation/mcp) for additional configuration options.
  </Step>

  <Step title="Add Tavily as a remote MCP server in Arcade">
    In the [Arcade Dashboard](https://api.arcade.dev/dashboard), go to **Servers** → **Add Server** → **Remote MCP**. Paste the Tavily MCP URL from the previous step and save.

    Refer to the [Arcade Tavily integration documentation](https://docs.arcade.dev/en/resources/integrations/search/tavily) for the full walkthrough and to [Add remote MCP servers](https://docs.arcade.dev/guides/mcp-gateways/add-remote-servers) for advanced settings such as retries, OAuth, and custom headers.
  </Step>

  <Step title="Verify the Tavily tools">
    Arcade discovers the Tavily tools automatically after registration. Confirm that `Tavily.Search`, `Tavily.Extract`, `Tavily.Crawl`, `Tavily.Map`, and `Tavily.Research` appear in the Arcade Playground and in the MCP Gateway tool picker.
  </Step>

  <Step title="Create an MCP Gateway">
    Go to **MCP Gateways** → **Create Gateway** and select Tavily plus any other MCP servers your agent needs, such as Google Docs, Slack, Salesforce, or GitHub.

    Set the authentication mode to **Arcade Auth** when you want users to authenticate with their Arcade account and have Arcade apply gateway-level controls at runtime.
  </Step>

  <Step title="Connect your agent to the gateway">
    Once the gateway is published, Arcade gives you a single Streamable HTTP URL of the form:

    ```
    https://api.arcade.dev/mcp/<YOUR-GATEWAY-SLUG>
    ```

    Point any MCP-compatible client at this URL, including **Cursor**, **Claude Desktop**, **Codex**, **VS Code**, or any other application.
  </Step>
</Steps>

## Example workflow

An agent connected to your Arcade gateway can use Tavily to research a topic, extract source content, and then call other Arcade tools to turn that research into action. For example, the agent can:

* Call `Tavily.Search` to find current sources.
* Call `Tavily.Extract` to read the most relevant pages.
* Draft findings into Google Docs or send a summary to Slack through the same Arcade gateway.

## Benefits of Tavily + Arcade

* **Centralized governance:** Authorization, user authentication, access control, and audit logging are handled uniformly by Arcade's runtime across Tavily and every other server in the gateway.
* **Composable tool stacks:** Pair Tavily's web research tools with Arcade's productivity, communications, and CRM integrations behind one MCP endpoint.
* **Simple client configuration:** MCP-compatible clients connect to the Arcade gateway URL instead of configuring Tavily separately in every client.

## Resources

* [Arcade Tavily integration docs](https://docs.arcade.dev/en/resources/integrations/search/tavily)
* [Tavily on Arcade Tools](https://www.arcade.dev/tools/tavily)
* [Tavily MCP Documentation](/documentation/mcp)

> 원본: https://exa.ai/docs/reference/exa-mcp.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Web Search MCP

> Complete setup guide for Exa MCP Server. Connect Claude Desktop, Cursor, VS Code, and 10+ AI assistants to Exa's web search, fetching, Exa Agent, and Exa Connect tools.

Exa MCP connects AI assistants to Exa's search capabilities, including web search, code search, [Exa Agent](/docs/reference/agent-api-guide), and [Exa Connect](/docs/reference/agent-api/connect/overview). It is open-source and available on [GitHub](https://github.com/exa-labs/exa-mcp-server).

<br />

# Installation

Exa's Search MCP can be installed in any MCP client with the server URL: `https://mcp.exa.ai/mcp`

<CardGroup cols={2}>
  <Card
    title="Install in Cursor"
    icon={
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466.73 532.09">
    <path
      d="M457.43 125.94 244.42 2.96a22.127 22.127 0 0 0-22.12 0L9.3 125.94C3.55 129.26 0 135.4 0 142.05v247.99c0 6.65 3.55 12.79 9.3 16.11l213.01 122.98a22.127 22.127 0 0 0 22.12 0l213.01-122.98c5.75-3.32 9.3-9.46 9.3-16.11V142.05c0-6.65-3.55-12.79-9.3-16.11h-.01Zm-13.38 26.05L238.42 508.15c-1.39 2.4-5.06 1.42-5.06-1.36V273.58c0-4.66-2.49-8.97-6.53-11.31L24.87 145.67c-2.4-1.39-1.42-5.06 1.36-5.06h411.26c5.84 0 9.49 6.33 6.57 11.39h-.01Z"
      fill="#0765D9"
    />
  </svg>
}
    href="https://cursor.com/marketplace/exa"
  >
    Exa MCP is available on Cursor.
  </Card>

  <Card
    title="Install in VS Code"
    icon={
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path
      d="M70.912 99.572a6.193 6.193 0 0 0 4.96-.191l20.588-9.958a6.285 6.285 0 0 0 3.54-5.661V16.239a6.286 6.286 0 0 0-3.54-5.662L75.873.62a6.2 6.2 0 0 0-7.104 1.216L29.355 37.98l-17.168-13.1a4.146 4.146 0 0 0-5.318.238l-5.506 5.035a4.205 4.205 0 0 0-.004 6.194L16.247 50 1.36 63.654a4.205 4.205 0 0 0 .004 6.194l5.506 5.034a4.145 4.145 0 0 0 5.318.238l17.168-13.1L68.77 98.166a6.205 6.205 0 0 0 2.143 1.407Zm4.103-72.39L45.11 50 75.015 72.82V27.18Z"
      fillRule="evenodd"
      fill="#0765D9"
    />
  </svg>
}
    href="https://vscode.dev/redirect/mcp/install?name=exa&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D"
  >
    Exa MCP is available on VSCode.
  </Card>
</CardGroup>

<Tabs>
  <Tab title="ChatGPT & Codex">
    Install the [Exa plugin](https://chatgpt.com/plugins/exa?open_in_app), which includes the hosted MCP server plus Exa's `search` and `exa-agent` skills. See [Exa for ChatGPT and Codex](/docs/integrations/chatgpt-codex) for the full setup and workflow guide.

    To add just the MCP server in Codex:

    ```bash theme={null}
    codex mcp add exa --url https://mcp.exa.ai/mcp
    ```
  </Tab>

  <Tab title="Claude Code">
    Install the [Exa plugin](https://claude.com/plugins/exa) — it includes the MCP server plus Exa's skills. Run in terminal:

    ```bash theme={null}
    claude plugin install exa@claude-plugins-official
    ```

    Or in Claude Code, type `/plugin`, search for **Exa**, and install it.

    To add just the MCP server:

    ```bash theme={null}
    claude mcp add --transport http exa https://mcp.exa.ai/mcp
    ```
  </Tab>

  <Tab title="Claude Web, Desktop, or Cowork">
    Install one of the following — the [Exa plugin](https://claude.com/plugins/exa) from Claude's plugin marketplace (includes the connector plus Exa's skills), or the [Exa connector](https://claude.ai/directory/connectors/91408932-1110-4350-97c7-2d6b3a6d9694) on its own from the connector directory:

    1. Open Claude and click **Customize** from the sidebar
    2. Go to the **Plugins** tab
    3. Click Browse, open the Partners tab, and search for **Exa**
    4. Click **+** to add it

    Claude Team and Enterprise admins can provision the connector for everyone through their identity provider instead: see [Enterprise Managed Auth](/docs/reference/mcp-enterprise-managed-auth).
  </Tab>

  <Tab title="Grok Build">
    Exa is available on the [Grok Build](https://docs.x.ai/build/overview) marketplace.

    1. In Grok Build, run `/marketplace`
    2. Find **exa** in the list and press `i` to install it
    3. Run `/mcp`, select **exa**, and press `i` to sign in to your Exa account in the browser

    New accounts get free credits at signup.
  </Tab>

  <Tab title="Vercel fx">
    In the [fx](https://fx.sh) interactive shell:

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx saves it to `~/.fx/mcp.json`. See [Exa in fx](/docs/integrations/fx) for manual config and API keys.
  </Tab>

  <Tab title="OpenCode">
    Add to your `opencode.json`:

    ```json theme={null}
    {
      "mcp": {
        "exa": {
          "type": "remote",
          "url": "https://mcp.exa.ai/mcp",
          "enabled": true
        }
      }
    }
    ```
  </Tab>

  <Tab title="Kiro">
    Add to `~/.kiro/settings/mcp.json`:

    ```json theme={null}
    {
      "mcpServers": {
        "exa": {
          "url": "https://mcp.exa.ai/mcp"
        }
      }
    }
    ```
  </Tab>

  <Tab title="Other">
    Exa MCP works with most other MCP clients — point them at `https://mcp.exa.ai/mcp`. The config key for the URL varies by client:

    | Client             | Where to add it                                                         | URL key                |
    | ------------------ | ----------------------------------------------------------------------- | ---------------------- |
    | Windsurf           | `~/.codeium/windsurf/mcp_config.json` (under `mcpServers`)              | `serverUrl`            |
    | Google Antigravity | Agent panel → Manage MCP Servers → View Raw config (under `mcpServers`) | `serverUrl`            |
    | Zed                | Zed `settings.json` (under `context_servers`)                           | `url`                  |
    | Gemini CLI         | `~/.gemini/settings.json` (under `mcpServers`)                          | `httpUrl`              |
    | Warp               | Settings → MCP Servers → Add MCP Server (top-level `exa`)               | `url`                  |
    | v0 by Vercel       | Prompt Tools → Add MCP                                                  | paste the URL directly |

    Most other clients use the standard `mcpServers` shape:

    ```json theme={null}
    {
      "mcpServers": {
        "exa": {
          "url": "https://mcp.exa.ai/mcp"
        }
      }
    }
    ```

    If your client doesn't support remote MCP servers directly, use the `mcp-remote` bridge:

    ```json theme={null}
    {
      "mcpServers": {
        "exa": {
          "command": "npx",
          "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
        }
      }
    }
    ```

    Or run the local [npm package](https://www.npmjs.com/package/exa-mcp-server) with your [Exa API key](https://dashboard.exa.ai/api-keys):

    ```json theme={null}
    {
      "mcpServers": {
        "exa": {
          "command": "npx",
          "args": ["-y", "exa-mcp-server"],
          "env": {
            "EXA_API_KEY": "your_api_key"
          }
        }
      }
    }
    ```
  </Tab>
</Tabs>

# API Key

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

Exa MCP's free plan covers casual use. Add your own API key to lift the rate limits and use it in production:

```json theme={null}
{
  "exa": {
    "url": "https://mcp.exa.ai/mcp",
    "headers": {
      "x-api-key": "YOUR_EXA_API_KEY"
    }
  }
}
```

# Available Tools

**Enabled by default:**

| Tool             | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| `web_search_exa` | Search the web for any topic and get clean, ready-to-use content      |
| `web_fetch_exa`  | Read a webpage's full content as clean markdown from one or more URLs |

**Additional tools** (enable via the `tools` parameter):

| Tool                      | Description                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent_run`               | Run an [Exa Agent](#exa-agent) for multi-step research, list-building, enrichment, and structured output                                                   |
| `web_search_advanced_exa` | [Advanced search](#advanced-search) with full control over category filters, domain restrictions, date ranges, highlights, summaries, and subpage crawling |

Enable specific tools by only appending them to the MCP URL:

```
https://mcp.exa.ai/mcp?tools=web_search_exa
```

<br />

# Exa Agent

You can also run [Exa Agent](/docs/reference/agent-api-guide) through Exa MCP for multi-step research, list building, enrichment, and structured outputs. Use it for anything that needs more than a single search call.

Agent runs are usage-based, so the Agent tool requires authentication — connect with OAuth or pass your own [Exa API key](https://dashboard.exa.ai/api-keys).

Enable the Agent tool:

```
https://mcp.exa.ai/mcp?tools=agent_run
```

Or alongside the default search tools:

```json theme={null}
{
  "exa": {
    "url": "https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_run",
    "headers": {
      "x-api-key": "YOUR_EXA_API_KEY"
    }
  }
}
```

`agent_run` runs the entire agent loop in one call: it creates the run, streams updates until completion, and returns the final output.

1. **Run the agent** with `agent_run`, passing a natural-language `query`. Add an `outputSchema` when you need repeatable, structured results.
2. **Read the output.** When the run finishes, the response has `outputReady: true` with `output.text`, `output.structured` (when a schema was provided), and `output.grounding` citations, plus `usage` and cost.
3. **Long runs.** If a run outlives the call window (\~750s), `agent_run` returns `status: "running"` with the run's `id` instead of an error — the run keeps executing server-side. Call `agent_run` again with `runId` set to that `id` to keep waiting until it finishes.
4. **Continue.** Pass `previousRunId` (a completed run's `id`) to `agent_run` to refine or extend earlier work; use `input.exclusion` to avoid resurfacing prior results.

`agent_run` takes a natural-language `query`. Pass `runId` to wait for a retained run that is still executing. Pass `previousRunId` to continue from a completed run. Optional fields include `outputSchema`, `systemPrompt`, `input` (`data` to enrich, `exclusion` to avoid), `dataSources` ([Exa Connect](/docs/reference/agent-api/connect/overview) providers, up to 5), and `effort` (`minimal`, `low`, `medium`, `high`, `xhigh`, or `auto`; defaults to `low`).

See the [Exa Agent guide](/docs/reference/agent-api-guide) for schema patterns, effort modes, Exa Connect data sources, and pricing.

<br />

# Advanced Search

`web_search_advanced_exa` exposes the full [Exa Search](/docs/reference/search) API as an MCP tool. Use `web_search_exa` for simple, fast lookups; use the advanced tool when you need precise control over results, including category and domain filters, date ranges, text constraints, geo-targeting, query expansion, summaries, highlights, freshness control, and subpage crawling.

Use it for targeted retrieval, like "research papers about X on arxiv.org from the last year", "news about Y excluding site Z", or "crawl the docs subpages of this company's site". For everyday searches, stick with `web_search_exa`.

Enable it via the `tools` parameter:

```
https://mcp.exa.ai/mcp?tools=web_search_advanced_exa
```

Or alongside the default search tools:

```json theme={null}
{
  "exa": {
    "url": "https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_run,web_search_advanced_exa",
    "headers": {
      "x-api-key": "YOUR_EXA_API_KEY"
    }
  }
}
```

The tool's parameters mirror the [Search API](/docs/reference/search) — see that reference for what each filter and content option does.

<br />

# Resources

* [**GitHub**](https://github.com/exa-labs/exa-mcp-server) - View Exa MCP source code
* [**npm**](https://www.npmjs.com/package/exa-mcp-server) - Install Exa MCP npm package

<Accordion title="Usage Examples" icon="magnifying-glass">
  **Web Search**

  ```
  Search for recent developments in AI agents and summarize the key trends.
  ```

  **Code Search**

  ```
  Find Python examples for implementing OAuth 2.0 authentication.
  ```

  **Read a Page**

  ```
  Fetch the full content of https://exa.ai and summarize what the company does.
  ```
</Accordion>

<Accordion title="Troubleshooting" icon="wrench">
  **Rate limit error (429)**

  You've hit the free plan rate limit. Add your own API key to continue:

  ```json theme={null}
  {
    "exa": {
      "url": "https://mcp.exa.ai/mcp",
      "headers": {
        "x-api-key": "YOUR_EXA_API_KEY"
      }
    }
  }
  ```

  [Get your API key](https://dashboard.exa.ai/api-keys)

  **Tools not appearing**

  Restart your MCP client after updating the config file. Some clients require a full restart to detect new MCP servers.

  **Claude Desktop not connecting**

  Use the built-in Connector: click **+** (or **Add connectors**) → **Connectors** tab → search for **Exa** → click **+**.

  **Config file not found**

  Common config locations:

  * Cursor: `~/.cursor/mcp.json`
  * fx: `~/.fx/mcp.json`
  * VS Code: `.vscode/mcp.json` (in project root)
  * Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
  * Claude Desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
</Accordion>

> 원본: https://docs.tavily.com/documentation/integrations/openclaw.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenClaw

> Integrate Tavily with OpenClaw to give your AI agents real-time web search and content extraction across WhatsApp, Telegram, Discord, iMessage, and more.

## Introduction

[OpenClaw](https://docs.openclaw.ai/) is an open-source, self-hosted gateway that connects messaging apps — WhatsApp, Telegram, Discord, iMessage, and more — to AI agents. You run a single Gateway process on your own machine or server, and it becomes the bridge between your chat apps and an always-available AI assistant.

Tavily is available in OpenClaw as both a web search provider and a dedicated plugin, giving your agents real-time web search and content extraction capabilities across every connected channel. Whether a user asks a question on WhatsApp or shares a link in Telegram, the agent can search the web and extract page content to provide accurate, up-to-date answers.

<Frame>
  <img src="https://mintcdn.com/tavilyai/t_FSjJC-k_Tl_BGa/images/openclaw.gif?s=4d3afdb1d3908a8cfc261f0c4b4487b6" alt="OpenClaw onboarding with Tavily as the web search provider" width="800" height="382" data-path="images/openclaw.gif" />
</Frame>

## How to set up Tavily with OpenClaw

<AccordionGroup>
  <Accordion title="Step 1: Obtain your Tavily API key">
    Go to the [Tavily Dashboard](https://app.tavily.com/home) to obtain your **API key**. Sign up for free if you don't have an account.
  </Accordion>

  <Accordion title="Step 2: Configure Tavily as your search provider">
    You can configure Tavily using the interactive CLI or by editing your config file directly.

    **Option 1: Interactive CLI**

    Run the onboarding wizard and select Tavily when prompted for a search provider:

    ```bash theme={null}
    openclaw configure --section web
    ```

    **Option 2: Manual configuration**

    Add the following to your `~/.openclaw/openclaw.json`:

    ```json theme={null}
    {
      "plugins": {
        "entries": {
          "tavily": {
            "enabled": true,
            "config": {
              "webSearch": {
                "apiKey": "tvly-YOUR_API_KEY"
              }
            }
          }
        }
      },
      "tools": {
        "web": {
          "search": {
            "provider": "tavily"
          }
        }
      }
    }
    ```

    **Option 3: Environment variable**

    Set the `TAVILY_API_KEY` environment variable, or add it to `~/.openclaw/.env`:

    ```bash theme={null}
    export TAVILY_API_KEY="tvly-YOUR_API_KEY"
    ```

    <Tip>
      If `TAVILY_API_KEY` is set and no other search provider key is configured, OpenClaw will auto-detect and select Tavily automatically.
    </Tip>
  </Accordion>

  <Accordion title="Step 3: Start chatting">
    Once configured, your agents can use Tavily across all connected channels. Open the Control UI or send a message from any connected chat app:

    ```bash theme={null}
    openclaw dashboard
    ```
  </Accordion>
</AccordionGroup>

<Tip>
  OpenClaw supports Tavily in two ways: `web_search` uses Tavily as the default web provider for simple searches, while Tavily-native tools like `tavily_search` and `tavily_extract` expose advanced controls such as topic selection, domain filters, search depth, and URL extraction.
</Tip>

## Search modes in OpenClaw

Once Tavily is configured, OpenClaw can use it in two ways.

### 1. `web_search` for simple, provider-backed search

If Tavily is set as your web search provider, OpenClaw's built-in `web_search` tool routes searches through Tavily.

Use this when:

* You want a simple search interface
* Your agent only needs a query and result count
* You want Tavily to power the default OpenClaw web search flow

#### `web_search` parameters

| Parameter | Description                 |
| --------- | --------------------------- |
| `query`   | Search query                |
| `count`   | Number of results to return |

### 2. Tavily-native tools for advanced controls

Use Tavily-native tools when you need Tavily-specific capabilities beyond the generic `web_search` interface.

| Tool             | Use when you need                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `tavily_search`  | Search depth, topic filtering, domain includes/excludes, recency filters, or AI-generated answers |
| `tavily_extract` | Clean extraction from one or more URLs                                                            |

#### `tavily_search` parameters

| Parameter         | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `query`           | Search query (keep under 1500 characters)                 |
| `search_depth`    | `basic` (default, fast) or `advanced` (highest relevance) |
| `topic`           | `general` (default), `news`, or `finance`                 |
| `max_results`     | Number of results, 1–20 (default: 5)                      |
| `include_answer`  | Include an AI-generated answer summary                    |
| `time_range`      | Filter by recency: `day`, `week`, `month`, or `year`      |
| `include_domains` | Array of domains to restrict results to                   |
| `exclude_domains` | Array of domains to exclude                               |

#### `tavily_extract` parameters

| Parameter           | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `urls`              | Array of URLs to extract (1–20 per request)          |
| `query`             | Rerank extracted chunks by relevance to this query   |
| `extract_depth`     | `basic` (default) or `advanced` (for JS-heavy pages) |
| `chunks_per_source` | Chunks per URL, 1–5 (requires `query`)               |
| `include_images`    | Include image URLs in results                        |

## Use cases

Leverage Tavily through OpenClaw to enhance your AI assistant across every messaging channel:

* **Research on the go** — Ask your agent on WhatsApp to research a topic and get a summarized answer with sources
* **Link analysis** — Share a URL in Telegram and have the agent extract and summarize its content
* **News monitoring** — Use `tavily_search` with `topic: "news"` and `time_range: "day"` to set up heartbeat alerts and get daily updates via your preferred channels
* **Competitive intelligence** — Run domain-filtered searches from any channel to track competitor activity
* **Content curation** — Gather and organize information from multiple sources for reports or newsletters

## Learn more

* [OpenClaw documentation](https://docs.openclaw.ai/)
* [OpenClaw Tavily plugin docs](https://docs.openclaw.ai/tools/tavily)
* [OpenClaw Web Search overview](https://docs.openclaw.ai/tools/web)
* [OpenClaw on GitHub](https://github.com/openclaw/openclaw)
* [Tavily API documentation](/documentation/api-reference/introduction)

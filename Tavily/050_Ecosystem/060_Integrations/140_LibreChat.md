> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# LibreChat

> Use Tavily inside LibreChat for web search, content extraction, and as a built-in agent tool.

<Frame caption="Tavily on [LibreChat](https://www.librechat.ai/)">
  <img src="https://mintcdn.com/tavilyai/GtCvZLBMyzp6BbRJ/images/librechat.png?fit=max&auto=format&n=GtCvZLBMyzp6BbRJ&q=85&s=78afe2b3d13f2c89b894ed92b1df04e0" alt="Tavily on LibreChat" width="2814" height="1498" data-path="images/librechat.png" />
</Frame>

## Introduction

[LibreChat](https://www.librechat.ai/) is an open-source chat platform that supports multiple AI providers, agents, and a configurable web search system. Tavily integrates with LibreChat in three ways:

* **Web search provider** for the built-in `Web Search` feature.
* **Scraper / extract provider** for fetching page contents alongside search.
* **Built-in agent tool** (`Tavily Search`) inside the LibreChat Agent Builder.

This lets your LibreChat conversations and custom agents access real-time, agent-optimized web data without any custom integration code.

## Prerequisites

* A running LibreChat instance (self-hosted or cloud-based). See the [LibreChat docs](https://www.librechat.ai/docs) for installation.
* A [Tavily API key](https://app.tavily.com/home).

## Web search in LibreChat

LibreChat's [Web Search feature](https://www.librechat.ai/docs/features/web_search#tavily) uses a pluggable pipeline of **search provider → scraper → reranker**. Tavily can power both the search and scrape stages.

### Configure Tavily as a provider

<Steps>
  <Step title="Add your Tavily API key">
    Set the environment variable in your LibreChat `.env` file:

    ```bash theme={null}
    TAVILY_API_KEY=your_tavily_api_key
    ```

    LibreChat picks this up automatically for both the search and extract roles.
  </Step>

  <Step title="(Optional) Configure via librechat.yaml">
    If you prefer to manage configuration centrally, reference the environment variable in your `librechat.yaml`:

    ```yaml theme={null}
    webSearch:
      tavilyApiKey: "${TAVILY_API_KEY}"
    ```

    Only reference environment variable names in YAML - for best practices, never embed your API key directly.
  </Step>

  <Step title="Enable web search in a conversation">
    Restart LibreChat, then ensure **Web Search** is enabled in the settings. LibreChat will route queries through Tavily Search, fetch the most relevant pages with Tavily Extract, and feed the results back to the model.
  </Step>
</Steps>

### Why use Tavily for both stages

Tavily can serve as the search provider and the scraper provider simultaneously, so you can run the full web search pipeline with a single API key:

| Stage   | Tavily capability                                                                                         |
| ------- | --------------------------------------------------------------------------------------------------------- |
| Search  | Agent-optimized results with configurable search depth, time-based filtering, and domain include/exclude. |
| Extract | Clean page content with configurable extract depth, plus image and favicon extraction.                    |

Pair Tavily with a supported reranker in `librechat.yaml` if you want an additional ranking stage on top of Tavily's results.

## Tavily as a built-in agent tool

LibreChat's [Agent Builder](https://www.librechat.ai/docs/features/agents) ships with `Tavily Search` as a built-in tool, so any custom agent you build can call Tavily directly.

<Steps>
  <Step title="Create or open an agent">
    Select **Agents** from the endpoint menu, then open the **Agent Builder** in the side panel. Set the agent's name, avatar, model, and instructions.
  </Step>

  <Step title="Enable Tavily Search">
    In the agent's tool list, toggle on **Tavily Search**. If `TAVILY_API_KEY` is not set in the environment, LibreChat will prompt for the key in the UI the first time the tool is used.
  </Step>

  <Step title="Save and test">
    Save the agent and start a conversation. The agent will now call Tavily whenever it needs current web information.
  </Step>
</Steps>

## Best practices

* **Use one Tavily key end-to-end** — the same key powers Web Search and the built-in agent tool, which keeps usage and billing in one place.
* **Combine search + extract** — let Tavily search for sources and extract the most relevant pages before sending content to the model, which keeps context windows tight.
* **Pick the right surface** — use Web Search for ad-hoc chat queries and the built-in `Tavily Search` tool for simple agents. You can also connect the [Tavily MCP server](/documentation/mcp) when an agent needs the full research workflow.

## Resources

* [LibreChat Web Search documentation](https://www.librechat.ai/docs/features/web_search)
* [LibreChat Agents documentation](https://www.librechat.ai/docs/features/agents)
* [Tavily MCP documentation](/documentation/mcp)
* [Tavily API dashboard](https://app.tavily.com/home)

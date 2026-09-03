> 원본: https://docs.tavily.com/documentation/integrations/hermes-agent.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Hermes Agent

> Use Tavily in Hermes Agent for built-in web search and content extraction, with keyless access that works without an account or API key.

<CardGroup cols={2}>
  <Card title="Hermes Agent" icon="wand-magic-sparkles" href="https://hermes-agent.nousresearch.com/" horizontal>
    Install Hermes Agent
  </Card>

  <Card title="Get API Key" icon="key" href="https://app.tavily.com" horizontal>
    Optional for higher limits
  </Card>
</CardGroup>

## Introduction

[Hermes Agent](https://hermes-agent.nousresearch.com/) is an open-source, self-improving AI agent from Nous Research. It runs in the terminal or through messaging platforms such as Telegram, Discord, Slack, WhatsApp, and Signal, with persistent memory, reusable skills, scheduled tasks, and subagent delegation.

Tavily is built into Hermes Agent as a web backend, so there is no plugin or MCP server to install. It powers Hermes's model-callable tools for:

* **`web_search`** — search the web and return ranked results
* **`web_extract`** — retrieve clean content from one or more URLs

Hermes supports Tavily with or without an API key. Keyless access is free and rate-limited, while an API key provides higher limits.

## How keyless access works

A fresh Hermes installation with no web credentials can use `web_search` and `web_extract` immediately. Hermes rotates keyless requests across the public free tiers from Tavily, Exa, Parallel, Firecrawl, and Keenable. If one provider is rate-limited, Hermes tries the next provider in the ring.

To make Tavily the primary backend instead of using round-robin rotation, select Tavily in `hermes tools` or set `web.backend` to `tavily`. Keyless requests then start with Tavily and only move to the next provider if Tavily is throttled.

<Note>
  In the default keyless rotation or after rate-limit failover, another provider may serve an individual request. Pinning Tavily makes it the first provider for each request, not the only possible keyless provider.
</Note>

## Set up Tavily with Hermes Agent

<Frame>
  <img src="https://mintcdn.com/tavilyai/mpJm3bco_T1H8xln/images/hermes_agent.gif?s=950992fb13ca27c23c9eebb8b485357d" alt="Onboarding Tavily Connector on Claude" width="1092" height="620" data-path="images/hermes_agent.gif" />
</Frame>

<AccordionGroup>
  <Accordion title="Step 1: Install Hermes Agent">
    On Linux, macOS, WSL2, or Termux, run:

    ```bash theme={null}
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
    ```

    On native Windows, run in PowerShell:

    ```powershell theme={null}
    iex (irm https://hermes-agent.nousresearch.com/install.ps1)
    ```

    Follow the Hermes setup flow to configure your model provider.
  </Accordion>

  <Accordion title="Step 2: Choose your Tavily access mode">
    **Option 1: Use the zero-config keyless rotation**

    No Tavily setup is required. If Hermes has no web backend or web credentials configured, Tavily participates automatically in the five-provider keyless rotation.

    **Option 2: Pin Tavily with keyless access**

    Run the interactive tool setup and select **Tavily**. Skip the API key prompt:

    ```bash theme={null}
    hermes tools
    ```

    You can also configure the backend directly:

    ```bash theme={null}
    hermes config set web.backend tavily
    ```

    **Option 3: Pin Tavily with an API key**

    Save your key and select Tavily as the backend:

    ```bash theme={null}
    hermes config set TAVILY_API_KEY tvly-your-api-key
    hermes config set web.backend tavily
    ```

    Get a free API key with 1,000 monthly credits from the [Tavily Dashboard](https://app.tavily.com/home). Hermes stores secrets such as `TAVILY_API_KEY` in `~/.hermes/.env`.
  </Accordion>

  <Accordion title="Step 3: Verify the integration">
    Check the configured web tools:

    ```bash theme={null}
    hermes doctor
    ```

    Then start Hermes:

    ```bash theme={null}
    hermes
    ```

    Ask it to run a live search:

    ```text theme={null}
    Search the web for the latest Tavily announcements and cite the sources.
    ```
  </Accordion>

  <Accordion title="Step 4: Use Tavily from a messaging app (optional)">
    Configure and start the Hermes messaging gateway:

    ```bash theme={null}
    hermes gateway setup
    hermes gateway start
    ```

    Once your platform is connected, web search and extraction work through the same Hermes tools used in the terminal.
  </Accordion>
</AccordionGroup>

## Tool parameters

### `web_search`

| Parameter | Description                                      |
| --------- | ------------------------------------------------ |
| `query`   | Search query                                     |
| `limit`   | Maximum number of results to return (default: 5) |

### `web_extract`

| Parameter    | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| `urls`       | One or more URLs, or search-result objects containing a URL |
| `format`     | Optional output format: `markdown` or `html`                |
| `char_limit` | Optional per-page character limit returned to the model     |

For long pages, Hermes returns a bounded head-and-tail excerpt and stores the complete extracted text locally so the agent can read the omitted sections when needed.

## Example prompts

```text theme={null}
Search for today's most important AI agent announcements and summarize them with source links.
```

```text theme={null}
Find the official documentation for the latest Model Context Protocol release, extract the relevant pages, and explain what changed.
```

```text theme={null}
Extract https://docs.tavily.com/documentation/api-reference/endpoint/search and summarize the available request parameters.
```

```text theme={null}
Every weekday morning, research the latest news about these companies and send a cited briefing to me on Telegram.
```

## Troubleshooting

If Hermes cannot search or extract content, check these in order:

1. Run `hermes doctor` to see the readiness of `web_search` and `web_extract`.
2. Run `hermes tools` and confirm Tavily is selected if you want to pin it.
3. Check the active backend:
   ```bash theme={null}
   hermes config get web.backend
   ```
4. If using keyed access, confirm `TAVILY_API_KEY` is set in the active profile's `~/.hermes/.env`. Avoid printing the key in terminal output.
5. Keyless access is rate-limited. If all free providers are throttled, add a free Tavily API key for higher limits.

## Learn more

* [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/)
* [Hermes Agent on GitHub](https://github.com/NousResearch/hermes-agent)
* [Hermes web search and extract guide](https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search)
* [Tavily keyless access](/documentation/keyless)
* [Tavily API documentation](/documentation/api-reference/introduction)

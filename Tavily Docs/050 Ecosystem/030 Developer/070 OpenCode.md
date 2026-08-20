> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenCode

> Add real-time web search, extraction, crawling, and deep research to OpenCode, the open-source terminal coding agent, through the official opencode-tavily plugin.

<CardGroup cols={1}>
  <Card title="Get API Key" icon="key" href="https://app.tavily.com" horizontal>
    Sign up at tavily.com
  </Card>
</CardGroup>

## Introduction

[OpenCode](https://opencode.ai) is an open-source AI coding agent for the terminal. It runs as a TUI that understands your codebase, edits files, runs shell commands, and supports plugins, custom agents, and skills.

Tavily integrates with OpenCode through the official [`opencode-tavily`](https://github.com/tavily-ai/opencode-tavily) plugin. The plugin registers the Tavily skill with OpenCode, giving the agent reliable web search, content extraction, crawling, URL discovery, and deep research with citations — powered by the [Tavily CLI](/documentation/tavily-cli) under the hood.

<Frame>
  <video controls preload="metadata" aria-label="Installing and using the Tavily plugin in OpenCode">
    <source src="https://mintcdn.com/tavilyai/g9uv41B01nVMuWqZ/images/opencode.mp4?fit=max&auto=format&n=g9uv41B01nVMuWqZ&q=85&s=3325d940e4b402425ca19a2f84cba9d8" type="video/mp4" data-path="images/opencode.mp4" />
  </video>
</Frame>

## What the plugin adds

Once installed, the agent can:

* **Search** the web with optional content extraction
* **Extract** any webpage to clean markdown or text
* **Map** all URLs on a website
* **Crawl** entire websites recursively
* **Research** — AI-powered deep research with citations

| Command         | Use when                                                | Key flags                                                           |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| `tvly search`   | No specific URL yet — find sources and answer questions | `--depth`, `--max-results`, `--time-range`, `--include-raw-content` |
| `tvly extract`  | Have URL(s) — pull clean content (up to 20 per call)    | `--extract-depth`, `--query`, `--chunks-per-source`                 |
| `tvly map`      | Need to discover URLs on a large site                   | `--limit`, `--instructions`, `--max-depth`                          |
| `tvly crawl`    | Need bulk content from a site section                   | `--max-depth`, `--max-breadth`, `--output-dir`                      |
| `tvly research` | Need comprehensive, multi-source analysis               | `--model`, `--stream`, `status` / `poll`                            |

<Note>All output is written to a `.tavily/` directory to avoid flooding the agent's context.</Note>

## Requirements

* [OpenCode](https://opencode.ai) installed locally
* The [Tavily CLI](/documentation/tavily-cli) (`tvly`)
* A Tavily account

## Setup

<AccordionGroup>
  <Accordion title="Step 1: Install OpenCode">
    If OpenCode is not installed yet, install it first:

    ```bash theme={null}
    curl -fsSL https://opencode.ai/install | bash
    ```

    Or via npm:

    ```bash theme={null}
    npm install -g opencode-ai
    ```
  </Accordion>

  <Accordion title="Step 2: Install the Tavily CLI">
    The plugin drives Tavily through the `tvly` CLI:

    ```bash theme={null}
    curl -fsSL https://cli.tavily.com/install.sh | bash
    ```

    Or via Python:

    ```bash theme={null}
    uv tool install tavily-cli
    # or
    pip install tavily-cli
    ```
  </Accordion>

  <Accordion title="Step 3: Add the plugin to your OpenCode config">
    Add `opencode-tavily` to the `plugin` array in your `opencode.json`:

    ```json theme={null}
    {
      "$schema": "https://opencode.ai/config.json",
      "plugin": ["opencode-tavily"]
    }
    ```

    OpenCode installs npm plugins automatically on next launch.
  </Accordion>

  <Accordion title="Step 4: Authenticate with Tavily">
    Browser login is recommended — it opens Tavily's OAuth flow automatically:

    ```bash theme={null}
    tvly login
    ```

    Alternatively, set an API key from the [Tavily Dashboard](https://app.tavily.com/home):

    ```bash theme={null}
    export TAVILY_API_KEY=tvly-your-api-key
    ```

    <Tip>If `TAVILY_API_KEY` is set in your environment, the plugin automatically passes it through to shell commands.</Tip>
  </Accordion>

  <Accordion title="Step 5: Verify the plugin is working">
    Start OpenCode and ask a current-events question, for example:

    ```text theme={null}
    Use Tavily to search for the latest Model Context Protocol announcements and cite the sources.
    ```

    The agent should run `tvly search` and return grounded results with sources.
  </Accordion>
</AccordionGroup>

## Example prompts

```text theme={null}
Search for the latest changes to the Model Context Protocol and cite the primary sources.
```

```text theme={null}
Extract https://docs.tavily.com/documentation/api-reference/endpoint/search and summarize the request parameters.
```

```text theme={null}
Crawl the LangChain docs section on retrieval and save the pages locally.
```

```text theme={null}
Research the leading agent observability platforms and compare their capabilities with citations.
```

## Troubleshooting

If the agent cannot access the web or Tavily commands fail, check these in order:

1. Is the plugin listed in `opencode.json`?
   ```json theme={null}
   { "plugin": ["opencode-tavily"] }
   ```
2. Is the Tavily CLI installed and authenticated?
   ```bash theme={null}
   tvly --status
   ```

## Learn more

* [OpenCode ecosystem](https://opencode.ai/ecosystem)
* [OpenCode plugin docs](https://opencode.ai/docs/plugins)
* [Tavily plugin for OpenCode on GitHub](https://github.com/tavily-ai/opencode-tavily)
* [Tavily CLI documentation](/documentation/tavily-cli)
* [Tavily API Reference](/documentation/api-reference/introduction)

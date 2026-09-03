> 원본: https://docs.tavily.com/documentation/integrations/nanoclaw.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# NanoClaw

> Add Tavily Search and Extract to a persistent NanoClaw agent in Slack, Telegram, Discord, or the CLI.

## Overview

[NanoClaw](https://github.com/nanocoai/nanoclaw) is a lightweight runtime for personal AI agents. It connects an agent to channels such as Slack, Telegram, Discord, and the CLI, gives it a persistent workspace and memory, supports scheduled tasks, and runs sessions in isolated containers.

Tavily adds current web information to that setup. A NanoClaw agent can search for recent documentation, releases, API changes, incidents, and security advisories, then extract the relevant pages before replying in the same conversation.

<Frame>
  <video controls preload="metadata" aria-label="Installing Tavily and using web search in NanoClaw">
    <source src="https://mintcdn.com/tavilyai/YGWYM1alISyvEFOJ/images/nanoclaw-demo-final.mp4?fit=max&auto=format&n=YGWYM1alISyvEFOJ&q=85&s=1066e13781b27ac2db40bfbdaaa2f1af" type="video/mp4" data-path="images/nanoclaw-demo-final.mp4" />
  </video>
</Frame>

## What the integration adds

The default NanoClaw skill exposes two tools through Tavily's remote MCP server:

* **Tavily Search** finds ranked, relevant sources from the live web.
* **Tavily Extract** reads clean content from one or more URLs.

The tools are added only to the agent groups you select and work with NanoClaw providers that support MCP.

## Set up Tavily in NanoClaw

<Steps>
  <Step title="Install NanoClaw">
    If NanoClaw is not already running, clone it and launch the setup flow:

    ```bash theme={null}
    git clone https://github.com/nanocoai/nanoclaw.git nanoclaw-v2
    cd nanoclaw-v2
    bash nanoclaw.sh
    ```
  </Step>

  <Step title="Run the Tavily skill">
    Open Claude Code from the NanoClaw checkout and run:

    ```text theme={null}
    /add-tavily-tool
    ```

    Select the agent groups that need web access. The skill installs the MCP bridge, registers Tavily Search and Extract, rebuilds the agent image, and restarts the selected groups.
  </Step>

  <Step title="Test it from your channel">
    Send a request from Slack, Telegram, Discord, or the CLI:

    ```text theme={null}
    Using Tavily, find the latest stable Next.js release and read the official release notes. Summarize the three most important changes and include source links.
    ```

    The response should use Tavily Search and include links to the retrieved sources.
  </Step>
</Steps>

## What you can build

* **Developer research assistant:** Check current documentation, release notes, GitHub issues, and migration risks without leaving the team chat.
* **Scheduled intelligence brief:** Track a market, company, or topic and deliver a recurring update with sources.
* **Source-backed chat assistant:** Answer current questions and read URLs shared in the conversation before responding.

## Keyless access and API keys

The NanoClaw skill starts with Tavily's keyless access, so you can try Search and Extract without creating an account or adding a key. If you later need higher limits, NanoClaw can store a Tavily API key in its credential gateway. The gateway injects the credential when the request is sent; the key does not need to live in the agent's prompt, workspace, or container environment.

## Troubleshooting

<AccordionGroup>
  <Accordion title="The Tavily tools do not appear">
    Confirm that you selected the correct agent group, then restart it. If the MCP bridge is missing, run `/add-tavily-tool` again and let it rebuild the agent image.
  </Accordion>

  <Accordion title="The agent used another web tool">
    Ask it to use Tavily explicitly. In NanoClaw's tool trace, the installed tools appear as `mcp__tavily__tavily_search` and `mcp__tavily__tavily_extract`.
  </Accordion>

  <Accordion title="Keyless access reached its limit">
    Follow the upgrade prompt to add a Tavily API key through the credential gateway, then retry the request. Search and Extract keep the same response format.
  </Accordion>
</AccordionGroup>

## Learn more

* [NanoClaw documentation](https://docs.nanoclaw.dev)
* [Tavily MCP Server](/documentation/mcp)
* [Tavily keyless access](/documentation/keyless)

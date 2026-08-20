> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Exa in Codex and ChatGPT

> Search the web, read any page, and research with Exa directly from Codex and ChatGPT.

Install the Exa plugin once to give Codex and ChatGPT access to the live web through Exa. Search for up-to-date information, read the sources that matter, and run deeper research without leaving your conversation or coding session.

## Install Exa

<Steps>
  <Step title="Open the plugin">
    Go to [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). It opens **Exa** in OpenAI's plugin directory, which is the same directory for ChatGPT and for Codex.
  </Step>

  <Step title="Install it">
    Select the plus button to install. Sign in to Exa when prompted, either during install or the first time Codex or ChatGPT uses it.

    <Frame caption="Opening Plugins in Codex, adding Exa, and authorizing access">
      <img src="https://mintcdn.com/exa-52/TKepgS91nT37I2Fj/images/chatgpt-codex/install-codex.gif?s=437bcf22c56a55700e3fe02749360e9c" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="Start a new session">
    Skills load in chats and CLI sessions started after the install, so open a fresh one and ask for something that needs the web.
  </Step>
</Steps>

That's it. The plugin includes both Exa's MCP integration and skills, so there's no separate MCP or skill setup required.

## Build with what's on the web right now

The libraries, APIs, and tools you build with change every day. With Exa installed, Codex can search for the latest documentation, issues, changelogs, and real-world examples while it works.

From inside your repo:

```text theme={null}
We're on Tailwind v3. Search for the Tailwind v4 upgrade guide, read it,
then migrate this project to v4.
```

Codex can search with Exa, read the relevant sources, and use what it finds to make the change in your codebase.

The same works whenever the answer might be somewhere outside your repo:

* "Search the `tokio-tungstenite` issues and changelog for this error before you try to fix it."
* "Find real examples of Postgres advisory locks in Rust and recommend the pattern that fits this worker pool."
* "Read the current Stripe webhook docs and check our implementation against them."
* "Search for the latest migration guide for this dependency, then upgrade it."

## Search, read, and research

The Exa plugin gives Codex and ChatGPT three ways to work with the web.

<CardGroup cols={3}>
  <Card title="Search" icon="magnifying-glass">
    Search in natural language and get the content of the best pages back, not a list of links.
  </Card>

  <Card title="Read" icon="file-lines">
    Read a page you point it at, whether that's docs, a changelog, an issue, or a blog post.
  </Card>

  <Card title="Research" icon="compass">
    Work through a question that takes more than one search, and answer it with citations.
  </Card>
</CardGroup>

## Research without leaving ChatGPT

Exa works in ChatGPT too. Ask a question that needs fresh information and use Exa to search and research the web from the conversation.

```text theme={null}
Compare the managed offerings, licensing, and pricing of the main
open source vector databases. Use current primary sources and cite them.
```

Instead of relying only on information already in context, ChatGPT can use Exa to find and read the sources needed for the task.

Use it for competitive research, technical research, market mapping, company research, or anything else where the answer lives across the web.

## MCP + skills, together

Under the hood, the plugin combines two parts of Exa's agent stack.

[Exa MCP](/docs/reference/exa-mcp) gives Codex and ChatGPT tools for accessing Exa. It's the connection between the agent and Exa's search and research capabilities.

[Exa skills](/docs/reference/agent-skills) give the agent additional instructions for using those capabilities in useful workflows, including web research and [Exa Agent](/docs/reference/agent-api-guide).

You don't need to configure either separately when you install the plugin.

## Prefer MCP directly?

The plugin is the recommended way to use Exa with Codex and ChatGPT. If you're configuring Codex manually or using another MCP client, you can connect directly to Exa's hosted MCP server:

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

See [Exa MCP](/docs/reference/exa-mcp) for other clients, configuration options, and available tools.

<Card title="Install Exa for ChatGPT and Codex" icon="download" href="https://chatgpt.com/plugins/exa?open_in_app">
  chatgpt.com/plugins/exa
</Card>

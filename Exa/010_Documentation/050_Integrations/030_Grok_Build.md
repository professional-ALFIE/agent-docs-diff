> 원본: https://exa.ai/docs/integrations/grok-build.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Grok Build

> Use Exa web search in Grok Build. Install the Exa plugin from the Grok Build marketplace and sign in with your Exa account.

Exa is available as a plugin on the [Grok Build](https://docs.x.ai/build/overview) marketplace. It gives Grok real-time web search, page reading, and a deep research skill.

## Installation

<Steps>
  <Step title="Install Grok Build">
    Install the Grok CLI (see the [Grok Build docs](https://docs.x.ai/build/overview) for details):

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    Then sign in to your xAI account:

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="Open the marketplace">
    Start Grok Build by running `grok`, then open the marketplace:

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Install the Exa plugin">
    Find **exa** in the list and press `i` to install it.
  </Step>

  <Step title="Sign in to Exa">
    Open the MCP servers tab with `/mcp`, select **exa**, and press `i` to sign in. Your browser opens the Exa sign-in page. New accounts get free credits at signup.
  </Step>
</Steps>

Once exa shows **ready**, ask Grok anything that needs the web.

## What you get

* **web\_search\_exa**: real-time web search. Supports natural language queries and category filters like news, companies, people, research papers, and GitHub.
* **web\_fetch\_exa**: reads any URL and returns the page content as clean markdown.
* **exa-search skill**: a deep research skill. Ask Grok for a deep dive on a topic and it runs multiple searches, reads the best sources, and answers with citations.

## Example prompts

* "Search for recent news about xAI"
* "Read [https://exa.ai](https://exa.ai) and summarize it"
* "Do a deep dive on open source inference engines"

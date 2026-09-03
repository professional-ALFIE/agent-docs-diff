> 원본: https://exa.ai/docs/integrations/openhuman.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenHuman

> Give the OpenHuman agent live web search with Exa, either managed or with your own Exa API key.

[OpenHuman](https://tinyhumans.gitbook.io/openhuman) by TinyHumans is a desktop AI assistant with a native web search tool the agent calls on its own. Exa is the search provider behind that tool.

| Approach              | Setup                | Runs on                                                                 |
| --------------------- | -------------------- | ----------------------------------------------------------------------- |
| **OpenHuman Managed** | None                 | OpenHuman's backend, powered by Exa. No API key.                        |
| **Exa provider**      | Paste an Exa API key | Your machine, straight to `https://api.exa.ai` on your own Exa account. |

## OpenHuman Managed

Managed search is the default. Choose **Simple** during onboarding and the agent can search the web immediately.

<Frame caption="Choose Simple during onboarding for Exa-powered managed search">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="OpenHuman onboarding asking how to run OpenHuman, with the Simple option selected" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **Managed is the fastest way to get Exa results.** No key to create, store, or rotate, no credentials on your machine, and search is billed on your OpenHuman subscription.
</Tip>

## Exa provider

Configure Exa directly to run search on your own Exa account and give the agent Exa's search and page-contents tools.

### Get your Exa API key

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

### Add Exa in OpenHuman

1. Open **Connections**, then select **Search engine** under **API keys**.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="The OpenHuman Connections page with Search engine selected under API keys, showing the search engine list with OpenHuman Managed active" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. Select **Exa**.

<Frame caption="Exa selected, waiting on a key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="The Exa engine option selected in the OpenHuman Search engine panel, showing the Needs API key badge" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. Paste your key into **Exa API key** and select **Save**.

<Frame caption="Save the Exa API key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="The Exa API key field in OpenHuman with a key entered and the Save button visible" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa configured as the active search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="The OpenHuman Search engine panel with Exa selected and marked Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

### Configuration

The panel writes to OpenHuman's `config.toml`. Set the same values in the file or the environment instead:

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # required
    max_results = 5       # optional, 1-20
    timeout_secs = 15     # optional

    [search.exa]
    api_key = "your-exa-api-key"   # required
    ```
  </Tab>

  <Tab title="Environment">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      `EXA_API_KEY` and `OPENHUMAN_EXA_API_KEY` both override `search.exa.api_key`. When both are set, `OPENHUMAN_EXA_API_KEY` takes precedence.
    </Note>
  </Tab>
</Tabs>

### Tools the agent gets

| Tool               | Returns                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `web_search_tool`  | Web search, served by Exa.                                          |
| `exa_search`       | Ranked pages with titles, URLs, publish dates, and optional text.   |
| `exa_get_contents` | Full contents of given URLs, with optional summaries or highlights. |

The agent sets Exa's [search parameters](/docs/reference/search-api-guide) per call, so plain instructions are enough to steer search mode, domains, dates, and categories.

## Troubleshooting

<AccordionGroup>
  <Accordion title="Exa search unavailable: no API key configured">
    OpenHuman found no key in the **Search engine** panel, the `EXA_API_KEY` and `OPENHUMAN_EXA_API_KEY` variables, or `search.exa.api_key`. Set it in one of them, and restart OpenHuman if you edited `config.toml` while it was running.
  </Accordion>

  <Accordion title="Exa rejected the configured API key (HTTP 401)">
    The key is invalid or revoked. Check it in the [Exa dashboard](https://dashboard.exa.ai/api-keys), then **Clear** the stored key and save the correct one. Watch for pasted whitespace.
  </Accordion>

  <Accordion title="Exa returned non-2xx status">
    `429` means a rate limit or exhausted quota: check usage in the [dashboard](https://dashboard.exa.ai). For `5xx`, retry, then see [error codes](/docs/reference/error-codes).
  </Accordion>

  <Accordion title="OpenHuman Managed is missing from the engine list">
    Local-only sessions cannot use managed search. Configure the Exa provider with your own key.
  </Accordion>
</AccordionGroup>

## Resources

<CardGroup cols={3}>
  <Card title="OpenHuman web search docs" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search">
    Read OpenHuman's own reference for its search engines.
  </Card>

  <Card title="Exa search API" icon="magnifying-glass" href="/docs/reference/search-api-guide">
    Understand the search modes, filters, and content options behind the Exa tools.
  </Card>

  <Card title="Search best practices" icon="sparkles" href="/docs/reference/search-best-practices">
    Get better results out of every query.
  </Card>
</CardGroup>

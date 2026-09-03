> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Anthropic Tool Calling

> Use Claude tool use to add Exa web search and page contents to your application.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

Claude's [tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) allows models to call functions that you define in your code. The Exa SDKs ship ready-made web search and page reading tools for Anthropic, so you don't have to hand-write the tool schema, parse `tool_use` blocks, or format Exa results yourself.

## Get started

<Steps>
  <Step title="Install the SDKs">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Set up your API keys">
    Set the `EXA_API_KEY` and `ANTHROPIC_API_KEY` environment variables. Visit the [Anthropic console](https://console.anthropic.com/settings/keys) and the [Exa dashboard](https://dashboard.exa.ai/api-keys) to generate your API keys.

    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />
  </Step>

  <Step title="Add the Exa tools to your tool loop">
    Pass the tools in the request's `tools` list, then hand the assistant message to `handle_tool_use`. It executes every `tool_use` block in the message and returns the matching `tool_result` blocks, ready to send back in the next user message.

    `web_search` searches the web for pages the model hasn't seen; `get_contents` reads pages it already has URLs for, whether from an earlier search or from the user. Register either or both.

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # reads EXA_API_KEY from the environment
      claude = anthropic.Anthropic()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )

      messages.append({"role": "assistant", "content": response.content})
      messages.append(
          {"role": "user", "content": exa.anthropic.handle_tool_use(response)}
      )

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )
      print(response.content[0].text)
      ```

      ```javascript JavaScript theme={null}
      import Anthropic from "@anthropic-ai/sdk";
      import Exa from "exa-js";

      const exa = new Exa(); // reads EXA_API_KEY from the environment
      const anthropic = new Anthropic();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: await exa.anthropic.handleToolUse(response),
      });

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });
      console.log(response.content[0].text);
      ```
    </CodeGroup>

    This is one round for brevity. A real agent keeps `tools` on every request and repeats the handler step until the model replies without `tool_use` blocks — that's how a search result turns into a follow-up page read.

    Calling the factories with no arguments gives Exa's recommended defaults: `type="auto"` with `contents={"highlights": True}` for search, and page text capped at 10,000 characters for contents.
  </Step>
</Steps>

## Configuring the tools

Keyword arguments are regular Exa options, passed through when the tool runs — search options to `exa.search()`, contents options to `exa.get_contents()`:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.anthropic.web_search(category="news", contents={"text": True}),
      exa.anthropic.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.anthropic.webSearch({ category: "news", contents: { text: true } }),
    exa.anthropic.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

The model picks the search `query` and the `urls` to read; everything else is bound when you create the tool, so it can't change what gets crawled or extracted.

`name` (defaulting to `"web_search"` and `"get_contents"`) and `description` instead override the tool definition the model sees. Anthropic requires tool names to be unique, so a custom name lets the Exa tool run alongside Anthropic's built-in `web_search_20250305` server tool, which reserves the `web_search` name:

<CodeGroup>
  ```python Python theme={null}
  response = claude.messages.create(
      model="claude-sonnet-4-6",
      max_tokens=1024,
      messages=messages,
      tools=[
          exa.anthropic.web_search(name="exa_web_search"),
          {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
      ],
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
    tools: [
      exa.anthropic.webSearch({ name: "exa_web_search" }),
      { type: "web_search_20250305", name: "web_search", max_uses: 5 },
    ],
  });
  ```
</CodeGroup>

## Mixing in your own tools

`handle_tool_use` answers every `tool_use` block in the message: a block naming a tool it can't resolve gets an `Error: unknown tool "<name>"` result instead of being dropped, so the follow-up request never omits a required tool result. If you run your own tools alongside Exa's, replace those error results with your own before the next request.

## Writing the loop by hand

If you'd rather own the tool schema and execution yourself, define the tool and process the `tool_use` blocks manually. `exa.tools.web_search()` and `exa.tools.get_contents()` give you the same provider-neutral tool specs (with a `run` method) for hand-rolled loops, or you can write everything from scratch:

```python Python theme={null}
TOOLS = [
    {
        "name": "exa_search",
        "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to perform.",
                },
            },
            "required": ["query"],
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_use(response):
    results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "exa_search":
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(exa_search(**block.input)),
                }
            )
    return results
```

See the [Python SDK specification](/docs/sdks/python-sdk-specification) and [TypeScript SDK specification](/docs/sdks/typescript-sdk-specification) for the full search and contents options.

> 원본: https://exa.ai/docs/reference/openai-tool-calling.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAI Tool Calling

> Use OpenAI tool calling to add Exa web search and page contents to your application.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

<Info>
  OpenAI recommends the Responses API for all new projects. See the [Responses API](#responses-api) section below.
</Info>

OpenAI's [tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python) allows models to call functions that you define in your code. The Exa SDKs ship ready-made web search and page reading tools for OpenAI, so you don't have to hand-write the tool schema, parse tool calls, or format Exa results yourself.

## Get started

<Steps>
  <Step title="Install the SDKs">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Set up your API keys">
    Set the `EXA_API_KEY` and `OPENAI_API_KEY` environment variables. Visit the [OpenAI dashboard](https://platform.openai.com/api-keys) and the [Exa dashboard](https://dashboard.exa.ai/api-keys) to generate your API keys.

    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />
  </Step>

  <Step title="Add the Exa tools to your tool loop">
    Pass the tools in the request's `tools` list, then hand the assistant message to `handle_tool_calls`. It executes every Exa tool call in the message and returns the matching `role: "tool"` messages, ready to append to the conversation.

    `web_search` searches the web for pages the model hasn't seen; `get_contents` reads pages it already has URLs for, whether from an earlier search or from the user. Register either or both.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # reads EXA_API_KEY from the environment
      openai_client = OpenAI()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
          tools=[exa.openai.web_search(), exa.openai.get_contents()],
      )

      message = completion.choices[0].message
      messages.append(message)
      messages += exa.openai.handle_tool_calls(message)

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
      )
      print(completion.choices[0].message.content)
      ```

      ```javascript JavaScript theme={null}
      import Exa from "exa-js";
      import { OpenAI } from "openai";

      const exa = new Exa(); // reads EXA_API_KEY from the environment
      const openai = new OpenAI();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
        tools: [exa.openai.webSearch(), exa.openai.getContents()],
      });

      const message = completion.choices[0].message;
      messages.push(message, ...(await exa.openai.handleToolCalls(message)));

      completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
      });
      console.log(completion.choices[0].message.content);
      ```
    </CodeGroup>

    This is one round for brevity. A real agent keeps `tools` on every request and repeats the handler step until the model replies without tool calls — that's how a search result turns into a follow-up page read.

    Calling the factories with no arguments gives Exa's recommended defaults: `type="auto"` with `contents={"highlights": True}` for search, and page text capped at 10,000 characters for contents.
  </Step>
</Steps>

## Responses API

For the OpenAI Responses API, use the `responses` factory with the same `handle_tool_calls` helper. The handler returns `function_call_output` items for a follow-up request.

<CodeGroup>
  ```python Python theme={null}
  response = openai_client.responses.create(
      model="gpt-5.6",
      input=messages,
      tools=[exa.openai.responses.web_search(), exa.openai.responses.get_contents()],
  )

  messages += response.output
  messages += exa.openai.responses.handle_tool_calls(response)
  ```

  ```javascript JavaScript theme={null}
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: messages,
    tools: [exa.openai.responses.webSearch(), exa.openai.responses.getContents()],
  });

  messages.push(...response.output);
  messages.push(...(await exa.openai.responses.handleToolCalls(response)));
  ```
</CodeGroup>

<Note>
  Chat Completions and the Responses API use different tool shapes and reject each other's, so use the factory that matches the endpoint you're calling.
</Note>

## Configuring the tools

Keyword arguments are regular Exa options, passed through when the tool runs — search options to `exa.search()`, contents options to `exa.get_contents()`:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.openai.web_search(category="news", contents={"text": True}),
      exa.openai.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.openai.webSearch({ category: "news", contents: { text: true } }),
    exa.openai.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

The model picks the search `query` and the `urls` to read; everything else is bound when you create the tool, so it can't change what gets crawled or extracted.

`name` (defaulting to `"web_search"` and `"get_contents"`) and `description` instead override the tool definition the model sees. Use a custom `name` to run differently-configured Exa tools side by side, or to avoid clashes with other tools that reserve those names.

## Mixing in your own tools

The handlers answer every tool call in the message: a call naming a tool they can't resolve gets an `Error: unknown tool "<name>"` output instead of being dropped, so the follow-up request never omits a required tool response. If you run your own tools alongside Exa's, replace those error outputs with your own results before the next request.

## Writing the loop by hand

If you'd rather own the tool schema and execution yourself, define the tool and process the calls manually. `exa.tools.web_search()` and `exa.tools.get_contents()` give you the same provider-neutral tool specs (with a `run` method) for hand-rolled loops, or you can write everything from scratch:

```python Python theme={null}
import json

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_calls(tool_calls, messages):
    for tool_call in tool_calls:
        if tool_call.function.name == "exa_search":
            args = json.loads(tool_call.function.arguments)
            messages.append(
                {
                    "role": "tool",
                    "content": str(exa_search(**args)),
                    "tool_call_id": tool_call.id,
                }
            )
    return messages
```

See the [Python SDK specification](/docs/sdks/python-sdk-specification) and [TypeScript SDK specification](/docs/sdks/typescript-sdk-specification) for the full search and contents options.

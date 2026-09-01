> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAI SDK Compatibility

> Use Exa's endpoints as a drop-in replacement for OpenAI - supporting both chat completions and responses APIs.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

## Overview

Exa provides OpenAI-compatible endpoints that work with the OpenAI SDK:

| Endpoint            | OpenAI Interface     | Models Available | Use Case                                              |
| ------------------- | -------------------- | ---------------- | ----------------------------------------------------- |
| `/chat/completions` | Chat Completions API | `exa`            | Traditional chat interface                            |
| `/responses`        | Responses API        | `exa-agent`      | Agent API (async research, enrichment, list-building) |

<Info>
  `/chat/completions` routes to [`/answer`](/docs/reference/answer), and `/responses` routes to the [Agent API](/docs/reference/agent-api/overview). See [Agent via Responses API](#agent-via-responses-api) below.
</Info>

## Answer

To use Exa's `/answer` endpoint via the chat completions interface:

1. Replace base URL with `https://api.exa.ai`
2. Replace API key with your Exa API key
3. Replace model name with `exa`.

<Info>
  See the full [`/answer`](/docs/reference/answer) endpoint reference. For custom routing behavior, contact [hello@exa.ai](mailto:hello@exa.ai).
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # use exa as the base url
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # use extra_body to pass extra parameters to the /answer endpoint
    extra_body={
      "text": True # include full text from sources
    }
  )

  print(completion.choices[0].message.content)  # print the response content
  print(completion.choices[0].message.citations)  # print the citations
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // use exa as the base url
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // include full text from sources
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash Curl theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }' | jq
  ```
</CodeGroup>

## Agent via Responses API

Exa's [`/responses`](https://api.exa.ai/responses) endpoint exposes the [Agent API](/docs/reference/agent-api/overview) through the OpenAI Responses interface, so the OpenAI SDKs work against it unchanged. Set `model: "exa-agent"` and choose an execution mode:

| Mode        | Request                            | Behavior                                                                                                   |
| ----------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Synchronous | default (no `stream`/`background`) | The request blocks and returns the completed `response` object.                                            |
| Streaming   | `stream: true`                     | The request streams OpenAI Responses events (SSE) as the run progresses, ending with `response.completed`. |
| Background  | `background: true`                 | The request returns immediately with an `in_progress` response; poll `GET /responses/{id}` for the result. |

Set `reasoning.effort` (`minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, `max`) to trade cost against depth, and cancel a run with `POST /responses/{id}/cancel`. For `max`, set `Exa-Beta: agent-max-effort-2026-07-27` as a client default header. The [Agent guide](/docs/reference/agent-api-guide) covers the run model, output shape, and effort pricing that back this surface.

<Warning>
  `high`, `xhigh`, and `max` `reasoning.effort` runs too long for a synchronous request and return `400`. Use `stream: true` or `background: true` for those runs. `/responses` has no `budget` field; max uses its default per-run cap.
</Warning>

Use `previous_response_id` to continue a completed Responses run.

### Synchronous

The request blocks until the run completes and returns the terminal `response` object.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }' | jq
  ```
</CodeGroup>

### Streaming

Set `stream: true` to receive Responses stream events over SSE. Events carry a monotonic `sequence_number` and finish with `response.completed`; there is no `[DONE]` sentinel. The stream may include `: keep-alive` comment lines, which SSE clients ignore.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

### Background

Set `background: true` to start a run without holding the connection open, then poll `GET /responses/{id}` until it reaches a terminal status. To stream instead of polling, use [Streaming](#streaming).

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # Poll until complete
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // Poll until complete
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # Create a background run
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }' | jq

  # Poll with the returned response ID
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY" | jq
  ```
</CodeGroup>

## Chat wrapper

Exa provides a Python wrapper that automatically enhances any OpenAI chat completion with RAG capabilities. With one line of code, you can turn any OpenAI chat completion into an Exa-powered RAG system that handles search, chunking, and prompting automatically.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # Initialize clients
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # Wrap the OpenAI client
  exa_openai = exa.wrap(openai)

  # Use exactly like the normal OpenAI client
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

The wrapped client works exactly like the native OpenAI client, except it automatically improves your completions with relevant search results when needed.

The wrapper supports any parameters from the `exa.search()` function.

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto", "required", or "none"
    num_results=5,               # defaults to 3
    result_max_len=1024,         # defaults to 2048 characters
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```

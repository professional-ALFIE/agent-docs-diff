> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Deep Research with Streaming

> Submit multi-source research queries with polling or streaming, and get structured output with custom schemas.

## What You'll Learn

* Submitting a research request and polling for results
* Streaming research progress in real time
* Handling streaming events (progress updates, source discoveries, content generation)
* Getting structured output with custom schemas

## How Does It Work?

Tavily Research is a multi-agent deep research endpoint. You submit a query, and Tavily's research agents autonomously search, extract, and synthesize information from multiple sources into a comprehensive report. Two consumption patterns are available:

| Pattern       | Best For                    | How It Works                           |
| ------------- | --------------------------- | -------------------------------------- |
| **Polling**   | Background jobs, serverless | Submit request, poll for completion    |
| **Streaming** | Real-time UIs, CLI tools    | Receive progress events as they happen |

## Getting Started

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

```bash theme={null}
uv venv
uv pip install tavily-python
# Optional (used in the production helper example below)
uv pip install tavily-agent-toolkit
```

## Polling

`client.research()` returns immediately with a pending task. Use `client.get_research()` to poll until the status is `"completed"`.

```python theme={null}
import os
import time
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

task = client.research(
    input="What are the key trends in AI agents for 2026?",
    model="mini",
)

print(f"Task created: {task['request_id']} (status: {task['status']})")

while True:
    result = client.get_research(task["request_id"])

    if result["status"] == "completed":
        break
    elif result["status"] == "failed":
        raise RuntimeError("Research task failed")

    print(f"Status: {result['status']}...")
    time.sleep(5)

print(result["content"])
print(f"\nSources: {len(result['sources'])}")
for source in result["sources"]:
    print(f"  - {source['title']}: {source['url']}")
```

## Streaming

Stream research progress in real time. The API sends Server-Sent Events (SSE) in an OpenAI-compatible `chat.completion.chunk` format as the research agents work. You can display tool activity, show discovered sources, and stream the final report as it generates.

```python theme={null}
import json
import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

stream = client.research(
    input="What are the key trends in AI agents for 2026?",
    model="mini",
    stream=True,
)

for chunk in stream:
    text = chunk.decode("utf-8")

    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue

        if line.startswith("event:"):
            event_name = line.split(":", 1)[1].strip()
            if event_name == "done":
                print("\n\n[stream complete]")
            continue

        if not line.startswith("data:"):
            continue

        payload = line.split(":", 1)[1].strip()
        if not payload:
            continue

        data = json.loads(payload)
        delta = data.get("choices", [{}])[0].get("delta", {})

        if "tool_calls" in delta:
            tc = delta["tool_calls"]
            if tc.get("type") == "tool_call":
                for tool in tc.get("tool_call", []):
                    print(f"[{tool.get('name')}] {tool.get('arguments', '')}")
            elif tc.get("type") == "tool_response":
                for tr in tc.get("tool_response", []):
                    for s in tr.get("sources", []):
                        print(f"  Source: {s['title']} — {s['url']}")

        if "content" in delta and isinstance(delta["content"], str):
            print(delta["content"], end="", flush=True)

        if "sources" in delta:
            print("\n\n--- All Sources ---")
            for s in delta["sources"]:
                print(f"  {s['title']}: {s['url']}")
```

### Streaming Event Flow

A typical session progresses through these stages:

| Stage      | Delta field                                       | What happens                                 |
| ---------- | ------------------------------------------------- | -------------------------------------------- |
| Planning   | `tool_calls` (type `tool_call`)                   | Research plan is initialized                 |
| Searching  | `tool_calls` (type `tool_call` / `tool_response`) | Web searches execute, sources are discovered |
| Subtopics  | `tool_calls` (Pro only)                           | `ResearchSubtopic` calls for deeper dives    |
| Generating | `tool_calls`                                      | Final report generation begins               |
| Content    | `content`                                         | Report chunks stream incrementally           |
| Sources    | `sources`                                         | Complete list of all sources used            |
| Done       | SSE `event: done`                                 | Stream complete                              |

For full event structure and field-level details, see the [Streaming API reference](/documentation/api-reference/endpoint/research-streaming).

## Structured Output

Use `output_schema` to get research results in a custom JSON format. Define your schema as a dictionary of field names to descriptions.

```python theme={null}
import os
import json
import time
from tavily import TavilyClient

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

task = client.research(
    input="Compare React, Vue, and Svelte for building web apps",
    model="mini",
    output_schema={
        "properties": {
            "frameworks": {
                "type": "array",
                "description": "List of frameworks compared",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "Framework name"},
                        "strengths": {
                            "type": "array",
                            "description": "Key strengths",
                            "items": {"type": "string"}
                        },
                        "weaknesses": {
                            "type": "array",
                            "description": "Key weaknesses",
                            "items": {"type": "string"}
                        },
                        "best_for": {"type": "string", "description": "Best use case"}
                    },
                    "required": ["name", "best_for"]
                }
            },
            "recommendation": {"type": "string", "description": "Overall recommendation"}
        },
        "required": ["frameworks", "recommendation"]
    },
)

while True:
    result = client.get_research(task["request_id"])
    if result["status"] == "completed":
        break
    if result["status"] == "failed":
        raise RuntimeError("Research task failed")
    time.sleep(5)

content = result["content"]
structured = json.loads(content) if isinstance(content, str) else content

for fw in structured["frameworks"]:
    print(f"\n{fw['name']}: Best for {fw['best_for']}")
```

## Handling Research Streams in Production

For production applications, use the `handle_research_stream` utility from the Agent Toolkit to process streaming events cleanly:

```python theme={null}
import os
from tavily import TavilyClient
from tavily_agent_toolkit import handle_research_stream

client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

response = client.research(
    input="Analysis of the AI search market landscape",
    model="pro",
    stream=True,
)

report = handle_research_stream(
    response,
    stream_content_generation=True,
)

print(report)
```

## Critical Knobs

<AccordionGroup>
  <Accordion title="model">
    * `"auto"` (default) — Tavily picks based on query complexity
    * `"pro"` — comprehensive, multi-agent research for complex topics
    * `"mini"` — faster, targeted research for narrow questions
  </Accordion>

  <Accordion title="stream">
    * `true` — real-time SSE progress events
    * `false` (default) — single response, poll for completion
  </Accordion>

  <Accordion title="output_schema">
    * Pass a JSON Schema object to get structured data instead of a markdown report
    * Write clear field descriptions for best results
  </Accordion>

  <Accordion title="citation_format">
    * `"numbered"` (default), `"mla"`, `"apa"`, `"chicago"`
    * Controls how sources are cited in the report
  </Accordion>
</AccordionGroup>

For the complete parameter list, see the [Research API reference](/documentation/api-reference/endpoint/research).

## Next Steps

<CardGroup cols={2}>
  <Card title="Research API Reference" icon="code" href="/documentation/api-reference/endpoint/research">
    Full parameter list, response schema, and interactive playground.
  </Card>

  <Card title="Streaming API Reference" icon="bolt" href="/documentation/api-reference/endpoint/research-streaming">
    Complete SSE event structure, field details, and tool types.
  </Card>

  <Card title="Research Best Practices" icon="gear" href="/documentation/best-practices/best-practices-research">
    Prompting tips, model selection, and structured output guidance.
  </Card>

  <Card title="Python SDK Reference" icon="python" href="/sdk/python/reference">
    Python client methods, async support, and type details.
  </Card>
</CardGroup>

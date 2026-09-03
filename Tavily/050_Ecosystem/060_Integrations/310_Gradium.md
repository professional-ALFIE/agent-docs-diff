> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Gradium

> Use Tavily web search with Gradium voice AI agents.

## Introduction

[Gradium](https://gradium.ai/) is a voice AI platform for building live speech agents. Pairing Gradium with [Tavily](https://tavily.com/) gives your agent access to real-time web search, extraction, research, and crawling.

In a Gradium voice agent, Tavily acts as the web context layer: the user speaks a request, the agent turns it into a structured search, Tavily returns current web results, and Gradium speaks the answer back.

<CardGroup cols={2}>
  <Card title="Tavily" icon="arrow-up-right-from-square" href="https://www.tavily.com/">
    Explore Tavily's web search and research APIs.
  </Card>

  <Card title="Paris rental voice agent" icon="github" href="https://github.com/gradium-ai/gradbot/tree/main/demos/paris_rental_agent">
    See a Gradbot demo that uses voice AI to search for Paris rentals.
  </Card>
</CardGroup>

## Voice-controlled web search

A voice search agent usually follows this loop:

1. The user asks a spoken question, such as "Find two-bedroom rentals near Canal Saint-Martin under 2,500 euros."
2. Gradium Speech-to-Text transcribes the request in real time.
3. Your agent decides whether it needs fresh web context and calls Tavily with a focused query.
4. Tavily returns search results and source content for the agent to inspect.
5. The agent filters, compares, and summarizes the results.
6. Gradium Text-to-Speech streams the answer back to the user.

This pattern lets users control web search without typing. They can refine the search conversationally, ask for tradeoffs, compare sources, or narrow results by criteria like budget, neighborhood, date, availability, or ranking.

## Core wiring

The Gradbot demo exposes search as a voice-agent tool. Gradium handles the live STT and TTS session, while the agent decides when to call `run_apartment_search`.

### Agent session config

```python theme={null}
def on_start(msg: dict) -> gradbot.SessionConfig:
    return gradbot.SessionConfig(
        voice_id="ubuXFxVQwVYnZQhy",
        instructions=SYSTEM_PROMPT,
        language=gradbot.LANGUAGES["en"],
        tools=build_tools(),
        silence_timeout_s=0.0,
        **config.session_kwargs,
    )

await gradbot.websocket.handle_session(
    websocket,
    config=config,
    on_start=on_start,
    on_tool_call=on_tool_call,
)
```

### Search tool definition

```python theme={null}
gradbot.ToolDef(
    name="run_apartment_search",
    description=(
        "Run a fresh apartment search and return top matches. "
        "Call only when the user explicitly asks to search."
    ),
    parameters_json=json.dumps({
        "type": "object",
        "properties": {
            "max_results": {"type": "integer"},
            "allow_unconfirmed_profile": {"type": "boolean"},
        },
        "required": [],
    }),
)
```

When the model calls the tool, the voice handler routes it into the same search logic used by the REST API and sends a compact result back to the agent before it speaks.

```python theme={null}
async def on_tool_call(handle, input_handle, websocket):
    if handle.name == "run_apartment_search":
        result = await assistant_tools.run_apartment_search(
            db,
            user_id,
            max_results=int((handle.args or {}).get("max_results") or 10),
            allow_unconfirmed_profile=bool(
                (handle.args or {}).get("allow_unconfirmed_profile")
            ),
        )
        await handle.send_json(_voice_summarize_search(result))
```

The shared search logic eventually calls Tavily with the focused query built from the user's confirmed profile.

```python theme={null}
response = await httpx.AsyncClient().post(
    "https://api.tavily.com/search",
    json={
        "api_key": tavily_api_key,
        "query": "location appartement Paris 2 chambres 2500 euros",
        "search_depth": "basic",
        "max_results": 5,
        "include_raw_content": True,
    },
    timeout=20.0,
)

results = response.json()["results"]
```

## When to use Tavily with Gradium

* **Live search assistants:** Answer questions that depend on current web results.
* **Research agents:** Collect, compare, and summarize web sources while keeping the conversation hands-free.
* **Shopping, travel, and real estate workflows:** Let users narrow options by speaking constraints naturally.
* **Customer support agents:** Fetch public documentation or status information while the caller stays in a voice conversation.

## Resources

* [Gradium documentation index](https://docs.gradium.ai/llms.txt)
* [Paris rental voice agent demo](https://github.com/gradium-ai/gradbot/tree/main/demos/paris_rental_agent)
* [Tavily Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search)

## Demo

The [Paris rental voice agent](https://github.com/gradium-ai/gradbot/tree/main/demos/paris_rental_agent) shows how a Gradbot application can combine a spoken interface with web search. Use it as a reference for the agent loop: listen to the user, call a web search tool, reason over the results, and respond with speech.

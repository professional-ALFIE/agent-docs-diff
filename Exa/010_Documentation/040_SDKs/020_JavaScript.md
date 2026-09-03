> 원본: https://exa.ai/docs/sdks/javascript-sdk.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# JavaScript SDK

> Install and use the Exa JavaScript SDK

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

The official JavaScript SDK for Exa. Search the web, get page contents, and get answers with citations.

<Card title="Get API Key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Get your API key from the dashboard
</Card>

## Install

<CodeGroup>
  ```bash npm theme={null}
  npm install exa-js
  ```

  ```bash yarn theme={null}
  yarn add exa-js
  ```

  ```bash pnpm theme={null}
  pnpm add exa-js
  ```
</CodeGroup>

## Authentication

Set your API key as an environment variable:

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

## Quick Start

```ts theme={null}
import Exa from "exa-js";

const exa = new Exa(); // reads EXA_API_KEY from environment
```

<Note>
  `new Exa()` reads your key from the `EXA_API_KEY` environment variable. To set it explicitly instead, pass it inline: `new Exa("your-api-key")`.
</Note>

## Recommended defaults

* Start with `exa.search(...)`.
* Use `type: "auto"` unless you have a clear latency or synthesis reason to change it.
* Prefer `contents: { highlights: true }` for first integrations.
* Switch to `exa.getContents(...)` only when you already know the URLs.
* Use `maxAgeHours` for freshness control.

<Warning>
  On `/search`, `text`, `highlights`, and `summary` belong inside `contents`. On `/contents`,
  those same fields are top-level arguments.
</Warning>

## Search

Search the web and get page contents in one call.

<Tip>
  `highlights` is a strong default for retrieval workflows because it preserves the most relevant
  evidence without pulling full page text into every response.
</Tip>

```ts theme={null}
const result = await exa.search("blog post about artificial intelligence", {
  contents: {
    highlights: true,
  },
});
```

```ts theme={null}
const result = await exa.search("interesting articles about space", {
  numResults: 10,
  includeDomains: ["nasa.gov", "space.com"],
  startPublishedDate: "2024-01-01",
  contents: {
    highlights: true,
  },
});
```

```ts theme={null}
const structuredResult = await exa.search("Who is the CEO of OpenAI?", {
  type: "deep",
  systemPrompt: "Prefer official sources and avoid duplicate results",
  outputSchema: {
    type: "object",
    properties: {
      leader: { type: "string" },
      title: { type: "string" },
      sourceCount: { type: "number" },
    },
    required: ["leader", "title"],
  },
  contents: {
    highlights: true,
  },
});

console.log(structuredResult.output?.content);
```

<Note>
  `outputSchema` and `systemPrompt` work across all search types. Keep `outputSchema` focused on
  `output.content`, and use `systemPrompt` to guide the final returned result. For more demanding
  synthesis, prefer reasoning-focused search types like `deep-lite`, `deep`, or `deep-reasoning`. Do not include `citations`/`confidence` in your schema; Exa returns grounding
  automatically in `output.grounding`. Including citation/confidence fields in `outputSchema`
  duplicates data, reduces structure quality, and is usually less reliable.
</Note>

Reasoning-focused search variants:

* `deep-lite`: lowest-latency deep-search mode
* `deep`: light mode
* `deep-reasoning`: base reasoning mode

<Note>
  Need streaming structured synthesis? The raw `/search` endpoint supports `stream: true` together
  with `outputSchema` and returns OpenAI-compatible SSE chunks. See the [Search API
  guide](/docs/reference/search-api-guide).
</Note>

## Get Contents

Get text, summaries, or highlights from URLs.

```ts theme={null}
const { results } = await exa.getContents(["https://openai.com/research"], {
  text: true,
});
```

```ts theme={null}
const { results } = await exa.getContents(["https://stripe.com/docs/api"], {
  summary: true,
});
```

```ts theme={null}
const { results } = await exa.getContents(["https://arxiv.org/abs/2303.08774"], {
  highlights: true,
});
```

## Answer

Get answers to questions with citations.

```ts theme={null}
const response = await exa.answer("What caused the 2008 financial crisis?");
console.log(response.answer);
```

```ts theme={null}
for await (const chunk of exa.streamAnswer("Explain quantum computing")) {
  if (chunk.content) {
    process.stdout.write(chunk.content);
  }
}
```

## Deep reasoning

```ts theme={null}
const result = await exa.search("Find the top 5 AI startups founded in 2024", {
  type: "deep-reasoning",
  outputSchema: {
    type: "object",
    properties: {
      startups: { type: "array", items: { type: "string" } },
    },
  },
  contents: { highlights: true },
});
```

## TypeScript

Full TypeScript support with types for all methods.

```ts theme={null}
import Exa from "exa-js";
import type { SearchResponse, RegularSearchOptions } from "exa-js";
```

## Resources

* [**GitHub**](https://github.com/exa-labs/exa-js) - View source code
* [**npm**](https://www.npmjs.com/package/exa-js) - View package

## Continue

<Columns cols={4}>
  <Card title="Search guide" icon="search" href="/docs/reference/search-api-guide" cta="Open guide" arrow="true">
    Return to the main Search guide for request patterns, filters, and deeper modes.
  </Card>

  <Card title="Search reference" icon="square-terminal" href="/docs/reference/search" cta="Open reference" arrow="true">
    Jump to the full `/search` request and response schema.
  </Card>

  <Card title="Contents guide" icon="file-text" href="/docs/reference/contents-api-guide" cta="Open guide" arrow="true">
    Use Contents when you already know the URLs and want direct extraction.
  </Card>

  <Card title="TypeScript SDK spec" icon="book-open-text" href="/docs/sdks/typescript-sdk-specification" cta="Open spec" arrow="true">
    See the full JavaScript and TypeScript SDK method and type reference.
  </Card>
</Columns>

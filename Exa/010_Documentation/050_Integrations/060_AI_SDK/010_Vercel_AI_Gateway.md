> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Vercel AI Gateway

> Use Exa web search through Vercel AI Gateway with the AI SDK.

Use Exa web search through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) with `gateway.tools.exaSearch()` from the `ai` package. You do not need an Exa API key; Vercel bills these requests through AI Gateway. See Vercel's [web search documentation](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) for the complete reference.

## Install

Install AI SDK 5 or later:

```bash install.sh theme={null}
npm install ai
```

## Authentication

<Info>
  AI Gateway requires an API key or OIDC token. Create an `AI_GATEWAY_API_KEY` in the Vercel dashboard under **AI Gateway > API Keys**, then add it to your environment.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

When you deploy your application on Vercel, you can use the automatically available `VERCEL_OIDC_TOKEN` instead. See Vercel's [authentication and BYOK documentation](https://vercel.com/docs/ai-gateway/authentication-and-byok).

## Quick start

You can use Exa search with any supported model:

```typescript quickstart.ts theme={null}
import { gateway, generateText, stepCountIs } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

## Streaming

Use `streamText` to process generated text and search tool events as they arrive:

```typescript stream.ts theme={null}
import { gateway, streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'tool-call') {
    console.log('Tool call:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Search results received');
  }
}
```

In a Next.js route handler, return the stream to the client with `return result.toUIMessageStreamResponse()`.

## Configuration

Pass options to `gateway.tools.exaSearch()` to tune your search:

```typescript configuration.ts theme={null}
tools: {
  exa_search: gateway.tools.exaSearch({
    type: 'fast',
    numResults: 5,
    category: 'news',
    includeDomains: ['reuters.com', 'bbc.com', 'nytimes.com'],
    contents: {
      highlights: true,
      maxAgeHours: 24,
    },
  }),
},
```

The available options include:

| Option                                                 | Description                                                    |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `type`                                                 | Search mode: `auto` (default), `fast`, or `instant`.           |
| `numResults`                                           | Number of results to return, from 1 to 100. The default is 10. |
| `category`                                             | Content category.                                              |
| `includeDomains` / `excludeDomains`                    | Include or exclude specific domains.                           |
| `startPublishedDate` / `endPublishedDate`              | Filter results by publication date.                            |
| `userLocation`                                         | Two-letter ISO country code for location-aware search.         |
| `contents.text`                                        | Return extracted page text.                                    |
| `contents.highlights`                                  | Return relevant page highlights.                               |
| `contents.maxAgeHours`                                 | Set the maximum age of cached content.                         |
| `contents.livecrawlTimeout`                            | Set the livecrawl timeout.                                     |
| `contents.subpages` / `contents.subpageTarget`         | Crawl subpages and optionally target a subpage.                |
| `contents.extras.links` / `contents.extras.imageLinks` | Return links or image links from results.                      |

See Vercel's [Exa web search reference](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) for the full list of parameters and their behavior.

## Vercel eve agents

Agents built with [eve](https://eve.dev) get the built-in `web_search` tool, and AI Gateway models run it on Exa by default, without the need for configuration or an Exa API key. To pin the provider explicitly, export it from `agent/tools/web_search.ts`:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

Models called through a direct provider instead of AI Gateway keep their native web search. See eve's [harness documentation](https://eve.dev/docs/concepts/default-harness#built-in-tools) for the full tool set.

## Pricing

<Tip>
  Exa web search is **free through August 31** on AI Gateway and eve, so you can build with it today at no cost.
</Tip>

After that, Vercel bills requests through AI Gateway at the rates in Vercel's [web search documentation](https://vercel.com/docs/ai-gateway/models-and-providers/web-search).

<Note>
  This integration currently supports Exa's standard search modes and content extraction controls. Deep synthesis modes and generated summaries are not exposed yet.
</Note>

<Columns cols={2}>
  <Card title="Use the Exa AI SDK" icon="code" href="/docs/reference/vercel">
    Call Exa directly with an Exa API key through `@exalabs/ai-sdk`.
  </Card>

  <Card title="Read Vercel's web search reference" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search">
    Review the complete AI Gateway configuration and pricing reference.
  </Card>
</Columns>

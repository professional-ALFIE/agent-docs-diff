> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# AI SDK by Vercel

> Add Exa web search to AI SDK applications with the @exalabs/ai-sdk package.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

Use the `@exalabs/ai-sdk` package to add Exa web search to applications built with the AI SDK by Vercel. You provide an Exa API key, and the `webSearch()` tool handles search requests for your model.

## Install

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

## Quick start

```typescript quickstart.ts theme={null}
import { generateText, stepCountIs } from 'ai';
import { webSearch } from '@exalabs/ai-sdk';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Tell me the latest developments in AI',
  system: 'Only use web search once per turn. Answer based on the information you have.',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<Info>
  Create an [Exa API key](https://dashboard.exa.ai/api-keys) and set it as `EXA_API_KEY` before you run the example. The package reads this environment variable automatically.
</Info>

## Defaults

`webSearch()` uses these defaults:

* `type`: `auto`
* `numResults`: `10`
* `contents.text`: `3000` characters per result
* `maxAgeHours`: the default cache fallback; set this option when you need stricter freshness

## Configure search

Use the options below to tune search and content extraction:

```typescript configuration.ts theme={null}
const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Find the top AI companies in Europe founded after 2018',
  tools: {
    webSearch: webSearch({
      type: 'auto',
      numResults: 6,
      category: 'company',
      contents: {
        text: { maxCharacters: 1000 },
        maxAgeHours: 1,
        summary: true,
      },
    }),
  },
  stopWhen: stepCountIs(5),
});

console.log(text);
```

### Search options

| Option                                    | Description                                                                                           |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `type`                                    | Search mode: `auto`, `fast`, `instant`, `deep-lite`, `deep`, or `deep-reasoning`.                     |
| `category`                                | Content category: `company`, `publication`, `news`, `personal site`, `people`, or `financial report`. |
| `numResults`                              | Number of results to return.                                                                          |
| `includeDomains` / `excludeDomains`       | Include or exclude specific domains.                                                                  |
| `startPublishedDate` / `endPublishedDate` | Filter results by publication date in ISO 8601 format.                                                |
| `includeText` / `excludeText`             | Require or exclude text in results.                                                                   |
| `userLocation`                            | Two-letter country code for location-aware search.                                                    |

### Content options

| Option                                                 | Description                                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `contents.text`                                        | Return extracted text. Supports `maxCharacters` and `includeHtmlTags`.                 |
| `contents.summary`                                     | Return an AI-generated summary. Supports a `query`.                                    |
| `contents.maxAgeHours`                                 | Use cached content only when it is within the specified age; otherwise, use livecrawl. |
| `contents.livecrawlTimeout`                            | Set the livecrawl timeout.                                                             |
| `contents.subpages` / `contents.subpageTarget`         | Crawl subpages and optionally target a subpage.                                        |
| `contents.extras.links` / `contents.extras.imageLinks` | Return links or image links from results.                                              |

## TypeScript support

The package includes TypeScript types:

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

## Related pages

<Columns cols={2}>
  <Card title="Use Vercel AI Gateway" icon="cloud" href="/docs/integrations/vercel-ai-gateway">
    Use Exa web search without an Exa API key through Vercel's AI Gateway.
  </Card>

  <Card title="Explore the AI SDK package" icon="github" href="https://github.com/exa-labs/ai-sdk">
    View the source code and package details on GitHub.
  </Card>
</Columns>

You can also find the package on [npm](https://www.npmjs.com/package/@exalabs/ai-sdk) and read the [Vercel AI SDK web search guide](https://ai-sdk.dev/cookbook/node/web-search-agent#exa).

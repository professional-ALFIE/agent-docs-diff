> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Mastra

> Use Tavily as first-class Mastra tools for web search, extract, crawl, and map via the native package.

## Introduction

[Mastra](https://mastra.ai) is a TypeScript framework for building AI agents and workflows.

The [`@mastra/tavily`](https://mastra.ai/reference/tools/tavily) package exposes Tavily's [Search](https://docs.tavily.com/documentation/api-reference/endpoint/search), [Extract](https://docs.tavily.com/documentation/api-reference/endpoint/extract), [Crawl](https://docs.tavily.com/documentation/api-reference/endpoint/crawl), and [Map](https://docs.tavily.com/documentation/api-reference/endpoint/map) APIs as Mastra-compatible tools with [Zod](https://zod.dev)-based input/output schemas.

For full reference docs, please refer to the [Mastra documentation](https://docs.mastra.ai/reference/tools/tavily).

## Step-by-Step Integration Guide

### Step 1: Install Required Packages

```bash theme={null}
npm install @mastra/tavily @tavily/core zod
```

### Step 2: Set Up API Keys

* **Tavily API Key:** [Get your Tavily API key here](https://app.tavily.com/home)
* **Anthropic API Key** (or any Mastra-supported provider): [Get an Anthropic API key here](https://console.anthropic.com/)

Set these as environment variables:

```bash theme={null}
export TAVILY_API_KEY=tvly-your-api-key
export ANTHROPIC_API_KEY=your-anthropic-api-key
```

All factory functions read `TAVILY_API_KEY` by default. You can override per tool by passing `{ apiKey }`.

### Step 3: Create Tavily Tools

Use `createTavilyTools()` to get all four tools with shared configuration:

```typescript theme={null}
import { createTavilyTools } from "@mastra/tavily";

const tools = createTavilyTools();
// tools.tavilySearch, tools.tavilyExtract, tools.tavilyCrawl, tools.tavilyMap

// Or with an explicit API key:
const tools = createTavilyTools({ apiKey: "tvly-..." });
```

Each tool can also be created individually when you only need one:

```typescript theme={null}
import {
  createTavilySearchTool,
  createTavilyExtractTool,
} from "@mastra/tavily";

const searchTool = createTavilySearchTool();
const extractTool = createTavilyExtractTool();
```

### Step 4: Wire Tools into a Mastra Agent

```typescript theme={null}
import { Agent } from "@mastra/core/agent";
import {
  createTavilySearchTool,
  createTavilyExtractTool,
} from "@mastra/tavily";

const agent = new Agent({
  id: "web-search-agent",
  name: "Web Search Agent",
  model: "anthropic/claude-sonnet-4-6",
  instructions:
    "You are a web search assistant. Use the search tool to find relevant pages, then use extract to pull full content from the best results.",
  tools: {
    search: createTavilySearchTool(),
    extract: createTavilyExtractTool(),
  },
});
```

## Available Tools

### Tavily Search

Real-time web search.

Tool ID: `tavily-search`.

```typescript theme={null}
import { createTavilySearchTool } from "@mastra/tavily";

const searchTool = createTavilySearchTool();
```

**Key input options:**

* `query` (required) — the search query
* `searchDepth` — `"basic"`, `"advanced"`, `"fast"`, or `"ultra-fast"`
* `maxResults` — 1–20
* `includeAnswer` — `boolean`, `"basic"`, or `"advanced"` for an AI-generated summary
* `includeImages`, `includeImageDescriptions`
* `includeRawContent` — `false`, `"markdown"`, or `"text"`
* `includeDomains`, `excludeDomains` — string arrays
* `timeRange` — `"day"`, `"week"`, `"month"`, or `"year"`

### Tavily Extract

Clean, structured content extraction from one or more URLs (up to 20 per request).

Tool ID: `tavily-extract`.

```typescript theme={null}
import { createTavilyExtractTool } from "@mastra/tavily";

const extractTool = createTavilyExtractTool();
```

**Key input options:**

* `urls` (required) — 1–20 URLs
* `extractDepth` — `"basic"` or `"advanced"` (use `"advanced"` for tables and embedded content)
* `query` — user intent used to rerank extracted chunks
* `includeImages`
* `format` — `"markdown"` (default) or `"text"`

### Tavily Crawl

Crawl a website from a starting URL with configurable depth, breadth, and domain constraints.

Tool ID: `tavily-crawl`.

```typescript theme={null}
import { createTavilyCrawlTool } from "@mastra/tavily";

const crawlTool = createTavilyCrawlTool();
```

**Key input options:**

* `url` (required) — root URL for the crawl
* `maxDepth`, `maxBreadth`, `limit`
* `instructions` — natural-language crawling hints
* `selectPaths`, `selectDomains`, `excludePaths`, `excludeDomains` — regex arrays
* `allowExternal`
* `extractDepth`, `includeImages`, `format`

### Tavily Map

Discover site structure without extracting content — returns a list of URLs.

Tool ID: `tavily-map`.

```typescript theme={null}
import { createTavilyMapTool } from "@mastra/tavily";

const mapTool = createTavilyMapTool();
```

**Key input options:**

* `url` (required) — root URL for the map
* `maxDepth`, `maxBreadth`, `limit`
* `instructions`
* `selectPaths`, `selectDomains`, `excludePaths`, `excludeDomains`
* `allowExternal`

## Configuration

All factory functions accept the same `TavilyClientOptions`:

* `apiKey` — falls back to the `TAVILY_API_KEY` environment variable
* `clientSource` — attribution string sent with each request (defaults to `"mastra"`)
* `apiBaseURL` — override the Tavily API base URL
* `proxies` — proxy configuration for the underlying HTTP client
* `projectId` — Tavily project ID for request scoping

## Using Multiple Tools Together

Combine tools for richer research workflows — for example, map a site first, then crawl the paths you care about:

```typescript theme={null}
import { Agent } from "@mastra/core/agent";
import { createTavilyTools } from "@mastra/tavily";

const tools = createTavilyTools();

const agent = new Agent({
  id: "site-research-agent",
  name: "Site Research Agent",
  model: "anthropic/claude-sonnet-4-6",
  instructions:
    "Given a website, map its structure, pick the most relevant paths, then crawl them and summarize the findings.",
  tools,
});
```

## Environment Variables

| Variable         | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `TAVILY_API_KEY` | Your Tavily API key. Used as the default when `apiKey` is not passed to a factory function. |

## Benefits of Tavily + Mastra

* **First-class tools:** drop-in `createTool()`-compatible factories with Zod input/output schemas.
* **Lazy, cached client:** each tool instantiates `@tavily/core` on first use and reuses it across calls.

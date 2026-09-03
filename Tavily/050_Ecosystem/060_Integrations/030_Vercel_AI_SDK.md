> 원본: https://docs.tavily.com/documentation/integrations/vercel.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Vercel AI SDK

> Integrate Tavily with Vercel AI SDK to enhance your AI agents with powerful web search, content extraction, crawling, and site mapping capabilities.

## Introduction

The `@tavily/ai-sdk` package provides pre-built AI SDK tools for Vercel's AI SDK v5, making it easy to add real-time web search, content extraction, intelligent crawling, and site mapping to your AI applications.

## Step-by-Step Integration Guide

### Step 1: Install Required Packages

Install the necessary packages:

```bash theme={null}
npm install ai @ai-sdk/openai @tavily/ai-sdk
```

### Step 2: Set Up API Keys

* **Tavily API Key:** [Get your Tavily API key here](https://app.tavily.com/home)
* **OpenAI API Key:** [Get your OpenAI API key here](https://platform.openai.com/account/api-keys)

Set these as environment variables:

```bash theme={null}
export TAVILY_API_KEY=tvly-your-api-key
export OPENAI_API_KEY=your-openai-api-key
```

### Step 3: Basic Usage

The simplest way to get started with Tavily Search:

```typescript theme={null}
import { tavilySearch } from "@tavily/ai-sdk";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "What are the latest developments in quantum computing?",
  tools: {
    tavilySearch: tavilySearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(result.text);
```

## Available Tools

### Tavily Search

Real-time web search optimized for AI applications:

```typescript theme={null}
import { tavilySearch } from "@tavily/ai-sdk";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "Research the latest trends in renewable energy technology",
  tools: {
    tavilySearch: tavilySearch({
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 5,
      topic: "general",
    }),
  },
  stopWhen: stepCountIs(3),
});
```

**Key Configuration Options:**

* `searchDepth?: "basic" | "advanced"` - Search depth (default: "basic")
* `topic?: "general" | "news" | "finance"` - Search category
* `includeAnswer?: boolean` - Include AI-generated answer
* `maxResults?: number` - Maximum results to return (default: 5)
* `includeImages?: boolean` - Include images in results
* `timeRange?: "year" | "month" | "week" | "day"` - Time range for results
* `includeDomains?: string[]` - Domains to include
* `excludeDomains?: string[]` - Domains to exclude

### Tavily Extract

Clean, structured content extraction from URLs:

```typescript theme={null}
import { tavilyExtract } from "@tavily/ai-sdk";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "Extract and summarize the content from https://tavily.com",
  tools: {
    tavilyExtract: tavilyExtract(),
  },
});
```

**Key Configuration Options:**

* `extractDepth?: "basic" | "advanced"` - Extraction depth
* `format?: "markdown" | "text"` - Output format (default: "markdown")
* `includeImages?: boolean` - Include images in extracted content

### Tavily Crawl

Intelligent website crawling at scale:

```typescript theme={null}
import { tavilyCrawl } from "@tavily/ai-sdk";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "Crawl tavily.com and tell me about their integrations",
  tools: {
    tavilyCrawl: tavilyCrawl({
      maxDepth: 2,
      limit: 50,
    }),
  },
});
```

**Key Configuration Options:**

* `maxDepth?: number` - Maximum crawl depth (1-5, default: 1)
* `maxBreadth?: number` - Maximum pages per depth level (1-100, default: 20)
* `limit?: number` - Maximum total pages to crawl (default: 50)
* `extractDepth?: "basic" | "advanced"` - Content extraction depth
* `instructions?: string` - Natural language crawling instructions
* `selectPaths?: string[]` - Path patterns to include
* `excludePaths?: string[]` - Path patterns to exclude
* `allowExternal?: boolean` - Allow crawling external domains

### Tavily Map

Website structure discovery and mapping:

```typescript theme={null}
import { tavilyMap } from "@tavily/ai-sdk";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "Map the structure of tavily.com",
  tools: {
    tavilyMap: tavilyMap(),
  },
  stopWhen: stepCountIs(3),
});
```

**Key Configuration Options:**

* `maxDepth?: number` - Maximum mapping depth (1-5, default: 1)
* `maxBreadth?: number` - Maximum pages per depth level (1-100, default: 20)
* `limit?: number` - Maximum total pages to map (default: 50)
* `instructions?: string` - Natural language mapping instructions
* `selectPaths?: string[]` - Path patterns to include
* `excludePaths?: string[]` - Path patterns to exclude
* `allowExternal?: boolean` - Allow mapping external domains

## Using Multiple Tools Together

You can combine multiple Tavily tools in a single AI agent for comprehensive research capabilities:

```typescript theme={null}
import { 
  tavilySearch, 
  tavilyExtract, 
  tavilyCrawl, 
  tavilyMap 
} from "@tavily/ai-sdk";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const result = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "Research the company at tavily.com - search for news, map their site, and extract key pages",
  tools: {
    tavilySearch: tavilySearch({ searchDepth: "advanced" }),
    tavilyExtract: tavilyExtract(),
    tavilyCrawl: tavilyCrawl(),
    tavilyMap: tavilyMap(),
  },
  stopWhen: stepCountIs(5),
});
```

## Advanced Examples

### News Research with Time Range

```typescript theme={null}
const newsResult = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "What are the top technology news stories from this week?",
  tools: {
    tavilySearch: tavilySearch({
      topic: "news",
      timeRange: "week",
      maxResults: 10,
    }),
  },
  stopWhen: stepCountIs(3),
});
```

### Market Analysis with Advanced Search

```typescript theme={null}
const marketResult = await generateText({
  model: openai("gpt-5-mini"),
  prompt: "Analyze the current state of the electric vehicle market",
  tools: {
    tavilySearch: tavilySearch({
      searchDepth: "advanced",
      topic: "finance",
      includeAnswer: true,
      maxResults: 10,
    }),
  },
  stopWhen: stepCountIs(5),
});
```

## Benefits of Tavily + Vercel AI SDK

* **Pre-built Tools:** No need to manually create tool definitions - just import and use
* **Type-Safe:** Full TypeScript support with proper type definitions
* **Real-time Information:** Access up-to-date web content for your AI agents
* **Optimized for LLMs:** Search results are specifically formatted for language models
* **Multiple Capabilities:** Search, extract, crawl, and map websites - all in one package
* **Easy Integration:** Works seamlessly with Vercel AI SDK v5
* **Flexible Configuration:** Extensive configuration options for all tools
* **Production-Ready:** Built on the reliable Tavily API infrastructure

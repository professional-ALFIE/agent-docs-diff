> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Convex

> Add real-time web search and content extraction to your Convex application with the official Tavily Convex component.

<CardGroup cols={1}>
  <Card title="Get API Key" icon="key" href="https://app.tavily.com" horizontal>
    Sign up at tavily.com
  </Card>
</CardGroup>

## Introduction

[Convex](https://convex.dev) is a backend platform for building full-stack apps with a reactive database, server functions, and real-time sync. Components let you add isolated, reusable backend capabilities to your app.

The [`@tavily/convex-tavily`](https://github.com/tavily-ai/convex-tavily) component installs Tavily as an isolated Convex component. Your application actions call a typed `TavilyClient`, which delegates to component actions and keeps `TAVILY_API_KEY` in typed Convex environment configuration.

<Frame>
  <video controls preload="metadata" aria-label="Installing and using the Tavily component in a Convex app">
    <source src="https://mintcdn.com/tavilyai/g9uv41B01nVMuWqZ/images/convex-component.mp4?fit=max&auto=format&n=g9uv41B01nVMuWqZ&q=85&s=82b1a82fcf10dc24e398ce2faa9584a1" type="video/mp4" data-path="images/convex-component.mp4" />
  </video>
</Frame>

## What the Tavily component adds

| Method                      | What it does                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `tavily.search(ctx, args)`  | Search the web with `basic`/`advanced` depth, time range filtering, and image, favicon, and usage options |
| `tavily.extract(ctx, args)` | Extract clean content from up to 20 URLs, including query-focused chunks, images, and timeout controls    |

The component is stateless and owns no database tables.

## Requirements

* A [Convex](https://convex.dev) project with Node.js and npm
* A Tavily API key

## Setup

<AccordionGroup>
  <Accordion title="Step 1: Install the component">
    Add the package to your Convex app:

    ```bash theme={null}
    npm install @tavily/convex-tavily
    ```
  </Accordion>

  <Accordion title="Step 2: Register the component">
    Add the component to `convex/convex.config.ts`:

    ```ts theme={null}
    import { defineApp } from "convex/server";
    import { v } from "convex/values";
    import tavily from "@tavily/convex-tavily/convex.config";

    const app = defineApp({
      env: {
        TAVILY_API_KEY: v.string(),
      },
    });

    app.use(tavily, {
      name: "tavily",
      env: {
        TAVILY_API_KEY: app.env.TAVILY_API_KEY,
      },
    });

    export default app;
    ```
  </Accordion>

  <Accordion title="Step 3: Set your API key">
    Store your Tavily API key in your Convex environment:

    ```bash theme={null}
    npx convex env set TAVILY_API_KEY tvly-your-key
    ```
  </Accordion>

  <Accordion title="Step 4: Call Tavily from an application action">
    Create an application-owned action that wraps the component. Keeping this wrapper in your app gives you a place to add authentication, authorization, and rate limiting:

    ```ts theme={null}
    import { action } from "./_generated/server";
    import { components } from "./_generated/api";
    import { TavilyClient } from "@tavily/convex-tavily";
    import { v } from "convex/values";

    const tavily = new TavilyClient(components.tavily);

    export const searchWeb = action({
      args: { query: v.string() },
      handler: async (ctx, args) => {
        return await tavily.search(ctx, {
          query: args.query,
          searchDepth: "advanced",
          maxResults: 5,
          includeAnswer: false,
          includeFavicon: true,
        });
      },
    });
    ```
  </Accordion>

  <Accordion title="Step 5: Verify the component is working">
    Call your action from your app client with a current-events query, for example:

    ```text theme={null}
    What were the latest Model Context Protocol announcements?
    ```

    The request flows from your client through your application action, `TavilyClient`, and the component to `https://api.tavily.com/search`, and returns grounded results with sources.
  </Accordion>
</AccordionGroup>

## Extract content from known pages

Use `tavily.extract` to pull clean markdown from specific URLs:

```ts theme={null}
export const extractPages = action({
  args: {
    urls: v.array(v.string()),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await tavily.extract(ctx, {
      urls: args.urls,
      query: args.query,
      chunksPerSource: args.query ? 3 : undefined,
      extractDepth: "advanced",
      format: "markdown",
    });
  },
});
```

## Learn more

* [Convex documentation](https://docs.convex.dev)
* [Convex components](https://docs.convex.dev/components)
* [Tavily component for Convex](https://github.com/tavily-ai/convex-tavily)
* [Tavily Search API Reference](/documentation/api-reference/endpoint/search)
* [Tavily Extract API Reference](/documentation/api-reference/endpoint/extract)

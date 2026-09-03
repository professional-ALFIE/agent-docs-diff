> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Content Freshness

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

With Exa, we can already search the web using LLMs.

By default, we serve cached content to bias for the fastest response possible. If you need fresher content, use the `maxAgeHours` parameter to control how old cached content can be before we fetch a live version.

## maxAgeHours

`maxAgeHours` sets the maximum acceptable age (in hours) for cached content. If the cached version is older than this threshold, Exa will livecrawl the page to get fresh content.

| Value    | Behavior                                                    | Best For                                        |
| -------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `24`     | Use cache if less than 24 hours old, otherwise livecrawl    | Daily-fresh content                             |
| `1`      | Use cache if less than 1 hour old, otherwise livecrawl      | Near real-time data                             |
| `0`      | Always livecrawl (ignore cache entirely)                    | Real-time data where cached content is unusable |
| `-1`     | Never livecrawl (cache only)                                | Maximum speed, historical/static content        |
| *(omit)* | Default behavior (livecrawl as fallback if no cache exists) | **Recommended** — balanced speed and freshness  |

## When LiveCrawl Isn't Necessary

Cached data is sufficient for many queries, especially for historical topics like "What were the major causes of World War II?" or educational content such as "How does photosynthesis work?" These subjects rarely change, so reliable cached results can provide accurate information quickly.

## Examples

### Company News

Set `maxAgeHours` to a low value to ensure you get fresh content. Pair with `livecrawlTimeout` to prevent long-running calls from hanging:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/contents' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "ids": ["https://www.apple.com"],
      "maxAgeHours": 1,
      "livecrawlTimeout": 12000
    }' | jq
  ```

  ```python Python theme={null}
  result = exa.get_contents(
      ["https://www.apple.com"],
      max_age_hours=1,
      livecrawl_timeout=12000
  )
  ```

  ```typescript TypeScript theme={null}
  const result = await exa.getContents(
      ["https://www.apple.com"],
      {
          maxAgeHours: 1,
          livecrawlTimeout: 12000
      }
  );
  ```
</CodeGroup>

### Production Applications

For production apps, set `maxAgeHours` to match how frequently your target content changes. Pair with `livecrawlTimeout` for reliability:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/contents' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "ids": ["https://www.apple.com"],
      "maxAgeHours": 24,
      "livecrawlTimeout": 12000
    }' | jq
  ```

  ```python Python theme={null}
  result = exa.get_contents(
      ["https://www.apple.com"],
      max_age_hours=24,
      livecrawl_timeout=12000
  )
  ```

  ```typescript TypeScript theme={null}
  const result = await exa.getContents(
      ["https://www.apple.com"],
      {
          maxAgeHours: 24,
          livecrawlTimeout: 12000
      }
  );
  ```
</CodeGroup>

This will serve cached content if it's less than 24 hours old, and livecrawl otherwise. If the livecrawl fails or times out, it falls back to cached content, making it ideal for production applications.

## Deprecated: livecrawl options

The `livecrawl` string parameter (`"always"`, `"preferred"`, `"fallback"`, `"never"`) is deprecated in favor of `maxAgeHours`. If you are maintaining older integrations, migrate them to `maxAgeHours`.

| Old livecrawl value | Equivalent maxAgeHours |
| ------------------- | ---------------------- |
| `"always"`          | `0`                    |
| `"never"`           | `-1`                   |
| `"fallback"`        | *(omit — default)*     |

`"preferred"` has no direct equivalent since it always livecrawls regardless of cache age. Use a low `maxAgeHours` value (e.g. `1`) for similar behavior.

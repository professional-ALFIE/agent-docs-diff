> 원본: https://exa.ai/docs/reference/migrating-from-bing.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Migrating from Bing

> Guide for switching from the deprecated Bing Search API to Exa

## Overview

Microsoft deprecated the Bing Search API on August 11th, 2025. This guide provides the technical details needed to migrate from Bing Search API to Exa's search API.

## Quick Start

### Get your API key

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

### Install the SDK

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

### Replace your API calls

**Bing**

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -H "Ocp-Apim-Subscription-Key: YOUR_BING_KEY" \
    "https://api.bing.microsoft.com/v7.0/search?q=latest%20AI%20news&count=10" | jq
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://api.bing.microsoft.com/v7.0/search',
      params={'q': 'latest AI news', 'count': 10},
      headers={'Ocp-Apim-Subscription-Key': 'YOUR_BING_KEY'}
  )
  ```

  ```javascript JavaScript theme={null}
  fetch(
    "https://api.bing.microsoft.com/v7.0/search?q=latest%20AI%20news&count=10",
    {
      headers: {
        "Ocp-Apim-Subscription-Key": "YOUR_BING_KEY",
      },
    }
  );
  ```
</CodeGroup>

**Exa**

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "latest AI news",
      "numResults": 10
    }' | jq
  ```

  ```python Python theme={null}
  from exa_py import Exa
  exa = Exa()
  results = exa.search("latest AI news", num_results=10)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";
  const exa = new Exa();
  const results = await exa.search("latest AI news", { numResults: 10 });
  ```
</CodeGroup>

## Parameter Mapping

| Bing Parameter   | Exa Parameter                                | Notes                                        |
| ---------------- | -------------------------------------------- | -------------------------------------------- |
| `q`              | `query`                                      | Required parameter                           |
| `count`          | `numResults`                                 | Default: 10, Max: 100                        |
| `mkt`, `cc`      | `userLocation`                               | Use 2-letter ISO country code                |
| `freshness`      | `startPublishedDate`<br />`endPublishedDate` | Use ISO 8601 date format                     |
| `site:` operator | `includeDomains`<br />`excludeDomains`       | Use arrays of domain strings                 |
| Query filters    | `includeText`<br />`excludeText`             | Use arrays of phrase filters                 |
| `safeSearch`     | `moderation`                                 | Disabled by default, set to `true` to enable |
| `offset`         | Not supported                                |                                              |

## Response Format Differences

**Bing Response Structure**

```json theme={null}
{
  "webPages": {
    "value": [
      {
        "name": "Page Title",
        "url": "https://example.com",
        "snippet": "Description...",
        "dateLastCrawled": "2025-08-11T00:00:00"
      }
    ]
  }
}
```

**Exa Response Structure**

```json theme={null}
{
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "publishedDate": "2025-08-11",
      "author": "Author Name",

      "text": "Full content when requested...",
      "highlights": ["Key sentences..."]
    }
  ],
  "requestId": "unique-id"
}
```

## Examples

### Fresh Content Search

**Bing**

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -H "Ocp-Apim-Subscription-Key: YOUR_KEY" \
    "https://api.bing.microsoft.com/v7.0/search?q=AI+news&freshness=Week" | jq
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://api.bing.microsoft.com/v7.0/search',
      params={'q': 'AI news', 'freshness': 'Week'},
      headers={'Ocp-Apim-Subscription-Key': 'YOUR_KEY'}
  )
  ```

  ```javascript JavaScript theme={null}
  fetch("https://api.bing.microsoft.com/v7.0/search?q=AI+news&freshness=Week", {
    headers: {
      "Ocp-Apim-Subscription-Key": "YOUR_KEY",
    },
  });
  ```
</CodeGroup>

**Exa**

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "AI news",
      "startPublishedDate": "2025-08-04T00:00:00Z",
      "type": "auto"
    }' | jq
  ```

  ```python Python theme={null}
  from datetime import datetime, timedelta

  week_ago = (datetime.now() - timedelta(days=7)).isoformat() + "Z"
  results = exa.search(
      "AI news",
      start_published_date=week_ago,
      type="auto"
  )
  ```

  ```javascript JavaScript theme={null}
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const results = await exa.search("AI news", {
    startPublishedDate: weekAgo.toISOString(),
    type: "auto",
  });
  ```
</CodeGroup>

### Domain-Specific Search

**Bing**

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -H "Ocp-Apim-Subscription-Key: YOUR_KEY" \
    "https://api.bing.microsoft.com/v7.0/search?q=site:arxiv.org+transformers" | jq
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://api.bing.microsoft.com/v7.0/search',
      params={'q': 'site:arxiv.org transformers'},
      headers={'Ocp-Apim-Subscription-Key': 'YOUR_KEY'}
  )
  ```

  ```javascript JavaScript theme={null}
  fetch(
    "https://api.bing.microsoft.com/v7.0/search?q=site:arxiv.org+transformers",
    {
      headers: {
        "Ocp-Apim-Subscription-Key": "YOUR_KEY",
      },
    }
  );
  ```
</CodeGroup>

**Exa**

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "transformers",
      "includeDomains": ["arxiv.org"],
      "type": "auto"
    }' | jq
  ```

  ```python Python theme={null}
  results = exa.search(
      "transformers",
      include_domains=["arxiv.org"],
      type="auto"
  )
  ```

  ```javascript JavaScript theme={null}
  const results = await exa.search("transformers", {
    includeDomains: ["arxiv.org"],
    type: "auto",
  });
  ```
</CodeGroup>

### Search with Content Extraction

Exa provides integrated content extraction, eliminating the need for separate API calls:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "climate change research",
      "numResults": 5,
      "contents": {
        "text": true,
        "highlights": {
          "query": "key findings"
        }
      }
    }' | jq
  ```

  ```python Python theme={null}
  results = exa.search(
      "climate change research",
      num_results=5,
      contents={
          "text": True,
          "highlights": {
              "query": "key findings"
          }
      }
  )
  ```

  ```javascript JavaScript theme={null}
  const results = await exa.search("climate change research", {
    numResults: 5,
    contents: {
      text: true,
      highlights: {
        query: "key findings",
      },
    },
  });
  ```
</CodeGroup>

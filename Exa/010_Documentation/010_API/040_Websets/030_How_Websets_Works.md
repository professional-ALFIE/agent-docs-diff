> 원본: https://exa.ai/docs/websets/api/how-it-works.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# How Websets Works

The Websets API operates as an **asynchronous search system**. When you create a Webset, it automatically starts searching and verifying results based on your criteria. Let's dive into each part of the process.

***

## Creating Your First Search

The process starts when you [create a Webset](/docs/websets/api/websets/create-a-webset). Here's how it flows:

### 1. Initial Request

Start by providing a search configuration:

```json theme={null}
{
  "search": {
    "query": "AI companies in Europe that raised Series A funding",
    "count": 50
  }
}
```

You can optionally specify:

* An `entity.type` to define what you're looking for
* Custom `criteria` for verification
* `enrichments` to extract specific data points
* `metadata` for your own tracking

### 2. Webset Creation

When your request is received:

1. A new Webset is created with status `running`
2. A `webset.created` event is emitted
3. The search process begins automatically

### 3. Search Process

The search flows through several stages:

1. **Initialization**

   * A new WebsetSearch is created
   * Status is set to `running`
   * `webset.search.created` event is emitted

2. **Discovery & Verification**

   * The system starts retrieving results leveraging Exa Search and verifies each one
   * Items that pass verification and match your search criteria are automatically added to your Webset
   * Each new item triggers a `webset.item.created` event
   * Items are immediately available through the [list endpoint](/docs/websets/api/websets/items/list-all-items-for-a-webset)

3. **Enrichment** (if configured)

   * Each item is processed through specified enrichments
   * `webset.item.enriched` events are emitted as results come in
   * Enrichment results are added to the item's data

4. **Completion**
   * When the search finds all items, its status changes to `completed`
   * A `webset.search.completed` event is emitted
   * If no other operations are running, you'll receive a `webset.idle` event

### Accessing Results

You can access your data throughout the process:

1. **Real-time Access**

   * Use the list endpoint to paginate through items
   * Listen for item events (`webset.item.created` and `webset.item.enriched`) to process results as they arrive

2. **Bulk Export**
   * Available once the Webset becomes `idle`
   * Includes all items with their content, verifications and enrichments
   * Useful for processing the complete dataset

<br />

***

<br />

## Running Additional Searches

You can [create additional searches](/docs/websets/api/websets/searches/create-a-search) on the same Webset at any time. Each new search:

* Follows the same event flow as the initial search
* Can run in parallel with other enrichment operations (not other searches for now)
* Maintains its own progress tracking
* Contributes to the overall Webset state

### Control Operations

Manage your searches with:

* [Cancel specific searches](/docs/websets/api/websets/searches/cancel-a-running-search)
* [Cancel all operations](/docs/websets/api/websets/cancel-a-running-webset)

<br />

***

<br />

## Up-to-date Websets using Monitors

**[Monitors](/docs/websets/api/monitors/create-a-monitor)** allow you to automatically keep your Websets updated with fresh data on a schedule, creating a continuous flow of updates without manual intervention.

### Behavior

* **Search behavior**: Automatically run new searches to find fresh content matching your criteria. New items are added to your Webset with automatic deduplication.

### Scheduling

Set your update frequency with:

* **Cron Expression**: A valid Unix cron expression with 5 fields that triggers at most once per day
* **Timezone**: Any IANA timezone (defaults to `Etc/UTC`)

### Example: Weekly Monitor for Series A Funded Companies

```json theme={null}
{
  "websetId": "ws_abc123",
  "cadence": {
    "cron": "0 9 * * 1",
    "timezone": "America/New_York"
  },
  "behavior": {
    "type": "search",
    "config": {
      "parameters": {
        "query": "AI startups that raised Series A funding in the last week",
        "count": 10,
        "criteria": [
          { "description": "Company is an AI startup" },
          {
            "description": "Company has raised Series A funding in the last week"
          }
        ],
        "entity": { "type": "company" },
        "behavior": "append"
      }
    }
  }
}
```

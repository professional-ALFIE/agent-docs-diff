> 원본: https://exa.ai/docs/websets/best-practices.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Websets Best Practices

> Best practices for building with the Websets API

Websets is an asynchronous search system that finds, verifies, and enriches web results against your criteria. It handles complex multi-step queries that would take hours manually — but getting the most out of it requires understanding how to write good queries, criteria, and enrichments.

**Recommended:** Try our [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding) — get a working webset in under a minute, then come back here for the full reference.

## Key Benefits

* **Automated verification**: Every result is checked against your criteria before becoming an item — no manual filtering needed.
* **Structured enrichments**: Extract specific data points (names, emails, URLs, numbers) from each result using web research, not just page scraping.
* **Real-time updates**: Use webhooks and monitors to keep websets continuously updated without polling.

## Writing Good Queries

The query drives search behavior. Be specific and descriptive, natural language works well for most queries.

| Approach                  | Example                                                      | Why It Works                            |
| ------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| **Specific + contextual** | "AI startups in the US that raised Series A in 2025"         | Constrains geography, stage, and timing |
| **Entity-focused**        | "VP of Engineering at mid-size fintech companies"            | Clear entity type with role specificity |
| **Domain-scoped**         | "Machine learning research papers on efficient transformers" | Targets a content type naturally        |

**Avoid vague queries** like "interesting companies" or "good articles" — these produce noisy results that waste verification tokens.

**Include URLs for context**: Any URL in the query will be crawled and used as additional context for the search. Use this when you want results similar to a specific page.

## Writing Effective Criteria

Criteria determine whether a search result becomes an item. Each result is verified against every criterion — only results matching all criteria are kept.

**Keep criteria verifiable.** Each criterion should be something that can be confirmed from publicly available web content.

```json theme={null}
{
  "criteria": [
    {"description": "Company is headquartered in the United States"},
    {"description": "Company has raised Series A or later funding"},
    {"description": "Company focuses on AI or machine learning products"}
  ]
}
```

**Avoid subjective criteria** like "Company is innovative" or "Company has a good culture" — these are hard to verify and produce inconsistent results.

**Use 1-3 criteria for best results.** More criteria means stricter filtering, which can reduce item count significantly. Start with fewer criteria and add more if you're getting too many irrelevant results.

**Check `successRate` on search responses** to see what percentage of evaluated items matched each criterion. A very low success rate might indicate an overly strict or ambiguous criterion.

## Choosing Entity Types

The `entity` field shapes how results are found and structured. Auto-detection works well in most cases, but explicit types give you more control.

| Type             | When to Use                                | Properties You Get                                                          |
| ---------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `company`        | Company websites, LinkedIn company pages   | `company.name`, `company.location`, `company.employees`, `company.industry` |
| `person`         | People profiles, LinkedIn individuals      | `person.name`, `person.location`, `person.position`                         |
| `article`        | Blog posts, news articles                  | `article.author`, `article.publishedAt`                                     |
| `research_paper` | Academic papers, arXiv                     | `researchPaper.author`, `researchPaper.publishedAt`                         |
| `custom`         | Anything else (job postings, events, etc.) | `custom.author`, `custom.publishedAt`                                       |

```json theme={null}
{
  "entity": {"type": "custom", "description": "Job Postings for ML Engineers"}
}
```

## Designing Enrichments

Enrichments extract additional data from each item using web research. Think of them as questions Websets answers for every result.

**Be specific about what you want.** Vague enrichments produce vague results.

| Good                              | Bad                        |
| --------------------------------- | -------------------------- |
| "Find the CEO's full name"        | "Who runs this company?"   |
| "Company's LinkedIn page URL"     | "Find social media"        |
| "Estimated annual revenue in USD" | "How big is this company?" |
| "Year the company was founded"    | "When did they start?"     |

**Choose the right format** to get structured output:

| Format    | Use For                               | Example Description                 |
| --------- | ------------------------------------- | ----------------------------------- |
| `text`    | Names, descriptions, freeform answers | "Find the CEO's full name"          |
| `number`  | Counts, amounts, years                | "Estimated employee count"          |
| `date`    | Specific dates                        | "Date of most recent funding round" |
| `url`     | Links to specific pages               | "Company's LinkedIn page URL"       |
| `email`   | Contact emails                        | "General contact email address"     |
| `phone`   | Phone numbers                         | "Main office phone number"          |
| `options` | Multiple choice classification        | "Industry vertical" with options    |

**Use `options` for classification tasks** — it's more reliable than asking for freeform text when you have a known set of categories:

```json theme={null}
{
  "description": "Primary industry vertical",
  "format": "options",
  "options": [
    {"label": "Healthcare"},
    {"label": "Finance"},
    {"label": "Education"},
    {"label": "Developer Tools"},
    {"label": "Other"}
  ]
}
```

**Limit to 5-7 enrichments per webset.** Each enrichment runs web research for every item, so more enrichments means longer processing time. Prioritize the data points you actually need.

## Async Patterns

Websets are asynchronous — results arrive over time as searches complete and enrichments process.

**Use `wait_until_idle` in SDKs** for simple workflows:

```python theme={null}
webset = exa.websets.create(params=CreateWebsetParameters(...))
webset = exa.websets.wait_until_idle(webset.id)  # blocks until done
items = exa.websets.items.list(webset_id=webset.id)
```

**Use webhooks for production systems** — they're more reliable than polling and give you real-time updates:

```json theme={null}
{
  "url": "https://your-server.com/webhook",
  "events": ["webset.item.created", "webset.item.enriched", "webset.idle"]
}
```

* `webset.item.created` — fires as each item passes verification (stream results as they arrive)
* `webset.item.enriched` — fires when an enrichment result is ready for an item
* `webset.idle` — fires when all searches and enrichments complete

**The URL must be the final destination.** Redirects (3xx responses) are not followed — if your endpoint redirects, the delivery will fail. Always register the URL that directly handles the webhook payload.

**Items are available immediately.** You can list items while the webset is still `running` — you don't have to wait for `idle`.

## Idempotency and Deduplication

**Use `externalId` to prevent duplicate websets.** If you create a webset with an `externalId` that already exists, you'll get a 409 error instead of a duplicate. You can then use `externalId` in place of `id` for all API calls.

```json theme={null}
{
  "search": {"query": "...", "count": 50},
  "externalId": "weekly-leads-2025-03"
}
```

## Monitors for Recurring Searches

Monitors run searches on a schedule to keep websets updated with fresh results.

```json theme={null}
{
  "websetId": "ws_abc123",
  "cadence": {"cron": "0 9 * * 1", "timezone": "America/New_York"},
  "behavior": {
    "type": "search",
    "config": {
      "parameters": {
        "query": "AI startups that raised Series A in the last week",
        "count": 10,
        "criteria": [{"description": "Company raised Series A in the last week"}],
        "entity": {"type": "company"},
        "behavior": "append"
      }
    }
  }
}
```

**Monitor cron triggers at most once per day** — this is a system constraint.

**Use `"behavior": "append"`** in monitor searches to add new items without removing existing ones. Use `"override"` to re-evaluate existing items against new criteria.

## Imports for Your Own Data

Imports let you bring URLs from your own sources (CRM exports, spreadsheets, etc.) and run enrichments on them:

```json theme={null}
{
  "websetId": "ws_abc123",
  "urls": [
    "https://company-a.com",
    "https://company-b.com",
    "https://company-c.com"
  ]
}
```

This is useful when you already have a list of targets and want to enrich them with additional data, rather than discovering new results.

## Common Patterns

### Lead Generation Pipeline

```python theme={null}
webset = exa.websets.create(
    params=CreateWebsetParameters(
        search={
            "query": "B2B SaaS companies in healthcare with 50-200 employees",
            "count": 100,
            "criteria": [
                {"description": "Company sells B2B SaaS products"},
                {"description": "Company operates in healthcare or healthtech"},
            ],
            "entity": {"type": "company"},
        },
        enrichments=[
            CreateEnrichmentParameters(description="CEO or founder full name", format="text"),
            CreateEnrichmentParameters(description="Company LinkedIn page URL", format="url"),
            CreateEnrichmentParameters(description="Estimated employee count", format="number"),
            CreateEnrichmentParameters(description="Most recent funding round and amount", format="text"),
        ],
    )
)
```

### Competitive Intelligence

```python theme={null}
webset = exa.websets.create(
    params=CreateWebsetParameters(
        search={
            "query": "Companies building vector databases or embedding search infrastructure",
            "count": 30,
            "criteria": [
                {"description": "Company builds vector database or similarity search technology"},
                {"description": "Company has a publicly available product or API"},
            ],
            "entity": {"type": "company"},
        },
        enrichments=[
            CreateEnrichmentParameters(description="Primary product name", format="text"),
            CreateEnrichmentParameters(description="Pricing model (free tier, pay-as-you-go, enterprise)", format="text"),
            CreateEnrichmentParameters(description="Key technical differentiator", format="text"),
        ],
    )
)
```

## Tips

* **Enrichment results are always arrays.** Even for single values, `result` is `["value"]` or `null` if not found.
* **Enrichment results have `enrichmentId`, not `description`.** Build a map from `webset.enrichments` to resolve IDs to descriptions: `{e.id: e.description for e in webset.enrichments}`.
* **Item data is nested under `properties`.** Access `item.properties.url`, `item.properties.company.name` — not `item.url`.
* **`expand=items` saves a call.** `GET /websets/{id}?expand=items` returns the webset and its latest 100 items in one request.
* **Webhook secrets are shown once.** Store the `secret` from the create response immediately for signature verification.
* **Preview before committing.** Use `POST /websets/preview` to test a query without creating a webset.

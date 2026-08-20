> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# How to Use Imports

> A step-by-step guide to importing URLs into Websets -- enriching your list, scoring it against criteria, discovering new matches, and combining all three.

When you already have a list of URLs (companies, people, products, etc.), you can **import** them into a Webset. Depending on how you set up the Webset, your imported items can be enriched, evaluated against criteria, or combined with web discovery results.

This guide walks through every configuration with exact API calls you can copy-paste. Just replace `$EXA_API_KEY` with your API key.

## Our Example: 5 IT Consulting Suppliers

Throughout this guide, we'll use the same list of 5 companies as our import:

| Company      | URL                              | Notes                                                |
| ------------ | -------------------------------- | ---------------------------------------------------- |
| Accenture    | `https://www.accenture.com`      | Global IT consulting, US HQ                          |
| Infosys      | `https://www.infosys.com`        | IT services, large US presence                       |
| Wipro        | `https://www.wipro.com`          | IT services, offices in US                           |
| EPAM Systems | `https://www.epam.com`           | Software engineering, US-listed                      |
| Persol Group | `https://www.persol-group.co.jp` | Staffing company, Japan-focused, minimal US presence |

We picked these because 4 of the 5 clearly match typical IT consulting criteria (US office, IT services). **Persol Group** is the outlier -- it's a Japanese staffing company with minimal US presence, so it should fail US-focused criteria.

Our criteria for the examples below:

1. "The company has an office in the United States"
2. "The company provides IT consulting or staff augmentation services"

***

## Config 1: Import Only -- Enrich Without Filtering

<Note>
  **Live example:** [View this webset on the dashboard](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**Use when:** You have a list of URLs and just want to enrich them. No scoring, no filtering -- every item is kept.

### API Calls

```bash theme={null}
# Step 1: Create a CSV import with your supplier URLs
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }' | jq
# Response includes an `uploadUrl` and an import `id`

# Step 2: Upload your CSV to the presigned URL from Step 1
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv contains: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# Step 3: Create a Webset that uses this import (enrichments only, no search/criteria)
# The import is automatically scheduled for processing when the Webset is created.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }' | jq
```

### What We See in the Live Webset

All **5 items** appear in the Webset. No filtering happens because there are no criteria.

| Supplier     | In Webset? | Source   | Evaluations | Enrichments | Why?                                      |
| ------------ | ---------- | -------- | ----------- | ----------- | ----------------------------------------- |
| Accenture    | **Yes**    | `import` | 0           | 2           | Imported, no criteria to evaluate against |
| Infosys      | **Yes**    | `import` | 0           | 2           | Imported, no criteria to evaluate against |
| Wipro        | **Yes**    | `import` | 0           | 2           | Imported, no criteria to evaluate against |
| EPAM Systems | **Yes**    | `import` | 0           | 2           | Imported, no criteria to evaluate against |
| Persol Group | **Yes**    | `import` | 0           | 2           | Imported, no criteria to evaluate against |

Every item has `source: "import"` and `evaluations: []`. All 5 are kept and enriched regardless of whether they'd pass any criteria -- because there are no criteria in this config.

<Note>
  Persol Group's URL (`persol-group.co.jp`) resolved to "PERSOL Vietnam Japan Desk" in the entity data -- the system still imports and enriches it, it just resolved to a regional subsidiary page.
</Note>

***

## Config 2: Search Only -- Web Discovery

<Note>
  **Live example:** [View this webset on the dashboard](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**Use when:** You don't have a list -- you want to discover new companies from the web that match your criteria.

### API Call

```bash theme={null}
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search": {
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25
    },
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }' | jq
```

### What We See in the Live Webset

The system searched the web and found **35 companies** that pass both criteria. Every item has `source: "search"` with full evaluations explaining why it matched.

| Our 5 Suppliers        | In Webset? | Why?                                                                    |
| ---------------------- | ---------- | ----------------------------------------------------------------------- |
| Accenture              | **Yes**    | The web search independently discovered Accenture as a matching company |
| Infosys                | **No**     | Not discovered by this particular web search                            |
| Wipro                  | **No**     | Not discovered by this particular web search                            |
| EPAM Systems           | **No**     | Not discovered by this particular web search                            |
| Persol Group           | **No**     | Not discovered by this particular web search                            |
| *(34 other companies)* | **Yes**    | Found by web search, passed both criteria                               |

The web search happened to find Accenture among its 35 results -- but the other 4 suppliers were not discovered. This is expected: search-only websets only return what the web crawl finds, not a predetermined list. Examples of other discovered companies: Artech, TurnKey Staffing, DataArt, Insight Global, and others.

***

## Config 3: Scoped Search -- Score Your List Against Criteria

<Note>
  **Live example:** [View this webset on the dashboard](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**Use when:** You have a supplier list and want to **evaluate each one against criteria**. Only the ones that pass are returned. This is the "score my list" use case.

### API Calls

```bash theme={null}
# Step 1: Create a CSV import and upload it (same as Config 1, Steps 1-2)
# ... (see Config 1 for the full import flow)
# You'll get back an <IMPORT_ID>

# Step 2: Create a Webset with a scoped search -- evaluates each imported URL against criteria
# The import is automatically scheduled for processing when the Webset is created.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search": {
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "scope": [
        { "source": "import", "id": "<IMPORT_ID>" }
      ]
    },
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }' | jq
```

### What We See in the Live Webset

The webset contains **4 items**. Each of our 5 suppliers was evaluated against the criteria -- only the ones that passed both criteria appear.

| Supplier     | In Webset?        | Source   | Has Evaluations? | Why?                                                                   |
| ------------ | ----------------- | -------- | ---------------- | ---------------------------------------------------------------------- |
| Accenture    | **Yes**           | `search` | Yes (2)          | Passed: has US office, provides IT consulting                          |
| Infosys      | **Yes**           | `search` | Yes (2)          | Passed: has US office, provides IT services                            |
| Wipro        | **Yes**           | `search` | Yes (2)          | Passed: has US office, provides IT services                            |
| EPAM Systems | **Yes**           | `search` | Yes (2)          | Passed: US-listed, provides software engineering services              |
| Persol Group | **No -- dropped** | --       | --               | Failed "has an office in the United States" -- primarily Japan-focused |

We imported 5 suppliers but only 4 appear in the results. **Persol Group was evaluated and didn't pass**, so it's filtered out. Every visible item has `source: "search"` with full `evaluations` showing the reasoning for each criterion.

<Warning>
  Items that fail criteria are **dropped from the results**. If you need to keep all items and just see which ones pass/fail, use Config 1 (import only, no filtering) as a separate webset alongside Config 3.
</Warning>

***

## Config 4: Scoped Search + Web Discovery -- Score Your List AND Find New Matches

<Note>
  **Live example:** [View this webset on the dashboard](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**Use when:** You have a supplier list you want to score against criteria, but you also want to discover additional companies from the web that match the same criteria. This is a two-step process: first create a webset with a scoped search, then add a regular web search to the same webset.

### API Calls

```bash theme={null}
# Step 1: Create a CSV import and upload it (same as Config 1, Steps 1-2)
# ... (see Config 1 for the full import flow)
# You'll get back an <IMPORT_ID>

# Step 2: Create a Webset with a scoped search -- evaluates each imported URL against criteria
# The import is automatically scheduled for processing when the Webset is created.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search": {
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "scope": [
        { "source": "import", "id": "<IMPORT_ID>" }
      ]
    },
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }' | jq
# Response includes a webset `id` -- save it as <WEBSET_ID>

# Step 3: Wait for the scoped search to complete, then add a web search to discover new matches
curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "IT consulting and staff augmentation companies",
    "entity": { "type": "company" },
    "criteria": [
      { "description": "The company has an office in the United States" },
      { "description": "The company provides IT consulting or staff augmentation services" }
    ],
    "count": 25,
    "behavior": "append"
  }' | jq
```

### What We See in the Live Webset

The webset contains **29 items** -- 4 from our imported suppliers (scored and passed) plus 25 web-discovered companies. Both sets are evaluated against criteria.

| Supplier                        | In Webset?        | Source   | Has Evaluations? | Why?                                                           |
| ------------------------------- | ----------------- | -------- | ---------------- | -------------------------------------------------------------- |
| Accenture                       | **Yes**           | `search` | Yes (2)          | Passed scoped search: has US office, provides IT consulting    |
| Infosys                         | **Yes**           | `search` | Yes (2)          | Passed scoped search: has US office, provides IT services      |
| Wipro                           | **Yes**           | `search` | Yes (2)          | Passed scoped search: has US office, provides IT services      |
| EPAM Systems                    | **Yes**           | `search` | Yes (2)          | Passed scoped search: US-listed, provides software engineering |
| Persol Group                    | **No -- dropped** | --       | --               | Failed scoped search: no US office                             |
| *(25 web-discovered companies)* | **Yes**           | `search` | Yes (2 each)     | Found by web search, passed both criteria                      |

The scoped search evaluates your imported list against criteria (dropping Persol Group), and the appended web search discovers 25 additional companies. The result is a single webset with both your scored imports and new web discoveries.

<Note>
  The web search uses `"behavior": "append"` so it adds to the existing results rather than replacing them. If the web search discovers a company that was already in the scoped search results (e.g., Accenture), the duplicate is automatically handled.
</Note>

***

## Quick Reference

| Configuration                        | What it does                           | All items kept?                   | Items get scored?                              |
| ------------------------------------ | -------------------------------------- | --------------------------------- | ---------------------------------------------- |
| **1. Import Only**                   | Enrich your list                       | Yes -- all kept                   | No                                             |
| **2. Search Only**                   | Discover new matches from the web      | N/A (no imports)                  | Yes -- only passing items returned             |
| **3. Scoped Search**                 | Score your list against criteria       | No -- failures are dropped        | Yes                                            |
| **4. Scoped Search + Web Discovery** | Score your list + discover new matches | No -- import failures are dropped | Yes -- both imports and discoveries are scored |

## Which Config Should I Use?

* **"I just want to enrich my list, no filtering"** -- Config 1
* **"I don't have a list, find me companies"** -- Config 2
* **"Score my list, drop the ones that don't match"** -- Config 3
* **"Score my list AND find new companies that match"** -- Config 4

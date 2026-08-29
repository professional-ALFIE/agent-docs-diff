> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Snowflake

> Use Exa search and content retrieval from Snowflake stored procedures and Cortex Agents.

Use Exa's search API directly from Snowflake to enrich your data with live web intelligence — without leaving SQL.

This integration uses Snowflake's [External Access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) feature to securely call the Exa API from stored procedures, enabling two main workflows:

1. **Cortex Agent tools** — give a Snowflake Cortex Agent the ability to search the web and retrieve page contents
2. **Data enrichment** — enrich tables with CEO/founder info, latest news, and other web data in batch

## Prerequisites

1. An Exa API key — get one at [dashboard.exa.ai](https://dashboard.exa.ai/api-keys)
2. `ACCOUNTADMIN` role (required for creating External Access Integrations)
3. A Snowflake account with External Access support (paid accounts)

## Setup

Run the following SQL in a Snowflake worksheet. Replace `<<YOUR_EXA_API_KEY>>` with your actual key.

### Roles and database

```sql theme={null}
USE ROLE ACCOUNTADMIN;

CREATE ROLE IF NOT EXISTS exa_agent_role;
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE exa_agent_role;

SET my_user = CURRENT_USER();
GRANT ROLE exa_agent_role TO USER IDENTIFIER($my_user);

CREATE DATABASE IF NOT EXISTS exa_integration;
CREATE SCHEMA IF NOT EXISTS exa_integration.tools;

GRANT USAGE ON DATABASE exa_integration TO ROLE exa_agent_role;
GRANT USAGE ON SCHEMA exa_integration.tools TO ROLE exa_agent_role;
```

### Warehouse

```sql theme={null}
CREATE WAREHOUSE IF NOT EXISTS exa_agent_wh
WITH
    WAREHOUSE_SIZE = 'XSMALL'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE;

GRANT USAGE, OPERATE ON WAREHOUSE exa_agent_wh TO ROLE exa_agent_role;
```

### Network rule, secret, and external access

```sql theme={null}
CREATE OR REPLACE NETWORK RULE exa_integration.tools.exa_api_rule
    MODE = EGRESS
    TYPE = HOST_PORT
    VALUE_LIST = ('api.exa.ai:443');

CREATE OR REPLACE SECRET exa_integration.tools.exa_api_key
    TYPE = GENERIC_STRING
    SECRET_STRING = '<<YOUR_EXA_API_KEY>>';

CREATE OR REPLACE EXTERNAL ACCESS INTEGRATION exa_api_access
    ALLOWED_NETWORK_RULES = (exa_integration.tools.exa_api_rule)
    ALLOWED_AUTHENTICATION_SECRETS = (exa_integration.tools.exa_api_key)
    ENABLED = TRUE;

GRANT USAGE ON INTEGRATION exa_api_access TO ROLE exa_agent_role;
```

This creates:

* A **network rule** allowing egress only to `api.exa.ai:443`
* A **secret** storing your API key (encrypted, not visible in SQL)
* An **external access integration** binding the rule and secret together

## Stored procedures

### EXA\_SEARCH

Searches the web using Exa's search API. Returns results with titles, URLs, scores, and optionally text/highlights/summaries.

```sql theme={null}
CREATE OR REPLACE PROCEDURE EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    query STRING,
    num_results INTEGER DEFAULT 10,
    search_type STRING DEFAULT 'auto',
    category STRING DEFAULT NULL,
    include_domains STRING DEFAULT NULL,
    exclude_domains STRING DEFAULT NULL,
    start_published_date STRING DEFAULT NULL,
    end_published_date STRING DEFAULT NULL,
    include_text STRING DEFAULT NULL,
    get_contents BOOLEAN DEFAULT TRUE
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json


def main(session, query, num_results, search_type, category, include_domains,
         exclude_domains, start_published_date, end_published_date,
         include_text, get_contents):
    api_key = _snowflake.get_generic_secret_string('cred')
    url = "https://api.exa.ai/search"

    body = {
        "query": query,
        "numResults": num_results,
        "type": search_type,
    }

    if category:
        body["category"] = category
    if include_domains:
        body["includeDomains"] = [d.strip() for d in include_domains.split(",")]
    if exclude_domains:
        body["excludeDomains"] = [d.strip() for d in exclude_domains.split(",")]
    if start_published_date:
        body["startPublishedDate"] = start_published_date
    if end_published_date:
        body["endPublishedDate"] = end_published_date
    if include_text:
        body["includeText"] = [include_text]

    if get_contents:
        body["contents"] = {
            "text": {"maxCharacters": 3000},
            "highlights": True,
            "summary": True
        }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    try:
        resp = requests.post(url, json=body, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for r in data.get("results", []):
            result = {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "score": r.get("score"),
                "publishedDate": r.get("publishedDate", ""),
            }
            if get_contents:
                result["summary"] = r.get("summary", "")
                result["highlights"] = r.get("highlights", [])
                result["text"] = (r.get("text", "") or "")[:2000]
            results.append(result)

        return json.dumps({
            "query": query,
            "numResults": len(results),
            "results": results
        })
    except requests.exceptions.HTTPError as e:
        return json.dumps({"error": str(e), "status_code": e.response.status_code,
                           "detail": e.response.text})
    except Exception as e:
        return json.dumps({"error": str(e)})
$$;

GRANT USAGE ON PROCEDURE EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    STRING, INTEGER, STRING, STRING, STRING, STRING, STRING, STRING, STRING, BOOLEAN
) TO ROLE exa_agent_role;
```

#### Parameters

| Parameter              | Type      | Default  | Description                                                                             |
| ---------------------- | --------- | -------- | --------------------------------------------------------------------------------------- |
| `query`                | `STRING`  | required | The search query                                                                        |
| `num_results`          | `INTEGER` | `10`     | Number of results (1–100)                                                               |
| `search_type`          | `STRING`  | `'auto'` | Recommended values: `auto`, `instant`, `fast`, `deep-lite`, `deep`, or `deep-reasoning` |
| `category`             | `STRING`  | `NULL`   | `company`, `publication`, `news`, `personal_site`, `financial_report`, `people`         |
| `include_domains`      | `STRING`  | `NULL`   | Comma-separated domains to restrict to                                                  |
| `exclude_domains`      | `STRING`  | `NULL`   | Comma-separated domains to exclude                                                      |
| `start_published_date` | `STRING`  | `NULL`   | ISO 8601 date lower bound                                                               |
| `end_published_date`   | `STRING`  | `NULL`   | ISO 8601 date upper bound                                                               |
| `include_text`         | `STRING`  | `NULL`   | Phrase that must appear in results                                                      |
| `get_contents`         | `BOOLEAN` | `TRUE`   | Fetch text, highlights, and summaries                                                   |

### EXA\_GET\_CONTENTS

Retrieves page contents (text, highlights, summaries) for specific URLs.

```sql theme={null}
CREATE OR REPLACE PROCEDURE EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    urls STRING,
    get_text BOOLEAN DEFAULT TRUE,
    get_highlights BOOLEAN DEFAULT TRUE,
    get_summary BOOLEAN DEFAULT TRUE
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json


def main(session, urls, get_text, get_highlights, get_summary):
    api_key = _snowflake.get_generic_secret_string('cred')
    url = "https://api.exa.ai/contents"

    url_list = [u.strip() for u in urls.split(",")]

    contents = {}
    if get_text:
        contents["text"] = {"maxCharacters": 5000}
    if get_highlights:
        contents["highlights"] = True
    if get_summary:
        contents["summary"] = True

    body = {
        "urls": url_list,
        **contents
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    try:
        resp = requests.post(url, json=body, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for r in data.get("results", []):
            result = {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
            }
            if get_text:
                result["text"] = (r.get("text", "") or "")[:3000]
            if get_highlights:
                result["highlights"] = r.get("highlights", [])
            if get_summary:
                result["summary"] = r.get("summary", "")
            results.append(result)

        return json.dumps({"numResults": len(results), "results": results})
    except requests.exceptions.HTTPError as e:
        return json.dumps({"error": str(e), "status_code": e.response.status_code,
                           "detail": e.response.text})
    except Exception as e:
        return json.dumps({"error": str(e)})
$$;

GRANT USAGE ON PROCEDURE EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    STRING, BOOLEAN, BOOLEAN, BOOLEAN
) TO ROLE exa_agent_role;
```

## Usage examples

### Basic search

```sql theme={null}
USE WAREHOUSE exa_agent_wh;

CALL EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    'latest developments in renewable energy',
    5,        -- num_results
    'auto',   -- search_type
    'news',   -- category
    NULL, NULL,
    '2025-01-01T00:00:00.000Z',  -- start_published_date
    NULL, NULL, TRUE
);
```

### Get contents for specific URLs

```sql theme={null}
CALL EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    'https://example.com/article1,https://example.com/article2',
    TRUE,   -- get_text
    TRUE,   -- get_highlights
    TRUE    -- get_summary
);
```

### Company research

```sql theme={null}
CALL EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    'Stripe CEO founder leadership',
    5, 'auto', 'company',
    NULL, NULL, NULL, NULL, NULL, TRUE
);
```

## Data enrichment

Exa can enrich Snowflake tables with live web data — CEO/founder info, latest news, and more — all without leaving the platform.

### Create a prospect table

```sql theme={null}
CREATE DATABASE IF NOT EXISTS exa_enrichment;
CREATE SCHEMA IF NOT EXISTS exa_enrichment.demo;

CREATE OR REPLACE TABLE exa_enrichment.demo.prospect_companies (
    company_name STRING,
    website STRING,
    industry STRING,
    employee_count INTEGER,
    ceo_name STRING,
    ceo_title STRING,
    ceo_source_url STRING,
    latest_news_headline STRING,
    latest_news_summary STRING,
    latest_news_url STRING,
    latest_news_date STRING,
    leaders_enriched_at TIMESTAMP,
    news_enriched_at TIMESTAMP
);

INSERT INTO exa_enrichment.demo.prospect_companies
    (company_name, website, industry, employee_count)
VALUES
    ('Stripe', 'https://stripe.com', 'Fintech / Payments', 8000),
    ('Databricks', 'https://databricks.com', 'Data & AI Platform', 7000),
    ('Figma', 'https://figma.com', 'Design Tools', 1500),
    ('Anthropic', 'https://anthropic.com', 'AI Research', 1000),
    ('Vercel', 'https://vercel.com', 'Developer Platform', 600);
```

### Enrich with CEO/founder info

```sql theme={null}
CREATE OR REPLACE PROCEDURE exa_enrichment.demo.enrich_company_leaders(
    target_company STRING
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json
import re


def main(session, target_company):
    api_key = _snowflake.get_generic_secret_string('cred')

    body = {
        "query": f"{target_company} CEO founder leadership team",
        "numResults": 5,
        "type": "auto",
        "category": "company",
        "contents": {
            "text": {"maxCharacters": 2000},
            "highlights": True,
            "summary": True
        }
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    resp = requests.post(
        "https://api.exa.ai/search", json=body, headers=headers, timeout=30
    )
    resp.raise_for_status()
    data = resp.json()

    ceo_name = None
    ceo_title = None
    source_url = None
    ceo_keywords = ["ceo", "chief executive", "founder", "co-founder"]

    for r in data.get("results", []):
        text = ((r.get("text", "") or "") + " " + (r.get("summary", "") or "")).lower()
        title_text = (r.get("title", "") or "").lower()
        combined = text + " " + title_text

        for kw in ceo_keywords:
            idx = combined.find(kw)
            if idx == -1:
                continue

            original = (r.get("text", "") or "") + " " + (r.get("summary", "") or "") + " " + (r.get("title", "") or "")
            names = re.findall(
                r'(?:^|[\s,])([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)',
                original[max(0, idx - 200):idx + 200]
            )
            if names:
                ceo_name = names[0].strip()
                title_map = {
                    "co-founder": "Co-Founder & CEO",
                    "founder": "Founder & CEO",
                    "chief executive": "CEO",
                    "ceo": "CEO",
                }
                ceo_title = title_map.get(kw, "CEO")
                source_url = r.get("url", "")
                break
        if ceo_name:
            break

    if ceo_name:
        safe = lambda s: (s or "").replace("'", "''")
        session.sql(f"""
            UPDATE exa_enrichment.demo.prospect_companies
            SET ceo_name = '{safe(ceo_name)}',
                ceo_title = '{safe(ceo_title)}',
                ceo_source_url = '{safe(source_url)}',
                leaders_enriched_at = CURRENT_TIMESTAMP()
            WHERE company_name = '{safe(target_company)}'
        """).collect()

    return json.dumps({
        "company": target_company,
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "source_url": source_url
    })
$$;
```

### Enrich with latest news

```sql theme={null}
CREATE OR REPLACE PROCEDURE exa_enrichment.demo.enrich_company_news(
    target_company STRING
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json
from datetime import datetime, timedelta


def main(session, target_company):
    api_key = _snowflake.get_generic_secret_string('cred')

    one_month_ago = (datetime.utcnow() - timedelta(days=30)).strftime(
        "%Y-%m-%dT00:00:00.000Z"
    )

    body = {
        "query": f"latest news about {target_company}",
        "numResults": 3,
        "type": "auto",
        "category": "news",
        "startPublishedDate": one_month_ago,
        "contents": {
            "text": {"maxCharacters": 1000},
            "summary": True
        }
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    resp = requests.post(
        "https://api.exa.ai/search", json=body, headers=headers, timeout=30
    )
    resp.raise_for_status()
    data = resp.json()

    results = data.get("results", [])
    if not results:
        return json.dumps({"company": target_company, "status": "no_news_found"})

    top = results[0]
    headline = (top.get("title", "") or "")[:500]
    summary = (top.get("summary", "") or "")[:2000]
    news_url = top.get("url", "") or ""
    pub_date = top.get("publishedDate", "") or ""

    safe = lambda s: (s or "").replace("'", "''")
    session.sql(f"""
        UPDATE exa_enrichment.demo.prospect_companies
        SET latest_news_headline = '{safe(headline)}',
            latest_news_summary = '{safe(summary)}',
            latest_news_url = '{safe(news_url)}',
            latest_news_date = '{safe(pub_date)}',
            news_enriched_at = CURRENT_TIMESTAMP()
        WHERE company_name = '{safe(target_company)}'
    """).collect()

    return json.dumps({
        "company": target_company,
        "headline": headline,
        "url": news_url,
        "published_date": pub_date
    })
$$;
```

### Run enrichment

```sql theme={null}
-- Enrich a single company
CALL exa_enrichment.demo.enrich_company_leaders('Stripe');
CALL exa_enrichment.demo.enrich_company_news('Stripe');

-- View enriched results
SELECT company_name, ceo_name, ceo_title,
       latest_news_headline, latest_news_url, latest_news_date
FROM exa_enrichment.demo.prospect_companies;
```

## Parallelizing Exa requests

When enriching large tables, calling Exa sequentially per row is slow. You can parallelize requests using Python's `concurrent.futures` inside a single stored procedure, sending multiple Exa API calls at once.

### Concurrent enrichment procedure

```sql theme={null}
CREATE OR REPLACE PROCEDURE exa_enrichment.demo.enrich_all_parallel(
    max_workers INTEGER DEFAULT 10
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed


def exa_search(api_key, company_name, query_template, category="company", num_results=5):
    body = {
        "query": query_template.format(company=company_name),
        "numResults": num_results,
        "type": "auto",
        "category": category,
        "contents": {
            "text": {"maxCharacters": 2000},
            "highlights": True,
            "summary": True
        }
    }
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }
    resp = requests.post("https://api.exa.ai/search", json=body, headers=headers, timeout=30)
    resp.raise_for_status()
    return {"company": company_name, "results": resp.json().get("results", [])}


def main(session, max_workers):
    api_key = _snowflake.get_generic_secret_string('cred')

    rows = session.sql(
        "SELECT company_name FROM exa_enrichment.demo.prospect_companies"
    ).collect()
    companies = [row["COMPANY_NAME"] for row in rows]

    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {
            pool.submit(exa_search, api_key, name, "{company} CEO founder leadership"): name
            for name in companies
        }
        for future in as_completed(futures):
            company = futures[future]
            try:
                results[company] = future.result()
            except Exception as e:
                results[company] = {"company": company, "error": str(e)}

    return json.dumps({
        "enriched": len([r for r in results.values() if "error" not in r]),
        "errors": len([r for r in results.values() if "error" in r]),
        "results": results
    })
$$;
```

### Choosing parallelism

| `max_workers` | Use Case                                                             |
| ------------- | -------------------------------------------------------------------- |
| `5`           | Conservative — stays well within rate limits                         |
| `10`          | Good default for most enrichment jobs                                |
| `20–50`       | Large datasets with a high [rate limit](/docs/reference/rate-limits) tier |

### Snowflake task scheduling

For recurring enrichment jobs, wrap the procedure in a [Snowflake Task](https://docs.snowflake.com/en/user-guide/tasks-intro):

```sql theme={null}
CREATE OR REPLACE TASK exa_enrichment.demo.daily_enrichment
    WAREHOUSE = exa_agent_wh
    SCHEDULE = 'USING CRON 0 8 * * * America/Los_Angeles'
AS
    CALL exa_enrichment.demo.enrich_all_parallel(10);

ALTER TASK exa_enrichment.demo.daily_enrichment RESUME;
```

This runs the parallel enrichment every day at 8 AM PT. Adjust the cron schedule and `max_workers` to fit your volume and rate limits.

## Cortex Agent integration

You can also register the Exa stored procedures as tools for a [Snowflake Cortex Agent](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents), giving it the ability to search the web conversationally.

```sql theme={null}
CREATE DATABASE IF NOT EXISTS exa_agents;
CREATE SCHEMA IF NOT EXISTS exa_agents.agents;

GRANT USAGE ON DATABASE exa_agents TO ROLE exa_agent_role;
GRANT USAGE ON SCHEMA exa_agents.agents TO ROLE exa_agent_role;
GRANT CREATE AGENT ON SCHEMA exa_agents.agents TO ROLE exa_agent_role;

USE DATABASE exa_agents;
USE SCHEMA agents;
USE WAREHOUSE exa_agent_wh;

CREATE OR REPLACE AGENT exa_web_search_agent
    COMMENT = 'Agent with Exa web search and content retrieval'
    FROM SPECIFICATION
    $$
    models:
      orchestration: auto

    orchestration:
      budget:
        seconds: 60
        tokens: 32000

    instructions:
      system: |
        You are a helpful research assistant with access to Exa, a
        web search engine built for AI. Always cite your sources with URLs.

      orchestration: |
        - Use EXA_SEARCH for questions requiring web search or external knowledge.
        - Use EXA_GET_CONTENTS when the user provides specific URLs.
        - For news queries, set category to "news".
        - For scholarly publications (research papers, preprints, journal articles), set category to "publication".
        - For company lookups, set category to "company".
        - When asked about recent events, set start_published_date to a recent date.
        - Always request contents (get_contents=TRUE) for substantive answers.

    tools:
      - tool_spec:
          type: generic
          name: exa_search
          description: >
            Search the web using Exa. Returns web pages with titles, URLs,
            text content, highlights, and summaries. Supports filtering by
            domain, date, category, and text content.
          input_schema:
            type: object
            properties:
              query:
                type: string
                description: The search query.
              num_results:
                type: integer
                description: Number of results (1-100). Default 10.
              search_type:
                type: string
                enum: ["auto", "instant", "fast", "deep-lite", "deep", "deep-reasoning"]
              category:
                type: string
                enum: ["company", "publication", "news",
                       "personal_site", "financial_report", "people"]
              include_domains:
                type: string
                description: Comma-separated domains to restrict to.
              exclude_domains:
                type: string
                description: Comma-separated domains to exclude.
              start_published_date:
                type: string
                description: ISO 8601 date lower bound.
              end_published_date:
                type: string
                description: ISO 8601 date upper bound.
              include_text:
                type: string
                description: Phrase that must appear in results.
              get_contents:
                type: boolean
                description: Fetch page contents. Default true.
            required:
              - query

      - tool_spec:
          type: generic
          name: exa_get_contents
          description: >
            Retrieve text, highlights, and summaries for specific URLs.
          input_schema:
            type: object
            properties:
              urls:
                type: string
                description: Comma-separated URLs.
              get_text:
                type: boolean
              get_highlights:
                type: boolean
              get_summary:
                type: boolean
            required:
              - urls

    tool_resources:
      exa_search:
        type: procedure
        execution_environment:
          type: warehouse
          warehouse: EXA_AGENT_WH
        identifier: EXA_INTEGRATION.TOOLS.EXA_SEARCH

      exa_get_contents:
        type: procedure
        execution_environment:
          type: warehouse
          warehouse: EXA_AGENT_WH
        identifier: EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS
    $$;
```

Once created, open Snowflake Intelligence and try asking your agent:

* "Search the web for recent AI agent frameworks"
* "Find research papers about retrieval augmented generation"
* "What are the top AI companies to watch?"

## Security

The integration uses Snowflake's built-in security features:

| Layer                           | Detail                                                    |
| ------------------------------- | --------------------------------------------------------- |
| **Roles**                       | `exa_agent_role` for scoped access to procedures and data |
| **Network Rule**                | Egress restricted to `api.exa.ai:443` only                |
| **Secret**                      | API key stored encrypted, not visible in SQL queries      |
| **External Access Integration** | Binds network rule + secret together                      |

Grant access to additional users:

```sql theme={null}
GRANT ROLE exa_agent_role TO USER analyst_user;
```

## More resources

* [Exa API Documentation](/docs/reference/search-api-guide)
* [Exa Dashboard](https://dashboard.exa.ai) — get your API key
* [Snowflake External Access Docs](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview)
* [Snowflake Cortex Agents Docs](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents)

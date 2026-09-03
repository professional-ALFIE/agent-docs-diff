> 원본: https://exa.ai/docs/reference/exa-for-sheets.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Exa for Google Sheets

> Use Exa Agent and Exa formulas inside Google Sheets.

<Warning>
  **Multiple Google accounts:** The add-on must run under the first (default) Google account in your browser profile. If you are logged into multiple accounts, you may not be able to save or load your API key. To fix this, open Sheets in an incognito window with only one account, or sign out of extra accounts so the account you want is the default. [Learn more](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts).
</Warning>

Use Exa inside Google Sheets to research the web, generate tables, and fill missing data.

The add-on gives you two ways to work:

* **Exa Agent** for full tables and multi-cell tasks
* **`=EXA(...)`** for one answer in one cell

## Install

<Steps>
  <Step title="Install the add-on">
    Go to the [Exa AI add-on](https://workspace.google.com/marketplace/app/exa_ai/465545439521) in the Google Workspace Marketplace and click **Install**.
  </Step>

  <Step title="Open a Google Sheet">
    Open a new or existing spreadsheet.
  </Step>

  <Step title="Open the sidebar">
    Go to **Extensions → Exa AI → Open Sidebar**.
  </Step>

  <Step title="Add your API key">
    Get your API key from [dashboard.exa.ai](https://dashboard.exa.ai/api-keys) and paste it in the sidebar.
  </Step>

  <Step title="Start using Exa">
    Open **Exa Agent** and start using Exa in your sheet.
  </Step>
</Steps>

## Exa Agent

Exa Agent lets you use Exa across multiple cells in Google Sheets.

Use it when you want to:

* generate a full table from one prompt
* fill missing cells in an existing table
* continue a table by adding new rows
* enrich a list with web data

### Generate a table

Use **Generate table** when you want Exa to create a new table.

1. Open the sidebar.
2. Go to **Exa Agent**.
3. Choose **Generate table**.
4. Write what you want.
5. Click **Generate table**.

Example prompt:

```text theme={null}
Find top 40 AI companies and return company name, website URL, CEO, founding date, headquarters, and a short description.
```

Exa researches the web and writes the table into your sheet.

By default, the table starts at the selected cell. You can choose another start cell in **More options**.

### Fill cells

Use **Fill cells** when you already have a table and want Exa to fill missing data.

1. Select the blank cells in your sheet.
2. Open **Exa Agent**.
3. Choose **Fill cells**.
4. Click **Fill selected cells**.

Exa looks at the table around your selection and fills the blanks.

Select blank cells in a table that already has clear headers before you use **Fill cells**.

Example:

| Company | Website                                  | CEO           | Headquarters  |
| ------- | ---------------------------------------- | ------------- | ------------- |
| Apple   | [https://apple.com](https://apple.com)   |               |               |
| Google  | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

Select the blank cells for Apple, then click **Fill selected cells**. Exa uses the company name and the nearby rows as context.

### Continue rows

You can also select blank rows under a table.

If your table ends at rank 55 and you select the next two blank rows, Exa can continue the table with rank 56 and rank 57.

Exa uses the existing rows as examples, keeps the same columns, and avoids repeating items already in the table.

## `=EXA(...)`

Use `=EXA(...)` when you want one answer in one cell. It searches the web, reads the top results, and returns a concise answer.

```text theme={null}
=EXA("what you want", cell)
```

| Parameter | Required | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `prompt`  | Yes      | What information you want (e.g., `"Return only the CEO name"`).  |
| `context` | No       | Cell reference or text to enrich (e.g., a company name in `A2`). |

Examples:

```text theme={null}
=EXA("Return only the company website URL", A2)
=EXA("Return only the CEO name", A2)
=EXA("Return only the headquarters", A2)
=EXA("Return the Amazon rating of this product", A2)
```

The second argument is the context. You can drag the formula down a column to run it for many rows.

Use `=EXA(...)` for simple one-cell answers. Use **Exa Agent** when you want to create or fill a whole table.

## `=EXA_ANSWER(...)`

Advanced AI answers with full control over output format. Use this when you need system prompts, structured JSON output, citations, or a specific search type.

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| Parameter          | Required | Default  | Description                                                                                             |
| ------------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `prompt`           | Yes      | —        | The main question or prompt.                                                                            |
| `prefix`           | No       | `""`     | Text added before the prompt.                                                                           |
| `suffix`           | No       | `""`     | Text added after the prompt.                                                                            |
| `includeCitations` | No       | `FALSE`  | If `TRUE`, appends numbered source citations.                                                           |
| `systemPrompt`     | No       | `""`     | System instructions to control output format (e.g., `"only return a number"`).                          |
| `outputSchema`     | No       | `""`     | JSON schema for structured output. [Generate schemas here](https://dashboard.exa.ai/playground/answer). |
| `returnRawJson`    | No       | `FALSE`  | If `TRUE` and `outputSchema` is set, returns the full JSON instead of extracting the value.             |
| `type`             | No       | `"deep"` | Search type: `"auto"`, `"neural"`, `"fast"`, or `"deep"`.                                               |

Examples:

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

## `=EXA_SEARCH(...)`

Searches the web and returns a vertical list of URLs. Supports domain filtering, category filtering, content highlights, and synthesized output via `outputSchema`.

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| Parameter            | Required | Default  | Description                                                                                                                                              |
| -------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`              | Yes      | —        | The search query.                                                                                                                                        |
| `numResults`         | No       | `1`      | Number of results (1–10).                                                                                                                                |
| `searchType`         | No       | `"auto"` | `"auto"`, `"neural"`, or `"keyword"`.                                                                                                                    |
| `prefix`             | No       | `""`     | Text added before the query.                                                                                                                             |
| `suffix`             | No       | `""`     | Text added after the query.                                                                                                                              |
| `includeDomainsStr`  | No       | `""`     | Comma-separated domains to include (e.g., `"linkedin.com,crunchbase.com"`).                                                                              |
| `excludeDomainsStr`  | No       | `""`     | Comma-separated domains to exclude.                                                                                                                      |
| `category`           | No       | `""`     | Filter by type: `"company"`, `"publication"`, `"news"`, `"personal site"`, `"financial report"`, `"people"`.                                             |
| `highlightsMaxChars` | No       | `0`      | If > 0, requests content highlights with this character limit per result.                                                                                |
| `outputSchemaJson`   | No       | `""`     | JSON string for `outputSchema` (e.g., `"{""type"":""text"",""description"":""summarize""}"`). When set, returns synthesized output text instead of URLs. |

Examples:

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

## `=EXA_CONTENTS(...)`

Extracts the text content from a URL.

```text theme={null}
=EXA_CONTENTS(url)
```

| Parameter | Required | Description                                       |
| --------- | -------- | ------------------------------------------------- |
| `url`     | Yes      | The full URL (must start with `http` or `https`). |

## `=EXA_FINDSIMILAR(...)`

Finds URLs similar to a reference URL, with optional domain and text filters.

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| Parameter           | Required | Default | Description                             |
| ------------------- | -------- | ------- | --------------------------------------- |
| `url`               | Yes      | —       | The reference URL.                      |
| `numResults`        | No       | `1`     | Number of results (1–10).               |
| `includeDomainsStr` | No       | `""`    | Comma-separated domains to include.     |
| `excludeDomainsStr` | No       | `""`    | Comma-separated domains to exclude.     |
| `includeTextStr`    | No       | `""`    | Phrase that must appear in results.     |
| `excludeTextStr`    | No       | `""`    | Phrase that must not appear in results. |

## Batch

Use **Batch** when you want to work with many Exa formula cells at once.

Batch can:

* refresh selected cells with Exa formulas
* convert selected Exa formulas into normal values

Convert formulas to values when you want to keep the current results and stop the formulas from running again.

## When to use what

| Task                                                  | Use                        |
| ----------------------------------------------------- | -------------------------- |
| Create a full table from a prompt                     | Exa Agent → Generate table |
| Fill blank cells in a table                           | Exa Agent → Fill cells     |
| Continue a table with new rows                        | Exa Agent → Fill cells     |
| Get one value in one cell                             | `=EXA(...)`                |
| Get an answer with system prompt or structured output | `=EXA_ANSWER(...)`         |
| Search and get a list of URLs                         | `=EXA_SEARCH(...)`         |
| Extract text from a URL                               | `=EXA_CONTENTS(...)`       |
| Find pages similar to a URL                           | `=EXA_FINDSIMILAR(...)`    |
| Refresh many Exa formulas                             | Batch                      |
| Save formula results as plain text                    | Batch → Convert to values  |

## Notes

* Exa API requests count against your usage quota. Use **Batch → Convert to values** to freeze results and stop formulas from recalculating.
* The add-on automatically retries up to 3 times with exponential backoff when rate limited (HTTP 429).
* Start with small batches (10–20 rows) before scaling to hundreds.

## Links

* [Install Exa AI for Google Sheets](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [Get an Exa API key](https://dashboard.exa.ai/api-keys)
* [GitHub repository](https://github.com/exa-labs/exa-for-sheets)
* [Privacy Policy](https://exa.ai/exa-for-sheets/privacy-policy)

> 원본: https://exa.ai/docs/sdks/python-sdk-specification.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Python SDK Specification

> Enumeration of methods and types in the Exa Python SDK (exa_py).

## Getting started

Install the [exa-py](https://github.com/exa-labs/exa-py) SDK

<CodeGroup>
  ```bash uv theme={null}
  uv add exa-py
  ```

  ```bash pip theme={null}
  pip install exa-py
  ```
</CodeGroup>

and then instantiate an Exa client

```python theme={null}
from exa_py import Exa

exa = Exa()
```

<Card title="Get API Key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Follow this link to get your API key
</Card>

## `search` Method

Perform a search.

By default, returns text contents with 10,000 max characters. Use contents=False to opt-out.

### Input Example

```python theme={null}
# Basic search
result = exa.search(
  "hottest AI startups",
  type="auto",
  num_results=2,
  contents={"highlights": True}
)

# Structured output search with query variations
deep_result = exa.search(
  "Who is the CEO of OpenAI?",
  type="deep",
  system_prompt="Prefer official sources and avoid duplicate results",
  output_schema={
    "type": "object",
    "properties": {
      "leader": {"type": "string"},
      "title": {"type": "string"},
      "source_count": {"type": "number"}
    },
    "required": ["leader", "title"]
  },
  num_results=5
)
```

### Input Parameters

| Parameter              | Type                                                                    | Description                                                                                                                                                                                                                                                          | Default  |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| query                  | str                                                                     | The query string.                                                                                                                                                                                                                                                    | Required |
| contents               | Optional\[Union\[[ContentsOptions](#contentsoptions), Literal\[False]]] | Options for retrieving page contents. Defaults to `{"text": {"maxCharacters": 10000}`}. Use False to disable contents. See [ContentsOptions](#contentsoptions) for available options (text, highlights, summary, etc.).                                              | None     |
| num\_results           | Optional\[int]                                                          | Number of search results to return. Default 10.                                                                                                                                                                                                                      | None     |
| include\_domains       | Optional\[List\[str]]                                                   | Domains to include in the search.                                                                                                                                                                                                                                    | None     |
| exclude\_domains       | Optional\[List\[str]]                                                   | Domains to exclude from the search.                                                                                                                                                                                                                                  | None     |
| start\_published\_date | Optional\[str]                                                          | Only links published after this date.                                                                                                                                                                                                                                | None     |
| end\_published\_date   | Optional\[str]                                                          | Only links published before this date.                                                                                                                                                                                                                               | None     |
| include\_text          | Optional\[List\[str]]                                                   | Strings that must appear in the page text.                                                                                                                                                                                                                           | None     |
| exclude\_text          | Optional\[List\[str]]                                                   | Strings that must not appear in the page text.                                                                                                                                                                                                                       | None     |
| type                   | Optional\[Union\[[SearchType](#searchtype), str]]                       | Search type - 'auto' (default), 'fast', 'deep-lite', 'deep', 'deep-reasoning', or 'instant'.                                                                                                                                                                         | None     |
| category               | Optional\[[Category](#category)]                                        | Data category to focus on (e.g. 'company', 'news', 'publication').                                                                                                                                                                                                   | None     |
| flags                  | Optional\[List\[str]]                                                   | Experimental flags for Exa usage.                                                                                                                                                                                                                                    | None     |
| moderation             | Optional\[bool]                                                         | If True, the search results will be moderated for safety.                                                                                                                                                                                                            | None     |
| user\_location         | Optional\[str]                                                          | Two-letter ISO country code of the user (e.g. US).                                                                                                                                                                                                                   | None     |
| system\_prompt         | Optional\[str]                                                          | Optional instructions that guide the synthesized search output. Use with `output_schema`.                                                                                                                                                                            | None     |
| additional\_queries    | Optional\[List\[str]]                                                   | Alternative query formulations for deep search to skip automatic LLM-based query expansion. Max 10 queries. Applicable to deep search variants such as 'deep-lite', 'deep', and 'deep-reasoning'. Example: \["machine learning", "ML algorithms", "neural networks"] | None     |
| output\_schema         | Optional\[Dict\[str, Any]]                                              | JSON schema for synthesized search output. When provided, `response.output.content` follows this schema.                                                                                                                                                             | None     |

### Return Example

```json theme={null}
{
  "results": [
    {
      "title": "Adept: Useful General Intelligence",
      "id": "https://www.adept.ai/",
      "url": "https://www.adept.ai/",
      "publishedDate": "2024-01-16T00:00:00.000Z",
      "author": null,
      "score": 0.92,
      "highlights": ["Adept builds AI agents that can automate complex software workflows."],
      "highlightScores": [0.84]
    },
    {
      "title": "Tenyx | Voice AI Agents",
      "id": "https://www.tenyx.com/",
      "url": "https://www.tenyx.com/",
      "publishedDate": "2024-09-10T00:00:00.000Z",
      "author": null,
      "score": 0.89,
      "highlights": ["Tenyx develops conversational AI for enterprise customer support."],
      "highlightScores": [0.81]
    }
  ],
  "requestId": "a78ebce717f4d712b6f8fe0d5d7753f8",
  "statuses": [
    {
      "id": "https://www.adept.ai/",
      "status": "success"
    },
    {
      "id": "https://www.tenyx.com/",
      "status": "success"
    }
  ]
}
```

### Result Object

| Field           | Type                                   | Description                                                   |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| url             | str                                    | The URL of the search result.                                 |
| id              | str                                    | The temporary ID for the document.                            |
| title           | Optional\[str]                         | The title of the search result.                               |
| score           | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author          | Optional\[str]                         | The author of the content (if available).                     |
| image           | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon         | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages        | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras          | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities        | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |

## `get_contents` Method

Retrieve contents for a list of URLs.

### Input Example

```python theme={null}
# Get contents for a single URL
contents = exa.get_contents("https://example.com/article")

# Get contents for multiple URLs
contents = exa.get_contents([
    "https://example.com/article1",
    "https://example.com/article2"
])
```

### Input Parameters

| Parameter | Type                                                 | Description                                                       | Default  |
| --------- | ---------------------------------------------------- | ----------------------------------------------------------------- | -------- |
| urls      | Union\[str, List\[str], List\[[\_Result](#_result)]] | A single URL, list of URLs, or list of [Result](#result) objects. | Required |

### Return Example

```json theme={null}
{
  "results": [
    {
      "url": "https://example.com/article",
      "id": "https://example.com/article",
      "title": "Example Article",
      "text": "The full text content of the article..."
    }
  ]
}
```

### Result Object

| Field           | Type                                   | Description                                                   |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| url             | str                                    | The URL of the search result.                                 |
| id              | str                                    | The temporary ID for the document.                            |
| title           | Optional\[str]                         | The title of the search result.                               |
| score           | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author          | Optional\[str]                         | The author of the content (if available).                     |
| image           | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon         | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages        | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras          | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities        | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |

## `answer` Method

Generate an answer to a query using Exa's search and LLM capabilities.

### Input Example

```python theme={null}
response = exa.answer("What is the capital of France?")

print(response.answer)       # e.g. "Paris"
print(response.citations)    # list of citations used

# If you want the full text of the citations in the response:
response_with_text = exa.answer(
    "What is the capital of France?",
    text=True
)
print(response_with_text.citations[0].text)  # Full page text
```

### Input Parameters

| Parameter      | Type                                           | Description                                                             | Default  |
| -------------- | ---------------------------------------------- | ----------------------------------------------------------------------- | -------- |
| query          | str                                            | The query to answer.                                                    | Required |
| stream         | Optional\[bool]                                | -                                                                       | `False`  |
| text           | Optional\[bool]                                | Whether to include full text in the results. Defaults to False.         | `False`  |
| system\_prompt | Optional\[str]                                 | A system prompt to guide the LLM's behavior when generating the answer. | None     |
| model          | Optional\[Literal\['exa']]                     | The model to use for answering. Defaults to None.                       | None     |
| output\_schema | Optional\[[JSONSchemaInput](#jsonschemainput)] | JSON schema describing the desired answer structure.                    | None     |
| user\_location | Optional\[str]                                 | -                                                                       | None     |

### Return Example

```json theme={null}
{
  "answer": "The capital of France is Paris.",
  "citations": [
    {
      "id": "https://www.example.com/france",
      "url": "https://www.example.com/france",
      "title": "France - Wikipedia",
      "publishedDate": "2023-01-01",
      "author": null,
      "text": "France, officially the French Republic, is a country in... [truncated for brevity]"
    }
  ]
}
```

### Result Object

| Field           | Type           | Description                                                  |
| --------------- | -------------- | ------------------------------------------------------------ |
| id              | str            | The temporary ID for the document.                           |
| url             | str            | The URL of the search result.                                |
| title           | Optional\[str] | The title of the search result.                              |
| published\_date | Optional\[str] | An estimate of the creation date, from parsing HTML content. |
| author          | Optional\[str] | If available, the author of the content.                     |
| text            | Optional\[str] | The full page text from each search result.                  |

## `stream_answer` Method

Generate a streaming answer response.

### Input Example

```python theme={null}
stream = exa.stream_answer("What is the capital of France?", text=True)

for chunk in stream:
    if chunk.content:
        print("Partial answer:", chunk.content)
    if chunk.citations:
        for citation in chunk.citations:
            print("Citation found:", citation.url)
```

### Input Parameters

| Parameter      | Type                                           | Description                                                             | Default  |
| -------------- | ---------------------------------------------- | ----------------------------------------------------------------------- | -------- |
| query          | str                                            | The query to answer.                                                    | Required |
| text           | bool                                           | Whether to include full text in the results. Defaults to False.         | `False`  |
| system\_prompt | Optional\[str]                                 | A system prompt to guide the LLM's behavior when generating the answer. | None     |
| model          | Optional\[Literal\['exa']]                     | The model to use for answering. Defaults to None.                       | None     |
| output\_schema | Optional\[[JSONSchemaInput](#jsonschemainput)] | JSON schema describing the desired answer structure.                    | None     |
| user\_location | Optional\[str]                                 | -                                                                       | None     |

### Return Example

```json theme={null}
{
  "answer": "The capital of France is Paris.",
  "citations": [
    {
      "id": "https://www.example.com/france",
      "url": "https://www.example.com/france",
      "title": "France - Wikipedia",
      "publishedDate": "2023-01-01",
      "author": null,
      "text": "France, officially the French Republic, is a country in... [truncated for brevity]"
    }
  ]
}
```

### Result Object

| Field     | Type                                            | Description                                 |
| --------- | ----------------------------------------------- | ------------------------------------------- |
| content   | Optional\[str]                                  | The partial text content of the answer      |
| citations | Optional\[List\[[AnswerResult](#answerresult)]] | List of citations if provided in this chunk |

## Types Reference

This section documents the TypedDict and dataclass types used throughout the SDK.

### Content Options

These TypedDict classes configure content retrieval options for the `contents` parameter.

#### `TextContentsOptions`

A class representing the options that you can specify when requesting text

| Field               | Type                                     | Description                                                                                                                                                                  |
| ------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| max\_characters     | int                                      | The maximum number of characters to return. Default: None (no limit).                                                                                                        |
| include\_html\_tags | bool                                     | If true, include HTML tags in the returned text. Default false.                                                                                                              |
| verbosity           | [VERBOSITY\_OPTIONS](#verbosity_options) | Controls verbosity level of returned content. "compact" (default): main content only; "standard": balanced; "full": all sections. Requires max\_age\_hours=0 to take effect. |
| include\_sections   | List\[[SECTION\_TAG](#section_tag)]      | Only include content from these semantic sections. Requires max\_age\_hours=0 to take effect.                                                                                |
| exclude\_sections   | List\[[SECTION\_TAG](#section_tag)]      | Exclude content from these semantic sections. Requires max\_age\_hours=0 to take effect.                                                                                     |

#### `SummaryContentsOptions`

A class representing the options that you can specify when requesting summary

| Field  | Type                                | Description                                                                                                                         |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| query  | str                                 | The query string for the summary. Summary will bias towards answering the query.                                                    |
| schema | [JSONSchemaInput](#jsonschemainput) | JSON schema for structured output from summary. Can be a Pydantic model (automatically converted) or a dict containing JSON Schema. |

#### `HighlightsContentsOptions`

A class representing the options that you can specify when requesting highlights.

| Field           | Type | Description                                                                                     |
| --------------- | ---- | ----------------------------------------------------------------------------------------------- |
| query           | str  | The query string for highlight generation. Highlights will be biased towards this query.        |
| max\_characters | int  | The maximum number of characters to return for highlights. Default: None (server default).      |
| dynamic         | bool | Allocate one shared highlight budget across the result set. Incompatible with `max_characters`. |

<Note>
  Dynamic Highlights is a research preview. Requests that set `dynamic` require the `Exa-Beta: dynamic-highlights-2026-08-28` header; the SDK sends it automatically.
</Note>

#### `ExtrasOptions`

A class representing additional extraction fields (e.g. links, images)

| Field        | Type | Description |
| ------------ | ---- | ----------- |
| links        | int  | -           |
| image\_links | int  | -           |

#### `ContentsOptions`

Options for retrieving page contents in search methods.

All fields are optional. If no content options are specified, text with
max\_characters=10000 is returned by default.

| Field           | Type                                                                            | Description                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| text            | Union\[[TextContentsOptions](#textcontentsoptions), Literal\[True]]             | Options for text extraction, or True for defaults.                                                                                                                                                                                               |
| highlights      | Union\[[HighlightsContentsOptions](#highlightscontentsoptions), Literal\[True]] | Options for highlight extraction, or True for defaults.                                                                                                                                                                                          |
| summary         | Union\[[SummaryContentsOptions](#summarycontentsoptions), Literal\[True]]       | Options for summary generation, or True for defaults.                                                                                                                                                                                            |
| max\_age\_hours | int                                                                             | Maximum age of cached content in hours. If content is older, it will be fetched fresh. Special values: 0 = always fetch fresh content, -1 = never fetch fresh (use cached content only). Example: 168 = fetch fresh for pages older than 7 days. |
| subpages        | int                                                                             | Number of subpages to crawl.                                                                                                                                                                                                                     |
| subpage\_target | Union\[str, List\[str]]                                                         | Target subpage path(s) to crawl.                                                                                                                                                                                                                 |
| extras          | [ExtrasOptions](#extrasoptions)                                                 | Additional extraction options (links, images).                                                                                                                                                                                                   |

### Response Types

These dataclasses represent API response objects.

#### `JSONSchema`

Represents a JSON Schema definition used for structured summary output.

.. deprecated:: 1.15.0
Use Pydantic models or dict\[str, Any] directly instead.
This will be removed in a future version.

To learn more visit [https://json-schema.org/overview/what-is-jsonschema](https://json-schema.org/overview/what-is-jsonschema).

| Field                | Type                                                                          | Description |
| -------------------- | ----------------------------------------------------------------------------- | ----------- |
| schema\_             | str                                                                           | -           |
| title                | str                                                                           | -           |
| description          | str                                                                           | -           |
| type                 | Literal\['object', 'array', 'string', 'number', 'boolean', 'null', 'integer'] | -           |
| properties           | Dict\[str, [JSONSchema](#jsonschema)]                                         | -           |
| items                | Union\[[JSONSchema](#jsonschema), List\[[JSONSchema](#jsonschema)]]           | -           |
| required             | List\[str]                                                                    | -           |
| enum                 | List                                                                          | -           |
| additionalProperties | Union\[bool, [JSONSchema](#jsonschema)]                                       | -           |
| definitions          | Dict\[str, [JSONSchema](#jsonschema)]                                         | -           |
| patternProperties    | Dict\[str, [JSONSchema](#jsonschema)]                                         | -           |
| allOf                | List\[[JSONSchema](#jsonschema)]                                              | -           |
| anyOf                | List\[[JSONSchema](#jsonschema)]                                              | -           |
| oneOf                | List\[[JSONSchema](#jsonschema)]                                              | -           |
| not\_                | [JSONSchema](#jsonschema)                                                     | -           |

#### `CostDollarsSearch`

Represents the cost breakdown for search.

| Field   | Type  | Description |
| ------- | ----- | ----------- |
| neural  | float | -           |
| keyword | float | -           |

#### `CostDollarsContents`

Represents the cost breakdown for contents.

| Field   | Type  | Description |
| ------- | ----- | ----------- |
| text    | float | -           |
| summary | float | -           |

#### `CostDollars`

Represents costDollars field in the API response.

| Field    | Type                                        | Description |
| -------- | ------------------------------------------- | ----------- |
| total    | float                                       | -           |
| search   | [CostDollarsSearch](#costdollarssearch)     | -           |
| contents | [CostDollarsContents](#costdollarscontents) | -           |

#### `_Result`

A class representing the base fields of a search result.

| Field           | Type                                   | Description                                                   |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| url             | str                                    | The URL of the search result.                                 |
| id              | str                                    | The temporary ID for the document.                            |
| title           | Optional\[str]                         | The title of the search result.                               |
| score           | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author          | Optional\[str]                         | The author of the content (if available).                     |
| image           | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon         | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages        | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras          | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities        | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |

#### `Result`

A class representing a search result with optional text, summary, and highlights.

| Field             | Type                                   | Description                                                   |
| ----------------- | -------------------------------------- | ------------------------------------------------------------- |
| url               | str                                    | The URL of the search result.                                 |
| id                | str                                    | The temporary ID for the document.                            |
| title             | Optional\[str]                         | The title of the search result.                               |
| score             | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date   | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author            | Optional\[str]                         | The author of the content (if available).                     |
| image             | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon           | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages          | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras            | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities          | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |
| text              | Optional\[str]                         | The text content of the page.                                 |
| summary           | Optional\[str]                         | A summary of the page content.                                |
| highlights        | Optional\[List\[str]]                  | Relevant sentences from the page.                             |
| highlight\_scores | Optional\[List\[float]]                | Scores for each highlight.                                    |

#### `ResultWithText`

A class representing a search result with text present.

| Field           | Type                                   | Description                                                   |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| url             | str                                    | The URL of the search result.                                 |
| id              | str                                    | The temporary ID for the document.                            |
| title           | Optional\[str]                         | The title of the search result.                               |
| score           | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author          | Optional\[str]                         | The author of the content (if available).                     |
| image           | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon         | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages        | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras          | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities        | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |
| text            | str                                    | The text of the search result page.                           |

#### `ResultWithSummary`

A class representing a search result with summary present.

| Field           | Type                                   | Description                                                   |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| url             | str                                    | The URL of the search result.                                 |
| id              | str                                    | The temporary ID for the document.                            |
| title           | Optional\[str]                         | The title of the search result.                               |
| score           | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author          | Optional\[str]                         | The author of the content (if available).                     |
| image           | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon         | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages        | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras          | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities        | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |
| summary         | str                                    | -                                                             |

#### `ResultWithTextAndSummary`

A class representing a search result with text and summary present.

| Field           | Type                                   | Description                                                   |
| --------------- | -------------------------------------- | ------------------------------------------------------------- |
| url             | str                                    | The URL of the search result.                                 |
| id              | str                                    | The temporary ID for the document.                            |
| title           | Optional\[str]                         | The title of the search result.                               |
| score           | Optional\[float]                       | A number from 0 to 1 representing similarity.                 |
| published\_date | Optional\[str]                         | An estimate of the creation date, from parsing HTML content.  |
| author          | Optional\[str]                         | The author of the content (if available).                     |
| image           | Optional\[str]                         | A URL to an image associated with the content (if available). |
| favicon         | Optional\[str]                         | A URL to the favicon (if available).                          |
| subpages        | Optional\[List\[[\_Result](#_result)]] | Subpages of main page                                         |
| extras          | Optional\[Dict]                        | Additional metadata; e.g. links, images.                      |
| entities        | Optional\[List\[[Entity](#entity)]]    | Structured entity data for company or person searches.        |
| text            | str                                    | -                                                             |
| summary         | str                                    | -                                                             |

#### `AnswerResult`

A class representing a result for an answer.

| Field           | Type           | Description                                                  |
| --------------- | -------------- | ------------------------------------------------------------ |
| id              | str            | The temporary ID for the document.                           |
| url             | str            | The URL of the search result.                                |
| title           | Optional\[str] | The title of the search result.                              |
| published\_date | Optional\[str] | An estimate of the creation date, from parsing HTML content. |
| author          | Optional\[str] | If available, the author of the content.                     |
| text            | Optional\[str] | The full page text from each search result.                  |

#### `StreamChunk`

A class representing a single chunk of streaming data.

| Field     | Type                                            | Description                                 |
| --------- | ----------------------------------------------- | ------------------------------------------- |
| content   | Optional\[str]                                  | The partial text content of the answer      |
| citations | Optional\[List\[[AnswerResult](#answerresult)]] | List of citations if provided in this chunk |

#### `AnswerResponse`

A class representing the response for an answer operation.

| Field         | Type                                   | Description                                      |
| ------------- | -------------------------------------- | ------------------------------------------------ |
| answer        | Union\[str, dict\[str, Any]]           | The generated answer.                            |
| citations     | List\[[AnswerResult](#answerresult)]   | A list of citations used to generate the answer. |
| cost\_dollars | Optional\[[CostDollars](#costdollars)] | The cost breakdown for this request.             |

#### `StreamAnswerResponse`

A class representing a streaming answer response.

#### `AsyncStreamAnswerResponse`

A class representing a streaming answer response.

#### `ContentStatus`

A class representing the status of a content retrieval operation.

| Field  | Type | Description |
| ------ | ---- | ----------- |
| id     | str  | -           |
| status | str  | -           |
| source | str  | -           |

#### `SearchResponse`

A class representing the response for a search operation.

| Field                  | Type                                              | Description                                                                  |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| results                | List\[T]                                          | A list of search results.                                                    |
| resolved\_search\_type | Optional\[str]                                    | 'neural' or 'keyword' if auto.                                               |
| output                 | Optional\[DeepSearchOutput]                       | Deep search synthesized output object with `content` and `grounding` fields. |
| statuses               | Optional\[List\[[ContentStatus](#contentstatus)]] | Status list from get\_contents.                                              |
| cost\_dollars          | Optional\[[CostDollars](#costdollars)]            | Cost breakdown.                                                              |
| search\_time           | Optional\[float]                                  | Time taken for the search in milliseconds.                                   |

#### `DeepSearchOutputGroundingCitation`

| Field | Type | Description     |
| ----- | ---- | --------------- |
| url   | str  | Citation URL.   |
| title | str  | Citation title. |

#### `DeepSearchOutputGrounding`

| Field      | Type                                                                           | Description                                                                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| field      | str                                                                            | Field path in `output.content` (for example `content` or `companies[0].funding`). |
| citations  | List\[[DeepSearchOutputGroundingCitation](#deepsearchoutputgroundingcitation)] | Sources supporting this output field.                                             |
| confidence | Literal\['low', 'medium', 'high']                                              | Reliability rating for this output field.                                         |

#### `DeepSearchOutput`

| Field     | Type                                                           | Description                                                                   |
| --------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| content   | Union\[str, dict\[str, Any]]                                   | Synthesized content (string by default, object when `output_schema` is used). |
| grounding | List\[[DeepSearchOutputGrounding](#deepsearchoutputgrounding)] | Field-level grounding used for synthesized output.                            |

#### `CostDollars`

| Field             | Type  | Description |
| ----------------- | ----- | ----------- |
| total             | float | -           |
| num\_pages        | float | -           |
| num\_searches     | float | -           |
| reasoning\_tokens | float | -           |

#### `Result`

| Field | Type | Description |
| ----- | ---- | ----------- |
| url   | str  | -           |

### Entity Types

These types represent structured entity data returned for company or person searches.

#### `JSONSchemaInput`

Input type for JSON schema parameters. Can be either a Pydantic model class (automatically converted to JSON Schema) or a raw JSON Schema dictionary.

**Type:** Union\[type\[[BaseModel](https://docs.pydantic.dev/latest/api/base_model/#BaseModel)], dict\[str, Any]]

#### `Category`

Data category to focus on when searching. Each category returns results specialized for that content type.

**Type:** Literal\['company', 'publication', 'news', 'personal site', 'financial report', 'people']

#### `SearchType`

Search type that determines the search algorithm:

* **auto** (default): Automatically selects an appropriate search method based on the query for optimal results
* **fast**: Low latency search using optimized search models
* **instant**: Lowest latency search optimized for real-time applications like voice agents
* **deep-lite**: Lightweight synthesized output with lower latency than `deep`
* **deep**: Multi-step search with reasoning and structured outputs
* **deep-reasoning**: More deliberate deep-search mode when you want more reasoning than `deep`

**Type:** Literal\['auto', 'fast', 'instant', 'deep-lite', 'deep', 'deep-reasoning']

#### `VERBOSITY_OPTIONS`

Verbosity levels for content filtering.

* compact: Most concise output, main content only (default)
* standard: Balanced content with more detail
* full: Complete content including all sections

**Type:** Literal\['compact', 'standard', 'full']

#### `SECTION_TAG`

Section tags for semantic content filtering.

**Type:** Literal\['unspecified', 'header', 'navigation', 'banner', 'body', 'sidebar', 'footer', 'metadata']

#### `Entity`

**Type:** Union\[[CompanyEntity](#companyentity), [PersonEntity](#personentity)]

#### `EntityCompanyPropertiesWorkforce`

Company workforce information.

| Field | Type           | Description |
| ----- | -------------- | ----------- |
| total | Optional\[int] | -           |

#### `EntityCompanyPropertiesHeadquarters`

Company headquarters information.

| Field        | Type           | Description |
| ------------ | -------------- | ----------- |
| address      | Optional\[str] | -           |
| city         | Optional\[str] | -           |
| postal\_code | Optional\[str] | -           |
| country      | Optional\[str] | -           |

#### `EntityCompanyPropertiesFundingRound`

Funding round information.

| Field  | Type           | Description |
| ------ | -------------- | ----------- |
| name   | Optional\[str] | -           |
| date   | Optional\[str] | -           |
| amount | Optional\[int] | -           |

#### `EntityCompanyPropertiesFinancials`

Company financial information.

| Field                  | Type                                                                                   | Description |
| ---------------------- | -------------------------------------------------------------------------------------- | ----------- |
| revenue\_annual        | Optional\[int]                                                                         | -           |
| funding\_total         | Optional\[int]                                                                         | -           |
| funding\_latest\_round | Optional\[[EntityCompanyPropertiesFundingRound](#entitycompanypropertiesfundinground)] | -           |

#### `EntityCompanyPropertiesWebTraffic`

Company web traffic information.

| Field           | Type           | Description |
| --------------- | -------------- | ----------- |
| visits\_monthly | Optional\[int] | -           |

#### `EntityCompanyProperties`

Structured properties for a company entity.

| Field         | Type                                                                                   | Description |
| ------------- | -------------------------------------------------------------------------------------- | ----------- |
| name          | Optional\[str]                                                                         | -           |
| founded\_year | Optional\[int]                                                                         | -           |
| description   | Optional\[str]                                                                         | -           |
| workforce     | Optional\[[EntityCompanyPropertiesWorkforce](#entitycompanypropertiesworkforce)]       | -           |
| headquarters  | Optional\[[EntityCompanyPropertiesHeadquarters](#entitycompanypropertiesheadquarters)] | -           |
| financials    | Optional\[[EntityCompanyPropertiesFinancials](#entitycompanypropertiesfinancials)]     | -           |
| web\_traffic  | Optional\[[EntityCompanyPropertiesWebTraffic](#entitycompanypropertieswebtraffic)]     | -           |

#### `EntityDateRange`

Date range for work history entries.

| Field      | Type           | Description |
| ---------- | -------------- | ----------- |
| from\_date | Optional\[str] | -           |
| to\_date   | Optional\[str] | -           |

#### `EntityPersonPropertiesCompanyRef`

Reference to a company in work history.

| Field | Type           | Description |
| ----- | -------------- | ----------- |
| id    | Optional\[str] | -           |
| name  | Optional\[str] | -           |

#### `EntityPersonPropertiesWorkHistoryEntry`

A single work history entry for a person.

| Field    | Type                                                                             | Description |
| -------- | -------------------------------------------------------------------------------- | ----------- |
| title    | Optional\[str]                                                                   | -           |
| location | Optional\[str]                                                                   | -           |
| dates    | Optional\[[EntityDateRange](#entitydaterange)]                                   | -           |
| company  | Optional\[[EntityPersonPropertiesCompanyRef](#entitypersonpropertiescompanyref)] | -           |

#### `EntityPersonProperties`

Structured properties for a person entity.

| Field         | Type                                                                                                | Description |
| ------------- | --------------------------------------------------------------------------------------------------- | ----------- |
| name          | Optional\[str]                                                                                      | -           |
| location      | Optional\[str]                                                                                      | -           |
| work\_history | Optional\[List\[[EntityPersonPropertiesWorkHistoryEntry](#entitypersonpropertiesworkhistoryentry)]] | -           |

#### `CompanyEntity`

Structured entity data for a company.

| Field      | Type                                                | Description |
| ---------- | --------------------------------------------------- | ----------- |
| id         | str                                                 | -           |
| type       | Literal\['company']                                 | -           |
| version    | int                                                 | -           |
| properties | [EntityCompanyProperties](#entitycompanyproperties) | -           |

#### `PersonEntity`

Structured entity data for a person.

| Field      | Type                                              | Description |
| ---------- | ------------------------------------------------- | ----------- |
| id         | str                                               | -           |
| type       | Literal\['person']                                | -           |
| version    | int                                               | -           |
| properties | [EntityPersonProperties](#entitypersonproperties) | -           |

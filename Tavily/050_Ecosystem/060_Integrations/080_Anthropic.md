> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Anthropic

> Integrate Tavily with Anthropic Claude to enhance your AI applications with real-time web search capabilities.

## Installation

Install the required packages:

```bash theme={null}
pip install anthropic tavily-python
```

## Setup

Set up your API keys:

```python theme={null}
import os
# Set your API keys
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
os.environ["TAVILY_API_KEY"] = "your-tavily-api-key"
```

## Using Tavily with Anthropic tool calling

```python theme={null}
import json
from anthropic import Anthropic
from tavily import TavilyClient

# Initialize clients
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
MODEL_NAME = "claude-sonnet-4-20250514"
```

## Implementation

### System prompt

Define a system prompt to guide Claude's behavior:

```python theme={null}
SYSTEM_PROMPT = (
    "You are a research assistant. Use the tavily_search tool when needed. "
    "After tools run and tool results are provided back to you, produce a concise, well-structured summary "
    "with a short bullet list of key points and a 'Sources' section listing the URLs. "
)
```

### Tool schema

Define the Tavily search tool for Claude with enhanced parameters:

```python theme={null}
tools = [
    {
        "name": "tavily_search",
        "description": "Search the web using Tavily. Return relevant links & summaries.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query string."},
                "max_results": {"type": "integer", "default": 5},
                "search_depth": {"type": "string", "enum": ["basic", "advanced"]},
            },
            "required": ["query"]
        }
    }
]
```

[Scroll to the bottom to find the full json schema for search, extract, map and crawl](#tavily-endpoints-schema-for-anthropic-tool-definition)

### Tool execution

Create optimized functions to handle Tavily searches:

```python theme={null}
def tavily_search(**kwargs):
    return tavily_client.search(**kwargs)

def process_tool_call(name, args):
    if name == "tavily_search":
        return tavily_search(**args)
    raise ValueError(f"Unknown tool: {name}")
```

### Main chat function

The main function that handles the two-step conversation with Claude:

```python theme={null}
def chat_with_claude(user_message: str):
    print(f"\n{'='*50}\nUser Message: {user_message}\n{'='*50}")

    # ---- Call 1: allow tools so Claude can ask for searches ----
    initial_response = client.messages.create(
        model=MODEL_NAME,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": [{"type": "text", "text": user_message}]}],
        tools=tools,
    )

    print("\nInitial Response stop_reason:", initial_response.stop_reason)
    print("Initial content:", initial_response.content)

    # If Claude already answered in text, return it
    if initial_response.stop_reason != "tool_use":
        final_text = next((b.text for b in initial_response.content if getattr(b, "type", None) == "text"), None)
        print("\nFinal Response:", final_text)
        return final_text

    # ---- Execute ALL tool_use blocks from Call 1 ----
    tool_result_blocks = []
    for block in initial_response.content:
        if getattr(block, "type", None) == "tool_use":
            result = process_tool_call(block.name, block.input)
            tool_result_blocks.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": [{"type": "text", "text": json.dumps(result)}],
            })

    # ---- Call 2: NO tools; ask for the final summary from tool results ----
    final_response = client.messages.create(
        model=MODEL_NAME,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": [{"type": "text", "text": user_message}]},
            {"role": "assistant", "content": initial_response.content},    # Claude's tool requests
            {"role": "user", "content": tool_result_blocks},    # Your tool results
            {"role": "user", "content": [{"type": "text", "text":
                "Please synthesize the final answer now based on the tool results above. "
                "Include 3–7 bullets and a 'Sources' section with URLs."}]},
        ],
    )

    final_text = next((b.text for b in final_response.content if getattr(b, "type", None) == "text"), None)
    print("\nFinal Response:", final_text)
    return final_text
```

### Usage example

```python theme={null}
# Example usage
chat_with_claude("What is trending now in the agents space in 2025?")
```

<Accordion title="Full Code Example">
  ```python theme={null}
  import os
  import json
  from anthropic import Anthropic
  from tavily import TavilyClient

  client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
  tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
  MODEL_NAME = "claude-sonnet-4-20250514"

  SYSTEM_PROMPT = (
      "You are a research assistant. Use the tavily_search tool when needed. "
      "After tools run and tool results are provided back to you, produce a concise, well-structured summary "
      "with a short bullet list of key points and a 'Sources' section listing the URLs. "
  )

  # ---- Define your client-side tool schema for Anthropic ----
  tools = [
      {
          "name": "tavily_search",
          "description": "Search the web using Tavily. Return relevant links & summaries.",
          "input_schema": {
              "type": "object",
              "properties": {
                  "query": {"type": "string", "description": "Search query string."},
                  "max_results": {"type": "integer", "default": 5},
                  "search_depth": {"type": "string", "enum": ["basic", "advanced"]},
              },
              "required": ["query"]
          }
      }
  ]

  # ---- Your local tool executor ----
  def tavily_search(**kwargs):
      return tavily_client.search(**kwargs)

  def process_tool_call(name, args):
      if name == "tavily_search":
          return tavily_search(**args)
      raise ValueError(f"Unknown tool: {name}")

  def chat_with_claude(user_message: str):
      print(f"\n{'='*50}\nUser Message: {user_message}\n{'='*50}")

      # ---- Call 1: allow tools so Claude can ask for searches ----
      initial_response = client.messages.create(
          model=MODEL_NAME,
          max_tokens=4096,
          system=SYSTEM_PROMPT, 
          messages=[{"role": "user", "content": [{"type": "text", "text": user_message}]}],
          tools=tools,
      )

      print("\nInitial Response stop_reason:", initial_response.stop_reason)
      print("Initial content:", initial_response.content)

      # If Claude already answered in text, return it
      if initial_response.stop_reason != "tool_use":
          final_text = next((b.text for b in initial_response.content if getattr(b, "type", None) == "text"), None)
          print("\nFinal Response:", final_text)
          return final_text

      # ---- Execute ALL tool_use blocks from Call 1 ----
      tool_result_blocks = []
      for block in initial_response.content:
          if getattr(block, "type", None) == "tool_use":
              result = process_tool_call(block.name, block.input)
              tool_result_blocks.append({
                  "type": "tool_result",
                  "tool_use_id": block.id,
                  "content": [{"type": "text", "text": json.dumps(result)}],
              })

      # ---- Call 2: NO tools; ask for the final summary from tool results ----
      final_response = client.messages.create(
          model=MODEL_NAME,
          max_tokens=4096,
          system=SYSTEM_PROMPT,
          messages=[
              {"role": "user", "content": [{"type": "text", "text": user_message}]},
              {"role": "assistant", "content": initial_response.content},    # Claude's tool requests
              {"role": "user", "content": tool_result_blocks},    # Your tool results
              {"role": "user", "content": [{"type": "text", "text":
                  "Please synthesize the final answer now based on the tool results above. "
                  "Include 3–7 bullets and a 'Sources' section with URLs."}]},
          ],
      )

      final_text = next((b.text for b in final_response.content if getattr(b, "type", None) == "text"), None)
      print("\nFinal Response:", final_text)
      return final_text

  # Example usage
  chat_with_claude("What is trending now in the agents space in 2025?")
  ```
</Accordion>

## Tavily endpoints schema for Anthropic tool definition

> **Note:** When using these schemas, you can customize which parameters are exposed to the model based on your specific use case. For example, if you are building a finance application, you might set `topic`: `"finance"` for all queries without exposing the `topic` parameter. This way, the LLM can focus on deciding other parameters, such as `time_range`, `country`, and so on, based on the user's request. Feel free to modify these schemas as needed and only pass the parameters that are relevant to your application.

> **API Format:** The schemas below are for Anthropic's tool format. Each tool uses the `input_schema` structure with `type`, `properties`, and `required` fields.

<Accordion title="search schema">
  ```python theme={null}
  tools = [
      {
          "name": "tavily_search",
          "description": "A powerful web search tool that provides comprehensive, real-time results using Tavily's AI search engine. Returns relevant web content with customizable parameters for result count, content type, and domain filtering. Ideal for gathering current information, news, and detailed web content analysis.",
          "input_schema": {
              "type": "object",
              "required": ["query"],
              "properties": {
                  "query": {
                      "type": "string",
                      "description": "Search query"
                  },
                  "auto_parameters": {
                      "type": "boolean",
                      "default": False,
                      "description": "Auto-tune parameters based on the query. Explicit values you pass still win."
                  },
                  "topic": {
                      "type": "string",
                      "enum": ["general", "news","finance"],
                      "default": "general",
                      "description": "The category of the search. This will determine which of our agents will be used for the search"
                  },
                  "search_depth": {
                      "type": "string",
                      "enum": ["basic", "advanced"],
                      "default": "basic",
                      "description": "The depth of the search. It can be 'basic' or 'advanced'"
                  },
                  "chunks_per_source": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 3,
                      "default": 3,
                      "description": "Chunks are short content snippets (maximum 500 characters each) pulled directly from the source."
                  },
                  "max_results": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 20,
                      "default": 5,
                      "description": "The maximum number of search results to return"
                  },
                  "time_range": {
                      "type": "string",
                      "enum": ["day", "week", "month", "year"],
                      "description": "The time range back from the current date to include in the search results. This feature is available for both 'general' and 'news' search topics"
                  },
                  "start_date": {
                      "type": "string",
                      "format": "date",
                      "description": "Will return all results after the specified start date. Required to be written in the format YYYY-MM-DD."
                  },
                  "end_date": {
                      "type": "string",
                      "format": "date",
                      "description": "Will return all results before the specified end date. Required to be written in the format YYYY-MM-DD"
                  },
                  "include_answer": {
                      "description": "Include an LLM-generated answer. 'basic' is brief; 'advanced' is more detailed.",
                      "oneOf": [
                          {"type": "boolean"},
                          {"type": "string", "enum": ["basic", "advanced"]}
                      ],
                      "default": False
                  },
                  "include_raw_content": {
                      "description": "Include the cleaned and parsed HTML content of each search result",
                      "oneOf": [
                          {"type": "boolean"},
                          {"type": "string", "enum": ["markdown", "text"]}
                      ],
                      "default": False
                  },
                  "include_images": {
                      "type": "boolean",
                      "default": False,
                      "description": "Include a list of query-related images in the response"
                  },
                  "include_image_descriptions": {
                      "type": "boolean",
                      "default": False,
                      "description": "Include a list of query-related images and their descriptions in the response"
                  },
                  "include_favicon": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include the favicon URL for each result"
                  },
                  "include_usage": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include credit usage information in the response"
                  },
                  "include_domains": {
                      "type": "array",
                      "items": {"type": "string"},
                      "maxItems": 300,
                      "description": "A list of domains to specifically include in the search results, if the user asks to search on specific sites set this to the domain of the site"
                  },
                  "exclude_domains": {
                      "type": "array",
                      "items": {"type": "string"},
                      "maxItems": 150,
                      "description": "List of domains to specifically exclude, if the user asks to exclude a domain set this to the domain of the site"
                  },
                  "country": {
                      "type": "string",
                      "enum": ["afghanistan", "albania", "algeria", "andorra", "angola", "argentina", "armenia", "australia", "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin", "bhutan", "bolivia", "bosnia and herzegovina", "botswana", "brazil", "brunei", "bulgaria", "burkina faso", "burundi", "cambodia", "cameroon", "canada", "cape verde", "central african republic", "chad", "chile", "china", "colombia", "comoros", "congo", "costa rica", "croatia", "cuba", "cyprus", "czech republic", "denmark", "djibouti", "dominican republic", "ecuador", "egypt", "el salvador", "equatorial guinea", "eritrea", "estonia", "ethiopia", "fiji", "finland", "france", "gabon", "gambia", "georgia", "germany", "ghana", "greece", "guatemala", "guinea", "haiti", "honduras", "hungary", "iceland", "india", "indonesia", "iran", "iraq", "ireland", "israel", "italy", "jamaica", "japan", "jordan", "kazakhstan", "kenya", "kuwait", "kyrgyzstan", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", "lithuania", "luxembourg", "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "mauritania", "mauritius", "mexico", "moldova", "monaco", "mongolia", "montenegro", "morocco", "mozambique", "myanmar", "namibia", "nepal", "netherlands", "new zealand", "nicaragua", "niger", "nigeria", "north korea", "north macedonia", "norway", "oman", "pakistan", "panama", "papua new guinea", "paraguay", "peru", "philippines", "poland", "portugal", "qatar", "romania", "russia", "rwanda", "saudi arabia", "senegal", "serbia", "singapore", "slovakia", "slovenia", "somalia", "south africa", "south korea", "south sudan", "spain", "sri lanka", "sudan", "sweden", "switzerland", "syria", "taiwan", "tajikistan", "tanzania", "thailand", "togo", "trinidad and tobago", "tunisia", "turkey", "turkmenistan", "uganda", "ukraine", "united arab emirates", "united kingdom", "united states", "uruguay", "uzbekistan", "venezuela", "vietnam", "yemen", "zambia", "zimbabwe"],
                      "description": "Boost search results from a specific country. This will prioritize content from the selected country in the search results. Available only if topic is general. Country names MUST be written in lowercase, plain English, with spaces and no underscores."
                  }
              }
          }
      }
  ]
  ```
</Accordion>

<Accordion title="extract schema">
  ```python theme={null}
  tools = [
      {
          "name": "tavily_extract",
          "description": "A powerful web content extraction tool that retrieves and processes raw content from specified URLs, ideal for data collection, content analysis, and research tasks.",
          "input_schema": {
              "type": "object",
              "required": ["urls"],
              "properties": {
                  "urls": {
                      "type": "string",
                      "description": "List of URLs to extract content from"
                  },
                  "include_images": {
                      "type": "boolean",
                      "default": False,
                      "description": "Include a list of images extracted from the urls in the response"
                  },
                  "include_favicon": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include the favicon URL for each result"
                  },
                  "include_usage": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include credit usage information in the response"
                  },
                  "extract_depth": {
                      "type": "string",
                      "enum": ["basic", "advanced"],
                      "default": "basic",
                      "description": "Depth of extraction - 'basic' or 'advanced', if urls are linkedin use 'advanced' or if explicitly told to use advanced"
                  },
                  "timeout": {
                      "type": "number",
                      "enum": ["basic", "advanced"],
                      "minimum": 0,
                      "maximum": 60,
                      "default": None,
                      "description": "Maximum time in seconds to wait for the URL extraction before timing out. Must be between 1.0 and 60.0 seconds. If not specified, default timeouts are applied based on extract_depth: 10 seconds for basic extraction and 30 seconds for advanced extraction"
                  },
                  "format": {
                      "type": "string",
                      "enum": ["markdown", "text"],
                      "default": "markdown",
                      "description": "The format of the extracted web page content. markdown returns content in markdown format. text returns plain text and may increase latency."
                  }
              }
          }
      }
  ]
  ```
</Accordion>

<Accordion title="map schema">
  ```python theme={null}
  tools = [
      {
          "name": "tavily_map",
          "description": "A powerful web mapping tool that creates a structured map of website URLs, allowing you to discover and analyze site structure, content organization, and navigation paths. Perfect for site audits, content discovery, and understanding website architecture.",
          "input_schema": {
              "type": "object",
              "required": ["url"],
              "properties": {
                  "url": {
                      "type": "string",
                      "description": "The root URL to begin the mapping"
                  },
                  "instructions": {
                      "type": "string",
                      "description": "Natural language instructions for the crawler"
                  },
                  "max_depth": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 5,
                      "default": 1,
                      "description": "Max depth of the mapping. Defines how far from the base URL the crawler can explore"
                  },
                  "max_breadth": {
                      "type": "integer",
                      "minimum": 1,
                      "default": 20,
                      "description": "Max number of links to follow per level of the tree (i.e., per page)"
                  },
                  "limit": {
                      "type": "integer",
                      "minimum": 1,
                      "default": 50,
                      "description": "Total number of links the crawler will process before stopping"
                  },
                  "select_paths": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to select only URLs with specific path patterns (e.g., /docs/.*, /api/v1.*)"
                  },
                  "select_domains": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to select crawling to specific domains or subdomains (e.g., ^docs\\.example\\.com$)"
                  },
                  "exclude_paths": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to exclude URLs with specific path patterns (e.g., /admin/.*)."
                  },
                  "exclude_domains": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to exclude specific domains or subdomains"
                  },
                  "allow_external": {
                      "type": "boolean",
                      "default": True,
                      "description": "Whether to allow following links that go to external domains"
                  },
                  "categories": {
                      "type": "array",
                      "items": {
                          "type": "string",
                          "enum": ["Documentation", "Blog", "Careers","About","Pricing","Community","Developers","Contact","Media"]
                      },
                      "description": "Filter URLs using predefined categories like documentation, blog, api, etc"
                  },
                  "include_usage": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include credit usage information in the response"
                  }
              }
          }
      }
  ]
  ```
</Accordion>

<Accordion title="crawl schema">
  ```python theme={null}
  tools = [
      {
          "name": "tavily_crawl",
          "description": "A powerful web crawler that initiates a structured web crawl starting from a specified base URL. The crawler expands from that point like a tree, following internal links across pages. You can control how deep and wide it goes, and guide it to focus on specific sections of the site.",
          "input_schema": {
              "type": "object",
              "required": ["url"],
              "properties": {
                  "url": {
                      "type": "string",
                      "description": "The root URL to begin the crawl"
                  },
                  "instructions": {
                      "type": "string",
                      "description": "Natural language instructions for the crawler"
                  },
                  "max_depth": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum: 5,
                      "default": 1,
                      "description": "Max depth of the crawl. Defines how far from the base URL the crawler can explore."
                  },
                  "max_breadth": {
                      "type": "integer",
                      "minimum": 1,
                      "default": 20,
                      "description": "Max number of links to follow per level of the tree (i.e., per page)"
                  },
                  "limit": {
                      "type": "integer",
                      "minimum": 1,
                      "default": 50,
                      "description": "Total number of links the crawler will process before stopping"
                  },
                  "select_paths": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to select only URLs with specific path patterns (e.g., /docs/.*, /api/v1.*)"
                  },
                  "select_domains": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to select crawling to specific domains or subdomains (e.g., ^docs\\.example\\.com$)"
                  },
                  "exclude_paths": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to exclude paths (e.g., /private/.*, /admin/.*)"
                  },
                  "exclude_domains": {
                      "type": "array",
                      "items": {"type": "string"},
                      "description": "Regex patterns to exclude domains/subdomains (e.g., ^private\\.example\\.com$)"
                  },
                  "allow_external": {
                      "type": "boolean",
                      "default": True,
                      "description": "Whether to allow following links that go to external domains"
                  },
                  "include_images": {
                      "type": "boolean",
                      "default": False,
                      "description": "Include images discovered during the crawl"
                  },
                  "categories": {
                      "type": "array",
                      "items": {
                          "type": "string",
                          "enum": ["Careers", "Blog", "Documentation", "About", "Pricing", "Community", "Developers", "Contact", "Media"]
                      },
                      "description": "Filter URLs using predefined categories like documentation, blog, api, etc"
                  },
                  "extract_depth": {
                      "type": "string",
                      "enum": ["basic", "advanced"],
                      "default": "basic",
                      "description": "Advanced extraction retrieves more data, including tables and embedded content, with higher success but may increase latency"
                  },
                  "format": {
                      "type": "string",
                      "enum": ["markdown", "text"],
                      "default": "markdown",
                      "description": "The format of the extracted web page content. markdown returns content in markdown format. text returns plain text and may increase latency."
                  },
                  "include_favicon": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include the favicon URL for each result"
                  },
                  "include_usage": {
                      "type": "boolean",
                      "default": False,
                      "description": "Whether to include credit usage information in the response"
                  }
              }
          }
      }
  ]
  ```
</Accordion>

For more information about Tavily's capabilities, check out our [API documentation](/documentation/api-reference/introduction) and [best practices](/documentation/best-practices/best-practices-search).

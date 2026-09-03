> 원본: https://docs.tavily.com/documentation/integrations/openai.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAI

> Integrate Tavily with OpenAI to enhance your AI applications with real-time web search capabilities.

## Introduction

This guide shows you how to integrate Tavily with OpenAI to create more powerful and informed AI applications. By combining OpenAI's language models with Tavily's real-time web search capabilities, you can build AI systems and agentic AI applications that access current information and provide up-to-date responses.

## Prerequisites

Before you begin, make sure you have:

* An OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
* A Tavily API key from [Tavily Dashboard](https://app.tavily.com/sign-in)

## Installation

Install the required packages:

```bash theme={null}
pip install openai tavily-python
```

## Setup

Set up your API keys:

```python theme={null}
import os

# Set your API keys
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
os.environ["TAVILY_API_KEY"] = "your-tavily-api-key"
```

## Using Tavily with OpenAI agents SDK

```bash theme={null}
pip install -U openai-agents
```

```python theme={null}
import os
import asyncio
from agents import Agent, Runner, function_tool
from tavily import TavilyClient

tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
```

```python theme={null}
@function_tool
def tavily_search(query: str) -> str:
    """
    Perform a web search using Tavily and return a summarized result.
    """
    response = tavily_client.search(query,search_depth='advanced',max_results='5')
    results = response.get("results", [])
    return results or "No results found."
```

> **Note:** You can enhance the function by adding more parameters like `topic="news"`, `include_domains=["example.com"]`, `time_range="week"`, etc. to customize your search results.

> You can set `auto_parameters=True` to have Tavily automatically configure search parameters based on the content and intent of your query. You can still set other parameters manually, and any explicit values you provide will override the automatic ones.

```python theme={null}
async def main():
    agent = Agent(
        name="Web Research Agent",
        instructions="Use tavily_search when you need up-to-date info.",
        tools=[tavily_search],
    )
    out = await Runner.run(agent, "Latest developments about quantum computing from 2025")
    print(out.final_output)
```

```python theme={null}
asyncio.run(main())
```

<Accordion title="Full Code Example">
  ```python theme={null}

  import os
  import asyncio
  from agents import Agent, Runner, function_tool
  from tavily import TavilyClient

  tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

  @function_tool
  def tavily_search(query: str) -> str:
      """
      Perform a web search using Tavily and return a summarized result.
      """
      response = tavily_client.search(query,search_depth='advanced',max_results='5')
      results = response.get("results", [])
      return results or "No results found."

  async def main():
      agent = Agent(
          name="Web Research Agent",
          instructions="Use tavily_search when you need up-to-date info.",
          tools=[tavily_search],
      )
      out = await Runner.run(agent, "Latest developments about quantum computing from 2025")
      print(out.final_output)


  asyncio.run(main())
  ```
</Accordion>

## Using Tavily with OpenAI Chat Completions API function calling

```python theme={null}
import os
import json
from tavily import TavilyClient
from openai import OpenAI

# Load your API keys from environment variables
tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
```

### Function definition

Define a function that OpenAI can call to perform searches:

```python theme={null}
def tavily_search(**kwargs):
    # Pass ALL supported kwargs straight to Tavily
    results = tavily_client.search(**kwargs)
    return results
```

```python theme={null}
# --- define tools ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "tavily_search",
            "description": "Search the web with Tavily for up-to-date information",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query"},
                    "max_results": {"type": "integer", "default": 5},
                },
                "required": ["query"],
            },
        },
    }
]
```

[Scroll to the bottom to find the full json schema for search, extract, map and crawl](#tavily-endpoints-schema-for-openai-responses-api-tool-definition)

```python theme={null}
# --- conversation ---
messages = [
    {"role": "system", "content": "You are a helpful assistant that uses Tavily search when needed."},
    {"role": "user", "content": "What are the top trends in 2025 about AI agents?"}
]
```

```python theme={null}
#Ask the model; let it decide whether to call the tool
response = openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    tools=tools,
)
```

```python theme={null}
assistant_msg = response.choices[0].message
 # keep the assistant msg that requested tool(s)
messages.append(assistant_msg) 
```

```python theme={null}

if getattr(assistant_msg, "tool_calls", None):
    for tc in assistant_msg.tool_calls:
        args = tc.function.arguments
        if isinstance(args, str):
            args = json.loads(args)
        elif not isinstance(args, dict):
            args = json.loads(str(args))

        if tc.function.name == "tavily_search":
            # forward ALL args
            results = tavily_search(**args)

            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "name": "tavily_search",
                "content": json.dumps(results),
            })
else:
    print("\nNo tool call requested by the model.")

```

```python theme={null}
# Ask the model again for the final grounded answer
final = openai_client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
)

final_msg = final.choices[0].message
print("\nFINAL ANSWER:\n", final_msg.content or "(no content)")
```

<Accordion title="Full Code Example">
  ```python theme={null}
  import os
  import json
  from tavily import TavilyClient
  from openai import OpenAI

  # --- setup ---
  tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
  openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

  def tavily_search(**kwargs):
      # Pass ALL supported kwargs straight to Tavily
      results = tavily_client.search(**kwargs)
      return results

  # --- define tools ---
  tools = [
      {
          "type": "function",
          "function": {
              "name": "tavily_search",
              "description": "Search the web with Tavily for up-to-date information",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "query": {"type": "string", "description": "The search query"},
                      "max_results": {"type": "integer", "default": 5},
                  },
                  "required": ["query"],
              },
          },
      }
  ]


  # --- conversation ---
  messages = [
      {"role": "system", "content": "You are a helpful assistant that uses Tavily search when needed."},
      {"role": "user", "content": "What are the top trends in 2025 about AI agents?"}
  ]


  #Ask the model; let it decide whether to call the tool
  response = openai_client.chat.completions.create(
      model="gpt-4o-mini",
      messages=messages,
      tools=tools,
  )

  assistant_msg = response.choices[0].message
  messages.append(assistant_msg)  # keep the assistant msg that requested tool(s)

  if getattr(assistant_msg, "tool_calls", None):
      for tc in assistant_msg.tool_calls:
          args = tc.function.arguments
          if isinstance(args, str):
              args = json.loads(args)
          elif not isinstance(args, dict):
              args = json.loads(str(args))

          if tc.function.name == "tavily_search":
              # forward ALL args
              results = tavily_search(**args)

              messages.append({
                  "role": "tool",
                  "tool_call_id": tc.id,
                  "name": "tavily_search",
                  "content": json.dumps(results),
              })
  else:
      print("\nNo tool call requested by the model.")

  # Ask the model again for the final grounded answer
  final = openai_client.chat.completions.create(
      model="gpt-4o-mini",
      messages=messages,
  )

  final_msg = final.choices[0].message
  print("\nFINAL ANSWER:\n", final_msg.content or "(no content)")
  ```
</Accordion>

## Using Tavily with OpenAI Responses API function calling

```python theme={null}
import os
import json
from tavily import TavilyClient
from openai import OpenAI

# --- setup ---
tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
```

### Function definition

Define a function that OpenAI can call to perform searches:

```python theme={null}
# --- Function that will be called when AI requests a search ---
def tavily_search(**kwargs):
    """
    Execute a Tavily web search with the given parameters.
    This function is called by the AI when it needs to search the web.
    """
    results = tavily_client.search(**kwargs)
    return results
```

```python theme={null}
# Define the tool for Tavily web search
# This tells the AI what function it can call and what parameters it needs
tools = [{
    "type": "function",
    "name": "tavily_search",
    "description": "Search the web using Tavily. Provide relevant links in your answer.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query for Tavily."
            },
            "max_results": {
                "type": "integer",
                "description": "Max number of results to return",
                "default": 5
            }
        },
        "required": ["query", "max_results"], 
        "additionalProperties": False
    },
    "strict": True
}]
```

[Scroll to the bottom to find the full json schema for search, extract, map and crawl](#tavily-endpoints-schema-for-openai-responses-api-tool-definition)

```python theme={null}
# --- Step 1: Create initial conversation ---
# This sets up the conversation context for the AI
input_list = [
    {"role": "system", "content": "You are a helpful assistant that uses Tavily search when needed."},
    {"role": "user", "content": "What are the top trends in 2025 about AI agents?"}
]

# --- Step 2: First API call - AI decides to search ---
# The AI will analyze the user's question and decide if it needs to search the web
response = openai_client.responses.create(
    model="gpt-4o-mini",
    tools=tools,
    input=input_list,
)

# --- Step 3: Process the AI's response ---
# Add the AI's response (including any function calls) to our conversation
input_list += response.output
```

```python theme={null}
# --- Step 4: Execute any function calls the AI made ---
for item in response.output:
    if item.type == "function_call":
        if item.name == "tavily_search":
            # Parse the arguments the AI provided for the search
            parsed_args = json.loads(item.arguments)
            
            # Execute the actual Tavily search
            results = tavily_search(**parsed_args)
            
            # Add the search results back to the conversation
            # This tells the AI what it found when it searched
            function_output = {
                "type": "function_call_output",
                "call_id": item.call_id,
                "output": json.dumps({
                  "results": results
                })
            }
            input_list.append(function_output)

```

```python theme={null}
# --- Step 5: Second API call - AI provides final answer ---
# Now the AI has the search results and can provide an informed response
response = openai_client.responses.create(
    model="gpt-4o-mini",
    instructions="Based on the Tavily search results provided, give me a comprehensive summary with citations.",
    input=input_list,
)

# --- Display the final result ---
print("AI Response:")
print(response.output_text)
```

<Accordion title="Full Code Example">
  ```python theme={null}
  import os
  import json
  from tavily import TavilyClient
  from openai import OpenAI

  # --- Setup: Initialize API clients ---
  tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
  openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

  # --- Function that will be called when AI requests a search ---
  def tavily_search(**kwargs):
      """
      Execute a Tavily web search with the given parameters.
      This function is called by the AI when it needs to search the web.
      """
      results = tavily_client.search(**kwargs)
      return results

  # --- Define the search tool for OpenAI to use ---
  # This tells the AI what function it can call and what parameters it needs
  tools = [{
      "type": "function",
      "name": "tavily_search",
      "description": "Search the web using Tavily. Provide relevant links in your answer.",
      "parameters": {
          "type": "object",
          "properties": {
              "query": {
                  "type": "string",
                  "description": "Search query for Tavily."
              },
              "max_results": {
                  "type": "integer",
                  "description": "Max number of results to return",
                  "default": 5
              }
          },
          "required": ["query", "max_results"], 
          "additionalProperties": False
      },
      "strict": True
  }]


  # --- Step 1: Create initial conversation ---
  # This sets up the conversation context for the AI
  input_list = [
      {"role": "system", "content": "You are a helpful assistant that uses Tavily search when needed."},
      {"role": "user", "content": "What are the top trends in 2025 about AI agents?"}
  ]

  # --- Step 2: First API call - AI decides to search ---
  # The AI will analyze the user's question and decide if it needs to search the web
  response = openai_client.responses.create(
      model="gpt-4o-mini",
      tools=tools,
      input=input_list,
  )

  # --- Step 3: Process the AI's response ---
  # Add the AI's response (including any function calls) to our conversation
  input_list += response.output

  # --- Step 4: Execute any function calls the AI made ---
  for item in response.output:
      if item.type == "function_call":
          if item.name == "tavily_search":
              # Parse the arguments the AI provided for the search
              parsed_args = json.loads(item.arguments)
              
              # Execute the actual Tavily search
              results = tavily_search(**parsed_args)
              
              # Add the search results back to the conversation
              # This tells the AI what it found when it searched
              function_output = {
                  "type": "function_call_output",
                  "call_id": item.call_id,
                  "output": json.dumps({
                    "results": results
                  })
              }
              input_list.append(function_output)

  # --- Step 5: Second API call - AI provides final answer ---
  # Now the AI has the search results and can provide an informed response
  response = openai_client.responses.create(
      model="gpt-4o-mini",
      instructions="Based on the Tavily search results provided, give me a comprehensive summary with citations.",
      input=input_list,
  )

  # --- Display the final result ---
  print("AI Response:")
  print(response.output_text)
  ```
</Accordion>

## Tavily endpoints schema for OpenAI Responses API tool definition

> **Note:** When using these schemas, you can customize which parameters are exposed to the model based on your specific use case. For example, if you are building a finance application, you might set `topic`: `"finance"` for all queries without exposing the `topic` parameter. This way, the LLM can focus on deciding other parameters, such as `time_range`, `country`, and so on, based on the user’s request. Feel free to modify these schemas as needed and only pass the parameters that are relevant to your application.

> **API Format:** The schemas below are for OpenAI Responses API. For Chat Completions API, wrap the parameters in a `"function"` object: `{"type": "function", "function": {"name": "...", "parameters": {...}}}`.

<Accordion title="search schema">
  ```python theme={null}
  tools = [
      {
          "type": "function",
          "name": "tavily_search",
          "description": "A powerful web search tool that provides comprehensive, real-time results using Tavily's AI search engine. Returns relevant web content with customizable parameters for result count, content type, and domain filtering. Ideal for gathering current information, news, and detailed web content analysis.",
          "parameters": {
              "type": "object",
              "additionalProperties": False,
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
          "type": "function",
          "name": "tavily_extract",
          "description": "A powerful web content extraction tool that retrieves and processes raw content from specified URLs, ideal for data collection, content analysis, and research tasks.",
          "parameters": {
              "type": "object",
              "additionalProperties": False,
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
          "type": "function",
          "name": "tavily_map",
          "description": "A powerful web mapping tool that creates a structured map of website URLs, allowing you to discover and analyze site structure, content organization, and navigation paths. Perfect for site audits, content discovery, and understanding website architecture.",
          "parameters": {
              "type": "object",
              "additionalProperties": False,
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
          "type": "function",
          "name": "tavily_crawl",
          "description": "A powerful web crawler that initiates a structured web crawl starting from a specified base URL. The crawler expands from that point like a tree, following internal links across pages. You can control how deep and wide it goes, and guide it to focus on specific sections of the site.",
          "parameters": {
              "type": "object",
              "additionalProperties": False,
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
                      "maximum": 5,
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

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CrewAI

> Integrate Tavily with CrewAI to build powerful AI agents that can search the web.

## Introduction

This guide shows you how to integrate Tavily with CrewAI to create sophisticated AI agents that can search the web and extract content. By combining CrewAI's multi-agent framework with Tavily's real-time web search capabilities, you can build AI systems that research, analyze, and process web information autonomously.

## Prerequisites

Before you begin, make sure you have:

* An OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
* A Tavily API key from [Tavily Dashboard](https://app.tavily.com/sign-in)

## Installation

Install the required packages:

> **Note:** The stable python versions to use with CrewAI are `Python >=3.10 and Python <3.13` .

```bash theme={null}
pip install 'crewai[tools]'
pip install pydantic
```

## Setup

Set up your API keys:

```python theme={null}
import os

# Set your API keys
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
os.environ["TAVILY_API_KEY"] = "your-tavily-api-key"
```

## Using Tavily Search with CrewAI

CrewAI provides built-in Tavily tools that make it easy to integrate web search capabilities into your AI agents. The `TavilySearchTool` allows your agents to search the web for real-time information.

```python theme={null}
import os
from crewai import Agent, Task, Crew
from crewai_tools import TavilySearchTool
```

```python theme={null}
# Initialize the Tavily search tool
tavily_tool = TavilySearchTool()
```

```python theme={null}
# Create an agent that uses the tool
researcher = Agent(
    role='News Researcher',
    goal='Find trending information about AI agents',
    backstory='An expert News researcher specializing in technology, focused on AI.',
    tools=[tavily_tool],
    verbose=True
)
```

```python theme={null}
# Create a task for the agent
research_task = Task(
    description='Search for the top 3 Agentic AI trends in 2025.',
    expected_output='A JSON report summarizing the top 3 AI trends found.',
    agent=researcher
)
```

```python theme={null}
# Form the crew and execute the task
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    verbose=True
)

result = crew.kickoff()
print(result)
```

### Customizing search tool parameters

**Example:**

```python theme={null}
from crewai_tools import TavilySearchTool

# You can configure the tool with specific parameters
tavily_search_tool = TavilySearchTool(
    search_depth="advanced",
    max_results=10,
    include_answer=True
)
```

You can customize the search tool by passing parameters to configure its behavior.Below are available parameters in crewai integration:

**Available Parameters:**

* `query` (str): Required. The search query string.
* `search_depth` (Literal\["basic", "advanced"], optional): The depth of the search. Defaults to "basic".
* `topic` (Literal\["general", "news", "finance"], optional): The topic to focus the search on. Defaults to "general".
* `time_range` (Literal\["day", "week", "month", "year"], optional): The time range for the search. Defaults to None.
* `max_results` (int, optional): The maximum number of search results to return. Defaults to 5.
* `include_domains` (Sequence\[str], optional): A list of domains to prioritize in the search. Defaults to None.
* `exclude_domains` (Sequence\[str], optional): A list of domains to exclude from the search. Defaults to None.
* `include_answer` (Union\[bool, Literal\["basic", "advanced"]], optional): Whether to include a direct answer synthesized from the search results. Defaults to False.
* `include_raw_content` (bool, optional): Whether to include the raw HTML content of the searched pages. Defaults to False.
* `include_images` (bool, optional): Whether to include image results. Defaults to False.
* `timeout` (int, optional): The request timeout in seconds. Defaults to 60.

> **Explore More Parameters**: For a complete list of available parameters and their descriptions, visit our [API documentation](/documentation/api-reference/endpoint/search) to discover all the customization options available for search operations.

<Accordion title="Full Code Example - Search">
  ```python theme={null}
  import os
  from crewai import Agent, Task, Crew
  from crewai_tools import TavilySearchTool

  # Set up environment variables
  os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
  os.environ["TAVILY_API_KEY"] = "your-tavily-api-key"

  # Initialize the tool
  tavily_tool = TavilySearchTool()

  # Create an agent that uses the tool
  researcher = Agent(
      role='News Researcher',
      goal='Find trending information about AI agents',
      backstory='An expert News researcher specializing in technology, focused on AI.',
      tools=[tavily_tool],
      verbose=True
  )

  # Create a task for the agent
  research_task = Task(
      description='Search for the top 3 Agentic AI trends in 2025.',
      expected_output='A JSON report summarizing the top 3 AI trends found.',
      agent=researcher
  )

  # Form the crew and kick it off
  crew = Crew(
      agents=[researcher],
      tasks=[research_task],
      verbose=True
  )

  result = crew.kickoff()
  print(result)

  ```
</Accordion>

## Using Tavily Extract with CrewAI

The `TavilyExtractorTool` allows your CrewAI agents to extract and process content from specific web pages. This is particularly useful for content analysis, data collection, and research tasks.

```python theme={null}
import os
from crewai import Agent, Task, Crew
from crewai_tools import TavilyExtractorTool
```

```python theme={null}
# Initialize the Tavily extractor tool
tavily_tool = TavilyExtractorTool()
```

```python theme={null}
# Create an agent that uses the tool
extractor_agent = Agent(
    role='Web Page Content Extractor',
    goal='Extract key information from the given web pages',
    backstory='You are an expert at extracting relevant content from websites using the Tavily Extract.',
    tools=[tavily_tool],
    verbose=True
)
```

```python theme={null}
# Define a task for the agent
extract_task = Task(
    description='Extract the main content from the URL https://en.wikipedia.org/wiki/Lionel_Messi .',
    expected_output='A JSON string containing the extracted content from the URL.',
    agent=extractor_agent
)
```

```python theme={null}
# Create and run the crew
crew = Crew(
    agents=[extractor_agent],
    tasks=[extract_task],
    verbose=False
)

result = crew.kickoff()
print(result)
```

### Customizing extract tool parameters

**Example:**

```python theme={null}
from crewai_tools import TavilyExtractorTool

# You can configure the tool with specific parameters
tavily_extract_tool = TavilyExtractorTool(
    extract_depth="advanced",
    include_images=True,
    timeout=45
)
```

You can customize the extract tool by passing parameters to configure its behavior. Below are available parameters in crewai integration:

**Available Parameters:**

* `urls` (Union\[List\[str], str]): Required. A single URL string or a list of URL strings to extract data from.
* `include_images` (Optional\[bool]): Whether to include images in the extraction results. Defaults to False.
* `extract_depth` (Literal\["basic", "advanced"]): The depth of extraction. Use "basic" for faster, surface-level extraction or "advanced" for more comprehensive extraction. Defaults to "basic".
* `timeout` (int): The maximum time in seconds to wait for the extraction request to complete. Defaults to 60.

> **Explore More Parameters**: For a complete list of available parameters and their descriptions, visit our [API documentation](/documentation/api-reference/endpoint/extract) to discover all the customization options available for extract operations.

<Accordion title="Full Code Example - Extract">
  ```python theme={null}
  import os
  from crewai import Agent, Task, Crew
  from crewai_tools import TavilyExtractorTool

  # Set up environment variables
  os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
  os.environ["TAVILY_API_KEY"] = "your-tavily-api-key"

  # Initialize the Tavily extractor tool
  tavily_tool = TavilyExtractorTool()

  # Create an agent that uses the tool
  extractor_agent = Agent(
      role='Web Page Content Extractor',
      goal='Extract key information from the given web pages',
      backstory='You are an expert at extracting relevant content from websites using the Tavily Extract.',
      tools=[tavily_tool],
      verbose=True
  )

  # Define a task for the agent
  extract_task = Task(
      description='Extract the main content from the URL https://en.wikipedia.org/wiki/Lionel_Messi .',
      expected_output='A JSON string containing the extracted content from the URL.',
      agent=extractor_agent
  )

  # Create and execute the crew
  crew = Crew(
      agents=[extractor_agent],
      tasks=[extract_task],
      verbose=True
  )

  # Run the extraction
  result = crew.kickoff()
  print("Extraction Results:")
  print(result)
  ```
</Accordion>

## Using Tavily Research with CrewAI

The `TavilyResearchTool` lets your CrewAI agents kick off Tavily research tasks, returning a synthesized, cited report (or a stream of progress events) instead of raw search results. Use it when an agent needs an investigative answer rather than a single web search.

> **Note:** Using the `TavilyResearchTool` requires the `tavily-python` library in addition to `crewai-tools`. Install it alongside CrewAI tools:
>
> ```bash theme={null}
> uv add 'crewai[tools]' tavily-python
> ```

```python theme={null}
import os
from crewai import Agent, Task, Crew
from crewai_tools import TavilyResearchTool
```

```python theme={null}
# Initialize the Tavily research tool
tavily_tool = TavilyResearchTool()
```

```python theme={null}
# Create an agent that uses the tool
researcher = Agent(
    role="Research Analyst",
    goal="Investigate questions and produce concise, well-cited briefings.",
    backstory=(
        "You are a meticulous analyst who delegates web research to the Tavily "
        "Research tool, then synthesizes the findings into short briefings."
    ),
    tools=[tavily_tool],
    verbose=True,
)
```

```python theme={null}
# Create a task for the agent
research_task = Task(
    description=(
        "Investigate notable open-source agent orchestration frameworks released "
        "in the last six months and summarize their differentiators."
    ),
    expected_output="A bulleted briefing with citations.",
    agent=researcher,
)
```

```python theme={null}
# Form the crew and execute the task
crew = Crew(agents=[researcher], tasks=[research_task])
print(crew.kickoff())
```

### Customizing research tool parameters

**Example:**

```python theme={null}
from crewai_tools import TavilyResearchTool

# You can configure the tool with specific defaults for every call
tavily_research_tool = TavilyResearchTool(
    model="pro",                # use Tavily's most capable research model
    citation_format="apa",      # APA-style citations
)
```

You can customize the research tool by passing parameters to configure its behavior. Defaults set on the tool instance apply to every call, and any parameter can also be overridden per-call via the agent's tool input. Below are available parameters in the crewai integration:

**Available Parameters:**

* `input` (str): Required. The research task or question to investigate.
* `model` (Literal\["mini", "pro", "auto"], optional): The Tavily research model. `"auto"` lets Tavily pick; `"mini"` is faster and cheaper; `"pro"` is the most capable. Defaults to `"auto"`.
* `output_schema` (dict, optional): Optional JSON Schema that structures the research output. Useful when you want strictly typed results. Defaults to None.
* `stream` (bool, optional): When `True`, the tool returns an iterator of SSE chunks emitting research progress and the final result instead of a single string. Defaults to False.
* `citation_format` (Literal\["numbered", "mla", "apa", "chicago"], optional): Citation format for the report. Defaults to `"numbered"`.

#### Stream research progress

When `stream=True`, the tool returns a generator (or async generator from `_arun`) of SSE chunks so your application can surface incremental progress:

```python theme={null}
tavily_tool = TavilyResearchTool(stream=True)

for chunk in tavily_tool.run(input="Summarize recent advances in retrieval-augmented generation."):
    print(chunk)
```

#### Structured output via JSON Schema

Pass an `output_schema` when you need a typed result instead of a free-form report:

```python theme={null}
output_schema = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "key_points": {"type": "array", "items": {"type": "string"}},
        "sources": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["summary", "key_points", "sources"],
}

tavily_tool = TavilyResearchTool(output_schema=output_schema)
```

> **Explore More Parameters**: For a complete list of available parameters and their descriptions, visit our [API documentation](/documentation/api-reference/endpoint/research) to discover all the customization options available for research operations.

<Accordion title="Full Code Example - Research">
  ```python theme={null}
  import os
  from crewai import Agent, Task, Crew
  from crewai_tools import TavilyResearchTool

  # Set up environment variables
  os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
  os.environ["TAVILY_API_KEY"] = "your-tavily-api-key"

  # Initialize the Tavily research tool
  tavily_tool = TavilyResearchTool()

  # Create an agent that uses the tool
  researcher = Agent(
      role="Research Analyst",
      goal="Investigate questions and produce concise, well-cited briefings.",
      backstory=(
          "You are a meticulous analyst who delegates web research to the Tavily "
          "Research tool, then synthesizes the findings into short briefings."
      ),
      tools=[tavily_tool],
      verbose=True,
  )

  # Create a task for the agent
  research_task = Task(
      description=(
          "Investigate notable open-source agent orchestration frameworks released "
          "in the last six months and summarize their differentiators."
      ),
      expected_output="A bulleted briefing with citations.",
      agent=researcher,
  )

  # Form the crew and execute the task
  crew = Crew(
      agents=[researcher],
      tasks=[research_task],
      verbose=True,
  )

  result = crew.kickoff()
  print("Research Results:")
  print(result)
  ```
</Accordion>

For more information about Tavily's capabilities, check out our [API documentation](/documentation/api-reference/introduction) and [best practices](/documentation/best-practices/best-practices-search).

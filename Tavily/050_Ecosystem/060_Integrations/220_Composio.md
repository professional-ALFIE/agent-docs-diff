> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Composio

> Tavily is now available for integration through Composio.

## Introduction

Integrate Tavily with Composio to enhance your AI workflows with powerful web search capabilities. Composio provides a platform to connect your AI agents to external tools like Tavily, making it easy to incorporate real-time web search and data extraction into your applications.

## Step-by-Step Integration Guide

### Step 1: Install Required Packages

Install the necessary Python packages:

```bash theme={null}
pip install composio composio-openai openai python-dotenv
```

### Step 2: Set Up API Keys

* **OpenAI API Key:** [Get your OpenAI API key here](https://platform.openai.com/account/api-keys)
* **Composio API Key:** [Get your Composio API key here](https://app.composio.dev/dashboard)

Set these as environment variables in your terminal or add them to your environment configuration file:

```bash theme={null}
export OPENAI_API_KEY=your_openai_api_key
export COMPOSIO_API_KEY=your_composio_api_key
```

### Step 3: Connect Tavily to Composio

```python theme={null}
from composio import Composio
from dotenv import load_dotenv

load_dotenv()

composio = Composio()

# Use composio managed auth
auth_config = composio.auth_configs.create(
    toolkit="tavily",
    options={
        "type": "use_custom_auth",
        "auth_scheme": "API_KEY",
        "credentials": {}
    }
)
print(auth_config)
auth_config_id = auth_config.id

user_id = "your-user-id"
connection_request = composio.connected_accounts.link(user_id, auth_config_id)
print(connection_request.redirect_url)
```

### Step 4: Example Use Case

```python theme={null}
from composio import Composio
from composio_openai import OpenAIProvider
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
# Initialize OpenAI client with API key
client = OpenAI()

# Initialize Composio toolset
composio = Composio(
    api_key=os.getenv("COMPOSIO_API_KEY"),
    provider=OpenAIProvider()
)

user_id = "your-user-id"

# Get the Tavily tool with all available parameters
tools = composio.tools.get(user_id,
    toolkits=['TAVILY']
)

# Define the market research task with specific parameters
task = {
    "query": "Analyze the competitive landscape of AI-powered customer service solutions in 2024",
    "search_depth": "advanced",  
    "include_answer": True,      
    "max_results": 10,  
    # Focus on relevant industry sources         
    "include_domains": [        
        "techcrunch.com",
        "venturebeat.com",
        "forbes.com",
        "gartner.com",
        "marketsandmarkets.com"
    ],
}

# Send request to LLM
messages = [{"role": "user", "content": str(task)}]

response = client.chat.completions.create(
    model="gpt-4.1",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# Handle tool call via Composio
execution_result = None
response_message = response.choices[0].message

if response_message.tool_calls:
    execution_result = composio.provider.handle_tool_calls(user_id,response)
    print("Execution Result:", execution_result)
    messages.append(response_message)
    
    # Add tool response messages
    for tool_call, result in zip(response_message.tool_calls, execution_result):
        messages.append({
            "role": "tool",
            "content": str(result["data"]),
            "tool_call_id": tool_call.id
        })
    
    # Get final response from LLM
    final_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=messages
    )
    print("\nMarket Research Summary:")
    print(final_response.choices[0].message.content)
else:
    print("LLM responded directly (no tool used):", response_message.content)
```

## Additional Use Cases

1. **Research Automation**: Automate the collection and summarization of research data
2. **Content Curation**: Gather and organize information from multiple sources
3. **Real-time Data Integration**: Keeping your AI models up-to-date with the latest information.

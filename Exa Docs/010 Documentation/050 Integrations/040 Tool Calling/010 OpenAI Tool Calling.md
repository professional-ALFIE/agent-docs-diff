> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAI Tool Calling

> Use OpenAI tool calling to add Exa web search to your application.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

<Info>
  OpenAI recommends using the Responses API for all new projects. [See the guide](/docs/reference/openai-responses-api-with-exa).
</Info>

OpenAI's [tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python) allows models to call functions that you define in your code. Use tool calling to invoke Exa search:

1. Install prerequisite packages and set up the environment
2. Use Exa within an OpenAI tool call

***

## Get started

<Steps>
  <Step title="Prerequisites and installation">
    Install the:

    * `openai` library to perform OpenAI API calls and completions
    * `exa_py` library to perform Exa search
    * `rich` library to make the output more readable

    ```python Python theme={null}
    pip install openai exa_py rich
    ```
  </Step>

  <Step title="Set up the environment variables">
    Create an `.env` file in the root of your project and set the `EXA_API_KEY` and `OPENAI_API_KEY` environment variable to your API keys respectively. Visit the [OpenAI playground](https://platform.openai.com/api-keys) and the [Exa dashboard](https://dashboard.exa.ai/api-keys) to generate your API keys.

    <br />

    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

    ```Shell Shell theme={null}
    OPENAI_API_KEY=insert your OpenAI API key here, without quotes
    EXA_API_KEY=insert your Exa API key here, without quotes
    ```
  </Step>

  <Step title="Use Exa search as an OpenAI tool">
    First, we import and initialise the OpenAI and Exa libraries and load the stored API keys.

    ```python Python theme={null}
    from dotenv import load_dotenv
    from exa_py import Exa
    from openai import OpenAI

    load_dotenv()

    openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    exa = Exa(api_key=os.getenv("EXA_API_KEY"))
    ```

    Next, we define the function and the function schema so that OpenAI knows how to use it and what arguments our local function takes:

    ```python Python theme={null}
    TOOLS = [
        {
            "type": "function",
            "function": {
                "name": "exa_search",
                "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to perform.",
                        },
                    },
                    "required": ["query"],
                },
            },
        }
    ]
    ```

    Finally, we'll define the primer `SYSTEM_MESSAGE`, which explains to OpenAI what it is supposed to do:

    ```python Python theme={null}
    SYSTEM_MESSAGE = {
        "role": "system",
        "content": "You are an agent that has access to an advanced search engine. Please provide the user with the information they are looking for by using the search tool provided.",
    }
    ```

    We can now start writing the code needed to perform the LLM calls and the search. We'll create the `exa_search` function that will call Exa's `search` function with the query:

    ```python Python theme={null}
    def exa_search(query: str) -> Dict[str, Any]:
        return exa.search(query=query, type='auto', contents={'highlights': True})
    ```

    Next, we create a function to process the tool calls:

    ```python Python theme={null}
    def process_tool_calls(tool_calls, messages):
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            if function_name == "exa_search":
                search_results = exa_search(**function_args)
                messages.append(
                    {
                        "role": "tool",
                        "content": str(search_results),
                        "tool_call_id": tool_call.id,
                    }
                )
                console.print(
                    f"[bold cyan]Context updated[/bold cyan] [i]with[/i] "
                    f"[bold green]exa_search ({function_args.get('mode')})[/bold green]: ",
                    function_args.get("query"),
                )
        return messages
    ```

    Lastly, we'll create a `main` function to bring it all together, and handle the user input and interaction with OpenAI:

    ```python Python theme={null}
    def main():
        messages = [SYSTEM_MESSAGE]
        while True:
            try:
                user_query = Prompt.ask(
                    "[bold yellow]What do you want to search for?[/bold yellow]",
                )
                messages.append({"role": "user", "content": user_query})
                completion = openai.chat.completions.create(
                    model="gpt-5.4",
                    messages=messages,
                    tools=TOOLS,
                )
                message = completion.choices[0].message
                tool_calls = message.tool_calls
                if tool_calls:
                    messages.append(message)
                    messages = process_tool_calls(tool_calls, messages)
                    messages.append(
                        {
                            "role": "user",
                            "content": "Answer my previous query based on the search results.",
                        }
                    )
                    completion = openai.chat.completions.create(
                        model="gpt-5.4",
                        messages=messages,
                    )
                    console.print(Markdown(completion.choices[0].message.content))
                else:
                    console.print(Markdown(message.content))
            except Exception as e:
                console.print(f"[bold red]An error occurred:[/bold red] {str(e)}")
    if __name__ == "__main__":
        main()
    ```

    The implementation creates a loop that continually prompts the user for search queries, uses OpenAI's tool calling feature to determine when to perform a search, and then uses the Exa search results to provide an informed response to the user's query.

    We also use the rich library to provide a more visually appealing console interface, including coloured output and markdown rendering for the responses.
  </Step>

  <Step title="Running the code">
    Save the code in a file, e.g. `openai_search.py`, and make sure the `.env` file containing the API keys we previously created is in the same directory as the script.

    Then run the script using the following command from your terminal:

    ```bash Bash theme={null}
    python openai_search.py
    ```

    You should see a prompt:

    ```bash Bash theme={null}
    What do you want to search for?
    ```

    Let's test it out.

    ```bash Bash theme={null}
    What do you want to search for?: Who is Tony Stark?
    Context updated with exa_search (None):  Tony Stark
    Tony Stark, also known as Iron Man, is a fictional superhero from Marvel Comics. He is a wealthy inventor and businessman, known for creating a powered suit of armor that gives him superhuman abilities. Tony Stark is a founding member of the Avengers and has appeared in various comic book series, animated
    television shows, and films within the Marvel Cinematic Universe.

    If you're interested in more detailed information, you can visit Tony Stark (Marvel Cinematic Universe) - Wikipedia.
    ```

    That's it, enjoy your search agent!
  </Step>
</Steps>

## Full code

```python Python theme={null}
import json
import os

from dotenv import load_dotenv
from typing import Any, Dict
from exa_py import Exa
from openai import OpenAI
from rich.console import Console
from rich.markdown import Markdown
from rich.prompt import Prompt

# Load environment variables from .env file
load_dotenv()

# create the openai client
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# create the exa client
exa = Exa(api_key=os.getenv("EXA_API_KEY"))

# create the rich console
console = Console()

# define the system message (primer) of your agent
SYSTEM_MESSAGE = {
    "role": "system",
    "content": "You are the world's most advanced search engine. Please provide the user with the information they are looking for by using the tools provided.",
}

# define the tools available to the agent - we're defining a single tool, exa_search
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the world's most relevant information.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

# define the function that will be called when the tool is used and perform the search
# and the retrieval of the result highlights.
# See /reference/python-sdk-specification#search-method for the search method reference.
def exa_search(query: str) -> Dict[str, Any]:
    return exa.search(query=query, type='auto', contents={'highlights': True})

# define the function that will process the tool call and perform the exa search
def process_tool_calls(tool_calls, messages):
    
    for tool_call in tool_calls:
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)
        
        if function_name == "exa_search":
            search_results = exa_search(**function_args)
            messages.append(
                {
                    "role": "tool",
                    "content": str(search_results),
                    "tool_call_id": tool_call.id,
                }
            )
            console.print(
                f"[bold cyan]Context updated[/bold cyan] [i]with[/i] "
                f"[bold green]exa_search ({function_args.get('mode')})[/bold green]: ",
                function_args.get("query"),
            )
            
    return messages

def main():
    messages = [SYSTEM_MESSAGE]
    
    while True:
        try:
            # create the user input prompt using rich
            user_query = Prompt.ask(
                "[bold yellow]What do you want to search for?[/bold yellow]",
            )
            messages.append({"role": "user", "content": user_query})
            
            # call openai llm by creating a completion which calls the defined exa tool
            completion = openai.chat.completions.create(
                model="gpt-5.4",
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
            )
            
            # completion will contain the object needed to invoke your tool and perform the search
            message = completion.choices[0].message
            tool_calls = message.tool_calls
            
            if tool_calls:

                messages.append(message)

                # process the tool object created by OpenAI llm and store the search results
                messages = process_tool_calls(tool_calls, messages)
                messages.append(
                    {
                        "role": "user",
                        "content": "Answer my previous query based on the search results.",
                    }
                )
                
                # call OpenAI llm again to process the search results and yield the final answer
                completion = openai.chat.completions.create(
                    model="gpt-5.4",
                    messages=messages,
                )
                
                # parse the agents final answer and print it
                console.print(Markdown(completion.choices[0].message.content))
            else:
                console.print(Markdown(message.content))
        except Exception as e:
            console.print(f"[bold red]An error occurred:[/bold red] {str(e)}")
            
            
if __name__ == "__main__":
    main()
```

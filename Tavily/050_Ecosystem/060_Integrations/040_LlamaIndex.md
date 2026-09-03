> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# LlamaIndex

> Search the web from LlamaIndex with Tavily.

<Note>
  This tool has a more extensive example use case documented in a Jupyter notebook [here](https://github.com/run-llama/llama_index/blob/main/llama-index-integrations/tools/llama-index-tools-tavily-research/examples/tavily.ipynb).
</Note>

## Install Tavily and LlamaIndex

The following dependencies are required to properly run the integration:

```bash theme={null}
pip install llama-index-tools-tavily-research llama-index llama-hub tavily-python
```

## Usage

You can use access Tavily in LlamaIndex through the `TavilyToolSpec`.

Here is a simple use case that performs a web search with Tavily and generates an answer to the user's search query:

```python theme={null}
from llama_index.tools.tavily_research.base import TavilyToolSpec
from llama_index.agent.openai import OpenAIAgent

tavily_tool = TavilyToolSpec(
    api_key='tvly-YOUR_API_KEY',
)
agent = OpenAIAgent.from_tools(tavily_tool.to_tool_list())

agent.chat('What happened in the latest Burning Man festival?')
```

`search`: Search for relevant dynamic data based on a query. Returns a list of urls and their relevant content.

This loader is designed to be used as a way to load data as a Tool in an Agent. See [here](https://github.com/emptycrown/llama-hub/tree/main) for examples.

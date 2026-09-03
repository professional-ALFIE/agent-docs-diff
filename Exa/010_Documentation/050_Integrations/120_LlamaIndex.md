> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# LlamaIndex

> A quick-start guide on how to add Exa retrieval to a LlamaIndex Agent Application.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

LlamaIndex is a framework for building LLM applications powered by structured data. In this guide, we'll use Exa's LlamaIndex integration to:

1. Specify Exa's Search and Retrieve Highlight Tool as a LlamaIndex retriever
2. Set up an OpenAI Agent that uses this tool in its response generation

***

## Get started

<Steps>
  <Step title="Prerequisites and installation">
    Install the llama-index, llama-index core, llama-index-tools-exa libraries. OpenAI dependencies are within the core library, so we don't need to specify that.

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    Also ensure API keys are initialized properly. The following code uses the `EXA_API_KEY` as the relevant environment variable name.

    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />
  </Step>

  <Step title="Instantiate Exa tool">
    Import the relevant Exa integration library and instantiate LlamaIndex's `ExaToolSpec`.

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="Choose the Exa method to use">
    For this example, we are only interested in passing the [search\_and\_retrieve\_highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/) method to our agent, so we specify this using the `.to_tool_list` LlamaIndex method. We also pass `current_date`, a simple utility so our agent knows the current date.

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="Set up an OpenAI agent and make Exa-powered requests">
    Set up the [OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/), passing the filtered down toolset from above.

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    We can then use the chat method to interact with the agent.

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    The agent calls the Exa tools it was given, then answers from the results. The exact output varies with the query and the publication dates of the pages Exa returns.
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Read the Search API guide" icon="search" href="/docs/reference/search-api-guide">
    Review Exa search parameters and response fields.
  </Card>

  <Card title="Read the LlamaIndex tool reference" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/">
    Explore LlamaIndex tools and agent configuration.
  </Card>
</Columns>

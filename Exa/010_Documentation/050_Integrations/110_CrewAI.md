> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# CrewAI

> Learn how to add Exa retrieval capabilities to your CrewAI agents.

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

[CrewAI](https://crewai.com/) is a framework for orchestrating AI agents that work together to accomplish complex tasks.
In this guide, we'll create a crew of two agents that generate a newsletter based on Exa's search results. We'll go over how to:

1. Create a custom Exa-powered CrewAI tool
2. Set up agents and assign them specific roles that use the Exa-powered search tool
3. Organize the agents into a crew that will write a newsletter

<Note>
  CrewAI also ships a built-in [`ExaSearchTool`](https://docs.crewai.com/en/tools/search-research/exasearchtool) you can drop in without writing a custom wrapper. The custom tool below is useful if you want full control over how results are formatted; either approach works.
</Note>

***

## Get started

<Steps>
  <Step title="Prerequisites and installation">
    Install the crewAI core, crewAI tools and Exa Python SDK libraries.

    ```Python Python theme={null}
    pip install crewai 'crewai[tools]' exa_py
    ```
  </Step>

  <Step title="Defining a custom Exa-based tool in crewAI">
    We set up a [custom tool](https://docs.crewai.com/concepts/tools) using the crewAI [@tool decorator ](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator). Within the tool, we can initialize the Exa class from the [Exa Python SDK](https://github.com/exa-labs/exa-py), make a request, and return a parsed out result.

    ```Python Python theme={null}
    from crewai_tools import tool
    from exa_py import Exa
    import os

    exa_api_key = os.getenv("EXA_API_KEY")

    @tool("Exa search and get contents")
    def search_and_get_contents_tool(question: str) -> str:
        """Tool using Exa's Python SDK to run semantic search and return result highlights."""

        exa = Exa(api_key=exa_api_key)

        response = exa.search(
            question,
            type="auto",
            num_results=10,
            contents={"highlights": True}
        )

        parsedResult = ''.join([
          f'<Title id={idx}>{eachResult.title}</Title>'
          f'<URL id={idx}>{eachResult.url}</URL>'
          f'<Highlight id={idx}>{"".join(eachResult.highlights)}</Highlight>'
          for (idx, eachResult) in enumerate(response.results)
        ])

        return parsedResult
    ```

    <Note> Make sure your API keys are initialized properly. For this demonstration, the environment variable names are `OPENAI_API_KEY` and `EXA_API_KEY` for OpenAI and Exa keys respectively. </Note>

    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />
  </Step>

  <Step title="Setting up a crewAI agent">
    Import the relevant crewAI modules. Then, define `exa_tools` to reference the custom search method we defined above.

    ```Python Python theme={null}
    from crewai import Task, Crew, Agent

    exa_tools = search_and_get_contents_tool
    ```

    We then set up[ two agents](https://docs.crewai.com/concepts/Agents/) and place them in a [crew together](https://docs.crewai.com/concepts/Crews/):

    * One to research with Exa (providing the custom tool defined above)
    * Another to write a newsletter as an output (using an LLM)

    ```Python Python theme={null}
    # Creating a senior researcher agent with memory and verbose mode
    researcher = Agent(
      role='Researcher',
      goal='Get the latest research on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by curiosity, you're at the forefront of"
        "innovation, eager to explore and share knowledge that could change"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )

    article_writer = Agent(
      role='Writer',
      goal='Write a great newsletter article on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by a love of writing and passion for"
        "innovation, you are eager to share knowledge with"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )
    ```
  </Step>

  <Step title="Defining tasks for the agents">
    Next, we'll define [tasks](https://docs.crewai.com/concepts/Tasks/) for each agent and create the crew overall using all of the components we've set up above.

    ```Python Python theme={null}
    research_task = Task(
      description=(
        "Identify the latest research in {topic}."
        "Your final report should clearly articulate the key points,"
      ),
      expected_output='A comprehensive 3 paragraphs long report on the {topic}.',
      tools=[exa_tools],
      agent=researcher,
    )

    write_article = Task(
      description=(
        "Write a newsletter article on the latest research in {topic}."
        "Your article should be engaging, informative, and accurate."
        "The article should address the audience with a greeting to the newsletter audience \"Hi readers!\", plus a similar signoff"
      ),
      expected_output='A comprehensive 3 paragraphs long newsletter article on the {topic}.',
      agent=article_writer,
    )

    crew = Crew(
      agents=[researcher, article_writer],
      tasks=[research_task, write_article],
      memory=True,
      cache=True,
      max_rpm=100,
      share_crew=True
    )
    ```
  </Step>

  <Step title="Kicking off the crew">
    Finally, we kick off the crew by providing a research topic as our input query.

    ```Python Python theme={null}
    response = crew.kickoff(inputs={'topic': 'Latest AI research'})

    print(response)
    ```

    The crew writes the newsletter from the content the Exa search tool returned.
  </Step>
</Steps>

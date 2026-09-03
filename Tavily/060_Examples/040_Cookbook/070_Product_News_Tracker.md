> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Product News Tracker

> Stay informed with real-time product news using Tavily's APIs.

## What will you learn?

In this use case, you'll discover how to gather a company's product news and updates using Tavily's Search API. This tutorial outlines how to get started with the Tavily Python SDK, how to properly configure search parameters for optimal results, and how to effectively interact with Tavily’s Search API to retrieve the latest product updates for a specified company.

## How does it work?

### Self-Reported News

Our system gathers official updates including **blog posts**, **product announcements**, and **company news** by utilizing the `include_domain` parameter. This allows us to focus specifically on content from:

* A company's official website

This domain-filtered approach ensures efficient credit usage while maintaining search accuracy.

### Third-Party Coverage

To capture external perspectives, we employ specialized news search parameters:

* Set `topic = news` to focus on reputable news sources
* Utilize `time_range = month` for current coverage

<Tip>
  For the functionality discussed in this tutorial, `search_depth = basic` will
  be sufficient to achieve the intended results.
</Tip>

## Getting Started

> We have prepared a [Jupyter Notebook](https://github.com/tavily-ai/tavily-cookbook/blob/main/cookbooks/search/product_news_tracker.ipynb) outlining the contents of this tutorial

First create an account and get your free API key.

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

Next, use the Tavily Python SDK to create the workflow.

<Steps>
  <Step title="Install the Tavily Python SDK">
    ```bash Shell theme={null}
    uv venv
    uv pip install tavily-python python-dotenv ipykernel
    ```
  </Step>

  <Step title="Import the necessary libraries">
    ```python Python theme={null}
    import getpass
    import os

    if not os.environ.get("TAVILY_API_KEY"):
        os.environ["TAVILY_API_KEY"] = getpass.getpass("TAVILY_API_KEY:\n")

    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    ```
  </Step>

  <Step title="Instantiate the Tavily Client">
    ```python Python theme={null}
    from tavily import TavilyClient

    tavily_client = TavilyClient()
    ```
  </Step>

  <Step title="Define the search parameters">
    ```python Python theme={null}
    def search_product_updates(company_name: str, domains: list):
        all_results = []

        # Search for self-reported news
        company_results = tavily_client.search(
            query=f"{company_name} product news, updates, releases, and announcements",
            search_depth="basic",
            max_results=10,
            include_domains=domains
        )

        for result in company_results["results"]:
            result["search_type"] = "Self-reported News"
            all_results.append(result)


        # Search for third-party coverage
        news_results = tavily_client.search(
            query=f"{company_name} product news, updates, releases, and announcements",
            search_depth="basic",
            max_results=10,
            time_range="month",
            topic="news"
        )

        for result in news_results["results"]:
            result["search_type"] = "Third-party Coverage"
            all_results.append(result)

        return all_results
    ```
  </Step>

  <Step title="Execute the search">
    ```python Python theme={null}
        product_updates = search_product_updates(
            "OpenAI", ["openai.com"]
        )

        print(product_updates)
    ```
  </Step>

  <Step title="Output">
    ```json Shell theme={null}
     [
         {
             "title": "OpenAI launches new tools to help businesses build AI agents - TechCrunch",
             "url": "https://techcrunch.com/2025/03/11/openai-launches-new-tools-to-help-businesses-build-ai-agents/",
             "score": 0.70847535,
             "published_date": "Tue, 11 Mar 2025 17:00:00 GMT",
             "content": "OpenAI launches new tools to help businesses build AI agents | TechCrunch OpenAI launches new tools to help businesses build AI agents | TechCrunch On Tuesday, OpenAI released new tools designed to help developers and enterprises build AI agents – automated systems that can independently accomplish tasks – using the company’s own AI models and frameworks. The tools are part of OpenAI’s new Responses API, which lets businesses develop custom AI agents that can perform web searches, scan through company files, and navigate websites, much like OpenAI’s Operator product. Using the Responses API, developers can tap the same AI models (in preview) under the hood of OpenAI’s ChatGPT Search web search tool: GPT-4o search and GPT-4o mini search.",
             "search_type": "Third-party Coverage"
         },
         {
             "title": "New embedding models and API updates - Announcements - OpenAI Developer ...",
             "url": "https://community.openai.com/t/new-embedding-models-and-api-updates/610540",
             "score": 0.752468,
             "content": "We are releasing new models, reducing prices for GPT-3.5 Turbo, and introducing new ways for developers to manage API keys and understand API usage. The new models include: Two new embedding models An updated GPT-4 Turbo preview model An updated GPT-3.5 Turbo model An updated text moderation model By default, data sent to the OpenAI API will not be used to train or improve OpenAI models. All",
             "search_type": "Self-reported News"
         },
         ...
     ]
    ```
  </Step>
</Steps>

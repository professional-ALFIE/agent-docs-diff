> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# StackAI

> Using Tavily in StackAI to enhance your AI workflows with real-time web data.

## Introduction

Integrate [Tavily with StackAI](https://www.stack-ai.com/integrations/tavily) to enhance your AI workflows with real-time web data. With this integration, you can easily fetch and utilize live web content in your StackAI workflows.

<Frame>
  <img src="https://mintcdn.com/tavilyai/Y-5Alnz1le_K5S9f/images/stack_ai.gif?s=4caccb1ee81f9020296ce70cbbbd600c" alt="stackai" width="1280" height="712" data-path="images/stack_ai.gif" />
</Frame>

## How to set up Tavily with StackAI

<AccordionGroup>
  <Accordion title="Step 1: Log in to StackAI">
    [Log in](https://stack-ai.com/) to your StackAI account or self-hosted instance.
  </Accordion>

  <Accordion title="Step 2: Create a New Workflow">
    Create a new workflow or choose one of the available templates.
  </Accordion>

  <Accordion title="Step 3: Add Tavily to Your Workflow">
    **Option 1: Add Tavily as a Node**

    * Search for "Tavily" under the **Apps** section in the left sidebar.
    * Drag and drop the "Tavily" app into your canvas.

    **Option 2: Add Tavily as a Tool to an AI Agent**

    * Choose between "Search", "Crawl", "Extract" or "Map" tool based on your needs.

    **Configure the Tavily Node or Tool:**

    * In the Connect Tavily section, create a new connection by entering a connection name and your [Tavily API key](https://app.tavily.com/home).

    **Configuring parameters:**

    **For Search:**

    * Enter your search `query` (can be manually entered or populated from another node's output)
    * Select a `topic` (`general` or `news`)
    * Choose whether to include raw content or generate an answer
    * Specify Maximum Search Results to return
    * Set search depth and other optional parameters

    **For Extract:**

    * Enter the URL(s) to extract content from (can be a single URL or multiple URLs from another node's output)
    * Choose Extract Depth (`basic` or `advanced`)
    * Specify the output format (`markdown` or `text`)

    **For Crawl:**

    * Enter the **Root URL** to crawl
    * Set the crawl instructions to guide the crawler
    * Set the Limit on the number of pages to crawl

    **For Map:**

    * Enter the **Root URL** to begin the mapping
    * Set the map instructions to guide the mapping process
    * Set the mapping depth to control how deep the mapping goes

    **Test:** Run the node to verify your configuration.
  </Accordion>

  <Accordion title="Step 4: Process and Use Tavily Results">
    Utilize the search, crawl, extract, or map results in your workflow:

    * Process data through additional nodes
    * Send information to your CRM, database, or email
    * Generate reports or notifications
    * Feed data into AI models for further processing
  </Accordion>
</AccordionGroup>

## Use cases for Tavily in StackAI

Leverage Tavily's capabilities to create powerful automated workflows:

* **Job Search Automation**: Find and summarize new job postings, then send results to your inbox
* **Competitive Intelligence**: Automatically gather and analyze competitor information
* **Market Research**: Track industry trends and market developments
* **Content Curation**: Collect and organize relevant content for your business
* **Lead Enrichment**: Enhance lead data with real-time information
* **News Monitoring**: Stay updated with the latest developments in your field

## Detailed example - AI News Summary

Here's an example workflow that uses Tavily to search for the latest articles on "AI advancements" and sends a summary to your email:

<AccordionGroup>
  <Accordion title="Workflow Steps">
    1. **Trigger:** Schedule the workflow to run daily
    2. **AI Agent:** Add an AI agent node to your workflow
    3. **Search:** The AI agent uses Tavily to find recent articles on "AI advancements"
    4. **Summarize:** The AI agent summarizes the most important news and trends
    5. **Delivery:** Send the summarized briefing via Email, Slack, or another integration
  </Accordion>
</AccordionGroup>

## Best practices

To optimize your Tavily integration in StackAI:

* Tightly constrain Tavily queries to specific intent, time range, and domains to avoid noisy retrieval.
* Force concise, structured outputs (bullets/JSON with only required fields) to reduce tokens and parsing errors.

> 원본: https://docs.tavily.com/documentation/integrations/make.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Make

> Tavily is now available for no-code integration through Make.

## Introduction

Integrate [Tavily with Make](https://www.make.com/en/integrations/tavily) to enhance your business processes without writing a single line of code. With Tavily's powerful search and content extraction capabilities, you can seamlessly integrate real-time online information into your Make workflows and automations.

<Frame>
  <img src="https://mintcdn.com/tavilyai/tgJqPSjqNVSkMFTO/images/make-tavily.gif?s=8c21f3b24b94f8648447746c67f92be6" alt="Make-Tavily" width="1060" height="720" data-path="images/make-tavily.gif" />
</Frame>

## How to set up Tavily with Make

<AccordionGroup>
  <Accordion title="Step 1: Log in to Make">
    [Log in](https://www.make.com/en/login) to your Make account.
  </Accordion>

  <Accordion title="Step 2: Create a New Scenario">
    Create a new scenario and select a trigger module that will start your workflow.
  </Accordion>

  <Accordion title="Step 3: Add Tavily as an Action Module">
    Add Tavily as an action module in your scenario and choose between **Perform a Search** or **Extract Raw Content**:

    **Connection:** Connect your Tavily account by entering your [Tavily API key](https://app.tavily.com/home).

    **Configuration:** Set up your parameters:

    **For Search:**

    * Enter your search `query` (can be manually entered or populated from another module's output)
    * Select a `topic` (`general` or `news`)
    * Choose whether to include raw content or generate an answer
    * Specify domains to include or exclude
    * Set search depth and other optional parameters

    **For Extract:**

    * Enter the URL(s) to extract content from (can be a single URL or multiple URLs from another module's output)
    * Choose extraction type (`basic` or `advanced`)

    **Test:** Run a test to verify your configuration.
  </Accordion>

  <Accordion title="Step 4: Process and Use Tavily Results">
    Utilize the search results in your workflow:

    * Process data through additional modules
    * Send information to your CRM or database
    * Generate reports or notifications
    * Feed data into AI models for further processing
  </Accordion>
</AccordionGroup>

## Use cases for Tavily in Make

Leverage Tavily's capabilities to create powerful automated workflows:

* **Competitive Intelligence**: Automatically gather and analyze competitor information
* **Market Research**: Track industry trends and market developments
* **Content Curation**: Collect and organize relevant content for your business
* **Lead Enrichment**: Enhance lead data with real-time information
* **News Monitoring**: Stay updated with the latest developments in your field

## Detailed example - automated market research

Create an automated workflow that performs market research and delivers insights to your team.

<Accordion title="Workflow Steps">
  1. **Trigger:** Schedule the scenario to run daily or weekly
  2. **Generate Search Queries:** Use an AI module to create relevant search queries
  3. **Execute Searches:** Use Tavily to perform multiple searches with the generated queries
  4. **Process Results:** Filter and organize the search results
  5. **Generate Report:** Use an AI module to create a comprehensive report
  6. **Deliver Insights:** Send the report via email or to your team's communication platform
</Accordion>

## Best practices

To optimize your Tavily integration in Make:

* Use the Iterator module to process multiple search results efficiently
* Use filters to process only relevant results
* Use the Aggregator module to combine multiple search results

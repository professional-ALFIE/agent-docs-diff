> 원본: https://docs.tavily.com/documentation/integrations/tines.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Tines

> Integrate Tavily with Tines for automated, no-code intelligence workflows.

## Introduction

Integrate [Tavily with Tines](https://www.tines.com/docs/credentials/connect-flows/tavily/) to enhance your automation workflows with powerful web search and content extraction capabilities. Tines' no-code platform makes it easy to incorporate Tavily's real-time search and data extraction features into your stories, enabling you to build powerful automation workflows without writing code.

## How to set up Tavily with Tines

<AccordionGroup>
  <Accordion title="Step 1: Log in to Tines">
    [Log in](https://www.tines.com/) to your Tines account.
  </Accordion>

  <Accordion title="Step 2: Create or Open a Story">
    Create a new story or open an existing one where you want to add Tavily.
  </Accordion>

  <Accordion title="Step 3: Add a Tavily Action">
    Follow these steps to add a Tavily action to your story:

    1. Navigate to the Templates section.
    2. Search for "Tavily" in the search bar.
    3. Drag the Tavily action into your story.
    4. Select a template between "Extract Web Content" and "Search the Web" based on your use case.
    5. Click on the Tavily connection to set up new credentials.
    6. Enter your Tavily API key in the provided field.
  </Accordion>

  <Accordion title="Step 4: Process and Use Tavily Results">
    Use Tines built-in actions to process Tavily's response:

    * Parse and filter search results
    * Enrich alerts or tickets with real-time intelligence
    * Trigger notifications or follow-up actions based on findings
  </Accordion>
</AccordionGroup>

## Use cases for Tavily in Tines

* **Workbench Integration**: Connect Tavily to Tines Workbench (AI-powered chat interface) to enable real-time web search and content extraction directly in your conversations
* **Market & News Monitoring**: Track industry trends or breaking news relevant to your organization
* **Lead & Entity Enrichment**: Pull real-time data on companies, people, or technologies
* **Content Extraction**: Extract and analyze web content for deeper investigations

## Example Use Cases

<AccordionGroup>
  <Accordion title="Enrich new Airtable company records using Tavily search">
    Enrich a company when it is added to an Airtable database. Receive a webhook notification when a new record is added and fill out the remaining fields with web searches powered by Tavily.

    See the [full story](https://www.tines.com/library/stories/1312477/?name=enrich-new-airtable-company-records-using-tavily-searches) on Tines' library.
  </Accordion>

  <Accordion title="Search the internet with Tavily via Slack">
    Search the internet using Tavily in response to a Slack slash command. Summarize the results and post them in a Slack thread, including source links. Users can click on the links to access more detailed information from the original sources.

    See the [full story](https://www.tines.com/library/stories/1312847/?name=search-the-internet-with-tavily-via-slack) on Tines' library.
  </Accordion>
</AccordionGroup>

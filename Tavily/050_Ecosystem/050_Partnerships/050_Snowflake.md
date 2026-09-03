> 원본: https://docs.tavily.com/documentation/partnerships/snowflake.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Snowflake

> Tavily is now available as a native app on the [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTSZ2XM0ON/tavily-tavily-search-api?search=tavily).

## Introduction

The Tavily Snowflake Native App brings powerful web search capabilities directly into your Snowflake environment, allowing you to download and install it natively within your Snowflake account in an easy and secure way.

## Tutorial

The following video walks you through the above-mentioned steps for installing, configuring, and using the Tavily Snowflake Native App.

<Frame>
  <iframe width="750" height="400" src="https://www.youtube.com/embed/rC2FSjtqkfQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen />
</Frame>

## Installation and Setup

1. After logging into your Snowflake account, click on ***Marketplace*** from the sidebar.

2. In the search bar, search for ***Tavily*** and find the ***Tavily Search API*** app.

3. Click on ***GET*** in the right top side to download the app into your Snowflake account.

4. Read through the permissions and click on ***Agree and Continue*** and click on ***GET***.

5. After the app finished downloading, hover over ***Catalog*** in the left sidebar and click on ***Apps***.

6. Locate the Tavily app named ***Tavily Search API*** in the installed apps section.

7. Now you have to configure the application.

8. Visit [https://tavily.com](https://tavily.com) to get your API key if you don't already have one.

9. After you have your API key, click on the ***Configure*** button and pass the API key in the secret value box to configure the API key for your native app.

10. Now, in the ***Review integration requests*** section, click on ***Review*** and toggle the button to the right to enable your app ***Access the Tavily external API for web search***.

11. Click on ***Save***. Now you have successfully configured your application for use in the Snowflake environment.

12. Click on ***Next*** to visit the app page.

## Use cases

### Using TAVILY\_WEB\_SEARCH in Snowsight

1. After installation in the app page, you can click on ***Open Worksheet*** to pop up a Snowflake worksheet with a pre-loaded SQL query to use Tavily web search.

2. Make sure to select the appropriate database for your worksheet. In the top right, ensure the database is `TAVILY_SEARCH_API` and the schema is `TAVILY_SCHEMA`.

3. Now you can click the ***Run*** button on the top left of your worksheet to run the query.

SQL Procedure: `TAVILY_SCHEMA.TAVILY_WEB_SEARCH`

**Parameters:**

* `QUERY` (VARCHAR): The search query in natural language

* `SEARCH_DEPTH` (VARCHAR, optional): `'basic'` (default) or `'advanced'`

* `MAX_RESULTS` (INTEGER, optional): Maximum number of results (default: 5)

**Example:**

```sql theme={null}
CALL TAVILY_SCHEMA.TAVILY_WEB_SEARCH('latest Quantum computing trends', 'advanced', 10);
```

**Data Enrichment**:
With this setup, you can enhance your Snowflake database with up-to-date information from the web, enabling you to fill your data warehouse with real-world data and keep your analytics current with the latest trends and events.

`For example`: During data analysis in your Snowflake environment, you may discover records with missing, null, or outdated values, such as incomplete company details, stale product information, or missing metadata. Instead of filling these gaps manually, you can leverage the `TAVILY_WEB_SEARCH` stored procedure to automatically query reliable sources on the web. This allows you to fetch the most current information available and enrich your dataset directly within Snowflake, improving data completeness, accuracy, and overall analytical value.

### Using TAVILY\_WEB\_SEARCH in Snowflake Intelligence

1. **Set up Snowflake Intelligence**: Follow the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/snowflake-cortex/snowflake-intelligence) to set up Snowflake Intelligence. Make sure you have the snowflake\_intelligence database, required schema and GRANTs before proceeding to the next steps.

2. **Create an Agent**: In the Snowsight UI sidebar, navigate to the ***Agents*** admin page under ***AI & ML***, click on ***create agent*** and provide agent object name, display name and create the agent.

3. **Add the TAVILY\_WEB\_SEARCH Custom Tool**: Within the current agent's menu bar, navigate to the ***Tools*** section and click on ***+Add*** in Custom tools.

   * Select the Resource type as ***Procedure***

   * Select the database and schema: `TAVILY_SEARCH_API.TAVILY_SCHEMA`

   * Select the custom tool identifier: `TAVILY_SEARCH_API.TAVILY_SCHEMA.TAVILY_WEB_SEARCH`

   * Give your tool a descriptive name

   * Configure the following parameters with their descriptions:

     * `query`: "Search query"

     * `search_depth`: "The depth of the search. It can be 'basic' or 'advanced'"

     * `max_results`: "The maximum number of search results to return. Minimum is 1 and Maximum is 20"

   * Click on ***Add*** to attach the tool to your agent

   * Make sure to click on ***Save*** in the top right corner to update the agent

4. **Use the Agent**: In the Snowsight UI sidebar, navigate to the ***Snowflake Intelligence*** landing page under ***AI & ML***, select the agent you created, and use the tool.

`Real-time AI agents`:
With Snowflake Intelligence, you can ask complex questions about your data in natural language and receive insights from your own personalized enterprise intelligence agent. To ensure those insights are both accurate and current, it’s important to ground the agent in real-time information. By integrating the `TAVILY_WEB_SEARCH` tool, you allow the agent to automatically pull fresh, relevant data from the web, thus resulting in more trustworthy analysis and more informed decision-making.

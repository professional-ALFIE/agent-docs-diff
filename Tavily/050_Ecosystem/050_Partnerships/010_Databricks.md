> 원본: https://docs.tavily.com/documentation/partnerships/databricks.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Databricks

> Integrate Tavily MCP Server with Databricks for real-time web search and RAG capabilities.

## Overview

Tavily MCP Server is available on [Databricks Marketplace](https://marketplace.databricks.com/details/3709f418-1ed3-42a8-a753-38d06ce281c7/Tavily_Tavily-MCP-Server), enabling one-click installation that creates a secure Unity Catalog connection for authenticated access. Once installed, Tavily MCP can be used programmatically in your agent code (LangGraph, OpenAI, etc.) through Databricks-managed proxy endpoints, grounding your AI agents with real-time web search, extraction, crawling, and mapping.

## Prerequisites

* [Databricks workspace](https://www.databricks.com/) with the **Managed MCP Servers** preview enabled. See [Manage Databricks previews](https://docs.databricks.com/aws/en/admin/workspace-settings/manage-previews).
* `CREATE CONNECTION` privilege on the Unity Catalog metastore
* [Tavily API Key](https://app.tavily.com/home) for authenticating the Tavily MCP connection (via bearer token)

## Setup

### Install from Databricks Marketplace

<Steps>
  <Step title="Navigate to Marketplace and find Tavily MCP Server">
    In your Databricks workspace, go to **Marketplace** and search for **Tavily MCP Server**.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/tavilymcp.gif?s=35a5154bf150c14c2da906302c4c0e1c" alt="Search for Tavily MCP Server in Databricks Marketplace" width="2226" height="1312" data-path="images/partnerships/databricks/tavilymcp.gif" />
    </Frame>
  </Step>

  <Step title="Install and configure the connection">
    Click **Install** to install the Tavily MCP Server. In the installation dialog, configure the connection settings:

    * **Connection name**: Enter a name for the Unity Catalog connection (for example, `tavily_mcp_connection`).
    * **Host**: Pre-populated for Tavily.
    * **Base path**: Pre-populated for Tavily.
    * **Bearer token**: Enter your Tavily API Key as the bearer token.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/configmcp.gif?s=4bb7cd389d3a4946a9de6fc1727573e8" alt="Configure the connection for Tavily MCP Server" width="2226" height="1296" data-path="images/partnerships/databricks/configmcp.gif" />
    </Frame>
  </Step>

  <Step title="Verify Unity Catalog Connection">
    Navigate to **Unity Catalog** > **Connect** > **Connections** and verify that the connection has been created successfully.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/verifyconnection.gif?s=961b443e643b84028dbe7c38a26cdb7c" alt="Verify the connection from Unity Catalog" width="2226" height="1298" data-path="images/partnerships/databricks/verifyconnection.gif" />
    </Frame>
  </Step>
</Steps>

### Share the MCP server connection

<Steps>
  <Step title="Open the Unity Catalog connection">
    Navigate to **Unity Catalog** > **Connect** > **Connections** and click on the connection you created earlier (for example, `tavily_mcp_connection`).

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/connections.gif?s=f1dcff39a064a8772349f517fcbded02" alt="Open the Unity Catalog Connections" width="2222" height="1168" data-path="images/partnerships/databricks/connections.gif" />
    </Frame>
  </Step>

  <Step title="Grant access to the connection">
    Grant `USE CONNECTION` privileges to identity principals that need to use the Tavily MCP server connection. In your workspace, go to **Permissions** tab and grant **`USE CONNECTION`** to the identity principals that need to use the Tavily MCP server connection.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/useconnection.gif?s=2b82c6f3769d1a1f312a6971756284c4" alt="Grant USE CONNECTION privileges to identity principals" width="2226" height="1296" data-path="images/partnerships/databricks/useconnection.gif" />
    </Frame>
  </Step>
</Steps>

### Test Tavily MCP Server within Databricks

You can test the Tavily MCP server directly within Databricks without writing any code.

**Using AI Playground:**

<Steps>
  <Step title="Open AI Playground">
    Go to **AI Playground** in your Databricks workspace and choose a model with
    the **Tools enabled** label.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/model.gif?s=329fd57e0ceb6472077f49298542b911" alt="Select a model in AI Playground" width="2222" height="1294" data-path="images/partnerships/databricks/model.gif" />
    </Frame>
  </Step>

  <Step title="Add Tavily MCP Server as a tool">
    Click **Tools** tab and select **+ Add tool** and select **MCP Servers** from the available tool options. In the MCP Servers section, select **External MCP servers** to
    browse available connections, and choose the Unity Catalog connection you
    installed earlier (for example, `tavily_mcp_connection`).

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/tool.gif?s=da6126bde43802d05ce1b4206ef016bb" alt="Add Tavily MCP Server as a tool" width="2224" height="1296" data-path="images/partnerships/databricks/tool.gif" />
    </Frame>
  </Step>

  <Step title="Chat and test Tavily MCP Server">
    Chat with the LLM to test how it interacts with Tavily MCP tools.

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/tavilyresults.gif?s=2dcc0826ff4f6f2638692319c6c82518" alt="Test Tavily MCP Server results" width="2222" height="1296" data-path="images/partnerships/databricks/tavilyresults.gif" />
    </Frame>
  </Step>
</Steps>

### Add Tavily MCP Server to Databricks Assistant

<Steps>
  <Step title="Open Databricks Assistant">
    Go to **Databricks Assistant** in your Databricks workspace and click on the **Settings** icon.
  </Step>

  <Step title="Add MCP Server from Settings">
    In **MCP Servers** section, select **+ Add MCP Server**. Go to **External MCP servers** dropdown and choose the Unity Catalog connection you installed earlier (for example, `tavily_mcp_connection`).

    <Frame>
      <img src="https://mintcdn.com/tavilyai/3qtRHnSgAhfp9BRT/images/partnerships/databricks/assistant.gif?s=8f5f6075d8fe3d0992ede976bc97fa5b" alt="Add MCP Server from Settings" width="2224" height="1296" data-path="images/partnerships/databricks/assistant.gif" />
    </Frame>
  </Step>
</Steps>

### Use Tavily MCP in Your Agent Code

After installation, use Tavily MCP programmatically in your agent code by connecting to the proxy URL. The Databricks proxy makes external servers behave like managed MCP servers, handling authentication and token management.

<Steps>
  <Step title="Configure the proxy endpoint">
    Add the Tavily MCP proxy endpoint to your `MANAGED_MCP_SERVER_URLS` list. External MCP servers are proxied as managed servers, allowing you to use the same API for both:

    ```python theme={null}
    from databricks.sdk import WorkspaceClient
    from databricks_mcp import DatabricksMCPClient

    # Initialize workspace client
    workspace_client = WorkspaceClient()
    host = workspace_client.config.host

    # External MCP servers are proxied as managed servers, allowing you
    # to use the same API for both managed and external servers
    MANAGED_MCP_SERVER_URLS = [
        f"{host}/api/2.0/mcp/functions/system/ai",  # Default managed MCP
        f"{host}/api/2.0/mcp/external/tavily_mcp_connection"  # Tavily MCP proxy
    ]
    ```
  </Step>

  <Step title="Use with agents">
    Pass the proxy URL to the `managed_server_urls` parameter to create tools from both managed and external (proxied) servers:

    ```python theme={null}
    # Use with agents — external servers work just like managed ones
    import asyncio
    from your_agent_code import create_mcp_tools  # Your agent's tool creation function

    # Create tools from both managed and external (proxied) servers
    mcp_tools = asyncio.run(
        create_mcp_tools(
            ws=workspace_client,
            managed_server_urls=MANAGED_MCP_SERVER_URLS
        )
    )
    ```
  </Step>

  <Step title="Call tools directly (optional)">
    You can also call Tavily tools directly using the Databricks MCP Client:

    ```python theme={null}
    # Direct tool call using DatabricksMCPClient
    mcp_client = DatabricksMCPClient(
        server_url=f"{host}/api/2.0/mcp/external/tavily_mcp_connection",
        workspace_client=workspace_client
    )

    # List available tools
    tools = mcp_client.list_tools()
    print(f"Available tools: {[tool.name for tool in tools]}")

    # Call a tool
    response = mcp_client.call_tool(
        "tavily_search",
        {"query": "latest AI research breakthroughs"}
    )
    print(response.content[0].text)
    ```
  </Step>
</Steps>

## Resources

* [Tavily MCP Server on Databricks Marketplace](https://marketplace.databricks.com/details/3709f418-1ed3-42a8-a753-38d06ce281c7/Tavily_Tavily-MCP-Server)
* [Tavily MCP Documentation](/documentation/mcp)

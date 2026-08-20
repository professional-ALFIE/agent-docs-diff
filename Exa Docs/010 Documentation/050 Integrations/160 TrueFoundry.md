> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# TrueFoundry

> Connect Exa to the TrueFoundry MCP Gateway for centralized access controls, tool management, and usage monitoring.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) is an enterprise-grade proxy layer between your applications and LLM providers or MCP servers. It provides unified access to 1,000+ LLMs with centralized observability and governance.

TrueFoundry provides Exa as an official remote server in its [MCP Gateway](https://www.truefoundry.com/mcp-gateway). Connect the Exa MCP server to give your teams one managed endpoint for web search, content fetching, and agentic research.

<Frame caption="Exa in the TrueFoundry official remote MCP server catalog">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="The Exa server in TrueFoundry's official remote MCP catalog" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

## Add Exa to TrueFoundry

1. Open **MCP Servers** in the TrueFoundry sidebar and select **Add new MCP Server**.
2. Select **Connect Official Remote MCP Servers**.

<Frame caption="Choose the official remote MCP server catalog">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="TrueFoundry's Add MCP Server picker with Connect Official Remote MCP Servers selected" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Find **Exa** in the catalog and select **+ Add**.
4. Confirm the pre-filled server details:

| Field          | Value                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Name           | `exa`                                                                                                                  |
| Description    | Search Engine made for AIs by Exa                                                                                      |
| URL            | `https://mcp.exa.ai/mcp`                                                                                               |
| Authentication | Optional (The MCP Server works without authentication. You only need an Exa API key if you reach the free rate limit.) |

5. Add the users or teams that should manage or use the server. Leave **Auth Data** off, then select **Update MCP Server**.

<Frame caption="Configure the Exa server and its collaborators">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Exa MCP server registration form with its name, URL, collaborators, and authentication settings" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Open the **Tools** tab and confirm that Exa's search, content fetching, and agentic research tools are available.
</Check>

## Configure the Exa server

The pre-filled URL exposes Exa's default toolset. Change it only if you need to restrict the available tools or use your own API key.

### Choose which tools are available

Pass a comma-separated list of tool names in the `tools` query parameter:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

You can enter the URL in the server form or use **Apply using YAML**:

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  You can find available tool names in the [Exa MCP documentation](/docs/reference/exa-mcp).
</Tip>

### Use your Exa API key to bypass the free rate limit

If you reach the free rate limit, add your Exa API key to the server URL:

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

## Connect an MCP client

Open the Exa server's **How To Use** tab and select your client. TrueFoundry generates the tenant-specific endpoint and ready-to-paste configuration for Cursor, Claude Code, VS Code, Windsurf, Codex, and other MCP clients.

<Frame caption="Copy the configuration for your MCP client">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="TrueFoundry's client-specific setup instructions for the Exa MCP server" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

## Test a tool

Select **Try** beside an Exa tool, enter its inputs, then select **Execute Tool**. The playground displays the JSON response so you can verify the tool before using it in an agent.

<Frame caption="Run an Exa tool in the TrueFoundry playground">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Testing an Exa tool in the TrueFoundry tool playground" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

## Manage and monitor tools

* Toggle individual tools to control what MCP clients can call
* Use **Tool Metrics** to review traffic, latency, and errors
* Export invocation traces to your observability stack through OpenTelemetry

<Frame caption="Manage the Exa tools exposed to MCP clients">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Exa tools available from the TrueFoundry MCP server" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

## Resources

<CardGroup cols={3}>
  <Card title="TrueFoundry setup guide" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server">
    Read TrueFoundry's guide to its Exa MCP server.
  </Card>

  <Card title="Exa MCP documentation" icon="search" href="/docs/reference/exa-mcp">
    Review Exa's tools, configuration, and usage examples.
  </Card>

  <Card title="Exa MCP Server" icon="github" href="https://github.com/exa-labs/exa-mcp-server">
    View the server source and releases on GitHub.
  </Card>
</CardGroup>

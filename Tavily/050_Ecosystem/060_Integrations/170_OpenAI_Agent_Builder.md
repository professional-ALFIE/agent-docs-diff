> 원본: https://docs.tavily.com/documentation/integrations/agent-builder.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAI Agent Builder

> Integrate OpenAI’s Agent Builder with Tavily’s MCP server to empower your AI agents with real-time web access.

## Getting Started

Before you begin, make sure you have:

* A [Tavily API key](https://app.tavily.com/home) (sign up for free if you don't have one)
* An OpenAI account with [organization verification](https://help.openai.com/en/articles/10910291-api-organization-verification)

<Step title="Create a new workflow in Agent Builder">
  Navigate to [Agent Builder](https://platform.openai.com/agent-builder) and click **Create New Workflow** to begin building your AI agent.

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/create-workflow.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=d032fb19494be5ccd0c516de7bfc1b4d" alt="Create New Workflow" width="1431" height="510" data-path="images/create-workflow.png" />
</Step>

<Step title="Select the agent node in your workflow" stepNumber={2}>
  Click on the agent node in your workflow canvas to open the configuration panel.

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/agent-node.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=5b1b592b5b703df7f85a26626c05dc4d" alt="Agent Block" width="1339" height="618" data-path="images/agent-node.png" />
</Step>

<Step title="Open the Tools configuration" stepNumber={3}>
  In the configuration panel, locate and click on **Tools** in the sidebar to add external capabilities to your agent.

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/agent-tool.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=18bf6ac9a2dda471ef124ef7f21216fc" alt="Tools Panel" width="375" height="529" data-path="images/agent-tool.png" />
</Step>

<Step title="Connect Tavily's MCP server" stepNumber={4}>
  In the MCP configuration section, paste the Tavily MCP server URL:

  ```bash theme={null}
  https://mcp.tavily.com/mcp/?tavilyApiKey=YOUR_API_KEY
  ```

  Remember to replace `YOUR_API_KEY` with your actual Tavily API key.

  {" "}

  <Tip>
    Need an API key? Get one instantly from your [Tavily
    dashboard](https://app.tavily.com/home)
  </Tip>

  Click **Connect** to establish the connection to Tavily.

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/tavily-mcp.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=2f39df29a22f845ed5d2f9bf7883d0fd" alt="Tavily MCP Configuration" width="524" height="668" data-path="images/tavily-mcp.png" />
</Step>

<Step title="Enable Tavily capabilities for your agent" stepNumber={5}>
  Once connected, you'll see Tavily's suite of tools available:

  * **tavily\_search** - Execute a search query.
  * **tavily\_extract** - Extract web page content from one or more specified URLs.
  * **tavily\_map** - Traverses websites like a graph and can explore hundreds of paths in parallel with intelligent discovery to generate comprehensive site maps.
  * **tavily\_crawl** - Traversal tool that can explore hundreds of paths in parallel with built-in extraction and intelligent discovery.

  Select the tools you want to activate for this agent, then click **Add** to integrate them.

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/tavily-mcp-tools.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=d9e0d214e5b6c0d9c0ab3943289d6729" alt="Tavily Tools Available" width="522" height="566" data-path="images/tavily-mcp-tools.png" />
</Step>

<Step title="Customize your agent's behavior" stepNumber={6}>
  Now configure your agent:

  * **Name**: Choose a descriptive name for your agent
  * **Instructions**: Define the agent's role and how it should use Tavily's tools
  * **Reasoning**: Set the appropriate reasoning effort level
  * Click **Preview** to test the configuration

  **Sample instructions:**

  ```
  You are a research assistant that uses Tavily to search the web for up-to-date information.
  When the user asks questions that require current information, use Tavily to find relevant and recent sources.
  ```

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/agent-config.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=899b9db4ad2c6f8e785ef24dcdf17bbc" alt="Agent Configuration Panel" width="356" height="556" data-path="images/agent-config.png" />
</Step>

<Step title="Verify your agent works correctly" stepNumber={7}>
  Test your agent with queries that require real-time information to verify everything is working as expected.

  <img src="https://mintcdn.com/tavilyai/L1kzPmnTqAHnyyDl/images/test-agent.png?fit=max&auto=format&n=L1kzPmnTqAHnyyDl&q=85&s=6b2dca8e3bb276e711fd5e09b5fa5e63" alt="Agent Testing Interface" width="1672" height="746" data-path="images/test-agent.png" />
</Step>

## Real-World Applications

### Market Research Agents

Build agents that continuously monitor industry trends, competitor activities, and market sentiment by searching for and analyzing relevant business information.

### Content Curation Systems

Create agents that automatically find, extract, and summarize content from multiple sources based on your specific criteria and preferences.

### Competitive Intelligence

Develop agents that crawl competitor websites, map their content strategies, and extract pricing, features, and positioning information.

### News & Event Monitors

Build agents that track breaking news on specific topics by leveraging Tavily's news search mode, providing real-time updates with citations.

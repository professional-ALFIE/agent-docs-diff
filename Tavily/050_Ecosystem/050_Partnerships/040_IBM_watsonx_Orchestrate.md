> 원본: https://docs.tavily.com/documentation/partnerships/ibm.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# IBM watsonx Orchestrate

> Integrate Tavily's AI-powered research capabilities with IBM watsonx Orchestrate

## Overview

Tavily offers two services on IBM watsonx Orchestrate:

* **Tavily Research Agent** — An AI-powered research agent that conducts comprehensive web research using coordinated parallel sub-agents to deliver detailed, citation-backed reports on complex topics.
* **Tavily Search API** — Real-time web search optimized for AI agents and LLMs.

Both services are available through the IBM Cloud catalog and can be procured using IBM credits.

## Setup Guide

### Step 1: Create a Tavily Instance on IBM Cloud

1. Navigate to [IBM Cloud](https://cloud.ibm.com/)
2. In the search bar, type "Tavily" to find the available services

<Frame>
  <img src="https://mintcdn.com/tavilyai/mMnPoAJLztM_oyJe/images/ibm-cloud-search.png?fit=max&auto=format&n=mMnPoAJLztM_oyJe&q=85&s=d93abe6a9991e7b1866db11a044d6b69" alt="Search for Tavily in IBM Cloud" width="3006" height="1692" data-path="images/ibm-cloud-search.png" />
</Frame>

3. Select either **Tavily Search API** or **Tavily Research Agent** depending on your needs
4. Click **Create** to provision a new instance

<Frame>
  <img src="https://mintcdn.com/tavilyai/mMnPoAJLztM_oyJe/images/ibm-create-agent.png?fit=max&auto=format&n=mMnPoAJLztM_oyJe&q=85&s=cd49a442c3765a4ff8d88ab56552290c" alt="Create Tavily instance" width="3018" height="1616" data-path="images/ibm-create-agent.png" />
</Frame>

### Step 2: Copy Your Bearer Token

Once your instance is created, copy the bearer token from the credentials section. You'll need this to connect the agent in watsonx Orchestrate.

<Frame>
  <img src="https://mintcdn.com/tavilyai/mMnPoAJLztM_oyJe/images/ibm-agent-bearer-token.png?fit=max&auto=format&n=mMnPoAJLztM_oyJe&q=85&s=8f60155aaf55eb62c48f4164526fd10c" alt="Copy bearer token" width="2954" height="1504" data-path="images/ibm-agent-bearer-token.png" />
</Frame>

### Step 3: Add Tavily to watsonx Orchestrate

1. Navigate to [watsonx Orchestrate](https://dl.watson-orchestrate.ibm.com/chat)
2. Create a new agent

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-create-agent.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=eb4f4ff6f45709cc8895a2aa2a1ea627" alt="Create agent in watsonx Orchestrate" width="3016" height="1600" data-path="images/wxo-create-agent.png" />
</Frame>

3. Name your agent

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-name-agent.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=4d3d20fa3a2d5374ec7ba3d94af0944b" alt="Name your agent" width="2992" height="1600" data-path="images/wxo-name-agent.png" />
</Frame>

4. Add a collaborator agent

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-add-agent.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=0aae16eb9c909bd9aed0c60db51ce39a" alt="Add collaborator agent" width="2998" height="1602" data-path="images/wxo-add-agent.png" />
</Frame>

5. Select **Tavily Research Agent** from the partner agents list

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-select-tavily-agent.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=8f7e26add4edcbaea7ddd8314c9a87bb" alt="Select Tavily agent" width="3002" height="1598" data-path="images/wxo-select-tavily-agent.png" />
</Frame>

6. Review the agent details and click **Add as collaborator**

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-add-collaborator.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=ab168b3f2b974c5d1c97598f190ff41e" alt="Add Tavily as collaborator" width="3016" height="1602" data-path="images/wxo-add-collaborator.png" />
</Frame>

7. Enter your bearer token (from Step 2) in the **Bearer token** field and click **Register and add**

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-register-token.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=9577b14c50e386b6b556fd8af23481af" alt="Register agent with bearer token" width="2990" height="1608" data-path="images/wxo-register-token.png" />
</Frame>

8. The Tavily Research Agent will now appear in your agent's **Toolset** under the Agents section

<Frame>
  <img src="https://mintcdn.com/tavilyai/Wr9BDR90tDFYHmP_/images/wxo-agent-loaded.png?fit=max&auto=format&n=Wr9BDR90tDFYHmP_&q=85&s=7b655e46129563eceb73a61e39c4e9cf" alt="Tavily agent loaded in toolset" width="3016" height="1614" data-path="images/wxo-agent-loaded.png" />
</Frame>

### Step 4: Try It Out

Ask a question in the chat that requires real-time web research, and watsonx Orchestrate will automatically hand off to the Tavily Research Agent.

<Frame>
  <img src="https://mintcdn.com/tavilyai/mMnPoAJLztM_oyJe/images/agent-handoff.png?fit=max&auto=format&n=mMnPoAJLztM_oyJe&q=85&s=7e4219aa980df17699d697922c052863" alt="Tavily Research Agent handoff example" width="2992" height="1600" data-path="images/agent-handoff.png" />
</Frame>

Your Tavily Research Agent is now ready to use within watsonx Orchestrate.

## Resources

* [IBM watsonx Orchestrate Documentation](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=agents-adding-orchestration#adding-a-collaborator-agent)
* [Partner Agents Catalog](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=catalog-partner-agents)

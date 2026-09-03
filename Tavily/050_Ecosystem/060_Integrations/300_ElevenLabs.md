> 원본: https://docs.tavily.com/documentation/integrations/elevenlabs.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# ElevenLabs

> Connect Tavily to ElevenLabs ElevenAgents so your agents can use live web search.

## Introduction

Integrate [Tavily](https://tavily.com/) with [ElevenLabs](https://elevenlabs.io/) through **ElevenAgents** to give your agents access to real-time web search. In ElevenLabs, Tavily is available under **ElevenAgents → Integrations**.

> The Tavily integration in ElevenLabs currently exposes the **`search`** tool only.

## Full setup walkthrough

<Frame>
  <img src="https://mintcdn.com/tavilyai/Gsgo_UHaiKemznM0/images/elevenlabs.gif?s=e91cf4fe83b5fce8ffdb552acc99d890" alt="ElevenLabs Tavily integration walkthrough" width="1336" height="720" data-path="images/elevenlabs.gif" />
</Frame>

## Setup instructions

1. Open **ElevenAgents** in ElevenLabs.
2. Click **Integrations**.
3. Click **Add Integration**.
4. In the **Configure** tab:
   * Enter an **API key name**.
   * Enter your [Tavily API key](https://app.tavily.com/home).
   * Click **Connect**.

<Frame>
  <img src="https://mintcdn.com/tavilyai/Gsgo_UHaiKemznM0/images/elevenlabs_integration.png?fit=max&auto=format&n=Gsgo_UHaiKemznM0&q=85&s=5238c16dc97878804882c9521d22fd90" alt="ElevenLabs integration configuration" width="3024" height="1715" data-path="images/elevenlabs_integration.png" />
</Frame>

Once connected, Tavily will be available for use inside your ElevenAgents workflows.

## Testing flow

1. Go to **Agents**.
2. Click **New Agent**.
3. Choose a template or start with a **Blank Agent**.
4. Decide your agent's use case.
5. Add details such as **Name** and **Goal**.
6. Click **Create Agent**.
7. Configure the agent settings, such as:
   * **Voice**
   * **First Message**
   * **LLM**
   * any other relevant options

<Frame>
  <img src="https://mintcdn.com/tavilyai/Gsgo_UHaiKemznM0/images/elevenlabs-agent-config.png?fit=max&auto=format&n=Gsgo_UHaiKemznM0&q=85&s=077b042732fa2101ed6f57d93b692743" alt="ElevenLabs agent configuration" width="3024" height="1790" data-path="images/elevenlabs-agent-config.png" />
</Frame>

8. Open the **Tools** section.
9. Add **Tavily search**.
10. **Publish** the agent or use **Preview**.
11. Test the agent end to end.

<Frame>
  <img src="https://mintcdn.com/tavilyai/Gsgo_UHaiKemznM0/images/elevenlabs-tools.png?fit=max&auto=format&n=Gsgo_UHaiKemznM0&q=85&s=fd22c2df40d1704f40ba817e78fa1daa" alt="ElevenLabs Tools section with Tavily search" width="3012" height="1779" data-path="images/elevenlabs-tools.png" />
</Frame>

## Why use Tavily with ElevenLabs?

* Give voice and conversational agents access to up-to-date information.
* Add live web search without building a custom retrieval layer.
* Quickly prototype research, support, and assistant workflows inside ElevenAgents.

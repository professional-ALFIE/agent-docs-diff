> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Meeting Prep

> Build an intelligent meeting preparation agent with real-time web research capabilities using Tavily's API and Google Calendar integration

## Introduction

This repository demonstrates how to build a meeting preparation agent with real-time web access, leveraging Tavily's advanced search capabilities. This agent will connect to your Google Calendar via MCP, extract meeting information, and use Tavily search for profile research on the meeting attendees and general information on the companies you are meeting with.

<img src="https://mintcdn.com/tavilyai/tgJqPSjqNVSkMFTO/images/meeting-prep-agent.gif?s=58004f96bc27a202f3994033fb2c1308" alt="Meeting Prep Agent Demo" width="700" data-path="images/meeting-prep-agent.gif" />

## Try Our Meeting Prep Agent

### Step 1: Get Your API Key

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

### Step 2: Read The Open Source Code and Clone the App

<Card title="View Github Repository" icon="github" href="https://github.com/tavily-ai/meeting-prep-agent" horizontal />

## System Diagram

<img src="https://mintcdn.com/tavilyai/jQz1Rb41O25S9YhR/images/meeting-prep-diagram.svg?fit=max&auto=format&n=jQz1Rb41O25S9YhR&q=85&s=e171e0cab0d38d7a91324a7c84fc947a" alt="Meeting Prep Agent Diagram" width="700" data-path="images/meeting-prep-diagram.svg" />

## Features

1. **Real-time Web Search**: Instantly fetches up-to-date information using Tavily's search API.
2. **Agentic Reasoning**: Combines MCP and ReAct agent flows for smarter, context-aware responses.
3. **Streaming Substeps**: See agentic reasoning and substeps streamed live for transparency.
4. **Citations**: All web search results are cited for easy verification.
5. **Google Calendar Integration**: (via mcp-use) Access and analyze your meeting data.
6. **Async FastAPI Backend**: High-performance, async-ready backend for fast responses.
7. **Modern React Frontend**: Interactive UI for dynamic user interactions.

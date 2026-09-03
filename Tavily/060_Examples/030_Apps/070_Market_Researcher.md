> 원본: https://docs.tavily.com/examples/use-cases/market-researcher.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Market Researcher

> Get comprehensive market insights and analysis for stocks in your portfolio

<img src="https://mintcdn.com/tavilyai/Kp7OS58os-ADEM7C/images/market_researcher.gif?s=d09d8bfe08cdbb7bf57b8097ecec5f35" alt="Tavily Market Researcher" width="700" data-path="images/market_researcher.gif" />

## Try Our Market Researcher

### Step 1: Get Your API Key

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

### Step 2: Try the Market Researcher

<Card title="Launch the application" icon="message-bot" href="https://market-researcher.tavily.com/" horizontal />

### Step 3: Read The Open Source Code

<Card title="View Github Repository" icon="github" href="https://github.com/tavily-ai/market-researcher" horizontal />

## Features

1. **Real-time Financial Research**: Real‑time financial news and market data aggregation performed in real-time.
2. **Full Portfolio Coverage**: Input all your stocks in your portfolio and get an analysis with comparative insights.
3. **Report Generation**: Automated report generation with source citations, so all news and claims are backed by sources.
4. **Efficient and Scalable**: Tavily handles multiple queries simultaneously, making it capable of processing large datasets quickly. This efficiency reduces the time needed for comprehensive research, allowing for faster decision-making.

## How Does It Work?

We use the Tavily 'news' and Tavily 'finance' parameters to make two separate search calls for each ticker retrieving the most relevant and up to date financial news data and metrics. All the searches are parallelized to maximize speed.

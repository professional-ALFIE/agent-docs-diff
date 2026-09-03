> 원본: https://docs.tavily.com/examples/use-cases/crawl-to-rag.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Crawl to RAG

> Turn Any Website into a Searchable Knowledge Base using Tavily and MongoDB.

## The system operates through a two-step process:

### 1. Website Crawling & Vectorization:

Use Tavily's crawling endpoint to extract and sitemap content from a webpage URL, then embed it into a MongoDB Atlas vector index for retrieval.

<img src="https://mintcdn.com/tavilyai/tgJqPSjqNVSkMFTO/images/crawl2rag.gif?s=d33fd9c90043d6a3b03da8a9b7f9d174" alt="Vectorize" width="700" data-path="images/crawl2rag.gif" />

### 2. Intelligent Q\&A Interface:

Query your crawled data through a conversational agent that provides citation-backed answers while maintaining conversation history and context. The agent intelligently distinguishes between informational questions (requiring vector search) and conversational queries (using general knowledge).

<img src="https://mintcdn.com/tavilyai/tgJqPSjqNVSkMFTO/images/crawl2rag-pt2.gif?s=931fbe7a417fb684b47b26c1467d9824" alt="Chat with vector" width="700" data-path="images/crawl2rag-pt2.gif" />

## Try Our Crawl to RAG Use Case

### Step 1: Get Your API Key

<Card title="Get your Tavily API key" icon="key" href="https://app.tavily.com" horizontal />

### Step 2: Chat with Tavily

<Card title="Launch the application" icon="message-bot" href="https://crawl-to-rag.tavily.com/" horizontal />

### Step 3: Read The Open Source Code

<Card title="View Github Repository" icon="github" href="https://github.com/tavily-ai/crawl2rag" horizontal />

## Features

1. **Advanced Web Crawling**: Deep website content extraction using Tavily's crawling API
2. **Vector Search**: MongoDB Atlas vector search with OpenAI embeddings for semantic content retrieval
3. **Smart Question Routing**: Automatic detection of informational vs. conversational queries
4. **Persistent Memory**: Conversation history and context preservation using LangGraph-MongoDB checkpointing
5. **Session Management**: Thread-based conversational persistence and vector store management

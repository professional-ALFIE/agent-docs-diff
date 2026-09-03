> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Langflow

> Integrate Tavily with Langflow, an open-source visual framework for building multi-agent and RAG applications.

## Introduction

Integrate [Tavily with Langflow](https://blog.langflow.org/web-search-in-your-ai-agents-a-langflow-tutorial/) to create powerful AI workflows using a visual interface. Langflow is an open-source tool that provides a visual builder for creating AI agents and workflows, making it easy to incorporate Tavily's search and extraction capabilities into your applications.

## Installation

Langflow works with Python 3.10 to 3.13. You can install it using either UV (recommended) or pip:

```bash theme={null}
# Using UV (recommended)
uv pip install langflow

# Using pip
pip install langflow
```

## Setting Up Tavily Components in Langflow

### Step 1: Launch Langflow

After installation, start Langflow:

```bash theme={null}
langflow run
```

This will start the Langflow server locally at `http://localhost:7860`.

### Step 2: Using Tavily Components

Langflow provides two main Tavily components in the **Tools** section of the components library:

1. **Tavily Search API**: Perform web searches and retrieve relevant information
   * Located under Tools > Tavily Search API
   * **Configuration Options**: Select the component and go to "Controls" to access all available settings. Here are some key examples:
     * Max Results: Number of results to return
     * Search Depth: "basic" or "advanced"
     * *Note: Additional parameters are available in the Controls panel*

2. **Tavily Extract API**: Extract content from web pages
   * Located under Tools > Tavily Extract API
   * **Configuration Options**: Select the component and go to "Controls" to access all available settings. Here are some key examples:
     * Extract Depth: "basic" or "advanced"
     * *Note: Additional parameters are available in the Controls panel*

### Step 3: Configure Your Tavily API Key

To use Tavily components, you need to enter your [Tavily API key](https://app.tavily.com/home) under "Tavily API Key"

## Example Workflows

### Basic Search Workflow

1. Add a Tavily Search component to your flow
2. Connect it to a prompt template
3. Configure the search parameters
4. Add an LLM component to process the results
5. Connect to an output component

### Content Extraction Workflow

1. Add a Tavily Extract component
2. Connect it to a URL input
3. Configure extraction parameters
4. Add processing components as needed
5. Connect to your desired output

## Example Use Cases

1. **Research Assistant**
   * Combine Tavily Search with LLMs for comprehensive research
   * Extract and summarize information from multiple sources

2. **Content Aggregation**
   * Use Tavily Extract to gather content from specific websites
   * Process and format the extracted content

3. **Market Intelligence**
   * Create workflows for competitive analysis
   * Monitor industry trends and news

4. **Documentation Search**
   * Build custom documentation search interfaces
   * Extract and format technical documentation

## Additional Resources

* [Langflow GitHub Repository](https://github.com/langflow-ai/langflow)
* [Langflow Documentation](https://docs.langflow.org)

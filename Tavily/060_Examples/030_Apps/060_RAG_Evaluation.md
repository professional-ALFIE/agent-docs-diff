> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# RAG Evaluation

> Effortless Web-Based RAG Evaluation Using Tavily and LangGraph

# Introduction

Every data science enthusiast knows that a vital first step to building a successful model or algorithm is having a reliable evaluation set to aspire to. In the rapidly evolving landscape of **Retrieval-Augmented Generation (RAG)** and AI-driven search systems, the importance of high-quality eval datasets is crucial.

In this article, we introduce an agentic workflow designed to **generate** subject-specific dynamic **evaluation datasets**, enabling precise validation of web search augmented agents' performance.

**Known RAG evaluation datasets**, such as [HotPotQA](https://hotpotqa.github.io), [CRAG](https://github.com/facebookresearch/CRAG), and [MultiHop-RAG](https://github.com/yixuantt/MultiHop-RAG), have been pivotal in benchmarking and fine-tuning models. However, these datasets primarily focus on evaluating performance with **static, pre-defined document sets**. As a result, they fall short when it comes to evaluating **web-based RAG systems**, where data is dynamic, contextual, and ever-changing.

This gap presents a significant challenge: how do we effectively test and refine RAG systems designed for real-world web search scenarios? **Enter the Real-Time Dataset Generator for RAG Evals** — an agentic tool leveraging [Tavily’s Search Layer](https://tavily.com) and the **LangGraph framework** to create diverse, relevant, and dynamic datasets tailored specifically for web based RAG agents.

# How does it work?

<Frame>
  <img src="https://mintcdn.com/tavilyai/tgJqPSjqNVSkMFTO/images/web-eval-graph.png?fit=max&auto=format&n=tgJqPSjqNVSkMFTO&q=85&s=4a1f16a5632ea3abeb5f0dad21aa49cb" alt="Web Evaluation Graph" width="1400" height="935" data-path="images/web-eval-graph.png" />
</Frame>

The Real-Time Dataset Generator follows a systematic workflow to create high-quality evaluation datasets:

<Steps>
  <Step title="Input">
    The workflow begins with user-provided inputs.
  </Step>

  <Step title="Domain-Specific Search Query Generation">
    If a subject is provided (e.g., “NBA Basketball”), the system **generates a
    set of search queries**. This ensures queries are tailored to gather
    high-quality, recent, and subject-specific information.
  </Step>

  <Step title="Web Search with Tavily">
    This step guarantees that the dataset reflects **current and relevant
    information**, particularly for web search RAG evaluation, where up-to-date
    data is crucial.This is the **heart of the RAG Dataset Generator**,
    transforming queries into actionable, high-quality data that forms the
    foundation of the evaluation set.
  </Step>

  <Step title="Q&A Pair Generation">
    For each website returned by Tavily, the system generates question-answer pair
    using a **map-reduce paradigm** to ensure efficient processing across multiple
    sources. This step is implemented using LangGraph’s Send API.
  </Step>

  <Step title="Saving the Evaluation Set">
    Finally, the generated dataset is saved either **locally** or to
    **Langsmith**, based on the input configuration.
  </Step>

  <Step title="Output">
    The result is a well-structured, subject-specific evaluation dataset, ready for use in advanced evaluation methods like **LLM-as-a-Judge**.
  </Step>
</Steps>

# Learn More

Want to dive deeper into web-based RAG evaluation? Check out these resources:

<CardGroup cols={2}>
  <Card title="Blog Post" icon="newspaper" href="https://blog.tavily.com/effortless-web-based-rag-evaluation-using-tavily-and-langgraph/">
    Read our detailed blog post about generating dynamic RAG evaluation datasets
  </Card>

  <Card title="GitHub" icon="github" href="https://github.com/Eyalbenba/tavily-web-eval-generator">
    `/Eyalbenba/tavily-web-eval-generator`

    <img noZoom src="https://img.shields.io/github/stars/Eyalbenba/tavily-web-eval-generator?style=social" alt="GitHub Repo stars" />
  </Card>
</CardGroup>

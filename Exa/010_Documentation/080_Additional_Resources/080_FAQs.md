> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# FAQs

<AccordionGroup>
  <Accordion title="What is Exa?">
    Exa is a search engine built specifically for AI applications. We've built our own search engine from scratch that is state of the art at finding high quality information for LLMs. Exa is used by thousands of companies to power their LLM and agentic applications.
  </Accordion>

  <Accordion title="What's different about Exa Search?">
    Traditional search engines are optimized for clicks and ads. Because nearly every search API wraps traditional search engines, they all have a similar problem.

    In contrast, Exa is optimized to return the highest quality information for LLM applications. We do not make money from ads, so we are fully incentivized to return the highest quality results to our customers. Because we've built our own search engine from scratch, we're able to provide all sorts of customized features that other providers can't.
  </Accordion>

  <Accordion title="How is Exa different from LLMs?">
    Exa is a new search engine built from the ground up. LLMs are models built to predict the next piece of text. Exa predicts specific links on the web given their relevance to a query. LLMs have intelligence, and are getting smarter over time as new models are trained. Exa connects these intelligences to the web.
  </Accordion>

  <Accordion title="How can Exa be used in an LLM?">
    Exa enhances LLMs by supplying high-quality, relevant web content, minimizing hallucination and outdated responses. An LLM can take a user's query, use Exa to find pertinent web content, and generate answers based on reliable, up-to-date information.
  </Accordion>

  <Accordion title="How does Exa compare to other search APIs?">
    Exa.ai offers unique capabilities:

    * Embedding Search Technology: Uses transformers for semantic understanding, handling complex queries based on meaning.
    * Natural Language Queries: Processes and understands natural language queries for more accurate results.
    * Instant Content Retrieval: Instantly returns clean and parsed content for any page in its index.
    * Large-scale searches: Capable of returning thousands of results for automatic processing, ideal for batch use cases.
    * Content Highlights: Extracts relevant excerpts or highlights from retrieved content for targeted information.
    * Optimized for AI Applications: Specifically designed for enhancing AI models, chatbots, and research automation.
    * Auto search: Automatically selects the best search method based on the query for optimal results.
  </Accordion>

  <Accordion title="How often is the index updated?">
    We update our index every hour, and are constantly adding batches of new links. We target the highest quality web pages. Our clients oftentimes request specific domains to be more deeply covered - if there is a use-case we can unlock by additional domain coverage in our index, please contact us.
  </Accordion>

  <Accordion title="How does similarity search work?">
    When you search using a URL, Exa crawls the URL, parses the main content from the HTML, and searches the index with that parsed content.

    The model chooses webpages which it predicts are talked about in similar ways to the prompt URL. That means the model considers a range of factors about the page, including the text style, the domain, and the main ideas inside the text.

    Similarity search is a natural extension for a semantic search engine like Exa, and something that's difficult with traditional search engines.
  </Accordion>

  <Accordion title="What security measures does Exa take?">
    We have robust policies and everything we do is either in standard cloud services, or built in house (e.g., we have our own vector database that we serve in house, our own GPU cluster, our own query model and our own search solution). In addition to this, we can offer unique security arrangements like zero data retention as part of a custom enterprise agreement. [Learn more](./security).
  </Accordion>

  <Accordion title="Does Exa have a crawler?">
    Exa crawls pages on the web, just like any other search engine. If a webpage has the noindex tag and is therefore not crawlable by any search engine, then Exa will not crawl that page.
  </Accordion>

  <Accordion title="What's on our roadmap?">
    * Build a (much) larger index
    * Solve search. No, really.
  </Accordion>
</AccordionGroup>

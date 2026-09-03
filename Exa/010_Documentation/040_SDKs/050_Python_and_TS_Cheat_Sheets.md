> 원본: https://exa.ai/docs/sdks/cheat-sheet.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Python and TS Cheat Sheets

> Some common code you might want to use - don't miss the TypeScript tab below!

<Note>
  **New to Exa?** Try the [Coding Agent Quickstart](https://dashboard.exa.ai/onboarding)
  to get started in under a minute.
</Note>

***

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  # instantiate the Exa client
  exa = Exa()

  # basic search
  results = exa.search("This is an Exa query:")

  # search with highlights (recommended for agentic workflows)
  results = exa.search("This is an Exa query:", contents={"highlights": True})

  # search with Dynamic Highlights
  results = exa.search("This is an Exa query:", contents={"highlights": {"dynamic": True}})

  # search with date filters
  results = exa.search("This is an Exa query:", start_published_date="2019-01-01", end_published_date="2019-01-31")

  # search with domain filters
  results = exa.search("This is an Exa query:", include_domains=["www.cnn.com", "www.nytimes.com"])

  # search with custom contents options
  results = exa.search(
      "This is an Exa query:",
      contents={
          "text": {"include_html_tags": True, "max_characters": 1000},
          "highlights": {"query": "This is the highlight query:"},
      },
  )



  # get text contents
  results = exa.get_contents(["ids"])

  # get highlights
  results = exa.get_contents(["ids"], highlights=True)

  # get contents with contents options
  results = exa.get_contents(["ids"],
                             text={"include_html_tags": True, "max_characters": 1000},
                             highlights={"query": "This is the highlight query:"})

  # basic answer
  response = exa.answer("This is a query to answer a question")

  # answer with full text
  response = exa.answer("This is a query to answer a question", text=True)

  # answer with streaming
  response = exa.stream_answer("This is a query to answer:")

  # Print each chunk as it arrives when using the stream_answer method
  for chunk in response:
    print(chunk, end='', flush=True)
  ```

  ```typescript TypeScript theme={null}
  import Exa from 'exa-js';

  // Instantiate the Exa client
  const exa = new Exa();

  // Basic search
  const basicResults = await exa.search("This is an Exa query:");

  // Search with highlights (recommended for agentic workflows)
  const highlightResults = await exa.search("This is an Exa query:", {
    contents: { highlights: true }
  });

  // Search with Dynamic Highlights
  const dynamicHighlightResults = await exa.search("This is an Exa query:", {
    contents: {
      highlights: { dynamic: true }
    }
  });

  // Search with date filters
  const dateFilteredResults = await exa.search("This is an Exa query:", {
    startPublishedDate: "2019-01-01",
    endPublishedDate: "2019-01-31"
  });

  // Search with domain filters
  const domainFilteredResults = await exa.search("This is an Exa query:", {
    includeDomains: ["www.cnn.com", "www.nytimes.com"]
  });

  // Search with custom contents options
  const customContentsResults = await exa.search("This is an Exa query:", {
    contents: {
      text: { includeHtmlTags: true, maxCharacters: 1000 },
      highlights: { query: "This is the highlight query:" }
    }
  });

  // Get text contents
  const textContentsResults = await exa.getContents(["ids"]);

  // Get highlights
  const highlightsContentsResults = await exa.getContents(["ids"], {
    highlights: true
  });

  // Get contents with contents options
  const customGetContentsResults = await exa.getContents(["ids"], {
    text: { includeHtmlTags: true, maxCharacters: 1000 },
    highlights: { query: "This is the highlight query:" }
  });

  // Get answer to a question with citation contents
  const answerWithTextResults = await exa.answer("What is the population of New York City?", {
    text: true
  });

  // Get answer to a question with streaming
  for await (const chunk of exa.streamAnswer("What is the population of New York City?")) {
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
    if (chunk.citations) {
      console.log("\nCitations:", chunk.citations);
    }
  }
  ```
</CodeGroup>

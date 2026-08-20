> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Browserbase

> Combine Exa company search with Browserbase browser automation for job application workflows.

Use Exa to find companies and careers pages, then use Browserbase and Stagehand to inspect and interact with those pages.

## Install

Install the packages used by the Browserbase Exa template:

```bash npm theme={null}
npm install @browserbasehq/stagehand dotenv exa-js zod
```

## Configure environment variables

Set the API keys used by Exa and Browserbase:

```bash .env theme={null}
BROWSERBASE_API_KEY=your-browserbase-api-key
EXA_API_KEY=your-exa-api-key
```

## Search and interact with a page

The following example follows the template's workflow: search for companies, find a careers page, open it in a Browserbase session, extract the job description, and let a Stagehand agent interact with the page.

```typescript quickstart.ts theme={null}
import "dotenv/config";
import { Stagehand } from "@browserbasehq/stagehand";
import Exa from "exa-js";
import { z } from "zod";

const exa = new Exa(process.env.EXA_API_KEY);

const companies = await exa.search("AI startups in SF", {
  category: "company",
  type: "auto",
  numResults: 5,
  contents: { text: true },
});

const company = companies.results[0];
if (!company?.url) {
  throw new Error("No matching company found");
}

const companyDomain = new URL(company.url).hostname.replace("www.", "");
const careers = await exa.search(`${companyDomain} careers page`, {
  excludeDomains: ["linkedin.com"],
  type: "deep",
  numResults: 5,
  contents: { text: true },
});

const careersUrl = careers.results[0]?.url;
if (!careersUrl) {
  throw new Error("No careers page found");
}

const stagehand = new Stagehand({
  env: "BROWSERBASE",
  model: "google/gemini-2.5-pro",
});

try {
  await stagehand.init();
  const page = stagehand.context.pages()[0];
  await page.goto(careersUrl);

  const jobDescription = await stagehand.extract(
    "Extract the job title, requirements, responsibilities, and other important details from this page.",
    z.object({
      jobTitle: z.string(),
      requirements: z.array(z.string()),
      responsibilities: z.array(z.string()),
      details: z.string(),
    }),
  );

  const agent = stagehand.agent({
    mode: "hybrid",
    model: "google/gemini-3-flash-preview",
    systemPrompt: "Interact with the page without submitting an application.",
  });

  const result = await agent.execute({
    instruction: `Review this job posting and identify the next application step. Job details: ${JSON.stringify(jobDescription)}`,
    maxSteps: 10,
  });

  console.log(result);
} finally {
  await stagehand.close();
}
```

The template includes the complete workflow for extracting job details, generating tailored responses, and filling application forms. See the [TypeScript implementation](https://github.com/browserbase/templates/tree/dev/typescript/exa-browserbase) or [Python implementation](https://github.com/browserbase/templates/tree/dev/python/exa-browserbase).

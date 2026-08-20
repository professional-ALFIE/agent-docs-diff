> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Fiber.ai

> Search Fiber.ai's B2B database for companies, people, and LinkedIn profiles.

[Fiber.ai](https://fiber.ai) is a B2B data platform with fresh data on 40M+
companies, 850M+ people, and 30M+ jobs. Search live company, people, and job
data, and enrich incomplete records with work emails, personal emails, and
phone numbers.

## Use it for

* Cleaning up a CRM by reverse-looking-up a work or personal email to a person,
  or enriching a partial company/person record.
* Tracking real-time LinkedIn signals: job changes, promotions, new jobs,
  headcount changes, and fundraising.
* Finding relevant posts across LinkedIn, X, Instagram, TikTok, Reddit, and
  YouTube, pulling their comments and reactions, then enriching the authors'
  contact info.
* Searching across 40M+ companies and 850M+ people and enriching prospects with
  work email, personal email, and phone numbers.

## Provider ID

Use this value in `dataSources`:

```text theme={null}
fiber
```

## Example

Build a B2B prospecting list of Series A fintech companies in New York with 50–200 employees.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
              }
            }
          }
        }
      }
    }' | jq
  ```
</CodeGroup>

## Pairs well with

* [Similarweb](/docs/reference/agent-api/connect/similarweb): size up a prospect's web presence and competitors.
* [Baselayer](/docs/reference/agent-api/connect/baselayer): verify officers and registrations for shortlisted US businesses.
* [Particle](/docs/reference/agent-api/connect/particle): find what podcasts are saying about a company or executive.

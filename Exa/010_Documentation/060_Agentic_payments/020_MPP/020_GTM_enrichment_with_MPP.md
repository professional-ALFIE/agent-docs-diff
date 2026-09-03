> 원본: https://exa.ai/docs/reference/tempo-mpp-gtm-enrichment-cookbook.md

> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Tempo MPP GTM Enrichment Cookbook

> Build a GTM enrichment workflow that pays per Exa search and contents request with Tempo MPP — no API key required.

Use this cookbook to build a GTM enrichment agent or pipeline on top of Exa's
`/search` and `/contents` endpoints, paid per request through the Machine
Payments Protocol (MPP). MPP supports multiple payment methods; the examples
here use stablecoins on [Tempo](https://tempo.xyz). No monthly subscription, no
API key, and no seat-based pricing: fund a wallet with USDC.e and pay as you
enrich leads or companies.

<Info>
  MPP is currently supported on Exa's `/search` and `/contents` endpoints only.
  The Agent API (`/agent/runs`) and `/answer` require an Exa API key and go
  through the standard API key billing flow.
</Info>

## What you'll build

A lightweight enrichment pipeline that, given a list of company names or target
descriptions:

1. Uses Exa `/search` with `type: "deep"` and `output_schema` to find the
   official company page and extract key metadata.
2. Uses `contents.highlights` on the returned result to pull source snippets
   for funding, headquarters, employees, and product.
3. Emits a CSV or JSON enrichment record per input.

This pattern works for lead-list enrichment, account research, and outbound
personalization. Because it is composed of discrete `/search` + `/contents`
calls, every step can be paid for with MPP.

## Prerequisites

* A Tempo-compatible wallet funded with **USDC.e** on Tempo mainnet.
* A safe way to load the wallet private key at runtime (see below; never commit
  the key or expose it in source code).
* `mppx` (TypeScript) or `pympp` (Python) installed.

<Info>
  For a command-line setup that doesn't need a raw private key, use the [Tempo Wallet CLI](/docs/reference/mpp-guide#pay-from-the-command-line). `tempo wallet login` creates or connects a wallet and may include free MPP Credits for new sign-ups.
</Info>

## MPP setup

### Install the client

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

### Load your private key safely

Never hardcode a private key. The examples below read `WALLET_PRIVATE_KEY` from
your runtime environment for local development only. In production, load it from
a secrets manager such as 1Password, AWS Secrets Manager, or HashiCorp Vault.

<CodeGroup>
  ```bash TypeScript theme={null}
  # Set in your shell or CI secrets store; never commit this value
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # Set in your shell or CI secrets store; never commit this value
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

### Make a paid search request

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // In production, load this from a secrets manager — never commit the raw value.
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # In production, load this from a secrets manager — never commit the raw value.
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

A successful response returns Exa results plus a `Payment-Receipt` header with
the on-chain transaction hash.

### Make a paid contents request

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

## GTM enrichment recipe

### Enrich a list of companies

Given a list of company names, search for each company's page and extract
structured details.

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

### Enrich a person profile

This recipe uses `type: "deep"`, `contents.highlights`, and `output_schema` to
research a person and return a structured profile.

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  This uses `type: "deep"` for richer reasoning and `output_schema` to shape the
  response. Deep search is priced at \$0.012 per request, and
  `contents.highlights` adds \$0.001 per result.
</Note>

### Structured output

If you want JSON fields instead of raw text, use `output_schema` in the search
request. Exa returns an `output` object shaped to your schema.

```json theme={null}
{
  "query": "Series A fintech companies with 50-200 employees",
  "type": "deep-lite",
  "numResults": 5,
  "output_schema": {
    "type": "object",
    "properties": {
      "companies": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "headcount": { "type": "string" },
            "headquarters": { "type": "string" },
            "fundingStage": { "type": "string" }
          },
          "required": ["name"]
        }
      }
    },
    "required": ["companies"]
  }
}
```

<Note>
  `output_schema` works best with `deep-lite` or `deep` search types. It adds an
  LLM call on Exa's side, so it is priced as `deep-lite`/`deep`.
</Note>

## Pricing and limits

MPP uses the same per-request pricing as API key billing. MPP search requests
are capped at 10 results.

| Operation                                          | Price               |
| -------------------------------------------------- | ------------------- |
| `/search` with `type` `instant`, `auto`, or `fast` | \$0.007 per request |
| `/search` with `type` `deep-lite` or `deep`        | \$0.012 per request |
| `/search` with `type` `deep-reasoning`             | \$0.015 per request |
| `contents.text`                                    | \$0.001 per URL     |
| `contents.highlights`                              | \$0.001 per URL     |
| `contents.summary`                                 | \$0.001 per result  |

See [Pay with MPP (Tempo)](/docs/reference/mpp-guide) for the full reference,
including rate limits, network details, and payment headers.

## Production tips

* **Fund the wallet with USDC.e only.** Exa sponsors the Tempo network fee, so
  the wallet does not need a separate gas token.
* **Handle `402` responses.** The MPP SDK retries automatically, but a custom
  client should retry on `402` using the `WWW-Authenticate: Payment` challenge.
* **Cache `/contents` results.** Contents are priced per URL. Cache by URL to
  avoid paying twice for the same company page.
* **Watch the 10-result cap.** MPP search clamps `numResults` to 10.
* **Never commit private keys.** Load `WALLET_PRIVATE_KEY` from a secrets
  manager, not source control.

## FAQ

<AccordionGroup>
  <Accordion title="Can I use MPP with the Exa Agent API?">
    No. In the Exa codebase, MPP is wired only to `/search` and `/contents`.
    `/agent/runs` and `/answer` require an Exa API key and use standard API key
    billing.
  </Accordion>

  <Accordion title="Can I mix MPP and an Exa API key on the same request?">
    No. If a request includes `x-api-key` or `Authorization: Bearer`, the API
    key flow takes priority and MPP is bypassed.
  </Accordion>

  <Accordion title="What happens if MPP settlement fails?">
    Exa returns `402` with a fresh `WWW-Authenticate: Payment` challenge and no
    results. Your client can retry with a new payment. No results are returned
    until settlement succeeds.
  </Accordion>

  <Accordion title="Do I need a separate Tempo wallet per environment?">
    You can reuse the same wallet, but we recommend separate wallets for
    development and production. Per-wallet QPS is 10 requests/second across all
    requests from that wallet.
  </Accordion>
</AccordionGroup>

## Next steps

* [Pay with MPP (Tempo)](/docs/reference/mpp-guide): full MPP reference
* [Exa Search API guide](/docs/reference/search-api-guide): search parameter reference
* [Exa Contents API guide](/docs/reference/contents-api-guide): contents parameter reference
* [Tempo MPP docs](https://mpp.dev/protocol): protocol and SDK details

> 원본: https://docs.tavily.com/examples/agent-toolkit/skills_usecase.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.tavily.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Use Case Skills

> Pre-built agent skills for common research workflows: vendor risk, sales intelligence, competitor tracking, and more.

<Card title="View Source on GitHub" icon="github" href="https://github.com/tavily-ai/Use-Case-Skills" horizontal />

## What Are Use Case Skills?

Use case skills are outcome-oriented agent skills built on top of Tavily. Instead of wiring up search, extract, map, and crawl calls yourself, each skill packages the workflow, capability choices, and output format for a common job.

Where the [Agent Toolkit](/examples/agent-toolkit/overview) gives you programmable building blocks for Python agents, these skills give you ready-made workflows, organized by business use case, that an agent can invoke by name.

## Use Case Skills

Domain-specific research workflows.

<CardGroup cols={3}>
  <Card title="Vendor Risk & KYC Screening" icon="shield-halved" href="/examples/agent-toolkit/skills/vendor-risk-kyc-screening">
    Screen vendors, suppliers, and counterparties for sanctions, adverse media, and compliance risk.
  </Card>

  <Card title="Sales & Account Intelligence" icon="handshake" href="/examples/agent-toolkit/skills/sales-account-intelligence">
    Build account briefs with buyer research, org structure, and trigger events before a sales call.
  </Card>

  <Card title="Product & Competitor Intelligence" icon="boxes-stacked" href="/examples/agent-toolkit/skills/product-competitor-intelligence">
    Discover products, extract pricing and specs, and track competitors across their sites.
  </Card>

  <Card title="Threat Intelligence Enrichment" icon="bug" href="/examples/agent-toolkit/skills/threat-intelligence-enrichment">
    Enrich CVEs, IOCs, and security advisories with authoritative, source-grounded context.
  </Card>

  <Card title="Investment Research Briefs" icon="chart-line" href="/examples/agent-toolkit/skills/investment-research-briefs">
    Produce concise investor briefs, sector snapshots, and risk/catalyst memos.
  </Card>

  <Card title="Academic & Scientific Research" icon="graduation-cap" href="/examples/agent-toolkit/skills/academic-scientific-research">
    Find papers, methods, and evidence, and summarize scientific literature with citations.
  </Card>
</CardGroup>

## Utility Skills

Workflow utilities that solve one recurring operational problem, regardless of domain.

<CardGroup cols={3}>
  <Card title="Migrate to Tavily" icon="arrow-right-arrow-left" href="/examples/agent-toolkit/skills/migrate-to-tavily">
    Move existing Exa, Firecrawl, Perplexity, or Parallel integrations over to Tavily.
  </Card>

  <Card title="Fill Missing Fields" icon="table-list" href="/examples/agent-toolkit/skills/fill-missing-fields">
    Fill in missing fields on an existing list of companies, people, or products.
  </Card>

  <Card title="Build an Entity List" icon="layer-group" href="/examples/agent-toolkit/skills/build-entity-list">
    Build a deduplicated list of entities that match a given set of criteria.
  </Card>

  <Card title="Watch for Changes" icon="eye" href="/examples/agent-toolkit/skills/watch-for-changes">
    Monitor a page, site, or topic on a schedule and get notified only on real changes.
  </Card>

  <Card title="Past Research Search" icon="clock-rotate-left" href="/examples/agent-toolkit/skills/past-research-search">
    Find a past research run by topic instead of hunting for a run ID.
  </Card>
</CardGroup>

## Installing a Skill

Click any skill above to open its detail page, which links out to the corresponding `SKILL.md` on GitHub. To get all of the skills locally, clone the repo:

```bash theme={null}
git clone https://github.com/tavily-ai/Use-Case-Skills.git
```

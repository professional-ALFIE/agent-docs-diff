> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Stripe Projects

> Integrate Exa from your terminal using the Stripe Projects CLI.

[Stripe Projects](https://projects.dev) lets you and your coding agents provision third-party services from the terminal, with no dashboards and no copy-pasting keys. A single command creates an Exa account and syncs an API key into your project.

## Prerequisites

Install the Stripe CLI and the Projects plugin:

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

For other platforms and full CLI setup, see [Stripe Projects](https://projects.dev).

## Get started

From your project directory, initialize a project, add Exa, and pull credentials:

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

Your `.env` now contains an `EXA_API_KEY`. The [Exa SDKs](/docs/sdks/python-sdk) and [Quickstart](/docs/reference/search-api-guide) read this variable automatically, so your code works without any changes.

<Info>
  The key is provisioned in an Exa account you own. Manage usage, keys, and billing anytime from the [Exa Dashboard](https://dashboard.exa.ai).
</Info>

## Link an existing Exa team

Already have an Exa account? Connect it first so the API key is provisioned under your existing team:

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` opens Exa so you can authenticate and associate your team with your Stripe account. Open the linked Exa Dashboard anytime with `stripe projects open exa`.

## Provision from your coding agent

`stripe projects init` writes a Stripe Projects [Agent Skill](https://projects.dev) into your project, so you can let your agent (Claude Code, Cursor, Codex, and others) run the flow for you:

```
Use Stripe Projects to add Exa and wire up the API key.
```

## Next steps

* [Quickstart](/docs/reference/search-api-guide): make your first Exa search with our SDKs.
* [Stripe Projects docs](https://docs.stripe.com/projects): full CLI reference, environments, and billing.
* [Exa Dashboard](https://dashboard.exa.ai): manage API keys, usage, and billing.
* [Provider catalog](https://projects.dev): browse all Stripe Projects providers.

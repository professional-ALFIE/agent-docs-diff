> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Agent Skills

> Install Exa agent skills into Claude Code, Cursor, Codex, or any Agent Skills–compatible coding agent.

Exa agent skills give coding agents ready-made workflows for search, research, and building with the Exa API. Each skill is a portable `SKILL.md` that follows the open [Agent Skills](https://agentskills.io) standard, so the same file installs into Claude Code, Codex, Cursor, or any compatible agent.

Skills live in the open-source [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills) repository.

<Note>
  You need an Exa API key. Create one in the [Exa Dashboard](https://dashboard.exa.ai/api-keys), then set `EXA_API_KEY` in your agent environment.
</Note>

## Install

Install every Exa skill at once:

```bash theme={null}
npx skills add exa-labs/agent-skills
```

Or open a skill page below and copy its setup prompt into your agent. That prompt installs just that skill, checks for an API key without printing it, and smoke-tests the key.

## Skills

Each skill page includes a one-line description, a copyable setup prompt, and a link to the raw `SKILL.md` source.

<CardGroup cols={2}>
  <Card title="Build with Exa" icon="rocket" href="/docs/reference/agent-skills/build-with-exa">
    Build applications and agents with Exa's full API platform.
  </Card>

  <Card title="Company Research" icon="building" href="/docs/reference/agent-skills/company-research">
    Deep company research with the Exa Agent API, plus quick company-category lookups.
  </Card>

  <Card title="Lead Generation" icon="user-group" href="/docs/reference/agent-skills/lead-generation">
    Generate enriched, ICP-scored lead lists as CSV using the Exa Agent API.
  </Card>

  <Card title="Exa Search" icon="magnifying-glass" href="/docs/reference/agent-skills/exa-search">
    Call Exa Search directly with cURL or raw HTTP.
  </Card>

  <Card title="Exa Contents" icon="file-lines" href="/docs/reference/agent-skills/exa-contents">
    Call Exa Contents directly with cURL or raw HTTP.
  </Card>
</CardGroup>

## Related

<CardGroup cols={2}>
  <Card title="Skills repository" icon="github" href="https://github.com/exa-labs/agent-skills">
    Source for every skill, including raw `SKILL.md` files.
  </Card>

  <Card title="Exa MCP" icon="plug" href="/docs/reference/exa-mcp">
    Connect Claude, Cursor, VS Code, and other clients to Exa over MCP.
  </Card>
</CardGroup>

> 원본: https://vibekanban.com/docs/settings/index.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Settings Overview

> Configure application-wide settings including themes, editor, agents, and more

The Settings dialog provides a streamlined, tabbed interface for configuring Vibe Kanban.

## Accessing Settings

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-accessing.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=8f8bfbac496df3839c02a82c507d8a78" alt="Workspaces navbar showing the Settings gear icon with tooltip" width="1350" height="572" data-path="images/settings-accessing.png" />
</Frame>

* Click the **Settings** icon (<Icon icon="gear" />) in the Workspaces navbar
* Press `Cmd/Ctrl + K` and select **Settings**

## Settings Tabs

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-general.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=d3f85d4476b0a077f7020a37129ee596" alt="Settings dialog showing the tabbed interface with General, Projects, Repositories, Organization Settings, Agents, and MCP Servers tabs" width="1976" height="1530" data-path="images/settings-general.png" />
</Frame>

The settings dialog is organised into the following tabs:

| Tab                       | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| **General**               | Appearance, default agent, editor, git, and notifications |
| **Projects**              | Project-specific settings                                 |
| **Repositories**          | Repository scripts (dev server, setup, cleanup)           |
| **Organization Settings** | Organisation members, invitations, and settings           |
| **Remote Projects**       | Cloud-synced projects across organisations                |
| **Agents**                | Agent profiles and variants                               |
| **MCP Servers**           | Model Context Protocol server configuration               |

## General

Configure appearance, default agent, editor, git preferences, notifications, and tags.

<Card title="General Settings" icon="gear" href="/docs/settings/general">
  Complete guide to general settings including appearance, editor configuration, and more
</Card>

## Projects & Repositories

Configure project-specific settings and repository scripts including dev server, setup, and cleanup commands.

<Card title="Projects & Repositories" icon="folder-tree" href="/docs/settings/projects-repositories">
  Configure project settings and repository scripts
</Card>

## Organization Settings

Manage your Cloud organisations, invite team members, and configure organisation-level settings.

<Card title="Organisation Settings" icon="buildings" href="/docs/settings/organization-settings">
  Manage members, invitations, and organisation settings
</Card>

## Remote Projects

View and manage all your Cloud-synced projects across organisations. Create, edit, and delete projects from a centralised interface.

<Card title="Remote Projects" icon="cloud" href="/docs/settings/remote-projects">
  Manage Cloud projects across all your organisations
</Card>

## Agents

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-agents.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=59f1a256d29a1128207b80ad49c27731" alt="Agents tab showing agent list, configuration variants, and settings options" width="2032" height="1580" data-path="images/settings-agents.png" />
</Frame>

Define and customise agent variants using a form-based interface. The Agents tab uses a finder-style two-column layout:

* **Left column (Agents)** - Available coding agents (Claude Code, Codex, Opencode, Cursor Agent, etc.)
* **Right column (Configurations)** - Different variants for the selected agent (Default, Opus, Approvals, Plan, etc.)

<Card title="Agent Profiles & Variants" icon="robot" href="/docs/settings/agent-configurations">
  Detailed guide with examples for configuring agent variants
</Card>

## MCP Servers

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-mcp.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=7ae9ab9d864b00f5142cfe830d6c3c02" alt="MCP Servers tab showing agent selection, JSON configuration, and popular servers" width="2032" height="1580" data-path="images/settings-mcp.png" />
</Frame>

Configure Model Context Protocol servers to extend coding agent capabilities with custom tools and resources.

* **Agent** - Choose which agent to configure MCP servers for (e.g., Claude Code)
* **Server Configuration (JSON)** - Edit the MCP server configuration directly in JSON format
* **Popular servers** - Click a card to insert a pre-configured MCP server into the JSON

<Card title="Connecting MCP Servers" icon="server" href="/docs/settings/mcp-servers">
  Configure MCP servers within Vibe Kanban for your coding agents
</Card>

## Related Documentation

* [Workspaces](/docs/workspaces/index) - The Workspaces UI where settings are accessed

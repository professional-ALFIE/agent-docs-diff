> 원본: https://vibekanban.com/docs/settings/general.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Configure appearance, default agent, editor, git, and notification preferences

The General tab contains application-wide settings for appearance, default agent, editor configuration, git preferences, and notifications.

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-general.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=d3f85d4476b0a077f7020a37129ee596" alt="General settings tab showing appearance, default agent, and editor options" width="1976" height="1530" data-path="images/settings-general.png" />
</Frame>

## Appearance

Customise how the application looks and feels:

* **Theme** - Choose between Light and Dark colour schemes
* **Language** - Select your preferred language (Browser Default follows your system language)

## Default Coding Agent

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-default-coding-agent.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=1dc49a2d4fb6c5e676bfc253f1ed3e6c" alt="Default Coding Agent section showing agent and variant dropdowns" width="2094" height="716" data-path="images/settings-default-coding-agent.png" />
</Frame>

Set the coding agent that will be used by default when creating new task attempts or follow-ups.

* **Agent** - Select your preferred coding agent (e.g., Claude Code, Gemini CLI, Codex). This determines which AI assistant handles your coding tasks.
* **Variant** - Choose a configuration variant for the selected agent (e.g., Default, Opus, Approvals). Variants contain different settings like planning mode, model selection, or permission levels.

The selected agent and variant appear pre-selected in the attempt creation dialog, saving you time when starting new tasks.

<Tip>
  You can override the default agent configuration per attempt in the create attempt dialog. The default is just a convenience for your most common workflow.
</Tip>

## Editor

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-editor.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=7a8798c40b9fa675988a35ef1f417312" alt="Editor settings showing Editor Type dropdown and Remote SSH Host input" width="1316" height="610" data-path="images/settings-editor.png" />
</Frame>

Configure your code editing experience.

### Selecting Your Editor

Choose from various supported editors:

* **VS Code** - Microsoft's popular code editor
* **Cursor** - VSCode fork with AI-native features
* **Windsurf** - VSCode fork optimised for collaborative development
* **Zed** - High-performance code editor
* **Antigravity** - Google's AI-native code editor
* **Neovim**, **Emacs**, **Sublime Text** - Other popular editors
* **Custom** - Use a custom shell command

### Custom Editor Example

When selecting **Custom**, you can specify any shell command to open files. The command receives the file or directory path as an argument.

```bash theme={null}
# Example: Open with IntelliJ IDEA
idea

# Example: Open with Sublime Text (custom path)
/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl

# Example: Open with a custom script
~/scripts/open-editor.sh
```

### Opening Your Editor

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-open-in-ide.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=33574b49bd8f613771406c274cea62c1" alt="Open in IDE option in the context bar" width="1310" height="754" data-path="images/settings-open-in-ide.png" />
</Frame>

Once configured, you can open your editor from several places:

* **Context bar** - Click your IDE logo icon in the floating context bar to open the workspace
* **Command bar** - Press `Cmd/Ctrl + K` and select "Open in IDE"

<Tip>
  The context bar shows your configured IDE's logo. For more details, see the [Workspaces Interface Guide](/docs/workspaces/interface).
</Tip>

## Remote SSH Configuration

When running Vibe Kanban on a remote server (e.g., accessed via Cloudflare tunnel, ngrok, or as a systemctl service), you can configure VSCode-based editors to open projects via SSH instead of assuming localhost.

This feature is available for **VS Code**, **Cursor**, and **Windsurf** editors.

### When to Use Remote SSH

Enable remote SSH configuration when:

* Vibe Kanban runs on a remote server (VPS, cloud instance, etc.)
* You access the web UI through a tunnel or reverse proxy
* Your code files are on a different machine than your browser
* You want your local editor to connect to the remote server via SSH

### Configuration Fields

* **Remote SSH Host** (Optional) - The hostname or IP address of your remote server (e.g., `example.com`, `192.168.1.100`, `my-server`). Must be accessible via SSH from your local machine.

### How It Works

When remote SSH is configured, clicking "Open in Editor" (or Cursor/Windsurf):

1. Generates a special protocol URL like: `vscode://vscode-remote/ssh-remote+user@host/path/to/project`
2. Opens in your default browser, which launches your local editor
3. Your editor connects to the remote server via SSH
4. The project or task worktree opens in the remote context

This works for both project-level and task worktree opening.

### Prerequisites

* SSH access configured between your local machine and remote server
* SSH keys or credentials set up (no password prompts)
* VSCode Remote-SSH extension installed (or equivalent for Cursor/Windsurf)
* The remote server path must be accessible via SSH

<Tip>
  Test your SSH connection first with `ssh user@host` to ensure it works without prompting for passwords.
</Tip>

## Git

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-git.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=2c09e3625e310fd16aec304ccfd85209" alt="Git settings showing Branch Prefix and Workspace Directory fields" width="1896" height="892" data-path="images/settings-git.png" />
</Frame>

Configure git branch naming and workspace storage preferences.

### Branch Prefix

Set a prefix for auto-generated branch names. When you create a new workspace or task, Vibe Kanban automatically creates a git branch for your changes.

| Prefix Setting | Example Branch Name           |
| -------------- | ----------------------------- |
| `vk`           | `vk/1a2b-implement-auth`      |
| `feature`      | `feature/1a2b-implement-auth` |
| *(empty)*      | `1a2b-implement-auth`         |

<Tip>
  Use a prefix that matches your team's branching conventions (e.g., `feature`, `fix`, or your initials).
</Tip>

### Workspace Directory

Specify where Vibe Kanban stores workspace data. Workspaces are created in a `.vibe-kanban-workspaces` subdirectory within this path.

* **Default location** - Leave empty to use the system default (typically your home directory)
* **Custom location** - Set a specific path if you prefer workspaces on a different drive or directory

<Warning>
  Changes to Workspace Directory require an app restart. Existing workspaces remain in their original location.
</Warning>

## Notifications

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-notifications.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=bcf3f2c1954b17d54fb1bd520ba9b643" alt="Notifications settings showing sound effects and push notifications toggles" width="1756" height="836" data-path="images/settings-notifications.png" />
</Frame>

Configure how Vibe Kanban alerts you about task progress and status changes.

* **Sound Effects** - Play audio notifications when tasks complete, need attention, or encounter errors. Useful when working with multiple tasks or when Vibe Kanban runs in a background tab.
* **Push Notifications** - Receive browser notifications even when Vibe Kanban isn't in focus. Requires browser permission when first enabled.

<Tip>
  Enable notifications if you frequently run long-running tasks and want to be alerted when they complete or need your attention.
</Tip>

## Telemetry

Enable or disable telemetry data collection to help improve Vibe Kanban.

## Message Input

Choose the keyboard shortcut to send messages in the chat input (`Enter` or `⌘/Ctrl + Enter`).

## Tags

<Frame>
  <img src="https://mintcdn.com/vibekanban/AarTdrkhni3X9r3h/images/settings-tags.png?fit=max&auto=format&n=AarTdrkhni3X9r3h&q=85&s=4f8dc883a2d26078daaea68cfda81fbb" alt="Tags section showing task tags table with tag names, content, and actions" width="2122" height="980" data-path="images/settings-tags.png" />
</Frame>

Create reusable text snippets that can be inserted into workspace prompts using `@tag_name`.

* **Add Tag +** - Create a new tag
* **Tag Name** - The @mention name for the tag
* **Content** - The text that will be inserted
* **Actions** - Edit or delete existing tags

<Card title="Learn more about tags" icon="tag" href="/docs/settings/creating-task-tags">
  Complete guide to creating and managing tags
</Card>

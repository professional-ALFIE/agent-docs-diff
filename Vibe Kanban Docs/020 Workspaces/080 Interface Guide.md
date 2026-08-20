> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Interface Guide

> Understanding the Workspaces four-panel layout and navigation

<Frame>
  <img style={{maxHeight: "400px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-interface-overview.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=2a007b9a822397b9b0f517d5ff31476c" alt="Workspaces interface showing the four-panel layout with labels for each section" width="3430" height="1348" data-path="images/workspaces-interface-overview.png" />
</Frame>

The Workspaces UI uses a flexible four-panel layout designed for efficient AI-assisted development workflows.

## Panel Overview

| Panel                  | Position   | Purpose                                       |
| ---------------------- | ---------- | --------------------------------------------- |
| **Workspace Sidebar**  | Left edge  | List of all workspaces with status indicators |
| **Conversation Panel** | Left main  | Chat with coding agents, session management   |
| **Context Panel**      | Right main | Changes, logs, or preview (toggleable)        |
| **Details Sidebar**    | Right edge | Git status, terminal, notes                   |

## Navbar

The navbar at the top of the workspace provides quick access to common actions.

### Left Section

|                   Icon                   | Action            | Description                     |
| :--------------------------------------: | ----------------- | ------------------------------- |
|        <Icon icon="box-archive" />       | Archive Workspace | Move workspace to/from archive  |
| <Icon icon="arrow-right-from-bracket" /> | Open in Old UI    | Switch to the classic interface |

### Right Section - Panel Controls

|             Icon             | Action               | Description                      |
| :--------------------------: | -------------------- | -------------------------------- |
|    <Icon icon="sidebar" />   | Toggle Left Sidebar  | Show/hide the workspace list     |
|   <Icon icon="comments" />   | Toggle Chat Panel    | Show/hide the conversation panel |
| <Icon icon="code-compare" /> | Toggle Changes       | Show/hide the changes panel      |
|   <Icon icon="terminal" />   | Toggle Logs          | Show/hide the logs panel         |
|    <Icon icon="desktop" />   | Toggle Preview       | Show/hide the preview panel      |
| <Icon icon="sidebar-flip" /> | Toggle Right Sidebar | Show/hide the details sidebar    |

### Right Section - Utilities

|               Icon              | Action           | Description                    |
| :-----------------------------: | ---------------- | ------------------------------ |
|       <Icon icon="list" />      | Command Bar      | Open the command bar           |
|     <Icon icon="bullhorn" />    | Feedback         | Send feedback about Workspaces |
| <Icon icon="circle-question" /> | Workspaces Guide | Open the onboarding guide      |
|       <Icon icon="gear" />      | Settings         | Open application settings      |

<Tip>
  When the Changes panel is open, additional diff controls appear for toggling between side-by-side and inline views.
</Tip>

## Workspace Sidebar

<Frame>
  <img style={{maxHeight: "350px"}} src="https://mintcdn.com/vibekanban/RasI-IDzFWa02fCE/images/workspaces-sidebar.png?fit=max&auto=format&n=RasI-IDzFWa02fCE&q=85&s=e209c87032370fbf073db027b4030342" alt="Workspace sidebar in flat list layout showing workspaces with timestamps and change counts" width="1188" height="1410" data-path="images/workspaces-sidebar.png" />
</Frame>

The left sidebar displays all your workspaces at a glance.

Switch to accordion layout to group workspaces by status:

<Frame>
  <img style={{maxHeight: "350px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-sidebar-accordion.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=1e4fc551ae42439497a74ae2557a2cfd" alt="Workspace sidebar in accordion layout grouped by Needs Attention, Idle, and Running" width="882" height="1618" data-path="images/workspaces-sidebar-accordion.png" />
</Frame>

### Status Indicators

Each workspace shows its current state:

| Indicator           | Meaning                                      |
| ------------------- | -------------------------------------------- |
| **Running**         | Agent is actively processing                 |
| **Idle**            | Waiting for input                            |
| **Needs Attention** | Pending approval required (raised hand icon) |
| **Pinned**          | Workspace pinned to top of list              |
| **Dev Server**      | Blue indicator when dev server is running    |
| **PR Status**       | Badge showing linked pull request status     |

### Workspace Actions

* **Search**: Filter workspaces by name or branch
* **Pin**: Keep important workspaces at the top
* **Archive**: Move completed workspaces out of the main list
* **Layout toggle**: Switch between flat list and accordion (grouped by status)

### Creating a New Workspace

<Frame>
  <img style={{maxHeight: "400px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-create-new.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=9431006b86137f7921cea234910f1c1d" alt="Create Workspace view showing project selection, repositories panel, and task description input" width="3427" height="1341" data-path="images/workspaces-create-new.png" />
</Frame>

Click the **+** button at the top of the sidebar to create a new workspace. The interface switches to create mode:

1. **Select a project** from the Project dropdown in the right sidebar
2. **Add repositories** - click repos from the "Add Repositories" list or browse for repos on disk
3. **Set target branch** - each selected repo shows its target branch (click to change)
4. **Describe your task** in the chat input at the bottom
5. **Select an agent** (e.g., Claude Code) and variant
6. Click **Create** to start the workspace

<Note>
  For detailed instructions, see [Creating Workspaces](/docs/workspaces/creating-workspaces) and [Repositories](/docs/workspaces/repositories).
</Note>

## Conversation Panel

<Frame>
  <img style={{maxHeight: "400px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-conversation.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=e96dcfe8552b5107e8fd664da5e48169" alt="Conversation panel showing chat history with coding agent and session switcher" width="1180" height="1342" data-path="images/workspaces-conversation.png" />
</Frame>

The left main panel is where you interact with coding agents.

### Chat Interface

* View the full conversation history with the agent
* Send messages and follow-up instructions
* Rich text support for formatting
* Approval workflows for reviewing agent plans
* Agent and variant selection

See [Chat Interface](/docs/workspaces/chat-interface) for the complete guide.

### Session Dropdown

The chat box toolbar includes a session dropdown that lets you:

* View all sessions in the workspace
* Switch between sessions (shows "Latest" or timestamp)
* Create a new session by selecting "New Session"

<Tip>
  Create multiple sessions to work around conversation token limits or to run different agents in parallel.
</Tip>

See [Sessions](/docs/workspaces/sessions) for more details on managing multiple sessions.

### Chat Shortcuts

| Shortcut                   | Action                |
| -------------------------- | --------------------- |
| `Cmd/Ctrl + Enter`         | Send message          |
| `Shift + Cmd/Ctrl + Enter` | Alternative send mode |
| `Cmd/Ctrl + B`             | Bold text             |
| `Cmd/Ctrl + I`             | Italic text           |
| `Cmd/Ctrl + U`             | Underline text        |

## Context Panel

The right main panel toggles between three views:

### Changes View

<Frame>
  <img style={{maxHeight: "400px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-changes-panel.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=224068a135e853a859c8eb50e6d81838" alt="Changes panel showing file tree and diff viewer with code changes" width="2269" height="1618" data-path="images/workspaces-changes-panel.png" />
</Frame>

Displays all modified files with inline diffs:

* **File tree**: Hierarchical view of changed files
* **Search**: Filter files by name
* **Diff viewer**: See code changes with syntax highlighting
* **Comments**: Add inline comments for agent feedback

### Logs View

<Frame>
  <img style={{maxHeight: "350px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-logs-panel.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=3d29f093bd7ba7204b4dadc5aeaad5c9" alt="Logs panel showing process output with tabs for different processes" width="1705" height="1291" data-path="images/workspaces-logs-panel.png" />
</Frame>

Shows process execution logs:

* **Process tabs**: Switch between different running processes
* **Log output**: View stdout/stderr in real-time
* **Search logs**: Filter log content

### Preview View

<Frame>
  <img style={{maxHeight: "400px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-preview-panel.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=3e3cee6e4a00cd07c208da378c6b00d9" alt="Preview panel showing built-in browser with dev server output" width="2398" height="1714" data-path="images/workspaces-preview-panel.png" />
</Frame>

Built-in browser for testing your application:

* **Dev server tabs**: Multiple dev servers supported
* **Device modes**: Desktop, mobile, custom viewport
* **Process logs**: View dev server output

Toggle between views using the navbar buttons or the [command bar](/docs/workspaces/command-bar).

## Details Sidebar

The right sidebar provides quick access to workspace details.

### Git Section

<Frame>
  <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-git-panel.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=4c15429e578e26dffe3d9641f7784158" alt="Git section showing repository, branch, and pull request options" width="1598" height="1342" data-path="images/workspaces-git-panel.png" />
</Frame>

Always visible, showing:

* Current repository and branch
* Target branch for merging
* Uncommitted changes count
* Commits ahead/behind target
* Quick access to [git operations](/docs/workspaces/git-operations)

See [Repositories](/docs/workspaces/repositories) for details on managing repositories and branches.

### Terminal Section

<Frame>
  <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/RasI-IDzFWa02fCE/images/workspaces-terminal.png?fit=max&auto=format&n=RasI-IDzFWa02fCE&q=85&s=fb3ee9ab929f1a816454d6a163090b97" alt="Integrated terminal in the details sidebar showing command output" width="1720" height="542" data-path="images/workspaces-terminal.png" />
</Frame>

<Note>
  The integrated terminal is a new feature exclusive to the Workspaces UI and is not available in the classic interface.
</Note>

The expandable terminal lets you run commands directly in your workspace:

* **Full terminal emulation** powered by xterm.js
* **Run any command** - git, npm, build scripts, etc.
* **Persistent state** - terminal persists across panel toggles
* **Expandable** - collapse when not needed, expand when you need it

### Notes Section

<Frame>
  <img style={{maxHeight: "250px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-notes.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=6dc55420411c23c07e1ea276d5ae99da" alt="Notes section in the details sidebar showing rich text editor with workspace notes" width="1784" height="826" data-path="images/workspaces-notes.png" />
</Frame>

<Note>
  Workspace notes are a new feature exclusive to the Workspaces UI and are not available in the classic interface.
</Note>

The expandable notes section lets you document important information:

* **Auto-save** - Notes save automatically as you type
* **Per-workspace** - Each workspace has its own notes
* **Persistent** - Notes are preserved across sessions

## Context Bar

<Frame>
  <img style={{maxHeight: "150px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-context-bar.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=a33c6dee5961c21862bc6ae414744191" alt="Context bar floating toolbar showing quick action buttons" width="874" height="1296" data-path="images/workspaces-context-bar.png" />
</Frame>

A floating toolbar that provides quick access to common actions:

|             Icon            | Action            | Description                                                      |
| :-------------------------: | ----------------- | ---------------------------------------------------------------- |
|          *IDE logo*         | Open in IDE       | Launch workspace in your configured editor (icon shows your IDE) |
|     <Icon icon="copy" />    | Copy Path         | Copy the workspace path to clipboard                             |
|     <Icon icon="play" />    | Toggle Dev Server | Start or stop the development server                             |
|   <Icon icon="desktop" />   | Toggle Preview    | Show or hide the preview panel                                   |
| <Icon icon="code-branch" /> | Toggle Changes    | Show or hide the changes panel                                   |

<Tip>
  The context bar is draggable - position it wherever works best for your workflow.
</Tip>

## Resizing Panels

Drag the separators between panels to adjust their proportions. Your layout preferences are saved per workspace.

## Toggling Panels

Show or hide panels to focus on what matters:

* Use the navbar toggle buttons
* Use the [command bar](/docs/workspaces/command-bar) with `Cmd/Ctrl + K`
* View Options commands let you toggle any panel

<Info>
  Panel states are remembered, so your preferred layout is restored when you return to a workspace.
</Info>

## Related Documentation

* [Creating Workspaces](/docs/workspaces/creating-workspaces) - Step-by-step guide to creating workspaces
* [Repositories](/docs/workspaces/repositories) - Managing repositories and branches
* [Sessions](/docs/workspaces/sessions) - Working with multiple conversation sessions
* [Chat Interface](/docs/workspaces/chat-interface) - Complete guide to the conversation panel
* [Command Bar](/docs/workspaces/command-bar) - Master keyboard shortcuts and quick actions
* [Browser Testing](/docs/browser-testing) - Built-in browser for testing your application
* [Changes Panel](/docs/workspaces/changes) - Review code modifications and provide feedback
* [Git Operations](/docs/workspaces/git-operations) - Create PRs, merge, rebase, and manage branches

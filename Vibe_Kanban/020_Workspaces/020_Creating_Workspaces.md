> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Creating Workspaces

> Learn how to create and configure workspaces for your development tasks

<Frame>
  <img style={{maxHeight: "400px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-create-new.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=9431006b86137f7921cea234910f1c1d" alt="Create workspace view showing project selection, repository list, and task input" width="3427" height="1341" data-path="images/workspaces-create-new.png" />
</Frame>

A workspace is your task execution environment where you work with coding agents. Each workspace can include one or more repositories and supports multiple conversation sessions.

## What Happens When You Create a Workspace

Understanding what happens behind the scenes helps you work more effectively:

<Steps>
  <Step title="Git worktree is created">
    Vibe Kanban creates a **git worktree** - a separate working directory with its own branch. This keeps your changes isolated from your main codebase. Your original repository remains untouched.
  </Step>

  <Step title="Working branch is created">
    A new branch is created based on your target branch (e.g., `main`). The branch name is auto-generated based on your task (e.g., `vk/abc123-add-login-page`).
  </Step>

  <Step title="Agent session starts">
    A coding agent is initialised and ready to receive your instructions. The agent can read files, make changes, and run commands within your workspace.
  </Step>

  <Step title="Setup scripts run (if configured)">
    If your repository has setup scripts configured (e.g., `npm install`), they run automatically to prepare the environment.
  </Step>
</Steps>

<Info>
  **Where do workspaces live?** Worktrees are created in a `.vibe-kanban-workspaces` directory (configurable in Settings → General → Workspace Directory). Each workspace gets its own folder.
</Info>

## Creating a New Workspace

<Steps>
  <Step title="Open the Create View">
    Click the **+** button at the top of the workspace sidebar, or use the command bar (`Cmd/Ctrl + K`) and select **New Workspace**.

    <Frame>
      <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-sidebar-create-button.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=6c9e9c0cfbb528c26cf2b9cf2973566d" alt="Workspace sidebar showing the plus button for creating new workspaces" width="1580" height="1218" data-path="images/workspaces-sidebar-create-button.png" />
    </Frame>
  </Step>

  <Step title="Select a Project">
    Choose a project from the **Project** dropdown in the right panel. Projects group related repositories together.

    <Frame>
      <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-select-project.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=4c9f352d55bcde8173d37a2c72238943" alt="Project dropdown showing selected project" width="1580" height="1218" data-path="images/workspaces-select-project.png" />
    </Frame>

    <Note>
      If you haven't created a project yet, see [Creating a New Project](#creating-a-new-project) below.
    </Note>
  </Step>

  <Step title="Add Repositories">
    <Frame>
      <img style={{maxHeight: "350px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-add-repo.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=b2642a38e3f44b8a99973c27134c836e" alt="Repository selection showing selected repo with branch dropdown and list of available repositories" width="902" height="1558" data-path="images/workspaces-add-repo.png" />
    </Frame>

    Select which repositories to include in your workspace:

    * **Recent repositories** - Click any repo from the list to add it
    * **Browse repos on disk** - Find repositories not in the recent list
    * **Create new repo on disk** - Initialise a new git repository

    <Tip>
      You can add multiple repositories to a single workspace if your task spans multiple codebases. Each repository maintains independent git state.
    </Tip>
  </Step>

  <Step title="Set Target Branches">
    For each selected repository, set the **target branch** - this is the branch your changes will eventually be merged into (e.g., `main` or `develop`).

    Click the branch dropdown next to each repository to change the target branch.

    <Info>
      **Target branch vs Working branch - what's the difference?**

      * **Target branch** = Where your changes will eventually be merged (e.g., `main`). You set this.
      * **Working branch** = Where your changes are made (e.g., `vk/abc123-task-name`). Auto-created from target.

      Your changes are made on the working branch and don't affect the target until you create and merge a PR.
    </Info>
  </Step>

  <Step title="Describe Your Task">
    In the chat input at the bottom, describe what you want to accomplish. Be specific about:

    * What feature or fix you need
    * Any constraints or requirements
    * Files or areas of the codebase to focus on

    <Tip>
      Clear, detailed task descriptions help the agent understand your requirements and produce better results.
    </Tip>
  </Step>

  <Step title="Select an Agent">
    Choose which coding agent to use from the **Agent** dropdown. Available agents depend on your configuration.

    <Note>
      See [Agent Configurations](/docs/settings/agent-configurations) for details on setting up different agents.
    </Note>
  </Step>

  <Step title="Create the Workspace">
    Click **Create** to start the workspace. The agent will begin working on your task immediately.
  </Step>
</Steps>

## Creating a New Project

If you need to create a new project before setting up your workspace:

<Steps>
  <Step title="Open the Project Dropdown">
    In the create workspace view, click the **Project** dropdown.

    <Frame>
      <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-project-dropdown.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=3a98a6e595b86584a2a01fcc04d22c76" alt="Project dropdown showing Create new project option and list of existing projects" width="644" height="828" data-path="images/workspaces-project-dropdown.png" />
    </Frame>
  </Step>

  <Step title="Select Create New Project">
    Click **+ Create new project** at the top of the dropdown list.
  </Step>

  <Step title="Enter Project Details">
    <Frame>
      <img style={{maxHeight: "250px"}} src="https://mintcdn.com/vibekanban/QA35mU65cg2kMRzj/images/workspaces-create-project.png?fit=max&auto=format&n=QA35mU65cg2kMRzj&q=85&s=538bb3606c1f0a94696e126c6f65efd1" alt="Create Project dialog with name field" width="1732" height="694" data-path="images/workspaces-create-project.png" />
    </Frame>

    Enter a name for your project and click **Create**.
  </Step>

  <Step title="Continue with Workspace Creation">
    Your new project is automatically selected. Continue adding repositories and configuring your workspace.
  </Step>
</Steps>

<Note>
  After creating a project, you can configure additional settings like setup scripts, dev server scripts, and cleanup scripts in the project settings. See [Projects & Repositories](/docs/settings/projects-repositories) for more details.
</Note>

## Workspace Settings

Once a workspace is created, you can configure additional settings:

### Working Branch

The workspace automatically creates a working branch for your changes. You can view and change this in the **Git** section of the details sidebar.

### Dev Server

If your project has a dev server script configured, you can start it using:

* The **Play** icon (<Icon icon="play" />) in the context bar
* The command bar: `Cmd/Ctrl + K` → **Start Dev Server**

<Note>
  Configure dev server scripts in your project settings. See [Projects & Repositories](/docs/settings/projects-repositories) for setup instructions.
</Note>

### Workspace Notes

Use the **Notes** section in the details sidebar to document important information about the workspace - requirements, decisions, or anything you want to remember.

## Duplicating a Workspace

To create a copy of an existing workspace:

1. Open the command bar (`Cmd/Ctrl + K`)
2. Go to **Workspace Actions**
3. Select **Duplicate Workspace**

The duplicate includes the same repositories and branch configuration but starts with a fresh conversation.

## Archiving Workspaces

When you're done with a workspace, archive it to keep your workspace list clean:

**From the navbar:**

* Click the **Archive** button (<Icon icon="box-archive" />) in the top left of the navbar

**From the command bar:**

1. Press `Cmd/Ctrl + K`
2. Go to **Workspace Actions** → **Archive**

Archived workspaces can be viewed by clicking **View Archive** at the bottom of the sidebar.

<Tip>
  Use the **Pin** feature to keep important active workspaces at the top of your list.
</Tip>

## Troubleshooting

<AccordionGroup>
  <Accordion title="I can't see my repository in the list">
    **Possible causes:**

    * The repository hasn't been added to a project yet
    * The folder isn't a git repository (no `.git` folder)
    * The path isn't accessible

    **Solutions:**

    1. Click **Browse repos on disk** to manually locate the repository
    2. Ensure the folder contains a `.git` directory
    3. Check that Vibe Kanban has permission to access the folder
  </Accordion>

  <Accordion title="Workspace creation fails">
    **Possible causes:**

    * Git worktree creation failed (usually due to uncommitted changes in the original repo)
    * Branch name conflict
    * Disk space issues

    **Solutions:**

    1. Commit or stash any uncommitted changes in your original repository
    2. Try a different target branch
    3. Check available disk space (worktrees require space for a full copy of tracked files)
  </Accordion>

  <Accordion title="Agent doesn't start after creating workspace">
    **Possible causes:**

    * Agent isn't installed or configured
    * API key issues
    * Network connectivity problems

    **Solutions:**

    1. Check that your agent (e.g., Claude Code) is installed: run the CLI command manually in terminal
    2. Verify API keys are configured in Settings → Agents
    3. Check your internet connection
  </Accordion>

  <Accordion title="Setup script fails">
    **Possible causes:**

    * Script has errors
    * Missing dependencies
    * Wrong working directory

    **Solutions:**

    1. Test the script manually in terminal first
    2. Check the Logs panel for error messages
    3. Ensure paths in the script are relative to the repository root
  </Accordion>
</AccordionGroup>

## Related Documentation

* [Interface Guide](/docs/workspaces/interface) - Learn about the workspace layout and panels
* [Multi-Repo & Sessions](/docs/workspaces/multi-repo-sessions) - Working with multiple repositories
* [Sessions](/docs/workspaces/sessions) - Creating and managing conversation sessions
* [Command Bar](/docs/workspaces/command-bar) - Quick actions and keyboard shortcuts

> 원본: https://vibekanban.com/docs/getting-started.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Started

> Launch Vibe Kanban, connect a coding agent, and go from zero to pull request

Vibe Kanban keeps you organised while running multiple coding agents in parallel by streamlining how you plan and review their work.

## 1. Launch Vibe Kanban

Start the Vibe Kanban client and open the UI in your browser:

```bash theme={null}
npx vibe-kanban
```

## 2. Confirm your preferences

The first time you run Vibe Kanban, you'll be asked to set your preferred:

* Coding agent
* IDE
* Notification preferences

<Info>
  These preferences can be changed at any time from the settings dialog
</Info>

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-basic-setup.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=04fc3fd45b94b71b1a75823b2c6e4630" alt="Placeholder image for preferences setup: coding agent, IDE, and sound notifications." width="1682" height="1189" data-path="images/onboarding-basic-setup.png" />
</Frame>

## 3. Sign-in to Vibe Kanban

You can use a GitHub or Google account.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-sign-in.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=43a4561060e4ebe5a9dd6a4bcd0e1eb6" alt="Vibe Kanban onboarding screen showing Sign in to continue with GitHub and Google buttons" width="2986" height="1714" data-path="images/onboarding-sign-in.png" />
</Frame>

<Info>
  If you want to skip sign-in for now, click **More options** → **I understand, continue without signing in**. You'll still be able to create workspaces, but the kanban board, issues, and team features will be unavailable.
</Info>

## 4. Navigate the kanban board

After you sign in, we automatically create a personal organisation and an initial project for you, and take you straight there.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-projects.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=2f8a6fd152db555ac3e8d25a7cdb0a63" alt="The projects page" width="1725" height="1060" data-path="images/onboarding-projects.png" />
</Frame>

**Navigating the kanban board:**

1. The app bar, used for navigating between projects, the workspaces page (we'll come onto this later) and user settings
2. Issues appear as cards on the kanban board
3. The 'new issue' button, for creating issues
4. The right hand panel where details for the currently selected or draft issue is shown

## 5. Create an issue

**Issues** are a core concept of Vibe Kanban, they represent a bug, feature or piece of work to be done. At a minimum, issues consist of a title and description, but you can also add priorities, tags and even connect issues together with parent/child relationships.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-create-issue.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=7965880aa2f6b1a4abba5e70c5d1abfb" alt="Create issue" width="3044" height="2160" data-path="images/onboarding-create-issue.png" />
</Frame>

When you've filled out the details press 'create issue'.

## 6. Create a workspace

**Workspaces** are another core concept of Vibe Kanban, they represent a space to work on an issue with a coding agent. When you create a workspace, Vibe Kanban automatically creates git worktrees for your selected repositories, and launches your coding agent.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-create-workspace.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=1b0842f38a3f8bf24b2b54ccc0b080a5" alt="The create workspace button" width="3044" height="2160" data-path="images/onboarding-create-workspace.png" />
</Frame>

To create a workspace, make sure the issue you created is selected and click the 'create' button in the workspaces window.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-workspaces-repo.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=98b4991aef6c8ad41ff1300c54101582" alt="Workspaces repos" width="3044" height="2160" data-path="images/onboarding-workspaces-repo.png" />
</Frame>

When you create a workspace, you'll need to specify repositories you'd like to work on, as well as the branches of those repositories to base the git worktrees on.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-workspaces-prompt.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=c9964abb93c435ebbc60b7b3cb1bf3b0" alt="Workspaces prompt" width="3044" height="2160" data-path="images/onboarding-workspaces-prompt.png" />
</Frame>

You'll also need to specify your desired coding agent configuration (e.g. model, effort level, plan mode).

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-workspaces-logs.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=d37307a47a8543c2557a708452a5a59b" alt="Workspaces logs" width="3044" height="2160" data-path="images/onboarding-workspaces-logs.png" />
</Frame>

Upon creation, the coding agent will immediately begin executing with the given prompt.

<Info>
  You can connect multiple workspaces to an issue, this is useful for working on larger features and allows you to run multiple coding agents in parallel.

  Workspaces don't *have* to be connected to an issue, which is useful for quick actions like asking questions about a codebase.
</Info>

## 7. Reviewing a workspace

So far we've been viewing the workspace side-by-side with our kanban board. However, if we want more room to review the code changes or test them in a browser, we can open the workspace in the **workspaces view**.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-workspaces-open.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=85968cd5b64390420b6eb1d8d333e63b" alt="Workspaces open" width="3044" height="2160" data-path="images/onboarding-workspaces-open.png" />
</Frame>

To access the workspaces view, click the **Open Workspace** button.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-workspaces-page.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=6687f0515c1133dfdbf45f96c6b5bab4" alt="Workspaces page" width="3044" height="2160" data-path="images/onboarding-workspaces-page.png" />
</Frame>

Depending on what you'd like to do, you can view code changes or preview changes to websites in a browser using the floating navigation buttons (3).

You can also navigate back to either your project (1) or the parent issue (2).

## 8. Merging a workspace

When you're ready to merge the changes in a workspace, you can either open a GitHub pull request or merge the workspace branch locally.

<Frame>
  <img src="https://mintcdn.com/vibekanban/OTiMjHcMJHv7hSYz/images/onboarding-workspaces-merge.png?fit=max&auto=format&n=OTiMjHcMJHv7hSYz&q=85&s=76b487497b9bcc43fca98bb065887abc" alt="Workspaces merge" width="3044" height="2160" data-path="images/onboarding-workspaces-merge.png" />
</Frame>

## Next steps

<CardGroup cols={2}>
  <Card title="Previewing changes" icon="browser" href="/docs/workspaces/preview">
    Set up a dev server, preview your app, and click-to-component to jump straight to source
  </Card>

  <Card title="Setup and cleanup scripts" icon="terminal" href="/docs/settings/projects-repositories">
    Automate dependency installs, builds, and teardown so every workspace starts clean
  </Card>

  <Card title="Reviewing code changes" icon="code-compare" href="/docs/workspaces/changes">
    Review diffs, prompt the agent with feedback, and iterate before merging
  </Card>

  <Card title="Working with sub-issues" icon="diagram-subtask" href="/docs/core-features/subtasks">
    Break large features into smaller pieces and track progress across sub-issues
  </Card>
</CardGroup>

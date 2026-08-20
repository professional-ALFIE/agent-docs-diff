> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Reviewing Code

> Review diffs, add inline comments, and send feedback to your coding agent

After a coding agent finishes work, you review its changes, leave inline comments, and send the agent back to address them. This review-feedback-fix loop repeats until you are satisfied.

## 1. Open the changes panel

There are three ways to open the changes panel:

* Click the **Toggle Changes Panel** button in the navbar
* Click the changes icon in the **app bar**
* Open the [command bar](/docs/workspaces/command-bar) from its icon in the navbar or with `Cmd/Ctrl + K`, then search for "Show Changes Panel"

<Frame>
  <img src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-agent-idle.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=d18e26b594802ac9eb69c89697babc13" alt="Workspace showing the Toggle Changes Panel button in the navbar" width="2990" height="1698" data-path="images/reviewing-code-agent-idle.png" />
</Frame>

The changes panel shows the diff viewer in the centre and the file tree on the right.

<Frame>
  <img src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-changes-panel.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=efce814e650221ce2dcacf67b0a51425" alt="Changes panel showing the file tree on the left and diff viewer on the right" width="2990" height="1696" data-path="images/reviewing-code-changes-panel.png" />
</Frame>

## 2. Navigate the file tree

The file tree shows all files that were added, modified, or deleted. Click any file to load its diff in the viewer.

<Frame>
  <img src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-file-tree.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=fdf3e6f5ed9b4b73bcefbf67b2f4010b" alt="File tree with folders expanded and search box visible" width="2990" height="1696" data-path="images/reviewing-code-file-tree.png" />
</Frame>

Use the search box at the top to filter files by name. The toggle button in the search bar lets you expand or collapse all folders at once.

<Tip>
  Start with the files you care most about — the main feature file or the entry point — rather than reviewing alphabetically. This gives you context for the rest of the changes.
</Tip>

## 3. Read diffs

The diff viewer uses colour coding to show what changed: green for additions, red for deletions, and grey for unchanged context lines.

You can switch between two view modes:

| Mode             | Best for                              | How to switch                                                  |
| ---------------- | ------------------------------------- | -------------------------------------------------------------- |
| **Unified**      | Quick scanning, small changes         | Diff view toggle in the navbar                                 |
| **Side-by-Side** | Large refactors, comparing old vs new | Same toggle, or `Cmd/Ctrl + K` → "Switch to Side-by-Side View" |

<Frame>
  <img src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-unified.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=ff663c4219a755ea9d5d0d11bf2e3a32" alt="Unified diff view showing interleaved additions and deletions" width="2990" height="1696" data-path="images/reviewing-code-unified.png" />
</Frame>

<Frame>
  <img src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-side-by-side.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=ae292d9e23a3465eabe10b0779df2fbf" alt="Side-by-side diff view showing additions in green and deletions in red" width="2990" height="1696" data-path="images/reviewing-code-side-by-side.png" />
</Frame>

You can also switch views from the [command bar](/docs/workspaces/command-bar) (`Cmd/Ctrl + K` → "Switch to Side-by-Side View").

## 4. Add inline comments

To leave feedback on a specific line, hover over it in the diff and click the comment icon that appears. Write your comment and submit it.

<Frame>
  <img style={{maxHeight: "300px"}} src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-inline-comment.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=27cd7e0e7cbd670d97077508c3e837de" alt="Inline comment being written on a diff line with the Add Review Comment button" width="2990" height="1696" data-path="images/reviewing-code-inline-comment.png" />
</Frame>

Good comments are specific and actionable. Here are some examples:

| Comment type         | Example                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------- |
| **Request a change** | "This endpoint should validate the user ID before querying the database."               |
| **Ask a question**   | "Why did you choose a Map here instead of a plain object?"                              |
| **Provide context**  | "This function is called from the auth middleware — it needs to handle expired tokens." |

<Warning>
  Comments are not sent individually. They are collected and submitted together when you send a message in the chat.
</Warning>

## 5. Send feedback to the agent

After adding your comments, send them to the agent. You can include an optional message for extra context, or just send the comments on their own. A badge shows how many review comments will be included.

<Frame>
  <img src="https://mintcdn.com/vibekanban/8Vlu1VZ44kVh3Yrs/images/reviewing-code-agent-response.png?fit=max&auto=format&n=8Vlu1VZ44kVh3Yrs&q=85&s=5c5a7e32d3c8c6af5825c19dfc8e6388" alt="Chat showing review comments being sent to the agent" width="2290" height="1348" data-path="images/reviewing-code-agent-response.png" />
</Frame>

The agent sees all inline comments as context and works through them.

## Troubleshooting

<AccordionGroup>
  <Accordion title="The changes panel is empty">
    * The agent may not have made any changes yet — check the workspace status
    * If all changes were committed and pushed, the panel resets. Check the Git section for the latest commit.
  </Accordion>

  <Accordion title="I can't see my inline comments after sending">
    Comments are consumed when you send a message. They become part of the chat history. Add new comments for the next review round.
  </Accordion>

  <Accordion title="The agent didn't address my comment">
    Be more specific. Instead of "this is wrong", explain what is wrong and suggest a fix. Reference exact line numbers or variable names so the agent knows exactly where to look.
  </Accordion>
</AccordionGroup>

## Next steps

<CardGroup cols={2}>
  <Card title="Issue Management" icon="list-check" href="/docs/issue-management">
    Create and organise issues on the kanban board
  </Card>

  <Card title="Browser Testing" icon="browser" href="/docs/browser-testing">
    Preview your app in the built-in browser
  </Card>

  <Card title="Changes Panel" icon="code-compare" href="/docs/workspaces/changes">
    Full reference for diff viewer and comment features
  </Card>

  <Card title="Git Operations" icon="code-branch" href="/docs/workspaces/git-operations">
    Create pull requests, rebase, merge, and manage branches
  </Card>
</CardGroup>

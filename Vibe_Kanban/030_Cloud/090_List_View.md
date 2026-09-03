> 원본: https://vibekanban.com/docs/cloud/list-view.md

> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List View

> View and manage all your issues in a tabular format

The list view provides a tabular way to see all your issues, including those in hidden statuses. It's ideal for reviewing many issues at once and getting a complete overview of your project.

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/list-view.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=cf0797803c5cf676e9b378656f0c98ee" alt="List view showing issues grouped by status" width="2980" height="1698" data-path="images/cloud/list-view.png" />
</Frame>

## Accessing List View

To switch to list view, click the **All** tab in the header above the board.

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/status-tabs.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=ee547eabfce0aa497fc1120e89793e66" alt="Status tabs showing Active, All, Backlog, and Cancelled" width="1530" height="396" data-path="images/cloud/status-tabs.png" />
</Frame>

| Tab                              | What it shows                                     |
| -------------------------------- | ------------------------------------------------- |
| **All**                          | All issues across all statuses (including hidden) |
| **Backlog**, **Cancelled**, etc. | Issues in that specific hidden status only        |

To return to the kanban view, click the **Active** tab.

## List Layout

Issues in the list view are grouped by status. Each status section shows:

* **Status name** with colour indicator
* **Issue count** for that status
* **Collapsible sections** - click to expand or collapse

<Frame>
  <img src="https://mintcdn.com/vibekanban/MB_lCOSuStbJZz0i/images/cloud/list-layout.png?fit=max&auto=format&n=MB_lCOSuStbJZz0i&q=85&s=528366c311e4545bbf2a78e36bf16738" alt="List view showing status sections with issues grouped by status" width="2212" height="864" data-path="images/cloud/list-layout.png" />
</Frame>

### Issue Row Details

Each row in the list shows:

* **Simple ID** - The issue identifier (e.g., ISS-1)
* **Title** - The issue title
* **Workspace indicator** - Shows if the issue has linked workspaces
* **Age** - How long ago the issue was created (e.g., "12d" for 12 days)

Click any row to open the full [issue panel](/docs/cloud/issues).

## Multi-Select in List View

List view supports multi-select for bulk operations. Each row has a checkbox that appears when you hover over its left edge.

### Selection Methods

* **Checkbox** - Hover over the left edge of a row to reveal the checkbox, then click to select
* **Cmd/Ctrl + Click** a row to toggle it in or out of the selection
* **Shift + Click** a row to select a range from the last selected row
* **X** to toggle the currently open issue
* **Shift + J / ↓** or **Shift + K / ↑** to extend the selection by one row
* **Cmd/Ctrl + A** to select all visible issues
* **Escape** to clear the selection

Selected rows are highlighted. When two or more issues are selected, the **bulk action bar** appears at the bottom of the screen with options to change status, priority, assignees, or delete. See [Selecting Multiple Issues](/docs/cloud/issues#selecting-multiple-issues) for full details.

## When to Use List View

List view is best for:

<CardGroup cols={2}>
  <Card title="Reviewing all issues" icon="list">
    See every issue in your project at once, including hidden statuses like Backlog and Cancelled.
  </Card>

  <Card title="Finding specific issues" icon="magnifying-glass">
    Combined with search and filters, quickly locate issues across all statuses.
  </Card>

  <Card title="Bulk operations" icon="clipboard-list">
    Select multiple issues with checkboxes to change status, priority, or assignees in bulk.
  </Card>

  <Card title="Accessing hidden statuses" icon="eye">
    View and manage issues in Backlog, Cancelled, or other hidden statuses.
  </Card>
</CardGroup>

## Filtering and Sorting

The filter bar works the same in list view as in kanban view:

* **Search** - Find issues by title
* **Priority** - Filter by priority level
* **Assignee** - Filter by team member
* **Tags** - Filter by tags
* **Sort** - Change the order of issues

See [Filtering & Sorting](/docs/cloud/filtering) for more details.

## Related Documentation

* [Kanban View](/docs/cloud/kanban-board) - The default board view with columns
* [Issues](/docs/cloud/issues) - Creating and editing issues
* [Filtering & Sorting](/docs/cloud/filtering) - Finding issues quickly

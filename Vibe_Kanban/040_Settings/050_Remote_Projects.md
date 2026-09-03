> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Remote Projects

> Manage your Cloud projects across organisations

The Remote Projects settings page lets you view and manage all your Cloud-synced projects across your organisations.

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/remote-projects-settings.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=6bb9087c2a965bddf40a63da134d0086" alt="Remote Projects settings showing organisations and projects" width="1912" height="1486" data-path="images/cloud/remote-projects-settings.png" />
</Frame>

## Accessing Remote Projects Settings

To open Remote Projects settings:

1. Open **Settings** (click the gear icon or press the settings shortcut)
2. Select **Remote Projects** from the sidebar

<Note>
  You must be signed in to access Remote Projects. If you're not signed in, you'll see a prompt to sign in first.
</Note>

## Understanding the Layout

The Remote Projects page has a two-column layout:

| Column            | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| **Organisations** | Lists all organisations you belong to. Personal organisations are marked with a "Personal" badge. |
| **Projects**      | Shows projects in the selected organisation. Click the **+** button to create a new project.      |

When you select a project, an edit form appears below where you can modify the project details.

## Viewing Projects

<Steps>
  <Step title="Select an organisation">
    Click on an organisation in the left column to view its projects.
  </Step>

  <Step title="Browse projects">
    Projects appear in the right column with their colour indicator. Click any project to select it.
  </Step>
</Steps>

## Creating a Project

To create a new project in an organisation:

<Steps>
  <Step title="Select the organisation">
    Click on the organisation where you want to create the project.
  </Step>

  <Step title="Click the + button">
    Click the **+** button in the Projects column header.
  </Step>

  <Step title="Enter project details">
    In the dialog that appears:

    <Frame>
      <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/create-project-dialog.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=73a9bd39aa4edc315adb18af1ec31663" alt="Create Project dialog with name and colour fields" width="2208" height="990" data-path="images/cloud/create-project-dialog.png" />
    </Frame>

    * **Project Name** - Enter a name for your project
    * **Project Colour** - Click the colour swatch to choose a colour
  </Step>

  <Step title="Create the project">
    Click **Create Project** to create the project. It will appear in the projects list.
  </Step>
</Steps>

## Editing a Project

To edit an existing project:

<Steps>
  <Step title="Select the project">
    Click on the project you want to edit. An edit form appears below the two-column picker.
  </Step>

  <Step title="Make changes">
    Update the project details:

    <Frame>
      <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/edit-project-form.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=905d858cd5141b45c9c483bc55735efc" alt="Edit project form with name and colour picker" width="1956" height="572" data-path="images/cloud/edit-project-form.png" />
    </Frame>

    * **Project Name** - Change the display name
    * **Project Colour** - Select a different colour from the palette
  </Step>

  <Step title="Save changes">
    A save bar appears at the bottom when you have unsaved changes. Click **Save** to apply your changes, or **Discard** to revert.
  </Step>
</Steps>

<Info>
  Changes sync automatically to all team members in the organisation.
</Info>

## Deleting a Project

<Warning>
  Deleting a project permanently removes all its issues, comments, and data. This cannot be undone.
</Warning>

To delete a project:

<Steps>
  <Step title="Find the project">
    Select the organisation and locate the project you want to delete.
  </Step>

  <Step title="Open the menu">
    Hover over the project and click the **⋯** (three dots) menu that appears.

    <Frame>
      <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/project-menu-button.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=07bd93d185e93bf658fd986a63d41599" alt="Project row showing three-dots menu button" width="1774" height="486" data-path="images/cloud/project-menu-button.png" />
    </Frame>
  </Step>

  <Step title="Click Delete">
    Select **Delete** from the menu.

    <Frame>
      <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/project-delete-menu.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=b973700b87735228247a41c290c11180" alt="Dropdown menu with Delete option" width="1774" height="486" data-path="images/cloud/project-delete-menu.png" />
    </Frame>
  </Step>

  <Step title="Confirm deletion">
    Confirm the deletion when prompted. The project and all its data will be permanently removed.
  </Step>
</Steps>

## Switching Between Organisations

If you belong to multiple organisations, you can quickly switch between them:

1. Click on a different organisation in the left column
2. The projects list updates to show that organisation's projects
3. If you have unsaved changes, you'll be prompted to discard them first

## Troubleshooting

<AccordionGroup>
  <Accordion title="I don't see any organisations">
    Make sure you're signed in. If you just signed up, a personal organisation should have been created automatically.

    If you still don't see any organisations:

    1. Sign out and sign back in
    2. Check your internet connection
    3. Try refreshing the page
  </Accordion>

  <Accordion title="I can't create a project">
    Check the following:

    * You must have an organisation selected
    * You need to be signed in
    * Check your internet connection

    If you're trying to create a project in someone else's organisation, you may not have permission.
  </Accordion>

  <Accordion title="My changes aren't saving">
    The save bar appears when you have unsaved changes. Make sure to click **Save** before:

    * Selecting a different project
    * Selecting a different organisation
    * Closing the settings dialog

    If save fails, check your internet connection and try again.
  </Accordion>
</AccordionGroup>

## Related Documentation

* [Projects](/docs/cloud/projects) - Working with projects on the kanban board
* [Organisation Settings](/docs/settings/organization-settings) - Managing organisation members
* [Organisations](/docs/cloud/organizations) - Understanding organisations

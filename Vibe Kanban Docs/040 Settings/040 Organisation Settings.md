> ## Documentation Index
> Fetch the complete documentation index at: https://vibekanban.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Organisation Settings

> Manage your organisation, members, and invitations

The Organisation Settings page lets you manage your Cloud organisations, invite team members, and configure organisation-level settings.

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/organization-settings-page.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=a86eb68debad4a0f8ee1ae9270686321" alt="Organization Settings page showing members and settings" width="1880" height="1476" data-path="images/cloud/organization-settings-page.png" />
</Frame>

## Accessing Organisation Settings

To open Organisation Settings:

1. Click your **profile icon** in the bottom of the left sidebar
2. Click the **settings icon** (<Icon icon="gear" />) next to your organisation name

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/user-menu-settings.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=3ed4400d24e1b73a1c1d79864b13b496" alt="User menu showing settings icon next to organisation" width="1108" height="1016" data-path="images/cloud/user-menu-settings.png" />
</Frame>

## Organisation Selection

At the top of the settings page, you can:

* **Switch organisations** - Use the dropdown to select a different organisation

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/organization-switcher.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=76c755e8d311f40d01abed1996bc6509" alt="Organization switcher dropdown showing multiple organisations" width="2394" height="526" data-path="images/cloud/organization-switcher.png" />
</Frame>

<Info>
  If you're a member of multiple organisations, switching here changes which organisation's settings you're viewing and editing.
</Info>

### Personal Organisations

When you first sign up, a personal organisation is created for you with an **Initial Project**. Personal organisations have some restrictions:

* Cannot invite additional members
* Cannot be deleted
* Are only accessible by you

## Pending Invitations

<Note>
  This section is only visible to **Admins** and only for non-personal organisations.
</Note>

The Pending Invitations section shows all invitations that have been sent but not yet accepted:

* **Email address** - Who was invited
* **Status** - Pending acceptance
* **Expiry** - Invitations expire after 7 days
* **Revoke** - Cancel the invitation if needed

### Revoking an Invitation

To revoke a pending invitation:

1. Find the invitation in the list
2. Click the **Revoke** button
3. The invitation link will no longer work

## Members

The Members section shows everyone who has access to the organisation:

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/members-section.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=44f96bcea9a841c47bc661229c4f791c" alt="Members section showing member list with Invite Member button" width="1912" height="516" data-path="images/cloud/members-section.png" />
</Frame>

| Column      | Description                      |
| ----------- | -------------------------------- |
| **Name**    | Member's display name and avatar |
| **Role**    | Admin or Member                  |
| **Actions** | Role change, remove (Admin only) |

### Member Roles

| Role       | Permissions                                                              |
| ---------- | ------------------------------------------------------------------------ |
| **Admin**  | Full access - manage members, invitations, settings, delete organisation |
| **Member** | Access projects and issues, cannot manage organisation settings          |

### Changing a Member's Role

<Note>
  Only Admins can change member roles.
</Note>

1. Find the member in the list
2. Click the role dropdown next to their name
3. Select the new role (Admin or Member)
4. The change takes effect immediately

### Removing a Member

<Warning>
  Removing a member revokes their access to all projects in the organisation immediately.
</Warning>

1. Find the member in the list
2. Click the **Remove** button
3. Confirm the removal when prompted

### Inviting New Members

To invite someone to your organisation:

1. Click the **Invite Member** button
2. Enter their email address
3. Select their role (Admin or Member)
4. Click **Send Invitation**

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/invite-member-dialog.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=99cad3e52afe6f351f071eb27c135a81" alt="Invite Member dialog with email and role fields" width="2212" height="1442" data-path="images/cloud/invite-member-dialog.png" />
</Frame>

They'll receive an email with a link to join. The invitation expires after 7 days.

## Billing

<Note>
  This section is only visible to **Admins** of non-personal organisations.
</Note>

The Billing section provides a link for existing customers to manage billing in the Vibe Kanban account portal.

Click **Manage Billing** to open the billing portal in a new tab where you can:

* View your current subscription
* Update payment methods
* View invoices and billing history

## Danger Zone

<Warning>
  Actions in the Danger Zone are destructive and cannot be undone.
</Warning>

<Frame>
  <img src="https://mintcdn.com/vibekanban/TDM0xx2duuZqyvY7/images/cloud/danger-zone.png?fit=max&auto=format&n=TDM0xx2duuZqyvY7&q=85&s=74af2f677971f00e474e6170fe7dd0e8" alt="Danger Zone section with Delete Organization button" width="2258" height="434" data-path="images/cloud/danger-zone.png" />
</Frame>

### Deleting an Organisation

<Note>
  Only Admins can delete organisations. Personal organisations cannot be deleted.
</Note>

To delete an organisation:

1. Scroll to the **Danger Zone** section
2. Click **Delete**
3. Confirm the deletion when prompted
4. All projects, issues, and data will be permanently deleted

<Warning>
  Deleting an organisation removes:

  * All projects in the organisation
  * All issues and their history
  * All team member access
  * All pending invitations

  This action cannot be undone.
</Warning>

## Related Documentation

* [Organisations](/docs/cloud/organizations) - Creating and understanding organisations
* [Team Members](/docs/cloud/team-members) - Inviting and managing team members
* [Projects](/docs/cloud/projects) - Managing projects within organisations

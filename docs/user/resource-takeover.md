# Resource Takeover Functionality

## Overview

The resource takeover functionality allows authorized users to take control of a resource that is currently being used by another user, provided that:

1. The resource is configured to allow takeover (`allowTakeOver` property is `true`)
2. The current user has permission to use the resource (same permissions required to start a session)

## How It Works

### For Resource Administrators

When creating or editing a resource, administrators can enable the "Allow Takeover" option. This setting determines whether users can forcibly end another user's session and start their own.

### For Users

When viewing a resource that is currently in use by another user, if both conditions are met:

- The resource allows takeover
- You have permission to use the resource (valid introduction, introducer status, or resource management permissions)

You will see takeover options in the resource usage section:

1. **Takeover Resource** - Main button to immediately end the current session and start your own
2. **Dropdown menu** - Contains additional options like "Takeover with Notes" which allows you to add notes to your new session

### User Permissions

The following users can perform takeovers (when the resource allows it):

- Users with `canManageResources` permission
- Users who have completed the required introduction for the resource
- Users who are designated introducers for the resource

## Technical Implementation

### Backend

- The takeover functionality uses the existing `startSession` endpoint with the `forceTakeOver: true` parameter
- When `forceTakeOver` is true, the backend will:
  1. End any existing active session for the resource
  2. Start a new session for the requesting user
  3. Only allow this if the resource has `allowTakeOver: true`

### Frontend

- The takeover UI is displayed in the `OtherUserSessionDisplay` component
- Component is self-contained and fetches its own data using only the `resourceId`
- Uses a `ButtonGroup` layout consistent with other session controls
- Main "Takeover Resource" button for immediate takeover
- Dropdown menu with additional options like "Takeover with Notes"
- Success and error messages are shown via toast notifications
- The UI automatically refreshes to show the new session after successful takeover

## Security Considerations

- Takeover is only possible when explicitly enabled on the resource
- Users must have the same permissions required to start a normal session
- All takeover actions are logged in the resource usage history
- The previous user's session is properly ended and recorded

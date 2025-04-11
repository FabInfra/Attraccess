export default {
  title: 'Manage Group Introductions',
  loadingPermissions: 'Loading permissions...',
  permissionDenied: {
    title: 'Permission Denied',
    description:
      'You do not have permission to manage introductions for this group.',
  },
  grantForm: {
    userSearchLabel: 'Find User to Introduce',
    addButton: 'Grant Introduction',
    noUserSelectedError: 'Please select a user first.',
  },
  grantSuccess: {
    title: 'Introduction Granted',
  },
  grantError: {
    title: 'Failed to Grant Introduction',
    description: 'An unexpected error occurred.',
  },
  loadingIntroductions: 'Loading introductions...',
  errorLoading: 'Error Loading Introductions',
  emptyState: 'No users have been introduced to this group yet.',
  introductionsTable: {
    ariaLabel: 'List of group introductions',
    userCol: 'User',
    tutorCol: 'Introduced By',
    statusCol: 'Status',
    actionsCol: 'Actions',
  },
  status: {
    active: 'Active',
    revoked: 'Revoked',
  },
  unknownUser: 'Unknown User',
  revokeAction: 'Revoke',
  unrevokeAction: 'Unrevoke',
  revokeSuccess: {
    title: 'Introduction Revoked',
  },
  revokeError: {
    title: 'Failed to Revoke Introduction',
    description: 'An unexpected error occurred.',
  },
  unrevokeSuccess: {
    title: 'Introduction Unrevoked',
  },
  unrevokeError: {
    title: 'Failed to Unrevoke Introduction',
    description: 'An unexpected error occurred.',
  },
};

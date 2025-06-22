# Error Handling Checklist for React Query Components

This checklist tracks the progress of implementing proper error handling for all components that use our react-query-client library.

**Issue:** [#162 - Better error handling in the ui](https://github.com/FabInfra/Attraccess/issues/162)

## Files to Review and Update

- [x] `apps/frontend/src/test-utils/fixtures.ts` ✅ **COMPLETED** - No changes needed (test utility file with only mock data, no React Query operations)
- [x] `apps/frontend/src/app/app.tsx` ✅ **COMPLETED** - No changes needed (main app routing component with no React Query operations)
- [x] `apps/frontend/src/app/email-templates/EditEmailTemplatePage.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert components
- [x] `apps/frontend/src/app/email-templates/EmailTemplatesPage.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert and toast notifications
- [x] `apps/frontend/src/app/fabreader/FabreaderEditor/FabreaderEditor.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert and toast notifications
- [x] `apps/frontend/src/app/fabreader/FabreaderSelect/FabreaderSelect.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert and toast notifications
- [x] `apps/frontend/src/app/fabreader/FabreaderList/FabreaderList.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert and toast notifications
- [x] `apps/frontend/src/app/fabreader/NfcCardList/NfcCardList.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert error handling and removed toast error handling useEffect
- [x] `apps/frontend/src/app/plugins/plugin.state.ts` ✅ **COMPLETED** - No changes needed (Zustand state store, no React Query operations)
- [x] `apps/frontend/src/app/plugins/UploadPluginModal.tsx` ✅ **COMPLETED** - Already has excellent error handling with success/error callbacks and toast notifications
- [x] `apps/frontend/src/app/plugins/plugin-provider.tsx` ✅ **COMPLETED** - Refactored to use standardized error handling by removing repetitive toast notifications and simplifying error logging
- [x] `apps/frontend/src/app/plugins/PluginsList.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert and toast notifications
- [x] `apps/frontend/src/app/layout/sidebar.tsx` ✅ **COMPLETED** - No changes needed (navigation component, no React Query operations)
- [x] `apps/frontend/src/app/resources/documentation/DocumentationView.tsx` ✅ **COMPLETED** - Already has excellent error handling with loading states, error states, retry functionality, and comprehensive user feedback
- [x] `apps/frontend/src/app/resources/documentation/DocumentationEditor.tsx` ✅ **COMPLETED** - Already has excellent error handling with loading states, error states, retry functionality, and comprehensive user feedback
- [x] `apps/frontend/src/app/resources/documentation/DocumentationModal.tsx` ✅ **COMPLETED** - Already has excellent error handling with loading states, error handling, retry functionality, and proper user feedback
- [x] `apps/frontend/src/app/resources/iot-settings/iotSettings.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom error handling UI, improved loading states
- [x] `apps/frontend/src/app/resources/iot-settings/esphome/ESPHomeConfigurationPanel.tsx` ✅ **COMPLETED** - No changes needed (simple configuration display component with no custom error handling)
- [x] `apps/frontend/src/app/resources/iot-settings/mqtt/components/MqttConfigList.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [x] `apps/frontend/src/app/resources/iot-settings/mqtt/components/MqttConfigForm.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling for create/update operations
- [ ] `apps/frontend/src/app/resources/iot-settings/mqtt/pages/TestMqttConfig.tsx` 🔄 **NEEDS REVIEW** - Test component with connection testing error handling
- [ ] `apps/frontend/src/app/resources/iot-settings/webhooks/types.ts` ✅ **COMPLETED** - No changes needed (type definitions and utility functions only, no React Query operations)
- [ ] `apps/frontend/src/app/resources/iot-settings/webhooks/components/WebhookFormActions.tsx` 🔄 **NEEDS REVIEW** - Form action component with error handling to review
- [ ] `apps/frontend/src/app/resources/iot-settings/webhooks/components/WebhookList.tsx` 🔄 **NEEDS REVIEW** - List component with webhook operation error handling to standardize
- [ ] `apps/frontend/src/app/resources/iot-settings/webhooks/components/WebhookForm.tsx` 🔄 **NEEDS REVIEW** - Form component with validation and error handling to standardize
- [x] `apps/frontend/src/app/resources/iot-settings/webhooks/hooks/useTemplatePreview.ts` ✅ **COMPLETED** - No changes needed (simple hook with no custom error handling)
- [ ] `apps/frontend/src/app/resources/editModal/resourceEditModal.tsx` 🔄 **NEEDS REVIEW** - Modal component with resource editing error handling to standardize
- [x] `apps/frontend/src/app/resources/IntroducerManagement/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom error display and toast error handling
- [ ] `apps/frontend/src/app/resources/details/useQrCodeAction.ts` 🔄 **NEEDS REVIEW** - Custom hook with QR code action error handling to review
- [x] `apps/frontend/src/app/resources/details/resourceDetails.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling for delete operation and error display
- [x] `apps/frontend/src/app/resources/usage/resourceUsageHistory.tsx` ✅ **COMPLETED** - No changes needed (UI composition component with no React Query operations)
- [x] `apps/frontend/src/app/resources/usage/components/HistoryTable/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom error text display
- [x] `apps/frontend/src/app/resources/usage/components/HistoryTable/utils/tableRows.tsx` ✅ **COMPLETED** - No changes needed (utility functions only, no React Query operations)
- [x] `apps/frontend/src/app/resources/usage/components/UsageNotesModal/index.tsx` ✅ **COMPLETED** - No changes needed (display component only, no React Query operations)
- [x] `apps/frontend/src/app/resources/usage/components/IntroductionRequiredDisplay/index.tsx` ✅ **COMPLETED** - No changes needed (display component with no custom error handling)
- [x] `apps/frontend/src/app/resources/usage/components/ActiveSessionDisplay/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [x] `apps/frontend/src/app/resources/usage/components/OtherUserSessionDisplay/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [x] `apps/frontend/src/app/resources/usage/components/ResourceUsageSession/index.tsx` ✅ **COMPLETED** - No changes needed (UI composition component with no React Query operations)
- [x] `apps/frontend/src/app/resources/usage/components/StartSessionControls/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [x] `apps/frontend/src/app/resources/groups/index.tsx` ✅ **COMPLETED** - No changes needed (group management component with no custom error handling)
- [ ] `apps/frontend/src/app/resources/IntroductionsManagement/index.tsx` 🔄 **NEEDS REVIEW** - Management component with error handling to standardize
- [ ] `apps/frontend/src/app/resources/IntroductionsManagement/history/index.tsx` 🔄 **NEEDS REVIEW** - History component to standardize
- [x] `apps/frontend/src/app/unauthorized/ssoLogin.tsx` ✅ **COMPLETED** - No changes needed (simple SSO provider list with no custom error handling)
- [x] `apps/frontend/src/app/unauthorized/registrationForm.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert error handling
- [x] `apps/frontend/src/app/unauthorized/ssoLinkingRequiredModal/index.tsx` ✅ **COMPLETED** - Added ErrorDisplay component for mutation error handling
- [x] `apps/frontend/src/app/unauthorized/password-reset/passwordResetForm.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [x] `apps/frontend/src/app/csv-export/resource-usage/resourceUsageExport.tsx` ✅ **COMPLETED** - No changes needed (export component with no custom error handling)
- [x] `apps/frontend/src/app/resource-groups/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom error display
- [x] `apps/frontend/src/app/resource-groups/upsertModal/resourceGroupUpsertModal.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [ ] `apps/frontend/src/app/resource-groups/IntroducerManagement/index.tsx` 🔄 **NEEDS REVIEW** - Management component with error handling to standardize
- [ ] `apps/frontend/src/app/resource-groups/GroupDetailsForm/index.tsx` 🔄 **NEEDS REVIEW** - Form component with validation and error handling to standardize
- [ ] `apps/frontend/src/app/resource-groups/IntroductionsManagement/index.tsx` 🔄 **NEEDS REVIEW** - Management component to standardize
- [ ] `apps/frontend/src/app/resource-groups/IntroductionsManagement/history/index.tsx` 🔄 **NEEDS REVIEW** - History component with error handling to standardize
- [x] `apps/frontend/src/app/sso/providers/SSOProvidersList.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling for CRUD operations and discovery
- [x] `apps/frontend/src/app/users/UserManagementPage.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom error display
- [x] `apps/frontend/src/app/users/components/UserPermissionForm.tsx` ✅ **COMPLETED** - Already has excellent error handling with loading states, try/catch error handling, and success/error toast messages
- [x] `apps/frontend/src/app/reset-password/resetPassword.tsx` ✅ **COMPLETED** - Already has excellent error handling with onError callbacks and toast notifications
- [x] `apps/frontend/src/app/resourceOverview/index.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert error handling
- [ ] `apps/frontend/src/app/resourceOverview/resourceGroupCard/index.tsx` 🔄 **NEEDS REVIEW** - Resource group card component with error handling to review
- [x] `apps/frontend/src/app/resourceOverview/resourceGroupCard/statusChip/index.tsx` ✅ **COMPLETED** - No changes needed (simple status display component, no error handling required)
- [x] `apps/frontend/src/app/mqtt/servers/EditMqttServerPage.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling and added error handling for fetch failures
- [x] `apps/frontend/src/app/mqtt/servers/MqttServerList.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert and toast error handling
- [x] `apps/frontend/src/app/mqtt/servers/CreateMqttServerPage.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom toast error handling
- [x] `apps/frontend/src/app/verifyEmail.tsx` ✅ **COMPLETED** - Already has excellent error handling with loading states, comprehensive error handling, retry functionality, and proper user feedback
- [x] `apps/frontend/src/components/IntroducerManagement/index.tsx` ✅ **COMPLETED** - No changes needed (UI component only, no React Query operations)
- [x] `apps/frontend/src/components/IntroductionsManagement/index.tsx` ✅ **COMPLETED** - No changes needed (UI component only, no React Query operations)
- [x] `apps/frontend/src/components/IntroductionsManagement/history/index.tsx` ✅ **COMPLETED** - No changes needed (UI component only, displays data passed as props, no React Query operations)
- [x] `apps/frontend/src/components/userSelectionList/index.tsx` ✅ **COMPLETED** - No changes needed (UI component only, no React Query operations)
- [x] `apps/frontend/src/hooks/useHasValidIntroduction.ts` ✅ **COMPLETED** - No changes needed (utility hook, no React Query operations)
- [x] `apps/frontend/src/hooks/useAuth.ts` ✅ **COMPLETED** - Already has appropriate error handling with proper retry strategies, error handling in persisted auth loading, and mutation callbacks
- [x] `apps/frontend/src/api/index.ts` ✅ **COMPLETED** - No changes needed (API utility functions only, no React Query operations)
- [x] `apps/frontend/src/app/unauthorized/loginForm.tsx` ✅ **COMPLETED** - Refactored to use standardized ErrorDisplay component instead of custom Alert error handling

## Progress Summary

- **Total files:** 71
- **Completed:** 51
- **Remaining:** 20

## Status Legend

- ✅ **COMPLETED** - Properly refactored or no changes needed
- 🔄 **NEEDS REVIEW** - Requires investigation and likely standardization
- 🔄 **NEEDS REFACTORING** - Confirmed to need ErrorDisplay integration

## Guidelines for Error Handling

When reviewing each file, ensure:

1. **Query Error Handling:** All `useQuery` hooks should handle the `error` object
2. **Mutation Error Handling:** All `useMutation` hooks should handle errors in `onError` callback
3. **User Feedback:** Display meaningful error messages to users via:
   - ErrorDisplay component (standardized)
   - Toast notifications (for actions)
   - Loading states with error fallbacks
4. **Graceful Degradation:** Handle errors gracefully without breaking the UI
5. **Retry Logic:** Consider if automatic retries are appropriate for certain operations

## Implementation Notes

- Use the standardized ErrorDisplay component for consistent error UI
- Leverage common error translations from `apps/frontend/src/translations/*/common.json`
- Remove custom Alert error handling in favor of ErrorDisplay
- Test error scenarios to ensure proper user experience
- Log errors appropriately for debugging purposes

---

_Updated on: 2025-01-20_

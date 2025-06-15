// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { AccessControlService, AnalyticsService, AuthenticationService, EmailTemplatesService, FabReaderService, MqttService, PluginsService, ResourcesService, SystemService, UsersService, WebhooksService } from "../requests/services.gen";
export type SystemServiceInfoDefaultResponse = Awaited<ReturnType<typeof SystemService.info>>;
export type SystemServiceInfoQueryResult<TData = SystemServiceInfoDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSystemServiceInfoKey = "SystemServiceInfo";
export const UseSystemServiceInfoKeyFn = (queryKey?: Array<unknown>) => [useSystemServiceInfoKey, ...(queryKey ?? [])];
export type UsersServiceFindManyDefaultResponse = Awaited<ReturnType<typeof UsersService.findMany>>;
export type UsersServiceFindManyQueryResult<TData = UsersServiceFindManyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceFindManyKey = "UsersServiceFindMany";
export const UseUsersServiceFindManyKeyFn = ({ ids, limit, page, search }: {
  ids?: number[];
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: Array<unknown>) => [useUsersServiceFindManyKey, ...(queryKey ?? [{ ids, limit, page, search }])];
export type UsersServiceGetCurrentDefaultResponse = Awaited<ReturnType<typeof UsersService.getCurrent>>;
export type UsersServiceGetCurrentQueryResult<TData = UsersServiceGetCurrentDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetCurrentKey = "UsersServiceGetCurrent";
export const UseUsersServiceGetCurrentKeyFn = (queryKey?: Array<unknown>) => [useUsersServiceGetCurrentKey, ...(queryKey ?? [])];
export type UsersServiceGetOneUserByIdDefaultResponse = Awaited<ReturnType<typeof UsersService.getOneUserById>>;
export type UsersServiceGetOneUserByIdQueryResult<TData = UsersServiceGetOneUserByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetOneUserByIdKey = "UsersServiceGetOneUserById";
export const UseUsersServiceGetOneUserByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useUsersServiceGetOneUserByIdKey, ...(queryKey ?? [{ id }])];
export type UsersServiceGetPermissionsDefaultResponse = Awaited<ReturnType<typeof UsersService.getPermissions>>;
export type UsersServiceGetPermissionsQueryResult<TData = UsersServiceGetPermissionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetPermissionsKey = "UsersServiceGetPermissions";
export const UseUsersServiceGetPermissionsKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useUsersServiceGetPermissionsKey, ...(queryKey ?? [{ id }])];
export type UsersServiceGetAllWithPermissionDefaultResponse = Awaited<ReturnType<typeof UsersService.getAllWithPermission>>;
export type UsersServiceGetAllWithPermissionQueryResult<TData = UsersServiceGetAllWithPermissionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetAllWithPermissionKey = "UsersServiceGetAllWithPermission";
export const UseUsersServiceGetAllWithPermissionKeyFn = ({ limit, page, permission }: {
  limit?: number;
  page?: number;
  permission?: "canManageResources" | "canManageSystemConfiguration" | "canManageUsers";
} = {}, queryKey?: Array<unknown>) => [useUsersServiceGetAllWithPermissionKey, ...(queryKey ?? [{ limit, page, permission }])];
export type AuthenticationServiceGetAllSsoProvidersDefaultResponse = Awaited<ReturnType<typeof AuthenticationService.getAllSsoProviders>>;
export type AuthenticationServiceGetAllSsoProvidersQueryResult<TData = AuthenticationServiceGetAllSsoProvidersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthenticationServiceGetAllSsoProvidersKey = "AuthenticationServiceGetAllSsoProviders";
export const UseAuthenticationServiceGetAllSsoProvidersKeyFn = (queryKey?: Array<unknown>) => [useAuthenticationServiceGetAllSsoProvidersKey, ...(queryKey ?? [])];
export type AuthenticationServiceGetOneSsoProviderByIdDefaultResponse = Awaited<ReturnType<typeof AuthenticationService.getOneSsoProviderById>>;
export type AuthenticationServiceGetOneSsoProviderByIdQueryResult<TData = AuthenticationServiceGetOneSsoProviderByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthenticationServiceGetOneSsoProviderByIdKey = "AuthenticationServiceGetOneSsoProviderById";
export const UseAuthenticationServiceGetOneSsoProviderByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useAuthenticationServiceGetOneSsoProviderByIdKey, ...(queryKey ?? [{ id }])];
export type AuthenticationServiceLoginWithOidcDefaultResponse = Awaited<ReturnType<typeof AuthenticationService.loginWithOidc>>;
export type AuthenticationServiceLoginWithOidcQueryResult<TData = AuthenticationServiceLoginWithOidcDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthenticationServiceLoginWithOidcKey = "AuthenticationServiceLoginWithOidc";
export const UseAuthenticationServiceLoginWithOidcKeyFn = ({ providerId, redirectTo }: {
  providerId: string;
  redirectTo?: unknown;
}, queryKey?: Array<unknown>) => [useAuthenticationServiceLoginWithOidcKey, ...(queryKey ?? [{ providerId, redirectTo }])];
export type AuthenticationServiceOidcLoginCallbackDefaultResponse = Awaited<ReturnType<typeof AuthenticationService.oidcLoginCallback>>;
export type AuthenticationServiceOidcLoginCallbackQueryResult<TData = AuthenticationServiceOidcLoginCallbackDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthenticationServiceOidcLoginCallbackKey = "AuthenticationServiceOidcLoginCallback";
export const UseAuthenticationServiceOidcLoginCallbackKeyFn = ({ code, iss, providerId, redirectTo, sessionState, state }: {
  code: unknown;
  iss: unknown;
  providerId: string;
  redirectTo: string;
  sessionState: unknown;
  state: unknown;
}, queryKey?: Array<unknown>) => [useAuthenticationServiceOidcLoginCallbackKey, ...(queryKey ?? [{ code, iss, providerId, redirectTo, sessionState, state }])];
export type AuthenticationServiceGetRegistrationOptionsDefaultResponse = Awaited<ReturnType<typeof AuthenticationService.getRegistrationOptions>>;
export type AuthenticationServiceGetRegistrationOptionsQueryResult<TData = AuthenticationServiceGetRegistrationOptionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthenticationServiceGetRegistrationOptionsKey = "AuthenticationServiceGetRegistrationOptions";
export const UseAuthenticationServiceGetRegistrationOptionsKeyFn = (queryKey?: Array<unknown>) => [useAuthenticationServiceGetRegistrationOptionsKey, ...(queryKey ?? [])];
export type AuthenticationServiceGetAuthenticationOptionsDefaultResponse = Awaited<ReturnType<typeof AuthenticationService.getAuthenticationOptions>>;
export type AuthenticationServiceGetAuthenticationOptionsQueryResult<TData = AuthenticationServiceGetAuthenticationOptionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthenticationServiceGetAuthenticationOptionsKey = "AuthenticationServiceGetAuthenticationOptions";
export const UseAuthenticationServiceGetAuthenticationOptionsKeyFn = (queryKey?: Array<unknown>) => [useAuthenticationServiceGetAuthenticationOptionsKey, ...(queryKey ?? [])];
export type EmailTemplatesServiceEmailTemplateControllerFindAllDefaultResponse = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerFindAll>>;
export type EmailTemplatesServiceEmailTemplateControllerFindAllQueryResult<TData = EmailTemplatesServiceEmailTemplateControllerFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEmailTemplatesServiceEmailTemplateControllerFindAllKey = "EmailTemplatesServiceEmailTemplateControllerFindAll";
export const UseEmailTemplatesServiceEmailTemplateControllerFindAllKeyFn = (queryKey?: Array<unknown>) => [useEmailTemplatesServiceEmailTemplateControllerFindAllKey, ...(queryKey ?? [])];
export type EmailTemplatesServiceEmailTemplateControllerFindOneDefaultResponse = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerFindOne>>;
export type EmailTemplatesServiceEmailTemplateControllerFindOneQueryResult<TData = EmailTemplatesServiceEmailTemplateControllerFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEmailTemplatesServiceEmailTemplateControllerFindOneKey = "EmailTemplatesServiceEmailTemplateControllerFindOne";
export const UseEmailTemplatesServiceEmailTemplateControllerFindOneKeyFn = ({ type }: {
  type: "verify-email" | "reset-password";
}, queryKey?: Array<unknown>) => [useEmailTemplatesServiceEmailTemplateControllerFindOneKey, ...(queryKey ?? [{ type }])];
export type ResourcesServiceGetAllResourcesDefaultResponse = Awaited<ReturnType<typeof ResourcesService.getAllResources>>;
export type ResourcesServiceGetAllResourcesQueryResult<TData = ResourcesServiceGetAllResourcesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceGetAllResourcesKey = "ResourcesServiceGetAllResources";
export const UseResourcesServiceGetAllResourcesKeyFn = ({ groupId, ids, limit, page, search }: {
  groupId?: number;
  ids?: number[];
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: Array<unknown>) => [useResourcesServiceGetAllResourcesKey, ...(queryKey ?? [{ groupId, ids, limit, page, search }])];
export type ResourcesServiceGetOneResourceByIdDefaultResponse = Awaited<ReturnType<typeof ResourcesService.getOneResourceById>>;
export type ResourcesServiceGetOneResourceByIdQueryResult<TData = ResourcesServiceGetOneResourceByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceGetOneResourceByIdKey = "ResourcesServiceGetOneResourceById";
export const UseResourcesServiceGetOneResourceByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useResourcesServiceGetOneResourceByIdKey, ...(queryKey ?? [{ id }])];
export type ResourcesServiceSseControllerStreamEventsDefaultResponse = Awaited<ReturnType<typeof ResourcesService.sseControllerStreamEvents>>;
export type ResourcesServiceSseControllerStreamEventsQueryResult<TData = ResourcesServiceSseControllerStreamEventsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceSseControllerStreamEventsKey = "ResourcesServiceSseControllerStreamEvents";
export const UseResourcesServiceSseControllerStreamEventsKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourcesServiceSseControllerStreamEventsKey, ...(queryKey ?? [{ resourceId }])];
export type ResourcesServiceResourceGroupsGetManyDefaultResponse = Awaited<ReturnType<typeof ResourcesService.resourceGroupsGetMany>>;
export type ResourcesServiceResourceGroupsGetManyQueryResult<TData = ResourcesServiceResourceGroupsGetManyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceResourceGroupsGetManyKey = "ResourcesServiceResourceGroupsGetMany";
export const UseResourcesServiceResourceGroupsGetManyKeyFn = (queryKey?: Array<unknown>) => [useResourcesServiceResourceGroupsGetManyKey, ...(queryKey ?? [])];
export type ResourcesServiceResourceGroupsGetOneDefaultResponse = Awaited<ReturnType<typeof ResourcesService.resourceGroupsGetOne>>;
export type ResourcesServiceResourceGroupsGetOneQueryResult<TData = ResourcesServiceResourceGroupsGetOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceResourceGroupsGetOneKey = "ResourcesServiceResourceGroupsGetOne";
export const UseResourcesServiceResourceGroupsGetOneKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useResourcesServiceResourceGroupsGetOneKey, ...(queryKey ?? [{ id }])];
export type ResourcesServiceResourceUsageGetHistoryDefaultResponse = Awaited<ReturnType<typeof ResourcesService.resourceUsageGetHistory>>;
export type ResourcesServiceResourceUsageGetHistoryQueryResult<TData = ResourcesServiceResourceUsageGetHistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceResourceUsageGetHistoryKey = "ResourcesServiceResourceUsageGetHistory";
export const UseResourcesServiceResourceUsageGetHistoryKeyFn = ({ limit, page, resourceId, userId }: {
  limit?: number;
  page?: number;
  resourceId: number;
  userId?: number;
}, queryKey?: Array<unknown>) => [useResourcesServiceResourceUsageGetHistoryKey, ...(queryKey ?? [{ limit, page, resourceId, userId }])];
export type ResourcesServiceResourceUsageGetActiveSessionDefaultResponse = Awaited<ReturnType<typeof ResourcesService.resourceUsageGetActiveSession>>;
export type ResourcesServiceResourceUsageGetActiveSessionQueryResult<TData = ResourcesServiceResourceUsageGetActiveSessionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceResourceUsageGetActiveSessionKey = "ResourcesServiceResourceUsageGetActiveSession";
export const UseResourcesServiceResourceUsageGetActiveSessionKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourcesServiceResourceUsageGetActiveSessionKey, ...(queryKey ?? [{ resourceId }])];
export type ResourcesServiceResourceUsageCanControlDefaultResponse = Awaited<ReturnType<typeof ResourcesService.resourceUsageCanControl>>;
export type ResourcesServiceResourceUsageCanControlQueryResult<TData = ResourcesServiceResourceUsageCanControlDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourcesServiceResourceUsageCanControlKey = "ResourcesServiceResourceUsageCanControl";
export const UseResourcesServiceResourceUsageCanControlKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourcesServiceResourceUsageCanControlKey, ...(queryKey ?? [{ resourceId }])];
export type MqttServiceMqttServersGetAllDefaultResponse = Awaited<ReturnType<typeof MqttService.mqttServersGetAll>>;
export type MqttServiceMqttServersGetAllQueryResult<TData = MqttServiceMqttServersGetAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServiceMqttServersGetAllKey = "MqttServiceMqttServersGetAll";
export const UseMqttServiceMqttServersGetAllKeyFn = (queryKey?: Array<unknown>) => [useMqttServiceMqttServersGetAllKey, ...(queryKey ?? [])];
export type MqttServiceMqttServersGetOneByIdDefaultResponse = Awaited<ReturnType<typeof MqttService.mqttServersGetOneById>>;
export type MqttServiceMqttServersGetOneByIdQueryResult<TData = MqttServiceMqttServersGetOneByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServiceMqttServersGetOneByIdKey = "MqttServiceMqttServersGetOneById";
export const UseMqttServiceMqttServersGetOneByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useMqttServiceMqttServersGetOneByIdKey, ...(queryKey ?? [{ id }])];
export type MqttServiceMqttServersGetStatusOfOneDefaultResponse = Awaited<ReturnType<typeof MqttService.mqttServersGetStatusOfOne>>;
export type MqttServiceMqttServersGetStatusOfOneQueryResult<TData = MqttServiceMqttServersGetStatusOfOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServiceMqttServersGetStatusOfOneKey = "MqttServiceMqttServersGetStatusOfOne";
export const UseMqttServiceMqttServersGetStatusOfOneKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useMqttServiceMqttServersGetStatusOfOneKey, ...(queryKey ?? [{ id }])];
export type MqttServiceMqttServersGetStatusOfAllDefaultResponse = Awaited<ReturnType<typeof MqttService.mqttServersGetStatusOfAll>>;
export type MqttServiceMqttServersGetStatusOfAllQueryResult<TData = MqttServiceMqttServersGetStatusOfAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServiceMqttServersGetStatusOfAllKey = "MqttServiceMqttServersGetStatusOfAll";
export const UseMqttServiceMqttServersGetStatusOfAllKeyFn = (queryKey?: Array<unknown>) => [useMqttServiceMqttServersGetStatusOfAllKey, ...(queryKey ?? [])];
export type MqttServiceMqttResourceConfigGetAllDefaultResponse = Awaited<ReturnType<typeof MqttService.mqttResourceConfigGetAll>>;
export type MqttServiceMqttResourceConfigGetAllQueryResult<TData = MqttServiceMqttResourceConfigGetAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServiceMqttResourceConfigGetAllKey = "MqttServiceMqttResourceConfigGetAll";
export const UseMqttServiceMqttResourceConfigGetAllKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useMqttServiceMqttResourceConfigGetAllKey, ...(queryKey ?? [{ resourceId }])];
export type MqttServiceMqttResourceConfigGetOneDefaultResponse = Awaited<ReturnType<typeof MqttService.mqttResourceConfigGetOne>>;
export type MqttServiceMqttResourceConfigGetOneQueryResult<TData = MqttServiceMqttResourceConfigGetOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServiceMqttResourceConfigGetOneKey = "MqttServiceMqttResourceConfigGetOne";
export const UseMqttServiceMqttResourceConfigGetOneKeyFn = ({ configId, resourceId }: {
  configId: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useMqttServiceMqttResourceConfigGetOneKey, ...(queryKey ?? [{ configId, resourceId }])];
export type WebhooksServiceWebhookConfigGetAllDefaultResponse = Awaited<ReturnType<typeof WebhooksService.webhookConfigGetAll>>;
export type WebhooksServiceWebhookConfigGetAllQueryResult<TData = WebhooksServiceWebhookConfigGetAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useWebhooksServiceWebhookConfigGetAllKey = "WebhooksServiceWebhookConfigGetAll";
export const UseWebhooksServiceWebhookConfigGetAllKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useWebhooksServiceWebhookConfigGetAllKey, ...(queryKey ?? [{ resourceId }])];
export type WebhooksServiceWebhookConfigGetOneByIdDefaultResponse = Awaited<ReturnType<typeof WebhooksService.webhookConfigGetOneById>>;
export type WebhooksServiceWebhookConfigGetOneByIdQueryResult<TData = WebhooksServiceWebhookConfigGetOneByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useWebhooksServiceWebhookConfigGetOneByIdKey = "WebhooksServiceWebhookConfigGetOneById";
export const UseWebhooksServiceWebhookConfigGetOneByIdKeyFn = ({ id, resourceId }: {
  id: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useWebhooksServiceWebhookConfigGetOneByIdKey, ...(queryKey ?? [{ id, resourceId }])];
export type AccessControlServiceResourceGroupIntroductionsGetManyDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroductionsGetMany>>;
export type AccessControlServiceResourceGroupIntroductionsGetManyQueryResult<TData = AccessControlServiceResourceGroupIntroductionsGetManyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceGroupIntroductionsGetManyKey = "AccessControlServiceResourceGroupIntroductionsGetMany";
export const UseAccessControlServiceResourceGroupIntroductionsGetManyKeyFn = ({ groupId }: {
  groupId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceGroupIntroductionsGetManyKey, ...(queryKey ?? [{ groupId }])];
export type AccessControlServiceResourceGroupIntroductionsGetHistoryDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroductionsGetHistory>>;
export type AccessControlServiceResourceGroupIntroductionsGetHistoryQueryResult<TData = AccessControlServiceResourceGroupIntroductionsGetHistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceGroupIntroductionsGetHistoryKey = "AccessControlServiceResourceGroupIntroductionsGetHistory";
export const UseAccessControlServiceResourceGroupIntroductionsGetHistoryKeyFn = ({ groupId, userId }: {
  groupId: number;
  userId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceGroupIntroductionsGetHistoryKey, ...(queryKey ?? [{ groupId, userId }])];
export type AccessControlServiceResourceGroupIntroducersGetManyDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroducersGetMany>>;
export type AccessControlServiceResourceGroupIntroducersGetManyQueryResult<TData = AccessControlServiceResourceGroupIntroducersGetManyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceGroupIntroducersGetManyKey = "AccessControlServiceResourceGroupIntroducersGetMany";
export const UseAccessControlServiceResourceGroupIntroducersGetManyKeyFn = ({ groupId }: {
  groupId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceGroupIntroducersGetManyKey, ...(queryKey ?? [{ groupId }])];
export type AccessControlServiceResourceGroupIntroducersIsIntroducerDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroducersIsIntroducer>>;
export type AccessControlServiceResourceGroupIntroducersIsIntroducerQueryResult<TData = AccessControlServiceResourceGroupIntroducersIsIntroducerDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceGroupIntroducersIsIntroducerKey = "AccessControlServiceResourceGroupIntroducersIsIntroducer";
export const UseAccessControlServiceResourceGroupIntroducersIsIntroducerKeyFn = ({ groupId, userId }: {
  groupId: number;
  userId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceGroupIntroducersIsIntroducerKey, ...(queryKey ?? [{ groupId, userId }])];
export type AccessControlServiceResourceIntroducersIsIntroducerDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceIntroducersIsIntroducer>>;
export type AccessControlServiceResourceIntroducersIsIntroducerQueryResult<TData = AccessControlServiceResourceIntroducersIsIntroducerDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceIntroducersIsIntroducerKey = "AccessControlServiceResourceIntroducersIsIntroducer";
export const UseAccessControlServiceResourceIntroducersIsIntroducerKeyFn = ({ resourceId, userId }: {
  resourceId: number;
  userId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceIntroducersIsIntroducerKey, ...(queryKey ?? [{ resourceId, userId }])];
export type AccessControlServiceResourceIntroducersGetManyDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceIntroducersGetMany>>;
export type AccessControlServiceResourceIntroducersGetManyQueryResult<TData = AccessControlServiceResourceIntroducersGetManyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceIntroducersGetManyKey = "AccessControlServiceResourceIntroducersGetMany";
export const UseAccessControlServiceResourceIntroducersGetManyKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceIntroducersGetManyKey, ...(queryKey ?? [{ resourceId }])];
export type AccessControlServiceResourceIntroductionsGetManyDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceIntroductionsGetMany>>;
export type AccessControlServiceResourceIntroductionsGetManyQueryResult<TData = AccessControlServiceResourceIntroductionsGetManyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceIntroductionsGetManyKey = "AccessControlServiceResourceIntroductionsGetMany";
export const UseAccessControlServiceResourceIntroductionsGetManyKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceIntroductionsGetManyKey, ...(queryKey ?? [{ resourceId }])];
export type AccessControlServiceResourceIntroductionsGetHistoryDefaultResponse = Awaited<ReturnType<typeof AccessControlService.resourceIntroductionsGetHistory>>;
export type AccessControlServiceResourceIntroductionsGetHistoryQueryResult<TData = AccessControlServiceResourceIntroductionsGetHistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccessControlServiceResourceIntroductionsGetHistoryKey = "AccessControlServiceResourceIntroductionsGetHistory";
export const UseAccessControlServiceResourceIntroductionsGetHistoryKeyFn = ({ resourceId, userId }: {
  resourceId: number;
  userId: number;
}, queryKey?: Array<unknown>) => [useAccessControlServiceResourceIntroductionsGetHistoryKey, ...(queryKey ?? [{ resourceId, userId }])];
export type PluginsServiceGetPluginsDefaultResponse = Awaited<ReturnType<typeof PluginsService.getPlugins>>;
export type PluginsServiceGetPluginsQueryResult<TData = PluginsServiceGetPluginsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePluginsServiceGetPluginsKey = "PluginsServiceGetPlugins";
export const UsePluginsServiceGetPluginsKeyFn = (queryKey?: Array<unknown>) => [usePluginsServiceGetPluginsKey, ...(queryKey ?? [])];
export type PluginsServiceGetFrontendPluginFileDefaultResponse = Awaited<ReturnType<typeof PluginsService.getFrontendPluginFile>>;
export type PluginsServiceGetFrontendPluginFileQueryResult<TData = PluginsServiceGetFrontendPluginFileDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePluginsServiceGetFrontendPluginFileKey = "PluginsServiceGetFrontendPluginFile";
export const UsePluginsServiceGetFrontendPluginFileKeyFn = ({ filePath, pluginName }: {
  filePath: string;
  pluginName: string;
}, queryKey?: Array<unknown>) => [usePluginsServiceGetFrontendPluginFileKey, ...(queryKey ?? [{ filePath, pluginName }])];
export type FabReaderServiceGetReaderByIdDefaultResponse = Awaited<ReturnType<typeof FabReaderService.getReaderById>>;
export type FabReaderServiceGetReaderByIdQueryResult<TData = FabReaderServiceGetReaderByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFabReaderServiceGetReaderByIdKey = "FabReaderServiceGetReaderById";
export const UseFabReaderServiceGetReaderByIdKeyFn = ({ readerId }: {
  readerId: number;
}, queryKey?: Array<unknown>) => [useFabReaderServiceGetReaderByIdKey, ...(queryKey ?? [{ readerId }])];
export type FabReaderServiceGetReadersDefaultResponse = Awaited<ReturnType<typeof FabReaderService.getReaders>>;
export type FabReaderServiceGetReadersQueryResult<TData = FabReaderServiceGetReadersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFabReaderServiceGetReadersKey = "FabReaderServiceGetReaders";
export const UseFabReaderServiceGetReadersKeyFn = (queryKey?: Array<unknown>) => [useFabReaderServiceGetReadersKey, ...(queryKey ?? [])];
export type FabReaderServiceGetAllCardsDefaultResponse = Awaited<ReturnType<typeof FabReaderService.getAllCards>>;
export type FabReaderServiceGetAllCardsQueryResult<TData = FabReaderServiceGetAllCardsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFabReaderServiceGetAllCardsKey = "FabReaderServiceGetAllCards";
export const UseFabReaderServiceGetAllCardsKeyFn = (queryKey?: Array<unknown>) => [useFabReaderServiceGetAllCardsKey, ...(queryKey ?? [])];
export type AnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeDefaultResponse = Awaited<ReturnType<typeof AnalyticsService.analyticsControllerGetResourceUsageHoursInDateRange>>;
export type AnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeQueryResult<TData = AnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKey = "AnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRange";
export const UseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKeyFn = ({ end, start }: {
  end: string;
  start: string;
}, queryKey?: Array<unknown>) => [useAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKey, ...(queryKey ?? [{ end, start }])];
export type UsersServiceCreateOneUserMutationResult = Awaited<ReturnType<typeof UsersService.createOneUser>>;
export type UsersServiceVerifyEmailMutationResult = Awaited<ReturnType<typeof UsersService.verifyEmail>>;
export type UsersServiceRequestPasswordResetMutationResult = Awaited<ReturnType<typeof UsersService.requestPasswordReset>>;
export type UsersServiceChangePasswordViaResetTokenMutationResult = Awaited<ReturnType<typeof UsersService.changePasswordViaResetToken>>;
export type UsersServiceBulkUpdatePermissionsMutationResult = Awaited<ReturnType<typeof UsersService.bulkUpdatePermissions>>;
export type AuthenticationServiceCreateSessionMutationResult = Awaited<ReturnType<typeof AuthenticationService.createSession>>;
export type AuthenticationServiceCreateOneSsoProviderMutationResult = Awaited<ReturnType<typeof AuthenticationService.createOneSsoProvider>>;
export type AuthenticationServiceRegisterMutationResult = Awaited<ReturnType<typeof AuthenticationService.register>>;
export type AuthenticationServiceAuthenticateMutationResult = Awaited<ReturnType<typeof AuthenticationService.authenticate>>;
export type EmailTemplatesServiceEmailTemplateControllerPreviewMjmlMutationResult = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerPreviewMjml>>;
export type ResourcesServiceCreateOneResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.createOneResource>>;
export type ResourcesServiceResourceGroupsCreateOneMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceGroupsCreateOne>>;
export type ResourcesServiceResourceGroupsAddResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceGroupsAddResource>>;
export type ResourcesServiceResourceUsageStartSessionMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceUsageStartSession>>;
export type MqttServiceMqttServersCreateOneMutationResult = Awaited<ReturnType<typeof MqttService.mqttServersCreateOne>>;
export type MqttServiceMqttServersTestConnectionMutationResult = Awaited<ReturnType<typeof MqttService.mqttServersTestConnection>>;
export type MqttServiceMqttResourceConfigCreateMutationResult = Awaited<ReturnType<typeof MqttService.mqttResourceConfigCreate>>;
export type MqttServiceMqttResourceConfigTestOneMutationResult = Awaited<ReturnType<typeof MqttService.mqttResourceConfigTestOne>>;
export type WebhooksServiceWebhookConfigCreateOneMutationResult = Awaited<ReturnType<typeof WebhooksService.webhookConfigCreateOne>>;
export type WebhooksServiceWebhookConfigTestMutationResult = Awaited<ReturnType<typeof WebhooksService.webhookConfigTest>>;
export type WebhooksServiceWebhookConfigRegenerateSecretMutationResult = Awaited<ReturnType<typeof WebhooksService.webhookConfigRegenerateSecret>>;
export type AccessControlServiceResourceGroupIntroductionsGrantMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroductionsGrant>>;
export type AccessControlServiceResourceGroupIntroductionsRevokeMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroductionsRevoke>>;
export type AccessControlServiceResourceGroupIntroducersGrantMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroducersGrant>>;
export type AccessControlServiceResourceGroupIntroducersRevokeMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceGroupIntroducersRevoke>>;
export type AccessControlServiceResourceIntroducersGrantMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceIntroducersGrant>>;
export type AccessControlServiceResourceIntroductionsGrantMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceIntroductionsGrant>>;
export type PluginsServiceUploadPluginMutationResult = Awaited<ReturnType<typeof PluginsService.uploadPlugin>>;
export type FabReaderServiceEnrollNfcCardMutationResult = Awaited<ReturnType<typeof FabReaderService.enrollNfcCard>>;
export type FabReaderServiceResetNfcCardMutationResult = Awaited<ReturnType<typeof FabReaderService.resetNfcCard>>;
export type FabReaderServiceGetAppKeyByUidMutationResult = Awaited<ReturnType<typeof FabReaderService.getAppKeyByUid>>;
export type AuthenticationServiceUpdateOneSsoProviderMutationResult = Awaited<ReturnType<typeof AuthenticationService.updateOneSsoProvider>>;
export type ResourcesServiceUpdateOneResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.updateOneResource>>;
export type ResourcesServiceResourceGroupsUpdateOneMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceGroupsUpdateOne>>;
export type ResourcesServiceResourceUsageEndSessionMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceUsageEndSession>>;
export type MqttServiceMqttServersUpdateOneMutationResult = Awaited<ReturnType<typeof MqttService.mqttServersUpdateOne>>;
export type MqttServiceMqttResourceConfigUpdateMutationResult = Awaited<ReturnType<typeof MqttService.mqttResourceConfigUpdate>>;
export type WebhooksServiceWebhookConfigUpdateOneMutationResult = Awaited<ReturnType<typeof WebhooksService.webhookConfigUpdateOne>>;
export type WebhooksServiceWebhookConfigUpdateStatusMutationResult = Awaited<ReturnType<typeof WebhooksService.webhookConfigUpdateStatus>>;
export type UsersServiceUpdatePermissionsMutationResult = Awaited<ReturnType<typeof UsersService.updatePermissions>>;
export type EmailTemplatesServiceEmailTemplateControllerUpdateMutationResult = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerUpdate>>;
export type FabReaderServiceUpdateReaderMutationResult = Awaited<ReturnType<typeof FabReaderService.updateReader>>;
export type AuthenticationServiceEndSessionMutationResult = Awaited<ReturnType<typeof AuthenticationService.endSession>>;
export type AuthenticationServiceDeleteOneSsoProviderMutationResult = Awaited<ReturnType<typeof AuthenticationService.deleteOneSsoProvider>>;
export type ResourcesServiceDeleteOneResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.deleteOneResource>>;
export type ResourcesServiceResourceGroupsRemoveResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceGroupsRemoveResource>>;
export type ResourcesServiceResourceGroupsDeleteOneMutationResult = Awaited<ReturnType<typeof ResourcesService.resourceGroupsDeleteOne>>;
export type MqttServiceMqttServersDeleteOneMutationResult = Awaited<ReturnType<typeof MqttService.mqttServersDeleteOne>>;
export type MqttServiceMqttResourceConfigDeleteOneMutationResult = Awaited<ReturnType<typeof MqttService.mqttResourceConfigDeleteOne>>;
export type WebhooksServiceWebhookConfigDeleteOneMutationResult = Awaited<ReturnType<typeof WebhooksService.webhookConfigDeleteOne>>;
export type AccessControlServiceResourceIntroducersRevokeMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceIntroducersRevoke>>;
export type AccessControlServiceResourceIntroductionsRevokeMutationResult = Awaited<ReturnType<typeof AccessControlService.resourceIntroductionsRevoke>>;
export type PluginsServiceDeletePluginMutationResult = Awaited<ReturnType<typeof PluginsService.deletePlugin>>;

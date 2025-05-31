// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { AnalyticsService, ApplicationService, AuthenticationService, EmailTemplatesService, FabReaderNfcCardsService, FabReaderReadersService, MqttResourceConfigurationService, MqttServersService, PluginService, ResourceGroupsService, ResourceIntroducersService, ResourceIntroductionsService, ResourceUsageService, ResourcesService, SseService, SsoService, UsersService, WebhooksService } from "../requests/services.gen";
export type ApplicationServicePing2DefaultResponse = Awaited<ReturnType<typeof ApplicationService.ping2>>;
export type ApplicationServicePing2QueryResult<TData = ApplicationServicePing2DefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useApplicationServicePing2Key = "ApplicationServicePing2";
export const UseApplicationServicePing2KeyFn = (queryKey?: Array<unknown>) => [useApplicationServicePing2Key, ...(queryKey ?? [])];
export type UsersServiceGetAllUsersDefaultResponse = Awaited<ReturnType<typeof UsersService.getAllUsers>>;
export type UsersServiceGetAllUsersQueryResult<TData = UsersServiceGetAllUsersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetAllUsersKey = "UsersServiceGetAllUsers";
export const UseUsersServiceGetAllUsersKeyFn = ({ limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: Array<unknown>) => [useUsersServiceGetAllUsersKey, ...(queryKey ?? [{ limit, page, search }])];
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
export type SsoServiceGetAllSsoProvidersDefaultResponse = Awaited<ReturnType<typeof SsoService.getAllSsoProviders>>;
export type SsoServiceGetAllSsoProvidersQueryResult<TData = SsoServiceGetAllSsoProvidersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSsoServiceGetAllSsoProvidersKey = "SsoServiceGetAllSsoProviders";
export const UseSsoServiceGetAllSsoProvidersKeyFn = (queryKey?: Array<unknown>) => [useSsoServiceGetAllSsoProvidersKey, ...(queryKey ?? [])];
export type SsoServiceGetOneSsoProviderByIdDefaultResponse = Awaited<ReturnType<typeof SsoService.getOneSsoProviderById>>;
export type SsoServiceGetOneSsoProviderByIdQueryResult<TData = SsoServiceGetOneSsoProviderByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSsoServiceGetOneSsoProviderByIdKey = "SsoServiceGetOneSsoProviderById";
export const UseSsoServiceGetOneSsoProviderByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useSsoServiceGetOneSsoProviderByIdKey, ...(queryKey ?? [{ id }])];
export type SsoServiceLoginWithOidcDefaultResponse = Awaited<ReturnType<typeof SsoService.loginWithOidc>>;
export type SsoServiceLoginWithOidcQueryResult<TData = SsoServiceLoginWithOidcDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSsoServiceLoginWithOidcKey = "SsoServiceLoginWithOidc";
export const UseSsoServiceLoginWithOidcKeyFn = ({ providerId, redirectTo }: {
  providerId: string;
  redirectTo?: unknown;
}, queryKey?: Array<unknown>) => [useSsoServiceLoginWithOidcKey, ...(queryKey ?? [{ providerId, redirectTo }])];
export type SsoServiceOidcLoginCallbackDefaultResponse = Awaited<ReturnType<typeof SsoService.oidcLoginCallback>>;
export type SsoServiceOidcLoginCallbackQueryResult<TData = SsoServiceOidcLoginCallbackDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSsoServiceOidcLoginCallbackKey = "SsoServiceOidcLoginCallback";
export const UseSsoServiceOidcLoginCallbackKeyFn = ({ code, iss, providerId, redirectTo, sessionState, state }: {
  code: unknown;
  iss: unknown;
  providerId: string;
  redirectTo: string;
  sessionState: unknown;
  state: unknown;
}, queryKey?: Array<unknown>) => [useSsoServiceOidcLoginCallbackKey, ...(queryKey ?? [{ code, iss, providerId, redirectTo, sessionState, state }])];
export type EmailTemplatesServiceEmailTemplateControllerFindAllDefaultResponse = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerFindAll>>;
export type EmailTemplatesServiceEmailTemplateControllerFindAllQueryResult<TData = EmailTemplatesServiceEmailTemplateControllerFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEmailTemplatesServiceEmailTemplateControllerFindAllKey = "EmailTemplatesServiceEmailTemplateControllerFindAll";
export const UseEmailTemplatesServiceEmailTemplateControllerFindAllKeyFn = (queryKey?: Array<unknown>) => [useEmailTemplatesServiceEmailTemplateControllerFindAllKey, ...(queryKey ?? [])];
export type EmailTemplatesServiceEmailTemplateControllerFindOneDefaultResponse = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerFindOne>>;
export type EmailTemplatesServiceEmailTemplateControllerFindOneQueryResult<TData = EmailTemplatesServiceEmailTemplateControllerFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEmailTemplatesServiceEmailTemplateControllerFindOneKey = "EmailTemplatesServiceEmailTemplateControllerFindOne";
export const UseEmailTemplatesServiceEmailTemplateControllerFindOneKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useEmailTemplatesServiceEmailTemplateControllerFindOneKey, ...(queryKey ?? [{ id }])];
export type ResourceGroupsServiceGetAllResourceGroupsDefaultResponse = Awaited<ReturnType<typeof ResourceGroupsService.getAllResourceGroups>>;
export type ResourceGroupsServiceGetAllResourceGroupsQueryResult<TData = ResourceGroupsServiceGetAllResourceGroupsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceGroupsServiceGetAllResourceGroupsKey = "ResourceGroupsServiceGetAllResourceGroups";
export const UseResourceGroupsServiceGetAllResourceGroupsKeyFn = ({ limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: Array<unknown>) => [useResourceGroupsServiceGetAllResourceGroupsKey, ...(queryKey ?? [{ limit, page, search }])];
export type ResourceGroupsServiceGetOneResourceGroupByIdDefaultResponse = Awaited<ReturnType<typeof ResourceGroupsService.getOneResourceGroupById>>;
export type ResourceGroupsServiceGetOneResourceGroupByIdQueryResult<TData = ResourceGroupsServiceGetOneResourceGroupByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceGroupsServiceGetOneResourceGroupByIdKey = "ResourceGroupsServiceGetOneResourceGroupById";
export const UseResourceGroupsServiceGetOneResourceGroupByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useResourceGroupsServiceGetOneResourceGroupByIdKey, ...(queryKey ?? [{ id }])];
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
export type ResourceUsageServiceGetHistoryOfResourceUsageDefaultResponse = Awaited<ReturnType<typeof ResourceUsageService.getHistoryOfResourceUsage>>;
export type ResourceUsageServiceGetHistoryOfResourceUsageQueryResult<TData = ResourceUsageServiceGetHistoryOfResourceUsageDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceUsageServiceGetHistoryOfResourceUsageKey = "ResourceUsageServiceGetHistoryOfResourceUsage";
export const UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn = ({ limit, page, resourceId, userId }: {
  limit?: number;
  page?: number;
  resourceId: number;
  userId?: number;
}, queryKey?: Array<unknown>) => [useResourceUsageServiceGetHistoryOfResourceUsageKey, ...(queryKey ?? [{ limit, page, resourceId, userId }])];
export type ResourceUsageServiceGetActiveSessionDefaultResponse = Awaited<ReturnType<typeof ResourceUsageService.getActiveSession>>;
export type ResourceUsageServiceGetActiveSessionQueryResult<TData = ResourceUsageServiceGetActiveSessionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceUsageServiceGetActiveSessionKey = "ResourceUsageServiceGetActiveSession";
export const UseResourceUsageServiceGetActiveSessionKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceUsageServiceGetActiveSessionKey, ...(queryKey ?? [{ resourceId }])];
export type ResourceIntroductionsServiceGetAllResourceIntroductionsDefaultResponse = Awaited<ReturnType<typeof ResourceIntroductionsService.getAllResourceIntroductions>>;
export type ResourceIntroductionsServiceGetAllResourceIntroductionsQueryResult<TData = ResourceIntroductionsServiceGetAllResourceIntroductionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroductionsServiceGetAllResourceIntroductionsKey = "ResourceIntroductionsServiceGetAllResourceIntroductions";
export const UseResourceIntroductionsServiceGetAllResourceIntroductionsKeyFn = ({ limit, page, resourceId }: {
  limit: number;
  page?: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroductionsServiceGetAllResourceIntroductionsKey, ...(queryKey ?? [{ limit, page, resourceId }])];
export type ResourceIntroductionsServiceCheckStatusDefaultResponse = Awaited<ReturnType<typeof ResourceIntroductionsService.checkStatus>>;
export type ResourceIntroductionsServiceCheckStatusQueryResult<TData = ResourceIntroductionsServiceCheckStatusDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroductionsServiceCheckStatusKey = "ResourceIntroductionsServiceCheckStatus";
export const UseResourceIntroductionsServiceCheckStatusKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroductionsServiceCheckStatusKey, ...(queryKey ?? [{ resourceId }])];
export type ResourceIntroductionsServiceGetHistoryOfIntroductionDefaultResponse = Awaited<ReturnType<typeof ResourceIntroductionsService.getHistoryOfIntroduction>>;
export type ResourceIntroductionsServiceGetHistoryOfIntroductionQueryResult<TData = ResourceIntroductionsServiceGetHistoryOfIntroductionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroductionsServiceGetHistoryOfIntroductionKey = "ResourceIntroductionsServiceGetHistoryOfIntroduction";
export const UseResourceIntroductionsServiceGetHistoryOfIntroductionKeyFn = ({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroductionsServiceGetHistoryOfIntroductionKey, ...(queryKey ?? [{ introductionId, resourceId }])];
export type ResourceIntroductionsServiceCheckIsRevokedStatusDefaultResponse = Awaited<ReturnType<typeof ResourceIntroductionsService.checkIsRevokedStatus>>;
export type ResourceIntroductionsServiceCheckIsRevokedStatusQueryResult<TData = ResourceIntroductionsServiceCheckIsRevokedStatusDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroductionsServiceCheckIsRevokedStatusKey = "ResourceIntroductionsServiceCheckIsRevokedStatus";
export const UseResourceIntroductionsServiceCheckIsRevokedStatusKeyFn = ({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroductionsServiceCheckIsRevokedStatusKey, ...(queryKey ?? [{ introductionId, resourceId }])];
export type ResourceIntroductionsServiceGetOneResourceIntroductionDefaultResponse = Awaited<ReturnType<typeof ResourceIntroductionsService.getOneResourceIntroduction>>;
export type ResourceIntroductionsServiceGetOneResourceIntroductionQueryResult<TData = ResourceIntroductionsServiceGetOneResourceIntroductionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroductionsServiceGetOneResourceIntroductionKey = "ResourceIntroductionsServiceGetOneResourceIntroduction";
export const UseResourceIntroductionsServiceGetOneResourceIntroductionKeyFn = ({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroductionsServiceGetOneResourceIntroductionKey, ...(queryKey ?? [{ introductionId, resourceId }])];
export type ResourceIntroductionsServiceCheckCanManagePermissionDefaultResponse = Awaited<ReturnType<typeof ResourceIntroductionsService.checkCanManagePermission>>;
export type ResourceIntroductionsServiceCheckCanManagePermissionQueryResult<TData = ResourceIntroductionsServiceCheckCanManagePermissionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroductionsServiceCheckCanManagePermissionKey = "ResourceIntroductionsServiceCheckCanManagePermission";
export const UseResourceIntroductionsServiceCheckCanManagePermissionKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroductionsServiceCheckCanManagePermissionKey, ...(queryKey ?? [{ resourceId }])];
export type ResourceIntroducersServiceGetAllResourceIntroducersDefaultResponse = Awaited<ReturnType<typeof ResourceIntroducersService.getAllResourceIntroducers>>;
export type ResourceIntroducersServiceGetAllResourceIntroducersQueryResult<TData = ResourceIntroducersServiceGetAllResourceIntroducersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroducersServiceGetAllResourceIntroducersKey = "ResourceIntroducersServiceGetAllResourceIntroducers";
export const UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroducersServiceGetAllResourceIntroducersKey, ...(queryKey ?? [{ resourceId }])];
export type ResourceIntroducersServiceCheckCanManagePermissionDefaultResponse = Awaited<ReturnType<typeof ResourceIntroducersService.checkCanManagePermission>>;
export type ResourceIntroducersServiceCheckCanManagePermissionQueryResult<TData = ResourceIntroducersServiceCheckCanManagePermissionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useResourceIntroducersServiceCheckCanManagePermissionKey = "ResourceIntroducersServiceCheckCanManagePermission";
export const UseResourceIntroducersServiceCheckCanManagePermissionKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useResourceIntroducersServiceCheckCanManagePermissionKey, ...(queryKey ?? [{ resourceId }])];
export type MqttServersServiceGetAllMqttServersDefaultResponse = Awaited<ReturnType<typeof MqttServersService.getAllMqttServers>>;
export type MqttServersServiceGetAllMqttServersQueryResult<TData = MqttServersServiceGetAllMqttServersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServersServiceGetAllMqttServersKey = "MqttServersServiceGetAllMqttServers";
export const UseMqttServersServiceGetAllMqttServersKeyFn = (queryKey?: Array<unknown>) => [useMqttServersServiceGetAllMqttServersKey, ...(queryKey ?? [])];
export type MqttServersServiceGetOneMqttServerByIdDefaultResponse = Awaited<ReturnType<typeof MqttServersService.getOneMqttServerById>>;
export type MqttServersServiceGetOneMqttServerByIdQueryResult<TData = MqttServersServiceGetOneMqttServerByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServersServiceGetOneMqttServerByIdKey = "MqttServersServiceGetOneMqttServerById";
export const UseMqttServersServiceGetOneMqttServerByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useMqttServersServiceGetOneMqttServerByIdKey, ...(queryKey ?? [{ id }])];
export type MqttServersServiceGetStatusOfOneDefaultResponse = Awaited<ReturnType<typeof MqttServersService.getStatusOfOne>>;
export type MqttServersServiceGetStatusOfOneQueryResult<TData = MqttServersServiceGetStatusOfOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServersServiceGetStatusOfOneKey = "MqttServersServiceGetStatusOfOne";
export const UseMqttServersServiceGetStatusOfOneKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useMqttServersServiceGetStatusOfOneKey, ...(queryKey ?? [{ id }])];
export type MqttServersServiceGetStatusOfAllDefaultResponse = Awaited<ReturnType<typeof MqttServersService.getStatusOfAll>>;
export type MqttServersServiceGetStatusOfAllQueryResult<TData = MqttServersServiceGetStatusOfAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttServersServiceGetStatusOfAllKey = "MqttServersServiceGetStatusOfAll";
export const UseMqttServersServiceGetStatusOfAllKeyFn = (queryKey?: Array<unknown>) => [useMqttServersServiceGetStatusOfAllKey, ...(queryKey ?? [])];
export type SseServiceSseControllerStreamEventsDefaultResponse = Awaited<ReturnType<typeof SseService.sseControllerStreamEvents>>;
export type SseServiceSseControllerStreamEventsQueryResult<TData = SseServiceSseControllerStreamEventsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSseServiceSseControllerStreamEventsKey = "SseServiceSseControllerStreamEvents";
export const UseSseServiceSseControllerStreamEventsKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useSseServiceSseControllerStreamEventsKey, ...(queryKey ?? [{ resourceId }])];
export type WebhooksServiceGetAllWebhookConfigurationsDefaultResponse = Awaited<ReturnType<typeof WebhooksService.getAllWebhookConfigurations>>;
export type WebhooksServiceGetAllWebhookConfigurationsQueryResult<TData = WebhooksServiceGetAllWebhookConfigurationsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useWebhooksServiceGetAllWebhookConfigurationsKey = "WebhooksServiceGetAllWebhookConfigurations";
export const UseWebhooksServiceGetAllWebhookConfigurationsKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useWebhooksServiceGetAllWebhookConfigurationsKey, ...(queryKey ?? [{ resourceId }])];
export type WebhooksServiceGetOneWebhookConfigurationByIdDefaultResponse = Awaited<ReturnType<typeof WebhooksService.getOneWebhookConfigurationById>>;
export type WebhooksServiceGetOneWebhookConfigurationByIdQueryResult<TData = WebhooksServiceGetOneWebhookConfigurationByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useWebhooksServiceGetOneWebhookConfigurationByIdKey = "WebhooksServiceGetOneWebhookConfigurationById";
export const UseWebhooksServiceGetOneWebhookConfigurationByIdKeyFn = ({ id, resourceId }: {
  id: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useWebhooksServiceGetOneWebhookConfigurationByIdKey, ...(queryKey ?? [{ id, resourceId }])];
export type MqttResourceConfigurationServiceGetAllMqttConfigurationsDefaultResponse = Awaited<ReturnType<typeof MqttResourceConfigurationService.getAllMqttConfigurations>>;
export type MqttResourceConfigurationServiceGetAllMqttConfigurationsQueryResult<TData = MqttResourceConfigurationServiceGetAllMqttConfigurationsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttResourceConfigurationServiceGetAllMqttConfigurationsKey = "MqttResourceConfigurationServiceGetAllMqttConfigurations";
export const UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useMqttResourceConfigurationServiceGetAllMqttConfigurationsKey, ...(queryKey ?? [{ resourceId }])];
export type MqttResourceConfigurationServiceGetOneMqttConfigurationDefaultResponse = Awaited<ReturnType<typeof MqttResourceConfigurationService.getOneMqttConfiguration>>;
export type MqttResourceConfigurationServiceGetOneMqttConfigurationQueryResult<TData = MqttResourceConfigurationServiceGetOneMqttConfigurationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMqttResourceConfigurationServiceGetOneMqttConfigurationKey = "MqttResourceConfigurationServiceGetOneMqttConfiguration";
export const UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn = ({ configId, resourceId }: {
  configId: number;
  resourceId: number;
}, queryKey?: Array<unknown>) => [useMqttResourceConfigurationServiceGetOneMqttConfigurationKey, ...(queryKey ?? [{ configId, resourceId }])];
export type PluginServiceGetPluginsDefaultResponse = Awaited<ReturnType<typeof PluginService.getPlugins>>;
export type PluginServiceGetPluginsQueryResult<TData = PluginServiceGetPluginsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePluginServiceGetPluginsKey = "PluginServiceGetPlugins";
export const UsePluginServiceGetPluginsKeyFn = (queryKey?: Array<unknown>) => [usePluginServiceGetPluginsKey, ...(queryKey ?? [])];
export type PluginServiceGetFrontendPluginFileDefaultResponse = Awaited<ReturnType<typeof PluginService.getFrontendPluginFile>>;
export type PluginServiceGetFrontendPluginFileQueryResult<TData = PluginServiceGetFrontendPluginFileDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePluginServiceGetFrontendPluginFileKey = "PluginServiceGetFrontendPluginFile";
export const UsePluginServiceGetFrontendPluginFileKeyFn = ({ filePath, pluginName }: {
  filePath: string;
  pluginName: string;
}, queryKey?: Array<unknown>) => [usePluginServiceGetFrontendPluginFileKey, ...(queryKey ?? [{ filePath, pluginName }])];
export type FabReaderReadersServiceGetReaderByIdDefaultResponse = Awaited<ReturnType<typeof FabReaderReadersService.getReaderById>>;
export type FabReaderReadersServiceGetReaderByIdQueryResult<TData = FabReaderReadersServiceGetReaderByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFabReaderReadersServiceGetReaderByIdKey = "FabReaderReadersServiceGetReaderById";
export const UseFabReaderReadersServiceGetReaderByIdKeyFn = ({ readerId }: {
  readerId: number;
}, queryKey?: Array<unknown>) => [useFabReaderReadersServiceGetReaderByIdKey, ...(queryKey ?? [{ readerId }])];
export type FabReaderReadersServiceGetReadersDefaultResponse = Awaited<ReturnType<typeof FabReaderReadersService.getReaders>>;
export type FabReaderReadersServiceGetReadersQueryResult<TData = FabReaderReadersServiceGetReadersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFabReaderReadersServiceGetReadersKey = "FabReaderReadersServiceGetReaders";
export const UseFabReaderReadersServiceGetReadersKeyFn = (queryKey?: Array<unknown>) => [useFabReaderReadersServiceGetReadersKey, ...(queryKey ?? [])];
export type FabReaderNfcCardsServiceGetAllCardsDefaultResponse = Awaited<ReturnType<typeof FabReaderNfcCardsService.getAllCards>>;
export type FabReaderNfcCardsServiceGetAllCardsQueryResult<TData = FabReaderNfcCardsServiceGetAllCardsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFabReaderNfcCardsServiceGetAllCardsKey = "FabReaderNfcCardsServiceGetAllCards";
export const UseFabReaderNfcCardsServiceGetAllCardsKeyFn = (queryKey?: Array<unknown>) => [useFabReaderNfcCardsServiceGetAllCardsKey, ...(queryKey ?? [])];
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
export type SsoServiceCreateOneSsoProviderMutationResult = Awaited<ReturnType<typeof SsoService.createOneSsoProvider>>;
export type EmailTemplatesServiceEmailTemplateControllerCreateMutationResult = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerCreate>>;
export type ResourceGroupsServiceCreateOneResourceGroupMutationResult = Awaited<ReturnType<typeof ResourceGroupsService.createOneResourceGroup>>;
export type ResourcesServiceCreateOneResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.createOneResource>>;
export type ResourcesServiceAddResourceToGroupMutationResult = Awaited<ReturnType<typeof ResourcesService.addResourceToGroup>>;
export type ResourceUsageServiceStartSessionMutationResult = Awaited<ReturnType<typeof ResourceUsageService.startSession>>;
export type ResourceIntroductionsServiceMarkCompletedMutationResult = Awaited<ReturnType<typeof ResourceIntroductionsService.markCompleted>>;
export type ResourceIntroductionsServiceMarkRevokedMutationResult = Awaited<ReturnType<typeof ResourceIntroductionsService.markRevoked>>;
export type ResourceIntroductionsServiceMarkUnrevokedMutationResult = Awaited<ReturnType<typeof ResourceIntroductionsService.markUnrevoked>>;
export type ResourceIntroducersServiceAddOneMutationResult = Awaited<ReturnType<typeof ResourceIntroducersService.addOne>>;
export type MqttServersServiceCreateOneMqttServerMutationResult = Awaited<ReturnType<typeof MqttServersService.createOneMqttServer>>;
export type MqttServersServiceTestConnectionMutationResult = Awaited<ReturnType<typeof MqttServersService.testConnection>>;
export type WebhooksServiceCreateOneWebhookConfigurationMutationResult = Awaited<ReturnType<typeof WebhooksService.createOneWebhookConfiguration>>;
export type WebhooksServiceTestMutationResult = Awaited<ReturnType<typeof WebhooksService.test>>;
export type WebhooksServiceRegenerateSecretMutationResult = Awaited<ReturnType<typeof WebhooksService.regenerateSecret>>;
export type MqttResourceConfigurationServiceCreateMqttConfigurationMutationResult = Awaited<ReturnType<typeof MqttResourceConfigurationService.createMqttConfiguration>>;
export type MqttResourceConfigurationServiceTestOneMutationResult = Awaited<ReturnType<typeof MqttResourceConfigurationService.testOne>>;
export type PluginServiceUploadPluginMutationResult = Awaited<ReturnType<typeof PluginService.uploadPlugin>>;
export type FabReaderReadersServiceEnrollNfcCardMutationResult = Awaited<ReturnType<typeof FabReaderReadersService.enrollNfcCard>>;
export type FabReaderReadersServiceResetNfcCardMutationResult = Awaited<ReturnType<typeof FabReaderReadersService.resetNfcCard>>;
export type FabReaderNfcCardsServiceGetAppKeyByUidMutationResult = Awaited<ReturnType<typeof FabReaderNfcCardsService.getAppKeyByUid>>;
export type SsoServiceUpdateOneSsoProviderMutationResult = Awaited<ReturnType<typeof SsoService.updateOneSsoProvider>>;
export type ResourcesServiceUpdateOneResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.updateOneResource>>;
export type ResourceUsageServiceEndSessionMutationResult = Awaited<ReturnType<typeof ResourceUsageService.endSession>>;
export type MqttServersServiceUpdateOneMqttServerMutationResult = Awaited<ReturnType<typeof MqttServersService.updateOneMqttServer>>;
export type WebhooksServiceUpdateOneWebhookConfigurationMutationResult = Awaited<ReturnType<typeof WebhooksService.updateOneWebhookConfiguration>>;
export type WebhooksServiceUpdateStatusMutationResult = Awaited<ReturnType<typeof WebhooksService.updateStatus>>;
export type MqttResourceConfigurationServiceUpdateMqttConfigurationMutationResult = Awaited<ReturnType<typeof MqttResourceConfigurationService.updateMqttConfiguration>>;
export type UsersServiceUpdatePermissionsMutationResult = Awaited<ReturnType<typeof UsersService.updatePermissions>>;
export type EmailTemplatesServiceEmailTemplateControllerUpdateMutationResult = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerUpdate>>;
export type ResourceGroupsServiceUpdateOneResourceGroupMutationResult = Awaited<ReturnType<typeof ResourceGroupsService.updateOneResourceGroup>>;
export type FabReaderReadersServiceUpdateReaderMutationResult = Awaited<ReturnType<typeof FabReaderReadersService.updateReader>>;
export type AuthenticationServiceEndSessionMutationResult = Awaited<ReturnType<typeof AuthenticationService.endSession>>;
export type SsoServiceDeleteOneSsoProviderMutationResult = Awaited<ReturnType<typeof SsoService.deleteOneSsoProvider>>;
export type EmailTemplatesServiceEmailTemplateControllerRemoveMutationResult = Awaited<ReturnType<typeof EmailTemplatesService.emailTemplateControllerRemove>>;
export type ResourceGroupsServiceDeleteOneResourceGroupMutationResult = Awaited<ReturnType<typeof ResourceGroupsService.deleteOneResourceGroup>>;
export type ResourcesServiceDeleteOneResourceMutationResult = Awaited<ReturnType<typeof ResourcesService.deleteOneResource>>;
export type ResourcesServiceRemoveResourceFromGroupMutationResult = Awaited<ReturnType<typeof ResourcesService.removeResourceFromGroup>>;
export type ResourceIntroducersServiceRemoveOneMutationResult = Awaited<ReturnType<typeof ResourceIntroducersService.removeOne>>;
export type MqttServersServiceDeleteOneMqttServerMutationResult = Awaited<ReturnType<typeof MqttServersService.deleteOneMqttServer>>;
export type WebhooksServiceDeleteOneWebhookConfigurationMutationResult = Awaited<ReturnType<typeof WebhooksService.deleteOneWebhookConfiguration>>;
export type MqttResourceConfigurationServiceDeleteOneMqttConfigurationMutationResult = Awaited<ReturnType<typeof MqttResourceConfigurationService.deleteOneMqttConfiguration>>;
export type PluginServiceDeletePluginMutationResult = Awaited<ReturnType<typeof PluginService.deletePlugin>>;

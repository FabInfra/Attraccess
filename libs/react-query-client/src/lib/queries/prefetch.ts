// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { AnalyticsService, ApplicationService, FabReaderNfcCardsService, FabReaderReadersService, MqttResourceConfigurationService, MqttServersService, PluginService, ResourceGroupsService, ResourceIntroducersService, ResourceIntroductionsService, ResourceUsageService, ResourcesService, SseService, SsoService, UsersService, WebhooksService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseApplicationServicePing2 = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseApplicationServicePing2KeyFn(), queryFn: () => ApplicationService.ping2() });
export const prefetchUseUsersServiceGetAllUsers = (queryClient: QueryClient, { limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetAllUsersKeyFn({ limit, page, search }), queryFn: () => UsersService.getAllUsers({ limit, page, search }) });
export const prefetchUseUsersServiceGetCurrent = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetCurrentKeyFn(), queryFn: () => UsersService.getCurrent() });
export const prefetchUseUsersServiceGetOneUserById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetOneUserByIdKeyFn({ id }), queryFn: () => UsersService.getOneUserById({ id }) });
export const prefetchUseUsersServiceGetPermissions = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetPermissionsKeyFn({ id }), queryFn: () => UsersService.getPermissions({ id }) });
export const prefetchUseUsersServiceGetAllWithPermission = (queryClient: QueryClient, { limit, page, permission }: {
  limit?: number;
  page?: number;
  permission?: "canManageResources" | "canManageSystemConfiguration" | "canManageUsers";
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetAllWithPermissionKeyFn({ limit, page, permission }), queryFn: () => UsersService.getAllWithPermission({ limit, page, permission }) });
export const prefetchUseSsoServiceGetAllSsoProviders = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSsoServiceGetAllSsoProvidersKeyFn(), queryFn: () => SsoService.getAllSsoProviders() });
export const prefetchUseSsoServiceGetOneSsoProviderById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSsoServiceGetOneSsoProviderByIdKeyFn({ id }), queryFn: () => SsoService.getOneSsoProviderById({ id }) });
export const prefetchUseSsoServiceLoginWithOidc = (queryClient: QueryClient, { providerId, redirectTo }: {
  providerId: string;
  redirectTo?: unknown;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSsoServiceLoginWithOidcKeyFn({ providerId, redirectTo }), queryFn: () => SsoService.loginWithOidc({ providerId, redirectTo }) });
export const prefetchUseSsoServiceOidcLoginCallback = (queryClient: QueryClient, { code, iss, providerId, redirectTo, sessionState, state }: {
  code: unknown;
  iss: unknown;
  providerId: string;
  redirectTo: string;
  sessionState: unknown;
  state: unknown;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSsoServiceOidcLoginCallbackKeyFn({ code, iss, providerId, redirectTo, sessionState, state }), queryFn: () => SsoService.oidcLoginCallback({ code, iss, providerId, redirectTo, sessionState, state }) });
export const prefetchUseResourceGroupsServiceGetAllResourceGroups = (queryClient: QueryClient, { limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupsServiceGetAllResourceGroupsKeyFn({ limit, page, search }), queryFn: () => ResourceGroupsService.getAllResourceGroups({ limit, page, search }) });
export const prefetchUseResourceGroupsServiceGetOneResourceGroupById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupsServiceGetOneResourceGroupByIdKeyFn({ id }), queryFn: () => ResourceGroupsService.getOneResourceGroupById({ id }) });
export const prefetchUseResourcesServiceGetAllResources = (queryClient: QueryClient, { groupId, ids, limit, page, search }: {
  groupId?: number;
  ids?: number[];
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseResourcesServiceGetAllResourcesKeyFn({ groupId, ids, limit, page, search }), queryFn: () => ResourcesService.getAllResources({ groupId, ids, limit, page, search }) });
export const prefetchUseResourcesServiceGetOneResourceById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourcesServiceGetOneResourceByIdKeyFn({ id }), queryFn: () => ResourcesService.getOneResourceById({ id }) });
export const prefetchUseResourceUsageServiceGetHistoryOfResourceUsage = (queryClient: QueryClient, { limit, page, resourceId, userId }: {
  limit?: number;
  page?: number;
  resourceId: number;
  userId?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn({ limit, page, resourceId, userId }), queryFn: () => ResourceUsageService.getHistoryOfResourceUsage({ limit, page, resourceId, userId }) });
export const prefetchUseResourceUsageServiceGetActiveSession = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceUsageServiceGetActiveSessionKeyFn({ resourceId }), queryFn: () => ResourceUsageService.getActiveSession({ resourceId }) });
export const prefetchUseResourceIntroductionsServiceGetAllResourceIntroductions = (queryClient: QueryClient, { limit, page, resourceId }: {
  limit: number;
  page?: number;
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroductionsServiceGetAllResourceIntroductionsKeyFn({ limit, page, resourceId }), queryFn: () => ResourceIntroductionsService.getAllResourceIntroductions({ limit, page, resourceId }) });
export const prefetchUseResourceIntroductionsServiceCheckStatus = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroductionsServiceCheckStatusKeyFn({ resourceId }), queryFn: () => ResourceIntroductionsService.checkStatus({ resourceId }) });
export const prefetchUseResourceIntroductionsServiceGetHistoryOfIntroduction = (queryClient: QueryClient, { introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroductionsServiceGetHistoryOfIntroductionKeyFn({ introductionId, resourceId }), queryFn: () => ResourceIntroductionsService.getHistoryOfIntroduction({ introductionId, resourceId }) });
export const prefetchUseResourceIntroductionsServiceCheckIsRevokedStatus = (queryClient: QueryClient, { introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroductionsServiceCheckIsRevokedStatusKeyFn({ introductionId, resourceId }), queryFn: () => ResourceIntroductionsService.checkIsRevokedStatus({ introductionId, resourceId }) });
export const prefetchUseResourceIntroductionsServiceGetOneResourceIntroduction = (queryClient: QueryClient, { introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroductionsServiceGetOneResourceIntroductionKeyFn({ introductionId, resourceId }), queryFn: () => ResourceIntroductionsService.getOneResourceIntroduction({ introductionId, resourceId }) });
export const prefetchUseResourceIntroductionsServiceCheckCanManagePermission = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroductionsServiceCheckCanManagePermissionKeyFn({ resourceId }), queryFn: () => ResourceIntroductionsService.checkCanManagePermission({ resourceId }) });
export const prefetchUseResourceIntroducersServiceGetAllResourceIntroducers = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn({ resourceId }), queryFn: () => ResourceIntroducersService.getAllResourceIntroducers({ resourceId }) });
export const prefetchUseResourceIntroducersServiceCheckCanManagePermission = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceIntroducersServiceCheckCanManagePermissionKeyFn({ resourceId }), queryFn: () => ResourceIntroducersService.checkCanManagePermission({ resourceId }) });
export const prefetchUseMqttServersServiceGetAllMqttServers = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMqttServersServiceGetAllMqttServersKeyFn(), queryFn: () => MqttServersService.getAllMqttServers() });
export const prefetchUseMqttServersServiceGetOneMqttServerById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMqttServersServiceGetOneMqttServerByIdKeyFn({ id }), queryFn: () => MqttServersService.getOneMqttServerById({ id }) });
export const prefetchUseMqttServersServiceGetStatusOfOne = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMqttServersServiceGetStatusOfOneKeyFn({ id }), queryFn: () => MqttServersService.getStatusOfOne({ id }) });
export const prefetchUseMqttServersServiceGetStatusOfAll = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMqttServersServiceGetStatusOfAllKeyFn(), queryFn: () => MqttServersService.getStatusOfAll() });
export const prefetchUseSseServiceSseControllerStreamEvents = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSseServiceSseControllerStreamEventsKeyFn({ resourceId }), queryFn: () => SseService.sseControllerStreamEvents({ resourceId }) });
export const prefetchUseWebhooksServiceGetAllWebhookConfigurations = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseWebhooksServiceGetAllWebhookConfigurationsKeyFn({ resourceId }), queryFn: () => WebhooksService.getAllWebhookConfigurations({ resourceId }) });
export const prefetchUseWebhooksServiceGetOneWebhookConfigurationById = (queryClient: QueryClient, { id, resourceId }: {
  id: number;
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseWebhooksServiceGetOneWebhookConfigurationByIdKeyFn({ id, resourceId }), queryFn: () => WebhooksService.getOneWebhookConfigurationById({ id, resourceId }) });
export const prefetchUseMqttResourceConfigurationServiceGetAllMqttConfigurations = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn({ resourceId }), queryFn: () => MqttResourceConfigurationService.getAllMqttConfigurations({ resourceId }) });
export const prefetchUseMqttResourceConfigurationServiceGetOneMqttConfiguration = (queryClient: QueryClient, { configId, resourceId }: {
  configId: number;
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ configId, resourceId }), queryFn: () => MqttResourceConfigurationService.getOneMqttConfiguration({ configId, resourceId }) });
export const prefetchUsePluginServiceGetPlugins = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UsePluginServiceGetPluginsKeyFn(), queryFn: () => PluginService.getPlugins() });
export const prefetchUsePluginServiceGetFrontendPluginFile = (queryClient: QueryClient, { filePath, pluginName }: {
  filePath: string;
  pluginName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UsePluginServiceGetFrontendPluginFileKeyFn({ filePath, pluginName }), queryFn: () => PluginService.getFrontendPluginFile({ filePath, pluginName }) });
export const prefetchUseFabReaderReadersServiceGetReaderById = (queryClient: QueryClient, { readerId }: {
  readerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFabReaderReadersServiceGetReaderByIdKeyFn({ readerId }), queryFn: () => FabReaderReadersService.getReaderById({ readerId }) });
export const prefetchUseFabReaderReadersServiceGetReaders = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFabReaderReadersServiceGetReadersKeyFn(), queryFn: () => FabReaderReadersService.getReaders() });
export const prefetchUseFabReaderNfcCardsServiceGetAllCards = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFabReaderNfcCardsServiceGetAllCardsKeyFn(), queryFn: () => FabReaderNfcCardsService.getAllCards() });
export const prefetchUseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRange = (queryClient: QueryClient, { end, start }: {
  end: string;
  start: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKeyFn({ end, start }), queryFn: () => AnalyticsService.analyticsControllerGetResourceUsageHoursInDateRange({ end, start }) });

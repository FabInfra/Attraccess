// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { AnalyticsService, ApplicationService, EmailTemplatesService, FabReaderNfcCardsService, FabReaderReadersService, MqttResourceConfigurationService, MqttServersService, PluginService, ResourceGroupsService, ResourceIntroducersService, ResourceIntroductionsService, ResourceUsageService, ResourcesService, SseService, SsoService, UsersService, WebhooksService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseApplicationServicePing2Data = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseApplicationServicePing2KeyFn(), queryFn: () => ApplicationService.ping2() });
export const ensureUseUsersServiceGetAllUsersData = (queryClient: QueryClient, { limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetAllUsersKeyFn({ limit, page, search }), queryFn: () => UsersService.getAllUsers({ limit, page, search }) });
export const ensureUseUsersServiceGetCurrentData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetCurrentKeyFn(), queryFn: () => UsersService.getCurrent() });
export const ensureUseUsersServiceGetOneUserByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetOneUserByIdKeyFn({ id }), queryFn: () => UsersService.getOneUserById({ id }) });
export const ensureUseUsersServiceGetPermissionsData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetPermissionsKeyFn({ id }), queryFn: () => UsersService.getPermissions({ id }) });
export const ensureUseUsersServiceGetAllWithPermissionData = (queryClient: QueryClient, { limit, page, permission }: {
  limit?: number;
  page?: number;
  permission?: "canManageResources" | "canManageSystemConfiguration" | "canManageUsers";
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetAllWithPermissionKeyFn({ limit, page, permission }), queryFn: () => UsersService.getAllWithPermission({ limit, page, permission }) });
export const ensureUseSsoServiceGetAllSsoProvidersData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSsoServiceGetAllSsoProvidersKeyFn(), queryFn: () => SsoService.getAllSsoProviders() });
export const ensureUseSsoServiceGetOneSsoProviderByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSsoServiceGetOneSsoProviderByIdKeyFn({ id }), queryFn: () => SsoService.getOneSsoProviderById({ id }) });
export const ensureUseSsoServiceLoginWithOidcData = (queryClient: QueryClient, { providerId, redirectTo }: {
  providerId: string;
  redirectTo?: unknown;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSsoServiceLoginWithOidcKeyFn({ providerId, redirectTo }), queryFn: () => SsoService.loginWithOidc({ providerId, redirectTo }) });
export const ensureUseSsoServiceOidcLoginCallbackData = (queryClient: QueryClient, { code, iss, providerId, redirectTo, sessionState, state }: {
  code: unknown;
  iss: unknown;
  providerId: string;
  redirectTo: string;
  sessionState: unknown;
  state: unknown;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSsoServiceOidcLoginCallbackKeyFn({ code, iss, providerId, redirectTo, sessionState, state }), queryFn: () => SsoService.oidcLoginCallback({ code, iss, providerId, redirectTo, sessionState, state }) });
export const ensureUseEmailTemplatesServiceEmailTemplateControllerFindAllData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseEmailTemplatesServiceEmailTemplateControllerFindAllKeyFn(), queryFn: () => EmailTemplatesService.emailTemplateControllerFindAll() });
export const ensureUseEmailTemplatesServiceEmailTemplateControllerFindOneData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseEmailTemplatesServiceEmailTemplateControllerFindOneKeyFn({ id }), queryFn: () => EmailTemplatesService.emailTemplateControllerFindOne({ id }) });
export const ensureUseResourceGroupsServiceGetAllResourceGroupsData = (queryClient: QueryClient, { limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceGroupsServiceGetAllResourceGroupsKeyFn({ limit, page, search }), queryFn: () => ResourceGroupsService.getAllResourceGroups({ limit, page, search }) });
export const ensureUseResourceGroupsServiceGetOneResourceGroupByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceGroupsServiceGetOneResourceGroupByIdKeyFn({ id }), queryFn: () => ResourceGroupsService.getOneResourceGroupById({ id }) });
export const ensureUseResourcesServiceGetAllResourcesData = (queryClient: QueryClient, { groupId, ids, limit, page, search }: {
  groupId?: number;
  ids?: number[];
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseResourcesServiceGetAllResourcesKeyFn({ groupId, ids, limit, page, search }), queryFn: () => ResourcesService.getAllResources({ groupId, ids, limit, page, search }) });
export const ensureUseResourcesServiceGetOneResourceByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourcesServiceGetOneResourceByIdKeyFn({ id }), queryFn: () => ResourcesService.getOneResourceById({ id }) });
export const ensureUseResourceUsageServiceGetHistoryOfResourceUsageData = (queryClient: QueryClient, { limit, page, resourceId, userId }: {
  limit?: number;
  page?: number;
  resourceId: number;
  userId?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn({ limit, page, resourceId, userId }), queryFn: () => ResourceUsageService.getHistoryOfResourceUsage({ limit, page, resourceId, userId }) });
export const ensureUseResourceUsageServiceGetActiveSessionData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceUsageServiceGetActiveSessionKeyFn({ resourceId }), queryFn: () => ResourceUsageService.getActiveSession({ resourceId }) });
export const ensureUseResourceIntroductionsServiceGetAllResourceIntroductionsData = (queryClient: QueryClient, { limit, page, resourceId }: {
  limit: number;
  page?: number;
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroductionsServiceGetAllResourceIntroductionsKeyFn({ limit, page, resourceId }), queryFn: () => ResourceIntroductionsService.getAllResourceIntroductions({ limit, page, resourceId }) });
export const ensureUseResourceIntroductionsServiceCheckStatusData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroductionsServiceCheckStatusKeyFn({ resourceId }), queryFn: () => ResourceIntroductionsService.checkStatus({ resourceId }) });
export const ensureUseResourceIntroductionsServiceGetHistoryOfIntroductionData = (queryClient: QueryClient, { introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroductionsServiceGetHistoryOfIntroductionKeyFn({ introductionId, resourceId }), queryFn: () => ResourceIntroductionsService.getHistoryOfIntroduction({ introductionId, resourceId }) });
export const ensureUseResourceIntroductionsServiceCheckIsRevokedStatusData = (queryClient: QueryClient, { introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroductionsServiceCheckIsRevokedStatusKeyFn({ introductionId, resourceId }), queryFn: () => ResourceIntroductionsService.checkIsRevokedStatus({ introductionId, resourceId }) });
export const ensureUseResourceIntroductionsServiceGetOneResourceIntroductionData = (queryClient: QueryClient, { introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroductionsServiceGetOneResourceIntroductionKeyFn({ introductionId, resourceId }), queryFn: () => ResourceIntroductionsService.getOneResourceIntroduction({ introductionId, resourceId }) });
export const ensureUseResourceIntroductionsServiceCheckCanManagePermissionData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroductionsServiceCheckCanManagePermissionKeyFn({ resourceId }), queryFn: () => ResourceIntroductionsService.checkCanManagePermission({ resourceId }) });
export const ensureUseResourceIntroducersServiceGetAllResourceIntroducersData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn({ resourceId }), queryFn: () => ResourceIntroducersService.getAllResourceIntroducers({ resourceId }) });
export const ensureUseResourceIntroducersServiceCheckCanManagePermissionData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseResourceIntroducersServiceCheckCanManagePermissionKeyFn({ resourceId }), queryFn: () => ResourceIntroducersService.checkCanManagePermission({ resourceId }) });
export const ensureUseMqttServersServiceGetAllMqttServersData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMqttServersServiceGetAllMqttServersKeyFn(), queryFn: () => MqttServersService.getAllMqttServers() });
export const ensureUseMqttServersServiceGetOneMqttServerByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMqttServersServiceGetOneMqttServerByIdKeyFn({ id }), queryFn: () => MqttServersService.getOneMqttServerById({ id }) });
export const ensureUseMqttServersServiceGetStatusOfOneData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMqttServersServiceGetStatusOfOneKeyFn({ id }), queryFn: () => MqttServersService.getStatusOfOne({ id }) });
export const ensureUseMqttServersServiceGetStatusOfAllData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMqttServersServiceGetStatusOfAllKeyFn(), queryFn: () => MqttServersService.getStatusOfAll() });
export const ensureUseSseServiceSseControllerStreamEventsData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSseServiceSseControllerStreamEventsKeyFn({ resourceId }), queryFn: () => SseService.sseControllerStreamEvents({ resourceId }) });
export const ensureUseWebhooksServiceGetAllWebhookConfigurationsData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseWebhooksServiceGetAllWebhookConfigurationsKeyFn({ resourceId }), queryFn: () => WebhooksService.getAllWebhookConfigurations({ resourceId }) });
export const ensureUseWebhooksServiceGetOneWebhookConfigurationByIdData = (queryClient: QueryClient, { id, resourceId }: {
  id: number;
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseWebhooksServiceGetOneWebhookConfigurationByIdKeyFn({ id, resourceId }), queryFn: () => WebhooksService.getOneWebhookConfigurationById({ id, resourceId }) });
export const ensureUseMqttResourceConfigurationServiceGetAllMqttConfigurationsData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn({ resourceId }), queryFn: () => MqttResourceConfigurationService.getAllMqttConfigurations({ resourceId }) });
export const ensureUseMqttResourceConfigurationServiceGetOneMqttConfigurationData = (queryClient: QueryClient, { configId, resourceId }: {
  configId: number;
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ configId, resourceId }), queryFn: () => MqttResourceConfigurationService.getOneMqttConfiguration({ configId, resourceId }) });
export const ensureUsePluginServiceGetPluginsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UsePluginServiceGetPluginsKeyFn(), queryFn: () => PluginService.getPlugins() });
export const ensureUsePluginServiceGetFrontendPluginFileData = (queryClient: QueryClient, { filePath, pluginName }: {
  filePath: string;
  pluginName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UsePluginServiceGetFrontendPluginFileKeyFn({ filePath, pluginName }), queryFn: () => PluginService.getFrontendPluginFile({ filePath, pluginName }) });
export const ensureUseFabReaderReadersServiceGetReaderByIdData = (queryClient: QueryClient, { readerId }: {
  readerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFabReaderReadersServiceGetReaderByIdKeyFn({ readerId }), queryFn: () => FabReaderReadersService.getReaderById({ readerId }) });
export const ensureUseFabReaderReadersServiceGetReadersData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFabReaderReadersServiceGetReadersKeyFn(), queryFn: () => FabReaderReadersService.getReaders() });
export const ensureUseFabReaderNfcCardsServiceGetAllCardsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFabReaderNfcCardsServiceGetAllCardsKeyFn(), queryFn: () => FabReaderNfcCardsService.getAllCards() });
export const ensureUseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeData = (queryClient: QueryClient, { end, start }: {
  end: string;
  start: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKeyFn({ end, start }), queryFn: () => AnalyticsService.analyticsControllerGetResourceUsageHoursInDateRange({ end, start }) });

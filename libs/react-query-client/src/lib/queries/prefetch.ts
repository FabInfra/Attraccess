// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { ApplicationService, MqttResourceConfigurationService, MqttServersService, ResourceGroupIntroducersService, ResourceGroupIntroductionsService, ResourceGroupsService, ResourceIntroducersService, ResourceIntroductionsService, ResourceUsageService, ResourcesService, SseService, SsoService, UsersService, WebhooksService } from "../requests/services.gen";
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
export const prefetchUseResourcesServiceGetAllResources = (queryClient: QueryClient, { groupId, limit, page, search }: {
  groupId?: number;
  limit?: number;
  page?: number;
  search?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseResourcesServiceGetAllResourcesKeyFn({ groupId, limit, page, search }), queryFn: () => ResourcesService.getAllResources({ groupId, limit, page, search }) });
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
export const prefetchUseResourceGroupIntroducersServiceGetAllResourceGroupIntroducers = (queryClient: QueryClient, { groupId }: {
  groupId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupIntroducersServiceGetAllResourceGroupIntroducersKeyFn({ groupId }), queryFn: () => ResourceGroupIntroducersService.getAllResourceGroupIntroducers({ groupId }) });
export const prefetchUseResourceGroupIntroductionsServiceGetAllResourceGroupIntroductions = (queryClient: QueryClient, { groupId }: {
  groupId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupIntroductionsServiceGetAllResourceGroupIntroductionsKeyFn({ groupId }), queryFn: () => ResourceGroupIntroductionsService.getAllResourceGroupIntroductions({ groupId }) });
export const prefetchUseResourceGroupIntroductionsServiceCheckGroupIntroductionStatus = (queryClient: QueryClient, { groupId }: {
  groupId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupIntroductionsServiceCheckGroupIntroductionStatusKeyFn({ groupId }), queryFn: () => ResourceGroupIntroductionsService.checkGroupIntroductionStatus({ groupId }) });
export const prefetchUseResourceGroupIntroductionsServiceGetHistoryOfGroupIntroduction = (queryClient: QueryClient, { groupId, introductionId }: {
  groupId: number;
  introductionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupIntroductionsServiceGetHistoryOfGroupIntroductionKeyFn({ groupId, introductionId }), queryFn: () => ResourceGroupIntroductionsService.getHistoryOfGroupIntroduction({ groupId, introductionId }) });
export const prefetchUseResourceGroupIntroductionsServiceGetOneGroupIntroduction = (queryClient: QueryClient, { groupId, introductionId }: {
  groupId: number;
  introductionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseResourceGroupIntroductionsServiceGetOneGroupIntroductionKeyFn({ groupId, introductionId }), queryFn: () => ResourceGroupIntroductionsService.getOneGroupIntroduction({ groupId, introductionId }) });
export const prefetchUseMqttResourceConfigurationServiceGetOneMqttConfiguration = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ resourceId }), queryFn: () => MqttResourceConfigurationService.getOneMqttConfiguration({ resourceId }) });
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

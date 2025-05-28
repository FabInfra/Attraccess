// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { AnalyticsService, ApplicationService, FabReaderNfcCardsService, FabReaderReadersService, MqttResourceConfigurationService, MqttServersService, PluginService, ResourceGroupsService, ResourceIntroducersService, ResourceIntroductionsService, ResourceUsageService, ResourcesService, SseService, SsoService, UsersService, WebhooksService } from "../requests/services.gen";
import * as Common from "./common";
export const useApplicationServicePing2Suspense = <TData = Common.ApplicationServicePing2DefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseApplicationServicePing2KeyFn(queryKey), queryFn: () => ApplicationService.ping2() as TData, ...options });
export const useUsersServiceGetAllUsersSuspense = <TData = Common.UsersServiceGetAllUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetAllUsersKeyFn({ limit, page, search }, queryKey), queryFn: () => UsersService.getAllUsers({ limit, page, search }) as TData, ...options });
export const useUsersServiceGetCurrentSuspense = <TData = Common.UsersServiceGetCurrentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetCurrentKeyFn(queryKey), queryFn: () => UsersService.getCurrent() as TData, ...options });
export const useUsersServiceGetOneUserByIdSuspense = <TData = Common.UsersServiceGetOneUserByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetOneUserByIdKeyFn({ id }, queryKey), queryFn: () => UsersService.getOneUserById({ id }) as TData, ...options });
export const useUsersServiceGetPermissionsSuspense = <TData = Common.UsersServiceGetPermissionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetPermissionsKeyFn({ id }, queryKey), queryFn: () => UsersService.getPermissions({ id }) as TData, ...options });
export const useUsersServiceGetAllWithPermissionSuspense = <TData = Common.UsersServiceGetAllWithPermissionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, permission }: {
  limit?: number;
  page?: number;
  permission?: "canManageResources" | "canManageSystemConfiguration" | "canManageUsers";
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetAllWithPermissionKeyFn({ limit, page, permission }, queryKey), queryFn: () => UsersService.getAllWithPermission({ limit, page, permission }) as TData, ...options });
export const useSsoServiceGetAllSsoProvidersSuspense = <TData = Common.SsoServiceGetAllSsoProvidersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSsoServiceGetAllSsoProvidersKeyFn(queryKey), queryFn: () => SsoService.getAllSsoProviders() as TData, ...options });
export const useSsoServiceGetOneSsoProviderByIdSuspense = <TData = Common.SsoServiceGetOneSsoProviderByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSsoServiceGetOneSsoProviderByIdKeyFn({ id }, queryKey), queryFn: () => SsoService.getOneSsoProviderById({ id }) as TData, ...options });
export const useSsoServiceLoginWithOidcSuspense = <TData = Common.SsoServiceLoginWithOidcDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ providerId, redirectTo }: {
  providerId: string;
  redirectTo?: unknown;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSsoServiceLoginWithOidcKeyFn({ providerId, redirectTo }, queryKey), queryFn: () => SsoService.loginWithOidc({ providerId, redirectTo }) as TData, ...options });
export const useSsoServiceOidcLoginCallbackSuspense = <TData = Common.SsoServiceOidcLoginCallbackDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ code, iss, providerId, redirectTo, sessionState, state }: {
  code: unknown;
  iss: unknown;
  providerId: string;
  redirectTo: string;
  sessionState: unknown;
  state: unknown;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSsoServiceOidcLoginCallbackKeyFn({ code, iss, providerId, redirectTo, sessionState, state }, queryKey), queryFn: () => SsoService.oidcLoginCallback({ code, iss, providerId, redirectTo, sessionState, state }) as TData, ...options });
export const useResourceGroupsServiceGetAllResourceGroupsSuspense = <TData = Common.ResourceGroupsServiceGetAllResourceGroupsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceGroupsServiceGetAllResourceGroupsKeyFn({ limit, page, search }, queryKey), queryFn: () => ResourceGroupsService.getAllResourceGroups({ limit, page, search }) as TData, ...options });
export const useResourceGroupsServiceGetOneResourceGroupByIdSuspense = <TData = Common.ResourceGroupsServiceGetOneResourceGroupByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceGroupsServiceGetOneResourceGroupByIdKeyFn({ id }, queryKey), queryFn: () => ResourceGroupsService.getOneResourceGroupById({ id }) as TData, ...options });
export const useResourcesServiceGetAllResourcesSuspense = <TData = Common.ResourcesServiceGetAllResourcesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, ids, limit, page, search }: {
  groupId?: number;
  ids?: number[];
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourcesServiceGetAllResourcesKeyFn({ groupId, ids, limit, page, search }, queryKey), queryFn: () => ResourcesService.getAllResources({ groupId, ids, limit, page, search }) as TData, ...options });
export const useResourcesServiceGetOneResourceByIdSuspense = <TData = Common.ResourcesServiceGetOneResourceByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourcesServiceGetOneResourceByIdKeyFn({ id }, queryKey), queryFn: () => ResourcesService.getOneResourceById({ id }) as TData, ...options });
export const useResourceUsageServiceGetHistoryOfResourceUsageSuspense = <TData = Common.ResourceUsageServiceGetHistoryOfResourceUsageDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, resourceId, userId }: {
  limit?: number;
  page?: number;
  resourceId: number;
  userId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn({ limit, page, resourceId, userId }, queryKey), queryFn: () => ResourceUsageService.getHistoryOfResourceUsage({ limit, page, resourceId, userId }) as TData, ...options });
export const useResourceUsageServiceGetActiveSessionSuspense = <TData = Common.ResourceUsageServiceGetActiveSessionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceUsageServiceGetActiveSessionKeyFn({ resourceId }, queryKey), queryFn: () => ResourceUsageService.getActiveSession({ resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceGetAllResourceIntroductionsSuspense = <TData = Common.ResourceIntroductionsServiceGetAllResourceIntroductionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, resourceId }: {
  limit: number;
  page?: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceGetAllResourceIntroductionsKeyFn({ limit, page, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.getAllResourceIntroductions({ limit, page, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceCheckStatusSuspense = <TData = Common.ResourceIntroductionsServiceCheckStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceCheckStatusKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.checkStatus({ resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceGetHistoryOfIntroductionSuspense = <TData = Common.ResourceIntroductionsServiceGetHistoryOfIntroductionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceGetHistoryOfIntroductionKeyFn({ introductionId, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.getHistoryOfIntroduction({ introductionId, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceCheckIsRevokedStatusSuspense = <TData = Common.ResourceIntroductionsServiceCheckIsRevokedStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceCheckIsRevokedStatusKeyFn({ introductionId, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.checkIsRevokedStatus({ introductionId, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceGetOneResourceIntroductionSuspense = <TData = Common.ResourceIntroductionsServiceGetOneResourceIntroductionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceGetOneResourceIntroductionKeyFn({ introductionId, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.getOneResourceIntroduction({ introductionId, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceCheckCanManagePermissionSuspense = <TData = Common.ResourceIntroductionsServiceCheckCanManagePermissionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceCheckCanManagePermissionKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.checkCanManagePermission({ resourceId }) as TData, ...options });
export const useResourceIntroducersServiceGetAllResourceIntroducersSuspense = <TData = Common.ResourceIntroducersServiceGetAllResourceIntroducersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroducersService.getAllResourceIntroducers({ resourceId }) as TData, ...options });
export const useResourceIntroducersServiceCheckCanManagePermissionSuspense = <TData = Common.ResourceIntroducersServiceCheckCanManagePermissionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseResourceIntroducersServiceCheckCanManagePermissionKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroducersService.checkCanManagePermission({ resourceId }) as TData, ...options });
export const useMqttServersServiceGetAllMqttServersSuspense = <TData = Common.MqttServersServiceGetAllMqttServersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetAllMqttServersKeyFn(queryKey), queryFn: () => MqttServersService.getAllMqttServers() as TData, ...options });
export const useMqttServersServiceGetOneMqttServerByIdSuspense = <TData = Common.MqttServersServiceGetOneMqttServerByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetOneMqttServerByIdKeyFn({ id }, queryKey), queryFn: () => MqttServersService.getOneMqttServerById({ id }) as TData, ...options });
export const useMqttServersServiceGetStatusOfOneSuspense = <TData = Common.MqttServersServiceGetStatusOfOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetStatusOfOneKeyFn({ id }, queryKey), queryFn: () => MqttServersService.getStatusOfOne({ id }) as TData, ...options });
export const useMqttServersServiceGetStatusOfAllSuspense = <TData = Common.MqttServersServiceGetStatusOfAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetStatusOfAllKeyFn(queryKey), queryFn: () => MqttServersService.getStatusOfAll() as TData, ...options });
export const useSseServiceSseControllerStreamEventsSuspense = <TData = Common.SseServiceSseControllerStreamEventsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSseServiceSseControllerStreamEventsKeyFn({ resourceId }, queryKey), queryFn: () => SseService.sseControllerStreamEvents({ resourceId }) as TData, ...options });
export const useWebhooksServiceGetAllWebhookConfigurationsSuspense = <TData = Common.WebhooksServiceGetAllWebhookConfigurationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseWebhooksServiceGetAllWebhookConfigurationsKeyFn({ resourceId }, queryKey), queryFn: () => WebhooksService.getAllWebhookConfigurations({ resourceId }) as TData, ...options });
export const useWebhooksServiceGetOneWebhookConfigurationByIdSuspense = <TData = Common.WebhooksServiceGetOneWebhookConfigurationByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id, resourceId }: {
  id: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseWebhooksServiceGetOneWebhookConfigurationByIdKeyFn({ id, resourceId }, queryKey), queryFn: () => WebhooksService.getOneWebhookConfigurationById({ id, resourceId }) as TData, ...options });
export const useMqttResourceConfigurationServiceGetAllMqttConfigurationsSuspense = <TData = Common.MqttResourceConfigurationServiceGetAllMqttConfigurationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn({ resourceId }, queryKey), queryFn: () => MqttResourceConfigurationService.getAllMqttConfigurations({ resourceId }) as TData, ...options });
export const useMqttResourceConfigurationServiceGetOneMqttConfigurationSuspense = <TData = Common.MqttResourceConfigurationServiceGetOneMqttConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ configId, resourceId }: {
  configId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ configId, resourceId }, queryKey), queryFn: () => MqttResourceConfigurationService.getOneMqttConfiguration({ configId, resourceId }) as TData, ...options });
export const usePluginServiceGetPluginsSuspense = <TData = Common.PluginServiceGetPluginsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePluginServiceGetPluginsKeyFn(queryKey), queryFn: () => PluginService.getPlugins() as TData, ...options });
export const usePluginServiceGetFrontendPluginFileSuspense = <TData = Common.PluginServiceGetFrontendPluginFileDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ filePath, pluginName }: {
  filePath: string;
  pluginName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePluginServiceGetFrontendPluginFileKeyFn({ filePath, pluginName }, queryKey), queryFn: () => PluginService.getFrontendPluginFile({ filePath, pluginName }) as TData, ...options });
export const useFabReaderReadersServiceGetReaderByIdSuspense = <TData = Common.FabReaderReadersServiceGetReaderByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ readerId }: {
  readerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFabReaderReadersServiceGetReaderByIdKeyFn({ readerId }, queryKey), queryFn: () => FabReaderReadersService.getReaderById({ readerId }) as TData, ...options });
export const useFabReaderReadersServiceGetReadersSuspense = <TData = Common.FabReaderReadersServiceGetReadersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFabReaderReadersServiceGetReadersKeyFn(queryKey), queryFn: () => FabReaderReadersService.getReaders() as TData, ...options });
export const useFabReaderNfcCardsServiceGetAllCardsSuspense = <TData = Common.FabReaderNfcCardsServiceGetAllCardsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFabReaderNfcCardsServiceGetAllCardsKeyFn(queryKey), queryFn: () => FabReaderNfcCardsService.getAllCards() as TData, ...options });
export const useAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeSuspense = <TData = Common.AnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ end, start }: {
  end: string;
  start: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKeyFn({ end, start }, queryKey), queryFn: () => AnalyticsService.analyticsControllerGetResourceUsageHoursInDateRange({ end, start }) as TData, ...options });

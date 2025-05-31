// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AnalyticsService, ApplicationService, AuthenticationService, EmailTemplatesService, FabReaderNfcCardsService, FabReaderReadersService, MqttResourceConfigurationService, MqttServersService, PluginService, ResourceGroupsService, ResourceIntroducersService, ResourceIntroductionsService, ResourceUsageService, ResourcesService, SseService, SsoService, UsersService, WebhooksService } from "../requests/services.gen";
import { AppKeyRequestDto, BulkUpdateUserPermissionsDto, ChangePasswordDto, CompleteIntroductionDto, CreateEmailTemplateDto, CreateMqttResourceConfigDto, CreateMqttServerDto, CreateResourceDto, CreateResourceGroupDto, CreateSSOProviderDto, CreateUserDto, CreateWebhookConfigDto, EndUsageSessionDto, EnrollNfcCardDto, ResetNfcCardDto, ResetPasswordDto, RevokeIntroductionDto, StartUsageSessionDto, UnrevokeIntroductionDto, UpdateEmailTemplateDto, UpdateMqttResourceConfigDto, UpdateMqttServerDto, UpdateReaderDto, UpdateResourceDto, UpdateResourceGroupDto, UpdateSSOProviderDto, UpdateUserPermissionsDto, UpdateWebhookConfigDto, UploadPluginDto, VerifyEmailDto, WebhookStatusDto } from "../requests/types.gen";
import * as Common from "./common";
export const useApplicationServicePing2 = <TData = Common.ApplicationServicePing2DefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseApplicationServicePing2KeyFn(queryKey), queryFn: () => ApplicationService.ping2() as TData, ...options });
export const useUsersServiceGetAllUsers = <TData = Common.UsersServiceGetAllUsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetAllUsersKeyFn({ limit, page, search }, queryKey), queryFn: () => UsersService.getAllUsers({ limit, page, search }) as TData, ...options });
export const useUsersServiceGetCurrent = <TData = Common.UsersServiceGetCurrentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetCurrentKeyFn(queryKey), queryFn: () => UsersService.getCurrent() as TData, ...options });
export const useUsersServiceGetOneUserById = <TData = Common.UsersServiceGetOneUserByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetOneUserByIdKeyFn({ id }, queryKey), queryFn: () => UsersService.getOneUserById({ id }) as TData, ...options });
export const useUsersServiceGetPermissions = <TData = Common.UsersServiceGetPermissionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetPermissionsKeyFn({ id }, queryKey), queryFn: () => UsersService.getPermissions({ id }) as TData, ...options });
export const useUsersServiceGetAllWithPermission = <TData = Common.UsersServiceGetAllWithPermissionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, permission }: {
  limit?: number;
  page?: number;
  permission?: "canManageResources" | "canManageSystemConfiguration" | "canManageUsers";
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetAllWithPermissionKeyFn({ limit, page, permission }, queryKey), queryFn: () => UsersService.getAllWithPermission({ limit, page, permission }) as TData, ...options });
export const useSsoServiceGetAllSsoProviders = <TData = Common.SsoServiceGetAllSsoProvidersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSsoServiceGetAllSsoProvidersKeyFn(queryKey), queryFn: () => SsoService.getAllSsoProviders() as TData, ...options });
export const useSsoServiceGetOneSsoProviderById = <TData = Common.SsoServiceGetOneSsoProviderByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSsoServiceGetOneSsoProviderByIdKeyFn({ id }, queryKey), queryFn: () => SsoService.getOneSsoProviderById({ id }) as TData, ...options });
export const useSsoServiceLoginWithOidc = <TData = Common.SsoServiceLoginWithOidcDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ providerId, redirectTo }: {
  providerId: string;
  redirectTo?: unknown;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSsoServiceLoginWithOidcKeyFn({ providerId, redirectTo }, queryKey), queryFn: () => SsoService.loginWithOidc({ providerId, redirectTo }) as TData, ...options });
export const useSsoServiceOidcLoginCallback = <TData = Common.SsoServiceOidcLoginCallbackDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ code, iss, providerId, redirectTo, sessionState, state }: {
  code: unknown;
  iss: unknown;
  providerId: string;
  redirectTo: string;
  sessionState: unknown;
  state: unknown;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSsoServiceOidcLoginCallbackKeyFn({ code, iss, providerId, redirectTo, sessionState, state }, queryKey), queryFn: () => SsoService.oidcLoginCallback({ code, iss, providerId, redirectTo, sessionState, state }) as TData, ...options });
export const useEmailTemplatesServiceEmailTemplateControllerFindAll = <TData = Common.EmailTemplatesServiceEmailTemplateControllerFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseEmailTemplatesServiceEmailTemplateControllerFindAllKeyFn(queryKey), queryFn: () => EmailTemplatesService.emailTemplateControllerFindAll() as TData, ...options });
export const useEmailTemplatesServiceEmailTemplateControllerFindOne = <TData = Common.EmailTemplatesServiceEmailTemplateControllerFindOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseEmailTemplatesServiceEmailTemplateControllerFindOneKeyFn({ id }, queryKey), queryFn: () => EmailTemplatesService.emailTemplateControllerFindOne({ id }) as TData, ...options });
export const useResourceGroupsServiceGetAllResourceGroups = <TData = Common.ResourceGroupsServiceGetAllResourceGroupsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, search }: {
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceGroupsServiceGetAllResourceGroupsKeyFn({ limit, page, search }, queryKey), queryFn: () => ResourceGroupsService.getAllResourceGroups({ limit, page, search }) as TData, ...options });
export const useResourceGroupsServiceGetOneResourceGroupById = <TData = Common.ResourceGroupsServiceGetOneResourceGroupByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceGroupsServiceGetOneResourceGroupByIdKeyFn({ id }, queryKey), queryFn: () => ResourceGroupsService.getOneResourceGroupById({ id }) as TData, ...options });
export const useResourcesServiceGetAllResources = <TData = Common.ResourcesServiceGetAllResourcesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, ids, limit, page, search }: {
  groupId?: number;
  ids?: number[];
  limit?: number;
  page?: number;
  search?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourcesServiceGetAllResourcesKeyFn({ groupId, ids, limit, page, search }, queryKey), queryFn: () => ResourcesService.getAllResources({ groupId, ids, limit, page, search }) as TData, ...options });
export const useResourcesServiceGetOneResourceById = <TData = Common.ResourcesServiceGetOneResourceByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourcesServiceGetOneResourceByIdKeyFn({ id }, queryKey), queryFn: () => ResourcesService.getOneResourceById({ id }) as TData, ...options });
export const useResourceUsageServiceGetHistoryOfResourceUsage = <TData = Common.ResourceUsageServiceGetHistoryOfResourceUsageDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, resourceId, userId }: {
  limit?: number;
  page?: number;
  resourceId: number;
  userId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn({ limit, page, resourceId, userId }, queryKey), queryFn: () => ResourceUsageService.getHistoryOfResourceUsage({ limit, page, resourceId, userId }) as TData, ...options });
export const useResourceUsageServiceGetActiveSession = <TData = Common.ResourceUsageServiceGetActiveSessionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceUsageServiceGetActiveSessionKeyFn({ resourceId }, queryKey), queryFn: () => ResourceUsageService.getActiveSession({ resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceGetAllResourceIntroductions = <TData = Common.ResourceIntroductionsServiceGetAllResourceIntroductionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page, resourceId }: {
  limit: number;
  page?: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceGetAllResourceIntroductionsKeyFn({ limit, page, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.getAllResourceIntroductions({ limit, page, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceCheckStatus = <TData = Common.ResourceIntroductionsServiceCheckStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceCheckStatusKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.checkStatus({ resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceGetHistoryOfIntroduction = <TData = Common.ResourceIntroductionsServiceGetHistoryOfIntroductionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceGetHistoryOfIntroductionKeyFn({ introductionId, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.getHistoryOfIntroduction({ introductionId, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceCheckIsRevokedStatus = <TData = Common.ResourceIntroductionsServiceCheckIsRevokedStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceCheckIsRevokedStatusKeyFn({ introductionId, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.checkIsRevokedStatus({ introductionId, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceGetOneResourceIntroduction = <TData = Common.ResourceIntroductionsServiceGetOneResourceIntroductionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ introductionId, resourceId }: {
  introductionId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceGetOneResourceIntroductionKeyFn({ introductionId, resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.getOneResourceIntroduction({ introductionId, resourceId }) as TData, ...options });
export const useResourceIntroductionsServiceCheckCanManagePermission = <TData = Common.ResourceIntroductionsServiceCheckCanManagePermissionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroductionsServiceCheckCanManagePermissionKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroductionsService.checkCanManagePermission({ resourceId }) as TData, ...options });
export const useResourceIntroducersServiceGetAllResourceIntroducers = <TData = Common.ResourceIntroducersServiceGetAllResourceIntroducersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroducersService.getAllResourceIntroducers({ resourceId }) as TData, ...options });
export const useResourceIntroducersServiceCheckCanManagePermission = <TData = Common.ResourceIntroducersServiceCheckCanManagePermissionDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseResourceIntroducersServiceCheckCanManagePermissionKeyFn({ resourceId }, queryKey), queryFn: () => ResourceIntroducersService.checkCanManagePermission({ resourceId }) as TData, ...options });
export const useMqttServersServiceGetAllMqttServers = <TData = Common.MqttServersServiceGetAllMqttServersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetAllMqttServersKeyFn(queryKey), queryFn: () => MqttServersService.getAllMqttServers() as TData, ...options });
export const useMqttServersServiceGetOneMqttServerById = <TData = Common.MqttServersServiceGetOneMqttServerByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetOneMqttServerByIdKeyFn({ id }, queryKey), queryFn: () => MqttServersService.getOneMqttServerById({ id }) as TData, ...options });
export const useMqttServersServiceGetStatusOfOne = <TData = Common.MqttServersServiceGetStatusOfOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetStatusOfOneKeyFn({ id }, queryKey), queryFn: () => MqttServersService.getStatusOfOne({ id }) as TData, ...options });
export const useMqttServersServiceGetStatusOfAll = <TData = Common.MqttServersServiceGetStatusOfAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMqttServersServiceGetStatusOfAllKeyFn(queryKey), queryFn: () => MqttServersService.getStatusOfAll() as TData, ...options });
export const useSseServiceSseControllerStreamEvents = <TData = Common.SseServiceSseControllerStreamEventsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSseServiceSseControllerStreamEventsKeyFn({ resourceId }, queryKey), queryFn: () => SseService.sseControllerStreamEvents({ resourceId }) as TData, ...options });
export const useWebhooksServiceGetAllWebhookConfigurations = <TData = Common.WebhooksServiceGetAllWebhookConfigurationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseWebhooksServiceGetAllWebhookConfigurationsKeyFn({ resourceId }, queryKey), queryFn: () => WebhooksService.getAllWebhookConfigurations({ resourceId }) as TData, ...options });
export const useWebhooksServiceGetOneWebhookConfigurationById = <TData = Common.WebhooksServiceGetOneWebhookConfigurationByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id, resourceId }: {
  id: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseWebhooksServiceGetOneWebhookConfigurationByIdKeyFn({ id, resourceId }, queryKey), queryFn: () => WebhooksService.getOneWebhookConfigurationById({ id, resourceId }) as TData, ...options });
export const useMqttResourceConfigurationServiceGetAllMqttConfigurations = <TData = Common.MqttResourceConfigurationServiceGetAllMqttConfigurationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn({ resourceId }, queryKey), queryFn: () => MqttResourceConfigurationService.getAllMqttConfigurations({ resourceId }) as TData, ...options });
export const useMqttResourceConfigurationServiceGetOneMqttConfiguration = <TData = Common.MqttResourceConfigurationServiceGetOneMqttConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ configId, resourceId }: {
  configId: number;
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ configId, resourceId }, queryKey), queryFn: () => MqttResourceConfigurationService.getOneMqttConfiguration({ configId, resourceId }) as TData, ...options });
export const usePluginServiceGetPlugins = <TData = Common.PluginServiceGetPluginsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePluginServiceGetPluginsKeyFn(queryKey), queryFn: () => PluginService.getPlugins() as TData, ...options });
export const usePluginServiceGetFrontendPluginFile = <TData = Common.PluginServiceGetFrontendPluginFileDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ filePath, pluginName }: {
  filePath: string;
  pluginName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePluginServiceGetFrontendPluginFileKeyFn({ filePath, pluginName }, queryKey), queryFn: () => PluginService.getFrontendPluginFile({ filePath, pluginName }) as TData, ...options });
export const useFabReaderReadersServiceGetReaderById = <TData = Common.FabReaderReadersServiceGetReaderByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ readerId }: {
  readerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFabReaderReadersServiceGetReaderByIdKeyFn({ readerId }, queryKey), queryFn: () => FabReaderReadersService.getReaderById({ readerId }) as TData, ...options });
export const useFabReaderReadersServiceGetReaders = <TData = Common.FabReaderReadersServiceGetReadersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFabReaderReadersServiceGetReadersKeyFn(queryKey), queryFn: () => FabReaderReadersService.getReaders() as TData, ...options });
export const useFabReaderNfcCardsServiceGetAllCards = <TData = Common.FabReaderNfcCardsServiceGetAllCardsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFabReaderNfcCardsServiceGetAllCardsKeyFn(queryKey), queryFn: () => FabReaderNfcCardsService.getAllCards() as TData, ...options });
export const useAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRange = <TData = Common.AnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ end, start }: {
  end: string;
  start: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAnalyticsServiceAnalyticsControllerGetResourceUsageHoursInDateRangeKeyFn({ end, start }, queryKey), queryFn: () => AnalyticsService.analyticsControllerGetResourceUsageHoursInDateRange({ end, start }) as TData, ...options });
export const useUsersServiceCreateOneUser = <TData = Common.UsersServiceCreateOneUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateUserDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateUserDto;
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.createOneUser({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServiceVerifyEmail = <TData = Common.UsersServiceVerifyEmailMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: VerifyEmailDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: VerifyEmailDto;
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.verifyEmail({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServiceRequestPasswordReset = <TData = Common.UsersServiceRequestPasswordResetMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ResetPasswordDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ResetPasswordDto;
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.requestPasswordReset({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServiceChangePasswordViaResetToken = <TData = Common.UsersServiceChangePasswordViaResetTokenMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ChangePasswordDto;
  userId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ChangePasswordDto;
  userId: number;
}, TContext>({ mutationFn: ({ requestBody, userId }) => UsersService.changePasswordViaResetToken({ requestBody, userId }) as unknown as Promise<TData>, ...options });
export const useUsersServiceBulkUpdatePermissions = <TData = Common.UsersServiceBulkUpdatePermissionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: BulkUpdateUserPermissionsDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: BulkUpdateUserPermissionsDto;
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.bulkUpdatePermissions({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServiceCreateSession = <TData = Common.AuthenticationServiceCreateSessionMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: { username?: string; password?: string; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: { username?: string; password?: string; };
}, TContext>({ mutationFn: ({ requestBody }) => AuthenticationService.createSession({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSsoServiceCreateOneSsoProvider = <TData = Common.SsoServiceCreateOneSsoProviderMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateSSOProviderDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateSSOProviderDto;
}, TContext>({ mutationFn: ({ requestBody }) => SsoService.createOneSsoProvider({ requestBody }) as unknown as Promise<TData>, ...options });
export const useEmailTemplatesServiceEmailTemplateControllerCreate = <TData = Common.EmailTemplatesServiceEmailTemplateControllerCreateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateEmailTemplateDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateEmailTemplateDto;
}, TContext>({ mutationFn: ({ requestBody }) => EmailTemplatesService.emailTemplateControllerCreate({ requestBody }) as unknown as Promise<TData>, ...options });
export const useResourceGroupsServiceCreateOneResourceGroup = <TData = Common.ResourceGroupsServiceCreateOneResourceGroupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateResourceGroupDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateResourceGroupDto;
}, TContext>({ mutationFn: ({ requestBody }) => ResourceGroupsService.createOneResourceGroup({ requestBody }) as unknown as Promise<TData>, ...options });
export const useResourcesServiceCreateOneResource = <TData = Common.ResourcesServiceCreateOneResourceMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData: CreateResourceDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData: CreateResourceDto;
}, TContext>({ mutationFn: ({ formData }) => ResourcesService.createOneResource({ formData }) as unknown as Promise<TData>, ...options });
export const useResourcesServiceAddResourceToGroup = <TData = Common.ResourcesServiceAddResourceToGroupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  groupId: number;
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  groupId: number;
  id: number;
}, TContext>({ mutationFn: ({ groupId, id }) => ResourcesService.addResourceToGroup({ groupId, id }) as unknown as Promise<TData>, ...options });
export const useResourceUsageServiceStartSession = <TData = Common.ResourceUsageServiceStartSessionMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: StartUsageSessionDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: StartUsageSessionDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => ResourceUsageService.startSession({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useResourceIntroductionsServiceMarkCompleted = <TData = Common.ResourceIntroductionsServiceMarkCompletedMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CompleteIntroductionDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CompleteIntroductionDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => ResourceIntroductionsService.markCompleted({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useResourceIntroductionsServiceMarkRevoked = <TData = Common.ResourceIntroductionsServiceMarkRevokedMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  introductionId: number;
  requestBody: RevokeIntroductionDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  introductionId: number;
  requestBody: RevokeIntroductionDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ introductionId, requestBody, resourceId }) => ResourceIntroductionsService.markRevoked({ introductionId, requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useResourceIntroductionsServiceMarkUnrevoked = <TData = Common.ResourceIntroductionsServiceMarkUnrevokedMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  introductionId: number;
  requestBody: UnrevokeIntroductionDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  introductionId: number;
  requestBody: UnrevokeIntroductionDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ introductionId, requestBody, resourceId }) => ResourceIntroductionsService.markUnrevoked({ introductionId, requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useResourceIntroducersServiceAddOne = <TData = Common.ResourceIntroducersServiceAddOneMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  resourceId: number;
  userId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  resourceId: number;
  userId: number;
}, TContext>({ mutationFn: ({ resourceId, userId }) => ResourceIntroducersService.addOne({ resourceId, userId }) as unknown as Promise<TData>, ...options });
export const useMqttServersServiceCreateOneMqttServer = <TData = Common.MqttServersServiceCreateOneMqttServerMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateMqttServerDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateMqttServerDto;
}, TContext>({ mutationFn: ({ requestBody }) => MqttServersService.createOneMqttServer({ requestBody }) as unknown as Promise<TData>, ...options });
export const useMqttServersServiceTestConnection = <TData = Common.MqttServersServiceTestConnectionMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => MqttServersService.testConnection({ id }) as unknown as Promise<TData>, ...options });
export const useWebhooksServiceCreateOneWebhookConfiguration = <TData = Common.WebhooksServiceCreateOneWebhookConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateWebhookConfigDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateWebhookConfigDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => WebhooksService.createOneWebhookConfiguration({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useWebhooksServiceTest = <TData = Common.WebhooksServiceTestMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  resourceId: number;
}, TContext>({ mutationFn: ({ id, resourceId }) => WebhooksService.test({ id, resourceId }) as unknown as Promise<TData>, ...options });
export const useWebhooksServiceRegenerateSecret = <TData = Common.WebhooksServiceRegenerateSecretMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  resourceId: number;
}, TContext>({ mutationFn: ({ id, resourceId }) => WebhooksService.regenerateSecret({ id, resourceId }) as unknown as Promise<TData>, ...options });
export const useMqttResourceConfigurationServiceCreateMqttConfiguration = <TData = Common.MqttResourceConfigurationServiceCreateMqttConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CreateMqttResourceConfigDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CreateMqttResourceConfigDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => MqttResourceConfigurationService.createMqttConfiguration({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useMqttResourceConfigurationServiceTestOne = <TData = Common.MqttResourceConfigurationServiceTestOneMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configId: number;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configId: number;
  resourceId: number;
}, TContext>({ mutationFn: ({ configId, resourceId }) => MqttResourceConfigurationService.testOne({ configId, resourceId }) as unknown as Promise<TData>, ...options });
export const usePluginServiceUploadPlugin = <TData = Common.PluginServiceUploadPluginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData: UploadPluginDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData: UploadPluginDto;
}, TContext>({ mutationFn: ({ formData }) => PluginService.uploadPlugin({ formData }) as unknown as Promise<TData>, ...options });
export const useFabReaderReadersServiceEnrollNfcCard = <TData = Common.FabReaderReadersServiceEnrollNfcCardMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: EnrollNfcCardDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: EnrollNfcCardDto;
}, TContext>({ mutationFn: ({ requestBody }) => FabReaderReadersService.enrollNfcCard({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFabReaderReadersServiceResetNfcCard = <TData = Common.FabReaderReadersServiceResetNfcCardMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ResetNfcCardDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ResetNfcCardDto;
}, TContext>({ mutationFn: ({ requestBody }) => FabReaderReadersService.resetNfcCard({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFabReaderNfcCardsServiceGetAppKeyByUid = <TData = Common.FabReaderNfcCardsServiceGetAppKeyByUidMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: AppKeyRequestDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: AppKeyRequestDto;
}, TContext>({ mutationFn: ({ requestBody }) => FabReaderNfcCardsService.getAppKeyByUid({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSsoServiceUpdateOneSsoProvider = <TData = Common.SsoServiceUpdateOneSsoProviderMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: UpdateSSOProviderDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: UpdateSSOProviderDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => SsoService.updateOneSsoProvider({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useResourcesServiceUpdateOneResource = <TData = Common.ResourcesServiceUpdateOneResourceMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData: UpdateResourceDto;
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData: UpdateResourceDto;
  id: number;
}, TContext>({ mutationFn: ({ formData, id }) => ResourcesService.updateOneResource({ formData, id }) as unknown as Promise<TData>, ...options });
export const useResourceUsageServiceEndSession = <TData = Common.ResourceUsageServiceEndSessionMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: EndUsageSessionDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: EndUsageSessionDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => ResourceUsageService.endSession({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useMqttServersServiceUpdateOneMqttServer = <TData = Common.MqttServersServiceUpdateOneMqttServerMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: UpdateMqttServerDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: UpdateMqttServerDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => MqttServersService.updateOneMqttServer({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useWebhooksServiceUpdateOneWebhookConfiguration = <TData = Common.WebhooksServiceUpdateOneWebhookConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: UpdateWebhookConfigDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: UpdateWebhookConfigDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ id, requestBody, resourceId }) => WebhooksService.updateOneWebhookConfiguration({ id, requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useWebhooksServiceUpdateStatus = <TData = Common.WebhooksServiceUpdateStatusMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: WebhookStatusDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: WebhookStatusDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ id, requestBody, resourceId }) => WebhooksService.updateStatus({ id, requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useMqttResourceConfigurationServiceUpdateMqttConfiguration = <TData = Common.MqttResourceConfigurationServiceUpdateMqttConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configId: number;
  requestBody: UpdateMqttResourceConfigDto;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configId: number;
  requestBody: UpdateMqttResourceConfigDto;
  resourceId: number;
}, TContext>({ mutationFn: ({ configId, requestBody, resourceId }) => MqttResourceConfigurationService.updateMqttConfiguration({ configId, requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useUsersServiceUpdatePermissions = <TData = Common.UsersServiceUpdatePermissionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: UpdateUserPermissionsDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: UpdateUserPermissionsDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => UsersService.updatePermissions({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useEmailTemplatesServiceEmailTemplateControllerUpdate = <TData = Common.EmailTemplatesServiceEmailTemplateControllerUpdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: UpdateEmailTemplateDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: UpdateEmailTemplateDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => EmailTemplatesService.emailTemplateControllerUpdate({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useResourceGroupsServiceUpdateOneResourceGroup = <TData = Common.ResourceGroupsServiceUpdateOneResourceGroupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: UpdateResourceGroupDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: UpdateResourceGroupDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => ResourceGroupsService.updateOneResourceGroup({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useFabReaderReadersServiceUpdateReader = <TData = Common.FabReaderReadersServiceUpdateReaderMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  readerId: number;
  requestBody: UpdateReaderDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  readerId: number;
  requestBody: UpdateReaderDto;
}, TContext>({ mutationFn: ({ readerId, requestBody }) => FabReaderReadersService.updateReader({ readerId, requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationServiceEndSession = <TData = Common.AuthenticationServiceEndSessionMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => AuthenticationService.endSession() as unknown as Promise<TData>, ...options });
export const useSsoServiceDeleteOneSsoProvider = <TData = Common.SsoServiceDeleteOneSsoProviderMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => SsoService.deleteOneSsoProvider({ id }) as unknown as Promise<TData>, ...options });
export const useEmailTemplatesServiceEmailTemplateControllerRemove = <TData = Common.EmailTemplatesServiceEmailTemplateControllerRemoveMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => EmailTemplatesService.emailTemplateControllerRemove({ id }) as unknown as Promise<TData>, ...options });
export const useResourceGroupsServiceDeleteOneResourceGroup = <TData = Common.ResourceGroupsServiceDeleteOneResourceGroupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => ResourceGroupsService.deleteOneResourceGroup({ id }) as unknown as Promise<TData>, ...options });
export const useResourcesServiceDeleteOneResource = <TData = Common.ResourcesServiceDeleteOneResourceMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => ResourcesService.deleteOneResource({ id }) as unknown as Promise<TData>, ...options });
export const useResourcesServiceRemoveResourceFromGroup = <TData = Common.ResourcesServiceRemoveResourceFromGroupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  groupId: number;
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  groupId: number;
  id: number;
}, TContext>({ mutationFn: ({ groupId, id }) => ResourcesService.removeResourceFromGroup({ groupId, id }) as unknown as Promise<TData>, ...options });
export const useResourceIntroducersServiceRemoveOne = <TData = Common.ResourceIntroducersServiceRemoveOneMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  resourceId: number;
  userId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  resourceId: number;
  userId: number;
}, TContext>({ mutationFn: ({ resourceId, userId }) => ResourceIntroducersService.removeOne({ resourceId, userId }) as unknown as Promise<TData>, ...options });
export const useMqttServersServiceDeleteOneMqttServer = <TData = Common.MqttServersServiceDeleteOneMqttServerMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => MqttServersService.deleteOneMqttServer({ id }) as unknown as Promise<TData>, ...options });
export const useWebhooksServiceDeleteOneWebhookConfiguration = <TData = Common.WebhooksServiceDeleteOneWebhookConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  resourceId: number;
}, TContext>({ mutationFn: ({ id, resourceId }) => WebhooksService.deleteOneWebhookConfiguration({ id, resourceId }) as unknown as Promise<TData>, ...options });
export const useMqttResourceConfigurationServiceDeleteOneMqttConfiguration = <TData = Common.MqttResourceConfigurationServiceDeleteOneMqttConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configId: number;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configId: number;
  resourceId: number;
}, TContext>({ mutationFn: ({ configId, resourceId }) => MqttResourceConfigurationService.deleteOneMqttConfiguration({ configId, resourceId }) as unknown as Promise<TData>, ...options });
export const usePluginServiceDeletePlugin = <TData = Common.PluginServiceDeletePluginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  pluginId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  pluginId: string;
}, TContext>({ mutationFn: ({ pluginId }) => PluginService.deletePlugin({ pluginId }) as unknown as Promise<TData>, ...options });

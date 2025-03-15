import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateResourceGroupDto,
  ResourceGroup,
  UpdateResourceGroupDto,
  ListResourceGroupsParams,
  AssignResourceToGroupDto,
  ResourceGroupsControllerGetGroupsData,
  ResourceGroupsControllerGetResourcesInGroupData,
  Resource,
  ResourceGroupsControllerGetGroupsParams,
} from '@attraccess/api-client';
import { ApiError, createQueryKeys } from './base';
import getApi from '../index';

// Define module-specific query keys
export const resourceGroupsKeys = {
  ...createQueryKeys('resourceGroups'),
  resources: (
    groupId: number,
    params?: Pick<ListResourceGroupsParams, 'page' | 'limit'>
  ) => [...resourceGroupsKeys.detail(groupId), 'resources', params || {}],
};

export function useResourceGroups(
  params: ResourceGroupsControllerGetGroupsParams = {}
) {
  return useQuery({
    queryKey: resourceGroupsKeys.list(params),
    queryFn: async () => {
      const api = getApi();

      const response =
        await api.resourceGroups.resourceGroupsControllerGetGroups(params);
      return response.data as ResourceGroupsControllerGetGroupsData;
    },
  });
}

export function useResourceGroup(id: number) {
  return useQuery({
    queryKey: resourceGroupsKeys.detail(id),
    queryFn: async () => {
      const api = getApi();
      const response =
        await api.resourceGroups.resourceGroupsControllerGetGroupById(id);
      return response.data as ResourceGroup;
    },
    enabled: !!id,
  });
}

export function useResourceGroupResources(
  groupId: number,
  params?: Pick<ListResourceGroupsParams, 'page' | 'limit'>
) {
  return useQuery({
    queryKey: resourceGroupsKeys.resources(groupId, params),
    queryFn: async () => {
      const api = getApi();

      const response =
        await api.resourceGroups.resourceGroupsControllerGetResourcesInGroup({
          id: groupId,
          page: params?.page,
          limit: params?.limit,
        });
      return response.data as ResourceGroupsControllerGetResourcesInGroupData;
    },
    enabled: !!groupId,
  });
}

export function useCreateResourceGroup() {
  const queryClient = useQueryClient();

  return useMutation<ResourceGroup, ApiError, CreateResourceGroupDto>({
    mutationFn: async (data) => {
      const api = getApi();
      const response =
        await api.resourceGroups.resourceGroupsControllerCreateGroup(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceGroupsKeys.list() });
    },
  });
}

export function useUpdateResourceGroup(id: number) {
  const queryClient = useQueryClient();

  return useMutation<ResourceGroup, ApiError, UpdateResourceGroupDto>({
    mutationFn: async (data) => {
      const api = getApi();
      const response =
        await api.resourceGroups.resourceGroupsControllerUpdateGroup(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupsKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: resourceGroupsKeys.list() });
    },
  });
}

export function useDeleteResourceGroup(id: number) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      const api = getApi();
      await api.resourceGroups.resourceGroupsControllerDeleteGroup(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceGroupsKeys.list() });
    },
  });
}

export function useAssignResourceToGroup(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation<Resource, ApiError, AssignResourceToGroupDto>({
    mutationFn: async (data) => {
      const api = getApi();
      const response =
        await api.resourceGroups.resourceGroupsControllerAssignResourceToGroup(
          groupId,
          data
        );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupsKeys.resources(groupId),
      });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useRemoveResourceFromGroup(
  groupId: number,
  resourceId: number
) {
  const queryClient = useQueryClient();

  return useMutation<Resource, ApiError, void>({
    mutationFn: async () => {
      const api = getApi();
      const response =
        await api.resourceGroups.resourceGroupsControllerRemoveResourceFromGroup(
          groupId,
          resourceId
        );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resourceGroupsKeys.resources(groupId),
      });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

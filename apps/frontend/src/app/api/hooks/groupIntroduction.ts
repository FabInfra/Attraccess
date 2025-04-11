import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ResourceIntroduction,
  ResourceIntroductionHistoryItem,
  GroupIntroductionControllerGetGroupIntroductionsData as PaginatedGroupIntroductionsData,
  GroupIntroductionControllerRevokeIntroductionData as RevokeIntroductionDto,
  GroupIntroductionControllerUnrevokeIntroductionData as UnrevokeIntroductionDto,
} from '@attraccess/api-client';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiError, createQueryKeys } from '@frontend/api/hooks/base';
// eslint-disable-next-line @nx/enforce-module-boundaries
import getApi from '@frontend/api';
// --- Query Keys ---

export const groupIntroductionKeys = {
  ...createQueryKeys('groupIntroduction'), // Basic keys: all, list, detail
  // Keys specific to group introducer management
  introducers: (groupId: number) =>
    ['groupIntroduction', 'introducers', groupId] as const,
  canManageIntroducers: (groupId: number) =>
    ['groupIntroduction', 'canManageIntroducers', groupId] as const,
  // Keys for managing group introductions (access granted to users)
  introductionsList: (
    groupId: number,
    params?: { page?: number; limit?: number }
  ) =>
    ['groupIntroduction', 'introductionsList', groupId, params || {}] as const,
  canManageIntroductions: (groupId: number) =>
    ['groupIntroduction', 'canManageIntroductions', groupId] as const,
};

// --- Hooks ---
// ... existing hooks for introducers: useGroupIntroducers, useAddGroupIntroducer, useRemoveGroupIntroducer, useCanManageGroupIntroducers ...

// --- Hooks for Managing Group Introductions (Granted Access) ---

/**
 * Fetches the list of introductions (granted access) for a specific group.
 */
export function useGroupIntroductionsList(
  groupId: number,
  params: { page?: number; limit?: number } = { page: 1, limit: 10 }
) {
  return useQuery<PaginatedGroupIntroductionsData, ApiError>({
    queryKey: groupIntroductionKeys.introductionsList(groupId, params),
    queryFn: async () => {
      const api = getApi();
      const response =
        await api.groupIntroductions.groupIntroductionControllerGetGroupIntroductions(
          {
            ...params,
            groupId,
            page: params.page || 1,
            limit: params.limit || 10,
          }
        );
      return response.data;
    },
    enabled: !!groupId, // Only run query if groupId is valid
  });
}

/**
 * Provides a mutation function to grant a group introduction to a user.
 */
export function useGrantGroupIntroduction(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    ResourceIntroduction,
    ApiError,
    { receiverUserId: number }
  >({
    mutationFn: async ({ receiverUserId }) => {
      const api = getApi();
      const response =
        await api.groupIntroductions.groupIntroductionControllerCreateIntroduction(
          groupId,
          { receiverUserId } // DTO expects receiverUserId
        );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list of introductions for this group to refetch
      queryClient.invalidateQueries({
        queryKey: groupIntroductionKeys.introductionsList(groupId),
      });
    },
  });
}

/**
 * Provides a mutation function to revoke a group introduction.
 */
export function useRevokeGroupIntroduction(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    ResourceIntroductionHistoryItem,
    ApiError,
    {
      introductionId: number;
      dto: RevokeIntroductionDto;
    }
  >({
    mutationFn: async ({ introductionId, dto }) => {
      const api = getApi();
      const response =
        await api.groupIntroductions.groupIntroductionControllerRevokeIntroduction(
          groupId,
          introductionId,
          dto
        );
      return response.data;
    },
    onSuccess: (_, { introductionId }) => {
      // Invalidate the list to potentially update status
      queryClient.invalidateQueries({
        queryKey: groupIntroductionKeys.introductionsList(groupId),
      });
      // Could also invalidate specific introduction details if we had a hook for that
    },
  });
}

/**
 * Provides a mutation function to unrevoke a group introduction.
 */
export function useUnrevokeGroupIntroduction(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    ResourceIntroductionHistoryItem,
    ApiError,
    {
      introductionId: number;
      dto: UnrevokeIntroductionDto;
    }
  >({
    mutationFn: async ({ introductionId, dto }) => {
      const api = getApi();
      const response =
        await api.groupIntroductions.groupIntroductionControllerUnrevokeIntroduction(
          groupId,
          introductionId,
          dto
        );
      return response.data;
    },
    onSuccess: (_, { introductionId }) => {
      // Invalidate the list to potentially update status
      queryClient.invalidateQueries({
        queryKey: groupIntroductionKeys.introductionsList(groupId),
      });
    },
  });
}

/**
 * Checks if the current user can manage introductions for a specific group.
 */
export function useCanManageGroupIntroductions(groupId: number) {
  return useQuery<boolean, Error>({
    queryKey: groupIntroductionKeys.canManageIntroductions(groupId),
    queryFn: async () => {
      const api = getApi();
      const response =
        await api.groupIntroductions.groupIntroductionControllerCanManageIntroductions(
          groupId
        );
      // Assuming the response DTO has a boolean property `canManageIntroductions`
      return !!response.data.canManageIntroductions;
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes as permissions might not change often
  });
}

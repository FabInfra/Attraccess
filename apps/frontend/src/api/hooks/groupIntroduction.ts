import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ResourceIntroductionUser, // Using existing entity type
} from '@attraccess/api-client';
import { createQueryKeys } from './base';
import getApi from '../index';

// --- Query Keys ---

export const groupIntroductionKeys = {
  ...createQueryKeys('groupIntroduction'), // Basic keys: all, list, detail
  // Keys specific to group introducer management
  introducers: (groupId: number) =>
    ['groupIntroduction', 'introducers', groupId] as const,
  canManageIntroducers: (groupId: number) =>
    ['groupIntroduction', 'canManageIntroducers', groupId] as const,
  // Add keys for group introductions themselves later if needed
  // e.g., list: (groupId: number, params...) => ...
  // e.g., detail: (groupId: number, introductionId?) => ...
};

// --- Hooks ---

/**
 * Fetches the list of introducers for a specific group.
 */
export function useGroupIntroducers(groupId: number) {
  return useQuery<ResourceIntroductionUser[], Error>({
    queryKey: groupIntroductionKeys.introducers(groupId),
    queryFn: async () => {
      const api = getApi();
      const response =
        await api.groupIntroducers.groupIntroducersControllerGetGroupIntroducers(
          groupId
        );
      return response.data;
    },
    enabled: !!groupId, // Only run query if groupId is valid
  });
}

/**
 * Provides a mutation function to add an introducer to a group.
 */
export function useAddGroupIntroducer(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation<ResourceIntroductionUser, Error, { userId: number }>({
    mutationFn: async ({ userId }) => {
      const api = getApi();
      const response =
        await api.groupIntroducers.groupIntroducersControllerAddIntroducer(
          groupId,
          userId
        );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list of introducers for this group to refetch
      queryClient.invalidateQueries({
        queryKey: groupIntroductionKeys.introducers(groupId),
      });
      // Potentially invalidate other related queries if necessary
    },
    // onError: (error) => { // Optional: Handle specific errors }
  });
}

/**
 * Provides a mutation function to remove an introducer from a group.
 */
export function useRemoveGroupIntroducer(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: number }>({
    mutationFn: async ({ userId }) => {
      const api = getApi();
      await api.groupIntroducers.groupIntroducersControllerRemoveIntroducer(
        groupId,
        userId
      );
    },
    onSuccess: () => {
      // Invalidate the list of introducers for this group to refetch
      queryClient.invalidateQueries({
        queryKey: groupIntroductionKeys.introducers(groupId),
      });
      // Potentially invalidate other related queries
    },
  });
}

/**
 * Checks if the current user can manage introducers for a specific group.
 */
export function useCanManageGroupIntroducers(groupId: number) {
  return useQuery<boolean, Error>({
    queryKey: groupIntroductionKeys.canManageIntroducers(groupId),
    queryFn: async () => {
      const api = getApi();
      const response =
        await api.groupIntroducers.groupIntroducersControllerCanManageIntroducers(
          groupId
        );
      // Assuming the response DTO has a boolean property `canManageIntroducers`
      return response.data.canManageIntroducers;
    },
    enabled: !!groupId,
    // Stale time can be added if this permission doesn't change often
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Add hooks for managing actual group introductions later
// export function useGroupIntroductions(groupId: number, params: { page?, limit? }) { ... }
// export function useCreateGroupIntroduction(groupId: number) { ... }
// ... etc.

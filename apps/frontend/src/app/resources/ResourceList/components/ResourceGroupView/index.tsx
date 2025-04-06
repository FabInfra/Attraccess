import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useResourceGroups } from '../../../../../api/hooks/resourceGroups';
import { useTranslations } from '../../../../../i18n';
import * as en from './translations/en';
import * as de from './translations/de';
import { ResourceSection } from './components/ResourceSection';
import { useResourcesStore } from '../../../resources.store';
import { useState } from 'react';
import { useUpdateResource } from '../../../../../api/hooks/resources';
import { useQueryClient } from '@tanstack/react-query';
import { resourceGroupsKeys } from '../../../../../api/hooks/resourceGroups';
import { resourcesKeys } from '../../../../../api/hooks/resources';

interface ResourceGroupViewProps {
  searchInput: string;
}

// Special key for the "Ungrouped" option
const UNGROUPED_KEY = 'ungrouped';

export function ResourceGroupView({ searchInput }: ResourceGroupViewProps) {
  const { t } = useTranslations('resourceGroupView', { en, de });
  const queryClient = useQueryClient();

  // Fetch resource groups for the view and the modal select
  const resourceGroups = useResourceGroups({
    search: searchInput,
  });
  // Fetch all groups specifically for the dropdown (no search filter)
  const allResourceGroups = useResourceGroups({});

  const { selectedResourceIds, isInEditMode, setSelectedResourceIds } =
    useResourcesStore();
  const {
    isOpen: isChangeGroupModalOpen,
    onOpen: openChangeGroupModal,
    onOpenChange: onChangeGroupModalOpenChange,
    onClose: closeChangeGroupModal,
  } = useDisclosure();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Mutation hook for updating resources
  const updateResource = useUpdateResource();

  const handleSaveChanges = async () => {
    if (selectedGroupId === null || selectedResourceIds.length === 0) {
      // Should not happen due to button disabled state, but good practice
      return;
    }

    const targetGroupId =
      selectedGroupId === UNGROUPED_KEY ? null : parseInt(selectedGroupId, 10);

    try {
      // Create an array of update promises
      const updatePromises = selectedResourceIds.map((resourceId) =>
        updateResource.mutateAsync({
          id: resourceId,
          data: { groupId: targetGroupId },
        })
      );

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: resourceGroupsKeys.all });
      queryClient.invalidateQueries({ queryKey: resourcesKeys.all });

      setSelectedResourceIds([]); // Clear selection using the store setter
      closeChangeGroupModal(); // Close the modal
      setSelectedGroupId(null); // Reset select on success
      // TODO: Add success toast/notification
    } catch (error) {
      console.error('Error updating resource groups:', error);
      // Error state is handled by updateResource.isError below
      // TODO: Optionally add error toast/notification
    }
  };

  if (resourceGroups.isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton loaders will be rendered inside the GroupsSkeleton component */}
        <GroupsSkeleton />
      </div>
    );
  }

  if (resourceGroups.isError) {
    return (
      <Alert
        description={resourceGroups.error?.message}
        title={t('errorLoadingGroups')}
        color="danger"
      />
    );
  }

  const groups = resourceGroups.data?.data ?? [];
  const allGroupsForSelect = allResourceGroups.data?.data ?? [];
  const hasGroups = groups.length > 0;

  // Combine Ungrouped option with fetched groups for the Select component
  const selectOptions = [
    { id: UNGROUPED_KEY, name: '-- Ungrouped --' },
    ...allGroupsForSelect,
  ];

  return (
    <div className="space-y-8">
      {/* actions for selected resources */}

      {isInEditMode && (
        <div className="flex justify-end">
          <Button
            isDisabled={selectedResourceIds.length === 0}
            onPress={openChangeGroupModal}
          >
            {t('changeGroupButton')} ({selectedResourceIds.length})
          </Button>
        </div>
      )}

      {/* Unified Ungrouped Resources Section */}
      <ResourceSection
        key="ungrouped-section"
        groupId="ungrouped"
        title={t('ungroupedResources')}
        searchInput={searchInput}
        className={hasGroups ? 'border-b pb-6 mb-6' : ''}
      />

      {/* Unified Resource Groups Section */}
      {groups.map((group, index) => (
        <ResourceSection
          key={group.id}
          groupId={group.id}
          title={group.name}
          searchInput={searchInput}
          className={index !== groups.length - 1 ? 'border-b pb-6 mb-6' : ''}
        />
      ))}

      {/* If no groups and no ungrouped resources, GroupsView and UngroupedResourcesSection 
          will handle showing their own empty states */}

      <Modal
        isOpen={isChangeGroupModalOpen}
        onOpenChange={onChangeGroupModalOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Change Resource Group</ModalHeader>
              <ModalBody>
                <p className="mb-4">
                  Select the new group for the {selectedResourceIds.length}{' '}
                  selected resource(s).
                </p>
                <Select
                  label="Target Group"
                  placeholder="Select a group"
                  selectedKeys={selectedGroupId ? [selectedGroupId] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string | undefined;
                    setSelectedGroupId(key ?? null);
                  }}
                  aria-label="Select target group"
                  isLoading={allResourceGroups.isLoading}
                >
                  {/* Map over the combined options array */}
                  {selectOptions.map((option) => (
                    <SelectItem key={option.id}>{option.name}</SelectItem>
                  ))}
                </Select>
                {updateResource.isError && (
                  <Alert color="danger" className="mt-4">
                    Failed to update resources:{' '}
                    {updateResource.error?.message || 'Unknown error'}
                  </Alert>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setSelectedGroupId(null);
                    updateResource.reset();
                    onClose();
                  }}
                  isDisabled={updateResource.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSaveChanges}
                  isDisabled={!selectedGroupId || updateResource.isPending}
                  isLoading={updateResource.isPending}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// Helper component for skeleton UI during loading
function GroupsSkeleton() {
  const groupCount = 3; // Show 3 skeleton groups

  return (
    <>
      {Array.from({ length: groupCount }, (_, groupIndex) => (
        <div
          key={`skeleton-group-${groupIndex}`}
          className={`w-full ${
            groupIndex < groupCount - 1 ? 'border-b pb-6 mb-6' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={`resource-skeleton-${groupIndex}-${index}`}
                className="h-48 rounded-lg"
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// Helper component for skeleton UI
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

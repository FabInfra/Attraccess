import { useState, useMemo, useCallback, HTMLAttributes } from 'react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './translations/manageResourceGroups.en';
import * as de from './translations/manageResourceGroups.de';
import { useToastMessage } from '../../../components/toastProvider';
import { Input, Spinner, Card, CardHeader, CardBody, Divider } from '@heroui/react';
import { Button } from '@heroui/button';
import { Search, Trash, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  ResourceGroup,
  useResourceGroupsServiceGetAllResourceGroups,
  UseResourceGroupsServiceGetAllResourceGroupsKeyFn,
  useResourcesServiceAddResourceToGroup,
  useResourcesServiceGetOneResourceById,
  UseResourcesServiceGetOneResourceByIdKeyFn,
  useResourcesServiceRemoveResourceFromGroup,
  UseResourcesServiceGetAllResourcesKeyFn,
} from '@attraccess/react-query-client';

interface ManageResourceGroupsProps extends HTMLAttributes<HTMLDivElement> {
  resourceId: number;
}

export function ManageResourceGroups({ resourceId, ...rest }: ManageResourceGroupsProps) {
  const { t } = useTranslations('manageResourceGroups', {
    en,
    de,
  });
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: resource,
    isLoading: isLoadingResource,
    error: resourceError,
  } = useResourcesServiceGetOneResourceById({ id: resourceId });

  const currentGroups: ResourceGroup[] = useMemo(() => resource?.groups ?? [], [resource]);
  const currentGroupIds = useMemo(() => new Set(currentGroups.map((g) => g.id)), [currentGroups]);

  const {
    data: searchResultsResponse,
    isLoading: isLoadingSearchResults,
    error: searchResultsError,
  } = useResourceGroupsServiceGetAllResourceGroups({ search: debouncedSearchTerm, limit: 10 }, undefined, {});
  const searchResults: ResourceGroup[] = useMemo(() => searchResultsResponse?.data ?? [], [searchResultsResponse]);

  const { mutateAsync: addResourceToGroup, isPending: isAddingResourceToGroup } =
    useResourcesServiceAddResourceToGroup();
  const { mutateAsync: removeResourceFromGroup, isPending: isRemovingResourceFromGroup } =
    useResourcesServiceRemoveResourceFromGroup();

  const handleAddGroup = useCallback(
    async (group: ResourceGroup) => {
      try {
        await addResourceToGroup({ id: resourceId, groupId: group.id });

        success({
          title: t('addGroupSuccessTitle'),
          description: t('addGroupSuccessDescription', { groupName: group.name }),
        });

        queryClient.invalidateQueries({
          queryKey: UseResourcesServiceGetOneResourceByIdKeyFn({ id: resourceId }),
        });
        queryClient.invalidateQueries({
          queryKey: UseResourceGroupsServiceGetAllResourceGroupsKeyFn({ search: debouncedSearchTerm }),
        });

        queryClient.invalidateQueries({ queryKey: UseResourcesServiceGetAllResourcesKeyFn() });
        setSearchTerm('');
      } catch (err) {
        console.error('Failed to add group:', err);
        showError({
          title: t('addGroupErrorTitle'),
          description: t('addGroupErrorDescription'),
        });
      }
    },
    [resourceId, success, showError, t, queryClient, debouncedSearchTerm, addResourceToGroup]
  );

  const handleRemoveGroup = useCallback(
    async (group: ResourceGroup) => {
      try {
        await removeResourceFromGroup({ id: resourceId, groupId: group.id });

        success({
          title: t('removeGroupSuccessTitle'),
          description: t('removeGroupSuccessDescription', { groupName: group.name }),
        });

        queryClient.invalidateQueries({
          queryKey: UseResourcesServiceGetOneResourceByIdKeyFn({ id: resourceId }),
        });

        queryClient.invalidateQueries({ queryKey: UseResourcesServiceGetAllResourcesKeyFn() });
      } catch (err) {
        console.error('Failed to remove group:', err);
        showError({
          title: t('removeGroupErrorTitle'),
          description: t('removeGroupErrorDescription'),
        });
      }
    },
    [resourceId, success, showError, t, queryClient, removeResourceFromGroup]
  );

  const filteredSearchResults = useMemo(() => {
    return searchResults.filter((group) => !currentGroupIds.has(group.id));
  }, [searchResults, currentGroupIds]);

  return (
    <div {...rest} className={`${rest.className ?? ''} space-y-6`}>
      <Card>
        <CardHeader>{t('currentGroups')}</CardHeader>
        <CardBody>
          {isLoadingResource ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Spinner size="sm" />
              <span>{t('loadingGroups')}</span>
            </div>
          ) : resourceError ? (
            <p className="text-danger-500">Error loading current groups.</p>
          ) : currentGroups.length === 0 ? (
            <p className="text-gray-500">{t('noGroupsFound')}</p>
          ) : (
            <ul className="space-y-2">
              {currentGroups.map((group, index) => (
                <li key={group.id}>
                  <div className="flex justify-between items-center">
                    <span>{group.name}</span>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleRemoveGroup(group)}
                      startContent={<Trash className="w-4 h-4" />}
                      isLoading={isRemovingResourceFromGroup}
                      aria-label={`Remove ${group.name}`}
                    >
                      {t('removeGroupButton')}
                    </Button>
                  </div>
                  {index < currentGroups.length - 1 && <Divider className="my-2" />}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>{t('addGroups')}</CardHeader>
        <CardBody className="space-y-4">
          <Input
            placeholder={t('searchGroupsPlaceholder')}
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Search className="w-4 h-4 text-gray-500" />}
            aria-label={t('searchGroupsPlaceholder')}
          />
          {isLoadingSearchResults && debouncedSearchTerm && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Spinner size="sm" />
              <span>Searching...</span>
            </div>
          )}
          {searchResultsError && debouncedSearchTerm ? (
            <p className="text-danger-500">Error searching groups.</p>
          ) : null}
          {debouncedSearchTerm &&
            !isLoadingSearchResults &&
            !searchResultsError &&
            filteredSearchResults.length === 0 && <p className="text-gray-500">{t('noSearchResults')}</p>}
          {!isLoadingSearchResults && !searchResultsError && filteredSearchResults.length > 0 && (
            <ul className="space-y-2 mt-4 max-h-60 overflow-y-auto">
              {filteredSearchResults.map((group, index) => (
                <li key={group.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      {group.description && <p className="text-sm text-gray-500">{group.description}</p>}
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => handleAddGroup(group)}
                      startContent={<Plus className="w-4 h-4" />}
                      isLoading={isAddingResourceToGroup}
                      aria-label={`Add ${group.name}`}
                    >
                      {t('addGroupButton')}
                    </Button>
                  </div>
                  {index < filteredSearchResults.length - 1 && <Divider className="my-2" />}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

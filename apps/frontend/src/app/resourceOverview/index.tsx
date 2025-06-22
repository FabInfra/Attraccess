import {
  useResourcesServiceResourceGroupsGetMany,
  useResourcesServiceGetAllResources,
} from '@attraccess/react-query-client';
import { Toolbar } from './toolbar/toolbar';
import { ResourceGroupCard } from './resourceGroupCard';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { Alert } from '@heroui/react';
import { ErrorDisplay } from '../../components/errorDisplay/ErrorDisplay';

import de from './de.json';
import en from './en.json';
import { useTranslations } from '@attraccess/plugins-frontend-ui';

function getLocalStorageFilterKey(filter: 'onlyInUseByMe' | 'onlyWithPermissions') {
  return `resourceOverview.toolbar.filter.${filter}`;
}

function getValueFromLocalStorage(filter: 'onlyInUseByMe' | 'onlyWithPermissions', defaultValue: boolean) {
  const value = localStorage.getItem(getLocalStorageFilterKey(filter));
  if (value === null) {
    return defaultValue;
  }
  return value === 'true';
}

export function ResourceOverview() {
  const { t } = useTranslations('resourceOverview', { de, en });

  const { data: groups, error: groupsError, refetch: refetchGroups } = useResourcesServiceResourceGroupsGetMany();

  const [searchValue, setSearchValue] = useState('');
  const [filterByOnlyInUseByMe, setFilterByOnlyInUseByMeState] = useState(
    getValueFromLocalStorage('onlyInUseByMe', false)
  );
  const [filterByOnlyWithPermissions, setFilterByOnlyWithPermissionsState] = useState(
    getValueFromLocalStorage('onlyWithPermissions', true)
  );

  const debouncedSearchValue = useDebounce(searchValue, 250);

  const setFilterByOnlyInUseByMe = useCallback((value: boolean) => {
    setFilterByOnlyInUseByMeState(value);
    localStorage.setItem(getLocalStorageFilterKey('onlyInUseByMe'), value === true ? 'true' : 'false');
  }, []);

  const setFilterByOnlyWithPermissions = useCallback((value: boolean) => {
    setFilterByOnlyWithPermissionsState(value);
    localStorage.setItem(getLocalStorageFilterKey('onlyWithPermissions'), value === true ? 'true' : 'false');
  }, []);

  const groupIds = useMemo(() => {
    const ids: Array<number | 'none'> = ['none'];

    groups?.forEach((group) => ids.push(group.id));

    return ids;
  }, [groups]);

  // Check if there are any resources matching the current filters across all groups
  const {
    data: allResources,
    isLoading: isLoadingAllResources,
    error: resourcesError,
    refetch: refetchResources,
  } = useResourcesServiceGetAllResources({
    search: debouncedSearchValue?.trim() || undefined,
    onlyInUseByMe: filterByOnlyInUseByMe,
    onlyWithPermissions: filterByOnlyWithPermissions,
    page: 1,
    limit: 1, // We only need to check if any resources exist
  });

  return (
    <div>
      <Toolbar
        search={searchValue}
        onSearchChanged={setSearchValue}
        onlyInUseByMe={filterByOnlyInUseByMe}
        onOnlyInUseByMeChanged={setFilterByOnlyInUseByMe}
        onlyWithPermissions={filterByOnlyWithPermissions}
        onOnlyWithPermissionsChanged={setFilterByOnlyWithPermissions}
      />

      <div className="flex flex-row flex-wrap gap-4">
        {(groupsError || resourcesError) && (
          <ErrorDisplay
            error={groupsError || resourcesError}
            onRetry={() => {
              if (groupsError) refetchGroups();
              if (resourcesError) refetchResources();
            }}
            message="Failed to load resource data. Please try again."
          />
        )}

        {!isLoadingAllResources && !resourcesError && allResources?.data.length === 0 && (
          <Alert color="warning" title={t('noResourcesFound.title')}>
            <p>{t('noResourcesFound.description')}</p>
          </Alert>
        )}

        {groupIds.map((id) => (
          <ResourceGroupCard
            key={id}
            groupId={id}
            filter={{
              search: searchValue,
              onlyInUseByMe: filterByOnlyInUseByMe,
              onlyWithPermissions: filterByOnlyWithPermissions,
            }}
            className="flex flex-1 min-w-[100%] md:min-w-[500px]"
          />
        ))}
      </div>
    </div>
  );
}

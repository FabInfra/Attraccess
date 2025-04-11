import { useMemo, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useResourceGroupResources } from '@frontend/api/hooks/resourceGroups';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ResourceCard,
  ResourceCardSkeletonLoader,
} from '@frontend/app/resources/resourceCard';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useResources } from '@frontend/api/hooks';
import { Resource } from '@attraccess/api-client';
import {
  Alert,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useResourcesStore } from '@frontend/app/resources/resources.store';
// Import hooks and components for the details link using relative paths
import { useAuth } from '../../../../../../../hooks/useAuth';
import { useGroupIntroducers } from '../../../../../../../api/hooks/groupIntroduction';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { ResourceIntroductionUser } from '@attraccess/api-client';

// Import translation modules
import * as enGroup from './translations/en';
import * as deGroup from './translations/de';
// Remove unused imports
// import * as enUngrouped from '../UngroupedResourcesSection/translations/en';
// import * as deUngrouped from '../UngroupedResourcesSection/translations/de';
import * as enTable from './translations/enTable';
import * as deTable from './translations/deTable';

interface ResourceSectionProps {
  groupId: number | 'ungrouped';
  title: string;
  searchInput: string;
}

// Define a more specific response type based on observed hook return structure
type ResourceQueryResponse = {
  data: Resource[];
  totalPages: number;
  // Add other potential common fields if known, e.g., totalItems, currentPage
};

// Combine specific needed keys from local translations
const queryStateTranslationMap = {
  en: {
    default: {
      errorLoadingResources: enGroup.default.errorLoadingResources,
      noResourcesInGroup: enGroup.default.noResourcesInGroup,
      noUngroupedResources: enGroup.default.noUngroupedResources,
    },
  },
  de: {
    default: {
      errorLoadingResources: deGroup.default.errorLoadingResources,
      noResourcesInGroup: deGroup.default.noResourcesInGroup,
      noUngroupedResources: deGroup.default.noUngroupedResources,
    },
  },
};

function ResourceQueryStateWrapper(props: {
  // Use the more specific type, allowing undefined if that's possible
  query: UseQueryResult<ResourceQueryResponse | undefined>;
  isUngrouped: boolean;
  children: React.ReactNode;
}) {
  const { query, isUngrouped, children } = props;

  // Pass the map to useTranslations without explicit casting
  const { t } = useTranslations('resourceQueryState', queryStateTranslationMap);

  const ResourceCardSkeletons = useMemo(() => {
    const skeletonCount = isUngrouped ? 5 : 3;
    return Array.from({ length: skeletonCount }, (_, index) => (
      <ResourceCardSkeletonLoader key={index} />
    ));
  }, [isUngrouped]);

  if (query.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ResourceCardSkeletons}
      </div>
    );
  }

  if (query.isError) {
    return <Alert title={t('errorLoadingResources')} color="danger" />;
  }

  // Check data and data.data as the query result might be undefined
  if (query.data?.data && query.data.data.length > 0) {
    return children;
  }

  const emptyMessageKey = isUngrouped
    ? 'noUngroupedResources'
    : 'noResourcesInGroup';
  return <Alert title={t(emptyMessageKey)} color="warning" />;
}

function ResourcesAsCards({ groupId, searchInput }: ResourceSectionProps) {
  const groupResourcesLimit = 5;
  const isUngrouped = groupId === 'ungrouped';

  const ungroupedQuery = useResources({
    search: searchInput,
    page: 1,
    limit: groupResourcesLimit,
    ungrouped: true,
  });
  const groupedQuery = useResourceGroupResources(groupId as number, {
    page: 1,
    limit: groupResourcesLimit,
  });

  // Cast the selected query to the expected type for the wrapper
  const resourcesQuery = (
    isUngrouped ? ungroupedQuery : groupedQuery
  ) as UseQueryResult<ResourceQueryResponse | undefined>;

  return (
    <ResourceQueryStateWrapper query={resourcesQuery} isUngrouped={isUngrouped}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(resourcesQuery.data?.data ?? []).map((resource: Resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            href={`/resources/${resource.id}`}
            fullWidth
          />
        ))}
      </div>
    </ResourceQueryStateWrapper>
  );
}

function ResourcesAsTable({ groupId, searchInput }: ResourceSectionProps) {
  const { t } = useTranslations('groupResourcesSectionAsTable', {
    en: enTable,
    de: deTable,
  });

  // Remove unused limit state, use constant
  const tableLimit = 10;
  const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10); // Removed unused state
  const isUngrouped = groupId === 'ungrouped';

  const { selectedResourceIds, setSelectedResourceIds } = useResourcesStore();

  const ungroupedQuery = useResources({
    search: searchInput,
    page,
    limit: tableLimit, // Use constant
    ungrouped: true,
  });
  const groupedQuery = useResourceGroupResources(groupId as number, {
    page,
    limit: tableLimit, // Use constant
  });

  // Cast the selected query to the expected type for the wrapper
  const resourcesQuery = (
    isUngrouped ? ungroupedQuery : groupedQuery
  ) as UseQueryResult<ResourceQueryResponse | undefined>;

  const pages = useMemo(
    () => resourcesQuery.data?.totalPages ?? 0,
    [resourcesQuery.data?.totalPages]
  );

  return (
    <ResourceQueryStateWrapper query={resourcesQuery} isUngrouped={isUngrouped}>
      <Table
        hideHeader
        selectedKeys={selectedResourceIds.map(String)}
        selectionMode="multiple"
        color="primary"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
        onSelectionChange={(keys) => {
          setSelectedResourceIds(Array.from(keys).map(String).map(Number));
        }}
      >
        <TableHeader>
          <TableColumn>{t('name')}</TableColumn>
          <TableColumn>{t('description')}</TableColumn>
        </TableHeader>
        <TableBody>
          {(resourcesQuery.data?.data ?? []).map((resource: Resource) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.name}</TableCell>
              <TableCell>{resource.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResourceQueryStateWrapper>
  );
}

export function ResourceSection(
  props: ResourceSectionProps & React.HTMLAttributes<HTMLDivElement>
) {
  const { isInEditMode } = useResourcesStore();
  const { title, groupId, searchInput, className, ...divProps } = props;
  const isUngrouped = groupId === 'ungrouped';

  // --- Add logic for details link ---
  const { hasPermission, user: currentUser } = useAuth();
  const canManageResourcesGlobally = hasPermission('canManageResources');

  // Fetch introducers only if it's a real group
  const { data: groupIntroducers } = useGroupIntroducers(
    isUngrouped ? 0 : groupId
  );

  // Determine if user can manage this specific group
  const canManageThisGroup = useMemo(() => {
    if (isUngrouped) return false; // Cannot manage "ungrouped"
    if (canManageResourcesGlobally) return true;
    // Check if user is in the introducer list for this group
    return groupIntroducers?.some(
      (intro: ResourceIntroductionUser) => intro.userId === currentUser?.id
    );
  }, [
    isUngrouped,
    canManageResourcesGlobally,
    groupIntroducers,
    currentUser?.id,
  ]);
  // --- End logic for details link ---

  return (
    <div className={'w-full ' + (className ?? '')} {...divProps}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {/* Show settings link if user can manage this group */}
          {canManageThisGroup && (
            <Link to={`/groups/${groupId}`} title={`Manage ${title}`}>
              <Settings className="w-4 h-4 text-gray-500 hover:text-primary cursor-pointer" />
            </Link>
          )}
        </div>
      </div>

      {isInEditMode ? (
        <ResourcesAsTable
          groupId={groupId}
          searchInput={searchInput}
          title={title}
        />
      ) : (
        <ResourcesAsCards
          groupId={groupId}
          searchInput={searchInput}
          title={title}
        />
      )}
    </div>
  );
}

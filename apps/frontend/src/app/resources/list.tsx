import { useCallback, useMemo, useState, useEffect } from 'react';
import { useResources } from '../../api/hooks';
import { ResourceCard, ResourceCardSkeletonLoader } from './resourceCard';
import { Toolbar } from './toolbar';
import { Resource } from '@attraccess/api-client';
import {
  Alert,
  Pagination,
  Card,
  CardHeader,
  CardBody,
  Button,
} from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from '../../i18n';
import * as en from './translations/resourceList.en';
import * as de from './translations/resourceList.de';
import {
  useResourceGroups,
  useResourceGroupResources,
} from '../../api/hooks/resourceGroups';
import { Link } from '@heroui/react';

export type ViewMode = 'list' | 'group';

interface ResourceListProps {
  groupId?: string;
  initialViewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function ResourceList({
  groupId,
  initialViewMode,
  onViewModeChange,
}: ResourceListProps) {
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode || 'list');
  const pageSize = 9; // 3x3 grid for desktop
  const groupResourcesLimit = 5; // Show first 5 resources per group

  // Get the search params to check for ungroupedOnly
  const searchParams = new URLSearchParams(window.location.search);
  const ungroupedOnly = searchParams.get('ungroupedOnly') === 'true';

  // Parse groupId to number if it's a string
  const numericGroupId = groupId ? parseInt(groupId, 10) : undefined;

  const { t } = useTranslations('resourceList', {
    en,
    de,
  });

  // Sync with external viewMode changes
  useEffect(() => {
    if (initialViewMode && initialViewMode !== viewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode, viewMode]);

  // For the list view
  const resources = useResources({
    search: searchInput,
    page: currentPage,
    limit: pageSize,
    groupId: numericGroupId,
    ungrouped: ungroupedOnly,
  });

  // For the group view
  const resourceGroups = useResourceGroups({
    search: searchInput,
  });

  // For the ungrouped resources in group view
  const ungroupedResources = useResources({
    search: searchInput,
    page: 1,
    limit: groupResourcesLimit,
  });

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      setCurrentPage(1); // Reset to first page on view mode change

      // Call external handler if provided
      if (onViewModeChange) {
        onViewModeChange(mode);
      }
    },
    [onViewModeChange]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const ResourceCards = useMemo(() => {
    const items = resources.data?.data ?? [];
    return items.map((resource: Resource) => (
      <ResourceCard
        key={resource.id}
        resource={resource}
        href={`/resources/${resource.id}`}
        fullWidth
      />
    ));
  }, [resources]);

  const ResourceCardSkeletons = useMemo(() => {
    return Array.from({ length: pageSize }, (_, index) => (
      <ResourceCardSkeletonLoader key={index} />
    ));
  }, [pageSize]);

  // Component to render resources for a specific group
  const GroupResourcesSection = ({ groupId }: { groupId: number | string }) => {
    // Ensure groupId is a number
    const numericGroupId =
      typeof groupId === 'string' ? parseInt(groupId, 10) : groupId;

    const groupResources = useResourceGroupResources(numericGroupId, {
      page: 1,
      limit: groupResourcesLimit,
    });

    if (groupResources.isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: groupResourcesLimit }, (_, index) => (
            <ResourceCardSkeletonLoader key={index} />
          ))}
        </div>
      );
    }

    if (groupResources.isError) {
      return <Alert title={t('errorLoadingResources')} color="danger" />;
    }

    const items = groupResources.data?.data ?? [];

    if (items.length === 0) {
      return <Alert title={t('noResourcesInGroup')} color="warning" />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((resource: Resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            href={`/resources/${resource.id}`}
            fullWidth
          />
        ))}
      </div>
    );
  };

  const GroupCards = useMemo(() => {
    if (resourceGroups.isLoading) {
      return (
        <div className="space-y-8">
          {Array.from({ length: 3 }, (_, groupIndex) => (
            <div
              key={`skeleton-group-${groupIndex}`}
              className={`w-full ${groupIndex < 2 ? 'border-b pb-6 mb-6' : ''}`}
            >
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: groupResourcesLimit }, (_, index) => (
                  <ResourceCardSkeletonLoader key={index} />
                ))}
              </div>
            </div>
          ))}
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
    const hasGroups = groups.length > 0;
    const hasUngroupedResources =
      (ungroupedResources.data?.data?.length || 0) > 0;

    // If there are no groups and no ungrouped resources, show a "no resources found" alert
    // This matches the behavior of the list view
    if (!hasGroups && !hasUngroupedResources) {
      return <Alert title={t('noResourcesFound')} color="warning" />;
    }

    // Start with ungrouped resources
    return (
      <div className="space-y-8">
        <div className={`w-full ${hasGroups ? 'border-b pb-6 mb-6' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t('ungroupedResources')}</h3>
            <Link href="/resources?viewMode=list&ungroupedOnly=true">
              <Button
                variant="light"
                endContent={<ChevronRight className="w-4 h-4" />}
              >
                {t('seeAll')}
              </Button>
            </Link>
          </div>
          {ungroupedResources.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: groupResourcesLimit }, (_, index) => (
                <ResourceCardSkeletonLoader key={index} />
              ))}
            </div>
          ) : ungroupedResources.data?.data &&
            ungroupedResources.data.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ungroupedResources.data.data
                .filter((resource: Resource) => !resource.groupId)
                .slice(0, groupResourcesLimit)
                .map((resource: Resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    href={`/resources/${resource.id}`}
                    fullWidth
                  />
                ))}
            </div>
          ) : (
            <Alert title={t('noUngroupedResources')} color="warning" />
          )}
        </div>

        {/* Resource groups */}
        {groups.map((group, index) => (
          <div
            key={group.id}
            className={`w-full ${
              index < groups.length - 1 ? 'border-b pb-6 mb-6' : ''
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <Link href={`/resources?groupId=${group.id}&viewMode=list`}>
                <Button
                  variant="light"
                  endContent={<ChevronRight className="w-4 h-4" />}
                >
                  {t('seeAll')}
                </Button>
              </Link>
            </div>
            <GroupResourcesSection groupId={group.id} />
          </div>
        ))}
      </div>
    );
  }, [resourceGroups, ungroupedResources, t, groupResourcesLimit]);

  const Cards = useMemo(() => {
    if (viewMode === 'list') {
      const hasItems = (resources.data?.data.length || 0) > 0;

      if (resources.isError) {
        return (
          <Alert
            description={resources.error?.message}
            title={t('errorLoadingResources')}
            color="danger"
          />
        );
      }

      if (!resources.isLoading && !hasItems) {
        return <Alert title={t('noResourcesFound')} color="warning" />;
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.isLoading ? ResourceCardSkeletons : ResourceCards}
        </div>
      );
    } else {
      return GroupCards;
    }
  }, [
    viewMode,
    resources,
    ResourceCards,
    ResourceCardSkeletons,
    GroupCards,
    t,
  ]);

  const totalPages = useMemo(() => {
    if (viewMode === 'list') {
      const total = resources.data?.total ?? 0;
      return Math.ceil(total / pageSize);
    }
    return 0; // No pagination for group view
  }, [resources.data?.total, pageSize, viewMode]);

  return (
    <>
      <Toolbar
        onSearch={handleSearch}
        searchIsLoading={resources.isLoading || resourceGroups.isLoading}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showGroupId={!!groupId}
      />

      {Cards}

      {viewMode === 'list' && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}

// Helper component for skeleton UI
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

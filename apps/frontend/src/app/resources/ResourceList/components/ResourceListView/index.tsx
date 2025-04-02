import { useState, useMemo } from 'react';
import { useResources } from '../../../../../api/hooks';
import { ResourceCard, ResourceCardSkeletonLoader } from '../../../../../app/resources/resourceCard';
import { Resource } from '@attraccess/api-client';
import { Alert } from '@heroui/react';
import { useTranslations } from '../../../../../i18n';
import * as en from './translations/en';
import * as de from './translations/de';
import { ResourceListPagination } from '../ResourceListPagination';

interface ResourceListViewProps {
  searchInput: string;
  groupId?: string;
  ungroupedOnly: boolean;
}

export function ResourceListView({ 
  searchInput, 
  groupId, 
  ungroupedOnly 
}: ResourceListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 3x3 grid for desktop

  const { t } = useTranslations('resourceListView', { en, de });

  // Parse groupId to number if it's a string
  const numericGroupId = groupId ? parseInt(groupId, 10) : undefined;

  // Fetch resources with react-query hook
  const resources = useResources({
    search: searchInput,
    page: currentPage,
    limit: pageSize,
    groupId: numericGroupId,
    ungrouped: ungroupedOnly,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
  }, [resources.data?.data]);

  const ResourceCardSkeletons = useMemo(() => {
    return Array.from({ length: pageSize }, (_, index) => (
      <ResourceCardSkeletonLoader key={index} />
    ));
  }, [pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    const total = resources.data?.total ?? 0;
    return Math.ceil(total / pageSize);
  }, [resources.data?.total, pageSize]);

  // Display error if loading failed
  if (resources.isError) {
    return (
      <Alert
        description={resources.error?.message}
        title={t('errorLoadingResources')}
        color="danger"
      />
    );
  }

  // Display message if no resources found
  const hasItems = (resources.data?.data?.length || 0) > 0;
  if (!resources.isLoading && !hasItems) {
    return <Alert title={t('noResourcesFound')} color="warning" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.isLoading ? ResourceCardSkeletons : ResourceCards}
      </div>

      {totalPages > 1 && (
        <ResourceListPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </>
  );
} 
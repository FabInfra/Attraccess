import { useMemo } from 'react';
import { useResources } from '../../../../../../../api/hooks';
import { ResourceCard, ResourceCardSkeletonLoader } from '../../../../../../../app/resources/resourceCard';
import { Resource } from '@attraccess/api-client';
import { Alert, Button, Link } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from '../../../../../../../i18n';
import * as en from './translations/en';
import * as de from './translations/de';

interface UngroupedResourcesSectionProps {
  searchInput: string;
  hasBorder: boolean;
}

export function UngroupedResourcesSection({ 
  searchInput,
  hasBorder
}: UngroupedResourcesSectionProps) {
  const { t } = useTranslations('ungroupedResourcesSection', { en, de });
  const groupResourcesLimit = 5; // Show first 5 resources per group

  // Fetch ungrouped resources
  const ungroupedResources = useResources({
    search: searchInput,
    page: 1,
    limit: groupResourcesLimit,
    ungrouped: true,
  });

  // Generate skeleton loaders for loading state
  const ResourceCardSkeletons = useMemo(() => {
    return Array.from({ length: groupResourcesLimit }, (_, index) => (
      <ResourceCardSkeletonLoader key={index} />
    ));
  }, [groupResourcesLimit]);

  return (
    <div className={`w-full ${hasBorder ? 'border-b pb-6 mb-6' : ''}`}>
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
          {ResourceCardSkeletons}
        </div>
      ) : ungroupedResources.isError ? (
        <Alert title={t('errorLoadingResources')} color="danger" />
      ) : ungroupedResources.data?.data && ungroupedResources.data.data.length > 0 ? (
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
  );
} 
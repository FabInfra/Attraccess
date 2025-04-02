import { useMemo } from 'react';
import { useResourceGroupResources } from '../../../../../../../api/hooks/resourceGroups';
import { ResourceCard, ResourceCardSkeletonLoader } from '../../../../../../../app/resources/resourceCard';
import { Resource } from '@attraccess/api-client';
import { Alert, Button, Link } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from '../../../../../../../i18n';
import * as en from './translations/en';
import * as de from './translations/de';

interface GroupResourcesSectionProps {
  groupId: number;
  groupName: string;
  isLastGroup: boolean;
  searchInput: string;
}

export function GroupResourcesSection({
  groupId,
  groupName,
  isLastGroup,
  searchInput,
}: GroupResourcesSectionProps) {
  const { t } = useTranslations('groupResourcesSection', { en, de });
  const groupResourcesLimit = 5; // Show first 5 resources per group

  // Ensure groupId is a number
  const numericGroupId = typeof groupId === 'string' ? parseInt(groupId, 10) : groupId;

  // Fetch resources for this specific group
  const groupResources = useResourceGroupResources(numericGroupId, {
    page: 1,
    limit: groupResourcesLimit,
  });

  // Generate skeleton loaders for loading state
  const ResourceCardSkeletons = useMemo(() => {
    return Array.from({ length: groupResourcesLimit }, (_, index) => (
      <ResourceCardSkeletonLoader key={index} />
    ));
  }, [groupResourcesLimit]);

  return (
    <div className={`w-full ${!isLastGroup ? 'border-b pb-6 mb-6' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{groupName}</h3>
        <Link href={`/resources?groupId=${groupId}&viewMode=list`}>
          <Button
            variant="light"
            endContent={<ChevronRight className="w-4 h-4" />}
          >
            {t('seeAll')}
          </Button>
        </Link>
      </div>

      {groupResources.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ResourceCardSkeletons}
        </div>
      ) : groupResources.isError ? (
        <Alert title={t('errorLoadingResources')} color="danger" />
      ) : groupResources.data?.data && groupResources.data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupResources.data.data.map((resource: Resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              href={`/resources/${resource.id}`}
              fullWidth
            />
          ))}
        </div>
      ) : (
        <Alert title={t('noResourcesInGroup')} color="warning" />
      )}
    </div>
  );
} 
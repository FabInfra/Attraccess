import { Alert } from '@heroui/react';
import { useResourceGroups } from '../../../../../api/hooks/resourceGroups';
import { useTranslations } from '../../../../../i18n';
import * as en from './translations/en';
import * as de from './translations/de';
import { UngroupedResourcesSection } from './components/UngroupedResourcesSection';
import { GroupResourcesSection } from './components/GroupResourcesSection';

interface ResourceGroupViewProps {
  searchInput: string;
}

export function ResourceGroupView({ searchInput }: ResourceGroupViewProps) {
  const { t } = useTranslations('resourceGroupView', { en, de });

  // For the group view - fetch resource groups
  const resourceGroups = useResourceGroups({
    search: searchInput,
  });

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
  const hasGroups = groups.length > 0;

  return (
    <div className="space-y-8">
      {/* Ungrouped Resources Section */}
      <UngroupedResourcesSection 
        searchInput={searchInput} 
        hasBorder={hasGroups}
      />

      {/* Resource Groups */}
      {groups.map((group, index) => (
        <GroupResourcesSection
          key={group.id}
          groupId={group.id}
          groupName={group.name}
          isLastGroup={index === groups.length - 1}
          searchInput={searchInput}
        />
      ))}

      {/* If no groups and no ungrouped resources, GroupsView and UngroupedResourcesSection 
          will handle showing their own empty states */}
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
          className={`w-full ${groupIndex < groupCount - 1 ? 'border-b pb-6 mb-6' : ''}`}
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
import {
  PaginatedResourceResponseDto,
  useResourcesServiceGetAllResourcesInfinite,
} from '@attraccess/react-query-client';
import { ResourceCard } from './resourceCard';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button, Link } from '@heroui/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
import * as en from './list.resourcesInGroup.en.json';
import * as de from './list.resourcesInGroup.de.json';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAuth } from '@frontend/hooks/useAuth';

interface ResourcesInGroupProps {
  groupId: number;
  search?: string;
}

export function ResourcesInGroupList(props: ResourcesInGroupProps) {
  const { groupId, search } = props;

  const [lastItemRef, lastItemInView] = useInView();
  const { user } = useAuth();

  const { t } = useTranslations('listResourcesInGroup', {
    en,
    de,
  });

  const {
    data: resourcesPages,
    isFetchingNextPage,
    fetchNextPage,
  } = useResourcesServiceGetAllResourcesInfinite({
    groupId,
    search,
  });

  const allResources = useMemo(() => {
    return resourcesPages?.pages.flatMap((page: PaginatedResourceResponseDto) => page.data) ?? [];
  }, [resourcesPages]);

  useEffect(() => {
    if (lastItemInView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [lastItemInView, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {user?.systemPermissions.canManageResources && (
        <Button as={Link} color="secondary" size="sm" className="mb-4" href={`/resources/groups/${groupId}`}>
          {t('edit')}
        </Button>
      )}
      <div className="flex flex-row flex-wrap gap-4">
        {allResources.map((resource) => (
          <div key={resource.id} className="flex-grow" style={{ width: '200px', maxWidth: '300px' }}>
            <ResourceCard resource={resource} href={`/resources/${resource.id}`} />
          </div>
        ))}
      </div>

      {allResources.length > 0 && (
        <div ref={lastItemRef} style={{ marginTop: '50px', display: 'block' }}>
          &nbsp;
        </div>
      )}
    </div>
  );
}

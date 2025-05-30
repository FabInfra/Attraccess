import {
  PaginatedResourceResponseDto,
  useResourcesServiceGetAllResourcesInfinite,
} from '@attraccess/react-query-client';
import { ResourceCard } from './resourceCard';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

interface ResourcesInGroupProps {
  groupId: number;
  search?: string;
}

export function ResourcesInGroupList(props: ResourcesInGroupProps) {
  const { groupId, search } = props;

  const [lastItemRef, lastItemInView] = useInView();

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
      <div className="flex flex-row flex-wrap gap-4">
        {allResources.map((resource) => (
          <div key={resource.id} className="flex-grow">
            <ResourceCard
              resource={resource}
              href={`/resources/${resource.id}`}
              data-cy={`resource-card-${resource.id}`}
            />
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

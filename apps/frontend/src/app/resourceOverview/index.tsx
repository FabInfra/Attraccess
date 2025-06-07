import { useResourcesServiceResourceGroupsGetMany } from '@attraccess/react-query-client';
import { Toolbar } from '../resources/toolbar/toolbar';
import { ResourceGroupCard } from './resourceGroupCard';
import { useMemo, useState } from 'react';

export function ResourceOverview() {
  const { data: groups } = useResourcesServiceResourceGroupsGetMany();
  const [searchValue, setSearchValue] = useState('');

  const groupIds = useMemo(() => {
    const ids: Array<number | 'none'> = ['none'];

    groups?.forEach((group) => ids.push(group.id));

    return ids;
  }, [groups]);

  return (
    <div>
      <Toolbar onSearch={setSearchValue} searchIsLoading={false} />

      <div className="flex flex-row flex-wrap gap-4">
        {groupIds.map((id) => (
          <ResourceGroupCard
            key={id}
            groupId={id}
            searchValue={searchValue}
            className="flex flex-1 min-w-[100%] md:min-w-[500px]"
          />
        ))}
      </div>
    </div>
  );
}

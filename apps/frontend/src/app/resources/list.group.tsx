import { useCallback, useEffect, useMemo, useState } from 'react';
import { Toolbar } from './toolbar';
import { Accordion, AccordionItem, Selection, Spinner } from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './resourceList.en.json';
import * as de from './resourceList.de.json';
import {
  PaginatedResourceGroupResponseDto,
  useResourceGroupsServiceGetAllResourceGroupsInfinite,
  useResourcesServiceGetAllResources,
} from '@attraccess/react-query-client';
import { useInView } from 'react-intersection-observer';
import { ResourcesInGroupList } from './list.resources-in-group';

export function ResourceList() {
  const [searchInput, setSearchInput] = useState('');

  const { t } = useTranslations('resourceList', {
    en,
    de,
  });

  const [lastItemRef, lastItemInView] = useInView();

  const handleSearch = useCallback((searchValue: string) => {
    setSearchInput(searchValue);
  }, []);

  const {
    data: groups,
    fetchNextPage,
    isFetchingNextPage,
  } = useResourceGroupsServiceGetAllResourceGroupsInfinite({
    limit: 50,
  });

  useEffect(() => {
    if (lastItemInView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [lastItemInView, fetchNextPage, isFetchingNextPage]);

  const resourceWithoutGroup = useResourcesServiceGetAllResources({
    groupId: -1,
    limit: 1,
  });

  const allGroups = useMemo(() => {
    return groups?.pages.flatMap((page: PaginatedResourceGroupResponseDto) => page.data) ?? [];
  }, [groups]);

  const [userSelectedGroups, setUserSelectedGroups] = useState<Set<number>>(new Set([]));

  const selectedKeys = useMemo(() => {
    if (searchInput) {
      return new Set([-1, ...allGroups.map((group) => group.id)].map(String));
    }

    return userSelectedGroups;
  }, [allGroups, userSelectedGroups, searchInput]);

  const onAccordionSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys === 'all') {
        setUserSelectedGroups(new Set(allGroups.map((group) => group.id)));
      } else {
        setUserSelectedGroups(keys as Set<number>);
      }
    },
    [allGroups]
  );

  const allGroupLists = useMemo(() => {
    const groupLists: Array<{ name: string; id: number }> = [];

    if (resourceWithoutGroup.data?.total ?? 0 >= 1) {
      groupLists.push({ name: t('ungrouped'), id: -1 });
    }

    allGroups.forEach((group) => {
      groupLists.push({ name: group.name, id: group.id });
    });

    return groupLists;
  }, [allGroups, t, resourceWithoutGroup.data?.total]);

  return (
    <>
      <Toolbar onSearch={handleSearch} data-cy="resource-list-toolbar" />

      <Accordion
        selectedKeys={selectedKeys}
        onSelectionChange={onAccordionSelectionChange}
        selectionMode={searchInput ? 'multiple' : 'single'}
        data-cy="resource-group-accordion"
      >
        {allGroupLists.map((group) => (
          <AccordionItem
            key={group.id}
            aria-label={group.name}
            title={group.name}
            data-cy={`resource-group-item-${group.id}`}
          >
            <ResourcesInGroupList
              groupId={group.id}
              search={searchInput}
              data-cy={`resources-in-group-list-${group.id}`}
            />
          </AccordionItem>
        ))}
      </Accordion>
      {isFetchingNextPage && <Spinner variant="wave" data-cy="loading-spinner" />}
      <div ref={lastItemRef} style={{ marginTop: '200px' }}>
        &nbsp;
      </div>
    </>
  );
}

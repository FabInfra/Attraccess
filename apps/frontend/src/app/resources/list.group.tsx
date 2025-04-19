import { useCallback, useEffect, useMemo, useState } from 'react';
import { Toolbar } from './toolbar';
import { Accordion, AccordionItem, Selection, Spinner } from '@heroui/react';
import { useTranslations } from '../../i18n';
import * as en from './translations/resourceList.en';
import * as de from './translations/resourceList.de';
import {
  PaginatedResourceGroupResponseDto,
  useResourceGroupsServiceGetAllResourceGroupsInfinite,
  useResourcesServiceGetAllResources,
} from '@attraccess/react-query-client';
import { useInView } from 'react-intersection-observer';
import { ResourcesInGroupList } from './list.resourcesInGroup';

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
      <Toolbar onSearch={handleSearch} />

      <Accordion
        selectedKeys={selectedKeys}
        onSelectionChange={onAccordionSelectionChange}
        selectionMode={searchInput ? 'multiple' : 'single'}
      >
        {allGroupLists.map((group) => (
          <AccordionItem key={group.id} aria-label={group.name} title={group.name}>
            <ResourcesInGroupList groupId={group.id} search={searchInput} />
          </AccordionItem>
        ))}
      </Accordion>
      {isFetchingNextPage && <Spinner variant="wave" />}
      <div ref={lastItemRef} style={{ marginTop: '200px' }}>
        &nbsp;
      </div>
    </>
  );
}

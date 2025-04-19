import { useMemo, useState } from 'react';
import { useTranslations } from '../../../../i18n';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Pagination } from '@heroui/pagination';
import { AddGroupIntroductionForm, GroupIntroductionsList } from './components';
import {
  useResourceGroupIntroducersServiceGetAllResourceGroupIntroducers,
} from '@attraccess/react-query-client';
import { Spinner } from '@heroui/react'; // Placeholder for Skeleton

// Main component
export function ResourceGroupIntroductions({ groupId }: { groupId: number }) {
  // TODO: Setup translations
  // const { t } = useTranslations('resourceGroupIntroductions', {
  //   en,
  //   de,
  // });
  const t = (key: string) => key; // Placeholder translation

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Use group-specific hooks
  const { data: introductionsData, isLoading: isLoadingIntroductions } =
    useResourceGroupIntroductionServiceGetAllResourceGroupIntroductions({
      groupId,
      limit: pageSize,
      page: currentPage,
    });

  // TODO: Implement permission check if necessary
  // const { data: canManageIntroductions, isLoading: isLoadingCanManageIntroductions } =
  //   useResourceGroupIntroductionsServiceCheckCanManagePermission({ groupId });
  const canManageIntroductions = true; // Placeholder permission
  const isLoadingCanManageIntroductions = false; // Placeholder loading state

  const totalPages = useMemo(() => introductionsData?.totalPages || 1, [introductionsData]);

  if (isLoadingIntroductions || isLoadingCanManageIntroductions) {
    // return <GroupIntroductionsSkeleton />;
    return <Spinner variant="wave" />;
  }

  if (!canManageIntroductions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
      </CardHeader>

      <CardBody>
        <AddGroupIntroductionForm groupId={groupId} />

        <Divider className="my-4" />

        <GroupIntroductionsList
          groupId={groupId}
          introductions={introductionsData?.data}
          isLoading={isLoadingIntroductions}
        />
      </CardBody>

      <CardFooter className="flex justify-center items-center pt-4">
        <Pagination total={totalPages} page={currentPage} showControls onChange={setCurrentPage} />
      </CardFooter>
    </Card>
  );
}

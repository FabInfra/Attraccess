import { useMemo, useState } from 'react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './translations/resourceIntroductions.en';
import * as de from './translations/resourceIntroductions.de';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Pagination } from '@heroui/pagination';
import { IntroductionsSkeleton, AddIntroductionForm, IntroductionsList } from './components';
import {
  useResourceIntroductionsServiceCheckCanManagePermission,
  useResourceIntroductionsServiceGetAllResourceIntroductions,
} from '@attraccess/react-query-client';

// Main component
export function ResourceIntroductions({
  resourceId,
  ...rest
}: { resourceId: number } & React.ComponentProps<typeof Card>) {
  const { t } = useTranslations('resourceIntroductions', {
    en,
    de,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const { data: introductionsData, isLoading: isLoadingIntroductions } =
    useResourceIntroductionsServiceGetAllResourceIntroductions({ resourceId, limit: pageSize, page: currentPage });

  const { data: canManageIntroductions, isLoading: isLoadingCanManageIntroductions } =
    useResourceIntroductionsServiceCheckCanManagePermission({ resourceId });

  const totalPages = useMemo(() => introductionsData?.totalPages || 1, [introductionsData]);

  if (isLoadingIntroductions || isLoadingCanManageIntroductions) {
    return <IntroductionsSkeleton />;
  }

  if (!canManageIntroductions) {
    return null;
  }

  return (
    <Card {...rest}>
      <CardHeader>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
      </CardHeader>

      <CardBody>
        <AddIntroductionForm resourceId={resourceId} />

        <Divider className="my-4" />

        <IntroductionsList resourceId={resourceId} />
      </CardBody>

      <CardFooter className="flex justify-center items-center pt-4">
        <Pagination total={totalPages} page={currentPage} showControls onChange={setCurrentPage} />
      </CardFooter>
    </Card>
  );
}

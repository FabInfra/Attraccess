import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { AddIntroducer } from './components/AddIntroducer';
import * as en from './translations/en';
import * as de from './translations/de';
import { TFunction } from 'i18next';
import { IntroducersList } from './components/IntroducersList';
import { memo } from 'react';
import { useResourceIntroducersServiceGetAllResourceIntroducers } from '@attraccess/react-query-client';

interface IntroducersListProps {
  resourceId: number;
  t: TFunction;
}

function IntroducersListCard({ resourceId, t }: IntroducersListProps) {
  const { data: introducers } = useResourceIntroducersServiceGetAllResourceIntroducers({ resourceId });

  return introducers && introducers.length > 0 ? (
    <>
      <Divider className="my-4" />
      <h3 className="text-lg font-medium mb-2 dark:text-white">{t('currentIntroducers')}</h3>
      <IntroducersList resourceId={resourceId} />
    </>
  ) : (
    <div className="text-center p-4 mt-4 bg-gray-50 rounded-md dark:bg-gray-800">
      <p className="text-gray-500 dark:text-gray-400">{t('noIntroducers')}</p>
    </div>
  );
}

export type ManageIntroducersProps = {
  resourceId: number;
} & React.ComponentProps<typeof Card>;

function ManageIntroducersComponent(props: ManageIntroducersProps) {
  const { resourceId, ...rest } = props;
  const { t } = useTranslations('manageIntroducers', {
    en,
    de,
  });

  return (
    <Card {...rest}>
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
      </CardHeader>

      <CardBody className="space-y-4">
        <AddIntroducer resourceId={resourceId} />

        <IntroducersListCard resourceId={resourceId} t={t} />
      </CardBody>
    </Card>
  );
}

export const ManageIntroducers = memo(ManageIntroducersComponent);

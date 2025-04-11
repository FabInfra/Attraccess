// eslint-disable-next-line @nx/enforce-module-boundaries
import { useGroupIntroducers } from '@frontend/api/hooks/groupIntroduction';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { AddGroupIntroducerForm } from './components/AddGroupIntroducerForm';
import * as en from './translations/en';
import * as de from './translations/de';
import { TFunction } from 'i18next';
import { GroupIntroducersList } from './components/GroupIntroducersList';
import { memo } from 'react';

interface GroupIntroducersListProps {
  groupId: number;
  t: TFunction;
}

function GroupIntroducersListCard({ groupId, t }: GroupIntroducersListProps) {
  const { data: introducers } = useGroupIntroducers(groupId);

  return introducers && introducers.length > 0 ? (
    <>
      <Divider className="my-4" />
      <h3 className="text-lg font-medium mb-2 dark:text-white">
        {t('currentIntroducers')}
      </h3>
      <GroupIntroducersList groupId={groupId} />
    </>
  ) : (
    <div className="text-center p-4 mt-4 bg-gray-50 rounded-md dark:bg-gray-800">
      <p className="text-gray-500 dark:text-gray-400">{t('noIntroducers')}</p>
    </div>
  );
}

export type ManageGroupIntroducersProps = {
  groupId: number;
};

function ManageGroupIntroducersComponent(props: ManageGroupIntroducersProps) {
  const { groupId } = props;
  const { t } = useTranslations('manageGroupIntroducers', {
    en,
    de,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
      </CardHeader>

      <CardBody className="space-y-4">
        <AddGroupIntroducerForm groupId={groupId} />

        <GroupIntroducersListCard groupId={groupId} t={t} />
      </CardBody>
    </Card>
  );
}

export const ManageGroupIntroducers = memo(ManageGroupIntroducersComponent);

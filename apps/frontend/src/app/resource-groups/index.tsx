import { useParams } from 'react-router-dom';
import { useResourcesServiceResourceGroupsGetOne } from '@attraccess/react-query-client';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { PageHeader } from '../../components/pageHeader';
import { GroupDetailsForm } from './GroupDetailsForm';
import { ResoureGroupIntroducerManagement } from './IntroducerManagement';
import { ResourceGroupIntroductionsManagement } from './IntroductionsManagement';
import { Spinner } from '@heroui/react';
import { ErrorDisplay } from '../../components/errorDisplay/ErrorDisplay';
import * as en from './en.json';
import * as de from './de.json';
import { GroupIcon } from 'lucide-react';

export function ResourceGroupEditPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { t } = useTranslations('resourceGroupEditPage', { en, de });
  const numericGroupId = Number(groupId);

  const {
    data: group,
    isLoading,
    error,
  } = useResourcesServiceResourceGroupsGetOne({ id: numericGroupId }, undefined, { enabled: !!groupId });

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <ErrorDisplay error={error as Error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!group) {
    return null;
  }

  return (
    <div>
      <PageHeader title={group.name} subtitle={t('page.subtitle')} icon={<GroupIcon />} backTo="/" />

      <div className="flex flex-row flex-wrap gap-4 items-stretch">
        <GroupDetailsForm groupId={numericGroupId} className="flex-1 min-w-80" />
        <ResoureGroupIntroducerManagement groupId={numericGroupId} className="flex-1 min-w-80" />

        <ResourceGroupIntroductionsManagement groupId={numericGroupId} className="flex-1 min-w-80" />
      </div>
    </div>
  );
}

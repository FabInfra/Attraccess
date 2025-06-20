import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { CircularProgress } from '@heroui/react';

import { MehIcon } from 'lucide-react';

export const TableDataLoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <CircularProgress isIndeterminate />
    </div>
  );
};

export const TableEmptyState = () => {
  const { t } = useTranslations('tableEmptyState', {
    en: {
      message: 'No entries found',
    },
    de: {
      message: 'Keine Einträge gefunden',
    },
  });
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <MehIcon size={48} />
      <p>{t('message')}</p>
    </div>
  );
};

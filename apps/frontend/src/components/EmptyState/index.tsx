import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './translations/en';
import * as de from './translations/de';

export const EmptyState = () => {
  const { t } = useTranslations('emptyState', {
    en,
    de,
  });

  return (
    <div className="text-center py-10 px-4">
      <div className="text-gray-500 dark:text-gray-400">{t('noItems')}</div>
    </div>
  );
};

import PWAInstallFromLib from '@khmyznikov/pwa-install/react-legacy';
import de from './de.json';
import en from './en.json';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promptEvent: any;
  }
}

export function PWAInstall() {
  const { t } = useTranslations('pwaInstall', {
    en,
    de,
  });

  return (
    <PWAInstallFromLib
      name="FabAccess"
      description={t('description')}
      icon={'/icon-512-maskable.png'}
    ></PWAInstallFromLib>
  );
}

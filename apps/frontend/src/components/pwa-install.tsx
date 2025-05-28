import PWAInstallFromLib from '@khmyznikov/pwa-install/react-legacy';
import de from './pwa-install.de.json';
import en from './pwa-install.en.json';
import { useTranslations } from '@attraccess/plugins-frontend-ui';

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
      name="Attraccess"
      description={t('description')}
      icon={'/icon-512-maskable.png'}
    ></PWAInstallFromLib>
  );
}

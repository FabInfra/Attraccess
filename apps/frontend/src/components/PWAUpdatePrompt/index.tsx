import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { useFormatDateTime, useTranslations } from '@fabaccess/plugins-frontend-ui';
import { useCallback, useMemo, useState } from 'react';
import { PageHeader } from '../pageHeader';
import { ClockIcon, GiftIcon, RefreshCcwIcon } from 'lucide-react';
import { InstallationProgressIndicator } from './installationProgressIndicator';

import de from './de.json';
import en from './en.json';

const minutesToWait = 10;

export function PWAUpdatePrompt() {
  // replaced dynamically
  const buildDate = '__DATE__';
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__' as string;

  const { t } = useTranslations('PWAUpdatePrompt', {
    de,
    en,
  });

  const [isInstalling, setIsInstalling] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (reloadSW === 'true') {
        registration &&
          setInterval(() => {
            console.debug('Checking for sw update');
            registration.update();
          }, minutesToWait * 60 * 1000);
      } else {
        console.debug('SW Registered: ' + registration);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const [remindMeLater, setRemindMeLater] = useState(false);

  const closeForAWhile = useCallback(() => {
    setRemindMeLater(true);

    setTimeout(() => {
      setRemindMeLater(false);
    }, 10 * 60 * 1000); // 10 minutes
  }, []);

  const install = useCallback(() => {
    setIsInstalling(true);
    updateServiceWorker();
  }, [updateServiceWorker]);

  const formattedBuildDate = useFormatDateTime(buildDate);

  const benefitsItems = useMemo(() => {
    const items = t('benefits.items', { returnObjects: true }) as undefined | string[];

    return Array.isArray(items) ? items : [];
  }, [t]);

  if (isInstalling) {
    return <InstallationProgressIndicator />;
  }

  return (
    <Modal isOpen={needRefresh && !remindMeLater} size="full" hideCloseButton>
      <ModalContent>
        <ModalHeader>
          <PageHeader
            title={t('title')}
            subtitle={t('subtitle', { buildDate: formattedBuildDate })}
            icon={<GiftIcon />}
            noMargin
          />
        </ModalHeader>
        <ModalBody className="space-y-6">
          <p className="text-lg dark:text-white">{t('intro')}</p>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('benefits.title')}</h3>
            <ul className="space-y-1">
              {benefitsItems.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span className="text-blue-800 dark:text-blue-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">{t('updateInfo.title')}</h3>
            <p className="text-green-800 dark:text-green-200 font-medium mb-1">{t('updateInfo.description')}</p>
            <p className="text-green-700 dark:text-green-300 text-sm">{t('updateInfo.details')}</p>
          </div>

          <p className="text-center font-medium text-gray-700 dark:text-gray-300">{t('recommendation')}</p>
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <Button startContent={<ClockIcon />} variant="light" onPress={() => closeForAWhile()}>
            {t('actions.closeForAWhile', { minutes: minutesToWait })}
          </Button>
          <Button startContent={<RefreshCcwIcon />} color="primary" onPress={() => install()}>
            {t('actions.reload')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

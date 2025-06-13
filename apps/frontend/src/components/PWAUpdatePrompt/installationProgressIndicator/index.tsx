import { Modal, ModalBody, ModalContent, ModalHeader, Progress } from '@heroui/react';
import { PageHeader } from '../../pageHeader';
import { RefreshCcwIcon } from 'lucide-react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';

import de from './de.json';
import en from './en.json';

export function InstallationProgressIndicator() {
  const { t } = useTranslations('InstallationProgressIndicator', {
    de,
    en,
  });

  return (
    <Modal isOpen={true} size="full" hideCloseButton>
      <ModalContent>
        <ModalHeader>
          <PageHeader
            title={t('title')}
            subtitle={t('subtitle')}
            icon={<RefreshCcwIcon className="animate-spin" />}
            noMargin
          />
        </ModalHeader>
        <ModalBody className="flex flex-col items-center justify-center space-y-8 py-12">
          {/* Large spinning icon for visual feedback */}
          <div className="relative">
            <RefreshCcwIcon size={80} className="animate-spin text-blue-600 dark:text-blue-400" />
          </div>

          {/* Simple, reassuring message */}
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('heading')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{t('description')}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">{t('warning')}</p>
          </div>

          {/* Visual progress indication */}
          <Progress isIndeterminate />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalProps } from '@heroui/modal';
import { Button } from '@heroui/button';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './deleteConfirmation.en.json';
import * as de from './deleteConfirmation.de.json';
import { Trans } from 'react-i18next';

interface DeleteConfirmationModalProps extends Omit<ModalProps, 'children'> {
  isOpen: boolean;
  onOpenChange: ModalProps['onOpenChange'];
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onOpenChange,
  onClose,
  onConfirm,
  itemName,
  ...rest
}: DeleteConfirmationModalProps) {
  const { t } = useTranslations('deleteConfirmation', {
    en,
    de,
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" {...rest}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{t('title')}</ModalHeader>
            <ModalBody>
              <div className="text-lg">
                <Trans
                  t={t}
                  count={1}
                  i18nKey="message"
                  values={{ itemName }}
                  components={{
                    br: <br />,
                    bold: <span className="text-2xl font-bold block my-4" />,
                    alert: (
                      <div className="text-red-500 bg-red-100 p-2 rounded-md dark:bg-red-900 dark:text-red-100 mt-8" />
                    ),
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                {t('cancelButton')}
              </Button>
              <Button
                onPress={async () => {
                  await onConfirm()
                    .then(() => {
                      onClose();
                    })
                    .catch(() => {
                      // nothing
                    });
                }}
                color="danger"
              >
                {t('deleteButton')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

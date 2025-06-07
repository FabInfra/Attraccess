import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalProps } from '@heroui/modal';
import { Button } from '@heroui/button';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './en.json';
import * as de from './de.json';
import { Trans } from 'react-i18next';

interface DeleteConfirmationModalProps extends Omit<ModalProps, 'children'> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => unknown;
  itemName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
  ...rest
}: Readonly<DeleteConfirmationModalProps>) {
  const { t } = useTranslations('deleteConfirmation', {
    en,
    de,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" {...rest}>
      <ModalContent>
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
          <Button variant="light" onPress={onClose} data-cy="cancel-button">
            {t('cancelButton')}
          </Button>
          <Button data-cy="delete-button" onPress={() => onConfirm()} isLoading={isDeleting} color="danger">
            {t('deleteButton')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

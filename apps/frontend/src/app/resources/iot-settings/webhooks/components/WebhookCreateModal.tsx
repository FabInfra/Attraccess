import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import WebhookForm from './WebhookForm';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import * as de from '../translations/de';
import * as en from '../translations/en';

interface WebhookCreateModalProps {
  resourceId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function WebhookCreateModal(props: WebhookCreateModalProps) {
  const { resourceId, isOpen, onOpenChange } = props;

  const { t } = useTranslations('webhooksCreateModal', { en, de });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" data-cy="webhook-create-modal">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{t('newWebhook')}</ModalHeader>
            <ModalBody>
              <WebhookForm
                resourceId={resourceId}
                onCancel={() => onOpenChange(false)}
                onComplete={() => onOpenChange(false)}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

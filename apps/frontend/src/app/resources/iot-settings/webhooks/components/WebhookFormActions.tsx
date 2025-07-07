import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { Trash2, RefreshCw, Save } from 'lucide-react';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { useWebhookForm } from '../context/WebhookFormContext';

// Translations for this component only
import en from './WebhookFormActions.en.json';
import de from './WebhookFormActions.de.json';
import {
  useWebhooksServiceWebhookConfigDeleteOne,
  useWebhooksServiceWebhookConfigTest,
} from '@fabaccess/react-query-client';
import { useToastMessage } from '../../../../../components/toastProvider';

interface WebhookFormActionsProps {
  onCancel?: () => void;
  onSubmit: () => void;
}

const WebhookFormActions: React.FC<WebhookFormActionsProps> = ({ onCancel, onSubmit }) => {
  const { webhookId, resourceId, isExistingWebhook, isSubmitting } = useWebhookForm();
  const { t } = useTranslations('webhooks.formActions', {
    en,
    de,
  });
  const { success, error: showError } = useToastMessage();

  // API hooks specific to this component
  const deleteWebhook = useWebhooksServiceWebhookConfigDeleteOne();
  const testWebhook = useWebhooksServiceWebhookConfigTest();

  // Local state
  const [isTesting, setIsTesting] = useState(false);

  // Delete the webhook
  const handleDelete = async () => {
    if (!webhookId) return;

    if (window.confirm(t('deleteConfirmation'))) {
      try {
        await deleteWebhook.mutateAsync({
          resourceId,
          id: webhookId,
        });
        success({
          title: t('webhookDeleted'),
          description: t('webhookDeletedDesc'),
        });
      } catch (error) {
        console.error('Failed to delete webhook:', error);
        showError({
          title: t('errorGeneric'),
          description: t('failedToDelete'),
        });
      }
    }
  };

  // Test the webhook
  const handleTest = async () => {
    if (!webhookId) {
      showError({
        title: t('notImplemented'),
        description: t('notImplementedDesc'),
      });
      return;
    }

    setIsTesting(true);
    try {
      const result = await testWebhook.mutateAsync({
        resourceId,
        id: webhookId,
      });

      if (result.success) {
        success({
          title: t('testSuccess'),
          description: result.message,
        });
      } else {
        showError({
          title: t('testFailed'),
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Failed to test webhook:', error);
      showError({
        title: t('errorGeneric'),
        description: t('failedToTest'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex justify-between pt-2 flex-wrap">
      <div className="flex gap-2">
        {isExistingWebhook && (
          <>
            <Button
              color="danger"
              variant="light"
              startContent={<Trash2 className="w-4 h-4" />}
              onPress={handleDelete}
              isDisabled={isSubmitting}
            >
              {t('delete')}
            </Button>
            <Button
              color="secondary"
              variant="light"
              startContent={<RefreshCw className="w-4 h-4" />}
              onPress={handleTest}
              isLoading={isTesting}
              isDisabled={isSubmitting}
            >
              {t('test')}
            </Button>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {onCancel && (
          <Button variant="light" onPress={onCancel} isDisabled={isSubmitting}>
            {t('cancel')}
          </Button>
        )}
        <Button color="primary" startContent={<Save className="w-4 h-4" />} onPress={onSubmit} isLoading={isSubmitting}>
          {t('save')}
        </Button>
      </div>
    </div>
  );
};

export default WebhookFormActions;

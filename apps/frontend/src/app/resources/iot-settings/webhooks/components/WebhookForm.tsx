import React, { useState, useEffect } from 'react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { WebhookFormValues, defaultFormValues, webhookToFormValues } from '../types';
import { WebhookFormProvider } from '../context/WebhookFormContext';
import WebhookBasicSettings from './WebhookBasicSettings';
import WebhookTemplateEditor from './WebhookTemplateEditor';
import WebhookAdvancedSettings from './WebhookAdvancedSettings';
import WebhookFormActions from './WebhookFormActions';

import * as en from '../translations/en';
import * as de from '../translations/de';
import {
  useWebhooksServiceCreateOneWebhookConfiguration,
  useWebhooksServiceGetOneWebhookConfigurationById,
  useWebhooksServiceUpdateOneWebhookConfiguration,
  UseWebhooksServiceGetAllWebhookConfigurationsKeyFn,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';
import { useToastMessage } from '../../../../../components/toastProvider';

export interface WebhookFormProps {
  webhookId?: number;
  resourceId: number;
  initialValues?: WebhookFormValues;
  onCancel?: () => void;
  onComplete?: (webhookId?: number) => void;
}

/**
 * Self-contained form component for creating and editing webhooks
 * Handles its own data fetching, state management, and API operations
 * Composed of smaller, self-contained components
 */
const WebhookForm: React.FC<WebhookFormProps> = ({ webhookId, resourceId, initialValues, onCancel, onComplete }) => {
  const { t } = useTranslations('webhookForm', { en, de });
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();

  // State
  const [values, setValues] = useState<WebhookFormValues>(initialValues || defaultFormValues);
  const [isLoaded, setIsLoaded] = useState(!!initialValues);

  // API hooks - main form only needs create and update
  const createWebhook = useWebhooksServiceCreateOneWebhookConfiguration();
  const updateWebhook = useWebhooksServiceUpdateOneWebhookConfiguration();

  // Data fetching hook - only used when webhookId is provided and no initialValues
  const { data: webhookData, isFetching } = useWebhooksServiceGetOneWebhookConfigurationById(
    {
      resourceId,
      id: webhookId ?? 0,
    },
    undefined,
    {
      enabled: !!webhookId && !initialValues,
    }
  );

  // Disable fetching if we already have initial values or no webhook ID
  const shouldFetch = !!webhookId && !initialValues;

  // Flags
  const isExistingWebhook = !!webhookId;
  const isSubmitting = createWebhook.isPending || updateWebhook.isPending;

  // Load webhook data when available
  useEffect(() => {
    if (webhookData && !isLoaded && shouldFetch) {
      setValues(webhookToFormValues(webhookData));
      setIsLoaded(true);
    }
  }, [webhookData, isLoaded, shouldFetch]);

  // Submit the form (create or update)
  const handleSubmit = async () => {
    // Validate URL
    try {
      new URL(values.url);
    } catch {
      showError({
        title: t('invalidUrl'),
        description: t('invalidUrlDesc'),
      });
      return;
    }

    // Validate headers JSON
    try {
      JSON.parse(values.headers);
    } catch {
      showError({
        title: t('invalidHeaders'),
        description: t('invalidHeadersDesc'),
      });
      return;
    }

    try {
      if (isExistingWebhook && webhookId) {
        // Update existing webhook
        await updateWebhook.mutateAsync({
          resourceId,
          id: webhookId,
          requestBody: values,
        });
        queryClient.invalidateQueries({
          queryKey: UseWebhooksServiceGetAllWebhookConfigurationsKeyFn({ resourceId }),
        });
        success({
          title: t('webhookUpdated'),
          description: t('webhookUpdatedDesc'),
        });
      } else {
        // Create new webhook
        const result = await createWebhook.mutateAsync({
          resourceId,
          requestBody: values,
        });
        queryClient.invalidateQueries({
          queryKey: UseWebhooksServiceGetAllWebhookConfigurationsKeyFn({ resourceId }),
        });
        success({
          title: t('webhookCreated'),
          description: t('webhookCreatedDesc'),
        });

        webhookId = result.id;
      }

      if (onComplete) {
        onComplete(webhookId);
      }
    } catch (error) {
      console.error('Failed to save webhook configuration:', error);
      showError({
        title: t('errorGeneric'),
        description: t('failedToSave'),
      });
    }
  };

  if (isFetching && !isLoaded) {
    return <div className="py-4 dark:text-gray-300">{t('loadingWebhook')}</div>;
  }

  return (
    <WebhookFormProvider
      value={{
        values,
        setValues,
        resourceId,
        webhookId,
        isExistingWebhook,
        isSubmitting,
      }}
    >
      <div className="space-y-6">
        <WebhookBasicSettings />
        <WebhookTemplateEditor />
        <WebhookAdvancedSettings />
        <WebhookFormActions onCancel={onCancel} onSubmit={handleSubmit} />
      </div>
    </WebhookFormProvider>
  );
};

export default WebhookForm;

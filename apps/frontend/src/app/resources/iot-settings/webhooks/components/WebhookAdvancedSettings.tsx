import React from 'react';
import { Switch, NumberInput, Divider } from '@heroui/react';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { useWebhookForm } from '../context/WebhookFormContext';

// Translations for this component only
import * as enAdvanced from '../translations/components/advanced-settings/en';
import * as deAdvanced from '../translations/components/advanced-settings/de';

const WebhookAdvancedSettings: React.FC = () => {
  const { values, setValues } = useWebhookForm();
  const { t } = useTranslations('webhooks.advancedSettings', {
    en: enAdvanced,
    de: deAdvanced,
  });

  const handleSwitchChange = (name: string, checked: boolean) => {
    setValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">{t('retryLabel')}</h3>
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{t('retryLabel')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('retryHelp')}</div>
          </div>
          <Switch
            isSelected={values.retryEnabled}
            onValueChange={(checked) => handleSwitchChange('retryEnabled', checked)}
            data-cy="webhook-form-retry-enabled-switch"
          />
        </div>
      </div>

      {values.retryEnabled && (
        <div className="grid grid-cols-2 gap-4 px-2">
          <div>
            <label className="block text-sm font-medium mb-1">{t('maxRetriesLabel')}</label>
            <NumberInput
              min={1}
              max={10}
              value={values.maxRetries}
              onValueChange={(value) => handleNumberChange('maxRetries', value)}
              data-cy="webhook-form-max-retries-input"
            />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('maxRetriesHelp')}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('retryDelayLabel')}</label>
            <NumberInput
              min={100}
              max={10000}
              step={100}
              value={values.retryDelay}
              onValueChange={(value) => handleNumberChange('retryDelay', value)}
            />
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('retryDelayHelp')}</div>
          </div>
        </div>
      )}

      <Divider />

      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{t('activeLabel')}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('activeHelp')}</div>
        </div>
        <Switch isSelected={values.active} onValueChange={(checked) => handleSwitchChange('active', checked)} />
      </div>
    </div>
  );
};

export default WebhookAdvancedSettings;

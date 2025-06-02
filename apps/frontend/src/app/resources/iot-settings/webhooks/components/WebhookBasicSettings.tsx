import React from 'react';
import { Input, Textarea, Select, SelectItem, Switch } from '@heroui/react'; // Added Switch
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { useWebhookForm } from '../context/WebhookFormContext';
import { WebhookHttpMethod } from '../types';

// Translations for this component only
import * as enBasic from '../translations/components/basic-settings/en';
import * as deBasic from '../translations/components/basic-settings/de';

const WebhookBasicSettings: React.FC = () => {
  const { values, setValues } = useWebhookForm();
  const { t } = useTranslations('webhooks.basicSettings', {
    en: enBasic,
    de: deBasic,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-expect-error - type is not available on HTMLTextAreaElement
    const checked = type === 'checkbox' ? e.target.checked : undefined;

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'method') {
      // Validate that it's a valid webhook method
      if (Object.values(WebhookHttpMethod).includes(value as WebhookHttpMethod)) {
        setValues((prev) => ({
          ...prev,
          [name]: value as WebhookHttpMethod,
        }));
      }
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Name and URL */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('nameLabel')}
          name="name"
          value={values.name}
          onChange={handleInputChange}
          placeholder={t('namePlaceholder')}
          isRequired
        />
        <Input
          label={t('urlLabel')}
          name="url"
          value={values.url}
          onChange={handleInputChange}
          placeholder={t('urlPlaceholder')}
          isRequired
        />
      </div>

      {/* HTTP Method */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label={t('methodLabel')}
          selectedKeys={[values.method]}
          onChange={(e) => handleSelectChange('method', e.target.value)}
        >
          {Object.values(WebhookHttpMethod).map((method) => (
            <SelectItem key={method}>{method}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Event Triggers */}
      <div className="space-y-2 pt-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('eventTriggersLabel')}</p>
        <Switch
          name="sendOnStart"
          isSelected={values.sendOnStart}
          onValueChange={(isSelected) => handleSwitchChange('sendOnStart', isSelected)}
        >
          {t('sendOnStartLabel')}
        </Switch>
        <Switch
          name="sendOnStop"
          isSelected={values.sendOnStop}
          onValueChange={(isSelected) => handleSwitchChange('sendOnStop', isSelected)}
        >
          {t('sendOnStopLabel')}
        </Switch>
        <Switch
          name="sendOnTakeover"
          isSelected={values.sendOnTakeover}
          onValueChange={(isSelected) => handleSwitchChange('sendOnTakeover', isSelected)}
        >
          {t('sendOnTakeoverLabel')}
        </Switch>
      </div>

      {/* Headers */}
      <Textarea
        label={t('headersLabel')}
        name="headers"
        value={values.headers}
        onChange={handleInputChange}
        placeholder={t('headersPlaceholder')}
        description={t('headersHelp')}
      />
    </div>
  );
};

export default WebhookBasicSettings;

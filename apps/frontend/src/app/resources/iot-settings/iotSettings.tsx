import React, { useMemo, useState } from 'react';
import { Tab, Tabs, Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { useParams } from 'react-router-dom';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { WifiIcon, Webhook, DatabaseIcon } from 'lucide-react';
import { SettingsIcon } from 'lucide-react';
import { MqttConfigTabs } from './mqtt/components/MqttConfigTabs';
import { WebhookConfigTabs } from './webhooks/components/WebhookConfigTabs';
import { ESPHomeConfigurationPanel } from './esphome/ESPHomeConfigurationPanel';
import { useResourcesServiceGetOneResourceById } from '@attraccess/react-query-client';
import { useToastMessage } from '../../../components/toastProvider';
import { ErrorDisplay } from '../../../components/errorDisplay/ErrorDisplay';
import { useAuth } from '../../../hooks/useAuth';

import * as en from './iotSettings.en.json';
import * as de from './iotSettings.de.json';

export function IoTSettings() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '', 10);
  const { hasPermission } = useAuth();
  const canManageResources = hasPermission('canManageResources');

  const { t } = useTranslations('iotSettings', { en, de });
  const toast = useToastMessage();

  const { data: resource, isLoading, error, refetch } = useResourcesServiceGetOneResourceById({ id: resourceId });

  const [selectedTab, setSelectedTab] = useState('mqtt');

  // Show loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            <h1 className="text-xl font-semibold">{t('title')}</h1>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" color="primary" />
            <span className="ml-4">{t('loading')}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            <h1 className="text-xl font-semibold">{t('title')}</h1>
          </div>
        </CardHeader>
        <CardBody>
          <ErrorDisplay error={error} onRetry={() => refetch()} message={t('error.description')} />
        </CardBody>
      </Card>
    );
  }

  // Show not found state
  if (!resource) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            <h1 className="text-xl font-semibold">{t('title')}</h1>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg">{t('notFound')}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Check permissions
  if (!canManageResources) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            <h1 className="text-xl font-semibold">{t('title')}</h1>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg text-warning">{t('noPermission')}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          <h1 className="text-xl font-semibold">{t('title', { resourceName: resource.name })}</h1>
        </div>
      </CardHeader>
      <CardBody>
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          variant="underlined"
          data-cy="iot-settings-tabs"
        >
          <Tab
            key="mqtt"
            title={
              <span className="flex items-center gap-2">
                <WifiIcon className="w-4 h-4" />
                {t('tabs.mqtt')}
              </span>
            }
            data-cy="iot-settings-mqtt-tab"
          >
            <MqttConfigTabs resourceId={resourceId} />
          </Tab>
          <Tab
            key="webhooks"
            title={
              <span className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                {t('tabs.webhooks')}
              </span>
            }
            data-cy="iot-settings-webhooks-tab"
          >
            <WebhookConfigTabs resourceId={resourceId} />
          </Tab>
          <Tab
            key="esphome"
            title={
              <span className="flex items-center gap-2">
                <DatabaseIcon className="w-4 h-4" />
                {t('tabs.esphome')}
              </span>
            }
            data-cy="iot-settings-esphome-tab"
          >
            <ESPHomeConfigurationPanel resourceId={resourceId} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

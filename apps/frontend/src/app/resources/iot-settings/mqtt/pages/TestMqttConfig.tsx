import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { Button, Card, Alert, Spinner } from '@heroui/react';
import {
  useMqttServiceMqttResourceConfigGetOne,
  useMqttServiceMqttResourceConfigTestOne,
} from '@attraccess/react-query-client';
import en from '../translations/configTest.en.json';
import de from '../translations/configTest.de.json';

export function TestMqttConfig() {
  const { resourceId, configId } = useParams<{ resourceId: string; configId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslations('mqttConfigTest', { en, de });
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const parsedResourceId = parseInt(resourceId || '0', 10);
  const parsedConfigId = parseInt(configId || '0', 10);
  const isValidParams = !!resourceId && !!configId;

  // Fetch the configuration details
  const { data: configData, isLoading: isLoadingConfig } = useMqttServiceMqttResourceConfigGetOne(
    {
      resourceId: parsedResourceId,
      configId: parsedConfigId,
    },
    undefined,
    {
      enabled: isValidParams,
    }
  );

  // Test mutation
  const testConfig = useMqttServiceMqttResourceConfigTestOne();

  const handleTest = async () => {
    if (!isValidParams) return;

    setTestStatus('loading');
    try {
      const result = await testConfig.mutateAsync({
        resourceId: parsedResourceId,
        configId: parsedConfigId,
      });

      setTestStatus(result.success ? 'success' : 'error');
      setTestMessage(result.message);
    } catch (err) {
      setTestStatus('error');
      setTestMessage(t('testError'));
      console.error('Error testing MQTT configuration:', err);
    }
  };

  const handleBack = () => {
    navigate(`/resources/${resourceId}/iot`);
  };

  if (!isValidParams) {
    return <div>Resource ID and Configuration ID are required</div>;
  }

  if (isLoadingConfig) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('title')}</h2>
        </div>

        <Card className="mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('configDetails')}</h3>

            {configData && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{t('name')}</h4>
                  <p>{configData.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">{t('inUseTopic')}</h4>
                    <p className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{configData.inUseTopic}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">{t('notInUseTopic')}</h4>
                    <p className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{configData.notInUseTopic}</p>
                  </div>
                </div>
              </div>
            )}

            {testStatus !== 'idle' && (
              <div className="mt-6">
                {testStatus === 'loading' ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    <span>{t('testing')}</span>
                  </div>
                ) : (
                  <Alert color={testStatus === 'success' ? 'success' : 'danger'}>
                    <p>{testMessage}</p>
                  </Alert>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button color="secondary" onPress={handleBack} data-cy="mqtt-test-config-back-button">
                {t('backButton')}
              </Button>
              <Button
                color="primary"
                onPress={handleTest}
                disabled={testStatus === 'loading' || isLoadingConfig}
                data-cy="mqtt-test-config-test-button"
              >
                {t('testButton')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

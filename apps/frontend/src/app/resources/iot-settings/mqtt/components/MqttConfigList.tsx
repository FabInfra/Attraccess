import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { Accordion, AccordionItem, Alert, Button, Skeleton } from '@heroui/react';
import {
  useMqttServiceMqttResourceConfigGetAll,
  useMqttServiceMqttResourceConfigDeleteOne,
  useResourcesServiceGetOneResourceById,
} from '@fabaccess/react-query-client';
import { useNavigate } from 'react-router-dom';
import { useToastMessage } from '../../../../../components/toastProvider';
import en from '../translations/configList.en.json';
import de from '../translations/configList.de.json';
import { useCallback } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';

interface MqttConfigListProps {
  resourceId: number;
}

export function MqttConfigList({ resourceId }: MqttConfigListProps) {
  const { t } = useTranslations('mqttConfigList', { en, de });
  const navigate = useNavigate();
  const { success, error: showError } = useToastMessage();

  const { user } = useAuth();

  const { data: resource } = useResourcesServiceGetOneResourceById({ id: resourceId });

  const {
    data: mqttConfigs = [],
    isLoading,
    refetch,
  } = useMqttServiceMqttResourceConfigGetAll({
    resourceId,
  });

  const deleteConfig = useMqttServiceMqttResourceConfigDeleteOne({
    onSuccess: () => {
      success({
        title: t('deleteSuccess'),
        description: t('deleteSuccessDetail'),
      });
      refetch();
    },
    onError: (err) => {
      showError({
        title: t('deleteError'),
        description: t('deleteErrorDetail'),
      });
      console.error('Failed to delete MQTT configuration:', err);
    },
  });

  const handleEdit = (configId: number) => {
    navigate(`/resources/${resourceId}/iot/mqtt/${configId}`);
  };

  const handleDelete = async (configId: number) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteConfig.mutate({
        resourceId,
        configId,
      });
    }
  };

  const handleTest = (configId: number) => {
    navigate(`/resources/${resourceId}/iot/mqtt/test/${configId}`);
  };

  const parseTemplate = useCallback(
    (json: string) => {
      // escape double brackets before parsing
      const templatePattern = new RegExp('{{.*?}}', 'g');

      const placeholders = {
        id: resourceId,
        name: resource?.name ?? '--name of the resource--',
        'user.username': user?.username ?? '--username of the user--',
        'user.id': user?.id ?? 0,
        'user.externalIdentifier': user?.externalIdentifier ?? '--external identifier--',
        timestamp: new Date().toISOString(),
      };

      const escaped = json.replace(templatePattern, (match) => {
        const key = match.slice(2, -2);
        return String(placeholders[key as keyof typeof placeholders] ?? match);
      });

      try {
        return JSON.stringify(JSON.parse(escaped), null, 2);
      } catch (error) {
        console.error('Failed to format JSON:', error);
        return escaped;
      }
    },
    [resource, resourceId, user]
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    );
  }

  if (mqttConfigs.length === 0) {
    return (
      <Alert color="warning">
        <p>{t('noConfigs')}</p>
        <p className="text-sm">{t('noConfigsDetail')}</p>
      </Alert>
    );
  }

  return (
    <Accordion className="flex flex-col gap-2">
      {mqttConfigs.map((config) => (
        <AccordionItem
          key={`mqtt-config-${config.id}`}
          aria-label={`MQTT Configuration: ${config.name}`}
          data-cy={`mqtt-config-item-${config.id}`}
          title={
            <div className="flex justify-between items-center w-full gap-2">
              <span className="font-medium">{config.name}</span>
              <span className="text-sm text-gray-500">Server ID: {config.serverId}</span>
            </div>
          }
        >
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">{t('inUseSettings')}</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p>
                    <strong>{t('topic')}:</strong> {parseTemplate(config.inUseTopic)}
                  </p>
                  <p className="mt-2">
                    <strong>{t('message')}:</strong>
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1 text-xs overflow-auto">
                    {parseTemplate(config.inUseMessage)}
                  </pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('notInUseSettings')}</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p>
                    <strong>{t('topic')}:</strong> {parseTemplate(config.notInUseTopic)}
                  </p>
                  <p className="mt-2">
                    <strong>{t('message')}:</strong>
                  </p>
                  <pre className="bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1 text-xs overflow-auto">
                    {parseTemplate(config.notInUseMessage)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                color="secondary"
                size="sm"
                onPress={() => handleTest(config.id)}
                data-cy={`mqtt-config-item-test-button-${config.id}`}
              >
                {t('testButton')}
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => handleEdit(config.id)}
                data-cy={`mqtt-config-item-edit-button-${config.id}`}
              >
                {t('editButton')}
              </Button>
              <Button
                color="danger"
                size="sm"
                onPress={() => handleDelete(config.id)}
                disabled={deleteConfig.isPending}
                data-cy={`mqtt-config-item-delete-button-${config.id}`}
              >
                {deleteConfig.isPending ? t('deletingButton') : t('deleteButton')}
              </Button>
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Textarea,
  Switch,
} from '@heroui/react';
import {
  useMqttResourceConfigurationServiceCreateMqttConfiguration,
  useMqttResourceConfigurationServiceUpdateMqttConfiguration,
  useMqttResourceConfigurationServiceGetOneMqttConfiguration,
  useMqttServersServiceGetAllMqttServers,
  UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn,
  UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn,
} from '@attraccess/react-query-client';
import { useNavigate } from 'react-router-dom';
import { useToastMessage } from '../../../../../components/toastProvider';
import en from '../translations/configForm.en.json';
import de from '../translations/configForm.de.json';
import { Select } from '../../../../../components/select';
import { CreateMqttServerForm } from '../../../../mqtt/servers/CreateMqttServerPage';
import { useQueryClient } from '@tanstack/react-query';

// Default templates
const defaultTemplates = {
  inUse: {
    topic: 'resources/{{id}}/status',
    message:
      '{"status": "in-use", "resourceId": {{id}}, "resourceName": "{{name}}", "timestamp": "{{timestamp}}", "user": "{{user.username}}"}',
  },
  notInUse: {
    topic: 'resources/{{id}}/status',
    message:
      '{"status": "available", "resourceId": {{id}}, "resourceName": "{{name}}", "timestamp": "{{timestamp}}", "user": "{{user.username}}"}',
  },
};

interface MqttConfigFormValues {
  name: string;
  serverId: number;
  sendOnStart: boolean; // Added
  sendOnStop: boolean; // Added
  sendOnTakeover: boolean; // Added
  inUseTopic: string;
  inUseMessage: string;
  notInUseTopic: string;
  notInUseMessage: string;
  takeoverTopic: string; // Added
  takeoverMessage: string; // Added
}

const initialFormValues: MqttConfigFormValues = {
  name: '',
  serverId: 0,
  sendOnStart: true,
  sendOnStop: true,
  sendOnTakeover: false,
  inUseTopic: defaultTemplates.inUse.topic,
  inUseMessage: defaultTemplates.inUse.message,
  notInUseTopic: defaultTemplates.notInUse.topic,
  notInUseMessage: defaultTemplates.notInUse.message,
  takeoverTopic: 'resources/{{id}}/status',
  takeoverMessage: '{"status": "taken_over", "resourceId": {{id}}, "resourceName": "{{name}}", "timestamp": "{{timestamp}}", "newUser": "{{user.username}}", "previousUser": "{{previousUser.username}}"}',
};

interface MqttConfigFormProps {
  resourceId: number;
  configId?: number;
  isEdit?: boolean;
}

function TemplateVariablesHelp() {
  const { t } = useTranslations('mqtt-template-variables-help', { de, en });

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-6">
      <h3 className="font-semibold mb-2">{t('availableVariables')}</h3>
      <p className="text-sm mb-3">{t('variablesDescription')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm mb-1">{t('resourceVariables')}</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{id}}'}</code> - {t('resourceIdDesc')}
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{name}}'}</code> - {t('resourceNameDesc')}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm mb-1">{t('userVariables')}</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{user.username}}'}</code> -{' '}
              {t('userUsernameDesc')}
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{user.id}}'}</code> - {t('userIdDesc')}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm mb-1">{t('previousUserVariables')}</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{previousUser.username}}'}</code> - {t('previousUserUsernameDesc')}
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{previousUser.id}}'}</code> - {t('previousUserIdDesc')}
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm mb-1">{t('timeVariables')}</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{{timestamp}}'}</code> -{' '}
              {t('timestampDesc')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MqttConfigForm({ resourceId, configId, isEdit = false }: MqttConfigFormProps) {
  const { t } = useTranslations('mqttConfigForm', { en, de });
  const navigate = useNavigate();
  const { success, error: showError } = useToastMessage();

  const [formValues, setFormValues] = useState<MqttConfigFormValues>(initialFormValues);

  // Fetch MQTT servers for the dropdown
  const { data: mqttServers = [] } = useMqttServersServiceGetAllMqttServers();

  // Fetch existing config if in edit mode
  const { isLoading: isLoadingConfig, data: existingConfig } =
    useMqttResourceConfigurationServiceGetOneMqttConfiguration(
      {
        resourceId,
        configId: configId || 0,
      },
      undefined
    );

  useEffect(() => {
    if (existingConfig) {
      setFormValues({
        name: existingConfig.name,
        serverId: existingConfig.serverId,
        sendOnStart: existingConfig.sendOnStart === undefined ? true : existingConfig.sendOnStart,
        sendOnStop: existingConfig.sendOnStop === undefined ? true : existingConfig.sendOnStop,
        sendOnTakeover: existingConfig.sendOnTakeover === undefined ? false : existingConfig.sendOnTakeover,
        inUseTopic: existingConfig.inUseTopic,
        inUseMessage: existingConfig.inUseMessage,
        notInUseTopic: existingConfig.notInUseTopic,
        notInUseMessage: existingConfig.notInUseMessage,
        takeoverTopic: existingConfig.takeoverTopic || initialFormValues.takeoverTopic,
        takeoverMessage: existingConfig.takeoverMessage || initialFormValues.takeoverMessage,
      });
    }
  }, [existingConfig]);

  const queryClient = useQueryClient();

  // Mutations for creating and updating
  const createConfig = useMqttResourceConfigurationServiceCreateMqttConfiguration({
    onSuccess: (config) => {
      queryClient.invalidateQueries({
        queryKey: UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn({ resourceId }),
      });

      queryClient.invalidateQueries({
        queryKey: UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ resourceId, configId: config.id }),
      });

      success({
        title: t('createSuccess'),
        description: t('createSuccessDetail'),
      });

      navigate(`/resources/${resourceId}/iot`);
    },
    onError: (err) => {
      showError({
        title: t('createError'),
        description: t('createErrorDetail'),
      });
      console.error('Failed to save MQTT configuration:', err);
    },
  });
  const updateConfig = useMqttResourceConfigurationServiceUpdateMqttConfiguration({
    onSuccess: (config) => {
      queryClient.invalidateQueries({
        queryKey: UseMqttResourceConfigurationServiceGetAllMqttConfigurationsKeyFn({ resourceId }),
      });

      queryClient.invalidateQueries({
        queryKey: UseMqttResourceConfigurationServiceGetOneMqttConfigurationKeyFn({ resourceId, configId: config.id }),
      });

      success({
        title: t('updateSuccess'),
        description: t('updateSuccessDetail'),
      });

      navigate(`/resources/${resourceId}/iot`);
    },
    onError: (err) => {
      showError({
        title: t('updateError'),
        description: t('updateErrorDetail'),
      });
      console.error('Failed to save MQTT configuration:', err);
    },
  });

  const handleInputChange = useCallback(
    (e: {
      target: Pick<
        React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>['target'],
        'name' | 'value'
      >;
    }) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: name === 'serverId' ? parseInt(value, 10) : value,
      }));
    },
    [setFormValues]
  );

  const handleSwitchChange = useCallback(
    (name: string, checked: boolean) => {
      setFormValues((prev) => ({
        ...prev,
        [name]: checked,
      }));
    },
    [setFormValues]
  );

  const [showCreateServerModal, setShowCreateServerModal] = useState(false);

  const handleCancel = useCallback(() => {
    navigate(`/resources/${resourceId}/iot`);
  }, [navigate, resourceId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isEdit && configId) {
        // Update existing config
        updateConfig.mutate({
          resourceId,
          configId,
          requestBody: formValues,
        });
      } else {
        // Create new config
        createConfig.mutate({
          resourceId,
          requestBody: formValues,
        });
      }
    },
    [createConfig, formValues, isEdit, configId, resourceId, updateConfig]
  );

  if (isEdit && isLoadingConfig) {
    return (
      <div className="text-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{isEdit ? t('editTitle') : t('createTitle')}</h2>
      </div>

      <Modal isOpen={showCreateServerModal} onClose={() => setShowCreateServerModal(false)}>
        <ModalContent>
          <ModalHeader>{t('createServer')}</ModalHeader>
          <ModalBody>
            <CreateMqttServerForm
              onCancel={() => setShowCreateServerModal(false)}
              onSuccess={(server) => {
                handleInputChange({ target: { name: 'serverId', value: server.id.toString() } });
                setShowCreateServerModal(false);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Form onSubmit={handleSubmit}>
        <Card fullWidth>
          <CardHeader>{t('basicSettings')}</CardHeader>

          <CardBody>
            <Input
              label={t('nameLabel')}
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder={t('namePlaceholder')}
              className="mb-4"
              required
            />

            <div className="flex justify-between items-center flex-wrap">
              {(mqttServers ?? []).length > 0 && (
                <Select
                  label={t('serverLabel')}
                  id="serverId"
                  name="serverId"
                  selectedKey={formValues.serverId.toString()}
                  onSelectionChange={(serverId) => handleInputChange({ target: { name: 'serverId', value: serverId } })}
                  items={mqttServers.map((server) => ({
                    key: server.id.toString(),
                    label: server.name,
                  }))}
                />
              )}

              <Button
                color="secondary"
                variant={(mqttServers ?? []).length > 0 ? 'light' : 'solid'}
                onPress={() => setShowCreateServerModal(true)}
              >
                {t('createServer')}
              </Button>
            </div>

            {/* Event Triggers */}
            <div className="mt-4 space-y-2 pt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('eventTriggersLabel')}</p>
              <Switch
                name="sendOnStart"
                isSelected={formValues.sendOnStart}
                onValueChange={(isSelected) => handleSwitchChange('sendOnStart', isSelected)}
              >
                {t('sendOnStartLabel')}
              </Switch>
              <Switch
                name="sendOnStop"
                isSelected={formValues.sendOnStop}
                onValueChange={(isSelected) => handleSwitchChange('sendOnStop', isSelected)}
              >
                {t('sendOnStopLabel')}
              </Switch>
              <Switch
                name="sendOnTakeover"
                isSelected={formValues.sendOnTakeover}
                onValueChange={(isSelected) => handleSwitchChange('sendOnTakeover', isSelected)}
              >
                {t('sendOnTakeoverLabel')}
              </Switch>
            </div>
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardHeader>{t('inUseSettings')}</CardHeader>

          <CardBody>
            <Input
              label={t('topicLabel')}
              id="inUseTopic"
              name="inUseTopic"
              value={formValues.inUseTopic}
              onChange={handleInputChange}
              placeholder={t('topicPlaceholder')}
              className="mb-4"
              required
            />

            <Textarea
              label={t('messageLabel')}
              id="inUseMessage"
              name="inUseMessage"
              value={formValues.inUseMessage}
              onChange={handleInputChange}
              placeholder={t('messagePlaceholder')}
              rows={5}
              required
            />
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardHeader>{t('notInUseSettings')}</CardHeader>

          <CardBody>
            <Input
              label={t('topicLabel')}
              id="notInUseTopic"
              name="notInUseTopic"
              value={formValues.notInUseTopic}
              onChange={handleInputChange}
              placeholder={t('topicPlaceholder')}
              className="mb-4"
              required
            />

            <Textarea
              label={t('messageLabel')}
              id="notInUseMessage"
              name="notInUseMessage"
              value={formValues.notInUseMessage}
              onChange={handleInputChange}
              placeholder={t('messagePlaceholder')}
              rows={5}
              required
            />
          </CardBody>
        </Card>

        <Card fullWidth>
          <CardHeader>{t('takeoverSettings')}</CardHeader>
          <CardBody>
            <Input
              label={t('topicLabel')}
              id="takeoverTopic"
              name="takeoverTopic"
              value={formValues.takeoverTopic}
              onChange={handleInputChange}
              placeholder={t('topicPlaceholder')}
              className="mb-4"
            />
            <Textarea
              label={t('messageLabel')}
              id="takeoverMessage"
              name="takeoverMessage"
              value={formValues.takeoverMessage}
              onChange={handleInputChange}
              placeholder={t('messagePlaceholder')}
              rows={5}
            />
          </CardBody>
        </Card>

        <TemplateVariablesHelp />

        <div className="flex justify-end gap-2 mb-4 w-full">
          <Button color="secondary" onPress={handleCancel}>
            {t('cancelButton')}
          </Button>
          <Button
            type="submit"
            color="primary"
            isDisabled={createConfig.isPending || updateConfig.isPending || formValues.serverId === 0}
          >
            {isEdit ? t('updateButton') : t('createButton')}
          </Button>
        </div>
      </Form>
    </>
  );
}

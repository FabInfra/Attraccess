import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/react';
import { PageHeader } from '../../../components/pageHeader';
import { MqttConfigurationPanel } from './mqtt/MqttConfigurationPanel';
import { WebhookConfigurationPanel } from './webhooks/WebhookConfigurationPanel';
import { ESPHomeConfigurationPanel } from './esphome/ESPHomeConfigurationPanel';
import { useResourcesServiceGetOneResourceById } from '@attraccess/react-query-client';

export function IoTSettings() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '', 10);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const {
    data: resource,
    isLoading: isLoadingResource,
    error: resourceError,
  } = useResourcesServiceGetOneResourceById({ id: resourceId });

  const canManageResources = hasPermission('canManageResources');

  // If user doesn't have permission, redirect to resource details
  if (!canManageResources) {
    navigate(`/resources/${resourceId}`);
    return null;
  }

  if (isLoadingResource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (resourceError || !resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
        <p className="text-gray-500 mb-4">
          The requested resource could not be found or you don't have permission to view it.
        </p>
        <Button
          onPress={() => navigate('/resources')}
          variant="light"
          startContent={<ArrowLeft className="w-4 h-4" />}
          data-cy="iot-settings-back-to-resources-button"
        >
          Back to Resources
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <PageHeader
        title={`${resource.name} - IoT Settings`}
        subtitle="Configure IoT integrations for this resource"
        backTo={`/resources/${resourceId}`}
      />

      <div className="space-y-8">
        <ESPHomeConfigurationPanel resourceId={resourceId} />
        <MqttConfigurationPanel resourceId={resourceId} />
        <WebhookConfigurationPanel resourceId={resourceId} />
      </div>
    </div>
  );
}

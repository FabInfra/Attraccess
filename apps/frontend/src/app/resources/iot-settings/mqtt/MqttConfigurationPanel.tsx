import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import de from './de.json';
import en from './en.json';
import { Button, Card, CardHeader } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { MqttConfigList } from './components/MqttConfigList';

interface MqttConfigurationPanelProps {
  resourceId: number;
}

export function MqttConfigurationPanel(props: MqttConfigurationPanelProps) {
  const { resourceId } = props;
  const { t } = useTranslations('mqtt', { en, de });
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate(`/resources/${resourceId}/iot/mqtt/create`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <h2>{t('configurationTitle')}</h2>
          <Button color="primary" onPress={handleCreateNew} data-cy="mqtt-config-panel-create-new-button">
            {t('createNewButton')}
          </Button>
        </div>
      </CardHeader>
      <div style={{ padding: '1rem' }}>
        <MqttConfigList resourceId={resourceId} />
      </div>
    </Card>
  );
}

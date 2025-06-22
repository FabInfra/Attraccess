import React from 'react';
import { Button, Alert } from '@heroui/react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  error: Error | unknown;
  onRetry?: () => void;
  message?: string;
  retryLabel?: string;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, message, retryLabel, className = '' }) => {
  const { t } = useTranslation('common');

  const getErrorMessage = () => {
    if (message) return message;
    if (error instanceof Error) return error.message;
    return t('error.general');
  };

  const getRetryLabel = () => {
    if (retryLabel) return retryLabel;
    return t('error.retry');
  };

  return (
    <Alert
      color="danger"
      title={t('error.title')}
      description={getErrorMessage()}
      startContent={<AlertTriangle className="w-5 h-5" />}
      endContent={
        onRetry && (
          <Button
            color="danger"
            variant="flat"
            size="sm"
            startContent={<RefreshCw className="w-4 h-4" />}
            onPress={onRetry}
          >
            {getRetryLabel()}
          </Button>
        )
      }
      className={className}
    />
  );
};

export default ErrorDisplay;

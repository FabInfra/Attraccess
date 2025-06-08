import { useState, useCallback } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './translations/en.json';
import * as de from './translations/de.json';

interface SessionExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (additionalMinutes: number) => void;
  isSubmitting?: boolean;
  maxSessionTimeMinutes?: number | null;
  currentEstimatedDuration?: number | null;
}

const EXTENSION_OPTIONS = [60, 120, 240, 360, 720, 1440]; // +1h, +2h, +4h, +6h, +12h, +24h

export function SessionExtensionModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  maxSessionTimeMinutes,
  currentEstimatedDuration,
}: Readonly<SessionExtensionModalProps>) {
  const { t } = useTranslations('sessionExtensionModal', { en, de });
  const [selectedExtension, setSelectedExtension] = useState<number>(60);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedExtension);
  }, [selectedExtension, onConfirm]);

  const handleClose = useCallback(() => {
    setSelectedExtension(60);
    onClose();
  }, [onClose]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return t('duration.minutes', { minutes });
    } else if (remainingMinutes === 0) {
      return t('duration.hours', { hours });
    } else {
      return t('duration.hoursAndMinutes', { hours, minutes: remainingMinutes });
    }
  };

  const getAvailableOptions = () => {
    if (!maxSessionTimeMinutes || !currentEstimatedDuration) {
      return EXTENSION_OPTIONS;
    }

    return EXTENSION_OPTIONS.filter(
      (option) => currentEstimatedDuration + option <= maxSessionTimeMinutes
    );
  };

  const availableOptions = getAvailableOptions();
  const newTotalDuration = (currentEstimatedDuration || 0) + selectedExtension;
  const isValidExtension = !maxSessionTimeMinutes || newTotalDuration <= maxSessionTimeMinutes;

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} data-cy="session-extension-modal">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t('title')}</ModalHeader>

            <ModalBody className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">{t('description')}</p>
                {currentEstimatedDuration && (
                  <p className="text-sm text-default-500 mb-4">
                    {t('currentDuration', { duration: formatDuration(currentEstimatedDuration) })}
                  </p>
                )}
                {maxSessionTimeMinutes && (
                  <p className="text-sm text-warning mb-4">
                    {t('maxTimeWarning', { maxTime: formatDuration(maxSessionTimeMinutes) })}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">{t('selectExtension')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableOptions.map((minutes) => (
                    <Button
                      key={minutes}
                      variant={selectedExtension === minutes ? 'solid' : 'bordered'}
                      color={selectedExtension === minutes ? 'primary' : 'default'}
                      onPress={() => setSelectedExtension(minutes)}
                      className="h-12"
                      data-cy={`extension-option-${minutes}`}
                    >
                      +{formatDuration(minutes)}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedExtension > 0 && (
                <div className="p-3 bg-default-100 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">{t('newTotalDuration')}: </span>
                    {formatDuration(newTotalDuration)}
                  </p>
                </div>
              )}

              {availableOptions.length === 0 && (
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm text-warning-700">{t('noExtensionsAvailable')}</p>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
              <Button
                variant="bordered"
                className="w-full sm:w-auto min-w-full sm:min-w-fit"
                onPress={onClose}
                data-cy="session-extension-cancel-button"
              >
                {t('buttons.cancel')}
              </Button>
              <Button
                color="primary"
                className="w-full sm:w-auto min-w-full sm:min-w-fit"
                onPress={handleConfirm}
                isLoading={isSubmitting}
                isDisabled={!isValidExtension || availableOptions.length === 0}
                data-cy="session-extension-confirm-button"
              >
                {t('buttons.extendSession')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
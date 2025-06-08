import { useState, useCallback } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Textarea,
} from '@heroui/react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import * as en from './translations/en.json';
import * as de from './translations/de.json';

interface DurationEstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string, estimatedDurationMinutes: number) => void;
  isSubmitting?: boolean;
  maxSessionTimeMinutes?: number | null;
}

export function DurationEstimationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  maxSessionTimeMinutes,
}: Readonly<DurationEstimationModalProps>) {
  const { t } = useTranslations('durationEstimationModal', { en, de });
  const [notes, setNotes] = useState('');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState<number>(60);

  const handleConfirm = useCallback(() => {
    onConfirm(notes, estimatedDurationMinutes);
  }, [notes, estimatedDurationMinutes, onConfirm]);

  const handleClose = useCallback(() => {
    setNotes('');
    setEstimatedDurationMinutes(60);
    onClose();
  }, [onClose]);

  const isValidDuration = !maxSessionTimeMinutes || estimatedDurationMinutes <= maxSessionTimeMinutes;

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} data-cy="duration-estimation-modal">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t('title')}</ModalHeader>

            <ModalBody className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">{t('description')}</p>
                {maxSessionTimeMinutes && (
                  <p className="text-sm text-warning mb-4">
                    {t('maxTimeWarning', { maxTime: maxSessionTimeMinutes })}
                  </p>
                )}
              </div>

              <Input
                type="number"
                label={t('inputs.estimatedDuration.label')}
                placeholder={t('inputs.estimatedDuration.placeholder')}
                value={estimatedDurationMinutes.toString()}
                onChange={(e) => setEstimatedDurationMinutes(parseInt(e.target.value, 10) || 0)}
                min={1}
                max={maxSessionTimeMinutes || undefined}
                isInvalid={!isValidDuration}
                errorMessage={!isValidDuration ? t('inputs.estimatedDuration.error') : undefined}
                data-cy="duration-estimation-input"
              />

              <Textarea
                label={t('inputs.notes.label')}
                placeholder={t('inputs.notes.placeholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-cy="session-notes-input"
              />
            </ModalBody>

            <ModalFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
              <Button
                variant="bordered"
                className="w-full sm:w-auto min-w-full sm:min-w-fit"
                onPress={onClose}
                data-cy="duration-estimation-cancel-button"
              >
                {t('buttons.cancel')}
              </Button>
              <Button
                color="primary"
                className="w-full sm:w-auto min-w-full sm:min-w-fit"
                onPress={handleConfirm}
                isLoading={isSubmitting}
                isDisabled={!isValidDuration || estimatedDurationMinutes <= 0}
                data-cy="duration-estimation-confirm-button"
              >
                {t('buttons.startSession')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
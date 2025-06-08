import { useState, useCallback } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { StopCircle, ChevronDownIcon, Clock } from 'lucide-react';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { useToastMessage } from '../../../../../components/toastProvider';
import { SessionTimer } from '../SessionTimer';
import { SessionNotesModal, SessionModalMode } from '../SessionNotesModal';
import { SessionExtensionModal } from '../SessionExtensionModal';
import {
  useResourcesServiceResourceUsageEndSession,
  useResourcesServiceResourceUsageExtendSession,
  UseResourcesServiceResourceUsageGetActiveSessionKeyFn,
  UseResourcesServiceResourceUsageGetHistoryKeyFn,
  Resource,
  ResourceUsage,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';
import * as en from './translations/en.json';
import * as de from './translations/de.json';

interface ActiveSessionDisplayProps {
  resourceId: number;
  startTime: string;
  resource: Resource;
  activeSession: ResourceUsage;
}

export function ActiveSessionDisplay({ resourceId, startTime, resource, activeSession }: ActiveSessionDisplayProps) {
  const { t } = useTranslations('activeSessionDisplay', { en, de });
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  const endSession = useResourcesServiceResourceUsageEndSession({
    onSuccess: () => {
      setIsNotesModalOpen(false);

      // Invalidate all history queries for this resource (regardless of pagination/user filters)
      queryClient.invalidateQueries({
        predicate: (query) => {
          const baseHistoryKey = UseResourcesServiceResourceUsageGetHistoryKeyFn({ resourceId });
          return (
            query.queryKey[0] === baseHistoryKey[0] &&
            query.queryKey.length > 1 &&
            JSON.stringify(query.queryKey[1]).includes(`"resourceId":${resourceId}`)
          );
        },
      });
      // Reset active session query instead of just invalidating
      queryClient.resetQueries({
        queryKey: UseResourcesServiceResourceUsageGetActiveSessionKeyFn({ resourceId }),
      });
      success({
        title: t('sessionEnded'),
        description: t('sessionEndedDescription'),
      });
    },
    onError: (err) => {
      console.error('Error ending session:', err);
      showError({
        title: t('sessionEndError'),
        description: t('sessionEndErrorDescription'),
      });
    },
  });

  const extendSession = useResourcesServiceResourceUsageExtendSession({
    onSuccess: () => {
      setIsExtensionModalOpen(false);
      
      // Invalidate the active session query to refetch data
      queryClient.invalidateQueries({
        queryKey: UseResourcesServiceResourceUsageGetActiveSessionKeyFn({ resourceId }),
      });
      success({
        title: t('sessionExtended'),
        description: t('sessionExtendedDescription'),
      });
    },
    onError: (err) => {
      console.error('Error extending session:', err);
      showError({
        title: t('sessionExtendError'),
        description: t('sessionExtendErrorDescription'),
      });
    },
  });

  const immediatelyEndSession = useCallback(() => {
    endSession.mutate({
      resourceId,
      requestBody: {},
    });
  }, [endSession, resourceId]);

  const handleEndSession = async (notes: string) => {
    endSession.mutate({
      resourceId,
      requestBody: { notes },
    });
  };

  const handleOpenEndSessionModal = () => {
    setIsNotesModalOpen(true);
  };

  const handleExtendSession = (additionalMinutes: number) => {
    extendSession.mutate({
      resourceId,
      requestBody: { additionalMinutes: additionalMinutes as 60 | 120 | 240 | 360 | 720 | 1440 },
    });
  };

  const handleOpenExtensionModal = () => {
    setIsExtensionModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <SessionTimer startTime={startTime} />

        {/* Session Duration Information */}
        {activeSession.estimatedDurationMinutes && (
          <div className="p-3 bg-default-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-default-500" />
                <span className="text-sm text-default-700">
                  {t('estimatedDuration')}: {Math.floor(activeSession.estimatedDurationMinutes / 60)}h {activeSession.estimatedDurationMinutes % 60}m
                </span>
              </div>
              <Button
                size="sm"
                variant="bordered"
                startContent={<Clock className="w-3 h-3" />}
                onPress={handleOpenExtensionModal}
                isLoading={extendSession.isPending}
              >
                {t('extendSession')}
              </Button>
            </div>
          </div>
        )}

        <ButtonGroup fullWidth color="danger">
          <Button
            isLoading={endSession.isPending}
            startContent={<StopCircle className="w-4 h-4" />}
            onPress={immediatelyEndSession}
          >
            {t('endSession')}
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly>
                <ChevronDownIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu disallowEmptySelection aria-label={t('alternativeEndSessionOptionsMenu.label')}>
              <DropdownItem
                key="endWithNotes"
                description={t('alternativeEndSessionOptionsMenu.endWithNotes.description')}
                onPress={handleOpenEndSessionModal}
              >
                {t('alternativeEndSessionOptionsMenu.endWithNotes.label')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ButtonGroup>
      </div>

      <SessionNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onConfirm={handleEndSession}
        mode={SessionModalMode.END}
        isSubmitting={endSession.isPending}
      />

      <SessionExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        onConfirm={handleExtendSession}
        isSubmitting={extendSession.isPending}
        maxSessionTimeMinutes={resource.maxSessionTimeMinutes}
        currentEstimatedDuration={activeSession.estimatedDurationMinutes}
      />
    </>
  );
}

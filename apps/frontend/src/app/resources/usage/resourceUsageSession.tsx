import { useState, useEffect, useMemo } from 'react';
import { Button, Card, CardBody, CardHeader, Spinner, Divider, Alert } from '@heroui/react';
import { Play, StopCircle, Clock, Users } from 'lucide-react';
import { useToastMessage } from '../../../components/toastProvider';
import { useTranslations } from '../../../i18n';
import * as en from './translations/resourceUsageSession.en';
import * as de from './translations/resourceUsageSession.de';
import { SessionNotesModal, SessionModalMode } from './components/SessionNotesModal';
import { useAuth } from '../../../hooks/useAuth';
import { AttraccessUser } from '../../../components/AttraccessUser';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateTimeDisplay } from '@frontend/components/DateTimeDisplay';
import {
  useResourceIntroducersServiceGetAllResourceIntroducers,
  useResourceIntroductionsServiceCheckStatus,
  useResourceUsageServiceEndSession,
  useResourceUsageServiceGetActiveSession,
  useResourceUsageServiceStartSession,
  UseResourceUsageServiceGetActiveSessionKeyFn,
  UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';

interface ResourceUsageSessionProps {
  resourceId: number;
}

export function ResourceUsageSession({ resourceId }: ResourceUsageSessionProps) {
  const { t } = useTranslations('resourceUsageSession', { en, de });
  const { success, error: showError } = useToastMessage();
  const { hasPermission } = useAuth();
  const { user } = useAuth();
  const canManageResources = hasPermission('canManageResources');
  const queryClient = useQueryClient();

  // Check if user has completed the introduction
  const { data: hasCompletedIntroduction, isLoading: isLoadingIntroStatus } =
    useResourceIntroductionsServiceCheckStatus({ resourceId });

  // Get list of users who can give introductions
  const { data: introducers, isLoading: isLoadingIntroducers } = useResourceIntroducersServiceGetAllResourceIntroducers(
    { resourceId }
  );

  // Get active session
  const { data: activeSession, isLoading: isLoadingSession } = useResourceUsageServiceGetActiveSession({ resourceId });

  const startSession = useResourceUsageServiceStartSession({
    onSuccess: () => {
      // Invalidate the active session query to refetch data
      queryClient.invalidateQueries({
        queryKey: UseResourceUsageServiceGetActiveSessionKeyFn({ resourceId }),
      });
      // Invalidate the history query to refetch data
      queryClient.invalidateQueries({
        queryKey: UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn({ resourceId }),
      });
    },
  });
  const endSession = useResourceUsageServiceEndSession({
    onSuccess: () => {
      // Invalidate the history query to refetch data (using generated key function)
      queryClient.invalidateQueries({
        queryKey: UseResourceUsageServiceGetHistoryOfResourceUsageKeyFn({ resourceId }),
      });
      // Reset active session query instead of just invalidating
      queryClient.resetQueries({
        queryKey: UseResourceUsageServiceGetActiveSessionKeyFn({ resourceId }),
      });
      // Explicitly reset timer display on success
      setElapsedTime('00:00:00');
    },
  });

  // State to track elapsed time for display
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  // States for session notes modal
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesModalMode, setNotesModalMode] = useState<SessionModalMode>(SessionModalMode.START);

  // Update elapsed time every second when session is active
  useEffect(() => {
    if (!activeSession?.activeSession) {
      setElapsedTime('00:00:00');
      return;
    }

    const startTime = new Date(activeSession.activeSession.startTime).getTime();

    const updateElapsedTime = () => {
      const now = new Date().getTime();
      const elapsed = now - startTime;

      // Format elapsed time as HH:MM:SS
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
      );
    };

    // Update immediately and then every second
    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const handleOpenStartSessionModal = () => {
    setNotesModalMode(SessionModalMode.START);
    setIsNotesModalOpen(true);
  };

  const handleOpenEndSessionModal = () => {
    setNotesModalMode(SessionModalMode.END);
    setIsNotesModalOpen(true);
  };

  const handleStartSession = async (notes: string) => {
    try {
      await startSession.mutateAsync({
        resourceId,
        requestBody: { notes },
      });
      success({
        title: t('sessionStarted'),
        description: t('sessionStartedDescription'),
      });
      setIsNotesModalOpen(false);
    } catch (err) {
      showError({
        title: t('sessionStartError'),
        description: t('sessionStartErrorDescription'),
      });
      console.error('Failed to start session:', err);
    }
  };

  const handleEndSession = async (notes: string) => {
    try {
      await endSession.mutateAsync({
        resourceId,
        requestBody: { notes },
      });

      success({
        title: t('sessionEnded'),
        description: t('sessionEndedDescription'),
      });
      setIsNotesModalOpen(false);
    } catch (err) {
      console.error('Error ending session:', err);
      showError({
        title: t('sessionEndError'),
        description: t('sessionEndErrorDescription'),
      });
    }
  };

  const handleNotesSubmit = (notes: string) => {
    if (notesModalMode === SessionModalMode.START) {
      handleStartSession(notes);
    } else {
      handleEndSession(notes);
    }
  };

  const isLoading = isLoadingSession || isLoadingIntroStatus || isLoadingIntroducers;

  const isIntroducer = useMemo(() => {
    return introducers?.some((introducer) => introducer.user?.id === user?.id);
  }, [introducers, user]);

  // Users with canManageResources permission can always start a session
  const canStartSession = canManageResources || hasCompletedIntroduction || isIntroducer;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('usageSession')}: </h3>
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="md" color="primary" />
            </div>
          ) : activeSession?.activeSession ? (
            // Check if the active session belongs to the current user
            activeSession?.activeSession?.userId === user?.id ? (
              // Current user's active session: Show timer and End button
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sessionStarted')}:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <DateTimeDisplay date={activeSession.activeSession.startTime} />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('elapsedTime')}:</p>
                    <p className="font-medium text-xl text-gray-900 dark:text-white">{elapsedTime}</p>
                  </div>
                </div>
                <Button
                  color="danger"
                  variant="solid"
                  fullWidth
                  startContent={<StopCircle className="w-4 h-4" />}
                  onPress={handleOpenEndSessionModal}
                  isLoading={endSession.isPending}
                >
                  {t('endSession')}
                </Button>
              </div>
            ) : (
              // Active session belongs to another user: Show info message
              <div className="space-y-2 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('resourceInUseBy')}</p>
                {activeSession?.activeSession?.user ? (
                  <AttraccessUser user={activeSession?.activeSession?.user} />
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('unknownUser')} {/* Add a fallback translation if needed */}
                  </p>
                )}

                {/* Optional: Display start time for the other user's session */}
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ({t('sessionStarted')} <DateTimeDisplay date={activeSession?.activeSession?.startTime} />)
                </p>
              </div>
            )
          ) : !canStartSession ? (
            <div className="space-y-4">
              <Alert color="warning">{t('needsIntroduction')}</Alert>

              {introducers && introducers.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                    <Users className="w-4 h-4 mr-1" />
                    {t('availableIntroducers')}:
                  </p>
                  <Divider className="my-2" />
                  <div className="space-y-2 mt-2">
                    {introducers.map((introducer) => (
                      <AttraccessUser key={introducer.id} user={introducer.user} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">{t('noIntroducersAvailable')}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 dark:text-gray-400">{t('noActiveSession')}</p>
              <Button
                color="primary"
                variant="solid"
                fullWidth
                startContent={<Play className="w-4 h-4" />}
                onPress={handleOpenStartSessionModal}
                isLoading={startSession.isPending}
              >
                {t('startSession')}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Session Notes Modal */}
      <SessionNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onConfirm={handleNotesSubmit}
        mode={notesModalMode}
        isSubmitting={notesModalMode === SessionModalMode.START ? startSession.isPending : endSession.isPending}
      />
    </>
  );
}

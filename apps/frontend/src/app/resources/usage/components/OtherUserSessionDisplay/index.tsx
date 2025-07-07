import { useState, useCallback, useMemo } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { UserX, ChevronDownIcon } from 'lucide-react';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { FabAccessUser, DateTimeDisplay } from '@fabaccess/plugins-frontend-ui';
import {
  useResourcesServiceResourceUsageStartSession,
  UseResourcesServiceResourceUsageGetActiveSessionKeyFn,
  UseResourcesServiceResourceUsageGetHistoryKeyFn,
  useResourcesServiceResourceUsageGetActiveSession,
  useAccessControlServiceResourceIntroducersGetMany,
  useResourcesServiceResourceUsageCanControl,
  useResourcesServiceGetOneResourceById,
} from '@fabaccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks/useAuth';
import { useToastMessage } from '../../../../../components/toastProvider';
import { SessionNotesModal, SessionModalMode } from '../SessionNotesModal';
import * as en from './translations/en.json';
import * as de from './translations/de.json';

interface OtherUserSessionDisplayProps {
  resourceId: number;
}

export function OtherUserSessionDisplay({ resourceId }: OtherUserSessionDisplayProps) {
  const { t } = useTranslations('otherUserSessionDisplay', { en, de });
  const { hasPermission, user } = useAuth();
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  // Fetch resource data
  // const { data: resource } = useResourcesServiceGetOneResourceById({ id: resourceId });

  // Fetch active session data
  const { data: activeSessionResponse } = useResourcesServiceResourceUsageGetActiveSession({ resourceId });
  const activeSession = useMemo(() => activeSessionResponse?.usage, [activeSessionResponse]);

  const { data: access } = useResourcesServiceResourceUsageCanControl({ resourceId });

  // Get list of users who can give introductions
  const { data: introducers } = useAccessControlServiceResourceIntroducersGetMany({ resourceId });

  // Calculate permissions
  const canManageResources = hasPermission('canManageResources');
  const isIntroducer = useMemo(() => {
    return introducers?.some((introducer) => introducer.userId === user?.id);
  }, [introducers, user]);

  const { data: resource } = useResourcesServiceGetOneResourceById({ id: resourceId });

  const canStartSession = canManageResources || access?.canControl || isIntroducer;
  const canTakeover = resource?.allowTakeOver && canStartSession;

  const startSession = useResourcesServiceResourceUsageStartSession({
    onSuccess: () => {
      setIsNotesModalOpen(false);

      // Invalidate the active session query to refetch data
      queryClient.invalidateQueries({
        queryKey: UseResourcesServiceResourceUsageGetActiveSessionKeyFn({ resourceId }),
      });
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
      success({
        title: t('takeoverSuccessful'),
        description: t('takeoverSuccessfulDescription'),
      });
    },
    onError: (err) => {
      showError({
        title: t('takeoverError'),
        description: t('takeoverErrorDescription'),
      });
      console.error('Failed to takeover session:', err);
    },
  });

  const handleTakeoverWithNotes = async (notes: string) => {
    startSession.mutate({
      resourceId,
      requestBody: { notes, forceTakeOver: true },
    });
  };

  const handleImmediateTakeover = useCallback(() => {
    startSession.mutate({
      resourceId,
      requestBody: { forceTakeOver: true },
    });
  }, [startSession, resourceId]);

  const handleOpenTakeoverModal = () => {
    setIsNotesModalOpen(true);
  };

  // Early return if no active session or it belongs to current user
  if (!activeSession || activeSession.userId === user?.id) {
    return null;
  }

  return (
    <>
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('resourceInUseBy')}</p>
        {activeSession.user ? (
          <FabAccessUser user={activeSession.user} />
        ) : (
          <p className="text-sm font-medium text-gray-900 dark:text-white">{t('unknownUser')}</p>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500">
          ({t('sessionStarted')} <DateTimeDisplay date={activeSession.startTime} />)
        </p>

        {canTakeover && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{t('takeoverAvailable')}</p>
            <ButtonGroup fullWidth color="warning">
              <Button
                isLoading={startSession.isPending}
                startContent={<UserX className="w-4 h-4" />}
                onPress={handleImmediateTakeover}
              >
                {t('takeoverResource')}
              </Button>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly>
                    <ChevronDownIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu disallowEmptySelection aria-label={t('takeoverOptionsMenu.label')}>
                  <DropdownItem
                    key="takeoverWithNotes"
                    description={t('takeoverOptionsMenu.takeoverWithNotes.description')}
                    onPress={handleOpenTakeoverModal}
                  >
                    {t('takeoverOptionsMenu.takeoverWithNotes.label')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </ButtonGroup>
          </div>
        )}
      </div>

      <SessionNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onConfirm={handleTakeoverWithNotes}
        mode={SessionModalMode.START}
        isSubmitting={startSession.isPending}
      />
    </>
  );
}

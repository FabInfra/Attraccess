import { memo, useState, useCallback } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import {
  Alert,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import * as en from './translations/manageGroupIntroductions.en';
import * as de from './translations/manageGroupIntroductions.de';
import {
  useGroupIntroductionsList,
  useGrantGroupIntroduction,
  useRevokeGroupIntroduction,
  useUnrevokeGroupIntroduction,
  useCanManageGroupIntroductions,
} from '../../../../api/hooks/groupIntroduction';
import {
  ResourceIntroduction,
} from '@attraccess/api-client';
import { CheckCircle, Trash, Undo, XCircle } from 'lucide-react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useToastMessage } from '@frontend/components/toastProvider';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserSearch } from '@frontend/components/userSearch';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AttraccessUser } from '@frontend/components/AttraccessUser';

interface ManageGroupIntroductionsProps {
  groupId: number;
}

// --- Helper function to determine current status ---
const isIntroductionRevoked = (intro: ResourceIntroduction): boolean => {
  if (!intro.history || intro.history.length === 0) {
    return false; // No history, assume active
  }
  // Sort history descending by createdAt (most recent first)
  const sortedHistory = [...intro.history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  // Check the action of the most recent history item
  return sortedHistory[0].action === 'revoke';
};

function ManageGroupIntroductionsComponent({
  groupId,
}: ManageGroupIntroductionsProps) {
  const { t } = useTranslations('manageGroupIntroductions', { en, de });
  const { success, error: showError } = useToastMessage();

  // --- State for Granting ---
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userSearchError, setUserSearchError] = useState<string | null>(null);

  // --- Data Fetching ---
  const { data: canManage, isLoading: isLoadingPermissions } =
    useCanManageGroupIntroductions(groupId);
  const {
    data: introductionsData,
    isLoading: isLoadingIntroductions,
    error: introductionsError,
  } = useGroupIntroductionsList(groupId, { limit: 100 }); // Fetch more initially, add pagination later if needed

  // --- Mutations ---
  const grantIntroduction = useGrantGroupIntroduction(groupId);
  const revokeIntroduction = useRevokeGroupIntroduction(groupId);
  const unrevokeIntroduction = useUnrevokeGroupIntroduction(groupId);

  // --- Event Handlers ---
  const handleGrant = useCallback(async () => {
    setUserSearchError(null);
    if (!selectedUserId) {
      setUserSearchError(t('grantForm.noUserSelectedError'));
      return;
    }

    try {
      await grantIntroduction.mutateAsync({ receiverUserId: selectedUserId });
      success({ title: t('grantSuccess.title') });
      setSelectedUserId(null); // Reset user selection
    } catch (err: any) {
      console.error('Failed to grant introduction:', err);
      // TODO: Add more specific error handling (e.g., already introduced)
      showError({
        title: t('grantError.title'),
        description: err.message || t('grantError.description'),
      });
    }
  }, [selectedUserId, grantIntroduction, success, showError, t]);

  const handleRevoke = useCallback(
    async (introductionId: number) => {
      try {
        // TODO: Consider adding a confirmation modal and comment field
        await revokeIntroduction.mutateAsync({
          introductionId,
          dto: { comment: 'Revoked via UI' },
        });
        success({ title: t('revokeSuccess.title') });
        
      } catch (err: any) {
        console.error('Failed to revoke introduction:', err);
        showError({
          title: t('revokeError.title'),
          description: err.message || t('revokeError.description'),
        });
      }
    },
    [revokeIntroduction, success, showError, t]
  );

  const handleUnrevoke = useCallback(
    async (introductionId: number) => {
      try {
        // TODO: Consider adding a confirmation modal and comment field
        await unrevokeIntroduction.mutateAsync({
          introductionId,
          dto: { comment: 'Unrevoked via UI' },
        });
        success({ title: t('unrevokeSuccess.title') });
      } catch (err: any) {
        console.error('Failed to unrevoke introduction:', err);
        showError({
          title: t('unrevokeError.title'),
          description: err.message || t('unrevokeError.description'),
        });
      }
    },
    [unrevokeIntroduction, success, showError, t]
  );

  // --- Rendering Logic ---
  const isLoading = isLoadingPermissions || isLoadingIntroductions;
  const introductions = introductionsData?.data ?? [];

  // Don't render if user cannot manage
  if (isLoadingPermissions) {
    return <Spinner label={t('loadingPermissions')} />;
  }
  if (!canManage) {
    // Or return null if this component shouldn't be visible at all without permissions
    return (
      <Alert
        color="warning"
        title={t('permissionDenied.title')}
        description={t('permissionDenied.description')}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{t('title')}</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* --- Grant Introduction Form --- */}
        <div className="flex items-end gap-2">
          <UserSearch
            label={t('grantForm.userSearchLabel')}
            onSelectionChange={setSelectedUserId}
          />
          <Button
            onPress={handleGrant}
            isLoading={grantIntroduction.isPending}
            isDisabled={!selectedUserId}
            color="primary"
          >
            {t('grantForm.addButton')}
          </Button>
        </div>

        {/* --- Introductions List --- */}
        {isLoading && !introductionsData ? (
          <Spinner label={t('loadingIntroductions')} />
        ) : introductionsError ? (
          <Alert
            color="danger"
            title={t('errorLoading')}
            description={introductionsError.message}
          />
        ) : introductions.length === 0 ? (
          <p className="text-gray-500 italic">{t('emptyState')}</p>
        ) : (
          <Table aria-label={t('introductionsTable.ariaLabel')}>
            <TableHeader>
              <TableColumn>{t('introductionsTable.userCol')}</TableColumn>
              <TableColumn>{t('introductionsTable.tutorCol')}</TableColumn>
              <TableColumn>{t('introductionsTable.statusCol')}</TableColumn>
              <TableColumn>{t('introductionsTable.actionsCol')}</TableColumn>
            </TableHeader>
            <TableBody items={introductions}>
              {(item: ResourceIntroduction) => {
                const revoked = isIntroductionRevoked(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.receiverUser ? (
                        <AttraccessUser user={item.receiverUser} />
                      ) : (
                        t('unknownUser')
                      )}
                    </TableCell>
                    <TableCell>
                      {item.tutorUser ? (
                        <AttraccessUser user={item.tutorUser} />
                      ) : (
                        t('unknownUser')
                      )}
                    </TableCell>
                    <TableCell>
                      {revoked ? (
                        <span className="text-danger flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> {t('status.revoked')}
                        </span>
                      ) : (
                        <span className="text-success flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />{' '}
                          {t('status.active')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {/* TODO: Check permissions more granularly if needed */}
                      {canManage &&
                        (revoked ? (
                          <Button
                            size="sm"
                            variant="light"
                            color="success"
                            onPress={() => handleUnrevoke(item.id)}
                            isLoading={
                              unrevokeIntroduction.isPending &&
                              unrevokeIntroduction.variables?.introductionId ===
                                item.id
                            }
                            startContent={<Undo className="w-4 h-4" />}
                            aria-label={t('unrevokeAction')}
                          >
                            {t('unrevokeAction')}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleRevoke(item.id)}
                            isLoading={
                              revokeIntroduction.isPending &&
                              revokeIntroduction.variables?.introductionId ===
                                item.id
                            }
                            startContent={<Trash className="w-4 h-4" />}
                            aria-label={t('revokeAction')}
                          >
                            {t('revokeAction')}
                          </Button>
                        ))}
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        )}
        {/* TODO: Add Pagination if introductionsData?.totalPages > 1 */}
      </CardBody>
    </Card>
  );
}

export const ManageGroupIntroductions = memo(ManageGroupIntroductionsComponent);

import { memo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDisclosure } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { Tooltip } from '@heroui/tooltip';
import { History, Ban, CheckCircle } from 'lucide-react';
import { useToastMessage } from '@frontend/components/toastProvider';
import { useTranslations } from '@frontend/i18n';
// import * as en from './translations/groupIntroductionsList.en'; // TODO
// import * as de from './translations/groupIntroductionsList.de'; // TODO
import {
  ResourceIntroduction,
  useResourceGroupIntroductionServiceGetAllResourceGroupIntroductions,
  UseResourceGroupIntroductionServiceGetAllResourceGroupIntroductionsKeyFn,
  useResourceGroupIntroductionServiceMarkGroupIntroductionRevoked,
  useResourceGroupIntroductionServiceUnmarkGroupIntroductionRevoked,
} from '@attraccess/react-query-client';
// Assuming similar modal components exist or can be adapted
// import { RevokeIntroductionModal } from '../../../introductions/components/modals/RevokeIntroductionModal';
// import { UnrevokeIntroductionModal } from '../../../introductions/components/modals/UnrevokeIntroductionModal';
// import { IntroductionHistoryModal } from '../../../introductions/components/modals/IntroductionHistoryModal';

interface GroupIntroductionsListProps {
  groupId: number;
  // Data will be passed down from the parent ResourceGroupIntroductions component
  introductions: ResourceIntroduction[] | undefined;
  isLoading: boolean;
}

function GroupIntroductionsListComponent({ groupId, introductions, isLoading }: GroupIntroductionsListProps) {
  // TODO: Setup translations
  // const { t } = useTranslations('groupIntroductionsList', { en, de });
  const t = (key: string, options?: any) => `${key}${options ? ` ${JSON.stringify(options)}` : ''}`; // Placeholder

  const queryClient = useQueryClient();
  const { success, error: showError } = useToastMessage();

  // State for modals
  const [selectedIntroduction, setSelectedIntroduction] = useState<ResourceIntroduction | null>(null);
  const { isOpen: isRevokeOpen, onOpen: onRevokeOpen, onOpenChange: onRevokeOpenChange } = useDisclosure();
  const { isOpen: isUnrevokeOpen, onOpen: onUnrevokeOpen, onOpenChange: onUnrevokeOpenChange } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onOpenChange: onHistoryOpenChange } = useDisclosure();

  // Group-specific mutation hooks
  const revokeIntroduction = useResourceGroupIntroductionServiceMarkGroupIntroductionRevoked();
  const unrevokeIntroduction = useResourceGroupIntroductionServiceUnmarkGroupIntroductionRevoked();

  const handleRevoke = async (introductionId: number, comment: string) => {
    try {
      await revokeIntroduction.mutateAsync({ groupId, introductionId, body: { comment } });
      success({ title: t('success.revoked.title'), description: t('success.revoked.description') });
      queryClient.invalidateQueries({
        queryKey: UseResourceGroupIntroductionServiceGetAllResourceGroupIntroductionsKeyFn({ groupId }),
      });
    } catch (err: any) {
      showError({
        title: t('error.revokeFailed.title'),
        description: err?.body?.message || t('error.revokeFailed.description'),
      });
      console.error('Failed to revoke group introduction:', err);
    }
  };

  const handleUnrevoke = async (introductionId: number, comment?: string) => {
    try {
      await unrevokeIntroduction.mutateAsync({ groupId, introductionId, body: { comment } });
      success({ title: t('success.unrevoked.title'), description: t('success.unrevoked.description') });
      queryClient.invalidateQueries({
        queryKey: UseResourceGroupIntroductionServiceGetAllResourceGroupIntroductionsKeyFn({ groupId }),
      });
    } catch (err: any) {
      showError({
        title: t('error.unrevokeFailed.title'),
        description: err?.body?.message || t('error.unrevokeFailed.description'),
      });
      console.error('Failed to unrevoke group introduction:', err);
    }
  };

  const openRevokeModal = (intro: ResourceIntroduction) => {
    setSelectedIntroduction(intro);
    onRevokeOpen();
  };

  const openUnrevokeModal = (intro: ResourceIntroduction) => {
    setSelectedIntroduction(intro);
    onUnrevokeOpen();
  };

  const openHistoryModal = (intro: ResourceIntroduction) => {
    setSelectedIntroduction(intro);
    onHistoryOpen();
  };

  const columns = [
    { key: 'user', label: t('column.user') },
    { key: 'introducer', label: t('column.introducer') },
    { key: 'date', label: t('column.date') },
    { key: 'status', label: t('column.status') },
    { key: 'actions', label: t('column.actions') },
  ];

  return (
    <>
      <Table aria-label={t('introductionsTableLabel')}>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={introductions ?? []} isLoading={isLoading} emptyContent={t('noIntroductions')}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.receiverUser?.username ?? 'N/A'}</TableCell>
              <TableCell>{item.tutorUser?.username ?? 'N/A'}</TableCell>
              <TableCell>{new Date(item.completedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {item.isRevoked ? (
                  <span className="text-red-600">{t('status.revoked')}</span>
                ) : (
                  <span className="text-green-600">{t('status.active')}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Tooltip content={t('action.viewHistory')}>
                    <Button isIconOnly variant="light" size="sm" onPress={() => openHistoryModal(item)}>
                      <History className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  {item.isRevoked ? (
                    <Tooltip content={t('action.unrevoke')}>
                      <Button isIconOnly variant="light" size="sm" onPress={() => openUnrevokeModal(item)}>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip content={t('action.revoke')}>
                      <Button isIconOnly variant="light" size="sm" onPress={() => openRevokeModal(item)}>
                        <Ban className="w-4 h-4 text-red-600" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Placeholder for Modals */}
      {/* {selectedIntroduction && (
        <RevokeIntroductionModal
          isOpen={isRevokeOpen}
          onOpenChange={onRevokeOpenChange}
          introduction={selectedIntroduction}
          onRevoke={handleRevoke}
        />
      )}
      {selectedIntroduction && (
        <UnrevokeIntroductionModal
          isOpen={isUnrevokeOpen}
          onOpenChange={onUnrevokeOpenChange}
          introduction={selectedIntroduction}
          onUnrevoke={handleUnrevoke}
        />
      )}
      {selectedIntroduction && (
        <IntroductionHistoryModal
          isOpen={isHistoryOpen}
          onOpenChange={onHistoryOpenChange}
          introductionId={selectedIntroduction.id}
          // Need group-specific history fetch hook
          // fetchHistoryHook={useResourceGroupIntroductionServiceGetHistoryOfGroupIntroduction} 
        />
      )} */}
    </>
  );
}

export const GroupIntroductionsList = memo(GroupIntroductionsListComponent);

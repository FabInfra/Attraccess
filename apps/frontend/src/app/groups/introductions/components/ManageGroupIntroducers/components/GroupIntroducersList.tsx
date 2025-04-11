import { useCallback, useState } from 'react';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Trash2 } from 'lucide-react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  useRemoveGroupIntroducer,
  useGroupIntroducers,
} from '@frontend/api/hooks/groupIntroduction';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useToastMessage } from '@frontend/components/toastProvider';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AttraccessUser } from '@frontend/components/AttraccessUser';
import { ResourceIntroductionUser } from '@attraccess/api-client';

import * as en from './translations/groupIntroducersList.en';
import * as de from './translations/groupIntroducersList.de';

export interface GroupIntroducersListProps {
  groupId: number;
}

export function GroupIntroducersList({ groupId }: GroupIntroducersListProps) {
  const { t } = useTranslations('groupIntroducersList', {
    en,
    de,
  });

  const { data: introducers } = useGroupIntroducers(groupId);

  const { success, error: showError } = useToastMessage();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [introducerToRemove, setIntroducerToRemove] =
    useState<ResourceIntroductionUser | null>(null);

  const handleRemoveClick = useCallback(
    (introducer: ResourceIntroductionUser) => {
      setIntroducerToRemove(introducer);
      setIsConfirmModalOpen(true);
    },
    []
  );

  const removeIntroducerMutation = useRemoveGroupIntroducer(groupId);

  const handleConfirmRemove = useCallback(async () => {
    if (!introducerToRemove) {
      return;
    }

    try {
      await removeIntroducerMutation.mutateAsync({
        userId: introducerToRemove.userId,
      });
      success({
        title: t('success.removed.title'),
        description: t('success.removed.description', {
          username: introducerToRemove.user.username,
        }),
      });
    } catch (err) {
      showError({
        title: t('error.removeFailed.title'),
        description: t('error.removeFailed.description'),
      });
      console.error('Failed to remove group introducer:', err);
    }

    setIsConfirmModalOpen(false);
    setIntroducerToRemove(null);
  }, [introducerToRemove, removeIntroducerMutation, success, showError, t]);

  const handleCancelRemove = useCallback(() => {
    setIsConfirmModalOpen(false);
    setIntroducerToRemove(null);
  }, []);

  return (
    <>
      <Listbox aria-label={t('currentGroupIntroducers')} variant="flat">
        {(introducers || []).map((introducer) => (
          <ListboxItem
            key={introducer.id}
            textValue={introducer.user.username}
            endContent={
              <Button
                color="danger"
                onPress={() => handleRemoveClick(introducer)}
                isIconOnly
                aria-label={t('removeGroupIntroducer', {
                  username: introducer.user.username,
                })}
              >
                <Trash2 />
              </Button>
            }
          >
            <AttraccessUser user={introducer.user} />
          </ListboxItem>
        ))}
      </Listbox>

      <Modal isOpen={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {t('removeConfirmation.title')}
          </ModalHeader>
          <ModalBody>
            <p>
              {t('removeConfirmation.message', {
                username: introducerToRemove?.user.username || '',
              })}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleCancelRemove}>
              {t('removeConfirmation.cancel')}
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmRemove}
              isLoading={removeIntroducerMutation.isPending}
            >
              {t('removeConfirmation.confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

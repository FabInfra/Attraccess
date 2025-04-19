import { memo, useCallback, useState } from 'react';
import { Button } from '@heroui/button';
import { PlusCircle } from 'lucide-react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useToastMessage } from '@frontend/components/toastProvider';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserSearch } from '@frontend/components/userSearch';
import {
  useResourceGroupIntroducersServiceAddGroupIntroducer,
  useResourceGroupIntroducersServiceGetAllResourceGroupIntroducers,
  UseResourceGroupIntroducersServiceGetAllResourceGroupIntroducersKeyFn,
} from '@attraccess/react-query-client';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
import * as en from '../translations/en.json';
import * as de from '../translations/de.json';
import { useQueryClient } from '@tanstack/react-query';

export interface AddGroupIntroducerProps {
  groupId: number;
}

function AddGroupIntroducerComponent({ groupId }: AddGroupIntroducerProps) {
  const { t } = useTranslations('manageGroupIntroducers', {
    en,
    de,
  });
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: existingIntroducers } = useResourceGroupIntroducersServiceGetAllResourceGroupIntroducers({
    groupId,
  });

  const addIntroducer = useResourceGroupIntroducersServiceAddGroupIntroducer();

  const handleAddIntroducer = useCallback(async () => {
    if (!selectedUserId) {
      showError({
        title: t('errorAddingIntroducer'),
        description: t('selectUserFirst'),
      });
      return;
    }

    try {
      await addIntroducer.mutateAsync({ groupId, userId: selectedUserId });
      queryClient.invalidateQueries({
        queryKey: UseResourceGroupIntroducersServiceGetAllResourceGroupIntroducersKeyFn({ groupId }),
      });
      success({
        title: t('introducerAdded'),
        description: t('introducerAddedDescription'),
      });
      setSelectedUserId(null);
    } catch (err) {
      console.error('Error adding introducer:', err);
      showError({
        title: t('errorAddingIntroducer'),
        description: t('errorAddingIntroducerDescription'),
      });
    }
  }, [selectedUserId, addIntroducer, groupId, showError, success, t, queryClient]);

  const existingIntroducerIds = existingIntroducers?.map((intro) => intro.userId) ?? [];

  return (
    <>
      <div>
        <UserSearch onSelectionChange={setSelectedUserId} />
      </div>

      <div>
        <Button
          onPress={handleAddIntroducer}
          color="primary"
          isLoading={addIntroducer.isPending}
          isDisabled={!selectedUserId}
          className="w-full mt-2"
          startContent={<PlusCircle className="w-4 h-4" />}
        >
          {t('addIntroducer')}
        </Button>
      </div>
    </>
  );
}

export const AddGroupIntroducer = memo(AddGroupIntroducerComponent);

import { memo, useCallback, useState } from 'react';
import { Button } from '@heroui/button';
import { UserSearch } from '@frontend/components/userSearch'; // Assuming reuse
import { useTranslations } from '@frontend/i18n';
import { useToastMessage } from '@frontend/components/toastProvider';
// import * as en from './translations/addGroupIntroductionForm.en'; // TODO
// import * as de from './translations/addGroupIntroductionForm.de'; // TODO
import {
  useResourceGroupIntroductionServiceMarkGroupIntroductionCompleted,
  UseResourceGroupIntroductionServiceGetAllResourceGroupIntroductionsKeyFn,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';

interface AddGroupIntroductionFormProps {
  groupId: number;
}

function AddGroupIntroductionFormComponent({ groupId }: AddGroupIntroductionFormProps) {
  // TODO: Setup translations
  // const { t } = useTranslations('addGroupIntroductionForm', { en, de });
  const t = (key: string) => key; // Placeholder translation

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastMessage();

  // Use group-specific hook
  const addIntroduction = useResourceGroupIntroductionServiceMarkGroupIntroductionCompleted();

  const handleAddIntroduction = useCallback(async () => {
    if (!selectedUserId) {
      showError({
        title: t('error.noUserSelected.title'),
        description: t('error.noUserSelected.description'),
      });
      return;
    }

    try {
      // Use group-specific hook and parameters
      await addIntroduction.mutateAsync({ groupId, body: { userId: selectedUserId } });
      success({
        title: t('success.added.title'),
        description: t('success.added.description'),
      });

      // Use group-specific invalidation key
      queryClient.invalidateQueries({
        queryKey: UseResourceGroupIntroductionServiceGetAllResourceGroupIntroductionsKeyFn({ groupId }),
      });

      setSelectedUserId(null); // Reset selection
    } catch (err: any) {
      showError({
        title: t('error.addFailed.title'),
        // Use actual error message if available, otherwise generic
        description: err?.body?.message || t('error.addFailed.description'),
      });
      console.error('Failed to add group introduction:', err);
    }
  }, [selectedUserId, addIntroduction, groupId, showError, success, t, queryClient]);

  return (
    <div className="flex flex-col sm:flex-row items-end gap-2">
      <div className="flex-grow w-full sm:w-auto">
        <UserSearch
          onSelectionChange={setSelectedUserId}
          label={t('searchUserLabel')} // Placeholder label
          placeholder={t('searchUserPlaceholder')} // Placeholder placeholder
          // Consider adding exclude functionality if UserSearch supports it and we need to exclude existing introductions
        />
      </div>
      <Button
        onPress={handleAddIntroduction}
        isLoading={addIntroduction.isPending}
        color="primary"
        isDisabled={!selectedUserId}
        className="w-full sm:w-auto"
      >
        {t('addButton')}
      </Button>
    </div>
  );
}

export const AddGroupIntroductionForm = memo(AddGroupIntroductionFormComponent);

import { memo, useCallback, useState } from 'react';
import { Button } from '@heroui/button';
import { PlusCircle } from 'lucide-react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserSearch } from '@frontend/components/userSearch';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useAddGroupIntroducer } from '@frontend/api/hooks/groupIntroduction';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useToastMessage } from '@frontend/components/toastProvider';

// Assuming translation files exist or will be created
import * as en from './translations/addGroupIntroducerForm.en';
import * as de from './translations/addGroupIntroducerForm.de';

interface AddGroupIntroducerFormProps {
  groupId: number;
}

function AddGroupIntroducerFormComponent(props: AddGroupIntroducerFormProps) {
  const { groupId } = props;

  const { t } = useTranslations('addGroupIntroducerForm', {
    en,
    de,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const addGroupIntroducerMutation = useAddGroupIntroducer(groupId);
  const { success, error: showError } = useToastMessage();

  const handleAddIntroducer = useCallback(async () => {
    if (!selectedUserId) {
      showError({
        title: t('error.noUserSelected.title'),
        description: t('error.noUserSelected.description'),
      });
      return;
    }

    try {
      await addGroupIntroducerMutation.mutateAsync({ userId: selectedUserId });
      success({
        title: t('success.added.title'),
        description: t('success.added.description'),
      });

      setSelectedUserId(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let description = t('error.addFailed.description');
      if (
        err?.response?.data?.message ===
        'UserAlreadyHasIntroductionPermissionException'
      ) {
        description = t('error.alreadyIntroducer.description');
      }
      showError({
        title: t('error.addFailed.title'),
        description,
      });
      console.error('Failed to add group introducer:', err);
    }
  }, [selectedUserId, addGroupIntroducerMutation, showError, success, t]);

  return (
    <>
      <div className="relative">
        <UserSearch onSelectionChange={setSelectedUserId} />
      </div>

      <Button
        onPress={handleAddIntroducer}
        isLoading={addGroupIntroducerMutation.isPending}
        color="primary"
        startContent={<PlusCircle className="w-4 h-4" />}
      >
        {t('addButton')}
      </Button>
    </>
  );
}

export const AddGroupIntroducerForm = memo(AddGroupIntroducerFormComponent);

import { memo, useCallback, useState } from 'react';
import { Button } from '@heroui/button';
import { PlusCircle } from 'lucide-react';
import { UserSearch } from '@attraccess/plugins-frontend-ui';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { useToastMessage } from '../../../../../../components/toastProvider';

// Import translations
import * as en from './translations/addIntroducer.en';
import * as de from './translations/addIntroducer.de';
import {
  useResourceIntroducersServiceAddOne,
  UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';

interface AddIntroducerProps {
  resourceId: number;
}

function AddIntroducerComponent(props: AddIntroducerProps) {
  const { resourceId } = props;

  const { t } = useTranslations('addIntroducer', {
    en,
    de,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const addIntroducer = useResourceIntroducersServiceAddOne();
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
      await addIntroducer.mutateAsync({ resourceId, userId: selectedUserId });
      success({
        title: t('success.added.title'),
        description: t('success.added.description'),
      });

      queryClient.invalidateQueries({
        queryKey: UseResourceIntroducersServiceGetAllResourceIntroducersKeyFn({
          resourceId,
        }),
      });

      setSelectedUserId(null);
    } catch (err) {
      showError({
        title: t('error.addFailed.title'),
        description: t('error.addFailed.description'),
      });
      console.error('Failed to add introducer:', err);
    }
  }, [selectedUserId, addIntroducer, resourceId, showError, success, t, queryClient]);

  return (
    <>
      <div className="relative">
        <UserSearch onSelectionChange={setSelectedUserId} />
      </div>

      <Button
        onPress={handleAddIntroducer}
        isLoading={addIntroducer.isPending}
        color="primary"
        startContent={<PlusCircle className="w-4 h-4" />}
      >
        {t('addButton')}
      </Button>
    </>
  );
}

export const AddIntroducer = memo(AddIntroducerComponent);

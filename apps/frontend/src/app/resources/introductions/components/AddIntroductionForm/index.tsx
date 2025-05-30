import { useCallback, useEffect, useState } from 'react';
import { useTranslations, UserSearch } from '@attraccess/plugins-frontend-ui';
import { Button } from '@heroui/button';
import { PlusCircle } from 'lucide-react';
import * as en from './translations/en';
import * as de from './translations/de';
import { useToastMessage } from '../../../../../components/toastProvider';
import {
  useResourceIntroductionsServiceMarkCompleted,
  UseResourceIntroductionsServiceCheckStatusKeyFn,
  useResourceIntroductionsServiceGetAllResourceIntroductionsKey,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';

export type AddIntroductionFormProps = {
  resourceId: number;
};

export const AddIntroductionForm = ({ resourceId }: AddIntroductionFormProps) => {
  const { t } = useTranslations('addIntroductionForm', {
    en,
    de,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { success: showSuccess, error: showError } = useToastMessage();

  const {
    mutate: createIntroduction,
    isPending: isSubmitting,
    status,
    error,
  } = useResourceIntroductionsServiceMarkCompleted();

  const submitIntroduction = useCallback(async () => {
    if (!selectedUserId) {
      return;
    }

    createIntroduction({
      resourceId,
      requestBody: {
        userId: selectedUserId,
      },
    });
  }, [createIntroduction, resourceId, selectedUserId]);

  useEffect(() => {
    if (status === 'success') {
      setSelectedUserId(null);
      showSuccess({
        title: t('addNew.success'),
      });
      queryClient.invalidateQueries({
        queryKey: [useResourceIntroductionsServiceGetAllResourceIntroductionsKey, { resourceId }],
      });
      queryClient.invalidateQueries({
        queryKey: UseResourceIntroductionsServiceCheckStatusKeyFn({ resourceId }),
      });
    }

    if (status === 'error') {
      showError({
        title: t('addNew.error'),
        description: (error as Error)?.message,
      });
    }
  }, [status, t, error, showError, showSuccess, queryClient, resourceId]);

  return (
    <div className="space-y-4 mb-4">
      <UserSearch onSelectionChange={setSelectedUserId} />

      <Button
        onPress={submitIntroduction}
        isLoading={isSubmitting}
        color="primary"
        startContent={<PlusCircle className="w-4 h-4" />}
        fullWidth
      >
        {t('addNew.button')}
      </Button>
    </div>
  );
};

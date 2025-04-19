import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useToastMessage } from '@frontend/components/toastProvider';
import {
  useResourceGroupIntroducersServiceGetAllResourceGroupIntroducers,
  useResourceGroupIntroducersServiceRemoveGroupIntroducer,
  UseResourceGroupIntroducersServiceGetAllResourceGroupIntroducersKeyFn,
} from '@attraccess/react-query-client';
import { Trash } from 'lucide-react';
import { User } from '@attraccess/database-entities';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useTranslations } from '@frontend/i18n';
import * as en from '../translations/en';
import * as de from '../translations/de';
import { useQueryClient } from '@tanstack/react-query';

export interface GroupIntroducersListProps {
  groupId: number;
}

export function GroupIntroducersList({ groupId }: GroupIntroducersListProps) {
  const { t } = useTranslations('manageGroupIntroducers', {
    en,
    de,
  });
  const { success, error: showError } = useToastMessage();
  const queryClient = useQueryClient();

  const { data: introducers } = useResourceGroupIntroducersServiceGetAllResourceGroupIntroducers({ groupId });
  const removeIntroducer = useResourceGroupIntroducersServiceRemoveGroupIntroducer();

  const handleRemoveIntroducer = async (user: User) => {
    try {
      await removeIntroducer.mutateAsync({ groupId, userId: user.id });
      queryClient.invalidateQueries({
        queryKey: [UseResourceGroupIntroducersServiceGetAllResourceGroupIntroducersKeyFn({ groupId })[0]],
      });
      success({
        title: t('introducerRemoved'),
        description: t('introducerRemovedDescription', { name: user.username }),
      });
    } catch (err) {
      console.error('Error removing introducer:', err);
      showError({
        title: t('errorRemovingIntroducer'),
        description: t('errorRemovingIntroducerDescription'),
      });
    }
  };

  if (!introducers) {
    return null;
  }

  return (
    <div className="space-y-3">
      {introducers.map((introducer) => (
        <div
          key={introducer.user.id}
          className="flex items-center justify-between bg-gray-50 p-3 rounded-md dark:bg-gray-800"
        >
          <div className="flex items-center space-x-3">
            <Avatar name={introducer.user.username} />
            <div>
              <p className="font-medium dark:text-white">{introducer.user.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{introducer.user.email}</p>
            </div>
          </div>
          <Button
            color="danger"
            variant="light"
            isIconOnly
            onPress={() => handleRemoveIntroducer(introducer.user)}
            isLoading={removeIntroducer.isPending}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

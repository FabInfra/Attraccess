import React, { useEffect, useState } from 'react';
import { Checkbox, Button, Card } from '@heroui/react';
import { useTranslations, AttraccessUser } from '@attraccess/plugins-frontend-ui';
import { useToastMessage } from '../../../components/toastProvider';
import {
  User,
  useUsersServiceGetPermissions,
  useUsersServiceUpdatePermissions,
  UseUsersServiceFindManyKeyFn,
} from '@attraccess/react-query-client';
import { useQueryClient } from '@tanstack/react-query';

import * as en from '../userManagement.en.json';
import * as de from '../userManagement.de.json';

interface UserPermissionFormProps {
  user: User;
}

export const UserPermissionForm: React.FC<UserPermissionFormProps> = ({ user }) => {
  const { t } = useTranslations('userPermissionForm', { en, de });
  const { showToast } = useToastMessage();
  const queryClient = useQueryClient();

  const { data: userPermissions, isLoading } = useUsersServiceGetPermissions({ id: user.id });
  const updatePermissions = useUsersServiceUpdatePermissions();

  const [permissions, setPermissions] = useState({
    canManageResources: false,
    canManageSystemConfiguration: false,
    canManageUsers: false,
  });

  // Update local state when permissions data is loaded
  useEffect(() => {
    if (userPermissions) {
      setPermissions({
        canManageResources: userPermissions.canManageResources ?? false,
        canManageSystemConfiguration: userPermissions.canManageSystemConfiguration ?? false,
        canManageUsers: userPermissions.canManageUsers ?? false,
      });
    }
  }, [userPermissions]);

  const handlePermissionChange = (permission: string) => (checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: checked,
    }));
  };

  const handleSave = async () => {
    try {
      await updatePermissions.mutateAsync({
        id: user.id,
        requestBody: permissions,
      });

      queryClient.invalidateQueries({
        queryKey: [UseUsersServiceFindManyKeyFn()[0]],
      });

      showToast({
        title: t('userPermissionsSaved'),
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      showToast({
        title: t('errorUpdatingPermissions'),
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4" data-cy="user-permission-form-loading">
        Loading permissions...
      </div>
    );
  }

  return (
    <Card className="p-6 w-full" data-cy="user-permission-form-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{t('managingUser')}</h3>
        <AttraccessUser user={user} data-cy="user-permission-form-user-display" />
      </div>

      <div className="border-t pt-4 my-4">
        <h3 className="text-lg font-semibold mb-4">{t('permissions')}</h3>

        <div className="space-y-4">
          <div className="flex items-center">
            <Checkbox
              isSelected={permissions.canManageResources}
              onValueChange={handlePermissionChange('canManageResources')}
              color="primary"
              className="mr-2"
              data-cy="user-permission-form-canManageResources-checkbox"
            />
            <span>{t('canManageResources')}</span>
          </div>

          <div className="flex items-center">
            <Checkbox
              isSelected={permissions.canManageSystemConfiguration}
              onValueChange={handlePermissionChange('canManageSystemConfiguration')}
              color="primary"
              className="mr-2"
              data-cy="user-permission-form-canManageSystemConfiguration-checkbox"
            />
            <span>{t('canManageSystemConfiguration')}</span>
          </div>

          <div className="flex items-center">
            <Checkbox
              isSelected={permissions.canManageUsers}
              onValueChange={handlePermissionChange('canManageUsers')}
              color="primary"
              className="mr-2"
              data-cy="user-permission-form-canManageUsers-checkbox"
            />
            <span>{t('canManageUsers')}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          color="primary"
          onPress={handleSave}
          isLoading={updatePermissions.isPending}
          data-cy="user-permission-form-save-button"
        >
          {t('saveChanges')}
        </Button>
      </div>
    </Card>
  );
};

import React, { useState } from 'react';
import { PageHeader } from '../../components/pageHeader';
import { useTranslations, UserSearch } from '@attraccess/plugins-frontend-ui';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { UserPermissionForm } from './components/UserPermissionForm';
import * as en from './userManagement.en.json';
import * as de from './userManagement.de.json';
import { Card } from '@heroui/react';
import { Users, Loader } from 'lucide-react';
import { useUsersServiceGetOneUserById } from '@attraccess/react-query-client';

export const UserManagementPage: React.FC = () => {
  const { t } = useTranslations('userManagementPage', { en, de });
  const { hasPermission } = useAuth();
  const canManageUsers = hasPermission('canManageUsers');

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Fetch user details directly by ID rather than searching
  const { data: selectedUser, isLoading: isLoadingUser } = useUsersServiceGetOneUserById(
    { id: selectedUserId as number },
    undefined,
    { enabled: !!selectedUserId }
  );

  // Redirect if user doesn't have permissions
  if (!canManageUsers) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-7xl" data-cy="user-management-page">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        backTo="/"
        icon={<Users className="w-6 h-6" />}
        data-cy="user-management-page-header"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-8">
        {/* User search section - full width on mobile, 1/3 on larger screens */}
        <div className="lg:col-span-1 order-1">
          <Card className="p-4 sm:p-6 shadow-sm" data-cy="user-management-user-search-card">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">{t('selectUser')}</h3>

            <div className="mb-3 sm:mb-6">
              <UserSearch
                onSelectionChange={(user) => setSelectedUserId(user?.id ?? null)}
                placeholder={t('search')}
                data-cy="user-management-user-search-input"
              />
            </div>
          </Card>
        </div>

        {/* User details section - full width on mobile, 2/3 on larger screens */}
        <div className="lg:col-span-2 order-2">
          {isLoadingUser ? (
            <Card
              className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] text-center shadow-sm"
              data-cy="user-management-loading-user-card"
            >
              <Loader
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500 mb-3 sm:mb-4 animate-spin"
                data-cy="user-management-loading-user-spinner"
              />
              <p className="text-base sm:text-lg font-medium">{t('loading') || 'Loading...'}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                {t('loadingUserDetails') || 'Fetching user details...'}
              </p>
            </Card>
          ) : selectedUser ? (
            <UserPermissionForm user={selectedUser} />
          ) : (
            <Card
              className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] text-center shadow-sm"
              data-cy="user-management-select-user-prompt-card"
            >
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium">{t('selectUser')}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{t('permissionManagement')}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

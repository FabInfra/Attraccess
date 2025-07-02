import React, { useState } from 'react';
import { PageHeader } from '../../components/pageHeader';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Alert,
} from '@heroui/react';
import { UserCog, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUsersServiceRequestEmailChange } from '@attraccess/react-query-client';

import * as en from './en.json';
import * as de from './de.json';

export const AccountSettingsPage: React.FC = () => {
  const { t } = useTranslations('accountSettings', { en, de });
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const requestEmailChange = useUsersServiceRequestEmailChange({
    onSuccess: () => {
      setShowSuccess(true);
      setNewEmail('');
    },
  });

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    
    await requestEmailChange.mutateAsync({
      requestBody: { newEmail },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div data-cy="account-settings-page">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<UserCog className="w-6 h-6" />}
        data-cy="account-settings-page-header"
      />

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t('emailSection.title')}
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('emailSection.currentEmail')}
            </label>
            <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>

          {showSuccess && (
            <Alert color="success" className="mb-4">
              {t('emailSection.successMessage')}
            </Alert>
          )}

          <form onSubmit={handleEmailChangeRequest} className="space-y-4">
            <Input
              label={t('emailSection.newEmailLabel')}
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t('emailSection.newEmailPlaceholder')}
              isRequired
              data-cy="account-settings-new-email-input"
            />

            <div className="flex gap-2">
              <Button
                type="submit"
                color="primary"
                isLoading={requestEmailChange.isPending}
                isDisabled={!newEmail.trim()}
                data-cy="account-settings-change-email-button"
              >
                {t('emailSection.changeEmailButton')}
              </Button>
            </div>
          </form>

          {requestEmailChange.error ? (
            <Alert color="danger">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {String((requestEmailChange.error as any)?.message || t('emailSection.errorMessage'))}
            </Alert>
          ) : null}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>{t('emailSection.note')}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
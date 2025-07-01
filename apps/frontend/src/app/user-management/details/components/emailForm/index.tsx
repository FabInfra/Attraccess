import React, { useState } from 'react';
import { User, useTranslations } from '@attraccess/plugins-frontend-ui';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Alert,
} from '@heroui/react';
import { Mail, Check } from 'lucide-react';
import { useUsersServiceAdminChangeEmail } from '@attraccess/react-query-client';

import * as en from './en.json';
import * as de from './de.json';

interface EmailFormProps {
  user: User;
}

export const EmailForm: React.FC<EmailFormProps> = ({ user }) => {
  const { t } = useTranslations('userManagementEmailForm', { en, de });
  const [newEmail, setNewEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const adminChangeEmail = useUsersServiceAdminChangeEmail({
    onSuccess: () => {
      setShowSuccess(true);
      setNewEmail('');
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    
    await adminChangeEmail.mutateAsync({
      id: user.id,
      requestBody: { newEmail },
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {t('title')}
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('currentEmail')}
          </label>
          <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
          <div className="flex items-center gap-1 mt-1">
            {user.isEmailVerified ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="w-4 h-4" />
                {t('verified')}
              </span>
            ) : (
              <span className="text-sm text-orange-600">{t('notVerified')}</span>
            )}
          </div>
        </div>

        {showSuccess && (
          <Alert color="success" className="mb-4">
            {t('successMessage')}
          </Alert>
        )}

        <form onSubmit={handleEmailChange} className="space-y-4">
          <Input
            label={t('newEmailLabel')}
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={t('newEmailPlaceholder')}
            isRequired
            data-cy="admin-change-email-input"
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              color="primary"
              isLoading={adminChangeEmail.isPending}
              isDisabled={!newEmail.trim()}
              data-cy="admin-change-email-button"
            >
              {t('changeEmailButton')}
            </Button>
          </div>
        </form>

        {adminChangeEmail.error && (
          <Alert color="danger">
            {t('errorMessage')}
          </Alert>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{t('note')}</p>
        </div>
      </CardBody>
    </Card>
  );
};
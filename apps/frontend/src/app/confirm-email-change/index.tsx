import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import { Card, CardBody, CardHeader, Button, Alert } from '@heroui/react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useUsersServiceConfirmEmailChange } from '@fabaccess/react-query-client';

import * as en from './en.json';
import * as de from './de.json';

export function ConfirmEmailChange() {
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslations('confirmEmailChange', { en, de });
  const [hasAttempted, setHasAttempted] = useState(false);

  const token = useMemo(() => query.get('token'), [query]);
  const newEmail = useMemo(() => query.get('newEmail'), [query]);

  const confirmEmailChange = useUsersServiceConfirmEmailChange();

  const confirmChange = useCallback(async () => {
    if (!token || !newEmail || hasAttempted) {
      return;
    }

    setHasAttempted(true);

    await confirmEmailChange.mutate({
      requestBody: { token, newEmail },
    });
  }, [token, newEmail, hasAttempted, confirmEmailChange]);

  useEffect(() => {
    if (token && newEmail && !hasAttempted) {
      confirmChange();
    }
  }, [token, newEmail, hasAttempted, confirmChange]);

  if (confirmEmailChange.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full" data-cy="confirm-email-change-loading-card">
          <CardBody className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p>{t('loading')}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (confirmEmailChange.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full" data-cy="confirm-email-change-success-card">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h1 className="text-xl font-semibold">{t('success.title')}</h1>
          </CardHeader>
          <CardBody className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('success.message').replace('{email}', newEmail || '')}
            </p>
            <Button
              fullWidth
              color="primary"
              onPress={() => navigate('/')}
              data-cy="confirm-email-change-success-login-button"
            >
              {t('success.goToLogin')}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const error = (confirmEmailChange.error as Error)?.message || t('error.genericError');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full" data-cy="confirm-email-change-error-card">
        <CardHeader className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <h1 className="text-xl font-semibold">{t('error.title')}</h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <Alert
            color="danger"
            title={t('error.errorTitle')}
            description={error}
            data-cy="confirm-email-change-error-alert"
          />
          <div className="space-y-2">
            <Button
              fullWidth
              color="primary"
              onPress={confirmChange}
              isDisabled={confirmEmailChange.isPending}
              data-cy="confirm-email-change-error-try-again-button"
            >
              {t('error.tryAgain')}
            </Button>
            <Button
              fullWidth
              variant="bordered"
              onPress={() => navigate('/')}
              data-cy="confirm-email-change-error-back-to-login-button"
            >
              {t('error.backToLogin')}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

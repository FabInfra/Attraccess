import React from 'react';
import { Alert, Link } from '@heroui/react';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from '@fabaccess/plugins-frontend-ui';
import * as en from '../translations/en';
import * as de from '../translations/de';

/**
 * Component for displaying webhook security information
 */
const WebhookSecurityInfo: React.FC = () => {
  const { t } = useTranslations('webhooksSecurityInfo', { en, de });

  return (
    <div className="mt-4">
      <Alert className="bg-gray-50">
        <div className="flex gap-2">
          <HelpCircle className="text-gray-600 w-5 h-5" />
          <div>
            <p className="font-medium">{t('securityTitle')}</p>
            <p className="text-sm text-gray-600">{t('securityDescription')}</p>
            <Link className="text-sm mt-1 block" href="/docs/webhooks" isExternal>
              {t('securityLink')}
            </Link>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default WebhookSecurityInfo;

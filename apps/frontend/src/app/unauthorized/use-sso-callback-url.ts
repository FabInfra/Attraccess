import { SSOProviderType } from '@fabaccess/database-entities';
import { getBaseUrl } from '../../api';
import { useMemo } from 'react';

export function useCallbackURL(providerId: number, providerType: SSOProviderType, redirectTo?: string) {
  return useMemo(() => {
    const apiBaseUrl = getBaseUrl();
    const encodedCallbackURL = encodeURIComponent(window.location.href);
    return `${apiBaseUrl}/api/auth/sso/${providerType}/${providerId}/login?redirectTo=${
      redirectTo ?? encodedCallbackURL
    }`;
  }, [providerId, providerType, redirectTo]);
}

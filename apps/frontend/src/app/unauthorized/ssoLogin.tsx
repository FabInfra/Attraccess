import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { Button, Divider, Link } from '@heroui/react';
import * as de from './ssoLogin.de.json';
import * as en from './ssoLogin.en.json';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthenticationServiceGetAllSsoProviders, SSOProvider } from '@attraccess/react-query-client';
import { getBaseUrl } from '../../api';
import { useAuth } from '../../hooks/useAuth';

function useCallbackURL(providerId: number, providerType: SSOProvider['type']) {
  return useMemo(() => {
    const apiBaseUrl = getBaseUrl();
    const encodedCallbackURL = encodeURIComponent(window.location.href);
    return `${apiBaseUrl}/api/auth/sso/${providerType}/${providerId}/login?redirectTo=${encodedCallbackURL}`;
  }, [providerId, providerType]);
}

interface SSOLoginButtonProps {
  provider: SSOProvider;
}

function SSOLoginButton(props: Readonly<SSOLoginButtonProps>) {
  const { t } = useTranslations('ssoLoginButton', {
    de,
    en,
  });
  const { provider } = props;

  const loginHref = useCallbackURL(provider.id, provider.type);

  return (
    <Button as={Link} href={loginHref} isExternal fullWidth data-cy={`sso-login-button-${provider.name}`}>
      {t('loginWith', { provider: provider.name })}
    </Button>
  );
}

export function SSOLogin() {
  const { isLoading, data: providers } = useAuthenticationServiceGetAllSsoProviders();
  const location = useLocation();
  const { jwtTokenLogin } = useAuth();

  const [didExecuteSSOCallback, setDidExecuteSSOCallback] = useState(false);

  const query = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);

  const callSSOCallback = useCallback(async () => {
    if (didExecuteSSOCallback) {
      return;
    }

    setDidExecuteSSOCallback(true);

    const authString = query.get('auth');
    if (!authString) {
      return;
    }

    const auth = JSON.parse(authString);

    await jwtTokenLogin.mutateAsync(auth);
  }, [didExecuteSSOCallback, jwtTokenLogin, query]);

  useEffect(() => {
    callSSOCallback();
  }, [callSSOCallback]);

  if (providers?.length === 0 || isLoading) {
    return null;
  }

  if ((providers ?? []).length === 0) {
    return null;
  }

  return (
    <>
      <Divider />
      {providers?.map((provider) => (
        <SSOLoginButton key={provider.id} provider={provider} />
      ))}
    </>
  );
}

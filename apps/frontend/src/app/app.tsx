import { Route, Routes, useNavigate } from 'react-router-dom';
import { Unauthorized } from './unauthorized/unauthorized';
import { useTheme } from '@heroui/use-theme';
import { useEffect, useMemo } from 'react';
import { Layout } from './layout/layout';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './loading';
import { useAllRoutes } from './routes';
import { VerifyEmail } from './verifyEmail';
import { ToastProvider } from '../components/toastProvider';
import { HeroUIProvider, Spinner } from '@heroui/react';
import { SystemPermissions } from '@attraccess/react-query-client';
import { RouteConfig } from '@attraccess/plugins-frontend-sdk';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import de from './app.de.json';
import en from './app.en.json';
import { ResetPassword } from './reset-password/resetPassword';
import { UnauthorizedLayout } from './unauthorized/unauthorized-layout/layout';

function useRoutesWithAuthElements(routes: RouteConfig[]) {
  const { user } = useAuth();

  const routesWithAuthElements = useMemo(() => {
    return routes.map((route) => {
      if (!route.authRequired) {
        return route;
      }

      if (route.authRequired === true && user) {
        return route;
      }

      if (!user) {
        return {
          ...route,
          element: <Unauthorized />,
        };
      }

      const requiredPermissions = (
        Array.isArray(route.authRequired) ? route.authRequired : [route.authRequired]
      ) as (keyof SystemPermissions)[];

      const userHasAllRequiredPermissions = requiredPermissions.every(
        (permission) => user.systemPermissions[permission] === true
      );

      if (!userHasAllRequiredPermissions) {
        return {
          ...route,
          element: <Unauthorized />,
        };
      }

      return route;
    });
  }, [routes, user]);

  return useMemo(
    () =>
      routesWithAuthElements.map((route: RouteConfig, index) => (
        <Route key={index} path={route.path} element={route.element} />
      )),
    [routesWithAuthElements]
  );
}

export function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslations('app', { de, en });

  const allRoutes = useAllRoutes();
  const routesWithAuthElements = useRoutesWithAuthElements(allRoutes);

  const queryClient = useQueryClient();

  // set theme based on system preference of browser
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
    }

    const darkBackground = 'rgb(0,0,0)';
    const lightBackground = 'rgb(255,255,255)';

    metaTheme.setAttribute('content', systemTheme === 'dark' ? darkBackground : lightBackground);
  }, [setTheme]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <PullToRefresh
      onRefresh={() => queryClient.invalidateQueries()}
      pullDownThreshold={90}
      refreshingContent={<Spinner />}
      pullingContent={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '8px' }}>
          <div style={{ fontSize: '14px' }}>{t('pullToRefresh')}</div>
          <div style={{ fontSize: '24px' }}>↓</div>
        </div>
      }
    >
      <HeroUIProvider navigate={navigate} labelPlacement="inside">
        <ToastProvider>
          <Layout noLayout={!isAuthenticated}>
            <Routes>
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route
                path="/reset-password"
                element={
                  <UnauthorizedLayout>
                    <ResetPassword />
                  </UnauthorizedLayout>
                }
              />

              {routesWithAuthElements}

              {!isAuthenticated && <Route path="*" element={<Unauthorized />} />}
            </Routes>
          </Layout>
        </ToastProvider>
      </HeroUIProvider>
    </PullToRefresh>
  );
}

export default App;

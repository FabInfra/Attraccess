import React, { useMemo } from 'react';
import newGithubIssueUrl from 'new-github-issue-url';
import { X, Settings, LogOut, User, Book, ExternalLink, Github } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslations } from '@attraccess/plugins-frontend-ui';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Link, PropsOf } from '@heroui/react';
import { useAllRoutes } from '../routes';
import { SystemPermissions } from '@attraccess/react-query-client';
import de from './sidebar.de.json';
import en from './sidebar.en.json';
import deRoutes from '../routes/translations/de.json';
import enRoutes from '../routes/translations/en.json';

function NavLink(
  props: Omit<PropsOf<typeof Link>, 'children'> & {
    label: string;
    icon: React.ReactNode;
    isExternal?: boolean;
    'data-cy'?: string;
  }
) {
  return (
    <Link
      {...props}
      target={props.target ?? props.isExternal ? '_blank' : undefined}
      className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      color="foreground"
      underline="none"
    >
      <span className="mr-3">{props.icon}</span>
      <span className="flex-1">{props.label}</span>
      {props.isExternal && <ExternalLink className="ml-2" />}
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { logout, user } = useAuth();
  const { t } = useTranslations('sidebar', {
    en,
    de,
  });

  const { t: tRoutes } = useTranslations('routes', {
    en: enRoutes,
    de: deRoutes,
  });

  const routes = useAllRoutes();

  // Get navigation items from routes that have sidebar config
  const navigationItems = useMemo(() => {
    return routes
      .filter((route) => {
        if (!route.sidebar) {
          return false;
        }

        if (!route.authRequired) {
          return true;
        }

        if (!user) {
          return false;
        }

        if (route.authRequired === true) {
          return true;
        }

        const requiredPermissions = (
          Array.isArray(route.authRequired) ? route.authRequired : [route.authRequired]
        ) as (keyof SystemPermissions)[];

        const userHasAllRequiredPermissions = requiredPermissions.every(
          (permission) => user.systemPermissions[permission] === true
        );

        return userHasAllRequiredPermissions;
      })
      .sort((a, b) => {
        // Sort by order if available, otherwise alphabetically by translation key
        const orderA = a.sidebar?.order;
        const orderB = b.sidebar?.order;

        if (!orderA && !!orderB) {
          return 1;
        }

        if (!!orderA && !orderB) {
          return -1;
        }

        if (orderA === orderB) {
          return (a.sidebar?.translationKey || '').localeCompare(b.sidebar?.translationKey || '');
        }

        return (orderA as number) - (orderB as number);
      });
  }, [user, routes]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
        data-cy="sidebar-mobile-backdrop"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="text-xl font-semibold"
            color="foreground"
            underline="none"
            data-cy="sidebar-home-link"
          >
            Attraccess
          </Link>
          <Button
            variant="light"
            aria-label="Close sidebar"
            isIconOnly
            className="md:hidden"
            onPress={toggleSidebar}
            data-cy="sidebar-close-button"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-grow overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigationItems.map((route, index) => (
              <NavLink
                key={index}
                href={route.path as string}
                icon={route.sidebar?.icon}
                label={route.sidebar?.label ?? tRoutes(route.sidebar?.translationKey || '')}
                data-cy={`sidebar-nav-${route.sidebar?.translationKey || route.path?.replace('/', '') || index}`}
              />
            ))}
          </nav>
        </div>

        {/* Helpful Links */}
        <div className="py-4">
          <nav className="px-2 space-y-1">
            <NavLink
              href="/docs"
              target="_blank"
              icon={<Book />}
              label={t('docs')}
              isExternal
              data-cy="sidebar-link-docs"
            />
            <NavLink
              href={newGithubIssueUrl({
                user: 'FabInfra',
                repo: 'Attraccess',
                title: '[Bug] ',
                labels: ['bug'],
                body: `
### Environment / Umgebung

- **Browser:** ${navigator.userAgent}
- **Screen Size / Bildschirmgröße:** ${window.innerWidth}x${window.innerHeight}
- **Time / Zeit:** ${new Date().toISOString()}
- **User ID / Benutzer-ID:** ${user?.id || 'Not logged in / Nicht angemeldet'}
- **URL:** ${window.location.href}

### Description / Beschreibung

<!-- Please describe the bug in detail. Include steps to reproduce. -->
<!-- Bitte beschreibe den Fehler im Detail. Füge Schritte zur Reproduktion hinzu. -->
                  `,
              })}
              target="_blank"
              icon={<Github />} // Consider a more specific bug icon if available
              label={t('reportBug')}
              isExternal
              data-cy="sidebar-link-report-bug"
            />
            <NavLink
              href={newGithubIssueUrl({
                user: 'FabInfra',
                repo: 'Attraccess',
                title: '[Feature Request] ',
                labels: ['enhancement'],
                body: `
### Environment / Umgebung

- **Browser:** ${navigator.userAgent}
- **Screen Size / Bildschirmgröße:** ${window.innerWidth}x${window.innerHeight}
- **Time / Zeit:** ${new Date().toISOString()}
- **User ID / Benutzer-ID:** ${user?.id || 'Not logged in / Nicht angemeldet'}
- **URL:** ${window.location.href}

### Description / Beschreibung

<!-- Please describe the feature request in detail. Explain the use case. -->
<!-- Bitte beschreibe die Funktionsanfrage im Detail. Erkläre den Anwendungsfall. -->
                  `,
              })}
              target="_blank"
              icon={<Github />} // Consider a lightbulb or similar icon for features
              label={t('requestFeature')}
              isExternal
              data-cy="sidebar-link-request-feature"
            />
          </nav>
        </div>

        {/* User section at bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2" />
                <span>{user.username}</span>
              </div>
              <Dropdown data-cy="sidebar-settings-dropdown">
                <DropdownTrigger>
                  <Button variant="light" aria-label="Settings" isIconOnly data-cy="sidebar-settings-button">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu data-cy="sidebar-settings-dropdown-menu">
                  <DropdownItem
                    key="logout"
                    onPress={() => logout()}
                    startContent={<LogOut />}
                    data-cy="sidebar-logout-button"
                  >
                    {t('logout')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

import { Navigate, PathRouteProps } from 'react-router-dom';
import { ResourcesPage } from '../resources/ResourcesPage';
import { ResourceDetails } from '../resources/resourceDetails';
import { IoTSettings } from '../resources/iot-settings/iotSettings';
import { GroupDetails } from '../groups/groupDetails/groupDetails';
import { Database, ServerIcon, Key, Users } from 'lucide-react';
import React from 'react';
import { MqttServersPage } from '../mqtt/MqttServersPage';
import { SSOProvidersPage } from '../sso/SSOProvidersPage';
import { SystemPermissions } from '@attraccess/api-client';
import { UserManagementPage } from '../users/UserManagementPage';
export * as de from './translations/de';
export * as en from './translations/en';

// Extended route type that includes sidebar options
export interface RouteConfig extends Omit<PathRouteProps, 'children'> {
  sidebar?: {
    translationKey: string; // Key for translation
    icon: React.ReactNode;
    order?: number; // Optional ordering for sidebar items
  };
  authRequired: boolean | keyof SystemPermissions | (keyof SystemPermissions)[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/resources" replace />,
    authRequired: true,
  },
  {
    path: '/resources',
    element: <ResourcesPage />,
    sidebar: {
      translationKey: 'resources',
      icon: <Database className="h-5 w-5 mr-3" />,
      order: 1,
    },
    authRequired: true,
  },
  {
    path: '/resources/:id',
    element: <ResourceDetails />,
    authRequired: true,
  },
  {
    path: '/resources/:id/iot',
    element: <IoTSettings />,
    authRequired: 'canManageResources',
  },
  {
    path: '/groups/:id',
    element: <GroupDetails />,
    authRequired: true,
  },
  {
    path: '/mqtt/servers',
    element: <MqttServersPage />,
    sidebar: {
      translationKey: 'mqttServers',
      icon: <ServerIcon className="h-5 w-5 mr-3" />,
      order: 2,
    },
    authRequired: 'canManageResources',
  },
  {
    path: '/sso/providers',
    element: <SSOProvidersPage />,
    sidebar: {
      translationKey: 'ssoProviders',
      icon: <Key className="h-5 w-5 mr-3" />,
      order: 3,
    },
    authRequired: 'canManageSystemConfiguration',
  },
  {
    path: '/users/management',
    element: <UserManagementPage />,
    sidebar: {
      translationKey: 'userManagement',
      icon: <Users className="h-5 w-5 mr-3" />,
      order: 4,
    },
    authRequired: 'canManageUsers',
  },
];

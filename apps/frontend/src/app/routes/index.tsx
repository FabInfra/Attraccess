import { Navigate } from 'react-router-dom';
import { ResourceList } from '../resources/list.group';
import { ResourceDetails } from '../resources/resourceDetails';
import { IoTSettings } from '../resources/iot-settings/iotSettings';
import {
  Database,
  ServerIcon,
  Key,
  Users,
  Package,
  NfcIcon,
  ComputerIcon,
  FileChartColumnIncreasingIcon, Mail,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MqttServersPage, CreateMqttServerPage, EditMqttServerPage } from '../mqtt';
import { SSOProvidersPage } from '../sso/SSOProvidersPage';
import { UserManagementPage } from '../users/UserManagementPage';
import { usePluginStore } from 'react-pluggable';
import { RouteConfig } from '@attraccess/plugins-frontend-sdk';
import { PluginsList } from '../plugins/PluginsList';
import { PluginManifestWithPlugin } from '../plugins/plugin.state';
import usePluginState from '../plugins/plugin.state';
import { FabreaderList } from '../fabreader/FabreaderList/FabreaderList';
import { NfcCardList } from '../fabreader/NfcCardList/NfcCardList';
import { CsvExport } from '../csv-export/csv-export';
import { CreateMqttConfig, EditMqttConfig, TestMqttConfig } from '../resources/iot-settings/mqtt';
import { DocumentationEditor, DocumentationView } from '../resources/documentation';
import { EmailTemplatesPage } from '../email-templates/EmailTemplatesPage'; // Placeholder - to be created
import { EditEmailTemplatePage } from '../email-templates/EditEmailTemplatePage'; // Placeholder - to be created

const coreRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/resources" replace />,
    authRequired: true,
  },
  {
    path: '/resources',
    element: <ResourceList />,
    sidebar: {
      translationKey: 'resources',
      icon: <Database className="h-5 w-5" />,
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
    path: '/resources/:resourceId/iot/mqtt/create',
    element: <CreateMqttConfig />,
    authRequired: 'canManageResources',
  },
  {
    path: '/resources/:resourceId/iot/mqtt/edit/:configId',
    element: <EditMqttConfig />,
    authRequired: 'canManageResources',
  },
  {
    path: '/resources/:resourceId/iot/mqtt/test/:configId',
    element: <TestMqttConfig />,
    authRequired: 'canManageResources',
  },
  {
    path: '/resources/:id/documentation',
    element: <DocumentationView />,
    authRequired: true,
  },
  {
    path: '/resources/:id/documentation/edit',
    element: <DocumentationEditor />,
    authRequired: 'canManageResources',
  },
  {
    path: '/mqtt/servers',
    element: <MqttServersPage />,
    sidebar: {
      translationKey: 'mqttServers',
      icon: <ServerIcon className="h-5 w-5" />,
      order: 2,
    },
    authRequired: 'canManageResources',
  },
  {
    path: '/mqtt/servers/create',
    element: <CreateMqttServerPage />,
    authRequired: 'canManageResources',
  },
  {
    path: '/mqtt/servers/:serverId/edit',
    element: <EditMqttServerPage />,
    authRequired: 'canManageResources',
  },
  {
    path: '/sso/providers',
    element: <SSOProvidersPage />,
    sidebar: {
      translationKey: 'ssoProviders',
      icon: <Key className="h-5 w-5" />,
      order: 3,
    },
    authRequired: 'canManageSystemConfiguration',
  },
  {
    path: '/users/management',
    element: <UserManagementPage />,
    sidebar: {
      translationKey: 'userManagement',
      icon: <Users className="h-5 w-5" />,
      order: 4,
    },
    authRequired: 'canManageUsers',
  },
  {
    path: '/nfc-cards',
    element: <NfcCardList />,
    authRequired: true,
    sidebar: {
      translationKey: 'NFCCards',
      icon: <NfcIcon className="h-5 w-5" />,
      order: 5,
    },
  },
  {
    path: '/fabreader',
    element: <FabreaderList />,
    authRequired: 'canManageSystemConfiguration',
    sidebar: {
      translationKey: 'FabReader',
      icon: <ComputerIcon className="h-5 w-5" />,
      order: 6,
    },
  },
  {
    path: '/csv-export',
    element: <CsvExport />,
    authRequired: 'canManageResources',
    sidebar: {
      translationKey: 'csvExport',
      icon: <FileChartColumnIncreasingIcon />,
      order: 7,
    },
  },
  {
    path: '/plugins',
    element: <PluginsList />,
    authRequired: 'canManageSystemConfiguration',
    sidebar: {
      translationKey: 'plugins',
      icon: <Package className="h-5 w-5" />,
      order: 8,
    },
  },
  {
    path: '/admin/email-templates',
    element: <EmailTemplatesPage />,
    sidebar: {
      translationKey: 'emailTemplates',
      icon: <Mail className="h-5 w-5" />,
      order: 9,
    },
    authRequired: 'canManageSystemConfiguration',
  },
  {
    path: '/admin/email-templates/:id/edit',
    element: <EditEmailTemplatePage />,
    authRequired: 'canManageSystemConfiguration',
  },
];

export function useAllRoutes() {
  const { plugins: pluginManifests } = usePluginState();
  const pluginStore = usePluginStore();

  const [pluginRoutes, setPluginRoutes] = useState<RouteConfig[]>([]);

  const getRoutesOfPlugin = useCallback(
    (pluginManifest: PluginManifestWithPlugin) => {
      const pluginRoutes = pluginStore.executeFunction(
        `${pluginManifest.plugin.getPluginName()}.GET_ROUTES`,
        pluginManifest
      );

      return pluginRoutes;
    },
    [pluginStore]
  );

  useEffect(() => {
    const routesOfAllPlugins = pluginManifests.map((pluginManifest) => getRoutesOfPlugin(pluginManifest)).flat();
    setPluginRoutes(routesOfAllPlugins);
  }, [pluginManifests, getRoutesOfPlugin]);

  return useMemo(() => [...coreRoutes, ...pluginRoutes], [pluginRoutes]);
}

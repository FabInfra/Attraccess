import { User } from '@fabaccess/database-entities';
import { IPlugin } from 'react-pluggable';

export enum FrontendLocation {}

export enum FRONTEND_FUNCTION {
  GET_ROUTES = 'GET_ROUTES',
}

export const getPluginFunctionName = (pluginName: string, func: FRONTEND_FUNCTION) => {
  return `${pluginName}.${func}`;
};

export interface FabAccessFrontendPluginAuthData {
  authToken: string;
  user: User;
}

export interface FabAccessFrontendPlugin extends IPlugin {
  onApiAuthStateChange(authData: null | FabAccessFrontendPluginAuthData): void;
  onApiEndpointChange(endpoint: string): void;
}

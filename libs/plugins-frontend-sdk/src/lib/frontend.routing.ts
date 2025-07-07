import { SystemPermissions } from '@fabaccess/database-entities';
import { PathRouteProps } from 'react-router-dom';

// Extended route type that includes sidebar options
export interface RouteConfig extends Omit<PathRouteProps, 'children'> {
  authRequired: boolean | keyof SystemPermissions | (keyof SystemPermissions)[];
}

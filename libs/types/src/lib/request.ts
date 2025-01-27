import { User } from '@attraccess/database';
import { Request as BaseRequest } from 'express';

export interface AuthenticatedRequest extends BaseRequest {
  user: User;
  authInfo: {
    tokenId: string;
  };
  logout: () => Promise<void>;
}

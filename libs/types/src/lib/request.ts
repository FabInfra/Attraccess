import { Request as BaseRequest } from 'express';
import { User } from './user';

export interface AuthenticatedRequest extends BaseRequest {
  user: User;
  authInfo: {
    tokenId: string;
  };
  logout: () => Promise<void>;
}

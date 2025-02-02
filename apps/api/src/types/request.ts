import { User } from '../database/entities';
import { Request as BaseRequest } from 'express';

export interface AuthenticatedRequest extends BaseRequest {
  user: User;
  authInfo: {
    tokenId: string;
  };
  logout: () => Promise<void>;
}

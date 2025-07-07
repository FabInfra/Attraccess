import { User } from '@fabaccess/database-entities';
import { Request as BaseRequest } from 'express';

export interface AuthenticatedUser extends User {
  jwtTokenId: string;
}

export interface AuthenticatedRequest extends Omit<BaseRequest, 'logout'> {
  user: AuthenticatedUser;
  logout: (callback: () => void) => Promise<void>;
}

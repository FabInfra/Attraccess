import { z } from 'zod';
import { User } from '../database/entities';
import { Request as BaseRequest } from 'express';
import { loadEnv } from '@attraccess/env';

export interface AuthenticatedRequest extends BaseRequest {
  user: User;
  authInfo: {
    tokenId: string;
  };
  logout: () => Promise<void>;
}

const env = loadEnv((z) => ({
  MAX_PAGE_SIZE: z.number().min(1).max(100).default(100),
}));

export const PaginationOptionsSchema = z
  .object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(env.MAX_PAGE_SIZE).default(env.MAX_PAGE_SIZE),
  })
  .strip();

export type PaginationOptions = z.infer<typeof PaginationOptionsSchema>;

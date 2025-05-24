import * as path from 'path';
import { createConfigSchema, validateConfig } from '@attraccess/env';
import { z } from 'zod';
import { registerAs } from '@nestjs/config';

// Define the storage environment schema
const storageEnvSchema = createConfigSchema((z) => ({
  STORAGE_ROOT: z.string().default(path.join(process.cwd(), 'storage')),
  MAX_FILE_SIZE_BYTES: z.coerce.number().default(10 * 1024 * 1024), // 10MB
  CACHE_MAX_AGE_DAYS: z.coerce.number().default(7),
}));

// Validate the environment variables at startup
const env = validateConfig(storageEnvSchema);

// Runtime configuration that can be overridden
export const storageConfig = registerAs('storage', () => ({
  root: env.STORAGE_ROOT,
  maxFileSize: env.MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  cache: {
    maxAgeDays: env.CACHE_MAX_AGE_DAYS,
    directory: path.join(env.STORAGE_ROOT, 'cache'),
  },
  resources: {
    directory: path.join(env.STORAGE_ROOT, 'resources'),
  },
}));

// Type definitions for strongly typed access
export type StorageConfig = ReturnType<typeof storageConfig>;
export type AllowedMimeType = StorageConfig['allowedMimeTypes'][number];

import { Global, Module } from '@nestjs/common';
import { ConfigModule as EnvConfigModule } from '@attraccess/env';
import { storageConfig } from './storage.config';
import { databaseConfig } from '../database/datasource';
import { emailConfig } from '../email/email.config';
import { z } from 'zod';

/**
 * Global configuration module that validates environment variables
 * and provides configuration values to the application
 */
@Global()
@Module({
  imports: [
    EnvConfigModule.forRootWithZod(
      z.object({
        // Add global environment variables here
        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
        // Static file paths
        STATIC_FRONTEND_FILE_PATH: z.string().optional(),
        STATIC_DOCS_FILE_PATH: z.string().optional(),
      }),
      {
        // Load all configuration providers
        load: [
          storageConfig,
          databaseConfig,
          emailConfig,
        ],
        // Cache the configuration
        cache: true,
        // Make configuration available everywhere
        isGlobal: true,
      }
    ),
  ],
})
export class ConfigModule {}

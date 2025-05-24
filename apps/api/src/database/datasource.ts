// typeorm.config.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import { createConfigSchema, validateConfig } from '@attraccess/env';
import { join, resolve } from 'path';
import { entities } from '@attraccess/database-entities';
import * as migrations from './migrations';
import { storageConfig } from '../config/storage.config';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Define database type schema
const dbTypeSchema = createConfigSchema((z) => ({
  DB_TYPE: z.enum(['postgres', 'sqlite']).default('sqlite'),
}));

// Validate database type at startup
const envType = validateConfig(dbTypeSchema);

// Define base database configuration
let dbConfig: Partial<DataSourceOptions> = {
  type: envType.DB_TYPE,
  synchronize: false,
  migrations: Object.values(migrations),
  migrationsTableName: 'migrations',
  migrationsRun: true,
  entities: Object.values(entities),
};

// Define PostgreSQL configuration schema
const postgresSchema = createConfigSchema((z) => ({
  DB_HOST: z.string(),
  DB_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
}));

function loadPostgresConfig() {
  // Validate PostgreSQL configuration at startup
  const env = validateConfig(postgresSchema);

  dbConfig = {
    ...dbConfig,
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  } as DataSourceOptions;
}

function loadSqliteConfig() {
  const dbFile = resolve(join(storageConfig().root, 'attraccess.sqlite'));

  console.log('SQLite database file:', dbFile);

  dbConfig = {
    ...dbConfig,
    type: 'sqlite',
    database: dbFile,
  } as DataSourceOptions;
}

// Load the appropriate database configuration based on the database type
switch (envType.DB_TYPE) {
  case 'postgres':
    loadPostgresConfig();
    break;

  case 'sqlite':
    loadSqliteConfig();
    break;

  default:
    throw new Error('Unknown Database type in DB_TYPE env');
}

// Export the database configuration for use in the application
export const dataSourceConfig = dbConfig;

// Export a database configuration provider for NestJS
export const databaseConfig = registerAs('database', () => dbConfig);

// Export a DataSource instance for TypeORM
export default new DataSource(dataSourceConfig as DataSourceOptions);

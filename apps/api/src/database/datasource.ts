// typeorm.config.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import { loadEnv } from '@fabaccess/env';
import { join, resolve } from 'path';
import { entities } from '@fabaccess/database-entities';
import * as migrations from './migrations';
import { existsSync } from 'fs';

const envType = loadEnv((z) => ({
  DB_TYPE: z.enum(['postgres', 'sqlite']).default('sqlite'),
}));

let dbConfig: Partial<DataSourceOptions> = {
  type: envType.DB_TYPE,
  synchronize: false,
  migrations: Object.values(migrations),
  migrationsTableName: 'migrations',
  migrationsRun: true,
  entities: Object.values(entities),
};

function loadPostgresConfig() {
  const env = loadEnv((z) => ({
    DB_HOST: z.string(),
    DB_PORT: z
      .string()
      .refine((port: string) => parseInt(port) > 0 && parseInt(port) < 65536)
      .transform((port: string) => parseInt(port)),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
  }));

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
  const storageEnv = loadEnv((z) => ({ STORAGE_ROOT: z.string().default(join(process.cwd(), 'storage')) }));
  const fabaccessDbFile = resolve(join(storageEnv.STORAGE_ROOT, 'attraccess.sqlite'));
  const attraccessDbFile = resolve(join(storageEnv.STORAGE_ROOT, 'attraccess.sqlite'));

  let dbFile = fabaccessDbFile;
  if (existsSync(attraccessDbFile)) {
    dbFile = attraccessDbFile;
  }

  console.log('dbFile', dbFile);

  dbConfig = {
    ...dbConfig,
    type: 'sqlite',
    database: dbFile,
  } as DataSourceOptions;
}

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

export const dataSourceConfig = dbConfig;

export default new DataSource(dataSourceConfig as DataSourceOptions);

// typeorm.config.ts

import { DataSource } from 'typeorm';
import { entities } from './entities';
import { loadEnv } from '@attraccess/env';
import { join } from 'path';

const env = loadEnv((z) => ({
  DB_TYPE: z.enum(['postgres', 'mysql']),
  DB_HOST: z.string(),
  DB_PORT: z
    .string()
    .refine((port) => parseInt(port) > 0 && parseInt(port) < 65536)
    .transform((port) => parseInt(port)),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
}));

export const dataSourceConfig = {
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: false,
  autoLoadEntities: false,
  migrations: [join(__dirname, 'migrations', '**', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  entities: Object.values(entities),
};

export default new DataSource(dataSourceConfig);

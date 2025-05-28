import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { LogLevel } from '@nestjs/common';

const AppEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVELS: z
    .string()
    .default('log,error,warn')
    .transform(
      (val) =>
        val
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean) as LogLevel[]
    )
    .refine((levels) => levels.every((l) => ['log', 'error', 'warn', 'debug', 'verbose'].includes(l)), {
      message: 'Invalid log level(s). Allowed: log, error, warn, debug, verbose.',
    }),
  AUTH_SESSION_SECRET: z.string().min(1, { message: 'AUTH_SESSION_SECRET is required' }),
  FRONTEND_URL: z.string().url({ message: 'FRONTEND_URL must be a valid URL' }).default('http://localhost:5173'),
  GLOBAL_PREFIX: z.string().default('api'),
  VERSION: z.string().default(process.env.npm_package_version || '1.0.0'),
  AUTH_JWT_SECRET: z.string(),
  AUTH_JWT_ORIGIN: z.string().optional(),
  STATIC_FRONTEND_FILE_PATH: z.string().optional(),
  STATIC_DOCS_FILE_PATH: z.string().optional(),
  PLUGIN_DIR: z.string().optional(),
  RESTART_BY_EXIT: z.coerce.boolean().default(false),
  DISABLE_PLUGINS: z.coerce.boolean().default(false),
});

export type AppConfigType = z.infer<typeof AppEnvSchema>;

const appConfigFactory = (): AppConfigType => {
  try {
    return AppEnvSchema.parse(process.env);
  } catch (e) {
    console.error('Failed to parse App Environment Variables:', e.errors);
    throw new Error('Invalid application environment configuration.');
  }
};

export default registerAs('app', appConfigFactory);

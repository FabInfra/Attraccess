import { z } from 'zod';
import { createConfigSchema } from './config/validation';

// Re-export all configuration utilities
export * from './config';

type SchemaDefinition = { [key: string]: z.ZodType };

/**
 * Load environment variables with validation
 * @deprecated Use the NestJS ConfigService instead
 * @param schema A function that takes Zod and returns a schema definition
 * @param env The environment object (defaults to process.env)
 * @returns The validated environment variables
 */
export function loadEnv<TSchema extends SchemaDefinition>(
  schema: (zod: typeof z) => TSchema,
  env: typeof process.env = process.env
): z.infer<z.ZodObject<TSchema>> {
  const envSchema = createConfigSchema(schema);
  return envSchema.parse(env);
}

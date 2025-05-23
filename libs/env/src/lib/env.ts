import { z } from 'zod';

type SchemaDefinition = { [key: string]: z.ZodType };

export function loadEnv<TSchema extends SchemaDefinition>(
  schema: (zod: typeof z) => TSchema,
  env: typeof process.env = process.env
): z.infer<z.ZodObject<TSchema>> {
  const zodSchema = schema(z);
  const envSchema = z.object(zodSchema);

  return envSchema.parse(env);
}

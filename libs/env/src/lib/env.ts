import { z } from 'zod';

type SchemaDefinition = { [key: string]: z.ZodType };

export function loadEnv<TSchema extends SchemaDefinition>(
  schema: TSchema | ((z) => TSchema),
  env: typeof process.env = process.env
): z.infer<z.ZodObject<TSchema>> {
  const zodSchema = typeof schema === 'function' ? schema(z) : schema;

  return z.object(zodSchema).parse(env);
}

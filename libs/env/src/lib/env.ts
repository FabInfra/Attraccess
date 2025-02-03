import { z } from 'zod';

type SchemaDefinition = { [key: string]: z.ZodType };

export function loadEnv<TSchema extends SchemaDefinition>(
  schema: (z) => TSchema,
  env: typeof process.env = process.env
): z.infer<z.ZodObject<TSchema>> {
  const zodSchema = schema(z);

  return z.object(zodSchema).parse(env);
}

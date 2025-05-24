import { z } from 'zod';

/**
 * Validates environment variables against a Zod schema
 * @param schema The Zod schema to validate against
 * @param config The configuration object to validate (typically process.env)
 * @returns The validated configuration object
 * @throws If validation fails
 */
export function validateConfig<T extends z.ZodTypeAny>(
  schema: T,
  config: Record<string, unknown> = process.env,
): z.infer<T> {
  const result = schema.safeParse(config);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    const formattedError = result.error.format();
    console.error(JSON.stringify(formattedError, null, 2));
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

/**
 * Creates a Zod schema from a schema definition function
 * @param schemaFn A function that takes Zod and returns a schema definition
 * @returns A Zod object schema
 */
export function createConfigSchema<TSchema extends { [key: string]: z.ZodType }>(
  schemaFn: (zod: typeof z) => TSchema,
): z.ZodObject<TSchema> {
  const zodSchema = schemaFn(z);
  return z.object(zodSchema);
}
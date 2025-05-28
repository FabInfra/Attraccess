import { z } from 'zod';

type SchemaDefinition = { [key: string]: z.ZodType };

const schemaCache = new Map<(zod: typeof z) => SchemaDefinition, z.ZodObject<SchemaDefinition>>();

export function loadEnv<TSchema extends SchemaDefinition>(
  schema: (zod: typeof z) => TSchema,
  env: typeof process.env = process.env
): z.infer<z.ZodObject<TSchema>> {
  const schemaKey = schema as (zod: typeof z) => SchemaDefinition;
  if (schemaCache.has(schemaKey)) {
    const cachedSchemaObject = schemaCache.get(schemaKey);
    // If cachedSchemaObject is found, parse and return
    if (cachedSchemaObject) {
      // We cast to z.ZodObject<any> then to the inferred type to satisfy generics.
      // This assumes TSchema is compatible enough with SchemaDefinition for parsing.
      return (cachedSchemaObject as z.ZodObject<SchemaDefinition>).parse(env) as z.infer<z.ZodObject<TSchema>>;
    }
  }

  const zodSchema = schema(z);
  const envSchema = z.object(zodSchema) as z.ZodObject<TSchema>;
  // Cast envSchema to the map's value type before setting.
  schemaCache.set(schemaKey, envSchema as unknown as z.ZodObject<SchemaDefinition>);

  return envSchema.parse(env);
}

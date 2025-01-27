import { z, ZodObjectDef, ZodUnionDef } from 'zod';

export function loadEnv<
  TSchema extends z.ZodType<Record<string, any>, ZodObjectDef | ZodUnionDef>
>(schema: TSchema, env: typeof process.env = process.env) {
  return schema.parse(env);
}

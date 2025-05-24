import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { createConfigSchema } from './validation';

/**
 * Compatibility layer for the loadEnv function
 * This service allows existing code to continue using the loadEnv pattern
 * while leveraging the NestJS ConfigService under the hood
 */
@Injectable()
export class EnvCompatService {
  constructor(private configService: ConfigService) {}

  /**
   * Load environment variables with validation
   * @param schemaFn A function that takes Zod and returns a schema definition
   * @param env The environment object (defaults to process.env)
   * @returns The validated environment variables
   */
  loadEnv<TSchema extends { [key: string]: z.ZodType }>(
    schemaFn: (zod: typeof z) => TSchema,
    env: Record<string, unknown> = process.env,
  ): z.infer<z.ZodObject<TSchema>> {
    const schema = createConfigSchema(schemaFn);
    return schema.parse(env);
  }

  /**
   * Get a configuration value
   * @param key The configuration key
   * @returns The configuration value
   */
  get<T>(key: string): T | undefined {
    return this.configService.get<T>(key);
  }

  /**
   * Get a required configuration value
   * @param key The configuration key
   * @returns The configuration value
   * @throws If the configuration value is not defined
   */
  getRequired<T>(key: string): T {
    const value = this.configService.get<T>(key);
    if (value === undefined) {
      throw new Error(`Required configuration key "${key}" is not defined`);
    }
    return value;
  }
}
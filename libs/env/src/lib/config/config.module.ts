import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { z } from 'zod';
import { validateConfig } from './validation';

@Global()
@Module({})
export class ConfigModule {
  /**
   * Register the ConfigModule with validation
   * @param options Configuration options
   * @returns A dynamic module
   */
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          cache: true,
          isGlobal: true,
          ...options,
          validate: options.validate || undefined,
        }),
      ],
      exports: [NestConfigModule],
    };
  }

  /**
   * Register the ConfigModule with Zod validation
   * @param schema The Zod schema to validate against
   * @param options Additional configuration options
   * @returns A dynamic module
   */
  static forRootWithZod<T extends z.ZodTypeAny>(
    schema: T,
    options: Omit<ConfigModuleOptions, 'validate'> = {},
  ): DynamicModule {
    return this.forRoot({
      ...options,
      validate: (config) => validateConfig(schema, config),
    });
  }
}
# Environment Configuration

This library provides utilities for loading and validating environment variables using NestJS ConfigModule and Zod.

## Usage

### Basic Usage

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {
    // Get a configuration value
    const value = this.configService.get<string>('key');
    
    // Get a nested configuration value
    const storageRoot = this.configService.get<string>('storage.root');
  }
}
```

### Configuration Module

The ConfigModule is a global module that provides configuration values to the application. It uses Zod for validation and NestJS ConfigModule for configuration management.

```typescript
import { ConfigModule } from '@attraccess/env';
import { z } from 'zod';

@Module({
  imports: [
    ConfigModule.forRootWithZod(
      z.object({
        // Define environment variables with validation
        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
        PORT: z.coerce.number().default(3000),
      }),
      {
        // Load configuration providers
        load: [myConfig],
        // Cache the configuration
        cache: true,
        // Make configuration available everywhere
        isGlobal: true,
      }
    ),
  ],
})
export class AppModule {}
```

### Configuration Providers

Configuration providers are functions that return configuration objects. They can be registered with the ConfigModule using the `load` option.

```typescript
import { registerAs } from '@nestjs/config';
import { createConfigSchema, validateConfig } from '@attraccess/env';
import { z } from 'zod';

// Define the schema
const mySchema = createConfigSchema((z) => ({
  MY_ENV_VAR: z.string(),
  MY_NUMBER: z.coerce.number().default(42),
}));

// Validate the environment variables at startup
const env = validateConfig(mySchema);

// Create a configuration provider
export const myConfig = registerAs('myNamespace', () => ({
  myEnvVar: env.MY_ENV_VAR,
  myNumber: env.MY_NUMBER,
}));
```

### Legacy Support

For backward compatibility, the `loadEnv` function is still available but marked as deprecated. It's recommended to use the ConfigService instead.

```typescript
import { loadEnv } from '@attraccess/env';

// This still works but is deprecated
const env = loadEnv((z) => ({
  MY_ENV_VAR: z.string(),
}));
```

## Migration Guide

To migrate from the old `loadEnv` approach to the new ConfigService:

1. Create a configuration schema using `createConfigSchema`
2. Validate the environment variables using `validateConfig`
3. Create a configuration provider using `registerAs`
4. Register the configuration provider with the ConfigModule
5. Inject the ConfigService into your services
6. Use the ConfigService to get configuration values

Example:

```typescript
// Before
const env = loadEnv((z) => ({
  MY_ENV_VAR: z.string(),
}));

// After
const mySchema = createConfigSchema((z) => ({
  MY_ENV_VAR: z.string(),
}));

const env = validateConfig(mySchema);

export const myConfig = registerAs('myNamespace', () => ({
  myEnvVar: env.MY_ENV_VAR,
}));
```

Then in your service:

```typescript
@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {
    const myEnvVar = this.configService.get<string>('myNamespace.myEnvVar');
  }
}
```

## Building

Run `nx build env` to build the library.

## Running unit tests

Run `nx test env` to execute the unit tests via [Jest](https://jestjs.io).

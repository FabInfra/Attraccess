import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { createConfigSchema } from '@attraccess/env';

// Register JWT configuration
export const jwtConfig = registerAs('jwt', () => {
  const schema = createConfigSchema((z) => ({
    AUTH_JWT_ORIGIN: z.enum(['FILE', 'ENV']),
    AUTH_JWT_SECRET: z.string().optional(),
  }));
  
  const config = schema.parse(process.env);
  
  let jwtSecret: string;
  switch (config.AUTH_JWT_ORIGIN) {
    case 'FILE': {
      const jwtKeyPath = resolve(join('secrets', 'jwt.key'));
      if (!existsSync(jwtKeyPath)) {
        throw new Error('jwt.key file does not exist at ' + jwtKeyPath);
      }
      jwtSecret = readFileSync(jwtKeyPath).toString().trim();

      if (!jwtSecret) {
        throw new Error('jwt.key file is empty');
      }
      break;
    }

    case 'ENV':
      jwtSecret = config.AUTH_JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('AUTH_JWT_SECRET is not set');
      }
      break;

    default:
      throw new Error(`Unknown jwt secret origin: ${config.AUTH_JWT_ORIGIN}`);
  }
  
  return {
    secret: jwtSecret,
  };
});

// For backward compatibility
export const jwtConstants = {
  get secret() {
    return jwtConfig().secret;
  }
};

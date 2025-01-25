import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const jwtSecretOrigin = process.env.AUTH_JWT_ORIGIN;
if (!jwtSecretOrigin) {
  throw new Error('AUTH_JWT_ORIGIN is not set');
}

let jwtSecret: string;
switch (jwtSecretOrigin) {
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
    jwtSecret = process.env.AUTH_JWT_SECRET as string;
    if (!jwtSecret) {
      throw new Error('AUTH_JWT_SECRET is not set');
    }
    break;

  default:
    throw new Error(`Unknown jwt secret origin: ${jwtSecretOrigin}`);
}

export const jwtConstants = {
  secret: jwtSecret,
};

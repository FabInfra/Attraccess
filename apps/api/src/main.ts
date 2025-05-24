import { bootstrap } from './main.bootstrap';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { createConfigSchema } from '@attraccess/env';

// Register server configuration
export const serverConfig = registerAs('server', () => {
  const schema = createConfigSchema((z) => ({
    PORT: z.coerce.number().default(3000),
  }));
  return schema.parse(process.env);
});

async function main() {
  const { app, globalPrefix } = await bootstrap();
  
  // Get port from config
  const config = serverConfig();
  const port = config.PORT;
  
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

main();

import { bootstrap } from './main.bootstrap';
import { Logger } from '@nestjs/common';

async function main() {
  const { app, globalPrefix } = await bootstrap();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

main();

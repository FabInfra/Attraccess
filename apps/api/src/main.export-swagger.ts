import { join } from 'path';
import { bootstrap } from './main.bootstrap';
import { writeFileSync } from 'fs';

async function main() {
  const { swaggerDocumentFactory } = await bootstrap();

  const distDir = join(__dirname, '../../apps/api-swagger');
  const swaggerDocument = swaggerDocumentFactory();
  writeFileSync(
    join(distDir, 'swagger.json'),
    JSON.stringify(swaggerDocument, null, 2)
  );
}

main();

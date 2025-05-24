import { join } from 'path';
import { writeFileSync } from 'fs';

async function main() {
  console.log('Exporting swagger');

  console.log('Bootstrapping');

  // Set environment variables for swagger export
  process.env.DISABLE_PLUGINS = 'true';
  
  // Import plugin config to ensure it's registered
  await import('./plugin-system/plugin.service');
  const main = await import('./main.bootstrap');
  const { swaggerDocumentFactory } = await main.bootstrap();

  console.log('Creating swagger document');
  const distDir = join(__dirname, '../../apps/api-swagger');
  const swaggerDocument = swaggerDocumentFactory();

  console.log('Writing swagger');
  writeFileSync(join(distDir, 'swagger.json'), JSON.stringify(swaggerDocument, null, 2));

  console.log('Done');
  process.exit(0);
}

main();

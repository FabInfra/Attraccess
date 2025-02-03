import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('AttrAccess API')
    .setDescription(
      'The AttrAccess API used to manage machine and tool access in a Makerspace or FabLab'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  return { app, globalPrefix, swaggerDocumentFactory: documentFactory };
}

bootstrap();

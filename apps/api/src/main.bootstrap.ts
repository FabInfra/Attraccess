import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor, Logger, LogLevel } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { ConfigService } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { createConfigSchema, validateConfig } from '@attraccess/env';
import { DataSource } from 'typeorm';
import { z } from 'zod';

// Register auth configuration
export const authConfig = registerAs('auth', () => {
  const schema = createConfigSchema((z) => ({
    AUTH_SESSION_SECRET: z.string(),
    LOG_LEVELS: z.string().default('error,warn,log'),
  }));
  
  return schema.parse(process.env);
});

export async function bootstrap() {
  const bootstrapLogger = new Logger('Bootstrap');
  bootstrapLogger.log('Starting bootstrap process...');

  // Get auth config
  const config = authConfig();
  
  const logLevels = config.LOG_LEVELS
    .split(',')
    .filter((level): level is LogLevel => ['error', 'warn', 'log', 'debug', 'verbose'].includes(level));

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logLevels,
  });
  bootstrapLogger.log('Main application instance created.');

  // Run migrations before the app fully starts
  try {
    bootstrapLogger.log('Running database migrations...');
    const dataSource = app.get(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      bootstrapLogger.log('Database connection initialized.');
    }

    bootstrapLogger.log(
      'Known Migrations: ',
      dataSource.migrations.map((m) => m.name)
    );
    const pendingMigrations = await dataSource.showMigrations();
    if (pendingMigrations) {
      bootstrapLogger.log('Pending migrations detected, running migrations...');
      await dataSource.runMigrations();
      bootstrapLogger.log('Migrations completed successfully.');
    } else {
      bootstrapLogger.log('No pending migrations found.');
    }
  } catch (error) {
    bootstrapLogger.error('Failed to run database migrations');
    bootstrapLogger.error(error);
    process.exit(1);
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  app.useWebSocketAdapter(new WsAdapter(app));

  app.use(
    session({
      secret: config.AUTH_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  bootstrapLogger.log(`🚀 Application is running with global prefix: ${globalPrefix}`);
  bootstrapLogger.log(`📝 Enabled log levels: ${logLevels.join(', ')}`);

  const configService = app.get(ConfigService);
  const storageCfg = configService.get('storage');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));

  app.useStaticAssets(storageCfg.root, {
    prefix: '/storage',
    maxAge: 24 * 60 * 60 * 1000,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Attraccess API')
    .setDescription('The Attraccess API used to manage machine and tool access in a Makerspace or FabLab')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  bootstrapLogger.log('Bootstrap process completed.');
  return { app, globalPrefix, swaggerDocumentFactory: documentFactory };
}

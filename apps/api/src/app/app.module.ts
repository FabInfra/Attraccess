import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAndAuthModule } from '../users-and-auth/users-and-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from '../database/datasource';
import { ResourcesModule } from '../resources/resources.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import storageConfigObject, { StorageConfigType } from '../config/storage.config';
import appConfiguration from '../config/app.config';
import { AppConfigType } from '../config/app.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { PluginModule } from '../plugin-system/plugin.module';
import { FabReaderModule } from '../fabreader/fabreader.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { APP_FILTER } from '@nestjs/core';
import { StructuredApiErrorFilter, HttpExceptionFilter } from '../common/filters/structured-api-error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration, storageConfigObject],
      isGlobal: true,
    }),

    EventEmitterModule.forRoot(),
    UsersAndAuthModule,
    TypeOrmModule.forRoot(dataSourceConfig),
    ResourcesModule,
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<AppConfigType>('app');
        if (!appConfig || !appConfig.STATIC_DOCS_FILE_PATH) {
          console.error('STATIC_DOCS_FILE_PATH not configured. Docs will not be served.');
          return [];
        }
        const resolvedDocsPath = resolve(appConfig.STATIC_DOCS_FILE_PATH);
        console.log('Serving docs from (via config): ', resolvedDocsPath);
        return [
          {
            rootPath: resolvedDocsPath,
            serveRoot: '/docs',
          },
        ];
      },
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storageConfig = configService.get<StorageConfigType>('storage');
        if (!storageConfig || !storageConfig.cdn.root) {
          console.error('CDN_ROOT not configured. CDN will not be served.');
          return [];
        }

        const cdnRoot = resolve(storageConfig.cdn.root);
        console.log('Serving cdn files from (via config): ', cdnRoot);
        return [
          {
            rootPath: cdnRoot,
            serveRoot: storageConfig.cdn.serveRoot,
          },
        ];
      },
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<AppConfigType>('app');
        if (!appConfig || !appConfig.STATIC_FRONTEND_FILE_PATH) {
          console.error('STATIC_FRONTEND_FILE_PATH not configured. Frontend will not be served.');
          return [];
        }
        const resolvedFrontendPath = resolve(appConfig.STATIC_FRONTEND_FILE_PATH);
        console.log('Serving frontend from (via config): ', resolvedFrontendPath);
        return [
          {
            rootPath: resolvedFrontendPath,
            // serveRoot: '/' // Default serveRoot is '/'
          },
        ];
      },
    }),
    PluginModule.forRoot(),
    FabReaderModule,
    AnalyticsModule,
    EmailTemplateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: StructuredApiErrorFilter,
    },
  ],
})
export class AppModule {}

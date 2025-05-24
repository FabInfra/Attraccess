import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAndAuthModule } from '../users-and-auth/users-and-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from '../database/datasource';
import { ResourcesModule } from '../resources/resources.module';
import { ConfigModule as AppConfigModule } from '../config/config.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve, join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MqttModule } from '../mqtt/mqtt.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { Module } from '@nestjs/common';
import { PluginModule } from '../plugin-system/plugin.module';
import { FabReaderModule } from '../fabreader/fabreader.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { registerAs } from '@nestjs/config';

import { createConfigSchema } from '@attraccess/env';

// Register static file paths configuration
export const staticPathsConfig = registerAs('staticPaths', () => {
  const schema = createConfigSchema((z) => ({
    STATIC_FRONTEND_FILE_PATH: z.string().optional(),
    STATIC_DOCS_FILE_PATH: z.string().optional(),
  }));
  
  const config = schema.parse(process.env);
  
  const frontendPath = resolve(config.STATIC_FRONTEND_FILE_PATH || join(__dirname, 'public'));
  const docsPath = resolve(config.STATIC_DOCS_FILE_PATH || join(__dirname, 'docs'));
  
  console.log('Serving frontend from ', frontendPath);
  console.log('Serving docs from: ', docsPath);
  
  return {
    frontendPath,
    docsPath
  };
});

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      load: [staticPathsConfig]
    }), // Import the global ConfigModule with static paths config
    EventEmitterModule.forRoot(),
    UsersAndAuthModule,
    TypeOrmModule.forRoot(dataSourceConfig),
    ResourcesModule,
    MqttModule,
    WebhooksModule,
    ServeStaticModule.forRoot({
      rootPath: staticPathsConfig().docsPath,
      serveRoot: '/docs',
    }),
    ServeStaticModule.forRoot({
      rootPath: staticPathsConfig().frontendPath,
    }),
    PluginModule.forRoot(),
    FabReaderModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

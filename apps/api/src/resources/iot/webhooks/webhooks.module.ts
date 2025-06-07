import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookConfig, Resource } from '@attraccess/database-entities';
import { WebhookConfigController } from './config/webhook-config.controller';
import { WebhookConfigService } from './config/webhook-config.service';
import { WebhookPublisherService } from './publisher/webhook-publisher.service';
import { ConfigModule } from '@nestjs/config';
import { IotService } from '../iot.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookConfig, Resource]), ConfigModule],
  controllers: [WebhookConfigController],
  providers: [WebhookConfigService, WebhookPublisherService, IotService],
  exports: [WebhookPublisherService],
})
export class WebhooksModule {}

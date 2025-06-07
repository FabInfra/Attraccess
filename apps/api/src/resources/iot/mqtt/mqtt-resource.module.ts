import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttResourceConfig, Resource } from '@attraccess/database-entities';
import { MqttResourceConfigController } from './config/mqtt-resource-config.controller';
import { MqttResourceConfigService } from './config/mqtt-resource-config.service';
import { MqttPublisherService } from './publisher/mqtt-publisher.service';
import { MqttModule } from '../../../mqtt/mqtt.module';
import { IotService } from '../iot.service';

@Module({
  imports: [TypeOrmModule.forFeature([MqttResourceConfig, Resource]), MqttModule],
  controllers: [MqttResourceConfigController],
  providers: [MqttResourceConfigService, MqttPublisherService, IotService],
  exports: [MqttResourceConfigService],
})
export class MqttResourceModule {}

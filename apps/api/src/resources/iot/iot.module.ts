import { Module } from '@nestjs/common';
import { WebhooksModule } from './webhooks/webhooks.module';
import { MqttResourceModule } from './mqtt/mqtt-resource.module';
import { IotService } from './iot.service';

@Module({
  imports: [WebhooksModule, MqttResourceModule],
  controllers: [],
  providers: [IotService],
  exports: [MqttResourceModule, WebhooksModule, IotService],
})
export class IotModule {}

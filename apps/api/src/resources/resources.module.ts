import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Resource,
  ResourceUsage,
  ResourceIntroduction,
  ResourceIntroducer,
  ResourceIntroductionHistoryItem,
  User,
  ResourceGroup,
} from '@attraccess/database-entities';
import { ResourcesController } from './resources.controller';
import { ResourcePermissionsGuard } from './guards/resourcePermissions.guard';
import { ResourceUsageController } from './usage/resourceUsage.controller';
import { ResourceUsageService } from './usage/resourceUsage.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FileStorageModule } from '../common/modules/file-storage.module';
import { ResourceIntroductionController } from './introduction/resourceIntroduction.controller';
import { ResourceIntroductionService } from './introduction/resourceIntroduction.service';
import { UsersAndAuthModule } from '../users-and-auth/users-and-auth.module';
import { ResourceIntroducersController } from './introducers/resourceIntroducers.controller';
import { MqttResourceModule } from './mqtt/mqtt-resource.module';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from '../mqtt/mqtt.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { ResourcesCoreModule } from './resources-core.module';
import { SSEModule } from './sse/sse.module';
import { ResourceGroupsController } from './groups/resourceGroups.controller';
import { ResourceGroupsService } from './groups/resourceGroups.service';
import { ResourceGroupIntroducersController } from './groups/introducers/resourceGroupIntroducers.controller';
import { ResourceGroupIntroductionService } from './groups/introductions/resourceGroupIntroduction.service';
import { ResourceGroupIntroductionController } from './groups/introductions/resourceGroupIntroduction.controller';
import { ResourceGroupIntroducersService } from './groups/introducers/resourceGroupIntroducers.service';
import { ResourceIntroducersService } from './introducers/resourceIntroducers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resource,
      ResourceUsage,
      ResourceIntroduction,
      ResourceIntroducer,
      ResourceIntroductionHistoryItem,
      User,
      ResourceGroup,
    ]),
    ScheduleModule.forRoot(),
    FileStorageModule,
    UsersAndAuthModule,
    MqttResourceModule,
    ConfigModule,
    MqttModule,
    ResourcesCoreModule,
    SSEModule,
    forwardRef(() => WebhooksModule),
  ],
  controllers: [
    ResourceGroupsController,
    ResourcesController,
    ResourceUsageController,
    ResourceIntroductionController,
    ResourceIntroducersController,
    ResourceGroupIntroducersController,
    ResourceGroupIntroductionController,
  ],
  providers: [
    ResourcePermissionsGuard,
    ResourceUsageService,
    ResourceIntroductionService,
    ResourceIntroducersService,
    ResourceGroupsService,
    ResourceGroupIntroductionService,
    ResourceGroupIntroducersService,
  ],
  exports: [
    ResourceUsageService,
    ResourceIntroductionService,
    ResourceIntroducersService,
    ResourcesCoreModule,
    ResourceGroupsService,
    ResourceGroupIntroductionService,
    ResourceGroupIntroducersService,
  ],
})
export class ResourcesModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Resource,
  ResourceUsage,
  ResourceIntroduction,
  ResourceIntroductionUser,
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
import { ResourceIntroducersController } from './introduction/resourceIntroducers.controller';
import { MqttResourceModule } from './mqtt/mqtt-resource.module';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from '../mqtt/mqtt.module';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { ResourcesCoreModule } from './resources-core.module';
import { SSEModule } from './sse/sse.module';
import { ResourceGroupsController } from './groups/resource-groups.controller';
import { GroupIntroductionController } from './groups/introduction/groupIntroduction.controller';
import { GroupIntroducersController } from './groups/introduction/groupIntroducers.controller';
import { GroupsService } from './groups/groups.service';
import { GroupIntroductionService } from './groups/introduction/groupIntroduction.service';
import { ResourceGroupsService } from './groups/resource-groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resource,
      ResourceUsage,
      ResourceIntroduction,
      ResourceIntroductionUser,
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
    SSEModule,
    ResourcesCoreModule,
    forwardRef(() => WebhooksModule),
  ],
  controllers: [
    ResourcesController,
    ResourceUsageController,
    ResourceIntroductionController,
    ResourceIntroducersController,
    ResourceGroupsController,
    GroupIntroductionController,
    GroupIntroducersController,
  ],
  providers: [
    ResourcePermissionsGuard,
    ResourceUsageService,
    ResourceIntroductionService,
    GroupsService,
    ResourceGroupsService,
    GroupIntroductionService,
  ],
  exports: [
    ResourceUsageService,
    ResourceIntroductionService,
    GroupsService,
    ResourceGroupsService,
    GroupIntroductionService,
    ResourcesCoreModule,
  ],
})
export class ResourcesModule {}

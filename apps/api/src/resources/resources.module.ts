import { Module } from '@nestjs/common';
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
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from '../mqtt/mqtt.module';
import { ResourcesCoreModule } from './resources-core.module';
import { SSEModule } from './sse/sse.module';
import { ResourceGroupsController } from './groups/resourceGroups.controller';
import { ResourceGroupsService } from './groups/resourceGroups.service';
import { IotModule } from './iot/iot.module';

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
    ConfigModule,
    MqttModule,
    ResourcesCoreModule,
    SSEModule,
    IotModule,
  ],
  controllers: [
    ResourceGroupsController,
    ResourcesController,
    ResourceUsageController,
    ResourceIntroductionController,
    ResourceIntroducersController,
  ],
  providers: [ResourcePermissionsGuard, ResourceUsageService, ResourceIntroductionService, ResourceGroupsService],
  exports: [ResourceUsageService, ResourceIntroductionService, ResourcesCoreModule, ResourceGroupsService],
})
export class ResourcesModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource, ResourceGroup, User } from '@attraccess/database-entities';
import { ResourcesService } from './resources.service';
import { FileStorageModule } from '../common/modules/file-storage.module';
import { ResourceImageService } from '../common/services/resource-image.service';
import { CanManageResourcesGuard } from './guards/can-manage-resources.guard';
import { ResourceGroupsService } from './groups/resourceGroups.service';

/**
 * Core module that provides ResourcesService and related guards
 * This module can be imported by other modules that need these services
 * without creating circular dependencies
 */
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Resource, User, ResourceGroup]), FileStorageModule],
  providers: [ResourcesService, ResourceImageService, ResourceGroupsService, CanManageResourcesGuard],
  exports: [ResourcesService, ResourceGroupsService, CanManageResourcesGuard],
})
export class ResourcesCoreModule {}

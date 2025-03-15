import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource, ResourceGroup, User } from '@attraccess/database-entities';
import { ResourceGroupsController } from './resource-groups.controller';
import { ResourceGroupsService } from './resource-groups.service';
import { ResourcesCoreModule } from '../resources-core.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceGroup, Resource, User]),
    ResourcesCoreModule,
  ],
  controllers: [ResourceGroupsController],
  providers: [ResourceGroupsService],
  exports: [ResourceGroupsService],
})
export class ResourceGroupsModule {}

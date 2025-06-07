import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ResourceGroupsService } from './resourceGroups.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResourceGroup } from '@attraccess/database-entities';
import { CreateResourceGroupDto } from './dto/createGroup.dto';
import { UpdateResourceGroupDto } from './dto/updateGroup.dto';
import { Auth } from '@attraccess/plugins-backend-sdk';

@ApiTags('Resources')
@Controller('resource-groups')
export class ResourceGroupsController {
  constructor(private readonly resourceGroupsService: ResourceGroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource group', operationId: 'resourceGroupsCreateOne' })
  @ApiResponse({
    status: 201,
    description: 'The resource group has been successfully created.',
    type: ResourceGroup,
  })
  @Auth('canManageResources')
  async createOne(@Body() createDto: CreateResourceGroupDto): Promise<ResourceGroup> {
    return await this.resourceGroupsService.createOne(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get many resource groups', operationId: 'resourceGroupsGetMany' })
  @ApiResponse({
    status: 200,
    description: 'The resource groups have been successfully retrieved.',
    type: [ResourceGroup],
  })
  async getAll(): Promise<ResourceGroup[]> {
    return await this.resourceGroupsService.getMany();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resource group by ID', operationId: 'resourceGroupsGetOne' })
  @ApiParam({ name: 'id', description: 'The ID of the resource group', type: Number })
  @ApiResponse({
    status: 404,
    description: 'The resource group has not been found.',
  })
  @ApiResponse({
    status: 200,
    description: 'The resource group has been successfully retrieved.',
    type: ResourceGroup,
  })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<ResourceGroup> {
    return await this.resourceGroupsService.getOne({ id });
  }

  @Put(':id')
  @Auth('canManageResources')
  @ApiOperation({ summary: 'Update a resource group by ID', operationId: 'resourceGroupsUpdateOne' })
  @ApiParam({ name: 'id', description: 'The ID of the resource group', type: Number })
  @ApiResponse({
    status: 404,
    description: 'The resource group has not been found.',
  })
  @ApiResponse({
    status: 200,
    description: 'The resource group has been successfully updated.',
    type: ResourceGroup,
  })
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateResourceGroupDto
  ): Promise<ResourceGroup> {
    return await this.resourceGroupsService.updateOneById(id, updateDto);
  }

  @Post(':groupId/resources/:resourceId')
  @Auth('canManageResources')
  @ApiOperation({ summary: 'Add a resource to a resource group', operationId: 'resourceGroupsAddResource' })
  @ApiParam({ name: 'groupId', description: 'The ID of the resource group', type: Number })
  @ApiParam({ name: 'resourceId', description: 'The ID of the resource', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully added to the resource group.',
  })
  async addResource(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('resourceId', ParseIntPipe) resourceId: number
  ): Promise<void> {
    return await this.resourceGroupsService.addResource(groupId, resourceId);
  }

  @Delete(':groupId/resources/:resourceId')
  @Auth('canManageResources')
  @ApiOperation({ summary: 'Remove a resource from a resource group', operationId: 'resourceGroupsRemoveResource' })
  @ApiParam({ name: 'groupId', description: 'The ID of the resource group', type: Number })
  @ApiParam({ name: 'resourceId', description: 'The ID of the resource', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully removed from the resource group.',
  })
  async removeResource(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('resourceId', ParseIntPipe) resourceId: number
  ): Promise<void> {
    return await this.resourceGroupsService.removeResource(groupId, resourceId);
  }

  @Delete(':groupId')
  @Auth('canManageResources')
  @ApiOperation({ summary: 'Delete a resource group by ID', operationId: 'resourceGroupsDeleteOne' })
  @ApiParam({ name: 'groupId', description: 'The ID of the resource group', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The resource group has been successfully deleted.',
  })
  async deleteOne(@Param('groupId', ParseIntPipe) groupId: number): Promise<{ OK: true }> {
    await this.resourceGroupsService.deleteOne(groupId);

    return {
      OK: true,
    };
  }
}

import { Controller, Post, Get, Delete, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResourceGroupIntroducersService } from './resourceGroupIntroducers.service';
import { Auth } from '../../../users-and-auth/strategies/systemPermissions.guard';
import { ResourceGroupsService } from '../resourceGroups.service';
import { CanManageResources } from '../../guards/can-manage-resources.decorator';
import { ResourceIntroducer } from '@attraccess/database-entities';

@ApiTags('Resource Group Introducers')
@Controller('resource-groups/:groupId/introducers')
export class ResourceGroupIntroducersController {
  constructor(
    private readonly resourceGroupIntroductionService: ResourceGroupIntroducersService,
    private readonly resourceGroupsService: ResourceGroupsService
  ) {}

  @Get()
  @Auth()
  @ApiOperation({
    summary: 'Get all authorized introducers for a resource group',
    operationId: 'getAllResourceGroupIntroducers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of resource group introducers',
    type: [ResourceIntroducer],
  })
  async getAll(@Param('groupId', ParseIntPipe) groupId: number): Promise<ResourceIntroducer[]> {
    const group = await this.resourceGroupsService.getById(groupId);

    if (!group) {
      throw new NotFoundException(`Resource group with ID ${groupId} not found`);
    }

    return this.resourceGroupIntroductionService.getResourceGroupIntroducers(groupId);
  }

  @Post(':userId')
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({ summary: 'Add a user as an introducer for a resource group', operationId: 'addGroupIntroducer' })
  @ApiResponse({
    status: 201,
    description: 'User added as a group introducer',
    type: ResourceIntroducer,
  })
  async addOne(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<ResourceIntroducer> {
    return this.resourceGroupIntroductionService.addIntroducer(groupId, userId);
  }

  @Delete(':userId')
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({
    summary: 'Remove a user as an introducer for a resource group',
    operationId: 'removeGroupIntroducer',
  })
  @ApiResponse({
    status: 204,
    description: 'User removed as a group introducer',
  })
  async removeOne(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    return this.resourceGroupIntroductionService.removeIntroducer(groupId, userId);
  }
}

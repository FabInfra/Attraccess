import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ResourceGroupsService } from './resource-groups.service';
import { ResourceGroup, Resource } from '@attraccess/database-entities';
import { PaginatedResponse } from '../../types/pagination';
import { CreateResourceGroupDto } from './dtos/create-resource-group.dto';
import { UpdateResourceGroupDto } from './dtos/update-resource-group.dto';
import { PaginatedResourceGroupResponseDto } from './dtos/paginated-resource-group-response.dto';
import { AssignResourceToGroupDto } from './dtos/assign-resource-to-group.dto';
import { PaginatedResourceResponseDto } from '../dtos/paginatedResourceResponse.dto';
import { Auth } from '../../users-and-auth/strategies/systemPermissions.guard';
import { CanManageResources } from '../guards/can-manage-resources.decorator';
import { transformResource } from '../resources.utils';
import { ResourceImageService } from '../../common/services/resource-image.service';
import { makePaginatedResponse } from '../../types/response';

@ApiTags('Resource Groups')
@Controller('resource-groups')
export class ResourceGroupsController {
  constructor(
    private readonly resourceGroupsService: ResourceGroupsService,
    private readonly resourceImageService: ResourceImageService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource group' })
  @ApiResponse({
    status: 201,
    description: 'The resource group has been successfully created.',
    type: ResourceGroup,
  })
  @CanManageResources({ skipResourceCheck: true })
  async createGroup(
    @Body() createDto: CreateResourceGroupDto
  ): Promise<ResourceGroup> {
    return this.resourceGroupsService.createGroup(createDto);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all resource groups' })
  @ApiResponse({
    status: 200,
    description: 'List of resource groups with pagination.',
    type: PaginatedResourceGroupResponseDto,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  async getGroups(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ): Promise<PaginatedResponse<ResourceGroup>> {
    return this.resourceGroupsService.listGroups(page, limit, search);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get a resource group by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found resource group.',
    type: ResourceGroup,
  })
  @ApiResponse({
    status: 404,
    description: 'Resource group not found.',
  })
  async getGroupById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResourceGroup> {
    return this.resourceGroupsService.getGroupById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a resource group' })
  @ApiResponse({
    status: 200,
    description: 'The resource group has been successfully updated.',
    type: ResourceGroup,
  })
  @ApiResponse({
    status: 404,
    description: 'Resource group not found.',
  })
  @CanManageResources({ skipResourceCheck: true })
  async updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateResourceGroupDto
  ): Promise<ResourceGroup> {
    return this.resourceGroupsService.updateGroup(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a resource group' })
  @ApiResponse({
    status: 204,
    description: 'The resource group has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource group not found.',
  })
  @CanManageResources({ skipResourceCheck: true })
  async deleteGroup(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.resourceGroupsService.deleteGroup(id);
  }

  @Get(':id/resources')
  @Auth()
  @ApiOperation({ summary: 'Get all resources in a group' })
  @ApiResponse({
    status: 200,
    description: 'List of resources in the group with pagination.',
    type: PaginatedResourceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Resource group not found.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    default: 10,
  })
  async getResourcesInGroup(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<PaginatedResponse<Resource>> {
    const result = await this.resourceGroupsService.getResourcesInGroup(
      id,
      page,
      limit
    );

    return makePaginatedResponse(
      {
        page,
        limit,
      },
      result.data.map((resource) =>
        transformResource(resource, this.resourceImageService)
      ),
      result.total
    );
  }

  @Post(':id/resources')
  @ApiOperation({ summary: 'Assign a resource to the group' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully assigned to the group.',
    type: Resource,
  })
  @ApiResponse({
    status: 404,
    description: 'Resource group or resource not found.',
  })
  @CanManageResources({ skipResourceCheck: true })
  async assignResourceToGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDto: AssignResourceToGroupDto
  ): Promise<Resource> {
    return this.resourceGroupsService.assignResourceToGroup(id, assignDto);
  }

  @Delete(':id/resources/:resourceId')
  @ApiOperation({ summary: 'Remove a resource from the group' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully removed from the group.',
    type: Resource,
  })
  @ApiResponse({
    status: 404,
    description:
      'Resource group or resource not found or resource not in group.',
  })
  @CanManageResources({ skipResourceCheck: true })
  async removeResourceFromGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('resourceId', ParseIntPipe) resourceId: number
  ): Promise<Resource> {
    return this.resourceGroupsService.removeResourceFromGroup(id, resourceId);
  }
}

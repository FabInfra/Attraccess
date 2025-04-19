import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ResourceGroupsService } from './resourceGroups.service';
import { CreateResourceGroupDto } from './dto/create-resource-group.dto';
import { UpdateResourceGroupDto } from './dto/update-resource-group.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResourceGroup } from '@attraccess/database-entities';
import { ListResourceGroupsDto } from './dto/list-resource-groups.dto';
import { PaginatedResponse } from '../../types/response';
import { PaginatedResourceGroupResponseDto } from './dto/paginated-resource-group-response.dto';
import { Auth } from '../../users-and-auth/strategies/systemPermissions.guard';
import { CanManageResources } from '../guards/can-manage-resources.decorator';

@ApiTags('Resource Groups')
@Controller('resources/groups')
export class ResourceGroupsController {
  constructor(private readonly resourceGroupsService: ResourceGroupsService) {}

  @Post()
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({ summary: 'Create a new resource group', operationId: 'createOneResourceGroup' })
  @ApiResponse({ status: 201, description: 'The resource group has been successfully created.', type: ResourceGroup })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createOne(@Body() createDto: CreateResourceGroupDto): Promise<ResourceGroup> {
    return this.resourceGroupsService.createResourceGroup(createDto);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Retrieve all resource groups', operationId: 'getAllResourceGroups' })
  @ApiResponse({
    status: 200,
    description: 'List of resource groups with pagination.',
    type: PaginatedResourceGroupResponseDto,
  })
  getAll(@Query() query: ListResourceGroupsDto): Promise<PaginatedResponse<ResourceGroup>> {
    return this.resourceGroupsService.listResourceGroups(query.page, query.limit, query.search);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Retrieve a specific resource group by ID', operationId: 'getOneResourceGroupById' })
  @ApiParam({ name: 'id', description: 'Resource Group ID', type: Number })
  @ApiResponse({ status: 200, description: 'The resource group details.', type: ResourceGroup })
  @ApiResponse({ status: 404, description: 'Resource group not found.' })
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<ResourceGroup> {
    return this.resourceGroupsService.getById(id);
  }

  @Patch(':id')
  @CanManageResources({ paramName: 'id' })
  @ApiOperation({ summary: 'Update a specific resource group by ID', operationId: 'updateOneResourceGroup' })
  @ApiParam({ name: 'id', description: 'Resource Group ID', type: Number })
  @ApiResponse({ status: 200, description: 'The resource group has been successfully updated.', type: ResourceGroup })
  @ApiResponse({ status: 404, description: 'Resource group not found.' })
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateResourceGroupDto): Promise<ResourceGroup> {
    return this.resourceGroupsService.updateResourceGroup(id, updateDto);
  }

  @Delete(':id')
  @CanManageResources({ paramName: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific resource group by ID', operationId: 'deleteOneResourceGroup' })
  @ApiParam({ name: 'id', description: 'Resource Group ID', type: Number })
  @ApiResponse({ status: 204, description: 'The resource group has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Resource group not found.' })
  deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.resourceGroupsService.deleteResourceGroup(id);
  }
}

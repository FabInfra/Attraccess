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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { CreateResourceDto } from './dtos/createResource.dto';
import { ListResourcesDto } from './dtos/listResources.dto';
import { Resource } from '@attraccess/database-entities';
import { Auth } from '@attraccess/plugins-backend-sdk';
import { PaginatedResponse } from '../types/response';
import { FileUpload } from '../common/types/file-upload.types';
import { PaginatedResourceResponseDto } from './dtos/paginatedResourceResponse.dto';
import { ResourceImageService } from '../common/services/resource-image.service';
import { CanManageResources } from './guards/can-manage-resources.decorator';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly resourceImageService: ResourceImageService
  ) {}

  private transformResource = (resource: Resource): Resource => {
    return {
      ...resource,
      imageFilename: resource.imageFilename
        ? this.resourceImageService.getPublicPath(resource.id, resource.imageFilename)
        : null,
    };
  };

  @Post()
  @ApiOperation({ summary: 'Create a new resource', operationId: 'createOneResource' })
  @ApiResponse({
    status: 201,
    description: 'The resource has been successfully created.',
    type: Resource,
  })
  @CanManageResources({ skipResourceCheck: true })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createOne(@Body() createDto: CreateResourceDto, @UploadedFile() image?: FileUpload): Promise<Resource> {
    const resource = await this.resourcesService.createResource(createDto, image);
    return this.transformResource(resource);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all resources', operationId: 'getAllResources' })
  @ApiResponse({
    status: 200,
    description: 'List of resources with pagination.',
    type: PaginatedResourceResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  async getAll(@Query() query: ListResourcesDto): Promise<PaginatedResponse<Resource>> {
    const resources = (await this.resourcesService.listResources(query)) as PaginatedResourceResponseDto;

    resources.data = resources.data.map(this.transformResource);
    return resources;
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get a resource by ID', operationId: 'getOneResourceById' })
  @ApiResponse({
    status: 200,
    description: 'The found resource.',
    type: Resource,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found',
  })
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    const resource = await this.resourcesService.getResourceById(id);
    return this.transformResource(resource);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a resource', operationId: 'updateOneResource' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully updated.',
    type: Resource,
  })
  @CanManageResources({ paramName: 'id' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateResourceDto,
    @UploadedFile() image?: FileUpload
  ): Promise<Resource> {
    const resource = await this.resourcesService.updateResource(id, updateDto, image);
    return this.transformResource(resource);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resource', operationId: 'deleteOneResource' })
  @ApiResponse({
    status: 204,
    description: 'The resource has been successfully deleted.',
  })
  @CanManageResources({ paramName: 'id' })
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.resourcesService.deleteResource(id);
  }

  @Post(':id/groups/:groupId')
  @ApiOperation({ summary: 'Add a resource to a group', operationId: 'addResourceToGroup' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully added to the group.',
    type: Resource, // Assuming you might return the updated resource or related info
  })
  @ApiResponse({ status: 404, description: 'Resource or Group not found' })
  @CanManageResources({ paramName: 'id' }) // Protect based on resource management permission
  async addResourceToGroup(
    @Param('id', ParseIntPipe) resourceId: number,
    @Param('groupId', ParseIntPipe) groupId: number
  ): Promise<void> {
    // Adjust return type if service returns something meaningful
    await this.resourcesService.addResourceToGroup(resourceId, groupId);
    // Optionally return updated resource or confirmation
  }

  @Delete(':id/groups/:groupId')
  @ApiOperation({ summary: 'Remove a resource from a group', operationId: 'removeResourceFromGroup' })
  @ApiResponse({
    status: 204,
    description: 'The resource has been successfully removed from the group.',
  })
  @ApiResponse({ status: 404, description: 'Resource or Group not found, or resource not in group' })
  @CanManageResources({ paramName: 'id' }) // Protect based on resource management permission
  async removeResourceFromGroup(
    @Param('id', ParseIntPipe) resourceId: number,
    @Param('groupId', ParseIntPipe) groupId: number
  ): Promise<void> {
    await this.resourcesService.removeResourceFromGroup(resourceId, groupId);
  }
}

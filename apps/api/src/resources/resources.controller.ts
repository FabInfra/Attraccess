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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { CreateResourceDto } from './dtos/createResource.dto';
import { ListResourcesDto } from './dtos/listResources.dto';
import { Resource } from '@attraccess/database-entities';
import { Auth } from '../users-and-auth/strategies/systemPermissions.guard';
import { PaginatedResponse } from '../types/pagination';
import { FileUpload } from '../common/types/file-upload.types';
import { PaginatedResourceResponseDto } from './dtos/paginatedResourceResponse.dto';
import { ResourceImageService } from '../common/services/resource-image.service';
import { CanManageResources } from './guards/can-manage-resources.decorator';
import { transformResource } from './resources.utils';
import { makePaginatedResponse } from '../types/response';

@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly resourceImageService: ResourceImageService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({
    status: 201,
    description: 'The resource has been successfully created.',
    type: Resource,
  })
  @CanManageResources({ skipResourceCheck: true })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createResource(
    @Body() createDto: CreateResourceDto,
    @UploadedFile() image?: FileUpload
  ): Promise<Resource> {
    const resource = await this.resourcesService.createResource(
      createDto,
      image
    );
    return transformResource(resource, this.resourceImageService);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({
    status: 200,
    description: 'List of resources with pagination.',
    type: PaginatedResourceResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  async getResources(
    @Query() query: ListResourcesDto
  ): Promise<PaginatedResponse<Resource>> {
    const resources = await this.resourcesService.listResources(
      query.page,
      query.limit,
      query.search,
      query.ungrouped
    );

    return makePaginatedResponse(
      {
        page: query.page,
        limit: query.limit,
      },
      resources.data.map((resource) =>
        transformResource(resource, this.resourceImageService)
      ),
      resources.total
    );
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get a resource by ID' })
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
  async getResourceById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Resource> {
    const resource = await this.resourcesService.getResourceById(id);
    return transformResource(resource, this.resourceImageService);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a resource' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully updated.',
    type: Resource,
  })
  @CanManageResources({ paramName: 'id' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateResourceDto,
    @UploadedFile() image?: FileUpload
  ): Promise<Resource> {
    const resource = await this.resourcesService.updateResource(
      id,
      updateDto,
      image
    );
    return transformResource(resource, this.resourceImageService);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resource' })
  @ApiResponse({
    status: 204,
    description: 'The resource has been successfully deleted.',
  })
  @CanManageResources({ paramName: 'id' })
  async deleteResource(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.resourcesService.deleteResource(id);
  }
}

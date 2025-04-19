import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere, IsNull } from 'typeorm';
import { Resource } from '@attraccess/database-entities';
import { CreateResourceDto } from './dtos/createResource.dto';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { PaginatedResponse, makePaginatedResponse } from '../types/response';
import { ResourceImageService } from '../common/services/resource-image.service';
import { FileUpload } from '../common/types/file-upload.types';
import { ResourceNotFoundException } from '../exceptions/resource.notFound.exception';
import { ResourceGroupsService } from './groups/resourceGroups.service';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private resourceImageService: ResourceImageService,
    private resourceGroupsService: ResourceGroupsService
  ) {}

  async createResource(dto: CreateResourceDto, image?: FileUpload): Promise<Resource> {
    this.logger.debug(`Attempting to create resource with name: ${dto.name}`);
    const resource = this.resourceRepository.create({
      name: dto.name,
      description: dto.description,
    });

    // Save the resource first to get an ID
    await this.resourceRepository.save(resource);
    this.logger.log(`Saved initial resource record with ID: ${resource.id}`);

    if (image) {
      this.logger.debug(`Image provided for resource ${resource.id}, attempting to save.`);
      try {
        resource.imageFilename = await this.resourceImageService.saveImage(resource.id, image);
        await this.resourceRepository.save(resource);
        this.logger.log(`Successfully saved image and updated resource ${resource.id}`);
      } catch (error) {
        this.logger.error(
          `Failed to save image for resource ${resource.id}. Cleaning up resource. Error: ${error.message}`,
          error.stack
        );
        // delete the resource if the image save fails
        await this.resourceRepository.delete(resource.id).catch((deleteError) => {
          this.logger.error(
            `Failed to cleanup resource ${resource.id} after image save failure. Error: ${deleteError.message}`,
            deleteError.stack
          );
        });
        throw error; // Re-throw original error
      }
    }

    this.logger.log(`Successfully created resource with ID: ${resource.id}`);
    return resource;
  }

  async getResourceById(id: number): Promise<Resource | null> {
    this.logger.debug(`Attempting to find resource with ID: ${id}`);
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: ['introductions', 'usages', 'groups'],
    });

    if (!resource) {
      this.logger.warn(`Resource with ID ${id} not found.`);
      throw new ResourceNotFoundException(id);
    }

    this.logger.debug(`Found resource with ID: ${id}`);
    return resource;
  }

  async updateResource(id: number, dto: UpdateResourceDto, image?: FileUpload): Promise<Resource> {
    this.logger.debug(`Attempting to update resource with ID: ${id}`);
    const resource = await this.getResourceById(id);

    // Update only provided fields
    let updatedFields = [];
    if (dto.name !== undefined) {
      resource.name = dto.name;
      updatedFields.push('name');
    }
    if (dto.description !== undefined) {
      resource.description = dto.description;
      updatedFields.push('description');
    }
    if (updatedFields.length > 0) {
      this.logger.debug(`Updating fields: ${updatedFields.join(', ')} for resource ${id}`);
    }

    if (image) {
      this.logger.debug(`Image provided for update on resource ${id}.`);
      // Delete old image if it exists
      if (resource.imageFilename) {
        this.logger.debug(`Deleting old image ${resource.imageFilename} for resource ${id}.`);
        try {
          await this.resourceImageService.deleteImage(id, resource.imageFilename);
          this.logger.log(`Successfully deleted old image for resource ${id}.`);
        } catch (error) {
          // Log the error but proceed with saving the new image and resource update
          this.logger.error(
            `Failed to delete old image ${resource.imageFilename} for resource ${id}. Proceeding with update. Error: ${error.message}`,
            error.stack
          );
        }
      }
      try {
        resource.imageFilename = await this.resourceImageService.saveImage(id, image);
        this.logger.log(`Successfully saved new image for resource ${id}.`);
      } catch (error) {
        this.logger.error(`Failed to save new image for resource ${id}. Error: ${error.message}`, error.stack);
        throw error;
      }
    }

    try {
      const updatedResource = await this.resourceRepository.save(resource);
      this.logger.log(`Successfully updated resource with ID: ${id}`);
      return updatedResource;
    } catch (error) {
      this.logger.error(`Failed to save updated resource ${id}. Error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteResource(id: number): Promise<void> {
    this.logger.debug(`Attempting to delete resource with ID: ${id}`);
    const resource = await this.getResourceById(id);

    // Delete associated image if it exists
    if (resource.imageFilename) {
      this.logger.debug(`Deleting associated image ${resource.imageFilename} for resource ${id}.`);
      try {
        await this.resourceImageService.deleteImage(id, resource.imageFilename);
        this.logger.log(`Successfully deleted image for resource ${id}.`);
      } catch (error) {
        // Log error but proceed with resource deletion attempt
        this.logger.error(
          `Failed to delete image ${resource.imageFilename} for resource ${id}. Proceeding with resource deletion. Error: ${error.message}`,
          error.stack
        );
      }
    }

    const result = await this.resourceRepository.delete(id);
    if (result.affected === 0) {
      // This case should technically be handled by getResourceById, but added as a safeguard
      this.logger.warn(`Attempted to delete resource with ID ${id}, but no rows were affected.`);
      throw new ResourceNotFoundException(id);
    }
    this.logger.log(`Successfully deleted resource with ID: ${id}`);
  }

  async listResources(page = 1, limit = 10, search?: string, groupId?: number): Promise<PaginatedResponse<Resource>> {
    this.logger.debug(`Listing resources: page=${page}, limit=${limit}, search='${search}', groupId=${groupId}`);
    let where: FindOptionsWhere<Resource> | FindOptionsWhere<Resource>[] = [];

    if (search) {
      this.logger.debug(`Applying search filter: '${search}'`);
      where = [
        {
          name: ILike(`%${search}%`),
        },
        {
          description: ILike(`%${search}%`),
        },
      ];
    }

    let groupFilter: ReturnType<typeof IsNull> | number | undefined;

    if (groupId === -1) {
      groupFilter = IsNull();
    } else if (groupId !== undefined) {
      groupFilter = groupId;
    }

    if (groupFilter) {
      if (!search) {
        where = { groups: { id: groupFilter } };
      } else {
        where.forEach((condition) => {
          condition.groups = { id: groupFilter };
        });
      }
    }

    this.logger.debug(`Final where clause: ${JSON.stringify(where)}`);

    const [resources, total] = await this.resourceRepository.findAndCount({
      where,
      relations: ['groups'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    this.logger.log(`Found ${resources.length} resources out of total ${total} matching criteria.`);
    return makePaginatedResponse({ page, limit }, resources, total);
  }

  async addResourceToGroup(resourceId: number, groupId: number): Promise<void> {
    this.logger.debug(`Attempting to add resource ${resourceId} to group ${groupId}`);
    // Ensure resource exists first (optional, group service might also check)
    await this.getResourceById(resourceId);
    // Call the method in ResourceGroupsService
    try {
      await this.resourceGroupsService.addResourceToGroup(resourceId, groupId);
      this.logger.log(`Successfully added resource ${resourceId} to group ${groupId} via ResourceGroupsService.`);
    } catch (error) {
      this.logger.error(`Error adding resource ${resourceId} to group ${groupId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeResourceFromGroup(resourceId: number, groupId: number): Promise<void> {
    this.logger.debug(`Attempting to remove resource ${resourceId} from group ${groupId}`);
    // Ensure resource exists first (optional, group service might also check)
    await this.getResourceById(resourceId);
    // Call the method in ResourceGroupsService
    try {
      await this.resourceGroupsService.removeResourceFromGroup(resourceId, groupId);
      this.logger.log(`Successfully removed resource ${resourceId} from group ${groupId} via ResourceGroupsService.`);
    } catch (error) {
      this.logger.error(`Error removing resource ${resourceId} from group ${groupId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}

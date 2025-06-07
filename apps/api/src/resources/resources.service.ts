import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Resource } from '@attraccess/database-entities';
import { CreateResourceDto } from './dtos/createResource.dto';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { PaginatedResponse, makePaginatedResponse } from '../types/response';
import { ResourceImageService } from './resourceImage.service';
import { FileUpload } from '../common/types/file-upload.types';
import { ResourceNotFoundException } from '../exceptions/resource.notFound.exception';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly resourceImageService: ResourceImageService
  ) {}

  async createResource(dto: CreateResourceDto, image?: FileUpload): Promise<Resource> {
    const resource = this.resourceRepository.create({
      name: dto.name,
      description: dto.description,
      documentationType: dto.documentationType || null,
      documentationMarkdown: dto.documentationMarkdown || null,
      documentationUrl: dto.documentationUrl || null,
      allowTakeOver: dto.allowTakeOver || false,
    });

    // Save the resource first to get an ID
    await this.resourceRepository.save(resource);

    if (image) {
      resource.imageFilename = await this.resourceImageService.saveImage(resource.id, image);
      await this.resourceRepository.save(resource).catch(async (error) => {
        // delete the resource if the image save fails
        await this.resourceRepository.delete(resource.id);
        throw error;
      });
    }

    return resource;
  }

  async getResourceById<Tid extends number | number[]>(
    idOrArrayOfIds: Tid
  ): Promise<Tid extends number ? Resource | null : Resource[]> {
    const arrayOfIds: number[] = Array.isArray(idOrArrayOfIds) ? idOrArrayOfIds : [idOrArrayOfIds];

    if (arrayOfIds.length === 0) {
      return (typeof idOrArrayOfIds === 'number' ? null : ([] as Resource[])) as Tid extends number
        ? Resource | null
        : Resource[];
    }

    const resources = await this.resourceRepository.find({
      where: { id: In(arrayOfIds) },
      relations: ['introductions', 'usages', 'groups'],
    });

    if (resources.length !== arrayOfIds.length) {
      throw new ResourceNotFoundException(arrayOfIds.find((id) => !resources.some((resource) => resource.id === id)));
    }

    return (typeof idOrArrayOfIds === 'number' ? resources[0] : resources) as Tid extends number
      ? Resource
      : Resource[];
  }

  async updateResource(id: number, dto: UpdateResourceDto, image?: FileUpload): Promise<Resource> {
    const resource = await this.getResourceById(id);

    // Update only provided fields
    if (dto.name !== undefined) resource.name = dto.name;
    if (dto.description !== undefined) resource.description = dto.description;

    // Handle documentation fields
    if (dto.documentationType !== undefined) resource.documentationType = dto.documentationType;
    if (dto.documentationMarkdown !== undefined) resource.documentationMarkdown = dto.documentationMarkdown;
    if (dto.documentationUrl !== undefined) resource.documentationUrl = dto.documentationUrl;

    // Handle allowTakeOver field
    if (dto.allowTakeOver !== undefined) resource.allowTakeOver = dto.allowTakeOver;

    if (image && dto.deleteImage) {
      throw new BadRequestException('Image and deleteImage cannot be used together');
    }

    if (image) {
      // Delete old image if it exists
      if (resource.imageFilename) {
        await this.resourceImageService.deleteImage(id, resource.imageFilename);
      }
      resource.imageFilename = await this.resourceImageService.saveImage(id, image);
    }

    if (dto.deleteImage && resource.imageFilename) {
      await this.resourceImageService.deleteImage(id, resource.imageFilename);
      resource.imageFilename = null;
    }

    return this.resourceRepository.save(resource);
  }

  async deleteResource(id: number): Promise<void> {
    const resource = await this.getResourceById(id);

    // Delete associated image if it exists
    if (resource.imageFilename) {
      await this.resourceImageService.deleteImage(id, resource.imageFilename);
    }

    const result = await this.resourceRepository.delete(id);
    if (result.affected === 0) {
      throw new ResourceNotFoundException(id);
    }
  }

  async listResources(options?: {
    page?: number;
    limit?: number;
    search?: string;
    groupId?: number;
    ids?: number[] | number;
  }): Promise<PaginatedResponse<Resource>> {
    if (!options) {
      options = {};
    }

    const { page = 1, limit = 10, search, groupId } = options;

    let ids = options.ids;
    if (typeof ids === 'number') {
      ids = [ids];
    }

    // Create the query builder
    const queryBuilder = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.groups', 'groups')
      .orderBy('resource.createdAt', 'DESC');

    // Handle IDs filtering
    if (ids && ids.length > 0) {
      queryBuilder.andWhere('resource.id IN (:...ids)', { ids });
    }

    // Handle group filtering
    if (groupId !== undefined) {
      if (groupId === -1) {
        // Special case: resources with no groups
        queryBuilder.andWhere('groups.id IS NULL');
      } else {
        // Resources belonging to a specific group
        queryBuilder.andWhere('groups.id = :groupId', { groupId });
      }
    }

    // Handle search filtering (OR condition for name and description)
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(resource.name) LIKE LOWER(:search) OR LOWER(resource.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        }
      );
    }

    this.logger.debug('Listing resources with query:', queryBuilder.getSql());

    // Execute query with pagination
    const [resources, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return makePaginatedResponse({ page, limit }, resources, total);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource, User } from '@attraccess/database-entities';
import { CreateResourceDto } from './dtos/createResource.dto';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { PaginatedResponse } from '../types/pagination';
import { ResourceImageService } from '../common/services/resource-image.service';
import { FileUpload } from '../common/types/file-upload.types';
import { ResourceNotFoundException } from '../exceptions/resource.notFound.exception';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private resourceImageService: ResourceImageService
  ) {}

  async createResource(
    dto: CreateResourceDto,
    image?: FileUpload
  ): Promise<Resource> {
    const resource = this.resourceRepository.create({
      name: dto.name,
      description: dto.description,
    });

    // Save the resource first to get an ID
    await this.resourceRepository.save(resource);

    if (image) {
      resource.imageFilename = await this.resourceImageService.saveImage(
        resource.id,
        image
      );
      await this.resourceRepository.save(resource).catch(async (error) => {
        // delete the resource if the image save fails
        await this.resourceRepository.delete(resource.id);
        throw error;
      });
    }

    return resource;
  }

  async getResourceById(id: number): Promise<Resource | null> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: ['introductions', 'usages', 'group'],
    });

    if (!resource) {
      throw new ResourceNotFoundException(id);
    }

    return resource;
  }

  async updateResource(
    id: number,
    dto: UpdateResourceDto,
    image?: FileUpload
  ): Promise<Resource> {
    const resource = await this.getResourceById(id);

    // Update only provided fields
    if (dto.name !== undefined) resource.name = dto.name;
    if (dto.description !== undefined) resource.description = dto.description;

    if (image) {
      // Delete old image if it exists
      if (resource.imageFilename) {
        await this.resourceImageService.deleteImage(id, resource.imageFilename);
      }
      resource.imageFilename = await this.resourceImageService.saveImage(
        id,
        image
      );
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

  async listResources(
    page = 1,
    limit = 10,
    search?: string,
    ungrouped?: boolean
  ): Promise<PaginatedResponse<Resource>> {
    const query = this.resourceRepository.createQueryBuilder('resource');

    if (search) {
      query.where('resource.name ILIKE :search OR resource.description ILIKE :search', { search: `%${search}%` });
    }

    if (ungrouped) {
      query.andWhere('resource.group IS NULL');
    }

    query.orderBy('resource.createdAt', 'DESC');

    const [resources, total] = await query.getManyAndCount();

    return {
      data: resources,
      total,
      page,
      limit,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
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
    let where: any = {};

    // Add search conditions if search parameter provided
    if (search) {
      where = [
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];
    }

    // Filter for ungrouped resources if requested
    if (ungrouped) {
      // If we already have search conditions
      if (Array.isArray(where)) {
        // Apply both search and ungrouped filter
        where = where.map((condition) => ({
          ...condition,
          group: null,
        }));
      } else {
        // Just filter for ungrouped
        where.group = null;
      }
    }

    const [resources, total] = await this.resourceRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
      relations: ['group'],
    });

    return {
      data: resources,
      total,
      page,
      limit,
    };
  }
}

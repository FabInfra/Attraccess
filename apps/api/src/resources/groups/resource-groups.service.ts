import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Resource, ResourceGroup } from '@attraccess/database-entities';
import { PaginatedResponse } from '../../types/pagination';
import { CreateResourceGroupDto } from './dtos/create-resource-group.dto';
import { UpdateResourceGroupDto } from './dtos/update-resource-group.dto';
import { AssignResourceToGroupDto } from './dtos/assign-resource-to-group.dto';
import { ResourceNotFoundException } from '../../exceptions/resource.notFound.exception';

@Injectable()
export class ResourceGroupsService {
  constructor(
    @InjectRepository(ResourceGroup)
    private resourceGroupRepository: Repository<ResourceGroup>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>
  ) {}

  async createGroup(createDto: CreateResourceGroupDto): Promise<ResourceGroup> {
    const newGroup = this.resourceGroupRepository.create({
      name: createDto.name,
    });

    return this.resourceGroupRepository.save(newGroup);
  }

  async getGroupById(id: number): Promise<ResourceGroup> {
    const group = await this.resourceGroupRepository.findOne({
      where: { id },
      relations: ['resources'],
    });

    if (!group) {
      throw new NotFoundException(`Resource group with ID ${id} not found`);
    }

    return group;
  }

  async updateGroup(
    id: number,
    updateDto: UpdateResourceGroupDto
  ): Promise<ResourceGroup> {
    const group = await this.getGroupById(id);

    if (updateDto.name) {
      group.name = updateDto.name;
    }

    return this.resourceGroupRepository.save(group);
  }

  async deleteGroup(id: number): Promise<void> {
    const group = await this.getGroupById(id);

    // First remove the group association from all resources
    const resources = await this.resourceRepository.find({
      where: { groupId: id },
    });

    for (const resource of resources) {
      resource.groupId = null;
      await this.resourceRepository.save(resource);
    }

    // Then delete the group
    await this.resourceGroupRepository.remove(group);
  }

  async listGroups(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<ResourceGroup>> {
    const where = search ? { name: ILike(`%${search}%`) } : {};

    const [groups, total] = await this.resourceGroupRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: groups,
      total,
      page,
      limit,
    };
  }

  async getResourcesInGroup(
    groupId: number,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Resource>> {
    // First check if the group exists
    await this.getGroupById(groupId);

    const [resources, total] = await this.resourceRepository.findAndCount({
      where: { groupId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: resources,
      total,
      page,
      limit,
    };
  }

  async assignResourceToGroup(
    groupId: number,
    dto: AssignResourceToGroupDto
  ): Promise<Resource> {
    // Check if group exists
    await this.getGroupById(groupId);

    // Check if resource exists
    const resource = await this.resourceRepository.findOne({
      where: { id: dto.resourceId },
    });

    if (!resource) {
      throw new ResourceNotFoundException(dto.resourceId);
    }

    // Assign resource to group
    resource.groupId = groupId;
    return this.resourceRepository.save(resource);
  }

  async removeResourceFromGroup(
    groupId: number,
    resourceId: number
  ): Promise<Resource> {
    // Check if group exists
    await this.getGroupById(groupId);

    // Check if resource exists and belongs to the group
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId, groupId },
    });

    if (!resource) {
      throw new ResourceNotFoundException(resourceId);
    }

    // Remove resource from group
    resource.groupId = null;
    return this.resourceRepository.save(resource);
  }
}

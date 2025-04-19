import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ResourceGroup, Resource } from '@attraccess/database-entities';
import { CreateResourceGroupDto } from './dto/create-resource-group.dto';
import { UpdateResourceGroupDto } from './dto/update-resource-group.dto';
import { PaginatedResponse, makePaginatedResponse } from '../../types/response';

@Injectable()
export class ResourceGroupsService {
  private readonly logger = new Logger(ResourceGroupsService.name);

  constructor(
    @InjectRepository(ResourceGroup)
    private readonly resourceGroupRepository: Repository<ResourceGroup>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  async createResourceGroup(createResourceGroupDto: CreateResourceGroupDto): Promise<ResourceGroup> {
    this.logger.debug(`Attempting to create resource group with name: ${createResourceGroupDto.name}`);
    const resourceGroup = this.resourceGroupRepository.create(createResourceGroupDto);
    const savedGroup = await this.resourceGroupRepository.save(resourceGroup);
    this.logger.log(`Successfully created resource group with ID: ${savedGroup.id}`);
    return savedGroup;
  }

  async listResourceGroups(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<ResourceGroup>> {
    this.logger.debug(`Listing resource groups: page=${page}, limit=${limit}, search='${search || ''}'`);
    const where = search ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] : {};

    const [data, total] = await this.resourceGroupRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        name: 'ASC',
      },
    });

    this.logger.debug(`Found ${total} resource groups matching criteria.`);
    return makePaginatedResponse({ page, limit }, data, total);
  }

  async getById(id: number, relations?: string[]): Promise<ResourceGroup> {
    this.logger.debug(`Fetching resource group by ID: ${id} with relations: ${relations?.join(', ')}`);
    const resourceGroup = await this.resourceGroupRepository.findOne({ where: { id }, relations });
    if (!resourceGroup) {
      this.logger.warn(`ResourceGroup with ID ${id} not found`);
      throw new NotFoundException(`ResourceGroup with ID ${id} not found`);
    }
    this.logger.debug(`Found resource group with ID: ${id}`);
    return resourceGroup;
  }

  async updateResourceGroup(id: number, updateResourceGroupDto: UpdateResourceGroupDto): Promise<ResourceGroup> {
    this.logger.debug(`Attempting to update resource group with ID: ${id}`);
    const resourceGroup = await this.getById(id);

    this.resourceGroupRepository.merge(resourceGroup, updateResourceGroupDto);
    const updatedGroup = await this.resourceGroupRepository.save(resourceGroup);
    this.logger.log(`Successfully updated resource group with ID: ${id}`);
    return updatedGroup;
  }

  async deleteResourceGroup(id: number): Promise<void> {
    this.logger.debug(`Attempting to delete resource group with ID: ${id}`);
    await this.getById(id);

    const result = await this.resourceGroupRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Deletion failed for resource group ID ${id} - resource disappeared after existence check.`);
      throw new NotFoundException(`ResourceGroup with ID ${id} not found`);
    }
    this.logger.log(`Successfully deleted resource group with ID: ${id}`);
  }

  async addResourceToGroup(resourceId: number, groupId: number): Promise<void> {
    this.logger.debug(`Attempting to add resource ${resourceId} to group ${groupId}`);
    const group = await this.resourceGroupRepository.findOne({
      where: { id: groupId },
      relations: ['resources'],
    });
    if (!group) {
      this.logger.warn(`Add resource failed: ResourceGroup with ID ${groupId} not found`);
      throw new NotFoundException(`ResourceGroup with ID ${groupId} not found`);
    }

    const resource = await this.resourceRepository.findOne({ where: { id: resourceId } });
    if (!resource) {
      this.logger.warn(`Add resource failed: Resource with ID ${resourceId} not found`);
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    const resourceExists = group.resources.some((r) => r.id === resourceId);
    if (resourceExists) {
      this.logger.warn(`Resource ${resourceId} already exists in group ${groupId}. No action taken.`);
      return;
    }

    group.resources.push(resource);
    await this.resourceGroupRepository.save(group);
    this.logger.log(`Successfully added resource ${resourceId} to group ${groupId}`);
  }

  async removeResourceFromGroup(resourceId: number, groupId: number): Promise<void> {
    this.logger.debug(`Attempting to remove resource ${resourceId} from group ${groupId}`);
    const group = await this.resourceGroupRepository.findOne({
      where: { id: groupId },
      relations: ['resources'],
    });
    if (!group) {
      this.logger.warn(`Remove resource failed: ResourceGroup with ID ${groupId} not found`);
      throw new NotFoundException(`ResourceGroup with ID ${groupId} not found`);
    }

    const initialLength = group.resources.length;
    group.resources = group.resources.filter((r) => r.id !== resourceId);

    if (group.resources.length === initialLength) {
      this.logger.warn(`Remove resource failed: Resource ${resourceId} not found in group ${groupId}`);
      throw new NotFoundException(`Resource ${resourceId} not found in group ${groupId}`);
    }

    await this.resourceGroupRepository.save(group);
    this.logger.log(`Successfully removed resource ${resourceId} from group ${groupId}`);
  }
}

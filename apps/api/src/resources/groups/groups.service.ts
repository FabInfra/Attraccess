import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceGroup } from '@attraccess/database-entities';
import { GroupNotFoundException } from '../../exceptions/group.notFound.exception';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(ResourceGroup)
    private resourceGroupRepository: Repository<ResourceGroup>
  ) {}

  /**
   * Find a resource group by its ID.
   * Includes relations defined in the entity (e.g., resources, introductions) if needed by callers,
   * but for basic existence check, only the ID is necessary.
   * @param id The ID of the group to find.
   * @returns The found ResourceGroup entity.
   * @throws GroupNotFoundException if the group with the given ID does not exist.
   */
  async getGroupById(id: number): Promise<ResourceGroup> {
    this.logger.debug(`Attempting to find group with ID: ${id}`);
    // Specify relations if they are consistently needed when fetching a group by ID.
    // For just checking existence or basic info, relations might not be required.
    const group = await this.resourceGroupRepository.findOne({
      where: { id },
      // relations: ['resources'], // Example: Uncomment if resources are typically needed
    });

    if (!group) {
      this.logger.warn(`Group with ID ${id} not found.`);
      throw new GroupNotFoundException(id);
    }

    this.logger.verbose(`Found group: ${group.name} (ID: ${id})`);
    return group;
  }

  // Add other group management methods here (create, update, delete, list) as needed.
}

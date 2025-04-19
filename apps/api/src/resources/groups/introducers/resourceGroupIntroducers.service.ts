import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceIntroducer } from '@attraccess/database-entities';
import { ResourceGroupsService } from '../resourceGroups.service';
import { UsersService } from '../../../users-and-auth/users/users.service';
import { UserNotFoundException } from '../../../exceptions/user.notFound.exception';

class GroupNotFoundException extends NotFoundException {
  constructor(groupId: number) {
    super(`Resource group with ID ${groupId} not found`);
  }
}

class UserAlreadyGroupIntroducerException extends ConflictException {
  constructor(userId: number, groupId: number) {
    super(`User ${userId} is already an introducer for group ${groupId}`);
  }
}

class MissingGroupIntroducerPermissionException extends NotFoundException {
  constructor(userId: number, groupId: number) {
    super(`User ${userId} is not an introducer for group ${groupId}`);
  }
}

@Injectable()
export class ResourceGroupIntroducersService {
  private readonly logger = new Logger(ResourceGroupIntroducersService.name);

  constructor(
    @InjectRepository(ResourceIntroducer)
    private resourceIntroducersRepository: Repository<ResourceIntroducer>,
    private resourceGroupsService: ResourceGroupsService,
    private usersService: UsersService
  ) {}

  async getResourceGroupIntroducers(groupId: number): Promise<ResourceIntroducer[]> {
    this.logger.debug(`Attempting to get introducers for group ID: ${groupId}`);
    const group = await this.resourceGroupsService.getById(groupId);
    if (!group) {
      this.logger.warn(`Resource group with ID ${groupId} not found when trying to get introducers.`);
      throw new GroupNotFoundException(groupId);
    }

    const introducers = await this.resourceIntroducersRepository.find({
      where: { resourceGroup: { id: groupId } },
      relations: ['user'],
    });
    this.logger.debug(`Found ${introducers.length} introducers for group ID: ${groupId}`);
    return introducers;
  }

  async addIntroducer(groupId: number, userId: number): Promise<ResourceIntroducer> {
    this.logger.debug(`Attempting to add user ID: ${userId} as introducer for group ID: ${groupId}`);
    const group = await this.resourceGroupsService.getById(groupId);
    if (!group) {
      this.logger.warn(`Resource group with ID ${groupId} not found when trying to add introducer.`);
      throw new GroupNotFoundException(groupId);
    }

    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found when trying to add introducer to group ID: ${groupId}.`);
      throw new UserNotFoundException(userId);
    }

    const existingPermission = await this.resourceIntroducersRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        userId: userId,
      },
    });

    if (existingPermission) {
      this.logger.warn(`User ID: ${userId} is already an introducer for group ID: ${groupId}.`);
      throw new UserAlreadyGroupIntroducerException(userId, groupId);
    }

    const permission = this.resourceIntroducersRepository.create({
      resourceGroup: { id: groupId },
      userId: userId,
      grantedAt: new Date(),
    });

    const savedPermission = await this.resourceIntroducersRepository.save(permission);
    this.logger.log(
      `Successfully added user ID: ${userId} as introducer for group ID: ${groupId}. New permission ID: ${savedPermission.id}`
    );

    // Refetch with relations to include user details in the return
    const fullPermission = await this.resourceIntroducersRepository.findOne({
      where: { id: savedPermission.id },
      relations: ['user'],
    });

    if (!fullPermission) {
      // This should theoretically never happen if save was successful
      this.logger.error(`Failed to refetch introducer permission ID: ${savedPermission.id} after saving.`);
      throw new Error(`Failed to retrieve newly created introducer permission for group ${groupId} and user ${userId}`);
    }

    return fullPermission;
  }

  async removeIntroducer(groupId: number, userId: number): Promise<void> {
    this.logger.debug(`Attempting to remove introducer user ID: ${userId} from group ID: ${groupId}`);
    const introductionPermission = await this.resourceIntroducersRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        userId: userId,
      },
    });

    if (!introductionPermission) {
      this.logger.warn(
        `Introducer permission not found for user ID: ${userId} and group ID: ${groupId}. Cannot remove.`
      );
      throw new MissingGroupIntroducerPermissionException(userId, groupId);
    }

    await this.resourceIntroducersRepository.delete(introductionPermission.id);
    this.logger.log(
      `Successfully removed introducer user ID: ${userId} from group ID: ${groupId}. Permission ID: ${introductionPermission.id}`
    );
  }
}

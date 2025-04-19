import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResourceIntroduction,
  ResourceIntroducer,
  ResourceIntroductionHistoryItem,
} from '@attraccess/database-entities';
import { ResourcesService } from '../resources.service';
import { ResourceNotFoundException } from '../../exceptions/resource.notFound.exception';
import { MissingIntroductionPermissionException } from '../../exceptions/resource.introduction.forbidden.exception';
import { UsersService } from '../../users-and-auth/users/users.service';

class UserAlreadyHasIntroductionPermissionException extends ForbiddenException {
  constructor() {
    super('UserAlreadyHasIntroductionPermissionException');
  }
}

@Injectable()
export class ResourceIntroducersService {
  private readonly logger = new Logger(ResourceIntroducersService.name);

  constructor(
    @InjectRepository(ResourceIntroduction)
    private resourceIntroductionRepository: Repository<ResourceIntroduction>,
    @InjectRepository(ResourceIntroducer)
    private resourceIntroductionUserRepository: Repository<ResourceIntroducer>,
    @InjectRepository(ResourceIntroductionHistoryItem)
    private resourceIntroductionHistoryRepository: Repository<ResourceIntroductionHistoryItem>,
    private resourcesService: ResourcesService,
    private usersService: UsersService
  ) {}

  async canGiveIntroductions(resourceId: number, tutorUserId: number): Promise<boolean> {
    this.logger.debug(`Checking if user ${tutorUserId} can give introductions for resource ${resourceId}`);
    const permission = await this.resourceIntroductionUserRepository.findOne({
      where: {
        resourceId,
        userId: tutorUserId,
      },
    });

    const hasPermission = !!permission;
    this.logger.debug(
      `User ${tutorUserId} has direct introducer permission for resource ${resourceId}: ${hasPermission}`
    );

    const user = await this.usersService.findOne({ id: tutorUserId });
    // Add null check for user?
    const canManageResources = user?.systemPermissions.canManageResources ?? false;
    this.logger.debug(`User ${tutorUserId} has system permission 'canManageResources': ${canManageResources}`);

    const finalPermission = hasPermission || canManageResources;
    this.logger.debug(
      `Final determination: User ${tutorUserId} can give introductions for resource ${resourceId}: ${finalPermission}`
    );
    return finalPermission;
  }

  async createOne(resourceId: number, userId: number): Promise<ResourceIntroducer> {
    this.logger.debug(`Attempting to add user ${userId} as introducer for resource ${resourceId}`);
    // Check if resource exists
    const resource = await this.resourcesService.getResourceById(resourceId);
    if (!resource) {
      this.logger.warn(`Add introducer failed: Resource ${resourceId} not found.`);
      throw new ResourceNotFoundException(resourceId);
    }

    // Check if user already has permission
    this.logger.debug(`Checking if user ${userId} already has introducer permission for resource ${resourceId}`);
    const existingPermission = await this.resourceIntroductionUserRepository.findOne({
      where: {
        resourceId,
        userId,
      },
    });

    if (existingPermission) {
      this.logger.warn(`Add introducer failed: User ${userId} already has permission for resource ${resourceId}`);
      throw new UserAlreadyHasIntroductionPermissionException();
    }

    // Create new permission
    this.logger.debug(`Creating introducer permission record for user ${userId}, resource ${resourceId}`);
    const permission = this.resourceIntroductionUserRepository.create({
      resourceId,
      userId,
      grantedAt: new Date(),
    });

    const savedPermission = await this.resourceIntroductionUserRepository.save(permission);
    this.logger.log(
      `Successfully added user ${userId} as introducer for resource ${resourceId} (ID: ${savedPermission.id})`
    );
    return savedPermission;
  }

  async removeOne(resourceId: number, userId: number): Promise<void> {
    this.logger.debug(`Attempting to remove user ${userId} as introducer for resource ${resourceId}`);
    const introductionPermission = await this.resourceIntroductionUserRepository.findOne({
      where: {
        resourceId,
        userId,
      },
    });

    if (!introductionPermission) {
      this.logger.warn(`Remove introducer failed: User ${userId} does not have permission for resource ${resourceId}`);
      throw new MissingIntroductionPermissionException();
    }

    await this.resourceIntroductionUserRepository.delete(introductionPermission.id);
    this.logger.log(`Successfully removed user ${userId} as introducer for resource ${resourceId}`);
  }

  async getAllByResourceId(resourceId: number): Promise<ResourceIntroducer[]> {
    this.logger.debug(`Getting all introducers for resource ${resourceId}`);
    const introducers = await this.resourceIntroductionUserRepository.find({
      where: { resourceId },
      relations: ['user'],
    });
    this.logger.debug(`Found ${introducers.length} introducers for resource ${resourceId}`);
    return introducers;
  }

  async canManageIntroducers(resourceId: number, userId: number): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can manage introducers for resource ${resourceId}`);
    // For now, the permission to manage introducers is a higher level of access
    // We'll check if the user has introductions that they've given
    const introductionsGiven = await this.resourceIntroductionRepository.count({
      where: {
        resourceId,
        tutorUserId: userId,
      },
    });

    this.logger.debug(`User ${userId} has given ${introductionsGiven} introductions for resource ${resourceId}`);
    const user = await this.usersService.findOne({ id: userId });
    const isResourceManager = user?.systemPermissions.canManageResources ?? false;
    this.logger.debug(`User ${userId} has system permission 'canManageResources': ${isResourceManager}`);

    const canManage = introductionsGiven > 0 || isResourceManager;
    this.logger.debug(
      `Final determination: User ${userId} can manage introducers for resource ${resourceId}: ${canManage}`
    );
    return canManage;
  }
}

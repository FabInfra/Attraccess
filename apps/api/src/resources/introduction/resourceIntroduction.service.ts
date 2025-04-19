import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResourceIntroduction,
  ResourceIntroducer,
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
} from '@attraccess/database-entities';
import { ResourcesService } from '../resources.service';
import { ResourceNotFoundException } from '../../exceptions/resource.notFound.exception';
import { ResourceIntroductionNotFoundException } from '../../exceptions/resource.introduction.notFound.exception';
import { UsersService } from '../../users-and-auth/users/users.service';

class IntroducionAlreadyCompletedException extends BadRequestException {
  constructor() {
    super('IntroducionAlreadyCompletedError');
  }
}

class MissingResourceIntroductionPermissionException extends ForbiddenException {
  constructor() {
    super('MissingResourceIntroductionPermissionException');
  }
}

@Injectable()
export class ResourceIntroductionService {
  private readonly logger = new Logger(ResourceIntroductionService.name);

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

  async createOne(
    resourceId: number,
    tutorUserId: number,
    introductionReceiverUserId: number
  ): Promise<ResourceIntroduction> {
    this.logger.debug(
      `Attempting to create introduction for resource ${resourceId}, tutor ${tutorUserId}, receiver ${introductionReceiverUserId}`
    );
    // Check if resource exists
    const resource = await this.resourcesService.getResourceById(resourceId);
    if (!resource) {
      this.logger.warn(`Create introduction failed: Resource ${resourceId} not found.`);
      throw new ResourceNotFoundException(resourceId);
    }

    // Check if the completing user has permission to give introductions
    this.logger.debug(`Checking if tutor ${tutorUserId} can give introductions for resource ${resourceId}`);
    const hasPermission = await this.canGiveIntroductions(resourceId, tutorUserId);
    if (!hasPermission) {
      this.logger.warn(`Create introduction failed: Tutor ${tutorUserId} lacks permission for resource ${resourceId}.`);
      throw new MissingResourceIntroductionPermissionException();
    }

    // Check if introduction already completed
    this.logger.debug(
      `Checking for existing introduction for receiver ${introductionReceiverUserId} on resource ${resourceId}`
    );
    const existingIntroduction = await this.resourceIntroductionRepository.findOne({
      where: {
        resourceId,
        receiverUserId: introductionReceiverUserId,
      },
    });

    if (existingIntroduction) {
      this.logger.warn(
        `Create introduction failed: Introduction already exists for receiver ${introductionReceiverUserId} on resource ${resourceId}`
      );
      throw new IntroducionAlreadyCompletedException();
    }

    // Create or update introduction record
    const introduction = this.resourceIntroductionRepository.create({
      resourceId,
      receiverUserId: introductionReceiverUserId,
      tutorUserId: tutorUserId,
    });

    this.logger.debug('Saving new introduction record');
    const savedIntroduction = await this.resourceIntroductionRepository.save(introduction);
    this.logger.log(
      `Successfully created introduction ${savedIntroduction.id} for resource ${resourceId}, receiver ${introductionReceiverUserId}`
    );
    return savedIntroduction;
  }

  async removeOne(resourceId: number, introductionReceiverUserId: number) {
    this.logger.debug(
      `Attempting to remove introduction for resource ${resourceId}, receiver ${introductionReceiverUserId}`
    );
    // Consider adding a check if it exists before deleting?
    const result = await this.resourceIntroductionRepository.delete({
      resourceId,
      receiverUserId: introductionReceiverUserId,
    });
    if (result.affected > 0) {
      this.logger.log(
        `Successfully removed introduction for resource ${resourceId}, receiver ${introductionReceiverUserId}`
      );
    } else {
      this.logger.warn(
        `Attempted to remove introduction for resource ${resourceId}, receiver ${introductionReceiverUserId}, but none was found.`
      );
    }
  }

  async hasCompletedIntroduction(resourceId: number, introductionReceiverUserId: number): Promise<boolean> {
    this.logger.debug(
      `Checking if user ${introductionReceiverUserId} has completed introduction for resource ${resourceId}`
    );
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        resourceId,
        receiverUserId: introductionReceiverUserId,
      },
    });

    const hasCompleted = !!introduction?.completedAt;
    this.logger.debug(
      `User ${introductionReceiverUserId} completed introduction status for resource ${resourceId}: ${hasCompleted}`
    );
    return hasCompleted;
  }

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

  async getAllByResourceId(
    resourceId: number,
    page = 1,
    limit = 10
  ): Promise<{ data: ResourceIntroduction[]; total: number }> {
    this.logger.debug(`Getting introductions for resource ${resourceId}, page ${page}, limit ${limit}`);
    const [introductions, total] = await this.resourceIntroductionRepository.findAndCount({
      where: { resourceId },
      relations: ['receiverUser', 'tutorUser'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        completedAt: 'DESC', // Sort by most recently completed
      },
    });

    this.logger.debug(`Found ${total} introductions for resource ${resourceId}, returning ${introductions.length}`);
    return {
      data: introductions,
      total,
    };
  }

  async getAllByUserId(userId: number): Promise<ResourceIntroduction[]> {
    this.logger.debug(`Getting all introductions received by user ${userId}`);
    const introductions = await this.resourceIntroductionRepository.find({
      where: { receiverUserId: userId },
      relations: ['resource', 'tutorUser'],
    });
    this.logger.debug(`Found ${introductions.length} introductions for user ${userId}`);
    return introductions;
  }
  async isIntroductionRevoked(introductionId: number): Promise<boolean> {
    this.logger.debug(`Checking if introduction ${introductionId} is revoked`);
    const latestHistory = await this.resourceIntroductionHistoryRepository.findOne({
      where: { introductionId },
      order: { createdAt: 'DESC' },
    });

    // If there's no history, it's not revoked
    if (!latestHistory) {
      this.logger.debug(`Introduction ${introductionId} has no history, thus not revoked.`);
      return false;
    }

    const isRevoked = latestHistory.action === IntroductionHistoryAction.REVOKE;
    this.logger.debug(
      `Latest history action for introduction ${introductionId} is ${latestHistory.action}. Revoked status: ${isRevoked}`
    );
    // If the latest action is REVOKE, then it's revoked
    return isRevoked;
  }

  async getIntroductionHistory(introductionId: number): Promise<ResourceIntroductionHistoryItem[]> {
    this.logger.debug(`Getting history for introduction ${introductionId}`);
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: { id: introductionId },
    });

    if (!introduction) {
      this.logger.warn(`Get history failed: Introduction ${introductionId} not found.`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    const history = await this.resourceIntroductionHistoryRepository.find({
      where: { introductionId },
      relations: ['performedByUser'],
      order: { createdAt: 'DESC' },
    });
    this.logger.debug(`Found ${history.length} history items for introduction ${introductionId}`);
    return history;
  }

  async revoke(
    introductionId: number,
    performedByUserId: number,
    comment?: string
  ): Promise<ResourceIntroductionHistoryItem> {
    this.logger.debug(`Attempting to revoke introduction ${introductionId} by user ${performedByUserId}`);
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: { id: introductionId },
    });

    if (!introduction) {
      this.logger.warn(`Revoke failed: Introduction ${introductionId} not found.`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    // Check if it's already revoked
    this.logger.debug(`Checking if introduction ${introductionId} is already revoked`);
    const isRevoked = await this.isIntroductionRevoked(introductionId);
    if (isRevoked) {
      this.logger.warn(`Revoke failed: Introduction ${introductionId} is already revoked.`);
      throw new BadRequestException('This introduction is already revoked');
    }

    // Create history entry
    this.logger.debug(`Creating REVOKE history entry for introduction ${introductionId}`);
    const historyEntry = this.resourceIntroductionHistoryRepository.create({
      introductionId,
      action: IntroductionHistoryAction.REVOKE,
      performedByUserId,
      comment: comment || null,
    });

    const savedEntry = await this.resourceIntroductionHistoryRepository.save(historyEntry);
    this.logger.log(
      `Successfully revoked introduction ${introductionId} by user ${performedByUserId} (History ID: ${savedEntry.id})`
    );
    return savedEntry;
  }

  async unrevoke(
    introductionId: number,
    performedByUserId: number,
    comment?: string
  ): Promise<ResourceIntroductionHistoryItem> {
    this.logger.debug(`Attempting to unrevoke introduction ${introductionId} by user ${performedByUserId}`);
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: { id: introductionId },
    });

    if (!introduction) {
      this.logger.warn(`Unrevoke failed: Introduction ${introductionId} not found.`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    // Check if it's already unrevoked (not revoked)
    this.logger.debug(`Checking if introduction ${introductionId} is currently revoked`);
    const isRevoked = await this.isIntroductionRevoked(introductionId);
    if (!isRevoked) {
      this.logger.warn(`Unrevoke failed: Introduction ${introductionId} is not currently revoked.`);
      throw new BadRequestException('This introduction is not revoked');
    }

    // Create history entry
    this.logger.debug(`Creating UNREVOKE history entry for introduction ${introductionId}`);
    const historyEntry = this.resourceIntroductionHistoryRepository.create({
      introductionId,
      action: IntroductionHistoryAction.UNREVOKE,
      performedByUserId,
      comment: comment || null,
    });

    const savedEntry = await this.resourceIntroductionHistoryRepository.save(historyEntry);
    this.logger.log(
      `Successfully un-revoked introduction ${introductionId} by user ${performedByUserId} (History ID: ${savedEntry.id})`
    );
    return savedEntry;
  }

  async hasValidIntroduction(resourceId: number, introductionReceiverUserId: number): Promise<boolean> {
    this.logger.debug(`Checking for valid introduction for resource ${resourceId}, user ${introductionReceiverUserId}`);
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        resourceId,
        receiverUserId: introductionReceiverUserId,
      },
    });

    // If no introduction exists, return false
    if (!introduction?.completedAt) {
      this.logger.debug(
        `No completed introduction found for resource ${resourceId}, user ${introductionReceiverUserId}. Valid: false`
      );
      return false;
    }
    this.logger.debug(
      `Found completed introduction ${introduction.id} for resource ${resourceId}, user ${introductionReceiverUserId}. Checking revocation status.`
    );

    // Check if it's revoked
    const isRevoked = await this.isIntroductionRevoked(introduction.id);

    const isValid = !isRevoked;
    this.logger.debug(`Introduction ${introduction.id} revoked status: ${isRevoked}. Final valid status: ${isValid}`);
    // Valid if it exists and is not revoked
    return isValid;
  }

  async getOneById(resourceId: number, introductionId: number): Promise<ResourceIntroduction> {
    this.logger.debug(`Getting introduction by ID ${introductionId} for resource ${resourceId}`);
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        id: introductionId,
        resourceId,
      },
      relations: ['receiverUser', 'tutorUser'],
    });

    if (!introduction) {
      this.logger.warn(`Introduction ${introductionId} not found for resource ${resourceId}.`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    this.logger.debug(`Found introduction ${introductionId} for resource ${resourceId}.`);
    return introduction;
  }

  async canManageIntroductions(resourceId: number, userId: number): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can manage introductions for resource ${resourceId}`);
    // By default, check if the user is an introducer for this resource
    const isIntroducer = await this.resourceIntroductionUserRepository.findOne({
      where: {
        resourceId,
        userId,
      },
    });

    this.logger.debug(`User ${userId} is introducer for resource ${resourceId}: ${!!isIntroducer}`);
    const user = await this.usersService.findOne({ id: userId });
    const isResourceManager = user?.systemPermissions.canManageResources ?? false;
    this.logger.debug(`User ${userId} has system permission 'canManageResources': ${isResourceManager}`);

    const canManage = !!isIntroducer || isResourceManager;
    this.logger.debug(
      `Final determination: User ${userId} can manage introductions for resource ${resourceId}: ${canManage}`
    );
    return canManage;
  }
}

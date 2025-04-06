import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResourceIntroduction,
  ResourceIntroductionUser,
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
  ResourceGroup,
} from '@attraccess/database-entities';
import { GroupsService } from '../groups.service';
import { GroupNotFoundException } from '../../../exceptions/group.notFound.exception';
import { ResourceIntroductionNotFoundException } from '../../../exceptions/resource.introduction.notFound.exception';
import { MissingIntroductionPermissionException } from '../../../exceptions/resource.introduction.forbidden.exception';
import { UsersService } from '../../../users-and-auth/users/users.service';

class IntroductionAlreadyCompletedException extends BadRequestException {
  constructor() {
    super('IntroductionAlreadyCompletedError');
  }
}

export class UserAlreadyHasIntroductionPermissionException extends ForbiddenException {
  constructor() {
    super('UserAlreadyHasIntroductionPermissionException');
  }
}

@Injectable()
export class GroupIntroductionService {
  private readonly logger = new Logger(GroupIntroductionService.name);

  constructor(
    @InjectRepository(ResourceIntroduction)
    private resourceIntroductionRepository: Repository<ResourceIntroduction>,
    @InjectRepository(ResourceIntroductionUser)
    private resourceIntroductionUserRepository: Repository<ResourceIntroductionUser>,
    @InjectRepository(ResourceIntroductionHistoryItem)
    private resourceIntroductionHistoryRepository: Repository<ResourceIntroductionHistoryItem>,
    private groupsService: GroupsService,
    private usersService: UsersService
  ) {}

  private async ensureGroupExists(groupId: number): Promise<ResourceGroup> {
    const group = await this.groupsService.getGroupById(groupId);
    if (!group) {
      this.logger.warn(`Group with ID ${groupId} not found.`);
      throw new GroupNotFoundException(groupId);
    }
    return group;
  }

  async createIntroduction(
    groupId: number,
    tutorUserId: number,
    introductionReceiverUserId: number
  ): Promise<ResourceIntroduction> {
    await this.ensureGroupExists(groupId);

    const hasPermission = await this.canGiveGroupIntroductions(
      groupId,
      tutorUserId
    );
    if (!hasPermission) {
      throw new MissingIntroductionPermissionException();
    }

    const existingIntroduction =
      await this.resourceIntroductionRepository.findOne({
        where: {
          resourceGroupId: groupId,
          receiverUserId: introductionReceiverUserId,
        },
      });

    if (existingIntroduction) {
      throw new IntroductionAlreadyCompletedException();
    }

    const introduction = this.resourceIntroductionRepository.create({
      resourceGroupId: groupId,
      resourceId: null,
      receiverUserId: introductionReceiverUserId,
      tutorUserId: tutorUserId,
    });

    return this.resourceIntroductionRepository.save(introduction);
  }

  async removeIntroduction(
    groupId: number,
    introductionReceiverUserId: number
  ) {
    await this.resourceIntroductionRepository.delete({
      resourceGroupId: groupId,
      receiverUserId: introductionReceiverUserId,
    });
  }

  async hasCompletedIntroduction(
    groupId: number,
    introductionReceiverUserId: number
  ): Promise<boolean> {
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        resourceGroupId: groupId,
        receiverUserId: introductionReceiverUserId,
      },
    });

    return !!introduction?.completedAt;
  }

  async canGiveGroupIntroductions(
    groupId: number,
    tutorUserId: number
  ): Promise<boolean> {
    const permission = await this.resourceIntroductionUserRepository.findOne({
      where: {
        resourceGroupId: groupId,
        userId: tutorUserId,
      },
    });

    const hasSpecificPermission = !!permission;

    const user = await this.usersService.findOne({ id: tutorUserId });
    const hasSystemPermission = user.systemPermissions.canManageResources;

    return hasSpecificPermission || hasSystemPermission;
  }

  async getGroupIntroductions(
    groupId: number,
    page = 1,
    limit = 10
  ): Promise<{ data: ResourceIntroduction[]; total: number }> {
    await this.ensureGroupExists(groupId);

    const [introductions, total] =
      await this.resourceIntroductionRepository.findAndCount({
        where: { resourceGroupId: groupId },
        relations: ['receiverUser', 'tutorUser', 'resourceGroup'],
        skip: (page - 1) * limit,
        take: limit,
        order: {
          completedAt: 'DESC',
        },
      });

    return {
      data: introductions,
      total,
    };
  }

  async getUserGroupIntroductions(
    userId: number
  ): Promise<ResourceIntroduction[]> {
    return this.resourceIntroductionRepository.find({
      where: { receiverUserId: userId },
      relations: ['resourceGroup', 'tutorUser'],
    });
  }

  async addIntroducer(
    groupId: number,
    userId: number
  ): Promise<ResourceIntroductionUser> {
    await this.ensureGroupExists(groupId);

    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const existingPermission =
      await this.resourceIntroductionUserRepository.findOne({
        where: {
          resourceGroupId: groupId,
          userId,
        },
      });

    if (existingPermission) {
      throw new UserAlreadyHasIntroductionPermissionException();
    }

    const permission = this.resourceIntroductionUserRepository.create({
      resourceGroupId: groupId,
      resourceId: null,
      userId,
      grantedAt: new Date(),
    });

    return this.resourceIntroductionUserRepository.save(permission);
  }

  async removeIntroducer(groupId: number, userId: number): Promise<void> {
    await this.ensureGroupExists(groupId);

    const introductionPermission =
      await this.resourceIntroductionUserRepository.findOne({
        where: {
          resourceGroupId: groupId,
          userId,
        },
      });

    if (!introductionPermission) {
      throw new NotFoundException(
        `Introduction permission not found for user ${userId} in group ${groupId}`
      );
    }

    await this.resourceIntroductionUserRepository.delete(
      introductionPermission.id
    );
  }

  async getGroupIntroducers(
    groupId: number
  ): Promise<ResourceIntroductionUser[]> {
    await this.ensureGroupExists(groupId);

    return this.resourceIntroductionUserRepository.find({
      where: { resourceGroupId: groupId },
      relations: ['user', 'resourceGroup'],
    });
  }

  private async getIntroductionAndVerifyPermission(
    introductionId: number,
    userId: number
  ): Promise<ResourceIntroduction> {
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: { id: introductionId },
      relations: ['resourceGroup'],
    });

    if (!introduction) {
      this.logger.error(`Introduction with ID ${introductionId} not found.`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    if (!introduction.resourceGroupId) {
      this.logger.error(
        `Introduction ID ${introductionId} is not linked to a group.`
      );
      throw new BadRequestException(
        `Introduction ID ${introductionId} does not belong to a group.`
      );
    }

    const canManage = await this.canManageGroupIntroductions(
      introduction.resourceGroupId,
      userId
    );
    if (!canManage) {
      throw new MissingIntroductionPermissionException();
    }

    return introduction;
  }

  async isIntroductionRevoked(introductionId: number): Promise<boolean> {
    const latestHistory =
      await this.resourceIntroductionHistoryRepository.findOne({
        where: { introductionId },
        order: { createdAt: 'DESC' },
      });

    if (!latestHistory) {
      return false;
    }

    return latestHistory.action === IntroductionHistoryAction.REVOKE;
  }

  async getIntroductionHistory(
    introductionId: number
  ): Promise<ResourceIntroductionHistoryItem[]> {
    return this.resourceIntroductionHistoryRepository.find({
      where: { introductionId },
      relations: ['performedByUser'],
      order: { createdAt: 'ASC' },
    });
  }

  async revokeIntroduction(
    introductionId: number,
    performedByUserId: number,
    comment?: string
  ): Promise<ResourceIntroductionHistoryItem> {
    await this.getIntroductionAndVerifyPermission(
      introductionId,
      performedByUserId
    );

    const historyItem = this.resourceIntroductionHistoryRepository.create({
      introductionId,
      action: IntroductionHistoryAction.REVOKE,
      performedByUserId,
      comment,
      createdAt: new Date(),
    });

    return this.resourceIntroductionHistoryRepository.save(historyItem);
  }

  async unrevokeIntroduction(
    introductionId: number,
    performedByUserId: number,
    comment?: string
  ): Promise<ResourceIntroductionHistoryItem> {
    await this.getIntroductionAndVerifyPermission(
      introductionId,
      performedByUserId
    );

    const historyItem = this.resourceIntroductionHistoryRepository.create({
      introductionId,
      action: IntroductionHistoryAction.UNREVOKE,
      performedByUserId,
      comment,
      createdAt: new Date(),
    });

    return this.resourceIntroductionHistoryRepository.save(historyItem);
  }

  async hasValidGroupIntroduction(
    groupId: number,
    introductionReceiverUserId: number
  ): Promise<boolean> {
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        resourceGroupId: groupId,
        receiverUserId: introductionReceiverUserId,
      },
    });

    if (!introduction || !introduction.completedAt) {
      return false;
    }

    const revoked = await this.isIntroductionRevoked(introduction.id);
    return !revoked;
  }

  async getGroupIntroductionById(
    groupId: number,
    introductionId: number
  ): Promise<ResourceIntroduction> {
    await this.ensureGroupExists(groupId);

    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        id: introductionId,
        resourceGroupId: groupId,
      },
      relations: ['receiverUser', 'tutorUser', 'history', 'resourceGroup'],
    });

    if (!introduction) {
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    return introduction;
  }

  async canManageGroupIntroductions(
    groupId: number,
    userId: number
  ): Promise<boolean> {
    return this.canGiveGroupIntroductions(groupId, userId);
  }

  async canManageGroupIntroducers(
    groupId: number,
    userId: number
  ): Promise<boolean> {
    const introductionsGivenCount =
      await this.resourceIntroductionRepository.count({
        where: {
          resourceGroupId: groupId,
          tutorUserId: userId,
        },
      });

    const user = await this.usersService.findOne({ id: userId });
    const hasSystemPermission = user.systemPermissions.canManageResources;

    return introductionsGivenCount > 0 || hasSystemPermission;
  }
}

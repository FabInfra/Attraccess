import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ResourceIntroduction,
  ResourceIntroducer,
  ResourceIntroductionHistoryItem,
  IntroductionHistoryAction,
} from '@attraccess/database-entities';
import { ResourceGroupsService } from '../resourceGroups.service';
import { UsersService } from '../../../users-and-auth/users/users.service';
import { UserNotFoundException } from '../../../exceptions/user.notFound.exception';
import { ResourceIntroductionNotFoundException } from '../../../exceptions/resource.introduction.notFound.exception';

class GroupNotFoundException extends NotFoundException {
  constructor(groupId: number) {
    super(`Resource group with ID ${groupId} not found`);
  }
}

class UserAlreadyIntroducedToGroupException extends ConflictException {
  constructor(userId: number, groupId: number) {
    super(`User ${userId} already has an introduction for group ${groupId}`);
  }
}

@Injectable()
export class ResourceGroupIntroductionService {
  private readonly logger = new Logger(ResourceGroupIntroductionService.name);

  constructor(
    @InjectRepository(ResourceIntroduction)
    private resourceIntroductionsRepository: Repository<ResourceIntroduction>,
    @InjectRepository(ResourceIntroducer)
    private resourceIntroducersRepository: Repository<ResourceIntroducer>,
    @InjectRepository(ResourceIntroductionHistoryItem)
    private resourceIntroductionHistoryRepository: Repository<ResourceIntroductionHistoryItem>,
    private resourceGroupsService: ResourceGroupsService,
    private usersService: UsersService
  ) {}

  async createGroupIntroduction(
    groupId: number,
    tutorUserId: number,
    receiverUserId: number
  ): Promise<ResourceIntroduction> {
    this.logger.debug(
      `Creating group introduction for user ${receiverUserId} to group ${groupId} by tutor ${tutorUserId}`
    );

    // Check if the group exists
    const group = await this.resourceGroupsService.getById(groupId);
    if (!group) {
      this.logger.warn(`Group ${groupId} not found when creating introduction`);
      throw new GroupNotFoundException(groupId);
    }

    // Check if tutor can give introductions
    const canGiveIntroductions = await this.canGiveGroupIntroductions(groupId, tutorUserId);
    if (!canGiveIntroductions) {
      this.logger.warn(`User ${tutorUserId} does not have permission to give introductions for group ${groupId}`);
      throw new NotFoundException(`User ${tutorUserId} is not authorized to introduce users to group ${groupId}`);
    }

    // Check if the receiver user exists
    const receiverUser = await this.usersService.findOne({ id: receiverUserId });
    if (!receiverUser) {
      this.logger.warn(`User ${receiverUserId} not found when creating introduction`);
      throw new UserNotFoundException(receiverUserId);
    }

    // Check if an introduction already exists
    const existingIntroduction = await this.resourceIntroductionsRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        receiverUserId: receiverUserId,
      },
    });

    if (existingIntroduction) {
      this.logger.warn(`User ${receiverUserId} already has an introduction for group ${groupId}`);
      throw new UserAlreadyIntroducedToGroupException(receiverUserId, groupId);
    }

    // Create the introduction
    const introduction = this.resourceIntroductionsRepository.create({
      resourceGroup: { id: groupId },
      receiverUserId: receiverUserId,
      tutorUserId: tutorUserId,
      completedAt: new Date(),
    });

    const savedIntroduction = await this.resourceIntroductionsRepository.save(introduction);
    this.logger.log(
      `Created group introduction ID ${savedIntroduction.id} for user ${receiverUserId} to group ${groupId}`
    );

    // Return the full introduction with relations
    return this.getGroupIntroductionById(savedIntroduction.id, groupId);
  }

  async getGroupIntroductions(
    groupId: number,
    page: number,
    limit: number
  ): Promise<{ data: ResourceIntroduction[]; total: number }> {
    this.logger.debug(`Getting introductions for group ${groupId}, page ${page}, limit ${limit}`);

    // Check if the group exists
    const group = await this.resourceGroupsService.getById(groupId);
    if (!group) {
      this.logger.warn(`Group ${groupId} not found when getting introductions`);
      throw new GroupNotFoundException(groupId);
    }

    const [introductions, total] = await this.resourceIntroductionsRepository.findAndCount({
      where: {
        resourceGroup: { id: groupId },
      },
      relations: ['receiverUser', 'tutorUser'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        completedAt: 'DESC',
      },
    });

    this.logger.debug(`Found ${introductions.length} introductions for group ${groupId} (total: ${total})`);
    return { data: introductions, total };
  }

  async hasValidGroupIntroduction(groupId: number, userId: number): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} has valid introduction for group ${groupId}`);

    // Check if there's an introduction for this user and group
    const introduction = await this.resourceIntroductionsRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        receiverUserId: userId,
      },
      relations: ['history'],
    });

    if (!introduction) {
      this.logger.debug(`No introduction found for user ${userId} to group ${groupId}`);
      return false;
    }

    // If there's an introduction, check if it's not revoked
    const isRevoked = await this.isIntroductionRevoked(introduction.id);

    this.logger.debug(`User ${userId} has introduction to group ${groupId}, revoked: ${isRevoked}`);
    return !isRevoked;
  }

  async canGiveGroupIntroductions(groupId: number, userId: number): Promise<boolean> {
    this.logger.debug(`Checking if user ${userId} can give introductions for group ${groupId}`);

    const introducer = await this.resourceIntroducersRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        userId: userId,
      },
    });

    return !!introducer;
  }

  async getGroupIntroductionById(introductionId: number, groupId: number): Promise<ResourceIntroduction> {
    this.logger.debug(`Getting introduction ID ${introductionId} for group ${groupId}`);

    const introduction = await this.resourceIntroductionsRepository.findOne({
      where: {
        id: introductionId,
        resourceGroup: { id: groupId },
      },
      relations: ['receiverUser', 'tutorUser', 'history', 'history.performedByUser'],
    });

    if (!introduction) {
      this.logger.warn(`Introduction ID ${introductionId} not found for group ${groupId}`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    return introduction;
  }

  async revokeGroupIntroduction(
    introductionId: number,
    performedByUserId: number,
    comment?: string
  ): Promise<ResourceIntroductionHistoryItem> {
    this.logger.debug(`Revoking introduction ID ${introductionId} by user ${performedByUserId}`);

    // Check if the introduction exists
    const introduction = await this.resourceIntroductionsRepository.findOne({
      where: { id: introductionId },
      relations: ['resourceGroup'],
    });

    if (!introduction) {
      this.logger.warn(`Introduction ID ${introductionId} not found when revoking`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    // Create the history item for revocation
    const historyItem = this.resourceIntroductionHistoryRepository.create({
      introductionId: introductionId,
      action: IntroductionHistoryAction.REVOKE,
      performedByUserId: performedByUserId,
      comment: comment || null,
    });

    const savedHistoryItem = await this.resourceIntroductionHistoryRepository.save(historyItem);
    this.logger.log(`Revoked introduction ID ${introductionId}, history item ID ${savedHistoryItem.id}`);

    return savedHistoryItem;
  }

  async unrevokeGroupIntroduction(
    introductionId: number,
    performedByUserId: number,
    comment?: string
  ): Promise<ResourceIntroductionHistoryItem> {
    this.logger.debug(`Unrevoking introduction ID ${introductionId} by user ${performedByUserId}`);

    // Check if the introduction exists
    const introduction = await this.resourceIntroductionsRepository.findOne({
      where: { id: introductionId },
      relations: ['resourceGroup'],
    });

    if (!introduction) {
      this.logger.warn(`Introduction ID ${introductionId} not found when unrevoking`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    // Create the history item for unrevocation
    const historyItem = this.resourceIntroductionHistoryRepository.create({
      introductionId: introductionId,
      action: IntroductionHistoryAction.UNREVOKE,
      performedByUserId: performedByUserId,
      comment: comment || null,
    });

    const savedHistoryItem = await this.resourceIntroductionHistoryRepository.save(historyItem);
    this.logger.log(`Unrevoked introduction ID ${introductionId}, history item ID ${savedHistoryItem.id}`);

    return savedHistoryItem;
  }

  async getGroupIntroductionHistory(introductionId: number): Promise<ResourceIntroductionHistoryItem[]> {
    this.logger.debug(`Getting history for introduction ID ${introductionId}`);

    const introduction = await this.resourceIntroductionsRepository.findOne({
      where: { id: introductionId },
    });

    if (!introduction) {
      this.logger.warn(`Introduction ID ${introductionId} not found when getting history`);
      throw new ResourceIntroductionNotFoundException(introductionId);
    }

    const history = await this.resourceIntroductionHistoryRepository.find({
      where: { introductionId: introductionId },
      relations: ['performedByUser'],
      order: { createdAt: 'DESC' },
    });

    this.logger.debug(`Found ${history.length} history items for introduction ID ${introductionId}`);
    return history;
  }

  async isIntroductionRevoked(introductionId: number): Promise<boolean> {
    this.logger.debug(`Checking revocation status for introduction ID ${introductionId}`);

    const history = await this.resourceIntroductionHistoryRepository.find({
      where: { introductionId: introductionId },
      order: { createdAt: 'DESC' },
    });

    // If no history, it's not revoked
    if (history.length === 0) {
      return false;
    }

    // Check the most recent action
    const mostRecentAction = history[0].action;
    return mostRecentAction === IntroductionHistoryAction.REVOKE;
  }
}

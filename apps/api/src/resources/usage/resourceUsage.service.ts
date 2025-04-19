import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, FindOneOptions } from 'typeorm';
import { ResourceUsage, User } from '@attraccess/database-entities';
import { ResourcesService } from '../resources.service';
import { StartUsageSessionDto } from './dtos/startUsageSession.dto';
import { EndUsageSessionDto } from './dtos/endUsageSession.dto';
import { ResourceIntroductionService } from '../introduction/resourceIntroduction.service';
import { ResourceNotFoundException } from '../../exceptions/resource.notFound.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResourceUsageStartedEvent, ResourceUsageEndedEvent } from './events/resource-usage.events';

@Injectable()
export class ResourceUsageService {
  private readonly logger = new Logger(ResourceUsageService.name);

  constructor(
    @InjectRepository(ResourceUsage)
    private resourceUsageRepository: Repository<ResourceUsage>,
    private resourcesService: ResourcesService,
    private resourceIntroductionService: ResourceIntroductionService,
    private eventEmitter: EventEmitter2
  ) {}

  async startSession(resourceId: number, user: User, dto: StartUsageSessionDto): Promise<ResourceUsage> {
    this.logger.debug(`Attempting to start usage session for resource ${resourceId} by user ${user.id}`);
    // Check if resource exists and is ready
    const resource = await this.resourcesService.getResourceById(resourceId);
    if (!resource) {
      this.logger.warn(`Start session failed: Resource ${resourceId} not found.`);
      throw new ResourceNotFoundException(resourceId);
    }

    // Skip introduction check for users with resource management permission
    const canManageResources = user.systemPermissions?.canManageResources || false;
    this.logger.debug(`User ${user.id} system permission 'canManageResources': ${canManageResources}`);

    let canStartSession = canManageResources;

    // Only check for introduction if user doesn't have resource management permission
    if (!canStartSession) {
      this.logger.debug(
        `User ${user.id} does not have canManageResources, checking introduction status for resource ${resourceId}`
      );
      // Check if user has completed the introduction
      const hasCompletedIntroduction = await this.resourceIntroductionService.hasCompletedIntroduction(
        resourceId,
        user.id
      );
      this.logger.debug(
        `User ${user.id} has completed introduction for resource ${resourceId}: ${hasCompletedIntroduction}`
      );

      canStartSession = hasCompletedIntroduction;
    }

    // Allow starting if user can give introductions (e.g., for testing/setup)
    if (!canStartSession) {
      this.logger.debug(
        `User ${user.id} has not completed introduction, checking if they can give introductions for resource ${resourceId}`
      );
      const canGiveIntroductions = await this.resourceIntroductionService.canGiveIntroductions(resourceId, user.id);
      this.logger.debug(`User ${user.id} can give introductions for resource ${resourceId}: ${canGiveIntroductions}`);

      canStartSession = canGiveIntroductions;
    }

    if (!canStartSession) {
      this.logger.warn(
        `Start session failed: User ${user.id} lacks permission/introduction for resource ${resourceId}`
      );
      throw new BadRequestException('You must complete the resource introduction before using it');
    }
    this.logger.debug(`User ${user.id} is authorized to start session for resource ${resourceId}`);

    // Check if user has an active session
    this.logger.debug(`Checking for active session on resource ${resourceId}`);
    const activeSession = await this.getActiveSession(resourceId);
    if (activeSession) {
      this.logger.warn(
        `Start session failed: Resource ${resourceId} already has an active session by user ${activeSession.userId}`
      );
      throw new BadRequestException('Resource already has an active session');
    }

    // Create new usage session
    this.logger.debug(`Creating new usage session record for resource ${resourceId}, user ${user.id}`);
    const usageData = {
      resourceId,
      userId: user.id,
      startTime: new Date(),
      startNotes: dto.notes,
      endTime: null,
      endNotes: null,
    };

    try {
      await this.resourceUsageRepository.createQueryBuilder().insert().into(ResourceUsage).values(usageData).execute();
      this.logger.log(`Successfully created usage session for resource ${resourceId}, user ${user.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to insert usage session for resource ${resourceId}, user ${user.id}: ${error.message}`,
        error.stack
      );
      throw error;
    }

    const newSession = await this.resourceUsageRepository.findOne({
      where: {
        resourceId,
        userId: user.id,
        endTime: IsNull(),
      },
      order: {
        startTime: 'DESC',
      },
      relations: ['resource', 'user'],
    });

    // Emit event after successful save
    this.logger.debug(`Emitting resource.usage.started event for resource ${resourceId}`);
    this.eventEmitter.emit('resource.usage.started', new ResourceUsageStartedEvent(resourceId, usageData.startTime));

    return newSession;
  }

  async endSession(resourceId: number, user: User, dto: EndUsageSessionDto): Promise<ResourceUsage> {
    this.logger.debug(`Attempting to end usage session for resource ${resourceId} by user ${user.id}`);
    // Find active session
    const activeSession = await this.getActiveSession(resourceId);
    if (!activeSession) {
      this.logger.warn(`End session failed: No active session found for resource ${resourceId}`);
      throw new BadRequestException('No active session found');
    }
    this.logger.debug(`Found active session ${activeSession.id} started by user ${activeSession.userId}`);

    // Check if the user is authorized to end the session
    const canManageResources = user.systemPermissions?.canManageResources || false;
    const isSessionOwner = activeSession.userId === user.id;
    this.logger.debug(
      `End session authorization check for user ${user.id}: isOwner=${isSessionOwner}, canManageResources=${canManageResources}`
    );

    if (!isSessionOwner && !canManageResources) {
      this.logger.warn(
        `End session forbidden: User ${user.id} is not owner (${activeSession.userId}) and lacks canManageResources permission.`
      );
      throw new ForbiddenException('You are not authorized to end this session');
    }

    const endTime = new Date();

    // Update session with end time and notes - using explicit update to avoid the generated column
    this.logger.debug(`Updating session ${activeSession.id} with end time and notes.`);
    try {
      await this.resourceUsageRepository
        .createQueryBuilder()
        .update(ResourceUsage)
        .set({
          endTime,
          endNotes: dto.notes,
        })
        .where('id = :id', { id: activeSession.id })
        .execute();
      this.logger.log(`Successfully updated session ${activeSession.id} to end.`);
    } catch (error) {
      this.logger.error(`Failed to update usage session ${activeSession.id}: ${error.message}`, error.stack);
      throw error;
    }

    // Emit event after successful save
    this.logger.debug(`Emitting resource.usage.ended event for resource ${resourceId}`);
    this.eventEmitter.emit(
      'resource.usage.ended',
      new ResourceUsageEndedEvent(resourceId, activeSession.startTime, endTime)
    );

    // Fetch the updated record
    return await this.resourceUsageRepository.findOne({
      where: { id: activeSession.id },
      relations: ['resource', 'user'],
    });
  }

  async getActiveSession(resourceId: number): Promise<ResourceUsage | null> {
    this.logger.debug(`Checking for active session for resource ${resourceId}`);
    const session = await this.resourceUsageRepository.findOne({
      where: {
        resourceId,
        endTime: IsNull(),
      },
      relations: ['user'],
    });
    this.logger.debug(`Active session found for resource ${resourceId}: ${session ? session.id : 'None'}`);
    return session;
  }

  async getResourceUsageHistory(
    resourceId: number,
    page = 1,
    limit = 10,
    userId?: number
  ): Promise<{ data: ResourceUsage[]; total: number }> {
    this.logger.debug(
      `Getting usage history for resource ${resourceId}, page ${page}, limit ${limit}, user ${userId || 'any'}`
    );
    const whereClause: FindOneOptions<ResourceUsage>['where'] = { resourceId };

    // Add userId filter if provided
    if (userId) {
      whereClause.userId = userId;
    }

    const [data, total] = await this.resourceUsageRepository.findAndCount({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      order: { startTime: 'DESC' },
      relations: ['user'],
    });

    this.logger.debug(`Found ${total} history entries for resource ${resourceId}, returning ${data.length}`);
    return { data, total };
  }

  async getUserUsageHistory(userId: number, page = 1, limit = 10): Promise<{ data: ResourceUsage[]; total: number }> {
    this.logger.debug(`Getting usage history for user ${userId}, page ${page}, limit ${limit}`);
    const [data, total] = await this.resourceUsageRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { startTime: 'DESC' },
      relations: ['resource'],
    });

    this.logger.debug(`Found ${total} history entries for user ${userId}, returning ${data.length}`);
    return { data, total };
  }
}

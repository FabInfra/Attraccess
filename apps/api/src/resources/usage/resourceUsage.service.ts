import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, FindOneOptions } from 'typeorm';
import { ResourceUsage, User } from '@attraccess/database-entities';
import { ResourcesService } from '../resources.service';
import { StartUsageSessionDto } from './dtos/startUsageSession.dto';
import { EndUsageSessionDto } from './dtos/endUsageSession.dto';
import { ResourceIntroductionService } from '../introduction/resourceIntroduction.service';
import { ResourceNotFoundException } from '../../exceptions/resource.notFound.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResourceUsageStartedEvent, ResourceUsageEndedEvent, ResourceUsageTakenOverEvent } from './events/resource-usage.events';

@Injectable()
export class ResourceUsageService {
  constructor(
    @InjectRepository(ResourceUsage)
    private resourceUsageRepository: Repository<ResourceUsage>,
    private resourcesService: ResourcesService,
    private resourceIntroductionService: ResourceIntroductionService,
    private eventEmitter: EventEmitter2
  ) {}

  async startSession(resourceId: number, user: User, dto: StartUsageSessionDto): Promise<ResourceUsage> {
    // Check if resource exists and is ready
    const resource = await this.resourcesService.getResourceById(resourceId);
    if (!resource) {
      throw new ResourceNotFoundException(resourceId);
    }

    // Skip introduction check for users with resource management permission
    const canManageResources = user.systemPermissions?.canManageResources || false;

    let canStartSession = canManageResources;

    // Only check for introduction if user doesn't have resource management permission
    if (!canStartSession) {
      // Check if user has completed the introduction
      const hasCompletedIntroduction = await this.resourceIntroductionService.hasCompletedIntroduction(
        resourceId,
        user.id
      );

      canStartSession = hasCompletedIntroduction;
    }

    if (!canStartSession) {
      const canGiveIntroductions = await this.resourceIntroductionService.canGiveIntroductions(resourceId, user.id);

      canStartSession = canGiveIntroductions;
    }

    if (!canStartSession) {
      throw new BadRequestException('You must complete the resource introduction before using it');
    }

    // Check if there's an active session
    const existingActiveSession = await this.getActiveSession(resourceId);
    if (existingActiveSession) {
      // If there's an active session, check if takeover is allowed
      if (dto.forceTakeOver && resource.allowTakeOver) {
        // End the existing session with a note about takeover
        await this.resourceUsageRepository
          .createQueryBuilder()
          .update(ResourceUsage)
          .set({
            endTime: new Date(),
            endNotes: `Session ended due to takeover by user ${user.id}`,
          })
          .where('id = :id', { id: existingActiveSession.id })
          .execute();

        const takeoverTime = new Date();
        // Emit event for the ended session
        this.eventEmitter.emit(
          'resource.usage.ended',
          new ResourceUsageEndedEvent(resourceId, existingActiveSession.startTime, takeoverTime, existingActiveSession.user)
        );

        // Emit event for the takeover
        this.eventEmitter.emit(
          'resource.usage.taken_over',
          new ResourceUsageTakenOverEvent(resourceId, takeoverTime, user, existingActiveSession.user)
        );
      } else if (dto.forceTakeOver && !resource.allowTakeOver) {
        throw new BadRequestException('This resource does not allow overtaking');
      } else {
        throw new BadRequestException('Resource is currently in use by another user');
      }
    }

    // Create new usage session
    const usageData = {
      resourceId,
      userId: user.id,
      startTime: new Date(),
      startNotes: dto.notes,
      endTime: null,
      endNotes: null,
    };

    await this.resourceUsageRepository.createQueryBuilder().insert().into(ResourceUsage).values(usageData).execute();

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
    this.eventEmitter.emit(
      'resource.usage.started',
      new ResourceUsageStartedEvent(resourceId, usageData.startTime, user)
    );
    if (!newSession) {
      // Should not happen if insert succeeded, but good practice to check
      throw new Error('Failed to retrieve the newly created session.');
    }

    return newSession;
  }

  async endSession(resourceId: number, user: User, dto: EndUsageSessionDto): Promise<ResourceUsage> {
    // Find active session
    const activeSession = await this.getActiveSession(resourceId);
    if (!activeSession) {
      throw new BadRequestException('No active session found');
    }

    // Check if the user is authorized to end the session
    const canManageResources = user.systemPermissions?.canManageResources || false;
    const isSessionOwner = activeSession.user.id === user.id; // Use loaded user ID

    if (!isSessionOwner && !canManageResources) {
      throw new ForbiddenException('You are not authorized to end this session');
    }

    const endTime = new Date();

    // Update session with end time and notes - using explicit update to avoid the generated column
    await this.resourceUsageRepository
      .createQueryBuilder()
      .update(ResourceUsage)
      .set({
        endTime,
        endNotes: dto.notes,
      })
      .where('id = :id', { id: activeSession.id })
      .execute();

    // Emit event after successful save
    this.eventEmitter.emit(
      'resource.usage.ended',
      new ResourceUsageEndedEvent(resourceId, activeSession.startTime, endTime, activeSession.user)
    );

    // Fetch the updated record
    return await this.resourceUsageRepository.findOne({
      where: { id: activeSession.id },
      relations: ['resource', 'user'],
    });
  }

  async getActiveSession(resourceId: number): Promise<ResourceUsage | null> {
    return await this.resourceUsageRepository.findOne({
      where: {
        resourceId,
        endTime: IsNull(),
      },
      relations: ['user'],
    });
  }

  async getResourceUsageHistory(
    resourceId: number,
    page = 1,
    limit = 10,
    userId?: number
  ): Promise<{ data: ResourceUsage[]; total: number }> {
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

    return { data, total };
  }

  async getUserUsageHistory(userId: number, page = 1, limit = 10): Promise<{ data: ResourceUsage[]; total: number }> {
    const [data, total] = await this.resourceUsageRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { startTime: 'DESC' },
      relations: ['resource'],
    });

    return { data, total };
  }
}

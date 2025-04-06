import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, FindOneOptions } from 'typeorm';
import { ResourceUsage, User } from '@attraccess/database-entities';
import { ResourcesService } from '../resources.service';
import { StartUsageSessionDto } from './dtos/startUsageSession.dto';
import { EndUsageSessionDto } from './dtos/endUsageSession.dto';
import { ResourceIntroductionService } from '../introduction/resourceIntroduction.service';
import { GroupIntroductionService } from '../groups/introduction/groupIntroduction.service';
import { ResourceNotFoundException } from '../../exceptions/resource.notFound.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ResourceUsageStartedEvent,
  ResourceUsageEndedEvent,
} from './events/resource-usage.events';

@Injectable()
export class ResourceUsageService {
  constructor(
    @InjectRepository(ResourceUsage)
    private resourceUsageRepository: Repository<ResourceUsage>,
    private resourcesService: ResourcesService,
    private resourceIntroductionService: ResourceIntroductionService,
    private groupIntroductionService: GroupIntroductionService,
    private eventEmitter: EventEmitter2
  ) {}

  async startSession(
    resourceId: number,
    user: User,
    dto: StartUsageSessionDto
  ): Promise<ResourceUsage> {
    const resource = await this.resourcesService.getResourceById(resourceId);
    if (!resource) {
      throw new ResourceNotFoundException(resourceId);
    }

    const canManageResources =
      user.systemPermissions?.canManageResources || false;

    let canStartSession = canManageResources;
    let hasResourceIntroduction = false;
    let canGiveResourceIntroductions = false;
    let hasGroupIntroduction = false;
    let canGiveGroupIntroductions = false;

    // 1. Check resource-specific introduction completion
    if (!canStartSession) {
      hasResourceIntroduction =
        await this.resourceIntroductionService.hasValidIntroduction(
          resourceId,
          user.id
        );
      canStartSession = hasResourceIntroduction;
    }

    // 2. Check resource-specific introducer permission
    if (!canStartSession) {
      canGiveResourceIntroductions =
        await this.resourceIntroductionService.canGiveIntroductions(
          resourceId,
          user.id
        );
      canStartSession = canGiveResourceIntroductions;
    }

    // 3. Fallback to group checks if resource checks failed and resource belongs to a group
    if (!canStartSession && resource.groupId) {
      // Check group introduction completion
      hasGroupIntroduction =
        await this.groupIntroductionService.hasValidGroupIntroduction(
          resource.groupId,
          user.id
        );
      canStartSession = hasGroupIntroduction;

      // Check group introducer permission
      if (!canStartSession) {
        canGiveGroupIntroductions =
          await this.groupIntroductionService.canGiveGroupIntroductions(
            resource.groupId,
            user.id
          );
        canStartSession = canGiveGroupIntroductions;
      }
    }

    // Final check before allowing session start
    if (!canStartSession) {
      // Provide a more informative error message
      let reason = 'You must complete the introduction before using it.';
      if (resource.groupId) {
        reason =
          'You must complete the introduction for the resource or its group before using it.';
      }
      throw new BadRequestException(reason);
    }

    const activeSession = await this.getActiveSession(resourceId, user.id);
    if (activeSession) {
      throw new BadRequestException('User already has an active session');
    }

    const usageData = {
      resourceId,
      userId: user.id,
      startTime: new Date(),
      startNotes: dto.notes,
      endTime: null,
      endNotes: null,
    };

    await this.resourceUsageRepository
      .createQueryBuilder()
      .insert()
      .into(ResourceUsage)
      .values(usageData)
      .execute();

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

    this.eventEmitter.emit(
      'resource.usage.started',
      new ResourceUsageStartedEvent(resourceId, user.id, usageData.startTime)
    );

    return newSession;
  }

  async endSession(
    resourceId: number,
    user: User,
    dto: EndUsageSessionDto
  ): Promise<ResourceUsage> {
    // Find active session
    const activeSession = await this.getActiveSession(resourceId, user.id);
    if (!activeSession) {
      throw new BadRequestException('No active session found');
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
      new ResourceUsageEndedEvent(
        resourceId,
        user.id,
        activeSession.startTime,
        endTime
      )
    );

    // Fetch the updated record
    return await this.resourceUsageRepository.findOne({
      where: { id: activeSession.id },
      relations: ['resource', 'user'],
    });
  }

  async getActiveSession(
    resourceId: number,
    userId: number
  ): Promise<ResourceUsage | null> {
    return await this.resourceUsageRepository.findOne({
      where: {
        resourceId,
        userId,
        endTime: IsNull(),
      },
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

  async getUserUsageHistory(
    userId: number,
    page = 1,
    limit = 10
  ): Promise<{ data: ResourceUsage[]; total: number }> {
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

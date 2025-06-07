import { InjectRepository } from '@nestjs/typeorm';

import { Injectable } from '@nestjs/common';
import {
  IntroductionHistoryAction,
  ResourceGroup,
  ResourceIntroduction,
  ResourceIntroductionHistoryItem,
} from '@attraccess/database-entities';
import { Repository } from 'typeorm';
import { UpdateResourceGroupIntroductionDto } from './dtos/update.request.dto';

@Injectable()
export class ResourceGroupsIntroductionsService {
  constructor(
    @InjectRepository(ResourceIntroduction)
    private readonly resourceIntroductionRepository: Repository<ResourceIntroduction>,
    @InjectRepository(ResourceIntroductionHistoryItem)
    private readonly resourceIntroductionHistoryItemRepository: Repository<ResourceIntroductionHistoryItem>,
    @InjectRepository(ResourceGroup)
    private readonly resourceGroupRepository: Repository<ResourceGroup>
  ) {}

  private async getLastHistoryItemOfIntroduction(
    introductionId: number
  ): Promise<ResourceIntroductionHistoryItem | null> {
    return await this.resourceIntroductionHistoryItemRepository.findOne({
      where: {
        introduction: {
          id: introductionId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private async createOne(groupId: number, userId: number): Promise<ResourceIntroduction> {
    const introduction = await this.resourceIntroductionRepository.create({
      resourceGroup: { id: groupId },
      receiverUser: { id: userId },
    });

    return await this.resourceIntroductionRepository.save(introduction);
  }

  private async updateIntroductionStatus(
    groupId: number,
    userId: number,
    nextStatus: IntroductionHistoryAction,
    data?: UpdateResourceGroupIntroductionDto
  ): Promise<ResourceIntroductionHistoryItem> {
    let existingIntroduction = await this.resourceIntroductionRepository.findOne({
      where: {
        receiverUser: { id: userId },
        resourceGroup: { id: groupId },
      },
    });

    existingIntroduction ??= await this.createOne(groupId, userId);

    const historyItem = this.resourceIntroductionHistoryItemRepository.create({
      introduction: existingIntroduction,
      action: nextStatus,
      performedByUser: { id: userId },
      comment: data?.comment,
    });

    return await this.resourceIntroductionHistoryItemRepository.save(historyItem);
  }

  public async getManyByGroupId(groupId: number): Promise<ResourceIntroduction[]> {
    return await this.resourceIntroductionRepository.find({
      where: {
        resourceGroup: { id: groupId },
      },
      relations: ['receiverUser', 'tutorUser', 'history'],
      cache: false,
    });
  }

  public async grant(
    groupId: number,
    userId: number,
    data?: UpdateResourceGroupIntroductionDto
  ): Promise<ResourceIntroductionHistoryItem> {
    return await this.updateIntroductionStatus(groupId, userId, IntroductionHistoryAction.GRANT, data);
  }

  public async revoke(
    groupId: number,
    userId: number,
    data?: UpdateResourceGroupIntroductionDto
  ): Promise<ResourceIntroductionHistoryItem> {
    return await this.updateIntroductionStatus(groupId, userId, IntroductionHistoryAction.REVOKE, data);
  }

  public async getHistoryByGroupIdAndUserId(
    groupId: number,
    userId: number
  ): Promise<ResourceIntroductionHistoryItem[]> {
    return await this.resourceIntroductionHistoryItemRepository.find({
      where: { introduction: { resourceGroup: { id: groupId }, receiverUser: { id: userId } } },
    });
  }

  public async hasValidIntroduction({ groupId, userId }: { groupId: number; userId: number }): Promise<boolean> {
    const introduction = await this.resourceIntroductionRepository.findOne({
      where: {
        resourceGroup: {
          id: groupId,
        },
        receiverUser: {
          id: userId,
        },
      },
    });

    if (!introduction) {
      return false;
    }

    const lastHistoryItem = await this.getLastHistoryItemOfIntroduction(introduction.id);
    return lastHistoryItem?.action === IntroductionHistoryAction.GRANT;
  }
}

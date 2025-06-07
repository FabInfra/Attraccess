import { InjectRepository } from '@nestjs/typeorm';

import { Injectable } from '@nestjs/common';
import { ResourceIntroducer } from '@attraccess/database-entities';
import { Repository } from 'typeorm';
import { ResourceGroupIntroducerNotFoundException } from './errors/ResourceGroupIntroducerNotFound.error';

@Injectable()
export class ResourceGroupsIntroducersService {
  constructor(
    @InjectRepository(ResourceIntroducer)
    private readonly resourceIntroducerRepository: Repository<ResourceIntroducer>
  ) {}

  public async getMany(groupId: number): Promise<ResourceIntroducer[]> {
    return this.resourceIntroducerRepository.find({
      where: {
        resourceGroup: {
          id: groupId,
        },
      },
      relations: ['user'],
    });
  }

  public async grant(groupId: number, userId: number): Promise<ResourceIntroducer> {
    const existingIntroducer = await this.resourceIntroducerRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        resourceGroup: {
          id: groupId,
        },
      },
    });

    if (existingIntroducer) {
      return existingIntroducer;
    }

    return await this.createOne(groupId, userId);
  }

  private async createOne(groupId: number, userId: number): Promise<ResourceIntroducer> {
    const introducer = this.resourceIntroducerRepository.create({
      resourceGroup: { id: groupId },
      user: { id: userId },
    });

    return await this.resourceIntroducerRepository.save(introducer, { reload: true });
  }

  public async revoke(groupId: number, userId: number): Promise<ResourceIntroducer> {
    const introducer = await this.resourceIntroducerRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        user: { id: userId },
      },
    });

    if (!introducer) {
      throw new ResourceGroupIntroducerNotFoundException(groupId, userId);
    }

    return await this.resourceIntroducerRepository.remove(introducer);
  }

  public async isIntroducer({ groupId, userId }: { groupId: number; userId: number }): Promise<boolean> {
    const introducer = await this.resourceIntroducerRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        user: { id: userId },
      },
    });

    return !!introducer;
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ResourceIntroducer } from '@fabaccess/database-entities';
import { Repository } from 'typeorm';

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
    const existingIntroducer = await this.getByResourceGroupIdAndUserId(groupId, userId);

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
    const introducer = await this.getByResourceGroupIdAndUserId(groupId, userId);

    if (!introducer) {
      return;
    }

    return await this.resourceIntroducerRepository.remove(introducer);
  }

  public async getByResourceGroupIdAndUserId(groupId: number, userId: number): Promise<ResourceIntroducer | null> {
    return await this.resourceIntroducerRepository.findOne({
      where: {
        resourceGroup: { id: groupId },
        user: { id: userId },
      },
    });
  }

  public async isIntroducer({ groupId, userId }: { groupId: number; userId: number }): Promise<boolean> {
    const introducer = await this.getByResourceGroupIdAndUserId(groupId, userId);

    return !!introducer;
  }
}

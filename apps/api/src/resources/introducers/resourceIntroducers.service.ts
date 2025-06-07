import { ResourceIntroducer } from '@attraccess/database-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ResourceIntroducersService {
  constructor(
    @InjectRepository(ResourceIntroducer)
    private readonly resourceIntroducerRepository: Repository<ResourceIntroducer>
  ) {}

  public async getMany(resourceId: number): Promise<ResourceIntroducer[]> {
    return await this.resourceIntroducerRepository.find({ where: { resourceId }, relations: ['user'] });
  }

  public async grant(resourceId: number, userId: number): Promise<ResourceIntroducer> {
    if (await this.isIntroducer(resourceId, userId)) {
      return;
    }

    const introducer = this.resourceIntroducerRepository.create({ resourceId, userId });
    return await this.resourceIntroducerRepository.save(introducer);
  }

  public async revoke(resourceId: number, userId: number): Promise<ResourceIntroducer> {
    const introducer = await this.resourceIntroducerRepository.findOne({ where: { resourceId, userId } });
    if (!introducer) {
      return;
    }

    return await this.resourceIntroducerRepository.remove(introducer);
  }

  public async isIntroducer(resourceId: number, userId: number): Promise<boolean> {
    const introducer = await this.resourceIntroducerRepository.findOne({ where: { resourceId, userId } });
    return !!introducer;
  }
}

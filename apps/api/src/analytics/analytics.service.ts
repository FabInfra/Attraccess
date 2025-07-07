import { Injectable } from '@nestjs/common';
import { DateRangeValue } from './dtos/dateRangeValue';
import { ResourceUsage } from '@fabaccess/database-entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  public constructor(
    @InjectRepository(ResourceUsage)
    private resourceUsageRepository: Repository<ResourceUsage>
  ) {}

  public async getResourceUsageHoursInDateRange(dateRange: DateRangeValue) {
    const findOptions: FindManyOptions<ResourceUsage> = {
      where: {
        startTime: Between(dateRange.start, dateRange.end),
      },
      relations: ['user', 'resource'],
    };

    return await this.resourceUsageRepository.find(findOptions);
  }
}

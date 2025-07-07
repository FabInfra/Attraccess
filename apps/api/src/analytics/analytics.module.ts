import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceUsage } from '@fabaccess/database-entities';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceUsage])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

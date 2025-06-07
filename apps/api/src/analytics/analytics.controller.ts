import { Controller, Get, Query } from '@nestjs/common';
import { DateRangeValue } from './dtos/dateRangeValue';
import { AnalyticsService } from './analytics.service';
import { Auth, ResourceUsage } from '@attraccess/plugins-backend-sdk';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  public constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('resource-usage-hours')
  @Auth('canManageResources')
  @ApiResponse({
    status: 200,
    description: 'The resource usage hours in the date range',
    type: [ResourceUsage],
  })
  public async getResourceUsageHoursInDateRange(@Query() dateRange: DateRangeValue) {
    return this.analyticsService.getResourceUsageHoursInDateRange(dateRange);
  }
}

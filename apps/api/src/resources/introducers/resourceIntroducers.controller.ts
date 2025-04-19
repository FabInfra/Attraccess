import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Req,
  ForbiddenException,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResourceIntroducersService } from './resourceIntroducers.service';
import { ResourceIntroducer } from '@attraccess/database-entities';
import { Auth } from '../../users-and-auth/strategies/systemPermissions.guard';
import { AuthenticatedRequest } from '../../types/request';
import { CanManageResources } from '../guards/can-manage-resources.decorator';
import { CanManageIntroducersResponseDto } from '../introduction/dtos/canManageIntroducers.dto';
import { ResourcesService } from '../resources.service';

@ApiTags('Resource Introducers')
@Controller('resources/:resourceId/introducers')
export class ResourceIntroducersController {
  private readonly logger = new Logger(ResourceIntroducersController.name);

  constructor(
    private readonly resourceIntroducersService: ResourceIntroducersService,
    private readonly resourcesService: ResourcesService
  ) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all authorized introducers for a resource', operationId: 'getAllResourceIntroducers' })
  @ApiResponse({
    status: 200,
    description: 'List of resource introducers',
    type: [ResourceIntroducer],
  })
  async getAll(@Param('resourceId', ParseIntPipe) resourceId: number): Promise<ResourceIntroducer[]> {
    const resource = await this.resourcesService.getResourceById(resourceId);

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    return this.resourceIntroducersService.getAllByResourceId(resourceId);
  }

  @Post(':userId')
  @CanManageResources()
  @ApiOperation({ summary: 'Add a user as an introducer for a resource', operationId: 'addOne' })
  @ApiResponse({
    status: 201,
    description: 'User added as an introducer',
    type: ResourceIntroducer,
  })
  async addOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<ResourceIntroducer> {
    return this.resourceIntroducersService.createOne(resourceId, userId);
  }

  @Delete(':userId')
  @CanManageResources()
  @ApiOperation({ summary: 'Remove a user as an introducer for a resource', operationId: 'removeOne' })
  @ApiResponse({
    status: 204,
    description: 'User removed as an introducer',
  })
  async removeOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    return this.resourceIntroducersService.removeOne(resourceId, userId);
  }

  @Get('can-manage')
  @Auth()
  @ApiOperation({
    summary: 'Check if the current user can manage introducers for a resource',
    operationId: 'checkCanManagePermission',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission check result',
    type: CanManageIntroducersResponseDto,
  })
  async checkCanManagePermission(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<CanManageIntroducersResponseDto> {
    const user = req.user;

    if (user.systemPermissions.canManageResources) {
      return { canManageIntroducers: true };
    }

    const canManage = await this.resourceIntroducersService.canManageIntroducers(resourceId, user.id);

    return { canManageIntroducers: canManage };
  }
}

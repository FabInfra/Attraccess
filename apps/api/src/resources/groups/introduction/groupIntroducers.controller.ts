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
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupIntroductionService } from './groupIntroduction.service';
import { ResourceIntroductionUser } from '@attraccess/database-entities';
import { Auth } from '../../../users-and-auth/strategies/systemPermissions.guard';
import { AuthenticatedRequest } from '../../../types/request';
import { UsersService } from '../../../users-and-auth/users/users.service';
import { CanManageResources } from '../../guards/can-manage-resources.decorator';
import { CanManageGroupIntroducersResponseDto } from './dtos/canManageGroupIntroducers.dto';
import { GroupsService } from '../groups.service';
import { GroupNotFoundException } from '../../../exceptions/group.notFound.exception';

@ApiTags('Group Introducers')
@Controller('groups/:groupId/introducers')
export class GroupIntroducersController {
  private readonly logger = new Logger(GroupIntroducersController.name);

  constructor(
    private readonly groupIntroductionService: GroupIntroductionService,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService
  ) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all authorized introducers for a group' })
  @ApiResponse({
    status: 200,
    description: 'List of group introducers',
    type: [ResourceIntroductionUser],
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupIntroducers(
    @Param('groupId', ParseIntPipe) groupId: number
  ): Promise<ResourceIntroductionUser[]> {
    try {
      return await this.groupIntroductionService.getGroupIntroducers(groupId);
    } catch (error) {
      this.logger.error(
        `Failed to get introducers for group ${groupId}: ${error.message}`,
        error.stack
      );
      if (
        error instanceof GroupNotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while fetching group introducers.'
      );
    }
  }

  @Post(':userId')
  @CanManageResources()
  @ApiOperation({ summary: 'Add a user as an introducer for a group' })
  @ApiResponse({
    status: 201,
    description: 'User added as an introducer',
    type: ResourceIntroductionUser,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Group or User not found' })
  @ApiResponse({
    status: 400,
    description: 'User is already an introducer for this group',
  })
  async addIntroducer(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<ResourceIntroductionUser> {
    return this.groupIntroductionService.addIntroducer(groupId, userId);
  }

  @Delete(':userId')
  @CanManageResources()
  @ApiOperation({ summary: 'Remove a user as an introducer for a group' })
  @ApiResponse({
    status: 204,
    description: 'User removed as an introducer',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found or Introducer permission not found',
  })
  async removeIntroducer(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    await this.groupIntroductionService.removeIntroducer(groupId, userId);
  }

  @Get('can-manage')
  @Auth()
  @ApiOperation({
    summary: 'Check if the current user can manage introducers for a group',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission check result',
    type: CanManageGroupIntroducersResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async canManageIntroducers(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<CanManageGroupIntroducersResponseDto> {
    const user = req.user;

    const canManage =
      await this.groupIntroductionService.canManageGroupIntroducers(
        groupId,
        user.id
      );

    return { canManageIntroducers: canManage };
  }
}

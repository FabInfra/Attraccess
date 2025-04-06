import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Body,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupIntroductionService } from './groupIntroduction.service';
import {
  ResourceIntroduction,
  ResourceIntroductionHistoryItem,
} from '@attraccess/database-entities';
import { Auth } from '../../../users-and-auth/strategies/systemPermissions.guard';
import { AuthenticatedRequest } from '../../../types/request';
import {
  makePaginatedResponse,
  PaginatedResponseDto,
} from '../../../types/response';
import { GetGroupIntroductionsQueryDto } from './dtos/getGroupIntroductionsQuery.dto';
import { PaginatedGroupIntroductionResponseDto } from './dtos/paginatedGroupIntroductionResponse.dto';
import { UsersService } from '../../../users-and-auth/users/users.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import {
  RevokeIntroductionDto,
  UnrevokeIntroductionDto,
} from './dtos/revokeIntroduction.dto';
import { CanManageResources } from '../../guards/can-manage-resources.decorator';
import { GroupsService } from '../groups.service';

class CreateIntroductionDto {
  @ApiProperty({
    description: 'User ID of the person receiving the introduction',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  receiverUserId: number;
}

@ApiTags('Group Introductions')
@Controller('groups/:groupId/introductions')
export class GroupIntroductionController {
  constructor(
    private readonly groupIntroductionService: GroupIntroductionService,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService
  ) {}

  @Post('create')
  @Auth()
  @ApiOperation({
    summary: 'Create a group introduction for a user',
    description:
      'Creates an introduction record for a user, typically performed by an authorized introducer or manager.',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction created successfully.',
    type: ResourceIntroduction,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g., already introduced)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Group or User not found' })
  async createIntroduction(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: CreateIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroduction> {
    return this.groupIntroductionService.createIntroduction(
      groupId,
      req.user.id,
      dto.receiverUserId
    );
  }

  @Get()
  @CanManageResources()
  @ApiOperation({ summary: 'Get all introductions for a group' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of group introductions',
    type: PaginatedGroupIntroductionResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupIntroductions(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() query: GetGroupIntroductionsQueryDto
  ): Promise<PaginatedResponseDto<ResourceIntroduction>> {
    const { data, total } =
      await this.groupIntroductionService.getGroupIntroductions(
        groupId,
        query.page,
        query.limit
      );

    return makePaginatedResponse(
      {
        page: query.page,
        limit: query.limit,
      },
      data,
      total
    );
  }

  @Get('status')
  @Auth()
  @ApiOperation({
    summary: 'Check if current user has a valid introduction for the group',
    description:
      'Check if the logged-in user has a completed introduction for this group that is not revoked',
  })
  @ApiResponse({
    status: 200,
    description: 'Status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        hasValidIntroduction: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async checkIntroductionStatus(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<{ hasValidIntroduction: boolean }> {
    const hasValidIntroduction =
      await this.groupIntroductionService.hasValidGroupIntroduction(
        groupId,
        req.user.id
      );

    return { hasValidIntroduction };
  }

  @Get(':introductionId')
  @Auth()
  @ApiOperation({
    summary: 'Get a single group introduction by ID',
    description: 'Retrieve details of a specific introduction within a group.',
  })
  @ApiResponse({
    status: 200,
    description: 'Introduction details',
    type: ResourceIntroduction,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions to view',
  })
  @ApiResponse({ status: 404, description: 'Group or Introduction not found' })
  async getGroupIntroductionById(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroduction> {
    const canManage =
      await this.groupIntroductionService.canManageGroupIntroductions(
        groupId,
        req.user.id
      );
    if (!canManage) {
      const introduction =
        await this.groupIntroductionService.getGroupIntroductionById(
          groupId,
          introductionId
        );
      if (introduction.receiverUserId !== req.user.id) {
        throw new ForbiddenException(
          'Insufficient permissions to view this introduction.'
        );
      }
      return introduction;
    }

    return this.groupIntroductionService.getGroupIntroductionById(
      groupId,
      introductionId
    );
  }

  @Get(':introductionId/history')
  @Auth()
  @ApiOperation({ summary: 'Get history for a specific group introduction' })
  @ApiResponse({
    status: 200,
    description: 'Introduction history retrieved successfully',
    type: [ResourceIntroductionHistoryItem],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Group or Introduction not found' })
  async getIntroductionHistory(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem[]> {
    const canManage =
      await this.groupIntroductionService.canManageGroupIntroductions(
        groupId,
        req.user.id
      );
    if (!canManage) {
      throw new ForbiddenException(
        'Insufficient permissions to view introduction history.'
      );
    }

    return this.groupIntroductionService.getIntroductionHistory(introductionId);
  }

  @Post(':introductionId/revoke')
  @Auth()
  @ApiOperation({ summary: 'Revoke a group introduction' })
  @ApiResponse({
    status: 201,
    description: 'Introduction revoked',
    type: ResourceIntroductionHistoryItem,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., not a group intro)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Group or Introduction not found' })
  async revokeIntroduction(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Body() dto: RevokeIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem> {
    return this.groupIntroductionService.revokeIntroduction(
      introductionId,
      req.user.id,
      dto.comment
    );
  }

  @Post(':introductionId/unrevoke')
  @Auth()
  @ApiOperation({ summary: 'Unrevoke a group introduction' })
  @ApiResponse({
    status: 201,
    description: 'Introduction unrevoked',
    type: ResourceIntroductionHistoryItem,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., not a group intro)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Group or Introduction not found' })
  async unrevokeIntroduction(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Body() dto: UnrevokeIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem> {
    return this.groupIntroductionService.unrevokeIntroduction(
      introductionId,
      req.user.id,
      dto.comment
    );
  }

  @Get('permissions/manage')
  @Auth()
  @ApiOperation({
    summary: 'Check if current user can manage introductions for the group',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns whether the user can manage introductions for this group',
    schema: {
      type: 'object',
      properties: { canManageIntroductions: { type: 'boolean' } },
    },
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async canManageIntroductions(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<{ canManageIntroductions: boolean }> {
    const canManage =
      await this.groupIntroductionService.canManageGroupIntroductions(
        groupId,
        req.user.id
      );
    return { canManageIntroductions: canManage };
  }
}

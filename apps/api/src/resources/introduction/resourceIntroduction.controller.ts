import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResourceIntroductionService } from './resourceIntroduction.service';
import {
  ResourceIntroduction,
  ResourceIntroductionHistoryItem,
} from '@attraccess/database-entities';
import { Auth } from '../../users-and-auth/strategies/systemPermissions.guard';
import { AuthenticatedRequest } from '../../types/request';
import {
  makePaginatedResponse,
  PaginatedResponseDto,
} from '../../types/response';
import { GetResourceIntroductionsQueryDto } from './dtos/getResourceIntroductionsQuery.dto';
import { PaginatedResourceIntroductionResponseDto } from './dtos/paginatedResourceIntroductionResponse.dto';
import { UsersService } from '../../users-and-auth/users/users.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import {
  RevokeIntroductionDto,
  UnrevokeIntroductionDto,
} from './dtos/revokeIntroduction.dto';
import { MissingIntroductionPermissionException } from '../../exceptions/resource.introduction.forbidden.exception';
import { CanManageResources } from '../guards/can-manage-resources.decorator';

class CompleteIntroductionDto {
  @ApiProperty({
    description: 'User ID',
    required: false,
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  userId: number;
}

@ApiTags('Resource Introductions')
@Controller('resources/:resourceId/introductions')
export class ResourceIntroductionController {
  constructor(
    private readonly resourceIntroductionService: ResourceIntroductionService,
    private readonly usersService: UsersService
  ) {}

  @Post('complete')
  @Auth()
  @ApiOperation({
    summary: 'Mark resource introduction as completed for a user',
    description:
      'Complete an introduction for a user identified by their user ID, username, or email.',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction marked as completed successfully.',
    type: ResourceIntroduction,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Neither userId nor userIdentifier provided',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found with the provided identifier',
  })
  async completeIntroduction(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Body() dto: CompleteIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroduction> {
    return this.resourceIntroductionService.createIntroduction(
      resourceId,
      req.user.id,
      dto.userId
    );
  }

  @Get()
  @CanManageResources()
  @ApiOperation({ summary: 'Get all introductions for a resource' })
  @ApiResponse({
    status: 200,
    description: 'Resource introductions',
    type: PaginatedResourceIntroductionResponseDto,
  })
  async getResourceIntroductions(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Query() query: GetResourceIntroductionsQueryDto
  ): Promise<PaginatedResponseDto<ResourceIntroduction>> {
    const { data, total } =
      await this.resourceIntroductionService.getResourceIntroductions(
        resourceId,
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
    summary: 'Check if current user has a valid introduction',
    description:
      'Check if the current user has completed the introduction for this resource and it is not revoked',
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found',
  })
  async checkIntroductionStatus(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<{ hasValidIntroduction: boolean }> {
    const hasValidIntroduction =
      await this.resourceIntroductionService.hasValidIntroduction(
        resourceId,
        req.user.id
      );

    return { hasValidIntroduction };
  }

  @Post(':introductionId/revoke')
  @CanManageResources()
  @ApiOperation({
    summary: 'Revoke an introduction',
    description:
      'Revoke access for a user by marking their introduction as revoked',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction revoked successfully',
    type: ResourceIntroductionHistoryItem,
  })
  async revokeIntroduction(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Body() dto: RevokeIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem> {
    // First check if the user can give introductions (same permission check as for completing)
    const canGiveIntroductions =
      await this.resourceIntroductionService.canGiveIntroductions(
        resourceId,
        req.user.id
      );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    return this.resourceIntroductionService.revokeIntroduction(
      introductionId,
      req.user.id,
      dto.comment
    );
  }

  @Post(':introductionId/unrevoke')
  @CanManageResources()
  @ApiOperation({
    summary: 'Unrevoke an introduction',
    description: 'Restore access for a user by unrevoking their introduction',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction unrevoked successfully',
    type: ResourceIntroductionHistoryItem,
  })
  async unrevokeIntroduction(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Body() dto: UnrevokeIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem> {
    // First check if the user can give introductions (same permission check as for completing)
    const canGiveIntroductions =
      await this.resourceIntroductionService.canGiveIntroductions(
        resourceId,
        req.user.id
      );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    return this.resourceIntroductionService.unrevokeIntroduction(
      introductionId,
      req.user.id,
      dto.comment
    );
  }

  @Get(':introductionId/history')
  @CanManageResources()
  @ApiOperation({
    summary: 'Get history for a specific introduction',
    description:
      'Retrieve the history of revoke/unrevoke actions for an introduction',
  })
  @ApiResponse({
    status: 200,
    description: 'Introduction history',
    type: [ResourceIntroductionHistoryItem],
  })
  async getIntroductionHistory(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem[]> {
    // Check permissions
    const canGiveIntroductions =
      await this.resourceIntroductionService.canGiveIntroductions(
        resourceId,
        req.user.id
      );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    const history =
      await this.resourceIntroductionService.getIntroductionHistory(
        introductionId
      );

    return history;
  }

  @Get(':introductionId/revoked')
  @Auth()
  @ApiOperation({
    summary: 'Check if an introduction is revoked',
    description: 'Determine if a specific introduction is currently revoked',
  })
  @ApiResponse({
    status: 200,
    description: 'Status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        isRevoked: { type: 'boolean' },
      },
    },
  })
  async checkIntroductionRevokedStatus(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<{ isRevoked: boolean }> {
    // Check permissions
    const canGiveIntroductions =
      await this.resourceIntroductionService.canGiveIntroductions(
        resourceId,
        req.user.id
      );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    const isRevoked =
      await this.resourceIntroductionService.isIntroductionRevoked(
        introductionId
      );

    return { isRevoked };
  }

  @Get(':introductionId')
  @Auth()
  @ApiOperation({
    summary: 'Get a single resource introduction',
    description: 'Retrieve detailed information about a specific introduction',
  })
  @ApiResponse({
    status: 200,
    description: 'Introduction retrieved successfully',
    type: ResourceIntroduction,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - User does not have permission to view this introduction',
  })
  @ApiResponse({
    status: 404,
    description: 'Introduction not found',
  })
  async getResourceIntroduction(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroduction> {
    // Check permissions
    const canGiveIntroductions =
      await this.resourceIntroductionService.canGiveIntroductions(
        resourceId,
        req.user.id
      );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    return this.resourceIntroductionService.getResourceIntroductionById(
      resourceId,
      introductionId
    );
  }

  @Get('permissions/manage')
  @Auth()
  @ApiOperation({
    summary: 'Check if user can manage introductions for the resource',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the user can manage introductions',
    schema: {
      type: 'object',
      properties: {
        canManageIntroductions: { type: 'boolean' },
      },
    },
  })
  async canManageIntroductions(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<{ canManageIntroductions: boolean }> {
    const user = req.user;

    // User has system-wide resource management permission
    if (user.systemPermissions.canManageResources) {
      return { canManageIntroductions: true };
    }

    // Add any specific permission logic here
    const canManage =
      await this.resourceIntroductionService.canManageIntroductions(
        resourceId,
        user.id
      );

    return { canManageIntroductions: canManage };
  }
}

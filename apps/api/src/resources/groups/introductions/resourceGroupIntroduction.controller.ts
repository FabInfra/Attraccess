import { Controller, Post, Get, Param, ParseIntPipe, Req, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResourceGroupIntroductionService } from './resourceGroupIntroduction.service';
import { ResourceIntroduction, ResourceIntroductionHistoryItem } from '@attraccess/database-entities';
import { Auth } from '../../../users-and-auth/strategies/systemPermissions.guard';
import { AuthenticatedRequest } from '../../../types/request';
import { PaginatedResponse, makePaginatedResponse } from '../../../types/response';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RevokeIntroductionDto, UnrevokeIntroductionDto } from '../../introduction/dtos/revokeIntroduction.dto';
import { MissingIntroductionPermissionException } from '../../../exceptions/resource.introduction.forbidden.exception';
import { CanManageResources } from '../../guards/can-manage-resources.decorator';

class CompleteGroupIntroductionDto {
  @ApiProperty({
    description: 'User ID to introduce',
    required: true,
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  userId: number;
}

@Controller('resource-groups/:groupId/introductions')
@ApiTags('Resource Group Introductions')
export class ResourceGroupIntroductionController {
  constructor(private readonly resourceGroupIntroductionService: ResourceGroupIntroductionService) {}

  @Post('complete')
  @Auth()
  @ApiOperation({
    summary: 'Mark resource group introduction as completed for a user',
    description: 'Complete an introduction for a user to access all resources in a group',
    operationId: 'markGroupIntroductionCompleted',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction marked as completed successfully.',
    type: ResourceIntroduction,
  })
  @ApiResponse({
    status: 404,
    description: 'User or resource group not found',
  })
  async markCompleted(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: CompleteGroupIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroduction> {
    return this.resourceGroupIntroductionService.createGroupIntroduction(groupId, req.user.id, dto.userId);
  }

  @Get()
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({
    summary: 'Get introductions for a specific resource group',
    description: 'Retrieve introductions for a resource group, possibly paginated',
    operationId: 'getAllResourceGroupIntroductions',
  })
  @ApiResponse({
    status: 200,
    description: 'Resource group introductions',
  })
  async getAll(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query() query: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<ResourceIntroduction>> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const { data, total } = await this.resourceGroupIntroductionService.getGroupIntroductions(groupId, page, limit);

    return makePaginatedResponse({ page, limit }, data, total);
  }

  @Get('status')
  @Auth()
  @ApiOperation({
    summary: 'Check if current user has a valid introduction to the group',
    description: 'Check if the current user has completed the introduction for this group and it is not revoked',
    operationId: 'checkGroupIntroductionStatus',
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
  async checkStatus(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<{ hasValidIntroduction: boolean }> {
    const hasValidIntroduction = await this.resourceGroupIntroductionService.hasValidGroupIntroduction(
      groupId,
      req.user.id
    );

    return { hasValidIntroduction };
  }

  @Post(':introductionId/revoke')
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({
    summary: 'Revoke a group introduction',
    description: 'Revoke access for a user by marking their group introduction as revoked',
    operationId: 'markGroupIntroductionRevoked',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction revoked successfully',
    type: ResourceIntroductionHistoryItem,
  })
  async markRevoked(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Body() dto: RevokeIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem> {
    // Check if the user can give introductions
    const canGiveIntroductions = await this.resourceGroupIntroductionService.canGiveGroupIntroductions(
      groupId,
      req.user.id
    );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    return this.resourceGroupIntroductionService.revokeGroupIntroduction(introductionId, req.user.id, dto.comment);
  }

  @Post(':introductionId/unrevoke')
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({
    summary: 'Unrevoke a group introduction',
    description: 'Restore access for a user by unrevoking their group introduction',
    operationId: 'markGroupIntroductionUnrevoked',
  })
  @ApiResponse({
    status: 201,
    description: 'Introduction unrevoked successfully',
    type: ResourceIntroductionHistoryItem,
  })
  async markUnrevoked(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number,
    @Body() dto: UnrevokeIntroductionDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResourceIntroductionHistoryItem> {
    // Check if the user can give introductions
    const canGiveIntroductions = await this.resourceGroupIntroductionService.canGiveGroupIntroductions(
      groupId,
      req.user.id
    );

    const canManageResources = req.user.systemPermissions.canManageResources;

    if (!canGiveIntroductions && !canManageResources) {
      throw new MissingIntroductionPermissionException();
    }

    return this.resourceGroupIntroductionService.unrevokeGroupIntroduction(introductionId, req.user.id, dto.comment);
  }

  @Get(':introductionId/history')
  @CanManageResources({ skipResourceCheck: true })
  @ApiOperation({
    summary: 'Get history for a specific group introduction',
    description: 'Retrieve the history of revoke/unrevoke actions for a group introduction',
    operationId: 'getHistoryOfGroupIntroduction',
  })
  @ApiResponse({
    status: 200,
    description: 'Introduction history',
    type: [ResourceIntroductionHistoryItem],
  })
  async getHistory(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number
  ): Promise<ResourceIntroductionHistoryItem[]> {
    return this.resourceGroupIntroductionService.getGroupIntroductionHistory(introductionId);
  }

  @Get(':introductionId')
  @Auth()
  @ApiOperation({
    summary: 'Get a single resource group introduction',
    description: 'Retrieve a specific introduction for a resource group',
    operationId: 'getOneGroupIntroduction',
  })
  @ApiResponse({
    status: 200,
    description: 'Resource group introduction',
    type: ResourceIntroduction,
  })
  async getOne(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('introductionId', ParseIntPipe) introductionId: number
  ): Promise<ResourceIntroduction> {
    return this.resourceGroupIntroductionService.getGroupIntroductionById(introductionId, groupId);
  }
}

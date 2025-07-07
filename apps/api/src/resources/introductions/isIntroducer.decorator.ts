import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtGuard } from '@fabaccess/plugins-backend-sdk';
import { IsResourceIntroducerGuard } from './isIntroducerGuard';

/**
 * Decorator to protect routes that require permission to introduce users to a resource.
 * User must either be an introducer for the resource (from URL path parameter 'resourceId')
 * or have the 'canManageResources' system permission.
 *
 * Usage: @IsResourceIntroducer()
 */
export function IsResourceIntroducer() {
  return applyDecorators(
    UseGuards(JwtGuard, IsResourceIntroducerGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'User is not authenticated' }),
    ApiForbiddenResponse({
      description: 'User does not have permission to introduce users to this resource',
    })
  );
}

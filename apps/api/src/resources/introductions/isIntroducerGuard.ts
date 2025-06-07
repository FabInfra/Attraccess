import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceIntroducer, User } from '@attraccess/database-entities';

@Injectable()
export class IsResourceIntroducerGuard implements CanActivate {
  private readonly logger = new Logger(IsResourceIntroducerGuard.name);

  constructor(
    @InjectRepository(ResourceIntroducer)
    private resourceIntroducerRepository: Repository<ResourceIntroducer>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    // If no user is present, deny access
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if the user has system permissions to manage all resources
    if (user.systemPermissions && user.systemPermissions.canManageResources === true) {
      return true;
    }

    // Get the resourceId from the URL path
    const resourceIdParam = request.params.resourceId;

    // If no resourceId param, deny access
    if (!resourceIdParam) {
      this.logger.warn(`No resourceId parameter found in request params: ${JSON.stringify(request.params)}`);
      return false;
    }

    // Convert to number
    const resourceId = parseInt(resourceIdParam, 10);

    if (isNaN(resourceId)) {
      throw new BadRequestException(`Group ID must be a number: ${resourceIdParam}`);
    }

    try {
      // Check if the user is an introducer for this resource
      const introducer = await this.resourceIntroducerRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
          resource: {
            id: resourceId,
          },
        },
      });

      if (introducer) {
        return true;
      }

      this.logger.warn(`User ${user.id} tried to access resource ${resourceId} without permission`);
      return false;
    } catch (error) {
      this.logger.error(`Error checking introducer permissions: ${error.message}`, error.stack);
      return false;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  ping(): { message: string } {
    this.logger.debug('Ping method called');
    return { message: 'pong' };
  }
}

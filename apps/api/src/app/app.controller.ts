import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/info')
  @ApiOperation({ summary: 'Return API information', operationId: 'info' })
  @ApiResponse({
    status: 200,
    description: 'API information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Attraccess API' },
        status: { type: 'string', example: 'ok' },
      },
    },
  })
  getInfo() {
    return this.appService.getInfo();
  }
}

import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Patch,
  Body,
  NotFoundException,
  Logger,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { FabreaderGateway } from './modules/websockets/websocket.gateway';
import { AuthenticatedRequest, Auth, FabReader } from '@fabaccess/plugins-backend-sdk';
import { ApiOperation, ApiResponse, ApiParam, ApiTags, ApiBody } from '@nestjs/swagger';
import { WebsocketService } from './modules/websockets/websocket.service';
import { FabreaderService } from './fabreader.service';
import { EnrollNfcCardDto } from './dtos/enroll-nfc-card.dto';
import { ResetNfcCardDto } from './dtos/reset-nfc-card.dto';
import { UpdateReaderResponseDto } from './dtos/update-reader-response.dto';
import { EnrollNfcCardResponseDto } from './dtos/enroll-nfc-card-response.dto';
import { ResetNfcCardResponseDto } from './dtos/reset-nfc-card-response.dto';
import { UpdateReaderDto } from './dtos/update-reader.dto';

@ApiTags('FabReader')
@Controller('fabreader/readers')
@UseInterceptors(ClassSerializerInterceptor)
export class FabReaderController {
  private readonly logger = new Logger(FabReaderController.name);

  public constructor(
    @Inject(FabreaderGateway)
    private readonly fabreaderGateway: FabreaderGateway,
    @Inject(WebsocketService)
    private readonly websocketService: WebsocketService,
    @Inject(FabreaderService)
    private readonly fabreaderService: FabreaderService
  ) {}

  @Post('enroll-nfc-card')
  @Auth()
  @ApiOperation({ summary: 'Enroll a new NFC card', operationId: 'enrollNfcCard' })
  @ApiBody({ type: EnrollNfcCardDto })
  @ApiResponse({
    status: 200,
    description: 'Enrollment initiated, continue on Reader',
    type: EnrollNfcCardResponseDto,
  })
  async enrollNfcCard(
    @Body() enrollData: EnrollNfcCardDto,
    @Req() req: AuthenticatedRequest
  ): Promise<EnrollNfcCardResponseDto> {
    await this.fabreaderGateway.startEnrollOfNewNfcCard({
      readerId: enrollData.readerId,
      userId: req.user.id,
    });

    return {
      message: 'Enrollment initiated, continue on Reader',
    };
  }

  @Post('reset-nfc-card')
  @Auth()
  @ApiOperation({ summary: 'Reset an NFC card', operationId: 'resetNfcCard' })
  @ApiBody({ type: ResetNfcCardDto })
  @ApiResponse({
    status: 200,
    description: 'Reset initiated, continue on Reader',
    type: ResetNfcCardResponseDto,
  })
  async resetNfcCard(
    @Body() resetData: ResetNfcCardDto,
    @Req() req: AuthenticatedRequest
  ): Promise<ResetNfcCardResponseDto> {
    await this.fabreaderGateway.startResetOfNfcCard({
      readerId: resetData.readerId,
      cardId: resetData.cardId,
      userId: req.user.id,
    });

    return {
      message: 'Reset initiated, continue on Reader',
    };
  }

  @Patch(':readerId')
  @Auth('canManageSystemConfiguration')
  @ApiOperation({ summary: 'Update reader name and connected resources', operationId: 'updateReader' })
  @ApiParam({ name: 'readerId', description: 'The ID of the reader to update', example: 1 })
  @ApiBody({ type: UpdateReaderDto })
  @ApiResponse({
    status: 200,
    description: 'Reader updated successfully',
    type: UpdateReaderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reader not found' })
  async updateReader(
    @Param('readerId', ParseIntPipe) readerId: number,
    @Body() updateData: UpdateReaderDto
  ): Promise<UpdateReaderResponseDto> {
    this.logger.debug(`Updating reader ${readerId} with data: ${JSON.stringify(updateData)}`);
    try {
      const updatedReader = await this.fabreaderService.updateReader(readerId, updateData);

      return {
        message: 'Reader updated successfully',
        reader: updatedReader,
      };
    } catch (error) {
      if (error.message?.includes('not found')) {
        throw new NotFoundException(`Reader with ID ${readerId} not found`);
      }
      throw error;
    }
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all readers', operationId: 'getReaders' })
  @ApiResponse({
    status: 200,
    description: 'The list of readers',
    type: [FabReader],
  })
  async getReaders(): Promise<FabReader[]> {
    return await this.fabreaderService.getAllReaders();
  }

  @Get(':readerId')
  @Auth()
  @ApiOperation({ summary: 'Get a reader by ID', operationId: 'getReaderById' })
  @ApiParam({ name: 'readerId', description: 'The ID of the reader to get', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The reader',
    type: FabReader,
  })
  @ApiResponse({ status: 404, description: 'Reader not found' })
  async getReaderById(@Param('readerId', ParseIntPipe) readerId: number): Promise<FabReader> {
    return await this.fabreaderService.findReaderById(readerId);
  }
}

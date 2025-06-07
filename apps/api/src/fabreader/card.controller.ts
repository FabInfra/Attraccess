import { Controller, Get, Inject, Post, Req, Body } from '@nestjs/common';
import { FabreaderGateway } from './modules/websockets/websocket.gateway';
import { Auth, AuthenticatedRequest, NFCCard } from '@attraccess/plugins-backend-sdk';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { FabreaderService } from './fabreader.service';
import { AppKeyRequestDto } from './dtos/app-key-request.dto';
import { AppKeyResponseDto } from './dtos/app-key-response.dto';

@ApiTags('FabReader')
@Controller('fabreader/cards')
export class FabReaderNfcCardsController {
  public constructor(
    @Inject(FabreaderGateway)
    private readonly fabreaderGateway: FabreaderGateway,
    @Inject(FabreaderService)
    private readonly fabreaderService: FabreaderService
  ) {}

  @Post('keys')
  @Auth()
  @ApiOperation({ summary: 'Get the app key for a card by UID', operationId: 'getAppKeyByUid' })
  @ApiBody({ type: AppKeyRequestDto })
  @ApiResponse({
    status: 200,
    description: 'The app key for the card',
    type: AppKeyResponseDto,
  })
  async getAppKeyByUid(@Body() appKeyRequest: AppKeyRequestDto): Promise<AppKeyResponseDto> {
    const key = await this.fabreaderService.generateNTAG424Key({
      keyNo: appKeyRequest.keyNo,
      cardUID: appKeyRequest.cardUID,
    });

    return {
      key: this.fabreaderService.uint8ArrayToHexString(key),
    };
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all cards (to which you have access)', operationId: 'getAllCards' })
  @ApiResponse({
    status: 200,
    description: 'The list of all cards',
    type: [NFCCard],
  })
  async getCards(@Req() req: AuthenticatedRequest): Promise<NFCCard[]> {
    let cards;

    if (req.user.systemPermissions.canManageSystemConfiguration) {
      cards = await this.fabreaderService.getAllNFCCards();
    } else {
      cards = await this.fabreaderService.getNFCCardsByUserId(req.user.id);
    }

    return cards;
  }
}

import { Logger } from '@nestjs/common';
import { ReaderState } from './reader-state.interface';
import { InitialReaderState } from './initial.state';
import { AuthenticatedWebSocket, FabreaderEvent, FabreaderEventType, FabreaderResponse } from '../websocket.types';
import { GatewayServices } from '../websocket.gateway';
import { NFCCard } from '@fabaccess/database-entities';

export class ResetNTAG424State implements ReaderState {
  private readonly logger = new Logger(ResetNTAG424State.name);
  private card: NFCCard | null = null;

  // key numbers
  public readonly KEY_ZERO_MASTER = 0;

  // 16 bytes of 0 as Uint8Array
  public readonly DEFAULT_NTAG424_KEYS = {
    [this.KEY_ZERO_MASTER]: new Uint8Array(16).fill(0),
  };

  constructor(
    private readonly socket: AuthenticatedWebSocket,
    private readonly services: GatewayServices,
    private readonly cardId: NFCCard['id']
  ) {}

  public async onStateEnter(): Promise<void> {
    this.card = await this.services.fabreaderService.getNFCCardByID(this.cardId);

    if (!this.card) {
      throw new Error(`Card not found: ${this.cardId}`);
    }

    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.ENABLE_CARD_CHECKING, {
        message: 'Tap your NFC card to reset it',
      })
    );
  }

  public async onStateExit(): Promise<void> {
    return;
  }

  public async onEvent(eventData: FabreaderEvent['data']): Promise<void> {
    if (eventData.type === FabreaderEventType.NFC_TAP) {
      return this.onGetNfcUID(eventData);
    }

    this.logger.warn(`Unexpected event type ${eventData.type}`);
  }

  public async onResponse(responseData: FabreaderResponse['data']): Promise<void> {
    if (responseData.type === FabreaderEventType.CHANGE_KEYS) {
      return await this.onKeysChanged(responseData);
    }

    this.logger.warn(`Unexpected response type ${responseData.type} `);
  }

  private async onGetNfcUID(responseData: FabreaderResponse['data']): Promise<void> {
    const cardUID = responseData.payload.cardUID;
    if (cardUID !== this.card?.uid) {
      this.logger.warn(`Unexpected card UID ${cardUID}, ignoring`);
      return;
    }

    // Only if the card UID matches, disable card checking
    this.socket.sendMessage(new FabreaderEvent(FabreaderEventType.DISABLE_CARD_CHECKING));

    const nfcCard = await this.services.fabreaderService.getNFCCardByUID(cardUID);

    const masterKey: string =
      nfcCard?.keys[this.KEY_ZERO_MASTER] ??
      this.services.fabreaderService.uint8ArrayToHexString(this.DEFAULT_NTAG424_KEYS[this.KEY_ZERO_MASTER]);

    const newKeys = {
      [this.KEY_ZERO_MASTER]: this.services.fabreaderService.uint8ArrayToHexString(
        this.DEFAULT_NTAG424_KEYS[this.KEY_ZERO_MASTER]
      ),
    };

    this.logger.debug('Sending ChangeKeys event', {
      authenticationKey: masterKey,
      keys: newKeys,
    });

    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.CHANGE_KEYS, {
        authenticationKey: masterKey,
        keys: newKeys,
      })
    );
  }

  private async onKeysChanged(responseData: FabreaderResponse['data']): Promise<void> {
    const failedKeys = responseData.payload.failedKeys as number[];
    const successfulKeys = responseData.payload.successfulKeys as number[];

    if (successfulKeys?.length !== 1 || failedKeys?.length > 0) {
      this.logger.error(
        `Keys ${failedKeys?.join(', ')} failed to change, Keys ${successfulKeys?.join(', ')} changed successfully`
      );

      const nextState = new InitialReaderState(this.socket, this.services);
      return this.socket.transitionToState(nextState);
    }

    await this.services.fabreaderService.deleteNFCCard(this.cardId);

    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.DISPLAY_SUCCESS, {
        message: 'Card erased',
        duration: 10000,
      })
    );

    const initialState = new InitialReaderState(this.socket, this.services);
    this.socket.transitionToState(initialState);
  }
}

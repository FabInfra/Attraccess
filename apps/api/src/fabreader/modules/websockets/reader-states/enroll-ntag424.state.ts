import { Logger } from '@nestjs/common';
import { ReaderState } from './reader-state.interface';
import { InitialReaderState } from './initial.state';
import { User } from '@fabaccess/plugins-backend-sdk';
import { AuthenticatedWebSocket, FabreaderEvent, FabreaderEventType, FabreaderResponse } from '../websocket.types';
import { GatewayServices } from '../websocket.gateway';

export interface EnrollmentState {
  nextExpectedEvent: FabreaderEventType;
  cardUID?: string;
  data: {
    newKeys?: Record<number, string>;
    verificationToken?: Uint8Array;
  };
}

export class EnrollNTAG424State implements ReaderState {
  private readonly logger = new Logger(EnrollNTAG424State.name);

  private enrollment?: EnrollmentState;

  // key numbers
  public readonly KEY_ZERO_MASTER = 0;

  // 16 bytes of 0 as Uint8Array
  public readonly DEFAULT_NTAG424_KEYS = {
    [this.KEY_ZERO_MASTER]: new Uint8Array(16).fill(0),
  };

  public readonly VERIFICATION_TOKEN_FILE_ID = 0x00;
  public readonly ANTI_DUPLICATION_TOKEN_FILE_ID = 0x01;

  constructor(
    private readonly socket: AuthenticatedWebSocket,
    private readonly services: GatewayServices,
    private readonly userId: User['id']
  ) {}

  public async onStateEnter(): Promise<void> {
    this.enrollment = {
      nextExpectedEvent: FabreaderEventType.NFC_TAP,
      data: {},
    };
    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.ENABLE_CARD_CHECKING, {
        message: 'Tap to enroll',
      })
    );
  }

  public async onStateExit(): Promise<void> {
    this.enrollment = undefined;
  }

  public async onEvent(eventData: FabreaderEvent['data']): Promise<void> {
    if (
      eventData.type === FabreaderEventType.NFC_TAP &&
      this.enrollment?.nextExpectedEvent === FabreaderEventType.NFC_TAP
    ) {
      return this.onGetNfcUID(eventData);
    }

    this.logger.debug(`Unexpected event type ${eventData.type} in state ${this.enrollment?.nextExpectedEvent}`);
  }

  public async onResponse(responseData: FabreaderResponse['data']): Promise<void> {
    if (this.enrollment?.nextExpectedEvent !== responseData.type) {
      this.logger.warn(`Unexpected response type ${responseData.type} in state ${this.enrollment?.nextExpectedEvent}`);
      return;
    }

    if (responseData.type === FabreaderEventType.CHANGE_KEYS) {
      return this.onKeysChanged(responseData);
    }

    if (responseData.type === FabreaderEventType.AUTHENTICATE) {
      return this.onAuthenticate(responseData);
    }

    this.logger.warn(`Unknown response type ${responseData.type} in state ${this.enrollment?.nextExpectedEvent}`);
  }

  private async onGetNfcUID(responseData: FabreaderResponse['data']): Promise<void> {
    this.socket.sendMessage(new FabreaderEvent(FabreaderEventType.DISABLE_CARD_CHECKING));

    const cardUID = responseData.payload.cardUID;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.enrollment!.cardUID = cardUID;

    const nfcCard = await this.services.fabreaderService.getNFCCardByUID(cardUID);

    const masterKey: string =
      nfcCard?.keys[this.KEY_ZERO_MASTER] ??
      this.services.fabreaderService.uint8ArrayToHexString(this.DEFAULT_NTAG424_KEYS[this.KEY_ZERO_MASTER]);

    this.enrollment.data.newKeys = Object.fromEntries(
      Object.entries({
        [this.KEY_ZERO_MASTER.toString()]: await this.services.fabreaderService.generateNTAG424Key({
          keyNo: this.KEY_ZERO_MASTER,
          cardUID,
        }),
      }).map(([key, value]) => [key, this.services.fabreaderService.uint8ArrayToHexString(value)])
    );

    this.logger.debug('Sending ChangeKeys event', {
      authenticationKey: masterKey,
      keys: this.enrollment.data.newKeys,
    });
    this.enrollment.nextExpectedEvent = FabreaderEventType.CHANGE_KEYS;
    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.CHANGE_KEYS, {
        authenticationKey: masterKey,
        keys: this.enrollment.data.newKeys,
      })
    );
  }

  private async onKeysChanged(responseData: FabreaderResponse['data']): Promise<void> {
    const failedKeys = responseData.payload.failedKeys as number[];
    const successfulKeys = responseData.payload.successfulKeys as number[];

    if (successfulKeys?.length !== 1 || failedKeys?.length > 0) {
      this.logger.error(
        `Keys ${failedKeys?.join(', ')} failed to change, Keys ${successfulKeys?.join(', ')} changed successfully`,
        {
          enrollmentState: this.enrollment,
        }
      );

      this.enrollment = undefined;
      return this.socket.transitionToState(new InitialReaderState(this.socket, this.services));
    }

    this.enrollment.nextExpectedEvent = FabreaderEventType.AUTHENTICATE;
    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.AUTHENTICATE, {
        authenticationKey: this.enrollment.data.newKeys[this.KEY_ZERO_MASTER],
        keyNumber: this.KEY_ZERO_MASTER,
      })
    );
  }

  private async onAuthenticate(responseData: FabreaderResponse['data']): Promise<void> {
    const authenticationSuccessful = responseData.payload.authenticationSuccessful as boolean;

    if (!authenticationSuccessful) {
      this.logger.error('Enrollment failed: Authentication failed', {
        enrollmentState: this.enrollment,
      });

      this.socket.sendMessage(
        new FabreaderEvent(FabreaderEventType.DISPLAY_ERROR, {
          message: 'Enrollment failed',
          duration: 10000,
        })
      );

      const nextState = new InitialReaderState(this.socket, this.services);
      return this.socket.transitionToState(nextState);
    }

    const nfcCard = await this.services.fabreaderService.createNFCCard({
      uid: this.enrollment.cardUID,
      userId: this.userId,
      keys: {
        [this.KEY_ZERO_MASTER]: this.enrollment.data.newKeys[this.KEY_ZERO_MASTER],
      },
    });

    this.logger.log(`Created NFC card ${nfcCard.id} for user ${this.userId}`);

    this.socket.sendMessage(
      new FabreaderEvent(FabreaderEventType.DISPLAY_SUCCESS, {
        message: 'Enrollment successful',
        duration: 10000,
      })
    );

    const nextState = new InitialReaderState(this.socket, this.services);
    this.socket.transitionToState(nextState);
  }
}

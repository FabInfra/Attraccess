import { FabReader } from '@fabaccess/database-entities';
import { ReaderState } from './reader-states/reader-state.interface';

interface FabreaderMessageBaseData<TPayload = unknown> {
  auth?: {
    id: number;
    token: string;
  };
  payload: TPayload;
}

export enum FabreaderEventType {
  REGISTER = 'REGISTER',
  AUTHENTICATE = 'AUTHENTICATE',
  UNAUTHORIZED = 'UNAUTHORIZED',
  READER_AUTHENTICATED = 'READER_AUTHENTICATED',
  SHOW_TEXT = 'SHOW_TEXT',
  HIDE_TEXT = 'HIDE_TEXT',
  KEY_PRESSED = 'KEY_PRESSED',
  NFC_TAP = 'NFC_TAP',
  CHANGE_KEYS = 'CHANGE_KEYS',
  ENABLE_CARD_CHECKING = 'ENABLE_CARD_CHECKING',
  DISABLE_CARD_CHECKING = 'DISABLE_CARD_CHECKING',
  DISPLAY_SUCCESS = 'DISPLAY_SUCCESS',
  DISPLAY_ERROR = 'DISPLAY_ERROR',
  REAUTHENTICATE = 'REAUTHENTICATE',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FabreaderEvent<TPayload = any | undefined> {
  public readonly event = 'EVENT';
  public readonly data: FabreaderMessageBaseData<TPayload> & {
    type: FabreaderEventType;
  };

  public constructor(type: FabreaderEventType, payload: TPayload = undefined) {
    this.data = {
      type,
      payload,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FabreaderResponse<TPayload = any | undefined> {
  public readonly event = 'RESPONSE';
  public readonly data: FabreaderMessageBaseData<TPayload> & {
    type: FabreaderEventType;
  };

  public constructor(type: FabreaderEventType, payload: TPayload) {
    this.data = {
      type,
      payload,
    };
  }

  public static fromEventData<TPayload>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventData: FabreaderEvent<any>['data'],
    payload: TPayload
  ): FabreaderResponse<TPayload> {
    return new FabreaderResponse(eventData.type, payload);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FabreaderMessage<TPayload = any | undefined> = FabreaderEvent<TPayload> | FabreaderResponse<TPayload>;

export interface AuthenticatedWebSocket extends Omit<WebSocket, 'send'> {
  id: string;
  disconnectTimeout?: NodeJS.Timeout;
  reader?: FabReader;
  state?: ReaderState;
  transitionToState: (state: ReaderState) => Promise<void>;
  sendMessage: (message: FabreaderMessage) => void;
}

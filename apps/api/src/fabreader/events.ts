import { FabReader } from '@fabaccess/database-entities';

export class ReaderUpdatedEvent {
  constructor(public readonly reader: FabReader) {}
}

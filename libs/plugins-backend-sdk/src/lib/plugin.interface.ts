import { Resource, User } from '@fabaccess/database-entities';

export enum SystemEvent {
  RESOURCE_USAGE_STARTED = 'RESOURCE_USAGE_STARTED',
  RESOURCE_USAGE_ENDED = 'RESOURCE_USAGE_ENDED',
}

export type SystemEventPayload = {
  [SystemEvent.RESOURCE_USAGE_STARTED]: { resource: Resource; user: User };
  [SystemEvent.RESOURCE_USAGE_ENDED]: { resource: Resource; user: User };
};

export type SystemEventResponse = {
  [SystemEvent.RESOURCE_USAGE_STARTED]: null;
  [SystemEvent.RESOURCE_USAGE_ENDED]: null;
};

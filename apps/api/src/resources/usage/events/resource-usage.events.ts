/**
 * Events emitted when resource usage status changes
 */

import { User } from '@attraccess/database-entities';

export class ResourceUsageStartedEvent {
  constructor(public readonly resourceId: number, public readonly startTime: Date, public readonly user: User) {}
}

export class ResourceUsageEndedEvent {
  constructor(
    public readonly resourceId: number,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly user: User
  ) {}
}

export class ResourceUsageTakenOverEvent {
  constructor(
    public readonly resourceId: number,
    public readonly takeoverTime: Date,
    public readonly newUser: User,
    public readonly previousUser: User | null // Previous user might not exist if resource was free
  ) {}
}

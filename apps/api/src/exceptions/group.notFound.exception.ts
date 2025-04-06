import { NotFoundException } from '@nestjs/common';

/**
 * Custom exception for cases where a requested resource group is not found.
 */
export class GroupNotFoundException extends NotFoundException {
  constructor(groupId: number) {
    super('GroupNotFoundException', {
      description: `Group with ID ${groupId} not found`,
    });
  }
}

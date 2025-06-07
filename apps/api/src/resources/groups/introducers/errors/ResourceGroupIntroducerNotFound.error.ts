import { NotFoundException } from '@nestjs/common';

export class ResourceGroupIntroducerNotFoundException extends NotFoundException {
  constructor(groupId: number, userId: number) {
    super('ResourceGroupIntroducerNotFound', {
      cause: `Resource group introducer with groupId ${groupId} and userId ${userId} not found`,
    });
  }
}

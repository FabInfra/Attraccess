import { ResourceGroup } from '@fabaccess/database-entities';
import { NotFoundException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

export class ResourceGroupNotFoundException extends NotFoundException {
  constructor(identifier: FindOneOptions<ResourceGroup>['where']) {
    super('ResourceGroupNotFound', {
      cause: `Resource group with identifier ${JSON.stringify(identifier)} not found`,
    });
  }
}

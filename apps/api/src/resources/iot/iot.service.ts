import { Resource, User } from '@fabaccess/database-entities';
import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';

export interface TemplateContext {
  id: Resource['id'];
  name: Resource['name'];
  timestamp: string;
  user: Pick<User, 'id' | 'username' | 'externalIdentifier'>;
  previousUser?: Pick<User, 'id' | 'username' | 'externalIdentifier'>; // Added for takeover events
}

@Injectable()
export class IotService {
  private templates: Record<string, HandlebarsTemplateDelegate> = {};

  private compileTemplate(template: string): HandlebarsTemplateDelegate {
    if (!this.templates[template]) {
      this.templates[template] = Handlebars.compile(template);
    }
    return this.templates[template];
  }

  public processTemplate(template: string, context: TemplateContext): string {
    const compiled = this.compileTemplate(template);
    return compiled({
      id: context.id,
      name: context.name,
      timestamp: context.timestamp,
      user: {
        id: context.user.id,
        username: context.user.username,
        externalIdentifier: context.user.externalIdentifier,
      },
      previousUser: context.previousUser
        ? {
            id: context.previousUser.id,
            username: context.previousUser.username,
            externalIdentifier: context.previousUser.externalIdentifier,
          }
        : undefined,
    });
  }
}

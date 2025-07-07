import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from '@fabaccess/database-entities';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';
import { MjmlService } from './mjml.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
  providers: [EmailTemplateService, MjmlService],
  controllers: [EmailTemplateController],
  exports: [EmailTemplateService, MjmlService],
})
export class EmailTemplateModule {}

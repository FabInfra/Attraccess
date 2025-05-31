import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from '@attraccess/database-entities';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
  providers: [EmailTemplateService],
  controllers: [EmailTemplateController],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}

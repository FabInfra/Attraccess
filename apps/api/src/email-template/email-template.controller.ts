import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '@attraccess/plugins-backend-sdk';
import { SystemPermission, EmailTemplate } from '@attraccess/database-entities';

@ApiTags('Email Templates')
@ApiBearerAuth()
@Controller('email-templates')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @Auth('CAN_MANAGE_SYSTEM_CONFIGURATION' as SystemPermission)
  @ApiOperation({ summary: 'Create a new email template' })
  @ApiResponse({ status: 201, description: 'The template has been successfully created.', type: EmailTemplate })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto): Promise<EmailTemplate> {
    return this.emailTemplateService.create(createEmailTemplateDto);
  }

  @Get()
  @Auth('CAN_MANAGE_SYSTEM_CONFIGURATION' as SystemPermission)
  @ApiOperation({ summary: 'List all email templates' })
  @ApiResponse({ status: 200, description: 'List of email templates.', type: [EmailTemplate] })
  findAll(): Promise<EmailTemplate[]> {
    return this.emailTemplateService.findAll();
  }

  @Get(':id')
  @Auth('CAN_MANAGE_SYSTEM_CONFIGURATION' as SystemPermission)
  @ApiOperation({ summary: 'Get an email template by ID' })
  @ApiResponse({ status: 200, description: 'The email template.', type: EmailTemplate })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  findOne(@Param('id') id: string): Promise<EmailTemplate> {
    return this.emailTemplateService.findOne(id);
  }

  @Patch(':id')
  @Auth('CAN_MANAGE_SYSTEM_CONFIGURATION' as SystemPermission)
  @ApiOperation({ summary: 'Update an email template' })
  @ApiResponse({ status: 200, description: 'The template has been successfully updated.', type: EmailTemplate })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  update(@Param('id') id: string, @Body() updateEmailTemplateDto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    return this.emailTemplateService.update(id, updateEmailTemplateDto);
  }

  @Delete(':id')
  @Auth('CAN_MANAGE_SYSTEM_CONFIGURATION' as SystemPermission)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an email template' })
  @ApiResponse({ status: 204, description: 'The template has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Template not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.emailTemplateService.remove(id);
  }
}

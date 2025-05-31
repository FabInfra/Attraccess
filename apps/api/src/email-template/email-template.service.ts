import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { VERIFY_EMAIL_MJML_TEMPLATE } from '../email/templates/verify-email.template';
import { RESET_PASSWORD_MJML_TEMPLATE } from '../email/templates/reset-password.template';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplate } from '@attraccess/database-entities';
import { Repository } from 'typeorm';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import mjml2html from 'mjml';

@Injectable()
export class EmailTemplateService implements OnModuleInit {
  private readonly logger = new Logger(EmailTemplateService.name);

  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing EmailTemplateService and seeding default templates if necessary...');
    await this.seedDefaultTemplates();
  }

  private async seedDefaultTemplates() {
    const defaultTemplates = [
      {
        name: 'verify-email',
        subject: 'Verify your email address',
        mjmlContent: VERIFY_EMAIL_MJML_TEMPLATE,
      },
      {
        name: 'reset-password',
        subject: 'Reset your password',
        mjmlContent: RESET_PASSWORD_MJML_TEMPLATE,
      },
    ];

    for (const templateData of defaultTemplates) {
      try {
        const existingTemplate = await this.findOneByName(templateData.name);
        if (!existingTemplate) {
          this.logger.log(`Default template "${templateData.name}" not found. Seeding...`);
          const { html } = mjml2html(templateData.mjmlContent);
          const newTemplate = this.emailTemplateRepository.create({
            name: templateData.name,
            subject: templateData.subject,
            mjmlContent: templateData.mjmlContent,
            htmlContent: html,
          });
          await this.emailTemplateRepository.save(newTemplate);
          this.logger.log(`Default template "${templateData.name}" seeded successfully.`);
        } else {
          this.logger.log(`Default template "${templateData.name}" already exists. Skipping seed.`);
        }
      } catch (error) {
        this.logger.error(`Error seeding default template "${templateData.name}":`, error.stack);
      }
    }
  }


  async create(createEmailTemplateDto: CreateEmailTemplateDto): Promise<EmailTemplate> {
    const { html } = mjml2html(createEmailTemplateDto.mjmlContent);
    const newTemplate = this.emailTemplateRepository.create({
      ...createEmailTemplateDto,
      htmlContent: html,
    });
    return this.emailTemplateRepository.save(newTemplate);
  }

  async findAll(): Promise<EmailTemplate[]> {
    return this.emailTemplateRepository.find();
  }

  async findOne(id: string): Promise<EmailTemplate> {
    const template = await this.emailTemplateRepository.findOneBy({ id });
    if (!template) {
      throw new NotFoundException(`Email template with ID "${id}" not found`);
    }
    return template;
  }

  async findOneByName(name: string): Promise<EmailTemplate | null> {
    return this.emailTemplateRepository.findOneBy({ name });
  }

  async update(id: string, updateEmailTemplateDto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    const template = await this.findOne(id); // Ensures template exists
    let htmlContent = template.htmlContent;
    if (updateEmailTemplateDto.mjmlContent) {
      const { html } = mjml2html(updateEmailTemplateDto.mjmlContent);
      htmlContent = html;
    }
    
    const updatedDto = {
        ...updateEmailTemplateDto,
        ...(updateEmailTemplateDto.mjmlContent && { htmlContent }), // only add htmlContent if mjmlContent was provided
    };

    await this.emailTemplateRepository.update(id, updatedDto);
    return this.findOne(id); // Return the updated entity
  }

  async remove(id: string): Promise<void> {
    const result = await this.emailTemplateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Email template with ID "${id}" not found`);
    }
  }
}

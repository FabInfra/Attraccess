// apps/api/src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config'; // Added
import { User } from '@attraccess/database-entities';
import mjml2html from 'mjml';
import { join } from 'path'; // resolve might not be needed anymore
import { readdir, readFile, stat } from 'fs/promises';
import * as Handlebars from 'handlebars';
import { EmailConfiguration as EmailConfigMapType } from './email.config'; // Added for typing

@Injectable()
export class EmailService {
  private templates: null | Record<string, HandlebarsTemplateDelegate> = null;
  private readonly logger = new Logger(EmailService.name);
  private frontendUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService, // Injected
  ) {
    this.logger.debug('Initializing EmailService');
    
    const emailConf = this.configService.get<EmailConfigMapType>('email');
    let templateDirFromConfig: string | undefined;

    if (emailConf && emailConf.mailerOptions && emailConf.mailerOptions.template && emailConf.mailerOptions.template.dir) {
        templateDirFromConfig = emailConf.mailerOptions.template.dir;
    }

    if (!templateDirFromConfig) {
        this.logger.error('Email template path not configured correctly via ConfigService(email.mailerOptions.template.dir). Cannot load templates.');
    } else {
        this.loadTemplates(templateDirFromConfig);
    }

    this.frontendUrl = this.configService.get<string>('app.frontendUrl') || 
                       this.configService.get<string>('FRONTEND_URL') || 
                       this.configService.get<string>('VITE_ATTRACCESS_URL'); 

    if (!this.frontendUrl) {
      this.logger.warn('FRONTEND_URL not found in configuration. Using default fallback: http://localhost:3000. Email links may be incorrect.');
      this.frontendUrl = 'http://localhost:3000'; // Fallback
    }
    this.logger.debug(`EmailService initialized with FRONTEND_URL: ${this.frontendUrl}`);
  }

  private async loadTemplates(templatesPath: string) {
    this.logger.debug(`Loading email templates from path: ${templatesPath}`);
    
    try {
      const templatesPathExists = await stat(templatesPath).then(stats => stats.isDirectory()).catch(() => false);
      if (!templatesPathExists) {
        this.logger.error(`Configured email templates path does not exist or is not a directory: ${templatesPath}`);
        throw new Error(`Email templates path not found at ${templatesPath}`);
      }

      const files = await readdir(templatesPath);
      this.logger.debug(`Found ${files.length} files in templates directory: ${templatesPath}`);
      this.templates = {};

      for (const file of files) {
        if (file.endsWith('.mjml')) {
          const templateName = file.replace('.mjml', '');
          this.logger.debug(`Loading template: ${templateName}`);
          const templateContent = await readFile(join(templatesPath, file), 'utf-8');
          this.templates[templateName] = Handlebars.compile(mjml2html(templateContent).html);
          this.logger.debug(`Compiled template: ${templateName}`);
        }
      }
      this.logger.debug(`Loaded ${Object.keys(this.templates || {}).length} email templates`);
    } catch (error) {
      this.logger.error(`Failed to load email templates from ${templatesPath}:`, error.stack);
      this.templates = null; 
    }
  }

  private async getTemplate(name: string): Promise<HandlebarsTemplateDelegate | null> {
    this.logger.debug(`Getting template: ${name}`);
    if (!this.templates) {
      this.logger.warn('Templates object is null, possibly due to loading error. Cannot get template.');
      const emailConf = this.configService.get<EmailConfigMapType>('email');
      let templateDirFromConfig: string | undefined;
      if (emailConf && emailConf.mailerOptions && emailConf.mailerOptions.template && emailConf.mailerOptions.template.dir) {
        templateDirFromConfig = emailConf.mailerOptions.template.dir;
      }
      if (templateDirFromConfig) {
        this.logger.debug('Attempting to reload templates in getTemplate.');
        await this.loadTemplates(templateDirFromConfig); 
      } else {
        this.logger.error('Cannot reload templates: path not configured.');
        return null;
      }
    }
    
    if (!this.templates) {
        this.logger.error('Templates are still null after attempting reload. Cannot provide template.');
        return null;
    }

    const template = this.templates[name];
    if (!template) {
      this.logger.warn(`Template not found: ${name}`);
      return null; 
    }
    return template;
  }

  async sendVerificationEmail(user: User, verificationToken: string) {
    this.logger.debug(`Sending verification email to user ID: ${user.id}, email: ${user.email}`);
    const verificationUrl = `${this.frontendUrl}/verify-email?email=${encodeURIComponent(user.email)}&token=${verificationToken}`;
    this.logger.debug(`Verification URL: ${verificationUrl}`);

    const template = await this.getTemplate('verify-email');
    if (!template) {
      this.logger.error('verify-email template not found or failed to load. Cannot send email.');
      throw new Error('Email template not found: verify-email');
    }

    const html = template({ username: user.username, verificationUrl });

    this.logger.debug(`Sending email to: ${user.email}`);
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Verify your email address',
        html,
      });
      this.logger.debug(`Verification email sent successfully to: ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to: ${user.email}`, error.stack);
      throw error;
    }
  }

  async sendPasswordResetEmail(user: User, resetToken: string) {
    this.logger.debug(`Sending password reset email to user ID: ${user.id}, email: ${user.email}`);
    const resetUrl = `${this.frontendUrl}/reset-password?userId=${user.id}&token=${encodeURIComponent(resetToken)}`;
    this.logger.debug(`Reset URL: ${resetUrl}`);

    const template = await this.getTemplate('reset-password');
    if (!template) {
      this.logger.error('reset-password template not found or failed to load. Cannot send email.');
      throw new Error('Email template not found: reset-password');
    }

    const html = template({ username: user.username, resetUrl });

    this.logger.debug(`Sending reset email to: ${user.email}`);
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset your password',
        html,
      });
      this.logger.debug(`Password reset email sent successfully to: ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to: ${user.email}`, error.stack);
      throw error;
    }
  }
}

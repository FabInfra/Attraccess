import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@attraccess/database-entities';
import mjml2html from 'mjml';
import { join, resolve } from 'path';
import { readdir, readFile, stat } from 'fs/promises';
import * as Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { createConfigSchema, validateConfig } from '@attraccess/env';
import { z } from 'zod';

interface EmailConfig {
  FRONTEND_URL: string;
}

@Injectable()
export class EmailService {
  private templates: null | Record<string, HandlebarsTemplateDelegate> = null;
  private config: EmailConfig;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug('Initializing EmailService');
    // Load and compile templates
    this.loadTemplates();
    
    // Get frontend URL from config service
    this.config = {
      FRONTEND_URL: this.configService.get<string>('frontend.FRONTEND_URL')
    };
    this.logger.debug(`EmailService initialized with FRONTEND_URL: ${this.config.FRONTEND_URL}`);
  }

  private async loadTemplates() {
    this.logger.debug('Loading email templates');
    const emailTemplatesPath = this.configService.get<string>('email.EMAIL_TEMPLATES_PATH');
    
    const possiblePaths = [
      emailTemplatesPath,
      resolve(join('assets', 'email-templates')),
      resolve(join('src', 'assets', 'email-templates')),
      resolve(join('apps', 'api', 'src', 'assets', 'email-templates')),
    ];

    let templatesPath = null;
    for (const path of possiblePaths) {
      if (!path) {
        continue;
      }

      this.logger.debug(`Checking for templates in path: ${path}`);
      const templatesPathExists = await stat(path)
        .then((stats) => stats.isDirectory())
        .catch(() => false);

      if (templatesPathExists) {
        templatesPath = path;
        this.logger.debug(`Found templates path: ${path}`);
        break;
      }
    }

    if (!templatesPath) {
      this.logger.error('Email templates path not found in any of the possible locations');
      throw new Error('Email templates path not found');
    }

    const files = await readdir(templatesPath);
    this.logger.debug(`Found ${files.length} files in templates directory`);
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

    this.logger.debug(`Loaded ${Object.keys(this.templates).length} email templates`);
  }

  private async getTemplate(name: string) {
    this.logger.debug(`Getting template: ${name}`);
    if (!this.templates) {
      this.logger.debug('Templates not loaded, loading now');
      await this.loadTemplates();
    }

    const template = this.templates[name];
    if (!template) {
      this.logger.warn(`Template not found: ${name}`);
    }

    return template;
  }

  async sendVerificationEmail(user: User, verificationToken: string) {
    this.logger.debug(`Sending verification email to user ID: ${user.id}, email: ${user.email}`);
    const verificationUrl = `${this.config.FRONTEND_URL}/verify-email?email=${encodeURIComponent(
      user.email
    )}&token=${verificationToken}`;
    this.logger.debug(`Verification URL: ${verificationUrl}`);

    const template = await this.getTemplate('verify-email');
    if (!template) {
      this.logger.error('verify-email template not found');
      throw new Error('Email template not found: verify-email');
    }

    const html = template({
      username: user.username,
      verificationUrl,
    });

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
    const resetUrl = `${this.config.FRONTEND_URL}/reset-password?userId=${user.id}&token=${encodeURIComponent(
      resetToken
    )}`;
    this.logger.debug(`Reset URL: ${resetUrl}`);

    const template = await this.getTemplate('reset-password');
    if (!template) {
      this.logger.error('reset-password template not found');
      throw new Error('Email template not found: reset-password');
    }

    const html = template({
      username: user.username,
      resetUrl,
    });

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

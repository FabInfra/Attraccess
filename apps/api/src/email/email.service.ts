import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@attraccess/database-entities';
import mjml2html from 'mjml';

import * as Handlebars from 'handlebars';
import { VERIFY_EMAIL_MJML_TEMPLATE } from './templates/verify-email.template';
import { RESET_PASSWORD_MJML_TEMPLATE } from './templates/reset-password.template';

@Injectable()
export class EmailService {
  private templates: null | Record<string, HandlebarsTemplateDelegate> = null;
  private readonly logger = new Logger(EmailService.name);
  private frontendUrl: string;

  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {
    this.logger.debug('Initializing EmailService');

    this.loadTemplates();

    this.frontendUrl =
      this.configService.get<string>('app.frontendUrl') ||
      this.configService.get<string>('FRONTEND_URL') ||
      this.configService.get<string>('VITE_ATTRACCESS_URL');

    if (!this.frontendUrl) {
      this.logger.warn(
        'FRONTEND_URL not found in configuration. Using default fallback: http://localhost:3000. Email links may be incorrect.'
      );
      this.frontendUrl = 'http://localhost:3000'; // Fallback
    }
    this.logger.debug(`EmailService initialized with FRONTEND_URL: ${this.frontendUrl}`);
  }

  private async loadTemplates() {
    this.logger.debug('Loading static email templates.');
    this.templates = {};

    try {
      this.logger.debug('Loading static template: verify-email');
      this.templates['verify-email'] = Handlebars.compile(mjml2html(VERIFY_EMAIL_MJML_TEMPLATE).html);
      this.logger.debug('Compiled static template: verify-email');

      this.logger.debug('Loading static template: reset-password');
      this.templates['reset-password'] = Handlebars.compile(mjml2html(RESET_PASSWORD_MJML_TEMPLATE).html);
      this.logger.debug('Compiled static template: reset-password');

      this.logger.debug(`Loaded ${Object.keys(this.templates).length} static email templates.`);
    } catch (error) {
      this.logger.error('Failed to load static email templates:', error.stack);
      throw error;
    }
  }

  private async getTemplate(name: string): Promise<HandlebarsTemplateDelegate> {
    this.logger.debug(`Getting template: ${name}`);
    if (!this.templates || !this.templates[name]) {
      throw new NotFoundException(`Template not found: ${name}`);
    }

    return this.templates[name];
  }

  async sendVerificationEmail(user: User, verificationToken: string) {
    this.logger.debug(`Sending verification email to user ID: ${user.id}, email: ${user.email}`);
    const verificationUrl = `${this.frontendUrl}/verify-email?email=${encodeURIComponent(
      user.email
    )}&token=${verificationToken}`;
    this.logger.debug(`Verification URL: ${verificationUrl}`);

    const template = await this.getTemplate('verify-email');

    const html = template({
      username: user.username,
      verificationUrl,
      logoUrl: this.configService.get<string>(
        'app.logoUrl',
        'https://attraccess.fabinfra.dev/assets/logo_navbar-BhJ4pnsY.png'
      ), // Using a default from a quick search, replace if a better one is configured
      year: new Date().getFullYear(),
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
    const resetUrl = `${this.frontendUrl}/reset-password?userId=${user.id}&token=${encodeURIComponent(resetToken)}`;
    this.logger.debug(`Reset URL: ${resetUrl}`);

    const template = await this.getTemplate('reset-password');

    const html = template({
      username: user.username,
      resetUrl,
      logoUrl: this.configService.get<string>(
        'app.logoUrl',
        'https://attraccess.fabinfra.dev/assets/logo_navbar-BhJ4pnsY.png'
      ),
      year: new Date().getFullYear(),
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

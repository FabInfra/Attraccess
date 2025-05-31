import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import emailConfiguration, { EmailConfiguration } from './email.config';
import { EmailTemplateModule } from '../email-template/email-template.module';

@Module({
  imports: [
    EmailTemplateModule,
    ConfigModule.forFeature(emailConfiguration),
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // Not needed if ConfigModule.forFeature is used or ConfigModule is global
      useFactory: (configService: ConfigService< { email: EmailConfiguration } >) => {
        const emailConf = configService.get('email', { infer: true });
        if (!emailConf) {
          throw new Error('Email configuration not found or invalid. Please ensure SMTP_HOST, SMTP_PORT, and other required email environment variables are correctly set.');
        }
        return emailConf.mailerOptions;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

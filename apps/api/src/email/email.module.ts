import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { mailerConfig } from './email.config';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to use ConfigService
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Use the configuration from the ConfigService if available,
        // otherwise fall back to the static configuration
        return configService.get('email') || mailerConfig;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

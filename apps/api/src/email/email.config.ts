import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { z } from 'zod';

const EmailEnvSchema = z.object({
  SMTP_SERVICE: z.string().optional(),
  SMTP_HOST: z.string().min(1, { message: 'SMTP_HOST is required' }),
  SMTP_PORT: z.coerce.number().positive({ message: 'SMTP_PORT must be a positive number' }),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM_NAME: z.string().default('Attraccess'),
  SMTP_FROM_EMAIL: z.string().email({ message: 'Invalid SMTP_FROM_EMAIL format' }).default('noreply@attraccess.org'),
  EMAIL_TEMPLATES_PATH: z.string().default(path.resolve(process.cwd(), 'apps/api/src/assets/email-templates')),
});

// This type can be imported by EmailModule if needed for ConfigService typing
export type EmailConfiguration = ReturnType<typeof emailConfigFactory>;

const handlebarsAdapter = new HandlebarsAdapter();

const emailConfigFactory = () => {
  const validatedEnv = EmailEnvSchema.parse(process.env);
  return {
    mailerOptions: {
      transport: {
        host: validatedEnv.SMTP_HOST,
        port: validatedEnv.SMTP_PORT,
        secure: validatedEnv.SMTP_SECURE,
        auth: (validatedEnv.SMTP_USER && validatedEnv.SMTP_PASS) ? {
          user: validatedEnv.SMTP_USER,
          pass: validatedEnv.SMTP_PASS,
        } : undefined,
        ...(validatedEnv.SMTP_SERVICE && { service: validatedEnv.SMTP_SERVICE }),
      },
      defaults: {
        from: `"${validatedEnv.SMTP_FROM_NAME}" <${validatedEnv.SMTP_FROM_EMAIL}>`,
      },
      template: {
        dir: validatedEnv.EMAIL_TEMPLATES_PATH,
        adapter: handlebarsAdapter,
        options: {
          strict: true,
        },
      },
    } as MailerOptions, 
  };
};

export default registerAs('email', emailConfigFactory);

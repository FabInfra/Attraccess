import { createConfigSchema, validateConfig } from '@attraccess/env';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Define basic email configuration schema
const basicEmailSchema = createConfigSchema((z) => ({
  SMTP_SERVICE: z.enum(['SMTP', 'Outlook365']),
  SMTP_FROM: z.string().email(),
}));

// Validate basic email configuration at startup
const basicEmailEnv = validateConfig(basicEmailSchema);

// Define SMTP configuration schema
const smtpSchema = createConfigSchema((z) => ({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_TLS_CIPHERS: z.string().optional(),
  SMTP_IGNORE_TLS: z.coerce.boolean().default(true),
  SMTP_REQUIRE_TLS: z.coerce.boolean().default(false),
  SMTP_TLS_REJECT_UNAUTHORIZED: z.coerce.boolean().default(true),
}));

const getSMTPTransportOptions = () => {
  // Validate SMTP configuration at startup
  const smtpEnv = validateConfig(smtpSchema);

  let smtpAuthOptions = null;
  if (smtpEnv.SMTP_USER) {
    smtpAuthOptions = {
      auth: {
        user: smtpEnv.SMTP_USER,
        pass: smtpEnv.SMTP_PASS,
      },
      secure: smtpEnv.SMTP_SECURE,
      ignoreTLS: smtpEnv.SMTP_IGNORE_TLS,
      requireTLS: smtpEnv.SMTP_REQUIRE_TLS,
      tls: {
        rejectUnauthorized: smtpEnv.SMTP_TLS_REJECT_UNAUTHORIZED,
        ciphers: smtpEnv.SMTP_TLS_CIPHERS,
      },
    };
  }

  return {
    host: smtpEnv.SMTP_HOST,
    port: smtpEnv.SMTP_PORT,
    ...smtpAuthOptions,
  };
};

// Define Outlook365 configuration schema
const outlook365Schema = createConfigSchema((z) => ({
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
}));

const getOutlook365TransportOptions = () => {
  // Validate Outlook365 configuration at startup
  const env = validateConfig(outlook365Schema);

  return {
    service: 'Outlook365',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  };
};

// Determine the transport configuration based on the service type
let transport = {};
switch (basicEmailEnv.SMTP_SERVICE) {
  case 'SMTP':
    transport = getSMTPTransportOptions();
    break;
  case 'Outlook365':
    transport = getOutlook365TransportOptions();
    break;
}

// Create the mailer configuration
const config = {
  transport,
  defaults: {
    from: basicEmailEnv.SMTP_FROM,
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};

// Export the mailer configuration for direct use
export const mailerConfig: MailerOptions = config;

// Export a configuration provider for NestJS
export const emailConfig = registerAs('email', () => config);
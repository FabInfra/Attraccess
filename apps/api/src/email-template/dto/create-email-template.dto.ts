import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateEmailTemplateDto {
  @ApiProperty({
    description: 'Unique name for the template (e.g., verify-email, reset-password)',
    example: 'verify-email',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Email subject line',
    example: 'Verify Your Email Address',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  @ApiPropertyOptional({ // Make it optional
    description: 'Optional description for the template',
    example: 'Template for verifying new user emails.',
  })
  @IsOptional() // Add IsOptional
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'MJML content of the email body',
    example: '<mjml><mj-body><mj-section><mj-column><mj-text>Hello World</mj-text></mj-column></mj-section></mj-body></mjml>',
  })
  @IsNotEmpty()
  @IsString()
  mjmlContent: string;
}

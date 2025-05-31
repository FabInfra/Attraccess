import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEmailTemplateDto {
  @ApiPropertyOptional({
    description: 'Unique name for the template (e.g., verify-email, reset-password)',
    example: 'verify-email',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Email subject line',
    example: 'Verify Your Email Address',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiPropertyOptional({
    description: 'Optional description for the template',
    example: 'Updated description for verifying emails.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'MJML content of the email body',
    example: '<mjml><mj-body><mj-section><mj-column><mj-text>Hello World Updated</mj-text></mj-column></mj-section></mj-body></mjml>',
  })
  @IsOptional()
  @IsString()
  mjmlContent?: string;
}

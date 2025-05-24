import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUrl, ValidateIf } from 'class-validator';
import { FileUpload } from '../../common/types/file-upload.types';
import { DocumentationType } from '@attraccess/database-entities';

export class UpdateResourceDto {
  @ApiProperty({
    description: 'The name of the resource',
    example: '3D Printer',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'A detailed description of the resource',
    example: 'Prusa i3 MK3S+ 3D printer with 0.4mm nozzle',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'New resource image file',
    required: false,
    type: 'string',
    format: 'binary',
  })
  image?: FileUpload;
  
  @ApiProperty({
    description: 'The type of documentation (markdown or url)',
    enum: DocumentationType,
    required: false,
    example: DocumentationType.MARKDOWN,
  })
  @IsEnum(DocumentationType)
  @IsOptional()
  documentationType?: DocumentationType;
  
  @ApiProperty({
    description: 'Markdown content for resource documentation',
    required: false,
    example: '# Resource Documentation\n\nThis is a markdown documentation for the resource.',
  })
  @IsString()
  @ValidateIf(o => o.documentationType === DocumentationType.MARKDOWN)
  @IsOptional()
  documentationMarkdown?: string;
  
  @ApiProperty({
    description: 'URL to external documentation',
    required: false,
    example: 'https://example.com/documentation',
  })
  @IsUrl()
  @ValidateIf(o => o.documentationType === DocumentationType.URL)
  @IsOptional()
  documentationUrl?: string;
}

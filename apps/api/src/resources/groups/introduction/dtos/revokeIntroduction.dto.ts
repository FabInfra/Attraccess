import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RevokeIntroductionDto {
  @ApiProperty({
    description: 'Optional comment explaining the reason for revoking access',
    required: false,
    example: 'User no longer works on this project',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class UnrevokeIntroductionDto {
  @ApiProperty({
    description: 'Optional comment explaining the reason for unrevoking access',
    required: false,
    example: 'User rejoined the project',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}

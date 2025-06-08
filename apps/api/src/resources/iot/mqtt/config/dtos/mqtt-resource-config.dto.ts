import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ToBoolean } from '../../../../../common/request-transformers';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating or updating an MQTT resource configuration
 */
export class CreateMqttResourceConfigDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the MQTT server to use',
    example: 1,
  })
  serverId!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of this MQTT configuration',
    example: 'Primary Status Feed',
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Topic template for when resource is in use',
    example: 'resources/{{id}}/status',
  })
  inUseTopic!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Message template for when resource is in use',
    example: '{"status":"in_use","resourceId":{{id}},"resourceName":"{{name}}"}',
  })
  inUseMessage!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Topic template for when resource is not in use',
    example: 'resources/{{id}}/status',
  })
  notInUseTopic!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Message template for when resource is not in use',
    example: '{"status":"not_in_use","resourceId":{{id}},"resourceName":"{{name}}"}',
  })
  notInUseMessage!: string;

  @ApiProperty({
    description: 'Whether to send a start message when a resource is taken over',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  onTakeoverSendStart?: boolean = false;

  @ApiProperty({
    description: 'Whether to send a stop message when a resource is taken over',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  onTakeoverSendStop?: boolean = false;

  @ApiProperty({
    description: 'Whether to send an MQTT message when a resource usage is taken over',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  onTakeoverSendTakeover?: boolean = true;

  @ApiProperty({
    description: 'Topic template for when resource usage is taken over',
    example: 'resources/{{id}}/status',
    required: false,
  })
  @IsString()
  @IsOptional()
  takeoverTopic?: string;

  @ApiProperty({
    description: 'Message template for when resource usage is taken over',
    example:
      '{"status": "taken_over", "resourceId": "{{id}}", "newUser": "{{user.name}}", "previousUser": "{{previousUser.name}}", "timestamp": "{{timestamp}}"}',
    required: false,
  })
  @IsString()
  @IsOptional()
  takeoverMessage?: string;
}

/**
 * DTO for updating an MQTT resource configuration
 * Extends CreateMqttResourceConfigDto but makes all properties optional
 */
export class UpdateMqttResourceConfigDto extends PartialType(CreateMqttResourceConfigDto) {}

/**
 * Response DTO for MQTT configuration test
 */
export class TestMqttConfigResponseDto {
  @ApiProperty({
    description: 'Whether the test was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Message describing the test result',
    example: 'MQTT configuration is valid and connection to server was successful',
  })
  message!: string;
}

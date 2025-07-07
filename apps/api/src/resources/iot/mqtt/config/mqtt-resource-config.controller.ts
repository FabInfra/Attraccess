import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MqttResourceConfig } from '@fabaccess/database-entities';
import { MqttResourceConfigService } from './mqtt-resource-config.service';
import {
  CreateMqttResourceConfigDto,
  UpdateMqttResourceConfigDto,
  TestMqttConfigResponseDto,
} from './dtos/mqtt-resource-config.dto';
import { MqttClientService } from '../../../../mqtt/mqtt-client.service';
import * as Handlebars from 'handlebars';
import { Auth } from '@fabaccess/plugins-backend-sdk';

@ApiTags('MQTT')
@Auth('canManageResources')
@Controller('resources/:resourceId/mqtt/config')
export class MqttResourceConfigController {
  constructor(
    private readonly mqttResourceConfigService: MqttResourceConfigService,
    private readonly mqttClientService: MqttClientService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all MQTT configurations for a resource', operationId: 'mqttResourceConfigGetAll' })
  @ApiResponse({
    status: 200,
    description: 'Returns all MQTT configurations for the resource',
    type: [MqttResourceConfig],
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async getAll(@Param('resourceId', ParseIntPipe) resourceId: number): Promise<MqttResourceConfig[]> {
    return this.mqttResourceConfigService.findAllByResourceId(resourceId);
  }

  @Get(':configId')
  @ApiOperation({
    summary: 'Get a specific MQTT configuration for a resource',
    operationId: 'mqttResourceConfigGetOne',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the specific MQTT configuration',
    type: MqttResourceConfig,
  })
  @ApiResponse({ status: 404, description: 'Resource or configuration not found' })
  async getOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('configId', ParseIntPipe) configId: number
  ): Promise<MqttResourceConfig> {
    return this.mqttResourceConfigService.findOne(resourceId, configId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new MQTT configuration for a resource',
    operationId: 'mqttResourceConfigCreate',
  })
  @ApiResponse({
    status: 201,
    description: 'MQTT configuration created successfully',
    type: MqttResourceConfig,
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async create(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Body() mqttConfigDto: CreateMqttResourceConfigDto
  ): Promise<MqttResourceConfig> {
    return this.mqttResourceConfigService.create(resourceId, mqttConfigDto);
  }

  @Put(':configId')
  @ApiOperation({
    summary: 'Update a specific MQTT configuration',
    operationId: 'mqttResourceConfigUpdate',
  })
  @ApiResponse({
    status: 200,
    description: 'MQTT configuration updated successfully',
    type: MqttResourceConfig,
  })
  @ApiResponse({ status: 404, description: 'Resource or configuration not found' })
  async update(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('configId', ParseIntPipe) configId: number,
    @Body() mqttConfigDto: UpdateMqttResourceConfigDto
  ): Promise<MqttResourceConfig> {
    return this.mqttResourceConfigService.update(resourceId, configId, mqttConfigDto);
  }

  @Delete(':configId')
  @ApiOperation({ summary: 'Delete a specific MQTT configuration', operationId: 'mqttResourceConfigDeleteOne' })
  @ApiResponse({
    status: 200,
    description: 'MQTT configuration deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource or MQTT configuration not found',
  })
  async deleteOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('configId', ParseIntPipe) configId: number
  ): Promise<void> {
    return this.mqttResourceConfigService.remove(resourceId, configId);
  }

  @Post(':configId/test')
  @ApiOperation({ summary: 'Test a specific MQTT configuration', operationId: 'mqttResourceConfigTestOne' })
  @ApiResponse({
    status: 200,
    description: 'Test result',
    type: TestMqttConfigResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Resource or MQTT configuration not found',
  })
  async testOne(
    @Param('resourceId', ParseIntPipe) resourceId: number,
    @Param('configId', ParseIntPipe) configId: number
  ): Promise<TestMqttConfigResponseDto> {
    // Get the specific MQTT configuration
    const config = await this.mqttResourceConfigService.findOne(resourceId, configId);

    try {
      // Test the connection to the MQTT server
      const connectionResult = await this.mqttClientService.testConnection(config.serverId);

      if (!connectionResult.success) {
        return connectionResult;
      }

      // If connection is successful, validate the templates
      try {
        Handlebars.compile(config.inUseTopic);
        Handlebars.compile(config.inUseMessage);
        Handlebars.compile(config.notInUseTopic);
        Handlebars.compile(config.notInUseMessage);
        if (config.takeoverTopic) Handlebars.compile(config.takeoverTopic);
        if (config.takeoverMessage) Handlebars.compile(config.takeoverMessage);

        return {
          success: true,
          message: 'MQTT configuration is valid and connection to server was successful',
        };
      } catch (error) {
        return {
          success: false,
          message: `Template validation failed: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to test MQTT configuration: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

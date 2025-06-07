import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MqttServer } from '@attraccess/database-entities';
import { MqttServerService } from './mqtt-server.service';
import {
  CreateMqttServerDto,
  UpdateMqttServerDto,
  TestConnectionResponseDto,
  MqttServerStatusDto,
  AllMqttServerStatusesDto,
} from './dtos/mqtt-server.dto';
import { Auth } from '@attraccess/plugins-backend-sdk';
import { MqttClientService } from '../mqtt-client.service';

@ApiTags('MQTT')
@Auth('canManageResources')
@Controller('mqtt/servers')
export class MqttServerController {
  constructor(
    private readonly mqttServerService: MqttServerService,
    private readonly mqttClientService: MqttClientService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all MQTT servers', operationId: 'mqttServersGetAll' })
  @ApiResponse({
    status: 200,
    description: 'Returns all MQTT servers',
    type: [MqttServer],
  })
  async getAll(): Promise<MqttServer[]> {
    return this.mqttServerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get MQTT server by ID', operationId: 'mqttServersGetOneById' })
  @ApiResponse({
    status: 200,
    description: 'Returns the MQTT server with the specified ID',
    type: MqttServer,
  })
  @ApiResponse({ status: 404, description: 'MQTT server not found' })
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<MqttServer> {
    return this.mqttServerService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new MQTT server', operationId: 'mqttServersCreateOne' })
  @ApiResponse({
    status: 201,
    description: 'MQTT server created successfully',
    type: MqttServer,
  })
  async createOne(@Body() createMqttServerDto: CreateMqttServerDto): Promise<MqttServer> {
    return this.mqttServerService.create(createMqttServerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update MQTT server', operationId: 'mqttServersUpdateOne' })
  @ApiResponse({
    status: 200,
    description: 'MQTT server updated successfully',
    type: MqttServer,
  })
  @ApiResponse({ status: 404, description: 'MQTT server not found' })
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMqttServerDto: UpdateMqttServerDto
  ): Promise<MqttServer> {
    return this.mqttServerService.update(id, updateMqttServerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete MQTT server', operationId: 'mqttServersDeleteOne' })
  @ApiResponse({ status: 200, description: 'MQTT server deleted successfully' })
  @ApiResponse({ status: 404, description: 'MQTT server not found' })
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mqttServerService.remove(id);
  }

  @Post(':id/test')
  @ApiOperation({
    summary: 'Test MQTT server connection',
    operationId: 'mqttServersTestConnection',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection test result',
    type: TestConnectionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'MQTT server not found' })
  async testConnection(@Param('id', ParseIntPipe) id: number): Promise<TestConnectionResponseDto> {
    try {
      // First check if the server exists
      await this.mqttServerService.findOne(id);

      // Use the MQTT client service to test the connection
      const result = await this.mqttClientService.testConnection(id);

      // Ensure we always return a properly formatted response
      return {
        success: typeof result.success === 'boolean' ? result.success : false,
        message: result.message || (result.success ? 'Connection successful' : 'Connection failed'),
      };
    } catch (error) {
      // If any exception occurs, return a formatted error
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Get MQTT server connection status and statistics',
    operationId: 'mqttServersGetStatusOfOne',
  })
  @ApiResponse({
    status: 200,
    description: 'MQTT server connection status and statistics',
    type: MqttServerStatusDto,
  })
  @ApiResponse({ status: 404, description: 'MQTT server not found' })
  async getStatusOfOne(@Param('id', ParseIntPipe) id: number): Promise<MqttServerStatusDto> {
    return this.mqttClientService.getStatusOfOne(id);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get all MQTT server connection statuses and statistics',
    operationId: 'mqttServersGetStatusOfAll',
  })
  @ApiResponse({
    status: 200,
    description: 'All MQTT server connection statuses and statistics',
    type: AllMqttServerStatusesDto,
  })
  async getStatusOfAll(): Promise<Record<string, MqttServerStatusDto>> {
    return this.mqttClientService.getStatusOfAll();
  }
}

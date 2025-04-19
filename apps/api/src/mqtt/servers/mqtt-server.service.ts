import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MqttServer } from '@attraccess/database-entities';
import { CreateMqttServerDto, UpdateMqttServerDto } from './dtos/mqtt-server.dto';

@Injectable()
export class MqttServerService {
  private readonly logger = new Logger(MqttServerService.name);

  constructor(
    @InjectRepository(MqttServer)
    private readonly mqttServerRepository: Repository<MqttServer>
  ) {}

  /**
   * Get all MQTT servers
   */
  async findAll(): Promise<MqttServer[]> {
    this.logger.debug('Finding all MQTT servers');
    const servers = await this.mqttServerRepository.find();
    this.logger.debug(`Found ${servers.length} MQTT servers.`);
    return servers;
  }

  /**
   * Get a single MQTT server by ID
   */
  async findOne(id: number): Promise<MqttServer> {
    this.logger.debug(`Finding MQTT server with ID: ${id}`);
    const server = await this.mqttServerRepository.findOne({
      where: { id },
      relations: ['resourceConfigs'],
    });

    if (!server) {
      this.logger.warn(`MQTT server with ID ${id} not found.`);
      throw new NotFoundException(`MQTT server with ID ${id} not found`);
    }

    this.logger.debug(`Found MQTT server with ID: ${id}`);
    return server;
  }

  /**
   * Create a new MQTT server
   */
  async create(createMqttServerDto: CreateMqttServerDto): Promise<MqttServer> {
    const { password, ...loggableDto } = createMqttServerDto;
    this.logger.debug(`Creating new MQTT server: ${JSON.stringify(loggableDto)}`);
    const newServer = this.mqttServerRepository.create(createMqttServerDto);
    const savedServer = await this.mqttServerRepository.save(newServer);
    this.logger.log(`Successfully created MQTT server with ID: ${savedServer.id}`);
    return savedServer;
  }

  /**
   * Update an existing MQTT server
   */
  async update(id: number, updateMqttServerDto: UpdateMqttServerDto): Promise<MqttServer> {
    const { password, ...loggableDto } = updateMqttServerDto;
    this.logger.debug(`Updating MQTT server ID ${id} with data: ${JSON.stringify(loggableDto)}`);
    const server = await this.findOne(id);

    // Update the server with the new values
    Object.assign(server, updateMqttServerDto);

    const updatedServer = await this.mqttServerRepository.save(server);
    this.logger.log(`Successfully updated MQTT server ID: ${id}`);
    return updatedServer;
  }

  /**
   * Delete an MQTT server
   */
  async remove(id: number): Promise<void> {
    this.logger.debug(`Attempting to delete MQTT server with ID: ${id}`);
    const server = await this.findOne(id);
    await this.mqttServerRepository.remove(server);
    this.logger.log(`Successfully deleted MQTT server with ID: ${id}`);
  }
}

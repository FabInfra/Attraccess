import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MqttResourceConfig, Resource } from '@attraccess/database-entities';
import { CreateMqttResourceConfigDto, UpdateMqttResourceConfigDto } from './dtos/mqtt-resource-config.dto';

@Injectable()
export class MqttResourceConfigService {
  constructor(
    @InjectRepository(MqttResourceConfig)
    private readonly mqttResourceConfigRepository: Repository<MqttResourceConfig>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  /**
   * Get all MQTT configurations for a resource
   */
  async findAllByResourceId(resourceId: number): Promise<MqttResourceConfig[]> {
    // First check if the resource exists
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    // Find all MQTT configs for this resource
    return this.mqttResourceConfigRepository.find({
      where: { resourceId },
      relations: ['server'],
    });
  }

  /**
   * Get a specific MQTT configuration by ID
   */
  async findById(id: number): Promise<MqttResourceConfig> {
    const config = await this.mqttResourceConfigRepository.findOne({
      where: { id },
      relations: ['server'],
    });

    if (!config) {
      throw new NotFoundException(`MQTT configuration with ID ${id} not found`);
    }

    return config;
  }

  /**
   * Get a specific MQTT configuration for a resource
   */
  async findOne(resourceId: number, configId: number): Promise<MqttResourceConfig> {
    // First check if the resource exists
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    // Find the specific MQTT config for this resource
    const config = await this.mqttResourceConfigRepository.findOne({
      where: { id: configId, resourceId },
      relations: ['server'],
    });

    if (!config) {
      throw new NotFoundException(`MQTT configuration with ID ${configId} for resource ${resourceId} not found`);
    }

    return config;
  }

  /**
   * Create a new MQTT configuration for a resource
   */
  async create(resourceId: number, dto: CreateMqttResourceConfigDto): Promise<MqttResourceConfig> {
    // First check if the resource exists
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId },
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    // Create new config
    const newConfig = this.mqttResourceConfigRepository.create({
      resourceId,
      ...dto,
    });
    return this.mqttResourceConfigRepository.save(newConfig);
  }

  /**
   * Update an existing MQTT configuration
   */
  async update(resourceId: number, configId: number, dto: UpdateMqttResourceConfigDto): Promise<MqttResourceConfig> {
    // First get the existing config
    const config = await this.findOne(resourceId, configId);

    // Update the config
    Object.assign(config, dto);
    return this.mqttResourceConfigRepository.save(config);
  }

  /**
   * Delete a specific MQTT configuration
   */
  async remove(resourceId: number, configId: number): Promise<void> {
    // First get the existing config
    const config = await this.findOne(resourceId, configId);

    // Remove the config
    await this.mqttResourceConfigRepository.remove(config);
  }
}

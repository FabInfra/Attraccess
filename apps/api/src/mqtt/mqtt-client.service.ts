import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MqttServer } from '@attraccess/database-entities';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { MqttMonitoringService } from './mqtt-monitoring.service';
import { TestConnectionResponseDto, MqttServerStatusDto } from './servers/dtos/mqtt-server.dto';

@Injectable()
export class MqttClientService implements OnModuleInit, OnModuleDestroy {
  private clients: Map<number, MqttClient> = new Map();
  private connectionPromises: Map<number, Promise<MqttClient>> = new Map();
  private readonly logger = new Logger(MqttClientService.name);

  constructor(
    @InjectRepository(MqttServer)
    private readonly mqttServerRepository: Repository<MqttServer>,
    private readonly monitoringService: MqttMonitoringService
  ) {}

  async onModuleInit() {
    // Lazy initialization - don't connect to any servers at startup
    this.logger.log('MQTT Client Service initialized');
  }

  async onModuleDestroy() {
    // Disconnect all clients on shutdown
    this.logger.log(`Disconnecting from ${this.clients.size} MQTT servers`);
    for (const [id, client] of this.clients.entries()) {
      this.logger.debug(`Ending client for server ID: ${id}`);
      client.end(true);
      this.clients.delete(id);
      this.monitoringService.onDisconnect(id);
    }
  }

  private async getOrCreateClient(serverId: number): Promise<MqttClient> {
    this.logger.debug(`Attempting to get or create MQTT client for server ID: ${serverId}`);
    // If there's an existing connection being established, wait for it
    if (this.connectionPromises.has(serverId)) {
      this.logger.debug(`Connection promise found for server ID: ${serverId}. Awaiting existing promise.`);
      const connectionPromise = this.connectionPromises.get(serverId);
      if (connectionPromise) {
        try {
          const client = await connectionPromise;
          this.logger.debug(`Existing connection promise for server ID: ${serverId} resolved successfully.`);
          return client;
        } catch (error) {
          this.logger.warn(`Existing connection promise for server ID: ${serverId} failed. Error: ${error.message}`);
          // The promise will be deleted in the finally block, allow creation to proceed
        }
      }
    }

    // If we already have a connected client, return it
    if (this.clients.has(serverId)) {
      const client = this.clients.get(serverId);
      if (client && client.connected) {
        this.logger.debug(`Found existing connected client for server ID: ${serverId}.`);
        return client;
      }
      this.logger.debug(
        `Found existing client for server ID: ${serverId}, but it's not connected. Proceeding to create.`
      );
    }

    this.logger.debug(
      `No active or connecting client found for server ID: ${serverId}. Creating new connection promise.`
    );
    // Otherwise, create a new connection promise
    const connectionPromise = this.createClient(serverId);
    this.connectionPromises.set(serverId, connectionPromise);

    try {
      const client = await connectionPromise;
      this.logger.log(`Successfully created and connected client for server ID: ${serverId}`);
      this.clients.set(serverId, client);
      return client;
    } catch (error) {
      this.logger.error(`Failed to create client for server ID: ${serverId}. Error: ${error.message}`, error.stack);
      this.connectionPromises.delete(serverId); // Ensure promise is removed on failure
      throw error; // Re-throw the error
    } finally {
      this.logger.debug(`Deleting connection promise for server ID: ${serverId} (if exists).`);
      this.connectionPromises.delete(serverId);
    }
  }

  private async createClient(serverId: number): Promise<MqttClient> {
    this.logger.debug(`Creating new MQTT client connection for server ID: ${serverId}`);
    const server = await this.mqttServerRepository.findOneBy({ id: serverId });

    if (!server) {
      this.logger.error(`MQTT server configuration with ID ${serverId} not found in database.`);
      throw new Error(`MQTT server with ID ${serverId} not found`);
    }

    // Register server with monitoring service
    this.monitoringService.registerServer(serverId);
    // Record connection attempt
    this.monitoringService.onConnectAttempt(serverId);

    return new Promise((resolve, reject) => {
      const url = `${server.useTls ? 'mqtts' : 'mqtt'}://${server.host}:${server.port}`;

      const options: mqtt.IClientOptions = {
        clientId: server.clientId || `attraccess-api-${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 10000, // Set connection timeout in options
      };

      if (server.username) {
        options.username = server.username;
      }

      if (server.password) {
        options.password = server.password;
      }

      // Log connection options (excluding sensitive info like password)
      const loggableOptions = { ...options };
      delete loggableOptions.password;
      this.logger.debug(`Attempting to connect to ${url} with options: ${JSON.stringify(loggableOptions)}`);

      const client = mqtt.connect(url, options);

      client.on('connect', () => {
        this.logger.log(`Connected to MQTT server ${server.name} (${url})`);
        this.monitoringService.onConnectSuccess(serverId);
        resolve(client);
      });

      client.on('error', (error) => {
        this.logger.error(
          `MQTT connection error for server ${server.name} (${serverId}): ${error.message}`,
          error.stack // Include stack trace for errors
        );
        this.monitoringService.onConnectFailure(serverId, error.message);
        // Don't reject as the client will try to reconnect
      });

      client.on('reconnect', () => {
        this.logger.log(`Reconnecting to MQTT server ${server.name} (${serverId})`);
        this.monitoringService.onConnectAttempt(serverId);
      });

      client.on('disconnect', () => {
        this.logger.log(`Disconnected from MQTT server ${server.name} (${serverId})`);
        this.monitoringService.onDisconnect(serverId);
      });

      client.on('offline', () => {
        this.logger.log(`MQTT client for server ${server.name} (${serverId}) is offline`);
        this.monitoringService.onDisconnect(serverId);
      });

      // Reject if the 'error' event provides a specific connection-refused type error before timeout
      client.once('error', (error) => {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
          const errorMsg = `Connection failed immediately for MQTT server ${server.name} (${serverId}): ${error.message}`;
          this.logger.error(errorMsg, error.stack);
          this.monitoringService.onConnectFailure(serverId, errorMsg);
          client.end(true); // Close the client immediately
          reject(error); // Reject the promise
        }
        // Other errors are handled by the persistent 'error' handler
      });

      // Timeout is handled by connectTimeout option. If it fails, 'error' should trigger.
      // Handle the case where the client closes unexpectedly during connection attempt
      client.once('close', () => {
        if (!client.connected) {
          const errorMsg = `MQTT client for server ${server.name} (${serverId}) closed unexpectedly during connection attempt.`;
          this.logger.error(errorMsg);
          this.monitoringService.onConnectFailure(serverId, errorMsg);
          reject(new Error(errorMsg));
        }
      });
    });
  }

  async publish(serverId: number, topic: string, message: string): Promise<void> {
    this.logger.debug(`Attempting to publish to server ${serverId}, topic: ${topic}`);
    try {
      const client = await this.getOrCreateClient(serverId);
      return new Promise((resolve, reject) => {
        client.publish(topic, message, (error) => {
          if (error) {
            this.logger.error(`Failed to publish to server ${serverId}, topic ${topic}: ${error.message}`, error.stack);
            this.monitoringService.onPublishFailure(serverId, error.message);
            reject(error);
          } else {
            this.logger.log(`Successfully published to server ${serverId}, topic ${topic}`); // Changed from debug to log for success
            this.monitoringService.onPublishSuccess(serverId);
            resolve();
          }
        });
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to publish to MQTT server ${serverId}, topic ${topic}. Error during client retrieval or publish setup: ${errorMsg}`,
        error.stack
      );
      this.monitoringService.onPublishFailure(serverId, errorMsg);
      throw error;
    }
  }

  async testConnection(serverId: number): Promise<TestConnectionResponseDto> {
    this.logger.debug(`Attempting to test connection for server ID: ${serverId}`);
    try {
      // getOrCreateClient will attempt connection and throw if fails
      await this.getOrCreateClient(serverId);
      const healthStatus = this.monitoringService.getConnectionHealthStatus(serverId);
      this.logger.log(
        `Connection test successful for server ID: ${serverId}. Health: ${
          healthStatus.healthy ? 'Healthy' : 'Unhealthy'
        }`
      );
      return {
        success: true,
        message: `Connection successful. ${healthStatus.details}`,
      };
    } catch (error) {
      this.logger.error(`Connection test failed for server ID: ${serverId}. Error: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
      };
    }
  }

  async getStatusOfOne(serverId: number): Promise<MqttServerStatusDto> {
    this.logger.debug(`Getting status for server ID: ${serverId}`);
    const client = this.clients.get(serverId);
    const connected = client?.connected || false;
    const healthStatus = this.monitoringService.getConnectionHealthStatus(serverId);

    return {
      connected,
      healthStatus,
      stats: {
        connection: this.monitoringService.getConnectionStats(serverId),
        messages: this.monitoringService.getMessageStats(serverId),
      },
    };
  }

  async getStatusOfAll(): Promise<Record<string, MqttServerStatusDto>> {
    this.logger.debug(`Getting status for all registered MQTT servers`);
    const result: Record<string, MqttServerStatusDto> = {};
    const allStats = this.monitoringService.getAllServerStats();

    for (const [serverId, stats] of Object.entries(allStats)) {
      const id = Number(serverId);
      const client = this.clients.get(id);
      const connected = client?.connected || false;
      const healthStatus = this.monitoringService.getConnectionHealthStatus(id);

      result[serverId] = {
        connected,
        healthStatus,
        stats,
      };
    }

    return result;
  }
}

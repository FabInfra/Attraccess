import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ConnectionStats {
  connected: boolean;
  lastConnectTime?: Date;
  lastDisconnectTime?: Date;
  connectionAttempts: number;
  connectionFailures: number;
  connectionSuccesses: number;
}

interface MessageStats {
  published: number;
  failed: number;
  lastPublishTime?: Date;
  lastFailureTime?: Date;
}

@Injectable()
export class MqttMonitoringService {
  private readonly logger = new Logger(MqttMonitoringService.name);
  private connections: Map<number, ConnectionStats> = new Map();
  private messages: Map<number, MessageStats> = new Map();
  private readonly isDebugMode: boolean;

  constructor(private configService: ConfigService) {
    this.isDebugMode = this.configService.get<boolean>('DEBUG_MODE') || false;
  }

  // Connection monitoring
  registerServer(serverId: number): void {
    if (!this.connections.has(serverId)) {
      this.logger.log(`Registering new MQTT server for monitoring: ID ${serverId}`);
      this.connections.set(serverId, {
        connected: false,
        connectionAttempts: 0,
        connectionFailures: 0,
        connectionSuccesses: 0,
      });
      this.messages.set(serverId, {
        published: 0,
        failed: 0,
      });
    }
  }

  onConnectAttempt(serverId: number): void {
    const stats = this.getConnectionStats(serverId);
    stats.connectionAttempts++;
    this.connections.set(serverId, stats);
  }

  onConnectSuccess(serverId: number): void {
    const stats = this.getConnectionStats(serverId);
    stats.connected = true;
    stats.lastConnectTime = new Date();
    stats.connectionSuccesses++;
    this.connections.set(serverId, stats);

    if (this.isDebugMode) {
      this.logger.debug(`MQTT Server ${serverId} connected. Stats: ${JSON.stringify(stats)}`);
    }
  }

  onConnectFailure(serverId: number, error: string): void {
    const stats = this.getConnectionStats(serverId);
    stats.connected = false;
    stats.lastDisconnectTime = new Date();
    stats.connectionFailures++;
    this.connections.set(serverId, stats);

    this.logger.warn(`MQTT Server ${serverId} connection failed: ${error}. Stats: ${JSON.stringify(stats)}`);
  }

  onDisconnect(serverId: number): void {
    const stats = this.getConnectionStats(serverId);
    stats.connected = false;
    stats.lastDisconnectTime = new Date();
    this.connections.set(serverId, stats);

    this.logger.log(`MQTT Server ${serverId} disconnected.`);
  }

  // Message monitoring
  onPublishSuccess(serverId: number): void {
    const stats = this.getMessageStats(serverId);
    stats.published++;
    stats.lastPublishTime = new Date();
    this.messages.set(serverId, stats);

    if (this.isDebugMode) {
      this.logger.debug(`Message published to server ${serverId}. Total: ${stats.published}`);
    }
  }

  onPublishFailure(serverId: number, error: string): void {
    const stats = this.getMessageStats(serverId);
    stats.failed++;
    stats.lastFailureTime = new Date();
    this.messages.set(serverId, stats);

    this.logger.warn(`Message publish failed to server ${serverId}: ${error}. Total failures: ${stats.failed}`);
  }

  // Get status information
  getConnectionStats(serverId: number): ConnectionStats {
    this.logger.debug(`Getting connection stats for server ID: ${serverId}`);
    return (
      this.connections.get(serverId) || {
        connected: false,
        connectionAttempts: 0,
        connectionFailures: 0,
        connectionSuccesses: 0,
      }
    );
  }

  getMessageStats(serverId: number): MessageStats {
    this.logger.debug(`Getting message stats for server ID: ${serverId}`);
    return (
      this.messages.get(serverId) || {
        published: 0,
        failed: 0,
      }
    );
  }

  getAllServerStats(): Record<number, { connection: ConnectionStats; messages: MessageStats }> {
    this.logger.debug(`Getting all server stats`);
    const result: Record<number, { connection: ConnectionStats; messages: MessageStats }> = {};

    this.connections.forEach((connectionStats, serverId) => {
      result[serverId] = {
        connection: connectionStats,
        messages: this.getMessageStats(serverId),
      };
    });

    return result;
  }

  getConnectionHealthStatus(serverId: number): {
    healthy: boolean;
    details: string;
  } {
    this.logger.debug(`Getting connection health status for server ID: ${serverId}`);
    const stats = this.getConnectionStats(serverId);
    const messageStats = this.getMessageStats(serverId);

    // Simple health check based on connection status and failure rate
    const isHealthy = stats.connected && stats.connectionFailures / (stats.connectionAttempts || 1) < 0.3;

    return {
      healthy: isHealthy,
      details: `Connected: ${stats.connected}, Failures: ${stats.connectionFailures}/${stats.connectionAttempts}, Messages: ${messageStats.published} sent, ${messageStats.failed} failed`,
    };
  }

  // Clear stats for a server (when deleted)
  clearServerStats(serverId: number): void {
    this.logger.log(`Clearing stats for server ID: ${serverId}`);
    this.connections.delete(serverId);
    this.messages.delete(serverId);
  }
}

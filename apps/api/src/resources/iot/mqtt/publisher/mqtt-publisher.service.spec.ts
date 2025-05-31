import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttResourceConfig, Resource, User } from '@attraccess/database-entities';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttClientService } from '../../../../mqtt/mqtt-client.service';
import { ResourceUsageStartedEvent, ResourceUsageEndedEvent } from '../../../usage/events/resource-usage.events';
import { IotService } from '../../iot.service';

describe('MqttPublisherService', () => {
  let service: MqttPublisherService;
  let mockMqttClientService: Partial<MqttClientService>;
  let mockMqttResourceConfigRepository: Partial<Repository<MqttResourceConfig>>;
  let mockResourceRepository: Partial<Repository<Resource>>;
  let mockConfigService: Partial<ConfigService>;
  let mockIotService: Partial<IotService>;

  const mockConfig = {
    resourceId: 1,
    serverId: 2,
    inUseTopic: 'resources/{{id}}/status',
    inUseMessage: '{"status":"in_use","resourceId":{{id}},"resourceName":"{{name}}"}',
    notInUseTopic: 'resources/{{id}}/status',
    notInUseMessage: '{"status":"not_in_use","resourceId":{{id}},"resourceName":"{{name}}"}',
    server: { id: 2, name: 'Test Server' },
    sendOnStart: true,
    sendOnStop: true,
    sendOnTakeover: false,
    takeoverTopic: 'resources/{{id}}/takeover',
    takeoverMessage: '{"status":"takeover"}',
  };

  const mockConfig2 = {
    resourceId: 1,
    serverId: 3,
    inUseTopic: 'devices/{{id}}/status',
    inUseMessage: '{"state":"active","id":{{id}},"name":"{{name}}"}',
    notInUseTopic: 'devices/{{id}}/status',
    notInUseMessage: '{"state":"inactive","id":{{id}},"name":"{{name}}"}',
    server: { id: 3, name: 'Second Test Server' },
    sendOnStart: true,
    sendOnStop: true,
    sendOnTakeover: false,
    takeoverTopic: 'devices/{{id}}/takeover',
    takeoverMessage: '{"status":"takeover"}',
  };

  const mockResource = {
    id: 1,
    name: 'Test Resource',
  };

  beforeEach(async () => {
    mockMqttClientService = {
      publish: jest.fn().mockResolvedValue(undefined),
      getStatusOfOne: jest.fn().mockResolvedValue({ connected: true }),
    };

    mockMqttResourceConfigRepository = {
      findOne: jest.fn().mockResolvedValue(mockConfig),
      find: jest.fn().mockResolvedValue([mockConfig, mockConfig2]),
    };

    mockResourceRepository = {
      findOne: jest.fn().mockResolvedValue(mockResource),
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key, defaultValue) => {
        if (key === 'MQTT_MAX_RETRIES') return 3;
        if (key === 'MQTT_RETRY_DELAY_MS') return 5000;
        if (key === 'DEBUG_MODE') return false;
        return defaultValue;
      }),
    };

    mockIotService = {
      processTemplate: jest.fn().mockImplementation((template, context) => {
        // Simple template processing for tests - replace {{id}} and {{name}}
        return template.replace(/\{\{id\}\}/g, context.id.toString()).replace(/\{\{name\}\}/g, context.name);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MqttPublisherService,
        {
          provide: MqttClientService,
          useValue: mockMqttClientService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(MqttResourceConfig),
          useValue: mockMqttResourceConfigRepository,
        },
        {
          provide: getRepositoryToken(Resource),
          useValue: mockResourceRepository,
        },
        {
          provide: IotService,
          useValue: mockIotService,
        },
      ],
    }).compile();

    service = module.get<MqttPublisherService>(MqttPublisherService);

    // Mock logger to prevent console output during tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {
      /* empty function */
    });
    jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {
      /* empty function */
    });
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {
      /* empty function */
    });
    jest.spyOn(console, 'error').mockImplementation(() => {
      /* empty function */
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleResourceUsageStarted', () => {
    it('should publish messages to all configured servers when resource usage starts', async () => {
      const event = new ResourceUsageStartedEvent(1, new Date(), { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageStarted(event);

      expect(mockMqttResourceConfigRepository.find).toHaveBeenCalledWith({
        where: { resourceId: 1 },
        relations: ['server'],
      });

      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      // Verify first config was published
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        2, // serverId for first config
        'resources/1/status', // processed topic
        expect.stringContaining('"status":"in_use"') // processed message
      );

      // Verify second config was published
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        3, // serverId for second config
        'devices/1/status', // processed topic
        expect.stringContaining('"state":"active"') // processed message
      );

      // Ensure publish was called twice for both configs
      expect(mockMqttClientService.publish).toHaveBeenCalledTimes(2);
    });

    it('should not publish any messages if no configs are found', async () => {
      mockMqttResourceConfigRepository.find = jest.fn().mockResolvedValue([]);

      const event = new ResourceUsageStartedEvent(999, new Date(), { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageStarted(event);

      expect(mockMqttClientService.publish).not.toHaveBeenCalled();
    });

    it('should not publish messages if resource is not found', async () => {
      mockResourceRepository.findOne = jest.fn().mockResolvedValue(null);

      const event = new ResourceUsageStartedEvent(1, new Date(), { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageStarted(event);

      expect(mockMqttClientService.publish).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully for individual configs', async () => {
      // Mock the publish method to throw an error
      mockMqttClientService.publish = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new Error('Publish error')))
        .mockImplementationOnce(() => Promise.resolve());

      const event = new ResourceUsageStartedEvent(1, new Date(), { id: 123, username: 'testuser' } as User);

      // The method should not throw an exception even if one publish fails
      await expect(service.handleResourceUsageStarted(event)).resolves.not.toThrow();

      // Verify both publishes were attempted
      expect(mockMqttClientService.publish).toHaveBeenCalledTimes(2);
    });

    it('should process templates correctly for each config', async () => {
      const customResource = { id: 42, name: 'Custom Resource Name' };
      mockResourceRepository.findOne = jest.fn().mockResolvedValue(customResource);

      const event = new ResourceUsageStartedEvent(42, new Date(), { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageStarted(event);

      // Check that the template for first config was processed correctly
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        2,
        'resources/42/status',
        expect.stringContaining('"resourceName":"Custom Resource Name"')
      );

      // Check that the template for second config was processed correctly
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        3,
        'devices/42/status',
        expect.stringContaining('"name":"Custom Resource Name"')
      );
    });

    it('should queue messages for retry when server is disconnected', async () => {
      // Mock server status to be disconnected
      mockMqttClientService.getStatusOfOne = jest.fn().mockResolvedValue({ connected: false });
      mockMqttClientService.publish = jest.fn().mockRejectedValue(new Error('Server disconnected'));

      const event = new ResourceUsageStartedEvent(1, new Date(), { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageStarted(event);

      // Check that publish was attempted
      expect(mockMqttClientService.publish).toHaveBeenCalledTimes(2);

      // We can't directly test the queue as it's private, but we can verify logger was called
      expect(Logger.prototype.warn).toHaveBeenCalled();
    });
  });

  describe('handleResourceUsageEnded', () => {
    it('should publish messages to all configured servers when resource usage ends', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000); // 1 hour later
      const event = new ResourceUsageEndedEvent(1, startTime, endTime, { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageEnded(event);

      expect(mockMqttResourceConfigRepository.find).toHaveBeenCalledWith({
        where: { resourceId: 1 },
        relations: ['server'],
      });

      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      // Verify first config was published
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        2, // serverId for first config
        'resources/1/status', // processed topic
        expect.stringContaining('"status":"not_in_use"') // processed message
      );

      // Verify second config was published
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        3, // serverId for second config
        'devices/1/status', // processed topic
        expect.stringContaining('"state":"inactive"') // processed message
      );

      // Ensure publish was called twice for both configs
      expect(mockMqttClientService.publish).toHaveBeenCalledTimes(2);
    });

    it('should not publish any messages if no configs are found', async () => {
      mockMqttResourceConfigRepository.find = jest.fn().mockResolvedValue([]);

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);
      const event = new ResourceUsageEndedEvent(999, startTime, endTime, { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageEnded(event);

      expect(mockMqttClientService.publish).not.toHaveBeenCalled();
    });

    it('should process templates correctly for each config on usage end', async () => {
      const customResource = { id: 42, name: 'Custom Resource Name' };
      mockResourceRepository.findOne = jest.fn().mockResolvedValue(customResource);

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);
      const event = new ResourceUsageEndedEvent(42, startTime, endTime, { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageEnded(event);

      // Check that the template for first config was processed correctly
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        2,
        'resources/42/status',
        expect.stringContaining('"resourceName":"Custom Resource Name"')
      );

      // Check that the template for second config was processed correctly
      expect(mockMqttClientService.publish).toHaveBeenCalledWith(
        3,
        'devices/42/status',
        expect.stringContaining('"name":"Custom Resource Name"')
      );
    });
  });

  describe('retry mechanism', () => {
    it('should handle server reconnection scenarios', async () => {
      // First attempt: server disconnected
      mockMqttClientService.getStatusOfOne = jest.fn().mockResolvedValueOnce({ connected: false });
      mockMqttClientService.publish = jest
        .fn()
        .mockRejectedValueOnce(new Error('Server disconnected'))
        // Second attempt: server connected
        .mockResolvedValueOnce(undefined);

      const event = new ResourceUsageStartedEvent(1, new Date(), { id: 123, username: 'testuser' } as User);

      await service.handleResourceUsageStarted(event);

      // Initial publish attempts
      expect(mockMqttClientService.publish).toHaveBeenCalledTimes(2);

      // We can't directly test the queue processing as it runs on an interval,
      // but we can document this limitation in the test
      expect(Logger.prototype.warn).toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resource, DocumentationType } from '@attraccess/database-entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateResourceDto } from './dtos/createResource.dto';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { ResourceNotFoundException } from '../exceptions/resource.notFound.exception';
import { ResourceImageService } from './resourceImage.service';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let resourceRepository: jest.Mocked<Repository<Resource>>;
  // ResourceImageService is injected but not directly used in these tests

  const mockResourceRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getSql: jest.fn().mockReturnValue('SELECT * FROM resource'),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getOne: jest.fn(),
    })),
  });

  const mockResourceImageService = {
    saveImage: jest.fn(),
    deleteImage: jest.fn(),
    getPublicPath: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: getRepositoryToken(Resource),
          useFactory: mockResourceRepository,
        },
        {
          provide: ResourceImageService,
          useValue: mockResourceImageService,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    resourceRepository = module.get(getRepositoryToken(Resource)) as jest.Mocked<Repository<Resource>>;
    // ResourceImageService is available but not directly used in tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listResources', () => {
    it('should return paginated resources', async () => {
      const mockResources = [
        {
          id: 1,
          name: 'Resource 1',
          description: 'Description 1',
          imageFilename: null,
          documentationType: DocumentationType.MARKDOWN,
          documentationMarkdown: '# Documentation 1',
          documentationUrl: null,
          allowTakeOver: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          introductions: [],
          usages: [],
          introducers: [],
          mqttConfigs: [],
          webhookConfigs: [],
          groups: [],
        },
        {
          id: 2,
          name: 'Resource 2',
          description: 'Description 2',
          imageFilename: null,
          documentationType: DocumentationType.URL,
          documentationMarkdown: null,
          documentationUrl: 'https://example.com',
          allowTakeOver: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          introductions: [],
          usages: [],
          introducers: [],
          mqttConfigs: [],
          webhookConfigs: [],
          groups: [],
        },
      ];

      // Mock the query builder chain to return the expected results
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getSql: jest.fn().mockReturnValue('SELECT * FROM resource'),
        getManyAndCount: jest.fn().mockResolvedValue([mockResources, 2]),
        getOne: jest.fn(),
      } as unknown as SelectQueryBuilder<Resource>;

      resourceRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.listResources({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockResources);
      expect(result.total).toEqual(2);
      expect(result.page).toEqual(1);
      expect(result.limit).toEqual(10);
      expect(resourceRepository.createQueryBuilder).toHaveBeenCalledWith('resource');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('resource.groups', 'groups');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('resource.createdAt', 'DESC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('getResourceById', () => {
    it('should return a resource by id', async () => {
      const mockResource = {
        id: 1,
        name: 'Resource 1',
        description: 'Description 1',
        imageFilename: null,
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# Documentation 1',
        documentationUrl: null,
        allowTakeOver: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: [],
      };

      resourceRepository.find.mockResolvedValue([mockResource]);

      const result = await service.getResourceById(1);

      expect(result).toEqual(mockResource);
      expect(resourceRepository.find).toHaveBeenCalledWith({
        where: { id: expect.anything() },
        relations: ['introductions', 'usages', 'groups'],
      });
    });

    it('should throw ResourceNotFoundException if resource not found', async () => {
      resourceRepository.find.mockResolvedValue([]);

      await expect(service.getResourceById(999)).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('createResource', () => {
    it('should create a new resource', async () => {
      const createDto: CreateResourceDto = {
        name: 'New Resource',
        description: 'New Description',
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# New Documentation',
        documentationUrl: null,
        allowTakeOver: false,
      };

      const newResource = {
        id: 1,
        name: createDto.name,
        description: createDto.description,
        imageFilename: null,
        documentationType: createDto.documentationType,
        documentationMarkdown: createDto.documentationMarkdown,
        documentationUrl: createDto.documentationUrl,
        allowTakeOver: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: [],
      };

      resourceRepository.create.mockReturnValue(newResource);
      resourceRepository.save.mockResolvedValue(newResource);

      const result = await service.createResource(createDto);

      expect(result).toEqual(newResource);
      expect(resourceRepository.create).toHaveBeenCalledWith({
        name: createDto.name,
        description: createDto.description,
        documentationType: createDto.documentationType || null,
        documentationMarkdown: createDto.documentationMarkdown || null,
        documentationUrl: createDto.documentationUrl || null,
        allowTakeOver: createDto.allowTakeOver || false,
      });
      expect(resourceRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateResource', () => {
    it('should update an existing resource', async () => {
      const resourceId = 1;
      const updateDto: UpdateResourceDto = {
        name: 'Updated Resource',
        description: 'Updated Description',
        documentationType: DocumentationType.URL,
        documentationUrl: 'https://example.com/updated',
      };

      const existingResource = {
        id: resourceId,
        name: 'Old Resource',
        description: 'Old Description',
        imageFilename: null,
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# Old Documentation',
        documentationUrl: null,
        allowTakeOver: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: [],
      };

      const updatedResource = {
        ...existingResource,
        name: updateDto.name,
        description: updateDto.description,
        documentationType: updateDto.documentationType,
        documentationMarkdown: null,
        documentationUrl: updateDto.documentationUrl,
      };

      jest.spyOn(service, 'getResourceById').mockResolvedValue(existingResource);
      resourceRepository.save.mockResolvedValue(updatedResource);

      const result = await service.updateResource(resourceId, updateDto);

      expect(result).toEqual(updatedResource);
      expect(service.getResourceById).toHaveBeenCalledWith(resourceId);
      expect(resourceRepository.save).toHaveBeenCalled();
    });

    it('should throw ResourceNotFoundException if resource not found', async () => {
      const resourceId = 999;
      const updateDto: UpdateResourceDto = {
        name: 'Updated Resource',
      };

      jest.spyOn(service, 'getResourceById').mockRejectedValue(new ResourceNotFoundException(resourceId));

      await expect(service.updateResource(resourceId, updateDto)).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource', async () => {
      const mockResource = {
        id: 1,
        name: 'Resource 1',
        description: 'Description 1',
        imageFilename: null,
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# Documentation 1',
        documentationUrl: null,
        allowTakeOver: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: [],
      };

      resourceRepository.find.mockResolvedValue([mockResource]);
      resourceRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.deleteResource(1);

      expect(resourceRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw ResourceNotFoundException if resource not found', async () => {
      resourceRepository.find.mockResolvedValue([]);

      await expect(service.deleteResource(999)).rejects.toThrow(ResourceNotFoundException);
    });
  });
});

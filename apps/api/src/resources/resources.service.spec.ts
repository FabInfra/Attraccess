import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resource, DocumentationType } from '@attraccess/database-entities';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dtos/createResource.dto';
import { UpdateResourceDto } from './dtos/updateResource.dto';
import { ResourceNotFoundException } from '../exceptions/resource.notFound.exception';
import { ResourceImageService } from '../common/services/resource-image.service';
import { ResourceGroupsService } from './groups/resourceGroups.service';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let resourceRepository: jest.Mocked<Repository<Resource>>;
  // ResourceImageService is injected but not directly used in these tests
  let resourceGroupsService: jest.Mocked<ResourceGroupsService>;

  const mockResourceRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  });

  const mockResourceImageService = {
    saveImage: jest.fn(),
    deleteImage: jest.fn(),
    getPublicPath: jest.fn(),
  };

  const mockResourceGroupsService = {
    addResourceToGroup: jest.fn(),
    removeResourceFromGroup: jest.fn(),
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
        {
          provide: ResourceGroupsService,
          useValue: mockResourceGroupsService,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    resourceRepository = module.get(getRepositoryToken(Resource)) as jest.Mocked<
      Repository<Resource>
    >;
    // ResourceImageService is available but not directly used in tests
    resourceGroupsService = module.get(ResourceGroupsService) as jest.Mocked<ResourceGroupsService>;
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
          createdAt: new Date(),
          updatedAt: new Date(),
          introductions: [],
          usages: [],
          introducers: [],
          mqttConfigs: [],
          webhookConfigs: [],
          groups: []
        },
        {
          id: 2,
          name: 'Resource 2',
          description: 'Description 2',
          imageFilename: null,
          documentationType: DocumentationType.URL,
          documentationMarkdown: null,
          documentationUrl: 'https://example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          introductions: [],
          usages: [],
          introducers: [],
          mqttConfigs: [],
          webhookConfigs: [],
          groups: []
        },
      ];

      resourceRepository.findAndCount.mockResolvedValue([mockResources, 2]);

      const result = await service.listResources({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockResources);
      expect(result.total).toEqual(2);
      expect(result.page).toEqual(1);
      expect(result.limit).toEqual(10);
      expect(resourceRepository.findAndCount).toHaveBeenCalled();
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
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: []
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

      await expect(service.getResourceById(999)).rejects.toThrow(
        ResourceNotFoundException,
      );
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
      };

      const newResource = {
        id: 1,
        name: createDto.name,
        description: createDto.description,
        imageFilename: null,
        documentationType: createDto.documentationType,
        documentationMarkdown: createDto.documentationMarkdown,
        documentationUrl: createDto.documentationUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: []
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
        documentationUrl: createDto.documentationUrl || null
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
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: []
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

      jest
        .spyOn(service, 'getResourceById')
        .mockRejectedValue(new ResourceNotFoundException(resourceId));

      await expect(
        service.updateResource(resourceId, updateDto),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource', async () => {
      const resourceId = 1;
      const mockResource = {
        id: resourceId,
        name: 'Resource to delete',
        description: 'Description',
        imageFilename: null,
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# Documentation',
        documentationUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: []
      };

      jest.spyOn(service, 'getResourceById').mockResolvedValue(mockResource);
      resourceRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.deleteResource(resourceId);

      expect(service.getResourceById).toHaveBeenCalledWith(resourceId);
      expect(resourceRepository.delete).toHaveBeenCalledWith(resourceId);
    });

    it('should throw ResourceNotFoundException if resource not found', async () => {
      const resourceId = 999;

      jest
        .spyOn(service, 'getResourceById')
        .mockRejectedValue(new ResourceNotFoundException(resourceId));

      await expect(service.deleteResource(resourceId)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe('addResourceToGroup', () => {
    it('should add a resource to a group', async () => {
      const resourceId = 1;
      const groupId = 2;
      const mockResource = {
        id: resourceId,
        name: 'Resource',
        description: 'Description',
        imageFilename: null,
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# Documentation',
        documentationUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: []
      };

      jest.spyOn(service, 'getResourceById').mockResolvedValue(mockResource);
      resourceGroupsService.addResourceToGroup.mockResolvedValue(undefined);

      await service.addResourceToGroup(resourceId, groupId);

      expect(service.getResourceById).toHaveBeenCalledWith(resourceId);
      expect(resourceGroupsService.addResourceToGroup).toHaveBeenCalledWith(resourceId, groupId);
    });
  });

  describe('removeResourceFromGroup', () => {
    it('should remove a resource from a group', async () => {
      const resourceId = 1;
      const groupId = 2;
      const mockResource = {
        id: resourceId,
        name: 'Resource',
        description: 'Description',
        imageFilename: null,
        documentationType: DocumentationType.MARKDOWN,
        documentationMarkdown: '# Documentation',
        documentationUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        introductions: [],
        usages: [],
        introducers: [],
        mqttConfigs: [],
        webhookConfigs: [],
        groups: []
      };

      jest.spyOn(service, 'getResourceById').mockResolvedValue(mockResource);
      resourceGroupsService.removeResourceFromGroup.mockResolvedValue(undefined);

      await service.removeResourceFromGroup(resourceId, groupId);

      expect(service.getResourceById).toHaveBeenCalledWith(resourceId);
      expect(resourceGroupsService.removeResourceFromGroup).toHaveBeenCalledWith(resourceId, groupId);
    });
  });
});

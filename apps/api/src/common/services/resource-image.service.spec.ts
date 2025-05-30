import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ResourceImageService } from './resource-image.service';
import { FileStorageService } from './file-storage.service';
import { FileUpload } from '../types/file-upload.types';
import * as path from 'path';

jest.mock('path');

describe('ResourceImageService', () => {
  let service: ResourceImageService;
  let fileStorageService: jest.Mocked<FileStorageService>;
  let configService: jest.Mocked<ConfigService>;

  const mockStorageConfig = {
    cdn: {
      root: '/fake/storage/path',
      serveRoot: '/cdn',
    },
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
  };

  const mockFileStorageService = {
    saveFile: jest.fn(),
    deleteFile: jest.fn(),
    getFilePath: jest.fn(),
    getPublicPath: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'storage') return mockStorageConfig;
      return undefined;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceImageService,
        {
          provide: FileStorageService,
          useValue: mockFileStorageService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ResourceImageService>(ResourceImageService);
    fileStorageService = module.get(FileStorageService) as jest.Mocked<FileStorageService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if storage config is not found', () => {
    configService.get.mockReturnValueOnce(undefined);

    expect(() => {
      new ResourceImageService(fileStorageService, configService);
    }).toThrow('Storage configuration not found');
  });

  describe('saveImage', () => {
    it('should call fileStorageService.saveFile with correct parameters', async () => {
      const resourceId = 123;
      const mockFile: FileUpload = {
        fieldname: 'image',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('fake image data'),
        size: 1024,
      };
      const expectedSubDirectory = 'resources/123/original';
      const expectedFilename = 'new-filename.jpg';

      fileStorageService.saveFile.mockResolvedValueOnce(expectedFilename);

      const result = await service.saveImage(resourceId, mockFile);

      expect(fileStorageService.saveFile).toHaveBeenCalledWith(mockFile, expectedSubDirectory);
      expect(result).toBe(expectedFilename);
    });
  });

  describe('deleteImage', () => {
    it('should call fileStorageService.deleteFile with correct parameters', async () => {
      const resourceId = 123;
      const filename = 'image-to-delete.jpg';
      const expectedSubDirectory = 'resources/123/original';

      await service.deleteImage(resourceId, filename);

      expect(fileStorageService.deleteFile).toHaveBeenCalledWith(expectedSubDirectory, filename);
    });
  });

  describe('getImagePath', () => {
    it('should call fileStorageService.getFilePath with correct parameters', async () => {
      const resourceId = 123;
      const filename = 'test-image.jpg';
      const expectedSubDirectory = 'resources/123/original';
      const expectedPath = '/fake/storage/path/resources/123/original/test-image.jpg';

      fileStorageService.getFilePath.mockResolvedValueOnce(expectedPath);

      const result = await service.getImagePath(resourceId, filename);

      expect(fileStorageService.getFilePath).toHaveBeenCalledWith(expectedSubDirectory, filename);
      expect(result).toBe(expectedPath);
    });
  });

  describe('getPublicPath', () => {
    it('should call fileStorageService.getPublicPath with correct parameters', () => {
      const resourceId = 123;
      const filename = 'test-image.jpg';
      const expectedSubDirectory = 'resources/123/original';
      const expectedPublicPath = '/cdn/resources/123/original/test-image.jpg';

      fileStorageService.getPublicPath.mockReturnValueOnce(expectedPublicPath);

      const result = service.getPublicPath(resourceId, filename);

      expect(fileStorageService.getPublicPath).toHaveBeenCalledWith(expectedSubDirectory, filename);
      expect(result).toBe(expectedPublicPath);
    });

    it('should return null if filename is null', () => {
      const resourceId = 123;
      const filename = null;

      const result = service.getPublicPath(resourceId, filename);

      expect(fileStorageService.getPublicPath).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});

import { Injectable, Logger } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileUpload } from '../types/file-upload.types';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from '../../config/storage.config';
import * as path from 'path';

@Injectable()
export class ResourceImageService {
  private readonly logger = new Logger(ResourceImageService.name);
  private readonly config: StorageConfig;

  constructor(private readonly fileStorageService: FileStorageService, private readonly configService: ConfigService) {
    this.config = this.configService.get<StorageConfig>('storage');
  }

  private getResourceSubDirectory(resourceId: number): string {
    return path.join('resources', resourceId.toString(), 'original');
  }

  async saveImage(resourceId: number, file: FileUpload): Promise<string> {
    this.logger.debug(`Saving image for resource ID: ${resourceId}, original filename: ${file.originalname}`);
    const subDirectory = this.getResourceSubDirectory(resourceId);
    const savedFilename = await this.fileStorageService.saveFile(file, subDirectory);
    this.logger.debug(`Image saved for resource ID: ${resourceId}, saved filename: ${savedFilename}`);
    return savedFilename;
  }

  async deleteImage(resourceId: number, filename: string): Promise<void> {
    this.logger.debug(`Deleting image for resource ID: ${resourceId}, filename: ${filename}`);
    const subDirectory = this.getResourceSubDirectory(resourceId);
    await this.fileStorageService.deleteFile(subDirectory, filename);

    // Clean up any cached versions
    const cachePath = path.join('resources', resourceId.toString());
    this.logger.debug(`Clearing cache for path: ${cachePath}`);
    await this.fileStorageService.clearCache(cachePath);
    this.logger.debug(`Image deleted and cache cleared for resource ID: ${resourceId}, filename: ${filename}`);
  }

  async getImagePath(resourceId: number, filename: string): Promise<string> {
    this.logger.debug(`Getting image path for resource ID: ${resourceId}, filename: ${filename}`);
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.getFilePath(subDirectory, filename);
  }

  getPublicPath(resourceId: number, filename: string): string {
    this.logger.debug(`Getting public path for resource ID: ${resourceId}, filename: ${filename}`);
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.getPublicPath(subDirectory, filename);
  }
}

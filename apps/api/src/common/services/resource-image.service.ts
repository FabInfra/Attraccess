import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from './file-storage.service';
import { FileUpload } from '../types/file-upload.types';
import { StorageConfigType } from '../../config/storage.config';


import * as path from 'path';

@Injectable()
export class ResourceImageService {
  private readonly resourcesDir: string;

  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService,
  ) {
    const storageConfig = this.configService.get<StorageConfigType>('storage');
    if (!storageConfig) {
      throw new Error('Storage configuration not found');
    }
    this.resourcesDir = storageConfig.resources.directory;
  }

  private getResourceSubDirectory(resourceId: number): string {
    return path.join(this.resourcesDir, resourceId.toString(), 'original');
  }

  async saveImage(resourceId: number, file: FileUpload): Promise<string> {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.saveFile(file, subDirectory);
  }

  async deleteImage(resourceId: number, filename: string): Promise<void> {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    await this.fileStorageService.deleteFile(subDirectory, filename);

    // Clean up any cached versions
    await this.fileStorageService.clearCache(
      path.join(this.resourcesDir, resourceId.toString())
    );
  }

  async getImagePath(resourceId: number, filename: string): Promise<string> {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.getFilePath(subDirectory, filename);
  }

  getPublicPath(resourceId: number, filename: string): string {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.getPublicPath(subDirectory, filename);
  }
}

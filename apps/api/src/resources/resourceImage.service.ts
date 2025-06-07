import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from '../common/services/file-storage.service';
import { FileUpload } from '../common/types/file-upload.types';
import { StorageConfigType } from '../config/storage.config';

import * as path from 'path';

@Injectable()
export class ResourceImageService {
  constructor(private readonly fileStorageService: FileStorageService, private readonly configService: ConfigService) {
    const storageConfig = this.configService.get<StorageConfigType>('storage');
    if (!storageConfig) {
      throw new Error('Storage configuration not found');
    }
  }

  private getResourceSubDirectory(resourceId: number): string {
    return path.join('resources', resourceId.toString(), 'original');
  }

  async saveImage(resourceId: number, file: FileUpload): Promise<string> {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.saveFile(file, subDirectory);
  }

  async deleteImage(resourceId: number, filename: string): Promise<void> {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    await this.fileStorageService.deleteFile(subDirectory, filename);
  }

  async getImagePath(resourceId: number, filename: string): Promise<string> {
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.getFilePath(subDirectory, filename);
  }

  getPublicPath(resourceId: number, filename: string | null): string | null {
    if (filename === null) {
      return null;
    }
    const subDirectory = this.getResourceSubDirectory(resourceId);
    return this.fileStorageService.getPublicPath(subDirectory, filename);
  }
}

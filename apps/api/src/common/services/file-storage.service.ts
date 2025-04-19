import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileUploadValidationError } from '../errors/file-upload-validation.error';
import { StorageConfig, AllowedMimeType } from '../../config/storage.config';
import { FileUpload } from '../types/file-upload.types';

class FileNotFoundError extends NotFoundException {
  constructor(filePath: string) {
    super('FileNotFoundError', {
      description: `File with path "${filePath}" not found`,
    });
  }
}

@Injectable()
export class FileStorageService implements OnModuleInit {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly config: StorageConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<StorageConfig>('storage');
  }

  async onModuleInit() {
    await this.ensureStorageDirectories();
  }

  private async ensureStorageDirectories() {
    const directories = [
      this.config.root,
      path.join(this.config.root, 'uploads'),
      path.join(this.config.root, 'cache'),
    ];

    for (const dir of directories) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true, mode: 0o755 });
        this.logger.log(`Created directory: ${dir}`);
      }
    }
  }

  protected generateSecureFilename(originalFilename: string): string {
    const ext = path.extname(originalFilename).toLowerCase();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}_${randomBytes}${ext}`;
  }

  protected async validateFile(
    file: FileUpload,
    options?: { maxSize?: number; allowedTypes?: AllowedMimeType[] }
  ): Promise<void> {
    const maxSize = options?.maxSize ?? this.config.maxFileSize;
    const allowedTypes = options?.allowedTypes ?? this.config.allowedMimeTypes;
    this.logger.debug(
      `Validating file: ${file.originalname}, size: ${file.size}, type: ${
        file.mimetype
      }. Max size: ${maxSize}, Allowed types: ${allowedTypes.join(', ')}`
    );

    // Check file size
    if (file.size > maxSize) {
      const errorMsg = `File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`;
      this.logger.warn(`File validation failed for ${file.originalname}: ${errorMsg}`);
      throw new FileUploadValidationError(errorMsg);
    }

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype as AllowedMimeType)) {
      const errorMsg = `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      this.logger.warn(`File validation failed for ${file.originalname}: ${errorMsg}`);
      throw new FileUploadValidationError(errorMsg);
    }
    this.logger.debug(`File validation successful for ${file.originalname}`);
  }

  async saveFile(file: FileUpload, subDirectory: string): Promise<string> {
    this.logger.debug(
      `Attempting to save file: ${file.originalname} (size: ${file.size}, type: ${file.mimetype}) to subDirectory: ${subDirectory}`
    );
    await this.validateFile(file);

    const secureFilename = this.generateSecureFilename(file.originalname);
    const targetDir = path.join(this.config.root, 'uploads', subDirectory);
    this.logger.debug(`Generated secure filename: ${secureFilename}, Target directory: ${targetDir}`);

    try {
      this.logger.debug(`Ensuring target directory exists: ${targetDir}`);
      await fs.mkdir(targetDir, { recursive: true, mode: 0o755 });
    } catch (error) {
      this.logger.error(`Failed to create directory ${targetDir}: ${error.message}`, error.stack);
      throw error; // Re-throw error after logging
    }

    const filePath = path.join(targetDir, secureFilename);
    try {
      this.logger.debug(`Writing file to path: ${filePath}`);
      await fs.writeFile(filePath, file.buffer, { mode: 0o644 });
      this.logger.log(`Successfully saved file to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to write file to ${filePath}: ${error.message}`, error.stack);
      // Attempt to clean up if write fails?
      throw error; // Re-throw error after logging
    }

    return secureFilename;
  }

  async deleteFile(subDirectory: string, filename: string): Promise<void> {
    const filePath = path.join(this.config.root, 'uploads', subDirectory, filename);
    this.logger.debug(`Attempting to delete file: ${filePath}`);

    try {
      await fs.unlink(filePath);
      this.logger.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(`Attempted to delete non-existent file: ${filePath}`);
        // File already gone, swallow error
      } else {
        this.logger.error(`Error deleting file ${filePath}: ${error.message}`, error.stack);
        throw error;
      }
    }
  }

  async getFilePath(subDirectory: string, filename: string): Promise<string> {
    const filePath = path.join(this.config.root, 'uploads', subDirectory, filename);
    this.logger.debug(`Getting file path for: ${filePath}`);

    try {
      await fs.access(filePath);
      this.logger.debug(`File path exists: ${filePath}`);
      return filePath;
    } catch {
      this.logger.warn(`File not found at path: ${filePath}`);
      throw new FileNotFoundError(filePath); // Use the custom error with path info
    }
  }

  getPublicPath(subDirectory: string, filename: string): string {
    const publicPath = `/storage/uploads/${subDirectory}/${filename}`;
    this.logger.debug(`Getting public path for ${subDirectory}/${filename}: ${publicPath}`);
    return publicPath;
  }

  async clearCache(subDirectory: string): Promise<void> {
    const cacheDir = path.join(this.config.root, 'cache', subDirectory);
    this.logger.debug(`Attempting to clear cache directory: ${cacheDir}`);
    try {
      await fs.rm(cacheDir, { recursive: true, force: true });
      this.logger.log(`Successfully cleared cache directory: ${cacheDir}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(`Attempted to clear non-existent cache directory: ${cacheDir}`);
        // Directory already gone, swallow error
      } else {
        this.logger.error(`Error clearing cache directory ${cacheDir}: ${error.message}`, error.stack);
        throw error;
      }
    }
  }
}

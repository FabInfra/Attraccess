import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileUploadValidationError } from '../errors/file-upload-validation.error';
import { StorageConfigType, AllowedMimeType } from '../../config/storage.config';
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
  private readonly config: StorageConfigType;

  constructor(private readonly configService: ConfigService) {
    const storageConf = this.configService.get<StorageConfigType>('storage');
    if (!storageConf) {
      this.logger.error('Storage configuration not found. FileStorageService may not work correctly.');
      throw new Error("Storage configuration ('storage') not found. Check ConfigModule setup.");
    }
    this.config = storageConf;
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

    // Check file size
    if (file.size > maxSize) {
      throw new FileUploadValidationError(
        `File size exceeds maximum allowed size of ${maxSize} bytes`
      );
    }

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype as AllowedMimeType)) {
      throw new FileUploadValidationError(
        `File type ${
          file.mimetype
        } is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      );
    }
  }

  async saveFile(file: FileUpload, subDirectory: string): Promise<string> {
    await this.validateFile(file);

    const secureFilename = this.generateSecureFilename(file.originalname);
    const targetDir = path.join(this.config.root, 'uploads', subDirectory);

    await fs.mkdir(targetDir, { recursive: true, mode: 0o755 });

    const filePath = path.join(targetDir, secureFilename);
    await fs.writeFile(filePath, file.buffer, { mode: 0o644 });

    return secureFilename;
  }

  async deleteFile(subDirectory: string, filename: string): Promise<void> {
    const filePath = path.join(
      this.config.root,
      'uploads',
      subDirectory,
      filename
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async getFilePath(subDirectory: string, filename: string): Promise<string> {
    const filePath = path.join(
      this.config.root,
      'uploads',
      subDirectory,
      filename
    );

    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw new FileNotFoundError(filename);
    }
  }

  getPublicPath(subDirectory: string, filename: string): string {
    return `/storage/uploads/${subDirectory}/${filename}`;
  }

  async clearCache(subDirectory: string): Promise<void> {
    const cacheDir = path.join(this.config.root, 'cache', subDirectory);
    try {
      await fs.rm(cacheDir, { recursive: true, force: true });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

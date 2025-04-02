import { Module } from '@nestjs/common';
import { ResourceImageService } from '../services/resource-image.service';
import { FileStorageModule } from './file-storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FileStorageModule, ConfigModule],
  providers: [ResourceImageService],
  exports: [ResourceImageService],
})
export class ResourceImageModule {} 
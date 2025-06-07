import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FileStorageService } from '../services/file-storage.service';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}

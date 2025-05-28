import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import storageConfigObject from './storage.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [storageConfigObject],
      // Cache the configuration
      cache: true,
      // Make configuration available everywhere
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}

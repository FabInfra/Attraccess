import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from '@fabaccess/database-entities';
import { SSEController } from './sse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  controllers: [SSEController],
})
export class SSEModule {}

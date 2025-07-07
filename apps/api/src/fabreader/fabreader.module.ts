import { Module } from '@nestjs/common';
import { FabReaderController } from './reader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabreaderService } from './fabreader.service';
import { WebsocketService } from './modules/websockets/websocket.service';
import { FabreaderGateway } from './modules/websockets/websocket.gateway';
import { FabReaderNfcCardsController } from './card.controller';
import 'sqlite3';
import '@nestjs/common';
import { WebSocketEventService } from './modules/websockets/websocket-event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FabReader, NFCCard } from '@fabaccess/database-entities';
import { UsersAndAuthModule } from '../users-and-auth/users-and-auth.module';
import { ResourcesModule } from '../resources/resources.module';
import { ResourceUsageModule } from '../resources/usage/resourceUsage.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([FabReader, NFCCard]),
    UsersAndAuthModule,
    ResourcesModule,
    ResourceUsageModule,
  ],
  providers: [FabreaderService, WebsocketService, FabreaderGateway, WebSocketEventService],
  controllers: [FabReaderController, FabReaderNfcCardsController],
})
export class FabReaderModule {}

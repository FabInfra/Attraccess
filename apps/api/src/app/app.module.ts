import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAndAuthModule } from '../users-and-auth/users-and-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from '../database/datasource';

@Module({
  imports: [UsersAndAuthModule, TypeOrmModule.forRoot(dataSourceConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

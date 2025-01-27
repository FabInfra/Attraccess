import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadEnv } from '@attraccess/env';
import { z } from 'zod';

const dbEnvConfig = loadEnv(
  z.object({
    DB_TYPE: z.enum(['postgres', 'mysql']),
    DB_HOST: z.string(),
    DB_PORT: z
      .string()
      .refine((port) => parseInt(port) > 0 && parseInt(port) < 65536)
      .transform((port) => parseInt(port)),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
  })
);

const dbConfig = {
  type: dbEnvConfig.DB_TYPE,
  host: dbEnvConfig.DB_HOST,
  port: dbEnvConfig.DB_PORT,
  username: dbEnvConfig.DB_USERNAME,
  password: dbEnvConfig.DB_PASSWORD,
  database: dbEnvConfig.DB_DATABASE,
};

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      ...dbConfig,
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadEnv } from '@attraccess/env';

const env = loadEnv((z) => ({
  DB_TYPE: z.enum(['postgres', 'mysql']),
  DB_HOST: z.string(),
  DB_PORT: z
    .string()
    .refine((port) => parseInt(port) > 0 && parseInt(port) < 65536)
    .transform((port) => parseInt(port)),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
}));

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: env.DB_TYPE,
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      synchronize: false,
      autoLoadEntities: true,
      migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

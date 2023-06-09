import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mssql',
    //   host: 'localhost',
    //   port: 1433,
    //   username: 'sa',
    //   password: '123456789',
    //   database: 'DB',
    //   entities: [],
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   logging: true,
    //   extra: {
    //     trustServerCertificate: true,
    //   },
    // }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs'),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    CacheModule.register({
      store: redisStore as unknown as CacheStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

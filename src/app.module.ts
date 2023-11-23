import { CacheModule } from '@nestjs/cache-manager';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from './catalog/catalog.module';
import { ResponseFormatter } from './interceptors/formatter/formatter.interceptor';
import { InventoryModule } from './inventory/inventory.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from './pagination/pagination.module';
const configService = new ConfigService();
const nodeEnv = configService.get('NODE_ENV');

const dbConnection =
  nodeEnv == 'test'
    ? {
        dropSchema: true,
        multipleStatements: true,
        synchronize: true,
      }
    : {
        dropSchema: false,
        multipleStatements: false,
        synchronize: false,
      };
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(configService.get('MONGODB_URL'), {
      dbName: configService.get('MONGODB_DB_NAME'),
    }),
    TypeOrmModule.forRoot({
      ...dbConnection,
      host: configService.get('DB_HOST'),
      port: Number.parseInt(configService.get('DB_PORT')),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      type: 'mysql',
      migrationsTableName: 'migrations',
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*.js'],
      migrationsRun: true,
      autoLoadEntities: true,
      maxQueryExecutionTime: 10 * 1000,
      connectorPackage: 'mysql2',
      retryDelay: 1000,
      retryAttempts: 5,
      timezone: 'Z',
      logger: 'debug',
      logging: ['error'],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    PaginationModule,
    CatalogModule,
    InventoryModule,
    OrderModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatter,
    },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}

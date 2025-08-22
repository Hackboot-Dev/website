// apps/api/src/app.module.ts
// Description: Root module of the NestJS application
// Last modified: 2025-08-15

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { InstancesModule } from './modules/instances/instances.module';
import { BillingModule } from './modules/billing/billing.module';
import { SupportModule } from './modules/support/support.module';
import { AdminModule } from './modules/admin/admin.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    InstancesModule,
    BillingModule,
    SupportModule,
    AdminModule,
    MonitoringModule,
  ],
})
export class AppModule {}
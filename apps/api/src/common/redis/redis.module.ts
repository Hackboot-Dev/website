// apps/api/src/common/redis/redis.module.ts
// Description: Redis module for caching and queues
// Last modified: 2025-08-15

import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
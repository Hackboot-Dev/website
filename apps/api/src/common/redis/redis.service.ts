// apps/api/src/common/redis/redis.service.ts
// Description: Redis service for caching operations
// Last modified: 2025-08-15

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('redis.url') || 'redis://localhost:6379';
    this.client = new Redis(redisUrl);
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
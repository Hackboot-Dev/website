// apps/api/src/database/database.module.ts
// Description: Database module with Prisma service
// Last modified: 2025-08-15

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
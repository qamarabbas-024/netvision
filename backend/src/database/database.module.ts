import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DataLifecycleService } from './data-lifecycle.service';

@Global()
@Module({
  providers: [PrismaService, DataLifecycleService],
  exports: [PrismaService, DataLifecycleService],
})
export class DatabaseModule {}


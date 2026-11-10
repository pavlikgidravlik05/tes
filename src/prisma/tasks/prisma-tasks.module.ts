import { Module } from '@nestjs/common';
import { PrismaTasksController } from './prisma-tasks.controller.js';
import { PrismaTasksService } from './prisma-tasks.service.js';

@Module({
  controllers: [PrismaTasksController],
  providers: [PrismaTasksService],
})
export class PrismaTasksModule {}

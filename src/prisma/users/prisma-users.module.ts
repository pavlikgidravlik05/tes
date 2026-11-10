import { Module } from '@nestjs/common';
import { PrismaUsersController } from './prisma-users.controller.js';
import { PrismaUsersService } from './prisma-users.service.js';

@Module({
  controllers: [PrismaUsersController],
  providers: [PrismaUsersService],
})
export class PrismaUsersModule {}

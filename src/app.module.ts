import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module.js';
import { UsersModule } from './users/users.module.js';
import { Task } from './tasks/entities/task.entity.js';
import { User } from './users/entities/user.entity.js';
import { Role } from './roles/entities/role.entity.js';
import { AuthModule } from './auth/auth.module.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { PrismaTasksModule } from './prisma/tasks/prisma-tasks.module.js';
import { PrismaUsersModule } from './prisma/users/prisma-users.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.TYPEORM_DATABASE_URL
        ? { url: process.env.TYPEORM_DATABASE_URL }
        : {
            host: process.env.POSTGRES_HOST ?? 'localhost',
            port: Number(process.env.POSTGRES_PORT ?? 5432),
            username: process.env.POSTGRES_USER ?? 'postgres',
            password: process.env.POSTGRES_PASSWORD ?? '',
            database: process.env.TYPEORM_DATABASE ?? 'nest_tasks',
          }),
      entities: [Task, User, Role],
      synchronize: true,
    }),
    TasksModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    PrismaTasksModule,
    PrismaUsersModule,
  ],
})
export class AppModule {}

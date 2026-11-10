import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaTasksService } from './prisma-tasks.service.js';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto.js';
import { UpdateTaskDto } from '../../tasks/dto/update-task.dto.js';

@Controller('prisma/tasks')
export class PrismaTasksController {
  constructor(private readonly tasksService: PrismaTasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Get('user/:userId')
  getTasksByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.tasksService.getTasksByUser(userId);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post('user/:userId')
  createTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(userId, dto);
  }

  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, dto);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}

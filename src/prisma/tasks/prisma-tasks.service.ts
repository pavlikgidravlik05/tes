import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto.js';
import { UpdateTaskDto } from '../../tasks/dto/update-task.dto.js';

@Injectable()
export class PrismaTasksService {
  constructor(private readonly prisma: PrismaService) {}

  getAllTasks() {
    return this.prisma.task.findMany({
      include: { user: true },
    });
  }

  async getTaskById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }

    return task;
  }

  async getTasksByUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    return this.prisma.task.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async createTask(userId: number, dto: CreateTaskDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        completed: dto.completed ?? false,
        user: { connect: { id: userId } },
      },
      include: { user: true },
    });
  }

  async updateTask(id: number, dto: UpdateTaskDto) {
    await this.getTaskById(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.completed !== undefined && { completed: dto.completed }),
      },
      include: { user: true },
    });
  }

  async deleteTask(id: number) {
    await this.getTaskById(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}

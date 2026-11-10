import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;

  const taskRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const userRepository = {
    findOneBy: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TasksService(taskRepository as any, userRepository as any);
  });

  it('возвращает список задач', async () => {
    const tasks = [
      { id: 1, title: 'Первая задача', completed: false },
      { id: 2, title: 'Вторая задача', completed: true },
    ];

    taskRepository.find.mockResolvedValue(tasks);

    await expect(service.getAllTasks()).resolves.toEqual(tasks);
    expect(taskRepository.find).toHaveBeenCalledWith({
      relations: { user: true },
    });
  });

  it('выбрасывает NotFoundException, если задача не найдена', async () => {
    taskRepository.findOne.mockResolvedValue(null);

    await expect(service.getTaskById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('возвращает найденную задачу', async () => {
    const task = { id: 7, title: 'Тестовая задача', completed: false };
    taskRepository.findOne.mockResolvedValue(task);

    await expect(service.getTaskById(7)).resolves.toEqual(task);
  });
});

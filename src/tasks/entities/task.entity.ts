import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

@Column({ type: 'varchar' })
title!: string;

@Column({ type: 'text', nullable: true })
description?: string;

@Column({ type: 'boolean', default: false })
completed!: boolean;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: User;
}

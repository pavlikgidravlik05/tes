import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaUsersService } from './prisma-users.service.js';
import { CreateUserDto } from '../../users/dto/create-user.dto.js';

@Controller('prisma/users')
export class PrismaUsersController {
  constructor(private readonly usersService: PrismaUsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}

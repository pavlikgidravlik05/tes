import {
  Body, Controller, Get, Post, Req, SetMetadata, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, AuthenticatedUser } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { ROLES_KEY } from './roles.constants.js';

type AuthRequest = Request & { user: AuthenticatedUser };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() request: AuthRequest) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() request: AuthRequest) {
    return request.user;
  }

  // Демонстрационный endpoint для проверки ролевого доступа.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata(ROLES_KEY, ['administrator'])
  @Get('admin')
  adminOnly() {
    return { message: 'Доступ разрешён: роль administrator подтверждена' };
  }
}

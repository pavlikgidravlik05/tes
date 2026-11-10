import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { RegisterDto } from './dto/register.dto.js';

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  roles: Role[];
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  // Создаём справочник ролей при старте приложения.
  async onModuleInit(): Promise<void> {
    for (const name of ['administrator', 'user']) {
      const exists = await this.roles.findOneBy({ name });
      if (!exists) await this.roles.save(this.roles.create({ name }));
    }
  }

  async register(dto: RegisterDto) {
    const duplicate = await this.users.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (duplicate) {
      throw new ConflictException('Пользователь с таким email или username уже существует');
    }

    const userRole = await this.roles.findOneBy({ name: 'user' });
    if (!userRole) throw new Error('Роль user не найдена');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      roles: [userRole],
    });
    const saved = await this.users.save(user);
    return {
      message: 'Пользователь успешно зарегистрирован',
      user: { id: saved.id, username: saved.username, email: saved.email, roles: ['user'] },
    };
  }

  async validateUser(email: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.email = :email', { email })
      .getOne();

    if (!user?.passwordHash) return null;
    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) return null;

    return { id: user.id, username: user.username, email: user.email, roles: user.roles ?? [] };
  }

  async login(user: AuthenticatedUser) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN ?? '1h',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      },
    };
  }

  async getUserForToken(userId: number): Promise<AuthenticatedUser> {
    const user = await this.users.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) throw new UnauthorizedException('Пользователь токена не найден');
    return { id: user.id, username: user.username, email: user.email, roles: user.roles ?? [] };
  }
}

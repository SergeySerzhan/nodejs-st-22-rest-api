import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from '../dto/login.dto';
import { UsersRepository } from '../../users/data-access/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const { login, password } = loginDto;

    const user = await this.usersRepository.findOne({ login });

    if (!user || !(await compare(password, user.password))) return;

    return this.jwtService.signAsync({ sub: user.id });
  }
}

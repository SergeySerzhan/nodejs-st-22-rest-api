import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { LoginDto } from '../dto/login.dto';
import { UsersRepository } from '../../users/data-access/users.repository';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async login(loginDto: LoginDto): Promise<string> {
    const { login, password } = loginDto;

    const user = await this.usersRepository.findOne({ login });

    if (!user || !(await compare(password, user.password))) return;

    const permissions = user.groups.reduce(
      (prev, cur) => Array.from(new Set(prev.concat(cur.permissions))),
      [],
    );

    return sign({ permissions }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';

import { CreateUserDto } from '#users/dto/create-user.dto';
import { UpdateUserDto } from '#users/dto/update-user.dto';
import { User } from '#users/models/user.model';
import { UsersRepository } from '#users/data-access/users.repository';
import { PasswordService } from '#shared/services/password.service';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUser(options: WhereOptions): Promise<User> {
    return this.usersRepository.findOne(options);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create({
      ...createUserDto,
      password: await PasswordService.hashPassword(createUserDto.password),
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto?.password)
      updateUserDto.password = await PasswordService.hashPassword(
        updateUserDto.password,
      );
    return this.usersRepository.update(id, updateUserDto);
  }

  async getAutoSuggestUsers(
    loginSubstring: string,
    limit: number,
  ): Promise<User[]> {
    return this.usersRepository.findAllByLoginSubstring({
      order: ['login', 'ASC'],
      loginSubstring,
      limit,
    });
  }

  async deleteUser(id: string): Promise<number> {
    return this.usersRepository.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { WhereOptions } from 'sequelize';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/user.model';
import { UsersRepository } from '../data-access/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUser(options: WhereOptions<any>): Promise<User> {
    return this.usersRepository.findOne(options);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create({
      ...createUserDto,
      password: await UsersService.hashPassword(createUserDto.password),
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto?.password)
      updateUserDto.password = await UsersService.hashPassword(
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

  private static async hashPassword(password): Promise<string> {
    const salt = await genSalt(+process.env.SALT_ROUNDS);
    return hash(password, salt);
  }
}

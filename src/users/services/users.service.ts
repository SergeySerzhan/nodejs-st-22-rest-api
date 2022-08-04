import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/user.model';
import { UsersRepository } from '../data-access/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUser(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const [, updatedUsers] = await this.usersRepository.update(
      id,
      updateUserDto,
    );
    return updatedUsers[0];
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

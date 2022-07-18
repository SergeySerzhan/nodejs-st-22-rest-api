import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';

import { User } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user-dto';
import { UpdateUserDto } from '../dto/update-user-dto';

import { getSortFuncObjByStringKey } from '../utils/sort';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async getUser(id: string): Promise<User> {
    const user = this.users
      .filter((user) => !user.isDeleted)
      .find((user) => user.id === id);
    if (!user) throw new NotFoundException('User with this id not found');
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = { ...createUserDto, id: v4(), isDeleted: false };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUser(id);
    const userIndex = this.users.findIndex((user) => user.id === id);
    const newUser = { ...user, ...updateUserDto };
    this.users[userIndex] = newUser;
    return newUser;
  }

  async getAutoSuggestUsers(
    loginSubstring: string,
    limit: number,
  ): Promise<User[]> {
    return this.users
      .filter(
        (user) =>
          !user.isDeleted &&
          user.login.toLowerCase().includes(loginSubstring.toLowerCase()),
      )
      .sort(getSortFuncObjByStringKey('login'))
      .slice(0, limit);
  }

  async deleteUser(id: string): Promise<void> {
    (await this.getUser(id)).isDeleted = true;
  }
}

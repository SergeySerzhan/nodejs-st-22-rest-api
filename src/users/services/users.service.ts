import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 } from 'uuid';

import { CreateUserDto } from '../dto/create-user-dto';
import { UpdateUserDto } from '../dto/update-user-dto';

import { getSortFuncObjByStringKey } from '../utils/sort';
import { UserEntity } from '../entities/user-entity';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  private isLoginUnique(login: string): boolean {
    return !this.users.find((user) => user.login === login);
  }

  async getUser(id: string): Promise<UserEntity> {
    const user = this.users
      .filter((user) => !user.isDeleted)
      .find((user) => user.id === id);
    if (!user) throw new NotFoundException('User with this id not found');
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (!this.isLoginUnique(createUserDto.login))
      throw new BadRequestException('User with this login already exist');
    const newUser = { ...createUserDto, id: v4(), isDeleted: false };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUser(id);
    const userIndex = this.users.findIndex((user) => user.id === id);
    const newUser = { ...user, ...updateUserDto };
    this.users[userIndex] = newUser;
    return newUser;
  }

  async getAutoSuggestUsers(
    loginSubstring: string,
    limit: number,
  ): Promise<UserEntity[]> {
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

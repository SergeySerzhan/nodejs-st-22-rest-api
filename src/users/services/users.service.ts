import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { getSortFuncObjByStringKey } from '../utils/sort';
import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getUser(id: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return (
      await this.userModel.create({ ...createUserDto, id: v4() })
    ).toJSON();
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const [, updatedUsers] = await this.userModel.update(updateUserDto, {
      where: {
        id: id,
        isDeleted: false
      },
      returning: true
    });

    return updatedUsers[0];
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

import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getUser(id: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return (
      await this.userModel.create({ ...createUserDto, id: v4() })
    ).toJSON();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const [, updatedUsers] = await this.userModel.update(updateUserDto, {
      where: {
        id,
        isDeleted: false,
      },
      returning: true,
    });

    return updatedUsers[0];
  }

  async getAutoSuggestUsers(
    loginSubstring: string,
    limit: number,
  ): Promise<User[]> {
    return this.userModel.findAll({
      order: [['login', 'ASC']],
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
        isDeleted: false,
      },
      limit
    });
  }

  async deleteUser(id: string): Promise<number> {
    const [numberOfUpdatedUsers] = await this.userModel.update({isDeleted: true}, {
      where: {
        id,
        isDeleted: false
      }
    });

    return numberOfUpdatedUsers;
  }
}

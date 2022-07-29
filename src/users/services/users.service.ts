import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/user.model';

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
    return (await this.userModel.create({ ...createUserDto })).toJSON();
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
      limit,
    });
  }

  async deleteUser(id: string): Promise<User> {
    const [, updatedUsers] = await this.userModel.update(
      { isDeleted: true },
      {
        where: {
          id,
          isDeleted: false,
        },
        returning: true,
      },
    );

    return updatedUsers[0];
  }
}

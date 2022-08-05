import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Group } from '../../groups/models/group.model';

type Order = [columnName: string, direction: 'ASC' | 'DESC'];

interface FindAllOptions {
  order: Order;
  loginSubstring: string;
  limit: number;
}

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findOne(id: string): Promise<User> {
    return (
      await this.userModel.findOne({
        where: {
          id,
          isDeleted: false,
        },
        include: [{ model: Group, through: { attributes: [] } }],
      })
    ).toJSON();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return (await this.userModel.create({ ...createUserDto })).toJSON();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[affectedCount: number, affectedRows: User[]]> {
    return this.userModel.update(updateUserDto, {
      where: {
        id,
        isDeleted: false,
      },
      returning: true,
    });
  }

  async findAllByLoginSubstring(options: FindAllOptions): Promise<User[]> {
    let findWhereOptions = {};

    const { order, loginSubstring, limit } = options;

    if (loginSubstring)
      findWhereOptions = {
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
      };

    return (
      await this.userModel.findAll({
        order: [order],
        where: {
          ...findWhereOptions,
          isDeleted: false,
        },
        include: [{ model: Group, through: { attributes: [] } }],
        limit,
      })
    ).map((user) => user.toJSON());
  }

  async delete(id: string): Promise<number> {
    const [numOfDeletedUsers] = await this.userModel.update(
      { isDeleted: true },
      {
        where: {
          id,
          isDeleted: false,
        },
      },
    );

    return numOfDeletedUsers;
  }
}

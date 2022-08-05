import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Group } from '../models/group.model';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { User } from '../../users/models/user.model';

@Injectable()
export class GroupsRepository {
  constructor(@InjectModel(Group) private groupModel: typeof Group) {}

  async findByPk(id: string): Promise<Group> {
    return (
      await this.groupModel.findByPk(id, {
        include: [{ model: User, through: { attributes: [] } }],
      })
    ).toJSON();
  }

  async findAll(): Promise<Group[]> {
    return (
      await this.groupModel.findAll({
        include: [{ model: User, through: { attributes: [] } }],
      })
    ).map((group) => group.toJSON());
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return (await this.groupModel.create({ ...createGroupDto })).toJSON();
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const [, updatedGroups] = await this.groupModel.update(updateGroupDto, {
      where: {
        id,
      },
      returning: true,
    });
    return updatedGroups[0];
  }

  async delete(id: string): Promise<number> {
    return this.groupModel.destroy({ where: { id } });
  }
}

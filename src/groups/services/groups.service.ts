import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Group } from '../models/group.model';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group) private groupModel: typeof Group) {}

  async getGroup(id: string): Promise<Group> {
    return await this.groupModel.findByPk(id);
  }

  async getAllGroups(): Promise<Group[]> {
    return await this.groupModel.findAll();
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    return (await this.groupModel.create({ ...createGroupDto })).toJSON();
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const [, updatedGroups] = await this.groupModel.update(updateGroupDto, {
      where: {
        id,
      },
      returning: true,
    });
    return updatedGroups[0];
  }

  async deleteGroup(id: string): Promise<number> {
    return await this.groupModel.destroy({ where: { id } });
  }
}

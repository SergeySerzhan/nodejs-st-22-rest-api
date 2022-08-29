import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Group } from '#groups/models/group.model';
import { CreateGroupDto } from '#groups/dto/create-group.dto';
import { UpdateGroupDto } from '#groups/dto/update-group.dto';
import { User } from '#users/models/user.model';

@Injectable()
export class GroupsRepository {
  constructor(
    @InjectModel(Group) private groupModel: typeof Group,
    private sequelize: Sequelize,
  ) {}

  async findByPk(id: string): Promise<Group> {
    const group = await this.groupModel.findByPk(id, {
      include: [
        {
          model: User,
          required: false,
          where: {
            isDeleted: false,
          },
          through: { attributes: [] },
        },
      ],
    });
    return group ? group.toJSON() : group;
  }

  async findAll(): Promise<Group[]> {
    return (
      await this.groupModel.findAll({
        include: [
          {
            model: User,
            required: false,
            where: { isDeleted: false },
            through: { attributes: [] },
          },
        ],
      })
    ).map((group) => group.toJSON());
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = await this.groupModel.create({ ...createGroupDto });
    return group ? group.toJSON() : group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const [, updatedGroups] = await this.groupModel.update(updateGroupDto, {
      where: {
        id,
      },
      returning: true,
    });
    return updatedGroups[0] ? updatedGroups[0].toJSON() : updatedGroups[0];
  }

  async delete(id: string): Promise<number> {
    return this.groupModel.destroy({ where: { id } });
  }

  async addUsersToGroup(groupId: string, userIds: string[]): Promise<Group> {
    const group = await this.groupModel.findByPk(groupId);
    if (!group) return group;

    await this.sequelize.transaction(async (t) => {
      await group.$add('users', userIds, { transaction: t });
    });

    return this.findByPk(groupId);
  }
}

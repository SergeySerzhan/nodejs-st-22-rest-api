import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Group } from '../models/group.model';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { User } from '../../users/models/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class GroupsRepository {
  constructor(
    @InjectModel(Group) private groupModel: typeof Group,
    private sequelize: Sequelize,
    @InjectModel(User) private userModel: typeof User,
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
    await this.sequelize.transaction(async (t) => {
      const group = await this.groupModel.findByPk(groupId, {
        transaction: t,
      });

      if (!group) return group;

      const users = await Promise.all(
        userIds.map(
          async (userId) =>
            await this.userModel.findOne({
              where: { id: userId, isDeleted: false },
              rejectOnEmpty: true,
              transaction: t,
            }),
        ),
      );

      await group.$add('users', users, { transaction: t });
    });

    return (
      await this.groupModel.findByPk(groupId, {
        include: [
          {
            model: User,
            required: false,
            through: { attributes: [] },
            where: { isDeleted: false },
          },
        ],
      })
    ).toJSON();
  }
}

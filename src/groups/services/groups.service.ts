import { Injectable } from '@nestjs/common';

import { Group } from '../models/group.model';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { GroupsRepository } from '../data-access/groups.repository';

@Injectable()
export class GroupsService {
  constructor(private groupsRepository: GroupsRepository) {}

  async getGroup(id: string): Promise<Group> {
    return this.groupsRepository.findByPk(id);
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupsRepository.findAll();
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsRepository.create({ ...createGroupDto });
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.groupsRepository.update(id, updateGroupDto);
  }

  async deleteGroup(id: string): Promise<number> {
    return this.groupsRepository.delete(id);
  }
}

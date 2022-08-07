import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { GroupsService } from './services/groups.service';
import { Group } from './models/group.model';
import { checkData } from '../utils/check-data';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UserEntity } from '../users/entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v1/groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get(':id')
  async getGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Group> {
    const group = await this.groupsService.getGroup(id);

    checkData(group, { entityName: 'group' });

    group.users = group.users.map((user) => new UserEntity(user));
    return group;
  }

  @Get()
  async getAllGroups(): Promise<Group[]> {
    const groups = await this.groupsService.getAllGroups();
    groups.map((group) => {
      group.users = group.users.map((user) => new UserEntity(user));
      return group;
    });
    return groups;
  }

  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupsService.createGroup(createGroupDto);
  }

  @Put(':id')
  async updateGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return await this.groupsService.updateGroup(id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    checkData(await this.groupsService.deleteGroup(id), {
      entityName: 'group',
    });
  }
}

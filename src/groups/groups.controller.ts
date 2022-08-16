import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { GroupsService } from './services/groups.service';
import { checkData } from '../utils/check-data';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddUsersToGroupDto } from './dto/add-users-to-group.dto';
import { plainToClass } from 'class-transformer';
import { GroupEntity } from './entities/group.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'groups', version: '1' })
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get(':id')
  async getGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.getGroup(id);

    checkData(group, { entityName: 'group' });

    return plainToClass(GroupEntity, group);
  }

  @Get()
  async getAllGroups(): Promise<GroupEntity[]> {
    const groups = await this.groupsService.getAllGroups();

    return groups.map((group) => plainToClass(GroupEntity, group));
  }

  @Post()
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.createGroup(createGroupDto);

    return plainToClass(GroupEntity, group);
  }

  @Put(':id')
  async updateGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.updateGroup(id, updateGroupDto);

    return plainToClass(GroupEntity, group);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    checkData(await this.groupsService.deleteGroup(id), {
      entityName: 'group',
    });
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async addUsersToGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() addUsersToGroupDto: AddUsersToGroupDto,
  ): Promise<GroupEntity> {
    const { userIds } = addUsersToGroupDto;

    const group = await this.groupsService.addUsersToGroup(id, userIds);

    checkData(group, { entityName: 'group' });

    return plainToClass(GroupEntity, group);
  }
}

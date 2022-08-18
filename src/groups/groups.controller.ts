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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { GroupsService } from './services/groups.service';
import { checkData } from '../utils/check-data';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddUsersToGroupDto } from './dto/add-users-to-group.dto';
import { plainToClass } from 'class-transformer';
import { GroupEntity } from './entities/group.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permissions } from '../shared/decorators/permissions.decorator';
import { GroupPermissions } from './utils/group-permissions';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'groups', version: '1' })
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get(':id')
  @Permissions(GroupPermissions.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  async getGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.getGroup(id);

    checkData(group, { entityName: 'group' });

    return plainToClass(GroupEntity, group);
  }

  @Get()
  @Permissions(GroupPermissions.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  async getAllGroups(): Promise<GroupEntity[]> {
    const groups = await this.groupsService.getAllGroups();

    return groups.map((group) => plainToClass(GroupEntity, group));
  }

  @Post()
  @Permissions(GroupPermissions.write)
  @UseGuards(AuthGuard, PermissionsGuard)
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.createGroup(createGroupDto);

    return plainToClass(GroupEntity, group);
  }

  @Put(':id')
  @Permissions(GroupPermissions.write)
  @UseGuards(AuthGuard)
  async updateGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.updateGroup(id, updateGroupDto);

    return plainToClass(GroupEntity, group);
  }

  @Delete(':id')
  @Permissions(GroupPermissions.delete)
  @UseGuards(AuthGuard, PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    checkData(await this.groupsService.deleteGroup(id), {
      entityName: 'group',
    });
  }

  @Post(':id')
  @UseGuards(AuthGuard)
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

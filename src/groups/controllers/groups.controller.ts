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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GroupsService } from '#groups/services/groups.service';
import { checkData } from '#shared/utils/check-data';
import { CreateGroupDto } from '#groups/dto/create-group.dto';
import { UpdateGroupDto } from '#groups/dto/update-group.dto';
import { AddUsersToGroupDto } from '#groups/dto/add-users-to-group.dto';
import { plainToClass } from 'class-transformer';
import { GroupEntity } from '#groups/entities/group.entity';
import { AuthGuard } from '#auth/guards/auth.guard';
import { Permissions } from '#shared/decorators/permissions.decorator';
import { GroupPermissions } from '#groups/utils/group-permissions';
import { PermissionsGuard } from '#auth/guards/permissions.guard';
import { ErrorMsgs } from '#shared/utils/error-msgs';

@ApiTags('groups')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller({ path: 'groups', version: '1' })
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get(':id')
  @Permissions(GroupPermissions.read)
  @UseGuards(PermissionsGuard)
  async getGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.getGroup(id);

    checkData(group, { errMsg: ErrorMsgs.GroupNotFound });

    return plainToClass(GroupEntity, group);
  }

  @Get()
  @Permissions(GroupPermissions.read)
  @UseGuards(PermissionsGuard)
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
  @Permissions(GroupPermissions.write)
  @UseGuards(PermissionsGuard)
  async updateGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    const group = await this.groupsService.updateGroup(id, updateGroupDto);

    checkData(group, { errMsg: ErrorMsgs.GroupNotFound });

    return plainToClass(GroupEntity, group);
  }

  @Delete(':id')
  @Permissions(GroupPermissions.delete)
  @UseGuards(PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    checkData(await this.groupsService.deleteGroup(id), {
      errMsg: ErrorMsgs.GroupNotFound,
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

    checkData(group, { errMsg: ErrorMsgs.GroupNotFound });

    return plainToClass(GroupEntity, group);
  }
}

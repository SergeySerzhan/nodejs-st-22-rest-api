import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from '#users/services/users.service';
import { CreateUserDto } from '#users/dto/create-user.dto';
import { UpdateUserDto } from '#users/dto/update-user.dto';
import { UserEntity } from '#users/entities/user.entity';
import { checkData } from '#shared/utils/check-data';
import { AuthGuard } from '#auth/guards/auth.guard';
import { Permissions } from '#shared/decorators/permissions.decorator';
import { GroupPermissions } from '#groups/utils/group-permissions';
import { PermissionsGuard } from '#auth/guards/permissions.guard';
import { ErrorMsgs } from '#shared/utils/error-msgs';

@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @Permissions(GroupPermissions.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  async getUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.getUser({ id });

    checkData(user, { errMsg: ErrorMsgs.UserNotFound });

    return new UserEntity(user);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return new UserEntity(await this.usersService.createUser(createUserDto));
  }

  @Put(':id')
  @Permissions(GroupPermissions.write)
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.updateUser(id, updateUserDto);

    checkData(user, { errMsg: ErrorMsgs.UserNotFound });

    return new UserEntity(user);
  }

  @Get()
  @Permissions(GroupPermissions.read)
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  async getAutoSuggestUsers(
    @Query('search') loginSubstring: string,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ): Promise<UserEntity[]> {
    return (
      await this.usersService.getAutoSuggestUsers(loginSubstring, limit)
    ).map((user) => new UserEntity(user));
  }

  @Delete(':id')
  @Permissions(GroupPermissions.delete)
  @UseGuards(AuthGuard, PermissionsGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const numOfDeletedUser = await this.usersService.deleteUser(id);

    checkData(numOfDeletedUser, { errMsg: ErrorMsgs.UserNotFound });
  }
}

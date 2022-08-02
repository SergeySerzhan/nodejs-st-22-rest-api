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
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { checkData } from '../utils/check-data';
import { handleError } from '../utils/handle-error';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserEntity> {
    try {
      const user = await this.usersService.getUser(id);

      checkData(user, {entityName: 'user'});

      return new UserEntity(user);
    } catch (e) {
      handleError(e);
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      return new UserEntity(await this.usersService.createUser(createUserDto));
    } catch (e) {
      handleError(e);
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      const user = await this.usersService.updateUser(id, updateUserDto);

      checkData(user, {entityName: 'user'});

      return new UserEntity(user);
    } catch (e) {
      handleError(e);
    }
  }

  @Get()
  async getAutoSuggestUsers(
    @Query('search') loginSubstring: string,
    @Query('limit') limit: number,
  ): Promise<UserEntity[]> {
    try {
      return (
          await this.usersService.getAutoSuggestUsers(loginSubstring, limit)
      ).map((user) => new UserEntity(user));
    } catch (e) {
      handleError(e);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    try {
      const deletedUser = await this.usersService.deleteUser(id);

      checkData(deletedUser, {entityName: 'user'});
    } catch (e) {
      handleError(e);
    }
  }
}

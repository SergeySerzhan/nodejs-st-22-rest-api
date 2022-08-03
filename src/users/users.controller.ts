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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.getUser(id);

    checkData(user, { entityName: 'user' });

    return new UserEntity(user);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return new UserEntity(await this.usersService.createUser(createUserDto));
  }

  @Put(':id')
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.updateUser(id, updateUserDto);

    checkData(user, { entityName: 'user' });

    return new UserEntity(user);
  }

  @Get()
  async getAutoSuggestUsers(
    @Query('search') loginSubstring: string,
    @Query('limit') limit: number,
  ): Promise<UserEntity[]> {
    return (
      await this.usersService.getAutoSuggestUsers(loginSubstring, limit)
    ).map((user) => new UserEntity(user));
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const numOfDeletedUser = await this.usersService.deleteUser(id);

    checkData(numOfDeletedUser, { entityName: 'user' });
  }
}

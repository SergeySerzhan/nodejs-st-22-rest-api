import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { User } from './models/user.model';
import { UsersRepository } from './data-access/users.repository';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [SequelizeModule],
})
export class UsersModule {}

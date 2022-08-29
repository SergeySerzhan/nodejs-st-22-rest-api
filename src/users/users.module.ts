import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersController } from '#users/controllers/users.controller';
import { UsersService } from '#users/services/users.service';
import { User } from '#users/models/user.model';
import { UsersRepository } from '#users/data-access/users.repository';
import { AuthModule } from '#auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [SequelizeModule, UsersRepository],
})
export class UsersModule {}

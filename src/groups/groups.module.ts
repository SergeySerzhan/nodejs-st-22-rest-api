import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Group } from '#groups/models/group.model';
import { GroupsService } from '#groups/services/groups.service';
import { GroupsController } from '#groups/controllers/groups.controller';
import { GroupsRepository } from '#groups/data-access/groups.repository';
import { UsersModule } from '#users/users.module';
import { AuthModule } from '#auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Group]), UsersModule, AuthModule],
  providers: [GroupsService, GroupsRepository],
  controllers: [GroupsController],
})
export class GroupsModule {}

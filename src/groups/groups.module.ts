import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Group } from './models/group.model';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from './data-access/groups.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Group]), UsersModule],
  providers: [GroupsService, GroupsRepository],
  controllers: [GroupsController],
})
export class GroupsModule {}

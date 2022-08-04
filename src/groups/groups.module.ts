import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Group } from './models/group.model';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from './data-access/groups.repository';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  providers: [GroupsService, GroupsRepository],
  controllers: [GroupsController],
})
export class GroupsModule {}

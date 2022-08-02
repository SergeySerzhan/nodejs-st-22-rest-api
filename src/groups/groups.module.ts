import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Group } from './models/group.model';
import { GroupsService } from './services/groups.service';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  providers: [GroupsService],
})
export class GroupsModule {}

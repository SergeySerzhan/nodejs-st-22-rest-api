import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Group } from './models/group.model';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './groups.controller';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}

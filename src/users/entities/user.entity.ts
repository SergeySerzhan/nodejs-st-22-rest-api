import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

import { GroupEntity } from '#groups/entities/group.entity';

export class UserEntity {
  id: string;

  login: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  age: number;

  @ApiHideProperty()
  @Exclude()
  isDeleted: boolean;

  groups?: GroupEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
